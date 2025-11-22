import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Memory,
  CreateMemoryData,
  UpdateMemoryData,
  SiteSettings,
  LoginData,
  User,
  FileUploadResponse,
  ApiResponse,
  PaginatedResponse
} from '@/types/memory';

// Create axios instance with base configuration
const createApiInstance = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // For session authentication
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add CSRF token if available
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      // Handle common error cases
      if (error.response?.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = '/admin/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Helper function to get cookies
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
};

// Initialize API instance
const api = createApiInstance();

// Memory API functions
export const getMemories = async (): Promise<Memory[]> => {
  try {
    const response = await api.get<PaginatedResponse<Memory>>('/memories/');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching memories:', error);
    throw error;
  }
};

export const getMemory = async (id: string): Promise<Memory> => {
  try {
    const response = await api.get<Memory>(`/memories/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching memory:', error);
    throw error;
  }
};

export const getFeaturedMemories = async (): Promise<Memory[]> => {
  try {
    const response = await api.get<Memory[]>('/memories/featured/');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured memories:', error);
    throw error;
  }
};

export const getMemoriesByCategory = async (category: string): Promise<Memory[]> => {
  try {
    const response = await api.get<Memory[]>(`/memories/category/?type=${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching memories by category:', error);
    throw error;
  }
};

export const createMemory = async (data: CreateMemoryData): Promise<Memory> => {
  try {
    const response = await api.post<Memory>('/memories/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating memory:', error);
    throw error;
  }
};

export const updateMemory = async (id: string, data: UpdateMemoryData): Promise<Memory> => {
  try {
    const response = await api.patch<Memory>(`/memories/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating memory:', error);
    throw error;
  }
};

export const deleteMemory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/memories/${id}/`);
  } catch (error) {
    console.error('Error deleting memory:', error);
    throw error;
  }
};

// File upload API
export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<FileUploadResponse>(
      '/memories/upload/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Site settings API
export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const response = await api.get<SiteSettings>('/settings/');
    return response.data;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }
};

// Authentication API functions
export const adminLogin = async (credentials: LoginData): Promise<{ user: User }> => {
  try {
    const response = await api.post<{ success: boolean; user: User; message: string }>(
      '/auth/login/',
      credentials
    );
    return { user: response.data.user };
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error;
  }
};

export const adminLogout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout/');
  } catch (error) {
    console.error('Error during admin logout:', error);
    throw error;
  }
};

export const getAdminStatus = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ success: boolean; user: User }>('/auth/status/');
    return response.data.success ? response.data.user : null;
  } catch (error) {
    console.error('Error fetching admin status:', error);
    return null;
  }
};

export const revealSecretMemories = async (key?: string): Promise<Memory[]> => {
  try {
    const response = await api.post<{ success: boolean; memories: Memory[] }>(
      '/auth/secret-reveal/',
      key ? { key } : {}
    );
    return response.data.memories;
  } catch (error) {
    console.error('Error revealing secret memories:', error);
    throw error;
  }
};

// Development utility to create admin user
export const createAdminUser = async (userData: {
  username: string;
  password: string;
  email?: string;
}): Promise<void> => {
  try {
    await api.post('/auth/create-admin/', userData);
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.error || error.response.data?.message || 'API request failed';

    return new ApiError(message, status, error.response.data);
  } else if (error.request) {
    return new ApiError('Network error - unable to reach server');
  } else {
    return new ApiError(error.message || 'Unknown error occurred');
  }
};

// Default export for convenience
export default {
  // Memories
  getMemories,
  getMemory,
  getFeaturedMemories,
  getMemoriesByCategory,
  createMemory,
  updateMemory,
  deleteMemory,

  // File upload
  uploadFile,

  // Settings
  getSiteSettings,

  // Authentication
  adminLogin,
  adminLogout,
  getAdminStatus,
  revealSecretMemories,
  createAdminUser,

  // Utilities
  handleApiError,
};