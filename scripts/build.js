const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Build script for uview-ultra-plus
 * 1. Clean dist folder
 * 2. Copy uview-ultra and lime-dayuts to dist
 * 3. Run rollup to bundle vendors into dist/uview-ultra/vendor
 * 4. Run patch-imports.js on dist/uview-ultra
 */

const projectRoot = path.resolve(__dirname, '..');
const distPath = path.join(projectRoot, 'dist');

function clean() {
    console.log('[Build] Cleaning dist...');
    if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true, force: true });
    }
    fs.mkdirSync(distPath, { recursive: true });
}

function copySource() {
    console.log('[Build] Copying source to dist (excluding node_modules)...');
    
    // Main components
    const uviewSrc = path.join(projectRoot, 'src/uview-ultra');
    const uviewDest = path.join(distPath, 'uview-ultra');
    
    if (fs.existsSync(uviewSrc)) {
        execSync(`rsync -aq --exclude='node_modules' --exclude='uts-libs' "${uviewSrc}/" "${uviewDest}/"`);
    }

    // lime-dayuts (moved to src/uview-ultra/uts-libs/lime-dayuts)
    const limeSrc = path.join(projectRoot, 'src/uview-ultra/uts-libs/lime-dayuts');
    const limeDest = path.join(distPath, 'lime-dayuts');
    if (fs.existsSync(limeSrc)) {
        if (!fs.existsSync(limeDest)) fs.mkdirSync(limeDest, { recursive: true });
        execSync(`rsync -aq --exclude='node_modules' "${limeSrc}/" "${limeDest}/"`);
    }

    // Other core files
    const otherFiles = ['scripts', 'index.js', 'index.d.ts', 'theme.scss', 'package.json'];
    otherFiles.forEach(file => {
        const srcPath = path.join(projectRoot, file);
        if (fs.existsSync(srcPath)) {
            execSync(`rsync -aq --exclude='node_modules' "${srcPath}" "${distPath}/"`);
        }
    });
}

function copyRecursiveSync(src, dest) {
    if (src.includes('node_modules')) return;
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

function runRollup() {
    console.log('[Build] Running Rollup for vendors...');
    execSync('npm run rollup', { stdio: 'inherit', cwd: projectRoot });
}

function patchImports() {
    console.log('[Build] Patching imports in dist...');
    require('./patch-imports.js');
}

try {
    clean();
    copySource();
    runRollup();
    patchImports();
    console.log('[Build] Successfully completed!');
} catch (err) {
    console.error('[Build] Failed:', err.message);
    process.exit(1);
}
