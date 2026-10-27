const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { getClient, dbName } = require('./database.cjs');
const { parseTags, findRecipes, findRandomRecipe } = require('./api.cjs');
const root = path.resolve(__dirname, '../public');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.webp':'image/webp' };
const publicFiles = new Set(fs.readdirSync(root).filter(name => /\.html$/.test(name)));
function json(res, code, payload) { res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}); res.end(JSON.stringify(payload)); }
async function main() {
  const client = getClient();
  await client.connect();
  const collection = client.db(dbName).collection('recipes');
  const server = http.createServer(async (req, res) => {
    try {
      if (!['GET','HEAD'].includes(req.method)) { res.setHeader('Allow','GET, HEAD'); return json(res,405,{error:'Method not allowed.'}); }
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/healthz') return json(res,200,{status:'ok'});
      if (url.pathname === '/api/recipes/random') {
        try { return json(res,200,{recipes:await findRandomRecipe(collection)}); }
        catch { return json(res,503,{error:'Recipes are temporarily unavailable. Please try again.'}); }
      }
      if (url.pathname === '/api/recipes') {
        let tags; try { tags = parseTags(url); } catch (err) { return json(res,400,{error:err.message}); }
        try { return json(res,200,{recipes:await findRecipes(collection,tags)}); }
        catch { return json(res,503,{error:'Recipes are temporarily unavailable. Please try again.'}); }
      }
      let relative = decodeURIComponent(url.pathname).replace(/^\//,'') || 'index.html';
      const filename = path.resolve(root, relative);
      const extension = path.extname(filename).toLowerCase();
      const inRoot = filename.startsWith(root + path.sep);
      const allowed = publicFiles.has(relative) || (/^assets\//.test(relative) && Boolean(mime[extension]));
      if (!inRoot || !allowed || !mime[extension]) return json(res,404,{error:'Page not found.'});
      let stats; try { stats = await fs.promises.stat(filename); } catch { return json(res,404,{error:'Page not found.'}); }
      if (!stats.isFile()) return json(res,404,{error:'Page not found.'});
      res.writeHead(200,{'Content-Type':mime[extension],'Content-Length':stats.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
      if (req.method === 'HEAD') return res.end();
      const stream = fs.createReadStream(filename);stream.on('error',()=>res.destroy());stream.pipe(res);
    } catch { if (!res.headersSent) json(res,400,{error:'Invalid request.'}); else res.destroy(); }
  });
  const port = Number(process.env.PORT || 3000);
  server.on('error',async()=>{console.error('Could not start the server. Check PORT and whether another app is using it.');await client.close();process.exitCode=1;});
  const host = process.env.HOST || (process.env.RENDER ? '0.0.0.0' : '127.0.0.1');
  server.listen(port,host,()=>console.log(`YumYum is ready on ${host}:${port}`));
  const stop = () => server.close(async()=>{await client.close();process.exit(0);});
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
}
main().catch(()=>{console.error('Could not connect to MongoDB. Check backend/.env, database user, and Atlas IP access list. See docs/mongodb.md.');process.exitCode=1;});
