'use client';

import * as React from 'react';
import {
  PaperPlaneTilt, ChatCircle, MegaphoneSimple,
  CheckCircle, Warning, Clock, ArrowRight,
  CaretDown, CaretUp, Envelope as _Envelope,
} from '@phosphor-icons/react';
import {
  getEscalationTickets, createEscalationTicket,
  type EscalationTicket, type EscalationChannel,
} from '@/lib/data-sim';

const WHATSAPP_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/whatsapp.svg';
const TEAMS_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/microsoftteams.svg';
const EMAIL_SVG = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/gmail.svg';

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return <img src={WHATSAPP_SVG} alt="WhatsApp" width={size} height={size} />;
}
function TeamsIcon({ size = 18 }: { size?: number }) {
  return <img src={TEAMS_SVG} alt="MS Teams" width={size} height={size} />;
}
function EmailIcon({ size = 18 }: { size?: number }) {
  return <img src={EMAIL_SVG} alt="Email" width={size} height={size} />;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

interface Alert {
  id: number;
  title: string;
  app: string;
  severity: AlertSeverity;
  metric: string;
  current: string;
  threshold: string;
  message: string;
  actions: string[];
  status: 'triggered' | 'resolved';
  lastTriggered: string;
}

// ─── Static data — stable, no re-creation ────────────────────────────────────

const ALERT_SEEDS: Omit<Alert, 'current'>[] = [
  {
    id: 1, title: 'FIFADA Crash Rate', app: 'FIFADA', severity: 'critical',
    metric: 'Crash Rate', threshold: '> 0.5%', status: 'triggered',
    lastTriggered: '22 Jul 2026, 14:32 WIB',
    message: 'FIFADA crash rate detected at 1.4% — above 0.5% threshold. Root cause: memory leak in document scanner. Engineering team notified.',
    actions: ['Deploy memory leak patch (ETA: 24 Jul)', 'Enable crash reporting for scanner v2', 'QA regression test before release'],
  },
  {
    id: 2, title: 'FIFADA Error Rate', app: 'FIFADA', severity: 'critical',
    metric: 'Error Rate', threshold: '> 1%', status: 'triggered',
    lastTriggered: '22 Jul 2026, 14:28 WIB',
    message: 'FIFADA error rate detected at 1.4% — above 1% threshold. Monitoring for escalation. Consider hotfix if rate increases.',
    actions: ['Enable error alerting in Datadog', 'Review recent deploy changes', 'Prepare hotfix if > 2% threshold breached'],
  },
  {
    id: 3, title: 'SPEKTRA Document Drop-off', app: 'SPEKTRA', severity: 'high',
    metric: 'Upload Drop-off', threshold: '> 60%', status: 'triggered',
    lastTriggered: '21 Jul 2026, 09:15 WIB',
    message: 'SPEKTRA document upload drop-off at 62%. UX team reviewing upload flow. Hypothesis: file size limit (5MB) too small.',
    actions: ['A/B test 10MB vs 25MB limit', 'Implement auto-compression pipeline', 'Add supported formats in-app guide'],
  },
  {
    id: 4, title: 'Push Delivery Rate', app: 'FIFADA', severity: 'medium',
    metric: 'Push Delivery', threshold: '< 95%', status: 'triggered',
    lastTriggered: '21 Jul 2026, 16:45 WIB',
    message: 'Push delivery rate at 94.2% — below 95% target. Device token validity review recommended.',
    actions: ['Audit device token validity', 'Implement token refresh flow', 'Review Firebase Cloud Messaging config'],
  },
  {
    id: 5, title: 'AMITRA NPF Rate', app: 'AMITRA', severity: 'high',
    metric: 'NPF Rate', threshold: '> 2.5%', status: 'triggered',
    lastTriggered: '20 Jul 2026, 10:00 WIB',
    message: 'AMITRA NPF rate at 2.8% — above 2.5% threshold. Operations recovery team notified.',
    actions: ['Review 60d+ delinquent accounts', 'Engage collection agency', 'Restrict new disbursement in affected regions'],
  },
  {
    id: 6, title: 'SPEKTRA NPF Rate', app: 'SPEKTRA', severity: 'high',
    metric: 'NPF Rate', threshold: '> 4%', status: 'triggered',
    lastTriggered: '20 Jul 2026, 09:30 WIB',
    message: 'SPEKTRA NPF at 4.2% — approaching 5% limit. Escalate to ops director.',
    actions: ['Escalate to ops-director@group.fif.co.id', 'Review recovery rate by branch', 'Prepare restructuring plan'],
  },
  {
    id: 7, title: 'Bill Reminder Success', app: 'FIFGO', severity: 'low',
    metric: 'Reminder Success', threshold: '< 90%', status: 'resolved',
    lastTriggered: '18 Jul 2026, 10:00 WIB',
    message: 'Bill Reminder journey performing above threshold at 94% success rate.',
    actions: [],
  },
  {
    id: 8, title: 'Avg Days to Disburse', app: 'All LoBs', severity: 'low',
    metric: 'Disbursement Speed', threshold: '> 5 days', status: 'resolved',
    lastTriggered: '15 Jul 2026, 08:00 WIB',
    message: 'Average disbursement speed at 3.8 days — well within 5-day target.',
    actions: [],
  },
];

const SEV = {
  critical: { bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', label: 'CRITICAL', icon: Warning },
  high:     { bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', label: 'HIGH',     icon: Warning },
  medium:   { bg: '#fffbeb', border: '#fde68a', dot: '#d97706', label: 'MEDIUM',   icon: Warning },
  low:      { bg: '#f0fdf4', border: '#bbf7d0', dot: '#059669', label: 'LOW',      icon: CheckCircle },
} as const;

const CHANNEL_META: Record<EscalationChannel, { label: string; icon: React.ElementType; color: string }> = {
  email:    { label: 'Email',    icon: EmailIcon,      color: '#4f8ef7' },
  whatsapp: { label: 'WhatsApp', icon: WhatsAppIcon,  color: '#10b981' },
  teams:    { label: 'MS Teams', icon: TeamsIcon,      color: '#6366f1' },
};

const DEFAULT_CURRENTS: Record<number, string> = {
  1: '1.4%', 2: '1.4%', 3: '62%', 4: '94.2%', 5: '2.8%', 6: '4.2%',
};

// ─── Escalation Modal ─────────────────────────────────────────────────────────

interface EscalationModalProps {
  alert: Alert;
  onClose: () => void;
}

function EscalationModal({ alert, onClose }: EscalationModalProps) {
  const [channel, setChannel] = React.useState<EscalationChannel>('email');
  const [recipient, setRecipient] = React.useState('');
  const [customMsg, setCustomMsg] = React.useState(alert.message);
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState<{ ok: boolean; ticket?: EscalationTicket; error?: string } | null>(null);

  const sev = SEV[alert.severity];

  const presets: Record<EscalationChannel, string> = {
    email:    'ops-director@group.fif.co.id',
    whatsapp: '+62-812-XXXX-XXXX',
    teams:    'fifgroup-operations',
  };

  const handleSend = React.useCallback(async () => {
    if (!recipient.trim()) return;
    setSending(true);
    try {
      const ticket = await createEscalationTicket({
        title: `[${sev.label}] ${alert.title}`,
        description: customMsg,
        severity: alert.severity,
        channel,
        recipient,
        fromMenu: 'Alerts',
        metadata: { alertId: String(alert.id), metric: alert.metric, current: alert.current },
      });
      setResult({ ok: true, ticket });
    } catch {
      setResult({ ok: false, error: 'Failed to send escalation. Please try again.' });
    } finally {
      setSending(false);
    }
  }, [alert, channel, customMsg, recipient, sev]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-start gap-3" style={{ background: sev.bg }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sev.dot}20` }}>
            <sev.icon size={20} weight="fill" style={{ color: sev.dot }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: '#111827' }}>Escalate: {alert.title}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{alert.app} · {alert.metric}: {alert.current} (threshold: {alert.threshold})</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {result ? (
            <div className="text-center py-6">
              {result.ok ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <PaperPlaneTilt size={28} style={{ color: '#10b981' }} weight="fill" />
                  </div>
                  <p className="text-base font-bold" style={{ color: '#111827' }}>Escalation Sent!</p>
                  <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Ticket: <strong>{result.ticket!.id}</strong> · via {CHANNEL_META[channel].label}</p>
                  <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Status: {result.ticket!.status}</p>
                </>
              ) : (
                <>
                  <Warning size={40} style={{ color: '#dc2626' }} className="mx-auto mb-3" />
                  <p className="text-base font-bold" style={{ color: '#dc2626' }}>Failed to Send</p>
                  <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{result.error}</p>
                </>
              )}
              <button onClick={onClose} className="mt-4 px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#1e3a5f' }}>
                {result.ok ? 'Done' : 'Try Again'}
              </button>
            </div>
          ) : (
            <>
              {/* Channel selector */}
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Channel</p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CHANNEL_META) as EscalationChannel[]).map(ch => {
                    const meta = CHANNEL_META[ch];
                    return (
                      <button key={ch} onClick={() => { setChannel(ch); setRecipient(presets[ch]); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: channel === ch ? meta.color : '#e5e7eb',
                          background: channel === ch ? `${meta.color}10` : 'white',
                        }}>
                        <meta.icon size={20} style={{ color: meta.color }} weight={channel === ch ? 'fill' : 'regular'} />
                        <span className="text-[11px] font-semibold" style={{ color: channel === ch ? meta.color : '#6b7280' }}>{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipient */}
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Recipient</p>
                <input
                  type="text"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder={presets[channel]}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  style={{ color: '#111827' }}
                />
              </div>

              {/* Message */}
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Message</p>
                <textarea
                  value={customMsg}
                  onChange={e => setCustomMsg(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                  style={{ color: '#111827' }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold" style={{ color: '#6b7280' }}>
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || !recipient.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: CHANNEL_META[channel].color }}
                >
                  {sending ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><PaperPlaneTilt size={14} weight="fill" /> Send via {CHANNEL_META[channel].label}</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Alert Card ───────────────────────────────────────────────────────────────

interface AlertCardProps {
  alert: Alert;
  expanded: boolean;
  onToggle: () => void;
  onEscalate: (alert: Alert) => void;
  escalated: boolean;
}

const AlertCard = React.memo(function AlertCard({
  alert, expanded, onToggle, onEscalate, escalated,
}: AlertCardProps) {
  const sev = SEV[alert.severity];
  const Icon = sev.icon;
  const isResolved = alert.status === 'resolved';

  return (
    <div className="rounded-2xl border transition-all" style={{ background: sev.bg, borderColor: sev.border }}>
      <div className="p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sev.dot}18` }}>
          <Icon size={20} weight="fill" style={{ color: sev.dot }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <p className="text-sm font-bold" style={{ color: '#111827' }}>{alert.title}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${sev.dot}20`, color: sev.dot }}>{sev.label}</span>
                {isResolved && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#d1fae5', color: '#065f46' }}>RESOLVED</span>}
              </div>
              <p className="text-xs" style={{ color: '#6b7280' }}>{alert.message}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!isResolved && !escalated && (
                <button onClick={() => onEscalate(alert)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: sev.dot, color: 'white' }}>
                  <PaperPlaneTilt size={11} weight="fill" />
                  Escalate
                </button>
              )}
              {escalated && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium" style={{ background: '#f0fdf4', color: '#059669' }}>
                  <CheckCircle size={11} weight="fill" /> Escalated
                </span>
              )}
              {alert.actions.length > 0 && (
                <button onClick={onToggle}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: 'white', border: '1px solid #e5e7eb' }}>
                  {expanded ? <CaretUp size={12} style={{ color: '#374151' }} /> : <CaretDown size={12} style={{ color: '#374151' }} />}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {[
              { label: 'Current', value: alert.current },
              { label: 'Threshold', value: alert.threshold },
              { label: 'App', value: alert.app },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color: '#9ca3af' }}>{m.label}:</span>
                <span className="text-xs font-bold" style={{ color: alert.severity === 'critical' || alert.severity === 'high' ? '#dc2626' : '#374151' }}>{m.value}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 ml-auto">
              <Clock size={10} style={{ color: '#9ca3af' }} />
              <span className="text-[10px]" style={{ color: '#9ca3af' }}>{alert.lastTriggered}</span>
            </div>
          </div>
        </div>
      </div>

      {expanded && alert.actions.length > 0 && (
        <div className="px-5 pb-5">
          <div className="rounded-xl p-4" style={{ background: 'white', border: `1px solid ${sev.border}` }}>
            <p className="text-xs font-bold mb-3" style={{ color: '#374151' }}>Recommended Actions</p>
            <div className="space-y-2">
              {alert.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ArrowRight size={12} style={{ color: sev.dot }} weight="fill" className="mt-0.5 shrink-0" />
                  <p className="text-xs" style={{ color: '#4b5563' }}>{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// ─── Escalation History Sub-page ─────────────────────────────────────────────

function EscalationHistory() {
  const [tickets, setTickets] = React.useState<EscalationTicket[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getEscalationTickets().then(data => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9ca3af' }}>Recent Escalations</p>
      {tickets.length === 0 ? (
        <div className="text-center py-8 text-sm" style={{ color: '#9ca3af' }}>No escalations sent yet.</div>
      ) : tickets.map(t => {
        const meta = CHANNEL_META[t.channel];
        const Icon = meta.icon;
        return (
          <div key={t.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}15` }}>
              <Icon size={14} style={{ color: meta.color }} weight="fill" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold" style={{ color: '#111827' }}>{t.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{
                  background: t.status === 'delivered' ? '#f0fdf4' : t.status === 'sent' ? '#eff6ff' : '#fef2f2',
                  color: t.status === 'delivered' ? '#059669' : t.status === 'sent' ? '#4f8ef7' : '#dc2626',
                }}>{t.status.toUpperCase()}</span>
              </div>
              <p className="text-xs font-medium" style={{ color: '#374151' }}>{t.title}</p>
              <p className="text-[10px] mt-1" style={{ color: '#9ca3af' }}>
                Via {meta.label} → {t.recipient} · {t.fromMenu} · {new Date(t.sentAt || t.createdAt).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── AlertsPage ──────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [filter, setFilter] = React.useState<'all' | 'triggered' | 'resolved'>('all');
  const [tab, setTab] = React.useState<'alerts' | 'history'>('alerts');
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [escalatedSet, setEscalatedSet] = React.useState<Set<number>>(new Set());
  const [escalateTarget, setEscalateTarget] = React.useState<Alert | null>(null);
  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  const allAlerts: Alert[] = React.useMemo(
    () => ALERT_SEEDS.map(seed => ({ ...seed, current: DEFAULT_CURRENTS[seed.id] ?? '—' })),
    []
  );

  const triggered = React.useMemo(() => allAlerts.filter(a => a.status === 'triggered'), [allAlerts]);
  const resolved  = React.useMemo(() => allAlerts.filter(a => a.status === 'resolved'), [allAlerts]);
  const displayed = React.useMemo(() => {
    if (filter === 'triggered') return triggered;
    if (filter === 'resolved') return resolved;
    return allAlerts;
  }, [filter, triggered, resolved, allAlerts]);

  const criticalCount = triggered.filter(a => a.severity === 'critical').length;
  const highCount     = triggered.filter(a => a.severity === 'high').length;
  const mediumCount   = triggered.filter(a => a.severity === 'medium').length;

  const handleFilter = React.useCallback((f: typeof filter) => setFilter(f), []);
  const handleToggle = React.useCallback((id: number) => setExpandedId(prev => prev === id ? null : id), []);
  const handleEscalate = React.useCallback((alert: Alert) => setEscalateTarget(alert), []);
  const handleAckEscalate = React.useCallback((id: number) => {
    setEscalatedSet(prev => { const n = new Set(prev); n.add(id); return n; });
    setEscalateTarget(null);
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Alert Center</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Monitoring & Escalation — FIFGROUP Digital Products</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-[11px] font-medium" style={{ color: '#059669' }}>Monitoring Active</span>
          <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active Alerts',   value: triggered.length,       sub: `${criticalCount} CRIT, ${highCount} HIGH`, color: '#dc2626' },
          { label: 'Resolved',         value: resolved.length,        sub: 'Last 7 days',                            color: '#10b981' },
          { label: 'Escalated',        value: escalatedSet.size,      sub: 'Sent via channel',                       color: '#6366f1' },
          { label: 'Avg Resolution',   value: '2.4h',               sub: 'For HIGH severity',                       color: '#d97706' },
          { label: 'Alert Rules',     value: ALERT_SEEDS.length,     sub: 'Active monitoring',                       color: '#4f8ef7' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>{m.label}</p>
            <p className="text-3xl font-extrabold mb-1" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[11px]" style={{ color: '#9ca3af' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Tab: Alerts vs History */}
      <div className="flex items-center gap-2">
        {([['alerts', 'Alerts'], ['history', 'Escalation History']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t as typeof tab)}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all border"
            style={tab === t ? { background: '#1e3a5f', color: 'white', border: '1px solid #1e3a5f' } : { background: 'white', color: '#374151', border: '1px solid #e5e7eb' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'alerts' ? (
        <>
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            {(['all', 'triggered', 'resolved'] as const).map(f => (
              <button key={f} onClick={() => handleFilter(f)}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all border"
                style={filter === f ? { background: '#1e3a5f', color: 'white', border: '1px solid #1e3a5f' } : { background: 'white', color: '#374151', border: '1px solid #e5e7eb' }}>
                {f === 'all' ? 'All Alerts' : f === 'triggered' ? `Active (${triggered.length})` : `Resolved (${resolved.length})`}
              </button>
            ))}
          </div>

          {/* Alert Cards */}
          <div className="space-y-4">
            {displayed.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 flex flex-col items-center text-center border border-gray-200">
                <CheckCircle size={48} style={{ color: '#10b981' }} weight="fill" />
                <p className="text-lg font-bold mt-4" style={{ color: '#111827' }}>All Clear</p>
                <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>No alerts in this category</p>
              </div>
            ) : (
              displayed.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  expanded={expandedId === alert.id}
                  onToggle={() => handleToggle(alert.id)}
                  onEscalate={handleEscalate}
                  escalated={escalatedSet.has(alert.id)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <EscalationHistory />
        </div>
      )}

      {/* Escalation Modal */}
      {escalateTarget && (
        <EscalationModal
          alert={escalateTarget}
          onClose={() => {
            setEscalateTarget(null);
            handleAckEscalate(escalateTarget.id);
          }}
        />
      )}
    </div>
  );
}
