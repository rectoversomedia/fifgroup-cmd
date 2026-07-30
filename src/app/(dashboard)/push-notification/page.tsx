'use client';

import * as React from 'react';
import {
  PushPin, PaperPlaneTilt, Eye, CheckCircle,
  TrendUp, TrendDown, Funnel, DeviceMobile, CurrencyCircleDollar,
} from '@phosphor-icons/react';
import { getMarketingStats } from '@/lib/data-sim';

export default function PushNotificationPage() {
  const [timeStr, setTimeStr] = React.useState('--:--');
  const [data, setData] = React.useState<Awaited<ReturnType<typeof getMarketingStats>> | null>(null);

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    getMarketingStats().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { channels, summary } = data;
  const totalSpend = channels.reduce((s, c) => s + c.spend, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Marketing Channels</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Spend · Reach · ROAS · Conversion across all channels</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Spend',     value: `Rp ${totalSpend.toLocaleString('id-ID')}`, icon: CurrencyCircleDollar, color: '#1e3a5f', sub: 'All channels' },
          { label: 'Total Reach',    value: summary.totalReach.toLocaleString('id-ID'), icon: Eye,                 color: '#6366f1', sub: 'Unique users' },
          { label: 'Avg ROAS',      value: summary.avgRoas.toFixed(1) + 'x',                    icon: TrendUp,           color: '#10b981', sub: 'Return on ad spend' },
          { label: 'Best Channel',  value: summary.bestChannel,                                   icon: CheckCircle,       color: '#f59e0b', sub: 'Highest ROAS' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={18} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-base font-bold mb-1" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-xs font-medium" style={{ color: '#374151' }}>{m.label}</p>
            <p className="text-[11px] mt-1" style={{ color: '#9ca3af' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Channel Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Channel Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                <th className="text-left pb-3 pl-6 pr-4">Channel</th>
                <th className="text-right pb-3 pr-4">Spend</th>
                <th className="text-right pb-3 pr-4">Reach</th>
                <th className="text-right pb-3 pr-4">Conversions</th>
                <th className="text-center pb-3 pr-4">ROAS</th>
                <th className="text-left pb-3 pr-6">Performance</th>
              </tr>
            </thead>
            <tbody>
              {channels.map(ch => {
                const isTop = ch.roas >= summary.avgRoas;
                const roasColor = ch.roas >= 7 ? '#10b981' : ch.roas >= 4 ? '#f59e0b' : '#dc2626';
                return (
                  <tr key={ch.name} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${ch.color}15` }}>
                          <div className="w-3 h-3 rounded-full" style={{ background: ch.color }} />
                        </div>
                        <span className="text-sm font-bold" style={{ color: '#111827' }}>{ch.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className="text-sm font-semibold" style={{ color: '#111827' }}>Rp {ch.spend.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className="text-sm font-semibold" style={{ color: '#374151' }}>{ch.reach.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span className="text-sm font-semibold" style={{ color: '#374151' }}>{ch.conv.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: `${roasColor}15`, color: roasColor }}>
                        {ch.roas.toFixed(1)}x
                      </span>
                    </td>
                    <td className="py-4 pr-6">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(ch.roas / 10) * 100}%`, background: ch.color }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Push Notification Stats */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <PushPin size={16} style={{ color: '#4f8ef7' }} weight="fill" />
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Push Notification Detail</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Delivered', value: channels[0].reach.toLocaleString('id-ID'), color: '#1e3a5f' },
            { label: 'Opened',    value: Math.round(channels[0].reach * 0.48).toLocaleString('id-ID'), color: '#6366f1' },
            { label: 'Clicked',   value: Math.round(channels[0].reach * 0.124).toLocaleString('id-ID'), color: '#10b981' },
            { label: 'Open Rate', value: '48%', color: '#f59e0b' },
          ].map(m => (
            <div key={m.label} className="text-center rounded-xl p-4" style={{ background: `${m.color}08`, border: `1px solid ${m.color}20` }}>
              <p className="text-base font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-xs font-semibold" style={{ color: '#6b7280' }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
