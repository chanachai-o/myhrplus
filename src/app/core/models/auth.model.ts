/**
 * Authentication Models
 * Models สำหรับ authentication และ authorization
 */

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  expiresAt?: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  permissions: Permission[];
  description?: string;
}

export interface SessionInfo {
  userId: string;
  username: string;
  sessionId: string;
  loginTime: Date;
  lastActivity: Date;
  ipAddress?: string;
}

