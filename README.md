# K-Expression Learner

A personalized K-drama expression learning tool

## Stack
- Backend: Node.js + Express + SQLite
- Frontend: React + Vite + React Router + Axios
- Database file: `data/expressions.db`

## Install
```bash
npm install
cd src/frontend && npm install
```

## Development
Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
cd src/frontend
npm start
```

Open `http://localhost:3300`

The Express server runs on `3300`. During development it proxies the frontend dev server running on `3301`, so the browser entry stays consistent.

## Production-style build
```bash
npm run build
npm start
```

Then open `http://localhost:3300`.

## Project Structure
- src/backend: Express server + SQLite
- src/frontend: React app
- data/: JSON data + SQLite database
