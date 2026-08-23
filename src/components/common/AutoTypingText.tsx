import React, { useState, useEffect, useRef } from 'react';

interface AutoTypingTextProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  startDelay?: number;
}

export const AutoTypingText: React.FC<AutoTypingTextProps> = ({
  text,
  speed = 30,
  className = '',
  startDelay = 150
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLParagraphElement>(null);

  // Helper to split text into grapheme clusters (essential for Khmer Unicode characters)
  const getGraphemes = (str: string): string[] => {
    try {
      if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
        // @ts-ignore
        const segmenter = new Intl.Segmenter('km', { granularity: 'grapheme' });
        // @ts-ignore
        return Array.from(segmenter.segment(str), (s: any) => s.segment);
      }
    } catch {
      // Fallback
    }
    return Array.from(str);
  };

  // Trigger when element scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!hasStarted) return;

    const graphemes = getGraphemes(text);
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const startTimer = setTimeout(() => {
      intervalId = setInterval(() => {
        if (currentIndex < graphemes.length) {
          currentIndex++;
          setDisplayedText(graphemes.slice(0, currentIndex).join(''));
        } else {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, hasStarted, speed, startDelay]);

  return (
    <p ref={elementRef} className={`inline-block font-medium ${className}`}>
      <span>{displayedText}</span>
      {isTyping && (
        <span className="inline-block w-0.5 h-4 ml-0.5 bg-pink-300 animate-pulse align-middle" />
      )}
    </p>
  );
};
