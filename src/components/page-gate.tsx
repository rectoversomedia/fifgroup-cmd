'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { isPageLocked } from '@/components/page-lock';

function getPageId(href: string): string {
  if (href === '/') return 'dashboard';
  return href.replace('/', '');
}

export default function PageGate({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    if (!mounted || !user) return;
    if (isAdmin) return;
    const pageId = getPageId(pathname);
    if (pageId !== 'dashboard' && isPageLocked(pageId)) {
      window.location.href = '/';
    }
  }, [mounted, user, isAdmin, pathname]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#c8a46e', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return <>{children}</>;
}

export function LockedBanner({ pageId }: { pageId: string }) {
  const { isAdmin } = useAuth();

  if (isAdmin || !isPageLocked(pageId)) return null;

  return (
    <div className="mx-3 mt-3 rounded-xl p-4 border"
      style={{ background: 'linear-gradient(135deg, #1c1c1c, #111)', border: '1px solid #c8a46e', backdropFilter: 'blur(8px)' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(200,164,110,0.15)' }}>
          <svg width="20" height="20" viewBox="0 0 256 256" fill="none">
            <rect x="40" y="88" width="176" height="128" rx="16" fill="#c8a46e" fillOpacity="0.2" stroke="#c8a46e" strokeWidth="16"/>
            <path d="M92 88V56a36 36 0 0 1 72 0v32" stroke="#c8a46e" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="128" cy="152" r="12" fill="#c8a46e"/>
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: '#c8a46e' }}>Page Locked</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>
            Halaman ini saat ini dikunci oleh admin dan tidak dapat dilihat.
          </p>
        </div>
      </div>
    </div>
  );
}
