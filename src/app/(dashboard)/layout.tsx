'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  List, User,
  ChartBar, Star, Stack,
  CurrencyCircleDollar, Globe,
  Megaphone, Database, Pulse,
  Trophy, MapPin, Bell, DeviceMobile,
  ChartLine, ShieldCheck, ArrowsClockwise, PushPin,
  TrendUp, TrendDown,
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
      { href: '/',                   label: 'Portfolio Overview',  icon: ChartLine,        color: '#1e3a5f' },
      { href: '/portfolio-quality',  label: 'Portfolio Quality',  icon: Trophy,          color: '#10b981' },
      { href: '/geographic',        label: 'Geographic',         icon: MapPin,           color: '#8b5cf6' },
    ],
  },
  {
    label: 'Digital Products',
    items: [
      { href: '/fifgo',  label: 'FIFGO App',   icon: DeviceMobile,  color: '#06b6d4' },
      { href: '/fifada', label: 'FIFADA App',  icon: Star,         color: '#f59e0b' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/push-notification', label: 'Push Notification', icon: Megaphone,       color: '#f97316' },
      { href: '/marketing',         label: 'Marketing',        icon: TrendUp,         color: '#f59e0b' },
      { href: '/campaign',         label: 'Campaign Hub',    icon: Megaphone,       color: '#dc2626' },
    ],
  },
  {
    label: 'CDP',
    items: [
      { href: '/cdp',             label: 'CDP',              icon: Database,       color: '#4f8ef7' },
      { href: '/events',          label: 'Events',            icon: Pulse,          color: '#14b8a6' },
    ],
  },
  {
    label: 'Performance',
    items: [
      { href: '/lob',           label: 'LoB Performance', icon: ChartBar,      color: '#8b5cf6' },
      { href: '/sales',         label: 'Sales',           icon: CurrencyCircleDollar, color: '#10b981' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/error-tracking', label: 'Error Tracking', icon: ShieldCheck,   color: '#64748b' },
      { href: '/competitors',    label: 'Competitors',    icon: Globe,          color: '#64748b' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/alerts',     label: 'Alerts',     icon: Bell,           color: '#dc2626' },
      { href: '/escalation', label: 'Escalation', icon: Bell,           color: '#dc2626' },
      { href: '/tv-mode',   label: 'TV Mode',    icon: DeviceMobile,    color: '#1e3a5f' },
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

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    : '--:--';

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-12 flex items-center justify-center shrink-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
        {collapsed ? (
          // Collapsed: show favicon (Astra circle with star)
          <img
            src="https://www.fifgroup.co.id/favicon.ico"
            alt="FIFGROUP"
            className="object-contain"
            style={{ height: 26, width: 26 }}
          />
        ) : (
          // Expanded: show full logo in color
          <img
            src="https://www.fifgroup.co.id/assets/images/png/fifgroup-logo-v2-20260423.png"
            alt="FIFGROUP"
            className="object-contain"
            style={{ height: 28, width: 'auto' }}
          />
        )}
      </div>

      {/* Live Indicator */}
      {!collapsed && (
        <div className="px-3 py-1.5 flex items-center gap-2 shrink-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot shrink-0" />
          <span className="text-[9px]" style={{ color: '#9ca3af' }}>LIVE</span>
          <span className="text-[9px] ml-auto" style={{ color: '#d1d5db' }}>{timeStr} WIB</span>
        </div>
      )}

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-3">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[8px] font-extrabold uppercase tracking-widest px-2 mb-1" style={{ color: '#d1d5db' }}>
                {group.label}
              </p>
            )}
            <div className="space-y-0">
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
                    className="flex items-center gap-2 px-2 py-2 rounded-lg transition-all"
                    style={{
                      background: isActive ? `${item.color}12` : 'transparent',
                      color: isActive ? item.color : '#64748b',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 11,
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      size={16}
                      weight={isActive ? 'fill' : 'regular'}
                      style={{ color: isActive ? item.color : '#94a3b8', flexShrink: 0 }}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <div className="p-2 shrink-0 hidden md:block" style={{ borderTop: '1px solid #f3f4f6' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 rounded-lg transition-all"
          style={{ background: '#f8fafc', color: '#94a3b8', fontSize: 11 }}
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
              style={{ height: 26, width: 'auto' }}
            />
          </div>

          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
              <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
            </div>

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
