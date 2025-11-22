export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Memory {
  id: string;
  title: string;
  caption?: string;
  media_url: string;
  position: Vector3D;
  orbit_radius: number;
  is_secret: boolean;
  is_featured: boolean;
  category: 'PHOTO' | 'VIDEO' | 'AUDIO';
  date: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMemoryData {
  title: string;
  caption?: string;
  media_url: string;
  position?: Vector3D;
  orbit_radius?: number;
  is_secret?: boolean;
  is_featured?: boolean;
  category: 'PHOTO' | 'VIDEO' | 'AUDIO';
  date: string;
  order?: number;
}

export interface UpdateMemoryData {
  title?: string;
  caption?: string;
  media_url?: string;
  position?: Vector3D;
  orbit_radius?: number;
  is_secret?: boolean;
  is_featured?: boolean;
  category?: 'PHOTO' | 'VIDEO' | 'AUDIO';
  date?: string;
  order?: number;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  star: string;
}

export interface SiteSettings {
  rotation_speed: number;
  particle_count: number;
  music_enabled: boolean;
  auto_rotate: boolean;
  theme_colors: ThemeColors;
  theme_color_primary: string;
  theme_color_secondary: string;
  theme_color_star: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_admin: boolean;
}

export interface FileUploadResponse {
  filename: string;
  file_url: string;
  size: number;
  content_type: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  results: T[];
  next?: string | null;
  previous?: string | null;
}

export interface MemoryNodeProps {
  memory: Memory;
  position: Vector3D;
  onClick: (memory: Memory) => void;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

export interface Universe3DSettings {
  autoRotate: boolean;
  rotationSpeed: number;
  particleCount: number;
  enableMusic: boolean;
}

export interface DeviceCapabilities {
  webgl: boolean;
  deviceMemory: number;
  cores: number;
  isMobile: boolean;
  isTablet: boolean;
}