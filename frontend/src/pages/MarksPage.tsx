import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentApi } from '../api/studentApi';
import { courseApi } from '../api/courseApi';
import type { Mark, Student } from '../types/student.types';
import type { Course } from '../types/course.types';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiAward, FiEdit2, FiPlus, FiX } from 'react-icons/fi';

const schema = yup.object().shape({
  studentId: yup.number().typeError('Please select a student').required('Student is required'),
  courseId: yup.number().typeError('Please select a course').required('Course is required'),
  internalMarks: yup.number().typeError('Internal Marks must be a number').min(0, 'Minimum 0').max(30, 'Maximum 30').required('Required'),
  endExamMarks: yup.number().typeError('End Exam Marks must be a number').min(0, 'Minimum 0').max(70, 'Maximum 70').required('Required'),
});

type FormData = yup.InferType<typeof schema>;

const MarksPage: React.FC = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Administrative lists (for dropdowns in the creation form)
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const loadStudentMarks = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user?.role === 'ROLE_STUDENT' && user.studentId) {
        const response = await studentApi.getStudentMarks(user.studentId);
        if (response.success) {
          setMarks(response.data);
        }
      } else if (isAdmin) {
        // Load all marks by default for Admin
        const response = await studentApi.searchMarks('');
        if (response.success) {
          setMarks(response.data);
        }
        
        // Pre-load student and course options for dropdown menus
        const [studentsRes, coursesRes] = await Promise.all([
          studentApi.getStudents(),
          courseApi.getCourses()
        ]);
        if (studentsRes.success) setStudents(studentsRes.data);
        if (coursesRes.success) setCourses(coursesRes.data);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching academic marks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentMarks();
  }, [user]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await studentApi.searchMarks(query);
      if (response.success) {
        setMarks(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMark(null);
    reset({
      studentId: undefined,
      courseId: undefined,
      internalMarks: 0,
      endExamMarks: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (mark: Mark) => {
    setEditingMark(mark);
    setValue('studentId', mark.studentId);
    setValue('courseId', mark.courseId);
    setValue('internalMarks', mark.internalMarks);
    setValue('endExamMarks', mark.endExamMarks);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setApiLoading(true);
    try {
      const response = await studentApi.recordMarks({
        studentId: data.studentId,
        courseId: data.courseId,
        internalMarks: data.internalMarks,
        endExamMarks: data.endExamMarks,
      });

      if (response.success) {
        setIsModalOpen(false);
        loadStudentMarks();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error recording marks.');
    } finally {
      setApiLoading(false);
    }
  };

  // Define columns for the DataTable
  const columns: Column<Mark>[] = [
    {
      header: 'Student Name',
      accessor: (mark) => (
        <span style={{ fontWeight: 600, color: 'white' }}>
          {mark.studentName}
        </span>
      ),
    },
    {
      header: 'Course Code',
      accessor: (mark) => (
        <span style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          color: '#3b82f6',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          {mark.courseCode}
        </span>
      ),
    },
    {
      header: 'Course Title',
      accessor: (mark) => mark.courseName,
    },
    {
      header: 'Internal Marks (30)',
      accessor: (mark) => (
        <span style={{ fontWeight: 500 }}>
          {mark.internalMarks}
        </span>
      ),
    },
    {
      header: 'End Exam Marks (70)',
      accessor: (mark) => (
        <span style={{ fontWeight: 500 }}>
          {mark.endExamMarks}
        </span>
      ),
    },
    {
      header: 'Total (100)',
      accessor: (mark) => (
        <span style={{
          fontWeight: 700,
          color: mark.total >= 40 ? 'var(--success)' : 'var(--danger)'
        }}>
          {mark.total}
        </span>
      ),
    },
  ];

  // If Admin, append the Actions column
  if (isAdmin) {
    columns.push({
      header: 'Actions',
      accessor: (mark) => (
        <button 
          onClick={() => openEditModal(mark)} 
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px' }}
        >
          <FiEdit2 /> Edit
        </button>
      ),
    });
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>Academic Transcripts</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {isAdmin 
              ? 'Lookup and input student internal assessments and semester grades.'
              : 'Official breakdown of your internal and external assessments.'
            }
          </p>
        </div>
        
        {isAdmin && (
          <button onClick={openCreateModal} className="btn btn-primary">
            <FiPlus /> Record Grades
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Admin Search Bar */}
      {isAdmin && <SearchBar placeholder="Search students by name or ID..." onSearch={handleSearch} />}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '60px 0', color: 'var(--primary)' }}>
          <h3>Fetching Academic Records...</h3>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={marks} 
          emptyMessage={isAdmin ? "No marks records match your search." : "No academic reports found."}
        />
      )}

      {/* CREATE/EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 4, 10, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '480px',
            width: '100%',
            animation: 'fadeIn 0.3s ease-out',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 25px rgba(139, 92, 246, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>
                {editingMark ? 'Modify Grade Records' : 'Input Student Marks'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Student Dropdown */}
              <div className="form-group">
                <label>Select Student</label>
                <select 
                  className={errors.studentId ? 'input-error' : ''} 
                  disabled={!!editingMark}
                  {...register('studentId')}
                >
                  <option value="">Choose Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (CMS-{s.id.toString().padStart(4, '0')})</option>
                  ))}
                </select>
                {errors.studentId && <span className="input-error-msg">{errors.studentId.message}</span>}
              </div>

              {/* Course Dropdown */}
              <div className="form-group">
                <label>Select Course</label>
                <select 
                  className={errors.courseId ? 'input-error' : ''} 
                  disabled={!!editingMark}
                  {...register('courseId')}
                >
                  <option value="">Choose Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.courseCode} - {c.courseName}</option>
                  ))}
                </select>
                {errors.courseId && <span className="input-error-msg">{errors.courseId.message}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Internals */}
                <div className="form-group">
                  <label>Internal Marks (Max 30)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 25"
                    className={errors.internalMarks ? 'input-error' : ''}
                    {...register('internalMarks')}
                  />
                  {errors.internalMarks && <span className="input-error-msg">{errors.internalMarks.message}</span>}
                </div>

                {/* Semester End */}
                <div className="form-group">
                  <label>End Exam Marks (Max 70)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 58"
                    className={errors.endExamMarks ? 'input-error' : ''}
                    {...register('endExamMarks')}
                  />
                  {errors.endExamMarks && <span className="input-error-msg">{errors.endExamMarks.message}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={apiLoading}
                >
                  {apiLoading ? 'Saving...' : 'Save Grades'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksPage;
