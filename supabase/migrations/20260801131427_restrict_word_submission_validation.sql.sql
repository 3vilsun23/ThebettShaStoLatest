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
