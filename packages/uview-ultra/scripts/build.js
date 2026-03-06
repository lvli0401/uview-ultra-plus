const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Build script for uview-ultra (subpackage)
 * 1. Clean dist
 * 2. Sync package sources to dist (exclude node_modules, scripts, dist)
 * 3. Bundle vendors into dist/vendor via rollup
 * 4. Patch imports inside dist
 * 5. Optionally sync to examples for local dev
 */

const packageRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(packageRoot, '../..');
const distPath = path.join(packageRoot, 'dist');
const distUView = path.join(distPath, 'uview-ultra');
const utsLibsSrc = path.join(packageRoot, 'uts-libs');

function clean() {
  if (fs.existsSync(distPath)) {
    execSync(`rm -rf "${distPath}"`);
  }
  fs.mkdirSync(distPath, { recursive: true });
}

function syncSourceToDist() {
  console.log('[Build] Sync sources to dist/uview-ultra...');
  fs.mkdirSync(distUView, { recursive: true });
  execSync(
    `rsync -aq --exclude='node_modules' --exclude='dist' --exclude='scripts' --exclude='rollup.config.mjs' --exclude='uts-libs' "${packageRoot}/" "${distUView}/"`
  );
  if (fs.existsSync(utsLibsSrc)) {
    const libs = fs.readdirSync(utsLibsSrc).filter(n => fs.statSync(path.join(utsLibsSrc, n)).isDirectory());
    libs.forEach(lib => {
      const src = path.join(utsLibsSrc, lib);
      const dest = path.join(distPath, lib);
      execSync(`rsync -aq "${src}/" "${dest}/"`);
    });
  }
}

function runRollup() {
  console.log('[Build] Running Rollup vendors...');
  execSync('pnpm run rollup', { stdio: 'inherit', cwd: packageRoot });
}

function patchImports() {
  console.log('[Build] Patching imports...');
  require('./patch-imports.js');
}

function syncExamples() {
  const uiTargets = [
    path.join(repoRoot, 'examples/uniapp/src/uni_modules/uview-ultra'),
    path.join(repoRoot, 'examples/uniapp-x/uni_modules/uview-ultra')
  ];
  uiTargets.forEach(target => {
    if (fs.existsSync(path.dirname(target))) {
      console.log(`[Build] Sync to ${path.relative(repoRoot, target)}...`);
      if (fs.existsSync(target)) execSync(`rm -rf "${target}"`);
      execSync(`rsync -aq "${distUView}/" "${target}/"`);
    }
  });
  const extraLibs = fs.existsSync(distPath) ? fs.readdirSync(distPath).filter(n => n !== 'uview-ultra') : [];
  extraLibs.forEach(lib => {
    const src = path.join(distPath, lib);
    if (!fs.statSync(src).isDirectory()) return;
    [path.join(repoRoot, 'examples/uniapp/src/uni_modules', lib), path.join(repoRoot, 'examples/uniapp-x/uni_modules', lib)].forEach(dest => {
      if (fs.existsSync(path.dirname(dest))) {
        if (fs.existsSync(dest)) execSync(`rm -rf "${dest}"`);
        execSync(`rsync -aq "${src}/" "${dest}/"`);
      }
    });
  });
}

function main() {
  clean();
  syncSourceToDist();
  runRollup();
  patchImports();
  // Dev convenience
  syncExamples();
  console.log('[Build] Done.');
}

main();
