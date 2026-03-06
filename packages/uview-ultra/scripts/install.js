#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.lstatSync(s);
    if (stat.isDirectory()) {
      copyDir(s, d);
    } else if (stat.isSymbolicLink()) {
      const real = fs.realpathSync(s);
      const realStat = fs.statSync(real);
      if (realStat.isDirectory()) {
        copyDir(real, d);
      } else {
        fs.copyFileSync(real, d);
      }
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function rimraf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function main() {
  const projectRoot = process.env.INIT_CWD || process.cwd();
  const srcDir = path.join(projectRoot, 'src');
  const uniModulesBase = fs.existsSync(srcDir) ? path.join(srcDir, 'uni_modules') : path.join(projectRoot, 'uni_modules');
  const targetDir = path.join(uniModulesBase, 'uview-ultra');

  let pkgPath;
  try {
    pkgPath = path.resolve(__dirname, '..');
  } catch (e) {
    console.error('[uview-ultra] Cannot resolve package root.');
    process.exit(1);
  }
  const distDir = path.join(pkgPath, 'dist');
  const distUView = path.join(distDir, 'uview-ultra');
  if (!fs.existsSync(distDir)) {
    console.error('[uview-ultra] dist not found. Please run build before install.');
    process.exit(1);
  }

  try {
    if (!fs.existsSync(uniModulesBase)) fs.mkdirSync(uniModulesBase, { recursive: true });
    rimraf(targetDir);
    fs.mkdirSync(targetDir, { recursive: true });
    copyDir(distUView, targetDir);
    const extras = fs.readdirSync(distDir).filter(n => n !== 'uview-ultra');
    extras.forEach(name => {
      const src = path.join(distDir, name);
      if (!fs.statSync(src).isDirectory()) return;
      const dest = path.join(uniModulesBase, name);
      rimraf(dest);
      fs.mkdirSync(dest, { recursive: true });
      copyDir(src, dest);
    });
    console.log(`[uview-ultra] Installed to ${targetDir} with extra libs`);
  } catch (e) {
    console.error('[uview-ultra] Installation failed:', e.message);
    process.exit(1);
  }
}

main();
