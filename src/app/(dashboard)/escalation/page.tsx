'use client';

import * as React from 'react';
import {
  PaperPlaneTilt, Envelope, Chats, ShareNetwork,
  CheckCircle, Warning, Clock, ArrowRight,
  CaretDown, CaretUp, Plus, Funnel,
} from '@phosphor-icons/react';
import {
  getEscalationTickets, createEscalationTicket,
  type EscalationTicket, type EscalationChannel,
} from '@/lib/data-sim';

const CHANNEL_META: Record<EscalationChannel, { label: string; icon: React.ElementType; color: string; placeholder: string }> = {
  email:    { label: 'Email',    icon: Envelope,          color: '#4f8ef7', placeholder: 'ops-director@group.fif.co.id' },
  whatsapp: { label: 'WhatsApp', icon: Chats,      color: '#10b981', placeholder: '+62-812-XXXX-XXXX' },
  teams:    { label: 'MS Teams', icon: ShareNetwork, color: '#6366f1', placeholder: 'fifgroup-operations' },
};

const SEV_META = {
  critical: { label: 'CRITICAL', color: '#dc2626', bg: '#fef2f2' },
  high:     { label: 'HIGH',     color: '#dc2626', bg: '#fef2f2' },
  medium:   { label: 'MEDIUM',   color: '#d97706', bg: '#fffbeb' },
  low:      { label: 'LOW',      color: '#059669', bg: '#f0fdf4' },
} as const;

const STATUS_META = {
  pending:   { label: 'PENDING',   color: '#9ca3af' },
  sent:     { label: 'SENT',     color: '#4f8ef7' },
  delivered:{ label: 'DELIVERED',color: '#10b981' },
  failed:   { label: 'FAILED',   color: '#dc2626' },
} as const;

// ─── Compose Modal ─────────────────────────────────────────────────────────────

interface ComposeModalProps {
  initial?: Partial<{ title: string; severity: string; message: string }>;
  onClose: () => void;
  onSent: (t: EscalationTicket) => void;
}

function ComposeModal({ initial, onClose, onSent }: ComposeModalProps) {
  const [channel, setChannel] = React.useState<EscalationChannel>('email');
  const [recipient, setRecipient] = React.useState(CHANNEL_META.email.placeholder);
  const [title, setTitle] = React.useState(initial?.title ?? '');
  const [severity, setSeverity] = React.useState<'critical' | 'high' | 'medium' | 'low'>(initial?.severity as any ?? 'high');
  const [message, setMessage] = React.useState(initial?.message ?? '');
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState<EscalationTicket | null>(null);

  const handleChannel = (ch: EscalationChannel) => {
    setChannel(ch);
    setRecipient(CHANNEL_META[ch].placeholder);
  };

  const handleSend = React.useCallback(async () => {
    if (!recipient.trim() || !title.trim()) return;
    setSending(true);
    try {
      const ticket = await createEscalationTicket({
        title, description: message, severity,
        channel, recipient, fromMenu: 'Escalation Center',
        metadata: {},
      });
      setResult(ticket);
      onSent(ticket);
    } finally {
      setSending(false);
    }
  }, [title, message, severity, channel, recipient, onSent]);

  const ch = CHANNEL_META[channel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1e3a5f15' }}>
              <PaperPlaneTilt size={18} style={{ color: '#1e3a5f' }} weight="fill" />
            </div>
            <p className="text-sm font-bold" style={{ color: '#111827' }}>New Escalation</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        {result ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <PaperPlaneTilt size={28} style={{ color: '#10b981' }} weight="fill" />
            </div>
            <p className="text-base font-bold mb-1" style={{ color: '#111827' }}>Sent Successfully!</p>
            <p className="text-sm" style={{ color: '#6b7280' }}>Ticket <strong>{result.id}</strong> via {ch.label}</p>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Status: {STATUS_META[result.status].label}</p>
            <button onClick={onClose} className="mt-5 px-8 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#1e3a5f' }}>Done</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Severity */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Severity</p>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(SEV_META) as Array<keyof typeof SEV_META>).map(s => (
                  <button key={s} onClick={() => setSeverity(s as any)}
                    className="py-2 rounded-lg text-xs font-semibold border-2 transition-all"
                    style={{
                      borderColor: severity === s ? SEV_META[s].color : '#e5e7eb',
                      background: severity === s ? SEV_META[s].bg : 'white',
                      color: severity === s ? SEV_META[s].color : '#9ca3af',
                    }}>
                    {SEV_META[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Title</p>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief summary of the issue"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>

            {/* Channel */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Channel</p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CHANNEL_META) as EscalationChannel[]).map(ch2 => {
                  const meta = CHANNEL_META[ch2];
                  return (
                    <button key={ch2} onClick={() => handleChannel(ch2)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: channel === ch2 ? meta.color : '#e5e7eb',
                        background: channel === ch2 ? `${meta.color}10` : 'white',
                      }}>
                      <meta.icon size={18} style={{ color: meta.color }} weight={channel === ch2 ? 'fill' : 'regular'} />
                      <span className="text-[11px] font-semibold" style={{ color: channel === ch2 ? meta.color : '#9ca3af' }}>{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Recipient</p>
              <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder={ch.placeholder}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>

            {/* Message */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>Message</p>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                placeholder="Describe the issue, context, and recommended action..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold" style={{ color: '#6b7280' }}>Cancel</button>
              <button onClick={handleSend} disabled={sending || !recipient.trim() || !title.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: ch.color }}>
                {sending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</> : <><PaperPlaneTilt size={14} weight="fill" /> Send</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Escalation Page ─────────────────────────────────────────────────────────

export default function EscalationPage() {
  const [tickets, setTickets] = React.useState<EscalationTicket[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<'all' | keyof typeof STATUS_META>('all');
  const [channelFilter, setChannelFilter] = React.useState<'all' | EscalationChannel>('all');
  const [showCompose, setShowCompose] = React.useState(false);
  const [timeStr, setTimeStr] = React.useState('--:--');

  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    getEscalationTickets().then(data => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  const filtered = React.useMemo(() => {
    return tickets.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (channelFilter !== 'all' && t.channel !== channelFilter) return false;
      return true;
    });
  }, [tickets, statusFilter, channelFilter]);

  const stats = React.useMemo(() => ({
    total: tickets.length,
    delivered: tickets.filter(t => t.status === 'delivered').length,
    sent: tickets.filter(t => t.status === 'sent').length,
    failed: tickets.filter(t => t.status === 'failed').length,
  }), [tickets]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Escalation Center</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Send alerts via Email · WhatsApp · MS Teams</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
          </div>
          <button onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: '#1e3a5f' }}>
            <Plus size={14} weight="bold" /> New Escalation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sent', value: stats.total, color: '#1e3a5f' },
          { label: 'Delivered', value: stats.delivered, color: '#10b981' },
          { label: 'Sent', value: stats.sent, color: '#4f8ef7' },
          { label: 'Failed', value: stats.failed, color: '#dc2626' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200 flex flex-col items-center text-center">
            <p className="text-3xl font-extrabold" style={{ color: m.color }}>{m.value}</p>
            <p className="text-xs font-medium mt-1" style={{ color: '#9ca3af' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Compose */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-sm font-bold mb-4" style={{ color: '#111827' }}>Quick Escalation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['email', 'whatsapp', 'teams'] as EscalationChannel[]).map(ch => {
            const meta = CHANNEL_META[ch];
            return (
              <button key={ch} onClick={() => setShowCompose(true)}
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all text-left"
                style={{ background: 'white' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${meta.color}15` }}>
                  <meta.icon size={20} style={{ color: meta.color }} weight="fill" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#111827' }}>{meta.label}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{meta.placeholder}</p>
                </div>
                <ArrowRight size={14} style={{ color: '#d1d5db' }} className="ml-auto" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Funnel size={14} style={{ color: '#9ca3af' }} />
        <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>Filter:</span>
        {(['all', 'delivered', 'sent', 'failed'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={statusFilter === s
              ? { background: '#1e3a5f', color: 'white', border: '1px solid #1e3a5f' }
              : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }}>
            {s === 'all' ? 'All' : STATUS_META[s].label}
          </button>
        ))}
        <span className="text-xs" style={{ color: '#d1d5db' }}>|</span>
        {(['all', 'email', 'whatsapp', 'teams'] as const).map(c => (
          <button key={c} onClick={() => setChannelFilter(c as any)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={channelFilter === c
              ? { background: '#1e3a5f', color: 'white', border: '1px solid #1e3a5f' }
              : { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' }}>
            {c === 'all' ? 'All Channels' : CHANNEL_META[c as EscalationChannel].label}
          </button>
        ))}
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold" style={{ color: '#111827' }}>
            Escalation History
            <span className="ml-2 text-xs font-medium" style={{ color: '#9ca3af' }}>— {filtered.length} records</span>
          </h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <PaperPlaneTilt size={32} style={{ color: '#d1d5db' }} className="mx-auto mb-2" />
            <p className="text-sm" style={{ color: '#9ca3af' }}>No escalations match your filter</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(t => {
              const ch = CHANNEL_META[t.channel];
              const ChIcon = ch.icon;
              const sev = SEV_META[t.severity as keyof typeof SEV_META];
              const status = STATUS_META[t.status as keyof typeof STATUS_META];
              return (
                <div key={t.id} className="p-4 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${ch.color}15` }}>
                    <ChIcon size={16} style={{ color: ch.color }} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold" style={{ color: '#111827' }}>{t.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: sev.bg, color: sev.color }}>{sev.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${ch.color}15`, color: ch.color }}>{ch.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#f3f4f6', color: status.color }}>{status.label}</span>
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#374151' }}>{t.title}</p>
                    <p className="text-xs mb-2" style={{ color: '#6b7280' }}>{t.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px]" style={{ color: '#9ca3af' }}>→ {t.recipient}</span>
                      <span className="text-[10px]" style={{ color: '#9ca3af' }}>· {t.fromMenu}</span>
                      <span className="text-[10px]" style={{ color: '#9ca3af' }}>· {formatDate(t.sentAt || t.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <ComposeModal onClose={() => setShowCompose(false)} onSent={ticket => {
          setTickets(prev => [ticket, ...prev]);
        }} />
      )}
    </div>
  );
}
