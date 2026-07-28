'use client';

import * as React from 'react';
import {
  ShieldCheck, Warning, TrendUp, TrendDown,
  Clock, ArrowRight, Funnel, Bug,
} from '@phosphor-icons/react';

interface SentryEvent {
  id: string;
  title: string;
  level: 'error' | 'warning' | 'info';
  app: string;
  count: number;
  user: string;
  lastSeen: string;
  culprit: string;
  status: 'unresolved' | 'resolved' | 'ignored';
}

const EVENTS: SentryEvent[] = [
  { id: 'ERR-001', title: 'NullPointerException: Cannot read property "user" of null', level: 'error', app: 'FIFADA', count: 142, user: '18K users', lastSeen: '2 min ago', culprit: 'AuthService.java:248', status: 'unresolved' },
  { id: 'ERR-002', title: 'API timeout: POST /api/v2/disbursement', level: 'error', app: 'FIFGO', count: 89, user: '8.2K users', lastSeen: '5 min ago', culprit: 'DisbursementController.kt', status: 'unresolved' },
  { id: 'ERR-003', title: 'Push delivery failure: Invalid FCM token', level: 'warning', app: 'FIFADA', count: 234, user: '34K users', lastSeen: '12 min ago', culprit: 'FCMService.ts', status: 'unresolved' },
  { id: 'ERR-004', title: 'Memory leak in JourneyEngine worker', level: 'error', app: 'CDP', count: 23, user: 'internal', lastSeen: '28 min ago', culprit: 'JourneyEngine.java:112', status: 'unresolved' },
  { id: 'ERR-005', title: 'CDP segment sync failed: rate limit exceeded', level: 'warning', app: 'CDP', count: 67, user: 'internal', lastSeen: '1 hr ago', culprit: 'SegmentSync.ts', status: 'resolved' },
  { id: 'ERR-006', title: 'Image upload failed: S3 500 Internal Error', level: 'error', app: 'FIFGO', count: 45, user: '3.1K users', lastSeen: '2 hr ago', culprit: 'S3UploadService.kt', status: 'resolved' },
  { id: 'ERR-007', title: 'Session expired unexpectedly — token refresh race', level: 'warning', app: 'FIFADA', count: 156, user: '22K users', lastSeen: '3 hr ago', culprit: 'AuthMiddleware.ts', status: 'ignored' },
];

const LEVEL_META = {
  error:   { label: 'ERROR',   color: '#dc2626', bg: '#fef2f2' },
  warning: { label: 'WARNING', color: '#d97706', bg: '#fffbeb' },
  info:    { label: 'INFO',    color: '#4f8ef7', bg: '#eff6ff' },
} as const;

const STATUS_META = {
  unresolved: { label: 'Unresolved', color: '#dc2626', bg: '#fef2f2' },
  resolved:   { label: 'Resolved',   color: '#10b981', bg: '#f0fdf4' },
  ignored:    { label: 'Ignored',    color: '#9ca3af', bg: '#f9fafb' },
} as const;

export default function ErrorTrackingPage() {
  const [timeStr, setTimeStr] = React.useState('--:--');
  const [filterLevel, setFilterLevel] = React.useState<'all' | SentryEvent['level']>('all');
  const [filterStatus, setFilterStatus] = React.useState<'all' | SentryEvent['status']>('unresolved');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const filtered = React.useMemo(() => EVENTS.filter(e => {
    if (filterLevel !== 'all' && e.level !== filterLevel) return false;
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    return true;
  }), [filterLevel, filterStatus]);

  const stats = {
    total: EVENTS.length,
    errors: EVENTS.filter(e => e.level === 'error').length,
    warnings: EVENTS.filter(e => e.level === 'warning').length,
    unresolved: EVENTS.filter(e => e.status === 'unresolved').length,
    affectedUsers: EVENTS.reduce((s, e) => s + e.count, 0),
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Error Tracking</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Sentry · API failures · Crash reports</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events',   value: stats.total,           icon: Bug,             color: '#1e3a5f' },
          { label: 'Errors',         value: stats.errors,          icon: Warning,        color: '#dc2626' },
          { label: 'Warnings',       value: stats.warnings,        icon: TrendUp,        color: '#d97706' },
          { label: 'Unresolved',     value: stats.unresolved,     icon: Clock,          color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={18} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-3xl font-extrabold" style={{ color: m.color }}>{m.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: '#9ca3af' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Funnel size={14} style={{ color: '#9ca3af' }} />
        <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Level:</span>
        {(['all', 'error', 'warning', 'info'] as const).map(l => (
          <button key={l} onClick={() => setFilterLevel(l)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={filterLevel === l
              ? { background: '#dc2626', color: 'white', border: '1px solid #dc2626' }
              : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }}>
            {l === 'all' ? 'All' : LEVEL_META[l].label}
          </button>
        ))}
        <span className="text-xs" style={{ color: '#d1d5db' }}>|</span>
        <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Status:</span>
        {(['all', 'unresolved', 'resolved', 'ignored'] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s as any)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={filterStatus === s
              ? { background: '#1e3a5f', color: 'white', border: '1px solid #1e3a5f' }
              : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }}>
            {s === 'all' ? 'All' : STATUS_META[s as keyof typeof STATUS_META].label}
          </button>
        ))}
      </div>

      {/* Event List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>
            Events
            <span className="ml-2 text-xs font-medium" style={{ color: '#9ca3af' }}>— {filtered.length} of {EVENTS.length}</span>
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map(e => {
            const level = LEVEL_META[e.level];
            const status = STATUS_META[e.status];
            return (
              <div key={e.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${level.color}15` }}>
                  <Bug size={16} style={{ color: level.color }} weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono font-bold" style={{ color: '#374151' }}>{e.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: level.bg, color: level.color }}>{level.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#374151' }}>{e.app}</span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#111827' }}>{e.title}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Warning size={10} style={{ color: '#9ca3af' }} />
                      <span className="text-[11px]" style={{ color: '#9ca3af' }}>{e.count.toLocaleString('id-ID')} events</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendUp size={10} style={{ color: '#9ca3af' }} />
                      <span className="text-[11px]" style={{ color: '#9ca3af' }}>{e.user} affected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} style={{ color: '#9ca3af' }} />
                      <span className="text-[11px]" style={{ color: '#9ca3af' }}>{e.lastSeen}</span>
                    </div>
                    <code className="text-[10px] px-2 py-0.5 rounded bg-gray-100 font-mono" style={{ color: '#6b7280' }}>{e.culprit}</code>
                  </div>
                </div>
                {e.status !== 'resolved' && (
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0"
                    style={{ borderColor: '#10b981', color: '#10b981' }}>
                    Resolve
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
