const allowedTags = new Set(['potato','tofu','broccoli','cabbage','tomato','carrot','pumpkin','mushroom','eggplant','corn','lettuce','chicken','beef','pork','seafood','lamb','pan','microwave','pot','air-fryer','oven','rice','noodle','cake','ice cream']);
function parseTags(url) {
  const values = url.searchParams.getAll('tags');
  if (values.length !== 1 || values[0].length > 400) throw new Error('Choose at least one ingredient.');
  const tags = [...new Set(values[0].split(',').map(value => value.trim().toLowerCase()))];
  if (!tags.length || tags.some(tag => !allowedTags.has(tag))) throw new Error('Unknown ingredient or cookware selection.');
  return tags;
}
function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && ['www.bilibili.com','bilibili.com'].includes(url.hostname) && /^\/video\/BV[a-zA-Z0-9]+\/?$/.test(url.pathname) && !url.username && !url.password; }
  catch { return false; }
}
async function findRecipes(collection, tags) {
  const rows = await collection.find({ tags: { $in: tags } }, { projection: { _id: 0, title: 1, url: 1, tags: 1 } }).sort({ title: 1, url: 1 }).limit(100).toArray();
  return rows.filter(row => typeof row.title === 'string' && safeUrl(row.url));
}
module.exports = { allowedTags, parseTags, safeUrl, findRecipes };
