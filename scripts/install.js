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

    // 1. Get current version for version-specific downloads
    const pkgPath_self = path.join(__dirname, '..', 'package.json');
    let version = 'master'; // Fallback
    try {
        const pkgData = JSON.parse(fs.readFileSync(pkgPath_self, 'utf8'));
        version = pkgData.version;
    } catch (e) {
        console.warn('[uview-ultra-plus] Could not read package.json version, falling back to master.');
    }

    const repoUrl = 'https://github.com/lvli0401/uview-ultra-plus';
    // Use tag if it's a stable version, else branch
    const tag = `v${version}`;
    const downloadUrl = `${repoUrl}/archive/refs/tags/${tag}.tar.gz`;
    const fallbackUrl = `${repoUrl}/archive/refs/heads/master.tar.gz`;

    console.log(`[uview-ultra-plus] Remote preinstall started. Target Version: ${version}`);

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
            // Archive root for tags is usually {repo-name}-{version-without-v}
            const archiveRoot = `uview-ultra-plus-${version}`;
            const extractPath = `${archiveRoot}/${pkg}`;
            
            try {
                // Try downloading the version tag
                console.log(`[uview-ultra-plus] Downloading ${pkg} (tag ${tag})...`);
                execSync(`curl -fL ${downloadUrl} | tar -xz -C ${targetDir} --strip-components=2 ${extractPath}`, {
                    stdio: 'inherit'
                });
                console.log(`[uview-ultra-plus] Successfully installed ${pkg}.`);
            } catch (innerErr) {
                // If tag fails, try master branch as fallback (useful for development versions)
                console.warn(`[uview-ultra-plus] Tag ${tag} not found, falling back to master...`);
                const fallbackArchiveRoot = 'uview-ultra-plus-master';
                const fallbackExtractPath = `${fallbackArchiveRoot}/${pkg}`;
                try {
                    execSync(`curl -fL ${fallbackUrl} | tar -xz -C ${targetDir} --strip-components=2 ${fallbackExtractPath}`, {
                        stdio: 'inherit'
                    });
                    console.log(`[uview-ultra-plus] Successfully installed ${pkg} (master).`);
                } catch (lastErr) {
                    console.error(`[uview-ultra-plus] Failed to extract ${pkg} from tag or master.`);
                    throw lastErr;
                }
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
