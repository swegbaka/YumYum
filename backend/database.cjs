const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const { MongoClient } = require('mongodb');
function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('YOUR_')) throw new Error('Set MONGODB_URI in backend/.env first. See docs/mongodb.md.');
  return new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
}
module.exports = { getClient, dbName: process.env.MONGODB_DB || 'yumyum' };
