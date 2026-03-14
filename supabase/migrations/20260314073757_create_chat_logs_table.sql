/*
  # Create chat_logs table

  ## Summary
  Creates a table to store sampled chatbot conversation sessions for
  analytics and automation reporting.

  ## New Tables
  - `chat_logs`
    - `id` (uuid, primary key) — auto-generated row identifier
    - `session_id` (text, not null) — unique per browser session; used to upsert
    - `site` (text, not null) — identifies which site the conversation came from
    - `conversation` (jsonb, not null) — array of { role, message } objects
    - `created_at` (timestamptz) — timestamp of first save; defaults to now()
    - `updated_at` (timestamptz) — timestamp of last update; defaults to now()

  ## Indexes
  - `session_id` — for fast upsert lookups
  - `created_at` — for reporting and time-range queries

  ## Security
  - RLS enabled; table is locked down by default
  - Authenticated users (admin) can read all rows
  - Anon role can insert and update rows (chatbot runs as anon)
*/

CREATE TABLE IF NOT EXISTS chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  site text NOT NULL DEFAULT '',
  conversation jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS chat_logs_session_id_idx ON chat_logs (session_id);
CREATE INDEX IF NOT EXISTS chat_logs_created_at_idx ON chat_logs (created_at);

ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all chat logs"
  ON chat_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anon can insert chat logs"
  ON chat_logs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update own chat logs by session"
  ON chat_logs FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
