const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const distPath = path.join(projectRoot, 'dist/uview-ultra');

/**
 * Copy source code from packages to dist
 */
function syncSourceToDist() {
    console.log('[Sync] Copying packages/uview-ultra to dist/uview-ultra...');
    const uviewSrc = path.join(projectRoot, 'packages/uview-ultra');
    
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
    }
    
    try {
        execSync(`rsync -aq --exclude='node_modules' --exclude='uts-libs' "${uviewSrc}/" "${distPath}/"`);
    } catch (e) {
        console.error(`[Sync] Failed to sync source to dist: ${e.message}`);
    }
}

/**
 * Synchronize from dist to examples for local testing
 */
function syncExamples() {
    console.log('[Sync] Syncing dist/uview-ultra to examples...');
    const exampleTargets = [
        path.join(projectRoot, 'examples/uniapp/src/uni_modules/uview-ultra'),
        path.join(projectRoot, 'examples/uniapp-x/uni_modules/uview-ultra')
    ];

    if (!fs.existsSync(distPath)) {
        console.warn('[Sync] Dist directory not found. Please run build first.');
        return;
    }

    exampleTargets.forEach(target => {
        if (fs.existsSync(path.dirname(target))) {
            console.log(`[Sync] Syncing to ${path.relative(projectRoot, target)}...`);
            if (fs.existsSync(target)) {
                fs.rmSync(target, { recursive: true, force: true });
            }
            try {
                execSync(`rsync -aq --exclude='node_modules' "${distPath}/" "${target}/"`);
            } catch (e) {
                console.error(`[Sync] Failed to sync to ${target}: ${e.message}`);
            }
        }
    });
}

module.exports = { syncSourceToDist, syncExamples };
