'use client';

import * as React from 'react';
import {
  ArrowsClockwise, Play, Pause, CheckCircle, Clock,
  TrendUp, Funnel, Lightning, Users,
} from '@phosphor-icons/react';
import { getCDPJourneys } from '@/lib/data-sim';

const JOURNEY_STATUS_META = {
  live:    { label: 'Live',    color: '#10b981', bg: '#f0fdf4' },
  paused:  { label: 'Paused',  color: '#f59e0b', bg: '#fffbeb' },
  draft:   { label: 'Draft',   color: '#9ca3af', bg: '#f9fafb' },
} as const;

export default function JourneyPage() {
  const [timeStr, setTimeStr] = React.useState('--:--');
  const [journeys, setJourneys] = React.useState<Awaited<ReturnType<typeof getCDPJourneys>> | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'live' | 'paused' | 'draft'>('all');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    getCDPJourneys().then(setJourneys);
  }, []);

  const filtered = React.useMemo(() => {
    if (!journeys) return [];
    if (filter === 'all') return journeys;
    return journeys.filter(j => j.status === filter);
  }, [journeys, filter]);

  const totalEnrolled = filtered.reduce((s, j) => s + j.enrolled, 0);
  const avgConv = filtered.length > 0
    ? Math.round(filtered.reduce((s, j) => s + j.convRate, 0) / filtered.length)
    : 0;

  if (!journeys) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Customer Journeys</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>CDP journey performance · Enrollment · Conversion funnel</p>
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
          { label: 'Active Journeys', value: journeys.filter(j => j.status === 'live').length.toString(), icon: Play,           color: '#10b981', sub: 'Currently running' },
          { label: 'Total Enrolled',  value: totalEnrolled.toLocaleString('id-ID'),                    icon: Users,         color: '#1e3a5f', sub: 'All time' },
          { label: 'Avg Conv. Rate',  value: `${avgConv}%`,                                         icon: TrendUp,       color: '#6366f1', sub: 'Enrolled → completed' },
          { label: 'Ongoing Steps',   value: journeys.reduce((s, j) => s + j.activeStep, 0).toString(), icon: Lightning,    color: '#f59e0b', sub: 'Active across journeys' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={18} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-2xl font-extrabold mb-1" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-xs font-medium" style={{ color: '#374151' }}>{m.label}</p>
            <p className="text-[11px] mt-1" style={{ color: '#9ca3af' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Conversion Funnel</h3>
        <div className="grid grid-cols-5 gap-2">
          {[
            { step: 'Enrolled',  val: totalEnrolled,       color: '#1e3a5f' },
            { step: 'Active',    val: Math.round(totalEnrolled * 0.72), color: '#4f8ef7' },
            { step: 'Engaged',   val: Math.round(totalEnrolled * 0.45), color: '#6366f1' },
            { step: 'Converted', val: Math.round(totalEnrolled * 0.28), color: '#f59e0b' },
            { step: 'Completed', val: Math.round(totalEnrolled * 0.18), color: '#10b981' },
          ].map((s, i) => (
            <div key={s.step} className="text-center">
              <div className="rounded-xl p-3 mb-1" style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
                <p className="text-[10px] font-semibold mb-1" style={{ color: s.color }}>{s.step}</p>
                <p className="text-lg font-black" style={{ color: s.color }}>{s.val.toLocaleString('id-ID')}</p>
              </div>
              {i < 4 && <div className="h-2 bg-gray-100 rounded mx-2 my-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Journey List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <Funnel size={14} style={{ color: '#9ca3af' }} />
          <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Filter:</span>
          {(['all', 'live', 'paused', 'draft'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={filter === f
                ? { background: '#1e3a5f', color: 'white', border: '1px solid #1e3a5f' }
                : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }}>
              {f === 'all' ? 'All' : JOURNEY_STATUS_META[f as keyof typeof JOURNEY_STATUS_META].label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <ArrowsClockwise size={32} style={{ color: '#d1d5db' }} className="mx-auto mb-2" />
              <p className="text-sm" style={{ color: '#9ca3af' }}>No journeys match this filter</p>
            </div>
          ) : filtered.map(j => {
            const status = JOURNEY_STATUS_META[j.status as keyof typeof JOURNEY_STATUS_META];
            const isWarn = j.convRate < 20;
            return (
              <div key={j.id} className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${j.color}15` }}>
                      <ArrowsClockwise size={18} style={{ color: j.color }} weight="fill" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-bold" style={{ color: '#111827' }}>{j.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: '#9ca3af' }}>{j.segment}</p>
                    </div>
                  </div>
                  {j.status === 'live' && (
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border shrink-0"
                      style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                      <Pause size={10} weight="fill" /> Pause
                    </button>
                  )}
                </div>

                {/* Step Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold" style={{ color: '#374151' }}>Journey Steps</span>
                    <span className="text-[11px]" style={{ color: '#9ca3af' }}>Step {j.activeStep} of {j.totalSteps}</span>
                  </div>
                  <div className="flex gap-1">
                    {j.steps.map((step, i) => (
                      <div key={i} className="flex-1">
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: `${j.color}20` }}>
                          <div className="h-full rounded-full" style={{
                            width: `${((i + 1) / j.totalSteps) * 100}%`,
                            background: i < j.activeStep ? j.color : `${j.color}40`,
                          }} />
                        </div>
                        <p className="text-[9px] mt-1 leading-tight" style={{ color: i < j.activeStep ? j.color : '#9ca3af' }}>{step.split(' (')[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[11px]" style={{ color: '#9ca3af' }}>Enrolled</p>
                    <p className="text-sm font-bold" style={{ color: '#374151' }}>{j.enrolled.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[11px]" style={{ color: '#9ca3af' }}>Conv. Rate</p>
                    <p className="text-sm font-bold" style={{ color: isWarn ? '#dc2626' : '#10b981' }}>{j.convRate}%</p>
                  </div>
                  <div>
                    <p className="text-[11px]" style={{ color: '#9ca3af' }}>Progress</p>
                    <p className="text-sm font-bold" style={{ color: '#374151' }}>{Math.round((j.activeStep / j.totalSteps) * 100)}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
