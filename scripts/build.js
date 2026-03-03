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
    try {
        if (fs.existsSync(distPath)) {
            execSync(`rm -rf "${distPath}"`);
        }
        fs.mkdirSync(distPath, { recursive: true });
    } catch (e) {
        console.warn(`[Build] Clean warning: ${e.message}. Retrying...`);
        // Maybe try one more time or just continue if mkdirSync succeeds
        if (!fs.existsSync(distPath)) fs.mkdirSync(distPath, { recursive: true });
    }
}

function copySource() {
    console.log('[Build] Copying other core files to dist...');
    
    // lime-dayuts (moved to packages/uview-ultra/uts-libs/lime-dayuts)
    const limeSrc = path.join(projectRoot, 'packages/uview-ultra/uts-libs/lime-dayuts');
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

function runRollup() {
    console.log('[Build] Running Rollup for vendors...');
    execSync('npm run rollup', { stdio: 'inherit', cwd: projectRoot });
}

function patchImports() {
    console.log('[Build] Patching imports in dist...');
    require('./patch-imports.js');
}

const chokidar = require('chokidar');
const { syncSourceToDist, syncExamples } = require('./sync-logic.js');

function fullBuild() {
    clean();
    syncSourceToDist(); // Sync from packages/uview-ultra to dist/uview-ultra
    
    // Copy other core files to dist
    copySource(); 
    
    runRollup();
    patchImports();
    syncExamples(); // Sync from dist/uview-ultra to examples
    console.log('[Build] Successfully completed!');
}

/**
 * Watch mode logic
 */
function watch() {
    const watchPath = path.join(projectRoot, 'packages/uview-ultra');
    console.log(`[Watch] Starting watcher on ${watchPath}...`);

    const watcher = chokidar.watch(watchPath, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        ignoreInitial: true
    });

    let timer = null;
    const debounceSync = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            console.log('[Watch] Changes detected, rebuilding...');
            try {
                // For watch mode, we only need to sync source, patch, and sync examples
                // Rollup (vendor) usually doesn't need to re-run unless dependencies change
                syncSourceToDist();
                patchImports();
                syncExamples();
                console.log('[Watch] Sync completed. Waiting for changes...');
            } catch (e) {
                console.error(`[Watch] Sync failed: ${e.message}`);
            }
        }, 300);
    };

    watcher
        .on('all', (event, path) => {
            console.log(`[Watch] Event ${event} on ${path}`);
            debounceSync();
        })
        .on('error', error => console.log(`[Watch] Watcher error: ${error}`));
}

const isWatchMode = process.argv.includes('--watch') || process.argv.includes('-w');

try {
    fullBuild();
    if (isWatchMode) {
        watch();
    }
} catch (err) {
    console.error('[Build] Failed:', err.message);
    process.exit(1);
}
