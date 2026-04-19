# Couple Letters (Next.js + Supabase)

Simple setup for backend with Supabase.

## 1. Install dependencies

```bash
pnpm install
```

## 2. Create environment file

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

- Option A (recommended): `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- Option B (simplest): `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The backend route will automatically use Option A first, and fallback to Option B.

## 3. Create database table

Open Supabase SQL Editor and run:

- `supabase/schema.sql`

## 4. Run app

```bash
pnpm dev
```

App calls Next backend route:

- `GET /api/letters`
- `POST /api/letters`

Supabase is only used on the server side in:

- `src/app/api/letters/route.ts`
- `src/lib/supabaseAdmin.ts`
