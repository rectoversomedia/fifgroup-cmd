'use client';

import * as React from 'react';
import { Brain, CheckCircle, Lightning, Warning, TrendUp, TrendDown, User, AppWindow } from '@phosphor-icons/react';

export default function AIInsightsPage() {
  const insights = [
    {
      id: 'ins-1',
      type: 'funnel',
      icon: TrendDown,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-400/10',
      priority: 'high',
      title: 'SPEKTRA: 62% Drop-off at Document Upload Stage',
      finding: 'Of 31,200 users who started SPEKTRA application, 19,400 (62%) dropped off during document upload. Top rejected document: selfie with ID.',
      rootCause: 'Selfie quality requirements unclear. Users unaware of acceptable photo format. Average 2.3 attempts per user.',
      confidence: 'high',
      basedOn: '31,200 application_started events, 19,400 document_upload_failed events',
      apps: null,
      lobs: ['SPEKTRA'],
    },
    {
      id: 'ins-2',
      type: 'engagement',
      icon: TrendUp,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10',
      priority: 'high',
      title: 'Cross-Sell Opportunity: 34K Single-LoB Users',
      finding: '34,821 FIFGO users have only 1 LoB product active. Best cross-sell pair: FIFASTRA → DANASTRA (42% natural fit based on loan purpose overlap).',
      rootCause: 'No proactive cross-sell nudge at key moments. App lacks "You might also like" prompts after first loan completion.',
      confidence: 'high',
      basedOn: '34,821 users with 1 LoB product, cohort analysis of multi-product users',
      apps: ['FIFGO'],
      lobs: ['FIFASTRA', 'DANASTRA'],
    },
    {
      id: 'ins-3',
      type: 'retention',
      icon: Warning,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-400/10',
      priority: 'medium',
      title: 'SPEKTRA Month-2 Retention 52% — Below 60% Benchmark',
      finding: 'SPEKTRA cohort Month-2 retention is 52%, 8 points below the 60% benchmark. 71% of churned users had disbursement delay >5 days.',
      rootCause: 'SPEKTRA disbursement SLA averaging 4.8 days vs 3.2 days for FIFASTRA. Users switch to faster alternatives.',
      confidence: 'high',
      basedOn: 'Cohort analysis of 12,400 SPEKTRA disbursed users',
      apps: null,
      lobs: ['SPEKTRA'],
    },
    {
      id: 'ins-4',
      type: 'hybrid',
      icon: Lightning,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-400/10',
      priority: 'medium',
      title: 'KYC Document Rejection Causing 18% of Branch Visits',
      finding: '18% of users who visited branch after app start were rejected for KYC documents — primarily due to selfie quality issues. Add in-app validation could eliminate 60% of these visits.',
      rootCause: 'No real-time selfie quality check before submission. Users only discover rejection after arriving at branch.',
      confidence: 'high',
      basedOn: '8,432 branch_locator_viewed events, 1,520 branch_visit_triggered with KYC reason',
      apps: ['FIFGO'],
      lobs: null,
    },
    {
      id: 'ins-5',
      type: 'aso',
      icon: TrendUp,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-400/10',
      priority: 'info',
      title: 'FIFGO ASO Momentum: +23% Downloads, #1 Category Rank',
      finding: 'FIFGO downloads up 23% WoW driven by improved Finance category ranking. Moved from #2 to #1 position. Screenshot update from Q2 was effective.',
      rootCause: 'Updated screenshots with benefit-focused messaging and keyword placement. 8 new keywords ranked in top 10.',
      confidence: 'high',
      basedOn: 'AppTweak download tracking, category ranking API, 8-week trend',
      apps: ['FIFGO'],
      lobs: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">AI Insights</h1>
          <p className="text-sm text-slate-400 mt-0.5">AI-generated analysis from FIFGROUP data — June 2026</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
          <Brain size={14} className="text-rose-400" weight="fill" />
          <span className="text-xs font-semibold text-rose-400">AI Powered</span>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(31,41,55,0.9) 100%)', border: '1px solid rgba(244,63,94,0.15)' }}>
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-rose-300 font-semibold">5 AI insights</span> generated this period. <span className="text-emerald-300 font-semibold">2 high priority actions</span> require immediate attention. Main opportunity: <span className="text-blue-300">SPEKTRA document upload simplification</span> — potential +2,100 applications/month.
        </p>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map(insight => (
          <div key={insight.id} className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${insight.iconBg}`}>
                <insight.icon size={20} className={insight.iconColor} weight="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
                    style={{ background: insight.priority === 'high' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)', color: insight.priority === 'high' ? '#f43f5e' : '#f59e0b' }}>
                    {insight.priority}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{insight.type}</span>
                  {insight.apps?.map(a => (
                    <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-400/10 text-blue-400">{a.toUpperCase()}</span>
                  ))}
                  {insight.lobs?.map(l => (
                    <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-400/10 text-purple-400">{l}</span>
                  ))}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{insight.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{insight.finding}</p>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Root Cause</p>
                    <p className="text-xs text-slate-300">{insight.rootCause}</p>
                  </div>
                  <div className="p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Based On</p>
                    <p className="text-xs text-slate-300">{insight.basedOn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <CheckCircle size={12} className="text-emerald-400" weight="fill" />
                  <span className="text-[11px] text-slate-500">AI Confidence: <span className="text-emerald-400 font-semibold">{insight.confidence}</span></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
