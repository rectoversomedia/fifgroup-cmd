'use client';

import * as React from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type FifgoStoreData = {
  rating: number;
  downloads: string;
  downloadsChange: string;
  activeUsers: string;
  activeUsersChange: string;
  ratingDistribution: { stars: number; pct: number }[];
  totalReviews: string;
  lobs: { name: string; pct: number; users: string; status: string; color: string }[];
};

export type FifgoData = {
  playstore: FifgoStoreData;
  appstore: FifgoStoreData;
  ascoreBreakdown: { label: string; score: number; weight: number; detail: string }[];
  keywords: { keyword: string; position: number; volume: string; change: number }[];
  reviews: { author: string; rating: number; date: string; text: string }[];
  appHealthMetrics: { label: string; value: string; target: string; good: boolean }[];
  issues: { severity: string; text: string; date: string }[];
  ratingTrend: { period: string; rating: number }[];
};

// ─── Default data ───────────────────────────────────────────────────────────────

export const DEFAULT_FIFGO: FifgoData = {
  playstore: {
    rating: 4.2, downloads: '850K', downloadsChange: '+23%',
    activeUsers: '234K', activeUsersChange: '+15%',
    ratingDistribution: [
      { stars: 5, pct: 68 }, { stars: 4, pct: 18 }, { stars: 3, pct: 8 }, { stars: 2, pct: 4 }, { stars: 1, pct: 2 },
    ],
    totalReviews: '12,847',
    lobs: [
      { name: 'FIFASTRA', pct: 72, users: '168K', status: 'On Track', color: '#4f8ef7' },
      { name: 'SPEKTRA', pct: 28, users: '65K', status: 'Below Target', color: '#f97316' },
      { name: 'DANASTRA', pct: 61, users: '142K', status: 'Growing', color: '#06b6d4' },
      { name: 'FINATRA', pct: 45, users: '105K', status: 'Stable', color: '#f59e0b' },
      { name: 'AMITRA', pct: 52, users: '121K', status: 'Growing', color: '#10b981' },
    ],
  },
  appstore: {
    rating: 4.5, downloads: '92K', downloadsChange: '+41%',
    activeUsers: '28K', activeUsersChange: '+38%',
    ratingDistribution: [
      { stars: 5, pct: 74 }, { stars: 4, pct: 16 }, { stars: 3, pct: 6 }, { stars: 2, pct: 3 }, { stars: 1, pct: 1 },
    ],
    totalReviews: '1,203',
    lobs: [
      { name: 'FIFASTRA', pct: 72, users: '168K', status: 'On Track', color: '#4f8ef7' },
      { name: 'SPEKTRA', pct: 28, users: '65K', status: 'Below Target', color: '#f97316' },
      { name: 'DANASTRA', pct: 61, users: '142K', status: 'Growing', color: '#06b6d4' },
      { name: 'FINATRA', pct: 45, users: '105K', status: 'Stable', color: '#f59e0b' },
      { name: 'AMITRA', pct: 52, users: '121K', status: 'Growing', color: '#10b981' },
    ],
  },
  ascoreBreakdown: [
    { label: 'App Title', score: 85, weight: 20, detail: '50 chars, 3 keywords included' },
    { label: 'Description', score: 72, weight: 25, detail: '3,200 chars, good structure' },
    { label: 'Screenshots', score: 90, weight: 20, detail: '5 screenshots, portrait + landscape' },
    { label: 'Icon', score: 95, weight: 10, detail: 'Professional, clear at all sizes' },
    { label: 'Videos', score: 65, weight: 10, detail: 'No promo video' },
    { label: 'Ratings & Reviews', score: 78, weight: 15, detail: '4.2★ from 12,847 reviews' },
  ],
  keywords: [
    { keyword: 'pinjol mudah', position: 1, volume: '12K', change: 0 },
    { keyword: 'kredit online', position: 3, volume: '45K', change: 2 },
    { keyword: 'pinjaman cepat', position: 2, volume: '28K', change: -1 },
    { keyword: 'digital lending', position: 5, volume: '8K', change: 1 },
    { keyword: 'tunaiku', position: 1, volume: '32K', change: 0 },
    { keyword: 'loan apps', position: 8, volume: '67K', change: 3 },
  ],
  reviews: [
    { author: 'Andi S.', rating: 5, date: '2 Jul 2026', text: 'Sangat mudah pengajuannya, dana langsung cair dalam 10 menit.' },
    { author: 'Rina W.', rating: 4, date: '28 Jun 2026', text: 'App cepat dan ringan. Tapi bunga agak tinggi untuk jangka panjang.' },
    { author: 'Budi H.', rating: 2, date: '25 Jun 2026', text: 'Sulit upload dokumen, sering error. Semoga diperbaiki.' },
    { author: 'Dewi M.', rating: 5, date: '20 Jun 2026', text: 'Sudah 3x pinjam di FIFGO, all good! Proses transparan.' },
  ],
  appHealthMetrics: [
    { label: 'App Load Time', value: '1.8s', target: '< 3s', good: true },
    { label: 'API Response', value: '240ms', target: '< 500ms', good: true },
    { label: 'Error Rate', value: '0.2%', target: '< 0.5%', good: true },
    { label: 'Crash Rate', value: '0.1%', target: '< 0.5%', good: true },
    { label: 'Push Delivery', value: '96%', target: '> 95%', good: true },
    { label: 'Session Duration', value: '5.4m', target: '> 3m', good: true },
  ],
  issues: [
    { severity: 'medium', text: 'App Load Time degraded on Android 14 devices — investigating', date: '22 Jul 2026' },
  ],
  ratingTrend: [
    { period: 'Mar', rating: 4.0 }, { period: 'Apr', rating: 4.1 },
    { period: 'May', rating: 4.1 }, { period: 'Jun', rating: 4.2 },
    { period: 'Jul', rating: 4.2 },
  ],
};

// ─── Persistence ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'fifgo_admin_data_v3';

export function loadFifgoData(): FifgoData {
  if (typeof window === 'undefined') return DEFAULT_FIFGO;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_FIFGO, ...JSON.parse(stored) };
  } catch (_) {}
  return DEFAULT_FIFGO;
}

export function saveFifgoData(data: FifgoData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetFifgoData() {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function num(v: string) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
function int(v: string) { const n = parseInt(v); return isNaN(n) ? 0 : n; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Arr = any[];
function mut<T extends Arr>(arr: T, i: number, key: string, val: unknown) {
  const a = [...arr];
  a[i] = { ...a[i], [key]: val };
  return a;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-wide block" style={{ color: '#9ca3af' }}>{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 mb-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
      <span className="text-base">{icon}</span>
      <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: '#374151' }}>{label}</h3>
    </div>
  );
}

type FieldDef = { key: string; label: string; type?: string; step?: string; min?: string; max?: string; placeholder?: string };

function StoreKPISection({
  store, data, set,
}: {
  store: 'playstore' | 'appstore';
  data: FifgoStoreData;
  set: (s: 'playstore' | 'appstore', k: string, v: unknown) => void;
}) {
  const fields: FieldDef[] = [
    { key: 'rating', label: 'Rating', type: 'number', step: '0.1', min: '0', max: '5' },
    { key: 'downloads', label: 'Downloads', placeholder: '' },
    { key: 'downloadsChange', label: 'Downloads Δ', placeholder: '' },
    { key: 'activeUsers', label: 'Active Users', placeholder: '' },
    { key: 'activeUsersChange', label: 'Active Users Δ', placeholder: '' },
    { key: 'totalReviews', label: 'Total Reviews', placeholder: '' },
  ];

  return (
    <section>
      <SectionTitle
        icon={store === 'playstore' ? '▶️' : '🍎'}
        label={store === 'playstore' ? 'Google Play Store' : 'Apple App Store'}
      />
      <div className="grid grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.key} className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wide block" style={{ color: '#9ca3af' }}>{f.label}</label>
            <input
              type={f.type ?? 'text'}
              step={f.step} min={f.min} max={f.max}
              value={(data as Record<string, unknown>)[f.key] as string}
              onChange={e => set(store, f.key, f.type === 'number' ? (f.step === '0.1' ? num(e.target.value) : int(e.target.value)) : e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs font-medium"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827' }}
            />
          </div>
        ))}
      </div>

      {/* Rating Distribution */}
      <div className="mt-4">
        <label className="text-[10px] font-semibold uppercase tracking-wide block mb-2" style={{ color: '#9ca3af' }}>Rating Distribution</label>
        <div className="space-y-2">
          {data.ratingDistribution.map((r, i) => (
            <div key={r.stars} className="flex items-center gap-3 py-2 px-3 rounded-xl" style={{ background: '#f9fafb' }}>
              <span className="text-xs font-bold w-8 shrink-0" style={{ color: '#f59e0b' }}>{r.stars}★</span>
              <input type="range" min="0" max="100" value={r.pct}
                onChange={e => {
                  const updated = mut(data.ratingDistribution, i, 'pct', int(e.target.value));
                  set(store, 'ratingDistribution', updated);
                }}
                className="flex-1 h-1.5 rounded-full" style={{ accentColor: '#f59e0b' }} />
              <div className="flex items-center gap-1 w-24 shrink-0">
                <input type="number" min="0" max="100" value={r.pct}
                  onChange={e => {
                    const updated = mut(data.ratingDistribution, i, 'pct', int(e.target.value));
                    set(store, 'ratingDistribution', updated);
                  }}
                  className="w-full px-2 py-1.5 rounded-lg border text-xs text-center font-bold"
                  style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                <span className="text-xs shrink-0" style={{ color: '#9ca3af' }}>%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Admin Panel ─────────────────────────────────────────────────────────────

type Props = { data: FifgoData; onChange: (d: FifgoData) => void; onClose: () => void };

export function FifgoAdminPanel({ data, onChange, onClose }: Props) {
  const [editStore, setEditStore] = React.useState<'playstore' | 'appstore'>('playstore');

  const setStoreData = (store: 'playstore' | 'appstore', key: string, val: unknown) => {
    onChange({ ...data, [store]: { ...data[store], [key]: val } });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="ml-auto h-full overflow-y-auto bg-white flex flex-col"
        style={{ width: 560, maxWidth: '96vw', boxShadow: '-4px 0 40px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between shrink-0"
          style={{ background: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)' }}>
          <div>
            <h2 className="text-base font-extrabold text-white">⚙️ FIFGO — Admin Panel</h2>
            <p className="text-[10px] mt-0.5 text-white/60">Edit semua data · Tersimpan otomatis</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { if (confirm('Reset semua data ke default?')) { resetFifgoData(); onChange(DEFAULT_FIFGO); } }}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white/80 hover:text-white transition-all" style={{ background: 'rgba(255,255,255,15)' }}>
              Reset
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'rgba(255,255,255,15)' }}>
              ✕
            </button>
          </div>
        </div>

        {/* Store selector */}
        <div className="px-6 pt-4 pb-2 shrink-0" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="flex gap-2">
            {([
              { id: 'playstore', label: '▶️ Google Play Store', key: 'playstore' },
              { id: 'appstore', label: '🍎 Apple App Store', key: 'appstore' },
            ] as const).map(s => (
              <button
                key={s.id}
                onClick={() => setEditStore(s.id)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                style={editStore === s.id
                  ? { background: '#0e7490', color: '#fff' }
                  : { background: '#f3f4f6', color: '#6b7280' }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 space-y-8">

          {/* Per-store KPIs */}
          <StoreKPISection
            store={editStore}
            data={data[editStore]}
            set={setStoreData}
          />

          {/* ASO */}
          <section>
            <SectionTitle icon="🔍" label="ASO Score Breakdown" />
            <div className="space-y-3">
              {data.ascoreBreakdown.map((item, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <input value={item.label}
                      onChange={e => onChange({ ...data, ascoreBreakdown: mut(data.ascoreBreakdown, i, 'label', e.target.value) })}
                      className="flex-1 px-3 py-1.5 rounded-lg border text-xs font-bold" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                    <span className="text-[10px] px-2 py-1 rounded-lg shrink-0 font-semibold" style={{ background: '#e5e7eb', color: '#6b7280' }}>{item.weight}%</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="range" min="0" max="100" value={item.score}
                      onChange={e => onChange({ ...data, ascoreBreakdown: mut(data.ascoreBreakdown, i, 'score', int(e.target.value)) })}
                      className="flex-1 h-1.5 rounded-full" style={{ accentColor: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#dc2626' }} />
                    <input type="number" min="0" max="100" value={item.score}
                      onChange={e => onChange({ ...data, ascoreBreakdown: mut(data.ascoreBreakdown, i, 'score', int(e.target.value)) })}
                      className="w-14 px-2 py-1 rounded-lg border text-xs text-center font-bold" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  </div>
                  <input value={item.detail}
                    onChange={e => onChange({ ...data, ascoreBreakdown: mut(data.ascoreBreakdown, i, 'detail', e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#6b7280' }} />
                </div>
              ))}
            </div>
          </section>

          {/* Keywords */}
          <section>
            <SectionTitle icon="🔑" label="Keyword Rankings" />
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2 px-1">
                {['Keyword','Pos','Volume','Change', ''].map(h => (
                  <span key={h} className="text-[9px] font-semibold uppercase" style={{ color: '#9ca3af' }}>{h}</span>
                ))}
              </div>
              {data.keywords.map((kw, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-center rounded-xl px-3 py-2" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <input value={kw.keyword} onChange={e => onChange({ ...data, keywords: mut(data.keywords, i, 'keyword', e.target.value) })}
                    className="px-2 py-1.5 rounded-lg border text-xs w-full" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  <input type="number" min="1" value={kw.position}
                    onChange={e => onChange({ ...data, keywords: mut(data.keywords, i, 'position', int(e.target.value)) })}
                    className="px-2 py-1.5 rounded-lg border text-xs w-full text-center" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  <input value={kw.volume} onChange={e => onChange({ ...data, keywords: mut(data.keywords, i, 'volume', e.target.value) })}
                    className="px-2 py-1.5 rounded-lg border text-xs w-full" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  <input type="number" value={kw.change}
                    onChange={e => onChange({ ...data, keywords: mut(data.keywords, i, 'change', int(e.target.value)) })}
                    className="px-2 py-1.5 rounded-lg border text-xs w-full text-center" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  <button onClick={() => onChange({ ...data, keywords: data.keywords.filter((_, j) => j !== i) })}
                    className="text-red-400 hover:text-red-600 text-xs text-center" title="Remove">✕</button>
                </div>
              ))}
              <button onClick={() => onChange({ ...data, keywords: [...data.keywords, { keyword: '', position: 10, volume: '0', change: 0 }] })}
                className="w-full py-2 rounded-xl text-[11px] font-semibold" style={{ background: '#f0fdf4', color: '#10b981', border: '1px dashed #bbf7d0' }}>
                + Tambah Keyword
              </button>
            </div>
          </section>

          {/* Reviews */}
          <section>
            <SectionTitle icon="💬" label="Reviews" />
            <div className="space-y-3">
              {data.reviews.map((r, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <F label="Author">
                      <input value={r.author} onChange={e => onChange({ ...data, reviews: mut(data.reviews, i, 'author', e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border text-xs" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                    </F>
                    <F label="Rating">
                      <select value={r.rating} onChange={e => onChange({ ...data, reviews: mut(data.reviews, i, 'rating', int(e.target.value)) })}
                        className="w-full px-3 py-2 rounded-xl border text-xs" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }}>
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
                      </select>
                    </F>
                    <F label="Date">
                      <input value={r.date} onChange={e => onChange({ ...data, reviews: mut(data.reviews, i, 'date', e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border text-xs" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                    </F>
                  </div>
                  <F label="Review Text">
                    <textarea value={r.text} rows={2}
                      onChange={e => onChange({ ...data, reviews: mut(data.reviews, i, 'text', e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border text-xs resize-y" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  </F>
                </div>
              ))}
            </div>
          </section>

          {/* App Health */}
          <section>
            <SectionTitle icon="💚" label="App Health Metrics" />
            <div className="space-y-2">
              {data.appHealthMetrics.map((m, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <button
                    onClick={() => onChange({ ...data, appHealthMetrics: mut(data.appHealthMetrics, i, 'good', !m.good) })}
                    className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors"
                    style={{ background: m.good ? '#10b981' : '#d1d5db' }}
                  >
                    <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                      style={{ transform: m.good ? 'translateX(18px)' : 'translateX(3px)' }} />
                  </button>
                  <input value={m.label} onChange={e => onChange({ ...data, appHealthMetrics: mut(data.appHealthMetrics, i, 'label', e.target.value) })}
                    className="flex-1 px-3 py-1.5 rounded-lg border text-xs" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  <input value={m.value} onChange={e => onChange({ ...data, appHealthMetrics: mut(data.appHealthMetrics, i, 'value', e.target.value) })}
                    className="w-20 px-2 py-1.5 rounded-lg border text-xs text-center font-bold" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  <input value={m.target} onChange={e => onChange({ ...data, appHealthMetrics: mut(data.appHealthMetrics, i, 'target', e.target.value) })}
                    className="w-20 px-2 py-1.5 rounded-lg border text-xs text-center" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#6b7280' }} />
                </div>
              ))}
            </div>
          </section>

          {/* Issues */}
          <section>
            <SectionTitle icon="⚠️" label="Active Issues" />
            <div className="space-y-2">
              {data.issues.map((issue, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <F label="Severity">
                      <select value={issue.severity}
                        onChange={e => onChange({ ...data, issues: mut(data.issues, i, 'severity', e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border text-xs" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }}>
                        <option value="high">🔴 High</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                      </select>
                    </F>
                    <F label="Date">
                      <input value={issue.date} onChange={e => onChange({ ...data, issues: mut(data.issues, i, 'date', e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border text-xs" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                    </F>
                  </div>
                  <textarea value={issue.text} rows={2}
                    onChange={e => onChange({ ...data, issues: mut(data.issues, i, 'text', e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border text-xs resize-y" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                </div>
              ))}
              <button onClick={() => onChange({ ...data, issues: [...data.issues, { severity: 'medium', text: '', date: new Date().toLocaleDateString('id-ID') }] })}
                className="w-full py-2 rounded-xl text-[11px] font-semibold" style={{ background: '#f0fdf4', color: '#10b981', border: '1px dashed #bbf7d0' }}>
                + Tambah Issue
              </button>
            </div>
          </section>

          {/* Rating Trend */}
          <section>
            <SectionTitle icon="📈" label="Rating Trend" />
            <div className="grid grid-cols-2 gap-3">
              {data.ratingTrend.map((t, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <F label="Month">
                    <input value={t.period} onChange={e => onChange({ ...data, ratingTrend: mut(data.ratingTrend, i, 'period', e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border text-xs" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  </F>
                  <F label="Rating">
                    <input type="number" step="0.1" min="0" max="5" value={t.rating}
                      onChange={e => onChange({ ...data, ratingTrend: mut(data.ratingTrend, i, 'rating', num(e.target.value)) })}
                      className="w-full px-3 py-2 rounded-xl border text-xs font-bold" style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }} />
                  </F>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 px-6 py-3 flex items-center justify-between shrink-0 bg-white border-t border-gray-200">
          <p className="text-[10px]" style={{ color: '#9ca3af' }}>✅ Auto-save aktif — data tersimpan otomatis</p>
          <button onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #0e7490, #06b6d4)' }}>
            Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
