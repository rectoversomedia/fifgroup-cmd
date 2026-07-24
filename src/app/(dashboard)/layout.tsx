'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FIFGROUP_LOGO = 'https://www.fifgroup.co.id/assets/images/png/fifgroup-logo-v2-20260423.png';

const NAV = [
  { href: '/',          label: 'Portfolio Overview', icon: 'ChartBar',      color: '#1e3a5f' },
  { href: '/app-health', label: 'App Health',        icon: 'DeviceMobile',  color: '#4f8ef7' },
  { href: '/sales',      label: 'Sales & Disbursement', icon: 'CurrencyCircleDollar', color: '#10b981' },
  { href: '/lob',        label: 'LoB Performance',   icon: 'Stack',        color: '#8b5cf6' },
  { href: '/customer-intelligence', label: 'Customer Intelligence', icon: 'Users', color: '#06b6d4' },
  { href: '/automation',  label: 'Automation',         icon: 'Lightning',    color: '#f59e0b' },
  { href: '/marketing',  label: 'Marketing',          icon: 'Megaphone',    color: '#f97316' },
  { href: '/campaigns',  label: 'Campaigns',         icon: 'Rocket',       color: '#ec4899' },
  { href: '/events',     label: 'Events',            icon: 'Pulse',       color: '#14b8a6' },
  { href: '/insider',    label: 'Insider CDP',        icon: 'Database',     color: '#6366f1' },
  { href: '/competitors',label: 'Competitors',        icon: 'Globe',       color: '#64748b' },
  { href: '/recommendations', label: 'AI Insights',   icon: 'Brain',       color: '#a855f7' },
];



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside
        className="shrink-0 flex flex-col bg-white transition-all duration-200 overflow-hidden"
        style={{
          width: collapsed ? 72 : 240,
          borderRight: '1px solid #f1f5f9',
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center shrink-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <img
            src={FIFGROUP_LOGO}
            alt="FIFGROUP"
            className="object-contain"
            style={{ height: 36, width: 'auto', filter: 'brightness(0) saturate(100%)' }}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(item => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: active ? `${item.color}10` : 'transparent',
                  color: active ? item.color : '#64748b',
                  fontWeight: active ? 700 : 500,
                  fontSize: 13,
                }}
              >
                <DynamicIcon name={item.icon} size={20} weight={active ? 'fill' : 'regular'} color={active ? item.color : '#94a3b8'} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="p-3 shrink-0" style={{ borderTop: '1px solid #f3f4f6' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 rounded-xl transition-all"
            style={{ background: '#f8fafc', color: '#94a3b8', fontSize: 12 }}
          >
            {collapsed ? '→' : '← Collapse'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function DynamicIcon({ name, size, weight, color }: { name: string; size: number; weight: 'fill' | 'regular'; color: string }) {
  const [Icon, setIcon] = React.useState<any>(null);
  React.useEffect(() => {
    import('@phosphor-icons/react').then(mod => {
      const icons: Record<string, any> = {
        ChartBar: mod.ChartBar, DeviceMobile: mod.DeviceMobile,
        CurrencyCircleDollar: mod.CurrencyCircleDollar, Stack: mod.Stack,
        Users: mod.Users, Lightning: mod.Lightning, Megaphone: mod.Megaphone,
        Rocket: mod.Rocket, Pulse: mod.Pulse, Database: mod.Database,
        Globe: mod.Globe, Brain: mod.Brain,
      };
      setIcon(() => icons[name] || mod.ChartBar);
    });
  }, [name]);
  if (!Icon) return null;
  return <Icon size={size} weight={weight} style={{ color }} />;
}
