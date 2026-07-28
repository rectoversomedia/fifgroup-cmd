'use client';

import * as React from 'react';
import {
  ChartLine, Users, TrendUp, TrendDown,
  Pulse, Megaphone, Star, DeviceMobile,
  Bank, ArrowRight, Play, Eye,
} from '@phosphor-icons/react';
import { getDashboardKPIs } from '@/lib/data-sim';

const CYCLE_INTERVAL = 20_000; // 20 detik per slide

const SLIDES = [
  { id: 'overview',   label: 'Portfolio Overview',  href: '/' },
  { id: 'fifgo',      label: 'FIFGO App',           href: '/fifgo' },
  { id: 'fifada',     label: 'FIFADA App',          href: '/fifada' },
  { id: 'push',       label: 'Push Notification',  href: '/push-notification' },
  { id: 'journey',    label: 'Journey',             href: '/journey' },
  { id: 'appanalytics', label: 'App Analytics',    href: '/app-analytics' },
  { id: 'errors',     label: 'Error Tracking',      href: '/error-tracking' },
  { id: 'competitors',label: 'Competitors',         href: '/competitors' },
  { id: 'portfolioq', label: 'Portfolio Quality',   href: '/portfolio-quality' },
  { id: 'geographic', label: 'Geographic',          href: '/geographic' },
];

const FIVEGO_SLIDE = {
  label: 'FIFGO',
  icon: DeviceMobile,
  color: '#06b6d4',
  metrics: [
    { label: 'MAU',         value: '234,000',  change: '+12%', up: true  },
    { label: 'WAU',         value: '89,400',   change: '+8%',  up: true  },
    { label: 'Session',     value: '4.2 min',  change: '+0.3',  up: true  },
    { label: 'Retention',   value: '68%',      change: '-1%',  up: false },
  ],
};

const FIFADA_SLIDE = {
  label: 'FIFADA',
  icon: Star,
  color: '#f59e0b',
  metrics: [
    { label: 'Downloads',   value: '850,000',  change: '+15K',  up: true  },
    { label: 'DAU',         value: '62,000',   change: '+8%',   up: true  },
    { label: 'Crash Rate',  value: '1.4%',    change: '+0.3%', up: false },
    { label: 'Rating',      value: '3.8 ★',   change: '-0.1',  up: false },
  ],
};

const PORTFOLIO_SLIDE = {
  label: 'Portfolio',
  icon: ChartLine,
  color: '#1e3a5f',
  metrics: [
    { label: 'Disbursement', value: 'Rp 89.2B', change: '+18%', up: true  },
    { label: 'NPF Rate',     value: '2.1%',     change: '+0.1%', up: false },
    { label: 'PAR 30',       value: '4.8%',     change: '-0.2%', up: true  },
    { label: 'Collection',   value: '87.2%',    change: '-0.8%', up: false },
  ],
};

const PUSH_SLIDE = {
  label: 'Push Notification',
  icon: Megaphone,
  color: '#8b5cf6',
  metrics: [
    { label: 'Delivered',   value: '1.2M',   change: '+5%',  up: true  },
    { label: 'Open Rate',   value: '48%',    change: '+3%',  up: true  },
    { label: 'CTR',         value: '12.4%',  change: '+0.8%',up: true  },
    { label: 'Conversion',  value: '3.2%',  change: '+0.2%',up: true  },
  ],
};

const ALL_SLIDES = [PORTFOLIO_SLIDE, FIVEGO_SLIDE, FIFADA_SLIDE, PUSH_SLIDE];

export default function TVModePage() {
  const [slideIdx, setSlideIdx] = React.useState(0);
  const [kpiData, setKpiData] = React.useState<Awaited<ReturnType<typeof getDashboardKPIs>> | null>(null);

  React.useEffect(() => {
    getDashboardKPIs().then(setKpiData);
  }, []);

  React.useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % ALL_SLIDES.length), CYCLE_INTERVAL);
    return () => clearInterval(t);
  }, []);

  const slide = ALL_SLIDES[slideIdx];
  const SlideIcon = slide.icon;

  const fmtNum = (v: number) => v.toLocaleString('id-ID');

  return (
    <div className="h-full flex flex-col" style={{ background: 'linear-gradient(135deg, #0f2340 0%, #1e3a5f 50%, #0f2340 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
            <Bank size={22} style={{ color: 'white' }} weight="fill" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-white tracking-wide">FIFGROUP</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Digital Command Center — TV Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Live dots */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
            <span className="text-sm font-semibold text-emerald-400">LIVE</span>
          </div>

          {/* Clock */}
          <ClockDisplay />

          {/* Slide dots */}
          <div className="flex items-center gap-1.5">
            {ALL_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === slideIdx ? 'white' : 'rgba(255,255,255,0.25)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-6">
        {(kpiData ? [
          { label: 'Disbursement', value: `Rp ${(kpiData.disbursement / 1_000_000_000).toFixed(1)}B`, change: `+${kpiData.disbursementChange}%`, up: true,  color: '#10b981', icon: TrendUp },
          { label: 'MAU (FIFGO)',  value: fmtNum(kpiData.mauFifgo),                          change: `+${kpiData.mauChange}%`,      up: true,  color: '#06b6d4', icon: Users },
          { label: 'Conv. Rate',   value: `${kpiData.conversionRate}%`,                      change: `+${kpiData.convChange}%`,    up: true,  color: '#8b5cf6', icon: Pulse },
          { label: 'NPF Rate',    value: '2.1%',                                           change: '+0.1%',                       up: false, color: '#f43f5e', icon: TrendDown },
        ] : Array(4).fill(null)).map((m, i) => m ? (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 flex flex-col justify-between border border-white/10">
            <div>
              <p className="text-sm font-semibold text-white/50 mb-2">{m.label}</p>
              <p className="text-4xl font-black text-white leading-none">{m.value}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1">
                {m.up
                  ? <TrendUp size={16} style={{ color: '#10b981' }} weight="bold" />
                  : <TrendDown size={16} style={{ color: '#f43f5e' }} weight="bold" />}
                <span className="text-sm font-bold" style={{ color: m.up ? '#10b981' : '#f43f5e' }}>{m.change}</span>
              </div>
              <span className="text-xs text-white/30">MTD</span>
            </div>
          </div>
        ) : (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-24 mb-4" />
            <div className="h-10 bg-white/10 rounded w-32 mb-3" />
            <div className="h-3 bg-white/10 rounded w-16" />
          </div>
        ))}
      </div>

      {/* Rotating Slide Panel */}
      <div className="px-8 pb-6 shrink-0">
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${slide.color}30` }}>
                <SlideIcon size={24} style={{ color: slide.color }} weight="fill" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-white">{slide.label}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Auto-rotate every 20s</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {ALL_SLIDES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button key={i} onClick={() => setSlideIdx(i)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: i === slideIdx ? `${s.color}30` : 'transparent',
                      color: i === slideIdx ? s.color : 'rgba(255,255,255,0.3)',
                      border: `1px solid ${i === slideIdx ? s.color : 'rgba(255,255,255,0.1)'}`,
                    }}>
                    <Icon size={10} weight="fill" />
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {slide.metrics.map(m => (
              <div key={m.label} className="bg-white/5 rounded-2xl p-4">
                <p className="text-sm text-white/40 mb-1">{m.label}</p>
                <p className="text-3xl font-black text-white">{m.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {m.up
                    ? <TrendUp size={12} style={{ color: '#10b981' }} weight="bold" />
                    : <TrendDown size={12} style={{ color: '#f43f5e' }} weight="bold" />}
                  <span className="text-xs font-bold" style={{ color: m.up ? '#10b981' : '#f43f5e' }}>{m.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClockDisplay() {
  const [time, setTime] = React.useState('--:--');

  React.useEffect(() => {
    const fmt = () => setTime(new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta',
    }));
    fmt();
    const t = setInterval(fmt, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-black text-white tabular-nums">{time}</span>
      <span className="text-[10px] text-white/40">WIB</span>
    </div>
  );
}
