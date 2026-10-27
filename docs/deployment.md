# Render deployment

- Website: https://yumyum-wuhk.onrender.com/
- Repository: https://github.com/swegbaka/YumYum
- Root directory: leave empty
- Build command: `npm ci --prefix backend`
- Start command: `node backend/server.cjs`
- Health check: `/healthz`
- Automatic deployment: commits to `main`
- Runtime: Node.js 22

All public pages and assets live in `public/`. The server resolves this directory relative to its source file, so the build/start commands do not change when frontend files are moved. `backend/`, `docs/`, and `archive/` are never served as website files.

Store `MONGODB_URI` privately in Render Environment settings. Set `MONGODB_DB=yumyum`; Render supplies `PORT`. The server listens on the host configured by `HOST`, defaulting to `0.0.0.0` on Render and localhost during local development.

Authorize the service's outbound ranges in Atlas Network Access. The currently approved Virginia ranges are `74.220.49.0/24` and `74.220.57.0/24`. Confirm these against the service's Connect panel if changing regions.

The Free service sleeps after inactivity, so a first request can take longer to load. Code updates require a deployment; MongoDB recipe updates do not.

The import file is `backend/data/recipes.seed.json`, and the utility is `backend/scripts/seed.cjs`. It needs a separate write-capable database account. No re-import is necessary for the existing deployment.
