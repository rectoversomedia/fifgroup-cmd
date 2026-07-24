'use client';

import * as React from 'react';
import { TrendUp, TrendDown, Star, Warning, CheckCircle } from '@phosphor-icons/react';

const FIFGO_LOGO = 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/FIFGO_APP_LOGO-1780892650611.png';
const FIFADA_LOGO = 'https://www.fifgroup.co.id/assets/images/png/fifada-logo.png';

const metrics = {
  fifgo: {
    status: 'healthy', statusText: 'HEALTHY', version: 'v3.2.1', lastUpdated: '23 Jul 2026',
    rating: '4.2', downloads: '850K', mau: '234K',
    metrics: [
      { label: 'App Load Time', value: '1.8s', target: '< 3s', good: true },
      { label: 'API Response', value: '210ms', target: '< 500ms', good: true },
      { label: 'Error Rate', value: '0.2%', target: '< 1%', good: true },
      { label: 'Crash Rate', value: '0.05%', target: '< 0.5%', good: true },
      { label: 'Push Delivery', value: '99.1%', target: '> 95%', good: true },
      { label: 'Session Duration', value: '8.4 min', target: '> 5 min', good: true },
    ],
    issues: [],
    ratingTrend: [4.1, 4.1, 4.2, 4.2, 4.2],
    ratingColors: '#10b981',
  },
  fifada: {
    status: 'watch', statusText: 'WATCH', version: 'v2.8.0', lastUpdated: '23 Jul 2026',
    rating: '3.8', downloads: '210K', mau: '62K',
    metrics: [
      { label: 'App Load Time', value: '2.1s', target: '< 3s', good: true },
      { label: 'API Response', value: '480ms', target: '< 500ms', good: true },
      { label: 'Error Rate', value: '1.4%', target: '< 1%', good: false },
      { label: 'Crash Rate', value: '0.8%', target: '< 0.5%', good: false },
      { label: 'Push Delivery', value: '94.2%', target: '> 95%', good: false },
      { label: 'Session Duration', value: '5.1 min', target: '> 5 min', good: true },
    ],
    issues: [
      { severity: 'high', text: 'Crash rate exceeds threshold — 1.4% detected', date: '22 Jul 2026' },
      { severity: 'high', text: 'Error rate 1.4% — above 1% threshold', date: '22 Jul 2026' },
      { severity: 'medium', text: 'Push delivery at 94.2% — below 95% target', date: '21 Jul 2026' },
    ],
    ratingTrend: [4.2, 4.1, 4.0, 3.9, 3.8],
    ratingColors: '#f43f5e',
  },
};

export default function AppHealthPage() {
  const [selectedApp, setSelectedApp] = React.useState<'fifgo' | 'fifada'>('fifgo');
  const app = metrics[selectedApp];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>App Health</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Real-time app performance monitoring</p>
        </div>
        <div className="flex gap-2">
          {([['fifgo', 'FIFGO'], ['fifada', 'FIFADA']] as const).map(([t, label]) => (
            <button key={t} onClick={() => setSelectedApp(t)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={selectedApp === t ? { background: '#1e3a5f', color: '#fff', border: '1px solid #1e3a5f' } : { background: 'white', color: '#374151', border: '1px solid #e5e7eb' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* App Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 flex items-center gap-5" style={{ background: selectedApp === 'fifgo' ? '#f0fdf4' : '#fffbeb' }}>
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-200 shrink-0">
            <img src={selectedApp === 'fifgo' ? FIFGO_LOGO : FIFADA_LOGO} alt={selectedApp} className="w-14 h-14 object-contain" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-extrabold" style={{ color: '#111827' }}>{selectedApp === 'fifgo' ? 'FIFGO' : 'FIFADA'}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={selectedApp === 'fifgo' ? { background: '#d1fae5', color: '#065f46' } : { background: '#fef3c7', color: '#92400e' }}>
                {app.statusText}
              </span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>{app.version}</span>
            </div>
            <p className="text-xs" style={{ color: '#9ca3af' }}>Last updated: {app.lastUpdated}</p>
          </div>
          <div className="flex gap-6">
            {[
              { label: 'Rating', value: `${app.rating}★` },
              { label: 'Downloads', value: app.downloads },
              { label: 'MAU', value: app.mau },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-extrabold" style={{ color: '#111827' }}>{s.value}</p>
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Performance Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            {app.metrics.map(m => (
              <div key={m.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                  {m.good ? (
                    <CheckCircle size={16} style={{ color: '#10b981' }} weight="fill" />
                  ) : (
                    <Warning size={16} style={{ color: '#dc2626' }} weight="fill" />
                  )}
                  <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{m.label}</span>
                </div>
                <p className="text-2xl font-extrabold mb-1" style={{ color: m.good ? '#111827' : '#dc2626' }}>{m.value}</p>
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>Target: {m.target}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        {app.issues.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-sm font-bold mb-3" style={{ color: '#111827' }}>Active Issues</h3>
            <div className="space-y-2">
              {app.issues.map((issue, i) => (
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

      {/* Rating Trend */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Rating Trend (5 periods)</h3>
        <div className="flex items-end gap-5 h-28 px-4">
          {app.ratingTrend.map((r, i) => {
            const height = ((r - 3) / 2) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: '64px' }}>
                  <div className="w-10 rounded-t-lg" style={{ height: `${height}%`, background: app.ratingColors }} />
                </div>
                <span className="text-xs font-bold" style={{ color: '#374151' }}>{r}★</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between px-4 mt-2">
          {['Period -4', 'Period -3', 'Period -2', 'Period -1', 'Current'].map(p => (
            <span key={p} className="text-[10px]" style={{ color: '#9ca3af' }}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
