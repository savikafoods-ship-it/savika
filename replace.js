const fs = require('fs');
const path = require('path');

function replaceEmDashes(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceEmDashes(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('—')) {
                content = content.replace(/—/g, '-');
                fs.writeFileSync(fullPath, content, 'utf8');
            }
        }
    });
}

replaceEmDashes('./src');
