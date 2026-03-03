const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const uviewSrc = path.join(projectRoot, 'src/uview-ultra');

const exampleTargets = [
    path.join(projectRoot, 'examples/uniapp/src/uni_modules/uview-ultra'),
    path.join(projectRoot, 'examples/uniapp-x/uni_modules/uview-ultra')
];

function syncExamples() {
    console.log('[Build:Example] Syncing source to examples...');
    
    exampleTargets.forEach(target => {
        if (fs.existsSync(path.dirname(target))) {
            console.log(`[Build:Example] Syncing to ${path.relative(projectRoot, target)}...`);
            if (fs.existsSync(target)) {
                fs.rmSync(target, { recursive: true, force: true });
            }
            // Use rsync for efficient copying and exclusion of node_modules
            execSync(`rsync -aq --exclude='node_modules' "${uviewSrc}/" "${target}/"`);
        } else {
            console.warn(`[Build:Example] Target directory not found: ${path.dirname(target)}`);
        }
    });
    
    console.log('[Build:Example] Sync complete!');
}

try {
    syncExamples();
} catch (err) {
    console.error('[Build:Example] Failed:', err.message);
    process.exit(1);
}
