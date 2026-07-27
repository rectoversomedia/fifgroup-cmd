'use client';

import * as React from 'react';
import { Lightning, Users, ChartBar, Gear, Database, Brain, Warning, TrendUp, TrendDown, CheckCircle } from '@phosphor-icons/react';

const JOURNEYS = [
  {
    id: 'new-user', name: 'New User Nurture',
    desc: 'Registered but no disbursement after 7 days — automated push sequence',
    icon: 'UserCirclePlus', color: '#4f8ef7', status: 'active',
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
    icon: 'Crosshair', color: '#8b5cf6', status: 'active',
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
    icon: 'CheckCircle', color: '#10b981', status: 'active',
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
    icon: 'Rocket', color: '#f97316', status: 'paused',
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
    icon: 'Lightning', color: '#06b6d4', status: 'draft',
    users: 0, convRate: 0, potential: 'TBD',
    trigger: 'disbursement_completed',
    steps: [
      { day: 0, action: 'Day 0: Selamat! Dana sudah cair. Tips mengelola...', sent: 0, opened: 0, conv: 0, openRate: 0 },
      { day: 7, action: 'Day 7: Educational content — Cara bijak mengelola...', sent: 0, opened: 0, conv: 0, openRate: 0 },
      { day: 60, action: 'Day 60: Cross-sell offer triggers Cross-Sell journey', sent: 0, opened: 0, conv: 0, openRate: 0 },
    ],
  },
];

const SEGMENTS = [
  { id: 'new_users', name: 'New Users (0-30d)', count: 28400, color: '#4f8ef7', description: 'Registered within last 30 days, no disbursement yet' },
  { id: 'active_borrowers', name: 'Active Borrowers', count: 168000, color: '#10b981', description: 'Currently have an active loan in repayment' },
  { id: 'repeat_borrowers', name: 'Repeat Borrowers', count: 23400, color: '#8b5cf6', description: 'Completed at least 1 loan, eligible for next disbursement' },
  { id: 'dormant_users', name: 'Dormant Users', count: 14200, color: '#f97316', description: 'No activity in > 30 days, no active loan' },
  { id: 'cross_sell_target', name: 'Cross-Sell Target', count: 34821, color: '#06b6d4', description: 'Single LoB active + 60d since last disbursement' },
  { id: 'high_value', name: 'High Value Users', count: 12400, color: '#f59e0b', description: 'LTV > Rp 5M, repayment rate > 95%' },
];

const CDP_FEATURES = [
  { icon: Users, name: 'User Identification', status: 'active', desc: 'Track anonymous → identified user journey across devices', color: '#10b981' },
  { icon: Database, name: 'Unified Profile', status: 'active', desc: 'Single profile per user across all LoBs and touchpoints', color: '#10b981' },
  { icon: ChartBar, name: 'Event Tracking', status: 'active', desc: 'Real-time event pipeline: app_opened, kyc_completed, disbursement_completed', color: '#10b981' },
  { icon: Gear, name: 'Journey Orchestration', status: 'active', desc: '5 active journeys: New User, Cross-Sell, Bill Reminder, Dormant, Post-Disburse', color: '#10b981' },
  { icon: Lightning, name: 'Real-Time Triggers', status: 'active', desc: 'Event-based triggers: 7 days KYC, repayment_due -3, dormancy 30d+', color: '#10b981' },
  { icon: Brain, name: 'Predictive Scoring', status: 'beta', desc: 'NPL risk scoring, churn prediction, LTV scoring (beta)', color: '#f59e0b' },
];

const AI_INSIGHTS = [
  {
    id: 'ins-1', icon: TrendDown, color: '#dc2626',
    priority: 'high', type: 'funnel',
    title: 'SPEKTRA: 62% Drop-off at Document Upload Stage',
    finding: 'Of 31,200 users who started SPEKTRA application, 19,400 (62%) dropped off during document upload. Top rejected document: selfie with ID.',
    rootCause: 'Selfie quality requirements unclear. Users unaware of acceptable photo format. Average 2.3 attempts per user.',
    confidence: 'high', basedOn: '31,200 application_started events, 19,400 document_upload_failed events',
    apps: null, lobs: ['SPEKTRA'],
  },
  {
    id: 'ins-2', icon: TrendUp, color: '#10b981',
    priority: 'high', type: 'engagement',
    title: 'Cross-Sell Opportunity: 34K Single-LoB Users',
    finding: '34,821 FIFGO users have only 1 LoB product active. Best cross-sell pair: FIFASTRA → DANASTRA (42% natural fit based on loan purpose overlap).',
    rootCause: 'No proactive cross-sell nudge at key moments. App lacks "You might also like" prompts after first loan completion.',
    confidence: 'high', basedOn: '34,821 users with 1 LoB product, cohort analysis of multi-product users',
    apps: ['FIFGO'], lobs: ['FIFASTRA', 'DANASTRA'],
  },
  {
    id: 'ins-3', icon: Warning, color: '#d97706',
    priority: 'medium', type: 'retention',
    title: 'SPEKTRA Month-2 Retention 52% — Below 60% Benchmark',
    finding: 'SPEKTRA cohort Month-2 retention is 52%, 8 points below the 60% benchmark. 71% of churned users had disbursement delay >5 days.',
    rootCause: 'SPEKTRA disbursement SLA averaging 4.8 days vs 3.2 days for FIFASTRA. Users switch to faster alternatives.',
    confidence: 'high', basedOn: 'Cohort analysis of 12,400 SPEKTRA disbursed users',
    apps: null, lobs: ['SPEKTRA'],
  },
  {
    id: 'ins-4', icon: Lightning, color: '#4f8ef7',
    priority: 'medium', type: 'hybrid',
    title: 'KYC Document Rejection Causing 18% of Branch Visits',
    finding: '18% of users who visited branch after app start were rejected for KYC documents — primarily due to selfie quality issues. Add in-app validation could eliminate 60% of these visits.',
    rootCause: 'No real-time selfie quality check before submission. Users only discover rejection after arriving at branch.',
    confidence: 'high', basedOn: '8,432 branch_locator_viewed events, 1,520 branch_visit_triggered with KYC reason',
    apps: ['FIFGO'], lobs: null,
  },
  {
    id: 'ins-5', icon: TrendUp, color: '#10b981',
    priority: 'info', type: 'aso',
    title: 'FIFGO ASO Momentum: +23% Downloads, #1 Category Rank',
    finding: 'FIFGO downloads up 23% WoW driven by improved Finance category ranking. Moved from #2 to #1 position. Screenshot update from Q2 was effective.',
    rootCause: 'Updated screenshots with benefit-focused messaging and keyword placement. 8 new keywords ranked in top 10.',
    confidence: 'high', basedOn: 'AppTweak download tracking, category ranking API, 8-week trend',
    apps: ['FIFGO'], lobs: null,
  },
];

const ICON_MAP: Record<string, any> = {
  UserCirclePlus: Users, Crosshair: TrendUp, CheckCircle, Lightning, Rocket: Lightning,
};

type Tab = 'overview' | 'journeys' | 'segments' | 'hybrid' | 'ai';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'journeys', label: 'Journeys' },
  { id: 'segments', label: 'Segments' },
  { id: 'hybrid', label: 'Hybrid Channel' },
  { id: 'ai', label: 'AI Insights' },
];

export default function CDPPage() {
  const [tab, setTab] = React.useState<Tab>('overview');
  const [selectedJourney, setSelectedJourney] = React.useState('new-user');
  const journey = JOURNEYS.find(j => j.id === selectedJourney)!;
  const totalUsers = SEGMENTS.reduce((s, seg) => s + seg.count, 0);
  const totalActive = JOURNEYS.filter(j => j.status === 'active').length;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>CDP & Journeys</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Customer Data Platform — journeys, segments & AI insights · July 2026</p>
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
        <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-emerald-50" style={{ color: '#059669' }}>{totalActive} Active</span>
        <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-amber-50" style={{ color: '#d97706' }}>1 Paused</span>
        <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-blue-50" style={{ color: '#1d4ed8' }}>1 Draft</span>
        <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-gray-100" style={{ color: '#6b7280' }}>{totalUsers.toLocaleString()} Total Users</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0"
            style={tab === t.id
              ? { background: '#6366f1', color: '#fff' }
              : { background: 'transparent', color: '#6b7280' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, label: 'Total Known Users', value: totalUsers.toLocaleString(), color: '#4f8ef7' },
              { icon: Lightning, label: 'Active Journeys', value: `${totalActive}/5`, color: '#10b981' },
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

          {/* CDP Features */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>CDP Platform Capabilities</h3>
            <div className="grid grid-cols-3 gap-4">
              {CDP_FEATURES.map(f => {
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
      )}

      {/* ─── JOURNEYS TAB ─── */}
      {tab === 'journeys' && (
        <div className="space-y-5">
          {/* Journey Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {JOURNEYS.map(j => {
              const JIcon = ICON_MAP[j.icon] || Users;
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
            <div className="p-5 flex items-start gap-4 flex-wrap" style={{ background: `${journey.color}08`, borderBottom: `1px solid ${journey.color}20` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${journey.color}15` }}>
                {(ICON_MAP[journey.icon] || Users).render
                  ? React.createElement(ICON_MAP[journey.icon] || Users, { size: 22, style: { color: journey.color }, weight: 'fill' })
                  : <Users size={22} style={{ color: journey.color }} weight="fill" />
                }
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
      )}

      {/* ─── SEGMENTS TAB ─── */}
      {tab === 'segments' && (
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
      )}

      {/* ─── HYBRID CHANNEL TAB ─── */}
      {tab === 'hybrid' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Omnichannel Integration Map</h3>
          <div className="space-y-4">
            {[
              { segment: 'New Users (0-30d)', count: 28400, channels: ['Push', 'In-App', 'Email'], priority: 'high', color: '#4f8ef7' },
              { segment: 'Active Borrowers', count: 168000, channels: ['Push', 'SMS', 'In-App'], priority: 'high', color: '#10b981' },
              { segment: 'Repeat Borrowers', count: 23400, channels: ['Push', 'In-App', 'Branch'], priority: 'medium', color: '#8b5cf6' },
              { segment: 'Cross-Sell Target', count: 34821, channels: ['In-App', 'Push', 'SMS'], priority: 'high', color: '#06b6d4' },
              { segment: 'Dormant Users', count: 14200, channels: ['SMS', 'Email', 'Push'], priority: 'medium', color: '#f97316' },
              { segment: 'High Value Users', count: 12400, channels: ['In-App', 'Push', 'Branch'], priority: 'low', color: '#f59e0b' },
            ].map(seg => (
              <div key={seg.segment} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
                <div className="w-40 shrink-0">
                  <p className="text-xs font-bold" style={{ color: '#111827' }}>{seg.segment}</p>
                  <p className="text-[10px]" style={{ color: '#9ca3af' }}>{seg.count.toLocaleString()} users</p>
                </div>
                <div className="flex-1 flex gap-2 flex-wrap">
                  {seg.channels.map(ch => (
                    <span key={ch} className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: `${seg.color}15`, color: seg.color }}>{ch}</span>
                  ))}
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                  seg.priority === 'high' ? 'bg-red-100 text-red-700' :
                  seg.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                }`}>{seg.priority.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── AI INSIGHTS TAB ─── */}
      {tab === 'ai' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="rounded-2xl p-5 bg-white border border-gray-200">
            <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
              <span className="font-bold" style={{ color: '#dc2626' }}>5 AI insights</span> generated this period.{' '}
              <span className="font-bold" style={{ color: '#10b981' }}>2 high priority actions</span> require immediate attention.{' '}
              Main opportunity: <span style={{ color: '#4f8ef7' }}>SPEKTRA document upload simplification</span> — potential +2,100 applications/month.
            </p>
          </div>

          {AI_INSIGHTS.map(insight => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${insight.color}15` }}>
                    <Icon size={20} style={{ color: insight.color }} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
                        style={{ background: insight.priority === 'high' ? '#fef2f2' : '#fffbeb', color: insight.priority === 'high' ? '#dc2626' : '#d97706' }}>
                        {insight.priority}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{insight.type}</span>
                      {insight.apps?.map(a => (
                        <span key={a} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#eff6ff', color: '#4f8ef7' }}>{a.toUpperCase()}</span>
                      ))}
                      {insight.lobs?.map(l => (
                        <span key={l} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>{l}</span>
                      ))}
                    </div>
                    <h3 className="text-sm font-bold mb-2" style={{ color: '#111827' }}>{insight.title}</h3>
                    <p className="text-xs mb-3 leading-relaxed" style={{ color: '#6b7280' }}>{insight.finding}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Root Cause</p>
                        <p className="text-xs" style={{ color: '#374151' }}>{insight.rootCause}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>Based On</p>
                        <p className="text-xs" style={{ color: '#374151' }}>{insight.basedOn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
                      <CheckCircle size={12} style={{ color: '#10b981' }} weight="fill" />
                      <span className="text-[11px]" style={{ color: '#9ca3af' }}>AI Confidence: <strong style={{ color: '#10b981' }}>{insight.confidence}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
