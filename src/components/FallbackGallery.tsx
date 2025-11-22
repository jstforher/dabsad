'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Memory, SiteSettings } from '@/types/memory';

interface FallbackGalleryProps {
  memories: Memory[];
  settings: SiteSettings | null;
}

export default function FallbackGallery({ memories, settings }: FallbackGalleryProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter out secret memories for public view
  const visibleMemories = memories.filter(memory => !memory.is_secret);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMemory) return;

      if (e.key === 'Escape') {
        setSelectedMemory(null);
      } else if (e.key === 'ArrowLeft') {
        navigatePrevious();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemory, currentIndex]);

  const navigatePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : visibleMemories.length - 1;
    setCurrentIndex(newIndex);
    setSelectedMemory(visibleMemories[newIndex]);
  };

  const navigateNext = () => {
    const newIndex = currentIndex < visibleMemories.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedMemory(visibleMemories[newIndex]);
  };

  const openMemory = (memory: Memory, index: number) => {
    setSelectedMemory(memory);
    setCurrentIndex(index);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PHOTO':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'VIDEO':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'AUDIO':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
          Memory Gallery
        </h1>
        <p className="text-[var(--text-secondary)]">
          {visibleMemories.length} memories to explore
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {visibleMemories.map((memory, index) => (
          <div
            key={memory.id}
            onClick={() => openMemory(memory, index)}
            className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 glass-morphism hover:glow-primary"
          >
            {/* Memory Media */}
            <div className="w-full h-full relative">
              {memory.media_url ? (
                <Image
                  src={memory.media_url}
                  alt={memory.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                  <svg className="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Memory info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-semibold text-lg mb-1">{memory.title}</h3>
                <div className="flex items-center justify-between text-sm opacity-90">
                  <span>{formatDate(memory.date)}</span>
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(memory.category)}
                  </div>
                </div>
              </div>

              {/* Featured indicator */}
              {memory.is_featured && (
                <div className="absolute top-2 right-2">
                  <div className="w-8 h-8 bg-[var(--accent-star)] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--bg-primary)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Memory Modal */}
      {selectedMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] glass-morphism rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation buttons */}
            {visibleMemories.length > 1 && (
              <>
                <button
                  onClick={navigatePrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={navigateNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Memory content */}
            <div className="flex flex-col md:flex-row h-full">
              {/* Media area */}
              <div className="md:w-2/3 aspect-square md:aspect-auto bg-black/20">
                {selectedMemory.media_url ? (
                  <Image
                    src={selectedMemory.media_url}
                    alt={selectedMemory.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-24 h-24 text-white/50 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-white/50">No media available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Memory details */}
              <div className="md:w-1/3 p-6 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    {getCategoryIcon(selectedMemory.category)}
                    <span className="text-[var(--text-secondary)] text-sm">
                      {selectedMemory.category}
                    </span>
                    {selectedMemory.is_featured && (
                      <div className="w-6 h-6 bg-[var(--accent-star)] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-[var(--bg-primary)]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                    {selectedMemory.title}
                  </h2>

                  {selectedMemory.caption && (
                    <p className="text-[var(--text-secondary)] mb-6">
                      {selectedMemory.caption}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(selectedMemory.date)}
                    </div>
                  </div>
                </div>

                {/* Memory counter */}
                {visibleMemories.length > 1 && (
                  <div className="text-center text-[var(--text-secondary)] text-sm mt-6">
                    {currentIndex + 1} of {visibleMemories.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}