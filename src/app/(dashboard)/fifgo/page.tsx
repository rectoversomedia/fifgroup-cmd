'use client';

import * as React from 'react';
import {
  Star, Download, ShieldCheck, AppWindow,
  CheckCircle, Warning, Gear, Lightning,
} from '@phosphor-icons/react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FifgoAdminPanel, loadFifgoData, saveFifgoData, FifgoData } from '@/components/fifgo-admin';

const FIFGO_LOGO = '/images/fifgo-logo.png';
const APPSTORE_ICON = '';
const PLAYSTORE_ICON = '';

export default function FIFGOPage() {
  const [store, setStore] = React.useState<'playstore' | 'appstore'>('playstore');
  const [timeStr, setTimeStr] = React.useState('--:--');
  const [showAdmin, setShowAdmin] = React.useState(false);
  const [data, setData] = React.useState<FifgoData>(loadFifgoData);

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const handleDataChange = (newData: FifgoData) => {
    setData(newData);
    saveFifgoData(newData);
  };

  const isHealthy = data.appHealthMetrics.every(m => m.good);
  const s = data[store];
  const asoScore = data.ascoreBreakdown.reduce((acc, item) => acc + item.score * item.weight / 100, 0);
  const totalPositive = s.ratingDistribution.find(r => r.stars === 5)?.pct ?? 0;
  const totalNegative = (s.ratingDistribution.find(r => r.stars === 1)?.pct ?? 0) + (s.ratingDistribution.find(r => r.stars === 2)?.pct ?? 0);

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm">
            <img src={FIFGO_LOGO} alt="FIFGO" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: '#111827' }}>FIFGO</h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>Super App — Finance · Indonesia</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: isHealthy ? '#d1fae5' : '#fef3c7', color: isHealthy ? '#065f46' : '#92400e' }}>
                {isHealthy ? 'HEALTHY' : 'REVIEW'}
              </span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>{store === 'playstore' ? 'Android' : 'iOS'} · v3.2.1</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
            style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
          >
            <Gear size={13} />
            Edit Data
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>·</span>
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
          </div>
        </div>
      </div>

      {/* Store Toggle */}
      <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 border border-gray-200 w-fit">
        {([
          { id: 'playstore' as const, label: 'Google Play Store' },
          { id: 'appstore' as const, label: 'App Store' },
        ]).map(s_ => (
          <button
            key={s_.id}
            onClick={() => setStore(s_.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={store === s_.id ? { background: '#1f2937', color: '#fff' } : { background: 'transparent', color: '#9ca3af' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={store === s_.id ? '#fff' : '#9ca3af'}>
              {s_.id === 'playstore' ? (
                <path d="M3 18h18v-18H3zm16.5-15c.83 0 1.5.67 1.5 1.5v12c0 .83-.67 1.5-1.5 1.5H6c-.83 0-1.5-.67-1.5-1.5V6c0-.83.67-1.5 1.5-1.5h13.5z" />
              ) : (
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              )}
            </svg>
            {s_.label}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT (no tabs) ── */}
      <div className="space-y-5">

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Star, color: '#f59e0b', label: 'Rating', value: `${s.rating}★`, sub: store === 'playstore' ? `+${(s.rating - 4.0).toFixed(1)} dari 4.0` : `+${(s.rating - 4.3).toFixed(1)} dari 4.3` },
            { icon: Download, color: '#06b6d4', label: 'Downloads', value: s.downloads, sub: s.downloadsChange },
            { icon: ShieldCheck, color: '#10b981', label: 'ASO Score', value: `${Math.round(asoScore)}/100`, sub: `vs avg kompetitor 91` },
            { icon: AppWindow, color: '#8b5cf6', label: 'Active Users', value: s.activeUsers, sub: s.activeUsersChange },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-2xl p-4 border border-gray-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${m.color}15` }}>
                <m.icon size={20} style={{ color: m.color }} weight="fill" />
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#9ca3af' }}>{m.label}</p>
                <p className="text-base font-bold" style={{ color: '#111827' }}>{m.value}</p>
                <p className="text-[11px]" style={{ color: m.color }}>{m.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rating Distribution + Rating Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Rating Distribution */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Rating Distribution</h3>
            <div className="space-y-2.5">
              {s.ratingDistribution.map(r => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="text-xs w-5 text-right shrink-0" style={{ color: '#9ca3af' }}>{r.stars}★</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-xs w-8 text-right shrink-0" style={{ color: '#9ca3af' }}>{r.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 grid grid-cols-3 gap-3" style={{ borderTop: '1px solid #f3f4f6' }}>
              <div className="text-center">
                <p className="text-base font-bold" style={{ color: '#111827' }}>{s.totalReviews}</p>
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>Total Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold" style={{ color: '#10b981' }}>{totalPositive}%</p>
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>Positive (5★)</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold" style={{ color: '#dc2626' }}>{totalNegative}%</p>
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>Negative (1-2★)</p>
              </div>
            </div>
          </div>

          {/* Rating Trend */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Rating Trend — Monthly</h3>
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#f3f4f6', color: '#6b7280' }}>Last 12 Months</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={data.ratingTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[3, 5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} ticks={[3, 3.5, 4, 4.5, 5]} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(v: any) => [`${Number(v).toFixed(2)}★`, 'Rating']}
                  cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line type="monotone" dataKey="rating" stroke="#06b6d4" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#06b6d4', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ASO Score Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>ASO Score Breakdown</h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold" style={{ color: '#10b981' }}>{Math.round(asoScore)}</span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>/ 100</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.ascoreBreakdown.map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium" style={{ color: '#374151' }}>{item.label}</span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-md text-white"
                    style={{ background: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#dc2626' }}>
                    {item.score}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
                  <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#dc2626' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Recommendations</h3>
            <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              {data.recommendations.length} suggestions
            </span>
          </div>
          {/* Priority summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'High', count: data.recommendations.filter(r => r.priority === 'high').length, color: '#dc2626', bg: '#fef2f2' },
              { label: 'Medium', count: data.recommendations.filter(r => r.priority === 'medium').length, color: '#d97706', bg: '#fffbeb' },
              { label: 'Low', count: data.recommendations.filter(r => r.priority === 'low').length, color: '#10b981', bg: '#f0fdf4' },
            ].map(p => (
              <div key={p.label} className="rounded-xl p-3 text-center" style={{ background: p.bg }}>
                <p className="text-lg font-extrabold" style={{ color: p.color }}>{p.count}</p>
                <p className="text-[10px] font-medium" style={{ color: p.color }}>{p.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {data.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border"
                style={{
                  background: rec.priority === 'high' ? '#fef2f2' : rec.priority === 'medium' ? '#fffbeb' : '#f0fdf4',
                  borderColor: rec.priority === 'high' ? '#fecaca' : rec.priority === 'medium' ? '#fde68a' : '#bbf7d0',
                }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: rec.priority === 'high' ? '#fee2e2' : rec.priority === 'medium' ? '#fef3c7' : '#d1fae5' }}>
                  {rec.priority === 'high' ? (
                    <Warning size={14} style={{ color: '#dc2626' }} weight="fill" />
                  ) : rec.priority === 'medium' ? (
                    <Lightning size={14} style={{ color: '#d97706' }} weight="fill" />
                  ) : (
                    <CheckCircle size={14} style={{ color: '#10b981' }} weight="fill" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-bold" style={{ color: '#374151' }}>{rec.title}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold capitalize"
                      style={{
                        background: rec.priority === 'high' ? '#fee2e2' : rec.priority === 'medium' ? '#fef3c7' : '#d1fae5',
                        color: rec.priority === 'high' ? '#dc2626' : rec.priority === 'medium' ? '#d97706' : '#10b981',
                      }}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[11px]" style={{ color: '#6b7280' }}>{rec.description}</p>
                  {rec.impact && (
                    <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>💡 Impact: {rec.impact}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {showAdmin && (
        <FifgoAdminPanel
          data={data}
          onChange={handleDataChange}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
}
