import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    alerts: [
      {
        id: 'alert-1',
        priority: 'urgent' as const,
        app_id: 'fifada',
        lob_id: null,
        title: 'FIFADA Rating Dropped 0.4★ in 3 Days',
        description: '60% negative reviews mention: "process terlalu lama di cabang". Rating dropped from 4.2 to 3.8.',
        root_cause: 'Branch turnaround time has increased to 7+ days. Digital submission users forced to visit branch for verification.',
        recommendation: 'Sync with operations team to reduce branch processing bottleneck. Consider implementing queue booking to manage branch load.',
        owner: 'Operations Team',
        confidence: 'high' as const,
        based_on: '847 reviews, 30-day rating trend',
        status: 'open' as const,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'alert-2',
        priority: 'watch' as const,
        app_id: null,
        lob_id: 'spektra',
        title: 'SPEKTRA LoB — Only 28% of FIFGO Users Access',
        description: 'SPEKTRA penetration inside FIFGO is 28%, below target of 50%. 72% of users never explore SPEKTRA.',
        root_cause: 'Low visibility in FIFGO app navigation. Document upload complexity higher than other LoBs.',
        recommendation: 'Improve SPEKTRA placement in FIFGO home screen. Simplify document upload requirements. Consider reducing required documents from 6 to 3.',
        owner: 'FIFGO Product Team',
        confidence: 'high' as const,
        based_on: '234K active users, 62% drop-off at document upload stage',
        status: 'open' as const,
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'alert-3',
        priority: 'info' as const,
        app_id: 'fifgo',
        lob_id: null,
        title: 'FIFGO Downloads Up 23% This Week',
        description: 'FIFGO downloads increased 23% WoW, driven by improved Finance category ranking on Play Store.',
        root_cause: 'ASO improvements from updated screenshots and keyword targeting in Q2 2026.',
        recommendation: 'Maintain momentum. Continue weekly keyword monitoring. Consider pushing additional ASO campaign.',
        owner: 'Digital Team',
        confidence: 'high' as const,
        based_on: 'AppTweak download tracking, category ranking data',
        status: 'open' as const,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  };
  return NextResponse.json(data);
}
