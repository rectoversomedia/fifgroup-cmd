'use client';

import * as React from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Bell, ArrowUp, ArrowDown } from '@phosphor-icons/react';
import { getDashboardKPIs } from '@/lib/data-sim';
import { useRealtime } from '@/lib/use-realtime';

const FIFGO_LOGO  = 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/FIFGO_APP_LOGO-1780892650611.png';
const FIFADA_LOGO = '/images/fifada-logo.jpg';
const LOB_LOGOS: Record<string, string> = {
  FIFASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FIFASTRA-1780538519035.png',
  SPEKTRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20SPEKTRA-1780538544863.png',
  DANASTRA: 'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20DANASTRA-1780538584771.png',
  FINATRA:  'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20FINATRA-1780538626287.png',
  AMITRA:   'https://webcorp-api.fifgroup.co.id/api/v1/media/view/LOGO%20BARU%20LOB%20AMITRA-1780538604037.png',
};

// MAU trend mock (5 periods)
const MAU_TREND = [
  { period: 'Mar', mau: 248000, fifgo: 196000, fifada: 52000 },
  { period: 'Apr', mau: 261000, fifgo: 204000, fifada: 57000 },
  { period: 'May', mau: 275000, fifgo: 214000, fifada: 61000 },
  { period: 'Jun', mau: 289000, fifgo: 225000, fifada: 64000 },
  { period: 'Jul', mau: 296000, fifgo: 234000, fifada: 62000 },
];

const LOB_MIX = [
  { name: 'FIFASTRA', value: 168480, color: '#4f8ef7' },
  { name: 'DANASTRA', value: 142740, color: '#06b6d4' },
  { name: 'AMITRA',   value: 121680, color: '#10b981' },
  { name: 'FINATRA',  value: 105300, color: '#f59e0b' },
  { name: 'SPEKTRA',  value:  65520, color: '#f43f5e' },
];

function fmt(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
 }

function KPICard({ label, value, sub, change, color, loading }: {
  label: string; value: string; sub: string; change: string; color: string; loading: boolean;
}) {
  const isUp = change.startsWith('+');
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center hover:shadow-sm transition-shadow">
      <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>{label}</p>
      {loading ? (
        <Skeleton className="w-24 h-8 mb-2" />
      ) : (
        <p className="text-3xl font-extrabold mb-1" style={{ color: '#111827' }}>{value}</p>
      )}
      <p className="text-[11px] mb-2" style={{ color: '#9ca3af' }}>{sub}</p>
      {loading ? (
        <Skeleton className="w-12 h-5 rounded-full" />
      ) : (
        <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
          style={{ background: isUp ? '#ecfdf5' : '#fef2f2', color: isUp ? '#059669' : '#dc2626' }}>
          {isUp ? <ArrowUp size={10} weight="bold" /> : <ArrowDown size={10} weight="bold" />}
          {change}
        </span>
      )}
    </div>
  );
}

export default function PortfolioPage() {
  const { data: kpis, isLoading } = useRealtime(getDashboardKPIs, 30_000);
  const [tick, setTick] = React.useState(0);
  const [, forceUpdate] = React.useState(0);
  const [timeStr, setTimeStr] = React.useState('--:--');

  // Simulate live ticks
  React.useEffect(() => {
    const t = setInterval(() => forceUpdate(n => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const timer = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Portfolio Overview</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm" style={{ color: '#6b7280' }}>FIFGROUP Digital Command Center</span>
            <span className="text-xs" style={{ color: '#9ca3af' }}>·</span>
            <span className="text-xs" style={{ color: '#9ca3af' }}>July 2026</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>·</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="MAU (Combined)" value={kpis ? `${fmt(kpis.mauCombined)}` : ''} sub="July 2026" change={`+${kpis?.mauChange ?? 12}%`} color="#4f8ef7" loading={isLoading}
        />
        <KPICard
          label="Total Disbursement" value={kpis ? fmt(kpis.disbursement) : ''} sub="July 2026" change={`+${kpis?.disbursementChange ?? 18}%`} color="#10b981" loading={isLoading}
        />
        <KPICard
          label="Conversion Rate" value={kpis ? `${kpis.conversionRate}%` : ''} sub="App → Disbursed" change={`+${kpis?.convChange ?? 0.6}%`} color="#8b5cf6" loading={isLoading}
        />
        <KPICard
          label="CDP Journeys" value={kpis ? `${kpis.activeJourneys}/${kpis.activeJourneys + kpis.draftJourneys}` : ''} sub="1 Draft" change="+1" color="#f59e0b" loading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* MAU Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-1" style={{ color: '#111827' }}>MAU Trend (5 months)</h3>
          <p className="text-[11px] mb-4" style={{ color: '#9ca3af' }}>Combined FIFGO + FIFADA Monthly Active Users</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MAU_TREND} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mauFifgo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="mauFifada" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [typeof v === 'number' ? v.toLocaleString() : String(v), '']}
              />
              <Area type="monotone" dataKey="fifgo" stroke="#1e3a5f" fill="url(#mauFifgo)" strokeWidth={2} name="FIFGO" dot={{ r: 3, fill: '#1e3a5f' }} />
              <Area type="monotone" dataKey="fifada" stroke="#ec4899" fill="url(#mauFifada)" strokeWidth={2} name="FIFADA" dot={{ r: 3, fill: '#ec4899' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[{ label: 'FIFGO', color: '#1e3a5f' }, { label: 'FIFADA', color: '#ec4899' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                <span className="text-[11px]" style={{ color: '#6b7280' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LoB Mix Donut */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold mb-1" style={{ color: '#111827' }}>LoB Mix</h3>
          <p className="text-[11px] mb-4" style={{ color: '#9ca3af' }}>User distribution by LoB</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={LOB_MIX} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                {LOB_MIX.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [typeof v === 'number' ? v.toLocaleString() : String(v), '']} contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {LOB_MIX.map(l => (
              <div key={l.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                <span className="text-[11px] flex-1" style={{ color: '#6b7280' }}>{l.name}</span>
                <span className="text-[11px] font-bold" style={{ color: '#374151' }}>{l.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Health */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-gray-50 border border-gray-200">
            <img src={FIFGO_LOGO} alt="FIFGO" className="w-12 h-12 object-contain" />
          </div>
          <p className="text-sm font-bold" style={{ color: '#111827' }}>FIFGO</p>
          <p className="text-[11px] mb-2" style={{ color: '#9ca3af' }}>Super App</p>
          <span className="text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: '#d1fae5', color: '#065f46' }}>HEALTHY</span>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold" style={{ color: '#111827' }}>234K</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>MAU</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold" style={{ color: '#111827' }}>4.2★</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>Rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl overflow-hidden mb-3 flex items-center justify-center bg-gray-50 border border-gray-200">
            <img src={FIFADA_LOGO} alt="FIFADA" className="w-12 h-12 object-contain" />
          </div>
          <p className="text-sm font-bold" style={{ color: '#111827' }}>FIFADA</p>
          <p className="text-[11px] mb-2" style={{ color: '#9ca3af' }}>Separate App</p>
          <span className="text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: '#fef3c7', color: '#92400e' }}>WATCH</span>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold" style={{ color: '#111827' }}>62K</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>MAU</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-extrabold" style={{ color: '#111827' }}>3.8★</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>Rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col items-center text-center">
          <p className="text-sm font-bold mb-4" style={{ color: '#111827' }}>5 Lines of Business</p>
          <div className="grid grid-cols-3 gap-2 w-full mb-4">
            {Object.entries(LOB_LOGOS).map(([name, url]) => (
              <div key={name} className="bg-gray-50 rounded-xl p-2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src={url} alt={name} className="w-7 h-7 object-contain" />
                </div>
                <p className="text-[9px] font-semibold mt-1" style={{ color: '#374151' }}>{name}</p>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-extrabold" style={{ color: '#1e3a5f' }}>296K</p>
            <p className="text-[10px]" style={{ color: '#9ca3af' }}>Total Users</p>
          </div>
        </div>
      </div>

      {/* Quick Stats + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Quick Stats</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Push Open Rate', value: '48%', color: '#4f8ef7' },
              { label: 'Bill Reminder', value: '94%', color: '#10b981' },
              { label: 'Collection Rate', value: '94.2%', color: '#10b981' },
              { label: 'Avg Disburse', value: '3.8d', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center">
                <p className="text-2xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px]" style={{ color: '#9ca3af' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Priority Alerts</h3>
            <a href="/alerts" className="text-[11px] font-medium" style={{ color: '#dc2626' }}>View All →</a>
          </div>
          <div className="space-y-3">
            {[
              { severity: 'high',   text: 'FIFADA crash rate 1.4% — threshold 0.5%',   color: '#dc2626' },
              { severity: 'high',   text: 'FIFADA error rate 1.4% — above threshold',   color: '#dc2626' },
              { severity: 'high',   text: 'SPEKTRA document drop-off at 62%',            color: '#dc2626' },
              { severity: 'medium', text: 'Push delivery 94.2% — below 95% target',    color: '#d97706' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: a.color }} />
                <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LoB Performance Snapshot */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>LoB Performance Snapshot</h3>
        <div className="space-y-3">
          {[
            { name: 'FIFASTRA', color: '#4f8ef7', users: 168480, pct: 72, change: 5 },
            { name: 'DANASTRA', color: '#06b6d4', users: 142740, pct: 61, change: 4 },
            { name: 'FINATRA',  color: '#f59e0b', users: 105300, pct: 45, change: 2 },
            { name: 'AMITRA',   color: '#10b981', users: 121680, pct: 52, change: 6 },
            { name: 'SPEKTRA',  color: '#f43f5e', users: 65520,  pct: 28, change: -3 },
          ].map(lob => (
            <div key={lob.name} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                <img src={LOB_LOGOS[lob.name]} alt={lob.name} className="w-7 h-7 object-contain" />
              </div>
              <div className="w-20 shrink-0">
                <span className="text-xs font-bold" style={{ color: '#374151' }}>{lob.name}</span>
              </div>
              <div className="flex-1 h-3 rounded-full" style={{ background: '#f3f4f6' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${lob.pct}%`, background: lob.color }} />
              </div>
              <div className="w-8 text-right">
                <span className="text-xs font-bold" style={{ color: '#374151' }}>{lob.pct}%</span>
              </div>
              <div className="w-10 text-right">
                <span className="text-[10px] font-medium" style={{ color: lob.change >= 0 ? '#059669' : '#dc2626' }}>
                  {lob.change > 0 ? '+' : ''}{lob.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
