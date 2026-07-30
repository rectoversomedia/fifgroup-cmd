'use client';

import * as React from 'react';
import {
  Users, Lightning, ChartBar, Gear, Database, Brain, Warning,
  TrendUp, TrendDown, CheckCircle, X, Plus, Trash, PencilSimple,
  ArrowsDownUp, CaretDown, CaretUp, Circle,
} from '@phosphor-icons/react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type JourneyStep = { day: number; action: string; sent: number; opened: number; conv: number; openRate: number };
export type Journey = {
  id: string; name: string; desc: string; icon: string; color: string;
  status: 'active' | 'paused' | 'draft';
  users: number; convRate: number; potential: string; trigger: string; steps: JourneyStep[];
};
export type Segment = { id: string; name: string; count: number; color: string; description: string };
export type HybridChannel = {
  segment: string; count: number; channels: string[]; priority: 'high' | 'medium' | 'low'; color: string;
};
export type AIInsight = {
  id: string; title: string; finding: string; rootCause: string; basedOn: string;
  priority: 'high' | 'medium' | 'info'; type: string; confidence?: string;
  apps: string[] | null; lobs: string[] | null; color: string; iconType: string;
};

// ─── Default Data ───────────────────────────────────────────────────────────────

export const DEFAULT_JOURNEYS: Journey[] = [
  { id: 'new-user', name: 'New User Nurture', desc: 'Registered but no disbursement after 7 days — automated push sequence', icon: 'UserCirclePlus', color: '#4f8ef7', status: 'active', users: 12400, convRate: 18, potential: 'Rp 3.8B', trigger: 'kyc_approved + 7d no disbursement', steps: [
    { day: 0, action: 'Welcome push — Dapatkan dana pertama dalam 10 menit', sent: 12400, opened: 9920, conv: 0, openRate: 80 },
    { day: 7, action: 'Personalized promo — Bunga 0% untuk 7 hari pertama', sent: 12400, opened: 7440, conv: 892, openRate: 60 },
    { day: 14, action: 'Re-engagement — deadline reminder', sent: 11300, opened: 4520, conv: 560, openRate: 40 },
  ]},
  { id: 'cross-sell', name: 'Cross-Sell Single-LoB', desc: 'Users with 1 active LoB product — recommend second product', icon: 'Crosshair', color: '#8b5cf6', status: 'active', users: 34821, convRate: 8, potential: 'Rp 4.2B/mo', trigger: '1_lob + active_repayment + 60d_since_last_disbursement', steps: [
    { day: 0, action: 'Cross-sell offer — personalized to their LoB', sent: 34821, opened: 20892, conv: 0, openRate: 60 },
    { day: 3, action: 'Follow-up with success story testimonial', sent: 34821, opened: 13928, conv: 1393, openRate: 40 },
    { day: 7, action: 'Limited time bonus offer', sent: 31800, opened: 9540, conv: 636, openRate: 30 },
  ]},
  { id: 'bill-reminder', name: 'Smart Bill Reminder', desc: 'Automated repayment sequence — reduce NPL, improve collection', icon: 'CheckCircle', color: '#10b981', status: 'active', users: 45600, convRate: 94, potential: 'NPL -5pts', trigger: 'repayment_due_in_3_days', steps: [
    { day: -3, action: 'Day -3: Tagihan Rp XXX jatuh besok', sent: 45600, opened: 41040, conv: 41040, openRate: 90 },
    { day: -1, action: 'Day -1: Reminder + link to pay', sent: 45600, opened: 36480, conv: 34560, openRate: 80 },
    { day: 0, action: 'Day 0: Deadline alert — avoid late fee', sent: 45600, opened: 41040, conv: 41000, openRate: 90 },
  ]},
  { id: 'dormant', name: 'Dormant Re-Engagement', desc: 'No app activity > 30 days, no active loan — win them back', icon: 'Rocket', color: '#f97316', status: 'paused', users: 8920, convRate: 6, potential: 'Rp 890M', trigger: 'no_activity > 30d + active_loan = false', steps: [
    { day: 0, action: 'Kami rindu Anda — nostalgic message', sent: 8920, opened: 6244, conv: 0, openRate: 70 },
    { day: 15, action: 'Special dormant offer — Pinjaman Rp 500rb tanpa slip gaji', sent: 8920, opened: 3568, conv: 214, openRate: 40 },
    { day: 30, action: 'Final offer — only 3 days', sent: 8200, opened: 2460, conv: 164, openRate: 30 },
  ]},
  { id: 'post-disbursement', name: 'Post-Disbursement Delight', desc: 'Delight after disbursement — educate, cross-sell, retain', icon: 'Lightning', color: '#06b6d4', status: 'draft', users: 0, convRate: 0, potential: 'TBD', trigger: 'disbursement_completed', steps: [
    { day: 0, action: 'Day 0: Selamat! Dana sudah cair. Tips mengelola...', sent: 0, opened: 0, conv: 0, openRate: 0 },
    { day: 7, action: 'Day 7: Educational content — Cara bijak mengelola...', sent: 0, opened: 0, conv: 0, openRate: 0 },
    { day: 60, action: 'Day 60: Cross-sell offer triggers Cross-Sell journey', sent: 0, opened: 0, conv: 0, openRate: 0 },
  ]},
];

export const DEFAULT_SEGMENTS: Segment[] = [
  { id: 'new_users', name: 'New Users (0-30d)', count: 28400, color: '#4f8ef7', description: 'Registered within last 30 days, no disbursement yet' },
  { id: 'active_borrowers', name: 'Active Borrowers', count: 168000, color: '#10b981', description: 'Currently have an active loan in repayment' },
  { id: 'repeat_borrowers', name: 'Repeat Borrowers', count: 23400, color: '#8b5cf6', description: 'Completed at least 1 loan, eligible for next disbursement' },
  { id: 'dormant_users', name: 'Dormant Users', count: 14200, color: '#f97316', description: 'No activity in > 30 days, no active loan' },
  { id: 'cross_sell_target', name: 'Cross-Sell Target', count: 34821, color: '#06b6d4', description: 'Single LoB active + 60d since last disbursement' },
  { id: 'high_value', name: 'High Value Users', count: 12400, color: '#f59e0b', description: 'LTV > Rp 5M, repayment rate > 95%' },
];

export const DEFAULT_HYBRID: HybridChannel[] = [
  { segment: 'New Users (0-30d)', count: 28400, channels: ['Push', 'In-App', 'Email'], priority: 'high', color: '#4f8ef7' },
  { segment: 'Active Borrowers', count: 168000, channels: ['Push', 'SMS', 'In-App'], priority: 'high', color: '#10b981' },
  { segment: 'Repeat Borrowers', count: 23400, channels: ['Push', 'In-App', 'Branch'], priority: 'medium', color: '#8b5cf6' },
  { segment: 'Cross-Sell Target', count: 34821, channels: ['In-App', 'Push', 'SMS'], priority: 'high', color: '#06b6d4' },
  { segment: 'Dormant Users', count: 14200, channels: ['SMS', 'Email', 'Push'], priority: 'medium', color: '#f97316' },
  { segment: 'High Value Users', count: 12400, channels: ['In-App', 'Push', 'Branch'], priority: 'low', color: '#f59e0b' },
];

export const DEFAULT_INSIGHTS: AIInsight[] = [
  { id: 'ins-1', iconType: 'TrendDown', color: '#dc2626', priority: 'high', type: 'funnel', title: 'SPEKTRA: 62% Drop-off at Document Upload Stage', finding: 'Of 31,200 users who started SPEKTRA application, 19,400 (62%) dropped off during document upload. Top rejected document: selfie with ID.', rootCause: 'Selfie quality requirements unclear. Users unaware of acceptable photo format. Average 2.3 attempts per user.', basedOn: '31,200 application_started events, 19,400 document_upload_failed events', apps: null, lobs: ['SPEKTRA'] },
  { id: 'ins-2', iconType: 'TrendUp', color: '#10b981', priority: 'high', type: 'engagement', title: 'Cross-Sell Opportunity: 34K Single-LoB Users', finding: '34,821 FIFGO users have only 1 LoB product active. Best cross-sell pair: FIFASTRA → DANASTRA (42% natural fit based on loan purpose overlap).', rootCause: 'No proactive cross-sell nudge at key moments. App lacks "You might also like" prompts after first loan completion.', basedOn: '34,821 users with 1 LoB product, cohort analysis of multi-product users', apps: ['FIFGO'], lobs: ['FIFASTRA', 'DANASTRA'] },
  { id: 'ins-3', iconType: 'Warning', color: '#d97706', priority: 'medium', type: 'retention', title: 'SPEKTRA Month-2 Retention 52% — Below 60% Benchmark', finding: 'SPEKTRA cohort Month-2 retention is 52%, 8 points below the 60% benchmark. 71% of churned users had disbursement delay >5 days.', rootCause: 'SPEKTRA disbursement SLA averaging 4.8 days vs 3.2 days for FIFASTRA. Users switch to faster alternatives.', basedOn: 'Cohort analysis of 12,400 SPEKTRA disbursed users', apps: null, lobs: ['SPEKTRA'] },
  { id: 'ins-4', iconType: 'Lightning', color: '#4f8ef7', priority: 'medium', type: 'hybrid', title: 'KYC Document Rejection Causing 18% of Branch Visits', finding: '18% of users who visited branch after app start were rejected for KYC documents — primarily due to selfie quality issues. Add in-app validation could eliminate 60% of these visits.', rootCause: 'No real-time selfie quality check before submission. Users only discover rejection after arriving at branch.', basedOn: '8,432 branch_locator_viewed events, 1,520 branch_visit_triggered with KYC reason', apps: ['FIFGO'], lobs: null },
  { id: 'ins-5', iconType: 'TrendUp', color: '#10b981', priority: 'info', type: 'aso', title: 'FIFGO ASO Momentum: +23% Downloads, #1 Category Rank', finding: 'FIFGO downloads up 23% WoW driven by improved Finance category ranking. Moved from #2 to #1 position. Screenshot update from Q2 was effective.', rootCause: 'Updated screenshots with benefit-focused messaging and keyword placement. 8 new keywords ranked in top 10.', basedOn: 'AppTweak download tracking, category ranking API, 8-week trend', apps: ['FIFGO'], lobs: null },
];

// ─── Persistence ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'cdp_admin_v1';

export function loadCDPData() {
  if (typeof window === 'undefined') return { journeys: DEFAULT_JOURNEYS, segments: DEFAULT_SEGMENTS, hybrid: DEFAULT_HYBRID, insights: DEFAULT_INSIGHTS };
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch (_) {}
  return null;
}

export function saveCDPData(data: ReturnType<typeof getDefaultCDP>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDefaultCDP() {
  return { journeys: DEFAULT_JOURNEYS, segments: DEFAULT_SEGMENTS, hybrid: DEFAULT_HYBRID, insights: DEFAULT_INSIGHTS };
}

function int(v: string) { const n = parseInt(v); return isNaN(n) ? 0 : n; }

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, any> = {
  TrendDown, TrendUp, Warning, Lightning, Users, CheckCircle,
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-wide block" style={{ color: '#9ca3af' }}>{label}</label>
      {children}
    </div>
  );
}

function inputStyle() {
  return { background: '#fff', border: '1px solid #e5e7eb', color: '#111827' } as React.CSSProperties;
}

function inp(value: string, onChange: (v: string) => void, extra?: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl border text-xs"
      style={inputStyle()} {...extra} />
  );
}

// ─── Journey Editor ────────────────────────────────────────────────────────────

function JourneyEditor({ journey, onSave, onCancel, onDelete }: {
  journey: Journey | null;
  onSave: (j: Journey) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const isNew = !journey;
  const [form, setForm] = React.useState<Journey>(() => journey || {
    id: `journey-${Date.now()}`, name: '', desc: '', icon: 'Lightning',
    color: '#4f8ef7', status: 'draft' as const, users: 0, convRate: 0, potential: '', trigger: '', steps: [],
  });

  const set = <K extends keyof Journey>(key: K, val: Journey[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }} onClick={onCancel}>
      <div className="ml-auto h-full overflow-y-auto bg-white flex flex-col" style={{ width: 560, maxWidth: '96vw', boxShadow: '-4px 0 40px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between shrink-0" style={{ background: `linear-gradient(135deg, ${form.color}cc, ${form.color})` }}>
          <div>
            <h2 className="text-base font-extrabold text-white">{isNew ? '➕' : '✏️'} {isNew ? 'New Journey' : `Edit: ${form.name}`}</h2>
            <p className="text-[10px] mt-0.5 text-white/60">{isNew ? 'Create a new customer journey' : 'Edit journey details'}</p>
          </div>
          <div className="flex gap-2">
            {!isNew && onDelete && (
              <button onClick={onDelete} className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white/80 hover:text-red-300" style={{ background: 'rgba(255,255,255,15)' }}>
                <Trash size={14} />
              </button>
            )}
            <button onClick={onCancel} className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'rgba(255,255,255,15)' }}>✕</button>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Journey Name"><div className="space-y-1">{inp(form.name, v => set('name', v))}</div></Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value as Journey['status'])}
                className="w-full px-3 py-2 rounded-xl border text-xs" style={inputStyle()}>
                <option value="active">🟢 Active</option>
                <option value="paused">🟡 Paused</option>
                <option value="draft">🔵 Draft</option>
              </select>
            </Field>
          </div>
          <Field label="Description">{inp(form.desc, v => set('desc', v))}</Field>
          <Field label="Trigger Condition (CRM syntax)">{inp(form.trigger, v => set('trigger', v))}</Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Users In">{inp(String(form.users), v => set('users', int(v)))}</Field>
            <Field label="Conv. Rate %">{inp(String(form.convRate), v => set('convRate', int(v)))}</Field>
            <Field label="Potential">{inp(form.potential, v => set('potential', v))}</Field>
          </div>
          <Field label="Accent Color">
            <div className="flex gap-2 items-center">
              <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" style={{ background: 'none' }} />
              <input value={form.color} onChange={e => set('color', e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border text-xs font-mono" style={inputStyle()} />
            </div>
          </Field>

          {/* Steps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase" style={{ color: '#374151' }}>Journey Steps</h3>
              <button onClick={() => set('steps', [...form.steps, { day: 0, action: '', sent: 0, opened: 0, conv: 0, openRate: 0 }])}
                className="text-[11px] px-3 py-1 rounded-lg font-semibold" style={{ background: '#f0fdf4', color: '#10b981' }}>
                + Step
              </button>
            </div>
            <div className="space-y-3">
              {form.steps.map((step, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${form.color}20`, color: form.color }}>Step {i + 1}</span>
                    <button onClick={() => set('steps', form.steps.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 text-xs">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Field label="Day"><div className="space-y-1">{inp(String(step.day), v => set('steps', form.steps.map((s, j) => j === i ? { ...s, day: int(v) } : s)))}</div></Field>
                    <Field label="Sent"><div className="space-y-1">{inp(String(step.sent), v => set('steps', form.steps.map((s, j) => j === i ? { ...s, sent: int(v) } : s)))}</div></Field>
                  </div>
                  <Field label="Action Message">
                    <textarea value={step.action} rows={2}
                      onChange={e => set('steps', form.steps.map((s, j) => j === i ? { ...s, action: e.target.value } : s))}
                      className="w-full px-3 py-2 rounded-xl border text-xs resize-none" style={inputStyle()} />
                  </Field>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Field label="Opened"><div className="space-y-1">{inp(String(step.opened), v => set('steps', form.steps.map((s, j) => j === i ? { ...s, opened: int(v) } : s)))}</div></Field>
                    <Field label="Conv."><div className="space-y-1">{inp(String(step.conv), v => set('steps', form.steps.map((s, j) => j === i ? { ...s, conv: int(v) } : s)))}</div></Field>
                    <Field label="Open Rate %"><div className="space-y-1">{inp(String(step.openRate), v => set('steps', form.steps.map((s, j) => j === i ? { ...s, openRate: int(v) } : s)))}</div></Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 px-6 py-3 flex items-center justify-end gap-3 shrink-0 bg-white border-t border-gray-200">
          <button onClick={onCancel} className="px-5 py-2 rounded-xl text-xs font-semibold border border-gray-200" style={{ color: '#6b7280' }}>Cancel</button>
          <button onClick={() => onSave(form)}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: form.color }}>
            {isNew ? 'Create Journey' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Segment Editor ─────────────────────────────────────────────────────────────

function SegmentEditor({ segment, onSave, onCancel, onDelete }: {
  segment: Segment | null;
  onSave: (s: Segment) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const isNew = !segment;
  const [form, setForm] = React.useState<Segment>(() => segment || {
    id: `seg-${Date.now()}`, name: '', count: 0, color: '#4f8ef7', description: '',
  });
  const set = <K extends keyof Segment>(k: K, v: Segment[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onCancel}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg, #4f8ef7, #6366f1)', borderRadius: '1rem 1rem 0 0' }}>
          <h2 className="text-sm font-extrabold text-white">{isNew ? '➕' : '✏️'} {isNew ? 'New Segment' : `Edit: ${form.name}`}</h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,15)' }}>✕</button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Segment Name">{inp(form.name, v => set('name', v))}</Field>
          <Field label="Description">{inp(form.description, v => set('description', v))}</Field>
          <Field label="User Count">{inp(String(form.count), v => set('count', int(v)))}</Field>
          <Field label="Color">
            <div className="flex gap-2 items-center">
              <input type="color" value={form.color} onChange={e => set('color', e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0" style={{ background: 'none' }} />
              <input value={form.color} onChange={e => set('color', e.target.value)} className="flex-1 px-3 py-2 rounded-xl border text-xs font-mono" style={inputStyle()} />
            </div>
          </Field>
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end">
          {!isNew && onDelete && (
            <button onClick={onDelete} className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50">Delete</button>
          )}
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200" style={{ color: '#6b7280' }}>Cancel</button>
          <button onClick={() => onSave(form)} className="px-5 py-2 rounded-xl text-xs font-bold text-white" style={{ background: form.color }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Insight Editor ─────────────────────────────────────────────────────────────

function InsightEditor({ insight, onSave, onCancel, onDelete }: {
  insight: AIInsight | null;
  onSave: (i: AIInsight) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const isNew = !insight;
  const [form, setForm] = React.useState<AIInsight>(() => insight || {
    id: `ins-${Date.now()}`, title: '', finding: '', rootCause: '', basedOn: '',
    priority: 'medium' as const, type: 'funnel', apps: null, lobs: null,
    color: '#dc2626', iconType: 'Warning',
  });
  const set = <K extends keyof AIInsight>(k: K, v: AIInsight[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }} onClick={onCancel}>
      <div className="ml-auto h-full overflow-y-auto bg-white flex flex-col" style={{ width: 560, maxWidth: '96vw', boxShadow: '-4px 0 40px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between shrink-0" style={{ background: `linear-gradient(135deg, ${form.color}cc, ${form.color})` }}>
          <div>
            <h2 className="text-base font-extrabold text-white">{isNew ? '➕' : '✏️'} {isNew ? 'New AI Insight' : 'Edit Insight'}</h2>
            <p className="text-[10px] mt-0.5 text-white/60">{isNew ? 'Add a new AI-generated insight' : form.title}</p>
          </div>
          <div className="flex gap-2">
            {!isNew && onDelete && (
              <button onClick={onDelete} className="px-3 py-1.5 rounded-xl text-white/80 hover:text-red-300" style={{ background: 'rgba(255,255,255,15)' }}><Trash size={14} /></button>
            )}
            <button onClick={onCancel} className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: 'rgba(255,255,255,15)' }}>✕</button>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-5">
          <Field label="Title">{inp(form.title, v => set('title', v))}</Field>
          <Field label="Finding">{inp(form.finding, v => set('finding', v))}</Field>
          <Field label="Root Cause">{inp(form.rootCause, v => set('rootCause', v))}</Field>
          <Field label="Based On">{inp(form.basedOn, v => set('basedOn', v))}</Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Priority">
              <select value={form.priority} onChange={e => set('priority', e.target.value as AIInsight['priority'])}
                className="w-full px-3 py-2 rounded-xl border text-xs" style={inputStyle()}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="info">🔵 Info</option>
              </select>
            </Field>
            <Field label="Type">
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs" style={inputStyle()}>
                {['funnel','engagement','retention','hybrid','aso'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </Field>
            <Field label="Color">
              <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                className="w-full h-10 rounded-xl cursor-pointer border-0" style={{ background: 'none' }} />
            </Field>
          </div>
          <Field label="Affected Apps (comma-separated, empty = none)">
            {inp(form.apps?.join(', ') || '', v => set('apps', v ? v.split(',').map(s => s.trim()) : null))}
          </Field>
          <Field label="Affected LoBs (comma-separated, empty = none)">
            {inp(form.lobs?.join(', ') || '', v => set('lobs', v ? v.split(',').map(s => s.trim()) : null))}
          </Field>
        </div>

        <div className="sticky bottom-0 z-20 px-6 py-3 flex items-center justify-end gap-3 shrink-0 bg-white border-t border-gray-200">
          <button onClick={onCancel} className="px-5 py-2 rounded-xl text-xs font-semibold border border-gray-200" style={{ color: '#6b7280' }}>Cancel</button>
          <button onClick={() => onSave(form)} className="px-6 py-2.5 rounded-xl text-xs font-bold text-white" style={{ background: form.color }}>
            {isNew ? 'Add Insight' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

type CDPData = {
  journeys: Journey[];
  segments: Segment[];
  hybrid: HybridChannel[];
  insights: AIInsight[];
};

type Props = {
  data: CDPData;
  onChange: (d: CDPData) => void;
  onClose?: () => void;
  mode?: 'modal' | 'page';
};

export function CDPAdminPanel({ data, onChange, onClose, mode = 'modal' }: Props) {
  const setJourneys = (j: Journey[]) => onChange({ ...data, journeys: j });
  const setSegments = (s: Segment[]) => onChange({ ...data, segments: s });
  const setHybrid = (h: HybridChannel[]) => onChange({ ...data, hybrid: h });
  const setInsights = (i: AIInsight[]) => onChange({ ...data, insights: i });

  const [activeSection, setActiveSection] = React.useState<'journeys' | 'segments' | 'hybrid' | 'insights'>('journeys');
  const [editingJourney, setEditingJourney] = React.useState<Journey | null>(null);
  const [addingJourney, setAddingJourney] = React.useState(false);
  const [editingSegment, setEditingSegment] = React.useState<Segment | null>(null);
  const [addingSegment, setAddingSegment] = React.useState(false);
  const [editingInsight, setEditingInsight] = React.useState<AIInsight | null>(null);
  const [addingInsight, setAddingInsight] = React.useState(false);

  // Hybrid inline edit
  const [editingHybridIdx, setEditingHybridIdx] = React.useState<number | null>(null);
  const [hybridForm, setHybridForm] = React.useState<HybridChannel | null>(null);

  const startEditHybrid = (h: HybridChannel, i: number) => {
    setHybridForm({ ...h });
    setEditingHybridIdx(i);
  };

  const saveHybrid = () => {
    if (editingHybridIdx === null || !hybridForm) return;
    const updated = [...data.hybrid];
    updated[editingHybridIdx] = { ...hybridForm };
    setHybrid(updated);
    setEditingHybridIdx(null);
    setHybridForm(null);
  };

  const addHybrid = () => {
    setHybridForm({ segment: 'New Segment', count: 0, channels: ['Push'], priority: 'medium', color: '#4f8ef7' });
    setEditingHybridIdx(-1);
  };

  const saveNewHybrid = () => {
    if (!hybridForm) return;
    setHybrid([...data.hybrid, { ...hybridForm }]);
    setEditingHybridIdx(null);
    setHybridForm(null);
  };

  const SECTIONS = [
    { id: 'journeys' as const, label: 'Journeys', icon: '🚈', count: data.journeys.length },
    { id: 'segments' as const, label: 'Segments', icon: '👥', count: data.segments.length },
    { id: 'hybrid' as const, label: 'Hybrid Channel', icon: '📲', count: data.hybrid.length },
    { id: 'insights' as const, label: 'AI Insights', icon: '🤖', count: data.insights.length },
  ];

  const isPageMode = mode === 'page';

  const container: React.CSSProperties = isPageMode
    ? { background: '#f8fafc', minHeight: '100vh' }
    : { background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' };

  const panel: React.CSSProperties = isPageMode
    ? { maxWidth: 900, margin: '0 auto', background: '#fff', minHeight: '100vh', boxShadow: 'none' }
    : { width: 640, maxWidth: '98vw', height: '100vh', boxShadow: '-4px 0 40px rgba(0,0,0,0.15)', marginLeft: 'auto' };

  return (
    <div style={container} onClick={isPageMode ? undefined : onClose}>
      <div className="flex flex-col overflow-y-auto" style={panel} onClick={isPageMode ? undefined : e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between shrink-0"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2a4a7a 100%)' }}>
          <div>
            <h2 className="text-base font-extrabold text-white">⚙️ CDP — Admin Panel</h2>
            <p className="text-[10px] mt-0.5 text-white/60">Edit Journeys, Segments, Channel, AI Insights</p>
          </div>
          <div className="flex gap-2">
            {!isPageMode && (
              <button onClick={() => {
                if (!confirm('Reset semua data ke default?')) return;
                localStorage.removeItem(STORAGE_KEY);
                onChange(getDefaultCDP());
              }}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white/80 hover:text-white" style={{ background: 'rgba(255,255,255,15)' }}>
                Reset
              </button>
            )}
            {!isPageMode && onClose && (
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'rgba(255,255,255,15)' }}>✕</button>
            )}
          </div>
        </div>

        {/* Section nav */}
        <div className="px-4 pt-4 pb-2 shrink-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="grid grid-cols-4 gap-1">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className="py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                style={activeSection === s.id
                  ? { background: '#1e3a5f', color: '#fff' }
                  : { background: '#f3f4f6', color: '#6b7280' }}>
                <span>{s.icon}</span><span>{s.label}</span>
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[9px]"
                  style={activeSection === s.id ? { background: 'rgba(255,255,255,20)' } : { background: '#e5e7eb', color: '#6b7280' }}>
                  {s.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4">

          {/* ── JOURNEYS ── */}
          {activeSection === 'journeys' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold" style={{ color: '#374151' }}>Customer Journeys ({data.journeys.length})</h3>
                <button onClick={() => setAddingJourney(true)}
                  className="text-[11px] px-3 py-1.5 rounded-lg font-semibold" style={{ background: '#f0fdf4', color: '#10b981' }}>
                  + New Journey
                </button>
              </div>
              <div className="space-y-2">
                {data.journeys.map(j => (
                  <div key={j.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f9fafb', border: `1px solid ${j.color}30` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${j.color}20` }}>
                      <span className="text-sm font-black" style={{ color: j.color }}>{j.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate" style={{ color: '#111827' }}>{j.name}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                          j.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          j.status === 'paused' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>{j.status}</span>
                      </div>
                      <span className="text-[10px] truncate" style={{ color: '#9ca3af' }}>{j.trigger}</span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditingJourney(j)} className="px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ background: '#e0e7ff', color: '#6366f1' }}>
                        <PencilSimple size={11} />
                      </button>
                      <button onClick={() => {
                        if (!confirm(`Delete "${j.name}"?`)) return;
                        setJourneys(data.journeys.filter(x => x.id !== j.id));
                      }} className="px-2 py-1 rounded-lg text-[10px] font-semibold text-red-500" style={{ background: '#fef2f2' }}>
                        <Trash size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SEGMENTS ── */}
          {activeSection === 'segments' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold" style={{ color: '#374151' }}>User Segments ({data.segments.length})</h3>
                <button onClick={() => setAddingSegment(true)}
                  className="text-[11px] px-3 py-1.5 rounded-lg font-semibold" style={{ background: '#f0fdf4', color: '#10b981' }}>
                  + New Segment
                </button>
              </div>
              <div className="space-y-2">
                {data.segments.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f9fafb', borderLeft: `3px solid ${s.color}` }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: '#111827' }}>{s.name}</span>
                        <span className="text-xs font-extrabold" style={{ color: s.color }}>{s.count.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px]" style={{ color: '#9ca3af' }}>{s.description}</span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditingSegment(s)} className="px-2 py-1 rounded-lg" style={{ background: '#e0e7ff', color: '#6366f1' }}>
                        <PencilSimple size={11} />
                      </button>
                      <button onClick={() => {
                        if (!confirm(`Delete "${s.name}"?`)) return;
                        setSegments(data.segments.filter(x => x.id !== s.id));
                      }} className="px-2 py-1 rounded-lg text-red-500" style={{ background: '#fef2f2' }}>
                        <Trash size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── HYBRID CHANNEL ── */}
          {activeSection === 'hybrid' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold" style={{ color: '#374151' }}>Hybrid Channel Map ({data.hybrid.length})</h3>
                <button onClick={addHybrid}
                  className="text-[11px] px-3 py-1.5 rounded-lg font-semibold" style={{ background: '#f0fdf4', color: '#10b981' }}>
                  + Add Row
                </button>
              </div>
              <div className="space-y-2">
                {data.hybrid.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#f9fafb', borderLeft: `3px solid ${h.color}` }}>
                    {editingHybridIdx === i ? (
                      <>
                        <input value={h.segment} onChange={e => { const u = [...data.hybrid]; u[i] = { ...u[i], segment: e.target.value }; onChange({ ...data, hybrid: u }); }}
                          className="flex-1 px-2 py-1 rounded-lg border text-xs" style={inputStyle()} />
                        <input type="number" value={h.count} onChange={e => { const u = [...data.hybrid]; u[i] = { ...u[i], count: int(e.target.value) }; onChange({ ...data, hybrid: u }); }}
                          className="w-20 px-2 py-1 rounded-lg border text-xs" style={inputStyle()} />
                        <select value={h.priority} onChange={e => { const u = [...data.hybrid]; u[i] = { ...u[i], priority: e.target.value as HybridChannel['priority'] }; onChange({ ...data, hybrid: u }); }}
                          className="px-2 py-1 rounded-lg border text-xs" style={inputStyle()}>
                          <option value="high">high</option>
                          <option value="medium">medium</option>
                          <option value="low">low</option>
                        </select>
                        <input type="color" value={h.color} onChange={e => { const u = [...data.hybrid]; u[i] = { ...u[i], color: e.target.value }; onChange({ ...data, hybrid: u }); }}
                          className="w-8 h-8 rounded cursor-pointer border-0 p-0" style={{ background: 'none' }} />
                        <button onClick={() => setEditingHybridIdx(null)} className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-600" style={{ background: '#dcfce7' }}>✓</button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold" style={{ color: '#111827' }}>{h.segment}</span>
                          <span className="text-[10px] ml-2" style={{ color: '#9ca3af' }}>{h.count.toLocaleString()} users</span>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {h.channels.map(ch => (
                            <span key={ch} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${h.color}15`, color: h.color }}>{ch}</span>
                          ))}
                          <button onClick={() => startEditHybrid(h, i)} className="px-1.5 py-1 rounded-lg" style={{ background: '#e0e7ff', color: '#6366f1' }}>
                            <PencilSimple size={10} />
                          </button>
                          <button onClick={() => setHybrid(data.hybrid.filter((_, j) => j !== i))} className="px-1.5 py-1 rounded-lg text-red-400" style={{ background: '#fef2f2' }}>
                            <Trash size={10} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* New row form */}
                {editingHybridIdx === -1 && hybridForm && (
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#f0fdf4', border: '1px dashed #10b981' }}>
                    <input value={hybridForm.segment} onChange={e => setHybridForm({ ...hybridForm, segment: e.target.value })}
                      placeholder="Segment name" className="flex-1 px-2 py-1 rounded-lg border text-xs" style={inputStyle()} />
                    <input type="number" value={hybridForm.count} onChange={e => setHybridForm({ ...hybridForm, count: int(e.target.value) })}
                      placeholder="Count" className="w-20 px-2 py-1 rounded-lg border text-xs" style={inputStyle()} />
                    <select value={hybridForm.priority} onChange={e => setHybridForm({ ...hybridForm, priority: e.target.value as HybridChannel['priority'] })}
                      className="px-2 py-1 rounded-lg border text-xs" style={inputStyle()}>
                      <option value="high">high</option><option value="medium">medium</option><option value="low">low</option>
                    </select>
                    <input type="color" value={hybridForm.color} onChange={e => setHybridForm({ ...hybridForm, color: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0" style={{ background: 'none' }} />
                    <button onClick={saveNewHybrid} className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-600" style={{ background: '#dcfce7' }}>✓ Add</button>
                    <button onClick={() => { setEditingHybridIdx(null); setHybridForm(null); }} className="px-2 py-1 rounded-lg text-xs text-red-400" style={{ background: '#fef2f2' }}>✕</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── AI INSIGHTS ── */}
          {activeSection === 'insights' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold" style={{ color: '#374151' }}>AI Insights ({data.insights.length})</h3>
                <button onClick={() => setAddingInsight(true)}
                  className="text-[11px] px-3 py-1.5 rounded-lg font-semibold" style={{ background: '#f0fdf4', color: '#10b981' }}>
                  + New Insight
                </button>
              </div>
              <div className="space-y-2">
                {data.insights.map(ins => (
                  <div key={ins.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#f9fafb', borderLeft: `3px solid ${ins.color}` }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${ins.color}20` }}>
                      <span className="text-xs font-black" style={{ color: ins.color }}>
                        {ins.iconType === 'TrendDown' ? '↓' : ins.iconType === 'TrendUp' ? '↑' : ins.iconType === 'Warning' ? '⚠' : '⚡'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${
                          ins.priority === 'high' ? 'bg-red-100 text-red-700' :
                          ins.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>{ins.priority}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{ins.type}</span>
                      </div>
                      <p className="text-[11px] font-bold leading-tight" style={{ color: '#111827' }}>{ins.title}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditingInsight(ins)} className="px-2 py-1 rounded-lg" style={{ background: '#e0e7ff', color: '#6366f1' }}>
                        <PencilSimple size={11} />
                      </button>
                      <button onClick={() => {
                        if (!confirm(`Delete insight "${ins.title}"?`)) return;
                        setInsights(data.insights.filter(x => x.id !== ins.id));
                      }} className="px-2 py-1 rounded-lg text-red-400" style={{ background: '#fef2f2' }}>
                        <Trash size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 flex items-center justify-between" style={{ background: '#f8fafc', borderTop: '1px solid #e5e7eb' }}>
          <p className="text-[11px]" style={{ color: '#9ca3af' }}>✅ Auto-save aktif</p>
          {!isPageMode && onClose && (
            <button onClick={onClose} className="px-6 py-2 rounded-xl text-xs font-bold text-white" style={{ background: '#1e3a5f' }}>Done</button>
          )}
        </div>
      </div>

      {/* Modals */}
      {(addingJourney || editingJourney) && (
        <JourneyEditor
          journey={editingJourney}
          onSave={(j) => {
            if (editingJourney) {
              setJourneys(data.journeys.map(x => x.id === j.id ? j : x));
              setEditingJourney(null);
            } else {
              setJourneys([...data.journeys, j]);
              setAddingJourney(false);
            }
          }}
          onCancel={() => { setEditingJourney(null); setAddingJourney(false); }}
          onDelete={editingJourney ? () => {
            setJourneys(data.journeys.filter(x => x.id !== editingJourney.id));
            setEditingJourney(null);
          } : undefined}
        />
      )}

      {(addingSegment || editingSegment) && (
        <SegmentEditor
          segment={editingSegment}
          onSave={(s) => {
            if (editingSegment) {
              setSegments(data.segments.map(x => x.id === s.id ? s : x));
              setEditingSegment(null);
            } else {
              setSegments([...data.segments, s]);
              setAddingSegment(false);
            }
          }}
          onCancel={() => { setEditingSegment(null); setAddingSegment(false); }}
          onDelete={editingSegment ? () => {
            setSegments(data.segments.filter(x => x.id !== editingSegment.id));
            setEditingSegment(null);
          } : undefined}
        />
      )}

      {(addingInsight || editingInsight) && (
        <InsightEditor
          insight={editingInsight}
          onSave={(i) => {
            if (editingInsight) {
              setInsights(data.insights.map(x => x.id === i.id ? i : x));
              setEditingInsight(null);
            } else {
              setInsights([...data.insights, i]);
              setAddingInsight(false);
            }
          }}
          onCancel={() => { setEditingInsight(null); setAddingInsight(false); }}
          onDelete={editingInsight ? () => {
            setInsights(data.insights.filter(x => x.id !== editingInsight.id));
            setEditingInsight(null);
          } : undefined}
        />
      )}
    </div>
  );
}
