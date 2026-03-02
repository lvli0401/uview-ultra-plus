#!/usr/bin/env node
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
    // It could be in '..' (dev) or '../..' (production /dist/scripts/)
    let pkgPath_self = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(pkgPath_self)) {
        pkgPath_self = path.join(__dirname, '../..', 'package.json');
    }

    let version;
    let filesToExtractRaw = [];
    
    try {
        const pkgData = JSON.parse(fs.readFileSync(pkgPath_self, 'utf8'));
        version = pkgData.version;
        
        // Dynamically find items in the distribution folder
        const distDir = path.dirname(pkgPath_self);
        const excludes = ['scripts', 'package.json', 'index.js', 'index.d.ts', 'theme.scss', 'node_modules', 'dist'];
        
        filesToExtractRaw = fs.readdirSync(distDir).filter(item => {
            // We want to extract folders/files that are NOT in the exclude list
            return !excludes.includes(item);
        });

        if (filesToExtractRaw.length === 0) {
            console.warn('[uview-ultra-plus] No components detected to extract.');
        } else {
            console.log(`[uview-ultra-plus] Detected modules for extraction: ${filesToExtractRaw.join(', ')}`);
        }
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

        // Clean up existing components to ensure a fresh install
        filesToExtract.forEach(file => {
            const existingPath = path.join(targetBaseDir, file);
            if (fs.existsSync(existingPath)) {
                console.log(`[uview-ultra-plus] Cleaning up existing ${file}...`);
                fs.rmSync(existingPath, { recursive: true, force: true });
            }
        });

        // Map to internal NPM tarball paths (always starts with "package/dist/")
        const tarPaths = filesToExtract.map(f => `"package/dist/${f}"`).join(' ');

        try {
            // Use --strip-components=2 to remove "package/dist/" prefix.
            execSync(`set -o pipefail; curl -fL ${downloadUrl} | tar -xz -C "${targetBaseDir}" --strip-components=2 ${tarPaths}`, {
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
        console.log('[uview-ultra-plus] No-trace installer finished.');
    } catch (err) {
        console.error('[uview-ultra-plus] CRITICAL: Installation failed.');
        process.exit(1);
    }

    function cleanup() {
        try {
            // Determine the package directory (uview-ultra-plus in node_modules)
            // It could be '..' or '../..' depending on if we are in dist/
            let packageDir = path.resolve(__dirname, '..');
            if (path.basename(packageDir) === 'dist') {
                packageDir = path.resolve(packageDir, '..');
            }
            
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
