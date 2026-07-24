'use client';

import * as React from 'react';
import { Users, TrendUp, TrendDown, Clock } from '@phosphor-icons/react';

const LOB_LOGOS: Record<string, string> = {
  FIFASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FIFASTRA-1780538519035.png',
  SPEKTRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20SPEKTRA-1780538544863.png',
  DANASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20DANASTRA-1780538584771.png',
  FINATRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FINATRA-1780538626287.png',
  AMITRA:   'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20AMITRA-1780538604037.png',
};

const LOBS = [
  { id: 'fifastra', name: 'FIFASTRA', fullName: 'Multiguna Financing', color: '#4f8ef7', active: 168480, pct: 72, change: 5, viewed: 234000, applied: 62300, submitted: 38700, disbursed: 19200, time: 3.2, cohort: [100, 68, 54, 41] },
  { id: 'spektra', name: 'SPEKTRA', fullName: 'Working Capital', color: '#f43f5e', active: 65520, pct: 28, change: -3, viewed: 234000, applied: 31200, submitted: 12400, disbursed: 4960, time: 4.8, cohort: [100, 52, 38, 22] },
  { id: 'danastra', name: 'DANASTRA', fullName: 'Digital Lending', color: '#06b6d4', active: 142740, pct: 61, change: 4, viewed: 234000, applied: 52800, submitted: 31200, disbursed: 15600, time: 3.8, cohort: [100, 71, 60, 48] },
  { id: 'finatra', name: 'FINATRA', fullName: 'Investment Finance', color: '#f59e0b', active: 105300, pct: 45, change: 2, viewed: 234000, applied: 41700, submitted: 23100, disbursed: 10400, time: 4.1, cohort: [100, 74, 65, 55] },
  { id: 'amitra', name: 'AMITRA', fullName: 'Micro Insurance', color: '#10b981', active: 121680, pct: 52, change: 6, viewed: 234000, applied: 46800, submitted: 27300, disbursed: 12800, time: 3.5, cohort: [100, 65, 50, 39] },
];

export default function LoBPage() {
  const [selectedLoB, setSelectedLoB] = React.useState('fifastra');
  const current = LOBS.find(l => l.id === selectedLoB)!;
  const funnelValues = [current.viewed, current.applied, current.submitted, current.disbursed];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>LoB Performance</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Line-of-Business performance — July 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Active Users', value: current.active.toLocaleString(), change: current.change },
          { label: 'Penetration Rate', value: `${current.pct}%`, change: current.change },
          { label: 'Time to Disburse', value: `${current.time} days`, change: -current.change },
          { label: 'Conversion Rate', value: `${Math.round(current.disbursed / current.viewed * 100)}%`, change: 2 },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>{m.label}</p>
            <p className="text-3xl font-extrabold mb-2" style={{ color: '#111827' }}>{m.value}</p>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#ecfdf5', color: '#059669' }}>
              {m.change > 0 ? '+' : ''}{m.change}%
            </span>
          </div>
        ))}
      </div>

      {/* LoB Selector */}
      <div className="flex gap-3 overflow-x-auto">
        {LOBS.map(lob => (
          <button
            key={lob.id}
            onClick={() => setSelectedLoB(lob.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl shrink-0 transition-all border"
            style={{
              background: selectedLoB === lob.id ? `${lob.color}10` : 'white',
              border: `1px solid ${selectedLoB === lob.id ? lob.color + '60' : '#e5e7eb'}`,
            }}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm shrink-0">
              <img src={LOB_LOGOS[lob.name]} alt={lob.name} className="w-9 h-9 object-contain" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold" style={{ color: selectedLoB === lob.id ? lob.color : '#374151' }}>{lob.name}</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>{lob.active.toLocaleString()} users</p>
            </div>
            <span className="text-[10px] font-semibold" style={{ color: lob.change >= 0 ? '#059669' : '#dc2626' }}>
              {lob.change > 0 ? '+' : ''}{lob.change}%
            </span>
          </button>
        ))}
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gray-200">
            <img src={LOB_LOGOS[current.name]} alt={current.name} className="w-9 h-9 object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Funnel — {current.name}</h3>
            <p className="text-[11px]" style={{ color: '#9ca3af' }}>{current.fullName}</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Viewed', value: current.viewed, pct: 100, color: '#6366f1' },
            { label: 'Applied', value: current.applied, pct: Math.round(current.applied / current.viewed * 100), color: '#4f8ef7' },
            { label: 'Submitted', value: current.submitted, pct: Math.round(current.submitted / current.viewed * 100), color: '#06b6d4' },
            { label: 'Disbursed', value: current.disbursed, pct: Math.round(current.disbursed / current.viewed * 100), color: '#10b981' },
          ].map((stage, i) => {
            const prevVal = i > 0 ? funnelValues[i - 1] : null;
            const drop = prevVal ? Math.round((1 - stage.value / prevVal) * 100) : 0;
            return (
              <div key={stage.label}>
                <div className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-xs font-semibold" style={{ color: '#6b7280' }}>{stage.label}</div>
                  <div className="flex-1 h-10 rounded-xl overflow-hidden" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-xl flex items-center justify-end pr-3 transition-all duration-700"
                      style={{ width: `${Math.max(stage.pct, 4)}%`, background: `linear-gradient(90deg, ${stage.color}80, ${stage.color})` }}>
                      <span className="text-xs font-bold text-white">{stage.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-xs font-bold" style={{ color: stage.color }}>{stage.pct}%</span>
                  </div>
                </div>
                {drop > 0 && (
                  <div className="flex items-center gap-2 ml-24 mt-0.5">
                    <div className="h-px flex-1 bg-red-100" />
                    <span className="text-[10px]" style={{ color: '#dc2626' }}>▼ {drop}% drop</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {selectedLoB === 'spektra' ? (
          <div className="mt-4 p-3 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <p className="text-xs" style={{ color: '#92400e' }}><strong>Key bottleneck:</strong> Document upload — 62% drop. Simplify from 6 to 3 required documents.</p>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <p className="text-xs" style={{ color: '#065f46' }}>Funnel performing within target range.</p>
          </div>
        )}
      </div>

      {/* Cohort + Comparison */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Cohort Retention — {current.name}</h3>
          <div className="space-y-3">
            {current.cohort.map((val, i) => {
              const months = ['Month 1', 'Month 3', 'Month 6', 'Month 12'];
              const isLow = val < 60;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-16 shrink-0 text-xs" style={{ color: '#6b7280' }}>{months[i]}</div>
                  <div className="flex-1 h-3 rounded-full" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full" style={{ width: `${val}%`, background: isLow ? '#f43f5e' : '#10b981' }} />
                  </div>
                  <div className="w-10 text-right">
                    <span className="text-xs font-bold" style={{ color: isLow ? '#f43f5e' : '#10b981' }}>{val}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] mt-3" style={{ color: '#9ca3af' }}>Benchmark: &gt;60% Month-3 = Good</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>All LoBs Comparison</h3>
          <div className="space-y-3">
            {LOBS.map(lob => (
              <div key={lob.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                  <img src={LOB_LOGOS[lob.name]} alt={lob.name} className="w-7 h-7 object-contain" />
                </div>
                <div className="w-20 shrink-0">
                  <span className="text-xs font-semibold" style={{ color: '#374151' }}>{lob.name}</span>
                </div>
                <div className="flex-1 h-2 rounded-full" style={{ background: '#f3f4f6' }}>
                  <div className="h-full rounded-full" style={{ width: `${lob.pct}%`, background: lob.color }} />
                </div>
                <div className="w-10 text-right">
                  <span className="text-xs font-bold" style={{ color: '#374151' }}>{lob.pct}%</span>
                </div>
                <div className="w-10 text-right">
                  <span className="text-[10px] font-medium" style={{ color: lob.change >= 0 ? '#059669' : '#dc2626' }}>
                    {lob.change > 0 ? '+' : ''}{lob.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
