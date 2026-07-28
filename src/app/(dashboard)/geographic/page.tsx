'use client';

import * as React from 'react';
import {
  MapPin, TrendUp, TrendDown, Users,
  Globe, CaretDown, CaretUp,
} from '@phosphor-icons/react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getGeographicData } from '@/lib/data-sim';

export default function GeographicPage() {
  const [timeStr, setTimeStr] = React.useState('--:--');
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const { data, isLoading } = React.useMemo(() => {
    return { data: null, isLoading: true };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data directly without useRealtime to avoid loading state
  const [geoData, setGeoData] = React.useState<Awaited<ReturnType<typeof getGeographicData>> | null>(null);

  React.useEffect(() => {
    getGeographicData().then(setGeoData);
  }, []);

  const fmtIDR = (v: number) => {
    if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}B`;
    return `Rp ${v.toLocaleString('id-ID')}`;
  };

  if (!geoData) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { regions, provinces, topBranches } = geoData;
  const totalDisb = regions.reduce((s, r) => s + r.disbursement, 0);

  const totalLoans = regions.reduce((s, r) => s + r.activeLoan, 0);
  const weightedNPF = regions.reduce((s, r) => s + r.npfRate * r.activeLoan, 0) / totalLoans;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Geographic Distribution</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Portfolio spread across regions · Branches performance</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* Headline */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Regions', value: regions.length, icon: Globe, color: '#1e3a5f' },
          { label: 'Top Province', value: provinces[0].province, icon: MapPin, color: '#4f8ef7' },
          { label: 'Active Loans', value: totalLoans.toLocaleString('id-ID'), icon: Users, color: '#10b981' },
          { label: 'Blended NPF', value: `${weightedNPF.toFixed(1)}%`, icon: TrendDown, color: weightedNPF > 3 ? '#dc2626' : '#10b981' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={18} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-2xl font-extrabold mb-1" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Disbursement by Region</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={regions} dataKey="disbursement" nameKey="region" cx="50%" cy="50%" outerRadius={90} innerRadius={40} paddingAngle={3}>
                {regions.map((r, i) => <Cell key={r.region} fill={r.color} />)}
              </Pie>
              <Tooltip formatter={(v: unknown) => [fmtIDR(v as number), 'Disbursement']} contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }} />
              <Legend formatter={(v: unknown) => <span style={{ color: '#374151', fontSize: 12 }}>{String(v)}</span>} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {regions.map(r => {
              const pct = Math.round((r.disbursement / totalDisb) * 100);
              return (
                <div key={r.region} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: r.color }} />
                  <span className="text-xs font-medium flex-1" style={{ color: '#374151' }}>{r.region}</span>
                  <span className="text-xs font-bold" style={{ color: '#111827' }}>{pct}%</span>
                  <span className="text-xs w-20 text-right" style={{ color: '#9ca3af' }}>{fmtIDR(r.disbursement)}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{
                    background: r.npfRate > 3 ? '#fef2f2' : '#f0fdf4',
                    color: r.npfRate > 3 ? '#dc2626' : '#10b981',
                  }}>NPF {r.npfRate}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regional NPF Comparison */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>NPF Rate by Region</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={regions} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 5]} />
              <Tooltip formatter={(v: unknown) => [`${v}%`, 'NPF Rate']} contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="npfRate" radius={[6, 6, 0, 0]}>
                {regions.map(r => (
                  <Cell key={r.region} fill={r.npfRate > 3 ? '#dc2626' : r.npfRate > 2 ? '#f59e0b' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            {[
              { color: '#10b981', label: '< 2% Good' },
              { color: '#f59e0b', label: '2-3% Watch' },
              { color: '#dc2626', label: '> 3% Alert' },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                <span className="text-[10px]" style={{ color: '#9ca3af' }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Province Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Top Provinces</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                <th className="text-left pb-3 pl-6 pr-4">Province</th>
                <th className="text-right pb-3 pr-4">Disbursement</th>
                <th className="text-right pb-3 pr-4">Active Loans</th>
                <th className="text-center pb-3 pr-4">NPF Rate</th>
                <th className="text-left pb-3 pr-6">Performance</th>
              </tr>
            </thead>
            <tbody>
              {provinces.map((p, i) => {
                const npf = p.npfRate;
                const isWarn = npf > 2.5;
                return (
                  <tr key={p.province} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: i < 3 ? '#1e3a5f' : i < 6 ? '#4f8ef7' : '#94a3b8' }}>
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: '#111827' }}>{p.province}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className="text-sm font-semibold" style={{ color: '#111827' }}>{fmtIDR(p.disbursement)}</span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className="text-sm font-semibold" style={{ color: '#374151' }}>{p.activeLoan.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{
                        background: isWarn ? '#fef2f2' : '#f0fdf4',
                        color: isWarn ? '#dc2626' : '#10b981',
                      }}>{npf}%</span>
                    </td>
                    <td className="py-4 pr-6">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.min((p.disbursement / provinces[0].disbursement) * 100, 100)}%`, background: isWarn ? '#dc2626' : '#1e3a5f' }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Branches */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Top Performing Branches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topBranches.map((b, i) => (
            <div key={b.name} className="rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: '#1e3a5f' }}>{i + 1}</span>
                <span className="text-xs font-bold" style={{ color: '#374151' }}>{b.name}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[10px]" style={{ color: '#9ca3af' }}>Disbursement</span>
                  <span className="text-[10px] font-bold" style={{ color: '#111827' }}>{fmtIDR(b.disbursement)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px]" style={{ color: '#9ca3af' }}>NPF</span>
                  <span className="text-[10px] font-bold" style={{ color: b.npfRate > 2 ? '#dc2626' : '#10b981' }}>{b.npfRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px]" style={{ color: '#9ca3af' }}>Region</span>
                  <span className="text-[10px] font-medium" style={{ color: '#6b7280' }}>{b.region}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
