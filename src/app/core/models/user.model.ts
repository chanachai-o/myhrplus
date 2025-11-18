/**
 * User Model
 * ข้อมูลผู้ใช้และ profile
 */

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  isActive?: boolean;
}

export interface UserProfile extends User {
  employeeId?: string;
  department?: string;
  position?: string;
  phone?: string;
  mobile?: string;
  avatar?: string;
  language?: string;
  timezone?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: UserProfile;
  expiresIn?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

