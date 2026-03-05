#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sourceData = path.join(root, 'data', 'products.json');
const targetDataDir = path.join(root, 'public', 'data');
const targetData = path.join(targetDataDir, 'products.json');
const indexHtml = path.join(root, 'public', 'index.html');
const notFoundHtml = path.join(root, 'public', '404.html');

if (!fs.existsSync(sourceData)) {
  console.error(`Missing source data file: ${sourceData}`);
  process.exit(1);
}

fs.mkdirSync(targetDataDir, { recursive: true });
fs.copyFileSync(sourceData, targetData);
fs.copyFileSync(indexHtml, notFoundHtml);

console.log('Prepared static assets:');
console.log(`- ${targetData}`);
console.log(`- ${notFoundHtml}`);
