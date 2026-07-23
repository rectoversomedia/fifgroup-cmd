'use client';

import * as React from 'react';
import { GlobeHemisphereWest, Star, TrendUp, TrendDown, Minus, Crown } from '@phosphor-icons/react';

export default function CompetitorsPage() {
  const [tab, setTab] = React.useState<'fifgo' | 'fifada'>('fifgo');

  const competitors = {
    fifgo: [
      { rank: 1, name: 'FIFGO', rating: 4.2, downloads: '850K', change: 0, isSelf: true },
      { rank: 2, name: 'CashCash', rating: 4.0, downloads: '720K', change: 1, isSelf: false },
      { rank: 3, name: 'EasyCash', rating: 3.9, downloads: '680K', change: -1, isSelf: false },
      { rank: 4, name: 'Duitku', rating: 3.8, downloads: '620K', change: 0, isSelf: false },
      { rank: 5, name: 'PinjolPro', rating: 3.7, downloads: '540K', change: 2, isSelf: false },
    ],
    fifada: [
      { rank: 1, name: 'FIFADA', rating: 3.8, downloads: '210K', change: 0, isSelf: true },
      { rank: 2, name: 'AstraPay', rating: 4.1, downloads: '890K', change: 0, isSelf: false },
      { rank: 3, name: 'DanaSiap', rating: 3.9, downloads: '320K', change: 1, isSelf: false },
      { rank: 4, name: 'KTAInstan', rating: 3.6, downloads: '280K', change: -1, isSelf: false },
    ],
  };

  const data = competitors[tab];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Competitors</h1>
          <p className="text-sm text-slate-400 mt-0.5">Finance Category — Indonesia · June 2026</p>
        </div>
        <div className="flex gap-2">
          {[['fifgo', 'FIFGO'], ['fifada', 'FIFADA']].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={tab === t ? { background: 'rgba(79,142,247,0.2)', border: '1px solid rgba(79,142,247,0.3)', color: '#60a5fa' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Ranking Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="px-5 py-4" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GlobeHemisphereWest size={16} className="text-blue-400" />
            Finance Category Rankings — {tab.toUpperCase()}
          </h3>
        </div>
        <div className="p-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] text-slate-500 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">App</div>
            <div className="col-span-3 text-right">Rating</div>
            <div className="col-span-2 text-right">Downloads</div>
            <div className="col-span-1 text-right">Δ</div>
          </div>
          {/* Rows */}
          {data.map((app, i) => (
            <div
              key={app.name}
              className="grid grid-cols-12 gap-2 px-3 py-3 rounded-xl items-center transition-all"
              style={{
                background: app.isSelf ? 'rgba(79,142,247,0.08)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                border: app.isSelf ? '1px solid rgba(79,142,247,0.2)' : '1px solid transparent',
              }}
            >
              <div className="col-span-1">
                {app.rank === 1 ? (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.15)' }}>
                    <Crown size={14} className="text-amber-400" weight="fill" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                    #{app.rank}
                  </div>
                )}
              </div>
              <div className="col-span-5 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: app.isSelf ? 'linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.08)' }}
                >
                  {app.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    {app.name}
                    {app.isSelf && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-400/10 text-blue-400">You</span>}
                  </p>
                </div>
              </div>
              <div className="col-span-3 text-right flex items-center justify-end gap-1.5">
                <Star size={12} className="text-amber-400" weight="fill" />
                <span className="text-sm font-bold text-white">{app.rating}</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-semibold text-slate-300">{app.downloads}</span>
              </div>
              <div className="col-span-1 text-right">
                {app.change > 0 ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                    <TrendUp size={11} weight="bold" />+{app.change}
                  </span>
                ) : app.change < 0 ? (
                  <span className="text-xs font-bold text-rose-400 flex items-center justify-end gap-0.5">
                    <TrendDown size={11} weight="bold" />{app.change}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 className="text-sm font-bold text-white mb-4">Gap Analysis</h3>
        <div className="space-y-3">
          {[
            { label: 'Rating vs CashCash', diff: '+0.2', good: true },
            { label: 'Downloads vs CashCash', diff: '+130K', good: true },
            { label: 'Rating gap to AstraPay (FIFADA)', diff: '-0.3', good: false },
            { label: 'Position maintained', diff: '#1', good: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-xs text-slate-400">{item.label}</span>
              <span className={`text-xs font-bold ${item.good ? 'text-emerald-400' : 'text-rose-400'}`}>{item.diff}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
