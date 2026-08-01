import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Built-in profanity list — exact match on the lowercased word or any
// profane substring embedded in the submission. Covers common obscene/
// profane terms and slurs so the story stays appropriate.
const PROFANITY = [
  "anal", "arse", "ass", "asshole", "bastard", "bitch", "bollocks", "boob",
  "bullshit", "cock", "coon", "crap", "cunt", "damn", "dick", "dildo",
  "dyke", "fag", "faggot", "fuck", "fucker", "fucking", "goddamn",
  "jackass", "jerk", "jizz", "knob", "motherfucker", "nigga", "nigger",
  "nipple", "penis", "piss", "prick", "pussy", "retard", "retarded",
  "shit", "shite", "slut", "spastic", "spunk", "twat", "vagina", "wank",
  "wanker", "whore", "wtf",
];

function isProfane(word: string): boolean {
  const lower = word.toLowerCase();
  return PROFANITY.some((bad) => lower === bad || lower.includes(bad));
}

// Validate that the word exists in an English dictionary using the free
// Free Dictionary API (no API key required). Returns true if the API
// confirms the word is a real English word.
async function isInDictionary(word: string): Promise<boolean> {
  const lower = word.toLowerCase();
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lower)}`;
  try {
    const resp = await fetch(url, { method: "GET" });
    if (resp.status === 200) return true;
    return false;
  } catch {
    // If the dictionary API is unreachable, reject to avoid accepting
    // nonsense words when validation cannot be confirmed.
    return false;
  }
}

function json(error: string, status: number) {
  return new Response(
    JSON.stringify({ error }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json("You must be signed in to submit a word.", 401);
    }

    const body = await req.json();
    const rawWord: string | undefined = body?.word;

    if (typeof rawWord !== "string") {
      return json("Please enter a word.", 400);
    }

    // Trim leading/trailing whitespace
    const trimmed = rawWord.trim();

    if (trimmed.length === 0) {
      return json("Please enter a word — empty input is not allowed.", 400);
    }

    // Reject anything containing internal whitespace (must be a single word)
    if (/\s/.test(trimmed)) {
      return json("Only a single word is allowed — no spaces between words.", 400);
    }

    // Must be purely alphabetic A-Z a-z. Rejects numbers, punctuation,
    // emojis, symbols, and any special characters.
    if (!/^[A-Za-z]+$/.test(trimmed)) {
      return json(
        "Only letters A–Z are allowed. Numbers, punctuation, emojis, and symbols are not permitted.",
        400,
      );
    }

    if (trimmed.length > 50) {
      return json("That word is too long. Please keep it under 50 characters.", 400);
    }

    const lower = trimmed.toLowerCase();

    if (isProfane(lower)) {
      return json(
        "That word is not allowed. Inappropriate or profane language is rejected.",
        400,
      );
    }

    const validWord = await isInDictionary(lower);
    if (!validWord) {
      return json(
        `"${trimmed}" is not a recognized English word. Please submit a valid dictionary word.`,
        400,
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    // Verify the caller's identity using their JWT (anon-key client + bearer).
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return json("Your session has expired. Please sign in again.", 401);
    }
    const user = userData.user;

    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Anonymous";

    // Insert with the service role so the only path to write is through this
    // validated edge function — the direct INSERT policy is removed. The
    // 24-hour cooldown trigger still fires on every insert regardless of role.
    const serviceClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { error: insertError } = await serviceClient.from("story_words").insert({
      word: lower,
      user_id: user.id,
      author_name: displayName,
    });

    if (insertError) {
      const msg = insertError.message ?? "";
      if (msg.includes("24 hours") || msg.includes("cooldown")) {
        return json(
          "You can only add one word every 24 hours. Please wait for your cooldown to expire.",
          429,
        );
      }
      return json("Something went wrong while saving your word. Please try again.", 500);
    }

    return new Response(
      JSON.stringify({ success: true, word: lower }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return json(err instanceof Error ? err.message : "Unexpected error.", 500);
  }
});
