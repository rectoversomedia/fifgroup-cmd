'use client';

import * as React from 'react';
import { FunnelChart, Funnel, LabelList, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, TrendUp, Crosshair, Rocket, UserCirclePlus, CheckCircle } from '@phosphor-icons/react';
import { getCDPJourneys, getUserSegments } from '@/lib/data-sim';
import { useRealtime } from '@/lib/use-realtime';

const JOURNEYS = [
  {
    id: 'new-user', name: 'New User Nurture',
    desc: 'Registered but no disbursement after 7 days — automated push sequence',
    icon: UserCirclePlus, color: '#4f8ef7', status: 'active',
    users: 12400, convRate: 18, potential: 'Rp 3.8B',
    trigger: 'kyc_approved + 7d no disbursement',
    steps: [
      { day: 0, action: 'Welcome push — Dapatkan dana pertama dalam 10 menit', sent: 12400, opened: 9920, conv: 0, openRate: 80 },
      { day: 7, action: 'Personalized promo — Bunga 0% untuk 7 hari pertama', sent: 12400, opened: 7440, conv: 892, openRate: 60 },
      { day: 14, action: 'Re-engagement — deadline reminder', sent: 11300, opened: 4520, conv: 560, openRate: 40 },
    ],
  },
  {
    id: 'cross-sell', name: 'Cross-Sell Single-LoB',
    desc: 'Users with 1 active LoB product — recommend second product',
    icon: Crosshair, color: '#8b5cf6', status: 'active',
    users: 34821, convRate: 8, potential: 'Rp 4.2B/mo',
    trigger: '1_lob + active_repayment + 60d_since_last_disbursement',
    steps: [
      { day: 0, action: 'Cross-sell offer — personalized to their LoB', sent: 34821, opened: 20892, conv: 0, openRate: 60 },
      { day: 3, action: 'Follow-up with success story testimonial', sent: 34821, opened: 13928, conv: 1393, openRate: 40 },
      { day: 7, action: 'Limited time bonus offer', sent: 31800, opened: 9540, conv: 636, openRate: 30 },
    ],
  },
  {
    id: 'bill-reminder', name: 'Smart Bill Reminder',
    desc: 'Automated repayment sequence — reduce NPL, improve collection',
    icon: CheckCircle, color: '#10b981', status: 'active',
    users: 45600, convRate: 94, potential: 'NPL -5pts',
    trigger: 'repayment_due_in_3_days',
    steps: [
      { day: -3, action: 'Day -3: Tagihan Rp XXX jatuh besok', sent: 45600, opened: 41040, conv: 41040, openRate: 90 },
      { day: -1, action: 'Day -1: Reminder + link to pay', sent: 45600, opened: 36480, conv: 34560, openRate: 80 },
      { day: 0, action: 'Day 0: Deadline alert — avoid late fee', sent: 45600, opened: 41040, conv: 41000, openRate: 90 },
    ],
  },
  {
    id: 'dormant', name: 'Dormant Re-Engagement',
    desc: 'No app activity > 30 days, no active loan — win them back',
    icon: Rocket, color: '#f97316', status: 'paused',
    users: 8920, convRate: 6, potential: 'Rp 890M',
    trigger: 'no_activity > 30d + active_loan = false',
    steps: [
      { day: 0, action: 'Kami rindu Anda — nostalgic message', sent: 8920, opened: 6244, conv: 0, openRate: 70 },
      { day: 15, action: 'Special dormant offer — Pinjaman Rp 500rb tanpa slip gaji', sent: 8920, opened: 3568, conv: 214, openRate: 40 },
      { day: 30, action: 'Final offer — only 3 days', sent: 8200, opened: 2460, conv: 164, openRate: 30 },
    ],
  },
  {
    id: 'post-disbursement', name: 'Post-Disbursement Delight',
    desc: 'Delight after disbursement — educate, cross-sell, retain',
    icon: Users, color: '#06b6d4', status: 'draft',
    users: 0, convRate: 0, potential: 'TBD',
    trigger: 'disbursement_completed',
    steps: [
      { day: 0, action: 'Day 0: Selamat! Dana sudah cair. Tips mengelola...', sent: 0, opened: 0, conv: 0, openRate: 0 },
      { day: 7, action: 'Day 7: Educational content — Cara bijak mengelola...', sent: 0, opened: 0, conv: 0, openRate: 0 },
      { day: 60, action: 'Day 60: Cross-sell offer triggers Cross-Sell journey', sent: 0, opened: 0, conv: 0, openRate: 0 },
    ],
  },
];

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export default function CustomerIntelligencePage() {
  const [selectedJourney, setSelectedJourney] = React.useState(JOURNEYS[0].id);
  const journey = JOURNEYS.find(j => j.id === selectedJourney)!;
  const Icon = journey.icon;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });

  // Build funnel chart data for selected journey
  const funnelData = journey.steps.map((step, i) => ({
    name: step.action.slice(0, 30) + '...',
    value: step.sent > 0 ? step.sent : journey.users,
    fill: journey.color,
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Customer Intelligence</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>CDP-powered user journeys & segments — Insider CDP · July 2026</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>·</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-emerald-50" style={{ color: '#059669' }}>4 Active</span>
        <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-amber-50" style={{ color: '#d97706' }}>1 Paused</span>
        <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-gray-100" style={{ color: '#6b7280' }}>1 Draft</span>
      </div>

      {/* User Segments */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>User Segments</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'New Users 0-30d', count: 28400, pct: 12, color: '#4f8ef7' },
            { label: 'Active Borrowers', count: 168000, pct: 72, color: '#10b981' },
            { label: 'Repeat Borrowers', count: 23400, pct: 10, color: '#8b5cf6' },
            { label: 'Dormant Users', count: 14200, pct: 6, color: '#f97316' },
          ].map(seg => (
            <div key={seg.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${seg.color}15` }}>
                <Users size={20} style={{ color: seg.color }} weight="fill" />
              </div>
              <p className="text-xl font-extrabold mb-1" style={{ color: '#111827' }}>{seg.count.toLocaleString()}</p>
              <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{seg.label}</p>
              <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-200 mb-1">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${seg.pct}%`, background: seg.color }} />
              </div>
              <span className="text-xs font-bold" style={{ color: seg.color }}>{seg.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Cards */}
      <div>
        <h2 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Automation Journeys</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {JOURNEYS.map(j => {
            const JIcon = j.icon;
            const isSelected = selectedJourney === j.id;
            return (
              <div
                key={j.id}
                onClick={() => setSelectedJourney(j.id)}
                className="rounded-2xl p-4 border cursor-pointer transition-all flex flex-col items-center text-center hover:shadow-sm"
                style={{
                  background: isSelected ? `${j.color}08` : 'white',
                  border: `1px solid ${isSelected ? j.color + '80' : '#e5e7eb'}`,
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${j.color}15` }}>
                  <JIcon size={18} style={{ color: j.color }} weight="fill" />
                </div>
                <p className="text-xs font-bold mb-0.5" style={{ color: '#111827' }}>{j.name}</p>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold mb-3 ${
                  j.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  j.status === 'paused' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>{j.status}</span>
                <div className="w-full space-y-1 mt-auto">
                  <div className="flex justify-between">
                    <span className="text-[10px]" style={{ color: '#9ca3af' }}>Users</span>
                    <span className="text-[10px] font-bold" style={{ color: '#374151' }}>{j.users > 0 ? j.users.toLocaleString() : '—'}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${j.convRate}%`, background: j.color }} />
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
      </div>

      {/* Selected Journey Detail */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${journey.color}40` }}>
        <div className="p-5 flex items-start gap-4 flex-wrap" style={{ background: `${journey.color}08`, borderBottom: `1px solid ${journey.color}20` }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${journey.color}15` }}>
            <Icon size={22} style={{ color: journey.color }} weight="fill" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h2 className="text-lg font-extrabold" style={{ color: '#111827' }}>{journey.name}</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                journey.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                journey.status === 'paused' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>{journey.status}</span>
            </div>
            <p className="text-xs" style={{ color: '#6b7280' }}>Impact: <strong style={{ color: '#10b981' }}>{journey.potential}</strong> · {journey.desc}</p>
          </div>
          <div className="flex gap-6 flex-wrap">
            {[
              { label: 'Users In', value: journey.users > 0 ? journey.users.toLocaleString() : '—' },
              { label: 'Conversions', value: journey.convRate > 0 ? `${Math.round(journey.users * journey.convRate / 100).toLocaleString()}` : '—' },
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
          <div className="p-3 rounded-xl text-[11px] mb-5 font-mono" style={{ background: '#f9fafb', border: '1px solid #f3f4f6', color: '#4f8ef7' }}>
            Trigger: {journey.trigger}
          </div>
          <div className="space-y-3">
            {journey.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: journey.color }}>{i + 1}</div>
                  {i < journey.steps.length - 1 && <div className="w-px flex-1 my-1 bg-gray-200" />}
                </div>
                <div className="flex-1 p-4 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#111827' }}>{step.action}</p>
                  {step.sent > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Sent', value: step.sent },
                        { label: 'Opened', value: step.opened },
                        { label: 'Converted', value: step.conv },
                      ].map(s => (
                        <div key={s.label} className="text-center">
                          <p className="text-xs font-bold" style={{ color: '#111827' }}>{s.value.toLocaleString()}</p>
                          <p className="text-[10px]" style={{ color: '#9ca3af' }}>{s.label}</p>
                        </div>
                      ))}
                      <div className="text-center">
                        <p className="text-xs font-bold" style={{ color: '#10b981' }}>{step.openRate}%</p>
                        <p className="text-[10px]" style={{ color: '#9ca3af' }}>Open Rate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
