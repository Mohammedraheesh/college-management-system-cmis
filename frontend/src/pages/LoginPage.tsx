import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiBookOpen } from 'react-icons/fi';

const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

const LoginPage: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [apiLoading, setApiLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setApiLoading(true);
    try {
      await login({ email: data.email, password: data.password });
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in context
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '24px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '420px',
        width: '100%',
        animation: 'fadeIn 0.5s ease-out',
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            marginBottom: '16px',
            color: '#8b5cf6',
            fontSize: '24px'
          }}>
            <FiBookOpen />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#f3f4f6' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            College Management Information System
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ position: 'relative' }}>
            <span>{error}</span>
            <button 
              onClick={clearError} 
              style={{
                background: 'none', 
                border: 'none', 
                color: 'inherit', 
                cursor: 'pointer',
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontWeight: 'bold'
              }}
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="text"
                placeholder="you@college.edu"
                className={errors.email ? 'input-error' : ''}
                style={{ paddingLeft: '44px' }}
                {...register('email')}
              />
              <FiMail style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
            </div>
            {errors.email && <span className="input-error-msg">{errors.email.message}</span>}
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={errors.password ? 'input-error' : ''}
                style={{ paddingLeft: '44px' }}
                {...register('password')}
              />
              <FiLock style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
            </div>
            {errors.password && <span className="input-error-msg">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '15px' }}
            disabled={apiLoading}
          >
            {apiLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'var(--text-secondary)',
          fontSize: '14px'
        }}>
          New student user?{' '}
          <Link to="/register" style={{ color: '#8b5cf6', textDecoration: 'none', fontWeight: 600 }}>
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
