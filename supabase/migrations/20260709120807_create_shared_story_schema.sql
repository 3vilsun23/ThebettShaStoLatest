/*
# Create The Shared Story schema

1. New Tables
- `story_words`
  - `id` (uuid, primary key)
  - `word` (text, not null) — a single word contributed to the story
  - `user_id` (uuid, not null, defaults to the authenticated user) — contributor
  - `author_name` (text, not null) — display name of the contributor at time of contribution
  - `created_at` (timestamptz, default now()) — when the word was added
- `profiles`
  - `id` (uuid, primary key, references auth.users) — the user
  - `display_name` (text, not null) — name shown on contributions
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- `story_words` SELECT is public (anon + authenticated) so unsigned-in visitors can read the live story.
- `story_words` INSERT is authenticated only, with a 24-hour cooldown enforced by a trigger that rejects inserts if the same user already contributed within the last 24 hours.
- `profiles` CRUD is owner-scoped (authenticated, auth.uid() = id).

3. Cooldown enforcement
- A BEFORE INSERT trigger function `enforce_word_cooldown()` checks whether the contributing user has a row in `story_words` with `created_at > now() - interval '24 hours'`. If so, it raises an exception, blocking the insert. This makes the 24-hour-per-word rule server-enforced and tamper-proof.

4. Important notes
- The story is intentionally public/shared, so SELECT uses `USING (true)` for anon + authenticated — documented here as intentional.
- `user_id` defaults to `auth.uid()` so client inserts omitting it still satisfy the INSERT policy.
*/

CREATE TABLE IF NOT EXISTS story_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS story_words_created_at_idx ON story_words (created_at);
CREATE INDEX IF NOT EXISTS story_words_user_id_idx ON story_words (user_id);

ALTER TABLE story_words ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_story_public" ON story_words;
CREATE POLICY "read_story_public" ON story_words FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_word" ON story_words;
CREATE POLICY "insert_own_word" ON story_words FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_own_profile" ON profiles;
CREATE POLICY "read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Auto-create a profile row when a new auth user is created.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enforce 24-hour cooldown: a user may add at most one word per 24 hours.
CREATE OR REPLACE FUNCTION enforce_word_cooldown()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_word_at timestamptz;
BEGIN
  SELECT created_at INTO last_word_at
  FROM public.story_words
  WHERE user_id = NEW.user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND AND last_word_at > now() - interval '24 hours' THEN
    RAISE EXCEPTION 'You can only add one word every 24 hours. Please wait until your cooldown expires.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS before_insert_story_word ON story_words;
CREATE TRIGGER before_insert_story_word
  BEFORE INSERT ON story_words
  FOR EACH ROW EXECUTE FUNCTION enforce_word_cooldown();
