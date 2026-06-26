const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('./src');
let errors = 0;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /import\s+(?:[^"']*)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const dir = path.dirname(file);
      let targetPath = path.resolve(dir, importPath);
      // Try to find the actual file with extensions
      const exts = ['', '.js', '.jsx', '.css', '.png', '.svg'];
      let found = false;
      let actualPath = '';
      let isDir = false;
      
      for (const ext of exts) {
        if (fs.existsSync(targetPath + ext)) {
          const stat = fs.statSync(targetPath + ext);
          if (stat.isDirectory()) {
             isDir = true;
          } else {
             found = true;
             actualPath = targetPath + ext;
             break;
          }
        }
      }
      
      if (isDir && !found) {
         targetPath = path.resolve(targetPath, 'index');
         for (const ext of exts) {
           if (fs.existsSync(targetPath + ext)) {
             found = true;
             actualPath = targetPath + ext;
             break;
           }
         }
      }

      if (found) {
        // check case
        const basename = path.basename(actualPath);
        const dirname = path.dirname(actualPath);
        const realFiles = fs.readdirSync(dirname);
        if (!realFiles.includes(basename)) {
          console.log('Case mismatch in ' + file + ':\n  imported: ' + importPath + '\n  actual: ' + basename);
          errors++;
        }
      } else {
        console.log('File not found in ' + file + ': ' + importPath);
        errors++;
      }
    }
  }
});
if (errors === 0) console.log('All imports seem correct case-wise.');
else process.exit(1);
