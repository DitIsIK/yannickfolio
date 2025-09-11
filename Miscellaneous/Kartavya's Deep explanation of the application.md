Kartavya's Deep explanation of the application

This document provides a comprehensive, sanitized deep-dive into the Kartavya-Portfolio-MERN repository: purpose, architecture, data flows, and operational notes. Sensitive values (API keys, connection strings, tokens) are intentionally omitted. Never commit secrets to source control.

High-level summary

- Purpose: A personal MERN portfolio website for Kartavya Singh that presents projects, experience, skills, media, and contact facilities in a modern, animated UI.
- Main capabilities:
  - Serves a responsive React frontend with polished interactions and multimedia.
  - Provides a backend API to manage portfolio data, serve images, and handle contact submissions.
  - Extracts and stores resume and repository metadata for display in the site UI.
  - Supports image processing, metrics logging, and scheduled data refresh tasks.

Tech stack

- Frontend: React (Create React App), Framer Motion, react-markdown, react-spring, and related UI libraries.
- Backend: Node.js with Fastify for high-performance APIs; MongoDB for data storage; pdf-parse for resume extraction; Puppeteer/Sharp for image-related tasks; Winston for logging.
- Deployment: Designed to run on hosted platforms (Render, Vercel, or similar) with MongoDB Atlas or a compatible hosted database. Environment variables configure sensitive values.

Top-level repository layout

- `backend/` — server, API routes, controllers, and data utilities
  - `server.js` — Fastify server setup, middleware, route registration, and startup sequencing
  - `config/` — database client (`mongodb.js`) and other config helpers
  - `controllers/` — business logic for data ingestion, resume parsing, image processing, and scheduled tasks
  - `routes/` — REST endpoints for data, images, and utilities (e.g., `dataRoutes.js`, `imagesRoutes.js`)
  - `data/` — resume PDF and image assets that the backend can use for content and processing
- `frontend/` — React app with pages/components for Home, About, Projects, Experience, Skills, Contact, and special UI features
- `Miscellaneous/` — historical backups, helper scripts, and experimental tooling (not required for core operation)

Backend responsibilities and flow

1. Startup & routing
   - `server.js` configures Fastify, registers plugins (CORS, cookies, form parsing), sets global hooks for metrics, and mounts all route handlers.
2. Data management
   - The backend exposes REST routes to read and update portfolio data stored in MongoDB collections (projects, experiences, skills, honors, year-in-review, etc.). Administrative endpoints exist to refresh or snapshot data.
3. Resume & repo metadata
   - The app stores a resume PDF in `data/` and uses `pdf-parse` to extract text for display or indexing. Optionally, the system can fetch repository readmes (when a token is provided) to gather metadata used in the site.
4. Images and media
   - Routes and controllers handle image uploads, compression, and thumbnail generation (using `sharp`); there are folders for original and compressed assets.
5. Metrics and observability
   - The server collects simple operational metrics (API call counts, route latencies, memory usage) and logs hourly summaries to help monitor the service.
6. Scheduling and maintenance
   - Startup schedules periodic tasks to refresh snapshots and rebuild any derived data used by the site; these are configurable and run at controlled intervals.

Key backend routes (examples)

- `GET /` — root greeting and health check
- `GET /api` — API root information
- `/api/data/*` — CRUD endpoints for portfolio data (projects, experiences, skills, etc.)
- `/api/images/*` — image upload, serve, and manipulation endpoints
- `/api/admin/*` — management endpoints to trigger data refreshes or maintenance operations (used on-demand or by scheduled jobs)

Security & privacy notes

- This document omits any secret values. Required environment variable NAMES are listed below for operational reference only.
- Never commit `.env` files or plaintext credentials. Use your deployment platform's secret management features.
- GitHub access (optional) can be used to fetch repo metadata. If you do not provide a token, those steps will be skipped.

Key configuration items (names only)

- MONGO_URI — MongoDB connection string (DO NOT COMMIT)
- GITHUB_TOKEN — Optional GitHub personal access token (DO NOT COMMIT)
- PORT — server port (optional)
- MONGO_DB_NAME — optional database name override

How the frontend interacts with the backend

- The React frontend consumes REST APIs to retrieve and render portfolio data and media.
- Typical flows:
  1. Page load requests collection data (projects, experiences, skills) from `/api/data` endpoints.
  2. Media assets are served through `/api/images` with caching headers in production.
  3. Contact forms POST messages to an API endpoint which forwards or stores messages according to configuration.
  4. Admin or build-time actions can call admin endpoints to rebuild snapshots or refresh derived content.

Basic local run notes (sensitive values omitted)

- Create a `.env` file in `backend/` with required variables (e.g. `MONGO_URI`, `PORT`, optional `GITHUB_TOKEN`). Do not commit this file.
- Start the backend first so the server and any scheduled tasks initialize, then start the frontend dev server.

Commands (example - run these locally in your environment)

```powershell
# Backend (from backend/ folder)
# npm install
# npm start

# Frontend (separate terminal from frontend/ folder)
# npm install
# npm start
```

Operational caveats and assumptions

- The project depends on a MongoDB deployment that supports the features used by `config/mongodb.js`. For production, a hosted database provider is recommended.
- Image processing (sharp, puppeteer) can require native binaries; ensure your environment supports them.
- Some scheduled maintenance tasks assume stable network access and sufficient quotas for any external fetching operations.

Recommended next actions

- If you want a public-facing short README, I can produce a condensed, sanitized version that avoids any internal operational guidance.
- Add a `backend/README.md` with step-by-step local setup and environment variable examples (keeping secrets out). I can create this for you.
- If you want a file-level map or a sequence diagram of key flows (page load, media upload, admin refresh), tell me which to generate next.

End of deep explanation.
