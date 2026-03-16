# Final Project Backend

## Run

```bash
npm install
npm run db:init
npm run dev
```

Server runs on `http://localhost:3000` by default.

## Environment

Create `backend/.env` from `.env.example` and set your MySQL credentials.

Required variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## API Endpoints

- `GET /api/health`
- `GET /api/appointments`
- `POST /api/appointments`
- `DELETE /api/appointments/:id`
- `GET /api/contacts`
- `POST /api/contacts`
- `DELETE /api/contacts/:id`
- `GET /api/reminders`
- `POST /api/reminders`
- `DELETE /api/reminders/:id`
- `GET /api/services`
- `POST /api/emergency`
- `GET /api/emergency/alerts`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/caregivers`
- `POST /api/caregivers`

## Manual SQL Option

You can also run the schema directly:

```bash
mysql -u root -p < sql/schema.sql
```
