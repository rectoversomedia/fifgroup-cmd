'use client';

import * as React from 'react';
import { Users, TrendUp, TrendDown, Minus, ArrowRight, Clock, ChartBar } from '@phosphor-icons/react';

export default function LoBPage() {
  const [selectedLoB, setSelectedLoB] = React.useState('fifastra');

  const lobs = [
    { id: 'fifastra', name: 'FIFASTRA', fullName: 'Multiguna Financing', color: '#4f8ef7', active: 168480, pct: 72, change: 5, viewed: 234000, applied: 62300, submitted: 38700, disbursed: 19200, time: 3.2, status: 'on_track', cohort: [100, 68, 54, 41] },
    { id: 'spektra', name: 'SPEKTRA', fullName: 'Working Capital', color: '#f43f5e', active: 65520, pct: 28, change: -3, viewed: 234000, applied: 31200, submitted: 12400, disbursed: 4960, time: 4.8, status: 'below_target', cohort: [100, 52, 38, 22] },
    { id: 'danastra', name: 'DANASTRA', fullName: 'Digital Lending', color: '#06b6d4', active: 142740, pct: 61, change: 4, viewed: 234000, applied: 52800, submitted: 31200, disbursed: 15600, time: 3.8, status: 'growing', cohort: [100, 71, 60, 48] },
    { id: 'finatra', name: 'FINATRA', fullName: 'Investment Finance', color: '#f59e0b', active: 105300, pct: 45, change: 2, viewed: 234000, applied: 41700, submitted: 23100, disbursed: 10400, time: 4.1, status: 'stable', cohort: [100, 74, 65, 55] },
    { id: 'amitra', name: 'AMITRA', fullName: 'Micro Insurance', color: '#10b981', active: 121680, pct: 52, change: 6, viewed: 234000, applied: 46800, submitted: 27300, disbursed: 12800, time: 3.5, status: 'growing', cohort: [100, 65, 50, 39] },
  ];

  const current = lobs.find(l => l.id === selectedLoB)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">LoB Performance</h1>
          <p className="text-sm text-slate-400 mt-0.5">Line-of-Business funnel inside FIFGO — June 2026</p>
        </div>
      </div>

      {/* LoB Selector */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {lobs.map(lob => (
          <button
            key={lob.id}
            onClick={() => setSelectedLoB(lob.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl shrink-0 transition-all"
            style={{
              background: selectedLoB === lob.id ? `${lob.color}15` : 'rgba(31,41,55,0.8)',
              border: `1px solid ${selectedLoB === lob.id ? lob.color + '40' : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${lob.color} 0%, ${lob.color}80 100%)` }}>
              {lob.name[0]}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">{lob.name}</p>
              <p className="text-[10px] text-slate-400">{lob.active.toLocaleString()} users</p>
            </div>
            <span className={`text-[10px] font-semibold ${lob.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {lob.change > 0 ? '+' : ''}{lob.change}%
            </span>
          </button>
        ))}
      </div>

      {/* Funnel */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 className="text-sm font-bold text-white mb-5">Funnel — {current.name}</h3>
        <div className="space-y-4">
          {[
            { label: 'Viewed', value: current.viewed, pct: 100, color: '#4f8ef7' },
            { label: 'Applied', value: current.applied, pct: Math.round(current.applied / current.viewed * 100), color: '#8b5cf6' },
            { label: 'Submitted', value: current.submitted, pct: Math.round(current.submitted / current.viewed * 100), color: '#06b6d4' },
            { label: 'Disbursed', value: current.disbursed, pct: Math.round(current.disbursed / current.viewed * 100), color: '#10b981' },
          ].map((stage, i) => {
            const dropoff = i > 0 ? Math.round((1 - stage.value / ([{ label: 'Viewed', value: current.viewed, pct: 100 }] as any)[i > 1 ? 'submitted' : i === 1 ? 'applied' : 'viewed']?.value / current.viewed) * 100) : 0;
            const prevVal = i > 0 ? ([{ value: current.viewed }, { value: current.applied }, { value: current.submitted }, { value: current.disbursed }][i - 1]?.value ?? stage.value) : stage.value;
            const dropPct = i > 0 ? Math.round((1 - stage.value / prevVal) * 100) : 0;
            return (
              <div key={stage.label}>
                <div className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-xs font-semibold text-slate-400">{stage.label}</div>
                  <div className="flex-1 h-10 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div
                      className="h-full rounded-xl flex items-center justify-end pr-3 transition-all duration-700"
                      style={{ width: `${Math.max(stage.pct, 4)}%`, background: `linear-gradient(90deg, ${stage.color}80, ${stage.color})` }}
                    >
                      <span className="text-xs font-bold text-white">{stage.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-xs font-bold" style={{ color: stage.color }}>{stage.pct}%</span>
                  </div>
                </div>
                {i > 0 && dropPct > 0 && (
                  <div className="flex items-center gap-2 ml-24 mt-1 mb-1">
                    <div className="h-px flex-1" style={{ background: 'rgba(244,63,94,0.3)' }} />
                    <span className="text-[10px] text-rose-400 flex items-center gap-0.5">
                      <TrendDown size={10} weight="bold" /> {dropPct}% dropped
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)' }}>
          <p className="text-xs text-blue-300">
            <span className="font-semibold">Key bottleneck:</span> {selectedLoB === 'spektra' ? 'Document upload stage — 62% drop-off. Simplify from 6 to 3 required documents.' : 'Overall funnel performing within target range.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Cohort Retention */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Cohort Retention</h3>
          <div className="space-y-3">
            {current.cohort.map((val, i) => {
              const months = ['Month 1', 'Month 3', 'Month 6', 'Month 12'];
              const isLow = val < 60;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-16 shrink-0 text-xs text-slate-400">{months[i]}</div>
                  <div className="flex-1 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${val}%`, background: isLow ? '#f43f5e' : '#10b981' }} />
                  </div>
                  <div className="w-10 text-right">
                    <span className="text-xs font-bold" style={{ color: isLow ? '#f43f5e' : '#10b981' }}>{val}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-3">Benchmark: &gt;60% Month-3 = Good</p>
        </div>

        {/* Metrics */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Key Metrics — {current.name}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-400" />
                <span className="text-xs text-slate-400">Active Users</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">{current.active.toLocaleString()}</span>
                <span className={`text-[10px] ml-1 ${current.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>({current.change > 0 ? '+' : ''}{current.change}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <ChartBar size={16} className="text-purple-400" />
                <span className="text-xs text-slate-400">Penetration Rate</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">{current.pct}%</span>
                <span className={`text-[10px] ml-1 ${current.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>({current.change > 0 ? '+' : ''}{current.change}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-cyan-400" />
                <span className="text-xs text-slate-400">Avg Time to Disburse</span>
              </div>
              <span className="text-sm font-bold text-white">{current.time} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
