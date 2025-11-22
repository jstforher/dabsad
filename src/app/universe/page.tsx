'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import { Memory, SiteSettings, DeviceCapabilities } from '@/types/memory';
import { getMemories, getSiteSettings } from '@/lib/api';

// Dynamically import 3D components to avoid SSR issues
const Universe3D = dynamic(() => import('@/components/Universe3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[var(--text-secondary)]">Loading Universe...</p>
      </div>
    </div>
  ),
});

const FallbackGallery = dynamic(() => import('@/components/FallbackGallery'), {
  ssr: true,
});

export default function UniversePage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [use3D, setUse3D] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect device capabilities
  useEffect(() => {
    const detectCapabilities = (): DeviceCapabilities => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      return {
        webgl: !!gl,
        deviceMemory: (navigator as any).deviceMemory || 4,
        cores: navigator.hardwareConcurrency || 4,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTablet: /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
      };
    };

    const capabilities = detectCapabilities();
    setDeviceCapabilities(capabilities);

    // Decide whether to use 3D based on device capabilities
    const shouldUse3D = capabilities.webgl &&
                       !capabilities.isMobile &&
                       capabilities.deviceMemory >= 2;

    setUse3D(shouldUse3D);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [memoriesData, settingsData] = await Promise.all([
          getMemories(),
          getSiteSettings(),
        ]);

        setMemories(memoriesData);
        setSiteSettings(settingsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load memories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (deviceCapabilities) {
      fetchData();
    }
  }, [deviceCapabilities]);

  // Show loading screen
  if (isLoading || !deviceCapabilities) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            Preparing Your Universe
          </h2>
          <p className="text-[var(--text-secondary)]">
            Gathering memories and configuring the cosmos...
          </p>
        </div>
      </div>
    );
  }

  // Show error screen
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Navigation />
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <svg className="w-20 h-20 text-[var(--accent-secondary)] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            Stellar Disturbance
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-secondary)] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Navigation />

      {/* Instructions overlay */}
      <div className="absolute top-20 left-4 z-40 max-w-xs">
        <div className="glass-morphism rounded-lg p-4 text-sm">
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Navigation</h3>
          <ul className="text-[var(--text-secondary)] space-y-1">
            <li>• Click and drag to rotate view</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Click memories to explore</li>
            <li>• Discover the hidden Heart Star</li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-16">
        {use3D ? (
          <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[var(--text-secondary)]">Initializing 3D Universe...</p>
              </div>
            </div>
          }>
            <Universe3D
              memories={memories}
              settings={siteSettings}
              deviceCapabilities={deviceCapabilities}
            />
          </Suspense>
        ) : (
          <FallbackGallery
            memories={memories}
            settings={siteSettings}
          />
        )}
      </div>

      {/* Memory counter */}
      <div className="absolute bottom-6 right-6 z-40">
        <div className="glass-morphism rounded-lg px-4 py-2 text-sm">
          <span className="text-[var(--text-secondary)]">
            {memories.length} memories in universe
          </span>
        </div>
      </div>
    </div>
  );
}