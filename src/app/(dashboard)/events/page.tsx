'use client';

import * as React from 'react';
import { Lightning, Users, Eye, CheckCircle, Warning } from '@phosphor-icons/react';

const EVENTS = [
  { id: 1, name: 'app_opened', category: 'App', icon: Lightning, color: '#4f8ef7', count: 234000, trend: '+12%', description: 'User launches FIFGO or FIFADA app' },
  { id: 2, name: 'kyc_completed', category: 'KYC', icon: CheckCircle, color: '#10b981', count: 62400, trend: '+8%', description: 'User completes identity verification' },
  { id: 3, name: 'application_started', category: 'Sales', icon: Lightning, color: '#8b5cf6', count: 52800, trend: '+15%', description: 'User begins loan application flow' },
  { id: 4, name: 'document_uploaded', category: 'Sales', icon: Lightning, color: '#f59e0b', count: 39400, trend: '+3%', description: 'User uploads required documents' },
  { id: 5, name: 'loan_approved', category: 'Sales', icon: CheckCircle, color: '#10b981', count: 28000, trend: '+11%', description: 'Application approved by system' },
  { id: 6, name: 'disbursement_completed', category: 'Sales', icon: CheckCircle, color: '#059669', count: 19200, trend: '+12%', description: 'Funds transferred to user account' },
  { id: 7, name: 'repayment_made', category: 'Collections', icon: CheckCircle, color: '#06b6d4', count: 15800, trend: '+9%', description: 'User makes scheduled repayment' },
  { id: 8, name: 'push_sent', category: 'Marketing', icon: Lightning, color: '#4f8ef7', count: 189000, trend: '+18%', description: 'Push notification dispatched' },
  { id: 9, name: 'push_opened', category: 'Marketing', icon: Eye, color: '#8b5cf6', count: 91215, trend: '+6%', description: 'User opens push notification' },
  { id: 10, name: 'crosssell_shown', category: 'CDP', icon: Users, color: '#f97316', count: 34821, trend: '+14%', description: 'Cross-sell offer presented' },
  { id: 11, name: 'crosssell_accepted', category: 'CDP', icon: CheckCircle, color: '#10b981', count: 2786, trend: '+8%', description: 'User accepts cross-sell offer' },
  { id: 12, name: 'dormant_user', category: 'CDP', icon: Warning, color: '#f43f5e', count: 8920, trend: '-2%', description: 'User inactive > 30 days' },
];

const CATEGORIES = ['All', 'App', 'KYC', 'Sales', 'Collections', 'Marketing', 'CDP'];

export default function EventsPage() {
  const [cat, setCat] = React.useState('All');
  const filtered = cat === 'All' ? EVENTS : EVENTS.filter(e => e.category === cat);
  const total = EVENTS.reduce((s, e) => s + e.count, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Event Tracker</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Insider CDP real-time events — July 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { icon: Lightning, label: 'Total Events Today', value: `${Math.round(total / 1000)}K`, color: '#4f8ef7' },
          { icon: CheckCircle, label: 'Conversion Events', value: EVENTS.filter(e => ['Sales', 'Collections', 'CDP'].includes(e.category)).reduce((s, e) => s + e.count, 0).toLocaleString(), color: '#10b981' },
          { icon: Users, label: 'Unique Users Today', value: '296K', color: '#8b5cf6' },
          { icon: Eye, label: 'Push Open Rate', value: '48%', color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={22} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-2xl font-extrabold mb-1" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all border"
            style={cat === c ? { background: '#1e3a5f', color: '#fff', border: '1px solid #1e3a5f' } : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(e => {
          const Icon = e.icon;
          const pct = Math.round(e.count / total * 100);
          return (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${e.color}15` }}>
                <Icon size={18} style={{ color: e.color }} weight="fill" />
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full mb-2" style={{ background: `${e.color}15`, color: e.color }}>{e.category}</span>
              <p className="text-xs font-bold mb-1" style={{ color: '#111827' }}>{e.name}</p>
              <p className="text-[10px] mb-3" style={{ color: '#9ca3af' }}>{e.description}</p>
              <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: e.color }} />
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-medium" style={{ color: '#374151' }}>{e.count.toLocaleString()}</span>
                <span className="text-[10px] font-bold" style={{ color: e.trend.startsWith('+') ? '#059669' : '#dc2626' }}>{e.trend}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
