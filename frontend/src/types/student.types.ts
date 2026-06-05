export interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  year: number;
  userId: number | null;
}

export interface Mark {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  internalMarks: number;
  endExamMarks: number;
  total: number;
}
