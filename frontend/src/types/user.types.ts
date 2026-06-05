export type Role = 'ROLE_ADMIN' | 'ROLE_STUDENT';

export interface User {
  id: number;
  email: string;
  role: Role;
  studentId: number | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface UserLoginRequest {
  email: string;
  password?: string; // Standard password parameter
}

export interface UserRegisterRequest {
  email: string;
  password?: string;
  confirmPassword?: string;
}
