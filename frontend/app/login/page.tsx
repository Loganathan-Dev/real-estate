'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, 
  ArrowLeft, CheckCircle, Home, Building2 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login attempt:', { email, password, rememberMe });
      // Redirect to home or dashboard after login
      router.push('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header - Consistent with Homepage */}
      <header className="site-header">
        <div className="header-container">
          <Link href="/" className="logo-link">
            <div className="logo-icon">
              <Building2 size={22} strokeWidth={1.8} />
            </div>
            <div className="logo-text">
              <span className="logo-title">Redsand</span>
              <span className="logo-subtitle">Group</span>
            </div>
          </Link>

          <div className="header-actions">
            <Link href="/" className="nav-link">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link href="/properties" className="nav-link">
              <Building2 size={18} />
              <span>Properties</span>
            </Link>
            <button onClick={() => router.back()} className="back-button">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="login-container">
          {/* Login Card */}
          <div className="login-card">
            <div className="login-header">
              <div className="login-badge">
                <span className="badge-dot"></span>
                Welcome Back
              </div>
              <h1 className="login-title">Sign in to your account</h1>
              <p className="login-subtitle">
                Access your saved properties, schedule tours, and more
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="social-buttons">
              <button className="social-btn google" disabled={isLoading}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="social-btn facebook" disabled={isLoading}>
                <span className="facebook-icon">f</span>
                Facebook
              </button>
            </div>

            <p className="register-prompt">
              Don't have an account?{' '}
              <Link href="/register" className="register-link">
                Create an account
              </Link>
            </p>
          </div>

          {/* Features Section */}
          <div className="login-features">
            <div className="features-header">
              <h2>Why join Redsand?</h2>
              <p>Experience the future of real estate</p>
            </div>
            
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">🏠</div>
                <div className="feature-content">
                  <h3>Save Properties</h3>
                  <p>Bookmark your favorite listings and track price changes</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">📅</div>
                <div className="feature-content">
                  <h3>Schedule Tours</h3>
                  <p>Book property viewings at your convenience</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div className="feature-content">
                  <h3>Market Insights</h3>
                  <p>Get personalized property recommendations</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🔔</div>
                <div className="feature-content">
                  <h3>Instant Alerts</h3>
                  <p>Never miss a new listing matching your criteria</p>
                </div>
              </div>
            </div>

            <div className="trust-badge">
              <CheckCircle size={16} />
              <span>Trusted by 50,000+ happy customers</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Consistent with Homepage */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <Building2 size={20} />
              <span>Redsand Group</span>
            </div>
            <p>India's most trusted real estate platform. Zero brokerage, direct owner deals.</p>
          </div>
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
        <div className="copyright">
          © 2026 Redsand Group. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        /* Header Styles - Matching Homepage */
        .site-header {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(8px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid #eef2ff;
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.875rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          cursor: pointer;
        }

        .logo-icon {
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 6px 12px -6px rgba(79, 70, 229, 0.3);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .logo-title {
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b, #4f46e5);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          letter-spacing: -0.02em;
        }

        .logo-subtitle {
          font-size: 0.65rem;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.5px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          transition: all 0.2s;
        }

        .nav-link:hover {
          background: #f1f5f9;
          color: #4f46e5;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover {
          border-color: #4f46e5;
          color: #4f46e5;
          background: #eef2ff;
          transform: translateX(-2px);
        }

        /* Main Content */
        .main-content {
          min-height: calc(100vh - 320px);
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 3rem 1.5rem;
        }

        .login-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        /* Login Card */
        .login-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem;
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08);
          border: 1px solid #eef2ff;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 1rem;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          border-radius: 40px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 1rem;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #4f46e5;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        .login-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          color: #64748b;
          font-size: 0.9rem;
        }

        /* Form Styles */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.85rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #94a3b8;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          transition: all 0.2s;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-input:disabled {
          background: #f8fafc;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #475569;
        }

        .checkbox-label input {
          cursor: pointer;
        }

        .forgot-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .submit-button {
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          color: white;
          padding: 0.875rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px -6px rgba(79, 70, 229, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 1.2rem;
          height: 1.2rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: calc(50% - 3rem);
          height: 1px;
          background: #e2e8f0;
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        .divider span {
          background: white;
          padding: 0 1rem;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .social-btn {
          padding: 0.7rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.75rem;
          background: white;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .social-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .social-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .facebook-icon {
          font-weight: 700;
          font-size: 1rem;
          color: #1877f2;
        }

        .register-prompt {
          text-align: center;
          color: #64748b;
          font-size: 0.9rem;
        }

        .register-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        /* Features Section */
        .login-features {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          border: 1px solid #eef2ff;
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.05);
        }

        .features-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .features-header h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .features-header p {
          color: #64748b;
          font-size: 0.85rem;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 1rem;
          transition: all 0.2s;
        }

        .feature-item:hover {
          background: #f1f5f9;
          transform: translateX(4px);
        }

        .feature-icon {
          font-size: 1.75rem;
        }

        .feature-content h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .feature-content p {
          font-size: 0.8rem;
          color: #64748b;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e2e8f0;
          color: #10b981;
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* Footer - Matching Homepage */
        .site-footer {
          background: #0f172a;
          color: #e2e8f0;
          padding: 2rem 1.5rem 1.5rem;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .footer-brand {
          flex: 1;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .footer-logo span {
          font-weight: 700;
          font-size: 1rem;
          color: white;
        }

        .footer-brand p {
          font-size: 0.75rem;
          color: #94a3b8;
          max-width: 300px;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.8rem;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #60a5fa;
        }

        .copyright {
          text-align: center;
          padding-top: 1.5rem;
          margin-top: 1.5rem;
          font-size: 0.7rem;
          color: #64748b;
          border-top: 1px solid #1e293b;
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
          .login-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .login-features {
            order: -1;
          }

          .feature-list {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .feature-item {
            flex: 1;
            min-width: 200px;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0.75rem 1rem;
          }

          .logo-title {
            font-size: 1.1rem;
          }

          .header-actions {
            gap: 0.5rem;
          }

          .nav-link span,
          .back-button span {
            display: none;
          }

          .nav-link,
          .back-button {
            padding: 0.5rem;
            border-radius: 50%;
          }

          .login-card {
            padding: 1.5rem;
          }

          .login-title {
            font-size: 1.5rem;
          }

          .social-buttons {
            grid-template-columns: 1fr;
          }

          .feature-list {
            flex-direction: column;
          }

          .footer-container {
            flex-direction: column;
            text-align: center;
          }

          .footer-brand p {
            margin: 0 auto;
          }

          .footer-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 1.5rem;
          }

          .login-card {
            padding: 1.25rem;
          }

          .feature-item {
            min-width: 100%;
          }
        }
      `}</style>
    </>
  );
}