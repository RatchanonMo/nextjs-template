create extension if not exists pgcrypto;

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  sender text not null default 'ฉัน',
  recipient text not null check (recipient in ('นนท์', 'รัน')),
  title text not null,
  message text not null,
  tone text not null default 'sweet' check (tone in ('sweet', 'gratitude', 'care', 'memory')),
  delivery text not null default 'today' check (delivery in ('today', 'tonight', 'weekend')),
  created_at timestamptz not null default now()
);

create index if not exists idx_letters_created_at on public.letters(created_at desc);
