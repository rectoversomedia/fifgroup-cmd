import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    kpis: {
      total_applications: 12847,
      applications_change: 18,
      total_disbursement: 89200000000,
      disbursement_change: 22,
      avg_rating: 4.1,
      avg_rating_change: 0.1,
      digital_channel_pct: 67,
      digital_change: 9,
      branch_pct: 33,
      branch_change: -9,
      active_users: 234000,
      active_users_change: 15,
      period: 'June 2026',
    },
    target: {
      digital_channel: 85,
      current: 67,
      deadline: 'Q4 2026',
      progress_pct: 78,
    },
  };
  return NextResponse.json(data);
}
