# Hospital Management System Platform

Clean monorepo layout for the HMS backend and one Vite React client.

## Structure

```text
server/
  src/
    controllers/
    db/
    middlewares/
    models/
    routes/
    utils/
client/
  src/
    components/
      forms/
      ui/
    data/
    layouts/
    pages/
    sections/
    services/
  tailwind.config.js
  postcss.config.js
```

## Apps

- `server`: Express and MongoDB API.
- `client`: Vite React + Tailwind app with admin dashboard pages and front display page.

## Commands

```bash
npm install
npm run dev:server
npm run dev:client
```

The client uses `VITE_API_BASE_URL` when connecting to the API. Default:

```bash
http://localhost:5000/api
```
