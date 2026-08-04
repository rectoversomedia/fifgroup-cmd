'use client';

import * as React from 'react';
import {
  Star, Download, Heartbeat,
  Warning, CheckCircle, Lightning,
  GooglePlayLogo, AppStoreLogo,
} from '@phosphor-icons/react';

const FIFADA_LOGO = '/images/fifada-logo.jpg';

const RECOMMENDATIONS: { priority: 'high' | 'medium' | 'low'; title: string; description: string; impact?: string }[] = [
  { priority: 'high', title: 'Add Promotional Video', description: 'No promotional video uploaded. A 15–30s promo video can boost install conversion by up to 20%.', impact: '+15–20% conversion rate' },
  { priority: 'high', title: 'Fix Crash Rate on Android', description: 'Play Store crash rate at 1.4% — exceeds 0.5% threshold. ANR errors on Android 13 causing negative reviews.', impact: '-1% crash rate target' },
  { priority: 'medium', title: 'Short Description Optimization', description: 'Short description is missing high-volume keywords: "multiguna" and "kredit motor". Competitor Adiraku ranks higher on these.', impact: '+5–8% keyword reach' },
  { priority: 'medium', title: 'Improve Branch Processing SLA', description: '60% of negative reviews cite slow branch processing (7-day average). Consider digital-first workflow to reduce branch visits.', impact: '+0.2★ rating lift' },
  { priority: 'low', title: 'Push Notification Delivery', description: 'Push delivery at 94.2% — slightly below 95% target. Check FCM topic subscription overlap.', impact: '+1% delivery rate' },
];

const FIFADA_DATA: Record<'playstore' | 'appstore', {
  rating: number; downloads: string; downloadsChange: string;
  totalReviews: string; ratingDistribution: { stars: number; pct: number }[];
  ascoreBreakdown: { label: string; score: number; weight: number }[];
}> = {
  playstore: {
    rating: 3.8, downloads: '210K', downloadsChange: '+3%', totalReviews: '3,241',
    ratingDistribution: [
      { stars: 5, pct: 52 }, { stars: 4, pct: 16 }, { stars: 3, pct: 12 }, { stars: 2, pct: 10 }, { stars: 1, pct: 10 },
    ],
    ascoreBreakdown: [
      { label: 'App Title', score: 78, weight: 20 },
      { label: 'Description', score: 65, weight: 25 },
      { label: 'Screenshots', score: 72, weight: 20 },
      { label: 'Icon', score: 80, weight: 10 },
      { label: 'Videos', score: 0, weight: 10 },
      { label: 'Ratings & Reviews', score: 68, weight: 15 },
    ],
  },
  appstore: {
    rating: 4.1, downloads: '28K', downloadsChange: '+18%', totalReviews: '412',
    ratingDistribution: [
      { stars: 5, pct: 60 }, { stars: 4, pct: 18 }, { stars: 3, pct: 10 }, { stars: 2, pct: 7 }, { stars: 1, pct: 5 },
    ],
    ascoreBreakdown: [
      { label: 'App Title', score: 82, weight: 20 },
      { label: 'Description', score: 70, weight: 25 },
      { label: 'Screenshots', score: 78, weight: 20 },
      { label: 'Icon', score: 85, weight: 10 },
      { label: 'Videos', score: 0, weight: 10 },
      { label: 'Ratings & Reviews', score: 72, weight: 15 },
    ],
  },
};

const APP_HEALTH: Record<'playstore' | 'appstore', { good: boolean; issues: number }> = {
  playstore: { good: false, issues: 2 },
  appstore: { good: true, issues: 0 },
};

export default function FIFADAPage() {
  const [store, setStore] = React.useState<'playstore' | 'appstore'>('playstore');
  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const s = FIFADA_DATA[store];
  const health = APP_HEALTH[store];
  const isHealthy = health.good;
  const asoScore = s.ascoreBreakdown.reduce((acc, item) => acc + item.score * item.weight / 100, 0);

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm">
            <img src={FIFADA_LOGO} alt="FIFADA" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: '#111827' }}>FIFADA</h1>
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
          { id: 'playstore' as const, label: 'Google Play Store' },
          { id: 'appstore' as const, label: 'Apple App Store' },
        ]).map(s_ => (
          <button
            key={s_.id}
            onClick={() => setStore(s_.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={store === s_.id ? { background: '#1f2937', color: '#fff' } : { background: 'transparent', color: '#9ca3af' }}
          >
            {s_.id === 'playstore' ? (
              <GooglePlayLogo size={14} weight={store === s_.id ? 'fill' : 'regular'} />
            ) : (
              <AppStoreLogo size={14} weight={store === s_.id ? 'fill' : 'regular'} />
            )}
            {s_.label}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="space-y-5">

        {/* Alert Banner */}
        {!isHealthy && (
          <div className="rounded-2xl p-4 flex items-start gap-3 bg-white border border-amber-200">
            <Warning size={20} style={{ color: '#d97706' }} weight="fill" className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold" style={{ color: '#92400e' }}>Rating Alert</p>
              <p className="text-xs mt-0.5" style={{ color: '#92400e' }}>FIFADA rating dropped 0.4★ in 3 months. 60% negative reviews cite branch processing time.</p>
            </div>
          </div>
        )}

        {/* 5 Key Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: Star, color: '#f59e0b', label: 'Rating', value: `${s.rating}★`, sub: `${s.totalReviews} reviews` },
            { icon: Download, color: '#f59e0b', label: 'Downloads', value: s.downloads, sub: s.downloadsChange },
            { icon: Star, color: '#6366f1', label: 'Total Reviews', value: s.totalReviews, sub: 'all time' },
            { icon: Heartbeat, color: '#10b981', label: 'ASO Score', value: `${Math.round(asoScore)}/100`, sub: `+${Math.max(0, Math.round(asoScore - 60))} from avg` },
            { icon: Warning, color: '#dc2626', label: 'Issues', value: `${health.issues}`, sub: health.issues > 0 ? 'need attention' : 'all good' },
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

        {/* Recommendations (ASO Detail) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>ASO Recommendations</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#fef2f2', color: '#dc2626' }}>
                {RECOMMENDATIONS.filter(r => r.priority === 'high').length} High
              </span>
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#fffbeb', color: '#d97706' }}>
                {RECOMMENDATIONS.filter(r => r.priority === 'medium').length} Medium
              </span>
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#f0fdf4', color: '#10b981' }}>
                {RECOMMENDATIONS.filter(r => r.priority === 'low').length} Low
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {RECOMMENDATIONS.map((rec, i) => (
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
    </div>
  );
}
