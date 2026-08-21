'use client';

import * as React from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: '#f8fafc' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#fef2f2' }}>
        <svg width="32" height="32" viewBox="0 0 256 256" fill="none">
          <path d="M128 80v48M128 176h.01" stroke="#dc2626" strokeWidth="16" strokeLinecap="round"/>
          <path d="M128 24a104 104 0 1 0 104 104A104 104 0 0 0 128 24Z" stroke="#dc2626" strokeWidth="16" fill="none"/>
        </svg>
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold mb-1" style={{ color: '#111827' }}>Terjadi Kesalahan</h1>
        <p className="text-sm" style={{ color: '#6b7280' }}>Halaman ini tidak dapat dimuat.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#1e3a5f' }}
        >
          Muat Ulang
        </button>
        <button
          onClick={() => { if (typeof window !== 'undefined') window.location.href = '/'; }}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold border"
          style={{ border: '1px solid #e5e7eb', color: '#6b7280' }}
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
