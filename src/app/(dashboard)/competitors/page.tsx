'use client';

import * as React from 'react';
import {
  TrendUp, TrendDown, Globe, Star, ChartBar,
} from '@phosphor-icons/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { getCompetitorsData } from '@/lib/data-sim';

export default function CompetitorsPage() {
  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const [data, setData] = React.useState<Awaited<ReturnType<typeof getCompetitorsData>> | null>(null);
  const [expandedCompany, setExpandedCompany] = React.useState<string | null>(null);

  React.useEffect(() => {
    getCompetitorsData().then(setData);
  }, []);

  const fmtNum = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return String(v);
  };

  if (!data) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { marketShare, products, digitalComparison } = data;
  const radarData = digitalComparison.map(d => ({
    metric: d.metric,
    FIFGROUP: d.fifgroup,
    Adira: d.adira,
    BFI: d.bfi,
  }));

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Competitor Analysis</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Market share · Product comparison · Digital benchmark</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* Market Share + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Market Share — Multi Finance Indonesia</h3>
          <div className="space-y-3">
            {marketShare.map(m => (
              <div key={m.company}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: '#374151' }}>{m.company}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: '#111827' }}>{m.share}%</span>
                    {m.trend.startsWith('+')
                      ? <TrendUp size={10} style={{ color: '#10b981' }} weight="bold" />
                      : <TrendDown size={10} style={{ color: '#dc2626' }} weight="bold" />}
                    <span className="text-[10px]" style={{ color: m.trend.startsWith('+') ? '#10b981' : '#dc2626' }}>{m.trend}</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.share}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-3 text-right" style={{ color: '#9ca3af' }}>Source: OJK · internal research · Jul 2026</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Digital Performance Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} margin={{ top: 0, right: 40, bottom: 0, left: 40 }}>
              <PolarGrid stroke="#f3f4f6" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Radar name="FIFGROUP" dataKey="FIFGROUP" stroke="#1e3a5f" fill="#1e3a5f" fillOpacity={0.2} />
              <Radar name="Adira" dataKey="Adira" stroke="#4f8ef7" fill="#4f8ef7" fillOpacity={0.1} />
              <Radar name="BFI" dataKey="BFI" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              <Legend formatter={(v: string) => <span style={{ color: '#374151', fontSize: 11 }}>{v}</span>} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Digital Comparison Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Digital KPI Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                <th className="text-left pb-3 pl-6 pr-4">Metric</th>
                <th className="text-center pb-3 pr-4"><span style={{ color: '#1e3a5f' }}>FIFGROUP</span><div className="text-[9px] font-normal normal-case" style={{ color: '#9ca3af' }}>Leader</div></th>
                <th className="text-center pb-3 pr-4" style={{ color: '#4f8ef7' }}>Adira</th>
                <th className="text-center pb-3 pr-6" style={{ color: '#10b981' }}>BFI</th>
              </tr>
            </thead>
            <tbody>
              {digitalComparison.map(d => {
                const vals = [d.fifgroup, d.adira, d.bfi];
                const bestIdx = vals.indexOf(Math.max(...vals));
                return (
                  <tr key={d.metric} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td className="py-4 pl-6 pr-4 text-xs font-medium" style={{ color: '#374151' }}>{d.metric}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="py-4 pr-4 text-center">
                        <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{
                          background: bestIdx === i ? '#f0fdf4' : '#f9fafb',
                          color: bestIdx === i ? '#065f46' : '#374151',
                        }}>{typeof v === 'number' && v < 100 ? `${v}${v > 10 ? '' : '%'}` : fmtNum(v)}</span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Comparison */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Product Line Comparison</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {products.map(company => (
            <div key={company.company}>
              <button
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                onClick={() => setExpandedCompany(prev => prev === company.company ? null : company.company)}
              >
                <div className="flex items-center gap-3">
                  <Globe size={16} style={{ color: '#9ca3af' }} />
                  <span className="text-sm font-bold" style={{ color: '#111827' }}>{company.company}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                    {company.products.length} products
                  </span>
                </div>
                <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" style={{ color: '#9ca3af', transform: expandedCompany === company.company ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'block' }}>
                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,172.69l74.34-82.35a8,8,0,0,1,11.32,11.32Z" />
                </svg>
              </button>
              {expandedCompany === company.company && (
                <div className="px-5 pb-5 overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="text-[10px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                        <th className="text-left pb-2 pr-4">Product</th>
                        <th className="text-center pb-2 pr-4">Interest Rate</th>
                        <th className="text-center pb-2 pr-4">Tenor</th>
                        <th className="text-center pb-2 pr-4">Max Loan</th>
                        <th className="text-left pb-2">Key Strength</th>
                      </tr>
                    </thead>
                    <tbody>
                      {company.products.map(p => (
                        <tr key={p.name} style={{ borderBottom: '1px solid #f9fafb' }}>
                          <td className="py-3 pr-4"><span className="text-xs font-bold" style={{ color: '#374151' }}>{p.name}</span></td>
                          <td className="py-3 pr-4 text-center"><span className="text-xs font-semibold" style={{ color: '#dc2626' }}>{p.rate}</span></td>
                          <td className="py-3 pr-4 text-center"><span className="text-xs" style={{ color: '#6b7280' }}>{p.tenor}</span></td>
                          <td className="py-3 pr-4 text-center"><span className="text-xs" style={{ color: '#6b7280' }}>{p.maxLoan}</span></td>
                          <td className="py-3"><span className="text-[11px]" style={{ color: '#10b981' }}>{p.strength}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Strengths + Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendUp size={18} style={{ color: '#10b981' }} weight="fill" />
            <h3 className="text-sm font-bold text-white">Competitive Advantages</h3>
          </div>
          <div className="space-y-3">
            {[
              'Widest branch network in Indonesia (3,200+ points)',
              'Highest app downloads among multi-finance (850K)',
              'Best NPS score: 62 (vs industry avg 48)',
              'Fastest avg disbursement: 3.8 days',
              '67% digital channel mix (vs Adira 48%, BFI 31%)',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] text-white/80">{i + 1}</span>
                </div>
                <span className="text-sm text-white/90">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-red-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendDown size={18} style={{ color: '#dc2626' }} weight="fill" />
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Areas to Watch</h3>
          </div>
          <div className="space-y-3">
            {[
              'FIFADA app rating lagging (3.8★ vs competitors 4.0★)',
              'FIFADA crash rate (1.4%) — urgent fix needed',
              'SPEKTRA NPF at 4.2% — highest among LoBs',
              'Slower KOL/Influencer ROAS (3.2 vs industry 4.5)',
              'AMITRA disbursement SLA slightly above target',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px]" style={{ color: '#dc2626' }}>!</span>
                </div>
                <span className="text-sm" style={{ color: '#374151' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
