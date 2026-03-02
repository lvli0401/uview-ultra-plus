const fs = require('fs');
const path = require('path');

/**
 * Patch imports in dist/uview-ultra
 * Replace: import dayjs from 'dayjs' -> import dayjs from '../../vendor/dayjs.min.js'
 * Target: .js, .vue, .uvue files
 */

const distUViewPath = path.resolve(__dirname, '../dist/uview-ultra');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const replacements = [
    {
        pattern: /import dayjs from ['"]dayjs['"]/g,
        replacement: (filePath) => {
            const relPath = path.relative(path.dirname(filePath), path.join(distUViewPath, 'vendor/dayjs.min.js'));
            return `import dayjs from './${relPath}'`;
        }
    },
    {
        pattern: /import Clipboard from ['"]clipboard['"]/g,
        replacement: (filePath) => {
            const relPath = path.relative(path.dirname(filePath), path.join(distUViewPath, 'vendor/clipboard.min.js'));
            return `import Clipboard from './${relPath}'`;
        }
    }
];

function patchFile(filePath) {
    if (!['.js', '.vue', '.uvue'].some(ext => filePath.endsWith(ext))) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    replacements.forEach(conf => {
        if (conf.pattern.test(content)) {
            content = content.replace(conf.pattern, conf.replacement(filePath));
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[Patch] Updated ${path.relative(distUViewPath, filePath)}`);
    }
}

if (fs.existsSync(distUViewPath)) {
    walk(distUViewPath, patchFile);
    console.log('[Patch] Import patching complete.');
} else {
    console.warn('[Patch] dist/uview-ultra not found, skipping patching.');
}
