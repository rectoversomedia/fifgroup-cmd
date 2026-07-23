'use client';

import * as React from 'react';
import {
  Star, Download, TrendUp, TrendDown, Minus,
  Warning, ShieldCheck, ArrowRight, ClockCountdown
} from '@phosphor-icons/react';

export default function FIFADAPage() {
  const [tab, setTab] = React.useState<'overview' | 'reviews'>('overview');

  const negativeReviews = [
    { author: 'Joko P.', rating: 1, date: '1 Jul 2026', text: 'Sudah 7 hari belum cair, pihak cabang bilang tunggu. Sangat mengecewakan!' },
    { author: 'Siti N.', rating: 2, date: '29 Jun 2026', text: 'Proses di cabang lama sekali. Seharusnya bisa online semua.' },
    { author: 'Ahmad R.', rating: 2, date: '27 Jun 2026', text: 'App oke tapi pas datang ke cabang antri 2 jam. Tidak efisien.' },
    { author: 'Maya L.', rating: 3, date: '25 Jun 2026', text: 'Process okay tapi CS cabang kurang ramah. Semoga lebih baik.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)' }}>
            F
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">FIFADA</h1>
            <p className="text-sm text-slate-400">Multi Finance · Indonesia</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">WATCH</span>
              <span className="text-xs text-slate-500">Android · v2.8.0</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {[['overview', 'Overview'], ['reviews', 'Reviews']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all`}
              style={tab === t ? { background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Banner */}
      <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <Warning size={20} className="text-amber-400 mt-0.5 shrink-0" weight="fill" />
        <div>
          <p className="text-sm font-bold text-amber-300">Rating Alert</p>
          <p className="text-xs text-amber-200/70 mt-0.5">FIFADA rating dropped 0.4★ in 3 days. 60% negative reviews cite branch processing time. Owner: Operations Team.</p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Star, iconColor: 'text-amber-400', label: 'Rating', value: '3.8★', change: -0.2, color: 'from-amber-500/20 to-transparent' },
          { icon: Download, iconColor: 'text-amber-400', label: 'Downloads', value: '210K', change: 3, color: 'from-amber-500/20 to-transparent' },
          { icon: ShieldCheck, iconColor: 'text-amber-400', label: 'ASO Score', value: '61/100', change: -2, color: 'from-amber-500/20 to-transparent' },
          { icon: ClockCountdown, iconColor: 'text-rose-400', label: 'Branch SLA', value: '7 days', change: 0, color: 'from-rose-500/20 to-transparent' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${stat.color}`} style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={22} className={stat.iconColor} weight="fill" />
              <span className={`text-xs font-semibold ${stat.change > 0 ? 'text-emerald-400' : stat.change < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {stat.change > 0 ? <TrendUp size={12} weight="bold" className="inline" /> : stat.change < 0 ? <TrendDown size={12} weight="bold" className="inline" /> : <Minus size={12} className="inline" />}
                {' '}{stat.change > 0 ? '+' : ''}{stat.change}{typeof stat.change === 'number' && stat.change % 1 !== 0 ? '' : '%'}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* Rating Trend */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-bold text-white mb-4">Rating Trend</h3>
            <div className="flex items-end gap-2 h-24">
              {[
                { label: 'Apr', rating: 4.2 },
                { label: 'May', rating: 4.1 },
                { label: 'Jun', rating: 4.0 },
                { label: 'Jul 10', rating: 3.9 },
                { label: 'Jul 13', rating: 3.8 },
              ].map((month, i) => {
                const height = ((month.rating - 3) / 2) * 100;
                const isLast = i === 4;
                return (
                  <div key={month.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center" style={{ height: '64px' }}>
                      <div
                        className="w-8 rounded-t-lg transition-all"
                        style={{ height: `${height}%`, background: isLast ? '#f43f5e' : '#4f8ef7', opacity: isLast ? 1 : 0.7 }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">{month.label}</span>
                    <span className="text-[10px] font-bold text-white">{month.rating}★</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-rose-400 mt-3 flex items-center gap-1">
              <TrendDown size={12} weight="bold" /> Rating dropped 0.4★ in 3 days — needs attention
            </p>
          </div>

          {/* Branch Bottleneck */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-bold text-white mb-4">Root Cause Analysis</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-rose-400">60%</span>
                  <span className="text-xs text-slate-300">of negative reviews cite</span>
                </div>
                <p className="text-sm font-semibold text-white">"Process terlalu lama di cabang"</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-400">45%</span>
                  <span className="text-xs text-slate-300">of applications</span>
                </div>
                <p className="text-sm font-semibold text-white">Require branch visit for document verification</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-400">7 days</span>
                  <span className="text-xs text-slate-300">average branch processing</span>
                </div>
                <p className="text-sm font-semibold text-white">vs 2 days digital processing target</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div>
                <p className="text-xs font-bold text-emerald-400 mb-0.5">Recommended Action</p>
                <p className="text-xs text-slate-400">Sync with operations team to reduce branch processing SLA. Consider implementing queue booking via app to reduce wait time.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'reviews' && (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Recent Negative Reviews</h3>
          <div className="space-y-4">
            {negativeReviews.map((review, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)' }}>
                      {review.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{review.author}</p>
                      <p className="text-[10px] text-slate-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={11} weight={si < review.rating ? 'fill' : 'regular'} className={si < review.rating ? 'text-amber-400' : 'text-slate-600'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
