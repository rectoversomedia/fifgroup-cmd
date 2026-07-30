'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';

const FIFGROUP_LOGO = 'https://www.fifgroup.co.id/assets/images/png/fifgroup-logo-v2-20260423.png';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      window.location.href = '/';
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      {/* Top logo — tight, right above the card */}
      <div className="flex flex-col items-center gap-3">
        <img
          src={FIFGROUP_LOGO}
          alt="FIFGROUP"
          className="object-contain"
          style={{ height: 48, width: 'auto' }}
        />
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#1e3a5f' }}>
          CMD Dashboard
        </h1>
        <p className="text-sm -mt-1" style={{ color: '#94a3b8' }}>
          Sign in to access the command center
        </p>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-sm mx-4 mt-8">
        <div
          className="rounded-2xl p-8"
          style={{
            background: '#ffffff',
            boxShadow: '0 0 0 1px #e8e8e8, 0 8px 40px rgba(30,58,95,0.08)',
          }}
        >
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl flex items-start gap-3 text-sm"
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
              }}
            >
              <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#1e3a5f' }}>
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e0e7ef',
                    color: '#111827',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1e3a5f'}
                  onBlur={e => e.target.style.borderColor = '#e0e7ef'}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#1e3a5f' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e0e7ef',
                    color: '#111827',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#1e3a5f'}
                  onBlur={e => e.target.style.borderColor = '#e0e7ef'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: '#1e3a5f' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2a4a7a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1e3a5f')}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs" style={{ color: '#c0c8d4' }}>
        &copy; {new Date().getFullYear()} FIFGROUP. All rights reserved.
      </p>
    </div>
  );
}
