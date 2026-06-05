import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#0a0813',
          color: '#f3f4f6',
          padding: '24px'
        }}>
          <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '16px', color: '#ef4444' }}>Something went wrong</h1>
            <p style={{ marginBottom: '24px', color: '#9ca3af' }}>
              An unexpected error occurred in the application. Please reload the page or try again later.
            </p>
            {this.state.error && (
              <pre style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '13px',
                overflowX: 'auto',
                border: '1px solid rgba(255,255,255,0.05)',
                color: '#ec4899',
                marginBottom: '24px'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
