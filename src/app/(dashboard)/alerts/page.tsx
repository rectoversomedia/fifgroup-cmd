'use client';

import * as React from 'react';
import {
  Warning,
  CheckCircle,
  Clock,
  ArrowRight,
  CaretDown,
  CaretUp,
} from '@phosphor-icons/react';
import { getAppHealthMetrics } from '@/lib/data-sim';
import { useRealtime } from '@/lib/use-realtime';

// ─── Types ───────────────────────────────────────────────────────────────────

type Severity = 'HIGH' | 'MEDIUM' | 'HEALTHY';

interface Alert {
  id: number;
  name: string;
  metric: string;
  app: string;
  current: string;
  threshold: string;
  severity: Severity;
  status: 'triggered' | 'resolved';
  lastTriggered: string;
  message: string;
  actions: string[];
}

// ─── Static seed data — current is overridden by live metrics in useMemo ────────

const ALERT_SEEDS: Omit<Alert, 'current'>[] = [
  {
    id: 1,
    name: 'FIFADA Crash Rate',
    metric: 'Crash Rate',
    app: 'FIFADA',
    threshold: '> 0.5%',
    severity: 'HIGH',
    status: 'triggered',
    lastTriggered: '22 Jul 2026, 14:32 WIB',
    message:
      'FIFADA crash rate detected at 0.8% — above 0.5% threshold. Root cause: memory leak in document scanner module. Engineering team notified.',
    actions: [
      'Deploy memory leak patch (ETA: 24 Jul)',
      'Enable crash reporting for scanner v2',
      'QA regression test before release',
    ],
  },
  {
    id: 2,
    name: 'FIFADA Error Rate',
    metric: 'Error Rate',
    app: 'FIFADA',
    threshold: '> 1%',
    severity: 'HIGH',
    status: 'triggered',
    lastTriggered: '22 Jul 2026, 14:28 WIB',
    message:
      'FIFADA error rate detected at 1.4% — above 1% threshold. Monitoring for escalation. Consider hotfix if rate increases.',
    actions: [
      'Enable error alerting in Datadog',
      'Review recent deploy changes',
      'Prepare hotfix if > 2% threshold breached',
    ],
  },
  {
    id: 3,
    name: 'SPEKTRA Document Drop-off',
    metric: 'Upload Drop-off',
    app: 'SPEKTRA',
    threshold: '> 60%',
    severity: 'HIGH',
    status: 'triggered',
    lastTriggered: '21 Jul 2026, 09:15 WIB',
    message:
      'SPEKTRA document upload drop-off at 62%. UX team reviewing upload flow. Hypothesis: file size limit (5MB) too small.',
    actions: [
      'A/B test 10MB vs 25MB limit',
      'Implement auto-compression pipeline',
      'Add supported formats in-app guide',
    ],
  },
  {
    id: 4,
    name: 'Push Delivery Rate',
    metric: 'Push Delivery',
    app: 'FIFADA',
    threshold: '< 95%',
    severity: 'MEDIUM',
    status: 'triggered',
    lastTriggered: '21 Jul 2026, 16:45 WIB',
    message:
      'Push delivery rate at 94.2% — below 95% target. Device token validity review recommended.',
    actions: [
      'Audit device token validity',
      'Implement token refresh flow',
      'Review Firebase Cloud Messaging config',
    ],
  },
  {
    id: 5,
    name: 'Bill Reminder Success',
    metric: 'Reminder Success',
    app: 'FIFGO',
    threshold: '< 90%',
    severity: 'HEALTHY',
    status: 'resolved',
    lastTriggered: '18 Jul 2026, 10:00 WIB',
    message:
      'Bill Reminder journey performing above threshold at 94% success rate.',
    actions: [],
  },
  {
    id: 6,
    name: 'Avg Days to Disburse',
    metric: 'Disbursement Speed',
    app: 'All LoBs',
    threshold: '> 5 days',
    severity: 'HEALTHY',
    status: 'resolved',
    lastTriggered: '15 Jul 2026, 08:00 WIB',
    message:
      'Average disbursement speed at 3.8 days — well within 5-day target.',
    actions: [],
  },
];

// ─── Severity config (stable, no re-creation) ────────────────────────────────

const SEV = {
  HIGH:    { bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', text: '#dc2626', Icon: Warning },
  MEDIUM:  { bg: '#fffbeb', border: '#fde68a', dot: '#d97706', text: '#d97706', Icon: Warning },
  HEALTHY: { bg: '#f0fdf4', border: '#bbf7d0', dot: '#059669', text: '#059669', Icon: CheckCircle },
} as const;

// ─── AlertCard — fully stable, no internal state that causes re-renders ─────

interface AlertCardProps {
  alert: Alert;
  onAck: (id: number) => void;
  acked: boolean;
}

const AlertCard = React.memo(function AlertCard({
  alert,
  onAck,
  acked,
}: AlertCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const sev = SEV[alert.severity];
  const Icon = sev.Icon;

  const handleAck = React.useCallback(() => {
    onAck(alert.id);
  }, [alert.id, onAck]);

  const handleToggle = React.useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  return (
    <div
      className="rounded-2xl border transition-all"
      style={{ background: sev.bg, borderColor: sev.border }}
    >
      {/* Main row */}
      <div className="p-5 flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${sev.dot}18` }}
        >
          <Icon size={20} weight="fill" style={{ color: sev.dot }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold" style={{ color: '#111827' }}>
                  {alert.name}
                </p>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: `${sev.dot}20`, color: sev.dot }}
                >
                  {alert.severity}
                </span>
                {alert.status === 'resolved' && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: '#d1fae5', color: '#065f46' }}
                  >
                    RESOLVED
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: '#6b7280' }}>
                {alert.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {alert.severity !== 'HEALTHY' && !acked && (
                <button
                  onClick={handleAck}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: 'white',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  Acknowledge
                </button>
              )}
              {acked && alert.severity !== 'HEALTHY' && (
                <span
                  className="text-xs px-2 py-1 rounded-lg font-medium"
                  style={{ background: '#f9fafb', color: '#9ca3af' }}
                >
                  Acknowledged
                </span>
              )}
              {alert.actions.length > 0 && (
                <button
                  onClick={handleToggle}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: 'white', border: '1px solid #e5e7eb' }}
                >
                  {expanded ? (
                    <CaretUp size={12} style={{ color: '#374151' }} />
                  ) : (
                    <CaretDown size={12} style={{ color: '#374151' }} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {[
              { label: 'Current', value: alert.current },
              { label: 'Threshold', value: alert.threshold },
              { label: 'App', value: alert.app },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color: '#9ca3af' }}>
                  {m.label}:
                </span>
                <span
                  className="text-xs font-bold"
                  style={{
                    color:
                      alert.severity === 'HIGH' ? '#dc2626' : '#374151',
                  }}
                >
                  {m.value}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 ml-auto">
              <Clock size={10} style={{ color: '#9ca3af' }} />
              <span className="text-[10px]" style={{ color: '#9ca3af' }}>
                {alert.lastTriggered}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded actions */}
      {expanded && alert.actions.length > 0 && (
        <div className="px-5 pb-5">
          <div
            className="rounded-xl p-4"
            style={{ background: 'white', border: `1px solid ${sev.border}` }}
          >
            <p className="text-xs font-bold mb-3" style={{ color: '#374151' }}>
              Recommended Actions
            </p>
            <div className="space-y-2">
              {alert.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ArrowRight
                    size={12}
                    style={{ color: sev.dot }}
                    weight="fill"
                    className="mt-0.5 shrink-0"
                  />
                  <p className="text-xs" style={{ color: '#4b5563' }}>
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// ─── AlertsPage ─────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [filter, setFilter] = React.useState<'all' | 'triggered' | 'resolved'>('all');
  const [ackedSet, setAckedSet] = React.useState<Set<number>>(new Set());

  const { data: liveMetrics } = useRealtime(
    () => getAppHealthMetrics('fifada'),
    30_000
  );

  // Derive live values once — stable references
  const crashRate = liveMetrics?.metrics.find(m => m.label === 'Crash Rate')?.value ?? '0.8%';
  const errorRate = liveMetrics?.metrics.find(m => m.label === 'Error Rate')?.value ?? '1.4%';
  const pushDel   = liveMetrics?.metrics.find(m => m.label === 'Push Delivery')?.value ?? '94.2%';

  // Build full alert list — stable via useMemo
  const allAlerts: Alert[] = React.useMemo(() => {
    const live: Record<number, string> = {
      1: crashRate,
      2: errorRate,
      4: pushDel,
    };
    const defaults: Record<number, string> = {
      1: '0.8%',
      2: '1.4%',
      3: '62%',
      4: '94.2%',
      5: '94%',
      6: '3.8 days',
    };
    return ALERT_SEEDS.map(seed => ({
      ...seed,
      current: live[seed.id] ?? defaults[seed.id] ?? '—',
    }));
  }, [crashRate, errorRate, pushDel]);

  // Derived filtered lists — stable via useMemo
  const triggered = React.useMemo(
    () => allAlerts.filter(a => a.status === 'triggered'),
    [allAlerts]
  );

  const resolved = React.useMemo(
    () => allAlerts.filter(a => a.status === 'resolved'),
    [allAlerts]
  );

  const displayed = React.useMemo(() => {
    if (filter === 'triggered') return triggered;
    if (filter === 'resolved') return resolved;
    return allAlerts;
  }, [filter, triggered, resolved, allAlerts]);

  // Stable handlers
  const handleAck = React.useCallback((id: number) => {
    setAckedSet(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleFilter = React.useCallback((f: 'all' | 'triggered' | 'resolved') => {
    setFilter(f);
  }, []);

  const highCount   = triggered.filter(a => a.severity === 'HIGH').length;
  const mediumCount = triggered.filter(a => a.severity === 'MEDIUM').length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>
            Alert Center
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
            Automated monitoring alerts — FIFGROUP Digital Products
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-xs font-medium" style={{ color: '#059669' }}>
            Monitoring Active
          </span>
          <span className="text-xs" style={{ color: '#9ca3af' }}>
            · 30s refresh
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Active Alerts',
            value: triggered.length,
            sub: `${highCount} HIGH, ${mediumCount} MEDIUM`,
            color: '#dc2626',
          },
          {
            label: 'Resolved Today',
            value: resolved.length,
            sub: 'Within threshold',
            color: '#059669',
          },
          {
            label: 'Avg Resolution',
            value: '2.4h',
            sub: 'For HIGH severity',
            color: '#d97706',
          },
          {
            label: 'Alert Rules',
            value: '6',
            sub: 'Active monitoring',
            color: '#4f8ef7',
          },
        ].map(m => (
          <div
            key={m.label}
            className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center"
          >
            <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>
              {m.label}
            </p>
            <p className="text-3xl font-extrabold mb-1" style={{ color: m.color }}>
              {m.value}
            </p>
            <p className="text-[11px]" style={{ color: '#9ca3af' }}>
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'triggered', 'resolved'] as const).map(f => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={handleFilter.bind(null, f)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all border"
              style={
                isActive
                  ? { background: '#1e3a5f', color: 'white', border: '1px solid #1e3a5f' }
                  : { background: 'white', color: '#374151', border: '1px solid #e5e7eb' }
              }
            >
              {f === 'all'
                ? 'All Alerts'
                : f === 'triggered'
                ? `Active (${triggered.length})`
                : `Resolved (${resolved.length})`}
            </button>
          );
        })}
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 flex flex-col items-center text-center border border-gray-200">
            <CheckCircle size={48} style={{ color: '#10b981' }} weight="fill" />
            <p className="text-lg font-bold mt-4" style={{ color: '#111827' }}>
              All Clear
            </p>
            <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
              No alerts in this category
            </p>
          </div>
        ) : (
          displayed.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAck={handleAck}
              acked={ackedSet.has(alert.id)}
            />
          ))
        )}
      </div>

      {/* Alert Rules Reference */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>
          Alert Rules Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr
                className="text-[11px] font-semibold uppercase"
                style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}
              >
                <th className="text-left pb-2 pr-4">Alert Name</th>
                <th className="text-left pb-2 pr-4">App</th>
                <th className="text-center pb-2 pr-4">Metric</th>
                <th className="text-center pb-2 pr-4">Threshold</th>
                <th className="text-center pb-2">Severity</th>
              </tr>
            </thead>
            <tbody>
              {allAlerts.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td className="py-3 pr-4">
                    <span className="text-sm font-medium" style={{ color: '#111827' }}>
                      {a.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: '#f3f4f6', color: '#374151' }}
                    >
                      {a.app}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <span className="text-xs" style={{ color: '#6b7280' }}>
                      {a.metric}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <span className="text-xs font-medium" style={{ color: '#374151' }}>
                      {a.threshold}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{
                        background:
                          a.severity === 'HIGH'
                            ? '#fee2e2'
                            : a.severity === 'MEDIUM'
                            ? '#fef3c7'
                            : '#d1fae5',
                        color:
                          a.severity === 'HIGH'
                            ? '#dc2626'
                            : a.severity === 'MEDIUM'
                            ? '#d97706'
                            : '#059669',
                      }}
                    >
                      {a.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
