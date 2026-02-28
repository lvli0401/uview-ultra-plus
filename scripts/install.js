const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Direct Dynamic Self-Extraction Preinstall script for uview-ultra-plus.
 * Extracts everything listed in package.json "files" from its own NPM tarball into uni_modules.
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
    let filesToExtract = [];
    
    try {
        const pkgData = JSON.parse(fs.readFileSync(pkgPath_self, 'utf8'));
        version = pkgData.version;
        filesToExtract = pkgData.files || [];
    } catch (e) {
        console.error('[uview-ultra-plus] CRITICAL: Could not read package.json.');
        process.exit(1);
    }

    if (filesToExtract.length === 0) {
        console.warn('[uview-ultra-plus] No files defined in package.json "files" field. Nothing to extract.');
        return;
    }

    const registry = 'https://registry.npmjs.org';
    const pkgName = 'uview-ultra-plus';
    const downloadUrl = `${registry}/${pkgName}/-/${pkgName}-${version}.tgz`;

    console.log(`[uview-ultra-plus] Dynamic preinstall started. Version: ${version}`);
    console.log(`[uview-ultra-plus] Extracting: ${filesToExtract.join(', ')}`);

    try {
        if (!fs.existsSync(targetBaseDir)) {
            fs.mkdirSync(targetBaseDir, { recursive: true });
        }

        // Map to internal NPM tarball paths (always starts with "package/")
        const tarPaths = filesToExtract.map(f => `"package/${f}"`).join(' ');

        try {
            // Use --strip-components=1 to remove the "package/" prefix.
            // This places the items listed in "files" directly into targetBaseDir (uni_modules).
            execSync(`set -o pipefail; curl -fL ${downloadUrl} | tar -xz -C "${targetBaseDir}" --strip-components=1 ${tarPaths}`, {
                stdio: 'inherit',
                shell: '/bin/bash'
            });
            console.log(`[uview-ultra-plus] Successfully extracted all files to ${targetBaseDir}.`);
        } catch (innerErr) {
            console.error(`[uview-ultra-plus] Failed to extract files from ${pkgName}@${version}.`);
            console.log(`[uview-ultra-plus] Ensure version ${version} is published to NPM.`);
            throw innerErr;
        }

        console.log('[uview-ultra-plus] Dynamic preinstall hook finished.');
    } catch (err) {
        console.error('[uview-ultra-plus] CRITICAL: Installation failed.');
        process.exit(1);
    }
}

install();
