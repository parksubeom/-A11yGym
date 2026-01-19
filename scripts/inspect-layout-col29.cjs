const fs=require('fs');
const text=fs.readFileSync('.next/static/chunks/app/layout.js','utf8');
const lines=text.split(/\r?\n/);
const line=lines[69];
const idx=28; // 0-based, matches column 29
const ch=line[idx];
console.log('char', JSON.stringify(ch));
console.log('codePoint', ch.codePointAt(0));
console.log('around', JSON.stringify(line.slice(idx-5, idx+20)));
