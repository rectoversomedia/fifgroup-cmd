import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    summary: {
      id: 'summary-1',
      summary_text: 'Digital channel performance is strong this month with 67% of applications coming through digital, up 9 percentage points from last month. Downloads grew 23% driven by improved ASO ranking in Finance category — FIFGO now holds #1 position. Key concern: FIFADA rating declined to 3.8★ (-0.4) in 3 days, correlating with increased branch processing time. SPEKTRA LoB adoption inside FIFGO remains low at 28%, with 62% of users dropping off at the document upload stage. Cross-sell opportunity identified: 34,821 users have only 1 LoB product and are eligible for a second.',
      key_findings: [
        'FIFGO maintained #1 position in Finance category, 850K downloads (+23%)',
        'FIFADA rating decline: -0.4★ in 3 days, 60% negative reviews mention long branch process',
        'SPEKTRA penetration 28% vs 50% target — document upload is main bottleneck',
        'Digital-first users now 71% (up 9pts), reducing branch dependency',
        'KYC document rejection causing 18% of hybrid completions',
      ],
      priority_actions: [
        { action: 'Address FIFADA rating decline — sync with operations on branch SLA', owner: 'Operations Team', app: 'FIFADA' },
        { action: 'Simplify SPEKTRA document requirements (6 → 3 documents)', owner: 'FIFGO Product', lob: 'SPEKTRA' },
        { action: 'Capitalize on ASO momentum — update screenshots for FIFGO', owner: 'Digital Team', app: 'FIFGO' },
        { action: 'Add in-app selfie quality validation before KYC submission', owner: 'FIFGO Product' },
        { action: 'Launch cross-sell campaign for 34K single-LoB users', owner: 'Marketing Team' },
      ],
      generated_at: new Date().toISOString(),
    },
  };
  return NextResponse.json(data);
}
