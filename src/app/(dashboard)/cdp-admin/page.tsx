'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CDPAdminPanel } from '@/components/cdp-admin';
import { loadCDPData, saveCDPData, getDefaultCDP } from '@/components/cdp-admin';
import { useAuth } from '@/components/auth-provider';

export default function CDPAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [cdpData, setCDPData] = React.useState(() => getDefaultCDP());

  React.useEffect(() => {
    const saved = loadCDPData();
    if (saved) setCDPData(saved);
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && !isAdmin) router.replace('/');
  }, [mounted, isAdmin, router]);

  React.useEffect(() => { saveCDPData(cdpData); }, [cdpData]);

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
    <CDPAdminPanel
      data={cdpData}
      onChange={setCDPData}
      mode="page"
    />
  );
}
