-- FIFGROUP Digital Command Center — Supabase Schema
-- Run this in Supabase SQL Editor to set up all tables

-- ============================================
-- TABLE: apps
-- Stores app health data from AppTweak
-- ============================================
CREATE TABLE IF NOT EXISTS apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('ios', 'android')),
  icon_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  rating_change DECIMAL(2,1) DEFAULT 0,
  downloads VARCHAR(20) DEFAULT '0',
  downloads_change INTEGER DEFAULT 0,
  ascore INTEGER DEFAULT 50,
  ascore_change INTEGER DEFAULT 0,
  health_status VARCHAR(20) DEFAULT 'watch' CHECK (health_status IN ('healthy', 'watch', 'critical')),
  alerts_count INTEGER DEFAULT 0,
  country VARCHAR(10) DEFAULT 'ID',
  category VARCHAR(100),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: app_daily_metrics
-- Historical daily metrics for trending
-- ============================================
CREATE TABLE IF NOT EXISTS app_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id VARCHAR(50) NOT NULL REFERENCES apps(app_id),
  metric_date DATE NOT NULL,
  rating DECIMAL(2,1),
  downloads VARCHAR(20),
  ascore INTEGER,
  reviews_count INTEGER,
  avg_sentiment_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(app_id, metric_date)
);

-- ============================================
-- TABLE: kpi_metrics
-- Portfolio-level KPIs
-- ============================================
CREATE TABLE IF NOT EXISTS kpi_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period VARCHAR(50) NOT NULL,
  period_date DATE NOT NULL,
  total_applications INTEGER DEFAULT 0,
  applications_change INTEGER DEFAULT 0,
  total_disbursement BIGINT DEFAULT 0,
  disbursement_change INTEGER DEFAULT 0,
  avg_rating DECIMAL(2,1) DEFAULT 0,
  avg_rating_change DECIMAL(2,1) DEFAULT 0,
  digital_channel_pct INTEGER DEFAULT 0,
  digital_change INTEGER DEFAULT 0,
  branch_pct INTEGER DEFAULT 0,
  branch_change INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  active_users_change INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(period, period_date)
);

-- ============================================
-- TABLE: lob_performance
-- LoB performance inside FIFGO (from Insider CDP)
-- ============================================
CREATE TABLE IF NOT EXISTS lob_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lob_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  active_users INTEGER DEFAULT 0,
  penetration_pct INTEGER DEFAULT 0,
  penetration_change INTEGER DEFAULT 0,
  funnel_viewed INTEGER DEFAULT 0,
  funnel_applied INTEGER DEFAULT 0,
  funnel_submitted INTEGER DEFAULT 0,
  funnel_disbursed INTEGER DEFAULT 0,
  avg_time_to_disburse DECIMAL(4,1) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'stable' CHECK (status IN ('on_track', 'below_target', 'critical', 'growing', 'stable')),
  cohort_month1 INTEGER DEFAULT 0,
  cohort_month3 INTEGER DEFAULT 0,
  cohort_month6 INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: insider_events
-- Raw event data from Insider CDP
-- ============================================
CREATE TABLE IF NOT EXISTS insider_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(100) NOT NULL,
  user_id VARCHAR(100),
  session_id VARCHAR(100),
  device_type VARCHAR(20),
  event_timestamp TIMESTAMPTZ DEFAULT NOW(),
  properties JSONB DEFAULT '{}',
  lob VARCHAR(50),
  channel VARCHAR(20),
  amount DECIMAL(15,0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: insider_sessions
-- Aggregated session data
-- ============================================
CREATE TABLE IF NOT EXISTS insider_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  active_users INTEGER DEFAULT 0,
  sessions INTEGER DEFAULT 0,
  avg_session_min DECIMAL(4,1) DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  returning_users INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date)
);

-- ============================================
-- TABLE: insider_segments
-- User segment distribution
-- ============================================
CREATE TABLE IF NOT EXISTS insider_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_type VARCHAR(50) NOT NULL,
  segment_name VARCHAR(100) NOT NULL,
  user_count INTEGER DEFAULT 0,
  change_pct INTEGER DEFAULT 0,
  pct_of_total DECIMAL(5,2) DEFAULT 0,
  period_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: hybrid_bridge
-- Digital ↔ Branch attribution
-- ============================================
CREATE TABLE IF NOT EXISTS hybrid_bridge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period VARCHAR(50) NOT NULL,
  period_date DATE NOT NULL,
  hybrid_completion_pct DECIMAL(5,2) DEFAULT 0,
  hybrid_change DECIMAL(5,2) DEFAULT 0,
  target_pct DECIMAL(5,2) DEFAULT 5,
  branch_locator_usage INTEGER DEFAULT 0,
  branch_locator_change INTEGER DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  appointments_change INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(period, period_date)
);

-- ============================================
-- TABLE: hybrid_reasons
-- Why users need to visit branch
-- ============================================
CREATE TABLE IF NOT EXISTS hybrid_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_date DATE DEFAULT CURRENT_DATE,
  reason VARCHAR(200) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  is_fixable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: competitors
-- Competitive tracking data
-- ============================================
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id VARCHAR(50) NOT NULL REFERENCES apps(app_id),
  competitor_name VARCHAR(100) NOT NULL,
  rank INTEGER DEFAULT 0,
  rank_change INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  downloads VARCHAR(20) DEFAULT '0',
  category VARCHAR(100),
  country VARCHAR(10) DEFAULT 'ID',
  period_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: ai_alerts
-- AI-generated priority alerts
-- ============================================
CREATE TABLE IF NOT EXISTS ai_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('urgent', 'watch', 'info')),
  app_id VARCHAR(50) REFERENCES apps(app_id),
  lob_id VARCHAR(50),
  alert_title VARCHAR(300) NOT NULL,
  description TEXT,
  root_cause TEXT,
  recommendation TEXT,
  owner VARCHAR(100),
  confidence VARCHAR(20) DEFAULT 'medium' CHECK (confidence IN ('high', 'medium', 'low')),
  based_on VARCHAR(200),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: ai_summaries
-- AI-generated executive summaries
-- ============================================
CREATE TABLE IF NOT EXISTS ai_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_text TEXT NOT NULL,
  key_findings JSONB DEFAULT '[]',
  priority_actions JSONB DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: recommendations
-- Actionable recommendations
-- ============================================
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id VARCHAR(50) REFERENCES apps(app_id),
  lob_id VARCHAR(50),
  category VARCHAR(50) CHECK (category IN ('aso', 'funnel', 'retention', 'engagement', 'general')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  title VARCHAR(300) NOT NULL,
  description TEXT,
  estimated_impact VARCHAR(200),
  effort VARCHAR(20) CHECK (effort IN ('low', 'medium', 'high')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'done')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: events_config
-- Insider event architecture reference
-- ============================================
CREATE TABLE IF NOT EXISTS events_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  event_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'nice_to_have',
  is_tracked BOOLEAN DEFAULT FALSE,
  sample_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSERT DEFAULT EVENTS CONFIG
-- ============================================
INSERT INTO events_config (layer, category, event_name, description, priority, is_tracked) VALUES
-- User Lifecycle
('lifecycle', 'onboarding', 'app_opened', 'User opens the app', 'must_have', FALSE),
('lifecycle', 'onboarding', 'user_registered', 'New user completes registration', 'must_have', FALSE),
('lifecycle', 'onboarding', 'otp_verified', 'Phone number verified', 'must_have', FALSE),
('lifecycle', 'onboarding', 'kyc_started', 'KYC process initiated', 'must_have', FALSE),
('lifecycle', 'onboarding', 'kyc_approved', 'KYC verification passed', 'must_have', FALSE),
('lifecycle', 'onboarding', 'first_loan_completed', 'User completed first loan disbursement', 'must_have', FALSE),
-- LoB Discovery
('lob', 'discovery', 'lob_banner_viewed', 'User sees LoB promotional banner', 'should_have', FALSE),
('lob', 'discovery', 'lob_page_entered', 'User enters LoB product page', 'must_have', FALSE),
('lob', 'discovery', 'lob_calculator_used', 'User uses loan calculator', 'should_have', FALSE),
('lob', 'discovery', 'lob_interest_clicked', 'User clicks "I am interested"', 'should_have', FALSE),
-- LoB Engagement
('lob', 'engagement', 'application_started', 'User starts loan application', 'must_have', FALSE),
('lob', 'engagement', 'document_upload_started', 'User begins document upload', 'must_have', FALSE),
('lob', 'engagement', 'document_upload_completed', 'User completes document upload', 'must_have', FALSE),
('lob', 'engagement', 'document_upload_failed', 'Document upload fails', 'should_have', FALSE),
('lob', 'engagement', 'application_submitted', 'Application submitted for review', 'must_have', FALSE),
('lob', 'engagement', 'application_approved', 'Application approved', 'must_have', FALSE),
('lob', 'engagement', 'application_rejected', 'Application rejected', 'should_have', FALSE),
('lob', 'engagement', 'disbursement_completed', 'Loan disbursed to user', 'must_have', FALSE),
-- Conversion
('conversion', 'revenue', 'disbursement_initiated', 'Disbursement process started', 'must_have', FALSE),
('conversion', 'revenue', 'disbursement_failed', 'Disbursement failed', 'should_have', FALSE),
('conversion', 'revenue', 'repayment_made', 'User makes loan repayment', 'should_have', FALSE),
-- Hybrid Attribution
('hybrid', 'attribution', 'submission_digital', 'Application submitted fully online', 'must_have', FALSE),
('hybrid', 'attribution', 'submission_hybrid', 'Application started digital, completed at branch', 'must_have', FALSE),
('hybrid', 'attribution', 'branch_visit_triggered', 'User comes to branch after app start', 'should_have', FALSE),
('hybrid', 'attribution', 'branch_appointment_booked', 'User books branch appointment via app', 'should_have', FALSE),
('hybrid', 'attribution', 'referral_sent', 'User sends referral link', 'should_have', FALSE),
('hybrid', 'attribution', 'referral_converted', 'Referral results in registration', 'should_have', FALSE),
-- Cross-sell
('crosssell', 'engagement', 'cross_sell_offer_shown', 'User shown cross-sell offer', 'should_have', FALSE),
('crosssell', 'engagement', 'cross_sell_accepted', 'User accepts cross-sell offer', 'should_have', FALSE)
ON CONFLICT (event_name) DO NOTHING;

-- ============================================
-- INSERT DUMMY DATA
-- ============================================

-- Apps
INSERT INTO apps (app_id, name, platform, rating, rating_change, downloads, downloads_change, ascore, ascore_change, health_status, alerts_count, category) VALUES
  ('fifgo', 'FIFGO', 'android', 4.2, 0.1, '850K', 23, 78, 4, 'healthy', 0, 'Finance'),
  ('fifada', 'FIFADA', 'android', 3.8, -0.2, '210K', 3, 61, -2, 'watch', 2, 'Finance')
ON CONFLICT (app_id) DO NOTHING;

-- KPIs
INSERT INTO kpi_metrics (period, period_date, total_applications, applications_change, total_disbursement, disbursement_change, avg_rating, avg_rating_change, digital_channel_pct, digital_change, branch_pct, branch_change, active_users, active_users_change) VALUES
  ('June 2026', '2026-06-01', 12847, 18, 89200000000, 22, 4.1, 0.1, 67, 9, 33, -9, 234000, 15),
  ('May 2026', '2026-05-01', 10887, 14, 73100000000, 18, 4.0, 0.1, 58, 6, 42, -6, 203478, 12)
ON CONFLICT (period, period_date) DO NOTHING;

-- LoB Performance
INSERT INTO lob_performance (lob_id, name, active_users, penetration_pct, penetration_change, funnel_viewed, funnel_applied, funnel_submitted, funnel_disbursed, avg_time_to_disburse, status, cohort_month1, cohort_month3, cohort_month6) VALUES
  ('fifastra', 'FIFASTRA', 168480, 72, 5, 234000, 62300, 38700, 19200, 3.2, 'on_track', 68, 54, 41),
  ('spektra', 'SPEKTRA', 65520, 28, -3, 234000, 31200, 12400, 4960, 4.8, 'below_target', 52, 38, 22),
  ('danastra', 'DANASTRA', 142740, 61, 4, 234000, 52800, 31200, 15600, 3.8, 'growing', 71, 60, 48),
  ('finatra', 'FINATRA', 105300, 45, 2, 234000, 41700, 23100, 10400, 4.1, 'stable', 74, 65, 55),
  ('amitra', 'AMITRA', 121680, 52, 6, 234000, 46800, 27300, 12800, 3.5, 'growing', 65, 50, 39)
ON CONFLICT (lob_id) DO NOTHING;

-- Hybrid Bridge
INSERT INTO hybrid_bridge (period, period_date, hybrid_completion_pct, hybrid_change, branch_locator_usage, branch_locator_change, appointments_booked, appointments_change) VALUES
  ('June 2026', '2026-06-01', 12, -3, 8432, 34, 2841, 52)
ON CONFLICT (period, period_date) DO NOTHING;

-- Hybrid Reasons
INSERT INTO hybrid_reasons (reason, percentage, is_fixable) VALUES
  ('Document verification required', 45.0, TRUE),
  ('Customer prefers face-to-face', 28.0, FALSE),
  ('KYC document not accepted', 18.0, TRUE),
  ('Loan amount above digital limit', 9.0, FALSE);

-- AI Alerts
INSERT INTO ai_alerts (priority, app_id, lob_id, alert_title, description, root_cause, recommendation, owner, confidence, based_on, status) VALUES
  ('urgent', 'fifada', NULL, 'FIFADA Rating Dropped 0.4★ in 3 Days', '60% negative reviews mention: "process terlalu lama di cabang"', 'Branch turnaround time has increased to 7+ days', 'Sync with operations to reduce branch bottleneck. Implement queue booking.', 'Operations Team', 'high', '847 reviews, 30-day rating trend', 'open'),
  ('watch', NULL, 'spektra', 'SPEKTRA LoB — Only 28% of FIFGO Users Access', '72% of users never explore SPEKTRA inside FIFGO', 'Low visibility in app navigation. Document complexity higher than other LoBs.', 'Improve SPEKTRA home screen placement. Simplify document requirements from 6 to 3.', 'FIFGO Product Team', 'high', '234K active users, 62% drop-off at upload stage', 'open'),
  ('info', 'fifgo', NULL, 'FIFGO Downloads Up 23% This Week', 'Driven by improved Finance category ranking on Play Store', 'ASO improvements from updated screenshots and keyword targeting in Q2 2026.', 'Maintain momentum. Continue weekly keyword monitoring.', 'Digital Team', 'high', 'AppTweak download tracking', 'open')
ON CONFLICT DO NOTHING;

-- AI Summary
INSERT INTO ai_summaries (summary_text, key_findings, priority_actions) VALUES
  ('Digital channel performance is strong this month with 67% of applications coming through digital, up 9 percentage points. Downloads grew 23% driven by improved ASO ranking. Key concern: FIFADA rating declined to 3.8★ (-0.4) in 3 days. SPEKTRA LoB adoption inside FIFGO remains low at 28%. Cross-sell opportunity: 34,821 users have only 1 LoB product.',
   '["FIFGO maintained #1 position in Finance category, 850K downloads (+23%)","FIFADA rating decline: -0.4★ in 3 days","SPEKTRA penetration 28% vs 50% target","Digital-first users now 71% (up 9pts)","KYC rejection causing 18% of hybrid completions"]',
   '[{"action":"Address FIFADA rating decline","owner":"Operations Team","app":"FIFADA"},{"action":"Simplify SPEKTRA document requirements","owner":"FIFGO Product","lob":"SPEKTRA"},{"action":"Capitalize on ASO momentum for FIFGO","owner":"Digital Team","app":"FIFGO"}]');

-- Competitors
INSERT INTO competitors (app_id, competitor_name, rank, rank_change, rating, downloads, category, country) VALUES
  ('fifgo', 'FIFGO', 1, 0, 4.2, '850K', 'Finance', 'ID'),
  ('fifgo', 'CashCash', 2, 1, 4.0, '720K', 'Finance', 'ID'),
  ('fifgo', 'EasyCash', 3, -1, 3.9, '680K', 'Finance', 'ID'),
  ('fifgo', 'Duitku', 4, 0, 3.8, '620K', 'Finance', 'ID'),
  ('fifgo', 'PinjolPro', 5, 2, 3.7, '540K', 'Finance', 'ID'),
  ('fifada', 'FIFADA', 1, 0, 3.8, '210K', 'Finance', 'ID'),
  ('fifada', 'AstraPay', 2, 0, 4.1, '890K', 'Finance', 'ID'),
  ('fifada', 'DanaSiap', 3, 1, 3.9, '320K', 'Finance', 'ID'),
  ('fifada', 'KTAInstan', 4, -1, 3.6, '280K', 'Finance', 'ID');

-- Insider Segments
INSERT INTO insider_segments (segment_type, segment_name, user_count, change_pct, pct_of_total) VALUES
  ('acquisition', 'Organic', 34521, 12, 42.0),
  ('acquisition', 'Referral', 23094, 18, 28.0),
  ('acquisition', 'Social Ads', 14829, 5, 18.0),
  ('acquisition', 'Branch Referral', 9888, -8, 12.0),
  ('lob_holdings', '0 LoB (new)', 112320, 10, 48.0),
  ('lob_holdings', '1 LoB', 81900, 8, 35.0),
  ('lob_holdings', '2 LoB', 28080, 15, 12.0),
  ('lob_holdings', '3+ LoB', 11700, 22, 5.0);

-- Recommendations
INSERT INTO recommendations (app_id, lob_id, category, priority, title, description, estimated_impact, effort, status) VALUES
  ('fifada', NULL, 'aso', 'high', 'Address FIFADA Rating Decline', 'FIFADA rating dropped 0.4★. 60% negative reviews cite long branch process.', '+0.3★ rating improvement within 2 weeks', 'medium', 'pending'),
  (NULL, 'spektra', 'funnel', 'high', 'Simplify SPEKTRA Document Upload', '62% drop at document upload. Reduce from 6 to 3 required documents.', '+2,100 applications/month', 'low', 'pending'),
  ('fifgo', NULL, 'aso', 'medium', 'Update FIFGO Screenshots', 'Screenshots not updated in 6 months. Competitors have newer visuals.', '+8% conversion rate', 'low', 'pending'),
  (NULL, NULL, 'engagement', 'medium', 'Cross-Sell Campaign', '34,821 users have only 1 LoB product. Target DANASTRA for FIFASTRA customers.', 'Rp 4.2B/month incremental', 'medium', 'pending'),
  (NULL, NULL, 'retention', 'medium', 'SPEKTRA Disbursement SLA', 'SPEKTRA Month-2 retention 52% vs 60% benchmark. Improve disbursement speed.', '+8pts retention', 'high', 'pending');

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lob_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Public read access (adjust as needed for your auth setup)
CREATE POLICY "Public read apps" ON apps FOR SELECT USING (true);
CREATE POLICY "Public read kpi" ON kpi_metrics FOR SELECT USING (true);
CREATE POLICY "Public read lob" ON lob_performance FOR SELECT USING (true);
CREATE POLICY "Public read alerts" ON ai_alerts FOR SELECT USING (true);
CREATE POLICY "Public read recommendations" ON recommendations FOR SELECT USING (true);

-- ============================================
-- Enable Realtime (for future live updates)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE apps;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE kpi_metrics;
