/*
# Restrict word submissions to validated edge function only

1. Changes
- Drops the `insert_own_word` INSERT policy on `story_words` so the browser can
  no longer insert words directly via the Supabase client. The only path to add
  a word is now the `submit-word` edge function, which validates:
    * exactly one word (no internal whitespace)
    * purely alphabetic characters (A-Z, a-z) — no numbers, punctuation,
      emojis, symbols, or special characters
    * leading/trailing whitespace trimmed server-side
    * word exists in an English dictionary (rejects nonsense)
    * word is not obscene, profane, or otherwise inappropriate
- Adds a CHECK constraint on `story_words.word` enforcing `~ '^[a-zA-Z]+$'`
  as defense-in-depth so even direct (service-role) writes cannot store a
  non-alphabetic value.
- The 24-hour cooldown trigger `enforce_word_cooldown` remains unchanged and
  still fires on every insert.

2. Security
- RLS remains enabled on `story_words`.
- SELECT stays public (`read_story_public`, anon + authenticated) so visitors
  can still read the live story.
- INSERT via the anon/authenticated client is now blocked because there is no
  INSERT policy — inserts only succeed through the edge function using the
  service role, after validation.
- `user_id` is now supplied by the edge function from the verified JWT,
  rather than relying on the column default.
*/

-- Remove direct browser INSERT access; all inserts now go through the edge function.
DROP POLICY IF EXISTS "insert_own_word" ON story_words;

-- Defense-in-depth: enforce alphabetic-only at the column level.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'story_words_word_alpha_only'
      AND conrelid = 'story_words'::regclass
  ) THEN
    ALTER TABLE story_words
      ADD CONSTRAINT story_words_word_alpha_only CHECK (word ~ '^[a-zA-Z]+$');
  END IF;
END $$;
