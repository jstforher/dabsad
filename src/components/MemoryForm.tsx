'use client';

import { useState, useEffect } from 'react';
import { Memory, CreateMemoryData } from '@/types/memory';

interface MemoryFormProps {
  memory?: Memory | null;
  onSubmit: (data: CreateMemoryData, file?: File) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function MemoryForm({ memory, onSubmit, onCancel, isLoading = false }: MemoryFormProps) {
  const [formData, setFormData] = useState<CreateMemoryData>({
    title: '',
    caption: '',
    media_url: '',
    category: 'PHOTO',
    date: new Date().toISOString(),
    orbit_radius: 5.0,
    is_secret: false,
    is_featured: false,
    order: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (memory) {
      setFormData({
        title: memory.title,
        caption: memory.caption || '',
        media_url: memory.media_url,
        category: memory.category,
        date: memory.date,
        orbit_radius: memory.orbit_radius,
        is_secret: memory.is_secret,
        is_featured: memory.is_featured,
        order: memory.order,
      });
      setPreview(memory.media_url);
    }
  }, [memory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError(null);
      await onSubmit(formData, selectedFile || undefined);
    } catch (error) {
      setError('Failed to save memory. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Allowed: JPG, PNG, MP4, WebM, MP3, WAV');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Media File
        </label>
        <div className="space-y-4">
          {/* Preview */}
          {preview && (
            <div className="relative w-full h-48 bg-[var(--bg-secondary)]/30 rounded-lg overflow-hidden">
              {preview.match(/\.(mp4|webm)$/i) ? (
                <video
                  src={preview}
                  className="w-full h-full object-contain"
                  controls
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}

          {/* File input */}
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*"
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="w-full px-4 py-3 bg-[var(--bg-secondary)]/50 border border-dashed border-white/20 rounded-lg text-[var(--text-secondary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm">
                {selectedFile ? selectedFile.name : 'Choose file or drag and drop'}
              </span>
              <span className="block text-xs mt-1">
                Max 10MB • Images, Videos, Audio
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            placeholder="Enter memory title"
          />
        </div>

        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Caption
          </label>
          <textarea
            id="caption"
            name="caption"
            rows={3}
            value={formData.caption}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent resize-none"
            placeholder="Enter memory caption (optional)"
          />
        </div>
      </div>

      {/* Memory Properties */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
          >
            <option value="PHOTO">Photo</option>
            <option value="VIDEO">Video</option>
            <option value="AUDIO">Audio</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Date
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date.slice(0, 16)}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
          />
        </div>
      </div>

      {/* 3D Position */}
      <div className="space-y-4">
        <div>
          <label htmlFor="orbit_radius" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Orbit Radius: {formData.orbit_radius.toFixed(1)}
          </label>
          <input
            type="range"
            id="orbit_radius"
            name="orbit_radius"
            min="2"
            max="10"
            step="0.1"
            value={formData.orbit_radius}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--text-secondary)]">
            <span>Close</span>
            <span>Far</span>
          </div>
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Display Order
          </label>
          <input
            type="number"
            id="order"
            name="order"
            min="0"
            value={formData.order}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
          />
        </div>
      </div>

      {/* Special Properties */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Special Properties
        </label>

        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="mr-3 w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-white/10 rounded focus:ring-[var(--accent-primary)] focus:ring-2"
            />
            <span className="text-[var(--text-primary)]">Featured Memory</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_secret"
              checked={formData.is_secret}
              onChange={handleChange}
              className="mr-3 w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-white/10 rounded focus:ring-[var(--accent-primary)] focus:ring-2"
            />
            <span className="text-[var(--text-primary)]">Secret Memory</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-[var(--accent-primary)] text-white rounded-lg font-medium hover:bg-[var(--accent-secondary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {memory ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            memory ? 'Update Memory' : 'Create Memory'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm text-[var(--text-primary)] rounded-lg font-medium hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}