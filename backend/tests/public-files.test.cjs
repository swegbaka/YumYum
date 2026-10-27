const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../../public');
function filesAt(dir, prefix = '') {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(item => {
    const name = prefix + item.name;
    return item.isDirectory() ? filesAt(path.join(dir,item.name),name + '/') : [name];
  });
}
const files = new Set(filesAt(root));
function verifyReference(source, reference) {
  const ref = reference.split(/[?#]/)[0];
  if (!ref || /^(https?:|mailto:|data:|javascript:|\/\/)/i.test(ref)) return;
  const relative = path.posix.normalize(path.posix.join(path.posix.dirname(source),ref));
  assert(files.has(relative), `${source} references missing or differently-cased ${relative}`);
}
test('all public page assets and internal links resolve with Linux path casing',()=>{
  for (const source of files) {
    if (!source.endsWith('.html')) continue;
    const html = fs.readFileSync(path.join(root,source),'utf8');
    for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) verifyReference(source,match[1]);
  }
});
test('all stylesheet images still resolve after moving styles and images',()=>{
  for (const source of files) {
    if (!source.endsWith('.css')) continue;
    const css = fs.readFileSync(path.join(root,source),'utf8');
    for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) verifyReference(source,match[1]);
  }
});
test('server serves the public directory rather than repository or archived files',()=>{
  const server = fs.readFileSync(path.resolve(__dirname,'../server.cjs'),'utf8');
  assert(server.includes("path.resolve(__dirname, '../public')"));
  assert(!files.has('.env'));
  assert(![...files].some(name=>name.startsWith('backend/')||name.startsWith('archive/')));
});
