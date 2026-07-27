'use client';

import * as React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { X } from '@phosphor-icons/react';
import { getDisbursementsByLoB } from '@/lib/data-sim';
import { useRealtime } from '@/lib/use-realtime';

const LOB_LOGOS: Record<string, string> = {
  FIFASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FIFASTRA-1780538519035.png',
  SPEKTRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20SPEKTRA-1780538544863.png',
  DANASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20DANASTRA-1780538584771.png',
  FINATRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FINATRA-1780538626287.png',
  AMITRA:   'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20AMITRA-1780538604037.png',
};

const LOB_COLORS: Record<string, string> = {
  FIFASTRA: '#4f8ef7', SPEKTRA: '#f43f5e', DANASTRA: '#06b6d4',
  FINATRA: '#f59e0b', AMITRA: '#10b981',
};

const LOBS = [
  { id: 'fifastra', name: 'FIFASTRA', fullName: 'Multiguna Financing', color: '#4f8ef7',
    active: 168480, pct: 72, change: 5, viewed: 234000, applied: 62300, submitted: 38700, disbursed: 19200, time: 3.2,
    cohort: [100, 68, 54, 41] },
  { id: 'spektra',  name: 'SPEKTRA',  fullName: 'Working Capital',    color: '#f43f5e',
    active: 65520, pct: 28, change: -3, viewed: 234000, applied: 31200, submitted: 12400, disbursed: 4960, time: 4.8,
    cohort: [100, 52, 38, 22] },
  { id: 'danastra', name: 'DANASTRA', fullName: 'Digital Lending',     color: '#06b6d4',
    active: 142740, pct: 61, change: 4, viewed: 234000, applied: 52800, submitted: 31200, disbursed: 15600, time: 3.8,
    cohort: [100, 71, 60, 48] },
  { id: 'finatra',  name: 'FINATRA',  fullName: 'Investment Finance', color: '#f59e0b',
    active: 105300, pct: 45, change: 2, viewed: 234000, applied: 41700, submitted: 23100, disbursed: 10400, time: 4.1,
    cohort: [100, 74, 65, 55] },
  { id: 'amitra',   name: 'AMITRA',   fullName: 'Micro Insurance',     color: '#10b981',
    active: 121680, pct: 52, change: 6, viewed: 234000, applied: 46800, submitted: 27300, disbursed: 12800, time: 3.5,
    cohort: [100, 65, 50, 39] },
];

const RECOMMENDED_ACTIONS: Record<string, string[]> = {
  FIFASTRA: ['Increase SPEKTRA referral bonus to match FIFASTRA', 'Expand motorcycle financing eligibility'],
  SPEKTRA: ['A/B test 10MB vs 25MB file upload limit', 'Add auto-compress for scanned docs', 'Reduce required docs from 6 to 3'],
  DANASTRA: ['Launch salary borrower segment campaign', 'Partner with payroll deduction employers'],
  FINATRA: ['Simplify investment property documentation', 'Add collateral-free option for < Rp 20M'],
  AMITRA: ['Automate low-risk micro approvals', 'Reduce manual review time from 1.5d to 0.5d'],
};

function LoBDrillPanel({ lob, onClose }: { lob: typeof LOBS[0]; onClose: () => void }) {
  const funnel = [
    { label: 'Viewed',    value: lob.viewed,    pct: 100 },
    { label: 'Applied',   value: lob.applied,   pct: Math.round(lob.applied / lob.viewed * 100) },
    { label: 'Submitted', value: lob.submitted,  pct: Math.round(lob.submitted / lob.viewed * 100) },
    { label: 'Disbursed', value: lob.disbursed, pct: Math.round(lob.disbursed / lob.viewed * 100) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" style={{ borderLeft: `3px solid ${lob.color}` }}>
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid #f3f4f6', background: `${lob.color}08` }}>
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shrink-0">
            <img src={LOB_LOGOS[lob.name]} alt={lob.name} className="w-9 h-9 object-contain" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-extrabold" style={{ color: '#111827' }}>{lob.name}</h2>
            <p className="text-xs" style={{ color: '#6b7280' }}>{lob.fullName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'white' }}>
            <X size={16} style={{ color: '#374151' }} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* KPI */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Active Users', value: lob.active.toLocaleString() },
              { label: 'Conversion', value: `${lob.pct}%` },
              { label: 'Time to Disburse', value: `${lob.time}d` },
              { label: 'MoM Change', value: `${lob.change > 0 ? '+' : ''}${lob.change}%` },
            ].map(m => (
              <div key={m.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-extrabold" style={{ color: '#111827' }}>{m.value}</p>
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* Funnel */}
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: '#374151' }}>Funnel Breakdown</p>
            {funnel.map((f, i) => {
              const prev = i > 0 ? funnel[i - 1].value : null;
              const drop = prev ? Math.round((1 - f.value / prev) * 100) : 0;
              return (
                <div key={f.label} className="mb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] w-20" style={{ color: '#6b7280' }}>{f.label}</span>
                    <div className="flex-1 h-6 rounded-lg" style={{ background: '#f3f4f6' }}>
                      <div className="h-full rounded-lg flex items-center pr-2 justify-end"
                        style={{ width: `${f.pct}%`, background: `${lob.color}90` }}>
                        <span className="text-[10px] font-bold text-white">{f.value.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold w-8 text-right" style={{ color: lob.color }}>{f.pct}%</span>
                  </div>
                  {drop > 0 && <p className="text-[10px] text-red-500 text-right">▼ {drop}% drop</p>}
                </div>
              );
            })}
          </div>

          {/* Cohort */}
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: '#374151' }}>Cohort Retention</p>
            {['Month 1', 'Month 3', 'Month 6', 'Month 12'].map((m, i) => {
              const val = lob.cohort[i];
              const isLow = val < 60;
              return (
                <div key={m} className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] w-16" style={{ color: '#6b7280' }}>{m}</span>
                  <div className="flex-1 h-2.5 rounded-full" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full" style={{ width: `${val}%`, background: isLow ? '#f43f5e' : '#10b981' }} />
                  </div>
                  <span className="text-[11px] font-bold w-8 text-right" style={{ color: isLow ? '#f43f5e' : '#10b981' }}>{val}%</span>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: '#374151' }}>Top 3 Recommended Actions</p>
            <div className="space-y-2">
              {(RECOMMENDED_ACTIONS[lob.name] ?? []).map((action, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0"
                    style={{ background: lob.color, color: 'white' }}>{i + 1}</span>
                  <p className="text-xs" style={{ color: '#374151' }}>{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export default function LoBPage() {
  const [selectedLoB, setSelectedLoB] = React.useState('fifastra');
  const [drilledLoB, setDrilledLoB] = React.useState<string | null>(null);
  const { data: disbData, isLoading } = useRealtime(getDisbursementsByLoB, 30_000);

  const current = LOBS.find(l => l.id === selectedLoB)!;
  const drilled = LOBS.find(l => l.id === drilledLoB);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });

  // Radar chart — cross-LoB comparison across 4 dimensions
  const radarData = [
    { subject: 'Penetration', FIFASTRA: 72, SPEKTRA: 28, DANASTRA: 61, FINATRA: 45, AMITRA: 52 },
    { subject: 'Speed',       FIFASTRA: 70, SPEKTRA: 20, DANASTRA: 65, FINATRA: 60, AMITRA: 80 },
    { subject: 'Users',       FIFASTRA: 72, SPEKTRA: 28, DANASTRA: 61, FINATRA: 45, AMITRA: 52 },
    { subject: 'Retention',   FIFASTRA: 68, SPEKTRA: 52, DANASTRA: 71, FINATRA: 74, AMITRA: 65 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>LoB Performance</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Line-of-Business performance — July 2026</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>·</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="flex gap-3 overflow-x-auto pb-1">
        {LOBS.map(lob => (
          <button
            key={lob.id}
            onClick={() => setSelectedLoB(lob.id)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl shrink-0 transition-all border cursor-pointer"
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

      {/* Funnel + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
            <button
              onClick={() => setDrilledLoB(current.id)}
              className="ml-auto text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all"
              style={{ background: `${current.color}10`, color: current.color }}>
              View Details →
            </button>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Viewed',    value: current.viewed,    color: '#6366f1' },
              { label: 'Applied',   value: current.applied,   color: '#4f8ef7' },
              { label: 'Submitted', value: current.submitted,  color: '#06b6d4' },
              { label: 'Disbursed', value: current.disbursed,  color: '#10b981' },
            ].map((stage, i) => {
              const pct = Math.round(stage.value / current.viewed * 100);
              return (
                <div key={stage.label}>
                  <div className="flex items-center gap-3">
                    <div className="w-20 shrink-0 text-xs font-semibold" style={{ color: '#6b7280' }}>{stage.label}</div>
                    <div className="flex-1 h-10 rounded-xl overflow-hidden" style={{ background: '#f3f4f6' }}>
                      <div className="h-full rounded-xl flex items-center justify-end pr-3 transition-all duration-700"
                        style={{ width: `${Math.max(pct, 4)}%`, background: `linear-gradient(90deg, ${stage.color}80, ${stage.color})` }}>
                        <span className="text-xs font-bold text-white">{stage.value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-xs font-bold" style={{ color: stage.color }}>{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {selectedLoB === 'spektra' ? (
            <div className="mt-4 p-3 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
              <p className="text-xs" style={{ color: '#92400e' }}><strong>Bottleneck:</strong> Document upload — 62% drop. Simplify 6 to 3 required documents.</p>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-xl" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <p className="text-xs" style={{ color: '#065f46' }}>Funnel performing within target range.</p>
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-1" style={{ color: '#111827' }}>LoB Comparison Radar</h3>
          <p className="text-[11px] mb-4" style={{ color: '#9ca3af' }}>Multi-dimensional performance comparison</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f3f4f6" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#d1d5db' }} />
              {LOBS.map(l => (
                <Radar
                  key={l.name}
                  name={l.name}
                  dataKey={l.name}
                  stroke={l.color}
                  fill={l.color}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              ))}
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }} />
              <Legend
                formatter={(value) => <span style={{ fontSize: 11, color: '#6b7280' }}>{value}</span>}
                iconSize={10}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cohort + All LoBs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Cohort Retention — {current.name}</h3>
          {['Month 1', 'Month 3', 'Month 6', 'Month 12'].map((m, i) => {
            const val = current.cohort[i];
            const isLow = val < 60;
            return (
              <div key={m} className="flex items-center gap-3 mb-3">
                <div className="w-16 shrink-0 text-xs" style={{ color: '#6b7280' }}>{m}</div>
                <div className="flex-1 h-3 rounded-full" style={{ background: '#f3f4f6' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${val}%`, background: isLow ? '#f43f5e' : '#10b981' }} />
                </div>
                <div className="w-10 text-right">
                  <span className="text-xs font-bold" style={{ color: isLow ? '#f43f5e' : '#10b981' }}>{val}%</span>
                </div>
              </div>
            );
          })}
          <p className="text-[11px] mt-2" style={{ color: '#9ca3af' }}>Benchmark: &gt;60% Month-3 = Good</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>All LoBs — Penetration</h3>
          <div className="space-y-3">
            {LOBS.map(lob => (
              <button
                key={lob.name}
                onClick={() => { setSelectedLoB(lob.id); setDrilledLoB(lob.id); }}
                className="w-full flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                  <img src={LOB_LOGOS[lob.name]} alt={lob.name} className="w-7 h-7 object-contain" />
                </div>
                <div className="w-20 shrink-0">
                  <span className="text-xs font-semibold" style={{ color: '#374151' }}>{lob.name}</span>
                </div>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: '#f3f4f6' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lob.pct}%`, background: lob.color }} />
                </div>
                <div className="w-10 text-right">
                  <span className="text-xs font-bold" style={{ color: '#374151' }}>{lob.pct}%</span>
                </div>
                <div className="w-10 text-right">
                  <span className="text-[10px] font-medium" style={{ color: lob.change >= 0 ? '#059669' : '#dc2626' }}>
                    {lob.change > 0 ? '+' : ''}{lob.change}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drill Panel */}
      {drilled && <LoBDrillPanel lob={drilled} onClose={() => setDrilledLoB(null)} />}
    </div>
  );
}
