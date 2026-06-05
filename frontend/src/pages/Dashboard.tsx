import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentApi } from '../api/studentApi';
import { courseApi } from '../api/courseApi';
import { feeApi } from '../api/feeApi';
import type { Student } from '../types/student.types';
import type { Course } from '../types/course.types';
import type { Fee } from '../types/fee.types';
import { FiUsers, FiBook, FiDollarSign, FiAward, FiArrowRight, FiUserCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Admin stats states
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalDues, setTotalDues] = useState<number>(0);

  // Student details states
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [studentFee, setStudentFee] = useState<Fee | null>(null);
  const [gpaEstimate, setGpaEstimate] = useState<string>('N/A');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user?.role === 'ROLE_ADMIN') {
          // Fetch admin statistics
          const [studentsRes, coursesRes, feesRes] = await Promise.all([
            studentApi.getStudents(),
            courseApi.getCourses(),
            feeApi.getFees()
          ]);

          if (studentsRes.success) setTotalStudents(studentsRes.data.length);
          if (coursesRes.success) setTotalCourses(coursesRes.data.length);
          if (feesRes.success) {
            let paid = 0;
            let due = 0;
            feesRes.data.forEach(f => {
              paid += f.amountPaid;
              due += f.balanceDue;
            });
            setTotalRevenue(paid);
            setTotalDues(due);
          }
        } else if (user?.role === 'ROLE_STUDENT' && user.studentId) {
          // Fetch student-specific details
          const [profileRes, feeRes, marksRes] = await Promise.all([
            studentApi.getStudentById(user.studentId),
            feeApi.getFeeByStudentId(user.studentId).catch(() => ({ success: false, data: null })), // Avoid failing if no fee record
            studentApi.getStudentMarks(user.studentId)
          ]);

          if (profileRes.success) setStudentProfile(profileRes.data);
          if (feeRes.success && feeRes.data) setStudentFee(feeRes.data);
          
          if (marksRes.success && marksRes.data.length > 0) {
            // Estimate average percentage
            let totalMarks = 0;
            marksRes.data.forEach(m => totalMarks += m.total);
            const average = totalMarks / marksRes.data.length;
            // Map average percentage (0-100) to GPA (0.0-4.0)
            const gpa = ((average / 100) * 4).toFixed(2);
            setGpaEstimate(gpa);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load dashboard metrics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--primary)' }}>
        <h3>Loading System Summary...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(22, 19, 44, 0.7), rgba(59, 130, 246, 0.05))',
        marginBottom: '32px',
        padding: '36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        animation: 'fadeIn 0.4s ease-out'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
            Hello, {user?.role === 'ROLE_ADMIN' ? 'Administrator' : studentProfile?.name || 'Student'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            {user?.role === 'ROLE_ADMIN' 
              ? 'Here is an administrative overview of the college operations today.'
              : 'Here is your current academic and financial statement details.'
            }
          </p>
        </div>
        <div style={{
          padding: '8px 16px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          fontSize: '14px',
          color: 'var(--text-secondary)'
        }}>
          Term: <strong style={{ color: 'white' }}>Spring Semester 2026</strong>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ADMIN DASHBOARD VIEW */}
      {user?.role === 'ROLE_ADMIN' && (
        <div>
          {/* Quick Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div className="glass-panel" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#8b5cf6',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '24px',
                display: 'flex'
              }}>
                <FiUsers />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Total Students</p>
                <h3 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginTop: '4px' }}>{totalStudents}</h3>
              </div>
            </div>

            <div className="glass-panel" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '24px',
                display: 'flex'
              }}>
                <FiBook />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Total Courses</p>
                <h3 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginTop: '4px' }}>{totalCourses}</h3>
              </div>
            </div>

            <div className="glass-panel" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '24px',
                display: 'flex'
              }}>
                <FiDollarSign />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Total Collected</p>
                <h3 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginTop: '4px' }}>${totalRevenue.toLocaleString()}</h3>
              </div>
            </div>

            <div className="glass-panel" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '24px',
                display: 'flex'
              }}>
                <FiDollarSign />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Outstanding Balance</p>
                <h3 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginTop: '4px' }}>${totalDues.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Quick Access Modules */}
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: 'white' }}>Quick Management Modules</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            <Link to="/courses" style={{ textDecoration: 'none' }} className="glass-panel">
              <h3 style={{ fontSize: '18px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiBook style={{ color: '#8b5cf6' }} /> Course Catalogue
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '12px 0 20px' }}>
                Manage college courses, details, credits, and catalog.
              </p>
              <span style={{ color: '#8b5cf6', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Manage Catalog <FiArrowRight />
              </span>
            </Link>

            <Link to="/marks" style={{ textDecoration: 'none' }} className="glass-panel">
              <h3 style={{ fontSize: '18px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiAward style={{ color: '#3b82f6' }} /> Student Marks
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '12px 0 20px' }}>
                Search student transcripts, register internals, and edit final marks.
              </p>
              <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Manage Transcripts <FiArrowRight />
              </span>
            </Link>

            <Link to="/fees" style={{ textDecoration: 'none' }} className="glass-panel">
              <h3 style={{ fontSize: '18px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiDollarSign style={{ color: '#10b981' }} /> Student Accounts
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '12px 0 20px' }}>
                Track fee statements, record payments, and manage outstanding dues.
              </p>
              <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Manage Finances <FiArrowRight />
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* STUDENT DASHBOARD VIEW */}
      {user?.role === 'ROLE_STUDENT' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Main profile section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Student Profile Card */}
            <div className="glass-panel">
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiUserCheck style={{ color: '#8b5cf6' }} /> Student Profile Particulars
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Department</p>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginTop: '4px' }}>
                    {studentProfile?.department}
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Year of Study</p>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginTop: '4px' }}>
                    Year {studentProfile?.year}
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Student ID</p>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginTop: '4px' }}>
                    CMS-{studentProfile?.id?.toString().padStart(4, '0')}
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Linked Login</p>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginTop: '4px' }}>
                    {studentProfile?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              <Link to="/marks" style={{ textDecoration: 'none' }} className="glass-panel">
                <h3 style={{ fontSize: '18px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiAward style={{ color: '#8b5cf6' }} /> My Academic Marks
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 16px' }}>
                  Inspect your internal and external exam marks.
                </p>
                <span style={{ color: '#8b5cf6', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  View Report Card <FiArrowRight />
                </span>
              </Link>

              <Link to="/courses" style={{ textDecoration: 'none' }} className="glass-panel">
                <h3 style={{ fontSize: '18px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiBook style={{ color: '#3b82f6' }} /> College Course List
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 16px' }}>
                  Explore available subjects, credits, and syllabus.
                </p>
                <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Browse Catalog <FiArrowRight />
                </span>
              </Link>
            </div>
          </div>

          {/* Sidebar Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* GPA Widget */}
            <div className="glass-panel" style={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(22, 19, 44, 0.7))',
              borderColor: 'rgba(139, 92, 246, 0.2)'
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Estimated GPA</p>
              <h1 style={{ 
                fontSize: '48px', 
                fontWeight: 800, 
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                margin: '12px 0'
              }}>
                {gpaEstimate}
              </h1>
              <span className="pill pill-success">Good Standing</span>
            </div>

            {/* Financial Dues Widget */}
            <div className="glass-panel">
              <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiDollarSign style={{ color: '#10b981' }} /> Fee Summary
              </h3>
              
              {studentFee ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Assessment</span>
                    <strong style={{ color: 'white' }}>${studentFee.totalFee}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Amount Remitted</span>
                    <strong style={{ color: '#10b981' }}>${studentFee.amountPaid}</strong>
                  </div>
                  <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}>Outstanding Balance</span>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: studentFee.balanceDue > 0 ? 'var(--danger)' : 'var(--success)'
                    }}>
                      ${studentFee.balanceDue}
                    </span>
                  </div>
                  {studentFee.balanceDue > 0 ? (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.15)',
                      fontSize: '12px',
                      color: 'var(--text-secondary)'
                    }}>
                      Due Date: <strong style={{ color: 'white' }}>{studentFee.dueDate}</strong>
                    </div>
                  ) : (
                    <span className="pill pill-success" style={{ alignSelf: 'center', marginTop: '8px' }}>Fully Settled</span>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '12px 0' }}>
                  No fee record configured.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
