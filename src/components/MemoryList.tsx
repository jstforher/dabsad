'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Memory } from '@/types/memory';

interface MemoryListProps {
  memories: Memory[];
  onEdit: (memory: Memory) => void;
  onDelete: (memoryId: string) => void;
}

export default function MemoryList({ memories, onEdit, onDelete }: MemoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch = memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (memory.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesCategory = filterCategory === 'all' || memory.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'featured' && memory.is_featured) ||
                         (filterStatus === 'secret' && memory.is_secret) ||
                         (filterStatus === 'regular' && !memory.is_featured && !memory.is_secret);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PHOTO': return 'bg-green-500/20 text-green-400';
      case 'VIDEO': return 'bg-blue-500/20 text-blue-400';
      case 'AUDIO': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
        >
          <option value="all">All Categories</option>
          <option value="PHOTO">Photos</option>
          <option value="VIDEO">Videos</option>
          <option value="AUDIO">Audio</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="featured">Featured</option>
          <option value="secret">Secret</option>
          <option value="regular">Regular</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-[var(--text-secondary)]">
        Showing {filteredMemories.length} of {memories.length} memories
      </div>

      {/* Memory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.map((memory) => (
          <div
            key={memory.id}
            className="glass-morphism rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Thumbnail */}
              <div className="w-full sm:w-24 h-32 sm:h-auto bg-[var(--bg-secondary)]/30 relative">
                {memory.media_url ? (
                  <Image
                    src={memory.media_url}
                    alt={memory.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 96px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate flex-1 mr-2">
                    {memory.title}
                  </h3>
                  <div className="flex gap-1">
                    {memory.is_featured && (
                      <span className="px-2 py-1 bg-[var(--accent-star)]/20 rounded-full">
                        <svg className="w-3 h-3 text-[var(--accent-star)]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    )}
                    {memory.is_secret && (
                      <span className="px-2 py-1 bg-[var(--accent-secondary)]/20 rounded-full">
                        <svg className="w-3 h-3 text-[var(--accent-secondary)]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(memory.category)}`}>
                    {memory.category}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {formatDate(memory.date)}
                  </span>
                </div>

                {memory.caption && (
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                    {memory.caption}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => onEdit(memory)}
                    className="flex-1 px-3 py-1.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded text-sm hover:bg-[var(--accent-primary)]/20 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(memory.id)}
                    className="flex-1 px-3 py-1.5 bg-red-500/10 text-red-400 rounded text-sm hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredMemories.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-[var(--text-secondary)]">
            {memories.length === 0 ? 'No memories yet' : 'No memories match your filters'}
          </p>
        </div>
      )}
    </div>
  );
}