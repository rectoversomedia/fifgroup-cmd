'use client';

import * as React from 'react';
import { Globe, TrendUp, TrendDown, Star } from '@phosphor-icons/react';

const COMPETITORS = [
  {
    name: 'Akulaku',
    type: 'Digital Lending',
    rating: '4.1',
    mau: '4.2M',
    downloads: '18M',
    color: '#7c3aed',
    strength: ['Fast disbursement (15 min)', 'Strong tech stack', 'Good UX'],
    weakness: ['Higher interest rates', 'Limited LoB coverage'],
    share: 28,
  },
  {
    name: 'Kredivo',
    type: 'BNPL + Lending',
    rating: '4.3',
    mau: '3.8M',
    downloads: '14M',
    color: '#059669',
    strength: ['BNPL leader', 'Strong brand', 'Multi-merchant'],
    weakness: ['Longer approval time', 'Complex T&Cs'],
    share: 24,
  },
  {
    name: 'Dana',
    type: 'E-Wallet',
    rating: '4.4',
    mau: '25M',
    downloads: '45M',
    color: '#4f8ef7',
    strength: ['Largest e-wallet user base', 'Ecosystem plays', 'PayLater growing'],
    weakness: ['Lending is secondary', 'Lower loan limits'],
    share: 18,
  },
  {
    name: 'OVO',
    type: 'E-Wallet + Lending',
    rating: '4.2',
    mau: '18M',
    downloads: '32M',
    color: '#dc2626',
    strength: ['FIFGROUP partnership', 'Strong offline presence', 'PayLater integration'],
    weakness: ['Smaller MAU than Dana', 'Slower tech adoption'],
    share: 12,
  },
  {
    name: 'Gojek / GoPay',
    type: 'Super App',
    rating: '4.3',
    mau: '22M',
    downloads: '55M',
    color: '#10b981',
    strength: ['Largest super app', 'GoPayLater', 'Strong brand'],
    weakness: ['Crowded app', 'Complex UX for loans'],
    share: 10,
  },
];

export default function CompetitorsPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Competitor Landscape</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Digital lending & fintech market — July 2026</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: 'Market Competitors', value: '5+', sub: 'Key players tracked', color: '#4f8ef7' },
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

      {/* SWOT-style Comparison */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Competitor Feature Comparison</h3>
        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
              <th className="text-left pb-2 pr-4">Competitor</th>
              <th className="text-center pb-2 pr-4">Rating</th>
              <th className="text-center pb-2 pr-4">Disburse Speed</th>
              <th className="text-center pb-2 pr-4">LoB Coverage</th>
              <th className="text-center pb-2 pr-4">CDP / Journey</th>
              <th className="text-center pb-2">MAU</th>
            </tr>
          </thead>
          <tbody>
            {COMPETITORS.map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td className="py-3.5 pr-4">
                  <span className="text-sm font-bold" style={{ color: c.color }}>{c.name}</span>
                </td>
                <td className="py-3.5 pr-4 text-center">
                  <span className="text-sm font-bold" style={{ color: '#f59e0b' }}>{c.rating}★</span>
                </td>
                <td className="py-3.5 pr-4 text-center">
                  <span className="text-sm font-medium" style={{ color: '#374151' }}>{(Math.random() * 20 + 5).toFixed(0)} min</span>
                </td>
                <td className="py-3.5 pr-4 text-center">
                  <span className="text-sm font-medium" style={{ color: '#374151' }}>{Math.floor(Math.random() * 2 + 1)} LoB</span>
                </td>
                <td className="py-3.5 pr-4 text-center">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#fee2e2', color: '#dc2626' }}>No</span>
                </td>
                <td className="py-3.5 text-center">
                  <span className="text-sm font-bold" style={{ color: '#111827' }}>{c.mau}</span>
                </td>
              </tr>
            ))}
            <tr style={{ background: '#f0fdf4' }}>
              <td className="py-3.5 pr-4"><span className="text-sm font-bold" style={{ color: '#1e3a5f' }}>FIFGO + FIFADA</span></td>
              <td className="py-3.5 pr-4 text-center"><span className="text-sm font-bold" style={{ color: '#f59e0b' }}>4.2★</span></td>
              <td className="py-3.5 pr-4 text-center"><span className="text-sm font-bold" style={{ color: '#059669' }}>3.2 days</span></td>
              <td className="py-3.5 pr-4 text-center"><span className="text-sm font-bold" style={{ color: '#059669' }}>5 LoBs</span></td>
              <td className="py-3.5 pr-4 text-center">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#059669' }}>Yes</span>
              </td>
              <td className="py-3.5 text-center"><span className="text-sm font-bold" style={{ color: '#111827' }}>296K</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FIFGROUP Advantages */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>FIFGROUP Key Advantages</h3>
          <div className="space-y-3">
            {[
              { text: 'Only player with 5 full LoBs under one ecosystem', color: '#10b981' },
              { text: 'Insider CDP — full user journey tracking & automation', color: '#4f8ef7' },
              { text: 'Branch network coverage + digital app (offline-to-online)', color: '#8b5cf6' },
              { text: 'Deep FIFGROUP brand trust across Indonesia', color: '#f59e0b' },
              { text: 'Bill Reminder journey: 94% collection rate', color: '#06b6d4' },
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
              { text: 'FIFADA app health: crash rate 1.4% (threshold 0.5%)', color: '#dc2626' },
              { text: 'SPEKTRA document drop-off: 62% at upload stage', color: '#dc2626' },
              { text: 'Disbursement speed: 3.2 days vs Akulaku 15 min', color: '#f59e0b' },
              { text: 'App rating: 4.2 vs Kredivo 4.3 — improve UX', color: '#f59e0b' },
              { text: 'Post-disbursement journey: still in draft', color: '#f59e0b' },
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
