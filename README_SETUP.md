# Setup & Run Instructions (Social Media Dashboard)

This document explains how to prepare the database, configure environment variables, and run the backend and frontend locally.

## Backend (Express + Postgres)

1. Install dependencies

   Open a terminal in `backend` and run:

   ```cmd
   cd backend
   npm install
   ```

2. Configure environment variables

   - Copy `backend/.env.example` to `backend/.env` and fill in your database credentials and a `JWT_SECRET`.

3. Create the PostgreSQL schema

   Execute the following SQL in your Postgres database (psql or a DB GUI):

   ```sql
   -- users table
   CREATE TABLE IF NOT EXISTS users (
     user_id SERIAL PRIMARY KEY,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );

   -- social_accounts table (simple mock storage)
   CREATE TABLE IF NOT EXISTS social_accounts (
     account_id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
     platform TEXT NOT NULL,
     username TEXT NOT NULL,
     access_token TEXT,
     refresh_token TEXT,
     token_expires_at TIMESTAMP WITH TIME ZONE,
     connected_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

4. Start the backend

   ```cmd
   cd backend
   npm run dev
   ```

   - The server listens on `http://localhost:5000` by default (see `PORT` in `.env`).

## Frontend (Vite + React)

1. Install dependencies

   ```cmd
   cd frontend
   npm install
   ```

2. Start the dev server

   ```cmd
   npm run dev
   ```

   - Vite will start on `http://localhost:5173` (or another port if 5173 is busy).

## Quick manual checks

- Register a new user: POST `/auth/register` (frontend Register page handles this).
- Login: POST `/auth/login` — the frontend Login page currently uses localStorage for `token` (you may need to add login form wiring if desired).
- Integrations: Connect mock accounts via the frontend Integrations page (calls `/social/connect`).
- Feed: Visit `/feed` to fetch posts from `/social/feed`.

## Notes and troubleshooting

- Make sure the backend `.env` DB credentials match a running Postgres instance.
- If you see CORS errors, the backend has `cors()` enabled by default; ensure you are using the correct frontend origin.
- Secrets: For production use a strong `JWT_SECRET` and never commit `.env` to source control.

If you'd like, I can:
- Add SQL migration scripts and a seed script to create sample users and accounts.
- Wire the Login page to call the backend and store the token in `localStorage` automatically.
- Add a `Makefile` or npm scripts to run both servers concurrently.
