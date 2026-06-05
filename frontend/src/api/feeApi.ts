import axiosInstance from './axiosInstance';
import type { Fee, FeePaymentRequest } from '../types/fee.types';
import { ApiResponseWrapper } from './authApi';

export const feeApi = {
  getFees: async (query?: string): Promise<ApiResponseWrapper<Fee[]>> => {
    const url = query ? `/fees?query=${encodeURIComponent(query)}` : '/fees';
    const response = await axiosInstance.get<ApiResponseWrapper<Fee[]>>(url);
    return response.data;
  },

  getFeeByStudentId: async (studentId: number): Promise<ApiResponseWrapper<Fee>> => {
    const response = await axiosInstance.get<ApiResponseWrapper<Fee>>(`/fees/student/${studentId}`);
    return response.data;
  },

  saveFee: async (feeData: FeePaymentRequest): Promise<ApiResponseWrapper<Fee>> => {
    const response = await axiosInstance.post<ApiResponseWrapper<Fee>>('/fees', feeData);
    return response.data;
  },

  deleteFee: async (id: number): Promise<ApiResponseWrapper<void>> => {
    const response = await axiosInstance.delete<ApiResponseWrapper<void>>(`/fees/${id}`);
    return response.data;
  }
};
