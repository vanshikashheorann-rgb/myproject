const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');

// Match local src attributes
const srcRegex = /src=["']([^"']+)["']/g;
const srcMatches = [];
let match;
while ((match = srcRegex.exec(html)) !== null) {
  const url = match[1];
  if (!url.startsWith('http') && !url.startsWith('data:')) {
    srcMatches.push(url);
  }
}

console.log('Referenced local scripts & assets in index.html:', srcMatches);

let allGood = true;
srcMatches.forEach(src => {
  if (!fs.existsSync(path.join(process.cwd(), src))) {
    console.error('BROKEN SRC:', src);
    allGood = false;
  }
});

// Check css files
const hrefRegex = /href=["']([^"']+\.css)["']/g;
const cssMatches = [];
while ((match = hrefRegex.exec(html)) !== null) {
  const url = match[1];
  if (!url.startsWith('http')) {
    cssMatches.push(url);
  }
}

console.log('Referenced local css in index.html:', cssMatches);
cssMatches.forEach(href => {
  if (!fs.existsSync(path.join(process.cwd(), href))) {
    console.error('BROKEN CSS:', href);
    allGood = false;
  }
});

// Check all assets in sign library
const signLib = fs.readFileSync(path.join('js', 'sign-library.js'), 'utf8');
const assetRegex = /assets\/signs\/[a-z0-9\-_]+\.svg/g;
const assetsInLib = [...new Set(signLib.match(assetRegex) || [])];
console.log(`Checking ${assetsInLib.length} assets referenced in sign-library.js...`);

let missingAssets = 0;
assetsInLib.forEach(assetPath => {
  if (!fs.existsSync(path.join(process.cwd(), assetPath))) {
    console.error('MISSING ASSET:', assetPath);
    allGood = false;
    missingAssets++;
  }
});

if (allGood) {
  console.log('✓ All 100% of local links, scripts, css, and assets are valid and present!');
} else {
  console.error(`✗ Found ${missingAssets} missing assets.`);
  process.exit(1);
}
