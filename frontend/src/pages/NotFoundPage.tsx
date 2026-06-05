import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{ maxWidth: '480px', width: '100%' }}>
        <h1 style={{ 
          fontSize: '72px', 
          fontWeight: 900, 
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          404
        </h1>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
