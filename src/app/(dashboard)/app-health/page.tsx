'use client';

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Warning, CheckCircle } from '@phosphor-icons/react';
import { getAppHealthMetrics } from '@/lib/data-sim';
import { useRealtime } from '@/lib/use-realtime';

const FIFGO_LOGO  = 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/FIFGO_APP_LOGO-1780892650611.png';
const FIFADA_LOGO = '/images/fifada-logo.jpg';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

function MetricCard({ label, value, target, good }: { label: string; value: string; target: string; good: boolean }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-2">
        {good
          ? <CheckCircle size={16} style={{ color: '#10b981' }} weight="fill" />
          : <Warning size={16} style={{ color: '#dc2626' }} weight="fill" />
        }
        <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{label}</span>
      </div>
      <p className="text-2xl font-extrabold mb-1" style={{ color: good ? '#111827' : '#dc2626' }}>{value}</p>
      <p className="text-[10px]" style={{ color: '#9ca3af' }}>Target: {target}</p>
    </div>
  );
}

const METRIC_LABELS: Record<string, string> = {
  'App Load Time': 'Load',
  'API Response': 'API',
  'Error Rate': 'Error',
  'Crash Rate': 'Crash',
  'Push Delivery': 'Push',
  'Session Duration': 'Session',
};

export default function AppHealthPage() {
  const [selectedApp, setSelectedApp] = React.useState<'fifgo' | 'fifada'>('fifgo');
  const { data: metrics, isLoading } = useRealtime(
    () => getAppHealthMetrics(selectedApp),
    30_000
  );

  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });

  // Bar chart data: metrics vs targets
  // Normalize all values to a 0-100 scale for visual comparison
  const MAX_MAP: Record<string, number> = {
    'App Load Time': 3,
    'API Response': 500,
    'Error Rate': 2,
    'Crash Rate': 1,
    'Push Delivery': 100,
    'Session Duration': 10,
  };
  const barData = metrics
    ? metrics.metrics.map(m => {
        const numericVal = parseFloat(String(m.value).replace(/[^0-9.]/g, '')) || 0;
        const maxExpected = MAX_MAP[m.label] ?? 100;
        const score = Math.min(100, (numericVal / maxExpected) * 100);
        return {
          label: METRIC_LABELS[m.label] || m.label,
          value: Math.round(score),
          target: 100,
          good: m.good,
          color: metrics.ratingColors,
        };
      })
    : [];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>App Health</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Real-time app performance monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>·</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* App Toggle */}
      <div className="flex gap-2">
        {([['fifgo', 'FIFGO'], ['fifada', 'FIFADA']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setSelectedApp(t)}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all border"
            style={selectedApp === t
              ? { background: '#1e3a5f', color: '#fff', border: '1px solid #1e3a5f' }
              : { background: 'white', color: '#374151', border: '1px solid #e5e7eb' }
            }>
            {label}
          </button>
        ))}
      </div>

      {/* App Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          style={{ background: selectedApp === 'fifgo' ? '#f0fdf4' : '#fffbeb' }}>
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-200 shrink-0">
            <img src={selectedApp === 'fifgo' ? FIFGO_LOGO : FIFADA_LOGO} alt={selectedApp} className="w-14 h-14 object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-xl font-extrabold" style={{ color: '#111827' }}>
                {selectedApp === 'fifgo' ? 'FIFGO' : 'FIFADA'}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={selectedApp === 'fifgo'
                  ? { background: '#d1fae5', color: '#065f46' }
                  : { background: '#fef3c7', color: '#92400e' }
                }>
                {metrics?.statusText ?? '...'}
              </span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>{metrics?.version ?? ''}</span>
            </div>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Last updated: {metrics?.lastUpdated ?? '...'}</p>
          </div>
          <div className="flex gap-6 flex-wrap">
            {[
              { label: 'Rating', value: `${metrics?.rating ?? '...'}` },
              { label: 'Downloads', value: metrics?.downloads ?? '...' },
              { label: 'MAU', value: metrics?.mau ?? '...' },
            ].map(s => (
              <div key={s.label} className="text-center">
                {isLoading
                  ? <Skeleton className="w-12 h-6 mb-1 mx-auto" />
                  : <p className="text-xl font-extrabold" style={{ color: '#111827' }}>{s.value}{s.label === 'Rating' ? '★' : ''}</p>
                }
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="p-4 sm:p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Performance Metrics</h3>
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {metrics?.metrics.map(m => (
                <MetricCard key={m.label} label={m.label} value={m.value} target={m.target} good={m.good} />
              ))}
            </div>
          )}
        </div>

        {/* Issues */}
        {!isLoading && metrics && metrics.issues.length > 0 && (
          <div className="px-4 sm:px-6 pb-6">
            <h3 className="text-sm font-bold mb-3" style={{ color: '#111827' }}>Active Issues</h3>
            <div className="space-y-2">
              {metrics.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: issue.severity === 'high' ? '#fef2f2' : '#fffbeb', border: `1px solid ${issue.severity === 'high' ? '#fecaca' : '#fde68a'}` }}>
                  <Warning size={14} style={{ color: issue.severity === 'high' ? '#dc2626' : '#d97706' }} weight="fill" className="mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium" style={{ color: '#374151' }}>{issue.text}</p>
                    <p className="text-[10px]" style={{ color: '#9ca3af' }}>{issue.date}</p>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: issue.severity === 'high' ? '#fee2e2' : '#fef3c7', color: issue.severity === 'high' ? '#dc2626' : '#d97706' }}>
                    {issue.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating Trend Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Rating Trend (5 periods)</h3>
        {isLoading ? (
          <Skeleton className="w-full h-40 rounded-2xl" />
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={metrics?.ratingTrend.map((r, i) => ({ period: `P${5-i}`, rating: r })) ?? []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[3, 4.5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} ticks={[3, 3.5, 4, 4.5]} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [`${v}★`, 'Rating']}
              />
              <Line type="monotone" dataKey="rating" stroke={metrics?.ratingColors ?? '#1e3a5f'} strokeWidth={3} dot={{ r: 5, fill: metrics?.ratingColors ?? '#1e3a5f' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Metrics vs Target Bar Chart */}
      {!isLoading && barData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Metrics vs Target</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} barGap={4}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }}
                formatter={(v, _name) => [v, _name === 'value' ? 'Actual' : 'Target']}
              />
              <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Target" />
              <Bar dataKey="value" fill={metrics?.ratingColors ?? '#1e3a5f'} radius={[4, 4, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
