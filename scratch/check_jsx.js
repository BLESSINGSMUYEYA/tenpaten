import fs from 'fs';

const content = fs.readFileSync('c:\\Users\\mwenitete\\Desktop\\Blessings\\Tenpaten project\\tenpaten-web\\src\\components\\student\\ProgramDetailsView.tsx', 'utf8');

let braceStack = 0;
let parenStack = 0;
let tagStack = [];

const lines = content.split('\n');
lines.forEach((line, i) => {
    // Very simple tag matcher
    const tags = line.match(/<[^\/!][^>]*>|<\/[^>]+>/g) || [];
    tags.forEach(tag => {
        if (tag.endsWith('/>')) return; // ignore self-closing
        if (tag.startsWith('</')) {
            const tagName = tag.match(/<\/([^>\s]+)>/)[1];
            if (tagStack.length === 0) {
                console.log(`Unexpected closing tag </${tagName}> at line ${i + 1}`);
            } else {
                const lastTag = tagStack.pop();
                if (lastTag !== tagName) {
                    console.log(`Tag mismatch: opened <${lastTag}> but closed with </${tagName}> at line ${i + 1}`);
                }
            }
        } else {
            const tagName = tag.match(/<([^>\s\/]+)/)[1];
            tagStack.push(tagName);
        }
    });

    for (let char of line) {
        if (char === '{') braceStack++;
        if (char === '}') braceStack--;
        if (char === '(') parenStack++;
        if (char === ')') parenStack--;
    }
});

console.log('Brace stack:', braceStack);
console.log('Paren stack:', parenStack);
console.log('Tag stack:', tagStack);
