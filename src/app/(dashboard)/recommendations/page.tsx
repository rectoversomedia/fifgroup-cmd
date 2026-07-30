'use client';

import * as React from 'react';
import { Brain, TrendUp, Lightning, Warning, Star, CheckCircle } from '@phosphor-icons/react';

const RECS = [
  {
    id: 1,
    icon: Lightning,
    category: 'Automation',
    priority: 'high',
    title: 'Add Day-3 promo step to New User journey',
    desc: 'Users who registered 3 days ago but did not start application receive a personalized Rp 50rb cashback offer. Estimated +15% onboarding conversion.',
    impact: '1,860 extra activations/month',
    effort: 'Low',
    effortColor: '#10b981',
    color: '#4f8ef7',
    metric: { label: 'Est. conversions', value: '+15%' },
  },
  {
    id: 2,
    icon: Warning,
    category: 'FIFADA Health',
    priority: 'high',
    title: 'Fix SPEKTRA document upload drop-off',
    desc: '62% drop at document upload stage. Reduce required documents from 6 to 3 core documents. Affects 8,400 potential users/month.',
    impact: '+2,100 applications/month',
    effort: 'Medium',
    effortColor: '#f59e0b',
    color: '#f43f5e',
    metric: { label: 'Drop at stage', value: '-62%' },
  },
  {
    id: 3,
    icon: TrendUp,
    category: 'Cross-Sell',
    priority: 'high',
    title: 'Launch DANASTRA → FIFASTRA cross-sell journey',
    desc: 'DANASTRA has 45K single-product users. A personalized "Upgrade to FIFASTRA" journey with Rp 100rb bonus could unlock Rp 4.8B/mo in new disbursements.',
    impact: 'Rp 4.8B/mo potential',
    effort: 'Low',
    effortColor: '#10b981',
    color: '#06b6d4',
    metric: { label: 'Addressable users', value: '45K' },
  },
  {
    id: 4,
    icon: Brain,
    category: 'CDP',
    priority: 'medium',
    title: 'Resume Dormant Re-Engagement journey',
    desc: 'Paused since June. New creative brief ready. Resume with updated offer: Rp 500rb micro-loan for dormant users with 0% interest first 30 days.',
    impact: 'Re-engage 8,920 users',
    effort: 'Low',
    effortColor: '#10b981',
    color: '#f97316',
    metric: { label: 'Dormant users', value: '8,920' },
  },
  {
    id: 5,
    icon: Star,
    category: 'FIFGO Health',
    priority: 'medium',
    title: 'A/B test: onboarding flow variant B',
    desc: 'Variant B (shorter form, 3 fields only) is showing +12% completion rate vs current flow. Roll out to 100% traffic after 7-day test window.',
    impact: '+12% onboarding completion',
    effort: 'Low',
    effortColor: '#10b981',
    color: '#8b5cf6',
    metric: { label: 'Current rate', value: '42%' },
  },
  {
    id: 6,
    icon: Lightning,
    category: 'Campaign',
    priority: 'low',
    title: 'Plan Q3 brand awareness campaign',
    desc: 'Rp 1.2B budget approved for Aug-Sep. Target: 5M reach across Java. Brief submitted to creative agency. Awaiting pitch deck.',
    impact: '5M reach, 60% awareness',
    effort: 'High',
    effortColor: '#dc2626',
    color: '#f59e0b',
    metric: { label: 'Budget', value: 'Rp 1.2B' },
  },
];

export default function RecommendationsPage() {
  const high = RECS.filter(r => r.priority === 'high').length;
  const medium = RECS.filter(r => r.priority === 'medium').length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>AI Recommendations</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>CDP + data-driven action items — July 2026</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-red-50" style={{ color: '#dc2626' }}>{high} High Priority</span>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-amber-50" style={{ color: '#d97706' }}>{medium} Medium</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { icon: Brain, label: 'Total Recommendations', value: `${RECS.length}`, color: '#4f8ef7' },
          { icon: Lightning, label: 'High Priority', value: `${high}`, color: '#dc2626' },
          { icon: CheckCircle, label: 'Low Effort / High Impact', value: '4', color: '#10b981' },
          { icon: TrendUp, label: 'Est. Revenue Uplift', value: 'Rp 8.4B+', color: '#8b5cf6' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={22} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-base font-bold" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-2 gap-5">
        {RECS.map(r => {
          const Icon = r.icon;
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${r.color}15` }}>
                  <Icon size={20} style={{ color: r.color }} weight="fill" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase" style={{ background: `${r.color}15`, color: r.color }}>{r.category}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      r.priority === 'high' ? 'bg-red-100 text-red-700' : r.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>{r.priority}</span>
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: '#111827' }}>{r.title}</h3>
                </div>
              </div>
              <p className="text-xs mb-4 flex-1" style={{ color: '#6b7280', lineHeight: 1.6 }}>{r.desc}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.priority === 'high' ? 90 : r.priority === 'medium' ? 55 : 25}%`, background: r.color }} />
                </div>
                <span className="text-[10px] font-medium" style={{ color: '#9ca3af' }}>{r.effort} effort</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #f3f4f6' }}>
                <span className="text-xs font-medium" style={{ color: '#10b981' }}>{r.impact}</span>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: r.color }}>{r.metric.value}</p>
                  <p className="text-[10px]" style={{ color: '#9ca3af' }}>{r.metric.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
