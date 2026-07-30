'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PageLockAdmin } from '@/components/page-lock';
import { useAuth } from '@/components/auth-provider';

const FIFGROUP_LOGO = '/images/fifgroup-logo.png';
const CHANNEL_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googleads.svg';

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    if (mounted && !isAdmin) router.replace('/');
  }, [mounted, isAdmin, router]);

  if (!mounted || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#1e3a5f', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src={FIFGROUP_LOGO} alt="FIFGROUP" style={{ height: 36, width: 'auto' }} className="object-contain" />
          <div className="w-px h-6 bg-gray-200" />
          <div>
            <h1 className="text-base font-extrabold" style={{ color: '#1e3a5f' }}>Settings</h1>
            <p className="text-[11px]" style={{ color: '#9ca3af' }}>Page access control & admin settings</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <PageLockAdmin />
        </div>
      </div>
    </div>
  );
}
