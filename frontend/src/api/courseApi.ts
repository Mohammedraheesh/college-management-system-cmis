import axiosInstance from './axiosInstance';
import type { Course } from '../types/course.types';
import { ApiResponseWrapper } from './authApi';

export const courseApi = {
  getCourses: async (): Promise<ApiResponseWrapper<Course[]>> => {
    const response = await axiosInstance.get<ApiResponseWrapper<Course[]>>('/courses');
    return response.data;
  },

  getCourseById: async (id: number): Promise<ApiResponseWrapper<Course>> => {
    const response = await axiosInstance.get<ApiResponseWrapper<Course>>(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData: Omit<Course, 'id'>): Promise<ApiResponseWrapper<Course>> => {
    const response = await axiosInstance.post<ApiResponseWrapper<Course>>('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id: number, courseData: Course): Promise<ApiResponseWrapper<Course>> => {
    const response = await axiosInstance.put<ApiResponseWrapper<Course>>(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id: number): Promise<ApiResponseWrapper<void>> => {
    const response = await axiosInstance.delete<ApiResponseWrapper<void>>(`/courses/${id}`);
    return response.data;
  }
};
