import React, { useState, useEffect, useCallback } from 'react';

export const FALLBACK_QUOTES = [
  'Discipline is choosing between what you want now and what you want most.',
  'Small daily improvements over time lead to stunning results.',
  'Success is nothing more than a few simple disciplines, practiced every day.',
  'You do not rise to the level of your goals. You fall to the level of your systems.',
  'Consistency is harder when no one is clapping for you. Keep going anyway.',
  'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
  'One day or day one. You decide every single morning.',
  'Motivation gets you started. Habit and discipline keep you going.'
];

export default function Motivation() {
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0]);
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const pickFallbackQuote = useCallback((currentQuote) => {
    const candidates = FALLBACK_QUOTES.filter((q) => q !== currentQuote);
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex] || FALLBACK_QUOTES[0];
  }, []);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://dummyjson.com/quotes/random');
      if (!response.ok) {
        throw new Error('Quote API unavailable');
      }
      const data = await response.json();
      if (data && data.quote) {
        setQuote(data.quote);
        setAuthor(data.author || '');
      } else {
        setQuote((prev) => pickFallbackQuote(prev));
        setAuthor('');
      }
    } catch (error) {
      setQuote((prev) => pickFallbackQuote(prev));
      setAuthor('');
    } finally {
      setLoading(false);
    }
  }, [pickFallbackQuote]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return (
    <div className="motivation-banner">
      <div className="motivation-text-wrap">
        <p className="motivation-quote">
          &ldquo;{quote}&rdquo;
          {author ? <span className="motivation-author"> &mdash; {author}</span> : null}
        </p>
      </div>
      <button
        type="button"
        onClick={fetchQuote}
        disabled={loading}
        className="sketch-btn sketch-btn-small"
        title="Get another motivational quote"
        aria-label="New motivational quote"
      >
        {loading ? '...' : 'New Quote'}
      </button>
    </div>
  );
}
