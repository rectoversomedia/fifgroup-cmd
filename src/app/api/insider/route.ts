import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    insider_metrics: {
      active_users: 234000,
      active_users_change: 15,
      sessions: 1200000,
      sessions_change: 18,
      avg_session_min: 8.4,
      avg_session_change: 2.1,
      applications: 12847,
      applications_change: 18,
      approval_rate: 67,
      approval_rate_change: -3,
      disbursement_amount: 89200000000,
      disbursement_change: 22,
      digital_first_pct: 71,
      digital_first_change: 9,
      hybrid_pct: 24,
      hybrid_change: -6,
      branch_only_pct: 5,
      branch_only_change: -3,
    },
    hybrid_bridge: {
      hybrid_completion_pct: 12,
      hybrid_change: -3,
      target: 5,
      top_reasons: [
        { reason: 'Document verification required', pct: 45 },
        { reason: 'Customer prefers face-to-face', pct: 28 },
        { reason: 'KYC document not accepted', pct: 18 },
        { reason: 'Loan amount above digital limit', pct: 9 },
      ],
      branch_locator_usage: 8432,
      branch_locator_change: 34,
      appointments_booked: 2841,
      appointments_change: 52,
    },
    segments: {
      by_acquisition: [
        { segment: 'Organic', count: 34521, change: 12, pct: 42 },
        { segment: 'Referral', count: 23094, change: 18, pct: 28 },
        { segment: 'Social Ads', count: 14829, change: 5, pct: 18 },
        { segment: 'Branch Referral', count: 9888, change: -8, pct: 12 },
      ],
      by_lob_holdings: [
        { segment: '0 LoB (new)', count: 112320, change: 10, pct: 48 },
        { segment: '1 LoB', count: 81900, change: 8, pct: 35 },
        { segment: '2 LoB', count: 28080, change: 15, pct: 12 },
        { segment: '3+ LoB', count: 11700, change: 22, pct: 5 },
      ],
    },
  };
  return NextResponse.json(data);
}
