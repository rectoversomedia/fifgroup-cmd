'use client';

import * as React from 'react';
import { Rocket, CheckCircle, Clock, CurrencyCircleDollar } from '@phosphor-icons/react';

const LOB_LOGOS: Record<string, string> = {
  FIFASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FIFASTRA-1780538519035.png',
  SPEKTRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20SPEKTRA-1780538544863.png',
  DANASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20DANASTRA-1780538584771.png',
  FINATRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FINATRA-1780538626287.png',
  AMITRA:   'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20AMITRA-1780538604037.png',
};

const funnel = [
  { label: 'Banner Viewed', value: 234000, pct: 100, color: '#6366f1' },
  { label: 'Page Entered', value: 185000, pct: 79, color: '#4f8ef7' },
  { label: 'App Started', value: 62400, pct: 27, color: '#8b5cf6' },
  { label: 'Form Submitted', value: 39400, pct: 17, color: '#06b6d4' },
  { label: 'Approved', value: 28000, pct: 12, color: '#f59e0b' },
  { label: 'Disbursed', value: 19200, pct: 8, color: '#10b981' },
];

const disbursements = [
  { lob: 'FIFASTRA', logo: LOB_LOGOS.FIFASTRA, amount: 'Rp 34.2B', count: 12800, avgAmount: '2.67M', days: 3.2, color: '#4f8ef7' },
  { lob: 'SPEKTRA',  logo: LOB_LOGOS.SPEKTRA,  amount: 'Rp 8.4B',  count: 4960,  avgAmount: '1.69M', days: 4.8, color: '#f43f5e' },
  { lob: 'DANASTRA', logo: LOB_LOGOS.DANASTRA, amount: 'Rp 21.6B', count: 15600, avgAmount: '1.38M', days: 3.8, color: '#06b6d4' },
  { lob: 'FINATRA',  logo: LOB_LOGOS.FINATRA,  amount: 'Rp 15.6B', count: 10400, avgAmount: '1.50M', days: 4.1, color: '#f59e0b' },
  { lob: 'AMITRA',   logo: LOB_LOGOS.AMITRA,   amount: 'Rp 9.4B',  count: 12800, avgAmount: '0.73M', days: 3.5, color: '#10b981' },
];

export default function SalesPage() {
  const funnelValues = funnel.map(f => f.value);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Sales & Disbursement</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Application pipeline & disbursement tracking — July 2026</p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { icon: Rocket, label: 'Total Applications', value: '234K', sub: 'This month', change: '+18%', color: '#4f8ef7' },
          { icon: CheckCircle, label: 'Approval Rate', value: '71%', sub: 'of submitted', change: '+3%', color: '#10b981' },
          { icon: CurrencyCircleDollar, label: 'Total Disbursed', value: 'Rp 89.2B', sub: 'This month', change: '+12%', color: '#8b5cf6' },
          { icon: Clock, label: 'Avg Time to Disburse', value: '3.8 days', sub: 'end-to-end', change: '-0.3d', color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${k.color}15` }}>
              <k.icon size={22} style={{ color: k.color }} weight="fill" />
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>{k.label}</p>
            <p className="text-3xl font-extrabold mb-1" style={{ color: '#111827' }}>{k.value}</p>
            <p className="text-[11px] mb-2" style={{ color: '#9ca3af' }}>{k.sub}</p>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#ecfdf5', color: '#059669' }}>{k.change}</span>
          </div>
        ))}
      </div>

      {/* Funnel + Drop-off */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Application Funnel — All LoBs</h3>
          <div className="space-y-4">
            {funnel.map((stage, i) => {
              const prevVal = i > 0 ? funnelValues[i - 1] : null;
              const drop = prevVal ? Math.round((1 - stage.value / prevVal) * 100) : 0;
              return (
                <div key={stage.label}>
                  <div className="flex items-center gap-3">
                    <div className="w-32 shrink-0 text-xs font-medium" style={{ color: '#6b7280' }}>{stage.label}</div>
                    <div className="flex-1 h-10 rounded-xl overflow-hidden" style={{ background: '#f3f4f6' }}>
                      <div className="h-full rounded-xl flex items-center justify-end pr-3 transition-all"
                        style={{ width: `${Math.max(stage.pct, 5)}%`, background: stage.color }}>
                        <span className="text-xs font-bold text-white">{stage.value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-10 text-right">
                      <span className="text-xs font-bold" style={{ color: stage.color }}>{stage.pct}%</span>
                    </div>
                  </div>
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
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Drop-off Analysis</h3>
            <div className="space-y-3">
              {[
                { stage: 'Viewed → Entered', drop: 21, color: '#dc2626' },
                { stage: 'Entered → Started', drop: 52, color: '#dc2626' },
                { stage: 'Started → Submitted', drop: 37, color: '#d97706' },
                { stage: 'Submitted → Approved', drop: 29, color: '#d97706' },
                { stage: 'Approved → Disbursed', drop: 31, color: '#dc2626' },
              ].map(item => (
                <div key={item.stage} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium" style={{ color: '#374151' }}>{item.stage}</span>
                    <span className="text-sm font-extrabold" style={{ color: item.color }}>-{item.drop}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-gray-200">
                    <div className="h-full rounded-full" style={{ width: `${item.drop}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold mb-2" style={{ color: '#111827' }}>Top Action</h3>
            <p className="text-xs" style={{ color: '#6b7280' }}>SPEKTRA: 62% drop at document upload. Simplify 6 docs to 3 core. Potential +2,100 apps/month.</p>
          </div>
        </div>
      </div>

      {/* Disbursement Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Disbursement by LoB — July 2026</h3>
        <table className="w-full">
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
            {disbursements.map(d => (
              <tr key={d.lob} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                      <img src={d.logo} alt={d.lob} className="w-7 h-7 object-contain" />
                    </div>
                    <span className="text-sm font-bold" style={{ color: d.color }}>{d.lob}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-right"><span className="text-sm font-bold" style={{ color: '#111827' }}>{d.amount}</span></td>
                <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>{d.count.toLocaleString()}</span></td>
                <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>Rp {d.avgAmount}M</span></td>
                <td className="py-3.5 text-right"><span className="text-sm font-bold" style={{ color: Number(d.days) > 4 ? '#dc2626' : '#059669' }}>{d.days}d</span></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '1px solid #e5e7eb' }}>
              <td className="pt-3 pb-1"><span className="text-xs font-bold" style={{ color: '#374151' }}>TOTAL</span></td>
              <td className="pt-3 pb-1 text-right"><span className="text-sm font-extrabold" style={{ color: '#111827' }}>Rp 89.2B</span></td>
              <td className="pt-3 pb-1 text-right"><span className="text-sm font-bold" style={{ color: '#374151' }}>56,760</span></td>
              <td className="pt-3 pb-1 text-right"><span className="text-sm" style={{ color: '#9ca3af' }}>—</span></td>
              <td className="pt-3 pb-1 text-right"><span className="text-sm font-bold" style={{ color: '#f59e0b' }}>3.8d avg</span></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
