'use client';

import * as React from 'react';

export type PageInfo = {
  id: string;
  label: string;
  path: string;
  icon: string;
};

export const ALL_PAGES: PageInfo[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: '🏠' },
  { id: 'fifgo', label: 'FIFGO', path: '/fifgo', icon: '📱' },
  { id: 'fifada', label: 'FIFADA', path: '/fifada', icon: '💳' },
  { id: 'cdp', label: 'CDP & Journeys', path: '/cdp', icon: '🎯' },
  { id: 'lob', label: 'LoB Products', path: '/lob', icon: '📦' },
  { id: 'marketing', label: 'Marketing', path: '/marketing', icon: '📣' },
  { id: 'sales', label: 'Sales', path: '/sales', icon: '💰' },
  { id: 'push-notif', label: 'Push Notif', path: '/push-notification', icon: '🔔' },
  { id: 'escalation', label: 'Escalation', path: '/escalation', icon: '⚠️' },
  { id: 'alerts', label: 'Alerts', path: '/alerts', icon: '🚨' },
  { id: 'campaign', label: 'Campaign', path: '/campaign', icon: '📨' },
  { id: 'journey', label: 'Journey', path: '/journey', icon: '🛤️' },
  { id: 'competitors', label: 'Competitors', path: '/competitors', icon: '🔍' },
  { id: 'events', label: 'Events', path: '/events', icon: '📅' },
  { id: 'recommendations', label: 'Recommendations', path: '/recommendations', icon: '💡' },
  { id: 'portfolio-quality', label: 'Portfolio', path: '/portfolio-quality', icon: '📊' },
  { id: 'geographic', label: 'Geographic', path: '/geographic', icon: '🗺️' },
  { id: 'journey-builder', label: 'Journey Builder', path: '/journey-builder', icon: '🔧' },
  { id: 'error-tracking', label: 'Error Tracking', path: '/error-tracking', icon: '🐛' },
  { id: 'insider', label: 'Insider', path: '/insider', icon: '🔮' },
];

const LOCK_KEY = 'fifgroup_page_locks_v1';

function loadLocks(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const s = localStorage.getItem(LOCK_KEY);
    return s ? JSON.parse(s) : {};
  } catch (_) { return {}; }
}

function saveLocks(locks: Record<string, boolean>) {
  localStorage.setItem(LOCK_KEY, JSON.stringify(locks));
}

// Pages that are ALWAYS visible — cannot be locked
const ALWAYS_VISIBLE = ['fifgo'];

export function isPageLocked(pageId: string): boolean {
  if (ALWAYS_VISIBLE.includes(pageId)) return false;
  return loadLocks()[pageId] === true;
}

// Returns lock status including ALWAYS_VISIBLE (which are never locked)
export function getPageLockStatus(pageId: string): 'locked' | 'always' | 'open' {
  if (ALWAYS_VISIBLE.includes(pageId)) return 'always';
  return isPageLocked(pageId) ? 'locked' : 'open';
}

export function setPageLock(pageId: string, locked: boolean) {
  if (ALWAYS_VISIBLE.includes(pageId)) return; // cannot lock these
  const locks = loadLocks();
  if (locked) locks[pageId] = true;
  else delete locks[pageId];
  saveLocks(locks);
}

export function getLockedPages(): string[] {
  return Object.entries(loadLocks()).filter(([, v]) => v === true).map(([k]) => k);
}

export function PageLockAdmin() {
  const [locks, setLocks] = React.useState<Record<string, boolean>>({});
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // On first mount, lock all pages except ALWAYS_VISIBLE
    const current = loadLocks();
    const needsInit = Object.keys(current).length === 0;
    if (needsInit) {
      const initLocks: Record<string, boolean> = {};
      ALL_PAGES.forEach(page => {
        if (!ALWAYS_VISIBLE.includes(page.id)) initLocks[page.id] = true;
      });
      saveLocks(initLocks);
      setLocks(initLocks);
    } else {
      setLocks(current);
    }
    setMounted(true);
  }, []);

  const toggle = (pageId: string) => {
    if (ALWAYS_VISIBLE.includes(pageId)) return;
    const next = !locks[pageId];
    const nextLocks = { ...locks };
    if (next) nextLocks[pageId] = true;
    else delete nextLocks[pageId];
    setLocks(nextLocks);
    saveLocks(nextLocks);
  };

  if (!mounted) return null;

  const lockedCount = Object.keys(locks).filter(k => !ALWAYS_VISIBLE.includes(k)).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold" style={{ color: '#374151' }}>🔐 Page Access Control</h3>
          <p className="text-[10px]" style={{ color: '#9ca3af' }}>
            {lockedCount === 0 ? 'No pages locked — all visible' : `${lockedCount} page${lockedCount > 1 ? 's' : ''} locked`}
          </p>
        </div>
        {lockedCount > 0 && (
          <button onClick={() => {
            const reset: Record<string, boolean> = {};
            ALL_PAGES.forEach(p => { if (!ALWAYS_VISIBLE.includes(p.id)) reset[p.id] = true; });
            setLocks(reset);
            saveLocks(reset);
          }}
            className="text-[10px] px-3 py-1 rounded-lg font-semibold text-red-500 border border-red-200 hover:bg-red-50">
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {ALL_PAGES.map(page => {
          const alwaysVisible = ALWAYS_VISIBLE.includes(page.id);
          const locked = !!locks[page.id];
          return (
            <div key={page.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all"
              style={{
                background: alwaysVisible ? '#f0fdf4' : locked ? '#fef2f2' : '#f9fafb',
                border: `1px solid ${alwaysVisible ? '#bbf7d0' : locked ? '#fecaca' : '#e5e7eb'}`,
                cursor: alwaysVisible ? 'default' : 'pointer',
              }}
              onClick={() => toggle(page.id)}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                alwaysVisible ? 'bg-emerald-100' : locked ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {alwaysVisible ? (
                  <svg width="12" height="12" viewBox="0 0 256 256" fill="none">
                    <rect x="40" y="88" width="176" height="128" rx="16" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="16"/>
                    <path d="M92 88V56a36 36 0 0 1 72 0" stroke="#10b981" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M100 144l20 20 40-40" stroke="#10b981" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : locked ? (
                  <svg width="12" height="12" viewBox="0 0 256 256" fill="none">
                    <rect x="40" y="88" width="176" height="128" rx="16" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="16"/>
                    <path d="M92 88V56a36 36 0 0 1 72 0v32" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 256 256" fill="none">
                    <rect x="40" y="88" width="176" height="128" rx="16" fill="#6b7280" fillOpacity="0.2" stroke="#6b7280" strokeWidth="16"/>
                    <path d="M92 88V56a36 36 0 0 1 72 0" stroke="#6b7280" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate" style={{ color: alwaysVisible ? '#10b981' : locked ? '#dc2626' : '#374151' }}>
                  {page.icon} {page.label}
                </p>
                <p className="text-[8px]" style={{ color: alwaysVisible ? '#6b7280' : locked ? '#f87171' : '#9ca3af' }}>
                  {alwaysVisible ? '✓ Always visible' : locked ? '🔒 Hidden from viewers' : '✓ Visible'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9px]" style={{ color: '#9ca3af' }}>
        Halaman yang dikunci tidak bisa dilihat oleh viewer. Admin tetap bisa melihat semua halaman. FIFGO tidak bisa dikunci.
      </p>
    </div>
  );
}
