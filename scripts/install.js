const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Remote Preinstall script for uview-ultra-plus.
 * Downloads uview-ultra and lime-dayuts from GitHub directly into uni_modules.
 */

function install() {
    const projectRoot = process.env.INIT_CWD || process.cwd();
    
    // Determine target uni_modules path
    let targetBaseDir = path.join(projectRoot, 'src', 'uni_modules');
    if (!fs.existsSync(path.join(projectRoot, 'src')) && fs.existsSync(path.join(projectRoot, 'pages.json'))) {
        targetBaseDir = path.join(projectRoot, 'uni_modules');
    }

    const repoUrl = 'https://github.com/lvli0401/uview-ultra-plus';
    const branch = 'master';
    const downloadUrl = `${repoUrl}/archive/refs/heads/${branch}.tar.gz`;

    console.log(`[uview-ultra-plus] Remote preinstall started. Fetching from ${repoUrl}`);

    const packages = ['uview-ultra', 'lime-dayuts'];

    try {
        if (!fs.existsSync(targetBaseDir)) {
            fs.mkdirSync(targetBaseDir, { recursive: true });
            console.log(`[uview-ultra-plus] Created directory: ${targetBaseDir}`);
        }

        packages.forEach(pkg => {
            const targetDir = path.join(targetBaseDir, pkg);
            console.log(`[uview-ultra-plus] Downloading and extracting ${pkg} to ${targetDir}...`);
            
            // Prepare target
            if (fs.existsSync(targetDir)) {
                fs.rmSync(targetDir, { recursive: true, force: true });
            }
            fs.mkdirSync(targetDir, { recursive: true });

            // Using curl | tar to extract specific folder from the remote archive
            // Archive root is usually {repo-name}-{branch}
            const archiveRoot = `uview-ultra-plus-${branch}`;
            const extractPath = `${archiveRoot}/${pkg}`;
            
            try {
                // --strip-components=2 handles pulling content out of the archiveRoot/pkg/ structure
                execSync(`curl -L ${downloadUrl} | tar -xz -C ${targetDir} --strip-components=2 ${extractPath}`, {
                    stdio: 'inherit'
                });
                console.log(`[uview-ultra-plus] Successfully installed ${pkg}.`);
            } catch (innerErr) {
                console.error(`[uview-ultra-plus] Failed to extract ${pkg}.`);
                throw innerErr;
            }
        });

        console.log('[uview-ultra-plus] Remote preinstall hook finished.');
    } catch (err) {
        console.error('[uview-ultra-plus] CRITICAL: Remote installation failed.');
        console.error(`[uview-ultra-plus] Error details: ${err.message}`);
        // We exit(1) to stop the installation if we can't get the core components
        process.exit(1);
    }
}

install();
