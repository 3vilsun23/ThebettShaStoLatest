import { useEffect, useState, useCallback } from 'react';
import { supabase, type StoryWord } from './supabase';

export function useStory() {
  const [words, setWords] = useState<StoryWord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = useCallback(async () => {
    const { data, error } = await supabase
      .from('story_words')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to load story:', error.message);
    } else {
      setWords(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWords();

    const channel = supabase
      .channel('story_words_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'story_words' },
        (payload) => {
          setWords((prev) => [...prev, payload.new as StoryWord]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchWords]);

  return { words, loading, refetch: fetchWords };
}
