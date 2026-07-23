'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House, TrendUp, ChartBar, Brain, ListChecks,
  Users, GlobeHemisphereWest, Gear, Star,
  CaretLeft, AppWindow
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Overview', href: '/', icon: House, color: 'text-blue-400' },
  { label: 'FIFGO', href: '/fifgo', icon: AppWindow, color: 'text-cyan-400' },
  { label: 'FIFADA', href: '/fifada', icon: Star, color: 'text-amber-400' },
  { label: 'LoB Performance', href: '/lob', icon: ChartBar, color: 'text-purple-400' },
  { label: 'Insider CDP', href: '/insider', icon: Users, color: 'text-emerald-400' },
  { label: 'AI Insights', href: '/ai-insights', icon: Brain, color: 'text-rose-400' },
  { label: 'Recommendations', href: '/recommendations', icon: ListChecks, color: 'text-orange-400' },
  { label: 'Competitors', href: '/competitors', icon: GlobeHemisphereWest, color: 'text-teal-400' },
];

export default function CommandCenterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState('');

  React.useEffect(() => {
    const now = new Date();
    setLastUpdated(`Today ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex font-sans">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside
        className={cn(
          'flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-[230px]'
        )}
        style={{
          background: 'linear-gradient(180deg, #1e3a5f 0%, #0f2342 100%)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center px-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-3 overflow-hidden w-full">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 100%)' }}
            >
              <TrendUp size={18} className="text-white" weight="bold" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-white font-extrabold text-[13px] tracking-tight leading-none">FIFGROUP</div>
                <div className="text-[10px] font-bold tracking-widest mt-0.5" style={{ color: '#60a5fa' }}>
                  COMMAND CENTER
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 h-10 px-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative group',
                    isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                  )}
                  style={isActive ? {
                    background: 'rgba(79,142,247,0.18)',
                    boxShadow: 'inset 3px 0 0 #4f8ef7',
                  } : {}}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full"
                      style={{ background: 'linear-gradient(180deg, #60a5fa 0%, #4f8ef7 100%)' }}
                    />
                  )}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                    style={isActive ? {
                      background: 'rgba(79,142,247,0.25)',
                      color: '#93c5fd',
                    } : {
                      background: 'transparent',
                      color: item.color ?? 'rgba(255,255,255,0.4)',
                    }}
                  >
                    <Icon size={17} weight={isActive ? 'fill' : 'regular'} />
                  </div>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="h-10 flex items-center justify-center transition-colors duration-200 shrink-0 group"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <CaretLeft
            size={15}
            className="text-white/30 group-hover:text-white/60 transition-all duration-300"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header
          className="h-14 flex items-center justify-between px-6 shrink-0"
          style={{
            background: 'rgba(15,23,42,0.8)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">System Healthy</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">Last updated: {lastUpdated}</span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 100%)' }}
            >
              B
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
