const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Shell Install script for uview-ultra-plus.
 * This runs as a preinstall hook to download the actual component code from NPM
 * and place it into the project's src/uni_modules directory.
 */

function install() {
    const projectRoot = process.env.INIT_CWD || process.cwd();
    const targetBaseDir = path.join(projectRoot, 'src', 'uni_modules');
    const packages = ['uview-ultra', 'lime-dayuts'];

    console.log(`[uview-ultra-plus] Shell install started. Target: ${targetBaseDir}`);

    // 1. Ensure target directory exists
    if (!fs.existsSync(targetBaseDir)) {
        fs.mkdirSync(targetBaseDir, { recursive: true });
        console.log(`[uview-ultra-plus] Created directory: ${targetBaseDir}`);
    }

    const tempDir = path.join(projectRoot, '.uview-temp-' + Date.now());
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    try {
        packages.forEach(pkg => {
            const targetDir = path.join(targetBaseDir, pkg);
            
            console.log(`[uview-ultra-plus] Fetching ${pkg} from NPM...`);
            
            try {
                // Download tarball using npm pack
                const tarballName = execSync(`npm pack ${pkg}`, { cwd: tempDir, encoding: 'utf8' }).trim();
                const tarballPath = path.join(tempDir, tarballName);

                // Prepare target directory
                if (fs.existsSync(targetDir)) {
                    // Using a safer way to clear the directory if needed, or just overwrite
                    console.log(`[uview-ultra-plus] Updating existing ${pkg} in ${targetDir}...`);
                } else {
                    fs.mkdirSync(targetDir, { recursive: true });
                }

                // Extract tarball
                // npm pack creates a tarball where everything is in a 'package' folder
                console.log(`[uview-ultra-plus] Extracting ${pkg} to ${targetDir}...`);
                
                // Use tar command (available on Mac/Linux)
                execSync(`tar -xzf ${tarballPath} -C ${targetDir} --strip-components=1`);
                
                console.log(`[uview-ultra-plus] Successfully installed ${pkg}.`);
            } catch (err) {
                console.error(`[uview-ultra-plus] Failed to install ${pkg}. It might not be on the NPM registry yet.`);
                console.log(`[uview-ultra-plus] Error details: ${err.message}`);
            }
        });
    } finally {
        // Cleanup temp directory
        if (fs.existsSync(tempDir)) {
            console.log(`[uview-ultra-plus] Cleaning up temporary files...`);
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    }

    console.log('[uview-ultra-plus] Shell install hook finished.');
}

install();
