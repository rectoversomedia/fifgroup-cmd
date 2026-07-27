'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell, List, User,
  ChartBar, Star, Stack,
  CurrencyCircleDollar, Globe,
  Megaphone, Database, Pulse, Brain,
} from '@phosphor-icons/react';

const FIFGROUP_LOGO = 'https://www.fifgroup.co.id/assets/images/png/fifgroup-logo-v2-20260423.png';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  color: string;
  badge?: number;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Executive',
    items: [
      { href: '/',                     label: 'Portfolio Overview',     icon: ChartBar,           color: '#1e3a5f' },
      { href: '/alerts',             label: 'Alert Center',          icon: Bell,               color: '#dc2626' },
    ],
  },
  {
    label: 'Digital Products',
    items: [
      { href: '/fifgo',    label: 'FIFGO App',          icon: Star,               color: '#06b6d4' },
      { href: '/fifada',  label: 'FIFADA App',         icon: Star,              color: '#f59e0b' },
      { href: '/lob',     label: 'LoB Performance',    icon: Stack,             color: '#8b5cf6' },
    ],
  },
  {
    label: 'Commercial',
    items: [
      { href: '/sales',        label: 'Sales & Disbursement', icon: CurrencyCircleDollar, color: '#10b981' },
      { href: '/competitors',  label: 'Competitors',          icon: Globe,               color: '#64748b' },
    ],
  },
  {
    label: 'Growth & CDP',
    items: [
      { href: '/marketing',       label: 'Marketing & Campaigns', icon: Megaphone,  color: '#f97316' },
      { href: '/cdp',          label: 'CDP & Journeys',       icon: Database,  color: '#6366f1' },
      { href: '/events',       label: 'Events Monitor',        icon: Pulse,     color: '#14b8a6' },
      { href: '/recommendations', label: 'AI Insights',        icon: Brain,     color: '#a855f7' },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    setLastUpdated(new Date());
    const timer = setInterval(() => setLastUpdated(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const activeAlertCount = 3;

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    : '--:--';

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center shrink-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
        <img
          src={FIFGROUP_LOGO}
          alt="FIFGROUP"
          className="object-contain"
          style={{ height: 36, width: 'auto', filter: 'brightness(0) saturate(100%)' }}
        />
      </div>

      {/* Live Indicator */}
      {!collapsed && (
        <div className="px-4 py-2 flex items-center gap-2 shrink-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot shrink-0" />
          <span className="text-[10px]" style={{ color: '#9ca3af' }}>LIVE</span>
          <span className="text-[10px] ml-auto" style={{ color: '#d1d5db' }}>{timeStr} WIB</span>
        </div>
      )}

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[9px] font-extrabold uppercase tracking-widest px-3 mb-1.5" style={{ color: '#d1d5db' }}>
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all md:text-[13px] text-sm"
                    style={{
                      background: isActive ? `${item.color}12` : 'transparent',
                      color: isActive ? item.color : '#64748b',
                      fontWeight: isActive ? 700 : 500,
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      size={20}
                      weight={isActive ? 'fill' : 'regular'}
                      style={{ color: isActive ? item.color : '#94a3b8', flexShrink: 0 }}
                    />
                    {!collapsed && <span>{item.label}</span>}
                    {item.href === '/alerts' && activeAlertCount > 0 && !collapsed && (
                      <span className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shrink-0"
                        style={{ background: '#dc2626' }}>
                        {activeAlertCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <div className="p-3 shrink-0 hidden md:block" style={{ borderTop: '1px solid #f3f4f6' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-xl transition-all"
          style={{ background: '#f8fafc', color: '#94a3b8', fontSize: 12 }}
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8fafc' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col bg-white transition-all duration-200 overflow-hidden shrink-0"
        style={{ width: collapsed ? 72 : 240, borderRight: '1px solid #f1f5f9', zIndex: 10 }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className="fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-transform duration-200 overflow-hidden md:hidden"
        style={{ width: 260, transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        {sidebarContent}
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#f8fafc' }}
            >
              <List size={18} style={{ color: '#374151' }} />
            </button>
            <img
              src={FIFGROUP_LOGO}
              alt="FIFGROUP"
              className="object-contain"
              style={{ height: 26, width: 'auto', filter: 'brightness(0) saturate(100%)' }}
            />
          </div>

          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
              <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
            </div>

            <Link
              href="/alerts"
              className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-all"
              style={{ background: activeAlertCount > 0 ? '#fef2f2' : '#f8fafc' }}
            >
              <Bell size={18} weight="fill" style={{ color: activeAlertCount > 0 ? '#dc2626' : '#64748b' }} />
              {activeAlertCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white"
                  style={{ background: '#dc2626' }}>
                  {activeAlertCount}
                </span>
              )}
            </Link>

            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
              style={{ background: '#1e3a5f' }}
              title="User Profile"
            >
              <User size={18} weight="bold" style={{ color: 'white' }} />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
