const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Extreme No-Trace Self-Extraction Preinstall script for uview-ultra-plus.
 * Extracts components from NPM tarball, excludes installer scripts,
 * and deletes itself entirely from node_modules after completion.
 */

function install() {
    const projectRoot = process.env.INIT_CWD || process.cwd();
    
    // Determine target uni_modules path: check for 'src' folder
    const srcPath = path.join(projectRoot, 'src');
    const targetBaseDir = fs.existsSync(srcPath) 
        ? path.join(srcPath, 'uni_modules') 
        : path.join(projectRoot, 'uni_modules');

    // 1. Get info from own package.json
    const pkgPath_self = path.join(__dirname, '..', 'package.json');
    let version;
    let filesToExtractRaw = [];
    
    try {
        const pkgData = JSON.parse(fs.readFileSync(pkgPath_self, 'utf8'));
        version = pkgData.version;
        filesToExtractRaw = pkgData.files || [];
    } catch (e) {
        console.error('[uview-ultra-plus] CRITICAL: Could not read package.json.');
        process.exit(1);
    }

    // Filter out 'scripts' and other installer-only items from extraction
    const filesToExtract = filesToExtractRaw.filter(f => f !== 'scripts' && f !== 'package.json');

    if (filesToExtract.length === 0) {
        console.warn('[uview-ultra-plus] No components defined to extract. Finishing.');
        cleanup();
        return;
    }

    const registry = 'https://registry.npmjs.org';
    const pkgName = 'uview-ultra-plus';
    const downloadUrl = `${registry}/${pkgName}/-/${pkgName}-${version}.tgz`;

    console.log(`[uview-ultra-plus] Extreme preinstall started. Version: ${version}`);

    try {
        if (!fs.existsSync(targetBaseDir)) {
            fs.mkdirSync(targetBaseDir, { recursive: true });
        }

        // Map to internal NPM tarball paths (always starts with "package/")
        const tarPaths = filesToExtract.map(f => `"package/${f}"`).join(' ');

        try {
            // Use --strip-components=1 to remove the "package/" prefix.
            execSync(`set -o pipefail; curl -fL ${downloadUrl} | tar -xz -C "${targetBaseDir}" --strip-components=1 ${tarPaths}`, {
                stdio: 'inherit',
                shell: '/bin/bash'
            });
            console.log(`[uview-ultra-plus] Successfully installed components to ${targetBaseDir}.`);
        } catch (innerErr) {
            console.error(`[uview-ultra-plus] Failed to extract from ${pkgName}@${version}.`);
            console.log(`[uview-ultra-plus] Ensure version ${version} is published to NPM.`);
            throw innerErr;
        }

        console.log('[uview-ultra-plus] Installation successful. Finalizing cleanup...');
        cleanup();
        console.log('[uview-ultra-plus] No-trace preinstall hook finished.');
    } catch (err) {
        console.error('[uview-ultra-plus] CRITICAL: Installation failed.');
        process.exit(1);
    }

    function cleanup() {
        try {
            // Determine the package directory (uview-ultra-plus in node_modules)
            const packageDir = path.resolve(__dirname, '..');
            
            // Safety check: Only delete if we are inside a node_modules directory
            if (packageDir.includes('node_modules')) {
                // Delete the ENTIRE package directory to leave no trace in node_modules
                fs.rmSync(packageDir, { recursive: true, force: true });
                console.log('[uview-ultra-plus] Successfully removed installer from node_modules.');
            } else {
                console.log('[uview-ultra-plus] Development environment detected. Skipping self-deletion.');
            }
        } catch (cleanupErr) {
            console.warn('[uview-ultra-plus] Warning: Failed to clean up installer traces.');
        }
    }
}

install();
