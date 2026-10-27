# YumYum

A cooking website with recipe links stored in MongoDB Atlas.

**Live site:** https://yumyum-wuhk.onrender.com/

## Repository layout

```text
public/                 Website pages, served at the existing URLs
  assets/
    css/                Website styles
    js/                 Website interactions
    images/             Images used by the pages
    vendor/             Third-party browser libraries
backend/
  api.cjs               Recipe queries and validation
  database.cjs          Private database configuration
  server.cjs            HTTP server and public file serving
  data/                 One-time recipe import data
  scripts/              Database import utilities
  tests/                Automated behavior and asset checks
docs/                   MongoDB and deployment guides
render.yaml             Render deployment configuration
```

The server serves only `public/`. Superseded prototypes and unused pages/assets have been removed; Git history retains the previous implementation. Page URLs such as `/ICook.html` and `/secretpage.html` have not changed.

## Run locally

Use Node.js 22. From the repository root:

```powershell
npm run build
```

If `backend/.env` does not exist, copy `backend/.env.example` to `backend/.env` and set your private `MONGODB_URI`. Keep `MONGODB_DB=yumyum`. Never commit real credentials or overwrite an existing working `.env`.

```powershell
npm start
```

Open http://localhost:3000/ICook.html. The center toaster chooses a random database recipe. Header toasters open the secret page.

## Test

```powershell
npm test
```

Tests cover ingredient queries, random recipes, rapid clicks, error handling, header links, and public asset paths.

## Update the website

1. Pull the latest `main` before editing: `git pull origin main`.
2. Change pages in `public/`, styles in `public/assets/css/`, or interactions in `public/assets/js/`.
3. Run `npm test`, commit, and push to `main`.
4. Render automatically deploys the update.

Edit recipe documents in Atlas Data Explorer; they appear on the next recipe request without redeploying. The website uses read-only database access. Do not run the seed command with that account.

See [deployment settings](docs/deployment.md) and [MongoDB setup](docs/mongodb.md).
