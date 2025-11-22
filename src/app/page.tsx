'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import TypewriterEffect from '@/components/TypewriterEffect';

export default function Home() {
  const [showExploreButton, setShowExploreButton] = useState(false);

  useEffect(() => {
    // Show explore button after typewriter completes
    const timer = setTimeout(() => {
      setShowExploreButton(true);
    }, 3000); // Adjust timing based on typewriter length

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] relative overflow-hidden">

      {/* Background animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[var(--accent-primary)] rounded-full opacity-5 blur-3xl -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-[var(--accent-secondary)] rounded-full opacity-5 blur-3xl -bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-64 h-64 bg-[var(--accent-star)] rounded-full opacity-3 blur-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        {/* Romantic title with typewriter effect */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[var(--text-primary)] mb-4 font-poppins">
            <TypewriterEffect
              text="Made for you,"
              speed={150}
              className="inline-block"
            />
          </h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[var(--accent-primary)] font-poppins animate-fade-in">
            my universe
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '3s', animationFillMode: 'forwards' }}>
          A journey through memories floating in space, where every moment tells our story
        </p>

        {/* Call-to-action button */}
        <div className={`transition-all duration-1000 transform ${showExploreButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/universe"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full overflow-hidden btn-romantic glow-primary hover:glow-secondary transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10">Enter Our Universe</span>
            <svg
              className="relative z-10 w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '4s', animationFillMode: 'forwards' }}>
        <div className="flex flex-col items-center text-[var(--text-secondary)]">
          <span className="text-sm mb-2">Begin your journey</span>
          <div className="animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating hearts decoration */}
      <div className="absolute top-20 right-10 text-[var(--accent-secondary)] opacity-20 animate-float">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="absolute top-40 left-20 text-[var(--accent-primary)] opacity-15 animate-float" style={{ animationDelay: '1s' }}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="absolute bottom-40 right-16 text-[var(--accent-star)] opacity-10 animate-float" style={{ animationDelay: '2s' }}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(5deg);
          }
          66% {
            transform: translateY(5px) rotate(-5deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
