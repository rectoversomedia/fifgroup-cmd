'use client';

import * as React from 'react';
import {
  Star, Download, TrendUp, TrendDown, Minus,
  ChartBar, ShieldCheck, Eye, AppWindow,
  ArrowRight, CheckCircle, Warning, StarHalf
} from '@phosphor-icons/react';
import { formatCurrency } from '@/lib/utils';

export default function FIFGOPage() {
  const [tab, setTab] = React.useState<'overview' | 'aso' | 'reviews'>('overview');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #4f8ef7 100%)' }}>
            F
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">FIFGO</h1>
            <p className="text-sm text-slate-400">Super App — Finance · Indonesia</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">HEALTHY</span>
              <span className="text-xs text-slate-500">Android · v3.2.1</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {[['overview', 'Overview'], ['aso', 'ASO'], ['reviews', 'Reviews']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t ? 'text-white' : 'text-slate-400 hover:text-slate-300'}`}
              style={tab === t ? { background: 'rgba(79,142,247,0.2)', border: '1px solid rgba(79,142,247,0.3)' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Star, iconColor: 'text-amber-400', label: 'Rating', value: '4.2★', change: 0.1, color: 'from-amber-500/20 to-transparent' },
          { icon: Download, iconColor: 'text-cyan-400', label: 'Downloads', value: '850K', change: 23, color: 'from-cyan-500/20 to-transparent' },
          { icon: ShieldCheck, iconColor: 'text-emerald-400', label: 'ASO Score', value: '78/100', change: 4, color: 'from-emerald-500/20 to-transparent' },
          { icon: AppWindow, iconColor: 'text-purple-400', label: '5 LoBs Active', value: '234K', change: 15, color: 'from-purple-500/20 to-transparent' },
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
          {/* Rating Distribution */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-bold text-white mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const widths = [68, 18, 8, 4, 2];
                const w = widths[5 - star];
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-6">{star}★</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${w}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-8">{w}%</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 flex gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div><span className="text-lg font-bold text-white">12,847</span><span className="text-xs text-slate-400 ml-1">total reviews</span></div>
              <div><span className="text-lg font-bold text-emerald-400">68%</span><span className="text-xs text-slate-400 ml-1">positive (5★)</span></div>
              <div><span className="text-lg font-bold text-rose-400">6%</span><span className="text-xs text-slate-400 ml-1">negative (1-2★)</span></div>
            </div>
          </div>

          {/* LoBs */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-bold text-white mb-4">LoBs Inside FIFGO</h3>
            <div className="grid grid-cols-5 gap-3">
              {[
                { name: 'FIFASTRA', pct: 72, users: '168K', status: 'On Track' },
                { name: 'SPEKTRA', pct: 28, users: '65K', status: 'Below Target' },
                { name: 'DANASTRA', pct: 61, users: '142K', status: 'Growing' },
                { name: 'FINATRA', pct: 45, users: '105K', status: 'Stable' },
                { name: 'AMITRA', pct: 52, users: '121K', status: 'Growing' },
              ].map(lob => (
                <div key={lob.name} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 100%)' }}>
                    {lob.name[0]}
                  </div>
                  <p className="text-[11px] font-bold text-white">{lob.name}</p>
                  <p className="text-lg font-extrabold text-white mt-1">{lob.pct}%</p>
                  <p className="text-[10px] text-slate-500">{lob.users} users</p>
                  <span className="text-[10px] mt-1 inline-block px-1.5 py-0.5 rounded-full" style={{ background: lob.status === 'Below Target' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: lob.status === 'Below Target' ? '#f59e0b' : '#10b981' }}>{lob.status}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'aso' && (
        <>
          {/* ASO Score Breakdown */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-white">ASO Score Breakdown</h3>
              <span className="text-sm font-bold text-emerald-400">78 / 100</span>
            </div>
            <div className="space-y-4">
              {ascoreBreakdown.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">{item.weight}%</span>
                    </div>
                    <span className="text-xs font-bold text-white">{item.score}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.score}%`, background: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#f43f5e' }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-bold text-white mb-4">Keyword Rankings</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] text-slate-500 uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left pb-2 font-medium">Keyword</th>
                    <th className="text-center pb-2 font-medium">Position</th>
                    <th className="text-center pb-2 font-medium">Volume</th>
                    <th className="text-right pb-2 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map(kw => (
                    <tr key={kw.keyword} className="text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="py-2.5 text-slate-300 font-medium">{kw.keyword}</td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block w-7 h-7 rounded-lg text-xs font-bold ${kw.position <= 3 ? 'bg-emerald-400/10 text-emerald-400' : kw.position <= 10 ? 'bg-amber-400/10 text-amber-400' : 'bg-slate-400/10 text-slate-400'}`}>
                          #{kw.position}
                        </span>
                      </td>
                      <td className="py-2.5 text-center text-slate-400">{kw.volume}</td>
                      <td className="py-2.5 text-right">
                        <span className={`text-xs font-semibold ${kw.change > 0 ? 'text-emerald-400' : kw.change < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          {kw.change > 0 ? '+' : ''}{kw.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'reviews' && (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {topReviews.map((review, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 100%)' }}>
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
