'use client';

import { useState, useEffect, useRef } from 'react';

interface MusicToggleProps {
  className?: string;
  musicUrl?: string;
}

export default function MusicToggle({ className = '', musicUrl = '/music/romantic-background.mp3' }: MusicToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;

      // Load state management
      const handleCanPlay = () => setIsLoaded(true);
      const handleLoadError = () => {
        console.warn('Background music could not be loaded');
        setIsLoaded(false);
      };

      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('error', handleLoadError);

      // Load user preference
      const savedPreference = localStorage.getItem('musicPreference');
      const savedVolume = localStorage.getItem('musicVolume');

      if (savedPreference === 'playing' && isLoaded) {
        audioRef.current.play().catch(() => {
          // Autoplay was prevented, user interaction required
          setIsPlaying(false);
        });
      }

      if (savedVolume) {
        setVolume(parseFloat(savedVolume));
        if (audioRef.current) {
          audioRef.current.volume = parseFloat(savedVolume);
        }
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplay', handleCanPlay);
          audioRef.current.removeEventListener('error', handleLoadError);
          audioRef.current.pause();
        }
      };
    }
  }, [musicUrl]);

  // Toggle play/pause
  const toggleMusic = () => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('musicPreference', 'paused');
    } else {
      audioRef.current.play().catch((error) => {
        console.warn('Music playback failed:', error);
      });
      setIsPlaying(true);
      localStorage.setItem('musicPreference', 'playing');
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    localStorage.setItem('musicVolume', newVolume.toString());
  };

  // Handle first user interaction for autoplay
  const handleFirstInteraction = () => {
    if (!isPlaying && isLoaded && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        localStorage.setItem('musicPreference', 'playing');
      }).catch(() => {
        // Still unable to play
      });
    }
  };

  if (!isLoaded) {
    return (
      <button
        className={`p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)] transition-colors ${className}`}
        disabled
        title="Music loading..."
      >
        <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </button>
    );
  }

  return (
    <div className="relative group">
      {/* Main toggle button */}
      <button
        onClick={() => {
          toggleMusic();
          handleFirstInteraction();
        }}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isPlaying
            ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'
        } ${className}`}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <div className="relative">
            <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        )}
      </button>

      {/* Volume control (shown on hover) */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="glass-morphism rounded-lg p-3 min-w-[120px] pointer-events-auto">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${volume * 100}%, var(--bg-secondary) ${volume * 100}%, var(--bg-secondary) 100%)`
              }}
            />
            <span className="text-xs text-[var(--text-secondary)] w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--accent-primary);
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: var(--accent-primary);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}