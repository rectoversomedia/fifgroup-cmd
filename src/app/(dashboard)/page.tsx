'use client';

import * as React from 'react';

const FIFGO_LOGO = 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/FIFGO_APP_LOGO-1780892650611.png';
const FIFADA_LOGO = 'https://scontent-cgk2-1.cdninstagram.com/v/t51.2885-19/49858272_338347660347827_7285482938928463872_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=106&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy41MTIuQzMifQ%3D%3D&_nc_ohc=bIdS5-hmhaMQ7kNvwHRAgTa&_nc_oc=AdrifddXOrGA5_zK-ZfF12fUMNEhqGQI05S0gpwA9bpPeuPdP-rlpUYcI2F6DK7Edp-aW8lcFzdjGJbA-PRKu02X&_nc_zt=24&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_ss=7f60f&oh=00_AQDhtqX_BnGYvs3T00h1Av3rLy_9_Zmaja8YrqVFlcTbDw&oe=6A68ABD2';
const LOB_LOGOS: Record<string, string> = {
  FIFASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FIFASTRA-1780538519035.png',
  SPEKTRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20SPEKTRA-1780538544863.png',
  DANASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20DANASTRA-1780538584771.png',
  FINATRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FINATRA-1780538626287.png',
  AMITRA:   'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20AMITRA-1780538604037.png',
};

export default function PortfolioPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Portfolio Overview</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>FIFGROUP Digital Command Center — July 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'MAU (Combined)', value: '296K', sub: '+12% MoM', change: '+12%', color: '#4f8ef7' },
          { label: 'Total Disbursement', value: 'Rp 89.2B', sub: 'July 2026', change: '+18%', color: '#10b981' },
          { label: 'Conversion Rate', value: '8.2%', sub: 'App → Disbursed', change: '+0.6%', color: '#8b5cf6' },
          { label: 'CDP Journeys Active', value: '4/5', sub: '1 Draft', change: '+1', color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>{k.label}</p>
            <p className="text-3xl font-extrabold mb-1" style={{ color: '#111827' }}>{k.value}</p>
            <p className="text-[11px] mb-2" style={{ color: '#9ca3af' }}>{k.sub}</p>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#ecfdf5', color: '#059669' }}>{k.change}</span>
          </div>
        ))}
      </div>

      {/* App Health */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-gray-50 border border-gray-200">
            <img src={FIFGO_LOGO} alt="FIFGO" className="w-12 h-12 object-contain" />
          </div>
          <p className="text-sm font-bold" style={{ color: '#111827' }}>FIFGO</p>
          <p className="text-[11px] mb-2" style={{ color: '#9ca3af' }}>Super App</p>
          <span className="text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: '#d1fae5', color: '#065f46' }}>HEALTHY</span>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold" style={{ color: '#111827' }}>234K</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>MAU</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold" style={{ color: '#111827' }}>4.2★</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>Rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-gray-50 border border-gray-200">
            <img src={FIFADA_LOGO} alt="FIFADA" className="w-12 h-12 object-contain" />
          </div>
          <p className="text-sm font-bold" style={{ color: '#111827' }}>FIFADA</p>
          <p className="text-[11px] mb-2" style={{ color: '#9ca3af' }}>Separate App</p>
          <span className="text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: '#fef3c7', color: '#92400e' }}>WATCH</span>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold" style={{ color: '#111827' }}>62K</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>MAU</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold" style={{ color: '#111827' }}>3.8★</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>Rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center text-center">
          <p className="text-sm font-bold mb-4" style={{ color: '#111827' }}>5 Lines of Business</p>
          <div className="grid grid-cols-3 gap-2 w-full">
            {Object.entries(LOB_LOGOS).map(([name, url]) => (
              <div key={name} className="bg-gray-50 rounded-xl p-2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src={url} alt={name} className="w-7 h-7 object-contain" />
                </div>
                <p className="text-[9px] font-semibold mt-1" style={{ color: '#374151' }}>{name}</p>
              </div>
            ))}
            <div className="bg-gray-50 rounded-xl p-2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="text-[9px] font-bold" style={{ color: '#4f8ef7' }}>TOTAL</span>
              </div>
              <p className="text-[9px] font-semibold mt-1" style={{ color: '#374151' }}>296K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Alerts + Quick Stats */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Quick Stats</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Push Open Rate', value: '48%', color: '#4f8ef7' },
              { label: 'Bill Reminder Success', value: '94%', color: '#10b981' },
              { label: 'Bill Collection Rate', value: '94.2%', color: '#10b981' },
              { label: 'Avg Days to Disburse', value: '3.8d', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center">
                <p className="text-2xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px]" style={{ color: '#9ca3af' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Priority Alerts</h3>
          <div className="space-y-3">
            {[
              { severity: 'high', text: 'FIFADA crash rate 1.4% — threshold 0.5%', color: '#dc2626' },
              { severity: 'high', text: 'SPEKTRA document drop-off at 62%', color: '#dc2626' },
              { severity: 'medium', text: 'Dormant Re-Engagement journey paused', color: '#d97706' },
              { severity: 'low', text: 'Q3 brand campaign brief pending approval', color: '#6b7280' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: a.color }} />
                <p className="text-xs" style={{ color: '#374151' }}>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LoB Performance Snapshot */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>LoB Performance Snapshot</h3>
        <div className="space-y-3">
          {[
            { name: 'FIFASTRA', color: '#4f8ef7', users: 168480, pct: 72, change: 5 },
            { name: 'DANASTRA', color: '#06b6d4', users: 142740, pct: 61, change: 4 },
            { name: 'FINATRA',  color: '#f59e0b', users: 105300, pct: 45, change: 2 },
            { name: 'AMITRA',   color: '#10b981', users: 121680, pct: 52, change: 6 },
            { name: 'SPEKTRA',  color: '#f43f5e', users: 65520,  pct: 28, change: -3 },
          ].map(lob => (
            <div key={lob.name} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                <img src={LOB_LOGOS[lob.name]} alt={lob.name} className="w-7 h-7 object-contain" />
              </div>
              <div className="w-20 shrink-0">
                <span className="text-xs font-bold" style={{ color: '#374151' }}>{lob.name}</span>
              </div>
              <div className="flex-1 h-3 rounded-full" style={{ background: '#f3f4f6' }}>
                <div className="h-full rounded-full" style={{ width: `${lob.pct}%`, background: lob.color }} />
              </div>
              <div className="w-8 text-right">
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
  );
}
