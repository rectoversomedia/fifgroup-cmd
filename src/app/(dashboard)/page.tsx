'use client';

import * as React from 'react';
import {
  Star, Download, TrendUp, TrendDown, Minus,
  Users, ChatCircle, ShieldCheck, Rocket,
  CaretDown, ArrowRight, Brain, Warning, CheckCircle,
  ChartBar, Target, Lightning, AppWindow
} from '@phosphor-icons/react';
import { formatNumber, formatCurrency, cn } from '@/lib/utils';

interface Alert {
  id: string;
  priority: 'urgent' | 'watch' | 'info';
  app_id: string | null;
  lob_id: string | null;
  title: string;
  description: string;
  recommendation: string;
  owner: string;
  confidence: string;
  based_on: string;
  status: string;
}

interface AppHealth {
  id: string;
  name: string;
  platform: string;
  rating: number;
  rating_change: number;
  downloads: string;
  downloads_change: number;
  ascore: number;
  ascore_change: number;
  health_status: string;
  alerts: number;
}

interface KPI {
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

interface AISummary {
  summary_text: string;
  key_findings: string[];
  priority_actions: { action: string; owner: string; app?: string; lob?: string }[];
}

function TrendBadge({ value, suffix = '%', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  if (value > 0) return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
      <TrendUp size={12} weight="bold" /> {prefix}{value > 0 ? '+' : ''}{value}{suffix}
    </span>
  );
  if (value < 0) return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-400">
      <TrendDown size={12} weight="bold" /> {prefix}{value}{suffix}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-400">
      <Minus size={12} /> {value}{suffix}
    </span>
  );
}

function HealthBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    healthy: { label: 'Healthy', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', dot: 'bg-emerald-400' },
    watch: { label: 'Watch', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', dot: 'bg-amber-400' },
    critical: { label: 'Critical', color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', dot: 'bg-rose-400' },
    on_track: { label: 'On Track', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', dot: 'bg-emerald-400' },
    below_target: { label: 'Below Target', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', dot: 'bg-amber-400' },
    growing: { label: 'Growing', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20', dot: 'bg-cyan-400' },
    stable: { label: 'Stable', color: 'text-slate-400', bg: 'bg-slate-400/10 border-slate-400/20', dot: 'bg-slate-400' },
  };
  const s = map[status] ?? map.watch;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', s.bg, s.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  );
}

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn('rounded-2xl p-5', className)}
      style={{
        background: 'linear-gradient(135deg, rgba(31,41,55,0.8) 0%, rgba(17,24,39,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {children}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  iconColor,
  label,
  value,
  change,
  sub,
}: {
  icon: React.ComponentType<any>;
  iconColor: string;
  label: string;
  value: string | number;
  change: number;
  sub?: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center justify-between">
        <Icon size={18} className={iconColor} weight="duotone" />
        <TrendBadge value={change} />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

// ── Alert Card ───────────────────────────────────────────────
function AlertCard({ alert }: { alert: Alert }) {
  const priorityConfig = {
    urgent: { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', label: 'URGENT', dot: 'bg-rose-400' },
    watch: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', label: 'WATCH', dot: 'bg-amber-400' },
    info: { color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', label: 'INFO', dot: 'bg-cyan-400' },
  };
  const cfg = priorityConfig[alert.priority];

  return (
    <div
      className={cn('rounded-xl p-4 border', cfg.bg, cfg.border)}
      style={{ background: 'rgba(17,24,39,0.6)' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
          <span className={cn('w-2 h-2 rounded-full mt-1', cfg.dot, alert.priority === 'urgent' ? 'animate-pulse' : '')} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-[10px] font-bold tracking-wider', cfg.color)}>{cfg.label}</span>
            {alert.app_id && (
              <span className="text-[10px px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-medium">
                {alert.app_id.toUpperCase()}
              </span>
            )}
            {alert.lob_id && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-medium">
                {alert.lob_id.toUpperCase()}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-white mb-1">{alert.title}</p>
          <p className="text-xs text-slate-400 leading-relaxed mb-2">{alert.description}</p>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
              style={{ background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.2)' }}
            >
              <Lightning size={11} className="text-blue-400" weight="fill" />
              <span className="text-xs text-blue-300">{alert.recommendation.split('.')[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-[11px] text-slate-500">Owner: <span className="text-slate-400">{alert.owner}</span></span>
            <span className="text-[11px] text-slate-500">Confidence: <span className={alert.confidence === 'high' ? 'text-emerald-400' : 'text-amber-400'}>{alert.confidence}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LoB Bar ───────────────────────────────────────────────
function LoBBar({
  name,
  pct,
  change,
  status,
}: {
  name: string;
  pct: number;
  change: number;
  status: string;
}) {
  const statusColor: Record<string, string> = {
    on_track: 'bg-emerald-400',
    growing: 'bg-cyan-400',
    stable: 'bg-slate-400',
    below_target: 'bg-amber-400',
    critical: 'bg-rose-400',
  };
  const barColor = statusColor[status] ?? 'bg-slate-400';
  const barWidth = Math.min(pct, 100);

  return (
    <div className="flex items-center gap-3">
      <div className="w-20 shrink-0">
        <span className="text-xs font-semibold text-slate-300">{name}</span>
      </div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className={cn('h-full rounded-full transition-all duration-700', barColor)}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <div className="w-10 text-right">
        <span className="text-xs font-bold text-white">{pct}%</span>
      </div>
      <div className="w-12">
        <TrendBadge value={change} />
      </div>
      <div className="w-20">
        <HealthBadge status={status} />
      </div>
    </div>
  );
}

// ── Digital Channel Gauge ─────────────────────────────────────
function DigitalGauge({ digital, target }: { digital: number; target: number }) {
  const pct = Math.round((digital / target) * 100);
  const angle = (digital / 100) * 180;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-20 overflow-hidden">
        <div
          className="absolute inset-0 rounded-t-full"
          style={{
            background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 40%, #10b981 70%)',
            opacity: 0.2,
          }}
        />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 80">
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * 220} 220`}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-2xl font-extrabold text-white">{digital}%</span>
          <span className="text-[10px] text-slate-400">Digital</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-400">Goal: {target}% by Q4 2026</p>
        <div className="w-32 h-1.5 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">{pct}% on track</p>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function OverviewPage() {
  const [apps, setApps] = React.useState<AppHealth[]>([]);
  const [kpi, setKpi] = React.useState<KPI | null>(null);
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [summary, setSummary] = React.useState<AISummary | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAll() {
      try {
        const [healthRes, kpiRes, alertsRes, summaryRes] = await Promise.all([
          fetch('/api/health'),
          fetch('/api/kpi'),
          fetch('/api/alerts'),
          fetch('/api/ai-summary'),
        ]);
        const [health, kpiData, alertsData, summaryData] = await Promise.all([
          healthRes.json(),
          kpiRes.json(),
          alertsRes.json(),
          summaryRes.json(),
        ]);
        setApps(health.apps ?? []);
        setKpi(kpiData.kpis ?? null);
        setAlerts(alertsData.alerts ?? []);
        setSummary(summaryData.summary ?? null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── PAGE HEADER ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Portfolio Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">FIFGROUP Digital Command Center — Real-time intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="text-xs rounded-lg px-3 py-2 outline-none appearance-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
          >
            <option>June 2026</option>
            <option>May 2026</option>
            <option>April 2026</option>
          </select>
        </div>
      </div>

      {/* ── SECTION 1: APP HEALTH ───────────────── */}
      <SectionCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <AppWindow size={16} className="text-blue-400" weight="fill" />
            APP HEALTH
          </h2>
          <span className="text-xs text-slate-500">{kpi?.period ?? 'June 2026'}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {apps.map(app => (
            <div
              key={app.id}
              className="rounded-xl p-4"
              style={{
                background: app.health_status === 'healthy'
                  ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(17,24,39,0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(17,24,39,0.9) 100%)',
                border: `1px solid ${app.health_status === 'healthy' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-lg"
                    style={{ background: app.id === 'fifgo'
                      ? 'linear-gradient(135deg, #06b6d4 0%, #4f8ef7 100%)'
                      : 'linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)' }}
                  >
                    {app.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{app.name}</p>
                    <p className="text-[11px] text-slate-400 capitalize">{app.platform}</p>
                  </div>
                </div>
                <HealthBadge status={app.health_status} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Star size={12} className="text-amber-400" weight="fill" />
                    <span className="text-sm font-bold text-white">{app.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Rating</span>
                  <TrendBadge value={app.rating_change} prefix="" />
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Download size={12} className="text-cyan-400" weight="fill" />
                    <span className="text-sm font-bold text-white">{app.downloads}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Downloads</span>
                  <TrendBadge value={app.downloads_change} />
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <ShieldCheck size={12} className="text-emerald-400" weight="fill" />
                    <span className="text-sm font-bold text-white">{app.ascore}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">ASO Score</span>
                  <TrendBadge value={app.ascore_change} />
                </div>
              </div>

              {app.alerts > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
                  <Warning size={12} weight="fill" />
                  {app.alerts} active alert{app.alerts > 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── SECTION 2: PRIORITY ALERTS ──────────── */}
      <SectionCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Warning size={16} className="text-rose-400" weight="fill" />
            ACTION REQUIRED
          </h2>
          <span className="text-xs text-slate-500">AI Confidence: HIGH</span>
        </div>
        <div className="space-y-3">
          {alerts.slice(0, 3).map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </SectionCard>

      {/* ── SECTION 3: KEY METRICS ──────────────── */}
      <SectionCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ChartBar size={16} className="text-blue-400" weight="fill" />
            KEY PERFORMANCE METRICS
          </h2>
          <span className="text-xs text-slate-500">{kpi?.period ?? 'June 2026'}</span>
        </div>
        {kpi && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <MetricCard
                icon={Rocket}
                iconColor="text-purple-400"
                label="Total Applications"
                value={formatNumber(kpi.total_applications)}
                change={kpi.applications_change}
              />
              <MetricCard
                icon={TrendUp}
                iconColor="text-emerald-400"
                label="Disbursement"
                value={formatCurrency(kpi.total_disbursement)}
                change={kpi.disbursement_change}
              />
              <MetricCard
                icon={Star}
                iconColor="text-amber-400"
                label="Avg Rating"
                value={`${kpi.avg_rating}★`}
                change={kpi.avg_rating_change}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400">Digital vs Branch Channel</span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Digital</span>
                      <span className="text-emerald-400 font-semibold">{kpi.digital_channel_pct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                        style={{ width: `${kpi.digital_channel_pct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Branch</span>
                  <span className="text-slate-400 font-semibold">{kpi.branch_pct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full bg-slate-500"
                    style={{ width: `${kpi.branch_pct}%` }}
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <TrendBadge value={kpi.digital_change} />
                  <span className="text-xs text-slate-500">vs last month</span>
                </div>
              </div>

              <div
                className="rounded-xl p-4 flex flex-col items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <DigitalGauge digital={kpi.digital_channel_pct} target={85} />
              </div>
            </div>
          </>
        )}
      </SectionCard>

      {/* ── SECTION 4: LOB PERFORMANCE ─────────── */}
      <SectionCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-purple-400" weight="fill" />
            LOB PERFORMANCE INSIDE FIFGO
          </h2>
          <span className="text-xs text-slate-500">{kpi?.period ?? 'June 2026'}</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium uppercase tracking-wider pb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-20 shrink-0">LoB</div>
            <div className="flex-1">Adoption</div>
            <div className="w-10 text-right">%</div>
            <div className="w-12">Change</div>
            <div className="w-20">Status</div>
          </div>
          {[
            { name: 'FIFASTRA', pct: 72, change: 5, status: 'on_track' },
            { name: 'SPEKTRA', pct: 28, change: -3, status: 'below_target' },
            { name: 'DANASTRA', pct: 61, change: 4, status: 'growing' },
            { name: 'FINATRA', pct: 45, change: 2, status: 'stable' },
            { name: 'AMITRA', pct: 52, change: 6, status: 'growing' },
          ].map(lob => (
            <LoBBar key={lob.name} name={lob.name} pct={lob.pct} change={lob.change} status={lob.status} />
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          % of 234K active FIFGO users who accessed each LoB
        </p>
      </SectionCard>

      {/* ── SECTION 5: AI EXECUTIVE SUMMARY ─────── */}
      {summary && (
        <SectionCard>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain size={16} className="text-rose-400" weight="fill" />
              AI EXECUTIVE SUMMARY
            </h2>
            <span className="text-xs text-slate-500">
              Generated {new Date(summary.key_findings.length > 0 ? Date.now() : Date.now()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-5">{summary.summary_text}</p>

          <div className="mb-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Findings</p>
            <div className="space-y-2">
              {summary.key_findings.map((finding, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <CheckCircle size={13} className="text-emerald-400 mt-0.5 shrink-0" weight="fill" />
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Priority This Week</p>
            <div className="space-y-2">
              {summary.priority_actions.slice(0, 3).map((action, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)' }}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: 'rgba(79,142,247,0.2)', color: '#60a5fa' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">{action.action}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Owner: <span className="text-slate-400">{action.owner}</span>
                      {action.app && <span className="ml-2 text-blue-400">{action.app}</span>}
                      {action.lob && <span className="ml-2 text-purple-400">{action.lob}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      )}

    </div>
  );
}
