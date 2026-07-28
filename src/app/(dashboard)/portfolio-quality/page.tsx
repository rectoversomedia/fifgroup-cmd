'use client';

import * as React from 'react';
import {
  ShieldCheck, Warning, ChartLineUp,
  ArrowDown, ArrowUp, CaretDown, CaretUp,
  Crosshair, Wallet, Bank, TrendUp, TrendDown,
  ShareNetwork,
} from '@phosphor-icons/react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getPortfolioQuality } from '@/lib/data-sim';
import { useRealtime } from '@/lib/use-realtime';

const LOB_META: Record<string, { color: string; abbr: string }> = {
  FIFASTRA: { color: '#1e3a5f', abbr: 'FIF' },
  SPEKTRA:  { color: '#dc2626', abbr: 'SPE' },
  DANASTRA: { color: '#06b6d4', abbr: 'DAN' },
  FINATRA:  { color: '#f59e0b', abbr: 'FIN' },
  AMITRA:   { color: '#10b981', abbr: 'AMI' },
};

export default function PortfolioQualityPage() {
  const [period, setPeriod] = React.useState<'mtd' | 'qtd' | 'ytd'>('mtd');
  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const fetcher = React.useCallback(
    () => getPortfolioQuality(period),
    [period],
  );
  const { data, isLoading } = useRealtime(fetcher, 60_000);

  if (isLoading || !data) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading Portfolio Quality...</p>
        </div>
      </div>
    );
  }

  const { headline, byLoB, monthlyTrend, collectionBuckets, disbursementTarget, disbursementYTD, disbursementTargetYTD } = data;

  const disbursementPct = Math.round((disbursementYTD / disbursementTargetYTD) * 100);
  const worstNPF = [...byLoB].sort((a, b) => b.npfRate - a.npfRate)[0];
  const worstPAR30 = [...byLoB].sort((a, b) => b.par30 - a.par30)[0];

  const fmtIDR = (v: number) => {
    return `Rp ${v.toLocaleString('id-ID')}`;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Portfolio Quality</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>NPF · PAR · Collection Rates · As of {data.asOfDate}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1">
            {(['mtd', 'qtd', 'ytd'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={period === p ? { background: '#1e3a5f', color: 'white' } : { background: 'transparent', color: '#6b7280' }}>
                {p === 'mtd' ? 'Month' : p === 'qtd' ? 'Quarter' : 'Year'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
          </div>
        </div>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            icon: Wallet, color: '#1e3a5f',
            label: 'Total Disbursement', value: fmtIDR(headline.totalDisbursement),
            sub: period === 'mtd' ? 'This month' : period === 'qtd' ? 'This quarter' : 'Year to date',
            trend: '+18%', up: true,
          },
          {
            icon: ShieldCheck, color: headline.npfRate > 3 ? '#dc2626' : '#10b981',
            label: 'NPF Rate', value: `${headline.npfRate}%`,
            sub: 'All LoBs',
            trend: headline.npfRate > 3 ? '⚠ Above 3%' : 'Within target',
            up: false,
          },
          {
            icon: Crosshair, color: headline.par30 > 5 ? '#dc2626' : '#d97706',
            label: 'PAR 30', value: `${headline.par30}%`,
            sub: '30-day delinquency',
            trend: headline.par30 > 5 ? '⚠ Review needed' : 'Stable',
            up: false,
          },
          {
            icon: ChartLineUp, color: '#6366f1',
            label: 'Collection Rate', value: `${headline.collectionRate}%`,
            sub: 'Current month',
            trend: headline.collectionRate > 85 ? '✓ Healthy' : '⚠ Below target',
            up: true,
          },
          {
            icon: Bank, color: '#8b5cf6',
            label: 'Total Outstanding', value: fmtIDR(headline.totalOutstanding),
            sub: 'Portfolio at risk',
            trend: `${headline.par90}% PAR90`,
            up: false,
          },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15` }}>
                <m.icon size={18} style={{ color: m.color }} weight="fill" />
              </div>
              <span className="text-[11px] font-medium" style={{ color: '#9ca3af' }}>{m.label}</span>
            </div>
            <p className="text-2xl font-extrabold mb-1" style={{ color: '#111827' }}>{m.value}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[11px]" style={{ color: '#9ca3af' }}>{m.sub}</span>
              <span className="text-[11px] font-bold" style={{ color: m.color }}>{m.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* YTD Target Progress */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>YTD Disbursement vs Target</h3>
          <span className="text-xs font-bold" style={{ color: '#1e3a5f' }}>{fmtIDR(disbursementYTD)} / {fmtIDR(disbursementTargetYTD)}</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(disbursementPct, 100)}%`, background: disbursementPct >= 80 ? '#10b981' : disbursementPct >= 60 ? '#f59e0b' : '#dc2626' }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{disbursementPct}% achieved</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{fmtIDR(disbursementTargetYTD - disbursementYTD)} remaining</span>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>12-Month Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1e9).toFixed(0)}B`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 6]} />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }}
              formatter={(v: unknown, name: unknown) => {
                const n = name as string;
                const val = v as number;
                if (n === 'disbursement') return [fmtIDR(val), 'Disbursement'];
                return [`${val}%`, n === 'npf' ? 'NPF' : n === 'par30' ? 'PAR30' : 'Collection'];
              }} />
            <Legend formatter={(v) => v === 'disbursement' ? 'Disbursement' : `${v.toUpperCase()} %`} />
            <Line yAxisId="left" type="monotone" dataKey="disbursement" stroke="#1e3a5f" strokeWidth={2} dot={{ r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="npf" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 4" />
            <Line yAxisId="right" type="monotone" dataKey="collection" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* LoB Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Performance by Line of Business</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                <th className="text-left pb-3 pl-6 pr-4">LoB</th>
                <th className="text-right pb-3 pr-4">Disbursement</th>
                <th className="text-right pb-3 pr-4">vs Target</th>
                <th className="text-center pb-3 pr-4">NPF</th>
                <th className="text-center pb-3 pr-4">PAR30</th>
                <th className="text-center pb-3 pr-4">PAR90</th>
                <th className="text-center pb-3 pr-4">Collection</th>
                <th className="text-right pb-3 pr-6">Active Loans</th>
              </tr>
            </thead>
            <tbody>
              {byLoB.map(lob => {
                const vsTarget = Math.round((lob.disbursement / lob.targetDisbursement) * 100);
                const isNPFWarn = lob.npfRate > 3;
                const isPARWarn = lob.par30 > 5;
                const isCollWarn = lob.collectionRate < 85;
                return (
                  <tr key={lob.lob} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white shrink-0" style={{ background: LOB_META[lob.lob]?.color ?? '#1e3a5f' }}>
                          {LOB_META[lob.lob]?.abbr ?? lob.lob[0]}
                        </div>
                        <span className="text-sm font-bold" style={{ color: '#111827' }}>{lob.lob}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className="text-sm font-semibold" style={{ color: '#111827' }}>{fmtIDR(lob.disbursement)}</span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {vsTarget >= 100 ? <TrendUp size={12} style={{ color: '#10b981' }} weight="bold" /> : <TrendDown size={12} style={{ color: '#dc2626' }} weight="bold" />}
                        <span className="text-xs font-bold" style={{ color: vsTarget >= 100 ? '#10b981' : '#dc2626' }}>{vsTarget}%</span>
                      </div>
                    </td>
                    {[
                      { v: lob.npfRate, warn: isNPFWarn },
                      { v: lob.par30, warn: isPARWarn },
                      { v: lob.par90, warn: lob.par90 > 2 },
                    ].map((cell, i) => (
                      <td key={i} className="py-4 pr-4 text-center">
                        <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{
                          background: cell.warn ? '#fef2f2' : '#f0fdf4',
                          color: cell.warn ? '#dc2626' : '#10b981',
                        }}>{cell.v}%</span>
                      </td>
                    ))}
                    <td className="py-4 pr-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold" style={{ color: isCollWarn ? '#dc2626' : '#10b981' }}>{lob.collectionRate}%</span>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${lob.collectionRate}%`, background: isCollWarn ? '#dc2626' : '#10b981' }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <span className="text-sm font-semibold" style={{ color: '#374151' }}>{lob.activeLoan.toLocaleString('id-ID')}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bucket Bars per LoB */}
        <div className="px-6 pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: '#9ca3af' }}>Delinquency Bucket Breakdown</p>
          <div className="space-y-3">
            {byLoB.map(lob => (
              <div key={lob.lob}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: '#374151' }}>{lob.lob}</span>
                  <span className="text-[10px]" style={{ color: '#9ca3af' }}>NPF {lob.npfRate}% · PAR30 {lob.par30}%</span>
                </div>
                <div className="h-6 rounded-lg overflow-hidden flex" style={{ background: '#f3f4f6' }}>
                  {lob.bucket.map(b => (
                    <div key={b.label} className="h-full flex items-center justify-center" style={{ width: `${b.pct}%`, background: b.color, minWidth: b.pct > 0 ? '4px' : '0' }}>
                      {b.pct >= 8 && <span className="text-[9px] font-bold text-white">{b.pct}%</span>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-1 flex-wrap">
                  {lob.bucket.map(b => (
                    <div key={b.label} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                      <span className="text-[10px]" style={{ color: '#9ca3af' }}>{b.label}: {b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collection Bucket Summary */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Collection Bucket Summary</h3>
        <div className="grid grid-cols-5 gap-3">
          {collectionBuckets.map(b => (
            <div key={b.bucket} className="rounded-2xl p-4 border text-center" style={{ background: `${b.color}10`, borderColor: `${b.color}30` }}>
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ background: b.color }} />
              <p className="text-[10px] font-semibold mb-2" style={{ color: '#6b7280' }}>{b.bucket}</p>
              <p className="text-base font-extrabold" style={{ color: b.color }}>{fmtIDR(b.outstanding || b.disbursed)}</p>
              {b.npfCount > 0 && (
                <p className="text-[10px] mt-1" style={{ color: '#9ca3af' }}>{b.npfCount.toLocaleString('id-ID')} accounts</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
