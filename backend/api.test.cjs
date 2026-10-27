const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { parseTags, safeUrl, findRecipes, allowedTags } = require('./api.cjs');
const data = require('./recipes.seed.json');
test('imports 14 unique valid recipes with merged category tags', () => {
  assert.equal(data.length,14);assert.equal(new Set(data.map(r=>r.url)).size,14);
  assert(data.every(r=>safeUrl(r.url)&&r.title&&r.tags.every(t=>allowedTags.has(t))));
  assert(data.some(r=>r.tags.includes('tofu')&&r.tags.includes('noodle')));
  assert(data.some(r=>r.tags.includes('broccoli')&&r.tags.includes('cabbage')));
});
test('validates tags and rejects objects, unrecognized input, and missing selections',()=>{
  assert.deepEqual(parseTags(new URL('http://localhost/api/recipes?tags=potato,potato,beef')),['potato','beef']);
  for(const query of ['', '?tags=', '?tags[$ne]=a', '?tags=unknown','?tags=potato&tags=beef']) assert.throws(()=>parseTags(new URL('http://localhost/'+query)));
  assert(!safeUrl('javascript:alert(1)'));assert(!safeUrl('https://evil.example/video/BV123/'));assert(!safeUrl('https://www.bilibili.com@evil.example/video/BV123/'));
});
test('queries MongoDB with selected tags and returns only valid public links',async()=>{
  let filter;const collection={find(query,options){filter=query;assert.equal(options.projection._id,0);return{sort(){return this},limit(n){assert.equal(n,100);return this},async toArray(){return [{title:'Valid',url:data[0].url},{title:'Unsafe',url:'javascript:alert(1)'}]}}}};
  const recipes=await findRecipes(collection,['potato']);assert.deepEqual(filter,{tags:{$in:['potato']}});assert.equal(recipes.length,1);
});
function browserHarness(fetcher,protocol='http:') {
  const callbacks=[];const buttons=['potato','tofu'].map(value=>({dataset:{value},textContent:value,setAttribute(){},addEventListener(event,handler){callbacks.push(handler)}}));
  const results={children:[],textContent:'',replaceChildren(){this.children=[];this.textContent=''},appendChild(node){this.children.push(node)},get childElementCount(){return this.children.length},setAttribute(){},removeAttribute(){}};
  const summary={textContent:''};const document={getElementById:id=>id==='recipe-results'?results:summary,querySelectorAll:()=>buttons,createElement:()=>({setAttribute(){}})};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../ICook.js'),'utf8'),{document,location:{protocol},URL,AbortController,setTimeout,clearTimeout,fetch:fetcher});
  return {callbacks,results,summary};
}
test('each click requests the API and displays database links, including repeat clicks',async()=>{
  const calls=[];const h=browserHarness(async url=>{calls.push(url);return{ok:true,json:async()=>({recipes:[data[0]]})}});
  await h.callbacks[0]();await h.callbacks[0]();assert.equal(calls.length,2);assert.equal(calls[0],'/api/recipes?tags=potato');assert.equal(h.results.children[0].href,data[0].url);assert.equal(h.results.children[0].target,'_blank');
});
test('out-of-order responses cannot replace the latest clicked ingredient',async()=>{
  const resolve=[];const h=browserHarness(()=>new Promise(r=>resolve.push(r)));
  const first=h.callbacks[0](),second=h.callbacks[1]();resolve[1]({ok:true,json:async()=>({recipes:[data[2]]})});await second;resolve[0]({ok:true,json:async()=>({recipes:[data[0]]})});await first;assert.equal(h.results.children[0].href,data[2].url);
});
test('empty, failed and file-open cases display helpful messages',async()=>{
  let h=browserHarness(async()=>({ok:true,json:async()=>({recipes:[]})}));await h.callbacks[0]();assert.match(h.results.textContent,/No recipes/);
  h=browserHarness(async()=>{throw Error('offline')});await h.callbacks[0]();assert.match(h.results.textContent,/Could not load/);
  h=browserHarness(()=>{throw Error('must not fetch')},'file:');await h.callbacks[0]();assert.match(h.results.textContent,/localhost:3000/);
});
