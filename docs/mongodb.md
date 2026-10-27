# Connect YumYum to MongoDB

**Already configured on this computer.** See atlas-status.md for current status. The database is populated and the app uses a read-only login. The setup/import steps below are for a new deployment; do not rerun the importer with the read-only website account.

Prepared from receipe.txt: 16 entries became 14 unique Bilibili recipe links. Duplicate URLs share tags (tofu/noodle and broccoli/cabbage). Chinese titles are preserved; tracking parameters were removed. Empty numbered entries were skipped. Only the chicken recipe explicitly mentions an air fryer, so that cookware tag was added. No cooking tools or ingredients were guessed from the videos.

## 1. Create your database in MongoDB Atlas

1. Sign in at https://www.mongodb.com/cloud/atlas and create a project, such as YumYum.
2. Create a Free cluster if offered. No paid cluster is needed for this small recipe collection.
3. Create a database user with read/write access to the `yumyum` database. This is separate from your Atlas account login.
4. In Network Access / IP Access List, add your current public IP. If it changes, update the entry. For deployment later, authorize your server's outbound IP.
5. Choose Connect > Drivers > Node.js and copy the connection string.

Official instructions: https://www.mongodb.com/docs/atlas/connect-to-database-deployment/

## 2. Configure the project

Install Node.js 20 or newer if needed. Open PowerShell in the YumYum folder, then run:

```powershell
cd backend
npm install
Copy-Item .env.example .env
notepad .env
```

Replace the placeholders in MONGODB_URI with your cluster, database username, and password. Percent-encode special characters in the username/password when putting them into the URI. Keep MONGODB_DB=yumyum and PORT=3000 unless you want different names or ports. Never put credentials in ICook.js or share your .env file. The server does not expose backend files.

## 3. Import the recipes

```powershell
npm run seed
```

This creates the `yumyum` database and `recipes` collection if they do not exist. It adds a unique URL index and a tag index. Re-running updates matching URLs without creating duplicate recipes or deleting other recipes.

data/recipes.seed.json is a one-time import source, not the website's runtime data source. After importing, you may remove or archive it; do not run the seed command again after removing it. Recipe links are loaded from MongoDB by the server. You do not need any local recipe HTML files for this feature.

## 4. Start the website

```powershell
npm start
```

Open http://localhost:3000/ICook.html — do not double-click the HTML file. Clicking any button fetches its recipes afresh from MongoDB. Clicking an already selected option reloads its results. Clicking another option switches the displayed recipe list. Links open Bilibili in a new tab; no videos are embedded.

Several options do not yet have recipes in your file. They show an empty-state message until you add matching records. The collection uses simple tags, not a claim that every recipe contains every chosen ingredient.

## 5. Add or edit recipes later

In Atlas Data Explorer, open yumyum > recipes, then insert a document like:

```json
{
  "title": "Your recipe title",
  "url": "https://www.bilibili.com/video/BVxxxxxxxxxx/",
  "tags": ["potato", "oven"]
}
```

Use an actual Bilibili video ID. Supported tags match the ingredient buttons: potato, tofu, broccoli, cabbage, tomato, carrot, pumpkin, mushroom, eggplant, corn, lettuce, chicken, beef, pork, seafood, lamb, pan, microwave, pot, air-fryer, oven, rice, noodle, cake, ice cream.

Changes appear on the next button click. Avoid rerunning the seed after editing imported records unless you want their supplied titles/tags restored.

## Checks and troubleshooting

Run `npm test` in backend for query, import, and click-handling checks. Live database testing requires your configured Atlas deployment.

- Connection fails: check the database user's credentials, encoded password, cluster hostname, and IP access list. A work or school firewall may also block the connection.
- No recipes: run npm run seed, and check MONGODB_DB=yumyum.
- Old results: use the localhost page and reload it; ensure you started the server from backend, not the old root node.js.
- Port 3000 already used: change PORT in backend/.env and use that port in your browser.

The previous Node/Express files are retained under archive/legacy-server and are not used by this recipe server. Use only backend/npm start for this integration. This server binds to your local computer; deploying it publicly is a separate step.

Atlas setup has now created the YumYum project, Free Cluster0, and yumyum.recipes collection with all 14 unique recipes. URL uniqueness and tag indexes are ready. Application access is configured and live-tested; see atlas-status.md. Do not repeat the manual JSON import.
