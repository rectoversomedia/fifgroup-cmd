'use client';

import * as React from 'react';

export type FifgoData = {
  rating: number;
  downloads: string;
  downloadsChange: string;
  asoScore: number;
  activeUsers: string;
  activeUsersChange: string;
  ratingDistribution: { stars: number; pct: number }[];
  totalReviews: string;
  lobs: { name: string; pct: number; users: string; status: string; color: string }[];
  ascoreBreakdown: { label: string; score: number; weight: number; detail: string }[];
  keywords: { keyword: string; position: number; volume: string; change: number }[];
  reviews: { author: string; rating: number; date: string; text: string }[];
  appHealthMetrics: { label: string; value: string; target: string; good: boolean }[];
  issues: { severity: 'high' | 'medium' | 'low'; text: string; date: string }[];
  ratingTrend: { period: string; rating: number }[];
};

const DEFAULT_FIFGO: FifgoData = {
  rating: 4.2,
  downloads: '850K',
  downloadsChange: '+23%',
  asoScore: 78,
  activeUsers: '234K',
  activeUsersChange: '+15%',
  ratingDistribution: [
    { stars: 5, pct: 68 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 8 },
    { stars: 2, pct: 4 },
    { stars: 1, pct: 2 },
  ],
  totalReviews: '12,847',
  lobs: [
    { name: 'FIFASTRA', pct: 72, users: '168K', status: 'On Track', color: '#4f8ef7' },
    { name: 'SPEKTRA', pct: 28, users: '65K', status: 'Below Target', color: '#f97316' },
    { name: 'DANASTRA', pct: 61, users: '142K', status: 'Growing', color: '#06b6d4' },
    { name: 'FINATRA', pct: 45, users: '105K', status: 'Stable', color: '#f59e0b' },
    { name: 'AMITRA', pct: 52, users: '121K', status: 'Growing', color: '#10b981' },
  ],
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
    { author: 'Andi S.', rating: 5, date: '2 Jul 2026', text: 'Sangat mudah pengajuannya, dana langsung cair dalam 10 menit. 推荐!' },
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
    { period: 'Mar', rating: 4.0 },
    { period: 'Apr', rating: 4.1 },
    { period: 'May', rating: 4.1 },
    { period: 'Jun', rating: 4.2 },
    { period: 'Jul', rating: 4.2 },
  ],
};

const STORAGE_KEY = 'fifgo_admin_data';

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

type EditableFieldProps = {
  value: string | number;
  onChange: (v: string) => void;
  type?: 'text' | 'number';
  className?: string;
};

function EditableField({ value, onChange, type = 'text', className = '' }: EditableFieldProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value));
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { setDraft(String(value)); }, [value]);

  const commit = () => {
    setEditing(false);
    onChange(type === 'number' ? (isNaN(Number(draft)) ? String(value) : draft) : draft);
  };

  if (!editing) {
    return (
      <span
        onClick={() => { setEditing(true); setDraft(String(value)); setTimeout(() => ref.current?.select(), 50); }}
        className={`cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-1 rounded inline-block ${className}`}
        title="Click to edit"
      >
        {value}
      </span>
    );
  }

  return (
    <input
      ref={ref}
      autoFocus
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setDraft(String(value)); } }}
      type={type}
      className={`px-1 py-0.5 border border-blue-400 rounded bg-white text-inherit w-full text-center text-xs ${className}`}
    />
  );
}

type FifgoAdminPanelProps = {
  data: FifgoData;
  onChange: (data: FifgoData) => void;
  onClose: () => void;
};

export function FifgoAdminPanel({ data, onChange, onClose }: FifgoAdminPanelProps) {
  const set = <K extends keyof FifgoData>(key: K, value: FifgoData[K]) =>
    onChange({ ...data, [key]: value });

  const setField = (objKey: keyof FifgoData, idx: number, field: string, val: any) => {
    const updated = [...(data[objKey] as any[])] as any[];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, [objKey]: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div
        className="h-full w-[480px] bg-white shadow-2xl overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <div>
            <h2 className="text-sm font-bold" style={{ color: '#111827' }}>FIFGO Admin — Edit Data</h2>
            <p className="text-[10px]" style={{ color: '#9ca3af' }}>Klik teks untuk edit · Enter untuk simpan</p>
          </div>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#f3f4f6', color: '#374151' }}>
            ✕ Close
          </button>
        </div>

        <div className="p-4 space-y-5">

          {/* KPIs */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>📊 KPIs</h3>
            <div className="space-y-2">
              {[
                { label: 'Rating', key: 'rating', type: 'number' as const },
                { label: 'Downloads', key: 'downloads', type: 'text' as const },
                { label: 'Downloads Change', key: 'downloadsChange', type: 'text' as const },
                { label: 'ASO Score', key: 'asoScore', type: 'number' as const },
                { label: 'Active Users', key: 'activeUsers', type: 'text' as const },
                { label: 'Active Users Change', key: 'activeUsersChange', type: 'text' as const },
              ].map(f => (
                <div key={f.key} className="flex items-center gap-2">
                  <span className="text-xs w-32 shrink-0" style={{ color: '#6b7280' }}>{f.label}</span>
                  <EditableField
                    type={f.type}
                    value={(data as any)[f.key]}
                    onChange={v => set(f.key as keyof FifgoData, (f.type === 'number' ? Number(v) : v) as any)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Rating Distribution */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>⭐ Rating Distribution</h3>
            <div className="space-y-2">
              {data.ratingDistribution.map((r, i) => (
                <div key={r.stars} className="flex items-center gap-2">
                  <span className="text-xs w-10 shrink-0" style={{ color: '#6b7280' }}>{r.stars}★</span>
                  <EditableField type="number" value={r.pct} onChange={v => setField('ratingDistribution', i, 'pct', Number(v))} />
                  <span className="text-xs" style={{ color: '#9ca3af' }}>%</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs w-32 shrink-0" style={{ color: '#6b7280' }}>Total Reviews</span>
                <EditableField type="text" value={data.totalReviews} onChange={v => set('totalReviews', v)} />
              </div>
            </div>
          </section>

          {/* LoBs */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>🏦 LoBs Inside FIFGO</h3>
            <div className="space-y-3">
              {data.lobs.map((lob, i) => (
                <div key={lob.name} className="rounded-xl p-3" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: '#111827' }}>{lob.name}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Pct', field: 'pct', type: 'number' as const },
                      { label: 'Users', field: 'users', type: 'text' as const },
                      { label: 'Status', field: 'status', type: 'text' as const },
                    ].map(f => (
                      <div key={f.field}>
                        <span className="text-[9px]" style={{ color: '#9ca3af' }}>{f.label}</span>
                        <EditableField type={f.type} value={(lob as any)[f.field]} onChange={v => setField('lobs', i, f.field, f.type === 'number' ? Number(v) : v)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ASO Breakdown */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>🔍 ASO Breakdown</h3>
            <div className="space-y-3">
              {data.ascoreBreakdown.map((item, i) => (
                <div key={item.label} className="rounded-xl p-3" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <EditableField type="text" value={item.label} onChange={v => setField('ascoreBreakdown', i, 'label', v)} className="font-bold text-xs" />
                    <span className="text-[9px] px-1 rounded" style={{ background: '#e5e7eb', color: '#6b7280' }}>{item.weight}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px]" style={{ color: '#9ca3af' }}>Score</span>
                      <EditableField type="number" value={item.score} onChange={v => setField('ascoreBreakdown', i, 'score', Number(v))} />
                    </div>
                    <div>
                      <span className="text-[9px]" style={{ color: '#9ca3af' }}>Detail</span>
                      <EditableField type="text" value={item.detail} onChange={v => setField('ascoreBreakdown', i, 'detail', v)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Keywords */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>🔑 Keyword Rankings</h3>
            <div className="space-y-2">
              {data.keywords.map((kw, i) => (
                <div key={kw.keyword} className="rounded-xl p-2 grid grid-cols-4 gap-2 items-center" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <EditableField type="text" value={kw.keyword} onChange={v => setField('keywords', i, 'keyword', v)} className="font-medium text-xs" />
                  <div>
                    <span className="text-[9px]" style={{ color: '#9ca3af' }}>Pos</span>
                    <EditableField type="number" value={kw.position} onChange={v => setField('keywords', i, 'position', Number(v))} />
                  </div>
                  <div>
                    <span className="text-[9px]" style={{ color: '#9ca3af' }}>Volume</span>
                    <EditableField type="text" value={kw.volume} onChange={v => setField('keywords', i, 'volume', v)} />
                  </div>
                  <div>
                    <span className="text-[9px]" style={{ color: '#9ca3af' }}>Change</span>
                    <EditableField type="number" value={kw.change} onChange={v => setField('keywords', i, 'change', Number(v))} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>💬 Reviews</h3>
            <div className="space-y-3">
              {data.reviews.map((r, i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div>
                      <span className="text-[9px]" style={{ color: '#9ca3af' }}>Author</span>
                      <EditableField type="text" value={r.author} onChange={v => setField('reviews', i, 'author', v)} />
                    </div>
                    <div>
                      <span className="text-[9px]" style={{ color: '#9ca3af' }}>Rating</span>
                      <EditableField type="number" value={r.rating} onChange={v => setField('reviews', i, 'rating', Number(v))} />
                    </div>
                    <div>
                      <span className="text-[9px]" style={{ color: '#9ca3af' }}>Date</span>
                      <EditableField type="text" value={r.date} onChange={v => setField('reviews', i, 'date', v)} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px]" style={{ color: '#9ca3af' }}>Text</span>
                    <EditableField type="text" value={r.text} onChange={v => setField('reviews', i, 'text', v)} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* App Health */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>💚 App Health Metrics</h3>
            <div className="space-y-2">
              {data.appHealthMetrics.map((m, i) => (
                <div key={m.label} className="rounded-xl p-3 grid grid-cols-3 gap-2 items-center" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <EditableField type="text" value={m.label} onChange={v => setField('appHealthMetrics', i, 'label', v)} className="font-medium text-xs" />
                  <div>
                    <span className="text-[9px]" style={{ color: '#9ca3af' }}>Value</span>
                    <EditableField type="text" value={m.value} onChange={v => setField('appHealthMetrics', i, 'value', v)} />
                  </div>
                  <div>
                    <span className="text-[9px]" style={{ color: '#9ca3af' }}>Good?</span>
                    <select
                      value={String(m.good)}
                      onChange={e => setField('appHealthMetrics', i, 'good', e.target.value === 'true')}
                      className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs"
                    >
                      <option value="true">✓ Good</option>
                      <option value="false">✗ Bad</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Issues */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>⚠️ Issues</h3>
            <div className="space-y-2">
              {data.issues.map((issue, i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-[9px]" style={{ color: '#9ca3af' }}>Severity</span>
                      <select
                        value={issue.severity}
                        onChange={e => setField('issues', i, 'severity', e.target.value as 'high' | 'medium' | 'low')}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs"
                      >
                        <option value="high">high</option>
                        <option value="medium">medium</option>
                        <option value="low">low</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[9px]" style={{ color: '#9ca3af' }}>Date</span>
                      <EditableField type="text" value={issue.date} onChange={v => setField('issues', i, 'date', v)} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px]" style={{ color: '#9ca3af' }}>Text</span>
                    <EditableField type="text" value={issue.text} onChange={v => setField('issues', i, 'text', v)} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Rating Trend */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#6b7280' }}>📈 Rating Trend</h3>
            <div className="space-y-2">
              {data.ratingTrend.map((t, i) => (
                <div key={t.period} className="flex items-center gap-2">
                  <EditableField type="text" value={t.period} onChange={v => setField('ratingTrend', i, 'period', v)} className="w-16 shrink-0" />
                  <span className="text-xs shrink-0">Rating</span>
                  <EditableField type="number" value={t.rating} onChange={v => setField('ratingTrend', i, 'rating', Number(v))} />
                </div>
              ))}
            </div>
          </section>

          {/* Reset */}
          <section className="pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
            <button
              onClick={() => { if (confirm('Reset all FIFGO data to defaults?')) { resetFifgoData(); onChange(DEFAULT_FIFGO); } }}
              className="w-full py-2.5 rounded-xl text-xs font-bold"
              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
            >
              🗑 Reset to Default Data
            </button>
            <p className="text-[10px] text-center mt-1" style={{ color: '#9ca3af' }}>
              Changes saved automatically to browser localStorage
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
