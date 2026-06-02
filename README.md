# Nord Store

Nord Store is a fullstack e-commerce application built with Angular, Express, MongoDB, and Redis.

The project follows a separated frontend/backend architecture and is designed to simulate a real online store with product browsing, user authentication, cart management, and order flow.

## Tech Stack

### Frontend
- Angular
- TypeScript
- RxJS
- Angular Router
- Angular Forms
- SCSS / CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- REST API
- JWT Authentication

## Project Structure

```txt
nord-store/
├── frontend/
│   └── Angular application
│
├── backend/
│   └── Express API + MongoDB + Redis cache
│
├── README.md
└── .gitignore
```

## Getting Started

Install dependencies for the root workspace, backend, and frontend:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Create `backend/.env` from `backend/.env.example` and set the required values:

```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?appName=<app-name>
REDIS_URL=redis://localhost:6379
REDIS_CACHE_TTL_SECONDS=300
SEED_PRODUCT_COUNT=160
```

Redis is optional. For local development, the recommended setup is Docker Compose:

```bash
docker compose up -d redis
docker compose logs redis
docker compose down
```

The backend does not start Redis itself. It only connects to the Redis instance configured through `REDIS_URL`. For cloud or production Redis, use a provider URL such as:

```env
REDIS_URL=rediss://<username>:<password>@<host>:<port>
```

The backend health endpoint includes MongoDB and Redis status:

```bash
curl http://localhost:3000/api/health
```

If `MONGODB_URI` is missing, database-backed endpoints such as login, signup, products, cart, and orders return `503` with:

```json
{ "message": "MONGODB_URI is not configured." }
```

If `REDIS_URL` is missing or Redis is unavailable, the backend continues to run without product API caching.

Seed MongoDB and pre-warm Redis product cache with deterministic mock catalog data:

```bash
docker compose up -d redis
npm run seed:backend
```

The seed command upserts products by title, creates a seed admin user if needed, and does not delete existing MongoDB documents. Redis is filled only when `REDIS_URL` is configured and reachable.

Start both apps from the project root:

```bash
npm start
```

This runs the backend API and Angular frontend together with `concurrently`:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:4200`

You can also run them individually:

```bash
npm run dev:backend
npm run dev:frontend
```

## Root Scripts

```bash
npm start      # start backend and frontend together
npm run dev    # same as npm start
npm run build  # build backend and frontend
npm test       # run backend and frontend tests
```
