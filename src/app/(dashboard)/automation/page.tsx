'use client';

import * as React from 'react';
import { Lightning, Users, CheckCircle, TrendUp } from '@phosphor-icons/react';

const JOURNEYS = [
  { id: 'new-user', name: 'New User Nurture', color: '#4f8ef7', status: 'active', icon: 'UserCirclePlus', usersIn: 12400, convRate: 18 },
  { id: 'cross-sell', name: 'Cross-Sell Single-LoB', color: '#8b5cf6', status: 'active', icon: 'Crosshair', usersIn: 34821, convRate: 8 },
  { id: 'bill-reminder', name: 'Smart Bill Reminder', color: '#10b981', status: 'active', icon: 'CheckCircle', usersIn: 45600, convRate: 94 },
  { id: 'dormant', name: 'Dormant Re-Engagement', color: '#f97316', status: 'paused', icon: 'Lightning', usersIn: 8920, convRate: 6 },
  { id: 'post-disbursement', name: 'Post-Disbursement Delight', color: '#06b6d4', status: 'draft', icon: 'Rocket', usersIn: 0, convRate: 0 },
];

const performance = {
  'new-user': [
    { label: 'Day 0 — Welcome Push', sent: 12400, opened: 9920, converted: 0, openRate: 80 },
    { label: 'Day 7 — Promo Offer', sent: 12400, opened: 7440, converted: 892, openRate: 60 },
    { label: 'Day 14 — Final Reminder', sent: 11300, opened: 4520, converted: 560, openRate: 40 },
  ],
  'cross-sell': [
    { label: 'Day 0 — Cross-Sell Offer', sent: 34821, opened: 20892, converted: 0, openRate: 60 },
    { label: 'Day 3 — Follow-Up', sent: 34821, opened: 13928, converted: 1393, openRate: 40 },
    { label: 'Day 7 — Limited Bonus', sent: 31800, opened: 9540, converted: 636, openRate: 30 },
  ],
  'bill-reminder': [
    { label: 'Day -3 — First Reminder', sent: 45600, opened: 41040, converted: 41040, openRate: 90 },
    { label: 'Day -1 — Deadline Alert', sent: 45600, opened: 36480, converted: 34560, openRate: 80 },
    { label: 'Day 0 — Final Notice', sent: 45600, opened: 41040, converted: 42000, openRate: 90 },
  ],
  dormant: [
    { label: 'Day 0 — Nostalgic Message', sent: 8920, opened: 6244, converted: 0, openRate: 70 },
    { label: 'Day 15 — Special Offer', sent: 8920, opened: 3568, converted: 214, openRate: 40 },
    { label: 'Day 30 — Final Offer', sent: 8200, opened: 2460, converted: 164, openRate: 30 },
  ],
  'post-disbursement': [],
};

export default function AutomationPage() {
  const [selected, setSelected] = React.useState('new-user');
  const journey = JOURNEYS.find(j => j.id === selected)!;
  const steps = performance[selected as keyof typeof performance] || [];
  const totalActive = JOURNEYS.filter(j => j.status === 'active').length;
  const totalUsers = JOURNEYS.reduce((s, j) => s + j.usersIn, 0);

  const icons: Record<string, any> = { UserCirclePlus: Users, Crosshair: TrendUp, CheckCircle, Lightning, Rocket: Lightning };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Automation Pipeline</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>CDP journey management — July 2026</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-emerald-50" style={{ color: '#059669' }}>{totalActive} Active</span>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-amber-50" style={{ color: '#d97706' }}>1 Paused</span>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-blue-50" style={{ color: '#1d4ed8' }}>1 Draft</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { icon: Users, label: 'Total Users in Journeys', value: totalUsers.toLocaleString(), color: '#4f8ef7' },
          { icon: CheckCircle, label: 'Active Journeys', value: `${totalActive}/5`, color: '#10b981' },
          { icon: TrendUp, label: 'Avg Conversion Rate', value: '39%', color: '#8b5cf6' },
          { icon: Lightning, label: 'Bill Reminder Success', value: '94%', color: '#f97316' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <m.icon size={20} style={{ color: m.color }} weight="fill" className="mb-3" />
            <p className="text-2xl font-extrabold mb-1" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Journey Pipeline */}
      <div className="grid grid-cols-5 gap-3">
        {JOURNEYS.map(j => {
          const isSelected = selected === j.id;
          const Icon = icons[j.icon] || Users;
          return (
            <div
              key={j.id}
              onClick={() => setSelected(j.id)}
              className="rounded-2xl p-4 border cursor-pointer transition-all flex flex-col items-center text-center"
              style={{
                background: isSelected ? `${j.color}08` : 'white',
                border: `1px solid ${isSelected ? j.color + '80' : '#e5e7eb'}`,
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${j.color}15` }}>
                <Icon size={20} style={{ color: j.color }} weight="fill" />
              </div>
              <p className="text-xs font-bold mb-0.5" style={{ color: '#111827' }}>{j.name}</p>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold mb-3 ${
                j.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                j.status === 'paused' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>{j.status}</span>
              <div className="w-full space-y-1.5 mt-auto">
                <div className="flex justify-between">
                  <span className="text-[10px]" style={{ color: '#9ca3af' }}>Users</span>
                  <span className="text-[10px] font-bold" style={{ color: '#374151' }}>{j.usersIn > 0 ? j.usersIn.toLocaleString() : '—'}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${j.convRate}%`, background: j.color }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px]" style={{ color: '#9ca3af' }}>Conv.</span>
                  <span className="text-[10px] font-bold" style={{ color: j.color }}>{j.convRate > 0 ? `${j.convRate}%` : '—'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Journey Detail */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${journey.color}40` }}>
        <div className="p-5 flex items-center gap-4" style={{ background: `${journey.color}08`, borderBottom: `1px solid ${journey.color}20` }}>
          {(() => { const Icon = icons[journey.icon] || Users; return (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${journey.color}15` }}>
              <Icon size={22} style={{ color: journey.color }} weight="fill" />
            </div>
          ); })()}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-lg font-extrabold" style={{ color: '#111827' }}>{journey.name}</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                journey.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                journey.status === 'paused' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>{journey.status.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex gap-6">
            {[
              { label: 'Users In', value: journey.usersIn > 0 ? journey.usersIn.toLocaleString() : '—' },
              { label: 'Conversions', value: journey.usersIn > 0 ? (Math.round(journey.usersIn * journey.convRate / 100)).toLocaleString() : '—' },
              { label: 'Conv. Rate', value: journey.convRate > 0 ? `${journey.convRate}%` : '—' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <p className="text-lg font-extrabold" style={{ color: '#111827' }}>{m.value}</p>
                <p className="text-[10px]" style={{ color: '#9ca3af' }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          {steps.length > 0 ? (
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: journey.color }}>{i + 1}</div>
                    {i < steps.length - 1 && <div className="w-px flex-1 my-1 bg-gray-200" />}
                  </div>
                  <div className="flex-1 p-4 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#111827' }}>{step.label}</p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <p className="text-xs font-bold" style={{ color: '#111827' }}>{step.sent.toLocaleString()}</p>
                        <p className="text-[10px]" style={{ color: '#9ca3af' }}>Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold" style={{ color: '#111827' }}>{step.opened.toLocaleString()}</p>
                        <p className="text-[10px]" style={{ color: '#9ca3af' }}>Opened ({step.openRate}%)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold" style={{ color: '#10b981' }}>{step.converted > 0 ? step.converted.toLocaleString() : '—'}</p>
                        <p className="text-[10px]" style={{ color: '#9ca3af' }}>Converted</p>
                      </div>
                      <div className="text-center">
                        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${step.openRate}%`, background: journey.color }} />
                        </div>
                        <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>Open Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: '#9ca3af' }}>Journey is in draft — configure steps before activating</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
