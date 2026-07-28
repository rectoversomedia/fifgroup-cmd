'use client';

import * as React from 'react';
import { Lightning, Users, ChartBar, Gear, Database, Brain, Warning, TrendUp, TrendDown, CheckCircle, MagnifyingGlass, ChatCircle, Bell, Envelope, DeviceMobile, PaperPlaneTilt } from '@phosphor-icons/react';

const LOB_LOGOS: Record<string, string> = {
  FIFASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FIFASTRA-1780538519035.png',
  SPEKTRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20SPEKTRA-1780538544863.png',
  DANASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20DANASTRA-1780538584771.png',
  FINATRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FINATRA-1780538626287.png',
  AMITRA:   'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20AMITRA-1780538604037.png',
};

type ActionStep = { step: number; status: 'pending' | 'sending' | 'done' | 'error'; label: string; detail: string; time?: string };

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

type Tab = 'overview' | 'journeys' | 'segments' | 'hybrid' | 'ai' | 'identity';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'journeys', label: 'Journeys' },
  { id: 'segments', label: 'Segments' },
  { id: 'hybrid', label: 'Hybrid Channel' },
  { id: 'ai', label: 'AI Insights' },
  { id: 'identity', label: 'Identity Resolution' },
];

export default function CDPPage() {
  const [tab, setTab] = React.useState<Tab>('overview');
  const [selectedJourney, setSelectedJourney] = React.useState('new-user');
  const [timeStr, setTimeStr] = React.useState('--:--');
  const journey = JOURNEYS.find(j => j.id === selectedJourney)!;
  const totalUsers = SEGMENTS.reduce((s, seg) => s + seg.count, 0);
  const totalActive = JOURNEYS.filter(j => j.status === 'active').length;

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

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

      {/* ─── IDENTITY RESOLUTION TAB ─── */}
      {tab === 'identity' && <IdentityResolutionTab />}
    </div>
  );
}

type IdentityMatch = {
  id: string; name: string; birthDate?: string; occupation?: string; city?: string;
  identifiers: { phone: string; email: string; ip?: string; deviceId?: string; ktp?: string };
  devices: { id: string; type: 'mobile' | 'desktop'; os: string; lastSeen?: string }[];
  events: { id: string; type: string; timestamp: string; channel: string; location: string; source: string; detail: string; color: string; metadata?: Record<string, unknown> }[];
  lobs: { name: string; color: string; since: string; loans: number; totalDisbursed: number }[];
  totalDisbursed: number; riskLevel: string; matchType: string; confidence: number;
  // Extended: loan & application history
  loans: {
    id: string; lob: string; lobColor: string; logo: string; status: 'active' | 'completed' | 'rejected' | 'pending' | 'dormant';
    product: string; amount: number; tenor: number; interestRate: number;
    disbursedAt: string; completedAt?: string; monthlyInstallment: number;
    repaymentRate: number; outstanding: number; purpose: string;
    history: { date: string; type: 'payment' | 'inquiry' | 'late' | 'escalation'; amount: number; note: string }[];
  }[];
  nextPayment?: { dueDate: string; amount: number; status: 'ontime' | 'upcoming' | 'overdue' };
  churnRisk: 'low' | 'medium' | 'high';
  lastDisbursedAt?: string;
  gapDays?: number; // days since last disbursement
  availableProducts: { name: string; reason: string; color: string; score: number }[];
  communicationPrefs: { whatsapp: boolean; sms: boolean; email: boolean; push: boolean };
};

const SAMPLE_PROFILES: IdentityMatch[] = [
  {
    id: 'uid-001-72cd', name: 'Budi Santoso',
    birthDate: '1988-04-15', occupation: 'Wiraswasta', city: 'Jakarta Selatan',
    identifiers: { phone: '0812-3456-7890', email: 'budi.santoso@gmail.com', ip: '36.72.192.14', deviceId: 'android:a1b2c3d4e5f6', ktp: '3174-880415-0001' },
    devices: [
      { id: 'android:a1b2c3d4e5f6', type: 'mobile', os: 'Android 13', lastSeen: '2h ago' },
      { id: 'ios:9f8e7d6c5b4a', type: 'mobile', os: 'iOS 17', lastSeen: '3d ago' },
    ],
    events: [
      { id: 'e1', type: 'app_opened', timestamp: '2026-07-27 09:14', channel: 'FIFGO App', location: 'Jakarta Selatan', source: 'FIFGO', detail: 'User opened FIFGO app and browsed FIFASTRA product page', color: '#10b981', metadata: { 'session_duration': '4m 22s', 'device': 'Android 13' } },
      { id: 'e2', type: 'inquiry_submitted', timestamp: '2026-07-27 09:28', channel: 'FIFGO App', location: 'Jakarta Selatan', source: 'FIFGO', detail: 'Submitted FIFASTRA inquiry — Rp 15,000,000, tenor 24 months', color: '#4f8ef7', metadata: { 'product': 'FIFASTRA', 'amount': 'Rp 15,000,000' } },
      { id: 'e3', type: 'kyc_started', timestamp: '2026-07-27 09:35', channel: 'FIFGO App', location: 'Jakarta Selatan', source: 'FIFGO', detail: 'KYC started — ID card verified via e-KYC', color: '#8b5cf6', metadata: { 'kyc_method': 'e-KYC', 'id_type': 'KTP' } },
      { id: 'e4', type: 'branch_visit', timestamp: '2026-07-25 14:00', channel: 'Branch', location: 'Jakarta', source: 'Branch CRM', detail: 'Visited FIFGROUP branch — submitted documents for SPEKTRA application', color: '#f59e0b', metadata: { 'branch': 'Cabang Kebayoran', 'purpose': 'document_submission' } },
      { id: 'e5', type: 'push_received', timestamp: '2026-07-20 10:00', channel: 'Push', location: 'Unknown', source: 'Marketing Cloud', detail: 'Received cross-sell push for FIFADA — 0% interest promo', color: '#f97316', metadata: { 'campaign': 'FIFADA Launch', 'open_rate': 'Yes' } },
      { id: 'e6', type: 'loan_disbursed', timestamp: '2026-03-10 11:30', channel: 'Branch', location: 'Jakarta', source: 'Branch CRM', detail: 'FIFASTRA disbursement completed — Rp 12,000,000', color: '#10b981', metadata: { 'product': 'FIFASTRA', 'amount': 'Rp 12,000,000', 'tenor': '24 months' } },
    ],
    lobs: [
      { name: 'FIFASTRA', color: '#dc2626', since: 'Mar 2026', loans: 1, totalDisbursed: 12000000 },
      { name: 'SPEKTRA', color: '#8b5cf6', since: 'Jul 2026', loans: 0, totalDisbursed: 0 },
    ],
    totalDisbursed: 12000000, riskLevel: 'Low Risk', matchType: 'phone + device_fingerprint', confidence: 0.98,
    lastDisbursedAt: '2026-03-10', gapDays: 139,
    churnRisk: 'medium',
    nextPayment: { dueDate: '2026-08-10', amount: 618000, status: 'upcoming' },
    loans: [
      {
        id: 'FIF-LN-001234', lob: 'FIFASTRA', lobColor: '#dc2626',
        logo: LOB_LOGOS['FIFASTRA'],
        status: 'active',
        product: 'FIFASTRA', amount: 12000000, tenor: 24, interestRate: 18,
        disbursedAt: '2026-03-10', monthlyInstallment: 618000, repaymentRate: 100, outstanding: 9900000,
        purpose: 'Pembelian motor bekas',
        history: [
          { date: '2026-03-10', type: 'payment', amount: 0, note: 'Disbursement' },
          { date: '2026-04-10', type: 'payment', amount: 618000, note: 'Angsuran bulan 1 — on time' },
          { date: '2026-05-10', type: 'payment', amount: 618000, note: 'Angsuran bulan 2 — on time' },
          { date: '2026-06-10', type: 'payment', amount: 618000, note: 'Angsuran bulan 3 — on time' },
          { date: '2026-07-10', type: 'payment', amount: 618000, note: 'Angsuran bulan 4 — on time' },
        ],
      },
    ],
    availableProducts: [
      { name: 'DANASTRA', reason: 'Motor lama miliknya sudah 7 tahun — cocok refinance atau upgrade', color: '#f59e0b', score: 88 },
      { name: 'FINATRA', reason: 'Wiraswasta — eligible untuk modal usaha mikro', color: '#059669', score: 72 },
      { name: 'AMITRA', reason: 'Tabungan pendidikan anak — eligible, ada program khusus', color: '#ec4899', score: 65 },
    ],
    communicationPrefs: { whatsapp: true, sms: true, email: true, push: true },
  },
  {
    id: 'uid-002-93ab', name: 'Siti Rahayu',
    birthDate: '1995-11-22', occupation: 'Karyawan Swasta', city: 'Bandung',
    identifiers: { phone: '0857-8765-4321', email: 'siti.rahayu@yahoo.com', ip: '114.4.78.201', deviceId: 'ios:9z8y7x6w5v4u' },
    devices: [{ id: 'ios:9z8y7x6w5v4u', type: 'mobile', os: 'iOS 16', lastSeen: '1d ago' }],
    events: [
      { id: 'e1', type: 'app_downloaded', timestamp: '2026-07-26 16:40', channel: 'App Store', location: 'Bandung', source: 'FIFGO', detail: 'FIFGO app downloaded from App Store', color: '#4f8ef7', metadata: { 'source': 'App Store Search', 'keyword': 'pinjaman online' } },
      { id: 'e2', type: 'registration_completed', timestamp: '2026-07-26 16:55', channel: 'FIFGO App', location: 'Bandung', source: 'FIFGO', detail: 'Account registered — phone + email verified', color: '#10b981' },
      { id: 'e3', type: 'sms_received', timestamp: '2026-07-26 17:00', channel: 'SMS', location: 'Bandung', source: 'Marketing Cloud', detail: 'OTP SMS sent and verified successfully', color: '#f97316' },
    ],
    lobs: [],
    totalDisbursed: 0, riskLevel: 'New User', matchType: 'email_domain', confidence: 0.72,
    churnRisk: 'low',
    loans: [],
    availableProducts: [
      { name: 'SPEKTRA', reason: 'Baru pertama kali — produk mikro tanpa agunan, proses 100% digital', color: '#8b5cf6', score: 94 },
      { name: 'FIFASTRA', reason: 'Karyawan swasta dengan slip gaji — eligible untuk FIFASTRA Gaji', color: '#dc2626', score: 81 },
    ],
    communicationPrefs: { whatsapp: true, sms: false, email: true, push: true },
  },
  {
    id: 'uid-003-41ef', name: 'Ahmad Wijaya',
    birthDate: '1982-07-08', occupation: 'Pengusaha Toko Elektronik', city: 'Surabaya',
    identifiers: { phone: '0813-9876-1234', email: 'ahmad.wijaya@ptmniatama.co.id', ip: '202.62.16.88', deviceId: 'android:q1r2s3t4u5v' },
    devices: [
      { id: 'android:q1r2s3t4u5v', type: 'mobile', os: 'Android 12', lastSeen: '30m ago' },
      { id: 'desktop:win-xyz', type: 'desktop', os: 'Windows 11 / Chrome', lastSeen: '2h ago' },
    ],
    events: [
      { id: 'e1', type: 'web_visited', timestamp: '2026-07-27 08:00', channel: 'Website', location: 'Surabaya', source: 'Website', detail: 'Visited FIFGROUP website — browsed FINATRA product page', color: '#4f8ef7', metadata: { 'page': '/products/finatra', 'duration': '3m 10s' } },
      { id: 'e2', type: 'form_submitted', timestamp: '2026-07-27 08:15', channel: 'Website', location: 'Surabaya', source: 'Website', detail: 'Submitted lead form for FINATRA — Rp 50,000,000', color: '#8b5cf6', metadata: { 'product': 'FINATRA', 'amount': 'Rp 50,000,000' } },
      { id: 'e3', type: 'call_initiated', timestamp: '2026-07-27 08:20', channel: 'Phone', location: 'Surabaya', source: 'Website', detail: 'Clicked "hubungi kami" — call initiated from website', color: '#10b981' },
      { id: 'e4', type: 'app_downloaded', timestamp: '2026-07-27 09:00', channel: 'App Store', location: 'Surabaya', source: 'FIFGO', detail: 'FIFGO app downloaded after web visit', color: '#4f8ef7' },
      { id: 'e5', type: 'whatsapp_clicked', timestamp: '2026-07-27 09:05', channel: 'WhatsApp', location: 'Surabaya', source: 'Website', detail: 'Clicked WhatsApp CTA on landing page', color: '#f97316', metadata: { 'campaign': 'FINATRA Launch' } },
    ],
    lobs: [
      { name: 'FINATRA', color: '#059669', since: '—', loans: 0, totalDisbursed: 0 },
    ],
    totalDisbursed: 0, riskLevel: 'Lead', matchType: 'ip + email_domain', confidence: 0.85,
    churnRisk: 'low',
    loans: [
      {
        id: 'FIN-INQ-001', lob: 'FINATRA', lobColor: '#059669',
        logo: LOB_LOGOS['FINATRA'],
        status: 'pending',
        product: 'FINATRA', amount: 50000000, tenor: 36, interestRate: 24,
        disbursedAt: '', monthlyInstallment: 0, repaymentRate: 0, outstanding: 0,
        purpose: 'Modal toko elektronik',
        history: [
          { date: '2026-07-27 08:15', type: 'inquiry', amount: 50000000, note: 'Form submitted via website' },
          { date: '2026-07-27 08:20', type: 'inquiry', amount: 0, note: 'Phone call initiated — interested in 36-month tenor' },
        ],
      },
    ],
    availableProducts: [
      { name: 'FINATRA', reason: 'Pengusaha dengan omzet toko — eligible untuk modal kerja Rp 25-200 juta', color: '#059669', score: 97 },
      { name: 'DANASTRA', reason: 'Pemilik aset — eligible refinance kendaraan untuk tambahan working capital', color: '#f59e0b', score: 74 },
    ],
    communicationPrefs: { whatsapp: true, sms: true, email: true, push: false },
  },
];

function resolveIdentity(query: string): IdentityMatch | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  for (const p of SAMPLE_PROFILES) {
    if (
      p.name.toLowerCase().includes(q) ||
      p.identifiers.phone.replace(/-/g, '').includes(q.replace(/-/g, '')) ||
      p.identifiers.email.toLowerCase().includes(q) ||
      p.identifiers.ip?.includes(q) ||
      p.identifiers.deviceId?.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    ) return p;
  }
  return null;
}

function IdentityResolutionTab() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<IdentityMatch[] | null>(null);
  const [selected, setSelected] = React.useState<IdentityMatch | null>(null);
  const [loading, setLoading] = React.useState(false);

  const doSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    setSelected(null);
    setTimeout(() => {
      const match = resolveIdentity(query);
      setResults(match ? [match] : []);
      if (match) setSelected(match);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Search by Any Identifier</h3>
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Name, phone, email, IP address, or device ID..."
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ background: '#f9fafb' }}
            />
          </div>
          <button
            onClick={doSearch}
            disabled={loading}
            className="px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all"
            style={{ background: loading ? '#9ca3af' : '#6366f1' }}
          >
            {loading ? 'Searching...' : 'Resolve Identity'}
          </button>
        </div>
        {/* Quick filters */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { label: 'By Name', example: 'Budi Santoso' },
            { label: 'By Phone', example: '0812-3456-7890' },
            { label: 'By Email', example: 'ahmad.wijaya@ptmniatama.co.id' },
            { label: 'By IP', example: '36.72.192.14' },
            { label: 'By Device', example: 'android:a1b2c3' },
          ].map(f => (
            <button
              key={f.label}
              onClick={() => setQuery(f.example)}
              className="text-[10px] px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
              style={{ color: '#6b7280' }}
            >{f.label}</button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results !== null && !loading && results.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <MagnifyingGlass size={40} style={{ color: '#d1d5db' }} className="mx-auto mb-3" />
          <p className="text-sm font-semibold mb-1" style={{ color: '#374151' }}>No identity match found</p>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Try a different identifier or check the format</p>
        </div>
      )}

      {selected && <UnifiedProfileView profile={selected} />}

      {/* Sample profiles when no search yet */}
      {results === null && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>Sample Profiles — click to explore</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_PROFILES.map(p => (
              <button
                key={p.id}
                onClick={() => { setSelected(p); setResults([p]); }}
                className="bg-white rounded-2xl p-4 border border-gray-200 text-left hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: '#6366f1' }}>
                    {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#111827' }}>{p.name}</p>
                    <p className="text-[10px]" style={{ color: '#9ca3af' }}>{p.identifiers.phone}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{p.lobs.length} LoB</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">{p.totalDisbursed > 0 ? 'Borrower' : p.totalDisbursed === 0 && p.events.length > 0 ? 'Lead' : 'New'}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">{p.devices.length} Devices</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UnifiedProfileView({ profile }: { profile: IdentityMatch }) {
  const [activeEvent, setActiveEvent] = React.useState<string | null>(null);
  const [activeLoan, setActiveLoan] = React.useState<string | null>(null);
  const [actionLog, setActionLog] = React.useState<{ ch: string; msg: string; time: string; status: 'sent' | 'pending' | 'error' }[]>([]);
  const [activeAction, setActiveAction] = React.useState<{ label: string; channel: string; steps: ActionStep[] } | null>(null);
  const [previewAction, setPreviewAction] = React.useState<{ name: string; score: number; reason: string; color: string; logo: string } | null>(null);
  const fmtIDR = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;

  const executeAction = (channel: string, label: string, msg: string) => {
    const steps: ActionStep[] = [
      { step: 1, status: 'pending', label: 'Validate contact', detail: `Check ${channel} — ${profile.identifiers.phone}` },
      { step: 2, status: 'pending', label: 'Build message', detail: `Personalized content for ${profile.name}` },
      { step: 3, status: 'pending', label: 'Send via ' + channel, detail: msg.slice(0, 60) + '...' },
      { step: 4, status: 'pending', label: 'Confirm delivery', detail: `Wait for delivery receipt...` },
    ];
    setActiveAction({ label, channel, steps });

    steps.forEach((s, i) => {
      setTimeout(() => {
        setActiveAction(prev => {
          if (!prev) return prev;
          const updated = { ...prev, steps: prev.steps.map((st, j) => j === i ? { ...st, status: 'done' as const } : st) };
          if (i < steps.length - 1) {
            setTimeout(() => {
              setActiveAction(p => {
                if (!p) return p;
                return { ...p, steps: p.steps.map((st, j) => j === i + 1 ? { ...st, status: 'sending' as const } : st) };
              });
            }, 600);
          }
          if (i === steps.length - 1) {
            setActionLog(prev => [
              { ch: channel, msg: label, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }), status: 'sent' },
              ...prev,
            ]);
            setTimeout(() => setActiveAction(null), 800);
          }
          return updated;
        });
      }, (i * 1200) + 400);
    });
  };

  const STATUS_COLORS: Record<string, string> = {
    active: '#10b981', completed: '#6366f1', rejected: '#dc2626', pending: '#f59e0b', dormant: '#6b7280',
  };
  const TYPE_ICONS: Record<string, string> = {
    payment: 'P', inquiry: 'I', late: '!', escalation: 'X',
  };
  const TYPE_COLORS: Record<string, string> = {
    payment: '#10b981', inquiry: '#4f8ef7', late: '#f59e0b', escalation: '#dc2626',
  };

  const nextActions: Record<string, { channel: string; icon: React.ElementType; label: string; msg: string; color: string; priority: 'high' | 'medium' | 'low' }[]> = {
    BudiSantoso: [
      { channel: 'WhatsApp', icon: ChatCircle, label: 'WhatsApp Cross-Sell — DANASTRA', msg: 'Budi, motor lama mau di-refinance? Dana tambahan Rp 15jt cair dalam 3 hari. Klik 👉 fifgroup.id/refi', color: '#10b981', priority: 'high' },
      { channel: 'Push', icon: Bell, label: 'Push — DANASTRA Offer', msg: 'Tukar motor lama dapat dana tambahan! Promo refinance 0.5%/bulan. ☝️', color: '#f59e0b', priority: 'high' },
      { channel: 'WhatsApp', icon: ChatCircle, label: 'WhatsApp — FINATRA Offer', msg: 'Budi, butuh modal usaha? FINATRA menawarkan dana Rp 25-200 juta untuk wiraswasta seperti Anda. Proses 3 hari! 👉 fifgroup.id/finatra', color: '#059669', priority: 'high' },
      { channel: 'Email', icon: Envelope, label: 'Email — AMITRA Education', msg: 'Siapkan masa depan anak Anda dengan tabungan pendidikan AMITRA. Mulai Rp 200rb/bulan. 👉 fifgroup.id/amitra', color: '#ec4899', priority: 'medium' },
      { channel: 'WhatsApp', icon: ChatCircle, label: 'WhatsApp — AMITRA Offer', msg: 'Budi, pendidikan anak makin mahal. AMITRA bantu siapkan和教育基金 mulai Rp 200rb/bulan. ☎️ Hubungi kami!', color: '#ec4899', priority: 'medium' },
      { channel: 'SMS', icon: DeviceMobile, label: 'SMS Reminder', msg: 'Budi, angsuran FIFASTRA Rp 618rb jatuh tgl 10 Agust. Pastikan saldo cukup ya.', color: '#6b7280', priority: 'low' },
    ],
    SitiRahayu: [
      { channel: 'WhatsApp', icon: ChatCircle, label: 'WhatsApp — SPEKTRA Offer', msg: 'Siti! Pinjaman mikro tanpa agunan Rp 5jt, bunga 0% untuk 30 hari pertama. Proses 100% di HP 👉 fifgroup.id/spektra', color: '#8b5cf6', priority: 'high' },
      { channel: 'Push', icon: Bell, label: 'Push — Greeting', msg: 'Selamat datang Siti! Ajukan pinjaman pertama Anda di FIFGO — proses cepat, bunga ringan.', color: '#4f8ef7', priority: 'medium' },
    ],
    AhmadWijaya: [
      { channel: 'WhatsApp', icon: ChatCircle, label: 'WhatsApp — FINATRA Follow-up', msg: 'Pak Ahmad, pengajuan FINATRA Rp 50jt sedang diproses. Tim kami akan menghubungi besok. ☎️', color: '#059669', priority: 'high' },
      { channel: 'Call', icon: DeviceMobile, label: 'Schedule Call', msg: 'Outbound call: follow-up FINATRA Rp 50jt — pengusaha toko elektronik Surabaya. Slot: besok 09:00-11:00 WIB.', color: '#1e3a5f', priority: 'high' },
      { channel: 'Email', icon: Envelope, label: 'Email — FINATRA Docs', msg: 'Persiapkan dokumen FINATRA: NIB, Rekening 6 bln, Surat keterangan usaha dari Kelurahan.', color: '#6366f1', priority: 'medium' },
    ],
  };

  const profileKey = profile.name.replace(/\s+/g, '');
  const actions = nextActions[profileKey] || [];

  const getActionState = (label: string) => {
    if (actionLog.some(a => a.msg === label)) return 'sent';
    if (activeAction?.label === label) return 'active';
    return 'ready';
  };

  return (
    <div className="space-y-5">
      {/* ── Profile Header ── */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d4a8f] rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="text-2xl font-black text-white">
                {profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-white">{profile.name}</h2>
                {profile.birthDate && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">Lahir {new Date(profile.birthDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                )}
              </div>
              <p className="text-white/50 text-xs">UID: <span className="font-mono text-white/70">{profile.id}</span></p>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {profile.city && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">📍 {profile.city}</span>}
                {profile.occupation && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">💼 {profile.occupation}</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex gap-2 mb-2 flex-wrap justify-end">
              <span className="text-[10px] px-3 py-1 rounded-full bg-white/20 text-white/80">{profile.riskLevel}</span>
              {profile.churnRisk && (
                <span className="text-[10px] px-3 py-1 rounded-full font-bold" style={{
                  background: profile.churnRisk === 'high' ? '#dc262640' : profile.churnRisk === 'medium' ? '#f59e0b40' : '#10b98140',
                  color: profile.churnRisk === 'high' ? '#fca5a5' : profile.churnRisk === 'medium' ? '#fde68a' : '#a7f3d0',
                }}>
                  Churn Risk: {profile.churnRisk.toUpperCase()}
                </span>
              )}
            </div>
            {profile.gapDays !== undefined && (
              <p className="text-white/50 text-[10px]">Last disbursement: {profile.gapDays} days ago</p>
            )}
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {([
            { label: 'Total Disbursed', value: fmtIDR(profile.totalDisbursed) },
            { label: 'Active Loans', value: `${profile.loans.filter(l => l.status === 'active').length}` },
            ...(profile.loans.some(l => l.status === 'active') ? [{ label: 'Monthly Angsuran', value: fmtIDR(profile.loans.find(l => l.status === 'active')!.monthlyInstallment) }] : []),
            { label: 'Available Products', value: `${profile.availableProducts.length}` },
          ] as { label: string; value: string }[]).map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="text-white font-extrabold text-sm">{s.value}</p>
              <p className="text-white/60 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Identifiers & Devices ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Known Identifiers</h3>
          <div className="space-y-3">
            {[
              { label: 'Full Name', value: profile.name },
              { label: 'Phone', value: profile.identifiers.phone },
              { label: 'Email', value: profile.identifiers.email },
              ...(profile.identifiers.ktp ? [{ label: 'KTP', value: profile.identifiers.ktp }] : []),
              ...(profile.identifiers.ip ? [{ label: 'IP Address', value: profile.identifiers.ip }] : []),
              ...(profile.identifiers.deviceId ? [{ label: 'Device ID', value: profile.identifiers.deviceId }] : []),
            ].map((id: any) => (
              <div key={id.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #f9fafb' }}>
                <span className="text-xs" style={{ color: '#9ca3af' }}>{id.label}</span>
                <span className="text-xs font-semibold font-mono" style={{ color: '#374151' }}>{id.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs" style={{ color: '#9ca3af' }}>Confidence</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700">{(profile.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="pt-1">
              <p className="text-[10px] font-semibold mb-2" style={{ color: '#9ca3af' }}>Communication Preferences</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(profile.communicationPrefs).map(([ch, enabled]) => {
                  const iconMap: Record<string, React.ReactNode> = {
                    whatsapp: <svg width="12" height="12" viewBox="0 0 24 24" fill={enabled ? '#25D366' : '#d1d5db'}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 6.987L.789 23.789l4.35-1.678A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.894 17.803c-.386 1.082-1.978 1.99-3.166 2.147-.51.07-1.175.098-1.94.042a12.44 12.44 0 01-3.22-.77c-.24-.085-.416-.13-.594-.13s-.316.03-.463.055c-.147.025-.342-.035-.542-.185-1.78-1.34-2.96-3.47-3.056-3.67-.095-.2-1.01-1.31-1.01-2.5 0-1.19.64-1.78.868-2.02.23-.24.5-.3.666-.3.167 0 .333 0 .48.008.146.008.343-.055.523.4.182.455.618 1.575.672 1.69.054.115.09.248.03.395-.06.147-.09.26-.18.373-.09.115-.19.252-.27.337-.09.086-.18.18-.077.352.103.173.46.73.99 1.185.43.37.8.485 1.09.537.29.05.56.063.77-.09.21-.154.35-.39.45-.62.1-.23.21-.2.58-.07.37.13 2.36.96 2.77 1.79.41.83.41 1.54.29 1.69-.12.15-.43.24-.9.43z"/></svg>,
                    sms: <DeviceMobile size={11} style={{ color: enabled ? '#4f8ef7' : '#d1d5db' }} />,
                    email: <Envelope size={11} style={{ color: enabled ? '#f59e0b' : '#d1d5db' }} />,
                    push: <Bell size={11} style={{ color: enabled ? '#10b981' : '#d1d5db' }} />,
                  };
                  return (
                    <span key={ch} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full" style={{ background: enabled ? '#f0fdf4' : '#f9fafb', color: enabled ? '#374151' : '#d1d5db' }}>
                      {iconMap[ch]} {ch}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Known Devices</h3>
          <div className="space-y-3">
            {profile.devices.map(d => (
              <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f9fafb' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: d.type === 'mobile' ? '#eff6ff' : '#f5f3ff' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={d.type === 'mobile' ? '#4f8ef7' : '#8b5cf6'} strokeWidth="2.5">
                    {d.type === 'mobile' ? <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></> : <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>}
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: '#111827' }}>{d.os}</p>
                  <p className="text-[10px] font-mono truncate" style={{ color: '#9ca3af' }}>{d.id.slice(0, 28)}...</p>
                </div>
                {d.lastSeen && <span className="text-[9px] shrink-0" style={{ color: '#9ca3af' }}>{d.lastSeen}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Loan & Application History ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Loan &amp; Application History</h3>
        {profile.loans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>No loan history yet</p>
            <p className="text-xs mt-1" style={{ color: '#d1d5db' }}>This customer has not applied for any products</p>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.loans.map(loan => {
              const isOpen = activeLoan === loan.id;
              const statusColor = STATUS_COLORS[loan.status] || '#6b7280';
              return (
                <div key={loan.id} className="rounded-xl border" style={{ borderColor: `${statusColor}30`, background: `${statusColor}05` }}>
                  <button
                    className="w-full flex items-center gap-4 p-4 text-left"
                    onClick={() => setActiveLoan(isOpen ? null : loan.id)}
                  >
                    <div className="w-12 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: '#f9fafb' }}>
                      <img src={loan.logo} alt={loan.lob} className="object-contain" style={{ height: 28, width: 'auto', maxWidth: 48 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold" style={{ color: '#111827' }}>{loan.product}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${statusColor}20`, color: statusColor }}>
                          {loan.status.toUpperCase()}
                        </span>
                        {loan.status === 'active' && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#10b98120', color: '#10b981' }}>
                            {loan.repaymentRate}% repayment rate
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3 mt-1 flex-wrap">
                        <span className="text-[11px]" style={{ color: '#9ca3af' }}>{loan.purpose}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-sm font-bold" style={{ color: '#111827' }}>{fmtIDR(loan.amount)}</p>
                      <p className="text-[10px]" style={{ color: '#9ca3af' }}>{loan.tenor}x · {loan.interestRate}%/yr</p>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor"
                      style={{ color: '#d1d5db', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,172.69l74.34-82.35a8,8,0,0,1,11.32,11.32Z"/>
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: `${statusColor}20` }}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
                        {[
                          { label: 'Loan ID', value: loan.id },
                          { label: 'Amount', value: fmtIDR(loan.amount) },
                          { label: 'Tenor', value: `${loan.tenor} months` },
                          { label: 'Interest', value: `${loan.interestRate}%/year` },
                          { label: 'Monthly Installment', value: fmtIDR(loan.monthlyInstallment) },
                          { label: 'Outstanding', value: loan.outstanding > 0 ? fmtIDR(loan.outstanding) : '—' },
                          { label: 'Disbursed', value: loan.disbursedAt ? new Date(loan.disbursedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
                          { label: 'Purpose', value: loan.purpose },
                        ].map(s => (
                          <div key={s.label}>
                            <p className="text-[10px]" style={{ color: '#9ca3af' }}>{s.label}</p>
                            <p className="text-xs font-semibold mt-0.5" style={{ color: '#374151' }}>{s.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Repayment timeline */}
                      {loan.history.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold mb-3" style={{ color: '#6b7280' }}>Repayment History</p>
                          <div className="flex gap-1 overflow-x-auto pb-2">
                            {loan.history.map((h, idx) => {
                              const clr = TYPE_COLORS[h.type] || '#6b7280';
                              return (
                                <div key={idx} className="shrink-0 w-32 p-2 rounded-lg text-center" style={{ background: `${clr}10`, border: `1px solid ${clr}20` }}>
                                  <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center" style={{ background: `${clr}20` }}>
                                    <span className="text-[10px] font-black" style={{ color: clr }}>{TYPE_ICONS[h.type] || '?'}</span>
                                  </div>
                                  <p className="text-[9px] font-semibold" style={{ color: clr }}>{h.type.toUpperCase()}</p>
                                  <p className="text-[10px] font-bold mt-0.5" style={{ color: '#374151' }}>{h.amount > 0 ? fmtIDR(h.amount) : '—'}</p>
                                  <p className="text-[9px] mt-0.5 truncate" style={{ color: '#9ca3af' }}>{new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                                  <p className="text-[9px] mt-0.5" style={{ color: '#9ca3af' }}>{h.note}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Next payment alert */}
                      {loan.status === 'active' && profile.nextPayment && (
                        <div className="mt-3 p-3 rounded-xl" style={{ background: profile.nextPayment.status === 'overdue' ? '#fef2f2' : '#fffbeb', border: `1px solid ${profile.nextPayment.status === 'overdue' ? '#dc2626' : '#f59e0b'}30` }}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: profile.nextPayment.status === 'overdue' ? '#dc2626' : '#f59e0b' }} />
                            <span className="text-xs font-semibold" style={{ color: profile.nextPayment.status === 'overdue' ? '#dc2626' : '#d97706' }}>
                              Next Payment: {new Date(profile.nextPayment.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="text-xs font-bold" style={{ color: '#374151' }}>{fmtIDR(profile.nextPayment.amount)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Available Products ── */}
      {profile.availableProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Recommended Products <span className="font-normal text-[11px]" style={{ color: '#9ca3af' }}>— next best offer for this customer</span></h3>
          <div className="space-y-3">
            {profile.availableProducts.map(p => {
              const logo = LOB_LOGOS[p.name];
              return (
              <div key={p.name} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#f9fafb', borderLeft: `3px solid ${p.color}` }}>
                <div className="w-12 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: '#fff' }}>
                  {logo && <img src={logo} alt={p.name} className="object-contain" style={{ height: 28, width: 'auto', maxWidth: 52 }} />}
                  {!logo && <span className="text-sm font-black" style={{ color: p.color }}>{p.name[0]}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: '#111827' }}>{p.name}</span>
                    <div className="h-1.5 flex-1 max-w-16 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
                      <div className="h-full rounded-full" style={{ width: `${p.score}%`, background: p.score >= 80 ? '#10b981' : p.score >= 60 ? '#f59e0b' : '#6b7280' }} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: p.score >= 80 ? '#10b981' : '#6b7280' }}>{p.score}%</span>
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: '#6b7280' }}>{p.reason}</p>
                </div>
                <button
                  onClick={() => setPreviewAction({ name: p.name, score: p.score, reason: p.reason, color: p.color, logo: logo || '' })}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: p.color, opacity: 0.85 }}
                >
                  Send Offer
                </button>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Offer Preview Modal ── */}
      {previewAction && (
        <OfferModal
          profile={profile}
          product={previewAction}
          onClose={() => setPreviewAction(null)}
          onExecute={(channel, msg) => {
            setPreviewAction(null);
            setTimeout(() => executeAction(channel, `${channel} — ${previewAction.name} Offer`, msg), 200);
          }}
        />
      )}

      {/* ── Action Automation Panel ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <PaperPlaneTilt size={16} style={{ color: '#6366f1' }} weight="fill" />
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Action Automation</h3>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold">CDP TRIGGER</span>
          </div>
          {profile.gapDays !== undefined && profile.gapDays > 90 && (
            <span className="text-[9px] px-2.5 py-1 rounded-full font-bold" style={{ background: '#fef3c7', color: '#d97706' }}>
              ⚠ {profile.gapDays} days inactive — high re-engagement priority
            </span>
          )}
        </div>

        <div className="space-y-2">
          {actions.map((action, i) => {
            const Icon = action.icon;
            const state = getActionState(action.label);
            const sent = state === 'sent';
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all" style={{
                background: sent ? '#f0fdf4' : action.priority === 'high' ? '#fffbeb' : '#f9fafb',
                border: `1px solid ${sent ? '#10b98130' : action.priority === 'high' ? '#f59e0b30' : '#f3f4f6'}`,
                opacity: sent ? 0.7 : 1,
              }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${action.color}15` }}>
                  <Icon size={16} style={{ color: action.color }} weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold" style={{ color: '#374151' }}>{action.label}</span>
                    {action.priority === 'high' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#fef3c7', color: '#d97706' }}>PRIORITY</span>
                    )}
                    {sent && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700">✓ SENT</span>
                    )}
                  </div>
                  <p className="text-[10px] mt-0.5 truncate" style={{ color: '#9ca3af' }}>{action.msg}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {Object.entries(profile.communicationPrefs).map(([ch, enabled]) => {
                    if (!action.label.toLowerCase().includes(ch) && !action.label.toLowerCase().includes('call') && ch !== 'push') return null;
                    return enabled ? (
                      <span key={ch} className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">✓ {ch}</span>
                    ) : (
                      <span key={ch} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">✗ {ch}</span>
                    );
                  })}
                  {!sent && (
                    <button
                      onClick={() => executeAction(action.channel, action.label, action.msg)}
                      className="text-[10px] px-3 py-1.5 rounded-lg font-bold text-white transition-all hover:opacity-90"
                      style={{ background: action.color }}
                    >
                      Execute
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Execution Panel */}
        {activeAction && (
          <div className="rounded-xl border-2 p-5" style={{ borderColor: '#6366f1', background: '#f0f0ff' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center animate-spin" style={{ borderTopColor: 'transparent' }}>
              </div>
              <h4 className="text-sm font-bold" style={{ color: '#6366f1' }}>Executing: {activeAction.label}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full ml-auto" style={{ background: '#e0e7ff', color: '#6366f1' }}>{activeAction.channel}</span>
            </div>
            <div className="space-y-2.5">
              {activeAction.steps.map((step, i) => (
                <div key={step.step} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
                    style={{
                      background: step.status === 'done' ? '#10b981' : step.status === 'sending' ? '#6366f1' : '#e5e7eb',
                      color: step.status === 'done' ? 'white' : step.status === 'sending' ? 'white' : '#9ca3af',
                    }}>
                    {step.status === 'done' ? '✓' : step.status === 'sending' ? '...' : step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: step.status === 'done' ? '#10b981' : step.status === 'sending' ? '#6366f1' : '#9ca3af' }}>{step.label}</span>
                      {step.status === 'sending' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full animate-pulse" style={{ background: '#e0e7ff', color: '#6366f1' }}>running</span>
                      )}
                      {step.status === 'done' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#10b981' }}>done</span>
                      )}
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sent log */}
        {actionLog.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
            <p className="text-[11px] font-semibold mb-2" style={{ color: '#9ca3af' }}>Action Log</p>
            <div className="space-y-1.5">
              {actionLog.map((log, i) => (
                <div key={i} className="flex items-center gap-3 text-[11px]" style={{ color: '#6b7280' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold" style={{ color: '#10b981' }}>{log.ch}</span>
                  <span>{log.msg}</span>
                  <span className="ml-auto text-[10px]" style={{ color: '#9ca3af' }}>{log.time} WIB</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Activity Timeline ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Activity Timeline</h3>
        <div>
          {profile.events.map((evt, i) => {
            const isOpen = activeEvent === evt.id;
            return (
              <div key={evt.id}>
                <button
                  className="w-full flex items-center gap-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveEvent(isOpen ? null : evt.id)}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${evt.color}15` }}>
                    <span className="text-[10px] font-black" style={{ color: evt.color }}>{evt.type[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold" style={{ color: '#374151' }}>{evt.type}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${evt.color}10`, color: evt.color }}>{evt.source}</span>
                    </div>
                    <p className="text-[11px] mt-0.5 truncate" style={{ color: '#9ca3af' }}>{evt.channel} · {evt.location}</p>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: '#9ca3af' }}>{evt.timestamp}</span>
                  <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor"
                    style={{ color: '#d1d5db', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,172.69l74.34-82.35a8,8,0,0,1,11.32,11.32Z"/>
                  </svg>
                </button>
                {isOpen && (
                  <div className="ml-12 mr-4 mb-3 p-3 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <p className="text-xs" style={{ color: '#374151' }}>{evt.detail}</p>
                    {evt.metadata && (
                      <div className="flex gap-3 mt-2 flex-wrap">
                        {Object.entries(evt.metadata).map(([k, v]) => (
                          <span key={k} className="text-[10px]" style={{ color: '#9ca3af' }}>
                            <strong style={{ color: '#6b7280' }}>{k}:</strong> {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {i < profile.events.length - 1 && <div className="ml-4" style={{ borderLeft: '2px solid #f3f4f6', height: 0 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type OfferModalProps = {
  profile: IdentityMatch;
  product: { name: string; score: number; reason: string; color: string; logo: string };
  onClose: () => void;
  onExecute: (channel: string, msg: string) => void;
};

function OfferModal({ profile, product, onClose, onExecute }: OfferModalProps) {
  const [channel, setChannel] = React.useState<string>('WhatsApp');
  const [message, setMessage] = React.useState('');
  const fmtIDR = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;

  const CHANNELS = [
    { id: 'WhatsApp', label: 'WhatsApp', color: '#25D366',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 6.987L.789 23.789l4.35-1.678A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg> },
    { id: 'SMS', label: 'SMS', color: '#4f8ef7',
      icon: <DeviceMobile size={16} style={{ color: 'white' }} /> },
    { id: 'Email', label: 'Email', color: '#f59e0b',
      icon: <Envelope size={16} style={{ color: 'white' }} /> },
    { id: 'Push', label: 'Push Notif', color: '#10b981',
      icon: <Bell size={16} style={{ color: 'white' }} /> },
  ];

  const PRESET_MESSAGES: Record<string, Record<string, string>> = {
    FIFASTRA: {
      WhatsApp: `Halo ${profile.name}! Promo spesial FIFASTRA buat Anda — bunga ringan, proses cepat, cair dalam 3 hari. Ajukan sekarang! 👉 fifgroup.id/fifastra`,
      SMS: `${profile.name}, promo FIFASTRA: bunga ringan, cair 3 hari. Ajukan di fifgroup.id/fifastra`,
      Email: `Hai ${profile.name},\n\nKami punya penawaran eksklusif FIFASTRA untuk Anda — salah satu produk terpopuler dari FIFGROUP. Bunga kompetitif, proses 100% digital.\n\nKlik untuk mengajukan: fifgroup.id/fifastra\n\nSalam,\nTim FIFGROUP`,
      Push: `${profile.name}, promo FIFASTRA bunga ringan — ajukan sekarang! 👉`,
    },
    DANASTRA: {
      WhatsApp: `${profile.name}, motor lama bisa ditukar jadi dana tambahan! Program refinance DANASTRA — cair cepat, bunga ringan. Info lengkap 👉 fifgroup.id/danastra`,
      SMS: `${profile.name}, tukar motor lama dapat dana! Program refinance DANASTRA. fifgroup.id/danastra`,
      Email: `Hai ${profile.name},\n\nMotor lama Anda bisa jadi sumber dana tambahan dengan program refinance DANASTRA dari FIFGROUP. Proses cepat dan bunga kompetitif.\n\nPelajari lebih lanjut: fifgroup.id/danastra\n\nSalam,\nTim FIFGROUP`,
      Push: `${profile.name}, refinance motor lama — dana cair cepat! 👉`,
    },
    FINATRA: {
      WhatsApp: `${profile.name}, butuh modal untuk usaha? FINATRA dari FIFGROUP menawarkan dana Rp 25-200 juta untuk pelaku usaha kecil & mikro. Proses 3-5 hari! 👉 fifgroup.id/finatra`,
      SMS: `${profile.name}, modal usaha Rp 25-200 jt tersedia! FINATRA FIFGROUP. fifgroup.id/finatra`,
      Email: `Hai ${profile.name},\n\nApakah Anda tahu FINATRA bisa membantu mengembangkan usaha Anda? FIFGROUP menawarkan pembiayaan modal kerja Rp 25-200 juta untuk pelaku usaha kecil dan mikro.\n\nAjukan sekarang: fifgroup.id/finatra\n\nSalam,\nTim FIFGROUP`,
      Push: `${profile.name}, modal usaha tersedia — FINATRA FIFGROUP! 👉`,
    },
    SPEKTRA: {
      WhatsApp: `${profile.name}! SPEKTRA — pinjaman mikro tanpa agunan, proses 100% di HP, bunga 0% untuk 30 hari pertama. Ajukan sekarang! 👉 fifgroup.id/spektra`,
      SMS: `${profile.name}, pinjam Rp 5jt tanpa agunan! SPEKTRA — proses di HP, bunga 0%. fifgroup.id/spektra`,
      Email: `Hai ${profile.name},\n\nSPEKTRA dari FIFGROUP adalah solusi tepat untuk kebutuhan mendesak Anda — pinjaman mikro tanpa agunan, proses 100% digital, dan bunga 0% untuk 30 hari pertama.\n\nAjukan di: fifgroup.id/spektra\n\nSalam,\nTim FIFGROUP`,
      Push: `${profile.name}, SPEKTRA: pinjam tanpa agunan, proses di HP! 👉`,
    },
    AMITRA: {
      WhatsApp: `${profile.name}, siapkan masa depan anak Anda dengan AMITRA — tabungan pendidikan dari FIFGROUP. Mulai Rp 200rb/bulan, tanpa biaya tersembunyi. Info 👉 fifgroup.id/amitra`,
      SMS: `${profile.name}, tabungan pendidikan AMITRA mulai Rp 200rb/bulan. fifgroup.id/amitra`,
      Email: `Hai ${profile.name},\n\nPendidikan anak adalah investasi jangka panjang. AMITRA dari FIFGROUP membantu Anda merencanakan dan menabung untuk masa depan pendidikan mereka sejak dini.\n\nPelajari lebih lanjut: fifgroup.id/amitra\n\nSalam,\nTim FIFGROUP`,
      Push: `${profile.name}, AMITRA — tabungan pendidikan untuk masa depan anak! 👉`,
    },
  };

  React.useEffect(() => {
    setMessage(PRESET_MESSAGES[product.name]?.[channel] || `Halo ${profile.name}, ada penawaran spesial produk ${product.name} dari FIFGROUP untuk Anda!`);
  }, [channel, product.name, profile.name]);

  const activeChannel = CHANNELS.find(c => c.id === channel)!;
  const maxChars = channel === 'SMS' ? 160 : channel === 'Push' ? 60 : 1000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: '#f3f4f6', background: `${product.color}08` }}>
          <div className="w-12 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0" style={{ background: '#fff' }}>
            {product.logo && <img src={product.logo} alt={product.name} className="object-contain" style={{ height: 28, width: 'auto', maxWidth: 52 }} />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold" style={{ color: '#111827' }}>Send Offer — {product.name}</h3>
            <p className="text-[11px]" style={{ color: '#9ca3af' }}>To: {profile.name} · {profile.identifiers.phone}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f3f4f6', color: '#6b7280' }}>✕</button>
        </div>

        {/* Channel selector */}
        <div className="p-5 border-b" style={{ borderColor: '#f3f4f6' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#9ca3af' }}>Select Channel</p>
          <div className="grid grid-cols-4 gap-2">
            {CHANNELS.map(ch => (
              <button
                key={ch.id}
                onClick={() => setChannel(ch.id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all"
                style={{ borderColor: channel === ch.id ? ch.color : '#f3f4f6', background: channel === ch.id ? `${ch.color}12` : '#f9fafb' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: ch.color }}>{ch.icon}</div>
                <span className="text-[10px] font-bold" style={{ color: channel === ch.id ? ch.color : '#9ca3af' }}>{ch.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer context */}
        <div className="p-5 border-b" style={{ borderColor: '#f3f4f6' }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#9ca3af' }}>Customer Context</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Name', value: profile.name },
              { label: 'Phone', value: profile.identifiers.phone },
              { label: 'City', value: profile.city || '—' },
              { label: 'Occupation', value: profile.occupation || '—' },
              { label: 'Fit Score', value: `${product.score}%` },
              { label: 'Product', value: product.name },
            ].map(row => (
              <div key={row.label} className="p-2.5 rounded-lg" style={{ background: '#f9fafb' }}>
                <p className="text-[9px] mb-0.5" style={{ color: '#9ca3af' }}>{row.label}</p>
                <p className="text-xs font-semibold" style={{ color: '#374151' }}>{row.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2.5 rounded-lg" style={{ background: '#f9fafb' }}>
            <p className="text-[9px] mb-0.5" style={{ color: '#9ca3af' }}>Why recommended</p>
            <p className="text-xs" style={{ color: '#374151' }}>{product.reason}</p>
          </div>
        </div>

        {/* Message composer */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>Message Preview</p>
            <span className="text-[10px]" style={{ color: message.length > maxChars ? '#dc2626' : '#9ca3af' }}>{message.length}/{maxChars}</span>
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-xl border text-sm resize-none focus:outline-none"
            style={{ borderColor: message.length > maxChars ? '#dc2626' : '#e5e7eb', background: '#f9fafb', color: '#374151' }}
          />
          {message.length > maxChars && (
            <p className="text-[10px] mt-1" style={{ color: '#dc2626' }}>
              ⚠ {channel === 'SMS' ? 'SMS akan terpisah jadi 2 pesan' : channel === 'Push' ? 'Push notification akan terpotong' : 'Pesan terlalu panjang'}
            </p>
          )}
          <div className="mt-3 p-3 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #10b98130' }}>
            <p className="text-[10px] font-semibold mb-1" style={{ color: '#10b981' }}>Preview — {channel}</p>
            <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#374151' }}>{message}</p>
          </div>
          <button
            onClick={() => onExecute(channel, message)}
            disabled={message.length > maxChars}
            className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-white"
            style={{ background: message.length > maxChars ? '#d1d5db' : activeChannel.color }}
          >
            {message.length > maxChars ? '✕ Message Too Long' : `Send via ${channel}`}
          </button>
        </div>
      </div>
    </div>
  );
}

