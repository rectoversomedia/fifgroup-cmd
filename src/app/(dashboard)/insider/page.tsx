'use client';

import * as React from 'react';
import { Lightning, Users, ChartBar, Gear, Database, Warning } from '@phosphor-icons/react';

const SEGMENTS = [
  { id: 'new_users', name: 'New Users (0-30d)', count: 28400, color: '#4f8ef7', description: 'Registered within last 30 days, no disbursement yet' },
  { id: 'active_borrowers', name: 'Active Borrowers', count: 168000, color: '#10b981', description: 'Currently have an active loan in repayment' },
  { id: 'repeat_borrowers', name: 'Repeat Borrowers', count: 23400, color: '#8b5cf6', description: 'Completed at least 1 loan, eligible for next disbursement' },
  { id: 'dormant_users', name: 'Dormant Users', count: 14200, color: '#f97316', description: 'No activity in > 30 days, no active loan' },
  { id: 'cross_sell_target', name: 'Cross-Sell Target', count: 34821, color: '#06b6d4', description: 'Single LoB active + 60d since last disbursement' },
  { id: 'high_value', name: 'High Value Users', count: 12400, color: '#f59e0b', description: 'LTV > Rp 5M, repayment rate > 95%' },
];

const FEATURES = [
  { icon: Users, name: 'User Identification', status: 'active', desc: 'Track anonymous → identified user journey across devices', color: '#10b981' },
  { icon: Database, name: 'Unified Profile', status: 'active', desc: 'Single profile per user across all LoBs and touchpoints', color: '#10b981' },
  { icon: ChartBar, name: 'Event Tracking', status: 'active', desc: 'Real-time event pipeline: app_opened, kyc_completed, disbursement_completed', color: '#10b981' },
  { icon: Gear, name: 'Journey Orchestration', status: 'active', desc: '5 active journeys: New User, Cross-Sell, Bill Reminder, Dormant, Post-Disburse', color: '#10b981' },
  { icon: Lightning, name: 'Real-Time Triggers', status: 'active', desc: 'Event-based triggers: 7 days KYC, repayment_due -3, dormancy 30d+', color: '#10b981' },
  { icon: Warning, name: 'Predictive Scoring', status: 'beta', desc: 'NPL risk scoring, churn prediction, LTV scoring (beta)', color: '#f59e0b' },
];

export default function InsiderPage() {
  const totalUsers = SEGMENTS.reduce((s, seg) => s + seg.count, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Insider CDP</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Customer Data Platform — user segments & journey tracking</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { icon: Users, label: 'Total Known Users', value: totalUsers.toLocaleString(), color: '#4f8ef7' },
          { icon: Lightning, label: 'Active Journeys', value: '5', sub: '2 running, 3 configured', color: '#10b981' },
          { icon: ChartBar, label: 'Events Tracked', value: '12', sub: 'Real-time event types', color: '#8b5cf6' },
          { icon: Database, label: 'Data Sources', value: '6', sub: 'FIFGO, FIFADA, CDP, Branch', color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={22} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{m.label}</p>
            {m.sub && <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>{m.sub}</p>}
          </div>
        ))}
      </div>

      {/* Data Sources */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Data Sources Integrated</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: 'FIFGO App', type: 'Mobile App', events: '4,200K/day', color: '#10b981' },
            { name: 'FIFADA App', type: 'Mobile App', events: '620K/day', color: '#4f8ef7' },
            { name: 'Branch CRM', type: 'Offline', events: '2,800/day', color: '#8b5cf6' },
            { name: 'Marketing Cloud', type: 'Push/SMS/Email', events: '312K/day', color: '#f59e0b' },
          ].map(s => (
            <div key={s.name} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: `${s.color}15` }}>
                <Database size={16} style={{ color: s.color }} weight="fill" />
              </div>
              <p className="text-xs font-bold" style={{ color: '#111827' }}>{s.name}</p>
              <p className="text-[10px] mb-2" style={{ color: '#9ca3af' }}>{s.type}</p>
              <span className="text-[10px] font-medium" style={{ color: s.color }}>{s.events}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Segments */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>User Segments</h3>
        <div className="grid grid-cols-3 gap-4">
          {SEGMENTS.map(seg => (
            <div key={seg.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${seg.color}15` }}>
                <Users size={18} style={{ color: seg.color }} weight="fill" />
              </div>
              <p className="text-xs font-bold mb-1" style={{ color: '#111827' }}>{seg.name}</p>
              <p className="text-[10px] mb-3" style={{ color: '#9ca3af' }}>{seg.description}</p>
              <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: `${Math.round(seg.count / totalUsers * 100)}%`, background: seg.color }} />
              </div>
              <span className="text-sm font-extrabold" style={{ color: seg.color }}>{seg.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CDP Features */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>CDP Platform Capabilities</h3>
        <div className="grid grid-cols-3 gap-4">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.name} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${f.color}15` }}>
                  <Icon size={18} style={{ color: f.color }} weight="fill" />
                </div>
                <p className="text-xs font-bold mb-1" style={{ color: '#111827' }}>{f.name}</p>
                <p className="text-[10px] mb-3" style={{ color: '#9ca3af' }}>{f.desc}</p>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  f.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{f.status.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
