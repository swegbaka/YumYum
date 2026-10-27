const { getClient, dbName } = require('./database.cjs');
const { allowedTags, safeUrl } = require('./api.cjs');
const recipes = require('./recipes.seed.json');
async function main() {
  if (!recipes.length || recipes.some(r=>!r.title || !safeUrl(r.url) || !r.tags.length || r.tags.some(t=>!allowedTags.has(t)))) throw new Error('Invalid recipe import data.');
  const client = getClient();
  try {
    await client.connect();
    const collection = client.db(dbName).collection('recipes');
    await collection.createIndex({ url: 1 }, { unique: true });
    await collection.createIndex({ tags: 1 });
    const result = await collection.bulkWrite(recipes.map(recipe=>({updateOne:{filter:{url:recipe.url},update:{$set:recipe},upsert:true}})));
    console.log(`Import complete: ${recipes.length} recipes. Added ${result.upsertedCount}; updated ${result.modifiedCount}. Other recipes were preserved.`);
  } finally { await client.close(); }
}
main().catch(()=>{console.error('Import failed. Check backend/.env, Atlas access settings, and recipes.seed.json. See MONGODB-SETUP.md.');process.exitCode=1;});
