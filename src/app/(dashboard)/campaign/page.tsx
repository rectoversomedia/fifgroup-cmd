'use client';

import * as React from 'react';
import {
  Megaphone, ChartLineUp, Eye, CurrencyCircleDollar,
  TrendUp, TrendDown, CheckCircle, Warning, Lightbulb,
  Target, Users, ArrowUpRight, Calendar,
} from '@phosphor-icons/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const CAMPAIGNS = [
  {
    id: 'hajatan-2026',
    name: 'Hajatan FIFGROUP',
    tagline: '" Hajatan Sekampung "',
    period: 'Feb — Apr 2026',
    status: 'completed',
    type: 'Brand Awareness',
    color: '#dc2626',
    objective: 'Memperkenalkan brand FIFGROUP ke masyarakat pedesaan/pinggiran kota melalui acara budaya lokal (hajatan)',
    reach: 4800000,
    impressions: 12400000,
    spend: 4200000000,
    conversions: 8420,
    leads: 14200,
    roas: 3.2,
    applicationStarted: 9800,
    applicationCompleted: 4200,
    disbursement: 12400000000,
    cpl: 295774,
    cpa: 498812,
    kpis: [
      { label: 'ROAS', value: '3.2x', target: '3.0x', up: true },
      { label: 'CPL', value: 'Rp 295K', target: 'Rp 350K', up: true },
      { label: 'Applications', value: '9,800', target: '8,000', up: true },
      { label: 'Disbursement', value: 'Rp 12.4B', target: 'Rp 10B', up: true },
    ],
    channels: ['Event On-site', 'Local Influencer', 'SMS Blast', 'Billboard'],
    audience: 'Rural Jawa & Sulawesi, 25-50 tahun',
    creative: [
      { asset: 'Hajatan Video 30s', format: 'MP4', views: '4.2M', ctr: '4.1%' },
      { asset: 'Testimonial Clip 15s', format: 'MP4', views: '2.1M', ctr: '3.8%' },
      { asset: 'Static Banner Set', format: 'PNG/JPG', views: '6.0M', ctr: '1.2%' },
    ],
    learnings: [
      {
        type: 'success',
        icon: CheckCircle,
        title: 'Event format "Hajatan" sangat resonates di pedesaan',
        desc: 'Pendekatan budaya lokal (hajatan sekampung) menciptakan word-of-mouth yang sangat kuat. 68% responden recall campaign melalui cerita dari tetangga yang menghadiri hajatan.',
        data: '68% aided recall via WOM, vs benchmark 22%',
      },
      {
        type: 'success',
        icon: CheckCircle,
        title: 'Local influencer > celebrity endorser untuk target rural',
        desc: 'KOL mikro daerah (10K-50K followers) dengan bahasa lokal mengdeliver 3x lebih banyak engagement dibanding celebrity macro dengan reach lebih besar.',
        data: 'Engagement rate: 8.4% (micro KOL) vs 2.1% (celebrity)',
      },
      {
        type: 'warning',
        icon: Warning,
        title: 'SMS blast deliverability di rural rendah',
        desc: 'Banyak nomor telepon yang tidak aktif atau salah. Pendataan target audience di village perlu divalidasi ulang dengan RT/RW.',
        data: 'SMS bounce rate: 34% di area tertentu',
      },
    ],
    recommendations: [
      'Tingkatkan budget untuk micro-KOL lokal di Ha2027 — ROI terbukti 3x lebih baik',
      'Building database audience rural perlu dimulai 2 bulan sebelum campaign launch',
      'Kurangi依赖 SMS blast, alihkan ke WhatsApp Broadcast yang open rate 2x lebih tinggi',
      'Tambahkan lokasi Ha2027 di area NTT & Papua untuk ekspansi geografis',
      'Siapkan toolkit digital (LPS viral kit) untuk participant agar bisa share sendiri di sosmed',
    ],
  },
  {
    id: 'spektra-launch',
    name: 'SPEKTRA Digital Launch',
    tagline: '" Mulai dari Spektrum "',
    period: 'Mar 2026',
    status: 'completed',
    type: 'Product Launch',
    color: '#8b5cf6',
    objective: 'Launch SPEKTRA (produk mikro) dengan fokus pada urban millennial — fully digital application',
    reach: 2100000,
    impressions: 6800000,
    spend: 1800000000,
    conversions: 12800,
    leads: 18400,
    roas: 4.8,
    applicationStarted: 18400,
    applicationCompleted: 5200,
    disbursement: 8200000000,
    cpl: 97826,
    cpa: 140625,
    kpis: [
      { label: 'ROAS', value: '4.8x', target: '4.0x', up: true },
      { label: 'App Completions', value: '5,200', target: '4,000', up: true },
      { label: 'CPL', value: 'Rp 97K', target: 'Rp 120K', up: true },
      { label: 'Disbursement', value: 'Rp 8.2B', target: 'Rp 7B', up: true },
    ],
    channels: ['Instagram', 'TikTok', 'Google Search', 'FIFGO App Push'],
    audience: 'Urban millennial, 22-35 tahun, first-time borrower',
    creative: [
      { asset: 'Launch Teaser 15s', format: 'Video', views: '3.1M', ctr: '5.2%' },
      { asset: 'KOL Series (5 creators)', format: 'Reels', views: '2.4M', ctr: '6.8%' },
      { asset: 'UGC Contest Entries', format: 'UGC', views: '1.8M', ctr: '—' },
    ],
    learnings: [
      {
        type: 'success',
        icon: CheckCircle,
        title: 'TikTok organic outperform paid di target urban millennial',
        desc: 'Content series dengan authentic storytelling dari real users outperform polished brand content. UGC contest-generated content drive 40% of final applications.',
        data: 'TikTok organic CPA: Rp 62K vs paid Meta CPA: Rp 148K',
      },
      {
        type: 'success',
        icon: CheckCircle,
        title: 'KOL series dengan "real borrower story" sangat efektif',
        desc: 'Video testimonial dari borrower nyata yang share pengalaman apply SPEKTRA dapat 6.8% avg CTR — jauh di atas industry benchmark 1-2%.',
        data: '5 KOL videos: 2.4M views, 12.4K clicks, 520 applications',
      },
      {
        type: 'warning',
        icon: Warning,
        title: 'FIFGO app drop-off rate masih tinggi di document upload stage',
        desc: '62% user yang start application tidak menyelesaikan document upload. Penyebab utama: selfie quality issue dan unclear requirement.',
        data: '12,200 started → 5,200 completed (42.6% completion rate)',
      },
    ],
    recommendations: [
      'Maintain UGC content strategy untuk Ha2027 — proven cost-effective',
      'Wajib untuk launch SPEKTRA v2: add in-app selfie validation before upload',
      'Kurangi timeline dari awareness-to-disbursement — target 3 days instead of 7 days',
      'A/B test loan amount framing: "Rp 5 juta" vs "Mulai Rp 1 juta"',
      'Persiapkan "SPEKTRA Challenge" UGC contest untuk Ha2027',
    ],
  },
  {
    id: 'ramadan-2026',
    name: 'Ramadan & Eid Campaign',
    tagline: '" Kebaikan Berlipat "',
    period: 'Feb — Mar 2026',
    status: 'completed',
    type: 'Seasonal',
    color: '#10b981',
    objective: 'Capture Ramadan spending season — position FIFGROUP sebagai solusi keuangan yang membantu masyarakat mempersiapkan kebutuhan Lebaran',
    reach: 6200000,
    impressions: 18200000,
    spend: 5800000000,
    conversions: 22400,
    leads: 35800,
    roas: 5.1,
    applicationStarted: 28000,
    applicationCompleted: 11200,
    disbursement: 42000000000,
    cpl: 162011,
    cpa: 258929,
    kpis: [
      { label: 'ROAS', value: '5.1x', target: '4.5x', up: true },
      { label: 'Disbursement', value: 'Rp 42B', target: 'Rp 35B', up: true },
      { label: 'Leads', value: '35,800', target: '30,000', up: true },
      { label: 'CPL', value: 'Rp 162K', target: 'Rp 180K', up: true },
    ],
    channels: ['TV', 'Digital Display', 'Google', 'Meta', 'SMS', 'WhatsApp'],
    audience: 'Muslim Indonesia, 20-45 tahun, all tier-1 & tier-2 cities',
    creative: [
      { asset: 'TVC 45s "Ibu" ', format: 'Video', views: '18.2M (GRP)', ctr: '—' },
      { asset: 'Digital Cutdown 15s', format: 'Video', views: '8.4M', ctr: '2.1%' },
      { asset: 'Social Carousel Set', format: 'Carousel', views: '4.1M', ctr: '3.4%' },
    ],
    learnings: [
      {
        type: 'success',
        icon: CheckCircle,
        title: 'Emotionally resonant storytelling outperform hard-sell approach',
        desc: '"Ibu" narrative yang fokus pada cerita manusia (bukan product features) deliver highest brand equity lift. Ada residual recall yang bertahan 3 bulan setelah campaign.',
        data: 'Brand equity lift: +18pts (vs benchmark +8pts)',
      },
      {
        type: 'success',
        icon: CheckCircle,
        title: 'WhatsApp Broadcast outperform semua digital channel',
        desc: 'Open rate 68%, CTR 22% — jauh di atas email (12% open, 3% CTR) dan SMS (45% open, 8% CTR). Personalisasi based on previous loan behavior sangat efektif.',
        data: 'WhatsApp CPA: Rp 82K vs Meta CPA: Rp 198K',
      },
      {
        type: 'warning',
        icon: Warning,
        title: 'TV spend efficiency need review for Ha2027',
        desc: 'TV deliver brand awareness yang tidak bisa di-measure dengan ROAS. Perlu ada framework untuk evaluate upper-funnel contribution beyond direct response.',
        data: 'TV spend: Rp 2.4B — attribution model unclear',
      },
    ],
    recommendations: [
      'Maintain "emotional storytelling" approach untuk Ha2027 — proven high equity impact',
      'Scale WhatsApp Broadcast budget — highest efficiency channel',
      'Build multivariate attribution model untuk measure TV contribution',
      'Persiapkan Ramadan earlier — start campaign planning August (vs October in Ha2026)',
      'Add "提前" (early-bird) mechanic: prepaid discount untuk yang apply before Ramadan',
    ],
  },
  {
    id: 'fifada-aso',
    name: 'FIFADA App Store Optimization',
    tagline: '" Download. Apply. Cair. "',
    period: 'Ongoing — Ha2026',
    status: 'active',
    type: 'App Growth',
    color: '#f59e0b',
    objective: 'Meningkatkan downloads dan app rating FIFADA melalui ASO (App Store Optimization)',
    reach: 890000,
    impressions: 2400000,
    spend: 320000000,
    conversions: 12400,
    leads: 12400,
    roas: 6.2,
    applicationStarted: 8200,
    applicationCompleted: 3100,
    disbursement: 4800000000,
    cpl: 25806,
    cpa: 25806,
    kpis: [
      { label: 'Downloads', value: '12,400', target: '10,000', up: true },
      { label: 'App Rating', value: '3.8★', target: '4.0★', up: false },
      { label: 'Crash Rate', value: '1.4%', target: '<0.5%', up: false },
      { label: 'ROAS', value: '6.2x', target: '5.0x', up: true },
    ],
    channels: ['Apple App Store', 'Google Play Store', 'ASO Tools'],
    audience: 'Existing FIFGROUP customers looking for FIFADA product',
    creative: [
      { asset: 'New Screenshots (v3)', format: 'Screenshot Set', views: '2.4M', ctr: '—' },
      { asset: 'App Preview Video', format: 'MP4', views: '890K', ctr: '—' },
    ],
    learnings: [
      {
        type: 'success',
        icon: CheckCircle,
        title: 'Screenshot update langsung impact download rate',
        desc: 'Update screenshot dengan benefit-focused messaging dan clearer UI explanation langsung naikkan download rate 23% WoW.',
        data: 'Download rate: +23% WoW after screenshot update',
      },
      {
        type: 'warning',
        icon: Warning,
        title: 'App crash rate 1.4% blocking positive reviews',
        desc: 'Average crash rate sebelum fix adalah 1.4% — users yang mengalami crash cenderung leave 1-star review. Fix crash = natural review improvement.',
        data: 'Crash rate correlated with 1-star reviews (r=0.82)',
      },
    ],
    recommendations: [
      'Engineering team perlu prioritize crash fix before next campaign — prerequisite',
      'Add A/B test untuk screenshot different messaging angles',
      'Target 4.0★ rating by Ha2027 — perlu 2,400 additional 5-star reviews',
      'Consider localized store listing untuk regional language (Jawa, Sunda)',
      'Add "What\'s New" section untuk improve update visibility',
    ],
  },
  {
    id: 'fifgo-retention',
    name: 'FIFGO Retention Nudge',
    tagline: '" Kami Rindu Anda "',
    period: 'Apr — May 2026',
    status: 'completed',
    type: 'Retention',
    color: '#06b6d4',
    objective: 'Re-engage dormant FIFGO users (> 30 hari tidak buka app) sebelum mereka churn permanen',
    reach: 142000,
    impressions: 412000,
    spend: 280000000,
    conversions: 9840,
    leads: 9840,
    roas: 12.4,
    kpis: [
      { label: 'ROAS', value: '12.4x', target: '8.0x', up: true },
      { label: 'Re-engaged', value: '9,840', target: '8,000', up: true },
      { label: 'CPL', value: 'Rp 28K', target: 'Rp 40K', up: true },
      { label: 'Churn Prevented', value: '~3,200', target: 'N/A', up: true },
    ],
    channels: ['Push Notification', 'In-App Message', 'Email', 'SMS'],
    audience: 'FIFGO users with no activity 30-90 days, had previous loan',
    creative: [
      { asset: 'Dormant Re-engage Push', format: 'Push', views: '142K', ctr: '18.2%' },
      { asset: 'Personalized Offer Email', format: 'Email', views: '68K', ctr: '12.4%' },
    ],
    learnings: [
      {
        type: 'success',
        icon: CheckCircle,
        title: 'Personalized re-engagement offer outperform generic push',
        desc: 'Segmentasi berdasarkan loan history + last activity = offer yang relevant. Users dengan previous loan di FINATRA receive FINATRA offer, dll.',
        data: 'Personalized CTR: 18.2% vs generic: 6.8%',
      },
      {
        type: 'success',
        icon: CheckCircle,
        title: 'Multi-channel sequence outperform single channel',
        desc: 'Push + Email + SMS sequence (tidak simultaneously) outperform single-channel push. Users yang tidak open push, respond ke email di hari ke-3.',
        data: 'Multi-channel CVR: 12.4% vs push-only: 8.1%',
      },
    ],
    recommendations: [
      'Build automated dormant detection + triggered re-engage sequence into core CDP',
      'A/B test "nostalgia message" vs "special offer" framing — both work, need optimal mix',
      'Consider "win-back" offer untuk 90+ day dormant — khusus loan amount Rp 1 juta, no documents',
      'Set up leading indicator dashboard untuk detect dormant early (7d, 14d, 30d thresholds)',
    ],
  },
  {
    id: 'kol-m歧b',
    name: 'KOL Micro-Brand Partnership',
    tagline: '" Real People. Real Stories. "',
    period: 'May — Jun 2026',
    status: 'completed',
    type: 'Influencer Marketing',
    color: '#ec4899',
    objective: 'Leverage micro-KOL untuk authentic storytelling tentang pengalaman pinjam di FIFGROUP',
    reach: 1240000,
    impressions: 3800000,
    spend: 680000000,
    conversions: 4800,
    leads: 7200,
    roas: 3.8,
    kpis: [
      { label: 'ROAS', value: '3.8x', target: '4.0x', up: false },
      { label: 'Engagement', value: '8.4%', target: '6.0%', up: true },
      { label: 'Applications', value: '4,800', target: '5,000', up: false },
      { label: 'CPL', value: 'Rp 94K', target: 'Rp 80K', up: false },
    ],
    channels: ['Instagram', 'TikTok', 'YouTube Shorts'],
    audience: '25-40 tahun, tier-2 & tier-3 cities, first-time borrower',
    creative: [
      { asset: 'Instagram Reels (24 creators)', format: 'Reels', views: '2.8M', ctr: '7.2%' },
      { asset: 'TikTok Series (18 creators)', format: 'Shorts', views: '1.2M', ctr: '9.4%' },
      { asset: 'YouTube Shorts (8 creators)', format: 'Shorts', views: '380K', ctr: '4.1%' },
    ],
    learnings: [
      {
        type: 'success',
        icon: CheckCircle,
        title: 'TikTok outperform Instagram untuk tier-2/3 audience',
        desc: 'TikTok cost-per-engagement 62% lebih murah dari Instagram untuk target audience ini. Content authentic feel di TikTok.',
        data: 'TikTok CPE: Rp 82 vs Instagram CPE: Rp 218',
      },
      {
        type: 'warning',
        icon: Warning,
        title: 'KOL vetting process perlu lebih rigorous',
        desc: '2 dari 50 KOL harus di-remove karena ada controversy atau fake followers. Pre-campaign vetting checklist perlu di-create.',
        data: '2/50 KOL failed vetting (4% failure rate, cost impact Rp 28M)',
      },
    ],
    recommendations: [
      'Tingkatkan TikTok allocation dari 30% → 50% of KOL budget',
      'Create KOL pre-vetting checklist: follower quality, content style, audience overlap',
      'Longer contract dengan top-performing KOL (6-month vs per-campaign)',
      'Build KOL performance database untuk quick reference di future campaigns',
      'Consider "KOL ambassador" program untuk 5-10 top micro-KOL',
    ],
  },
];

const YEARLY_STATS = {
  totalSpend: CAMPAIGNS.reduce((s, c) => s + (c.spend ?? 0), 0),
  totalDisbursement: CAMPAIGNS.reduce((s, c) => s + (c.disbursement ?? 0), 0),
  totalReach: CAMPAIGNS.reduce((s, c) => s + (c.reach ?? 0), 0),
  avgRoas: CAMPAIGNS.reduce((s, c) => s + (c.roas ?? 0), 0) / CAMPAIGNS.length,
  totalApplications: CAMPAIGNS.reduce((s, c) => s + (c.applicationStarted ?? 0), 0),
  activeCampaigns: CAMPAIGNS.filter(c => c.status === 'active').length,
};

export default function CampaignHubPage() {
  const [selected, setSelected] = React.useState<string>(CAMPAIGNS[0].id);
  const [filter, setFilter] = React.useState<string>('all');
  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const fmtIDR = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;
  const fmtNum = (v: number) => v.toLocaleString('id-ID');

  const campaign = CAMPAIGNS.find(c => c.id === selected)!;
  const filtered = filter === 'all' ? CAMPAIGNS : CAMPAIGNS.filter(c => c.type === filter);

  const roasChartData = CAMPAIGNS.map(c => ({
    name: c.name.replace(' Campaign', '').split(' ')[0],
    roas: c.roas,
    target: 4.0,
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Campaign Hub</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>2026 Campaign Archive — reporting & learnings for future planning</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* Yearly Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Spend', value: fmtIDR(YEARLY_STATS.totalSpend), icon: CurrencyCircleDollar, color: '#1e3a5f' },
          { label: 'Total Disbursement', value: fmtIDR(YEARLY_STATS.totalDisbursement), icon: ChartLineUp, color: '#10b981' },
          { label: 'Total Reach', value: fmtNum(YEARLY_STATS.totalReach), icon: Eye, color: '#4f8ef7' },
          { label: 'Avg ROAS', value: `${YEARLY_STATS.avgRoas.toFixed(1)}x`, icon: TrendUp, color: '#8b5cf6' },
          { label: 'Applications', value: fmtNum(YEARLY_STATS.totalApplications), icon: Target, color: '#f59e0b' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
              <m.icon size={18} style={{ color: m.color }} weight="fill" />
            </div>
            <p className="text-base font-bold" style={{ color: '#111827' }}>{m.value}</p>
            <p className="text-[11px]" style={{ color: '#9ca3af' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* ROAS Bar Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>ROAS by Campaign — 2026</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={roasChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}x`} />
            <Tooltip
              contentStyle={{ background: 'white', border: '1px solid #f3f4f6', borderRadius: 12, fontSize: 11 }}
              formatter={(v: unknown) => [`${(v as number).toFixed(1)}x`, 'ROAS']}
            />
            <Bar dataKey="roas" radius={[6, 6, 0, 0]}>
              {roasChartData.map((entry, i) => (
                <Cell key={i} fill={entry.roas >= entry.target ? '#10b981' : '#f59e0b'} />
              ))}
            </Bar>
            <Bar dataKey="target" fill="#f3f4f6" radius={[6, 6, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: '#10b981' }} /><span className="text-[10px]" style={{ color: '#6b7280' }}>Above target</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: '#f59e0b' }} /><span className="text-[10px]" style={{ color: '#6b7280' }}>Below target</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: '#f3f4f6' }} /><span className="text-[10px]" style={{ color: '#6b7280' }}>Target (4.0x)</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="space-y-3">
          {/* Filter */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 flex-wrap">
            {['all', 'Brand Awareness', 'Product Launch', 'Seasonal', 'Retention', 'Influencer Marketing', 'App Growth'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                style={filter === f ? { background: '#1e3a5f', color: 'white' } : { background: 'transparent', color: '#9ca3af' }}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className="w-full text-left rounded-2xl p-4 border transition-all"
              style={{
                background: selected === c.id ? `${c.color}08` : 'white',
                borderColor: selected === c.id ? c.color : '#f3f4f6',
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}20` }}>
                  <Megaphone size={14} style={{ color: c.color }} weight="fill" />
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                  c.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  c.status === 'completed' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'
                }`}>{c.status.toUpperCase()}</span>
              </div>
              <p className="text-sm font-bold mb-0.5" style={{ color: '#111827' }}>{c.name}</p>
              <p className="text-[10px] italic mb-2" style={{ color: '#9ca3af' }}>"{c.tagline}"</p>
              <div className="flex items-center gap-2 text-[10px]" style={{ color: '#9ca3af' }}>
                <Calendar size={10} />
                <span>{c.period}</span>
                <span>·</span>
                <span>{c.type}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 mt-3">
                <div>
                  <p className="text-[10px]" style={{ color: '#9ca3af' }}>ROAS</p>
                  <p className="text-xs font-bold" style={{ color: c.roas >= 4 ? '#10b981' : '#dc2626' }}>{c.roas}x</p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: '#9ca3af' }}>Spend</p>
                  <p className="text-xs font-bold" style={{ color: '#374151' }}>{fmtIDR(c.spend).replace('Rp ', '')}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Campaign Detail */}
        <div className="lg:col-span-2 space-y-5">
          {/* Campaign Header */}
          <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${campaign.color}20, ${campaign.color}05)`, border: `1px solid ${campaign.color}30` }}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: campaign.color }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: campaign.color }}>{campaign.type}</span>
                </div>
                <h2 className="text-xl font-extrabold" style={{ color: '#111827' }}>{campaign.name}</h2>
                <p className="text-sm italic" style={{ color: '#6b7280' }}>"{campaign.tagline}"</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 text-[11px]" style={{ color: '#9ca3af' }}>
                    <Calendar size={11} />{campaign.period}
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-gray-200" style={{ color: '#6b7280' }}>{campaign.audience}</span>
                </div>
              </div>
              <span className={`text-[9px] px-3 py-1 rounded-full font-bold ${
                campaign.status === 'active' ? 'bg-emerald-500 text-white' :
                campaign.status === 'completed' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-700'
              }`}>{campaign.status.toUpperCase()}</span>
            </div>
          </div>

          {/* KPI Performance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>KPI Performance</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {campaign.kpis.map(k => (
                <div key={k.label} className="p-3 rounded-xl" style={{ background: '#f9fafb' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: '#9ca3af' }}>{k.label}</span>
                    {k.up ? <TrendUp size={11} style={{ color: '#10b981' }} weight="bold" /> : <TrendDown size={11} style={{ color: '#dc2626' }} weight="bold" />}
                  </div>
                  <p className="text-base font-extrabold" style={{ color: '#111827' }}>{k.value}</p>
                  <p className="text-[9px]" style={{ color: '#9ca3af' }}>target: {k.target}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel + Channels */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Performance Funnel & Channels</h3>
            <div className="space-y-3 mb-4">
              {([
                { label: 'Impressions', value: campaign.impressions ?? 0, pct: 100 },
                { label: 'Reach', value: campaign.reach ?? 0, pct: Math.round(((campaign.reach ?? 0) / (campaign.impressions ?? 1)) * 100) },
                { label: 'Applications Started', value: campaign.applicationStarted ?? 0, pct: Math.round(((campaign.applicationStarted ?? 0) / (campaign.reach ?? 1)) * 100) },
                { label: 'Applications Completed', value: campaign.applicationCompleted ?? 0, pct: Math.round(((campaign.applicationCompleted ?? 0) / (campaign.applicationStarted ?? 1)) * 100) },
                { label: 'Disbursement', value: campaign.disbursement ?? 0, pct: Math.round(((campaign.disbursement ?? 0) / (campaign.applicationCompleted ?? 1)) * 100), isIDR: true },
              ] as { label: string; value: number; pct: number; isIDR?: boolean }[]).map((step, i) => (
                <div key={step.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px]" style={{ color: '#6b7280' }}>{step.label}</span>
                    <span className="text-[11px] font-bold" style={{ color: '#374151' }}>
                      {step.isIDR ? fmtIDR(step.value) : fmtNum(step.value)}
                      <span className="text-[10px] ml-1" style={{ color: '#9ca3af' }}>({step.pct}%)</span>
                    </span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${step.pct}%`, background: campaign.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {campaign.channels.map(ch => (
                <span key={ch} className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100" style={{ color: '#6b7280' }}>{ch}</span>
              ))}
            </div>
          </div>

          {/* Learnings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={16} style={{ color: '#f59e0b' }} weight="fill" />
              <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Learnings & Insights</h3>
            </div>
            <div className="space-y-4">
              {campaign.learnings.map((l, i) => {
                const Icon = l.icon;
                const isSuccess = l.type === 'success';
                return (
                  <div key={i} className="p-4 rounded-xl" style={{ background: isSuccess ? '#f0fdf4' : '#fffbeb', border: `1px solid ${isSuccess ? '#10b98130' : '#f59e0b30'}` }}>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: isSuccess ? '#10b98120' : '#f59e0b20' }}>
                        <Icon size={14} style={{ color: isSuccess ? '#10b981' : '#f59e0b' }} weight="fill" />
                      </div>
                      <div>
                        <p className="text-xs font-bold mb-1" style={{ color: '#374151' }}>{l.title}</p>
                        <p className="text-[11px] leading-relaxed mb-2" style={{ color: '#6b7280' }}>{l.desc}</p>
                        <p className="text-[10px] font-mono px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)', color: '#374151' }}>{l.data}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpRight size={16} style={{ color: '#10b981' }} weight="fill" />
              <h3 className="text-sm font-bold text-white">Recommendations for Future Campaigns</h3>
            </div>
            <div className="space-y-2.5">
              {campaign.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-black text-white">{i + 1}</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
