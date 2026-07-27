// App health data
export interface AppHealth {
  id: string;
  name: string;
  platform: 'ios' | 'android';
  icon: string;
  rating: number;
  rating_change: number;
  downloads: string;
  downloads_change: number;
  ascore: number;
  ascore_change: number;
  health_status: 'healthy' | 'watch' | 'critical';
  alerts: number;
  last_updated: string;
  country: string;
  category: string;
}

// KPI metrics
export interface KPIMetrics {
  total_applications: number;
  applications_change: number;
  total_disbursement: number;
  disbursement_change: number;
  avg_rating: number;
  avg_rating_change: number;
  digital_channel_pct: number;
  digital_change: number;
  branch_pct: number;
  branch_change: number;
  active_users: number;
  active_users_change: number;
  period: string;
}

// LoB performance
export interface LoBPerformance {
  id: string;
  name: string;
  active_users: number;
  penetration_pct: number;
  penetration_change: number;
  funnel_viewed: number;
  funnel_applied: number;
  funnel_submitted: number;
  funnel_disbursed: number;
  avg_time_to_disburse: number;
  status: 'on_track' | 'below_target' | 'critical' | 'growing' | 'stable';
  cohort_month1: number;
  cohort_month3: number;
  cohort_month6: number;
}

// AI Alert
export interface AIAlert {
  id: string;
  priority: 'urgent' | 'watch' | 'info';
  app_id: string | null;
  lob_id: string | null;
  title: string;
  description: string;
  root_cause: string;
  recommendation: string;
  owner: string;
  confidence: 'high' | 'medium' | 'low';
  based_on: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

// Insider event summary
export interface InsiderMetrics {
  active_users: number;
  active_users_change: number;
  sessions: number;
  sessions_change: number;
  avg_session_min: number;
  avg_session_change: number;
  applications: number;
  applications_change: number;
  approval_rate: number;
  approval_rate_change: number;
  disbursement_amount: number;
  disbursement_change: number;
  digital_first_pct: number;
  digital_first_change: number;
  hybrid_pct: number;
  hybrid_change: number;
  branch_only_pct: number;
  branch_only_change: number;
}

// Hybrid bridge data
export interface HybridBridge {
  hybrid_completion_pct: number;
  hybrid_change: number;
  top_reasons: { reason: string; pct: number }[];
  branch_locator_usage: number;
  branch_locator_change: number;
  appointments_booked: number;
  appointments_change: number;
}

// Competitor data
export interface Competitor {
  id: string;
  app_id: string;
  name: string;
  rank: number;
  rank_change: number;
  rating: number;
  downloads: string;
  category: string;
  country: string;
}

// Segment data
export interface UserSegment {
  segment: string;
  count: number;
  change: number;
  pct: number;
}

// AI Summary
export interface AISummary {
  id: string;
  summary_text: string;
  key_findings: string[];
  priority_actions: { action: string; owner: string; app?: string; lob?: string }[];
  generated_at: string;
}

// Recommendation
export interface Recommendation {
  id: string;
  app_id: string | null;
  lob_id: string | null;
  category: 'aso' | 'funnel' | 'retention' | 'engagement' | 'general';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimated_impact: string;
  effort: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'rejected' | 'done';
  created_at: string;
}
