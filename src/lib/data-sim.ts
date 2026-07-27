/**
 * FIFGROUP Digital Command Center — Data Simulation Layer
 *
 * All pages call functions from this module instead of hardcoded data.
 * To connect to real Supabase: replace the `return` body with:
 *   return await supabase.from('table').select()
 * Pages don't need to change.
 */

const BASE = {
  mauFifgo: 234000,
  mauFifada: 62000,
  disbursement: 89_200_000_000,
  conversionRate: 8.2,
  activeJourneys: 4,
  draftJourneys: 1,
};

function jitter(base: number, pct = 0.02): number {
  const delta = base * pct * (Math.random() * 2 - 1);
  return Math.round(base + delta);
}

function jitterFloat(base: number, decimals = 1, pct = 0.02): number {
  const delta = base * pct * (Math.random() * 2 - 1);
  return parseFloat((base + delta).toFixed(decimals));
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export async function getDashboardKPIs() {
  return {
    mauCombined: jitter(BASE.mauFifgo + BASE.mauFifada),
    mauFifgo: jitter(BASE.mauFifgo),
    mauFifada: jitter(BASE.mauFifada),
    mauChange: 12,
    disbursement: jitter(BASE.disbursement),
    disbursementChange: 18,
    conversionRate: jitterFloat(BASE.conversionRate),
    convChange: 0.6,
    activeJourneys: BASE.activeJourneys,
    draftJourneys: BASE.draftJourneys,
    pushOpenRate: 48,
    billReminderSuccess: 94,
    billCollectionRate: 94.2,
    avgDaysToDisburse: 3.8,
  };
}

// ─── App Health ───────────────────────────────────────────────────────────────

export async function getAppHealthMetrics(app: 'fifgo' | 'fifada') {
  if (app === 'fifgo') {
    return {
      status: 'healthy',
      statusText: 'HEALTHY',
      version: 'v3.2.1',
      rating: 4.2,
      downloads: '850K',
      mau: '234K',
      metrics: [
        { label: 'App Load Time', value: '1.8s', target: '< 3s', good: true },
        { label: 'API Response',  value: '210ms', target: '< 500ms', good: true },
        { label: 'Error Rate',     value: '0.2%', target: '< 1%', good: true },
        { label: 'Crash Rate',     value: '0.05%', target: '< 0.5%', good: true },
        { label: 'Push Delivery',  value: '99.1%', target: '> 95%', good: true },
        { label: 'Session Duration', value: '8.4 min', target: '> 5 min', good: true },
      ],
      issues: [],
      ratingTrend: [4.1, 4.1, 4.2, 4.2, 4.2],
      ratingColors: '#10b981',
    };
  }

  return {
    status: 'watch',
    statusText: 'WATCH',
    version: 'v2.8.0',
    rating: jitterFloat(3.8, 1),
    downloads: '210K',
    mau: '62K',
    lastUpdated: '23 Jul 2026',
    metrics: [
      { label: 'App Load Time',  value: '2.1s', target: '< 3s', good: true },
      { label: 'API Response',   value: '480ms', target: '< 500ms', good: true },
      { label: 'Error Rate',     value: `${jitterFloat(1.4, 1)}%`, target: '< 1%', good: false },
      { label: 'Crash Rate',     value: `${jitterFloat(0.8, 2)}%`, target: '< 0.5%', good: false },
      { label: 'Push Delivery',  value: `${jitterFloat(94.2, 1)}%`, target: '> 95%', good: false },
      { label: 'Session Duration', value: '5.1 min', target: '> 5 min', good: true },
    ],
    issues: [
      { severity: 'high',   text: 'Crash rate exceeds threshold — 1.4% detected', date: '22 Jul 2026' },
      { severity: 'high',   text: 'Error rate 1.4% — above 1% threshold', date: '22 Jul 2026' },
      { severity: 'medium', text: 'Push delivery at 94.2% — below 95% target', date: '21 Jul 2026' },
    ],
    ratingTrend: [4.2, 4.1, 4.0, 3.9, 3.8],
    ratingColors: '#f43f5e',
  };
}

// ─── Sales Funnel ─────────────────────────────────────────────────────────────

export async function getFunnelData() {
  return [
    { stage: 'Banner Viewed',   count: 124_800, color: '#4f8ef7' },
    { stage: 'App Opened',      count:  62_400, color: '#6366f1' },
    { stage: 'Form Started',    count:  31_200, color: '#8b5cf6' },
    { stage: 'Form Submitted',  count:  14_976, color: '#a855f7' },
    { stage: 'Approved',        count:   9_734, color: '#10b981' },
    { stage: 'Disbursed',       count:   8_512, color: '#059669' },
  ];
}

export async function getDisbursementsByLoB() {
  return [
    { lob: 'FIFASTRA', disbursed: 38_400_000_000, users: 168480, avgDays: 3.2, count: 21_420 },
    { lob: 'DANASTRA',  disbursed: 24_600_000_000, users: 142740, avgDays: 4.1, count: 14_180 },
    { lob: 'FINATRA',   disbursed: 12_800_000_000, users: 105300, avgDays: 3.9, count:  8_640 },
    { lob: 'AMITRA',    disbursed:  9_200_000_000, users: 121680, avgDays: 4.8, count:  6_240 },
    { lob: 'SPEKTRA',   disbursed:  4_200_000_000, users:  65520, avgDays: 5.2, count:  3_120 },
  ];
}

// ─── CDP Journeys ─────────────────────────────────────────────────────────────

export async function getCDPJourneys() {
  return [
    {
      id: 'new-user-nurture',
      name: 'New User Nurture',
      segment: 'New FIFGO Users',
      status: 'active',
      enrolled: jitter(84_200),
      convRate: 38,
      activeStep: 3,
      totalSteps: 5,
      color: '#4f8ef7',
      steps: [
        'Welcome Push (Day 0)',
        'Feature Discovery (Day 2)',
        'First Loan Intent (Day 5)',
        'Document Upload (Day 7)',
        'First Disbursement (Day 14)',
      ],
    },
    {
      id: 'cross-sell',
      name: 'Cross-Sell Single LoB',
      segment: 'Existing FIFASTRA Users',
      status: 'active',
      enrolled: jitter(56_700),
      convRate: 24,
      activeStep: 2,
      totalSteps: 4,
      color: '#10b981',
      steps: [
        'Intro Offer (Day 0)',
        'Benefits Explainer (Day 3)',
        'Upgrade CTA (Day 7)',
        'Priority Access (Day 10)',
      ],
    },
    {
      id: 'bill-reminder',
      name: 'Smart Bill Reminder',
      segment: 'Active Borrowers',
      status: 'active',
      enrolled: jitter(112_400),
      convRate: 94,
      activeStep: 1,
      totalSteps: 3,
      color: '#f59e0b',
      steps: [
        '7-Day Reminder Push',
        '3-Day Reminder + Penalty Info',
        'Grace Period + Call to Action',
      ],
    },
    {
      id: 'dormant',
      name: 'Dormant Re-Engagement',
      segment: '60+ Days Inactive',
      status: 'paused',
      enrolled: jitter(23_100),
      convRate: 11,
      activeStep: 1,
      totalSteps: 4,
      color: '#dc2626',
      steps: [
        'Re-Engagement Offer',
        'Win-Back Incentive (Paused)',
        'Exit Survey (Paused)',
        'Churn Tagging (Paused)',
      ],
    },
    {
      id: 'post-disbursement',
      name: 'Post-Disbursement Care',
      segment: 'Recent Disbursements',
      status: 'draft',
      enrolled: 0,
      convRate: 0,
      activeStep: 0,
      totalSteps: 4,
      color: '#6b7280',
      steps: [
        'Welcome + Docs Receipt (Draft)',
        'Repayment Guidance (Draft)',
        'Loyalty Upsell (Draft)',
        'Referral Invite (Draft)',
      ],
    },
  ];
}

// ─── User Segments ────────────────────────────────────────────────────────────

export async function getUserSegments() {
  return [
    { label: 'New Users (0-30d)',       count: jitter(45_200), color: '#4f8ef7', icon: 'UserPlus' },
    { label: 'Active Borrowers',         count: jitter(98_700), color: '#10b981', icon: 'CurrencyCircleDollar' },
    { label: 'Dormant (60d+)',           count: jitter(23_100), color: '#f59e0b', icon: 'Moon' },
    { label: 'High-Value Repeat',        count: jitter(12_400), color: '#8b5cf6', icon: 'Star' },
  ];
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

export async function getCampaigns() {
  return [
    { id: 1, name: 'Ramadan Campaign 2026',        channel: 'Push + SMS + Email', status: 'live',    progress: 100, budget: 480_000_000, spent: 480_000_000, reach: 2_400_000, conv: 48_000, roas: 8.2, team: 'Tim A', updated: '22 Jul' },
    { id: 2, name: 'FIFASTRA Motor Promo',         channel: 'Push + Social',      status: 'live',    progress: 72,  budget: 250_000_000, spent: 180_000_000, reach: 890_000,  conv: 21_400, roas: 6.8, team: 'Tim B', updated: '21 Jul' },
    { id: 3, name: 'SPEKTRA Education Drive',      channel: 'Social + KOL',      status: 'live',    progress: 45,  budget: 150_000_000, spent:  67_500_000, reach: 420_000,  conv:  8_900, roas: 4.1, team: 'Tim C', updated: '20 Jul' },
    { id: 4, name: 'AMITRA Payroll Partner Q3',   channel: 'B2B + Push',        status: 'planning',progress: 15,  budget: 320_000_000, spent:  48_000_000, reach: 180_000,  conv:  3_200, roas: 2.3, team: 'Tim A', updated: '19 Jul' },
    { id: 5, name: 'FINATRA Home Ownership Q3',   channel: 'Digital + OOH',     status: 'planning',progress: 8,   budget: 400_000_000, spent:  32_000_000, reach:  95_000,  conv:  1_800, roas: 1.9, team: 'Tim B', updated: '18 Jul' },
    { id: 6, name: 'FIFADA Back to School Drive',  channel: 'Social + Influencer',status: 'draft',  progress: 0,   budget: 180_000_000, spent:           0, reach:        0, conv:      0, roas:   0, team: 'Tim C', updated: '23 Jul' },
  ];
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents() {
  return [
    { id: 1,  type: 'app_opened',       category: 'App',      count: jitter(18_420), trend: '+4%',  icon: 'DeviceMobile' },
    { id: 2,  type: 'banner_viewed',    category: 'Marketing',count: jitter(41_600), trend: '+12%', icon: 'Eye' },
    { id: 3,  type: 'form_started',     category: 'Conversion',count: jitter(10_400), trend: '-2%',  icon: 'ClipboardText' },
    { id: 4,  type: 'form_abandoned',   category: 'Conversion',count: jitter(5_432), trend: '+8%',  icon: 'X' },
    { id: 5,  type: 'document_uploaded',category: 'Conversion',count: jitter(4_992), trend: '-3%',  icon: 'FileArrowUp' },
    { id: 6,  type: 'submitted',        category: 'Conversion',count: jitter(4_992), trend: '+5%',  icon: 'PaperPlaneTilt' },
    { id: 7,  type: 'approved',         category: 'Conversion',count: jitter(3_245), trend: '+7%',  icon: 'CheckCircle' },
    { id: 8,  type: 'disbursed',        category: 'Conversion',count: jitter(2_837), trend: '+9%',  icon: 'CurrencyCircleDollar' },
    { id: 9,  type: 'journey_enrolled', category: 'CDP',       count: jitter(7_840), trend: '+15%', icon: 'Path' },
    { id: 10, type: 'push_sent',        category: 'Marketing',count: jitter(32_100), trend: '+6%',  icon: 'Bell' },
    { id: 11, type: 'push_opened',      category: 'Marketing',count: jitter(15_408), trend: '+3%',  icon: 'BellOpen' },
    { id: 12, type: 'bill_reminded',    category: 'CDP',      count: jitter(9_620), trend: '+11%', icon: 'Receipt' },
  ];
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export async function getAlerts() {
  return [
    {
      id: 1,
      name: 'FIFADA Crash Rate',
      metric: 'Crash Rate',
      app: 'FIFADA',
      current: '1.4%',
      threshold: '> 0.5%',
      severity: 'HIGH' as const,
      status: 'triggered' as const,
      lastTriggered: '22 Jul 2026, 14:32 WIB',
      message: 'FIFADA crash rate exceeds threshold — 1.4% detected vs 0.5% limit. Engineering team notified.',
    },
    {
      id: 2,
      name: 'FIFADA Error Rate',
      metric: 'Error Rate',
      app: 'FIFADA',
      current: '1.4%',
      threshold: '> 1%',
      severity: 'HIGH' as const,
      status: 'triggered' as const,
      lastTriggered: '22 Jul 2026, 14:28 WIB',
      message: 'FIFADA error rate exceeds threshold — 1.4% detected vs 1% limit. Monitoring for escalation.',
    },
    {
      id: 3,
      name: 'SPEKTRA Document Drop-off',
      metric: 'Upload Drop-off',
      app: 'SPEKTRA',
      current: '62%',
      threshold: '> 60%',
      severity: 'HIGH' as const,
      status: 'triggered' as const,
      lastTriggered: '21 Jul 2026, 09:15 WIB',
      message: 'SPEKTRA document upload drop-off at 62%. UX team reviewing upload flow for friction points.',
    },
    {
      id: 4,
      name: 'Push Delivery Rate',
      metric: 'Push Delivery',
      app: 'FIFADA',
      current: '94.2%',
      threshold: '< 95%',
      severity: 'MEDIUM' as const,
      status: 'triggered' as const,
      lastTriggered: '21 Jul 2026, 16:45 WIB',
      message: 'Push delivery rate at 94.2% — below 95% target. Reviewing device token validity.',
    },
    {
      id: 5,
      name: 'Bill Reminder Success',
      metric: 'Reminder Success',
      app: 'FIFGO',
      current: '94%',
      threshold: '< 90%',
      severity: 'HEALTHY' as const,
      status: 'resolved' as const,
      lastTriggered: '18 Jul 2026, 10:00 WIB',
      message: 'Bill Reminder journey performing above threshold at 94% success rate.',
    },
    {
      id: 6,
      name: 'Avg Days to Disburse',
      metric: 'Disbursement Speed',
      app: 'All LoBs',
      current: '3.8 days',
      threshold: '> 5 days',
      severity: 'HEALTHY' as const,
      status: 'resolved' as const,
      lastTriggered: '15 Jul 2026, 08:00 WIB',
      message: 'Average disbursement speed at 3.8 days — well within 5-day target.',
    },
  ];
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export async function getRecommendations() {
  return [
    {
      id: 1,
      priority: 'HIGH',
      title: 'Fix FIFADA Crash & Error Rates',
      category: 'App Health',
      impact: 'Revenue',
      effort: 'High',
      impactScore: 9,
      effortScore: 7,
      description: 'FIFADA v2.8.0 shows 1.4% crash rate (threshold: 0.5%) and 1.4% error rate (threshold: 1%). Root cause analysis shows memory leak in document scanner module. Recommend hotfix within 48h.',
      actions: ['Deploy memory leak patch', 'Add crash reporting for scanner', 'QA regression test before release'],
      owner: 'Mobile Engineering',
      dueDate: '24 Jul 2026',
    },
    {
      id: 2,
      priority: 'HIGH',
      title: 'Reduce SPEKTRA Upload Drop-off (62%)',
      category: 'UX/Conversion',
      impact: 'Conversion',
      effort: 'Medium',
      impactScore: 8,
      effortScore: 4,
      description: '62% of SPEKTRA users drop off at document upload stage. Hypothesis: file size limit too small, unsupported format error. Recommend A/B testing larger limits and auto-compression.',
      actions: ['A/B test 10MB vs 25MB limit', 'Implement auto-compression', 'Add supported formats guide'],
      owner: 'Product & UX',
      dueDate: '28 Jul 2026',
    },
    {
      id: 3,
      priority: 'HIGH',
      title: 'Resume Dormant Re-Engagement Journey',
      category: 'CDP',
      impact: 'MAU',
      effort: 'Low',
      impactScore: 7,
      effortScore: 2,
      description: 'Dormant Re-Engagement journey has been paused since 15 Jul. 23K dormant users are not receiving re-activation nudges. Resume immediately after FIFADA stability fix.',
      actions: ['Resume journey in Insider', 'Monitor conversion rate', 'Review pause criteria for future'],
      owner: 'CDP Team',
      dueDate: '25 Jul 2026',
    },
    {
      id: 4,
      priority: 'MEDIUM',
      title: 'Activate Post-Disbursement Care Journey',
      category: 'CDP',
      impact: 'Retention',
      effort: 'Medium',
      impactScore: 6,
      effortScore: 5,
      description: 'Post-Disbursement Care journey is still in Draft status. Activating it will improve borrower retention and enable referral upsell. 3 steps are ready for QA.',
      actions: ['QA all 4 journey steps', 'Load audience segment', 'Set up conversion tracking'],
      owner: 'CDP Team',
      dueDate: '31 Jul 2026',
    },
    {
      id: 5,
      priority: 'MEDIUM',
      title: 'AMITRA Disbursement Speed Optimization',
      category: 'Operations',
      impact: 'Customer Experience',
      effort: 'High',
      impactScore: 5,
      effortScore: 8,
      description: 'AMITRA avg days to disburse at 4.8 days (highest among LoBs). Root cause: manual review step adds 1.5 days. Recommend automating low-risk approvals.',
      actions: ['Audit manual review criteria', 'Automate < Rp 5M approvals', 'SLA monitoring dashboard'],
      owner: 'Operations',
      dueDate: '15 Aug 2026',
    },
    {
      id: 6,
      priority: 'LOW',
      title: 'FIFADA App Store Rating Recovery',
      category: 'Brand',
      impact: 'Acquisition',
      effort: 'Low',
      impactScore: 4,
      effortScore: 2,
      description: 'FIFADA rating declined from 4.2 to 3.8 over 5 periods. In-app review prompt at 4.8★+ threshold to recover rating without spamming users.',
      actions: ['Implement conditional review prompt', 'Address top 10 App Store complaints', 'Monitor rating weekly'],
      owner: 'Product',
      dueDate: '10 Aug 2026',
    },
  ];
}

// ─── Marketing Stats ──────────────────────────────────────────────────────────

export async function getMarketingStats() {
  return {
    channels: [
      { name: 'Push Notification', spend: 120_000_000, reach: 980_000, conv: 47_040, roas: 9.2, color: '#4f8ef7' },
      { name: 'SMS Campaign',      spend:  80_000_000, reach: 420_000, conv: 16_800, roas: 6.1, color: '#10b981' },
      { name: 'Social Media',      spend: 150_000_000, reach: 890_000, conv: 26_700, roas: 4.8, color: '#8b5cf6' },
      { name: 'Email Marketing',   spend:  40_000_000, reach: 310_000, conv: 13_950, roas: 7.3, color: '#f59e0b' },
      { name: 'KOL / Influencer',  spend: 200_000_000, reach: 620_000, conv: 18_600, roas: 3.2, color: '#ec4899' },
      { name: 'B2B Partnership',   spend:  60_000_000, reach: 180_000, conv:  7_200, roas: 5.4, color: '#06b6d4' },
    ],
    summary: {
      totalSpend: 650_000_000,
      totalReach: 3_400_000,
      avgRoas: 6.0,
      bestChannel: 'Push Notification',
    },
  };
}

// ─── Insider CDP ──────────────────────────────────────────────────────────────

export async function getInsiderCDP() {
  return {
    segments: [
      { name: 'New User (0-30d)',     count: jitter(45_200), growth: '+12%', color: '#4f8ef7' },
      { name: 'Active Borrower',      count: jitter(98_700), growth: '+8%',  color: '#10b981' },
      { name: 'Dormant (60d+)',        count: jitter(23_100), growth: '-3%',  color: '#f59e0b' },
      { name: 'High-Value Repeat',    count: jitter(12_400), growth: '+15%', color: '#8b5cf6' },
      { name: 'At-Risk Borrower',     count: jitter(8_200),  growth: '-5%',  color: '#dc2626' },
      { name: 'New FIFADA User',      count: jitter(6_400),  growth: '+22%', color: '#ec4899' },
    ],
    capabilities: [
      { name: 'Event Tracking',         desc: '12 event types tracked across both apps', active: true },
      { name: 'User Journey Mapping',  desc: '5 active journeys live in Insider CDP',   active: true },
      { name: 'Predictive Segmentation',desc: 'AI-driven churn & intent scoring',        active: true },
      { name: 'Personalization',       desc: 'Push & email content personalization',    active: true },
      { name: 'A/B Testing',           desc: 'Journey step A/B testing capability',     active: true },
      { name: 'Real-time Automation',  desc: 'Trigger-based automation < 1min latency', active: true },
    ],
    dataSources: [
      { name: 'FIFGO App Events',        type: 'App Analytics',   volume: '2.1M events/day' },
      { name: 'FIFADA App Events',      type: 'App Analytics',   volume: '0.8M events/day' },
      { name: 'CRM — Loan Data',       type: 'Loan System',      volume: '实时 Real-time' },
      { name: 'Branch Walk-in Data',   type: 'Offline Capture',  volume: '12K visits/day' },
      { name: 'Third-party Credit Bureau', type: 'External API', volume: 'On-demand' },
    ],
  };
}

// ─── Live Indicator ─────────────────────────────────────────────────────────────

let _tick = 0;
export async function getLiveTick() {
  _tick++;
  return {
    tick: _tick,
    lastUpdated: new Date().toISOString(),
  };
}
