import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\mwenitete\\Desktop\\Blessings\\Tenpaten project\\tenpaten-web\\src\\components\\student\\ProgramDetailsView.tsx', 'utf8');

let stack = [];
const lines = content.split('\n');

lines.forEach((line, i) => {
    // Match all tags in the line
    const matches = line.matchAll(/<([^\/!][^>\s\/]*)|<\/([^>\s]+)>/g);
    for (const match of matches) {
        if (match[1]) {
            // Opening tag
            const tagName = match[1];
            // Check if it's self-closing in the same match (not accurate for multi-line tags but good enough)
            if (line.substring(match.index).match(/^<[^>]*\/>/)) {
                // ignore
            } else {
                stack.push({ name: tagName, line: i + 1 });
            }
        } else if (match[2]) {
            // Closing tag
            const tagName = match[2];
            if (stack.length === 0) {
                console.log(`[Error] Unexpected </${tagName}> at line ${i + 1}`);
            } else {
                const last = stack.pop();
                if (last.name !== tagName) {
                    // console.log(`[Warning] Tag mismatch: <${last.name}> (line ${last.line}) closed with </${tagName}> (line ${i + 1})`);
                    // For React components we might have tags like Link, etc.
                    // But if it's div vs div it's a real error.
                    if (last.name === 'div' || tagName === 'div') {
                         console.log(`[Critical] Mismatch: <${last.name}> (line ${last.line}) closed with </${tagName}> (line ${i + 1})`);
                    }
                }
            }
        }
    }
});

console.log('Final stack:', stack);
