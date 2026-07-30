'use client';

import * as React from 'react';
import {
  Star, Download, TrendUp, TrendDown, Minus,
  ChartBar, ShieldCheck, Eye, AppWindow,
  CheckCircle, Warning, Gear, Lightning,
} from '@phosphor-icons/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';
import { FifgoAdminPanel, DEFAULT_FIFGO, loadFifgoData, saveFifgoData, FifgoData } from '@/components/fifgo-admin';

const FIFGO_LOGO = 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/FIFGO_APP_LOGO-1780892650611.png';
const APPSTORE_ICON = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/apple.svg';
const PLAYSTORE_ICON = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googleplay.svg';

export default function FIFGOPage() {
  const [tab, setTab] = React.useState<'overview' | 'aso' | 'reviews' | 'rec'>('overview');
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
          { id: 'playstore' as const, label: 'Google Play Store', icon: PLAYSTORE_ICON },
          { id: 'appstore' as const, label: 'App Store', icon: APPSTORE_ICON },
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
          { id: 'rec', label: 'Recommendation' },
        ].map(t_ => (
          <button
            key={t_.id}
            onClick={() => setTab(t_.id as typeof tab)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0"
            style={tab === t_.id
              ? { background: '#06b6d4', color: '#fff' }
              : { background: 'transparent', color: '#6b7280' }
            }
          >
            {t_.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Key Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Star, color: '#f59e0b', label: 'Rating', value: `${s.rating}★`, change: store === 'playstore' ? `+${(s.rating - 4.0).toFixed(1)}` : `+${(s.rating - 4.3).toFixed(1)}` },
              { icon: Download, color: '#06b6d4', label: 'Downloads', value: s.downloads, change: s.downloadsChange },
              { icon: ShieldCheck, color: '#10b981', label: 'ASO Score', value: `${Math.round(asoScore)}/100`, change: `+${Math.round(asoScore - 74)}` },
              { icon: AppWindow, color: '#8b5cf6', label: 'Active Users', value: s.activeUsers, change: s.activeUsersChange },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${stat.color}15` }}>
                  <stat.icon size={22} style={{ color: stat.color }} weight="fill" />
                </div>
                <p className="text-base font-bold" style={{ color: '#111827' }}>{stat.value}</p>
                <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>{stat.label}</p>
                <span className="text-[11px] font-bold" style={{ color: '#10b981' }}>{stat.change}</span>
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
                  <p className="text-base font-bold" style={{ color: m.color ?? '#111827' }}>{m.value}</p>
                  <p className="text-[11px]" style={{ color: '#9ca3af' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Trend — Monthly */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Rating Trend — Monthly</h3>
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                Last 12 Months
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data.ratingTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fifgoRatingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[3, 5]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} ticks={[3, 3.5, 4, 4.5, 5]} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(v: any) => [`${Number(v).toFixed(2)}★`, 'Rating']}
                  cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#06b6d4', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ─── ASO TAB — AppTweak Style ─── */}
      {tab === 'aso' && (
        <ASOTab appName="FIFGO: Pembiayaan Mudah" appDev="FIFGROUP DEV. TEAM" appCat="Finance · Loans & Credits" store={store} asoScore={asoScore} data={data} />
      )}

      {/* ─── REVIEWS TAB ─── */}
      {tab === 'reviews' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Recent Reviews</h3>
          <div className="space-y-4">
            {data.reviews.map((review, i) => (
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

      {/* ─── RECOMMENDATION TAB ─── */}
      {tab === 'rec' && (
        <div className="space-y-5">
          {/* Recommendation Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200">
                <img src={FIFGO_LOGO} alt="FIFGO" className="w-12 h-12 object-contain" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold" style={{ color: '#111827' }}>FIFGO — Recommendations</h2>
                <p className="text-xs" style={{ color: '#9ca3af' }}>AI-powered ASO & performance improvement suggestions</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                {data.recommendations.length} suggestions
              </span>
            </div>

            {/* Priority Cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'High Priority', count: data.recommendations.filter(r => r.priority === 'high').length, color: '#dc2626', bg: '#fef2f2' },
                { label: 'Medium Priority', count: data.recommendations.filter(r => r.priority === 'medium').length, color: '#d97706', bg: '#fffbeb' },
                { label: 'Low Priority', count: data.recommendations.filter(r => r.priority === 'low').length, color: '#10b981', bg: '#f0fdf4' },
              ].map(p => (
                <div key={p.label} className="rounded-xl p-3 text-center" style={{ background: p.bg }}>
                  <p className="text-2xl font-extrabold" style={{ color: p.color }}>{p.count}</p>
                  <p className="text-[11px] font-medium" style={{ color: p.color }}>{p.label}</p>
                </div>
              ))}
            </div>

            {/* Recommendation List */}
            <div className="space-y-3">
              {data.recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl border"
                  style={{
                    background: rec.priority === 'high' ? '#fef2f2' : rec.priority === 'medium' ? '#fffbeb' : '#f0fdf4',
                    borderColor: rec.priority === 'high' ? '#fecaca' : rec.priority === 'medium' ? '#fde68a' : '#bbf7d0',
                  }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: rec.priority === 'high' ? '#fee2e2' : rec.priority === 'medium' ? '#fef3c7' : '#d1fae5' }}>
                      {rec.priority === 'high' ? (
                        <Warning size={16} style={{ color: '#dc2626' }} weight="fill" />
                      ) : rec.priority === 'medium' ? (
                        <Lightning size={16} style={{ color: '#d97706' }} weight="fill" />
                      ) : (
                        <CheckCircle size={16} style={{ color: '#10b981' }} weight="fill" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold" style={{ color: '#374151' }}>{rec.title}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold capitalize"
                          style={{
                            background: rec.priority === 'high' ? '#fee2e2' : rec.priority === 'medium' ? '#fef3c7' : '#d1fae5',
                            color: rec.priority === 'high' ? '#dc2626' : rec.priority === 'medium' ? '#d97706' : '#10b981',
                          }}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: '#6b7280' }}>{rec.description}</p>
                      {rec.impact && (
                        <p className="text-[10px] mt-1 font-medium" style={{ color: '#10b981' }}>💡 Expected impact: {rec.impact}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* App Health Summary */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>App Health Snapshot</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {data.appHealthMetrics.map(m => (
                <div key={m.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
                  <div className="flex items-center gap-1.5 mb-2">
                    {m.good
                      ? <CheckCircle size={14} style={{ color: '#10b981' }} weight="fill" />
                      : <Warning size={14} style={{ color: '#dc2626' }} weight="fill" />
                    }
                    <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{m.label}</span>
                  </div>
                  <p className="text-base font-bold" style={{ color: m.good ? '#111827' : '#dc2626' }}>{m.value}</p>
                  <p className="text-[10px]" style={{ color: '#9ca3af' }}>Target: {m.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

// ─── Shared ASO Tab Component (AppTweak style) ───
function ASOTab({
  appName, appDev, appCat, store, asoScore, data
}: {
  appName: string; appDev: string; appCat: string;
  store: 'playstore' | 'appstore'; asoScore: number; data: FifgoData;
}) {
  const s = data[store];
  const competitors = [
    { name: 'FIFGO', score: Math.round(asoScore) },
    { name: 'Adiraku', score: 95 },
    { name: 'BFI Mobile', score: 88 },
    { name: 'BAF Mobile', score: 91 },
  ];
  const asoSections = [
    { id: 'name', label: 'Name' },
    { id: 'short-desc', label: 'Short Description' },
    { id: 'long-desc', label: 'Long Description' },
    { id: 'icon', label: 'Icon' },
    { id: 'screenshots', label: 'Screenshots' },
    { id: 'videos', label: 'Promotional Video' },
    { id: 'app-details', label: 'App Details' },
    { id: 'reviews', label: 'Reviews & Ratings' },
    { id: 'category', label: 'Category Ranking' },
  ];
  const [activeSection, setActiveSection] = React.useState('name');

  const sectionData: Record<string, { label: string; score: number; color: string; detail: string; chars?: string; note: string }> = {
    name: {
      label: 'App Name',
      score: data.ascoreBreakdown.find(b => b.label === 'App Title')?.score ?? 0,
      color: (data.ascoreBreakdown.find(b => b.label === 'App Title')?.score ?? 0) >= 80 ? '#10b981' : (data.ascoreBreakdown.find(b => b.label === 'App Title')?.score ?? 0) >= 60 ? '#f59e0b' : '#dc2626',
      detail: `${appName}`,
      chars: `${appName.length} characters`,
      note: 'You still have room to add some keywords to your App Name.',
    },
    'short-desc': {
      label: 'Short Description',
      score: 62,
      color: '#f59e0b',
      detail: 'Pinjaman mudah, cepat, dan transparan untuk seluruh rakyat Indonesia.',
      chars: '62 characters',
      note: 'Consider adding 1–2 more high-volume keywords.',
    },
    'long-desc': {
      label: 'Long Description',
      score: 65,
      color: '#f59e0b',
      detail: 'FIFGO adalah aplikasi pembiayaan digital dari FIFGROUP yang menghadirkan layanan...',
      chars: '2,800 characters',
      note: 'Outdated screenshots detected. Review content structure.',
    },
    icon: {
      label: 'Icon',
      score: 80,
      color: '#10b981',
      detail: 'Current icon is acceptable. Consider A/B testing with brighter variants.',
      note: 'Icon is clear at small sizes.',
    },
    screenshots: {
      label: 'Screenshots',
      score: 72,
      color: '#f59e0b',
      detail: '6 screenshots uploaded. Portrait + landscape recommended.',
      note: 'Missing video screenshot coverage.',
    },
    videos: {
      label: 'Promotional Video',
      score: 0,
      color: '#dc2626',
      detail: 'No promotional video uploaded.',
      note: 'Adding a promo video can increase conversion by up to 25%.',
    },
    'app-details': {
      label: 'App Details',
      score: 78,
      color: '#10b981',
      detail: 'Privacy policy, contact email, and app category properly configured.',
      note: 'Consider updating screenshots for Android 14 UI.',
    },
    reviews: {
      label: 'Reviews & Ratings',
      score: s.ratingDistribution.find(r => r.stars === 5)?.pct ?? 0 > 60 ? 80 : 65,
      color: s.ratingDistribution.find(r => r.stars === 5)?.pct ?? 0 > 60 ? '#10b981' : '#f59e0b',
      detail: `${s.rating}★ from ${s.totalReviews} reviews`,
      note: 'Response rate to reviews: 45%. Target: 80%.',
    },
    category: {
      label: 'Category Ranking',
      score: 70,
      color: '#f59e0b',
      detail: '#3 in Finance · #8 in Loans & Credits',
      note: 'Competing for top 3 in Loans & Credits.',
    },
  };

  const active = sectionData[activeSection];

  return (
    <div className="space-y-5">
      {/* App Info Header */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-200">
            <img src={FIFGO_LOGO} alt={appName} className="w-12 h-12 object-contain" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-extrabold" style={{ color: '#111827' }}>{appName}</h2>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{appDev}</p>
            <p className="text-[10px]" style={{ color: '#9ca3af' }}>{appCat}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold" style={{ color: '#10b981' }}>{Math.round(asoScore)}</p>
            <p className="text-[10px]" style={{ color: '#9ca3af' }}>ASO Score</p>
          </div>
        </div>

        {/* Competitor Comparison */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>ASO Score vs Competitors</p>
          <div className="flex items-end gap-2 h-16">
            {competitors.map(c => (
              <div key={c.name} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="w-full rounded-t-lg flex items-end justify-center pb-1"
                  style={{ height: `${c.score}%`, minHeight: 4, background: c.name === 'FIFGO' ? '#06b6d4' : '#e5e7eb' }}
                >
                  <span className="text-[9px] font-extrabold" style={{ color: c.name === 'FIFGO' ? '#fff' : '#9ca3af' }}>{c.score}</span>
                </div>
                <span className="text-[9px] font-medium" style={{ color: '#374151' }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ASO Section Nav + Detail */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Section Tabs */}
        <div className="flex gap-0 p-1 bg-gray-50 border-b border-gray-200 overflow-x-auto">
          {asoSections.map(sec => {
            const sd = sectionData[sec.id];
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold shrink-0 transition-all whitespace-nowrap"
                style={activeSection === sec.id
                  ? { background: '#1e3a5f', color: '#fff' }
                  : { background: 'transparent', color: '#6b7280' }
                }
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Section Detail */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white"
              style={{ background: active.color }}
            >
              {active.score}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#111827' }}>{active.label}</p>
              <p className="text-[11px]" style={{ color: '#9ca3af' }}>{active.chars ?? ''} {active.chars ? '·' : ''} Score {active.score}/100</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs px-2 py-1 rounded-lg font-semibold text-white" style={{ background: active.score >= 80 ? '#10b981' : active.score >= 60 ? '#f59e0b' : '#dc2626' }}>
                {active.score >= 80 ? 'Good' : active.score >= 60 ? 'Needs Work' : 'Poor'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 rounded-full mb-4" style={{ background: '#f3f4f6' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${active.score}%`, background: active.color }} />
          </div>

          {/* Current Content */}
          {active.detail && (
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 mb-3">
              <p className="text-[10px] font-bold mb-1" style={{ color: '#9ca3af' }}>CURRENT</p>
              <p className="text-xs font-medium leading-relaxed" style={{ color: '#374151' }}>{active.detail}</p>
            </div>
          )}

          {/* Recommendation Note */}
          <div className="p-3 rounded-xl" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <p className="text-[11px] font-medium" style={{ color: '#1e3a5f' }}>
              💡 {active.note}
            </p>
          </div>

          {/* Keywords Input */}
          {(activeSection === 'name' || activeSection === 'short-desc') && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
              <p className="text-[10px] font-bold mb-2" style={{ color: '#9ca3af' }}>TEST A NEW VERSION</p>
              <textarea
                className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 resize-none"
                rows={2}
                placeholder="Type to test new name or description..."
                style={{ color: '#374151', outline: 'none' }}
              />
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px]" style={{ color: '#9ca3af' }}>0 characters</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#f3f4f6', color: '#9ca3af' }}>
                  Keyword Impact: —
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyword Rankings */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Keyword Rankings</h3>
          <div className="flex items-center gap-2">
            <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#9ca3af' }}>Highlight Repeated</span>
          </div>
        </div>
        <div className="space-y-2">
          {data.keywords.map(kw => (
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
  );
}
