'use client';

import * as React from 'react';
import { Rocket, ChartBar, TrendUp, CurrencyCircleDollar, Calendar, Users } from '@phosphor-icons/react';

const CAMPAIGNS = [
  {
    id: 'ramadan-promo',
    name: 'Ramadan Promo 0% Tenor 6 Bulan',
    status: 'live',
    progress: 72,
    budget: 'Rp 840M',
    spent: 'Rp 604.8M',
    start: '14 Jun 2026',
    end: '14 Jul 2026',
    reach: '234K',
    impressions: '1.2M',
    conversions: 8920,
    revenue: 'Rp 15.8B',
    roas: '26.2x',
    channel: 'Push + In-App + SMS',
    team: ['Andi (Lead)', 'Dewi (Content)', 'Budi (CDP)'],
    updates: [
      { date: '22 Jul', text: 'Campaign pacing on track — 72% spend, 68% conversions achieved' },
      { date: '18 Jul', text: 'Day 28 creative refresh: new visual + urgency copy deployed' },
      { date: '14 Jun', text: 'Campaign launched across all 5 channels simultaneously' },
    ],
    color: '#4f8ef7',
  },
  {
    id: 'fifgo-onboarding',
    name: 'FIFGO Onboarding Flow',
    status: 'live',
    progress: 88,
    budget: 'Rp 320M',
    spent: 'Rp 281.6M',
    start: '1 Jul 2026',
    end: '31 Jul 2026',
    reach: '124K',
    impressions: '412K',
    conversions: 8920,
    revenue: 'Rp 8.4B',
    roas: '29.8x',
    channel: 'Push + In-App',
    team: ['Andi (Lead)', 'Sari (UX)', 'Budi (CDP)'],
    updates: [
      { date: '23 Jul', text: 'Day 23 — 88% spend. 8,920 new user activations. On track.' },
      { date: '15 Jul', text: 'A/B test: variant B showing +12% onboarding completion' },
      { date: '1 Jul', text: 'Campaign launched with segmented new user audience' },
    ],
    color: '#10b981',
  },
  {
    id: 'spektra-dormant',
    name: 'SPEKTRA Dormant Re-Engage',
    status: 'live',
    progress: 45,
    budget: 'Rp 180M',
    spent: 'Rp 81M',
    start: '7 Jul 2026',
    end: '31 Jul 2026',
    reach: '28K',
    impressions: '89K',
    conversions: 1340,
    revenue: 'Rp 2.1B',
    roas: '25.9x',
    channel: 'SMS + Push',
    team: ['Budi (Lead)', 'Dewi (Content)'],
    updates: [
      { date: '22 Jul', text: 'Day 15 special offer sent — 1,340 conversions from 28K reach' },
      { date: '14 Jul', text: 'Day 7 follow-up deployed — open rate 40%' },
      { date: '7 Jul', text: 'Journey triggered for 28K dormant SPEKTRA users' },
    ],
    color: '#f97316',
  },
  {
    id: 'danastra-crosssell',
    name: 'DANASTRA Cross-Sell FIFASTRA',
    status: 'live',
    progress: 58,
    budget: 'Rp 220M',
    spent: 'Rp 127.6M',
    start: '7 Jul 2026',
    end: '31 Jul 2026',
    reach: '45K',
    impressions: '178K',
    conversions: 2680,
    revenue: 'Rp 4.8B',
    roas: '37.6x',
    channel: 'In-App + Push',
    team: ['Andi (Lead)', 'Sari (Content)', 'Budi (CDP)'],
    updates: [
      { date: '21 Jul', text: 'Day 14 follow-up: 2,680 cross-sell conversions. ROAS 37.6x.' },
      { date: '14 Jul', text: 'Day 7 step activated — personalized success stories sent' },
      { date: '7 Jul', text: 'Segmentation live: 45K DANASTRA users with 1-loan profile' },
    ],
    color: '#06b6d4',
  },
  {
    id: 'bill-reminder-july',
    name: 'Smart Bill Reminder July',
    status: 'live',
    progress: 100,
    budget: 'Rp 60M',
    spent: 'Rp 60M',
    start: '1 Jul 2026',
    end: '23 Jul 2026',
    reach: '45.6K',
    impressions: '136.8K',
    conversions: 42840,
    revenue: 'Rp 76.8B',
    roas: '1,280x',
    channel: 'Push + SMS',
    team: ['Budi (Lead)', 'Dewi (Content)'],
    updates: [
      { date: '23 Jul', text: 'Campaign complete — 94.2% collection rate. Target exceeded.' },
      { date: '1 Jul', text: 'Day -3 automated reminders triggered for 45.6K users' },
    ],
    color: '#8b5cf6',
  },
  {
    id: 'q3-brand',
    name: 'Q3 FIFGROUP Brand Awareness',
    status: 'draft',
    progress: 0,
    budget: 'Rp 1.2B',
    spent: 'Rp 0',
    start: '1 Aug 2026',
    end: '30 Sep 2026',
    reach: 'TBD',
    impressions: 'TBD',
    conversions: 0,
    revenue: 'TBD',
    roas: 'TBD',
    channel: 'Digital + OOH',
    team: ['Andi (Lead)', 'Sari (Content)', 'Dewi (Media)'],
    updates: [
      { date: '23 Jul', text: 'Brief submitted — awaiting creative agency pitch deck' },
      { date: '20 Jul', text: 'Budget approved. Targeting 5M reach across Java' },
    ],
    color: '#f59e0b',
  },
];

export default function CampaignsPage() {
  const [selected, setSelected] = React.useState('ramadan-promo');
  const campaign = CAMPAIGNS.find(c => c.id === selected)!;
  const totalLive = CAMPAIGNS.filter(c => c.status === 'live').length;

  // Derive avg ROAS from actual revenue / spend of live campaigns
  const liveCampaigns = CAMPAIGNS.filter(c => c.status === 'live' && c.revenue !== 'TBD');
  const totalRevenue = liveCampaigns.reduce((s, c) => s + parseFloat(c.revenue.replace(/[Rp.\sB]/g, '')), 0);
  const totalSpend = liveCampaigns.reduce((s, c) => s + parseFloat(c.spent.replace(/[Rp.\sBM]/g, '')), 0);
  const avgRoas = totalSpend > 0 ? Math.round(totalRevenue / totalSpend) : 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Campaign Projects</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Active campaign reporting — July 2026</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-emerald-50" style={{ color: '#059669' }}>{totalLive} Live</span>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-blue-50" style={{ color: '#1d4ed8' }}>1 Draft</span>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-gray-100" style={{ color: '#6b7280' }}>5 Complete</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { icon: Rocket, label: 'Live Campaigns', value: `${totalLive}/6`, color: '#4f8ef7' },
          { icon: ChartBar, label: 'Total Spend', value: 'Rp 1.15B', sub: 'of Rp 2.82B budget', color: '#f97316' },
          { icon: CurrencyCircleDollar, label: 'Attributed Revenue', value: 'Rp 108B', sub: 'All live campaigns', color: '#10b981' },
          { icon: TrendUp, label: 'Avg ROAS', value: `${avgRoas}x`, sub: 'Revenue / spend · live campaigns', color: '#8b5cf6' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={22} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>{m.label}</p>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-[11px]" style={{ color: '#9ca3af' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-3 gap-4">
        {CAMPAIGNS.map(c => {
          const isSelected = selected === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelected(c.id)}
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
        <div className="p-5 flex items-center gap-4" style={{ background: `${campaign.color}08`, borderBottom: `1px solid ${campaign.color}20` }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${campaign.color}15` }}>
            <Rocket size={22} style={{ color: campaign.color }} weight="fill" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-lg font-extrabold" style={{ color: '#111827' }}>{campaign.name}</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                campaign.status === 'live' ? 'bg-emerald-100 text-emerald-700' :
                campaign.status === 'draft' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>{campaign.status.toUpperCase()}</span>
            </div>
            <p className="text-xs" style={{ color: '#6b7280' }}>{campaign.channel} · {campaign.start} — {campaign.end}</p>
          </div>
          <div className="flex gap-6">
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
  );
}
