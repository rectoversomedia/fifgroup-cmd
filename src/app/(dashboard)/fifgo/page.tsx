'use client';

import * as React from 'react';
import {
  Star, Download, ShieldCheck,
  CheckCircle, Lightning,
  GooglePlayLogo, AppStoreLogo,
  PencilSimple, X, Trash, Plus,
} from '@phosphor-icons/react';
import { loadFifgoData, saveFifgoData, FifgoData, DEFAULT_FIFGO } from '@/components/fifgo-admin';
import { useAuth } from '@/components/auth-provider';

const FIFGO_LOGO = '/images/fifgo-logo.png';

type MetricKey = 'rating' | 'downloads' | 'totalReviews' | 'aso';

type MetricCard = {
  id: string;
  key: MetricKey;
  icon: React.ElementType;
  color: string;
  label: string;
};

// Icon map — used to serialize/deserialize icon reference from localStorage
const ICON_MAP: Record<string, React.ElementType> = { Star, Download, ShieldCheck };

const DEFAULT_CARDS: MetricCard[] = [
  { id: 'rating', key: 'rating', icon: Star, color: '#f59e0b', label: 'Rating' },
  { id: 'downloads', key: 'downloads', icon: Download, color: '#06b6d4', label: 'Downloads' },
  { id: 'totalReviews', key: 'totalReviews', icon: Star, color: '#6366f1', label: 'Total Reviews' },
  { id: 'aso', key: 'aso', icon: ShieldCheck, color: '#10b981', label: 'ASO Score' },
];

const CARDS_KEY = 'fifgo_metric_cards';

type EditMode =
  | { type: 'kpi'; key: MetricKey }
  | { type: 'aso'; value: string }
  | { type: 'aso-idx'; idx: number }
  | { type: 'add-card' }
  | null;

function num(v: string) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }

function safeCards(def: MetricCard[]): MetricCard[] {
  if (typeof window === 'undefined') return def;
  try {
    const s = localStorage.getItem(CARDS_KEY);
    if (!s) return def;
    const parsed = JSON.parse(s);
    if (!Array.isArray(parsed) || parsed.length === 0) return def;
    return parsed.map(c => ({
      ...c,
      icon: ICON_MAP[c.iconName] ?? ShieldCheck,
    }));
  } catch (_) { return def; }
}

function safeData(def: FifgoData): FifgoData {
  if (typeof window === 'undefined') return def;
  try {
    const stored = localStorage.getItem('fifgo_admin_data_v3');
    if (!stored) return def;
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      localStorage.removeItem('fifgo_admin_data_v3');
      return def;
    }
    return { ...def, ...parsed };
  } catch (_) {
    try { localStorage.removeItem('fifgo_admin_data_v3'); } catch (_) {}
    return def;
  }
}

function saveCards(cards: MetricCard[]) {
  try {
    const serializable = cards.map(c => ({
      ...c,
      iconName: c.key === 'rating' || c.key === 'totalReviews' ? 'Star' : c.key === 'downloads' ? 'Download' : 'ShieldCheck',
    }));
    localStorage.setItem(CARDS_KEY, JSON.stringify(serializable));
  } catch (_) {}
}

class FifgoErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: '#f8fafc' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#fef2f2' }}>
            <svg width="32" height="32" viewBox="0 0 256 256" fill="none">
              <path d="M128 24a104 104 0 1 0 104 104A104 104 0 0 0 128 24Z" stroke="#dc2626" strokeWidth="16" fill="none"/>
              <path d="M128 80v48M128 176h.01" stroke="#dc2626" strokeWidth="16" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold mb-1" style={{ color: '#111827' }}>Terjadi Kesalahan</h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>Data Anda sudah tersimpan. Coba muat ulang.</p>
          </div>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#1e3a5f' }}
          >
            Muat Ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function FIFGOPage() {
  const { isAdmin } = useAuth();
  const [store, setStore] = React.useState<'playstore' | 'appstore'>('playstore');
  const [timeStr, setTimeStr] = React.useState('--:--');
  // Start with default data — safe from day one, no localStorage crash risk
  const [data, setData] = React.useState<FifgoData>(() => DEFAULT_FIFGO);
  const [cards, setCards] = React.useState<MetricCard[]>(() => DEFAULT_CARDS);
  const [hydrated, setHydrated] = React.useState(false);
  const [editMode, setEditMode] = React.useState<EditMode>(null);
  const [kpiVal, setKpiVal] = React.useState('');
  const [recForm, setRecForm] = React.useState({ title: '', description: '', impact: '', priority: 'medium' as 'high' | 'medium' | 'low' });
  const [newCardLabel, setNewCardLabel] = React.useState('');
  const [newCardKey, setNewCardKey] = React.useState<MetricKey>('rating');

  // Hydrate from localStorage once after mount
  React.useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }));
    const t = setInterval(() => setTimeStr(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })), 30_000);
    setData(safeData(DEFAULT_FIFGO));
    setCards(safeCards(DEFAULT_CARDS));
    setHydrated(true);
    return () => clearInterval(t);
  }, []);

  const handleDataChange = React.useCallback((newData: FifgoData) => {
    setData(newData);
    try { saveFifgoData(newData); } catch (_) {}
  }, []);

  const isHealthy = data.appHealthMetrics.every(m => m.good);
  const s = data[store];
  const asasoScore = data.ascoreBreakdown.reduce((acc, item) => acc + item.score * item.weight / 100, 0);

  const getCardValue = (key: MetricKey) => {
    if (key === 'rating') return `${s.rating}★`;
    if (key === 'downloads') return s.downloads;
    if (key === 'totalReviews') return s.totalReviews;
    return `${Math.round(asasoScore)}/100`;
  };

  const getCardSub = (key: MetricKey) => {
    if (key === 'rating') return `${s.totalReviews} reviews`;
    if (key === 'downloads') return s.downloadsChange;
    if (key === 'totalReviews') return 'all time';
    return `+${Math.max(0, Math.round(asasoScore - 74))} from avg`;
  };

  // Auto-save debounce refs
  const kpiTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const asoTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyKpiEdit = React.useCallback(() => {
    if (!editMode || editMode.type !== 'kpi') return;
    try {
      const next = { ...data, [store]: { ...data[store] } };
      if (editMode.key === 'rating') next[store].rating = num(kpiVal);
      else if (editMode.key === 'downloads') next[store].downloads = kpiVal;
      else if (editMode.key === 'totalReviews') next[store].totalReviews = kpiVal;
      handleDataChange(next);
    } catch (_) {}
    setEditMode(null);
  }, [editMode, data, store, kpiVal, handleDataChange]);

  const onKpiValChange = React.useCallback((val: string) => {
    setKpiVal(val);
    if (!editMode || editMode.type !== 'kpi') return;
    if (kpiTimer.current) clearTimeout(kpiTimer.current);
    kpiTimer.current = setTimeout(() => {
      try {
        const next = { ...data, [store]: { ...data[store] } };
        if (editMode.key === 'rating') next[store].rating = num(val);
        else if (editMode.key === 'downloads') next[store].downloads = val;
        else if (editMode.key === 'totalReviews') next[store].totalReviews = val;
        setData(next);
        saveFifgoData(next);
      } catch (_) {}
    }, 1500);
  }, [data, editMode, store]);

  const openAsoEdit = () => setEditMode({ type: 'aso', value: String(Math.round(asasoScore)) });

  const applyAsoEdit = React.useCallback(() => {
    if (!editMode || editMode.type !== 'aso') return;
    try {
      const target = num(editMode.value);
      const next = { ...data, ascoreBreakdown: data.ascoreBreakdown.map(item => ({ ...item, score: Math.max(0, Math.min(100, target)) })) };
      handleDataChange(next);
    } catch (_) {}
    setEditMode(null);
  }, [editMode, data, handleDataChange]);

  const onAsoValChange = React.useCallback((val: string) => {
    setEditMode(prev => prev?.type === 'aso' ? { ...prev, value: val } : prev);
    if (asoTimer.current) clearTimeout(asoTimer.current);
    asoTimer.current = setTimeout(() => {
      try {
        const target = num(val);
        const next = { ...data, ascoreBreakdown: data.ascoreBreakdown.map(item => ({ ...item, score: Math.max(0, Math.min(100, target)) })) };
        setData(next);
        saveFifgoData(next);
      } catch (_) {}
    }, 1500);
  }, [data]);

  const openRecEdit = (idx: number) => {
    const r = data.recommendations[idx];
    setRecForm({ title: r.title, description: r.description, impact: r.impact ?? '', priority: r.priority });
    setEditMode({ type: 'aso-idx', idx });
  };

  const applyRecEdit = React.useCallback(() => {
    if (!editMode || editMode.type !== 'aso-idx') return;
    try {
      let recs: FifgoData['recommendations'];
      if (editMode.idx === -1) recs = [...data.recommendations, { ...recForm }];
      else recs = data.recommendations.map((r, i) => i === editMode.idx ? { ...r, ...recForm } : r);
      handleDataChange({ ...data, recommendations: recs });
    } catch (_) {}
    setEditMode(null);
  }, [editMode, data, recForm, handleDataChange]);

  const deleteRec = React.useCallback((idx: number) => {
    try { handleDataChange({ ...data, recommendations: data.recommendations.filter((_, i) => i !== idx) }); } catch (_) {}
  }, [data, handleDataChange]);

  const openAddRec = () => {
    setRecForm({ title: '', description: '', impact: '', priority: 'medium' });
    setEditMode({ type: 'aso-idx', idx: -1 });
  };

  const isEditingRec = editMode?.type === 'aso-idx';
  const isAddingRec = isEditingRec && editMode.idx === -1;

  const deleteCard = React.useCallback((id: string) => {
    if (cards.length <= 1) { alert('Minimal harus ada 1 kartu.'); return; }
    try {
      const next = cards.filter(c => c.id !== id);
      setCards(next);
      saveCards(next);
    } catch (_) {}
  }, [cards]);

  const openAddCard = () => {
    setNewCardLabel('');
    setNewCardKey('rating');
    setEditMode({ type: 'add-card' });
  };

  const applyAddCard = React.useCallback(() => {
    if (!newCardLabel.trim()) return;
    try {
      const next = [...cards, {
        id: `card_${Date.now()}`,
        key: newCardKey,
        icon: newCardKey === 'rating' ? Star : newCardKey === 'downloads' ? Download : newCardKey === 'totalReviews' ? Star : ShieldCheck,
        color: newCardKey === 'rating' ? '#f59e0b' : newCardKey === 'downloads' ? '#06b6d4' : newCardKey === 'totalReviews' ? '#6366f1' : '#10b981',
        label: newCardLabel.trim(),
      }];
      setCards(next);
      saveCards(next);
    } catch (_) {}
    setEditMode(null);
  }, [cards, newCardLabel, newCardKey]);

  return (
    <FifgoErrorBoundary>
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-screen">

      {/* Loading skeleton while hydrating */}
      {!hydrated ? (
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-200" />
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded" />
              <div className="w-32 h-3 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
          </div>
        </div>
      ) : (
        <>
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm">
              <img src={FIFGO_LOGO} alt="FIFGO" className="w-14 h-14 object-contain" />
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ color: '#111827' }}>FIFGO</h1>
              <p className="text-sm" style={{ color: '#6b7280' }}>Super App — Finance · Indonesia</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: isHealthy ? '#d1fae5' : '#fef3c7', color: isHealthy ? '#065f46' : '#92400e' }}>
                  {isHealthy ? 'HEALTHY' : 'REVIEW'}
                </span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>{store === 'playstore' ? 'Android' : 'iOS'} · v3.2.1</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
            <span className="text-[11px] font-medium" style={{ color: '#059669' }}>LIVE</span>
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>·</span>
            <span className="text-[11px]" style={{ color: '#9ca3af' }}>{timeStr} WIB</span>
          </div>
        </div>

        {/* Store Toggle */}
        <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 border border-gray-200 w-fit">
          {([
            { id: 'playstore' as const, label: 'Google Play Store' },
            { id: 'appstore' as const, label: 'App Store' },
          ] as const).map(s_ => (
            <button key={s_.id} onClick={() => setStore(s_.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={store === s_.id ? { background: '#1f2937', color: '#fff' } : { background: 'transparent', color: '#9ca3af' }}>
              {s_.id === 'playstore' ? <GooglePlayLogo size={14} weight={store === s_.id ? 'fill' : 'regular'} /> : <AppStoreLogo size={14} weight={store === s_.id ? 'fill' : 'regular'} />}
              {s_.label}
            </button>
          ))}
        </div>

        {/* Metric Cards */}
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            {cards.map(card => (
              <div key={card.id} className="bg-white rounded-2xl p-5 border border-gray-200 flex items-start gap-4 relative group/card">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${card.color}15` }}>
                  <card.icon size={24} style={{ color: card.color }} weight="fill" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium mb-1" style={{ color: '#9ca3af' }}>{card.label}</p>
                  <p className="text-xl font-bold" style={{ color: '#111827' }}>{getCardValue(card.key)}</p>
                  <p className="text-[11px]" style={{ color: card.color }}>{getCardSub(card.key)}</p>
                </div>
                {isAdmin && (
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <button onClick={() => deleteCard(card.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                    <Trash size={12} style={{ color: '#f87171' }} />
                  </button>
                  <button onClick={() => card.key === 'aso' ? openAsoEdit() : (setKpiVal(card.key === 'rating' ? String(s.rating) : card.key === 'downloads' ? s.downloads : s.totalReviews), setEditMode({ type: 'kpi', key: card.key }))} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <PencilSimple size={12} style={{ color: '#9ca3af' }} />
                  </button>
                </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && (
          <button onClick={openAddCard} className="ml-4 shrink-0 w-12 h-12 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all hover:border-gray-400 hover:bg-gray-50" style={{ borderColor: '#d1d5db' }}>
            <Plus size={20} style={{ color: '#9ca3af' }} />
          </button>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>ASO Recommendations</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#fef2f2', color: '#dc2626' }}>{data.recommendations.filter(r => r.priority === 'high').length} High</span>
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#fffbeb', color: '#d97706' }}>{data.recommendations.filter(r => r.priority === 'medium').length} Medium</span>
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: '#f0fdf4', color: '#10b981' }}>{data.recommendations.filter(r => r.priority === 'low').length} Low</span>
              {isAdmin && (
              <button onClick={openAddRec} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all hover:opacity-80" style={{ background: '#1e3a5f', color: '#fff' }}>
                <Plus size={11} weight="bold" /> Add
              </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {data.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border group/rec relative"
                style={{ background: rec.priority === 'high' ? '#fef2f2' : rec.priority === 'medium' ? '#fffbeb' : '#f0fdf4', borderColor: rec.priority === 'high' ? '#fecaca' : rec.priority === 'medium' ? '#fde68a' : '#bbf7d0' }}>
                <div className="flex items-center gap-1 absolute top-2 right-2 opacity-0 group-hover/rec:opacity-100 transition-opacity">
                  {isAdmin && (
                  <>
                  <button onClick={() => deleteRec(i)} className="p-1.5 rounded-lg hover:bg-red-100">
                    <Trash size={12} style={{ color: '#f87171' }} />
                  </button>
                  <button onClick={() => openRecEdit(i)} className="p-1.5 rounded-lg hover:bg-white/60">
                    <PencilSimple size={12} style={{ color: '#9ca3af' }} />
                  </button>
                  </>
                  )}
                </div>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: rec.priority === 'high' ? '#fee2e2' : rec.priority === 'medium' ? '#fef3c7' : '#d1fae5' }}>
                  {rec.priority === 'high' ? (
                    <svg width="14" height="14" viewBox="0 0 256 256" fill="none"><circle cx="128" cy="128" r="88" fill="#dc2626" fillOpacity="0.15"/><path d="M128 80v48M128 176h.01" stroke="#dc2626" strokeWidth="16" strokeLinecap="round"/></svg>
                  ) : rec.priority === 'medium' ? (
                    <Lightning size={14} style={{ color: '#d97706' }} weight="fill" />
                  ) : (
                    <CheckCircle size={14} style={{ color: '#10b981' }} weight="fill" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-bold" style={{ color: '#374151' }}>{rec.title}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold capitalize"
                      style={{ background: rec.priority === 'high' ? '#fee2e2' : rec.priority === 'medium' ? '#fef3c7' : '#d1fae5', color: rec.priority === 'high' ? '#dc2626' : rec.priority === 'medium' ? '#d97706' : '#10b981' }}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[11px]" style={{ color: '#6b7280' }}>{rec.description}</p>
                  {rec.impact && <p className="text-[10px] mt-1" style={{ color: '#10b981' }}>💡 Impact: {rec.impact}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Modals ── */}

        {/* KPI Edit Modal */}
        {editMode?.type === 'kpi' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} onClick={() => setEditMode(null)}>
            <div className="bg-white rounded-2xl p-5 w-72 shadow-2xl" onClick={e => e.stopPropagation()}>
              <p className="text-sm font-bold mb-1" style={{ color: '#111827' }}>
                Edit {editMode.key === 'rating' ? 'Rating' : editMode.key === 'downloads' ? 'Downloads' : 'Total Reviews'}
              </p>
              <p className="text-[11px] mb-3" style={{ color: '#9ca3af' }}>{store === 'playstore' ? 'Google Play Store' : 'App Store'}</p>
              <input type={editMode.key === 'rating' ? 'number' : 'text'} step={editMode.key === 'rating' ? '0.1' : undefined} min={editMode.key === 'rating' ? '0' : undefined} max={editMode.key === 'rating' ? '5' : undefined}
                value={kpiVal} onChange={e => onKpiValChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') applyKpiEdit(); if (e.key === 'Escape') setEditMode(null); }}
                className="w-full px-3 py-2.5 rounded-xl border text-sm font-medium mb-3 focus:outline-none" style={{ border: '1px solid #e5e7eb' }} autoFocus />
              <div className="flex gap-2">
                <button onClick={() => setEditMode(null)} className="flex-1 py-2 rounded-xl border text-xs font-semibold" style={{ border: '1px solid #e5e7eb', color: '#6b7280' }}>Batal</button>
                <button onClick={applyKpiEdit} className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#1e3a5f' }}>Simpan</button>
              </div>
            </div>
          </div>
        )}

        {/* ASO Score Edit Modal */}
        {editMode?.type === 'aso' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} onClick={() => setEditMode(null)}>
            <div className="bg-white rounded-2xl p-5 w-72 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: '#111827' }}>Edit ASO Score</p>
                <button onClick={() => setEditMode(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} style={{ color: '#9ca3af' }} /></button>
              </div>
              <p className="text-[11px] mb-3" style={{ color: '#9ca3af' }}>{store === 'playstore' ? 'Google Play Store' : 'App Store'}</p>
              <div className="flex items-center gap-3 mb-4">
                <input type="number" min="0" max="100" value={editMode.value}
                  onChange={e => onAsoValChange(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') applyAsoEdit(); if (e.key === 'Escape') setEditMode(null); }}
                  className="flex-1 px-4 py-3 rounded-xl border text-2xl font-bold text-center focus:outline-none" style={{ border: '1px solid #e5e7eb', color: '#111827' }} autoFocus />
                <span className="text-xl font-bold" style={{ color: '#9ca3af' }}>/100</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditMode(null)} className="flex-1 py-2 rounded-xl border text-xs font-semibold" style={{ border: '1px solid #e5e7eb', color: '#6b7280' }}>Batal</button>
                <button onClick={applyAsoEdit} className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#10b981' }}>Simpan</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Card Modal */}
        {editMode?.type === 'add-card' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} onClick={() => setEditMode(null)}>
            <div className="bg-white rounded-2xl p-5 w-72 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: '#111827' }}>Tambah Kartu</p>
                <button onClick={() => setEditMode(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} style={{ color: '#9ca3af' }} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Nama Kartu</label>
                  <input value={newCardLabel} onChange={e => setNewCardLabel(e.target.value)} placeholder="e.g. Active Users"
                    className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none" style={{ border: '1px solid #e5e7eb', color: '#111827' }} autoFocus />
                </div>
                <div>
                  <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Data Source</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { key: 'rating' as MetricKey, label: 'Rating' },
                      { key: 'downloads' as MetricKey, label: 'Downloads' },
                      { key: 'totalReviews' as MetricKey, label: 'Total Reviews' },
                      { key: 'aso' as MetricKey, label: 'ASO Score' },
                    ] as const).map(opt => (
                      <button key={opt.key} onClick={() => setNewCardKey(opt.key)}
                        className="py-2 rounded-xl text-xs font-semibold border-2 transition-all"
                        style={{ borderColor: newCardKey === opt.key ? '#1e3a5f' : '#e5e7eb', background: newCardKey === opt.key ? '#eff6ff' : 'white', color: newCardKey === opt.key ? '#1e3a5f' : '#9ca3af' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditMode(null)} className="flex-1 py-2 rounded-xl border text-xs font-semibold" style={{ border: '1px solid #e5e7eb', color: '#6b7280' }}>Batal</button>
                <button onClick={applyAddCard} className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#1e3a5f' }}>Tambah</button>
              </div>
            </div>
          </div>
        )}

        {/* Recommendation Edit Modal */}
        {isEditingRec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} onClick={() => setEditMode(null)}>
            <div className="bg-white rounded-2xl p-5 w-[28rem] max-w-[92vw] shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: '#111827' }}>{isAddingRec ? 'Tambah Recommendation' : 'Edit Recommendation'}</p>
                <button onClick={() => setEditMode(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={16} style={{ color: '#9ca3af' }} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['high', 'medium', 'low'] as const).map(p => (
                      <button key={p} onClick={() => setRecForm(f => ({ ...f, priority: p }))}
                        className="py-2 rounded-xl text-xs font-semibold border-2 capitalize transition-all"
                        style={{ borderColor: recForm.priority === p ? (p === 'high' ? '#dc2626' : p === 'medium' ? '#d97706' : '#10b981') : '#e5e7eb', background: recForm.priority === p ? (p === 'high' ? '#fef2f2' : p === 'medium' ? '#fffbeb' : '#f0fdf4') : 'white', color: recForm.priority === p ? (p === 'high' ? '#dc2626' : p === 'medium' ? '#d97706' : '#10b981') : '#9ca3af' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Title</label>
                  <input value={recForm.title} onChange={e => setRecForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none" style={{ border: '1px solid #e5e7eb', color: '#111827' }} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Description</label>
                  <textarea value={recForm.description} onChange={e => setRecForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none resize-none" style={{ border: '1px solid #e5e7eb', color: '#6b7280' }} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Impact (optional)</label>
                  <input value={recForm.impact} onChange={e => setRecForm(f => ({ ...f, impact: e.target.value }))} placeholder="e.g. +15% conversion rate"
                    className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none" style={{ border: '1px solid #e5e7eb', color: '#10b981' }} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditMode(null)} className="flex-1 py-2 rounded-xl border text-xs font-semibold" style={{ border: '1px solid #e5e7eb', color: '#6b7280' }}>Batal</button>
                <button onClick={applyRecEdit} className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#1e3a5f' }}>Simpan</button>
              </div>
            </div>
          </div>
        )}
        </>
      )}
    </div>
    </FifgoErrorBoundary>
  );
}
