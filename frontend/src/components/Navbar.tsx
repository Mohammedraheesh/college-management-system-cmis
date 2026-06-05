import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiBookOpen, FiDollarSign, FiFileText, FiGrid, FiUser } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 8, 19, 0.75)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => navigate('/dashboard')}
        style={{
          cursor: 'pointer',
          fontSize: '22px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <FiBookOpen style={{ color: '#8b5cf6' }} />
        <span>CMIS</span>
      </div>

      {/* Nav Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '28px',
      }}>
        <NavLink 
          to="/dashboard" 
          style={({ isActive }) => ({
            color: isActive ? '#8b5cf6' : '#9ca3af',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s',
          })}
        >
          <FiGrid /> Dashboard
        </NavLink>
        <NavLink 
          to="/courses" 
          style={({ isActive }) => ({
            color: isActive ? '#8b5cf6' : '#9ca3af',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s',
          })}
        >
          <FiBookOpen /> Courses
        </NavLink>
        <NavLink 
          to="/marks" 
          style={({ isActive }) => ({
            color: isActive ? '#8b5cf6' : '#9ca3af',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s',
          })}
        >
          <FiFileText /> Marks
        </NavLink>
        <NavLink 
          to="/fees" 
          style={({ isActive }) => ({
            color: isActive ? '#8b5cf6' : '#9ca3af',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s',
          })}
        >
          <FiDollarSign /> Fees
        </NavLink>
      </div>

      {/* User Context & Logout */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        {user && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#f3f4f6' }}>
              {user.email}
            </span>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              color: user.role === 'ROLE_ADMIN' ? '#ec4899' : '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Student'}
            </span>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{
            padding: '8px 14px',
            fontSize: '14px',
            borderRadius: '8px',
          }}
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
