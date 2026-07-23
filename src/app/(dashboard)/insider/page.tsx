'use client';

import * as React from 'react';
import { Users, ChatCircle, Rocket, TrendUp, TrendDown, Minus, Globe, UserCirclePlus, Heart, Crosshair } from '@phosphor-icons/react';

export default function InsiderPage() {
  const [tab, setTab] = React.useState<'overview' | 'segments' | 'hybrid'>('overview');

  const segments = {
    by_acquisition: [
      { name: 'Organic', count: 34521, change: 12, pct: 42, color: '#4f8ef7' },
      { name: 'Referral', count: 23094, change: 18, pct: 28, color: '#10b981' },
      { name: 'Social Ads', count: 14829, change: 5, pct: 18, color: '#8b5cf6' },
      { name: 'Branch Referral', count: 9888, change: -8, pct: 12, color: '#f59e0b' },
    ],
    by_lob: [
      { name: '0 LoB (new)', count: 112320, change: 10, pct: 48, color: '#6b7280' },
      { name: '1 LoB', count: 81900, change: 8, pct: 35, color: '#4f8ef7' },
      { name: '2 LoB', count: 28080, change: 15, pct: 12, color: '#10b981' },
      { name: '3+ LoB (Power)', count: 11700, change: 22, pct: 5, color: '#f59e0b' },
    ],
  };

  const hybridReasons = [
    { reason: 'Document verification required', pct: 45, fixable: true },
    { reason: 'Customer prefers face-to-face', pct: 28, fixable: false },
    { reason: 'KYC document not accepted', pct: 18, fixable: true },
    { reason: 'Loan amount above digital limit', pct: 9, fixable: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Insider CDP</h1>
          <p className="text-sm text-slate-400 mt-0.5">User behavior data from Insider CDP — June 2026</p>
        </div>
        <div className="flex gap-2">
          {[['overview', 'Overview'], ['segments', 'Segments'], ['hybrid', 'Hybrid']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={tab === t ? { background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Users, iconColor: 'text-blue-400', label: 'Active Users', value: '234K', change: 15, color: 'from-blue-500/20' },
          { icon: ChatCircle, iconColor: 'text-purple-400', label: 'Sessions', value: '1.2M', change: 18, color: 'from-purple-500/20' },
          { icon: Rocket, iconColor: 'text-emerald-400', label: 'Digital-First', value: '71%', change: 9, color: 'from-emerald-500/20' },
          { icon: Heart, iconColor: 'text-rose-400', label: 'Approval Rate', value: '67%', change: -3, color: 'from-rose-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${stat.color} to-transparent`} style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={22} className={stat.iconColor} weight="fill" />
              <span className={`text-xs font-semibold ${stat.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.change > 0 ? <TrendUp size={12} weight="bold" className="inline" /> : <TrendDown size={12} weight="bold" className="inline" />}
                {' +'}{stat.change}%
              </span>
            </div>
            <p className="text-2xl font-extrabold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* Channel Mix */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Digital-First', sub: 'Applied fully online', pct: 71, change: 9, color: '#10b981', icon: Rocket },
              { label: 'Hybrid', sub: 'App + branch visit', pct: 24, change: -6, color: '#f59e0b', icon: Globe },
              { label: 'Branch-Only', sub: 'Traditional channel', pct: 5, change: -3, color: '#6b7280', icon: Users },
            ].map(ch => (
              <div key={ch.label} className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <ch.icon size={18} style={{ color: ch.color }} weight="fill" />
                  <div>
                    <p className="text-xs font-semibold text-white">{ch.label}</p>
                    <p className="text-[10px] text-slate-500">{ch.sub}</p>
                  </div>
                </div>
                <div className="text-3xl font-extrabold mb-2" style={{ color: ch.color }}>{ch.pct}%</div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${ch.pct}%`, background: ch.color }} />
                </div>
                <span className={`text-xs mt-1 inline-block ${ch.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {ch.change > 0 ? '+' : ''}{ch.change}% vs last month
                </span>
              </div>
            ))}
          </div>

          {/* Session Quality */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-bold text-white mb-4">Session Quality</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-2xl font-extrabold text-white">8.4 min</p>
                <p className="text-xs text-slate-400 mt-1">Avg Session Duration</p>
                <span className="text-xs text-emerald-400">+2.1 min vs last month</span>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-2xl font-extrabold text-white">5.1x</p>
                <p className="text-xs text-slate-400 mt-1">Sessions per User</p>
                <span className="text-xs text-emerald-400">+0.8x vs last month</span>
              </div>
              <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-2xl font-extrabold text-white">68%</p>
                <p className="text-xs text-slate-400 mt-1">Return User Rate</p>
                <span className="text-xs text-emerald-400">+4pts vs last month</span>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'segments' && (
        <>
          {/* Acquisition Segments */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <UserCirclePlus size={16} className="text-blue-400" weight="fill" /> User Acquisition
            </h3>
            <div className="space-y-3">
              {segments.by_acquisition.map(seg => (
                <div key={seg.name} className="flex items-center gap-3">
                  <div className="w-28 shrink-0 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                    <span className="text-xs font-semibold text-slate-300">{seg.name}</span>
                  </div>
                  <div className="flex-1 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, background: seg.color }} />
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-xs font-bold text-white">{seg.count.toLocaleString()}</span>
                  </div>
                  <div className="w-12 text-right">
                    <span className={`text-xs font-semibold ${seg.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {seg.change > 0 ? '+' : ''}{seg.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LoB Holdings */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Crosshair size={16} className="text-purple-400" weight="fill" /> LoB Holdings Distribution
            </h3>
            <div className="space-y-3">
              {segments.by_lob.map(seg => (
                <div key={seg.name} className="flex items-center gap-3">
                  <div className="w-28 shrink-0 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                    <span className="text-xs font-semibold text-slate-300">{seg.name}</span>
                  </div>
                  <div className="flex-1 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, background: seg.color }} />
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-xs font-bold text-white">{seg.count.toLocaleString()}</span>
                  </div>
                  <div className="w-12 text-right">
                    <span className={`text-xs font-semibold ${seg.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {seg.change > 0 ? '+' : ''}{seg.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <p className="text-xs text-amber-300">
                <span className="font-semibold">Cross-sell opportunity:</span> 34,821 users have only 1 LoB product. DANASTRA is the best cross-sell for FIFASTRA customers.
              </p>
            </div>
          </div>
        </>
      )}

      {tab === 'hybrid' && (
        <>
          {/* Hybrid Bridge */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl p-5 col-span-2" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="text-sm font-bold text-white mb-4">Why Users Visit Branch</h3>
              <div className="space-y-3">
                {hybridReasons.map(r => (
                  <div key={r.reason} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-300">{r.reason}</span>
                          {r.fixable && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400">Fixable</span>}
                        </div>
                        <span className="text-xs font-bold text-white">{r.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}>
                <p className="text-xs text-rose-300">
                  <span className="font-semibold">18% of branch visits</span> caused by KYC document rejection — add in-app selfie quality validation to reduce this by 60%.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs text-slate-400 mb-1">Hybrid Completion</p>
                <p className="text-3xl font-extrabold text-amber-400">12%</p>
                <span className="text-xs text-emerald-400">-3% (Goal: &lt;5%)</span>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs text-slate-400 mb-1">Branch Appointments</p>
                <p className="text-3xl font-extrabold text-emerald-400">2,841</p>
                <span className="text-xs text-emerald-400">+52% MoM</span>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs text-slate-400 mb-1">Locator Usage</p>
                <p className="text-3xl font-extrabold text-blue-400">8,432</p>
                <span className="text-xs text-emerald-400">+34% MoM</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
