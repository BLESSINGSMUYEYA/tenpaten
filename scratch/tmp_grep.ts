import fs from 'fs';
import path from 'path';

const searchDir = 'c:/Users/mwenitete/Desktop/Blessings/Tenpaten project/tenpaten-web';
const query = 'director@malawi.com';

function walk(dir: string, callback: (file: string) => void) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            if (file === 'node_modules' || file === '.next' || file === '.git') continue;
            walk(filepath, callback);
        } else {
            callback(filepath);
        }
    }
}

console.log('Searching for:', query);
walk(searchDir, (file) => {
    if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.js')) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(query)) {
            console.log(`Found in: ${file}`);
        }
    }
});
console.log('Done!');
