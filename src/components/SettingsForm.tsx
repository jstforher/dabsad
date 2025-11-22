'use client';

import { useState } from 'react';
import { SiteSettings } from '@/types/memory';

interface SettingsFormProps {
  settings: SiteSettings | null;
  onUpdate: (settings: Partial<SiteSettings>) => void;
}

export default function SettingsForm({ settings, onUpdate }: SettingsFormProps) {
  const [formData, setFormData] = useState<Partial<SiteSettings>>({
    rotation_speed: settings?.rotation_speed ?? 0.001,
    particle_count: settings?.particle_count ?? 1000,
    music_enabled: settings?.music_enabled ?? true,
    auto_rotate: settings?.auto_rotate ?? true,
    theme_color_primary: settings?.theme_color_primary ?? '#9b6cff',
    theme_color_secondary: settings?.theme_color_secondary ?? '#ff6b8a',
    theme_color_star: settings?.theme_color_star ?? '#f6f7ff',
  });

  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    }));
    setIsDirty(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDirty) {
      onUpdate(formData);
      setIsDirty(false);
    }
  };

  const resetToDefaults = () => {
    setFormData({
      rotation_speed: 0.001,
      particle_count: 1000,
      music_enabled: true,
      auto_rotate: true,
      theme_color_primary: '#9b6cff',
      theme_color_secondary: '#ff6b8a',
      theme_color_star: '#f6f7ff',
    });
    setIsDirty(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Animation Settings */}
      <div className="glass-morphism rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Animation Settings</h3>

        <div className="space-y-6">
          <div>
            <label htmlFor="auto_rotate" className="flex items-center justify-between">
              <span className="text-[var(--text-primary)]">Auto-rotate Camera</span>
              <input
                type="checkbox"
                id="auto_rotate"
                name="auto_rotate"
                checked={formData.auto_rotate}
                onChange={handleChange}
                className="w-5 h-5 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-white/10 rounded focus:ring-[var(--accent-primary)] focus:ring-2"
              />
            </label>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Automatically rotate the 3D universe camera
            </p>
          </div>

          <div>
            <label htmlFor="rotation_speed" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Rotation Speed: {formData.rotation_speed?.toFixed(3)}
            </label>
            <input
              type="range"
              id="rotation_speed"
              name="rotation_speed"
              min="0"
              max="0.01"
              step="0.0001"
              value={formData.rotation_speed}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>

          <div>
            <label htmlFor="particle_count" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Particle Count: {formData.particle_count}
            </label>
            <input
              type="range"
              id="particle_count"
              name="particle_count"
              min="0"
              max="5000"
              step="100"
              value={formData.particle_count}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
              <span>Minimal</span>
              <span>Intense</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Note: Higher particle counts may impact performance
            </p>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="glass-morphism rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Audio Settings</h3>

        <div>
          <label htmlFor="music_enabled" className="flex items-center justify-between">
            <span className="text-[var(--text-primary)]">Background Music</span>
            <input
              type="checkbox"
              id="music_enabled"
              name="music_enabled"
              checked={formData.music_enabled}
              onChange={handleChange}
              className="w-5 h-5 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-white/10 rounded focus:ring-[var(--accent-primary)] focus:ring-2"
            />
          </label>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Enable romantic background music throughout the experience
          </p>
        </div>
      </div>

      {/* Theme Colors */}
      <div className="glass-morphism rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Theme Colors</h3>

        <div className="space-y-6">
          <div>
            <label htmlFor="theme_color_primary" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Primary Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                id="theme_color_primary"
                name="theme_color_primary"
                value={formData.theme_color_primary}
                onChange={handleChange}
                className="h-10 w-20 bg-[var(--bg-secondary)]/50 border border-white/10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.theme_color_primary}
                onChange={(e) => setFormData(prev => ({ ...prev, theme_color_primary: e.target.value }))}
                className="flex-1 px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                placeholder="#9b6cff"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Main accent color used throughout the interface
            </p>
          </div>

          <div>
            <label htmlFor="theme_color_secondary" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Secondary Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                id="theme_color_secondary"
                name="theme_color_secondary"
                value={formData.theme_color_secondary}
                onChange={handleChange}
                className="h-10 w-20 bg-[var(--bg-secondary)]/50 border border-white/10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.theme_color_secondary}
                onChange={(e) => setFormData(prev => ({ ...prev, theme_color_secondary: e.target.value }))}
                className="flex-1 px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                placeholder="#ff6b8a"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Secondary accent color for contrast and highlights
            </p>
          </div>

          <div>
            <label htmlFor="theme_color_star" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Star/Accent Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                id="theme_color_star"
                name="theme_color_star"
                value={formData.theme_color_star}
                onChange={handleChange}
                className="h-10 w-20 bg-[var(--bg-secondary)]/50 border border-white/10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.theme_color_star}
                onChange={(e) => setFormData(prev => ({ ...prev, theme_color_star: e.target.value }))}
                className="flex-1 px-4 py-2 bg-[var(--bg-secondary)]/50 border border-white/10 rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
                placeholder="#f6f7ff"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Color for special elements and featured content
            </p>
          </div>
        </div>

        {/* Color Preview */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm font-medium text-[var(--text-primary)] mb-3">Color Preview</p>
          <div className="flex gap-2">
            <div
              className="w-12 h-12 rounded-lg border border-white/10"
              style={{ backgroundColor: formData.theme_color_primary }}
              title="Primary"
            />
            <div
              className="w-12 h-12 rounded-lg border border-white/10"
              style={{ backgroundColor: formData.theme_color_secondary }}
              title="Secondary"
            />
            <div
              className="w-12 h-12 rounded-lg border border-white/10"
              style={{ backgroundColor: formData.theme_color_star }}
              title="Star/Accent"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-white/10">
        <button
          type="submit"
          disabled={!isDirty}
          className="flex-1 px-6 py-3 bg-[var(--accent-primary)] text-white rounded-lg font-medium hover:bg-[var(--accent-secondary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Settings
        </button>
        <button
          type="button"
          onClick={resetToDefaults}
          className="px-6 py-3 bg-white/10 backdrop-blur-sm text-[var(--text-primary)] rounded-lg font-medium hover:bg-white/20 transition-all duration-200"
        >
          Reset to Defaults
        </button>
      </div>
    </form>
  );
}