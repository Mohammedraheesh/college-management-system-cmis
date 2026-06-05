import axiosInstance from './axiosInstance';
import type { Student, Mark } from '../types/student.types';
import { ApiResponseWrapper } from './authApi';

export const studentApi = {
  getStudents: async (query?: string): Promise<ApiResponseWrapper<Student[]>> => {
    const url = query ? `/students?query=${encodeURIComponent(query)}` : '/students';
    const response = await axiosInstance.get<ApiResponseWrapper<Student[]>>(url);
    return response.data;
  },

  getStudentById: async (id: number): Promise<ApiResponseWrapper<Student>> => {
    const response = await axiosInstance.get<ApiResponseWrapper<Student>>(`/students/${id}`);
    return response.data;
  },

  getStudentMarks: async (studentId: number): Promise<ApiResponseWrapper<Mark[]>> => {
    const response = await axiosInstance.get<ApiResponseWrapper<Mark[]>>(`/students/${studentId}/marks`);
    return response.data;
  },

  searchMarks: async (query: string): Promise<ApiResponseWrapper<Mark[]>> => {
    const response = await axiosInstance.get<ApiResponseWrapper<Mark[]>>(`/students/marks/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  createStudent: async (studentData: Omit<Student, 'id'>): Promise<ApiResponseWrapper<Student>> => {
    const response = await axiosInstance.post<ApiResponseWrapper<Student>>('/students', studentData);
    return response.data;
  },

  updateStudent: async (id: number, studentData: Student): Promise<ApiResponseWrapper<Student>> => {
    const response = await axiosInstance.put<ApiResponseWrapper<Student>>(`/students/${id}`, studentData);
    return response.data;
  },

  deleteStudent: async (id: number): Promise<ApiResponseWrapper<void>> => {
    const response = await axiosInstance.delete<ApiResponseWrapper<void>>(`/students/${id}`);
    return response.data;
  },

  recordMarks: async (marksData: Partial<Mark>): Promise<ApiResponseWrapper<Mark>> => {
    const response = await axiosInstance.post<ApiResponseWrapper<Mark>>('/students/marks', marksData);
    return response.data;
  }
};
