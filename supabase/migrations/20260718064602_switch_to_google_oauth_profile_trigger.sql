/*
# Switch profile trigger to Google OAuth metadata

1. Changes
- Updates `handle_new_user()` to derive `display_name` from Google OAuth
  metadata fields (`full_name`, `name`) instead of the legacy `username`
  field that was set during email/password sign-up (now removed).
- Falls back to the email prefix when no name is available.

2. Security
- No RLS or policy changes. Existing owner-scoped policies remain intact.
*/

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
  ON CONFLICT (id) DO UPDATE SET display_name = COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$;
