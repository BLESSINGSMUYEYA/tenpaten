const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedCount = 0;
walkDir(path.join(__dirname, 'src'), function(filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // We match "/dashboard/student" not followed by "-" to avoid "/dashboard/student-settings"
        const regex = /\/dashboard\/student(?!\-)/g;
        if (regex.test(content)) {
            let newContent = content.replace(regex, '/dashboard');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Modified: ${filePath}`);
            modifiedCount++;
        }
    }
});
console.log(`Total files modified: ${modifiedCount}`);
