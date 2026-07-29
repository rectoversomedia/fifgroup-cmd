'use client';

import * as React from 'react';
import { Lightning, Users, CheckCircle, TrendUp, Bell, Rocket, ChartBar, CurrencyCircleDollar, Calendar } from '@phosphor-icons/react';

const WA_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/whatsapp.svg';
const EMAIL_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/gmail.svg';
const SMS_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/messagebird.svg';
const PUSH_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googlecloudnotifications.svg';

function MktIcon({ channel, size = 16 }: { channel: string; size?: number }) {
  switch (channel) {
    case 'WhatsApp': return <img src={WA_SVG} alt="WhatsApp" width={size} height={size} />;
    case 'Email': return <img src={EMAIL_SVG} alt="Email" width={size} height={size} />;
    case 'SMS': return <img src={SMS_SVG} alt="SMS" width={size} height={size} style={{ filter: 'brightness(0) saturate(100%)' }} />;
    case 'Push Notification': case 'In-App Message': return <img src={PUSH_SVG} alt="Push" width={size} height={size} style={{ filter: 'brightness(0) saturate(100%)' }} />;
    default: return <Bell size={size} />;
  }
}

const CHANNELS = [
  { channel: 'Push Notification', icon: 'Push Notification', sent: 189000, delivered: 182430, opened: 91215, clicked: 13682, converted: 4561, color: '#4f8ef7', cost: 'Rp 12.4M', revenue: 'Rp 8.2B' },
  { channel: 'In-App Message', icon: 'In-App Message', sent: 234000, delivered: 234000, opened: 117000, clicked: 21060, converted: 7020, color: '#8b5cf6', cost: 'Rp 0', revenue: 'Rp 12.6B' },
  { channel: 'SMS', icon: 'SMS', sent: 45600, delivered: 43600, opened: 0, clicked: 3928, converted: 1309, color: '#06b6d4', cost: 'Rp 45.6M', revenue: 'Rp 2.4B' },
  { channel: 'Email', icon: 'Email', sent: 89000, delivered: 80100, opened: 20025, clicked: 4005, converted: 801, color: '#f59e0b', cost: 'Rp 8.9M', revenue: 'Rp 1.4B' },
  { channel: 'Branch / Walk-in', icon: 'Branch', sent: 2800, delivered: 2800, opened: 2800, clicked: 1400, converted: 840, color: '#10b981', cost: 'Rp 280M', revenue: 'Rp 1.5B' },
];

const TEMPLATES = [
  { name: 'Welcome New User', channel: 'Push', convRate: 22, users: 12400, color: '#4f8ef7', status: 'Active' },
  { name: 'Bill Reminder -3 days', channel: 'Push', convRate: 94, users: 45600, color: '#10b981', status: 'Active' },
  { name: 'Cross-Sell Offer', channel: 'In-App', convRate: 18, users: 34821, color: '#8b5cf6', status: 'Active' },
  { name: 'Promo Bulan Ini 0%', channel: 'Push', convRate: 14, users: 89000, color: '#f97316', status: 'Active' },
  { name: 'Dormant Winback', channel: 'SMS', convRate: 6, users: 8920, color: '#06b6d4', status: 'Paused' },
  { name: 'Survey NPS', channel: 'Email', convRate: 8, users: 45600, color: '#f59e0b', status: 'Draft' },
];

const CAMPAIGNS = [
  {
    id: 'ramadan-promo', name: 'Ramadan Promo 0% Tenor 6 Bulan',
    status: 'live', progress: 72, budget: 'Rp 840M', spent: 'Rp 604.8M',
    start: '14 Jun 2026', end: '14 Jul 2026',
    reach: '234K', impressions: '1.2M', conversions: 8920,
    revenue: 'Rp 15.8B', roas: '26.2x', channel: 'Push + In-App + SMS',
    team: ['Andi (Lead)', 'Dewi (Content)', 'Budi (CDP)'],
    updates: [
      { date: '22 Jul', text: 'Campaign pacing on track — 72% spend, 68% conversions achieved' },
      { date: '18 Jul', text: 'Day 28 creative refresh: new visual + urgency copy deployed' },
      { date: '14 Jun', text: 'Campaign launched across all 5 channels simultaneously' },
    ],
    color: '#4f8ef7',
  },
  {
    id: 'fifgo-onboarding', name: 'FIFGO Onboarding Flow',
    status: 'live', progress: 88, budget: 'Rp 320M', spent: 'Rp 281.6M',
    start: '1 Jul 2026', end: '31 Jul 2026',
    reach: '124K', impressions: '412K', conversions: 8920,
    revenue: 'Rp 8.4B', roas: '29.8x', channel: 'Push + In-App',
    team: ['Andi (Lead)', 'Sari (UX)', 'Budi (CDP)'],
    updates: [
      { date: '23 Jul', text: 'Day 23 — 88% spend. 8,920 new user activations. On track.' },
      { date: '15 Jul', text: 'A/B test: variant B showing +12% onboarding completion' },
      { date: '1 Jul', text: 'Campaign launched with segmented new user audience' },
    ],
    color: '#10b981',
  },
  {
    id: 'spektra-dormant', name: 'SPEKTRA Dormant Re-Engage',
    status: 'live', progress: 45, budget: 'Rp 180M', spent: 'Rp 81M',
    start: '7 Jul 2026', end: '31 Jul 2026',
    reach: '28K', impressions: '89K', conversions: 1340,
    revenue: 'Rp 2.1B', roas: '25.9x', channel: 'SMS + Push',
    team: ['Budi (Lead)', 'Dewi (Content)'],
    updates: [
      { date: '22 Jul', text: 'Day 15 special offer sent — 1,340 conversions from 28K reach' },
      { date: '14 Jul', text: 'Day 7 follow-up deployed — open rate 40%' },
      { date: '7 Jul', text: 'Journey triggered for 28K dormant SPEKTRA users' },
    ],
    color: '#f97316',
  },
  {
    id: 'danastra-crosssell', name: 'DANASTRA Cross-Sell FIFASTRA',
    status: 'live', progress: 58, budget: 'Rp 220M', spent: 'Rp 127.6M',
    start: '7 Jul 2026', end: '31 Jul 2026',
    reach: '45K', impressions: '178K', conversions: 2680,
    revenue: 'Rp 4.8B', roas: '37.6x', channel: 'In-App + Push',
    team: ['Andi (Lead)', 'Sari (Content)', 'Budi (CDP)'],
    updates: [
      { date: '21 Jul', text: 'Day 14 follow-up: 2,680 cross-sell conversions. ROAS 37.6x.' },
      { date: '14 Jul', text: 'Day 7 step activated — personalized success stories sent' },
      { date: '7 Jul', text: 'Segmentation live: 45K DANASTRA users with 1-loan profile' },
    ],
    color: '#06b6d4',
  },
  {
    id: 'bill-reminder-july', name: 'Smart Bill Reminder July',
    status: 'live', progress: 100, budget: 'Rp 60M', spent: 'Rp 60M',
    start: '1 Jul 2026', end: '23 Jul 2026',
    reach: '45.6K', impressions: '136.8K', conversions: 42840,
    revenue: 'Rp 76.8B', roas: '1,280x', channel: 'Push + SMS',
    team: ['Budi (Lead)', 'Dewi (Content)'],
    updates: [
      { date: '23 Jul', text: 'Campaign complete — 94.2% collection rate. Target exceeded.' },
      { date: '1 Jul', text: 'Day -3 automated reminders triggered for 45.6K users' },
    ],
    color: '#8b5cf6',
  },
  {
    id: 'q3-brand', name: 'Q3 FIFGROUP Brand Awareness',
    status: 'draft', progress: 0, budget: 'Rp 1.2B', spent: 'Rp 0',
    start: '1 Aug 2026', end: '30 Sep 2026',
    reach: 'TBD', impressions: 'TBD', conversions: 0,
    revenue: 'TBD', roas: 'TBD', channel: 'Digital + OOH',
    team: ['Andi (Lead)', 'Sari (Content)', 'Dewi (Media)'],
    updates: [
      { date: '23 Jul', text: 'Brief submitted — awaiting creative agency pitch deck' },
      { date: '20 Jul', text: 'Budget approved. Targeting 5M reach across Java' },
    ],
    color: '#f59e0b',
  },
];

type Tab = 'channels' | 'campaigns';

const TABS: { id: Tab; label: string }[] = [
  { id: 'channels', label: 'Channels' },
  { id: 'campaigns', label: 'Campaigns' },
];

export default function MarketingPage() {
  const [tab, setTab] = React.useState<Tab>('channels');
  const [selectedCampaign, setSelectedCampaign] = React.useState('ramadan-promo');
  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const campaign = CAMPAIGNS.find(c => c.id === selectedCampaign)!;
  const totalSent = CHANNELS.reduce((s, c) => s + c.sent, 0);
  const totalConverted = CHANNELS.reduce((s, c) => s + c.converted, 0);
  const totalLive = CAMPAIGNS.filter(c => c.status === 'live').length;
  const liveCampaigns = CAMPAIGNS.filter(c => c.status === 'live' && c.revenue !== 'TBD');
  const totalRevenue = liveCampaigns.reduce((s, c) => s + parseFloat(c.revenue.replace(/[Rp.\sB]/g, '')), 0);
  const totalSpend = liveCampaigns.reduce((s, c) => s + parseFloat(c.spent.replace(/[Rp.\sBM]/g, '')), 0);
  const avgRoas = totalSpend > 0 ? Math.round(totalRevenue / totalSpend) : 0;
  const bestConv = Math.max(...CHANNELS.map(c => c.converted / c.sent * 100));


  return (
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Marketing & Campaigns</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Omnichannel marketing & campaign tracking — July 2026</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>·</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* Summary KPIs — always visible */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#4f8ef715' }}>
            <TrendUp size={18} style={{ color: '#4f8ef7' }} weight="fill" />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#6b7280' }}>Total Reach</p>
            <p className="text-lg font-extrabold" style={{ color: '#111827' }}>{Math.round(totalSent / 1000)}K</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#10b98115' }}>
            <CheckCircle size={18} style={{ color: '#10b981' }} weight="fill" />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#6b7280' }}>Conversions</p>
            <p className="text-lg font-extrabold" style={{ color: '#111827' }}>{totalConverted.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f9731615' }}>
            <Rocket size={18} style={{ color: '#f97316' }} weight="fill" />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#6b7280' }}>Live Campaigns</p>
            <p className="text-lg font-extrabold" style={{ color: '#111827' }}>{totalLive}/6</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#10b98115' }}>
            <CurrencyCircleDollar size={18} style={{ color: '#10b981' }} weight="fill" />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#6b7280' }}>Est. Revenue</p>
            <p className="text-lg font-extrabold" style={{ color: '#111827' }}>Rp 108B</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={tab === t.id
              ? { background: '#1e3a5f', color: '#fff' }
              : { background: 'transparent', color: '#6b7280' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CHANNELS TAB */}
      {tab === 'channels' && (
        <div className="space-y-5">
          {/* Channel Table */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Channel Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                    <th className="text-left pb-2 pr-4">Channel</th>
                    <th className="text-right pb-2 pr-4">Sent</th>
                    <th className="text-right pb-2 pr-4">Delivered</th>
                    <th className="text-right pb-2 pr-4">Opened</th>
                    <th className="text-right pb-2 pr-4">Clicked</th>
                    <th className="text-right pb-2 pr-4">Conv.</th>
                    <th className="text-right pb-2 pr-4">Conv%</th>
                    <th className="text-right pb-2 pr-4">Cost</th>
                    <th className="text-right pb-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {CHANNELS.map(c => {
                    const convPct = Math.round(c.converted / c.sent * 100);
                    const isBest = convPct >= bestConv - 2;
                    return (
                      <tr key={c.channel} style={{ borderBottom: '1px solid #f9fafb' }}>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${c.color}15` }}>
                              <MktIcon channel={c.channel} size={16} />
                            </div>
                            <span className="text-sm font-semibold" style={{ color: c.color }}>{c.channel}</span>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>{c.sent.toLocaleString()}</span></td>
                        <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>{c.delivered.toLocaleString()}</span></td>
                        <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>{c.opened > 0 ? c.opened.toLocaleString() : '—'}</span></td>
                        <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#374151' }}>{c.clicked.toLocaleString()}</span></td>
                        <td className="py-3.5 pr-4 text-right"><span className="text-sm font-bold" style={{ color: '#10b981' }}>{c.converted.toLocaleString()}</span></td>
                        <td className="py-3.5 pr-4 text-right">
                          <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: isBest ? '#ecfdf5' : '#f3f4f6', color: isBest ? '#059669' : '#374151' }}>
                            {convPct}%
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-right"><span className="text-sm font-medium" style={{ color: '#6b7280' }}>{c.cost}</span></td>
                        <td className="py-3.5 text-right"><span className="text-sm font-bold" style={{ color: '#059669' }}>{c.revenue}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Push Templates */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold mb-5" style={{ color: '#111827' }}>Notification Templates</h3>
            <div className="grid grid-cols-3 gap-4">
              {TEMPLATES.map(t => (
                <div key={t.name} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${t.color}15` }}>
                    <Bell size={18} style={{ color: t.color }} weight="fill" />
                  </div>
                  <p className="text-xs font-bold mb-1" style={{ color: '#111827' }}>{t.name}</p>
                  <span className="text-[9px] font-semibold mb-3 px-2 py-0.5 rounded-full" style={{ background: `${t.color}15`, color: t.color }}>{t.channel}</span>
                  <div className="w-full space-y-2 mt-auto">
                    <div className="h-2 rounded-full overflow-hidden bg-gray-200">
                      <div className="h-full rounded-full" style={{ width: `${t.convRate}%`, background: t.color }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px]" style={{ color: '#9ca3af' }}>{t.users.toLocaleString()} users</span>
                      <span className="text-[10px] font-bold" style={{ color: t.color }}>{t.convRate}%</span>
                    </div>
                  </div>
                  <span className={`text-[9px] mt-2 px-2 py-0.5 rounded-full font-bold ${
                    t.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    t.status === 'Paused' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CAMPAIGNS TAB */}
      {tab === 'campaigns' && (
        <div className="space-y-5">
          {/* Campaign Cards */}
          <div className="grid grid-cols-3 gap-4">
            {CAMPAIGNS.map(c => {
              const isSelected = selectedCampaign === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCampaign(c.id)}
                  className="rounded-2xl p-4 border cursor-pointer transition-all flex flex-col"
                  style={{
                    background: isSelected ? `${c.color}08` : 'white',
                    border: `1px solid ${isSelected ? c.color + '80' : '#e5e7eb'}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}15` }}>
                      <Rocket size={16} style={{ color: c.color }} weight="fill" />
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      c.status === 'live' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'draft' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>{c.status.toUpperCase()}</span>
                  </div>
                  <p className="text-xs font-bold mb-1 flex-1" style={{ color: '#111827' }}>{c.name}</p>
                  <p className="text-[10px] mb-3" style={{ color: '#9ca3af' }}>{c.channel}</p>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all" style={{ width: `${c.progress}%`, background: c.color }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px]" style={{ color: '#9ca3af' }}>{c.spent} spent</span>
                    <span className="text-[10px] font-bold" style={{ color: c.color }}>{c.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Campaign Detail */}
          <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${campaign.color}40` }}>
            <div className="p-5 flex items-center gap-4 flex-wrap" style={{ background: `${campaign.color}08`, borderBottom: `1px solid ${campaign.color}20` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${campaign.color}15` }}>
                <Rocket size={22} style={{ color: campaign.color }} weight="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h2 className="text-lg font-extrabold" style={{ color: '#111827' }}>{campaign.name}</h2>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    campaign.status === 'live' ? 'bg-emerald-100 text-emerald-700' :
                    campaign.status === 'draft' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>{campaign.status.toUpperCase()}</span>
                </div>
                <p className="text-xs" style={{ color: '#6b7280' }}>{campaign.channel} · {campaign.start} — {campaign.end}</p>
              </div>
              <div className="flex gap-6 flex-wrap">
                {[
                  { label: 'Reach', value: campaign.reach },
                  { label: 'Conversions', value: campaign.conversions > 0 ? campaign.conversions.toLocaleString() : '—' },
                  { label: 'Revenue', value: campaign.revenue },
                  { label: 'ROAS', value: campaign.roas },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <p className="text-lg font-extrabold" style={{ color: '#111827' }}>{m.value}</p>
                    <p className="text-[10px]" style={{ color: '#9ca3af' }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 grid grid-cols-2 gap-5">
              <div>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Budget Tracking</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Budget Used</span>
                      <span className="text-xs font-bold" style={{ color: campaign.color }}>{campaign.spent} / {campaign.budget}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${campaign.progress}%`, background: campaign.color }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-extrabold" style={{ color: '#111827' }}>{campaign.budget}</p>
                      <p className="text-[10px]" style={{ color: '#9ca3af' }}>Total Budget</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-extrabold" style={{ color: '#059669' }}>{campaign.spent}</p>
                      <p className="text-[10px]" style={{ color: '#9ca3af' }}>Spent</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold mt-5 mb-3" style={{ color: '#111827' }}>Team</h3>
                <div className="flex gap-2 flex-wrap">
                  {campaign.team.map(t => (
                    <span key={t} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: `${campaign.color}15`, color: campaign.color, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Timeline Updates</h3>
                <div className="space-y-3">
                  {campaign.updates.map((u, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: campaign.color }}>
                          {campaign.updates.length - i}
                        </div>
                        {i < campaign.updates.length - 1 && <div className="w-px flex-1 my-1 bg-gray-200" />}
                      </div>
                      <div className="pb-3">
                        <p className="text-[10px] font-bold mb-0.5" style={{ color: '#9ca3af' }}>{u.date}</p>
                        <p className="text-xs" style={{ color: '#374151' }}>{u.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
