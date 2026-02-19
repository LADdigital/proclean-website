/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, required) - sender's full name
      - `email` (text, required) - sender's email address
      - `phone` (text, optional) - sender's phone number
      - `service` (text, optional) - service they're interested in
      - `message` (text, required) - their message
      - `created_at` (timestamptz, auto-generated) - submission timestamp
      - `read` (boolean, default false) - whether the submission has been read

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add INSERT policy for anonymous users (public contact form)
    - No SELECT/UPDATE/DELETE policies for anonymous users (admin only via dashboard)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  service text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    length(name) > 0 AND
    length(email) > 0 AND
    length(message) > 0
  );
