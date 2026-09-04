# Byte Run — Coding Compiler

An online code judge platform, similar to Programizz. Users submit code, a worker executes it in an isolated Docker container, and the result is streamed back to the browser in real time over WebSockets via Redis Pub/Sub.

## Architecture

| Service                        | Tech                              | Role                                                                                   |
| ------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| [backend](backend)             | Bun, Express, Prisma, PostgreSQL   | REST API — auth, submissions; pushes submissions onto a Redis queue                    |
| [worker](worker)               | Bun, Docker, Redis                 | Consumes the submission queue, runs code inside language-specific Docker containers, posts results back to the backend |
| [websocket](websocket)         | Bun, ws, Redis                     | Subscribes to Redis Pub/Sub for submission results and broadcasts them to connected clients |
| [frontend](frontend)           | React, Vite, TailwindCSS           | UI — code editor, submissions, live result updates over WebSocket                      |

Flow: `frontend → backend (submit) → Redis queue → worker (executes in Docker) → backend (internal API) → Redis pub/sub → websocket → frontend`

## Prerequisites

- [Bun](https://bun.com) v1.3+
- [Docker](https://www.docker.com/) (used by `worker` to sandbox code execution)
- PostgreSQL database
- Redis instance

Pull the language images the worker uses before running submissions:

```bash
docker pull gcc:13
docker pull eclipse-temurin:21-jdk
docker pull node:22-alpine
docker pull python:3.12-alpine
```

## Setup

Install dependencies in each service:

```bash
cd backend && bun install
cd ../worker && bun install
cd ../websocket && bun install
cd ../frontend && bun install
```

### Environment variables

Each service has its own `.env` file. Copy/create one per service with the following keys:

**backend/.env**
```
DATABASE_URL=       # PostgreSQL connection string
REDIS_URL=          # Redis connection string
JWT_PRIVATE_KEY=    # secret used to sign JWTs
INTERNAL_API_TOKEN= # shared secret for internal worker -> backend calls
```

**worker/.env**
```
INTERNAL_API_TOKEN= # must match backend's INTERNAL_API_TOKEN
BACKEND_URL=         # e.g. http://localhost:3000
```

**websocket/.env**
```
PORT=       # e.g. 3001
REDIS_URL=  # Redis connection string
```

**frontend/.env** (see [frontend/.env.example](frontend/.env.example))
```
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3001
```

### Database

Run Prisma migrations from the `backend` folder:

```bash
cd backend
bunx prisma migrate dev
```

## Running the project

Start each service in its own terminal, in this order:

```bash
# 1. Backend API (port 3000)
cd backend && bun run dev

# 2. Websocket server (port from websocket/.env)
cd websocket && bun run index.ts

# 3. Worker (requires Docker running)
cd worker && bun run index.ts

# 4. Frontend (port 5173)
cd frontend && bun run dev
```

Then open the frontend at [http://localhost:5173](http://localhost:5173).

## Repo layout

```
backend/    Auth + submission REST API, Prisma schema, Postgres access
worker/     Redis queue consumer, Docker-based code runners (cpp, java, js, python)
websocket/  WebSocket server + Redis pub/sub subscriber for live submission results
frontend/   React + Vite web client
```
