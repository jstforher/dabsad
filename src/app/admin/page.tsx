'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';
import AdminLoginForm from '@/components/AdminLoginForm';
import { User, Memory, SiteSettings } from '@/types/memory';
import { getMemories, getSiteSettings, getAdminStatus } from '@/lib/api';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const adminUser = await getAdminStatus();

      if (adminUser) {
        setIsAdmin(true);
        setUser(adminUser);
        await loadData();
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      setError('Failed to check authentication status');
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [memoriesData, settingsData] = await Promise.all([
        getMemories(),
        getSiteSettings(),
      ]);
      setMemories(memoriesData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load admin data');
    }
  };

  const handleLogin = (userData: User) => {
    setIsAdmin(true);
    setUser(userData);
    loadData();
  };

  const handleLogout = async () => {
    try {
      // Call logout API if available
      // await adminLogout();

      setIsAdmin(false);
      setUser(null);
      setMemories([]);
      setSettings(null);
      router.push('/admin');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const handleMemoryUpdate = (updatedMemory: Memory) => {
    setMemories(prev =>
      prev.map(memory =>
        memory.id === updatedMemory.id ? updatedMemory : memory
      )
    );
  };

  const handleMemoryDelete = (deletedMemoryId: string) => {
    setMemories(prev =>
      prev.filter(memory => memory.id !== deletedMemoryId)
    );
  };

  const handleMemoryCreate = (newMemory: Memory) => {
    setMemories(prev => [newMemory, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            Loading Admin Panel
          </h2>
          <p className="text-[var(--text-secondary)]">
            Verifying authentication and loading data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Navigation />
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <svg className="w-20 h-20 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            Admin Error
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <button
            onClick={checkAuthStatus}
            className="px-6 py-3 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-secondary)] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navigation />

      {!isAdmin ? (
        <AdminLoginForm onLogin={handleLogin} />
      ) : (
        <AdminDashboard
          user={user}
          memories={memories}
          settings={settings}
          onMemoryUpdate={handleMemoryUpdate}
          onMemoryDelete={handleMemoryDelete}
          onMemoryCreate={handleMemoryCreate}
          onLogout={handleLogout}
          onRefreshData={loadData}
        />
      )}
    </div>
  );
}