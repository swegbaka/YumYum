# MongoDB Atlas setup complete

Project: YumYum
Cluster: Cluster0 (Free)
Database: yumyum
Collection: recipes
Imported: 14 unique recipe links from receipe.txt
Indexes: _id_, url_1 (unique), tags_1
Application user: yumyum_app — read access scoped to yumyum.recipes
Network: only your approved current public IP; no allow-all rule
Credentials: saved only in backend/.env, excluded from the ZIP

Open the live site: http://localhost:3000/ICook.html

The server is currently running. To restart it later, open PowerShell in backend and run npm start. Keep that terminal running while using the site. Do not open ICook.html as a file; the API requires the local server.

Verified against the live database: all 14 recipe titles, URLs, and tags matched the import source, and 13 populated button categories returned the expected results. Browser verification: Potato displayed two MongoDB recipe links. Buttons without supplied recipes show a no-recipes message.

Edit or add recipes through Atlas Data Explorer. The website login cannot modify or delete data. Do not run npm run seed with this read-only account. No further import is needed.

If your public IP changes, update the Atlas IP access list. If moving to another computer or deploying, configure a server-side .env and authorize that server's IP separately. The ZIP intentionally contains no password.

Data Explorer: https://cloud.mongodb.com/v2/6ae015dbdc3e623f37f9a739#/explorer/6ae0160cdc3e623f37fa17a1/yumyum/recipes/find
