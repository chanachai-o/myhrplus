/**
 * Authentication Models
 */

import {
  ActorType,
  MemberType,
  StatusType
} from '../common';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  actorType: string;
  memberType?: string;
  phoneNumber?: string;
}

export interface Member {
  member_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  picture?: string;
  actor_type: ActorType;
  member_type?: MemberType;
  status: StatusType;
  roles: string[];
  permissions?: string[];
  is_active: boolean;
  is_verified: boolean;
  user_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  // Backward compatibility properties (legacy HR system)
  user_level?: string;
  user_role?: string;
  employeeid?: string;
  fullname?: string;
  name?: string;
  firstlogin?: string;
  uid?: string; // Alias for member_id
}

export interface Token {
  user: Member;
  access_token: string;
  token_type: 'bearer';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

