'use client';

import { useState, useEffect } from 'react';
import { User, Memory, SiteSettings, CreateMemoryData } from '@/types/memory';
import { createMemory, updateMemory, deleteMemory, uploadFile } from '@/lib/api';
import MemoryForm from './MemoryForm';
import MemoryList from './MemoryList';
import SettingsForm from './SettingsForm';

interface AdminDashboardProps {
  user: User | null;
  memories: Memory[];
  settings: SiteSettings | null;
  onMemoryUpdate: (memory: Memory) => void;
  onMemoryDelete: (memoryId: string) => void;
  onMemoryCreate: (memory: Memory) => void;
  onLogout: () => void;
  onRefreshData: () => void;
}

type TabType = 'memories' | 'settings' | 'analytics';

export default function AdminDashboard({
  user,
  memories,
  settings,
  onMemoryUpdate,
  onMemoryDelete,
  onMemoryCreate,
  onLogout,
  onRefreshData,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('memories');
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [isCreatingMemory, setIsCreatingMemory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateMemory = async (data: CreateMemoryData, file?: File) => {
    try {
      setIsLoading(true);

      // Upload file if provided
      if (file) {
        const uploadResponse = await uploadFile(file);
        data.media_url = uploadResponse.file_url;
      }

      const newMemory = await createMemory(data);
      onMemoryCreate(newMemory);
      setIsCreatingMemory(false);
    } catch (error) {
      console.error('Error creating memory:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMemory = async (memoryId: string, data: Partial<CreateMemoryData>, file?: File) => {
    try {
      setIsLoading(true);

      // Upload new file if provided
      if (file) {
        const uploadResponse = await uploadFile(file);
        data.media_url = uploadResponse.file_url;
      }

      const updatedMemory = await updateMemory(memoryId, data);
      onMemoryUpdate(updatedMemory);
      setEditingMemory(null);
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    if (!confirm('Are you sure you want to delete this memory? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteMemory(memoryId);
      onMemoryDelete(memoryId);
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTabStats = () => {
    return {
      total: memories.length,
      featured: memories.filter(m => m.is_featured).length,
      secret: memories.filter(m => m.is_secret).length,
      photos: memories.filter(m => m.category === 'PHOTO').length,
      videos: memories.filter(m => m.category === 'VIDEO').length,
      audio: memories.filter(m => m.category === 'AUDIO').length,
    };
  };

  const stats = getTabStats();

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Welcome back, {user?.username}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <button
                onClick={onRefreshData}
                disabled={isLoading}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-[var(--text-primary)] rounded-lg hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[var(--accent-primary)]">{stats.total}</div>
              <div className="text-xs text-[var(--text-secondary)]">Total</div>
            </div>
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[var(--accent-star)]">{stats.featured}</div>
              <div className="text-xs text-[var(--text-secondary)]">Featured</div>
            </div>
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-[var(--accent-secondary)]">{stats.secret}</div>
              <div className="text-xs text-[var(--text-secondary)]">Secret</div>
            </div>
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.photos}</div>
              <div className="text-xs text-[var(--text-secondary)]">Photos</div>
            </div>
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.videos}</div>
              <div className="text-xs text-[var(--text-secondary)]">Videos</div>
            </div>
            <div className="glass-morphism rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">{stats.audio}</div>
              <div className="text-xs text-[var(--text-secondary)]">Audio</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-white/10 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('memories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'memories'
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Memories
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Site Settings
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'memories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Memory List */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">Memory Gallery</h2>
                  <button
                    onClick={() => setIsCreatingMemory(true)}
                    className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:bg-[var(--accent-secondary)] transition-colors"
                  >
                    Add New Memory
                  </button>
                </div>
                <MemoryList
                  memories={memories}
                  onEdit={(memory) => setEditingMemory(memory)}
                  onDelete={handleDeleteMemory}
                />
              </div>

              {/* Memory Form */}
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                  {editingMemory ? 'Edit Memory' : isCreatingMemory ? 'Create Memory' : 'Memory Details'}
                </h2>
                {(editingMemory || isCreatingMemory) ? (
                  <MemoryForm
                    memory={editingMemory}
                    onSubmit={editingMemory ? (data, file) => handleUpdateMemory(editingMemory.id, data, file) : handleCreateMemory}
                    onCancel={() => {
                      setEditingMemory(null);
                      setIsCreatingMemory(false);
                    }}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="glass-morphism rounded-lg p-6 text-center text-[var(--text-secondary)]">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Select a memory to edit or create a new one</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Site Settings</h2>
              <SettingsForm
                settings={settings}
                onUpdate={(updatedSettings) => {
                  console.log('Settings updated:', updatedSettings);
                  // In a real implementation, you'd update settings via API
                }}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Analytics</h2>
              <div className="glass-morphism rounded-lg p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-[var(--text-secondary)] mb-4">
                  Analytics features coming soon
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Track visitor engagement, popular memories, and user interactions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}