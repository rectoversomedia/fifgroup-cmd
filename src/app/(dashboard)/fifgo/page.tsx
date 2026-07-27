'use client';

import * as React from 'react';
import {
  Star, Download, TrendUp, TrendDown, Minus,
  ChartBar, ShieldCheck, Eye, AppWindow,
  CheckCircle, Warning, Heartbeat
} from '@phosphor-icons/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const FIFGO_LOGO = 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/FIFGO_APP_LOGO-1780892650611.png';

export default function FIFGOPage() {
  const [tab, setTab] = React.useState<'overview' | 'aso' | 'reviews' | 'health'>('overview');
  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const ascoreBreakdown = [
    { label: 'App Title', score: 85, weight: 20, detail: '50 chars, 3 keywords included' },
    { label: 'Description', score: 72, weight: 25, detail: '3,200 chars, good structure' },
    { label: 'Screenshots', score: 90, weight: 20, detail: '5 screenshots, portrait + landscape' },
    { label: 'Icon', score: 95, weight: 10, detail: 'Professional, clear at all sizes' },
    { label: 'Videos', score: 65, weight: 10, detail: 'No promo video' },
    { label: 'Ratings & Reviews', score: 78, weight: 15, detail: '4.2★ from 12,847 reviews' },
  ];

  const keywords = [
    { keyword: 'pinjol mudah', position: 1, volume: '12K', change: 0 },
    { keyword: 'kredit online', position: 3, volume: '45K', change: 2 },
    { keyword: 'pinjaman cepat', position: 2, volume: '28K', change: -1 },
    { keyword: 'digital lending', position: 5, volume: '8K', change: 1 },
    { keyword: 'tunaiku', position: 1, volume: '32K', change: 0 },
    { keyword: 'loan apps', position: 8, volume: '67K', change: 3 },
  ];

  const topReviews = [
    { author: 'Andi S.', rating: 5, date: '2 Jul 2026', text: 'Sangat mudah pengajuannya, dana langsung cair dalam 10 menit. 推荐!' },
    { author: 'Rina W.', rating: 4, date: '28 Jun 2026', text: 'App cepat dan ringan. Tapi bunga agak tinggi untuk jangka panjang.' },
    { author: 'Budi H.', rating: 2, date: '25 Jun 2026', text: 'Sulit upload dokumen, sering error. Semoga diperbaiki.' },
    { author: 'Dewi M.', rating: 5, date: '20 Jun 2026', text: 'Sudah 3x pinjam di FIFGO, all good! Proses transparan.' },
  ];

  const appHealthMetrics = [
    { label: 'App Load Time', value: '1.8s', target: '< 3s', good: true },
    { label: 'API Response', value: '240ms', target: '< 500ms', good: true },
    { label: 'Error Rate', value: '0.2%', target: '< 0.5%', good: true },
    { label: 'Crash Rate', value: '0.1%', target: '< 0.5%', good: true },
    { label: 'Push Delivery', value: '96%', target: '> 95%', good: true },
    { label: 'Session Duration', value: '5.4m', target: '> 3m', good: true },
  ];

  const ratingTrend = [
    { period: 'Mar', rating: 4.0 }, { period: 'Apr', rating: 4.1 },
    { period: 'May', rating: 4.1 }, { period: 'Jun', rating: 4.2 },
    { period: 'Jul', rating: 4.2 },
  ];

  const issues = [
    { severity: 'medium', text: 'App Load Time degraded on Android 14 devices — investigating', date: '22 Jul 2026' },
  ];


  return (
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm">
            <img src={FIFGO_LOGO} alt="FIFGO" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>FIFGO</h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>Super App — Finance · Indonesia</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#d1fae5', color: '#065f46' }}>HEALTHY</span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>Android · v3.2.1</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>·</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'aso', label: 'ASO' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'health', label: 'App Health' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0"
            style={tab === t.id
              ? { background: '#06b6d4', color: '#fff' }
              : { background: 'transparent', color: '#6b7280' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Key Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Star, color: '#f59e0b', label: 'Rating', value: '4.2★', change: '+0.1' },
              { icon: Download, color: '#06b6d4', label: 'Downloads', value: '850K', change: '+23%' },
              { icon: ShieldCheck, color: '#10b981', label: 'ASO Score', value: '78/100', change: '+4' },
              { icon: AppWindow, color: '#8b5cf6', label: 'Active Users', value: '234K', change: '+15%' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${stat.color}15` }}>
                  <stat.icon size={22} style={{ color: stat.color }} weight="fill" />
                </div>
                <p className="text-2xl font-extrabold mb-1" style={{ color: '#111827' }}>{stat.value}</p>
                <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>{stat.label}</p>
                <span className="text-[11px] font-bold" style={{ color: '#10b981' }}>{stat.change}</span>
              </div>
            ))}
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const widths = [68, 18, 8, 4, 2];
                const w = widths[5 - star];
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs w-6 text-right" style={{ color: '#9ca3af' }}>{star}★</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: '#f3f4f6' }}>
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${w}%` }} />
                    </div>
                    <span className="text-xs w-8" style={{ color: '#9ca3af' }}>{w}%</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 grid grid-cols-3 gap-4" style={{ borderTop: '1px solid #f3f4f6' }}>
              {[
                { label: 'Total Reviews', value: '12,847' },
                { label: 'Positive (5★)', value: '68%', color: '#10b981' },
                { label: 'Negative (1-2★)', value: '6%', color: '#dc2626' },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <p className="text-lg font-extrabold" style={{ color: m.color ?? '#111827' }}>{m.value}</p>
                  <p className="text-[11px]" style={{ color: '#9ca3af' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LoBs */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>LoBs Inside FIFGO</h3>
            <div className="grid grid-cols-5 gap-3">
              {[
                { name: 'FIFASTRA', pct: 72, users: '168K', status: 'On Track', color: '#4f8ef7' },
                { name: 'SPEKTRA', pct: 28, users: '65K', status: 'Below Target', color: '#f97316' },
                { name: 'DANASTRA', pct: 61, users: '142K', status: 'Growing', color: '#06b6d4' },
                { name: 'FINATRA', pct: 45, users: '105K', status: 'Stable', color: '#f59e0b' },
                { name: 'AMITRA', pct: 52, users: '121K', status: 'Growing', color: '#10b981' },
              ].map(lob => (
                <div key={lob.name} className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-xs font-bold text-white" style={{ background: lob.color }}>
                    {lob.name[0]}
                  </div>
                  <p className="text-[11px] font-bold" style={{ color: '#374151' }}>{lob.name}</p>
                  <p className="text-lg font-extrabold mt-1" style={{ color: '#111827' }}>{lob.pct}%</p>
                  <p className="text-[10px]" style={{ color: '#9ca3af' }}>{lob.users}</p>
                  <span className="text-[10px] mt-1 inline-block px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: lob.status === 'Below Target' ? '#fef3c7' : '#d1fae5', color: lob.status === 'Below Target' ? '#92400e' : '#065f46' }}>
                    {lob.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── ASO TAB ─── */}
      {tab === 'aso' && (
        <div className="space-y-5">
          {/* ASO Score Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold" style={{ color: '#111827' }}>ASO Score Breakdown</h3>
              <span className="text-sm font-bold" style={{ color: '#10b981' }}>78 / 100</span>
            </div>
            <div className="space-y-4">
              {ascoreBreakdown.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: '#374151' }}>{item.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#9ca3af' }}>{item.weight}%</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#111827' }}>{item.score}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#dc2626' }} />
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Keyword Rankings</h3>
            <div className="space-y-2">
              {keywords.map(kw => (
                <div key={kw.keyword} className="flex items-center gap-4 py-2" style={{ borderBottom: '1px solid #f9fafb' }}>
                  <span className="flex-1 text-sm font-medium" style={{ color: '#374151' }}>{kw.keyword}</span>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    kw.position <= 3 ? 'text-white' : kw.position <= 10 ? 'text-white' : 'text-white'
                  }`}
                    style={{ background: kw.position <= 3 ? '#10b981' : kw.position <= 10 ? '#f59e0b' : '#9ca3af' }}>
                    #{kw.position}
                  </span>
                  <span className="w-12 text-center text-xs" style={{ color: '#9ca3af' }}>{kw.volume}</span>
                  <span className="w-10 text-right text-xs font-bold" style={{ color: kw.change > 0 ? '#10b981' : kw.change < 0 ? '#dc2626' : '#9ca3af' }}>
                    {kw.change > 0 ? '+' : ''}{kw.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── REVIEWS TAB ─── */}
      {tab === 'reviews' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Recent Reviews</h3>
          <div className="space-y-4">
            {topReviews.map((review, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: '#4f8ef7' }}>
                      {review.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#111827' }}>{review.author}</p>
                      <p className="text-[10px]" style={{ color: '#9ca3af' }}>{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={11} weight={si < review.rating ? 'fill' : 'regular'} style={{ color: si < review.rating ? '#f59e0b' : '#d1d5db' }} />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── APP HEALTH TAB ─── */}
      {tab === 'health' && (
        <div className="space-y-5">
          {/* App Health Status Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200">
                <img src={FIFGO_LOGO} alt="FIFGO" className="w-12 h-12 object-contain" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-extrabold" style={{ color: '#111827' }}>FIFGO — App Health</h2>
                <p className="text-xs" style={{ color: '#9ca3af' }}>Last updated: {timeStr} WIB · v3.2.1</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#d1fae5', color: '#065f46' }}>HEALTHY</span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
              {appHealthMetrics.map(m => (
                <div key={m.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
                  <div className="flex items-center gap-1.5 mb-2">
                    {m.good
                      ? <CheckCircle size={14} style={{ color: '#10b981' }} weight="fill" />
                      : <Warning size={14} style={{ color: '#dc2626' }} weight="fill" />
                    }
                    <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{m.label}</span>
                  </div>
                  <p className="text-2xl font-extrabold mb-1" style={{ color: m.good ? '#111827' : '#dc2626' }}>{m.value}</p>
                  <p className="text-[10px]" style={{ color: '#9ca3af' }}>Target: {m.target}</p>
                </div>
              ))}
            </div>

            {/* Issues */}
            {issues.length > 0 && (
              <div className="space-y-2 mb-5">
                <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Active Issues</h3>
                {issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: issue.severity === 'high' ? '#fef2f2' : '#fffbeb', border: `1px solid ${issue.severity === 'high' ? '#fecaca' : '#fde68a'}` }}>
                    <Warning size={14} style={{ color: issue.severity === 'high' ? '#dc2626' : '#d97706' }} weight="fill" className="mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: '#374151' }}>{issue.text}</p>
                      <p className="text-[10px]" style={{ color: '#9ca3af' }}>{issue.date}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: issue.severity === 'high' ? '#fee2e2' : '#fef3c7', color: issue.severity === 'high' ? '#dc2626' : '#d97706' }}>
                      {issue.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Rating Trend */}
            <div>
              <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Rating Trend (5 months)</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={ratingTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[3, 4.5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} ticks={[3, 3.5, 4, 4.5]} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v}★`, 'Rating']} />
                  <Line type="monotone" dataKey="rating" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5, fill: '#06b6d4' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
