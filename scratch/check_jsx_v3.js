import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\mwenitete\\Desktop\\Blessings\\Tenpaten project\\tenpaten-web\\src\\components\\student\\ProgramDetailsView.tsx', 'utf8');

let stack = [];
const lines = content.split('\n');

lines.forEach((line, i) => {
    // Handle self-closing on current line or ending a multiline tag
    const isSelfClosing = line.trim().endsWith('/>');
    
    // Improved tag matching
    const matches = line.matchAll(/<([^\/!][^>\s\/]*)|<\/([^>\s]+)>/g);
    for (const match of matches) {
        if (match[1]) {
            const tagName = match[1];
            // If the whole line is just <Tag />, don't push
            if (line.match(new RegExp(`<${tagName}[^>]*\\/>`))) {
                continue;
            }
            stack.push({ name: tagName, line: i + 1 });
        } else if (match[2]) {
            const tagName = match[2];
            if (stack.length === 0) {
                console.log(`[Error] Unexpected </${tagName}> at line ${i + 1}`);
            } else {
                const last = stack.pop();
                if (last.name !== tagName) {
                     if (last.name === 'div' || tagName === 'div') {
                         console.log(`[Critical] Mismatch: <${last.name}> (line ${last.line}) closed with </${tagName}> (line ${i + 1})`);
                    }
                }
            }
        }
    }
    
    // If line ends with />, pop the last thing if it was an open tag without a closure
    if (isSelfClosing && stack.length > 0) {
        // This is a bit hacky but for simple check:
        const last = stack[stack.length - 1];
        if (!['div', 'span', 'h1', 'h2', 'h3', 'h4', 'section', 'main'].includes(last.name)) {
             stack.pop();
        }
    }
});

console.log('Final stack:', stack);
