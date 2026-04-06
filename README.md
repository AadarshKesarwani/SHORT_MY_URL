# ShortMyURL

ShortMyURL is a URL shortener backend built with Express and TypeScript.  
It creates short links, resolves short links to original URLs, tracks clicks, and uses Redis + MongoDB for performance and persistence.

## Features

- Create short URLs from valid original URLs
- Redirect from `/:shortUrl` to the original URL
- Track click counts
- Redis-backed atomic counter for short code generation
- Redis cache for fast URL lookups
- tRPC API for URL operations
- Correlation ID middleware and rotating Winston logs

## Tech Stack

- Node.js
- Express 5
- TypeScript
- tRPC + Zod
- MongoDB + Mongoose
- Redis
- Winston (`winston-daily-rotate-file`)

## Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or remote)
- Redis (local or remote)

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3001
BASE_URL=http://localhost:3001
MONGO_URI=mongodb://localhost:27017/short_my_url
REDIS_URI=redis://localhost:6379
REDIS_COUNTER_KEY=short_my_url:counter
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3001` | Express server port |
| `BASE_URL` | No | `http://localhost:3001` | Base URL used to build short links |
| `MONGO_URI` | No | `mongodb://localhost:27017/short_my_url` | MongoDB connection string |
| `REDIS_URI` | No | `redis://localhost:6379` | Redis connection string |
| `REDIS_COUNTER_KEY` | No | `short_my_url:counter` | Redis key used for short code counter |

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Ensure MongoDB and Redis are running.

3. Start in development mode:

```bash
npm run dev
```

Alternative start command:

```bash
npm start
```

## API Usage

### REST Endpoints

- `GET /api/v1/ping/`
- `GET /api/v1/ping/health`
- `GET /:shortUrl` -> Redirects to original URL

### tRPC Endpoints (`/trpc`)

- `url.create` (mutation)
  - input: `{ "originalUrl": "https://example.com" }`
- `url.getOriginalUrl` (query)
  - input: `{ "shortUrl": "abc123" }`

## How Short URL Generation Works

1. Redis atomic counter increments.
2. Counter value is encoded to Base62.
3. Encoded value becomes the short code.
4. Mapping is stored in MongoDB and cached in Redis.

## Project Structure

```text
src/
  config/        # env, db, redis, logger setup
  controllers/   # route handlers
  repositories/  # database layer
  routers/       # v1/v2 and tRPC routers
  services/      # business logic
  middleware/    # shared middleware
  utils/         # helpers (e.g., Base62)
```

## Logging and Observability

- Structured logs using Winston
- Daily rotating log files
- Correlation ID support for request tracing

## Current Limitations

- Test suite is not added yet
- Deployment configuration is not included yet
- `v2` router is present but currently minimal

## Roadmap

- Add unit and integration tests
- Add production deployment setup (Docker/CI)
- Add analytics endpoints
- Add rate limiting and abuse protection
- Add custom aliases for short URLs