import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseApi } from '../api/courseApi';
import type { Course } from '../types/course.types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiBook, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const schema = yup.object().shape({
  courseName: yup.string().required('Course Name is required'),
  courseCode: yup.string().required('Course Code is required'),
  department: yup.string().required('Department is required'),
  credits: yup.number().typeError('Credits must be a number').min(1, 'Minimum 1 credit').required('Credits required'),
  description: yup.string().default(''),
});

type FormData = yup.InferType<typeof schema>;

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await courseApi.getCourses();
      if (response.success) {
        setCourses(response.data);
      } else {
        setError(response.message || 'Failed to retrieve courses');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    reset({
      courseName: '',
      courseCode: '',
      department: '',
      credits: 3,
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setValue('courseName', course.courseName);
    setValue('courseCode', course.courseCode);
    setValue('department', course.department);
    setValue('credits', course.credits);
    setValue('description', course.description || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const response = await courseApi.deleteCourse(id);
      if (response.success) {
        setCourses(courses.filter(c => c.id !== id));
      } else {
        alert(response.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting course');
    }
  };

  const onSubmit = async (data: FormData) => {
    setApiLoading(true);
    try {
      if (editingCourse) {
        const response = await courseApi.updateCourse(editingCourse.id, {
          ...editingCourse,
          courseName: data.courseName,
          courseCode: data.courseCode,
          department: data.department,
          credits: data.credits,
          description: data.description || ''
        });
        if (response.success) {
          setIsModalOpen(false);
          fetchCourses();
        } else {
          setError(response.message);
        }
      } else {
        const response = await courseApi.createCourse({
          courseName: data.courseName,
          courseCode: data.courseCode,
          department: data.department,
          credits: data.credits,
          description: data.description || ''
        });
        if (response.success) {
          setIsModalOpen(false);
          fetchCourses();
        } else {
          setError(response.message);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error saving course. Course Code may already exist.');
    } finally {
      setApiLoading(false);
    }
  };

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
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'white' }}>Course Catalogue</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            List of all course offerings, credits, and syllabus.
          </p>
        </div>
        
        {isAdmin && (
          <button onClick={openCreateModal} className="btn btn-primary">
            <FiPlus /> Add New Course
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '60px 0', color: 'var(--primary)' }}>
          <h3>Fetching Courses...</h3>
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          No courses currently available in the catalogue.
        </div>
      ) : (
        /* Courses Card Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {courses.map((course) => (
            <div key={course.id} className="glass-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              minHeight: '220px'
            }}>
              <div>
                {/* Card Title & Code */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '14px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#8b5cf6',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    letterSpacing: '0.5px'
                  }}>
                    {course.courseCode}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {course.credits} Credits
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
                  {course.courseName}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500, marginBottom: '12px' }}>
                  Dept: {course.department}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  marginBottom: '16px'
                }}>
                  {course.description || 'No description available for this course.'}
                </p>
              </div>

              {/* Admin actions */}
              {isAdmin && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '14px',
                  marginTop: 'auto'
                }}>
                  <button 
                    onClick={() => openEditModal(course)} 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px' }}
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)} 
                    className="btn btn-danger" 
                    style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px' }}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
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
            maxWidth: '500px',
            width: '100%',
            animation: 'fadeIn 0.3s ease-out',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 25px rgba(139, 92, 246, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>
                {editingCourse ? 'Edit Course Details' : 'Add New Course'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div className="form-group">
                <label>Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Data Structures"
                  className={errors.courseName ? 'input-error' : ''}
                  {...register('courseName')}
                />
                {errors.courseName && <span className="input-error-msg">{errors.courseName.message}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Code */}
                <div className="form-group">
                  <label>Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-301"
                    className={errors.courseCode ? 'input-error' : ''}
                    {...register('courseCode')}
                  />
                  {errors.courseCode && <span className="input-error-msg">{errors.courseCode.message}</span>}
                </div>

                {/* Credits */}
                <div className="form-group">
                  <label>Credits</label>
                  <input
                    type="number"
                    placeholder="e.g. 4"
                    className={errors.credits ? 'input-error' : ''}
                    {...register('credits')}
                  />
                  {errors.credits && <span className="input-error-msg">{errors.credits.message}</span>}
                </div>
              </div>

              {/* Department */}
              <div className="form-group">
                <label>Department</label>
                <select className={errors.department ? 'input-error' : ''} {...register('department')}>
                  <option value="">Select Department</option>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
                {errors.department && <span className="input-error-msg">{errors.department.message}</span>}
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={4}
                  placeholder="Provide course overview and syllabus details..."
                  {...register('description')}
                />
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
                  {apiLoading ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
