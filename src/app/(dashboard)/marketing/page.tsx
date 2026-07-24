'use client';

import * as React from 'react';
import { Lightning, Users, CheckCircle, TrendUp, Envelope, Bell } from '@phosphor-icons/react';

const CHANNELS = [
  { channel: 'Push Notification', icon: Bell, sent: 189000, delivered: 182430, opened: 91215, clicked: 13682, converted: 4561, color: '#4f8ef7', cost: 'Rp 12.4M', revenue: 'Rp 8.2B' },
  { channel: 'In-App Message', icon: Bell, sent: 234000, delivered: 234000, opened: 117000, clicked: 21060, converted: 7020, color: '#8b5cf6', cost: 'Rp 0', revenue: 'Rp 12.6B' },
  { channel: 'SMS', icon: Lightning, sent: 45600, delivered: 43600, opened: 0, clicked: 3928, converted: 1309, color: '#06b6d4', cost: 'Rp 45.6M', revenue: 'Rp 2.4B' },
  { channel: 'Email', icon: Envelope, sent: 89000, delivered: 80100, opened: 20025, clicked: 4005, converted: 801, color: '#f59e0b', cost: 'Rp 8.9M', revenue: 'Rp 1.4B' },
  { channel: 'Branch /柜台', icon: Users, sent: 2800, delivered: 2800, opened: 2800, clicked: 1400, converted: 840, color: '#10b981', cost: 'Rp 280M', revenue: 'Rp 1.5B' },
];

const TEMPLATES = [
  { name: 'Welcome New User', channel: 'Push', convRate: 22, users: 12400, color: '#4f8ef7', status: 'Active' },
  { name: 'Bill Reminder -3 days', channel: 'Push', convRate: 94, users: 45600, color: '#10b981', status: 'Active' },
  { name: 'Cross-Sell Offer', channel: 'In-App', convRate: 18, users: 34821, color: '#8b5cf6', status: 'Active' },
  { name: 'Promo Bulan Ini 0%', channel: 'Push', convRate: 14, users: 89000, color: '#f97316', status: 'Active' },
  { name: 'Dormant Winback', channel: 'SMS', convRate: 6, users: 8920, color: '#06b6d4', status: 'Paused' },
  { name: 'Survey NPS', channel: 'Email', convRate: 8, users: 45600, color: '#f59e0b', status: 'Draft' },
];

export default function MarketingPage() {
  const totalSent = CHANNELS.reduce((s, c) => s + c.sent, 0);
  const totalConverted = CHANNELS.reduce((s, c) => s + c.converted, 0);
  const totalRevenue = CHANNELS.reduce((s, c) => s + parseFloat(c.revenue.replace(/[Rp.\sB]/g, '')), 0);
  const bestConv = Math.max(...CHANNELS.map(c => c.converted / c.sent * 100));

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Marketing Channel Performance</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Omnichannel campaign tracking — July 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { icon: TrendUp, label: 'Total Reach', value: `${Math.round(totalSent / 1000)}K`, sub: 'All channels', color: '#4f8ef7' },
          { icon: CheckCircle, label: 'Total Conversions', value: totalConverted.toLocaleString(), sub: 'All channels', color: '#10b981' },
          { icon: Lightning, label: 'Best Channel Conv.', value: '94%', sub: 'Bill Reminder', color: '#8b5cf6' },
          { icon: Users, label: 'Est. Revenue', value: 'Rp 26.1B', sub: 'Attributed revenue', color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={22} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>{m.label}</p>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-[11px]" style={{ color: '#9ca3af' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Channel Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Channel Performance</h3>
        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
              <th className="text-left pb-2 pr-4">Channel</th>
              <th className="text-right pb-2 pr-4">Sent</th>
              <th className="text-right pb-2 pr-4">Delivered</th>
              <th className="text-right pb-2 pr-4">Opened</th>
              <th className="text-right pb-2 pr-4">Clicked</th>
              <th className="text-right pb-2 pr-4">Conv.</th>
              <th className="text-right pb-2 pr-4">Conv%</th>
              <th className="text-right pb-2 pr-4">Cost</th>
              <th className="text-right pb-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {CHANNELS.map(c => {
              const convPct = Math.round(c.converted / c.sent * 100);
              const isBest = convPct >= bestConv - 2;
              return (
                <tr key={c.channel} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${c.color}15` }}>
                        <c.icon size={16} style={{ color: c.color }} weight="fill" />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: c.color }}>{c.channel}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>{c.sent.toLocaleString()}</span></td>
                  <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>{c.delivered.toLocaleString()}</span></td>
                  <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>{c.opened > 0 ? c.opened.toLocaleString() : '—'}</span></td>
                  <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>{c.clicked.toLocaleString()}</span></td>
                  <td className="py-3.5 pr-4 text-right"><span className="text-sm font-bold" style={{ color: '#10b981' }}>{c.converted.toLocaleString()}</span></td>
                  <td className="py-3.5 pr-4 text-right">
                    <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: isBest ? '#ecfdf5' : '#f3f4f6', color: isBest ? '#059669' : '#374151' }}>
                      {convPct}%
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#6b7280' }}>{c.cost}</span></td>
                  <td className="py-3.5 text-right"><span className="text-sm font-bold" style={{ color: '#059669' }}>{c.revenue}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Templates */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Push Notification Templates</h3>
        <div className="grid grid-cols-3 gap-4">
          {TEMPLATES.map(t => (
            <div key={t.name} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${t.color}15` }}>
                <Bell size={18} style={{ color: t.color }} weight="fill" />
              </div>
              <p className="text-xs font-bold mb-1" style={{ color: '#111827' }}>{t.name}</p>
              <span className="text-[9px] font-semibold mb-3 px-2 py-0.5 rounded-full" style={{ background: `${t.color}15`, color: t.color }}>{t.channel}</span>
              <div className="w-full space-y-2 mt-auto">
                <div className="h-2 rounded-full overflow-hidden bg-gray-200">
                  <div className="h-full rounded-full" style={{ width: `${t.convRate}%`, background: t.color }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px]" style={{ color: '#9ca3af' }}>{t.users.toLocaleString()} users</span>
                  <span className="text-[10px] font-bold" style={{ color: t.color }}>{t.convRate}%</span>
                </div>
              </div>
              <span className={`text-[9px] mt-2 px-2 py-0.5 rounded-full font-bold ${
                t.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                t.status === 'Paused' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
