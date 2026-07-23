'use client';

import * as React from 'react';
import { ListChecks, CheckCircle, Clock, Trash, ArrowRight, TrendUp, Lightning, Star } from '@phosphor-icons/react';

const recommendations = [
  { id: 'rec-1', priority: 'high', category: 'ASO', title: 'Address FIFADA Rating Decline', desc: 'FIFADA rating dropped 0.4★. 60% negative reviews cite long branch process. Sync with operations team.', impact: '+0.3★ rating within 2 weeks', effort: 'medium', status: 'pending', app: 'FIFADA', lob: null },
  { id: 'rec-2', priority: 'high', category: 'Funnel', title: 'Simplify SPEKTRA Document Upload', desc: '62% drop at document upload. Reduce required documents from 6 to 3 core documents.', impact: '+2,100 applications/month', effort: 'low', status: 'pending', app: null, lob: 'SPEKTRA' },
  { id: 'rec-3', priority: 'medium', category: 'ASO', title: 'Update FIFGO Screenshots', desc: 'Screenshots not updated in 6 months. Competitors have updated visuals with video preview.', impact: '+8% conversion rate', effort: 'low', status: 'pending', app: 'FIFGO', lob: null },
  { id: 'rec-4', priority: 'medium', category: 'Engagement', title: 'Cross-Sell Campaign for Single-LoB Users', desc: '34,821 users have only 1 LoB product. Target DANASTRA for FIFASTRA customers.', impact: 'Rp 4.2B/month incremental', effort: 'medium', status: 'pending', app: null, lob: null },
  { id: 'rec-5', priority: 'medium', category: 'Retention', title: 'SPEKTRA Disbursement SLA Improvement', desc: 'SPEKTRA Month-2 retention 52% vs 60% benchmark. Improve disbursement speed to 3 days.', impact: '+8pts retention', effort: 'high', status: 'pending', app: null, lob: 'SPEKTRA' },
  { id: 'rec-6', priority: 'low', category: 'Hybrid', title: 'Add In-App Selfie Quality Validation', desc: 'KYC rejection causing 18% of branch visits. Add real-time selfie check before submission.', impact: '-60% KYC rejections', effort: 'low', status: 'pending', app: 'FIFGO', lob: null },
];

const categoryColors: Record<string, string> = { ASO: '#4f8ef7', Funnel: '#8b5cf6', Engagement: '#10b981', Retention: '#f59e0b', Hybrid: '#06b6d4' };
const effortColors: Record<string, string> = { low: 'text-emerald-400', medium: 'text-amber-400', high: 'text-rose-400' };

export default function RecommendationsPage() {
  const [filter, setFilter] = React.useState<string>('all');

  const filtered = filter === 'all' ? recommendations : recommendations.filter(r => r.priority === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Recommendations</h1>
          <p className="text-sm text-slate-400 mt-0.5">AI-generated actionable recommendations — June 2026</p>
        </div>
        <div className="flex gap-2">
          {[['all', 'All'], ['high', 'High'], ['medium', 'Medium'], ['low', 'Low']].map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={filter === f ? { background: 'rgba(79,142,247,0.2)', border: '1px solid rgba(79,142,247,0.3)', color: '#60a5fa' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(rec => (
          <div key={rec.id} className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                    style={{ background: rec.priority === 'high' ? 'rgba(244,63,94,0.1)' : rec.priority === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)', color: rec.priority === 'high' ? '#f43f5e' : rec.priority === 'medium' ? '#f59e0b' : '#6b7280' }}>
                    {rec.priority}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${categoryColors[rec.category]}15`, color: categoryColors[rec.category] }}>
                    {rec.category}
                  </span>
                  {rec.app && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-400/10 text-blue-400">{rec.app}</span>}
                  {rec.lob && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-400/10 text-purple-400">{rec.lob}</span>}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{rec.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{rec.desc}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <TrendUp size={12} className="text-emerald-400" />
                    <span className="text-xs text-emerald-400">{rec.impact}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lightning size={12} className={effortColors[rec.effort]} />
                    <span className={`text-xs font-medium ${effortColors[rec.effort]}`}>Effort: {rec.effort}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                  title="Accept"
                >
                  <CheckCircle size={16} className="text-emerald-400" />
                </button>
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  title="Dismiss"
                >
                  <Trash size={14} className="text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
