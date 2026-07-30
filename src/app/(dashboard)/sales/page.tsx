'use client';

import * as React from 'react';
import { Rocket, CheckCircle, Clock, CurrencyCircleDollar, X } from '@phosphor-icons/react';
import { getFunnelData, getDisbursementsByLoB } from '@/lib/data-sim';
import { useRealtime } from '@/lib/use-realtime';

const LOB_LOGOS: Record<string, string> = {
  FIFASTRA: '/images/fifastra-logo.png',
  SPEKTRA:  '/images/spektra-logo.png',
  DANASTRA: '/images/danastra-logo.png',
  FINATRA:  '/images/finatra-logo.png',
  AMITRA:   '/images/amitra-logo.png',
};

interface DrillDownData {
  stage: string;
  deviceBreakdown: { name: string; pct: number; color: string }[];
  timeBreakdown: { name: string; pct: number }[];
  fieldDrop: { name: string; pct: number }[];
  rejectionReasons: { reason: string; pct: number }[];
}

const DRILL_DOWN: Record<string, DrillDownData> = {
  'Banner Viewed': {
    stage: 'Banner Viewed → App Opened',
    deviceBreakdown: [
      { name: 'Android', pct: 58, color: '#10b981' },
      { name: 'iOS', pct: 42, color: '#4f8ef7' },
    ],
    timeBreakdown: [
      { name: '09:00-12:00', pct: 38 },
      { name: '12:00-18:00', pct: 34 },
      { name: '18:00-21:00', pct: 28 },
    ],
    fieldDrop: [],
    rejectionReasons: [],
  },
  'App Opened': {
    stage: 'App Opened → Form Started',
    deviceBreakdown: [
      { name: 'Android', pct: 61, color: '#10b981' },
      { name: 'iOS', pct: 39, color: '#4f8ef7' },
    ],
    timeBreakdown: [
      { name: '09:00-12:00', pct: 42 },
      { name: '12:00-18:00', pct: 33 },
      { name: '18:00-21:00', pct: 25 },
    ],
    fieldDrop: [
      { name: 'Income field', pct: 23 },
      { name: 'Employment status', pct: 18 },
      { name: 'Address details', pct: 15 },
    ],
    rejectionReasons: [],
  },
  'Form Started': {
    stage: 'Form Started → Submitted',
    deviceBreakdown: [
      { name: 'Android', pct: 64, color: '#10b981' },
      { name: 'iOS', pct: 36, color: '#4f8ef7' },
    ],
    timeBreakdown: [
      { name: '09:00-12:00', pct: 31 },
      { name: '12:00-18:00', pct: 29 },
      { name: '18:00-21:00', pct: 40 },
    ],
    fieldDrop: [
      { name: 'Document upload', pct: 62 },
      { name: 'Selfie/KTP verification', pct: 21 },
      { name: 'Income details', pct: 12 },
    ],
    rejectionReasons: [],
  },
  'Form Submitted': {
    stage: 'Form Submitted → Approved',
    deviceBreakdown: [
      { name: 'Android', pct: 60, color: '#10b981' },
      { name: 'iOS', pct: 40, color: '#4f8ef7' },
    ],
    timeBreakdown: [
      { name: 'Manual review', pct: 55 },
      { name: 'Automated check', pct: 45 },
    ],
    fieldDrop: [],
    rejectionReasons: [
      { reason: 'Income below minimum threshold', pct: 34 },
      { reason: 'Existing blacklist record', pct: 28 },
      { reason: 'Incomplete documents', pct: 21 },
      { reason: 'Age outside eligible range', pct: 11 },
      { reason: 'Duplicate application', pct: 6 },
    ],
  },
  Approved: {
    stage: 'Approved → Disbursed',
    deviceBreakdown: [
      { name: 'All platforms', pct: 100, color: '#6b7280' },
    ],
    timeBreakdown: [
      { name: '< 1 day', pct: 42 },
      { name: '1-3 days', pct: 38 },
      { name: '> 3 days', pct: 20 },
    ],
    fieldDrop: [],
    rejectionReasons: [],
  },
};

function DrillDownModal({ stage, onClose }: { stage: string; onClose: () => void }) {
  const data = DRILL_DOWN[stage];
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <h2 className="text-base font-bold" style={{ color: '#111827' }}>Drill-Down: {data.stage}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#f9fafb' }}>
            <X size={16} style={{ color: '#374151' }} />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {/* Device breakdown */}
          <div>
            <p className="text-xs font-bold mb-3" style={{ color: '#374151' }}>Device Breakdown</p>
            <div className="space-y-2">
              {data.deviceBreakdown.map(d => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-xs w-16" style={{ color: '#6b7280' }}>{d.name}</span>
                  <div className="flex-1 h-2.5 rounded-full" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-right" style={{ color: '#374151' }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Field drop */}
          {data.fieldDrop.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-3" style={{ color: '#374151' }}>Field Abandonment Analysis</p>
              <div className="space-y-2">
                {data.fieldDrop.map(f => (
                  <div key={f.name} className="flex items-center gap-3">
                    <span className="text-xs w-36" style={{ color: '#6b7280' }}>{f.name}</span>
                    <div className="flex-1 h-2.5 rounded-full" style={{ background: '#f3f4f6' }}>
                      <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: '#dc2626' }} />
                    </div>
                    <span className="text-xs font-bold w-8 text-right" style={{ color: '#dc2626' }}>{f.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejection reasons */}
          {data.rejectionReasons.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-3" style={{ color: '#374151' }}>Rejection Reason Breakdown</p>
              <div className="space-y-2">
                {data.rejectionReasons.map(r => (
                  <div key={r.reason} className="flex items-center gap-3">
                    <span className="text-xs flex-1" style={{ color: '#6b7280' }}>{r.reason}</span>
                    <div className="flex-1 h-2.5 rounded-full" style={{ background: '#f3f4f6' }}>
                      <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: '#dc2626' }} />
                    </div>
                    <span className="text-xs font-bold w-8 text-right" style={{ color: '#dc2626' }}>{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time breakdown */}
          {data.timeBreakdown.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-3" style={{ color: '#374151' }}>Time / Channel Breakdown</p>
              <div className="grid grid-cols-2 gap-2">
                {data.timeBreakdown.map(t => (
                  <div key={t.name} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-base font-bold" style={{ color: '#374151' }}>{t.pct}%</p>
                    <p className="text-[10px]" style={{ color: '#9ca3af' }}>{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString('id-ID');
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export default function SalesPage() {
  const { data: funnel, isLoading: loadingFunnel } = useRealtime(getFunnelData, 30_000);
  const { data: disbursements, isLoading: loadingDisb } = useRealtime(getDisbursementsByLoB, 30_000);
  const [drillStage, setDrillStage] = React.useState<string | null>(null);

  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const funnelData = funnel ?? [
    { stage: 'Banner Viewed',  count: 124_800, color: '#4f8ef7' },
    { stage: 'App Opened',    count:  62_400, color: '#6366f1' },
    { stage: 'Form Started',   count:  31_200, color: '#8b5cf6' },
    { stage: 'Form Submitted', count:  14_976, color: '#a855f7' },
    { stage: 'Approved',       count:   9_734, color: '#10b981' },
    { stage: 'Disbursed',      count:   8_512, color: '#059669' },
  ];

  const maxCount = funnelData[0]?.count ?? 1;

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Sales & Disbursement</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Application pipeline & disbursement — July 2026</p>
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
          { icon: Rocket,              label: 'Total Applications', value: '234K', sub: 'This month',  change: '+18%',   color: '#4f8ef7' },
          { icon: CheckCircle,         label: 'Approval Rate',      value: '71%', sub: 'of submitted', change: '+3%',    color: '#10b981' },
          { icon: CurrencyCircleDollar, label: 'Total Disbursed',   value: 'Rp 89.2B', sub: 'July 2026', change: '+12%', color: '#8b5cf6' },
          { icon: Clock,               label: 'Avg Time to Disburse', value: '3.8 days', sub: 'end-to-end', change: '-0.3d', color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${k.color}15` }}>
              <k.icon size={18} style={{ color: k.color }} weight="fill" />
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>{k.label}</p>
            <p className="text-base font-bold" style={{ color: '#111827' }}>{k.value}</p>
            <p className="text-[11px] mb-2" style={{ color: '#9ca3af' }}>{k.sub}</p>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#ecfdf5', color: '#059669' }}>{k.change}</span>
          </div>
        ))}
      </div>

      {/* Funnel + Drop-off */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Application Funnel — Click any stage to drill down</h3>
          <div className="space-y-3">
            {funnelData.map((stage, i) => {
              const prevVal = i > 0 ? funnelData[i - 1].count : null;
              const drop = prevVal ? Math.round((1 - stage.count / prevVal) * 100) : 0;
              const widthPct = Math.round((stage.count / maxCount) * 100);
              return (
                <div key={stage.stage}>
                  <button
                    onClick={() => setDrillStage(stage.stage)}
                    className="w-full flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity text-left"
                  >
                    <div className="w-32 shrink-0">
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{stage.stage}</span>
                    </div>
                    <div className="flex-1 h-10 rounded-xl overflow-hidden" style={{ background: '#f3f4f6' }}>
                      <div className="h-full rounded-xl flex items-center justify-end pr-3 transition-all duration-700"
                        style={{ width: `${Math.max(widthPct, 5)}%`, background: stage.color }}>
                        <span className="text-xs font-bold text-white">{loadingFunnel ? '...' : stage.count.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-xs font-bold" style={{ color: stage.color }}>{widthPct}%</span>
                    </div>
                  </button>
                  {drop > 0 && (
                    <div className="flex items-center gap-2 ml-32 mt-0.5">
                      <div className="h-px flex-1 bg-red-100" />
                      <span className="text-[10px]" style={{ color: '#dc2626' }}>▼ {drop}% drop</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] mt-3" style={{ color: '#9ca3af' }}>Tip: Click any funnel stage to see device breakdown, time-of-day analysis, and field-level drop-off</p>
        </div>

        {/* Drop-off + Action */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Drop-off Analysis</h3>
            <div className="space-y-3">
              {[
                { stage: 'Viewed → Opened',    color: '#dc2626' },
                { stage: 'Opened → Started',   color: '#dc2626' },
                { stage: 'Started → Submitted', color: '#d97706' },
                { stage: 'Submitted → Approved', color: '#d97706' },
                { stage: 'Approved → Disbursed', color: '#dc2626' },
              ].map((item, idx) => {
                const prev = funnelData[idx]?.count ?? 1;
                const curr = funnelData[idx + 1]?.count ?? 0;
                const drop = Math.round((1 - curr / prev) * 100);
                return (
                <div key={item.stage} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium" style={{ color: '#374151' }}>{item.stage}</span>
                    <span className="text-sm font-extrabold" style={{ color: item.color }}>-{drop}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-gray-200">
                    <div className="h-full rounded-full" style={{ width: `${drop}%`, background: item.color }} />
                  </div>
                </div>
              );
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold mb-2" style={{ color: '#111827' }}>Top Action</h3>
            <p className="text-xs" style={{ color: '#6b7280' }}>SPEKTRA: 62% drop at document upload. Simplify 6 docs to 3 core. Potential +2,100 apps/month.</p>
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] px-2 py-1 rounded-lg font-medium" style={{ background: '#fef2f2', color: '#dc2626' }}>HIGH PRIORITY</span>
              <span className="text-[10px] px-2 py-1 rounded-lg font-medium" style={{ background: '#eff6ff', color: '#4f8ef7' }}>UX Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disbursement Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Disbursement by LoB — July 2026</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                <th className="text-left pb-2 pr-4">LoB</th>
                <th className="text-right pb-2 pr-4">Total Amount</th>
                <th className="text-right pb-2 pr-4">Loans</th>
                <th className="text-right pb-2 pr-4">Avg Amount</th>
                <th className="text-right pb-2">Avg Days</th>
              </tr>
            </thead>
            <tbody>
              {(disbursements ?? []).map(d => (
                <tr key={d.lob} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                        <img src={LOB_LOGOS[d.lob]} alt={d.lob} className="w-7 h-7 object-contain" />
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#374151' }}>{d.lob}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <span className="text-sm font-bold" style={{ color: '#111827' }}>{fmt(d.disbursed)}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <span className="text-sm font-medium" style={{ color: '#374151' }}>{d.count.toLocaleString()}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-right">
                    <span className="text-sm font-medium" style={{ color: '#374151' }}>{fmt(d.disbursed / d.count)} avg</span>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="text-sm font-bold" style={{ color: d.avgDays > 4 ? '#dc2626' : '#059669' }}>{d.avgDays}d</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Modal */}
      {drillStage && <DrillDownModal stage={drillStage} onClose={() => setDrillStage(null)} />}
    </div>
  );
}
