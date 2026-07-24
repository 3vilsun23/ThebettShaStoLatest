/*
# Update profile trigger to use chosen username

1. Changes
- Updates `handle_new_user()` to prefer the `username` field from `raw_user_meta_data`
  (passed during signUp) instead of `full_name`/`name` from OAuth providers.
- Falls back to email prefix if no username is provided.

2. Security
- No RLS or policy changes. Existing policies remain intact.
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
      NEW.raw_user_meta_data->>'username',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO UPDATE SET display_name = COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$;
