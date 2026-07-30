'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  List, User, SignOut,
  ChartBar, Star, Stack,
  CurrencyCircleDollar, Globe,
  Megaphone, Database, Pulse,
  Trophy, MapPin, Bell, DeviceMobile,
  ChartLine, ShieldCheck, Gear, PushPin,
  TrendUp, TrendDown, LockSimple,
} from '@phosphor-icons/react';
import { useAuth } from '@/components/auth-provider';
import { isPageLocked } from '@/components/page-lock';
import PageGate from '@/components/page-gate';

const FIFGROUP_LOGO = 'https://www.fifgroup.co.id/assets/images/png/fifgroup-logo-v2-20260423.png';

const WA_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/whatsapp.svg';
const TEAMS_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoftteams.svg';
const EMAIL_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/gmail.svg';
const SMS_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/messagebird.svg';
const PUSH_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googlecloudnotifications.svg';

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
      { href: '/',                  label: 'Portfolio Overview', icon: ChartLine,        color: '#1e3a5f' },
      { href: '/portfolio-quality', label: 'Portfolio Quality', icon: Trophy,          color: '#10b981' },
      { href: '/geographic',       label: 'Geographic',        icon: MapPin,           color: '#8b5cf6' },
    ],
  },
  {
    label: 'Digital Products',
    items: [
      { href: '/fifgo',  label: 'FIFGO App',   icon: DeviceMobile, color: '#06b6d4' },
      { href: '/fifada', label: 'FIFADA App',  icon: Star,        color: '#f59e0b' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/push-notification', label: 'Push Notification', icon: Megaphone, color: '#f97316' },
      { href: '/marketing',         label: 'Marketing',         icon: TrendUp,   color: '#f59e0b' },
      { href: '/campaign',          label: 'Campaign Hub',       icon: Megaphone, color: '#dc2626' },
    ],
  },
  {
    label: 'CDP',
    items: [
      { href: '/cdp',    label: 'CDP',    icon: Database, color: '#4f8ef7' },
      { href: '/events', label: 'Events',  icon: Pulse,    color: '#14b8a6' },
    ],
  },
  {
    label: 'Performance',
    items: [
      { href: '/lob',   label: 'LoB Performance', icon: ChartBar,             color: '#8b5cf6' },
      { href: '/sales', label: 'Sales',            icon: CurrencyCircleDollar,  color: '#10b981' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/error-tracking', label: 'Error Tracking', icon: ShieldCheck, color: '#64748b' },
      { href: '/competitors',    label: 'Competitors',     icon: Globe,        color: '#64748b' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/alerts',      label: 'Alerts',      icon: Bell, color: '#dc2626' },
      { href: '/escalation',  label: 'Escalation',  icon: Bell, color: '#dc2626' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { href: '/cdp-admin', label: 'CDP Admin', icon: Gear,  color: '#1e3a5f' },
      { href: '/settings',  label: 'Settings',   icon: ShieldCheck, color: '#1e3a5f' },
    ],
  },
];

function getPageId(href: string): string {
  if (href === '/') return 'dashboard';
  return href.replace('/', '');
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setLastUpdated(new Date());
    const timer = setInterval(() => setLastUpdated(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    : '--:--';

  const filteredNavGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.href === '/cdp-admin' || item.href === '/settings'
        ? isAdmin
        : true
    ),
  })).filter(group => group.items.length > 0);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-[60px] flex items-center justify-center shrink-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
        {collapsed ? (
          <img src="https://www.fifgroup.co.id/favicon.ico" alt="FIFGROUP" className="object-contain" style={{ height: 30, width: 30 }} />
        ) : (
          <img src={FIFGROUP_LOGO} alt="FIFGROUP" className="object-contain" style={{ height: 34, width: 'auto' }} />
        )}
      </div>

      {/* Live Indicator */}
      {!collapsed && (
        <div className="px-3 py-2 flex items-center gap-2 shrink-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot shrink-0" />
          <span className="text-[10px]" style={{ color: '#9ca3af' }}>LIVE</span>
          <span className="text-[10px] ml-auto" style={{ color: '#d1d5db' }}>{timeStr} WIB</span>
        </div>
      )}

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {filteredNavGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[9px] font-extrabold uppercase tracking-widest px-2 mb-1.5" style={{ color: '#d1d5db' }}>
                {group.label}
              </p>
            )}
            <div className="space-y-0">
              {group.items.map(item => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                const isLocked = !isAdmin && item.href !== '/cdp-admin' && item.href !== '/settings' && isPageLocked(getPageId(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      if (isLocked) { e.preventDefault(); return; }
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-all"
                    style={{
                      background: isActive ? `${item.color}12` : isLocked ? 'transparent' : 'transparent',
                      color: isActive ? item.color : isLocked ? '#cbd5e1' : '#64748b',
                      fontWeight: isActive ? 700 : isLocked ? 400 : 500,
                      fontSize: 13,
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      opacity: isLocked ? 0.7 : 1,
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="relative">
                      <Icon
                        size={20}
                        weight={isActive ? 'fill' : isLocked ? 'regular' : 'regular'}
                        style={{ color: isActive ? item.color : isLocked ? '#cbd5e1' : '#94a3b8', flexShrink: 0 }}
                      />
                      {isLocked && (
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <LockSimple size={10} weight="fill" style={{ color: '#94a3b8' }} />
                        </div>
                      )}
                    </div>
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
        <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center py-2 rounded-lg transition-all" style={{ background: '#f8fafc', color: '#94a3b8', fontSize: 12 }}>
          {collapsed ? '→' : '← Collapse'}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8fafc' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-white transition-all duration-200 overflow-hidden shrink-0"
        style={{ width: collapsed ? 80 : 210, borderRight: '1px solid #f1f5f9', zIndex: 10 }}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setMobileOpen(false)} />
      )}
      <aside className="fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-transform duration-200 overflow-hidden md:hidden"
        style={{ width: 280, transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        {sidebarContent}
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setMobileOpen(true)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#f8fafc' }}>
              <List size={18} style={{ color: '#374151' }} />
            </button>
            <img src={FIFGROUP_LOGO} alt="FIFGROUP" className="object-contain" style={{ height: 26, width: 'auto' }} />
          </div>

          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
              <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
                style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: isAdmin ? '#1e3a5f' : '#059669' }}>
                  <User size={14} weight="bold" style={{ color: 'white' }} />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[11px] font-semibold leading-tight" style={{ color: '#111827' }}>{user?.name}</p>
                  <p className="text-[9px] leading-tight" style={{ color: isAdmin ? '#1e3a5f' : '#059669' }}>
                    {isAdmin ? 'Admin' : 'Viewer'}
                  </p>
                </div>
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 w-64 overflow-hidden">
                    <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d4a7c)' }}>
                      <p className="text-sm font-bold text-white">{user?.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{user?.email}</p>
                      <span className={`inline-block mt-1.5 text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        isAdmin ? 'bg-amber-400 text-amber-900' : 'bg-emerald-400 text-emerald-900'
                      }`}>
                        {isAdmin ? '👑 Admin' : '👁 Viewer'}
                      </span>
                    </div>
                    <div className="p-2">
                      {isAdmin && (
                        <>
                          <Link href="/cdp-admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-medium w-full text-left transition-all hover:bg-gray-50"
                            style={{ color: '#1e3a5f' }}>
                            <Gear size={14} /> CDP Admin Panel
                          </Link>
                          <Link href="/settings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-medium w-full text-left transition-all hover:bg-gray-50"
                            style={{ color: '#1e3a5f' }}>
                            <ShieldCheck size={14} /> Settings
                          </Link>
                          <div className="my-1" style={{ borderTop: '1px solid #f0f0f0' }} />
                        </>
                      )}
                      <button
                        onClick={() => { logout(); window.location.href = '/login'; }}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-medium w-full text-left transition-all hover:bg-red-50"
                        style={{ color: '#dc2626' }}>
                        <SignOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <PageGate>{children}</PageGate>
        </div>
      </main>
    </div>
  );
}
