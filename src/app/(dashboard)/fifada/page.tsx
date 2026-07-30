'use client';

import * as React from 'react';
import {
  Star, Download, TrendUp, TrendDown,
  Warning, Heartbeat, CheckCircle, ClockCountdown, ShieldCheck
} from '@phosphor-icons/react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const FIFADA_LOGO = '/images/fifada-logo.jpg';
const APPSTORE_ICON = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/apple.svg';
const PLAYSTORE_ICON = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googleplay.svg';

type FifadaStoreData = {
  rating: number;
  ratingChange: string;
  downloads: string;
  downloadsChange: string;
  totalReviews: string;
  ratingDistribution: { stars: number; pct: number }[];
  ratingTrend: { period: string; rating: number }[];
  ascoreBreakdown: { label: string; score: number; weight: number; detail: string }[];
  keywords: { keyword: string; position: number; volume: string; change: number }[];
};

const FIFADA_DATA: Record<'playstore' | 'appstore', FifadaStoreData> = {
  playstore: {
    rating: 3.8,
    ratingChange: '-0.2',
    downloads: '210K',
    downloadsChange: '+3%',
    totalReviews: '3,241',
    ratingDistribution: [
      { stars: 5, pct: 52 }, { stars: 4, pct: 16 }, { stars: 3, pct: 12 }, { stars: 2, pct: 10 }, { stars: 1, pct: 10 },
    ],
    ratingTrend: [
      { period: 'Apr', rating: 4.2 }, { period: 'May', rating: 4.1 },
      { period: 'Jun', rating: 4.0 }, { period: 'Jul 10', rating: 3.9 },
      { period: 'Jul 13', rating: 3.8 },
    ],
    ascoreBreakdown: [
      { label: 'App Title', score: 78, weight: 20, detail: '48 chars, 2 keywords included' },
      { label: 'Description', score: 65, weight: 25, detail: '2,800 chars, outdated screenshots' },
      { label: 'Screenshots', score: 72, weight: 20, detail: '3 screenshots, portrait only' },
      { label: 'Icon', score: 80, weight: 10, detail: 'Acceptable, needs refresh' },
      { label: 'Videos', score: 0, weight: 10, detail: 'No promo video' },
      { label: 'Ratings & Reviews', score: 68, weight: 15, detail: '3.8★ from 3,241 reviews' },
    ],
    keywords: [
      { keyword: 'multiguna fif', position: 2, volume: '18K', change: -1 },
      { keyword: 'kredit motor', position: 5, volume: '34K', change: 0 },
      { keyword: 'pembiayaan', position: 8, volume: '22K', change: 2 },
      { keyword: 'fifgroup', position: 1, volume: '41K', change: 0 },
      { keyword: 'pinjaman online', position: 12, volume: '67K', change: -2 },
      { keyword: 'angsuran', position: 6, volume: '15K', change: 1 },
    ],
  },
  appstore: {
    rating: 4.1,
    ratingChange: '+0.1',
    downloads: '28K',
    downloadsChange: '+18%',
    totalReviews: '412',
    ratingDistribution: [
      { stars: 5, pct: 60 }, { stars: 4, pct: 18 }, { stars: 3, pct: 10 }, { stars: 2, pct: 7 }, { stars: 1, pct: 5 },
    ],
    ratingTrend: [
      { period: 'Apr', rating: 4.0 }, { period: 'May', rating: 4.0 },
      { period: 'Jun', rating: 4.1 }, { period: 'Jul 10', rating: 4.1 },
      { period: 'Jul 13', rating: 4.1 },
    ],
    ascoreBreakdown: [
      { label: 'App Title', score: 82, weight: 20, detail: '50 chars, 3 keywords included' },
      { label: 'Description', score: 70, weight: 25, detail: '3,000 chars, good structure' },
      { label: 'Screenshots', score: 78, weight: 20, detail: '4 screenshots, portrait + landscape' },
      { label: 'Icon', score: 85, weight: 10, detail: 'Professional, clear at all sizes' },
      { label: 'Videos', score: 0, weight: 10, detail: 'No promo video' },
      { label: 'Ratings & Reviews', score: 72, weight: 15, detail: '4.1★ from 412 reviews' },
    ],
    keywords: [
      { keyword: 'multiguna fif', position: 1, volume: '18K', change: 0 },
      { keyword: 'kredit motor', position: 3, volume: '34K', change: 1 },
      { keyword: 'pembiayaan', position: 6, volume: '22K', change: 2 },
      { keyword: 'fifgroup', position: 1, volume: '41K', change: 0 },
      { keyword: 'pinjaman online', position: 9, volume: '67K', change: -1 },
      { keyword: 'angsuran', position: 4, volume: '15K', change: 2 },
    ],
  },
};

const APP_HEALTH = {
  playstore: {
    metrics: [
      { label: 'App Load Time', value: '2.1s', target: '< 3s', good: true },
      { label: 'API Response', value: '310ms', target: '< 500ms', good: true },
      { label: 'Error Rate', value: '1.4%', target: '< 0.5%', good: false },
      { label: 'Crash Rate', value: '1.4%', target: '< 0.5%', good: false },
      { label: 'Push Delivery', value: '94.2%', target: '> 95%', good: false },
      { label: 'Session Duration', value: '4.1m', target: '> 3m', good: true },
    ],
    issues: [
      { severity: 'high', text: 'FIFADA crash rate 1.4% — threshold 0.5%. Investigating ANR in Android 13.', date: '23 Jul 2026' },
      { severity: 'high', text: 'FIFADA error rate 1.4% — above 0.5% threshold. Root cause: payment gateway timeout.', date: '22 Jul 2026' },
      { severity: 'medium', text: 'Push delivery 94.2% — below 95% target. Check FCM configuration.', date: '20 Jul 2026' },
    ],
  },
  appstore: {
    metrics: [
      { label: 'App Load Time', value: '1.9s', target: '< 3s', good: true },
      { label: 'API Response', value: '280ms', target: '< 500ms', good: true },
      { label: 'Error Rate', value: '0.3%', target: '< 0.5%', good: true },
      { label: 'Crash Rate', value: '0.2%', target: '< 0.5%', good: true },
      { label: 'Push Delivery', value: '97%', target: '> 95%', good: true },
      { label: 'Session Duration', value: '4.8m', target: '> 3m', good: true },
    ],
    issues: [],
  },
};

const REVIEWS = {
  playstore: [
    { author: 'Joko P.', rating: 1, date: '1 Jul 2026', text: 'Sudah 7 hari belum cair, pihak cabang bilang tunggu. Sangat mengecewakan!' },
    { author: 'Siti N.', rating: 2, date: '29 Jun 2026', text: 'Proses di cabang lama sekali. Seharusnya bisa online semua.' },
    { author: 'Ahmad R.', rating: 2, date: '27 Jun 2026', text: 'App oke tapi pas datang ke cabang antri 2 jam. Tidak efisien.' },
    { author: 'Maya L.', rating: 3, date: '25 Jun 2026', text: 'Process okay tapi CS cabang kurang ramah. Semoga lebih baik.' },
  ],
  appstore: [
    { author: 'Dian P.', rating: 5, date: '2 Jul 2026', text: ' Proses pengajuan cepat dan mudah. CS apps sangat membantu dan responsif.' },
    { author: 'Hendra W.', rating: 4, date: '28 Jun 2026', text: 'Bagus, tapi butuh improvement di bagian upload dokumen.' },
    { author: 'Lisa K.', rating: 4, date: '22 Jun 2026', text: 'App stabil di iPhone, mudah dipahami. recommended!' },
    { author: 'Bayu R.', rating: 3, date: '18 Jun 2026', text: 'Lumayan tapi push notif kadang telat. Semoga diperbaiki.' },
  ],
};

export default function FIFADAPage() {
  const [tab, setTab] = React.useState<'overview' | 'aso' | 'reviews' | 'health'>('overview');
  const [store, setStore] = React.useState<'playstore' | 'appstore'>('playstore');
  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const s = FIFADA_DATA[store];
  const health = APP_HEALTH[store];
  const hasIssues = health.issues.length > 0;
  const isHealthy = health.metrics.every(m => m.good);
  const asoScore = s.ascoreBreakdown.reduce((acc, item) => acc + item.score * item.weight / 100, 0);
  const negativeReviews = REVIEWS[store];

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm">
            <img src={FIFADA_LOGO} alt="FIFADA" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>FIFADA</h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>Multi Finance · Indonesia</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: isHealthy ? '#d1fae5' : '#fef3c7', color: isHealthy ? '#065f46' : '#92400e' }}>
                {isHealthy ? 'HEALTHY' : 'WATCH'}
              </span>
              <span className="text-xs" style={{ color: '#9ca3af' }}>{store === 'playstore' ? 'Android' : 'iOS'} · v2.8.0</span>
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

      {/* Store Toggle */}
      <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 border border-gray-200 w-fit">
        {([
          { id: 'playstore' as const, label: 'Google Play Store', icon: PLAYSTORE_ICON },
          { id: 'appstore' as const, label: 'Apple App Store', icon: APPSTORE_ICON },
        ]).map(s_ => (
          <button
            key={s_.id}
            onClick={() => setStore(s_.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={store === s_.id ? { background: '#1f2937', color: '#fff' } : { background: 'transparent', color: '#9ca3af' }}
          >
            <img src={s_.icon} alt={s_.label} className="w-4 h-4 object-contain" style={store !== s_.id ? { filter: 'grayscale(1) opacity(0.45)' } : {}} />
            {s_.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'aso', label: 'ASO' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'health', label: 'App Health' },
        ].map(t_ => (
          <button
            key={t_.id}
            onClick={() => setTab(t_.id as typeof tab)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0"
            style={tab === t_.id
              ? { background: '#f59e0b', color: '#fff' }
              : { background: 'transparent', color: '#6b7280' }
            }
          >
            {t_.id === 'aso' ? 'ASO' : t_.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Alert Banner */}
          {store === 'playstore' && (
            <div className="rounded-2xl p-4 flex items-start gap-3 bg-white border border-amber-200">
              <Warning size={20} style={{ color: '#d97706' }} weight="fill" className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold" style={{ color: '#92400e' }}>Rating Alert</p>
                <p className="text-xs mt-0.5" style={{ color: '#92400e' }}>FIFADA rating dropped 0.4★ in 3 days. 60% negative reviews cite branch processing time. Owner: Operations Team.</p>
              </div>
            </div>
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Star, color: '#f59e0b', label: 'Rating',
                value: `${s.rating}★`, change: s.ratingChange,
                negative: parseFloat(s.ratingChange) < 0,
              },
              {
                icon: Download, color: '#f59e0b', label: 'Downloads',
                value: s.downloads, change: s.downloadsChange, negative: false,
              },
              {
                icon: ShieldCheck, color: '#10b981', label: 'ASO Score',
                value: `${Math.round(asoScore)}/100`, change: `+${Math.round(asoScore - 60)}`, negative: false,
              },
              {
                icon: Heartbeat, color: isHealthy ? '#10b981' : '#dc2626', label: 'App Health',
                value: isHealthy ? '✓' : '⚠', change: isHealthy ? 'OK' : `${health.issues.length} issue${health.issues.length > 1 ? 's' : ''}`,
                negative: !isHealthy,
              },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${stat.color}15` }}>
                  <stat.icon size={22} style={{ color: stat.color }} weight="fill" />
                </div>
                <p className="text-2xl font-extrabold mb-1" style={{ color: '#111827' }}>{stat.value}</p>
                <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>{stat.label}</p>
                <span className="text-[11px] font-bold" style={{ color: stat.negative ? '#dc2626' : '#10b981' }}>
                  {stat.change}
                </span>
              </div>
            ))}
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Rating Distribution</h3>
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                {store === 'playstore' ? 'Play Store' : 'App Store'}
              </span>
            </div>
            <div className="space-y-2">
              {s.ratingDistribution.map(r => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="text-xs w-6 text-right" style={{ color: '#9ca3af' }}>{r.stars}★</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-xs w-8" style={{ color: '#9ca3af' }}>{r.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 grid grid-cols-3 gap-4" style={{ borderTop: '1px solid #f3f4f6' }}>
              {[
                { label: 'Total Reviews', value: s.totalReviews },
                { label: 'Positive (5★)', value: `${s.ratingDistribution.find(r => r.stars === 5)?.pct ?? 0}%`, color: '#10b981' },
                { label: 'Negative (1-2★)', value: `${(s.ratingDistribution.find(r => r.stars === 1)?.pct ?? 0) + (s.ratingDistribution.find(r => r.stars === 2)?.pct ?? 0)}%`, color: '#dc2626' },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <p className="text-lg font-extrabold" style={{ color: m.color ?? '#111827' }}>{m.value}</p>
                  <p className="text-[11px]" style={{ color: '#9ca3af' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Root Cause Analysis — Play Store only */}
          {store === 'playstore' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Root Cause Analysis</h3>
              <div className="space-y-3">
                {[
                  { pct: '60%', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', desc: 'of negative reviews cite', quote: '"Process terlalu lama di cabang"' },
                  { pct: '45%', color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: 'of applications require', quote: 'branch visit for document verification' },
                  { pct: '7 days', color: '#4f8ef7', bg: '#eff6ff', border: '#bfdbfe', desc: 'average branch processing', quote: 'vs 2 days digital processing target' },
                ].map(item => (
                  <div key={item.pct} className="p-3 rounded-xl" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold" style={{ color: item.color }}>{item.pct}</span>
                      <span className="text-xs" style={{ color: '#6b7280' }}>{item.desc}</span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: '#374151' }}>{item.quote}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl flex items-center gap-3 bg-emerald-50 border border-emerald-200">
                <div>
                  <p className="text-xs font-bold" style={{ color: '#065f46' }}>Recommended Action</p>
                  <p className="text-xs mt-0.5" style={{ color: '#374151' }}>Sync with operations team to reduce branch processing SLA. Consider implementing queue booking via app to reduce wait time.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── ASO TAB ─── */}
      {tab === 'aso' && (
        <div className="space-y-5">
          {/* ASO Score Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold" style={{ color: '#111827' }}>ASO Score Breakdown</h3>
              <span className="text-sm font-bold" style={{ color: '#10b981' }}>{Math.round(asoScore)} / 100</span>
            </div>
            <div className="space-y-4">
              {s.ascoreBreakdown.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: '#374151' }}>{item.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#9ca3af' }}>{item.weight}%</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#111827' }}>{item.score}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.score}%`, background: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#dc2626' }} />
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
              {s.keywords.map(kw => (
                <div key={kw.keyword} className="flex items-center gap-4 py-2" style={{ borderBottom: '1px solid #f9fafb' }}>
                  <span className="flex-1 text-sm font-medium" style={{ color: '#374151' }}>{kw.keyword}</span>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
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
            {negativeReviews.map((review, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: '#f59e0b' }}>
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
          {/* Alert Banner */}
          {!isHealthy && (
            <div className="rounded-2xl p-4 flex items-start gap-3 bg-red-50 border border-red-200">
              <Warning size={20} style={{ color: '#dc2626' }} weight="fill" className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold" style={{ color: '#dc2626' }}>Health Issues Detected</p>
                <p className="text-xs mt-0.5" style={{ color: '#374151' }}>
                  {health.issues.length} issue{health.issues.length > 1 ? 's' : ''} found on {store === 'playstore' ? 'Google Play Store' : 'App Store'} build.
                </p>
              </div>
            </div>
          )}

          {/* App Health Status Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200">
                <img src={FIFADA_LOGO} alt="FIFADA" className="w-12 h-12 object-contain" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-extrabold" style={{ color: '#111827' }}>FIFADA — App Health</h2>
                <p className="text-xs" style={{ color: '#9ca3af' }}>Last updated: {timeStr} WIB · v2.8.0 · {store === 'playstore' ? 'Play Store' : 'App Store'}</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: isHealthy ? '#d1fae5' : '#fef3c7', color: isHealthy ? '#065f46' : '#92400e' }}>
                {isHealthy ? 'HEALTHY' : 'WATCH'}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
              {health.metrics.map(m => (
                <div key={m.label} className="rounded-2xl p-4 border flex flex-col items-center text-center"
                  style={{ background: m.good ? '#f9fafb' : '#fef2f2', borderColor: m.good ? '#f3f4f6' : '#fecaca' }}>
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
            {health.issues.length > 0 && (
              <div className="space-y-2 mb-5">
                <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Active Issues ({health.issues.filter(i => i.severity === 'high').length} high)</h3>
                {health.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: issue.severity === 'high' ? '#fef2f2' : '#fffbeb', border: `1px solid ${issue.severity === 'high' ? '#fecaca' : '#fde68a'}` }}>
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
              <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Rating Trend</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={s.ratingTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[3, 4.5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} ticks={[3, 3.5, 4, 4.5]} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v}★`, 'Rating']} />
                  <Line type="monotone" dataKey="rating" stroke="#dc2626" strokeWidth={3} dot={{ r: 5, fill: '#dc2626' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
