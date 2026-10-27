# YumYum

A cooking website with recipe links loaded from MongoDB Atlas.

## Run locally

Node.js 22 is recommended. From the repository root:

```powershell
npm run build
Copy-Item backend/.env.example backend/.env
# Edit backend/.env with your MongoDB connection; do not overwrite an existing working .env.
npm start
```

Open http://localhost:3000/ICook.html. If dependencies and backend/.env are already configured, only npm start is needed. Never commit .env or node_modules.

## Publish on Render

Create a Node Web Service from this repository, or use render.yaml as a Blueprint.

- Branch: main
- Root directory: leave empty (the server needs the HTML and assets above backend)
- Build: npm ci --prefix backend
- Start: node backend/server.cjs
- Health check: /healthz
- Instance: Free
- Environment: MONGODB_URI (secret), MONGODB_DB=yumyum, HOST=0.0.0.0, NODE_VERSION=22.14.0

Use Render's PORT automatically. Add the service's outbound IP ranges to Atlas Network Access. Keep the existing recipe account read-only. Configure the connection string only in Render's environment settings, never GitHub or the browser JavaScript.

## Future updates

Push code edits to main to trigger Render deployment. Edit recipe documents in Atlas Data Explorer for recipe changes; these appear on the next ingredient click without redeploying the website. The runtime code is backend/server.cjs; the older root node.js, controllers, routes and views are retained legacy files and are not used by this deployment.

## Tests

Run npm test. Database integration checks require a valid connection and authorized network. Do not rerun the seed with the read-only website account; the recipes are already imported.
