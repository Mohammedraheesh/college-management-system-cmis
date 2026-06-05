import axiosInstance from './axiosInstance';
import type { UserRegisterRequest, UserLoginRequest } from '../types/user.types'; // Wait, request DTOs are specified in request structures.
// Let's specify direct types in imports or write them here

export interface AuthResponseData {
  token: string;
  email: string;
  role: string;
  userId: number;
  studentId: number | null;
}

export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const authApi = {
  login: async (credentials: UserLoginRequest): Promise<ApiResponseWrapper<AuthResponseData>> => {
    const response = await axiosInstance.post<ApiResponseWrapper<AuthResponseData>>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (details: UserRegisterRequest): Promise<ApiResponseWrapper<AuthResponseData>> => {
    const response = await axiosInstance.post<ApiResponseWrapper<AuthResponseData>>('/auth/register', details);
    return response.data;
  }
};
