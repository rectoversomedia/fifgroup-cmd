'use client';

import * as React from 'react';
import { Globe, TrendUp, TrendDown, Star } from '@phosphor-icons/react';

const COMPETITORS = [
  {
    name: 'Adira Finance',
    type: 'Multi Asset Financing',
    rating: '4.1',
    mau: '1.8M',
    downloads: '6.2M',
    color: '#dc2626',
    strength: ['Strong motorcycle financing brand', 'Nationwide branch network', 'Adira e-wallet integration'],
    weakness: ['Mostly offline', 'Slower digital adoption', 'Higher interest rates'],
    share: 28,
  },
  {
    name: 'BFI Finance',
    type: 'Motorcycle & Auto',
    rating: '4.0',
    mau: '2.1M',
    downloads: '4.8M',
    color: '#0284c7',
    strength: ['Largest motorcycle financing', 'Widest branch coverage', 'Strong repeat customers'],
    weakness: ['Legacy tech stack', 'Complex onboarding', 'App UX lags competitors'],
    share: 32,
  },
  {
    name: 'BAF (Bussan Auto)',
    type: 'Yamaha Motorcycle',
    rating: '3.9',
    mau: '1.4M',
    downloads: '3.1M',
    color: '#7c3aed',
    strength: ['Yamaha partnership exclusive', 'Fast Yamaha claims process', 'Loyal Yamaha dealer network'],
    weakness: ['Single brand dependency', 'Limited digital features', 'No multi-product offering'],
    share: 22,
  },
  {
    name: 'WOM Finance',
    type: 'Motorcycle Financing',
    rating: '3.8',
    mau: '680K',
    downloads: '1.2M',
    color: '#d97706',
    strength: ['Aggressive pricing', 'Fast approval cycle'],
    weakness: ['Small app ecosystem', 'Limited app features'],
    share: 8,
  },
  {
    name: 'SMS Finance',
    type: 'Motorcycle & Micro',
    rating: '3.7',
    mau: '420K',
    downloads: '890K',
    color: '#059669',
    strength: ['Competitive rates', 'Micro lending focus'],
    weakness: ['Small brand recognition', 'Limited digital presence'],
    share: 6,
  },
];

export default function CompetitorsPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Competitor Landscape</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Indonesian multi-finance & fintech market — July 2026</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Market Competitors', value: '5', sub: 'Key players tracked', color: '#4f8ef7' },
          { label: 'FIFGROUP Strength', value: '5 LoBs', sub: 'Full-stack coverage', color: '#10b981' },
          { label: 'FIFGO Downloads', value: '850K', sub: 'Fastest growing', color: '#8b5cf6' },
          { label: 'CDP Advantage', value: 'Unique', sub: 'Full journey tracking', color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>{m.label}</p>
            <p className="text-3xl font-extrabold mb-1" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-[11px]" style={{ color: '#9ca3af' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-5 gap-4">
        {COMPETITORS.map(c => (
          <div key={c.name} className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${c.color}15` }}>
              <Globe size={20} style={{ color: c.color }} weight="fill" />
            </div>
            <p className="text-sm font-extrabold mb-0.5" style={{ color: '#111827' }}>{c.name}</p>
            <p className="text-[10px] mb-3 px-2 py-0.5 rounded-full" style={{ background: `${c.color}10`, color: c.color, fontWeight: 600 }}>{c.type}</p>
            <div className="flex gap-2 mb-3">
              <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>{c.rating}★</span>
              <span className="text-xs font-medium" style={{ color: '#374151' }}>{c.mau} MAU</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1">
              <div className="h-full rounded-full" style={{ width: `${c.share}%`, background: c.color }} />
            </div>
            <p className="text-[10px]" style={{ color: '#9ca3af' }}>{c.share}% market share</p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Feature Comparison — Traditional Multi-Finance vs FIFGROUP Digital</h3>
        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
              <th className="text-left pb-2 pr-4">Competitor</th>
              <th className="text-center pb-2 pr-4">Rating</th>
              <th className="text-center pb-2 pr-4">MAU</th>
              <th className="text-center pb-2 pr-4">App Speed</th>
              <th className="text-center pb-2 pr-4">LoB Coverage</th>
              <th className="text-center pb-2 pr-4">CDP / Journey</th>
              <th className="text-center pb-2">Branch Network</th>
            </tr>
          </thead>
          <tbody>
            {COMPETITORS.map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td className="py-3.5 pr-4"><span className="text-sm font-bold" style={{ color: c.color }}>{c.name}</span></td>
                <td className="py-3.5 pr-4 text-center"><span className="text-sm font-bold" style={{ color: '#f59e0b' }}>{c.rating}★</span></td>
                <td className="py-3.5 pr-4 text-center"><span className="text-sm font-medium" style={{ color: '#374151' }}>{c.mau}</span></td>
                <td className="py-3.5 pr-4 text-center"><span className="text-sm font-medium" style={{ color: '#374151' }}>{(Math.random() * 5 + 2).toFixed(1)} days</span></td>
                <td className="py-3.5 pr-4 text-center"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#fef3c7', color: '#92400e' }}>1 LoB</span></td>
                <td className="py-3.5 pr-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#fee2e2', color: '#dc2626' }}>No</span></td>
                <td className="py-3.5 text-center"><span className="text-sm font-medium" style={{ color: '#059669' }}>Extensive</span></td>
              </tr>
            ))}
            <tr style={{ background: '#f0fdf4' }}>
              <td className="py-3.5 pr-4"><span className="text-sm font-bold" style={{ color: '#1e3a5f' }}>FIFGO + FIFADA</span></td>
              <td className="py-3.5 pr-4 text-center"><span className="text-sm font-bold" style={{ color: '#f59e0b' }}>4.2★</span></td>
              <td className="py-3.5 pr-4 text-center"><span className="text-sm font-bold" style={{ color: '#111827' }}>296K</span></td>
              <td className="py-3.5 pr-4 text-center"><span className="text-sm font-bold" style={{ color: '#059669' }}>3.2 days</span></td>
              <td className="py-3.5 pr-4 text-center"><span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: '#dcfce7', color: '#059669' }}>5 LoBs</span></td>
              <td className="py-3.5 pr-4 text-center"><span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#059669' }}>Yes</span></td>
              <td className="py-3.5 text-center"><span className="text-sm font-medium" style={{ color: '#6b7280' }}>Nationwide</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Advantages + Areas to Improve */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>FIFGROUP Key Advantages</h3>
          <div className="space-y-3">
            {[
              { text: 'Only player with 5 full LoBs under one digital ecosystem', color: '#10b981' },
              { text: 'Insider CDP — full user journey tracking & automation', color: '#4f8ef7' },
              { text: 'FIFGO Super App + FIFADA — digital-first with branch backup', color: '#8b5cf6' },
              { text: 'Bill Reminder journey: 94% collection rate via CDP', color: '#06b6d4' },
              { text: 'Branch network coverage + full digital app (offline-to-online)', color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${item.color}08` }}>
                <TrendUp size={14} style={{ color: item.color }} weight="fill" />
                <p className="text-xs font-medium" style={{ color: '#374151' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Areas to Improve</h3>
          <div className="space-y-3">
            {[
              { text: 'FIFADA app health: crash rate 1.4% — threshold 0.5%', color: '#dc2626' },
              { text: 'SPEKTRA document drop-off: 62% at upload stage', color: '#dc2626' },
              { text: 'Disbursement speed: 3.2 days vs competitors 2-5 days avg', color: '#f59e0b' },
              { text: 'MAU gap: 296K vs BFI 2.1M — need aggressive user growth', color: '#f59e0b' },
              { text: 'Post-disbursement journey: still in draft, not live yet', color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${item.color}08` }}>
                <TrendDown size={14} style={{ color: item.color }} weight="fill" />
                <p className="text-xs font-medium" style={{ color: '#374151' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
