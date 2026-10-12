import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Pause, Play, Square, AlertCircle } from 'lucide-react';

interface VoiceReaderProps {
  contentSelector?: string;
  className?: string;
}

export const VoiceReader: React.FC<VoiceReaderProps> = ({
  contentSelector = 'main',
  className = '',
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [currentTextLength, setCurrentTextLength] = useState<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  // Cleanup on unmount or page change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const extractReadableText = (): string => {
    const mainEl = document.querySelector(contentSelector) || document.body;
    if (!mainEl) return '';

    // Clone element to sanitize without affecting DOM
    const clone = mainEl.cloneNode(true) as HTMLElement;

    // Remove non-content and decorative elements
    const ignoredSelectors = [
      'nav',
      'header',
      'footer',
      'script',
      'style',
      'noscript',
      'button',
      '[aria-hidden="true"]',
      '.sr-only',
      'svg',
      'code',
      '[data-voice-ignore="true"]',
    ];

    ignoredSelectors.forEach((sel) => {
      clone.querySelectorAll(sel).forEach((el) => el.remove());
    });

    const text = clone.innerText || clone.textContent || '';
    // Clean up excessive whitespace
    return text
      .replace(/\s+/g, ' ')
      .replace(/(\n\s*)+/g, '\n')
      .trim();
  };

  const handleStartSpeaking = () => {
    if (!isSupported) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    const readableText = extractReadableText();
    if (!readableText) return;

    setCurrentTextLength(readableText.length);

    const utterance = new SpeechSynthesisUtterance(readableText);
    utteranceRef.current = utterance;

    // Configure pleasant natural voice settings
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Try to pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setStatus('playing');
    };

    utterance.onend = () => {
      setStatus('idle');
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or interruption:', e);
      setStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!isSupported) return;
    if (status === 'playing') {
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  };

  const handleResume = () => {
    if (!isSupported) return;
    if (status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('playing');
    }
  };

  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setStatus('idle');
  };

  if (!isSupported) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/60 ${className}`}
        title="Web Speech API not supported in this browser"
      >
        <VolumeX className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Speech unsupported</span>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Voice accessibility controls"
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 transition-colors shadow-sm ${className}`}
    >
      {/* Live Region for Screen Readers */}
      <span className="sr-only" aria-live="polite">
        {status === 'playing'
          ? 'Reading page aloud'
          : status === 'paused'
          ? 'Speech paused'
          : 'Speech stopped'}
      </span>

      {status === 'idle' ? (
        <button
          onClick={handleStartSpeaking}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-white dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Listen to Page: Read main content aloud"
          title="Listen to Page: Read main content aloud"
        >
          <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="whitespace-nowrap font-medium">Listen to Page</span>
        </button>
      ) : (
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status === 'playing' ? 'bg-teal-400 opacity-75' : 'bg-amber-400 opacity-50'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'playing' ? 'bg-teal-500' : 'bg-amber-500'}`}></span>
            </span>
            <span>{status === 'playing' ? 'Reading…' : 'Paused'}</span>
          </div>

          {status === 'playing' ? (
            <button
              onClick={handlePause}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Pause speech"
              title="Pause speech"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleResume}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Resume speech"
              title="Resume speech"
            >
              <Play className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            </button>
          )}

          <button
            onClick={handleStop}
            className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-label="Stop reading aloud"
            title="Stop reading aloud"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      )}
    </div>
  );
};
