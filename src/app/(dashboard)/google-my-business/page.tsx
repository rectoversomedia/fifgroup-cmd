'use client';

import * as React from 'react';
import {
  Star, Globe, MapPin, Phone,
  ChatCircle, MagnifyingGlass,
} from '@phosphor-icons/react';
import { useAuth } from '@/components/auth-provider';

const GMB_LOGO = 'https://www.google.com/favicon.ico';

type Review = {
  id: string;
  branch: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  responded: boolean;
};

type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  lastReview: string;
  status: 'open' | 'closed';
};

const MOCK_BRANCHES: Branch[] = [
  { id: '1', name: 'FIFGROUP Jakarta Pusat', address: 'Jl. Sudirman No. 28, Jakarta Pusat', phone: '(021) 5789-1234', rating: 4.5, reviewCount: 342, lastReview: '2 jam lalu', status: 'open' },
  { id: '2', name: 'FIFGROUP Bandung', address: 'Jl. Asia Afrika No. 45, Bandung', phone: '(022) 8456-7890', rating: 4.3, reviewCount: 218, lastReview: '5 jam lalu', status: 'open' },
  { id: '3', name: 'FIFGROUP Surabaya', address: 'Jl. Basuki Rahmat No. 12, Surabaya', phone: '(031) 5678-4321', rating: 4.6, reviewCount: 187, lastReview: '1 hari lalu', status: 'open' },
  { id: '4', name: 'FIFGROUP Medan', address: 'Jl. Merdeka No. 33, Medan', phone: '(061) 7890-1234', rating: 4.1, reviewCount: 124, lastReview: '2 hari lalu', status: 'open' },
  { id: '5', name: 'FIFGROUP Makassar', address: 'Jl. Pettarani No. 8, Makassar', phone: '(0411) 2345-6789', rating: 4.4, reviewCount: 156, lastReview: '3 hari lalu', status: 'closed' },
  { id: '6', name: 'FIFGROUP Semarang', address: 'Jl. Pandanaran No. 22, Semarang', phone: '(024) 8765-4321', rating: 4.2, reviewCount: 98, lastReview: '4 hari lalu', status: 'open' },
];

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', branch: 'FIFGROUP Jakarta Pusat', author: 'Andi Wijaya', rating: 5, date: '15 Aug 2026', text: 'Pelayanan sangat memuaskan! Staff ramah dan proses pengajuan cepat. Recommended untuk kredit mikro.', responded: true },
  { id: 'r2', branch: 'FIFGROUP Bandung', author: 'Sari Dewi', rating: 4, date: '14 Aug 2026', text: 'Aplikasi online-nya mudah digunakan. Tapi agak lama respon kalau via chat.', responded: false },
  { id: 'r3', branch: 'FIFGROUP Surabaya', author: 'Budi Santoso', rating: 5, date: '13 Aug 2026', text: 'Sudah 3x financing di FIFGROUP, selalu lancar. Bunga kompetitif dibanding kompetitor.', responded: true },
  { id: 'r4', branch: 'FIFGROUP Medan', author: 'Rina Amelia', rating: 3, date: '12 Aug 2026', text: 'Proses cukup lama dari pengajuan sampai pencairan. Semoga bisa lebih cepat ya.', responded: false },
  { id: 'r5', branch: 'FIFGROUP Makassar', author: 'Hendra Kusuma', rating: 4, date: '11 Aug 2026', text: 'Cabang baru tapi pelayanan sudah prima. Ruangan tunggu nyaman dan AC dingin.', responded: true },
];

const STORAGE_KEY = 'gmb_settings_v1';

function loadSettings() {
  if (typeof window === 'undefined') return { apiKey: '', actorId: '' };
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : { apiKey: '', actorId: '' };
  } catch (_) { return { apiKey: '', actorId: '' }; }
}

function saveSettings(s: { apiKey: string; actorId: string }) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (_) {}
}

export default function GoogleMyBusinessPage() {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = React.useState({ apiKey: '', actorId: '' });
  const [showSettings, setShowSettings] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setSettings(loadSettings());
    setMounted(true);
  }, []);

  const isConnected = settings.apiKey.trim() !== '' && settings.actorId.trim() !== '';

  const avgRating = MOCK_BRANCHES.reduce((a, b) => a + b.rating, 0) / MOCK_BRANCHES.length;
  const totalReviews = MOCK_BRANCHES.reduce((a, b) => a + b.reviewCount, 0);
  const unresponded = MOCK_REVIEWS.filter(r => !r.responded).length;

  const filteredBranches = MOCK_BRANCHES.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );

  const selectedBranchData = MOCK_BRANCHES.find(b => b.id === selectedBranch);
  const branchReviews = selectedBranch
    ? MOCK_REVIEWS.filter(r => r.branch === selectedBranchData?.name)
    : MOCK_REVIEWS;

  const connectedPanel = (
    <div className="space-y-5">

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cabang', value: MOCK_BRANCHES.length, icon: Globe, color: '#4285f4' },
          { label: 'Avg Rating', value: avgRating.toFixed(1) + '★', icon: Star, color: '#f59e0b' },
          { label: 'Total Reviews', value: totalReviews.toLocaleString(), icon: ChatCircle, color: '#10b981' },
          { label: 'Belum Dibalas', value: unresponded, icon: ChatCircle, color: '#ef4444' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${stat.color}15` }}>
              <stat.icon size={24} style={{ color: stat.color }} weight="fill" />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: '#111827' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Settings */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari cabang..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm"
            style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }}
          />
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all"
            style={{ border: '1px solid #e5e7eb', color: '#6b7280', background: '#fff' }}
          >
            ⚙️ API Settings
          </button>
        )}
      </div>

      {/* API Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>API Configuration</h3>
            <span className="text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: '#fef3c7', color: '#d97706' }}>Apify / Google API</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Apify API Key / Google API Key</label>
              <input
                value={settings.apiKey}
                onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
                placeholder="Aqw3kL9m... atau AIza..."
                className="w-full px-3 py-2.5 rounded-xl border text-xs font-mono"
                style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827' }}
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Location IDs (koma separated)</label>
              <input
                value={settings.actorId}
                onChange={e => setSettings(s => ({ ...s, actorId: e.target.value }))}
                placeholder="ChIJN1t4GKcBry... (opsional)"
                className="w-full px-3 py-2.5 rounded-xl border text-xs font-mono"
                style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { saveSettings(settings); setShowSettings(false); }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: '#4285f4' }}
            >
              Simpan
            </button>
            <button
              onClick={() => { saveSettings({ apiKey: '', actorId: '' }); }}
              className="px-4 py-2 rounded-xl text-xs font-semibold"
              style={{ color: '#ef4444', background: '#fef2f2' }}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Branch List + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Branch List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <p className="text-xs font-bold" style={{ color: '#374151' }}>📍 Daftar Cabang ({filteredBranches.length})</p>
          </div>
          <div className="divide-y" style={{ borderColor: '#f3f4f6' }}>
            {filteredBranches.map(branch => (
              <button
                key={branch.id}
                onClick={() => setSelectedBranch(branch.id === selectedBranch ? null : branch.id)}
                className="w-full text-left px-4 py-3 transition-all hover:bg-gray-50"
                style={{ background: selectedBranch === branch.id ? '#eff6ff' : 'transparent' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-xs font-semibold truncate" style={{ color: selectedBranch === branch.id ? '#1e3a5f' : '#111827' }}>{branch.name}</p>
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: branch.status === 'open' ? '#10b981' : '#9ca3af' }} />
                    </div>
                    <p className="text-[10px] truncate" style={{ color: '#9ca3af' }}><MapPin size={10} className="inline mr-0.5" />{branch.address}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}><Phone size={10} className="inline mr-0.5" />{branch.phone}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>★ {branch.rating}</p>
                    <p className="text-[10px]" style={{ color: '#9ca3af' }}>{branch.reviewCount} review</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <div>
              <p className="text-xs font-bold" style={{ color: '#374151' }}>💬 Reviews</p>
              <p className="text-[10px]" style={{ color: '#9ca3af' }}>
                {selectedBranch ? selectedBranchData?.name : 'Semua cabang'} · {branchReviews.length} review
              </p>
            </div>
            {unresponded > 0 && (
              <span className="text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: '#fef3c7', color: '#d97706' }}>
                ⚠️ {unresponded} belum dibalas
              </span>
            )}
          </div>
          <div className="divide-y max-h-[480px] overflow-y-auto" style={{ borderColor: '#f3f4f6' }}>
            {branchReviews.length === 0 ? (
              <div className="py-12 text-center">
                <ChatCircle size={32} className="mx-auto mb-2" style={{ color: '#e5e7eb' }} />
                <p className="text-xs" style={{ color: '#9ca3af' }}>Belum ada review</p>
              </div>
            ) : branchReviews.map(review => (
              <div key={review.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#1e3a5f' }}>
                      <span className="text-[10px] font-bold text-white">{review.author[0]}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#111827' }}>{review.author}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={10} weight={s <= review.rating ? 'fill' : 'regular'} style={{ color: '#f59e0b' }} />
                          ))}
                        </div>
                        <span className="text-[9px]" style={{ color: '#9ca3af' }}>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold shrink-0" style={{ background: review.responded ? '#d1fae5' : '#fef3c7', color: review.responded ? '#065f46' : '#d97706' }}>
                    {review.responded ? '✓ Dibalas' : '⚠️ Pending'}
                  </span>
                </div>
                <p className="text-[11px] ml-10" style={{ color: '#374151' }}>{review.text}</p>
                <div className="flex items-center gap-1 mt-1.5 ml-10">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                    📍 {review.branch}
                  </span>
                </div>
                {isAdmin && !review.responded && (
                  <button className="mt-2 ml-10 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-white" style={{ background: '#4285f4' }}>
                    Balas Review
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );

  const notConnectedPanel = (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#fef3c7' }}>
          <Globe size={40} style={{ color: '#f59e0b' }} />
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#111827' }}>Google My Business</h2>
        <p className="text-sm max-w-md mx-auto mb-6" style={{ color: '#6b7280' }}>
          Hubungkan Google Business Profile atau Apify untuk mengelola rating, review, dan info cabang FIFGROUP dari satu dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          <div className="text-left p-4 rounded-2xl" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: '#4285f4' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </div>
            <h3 className="text-sm font-bold mb-1" style={{ color: '#111827' }}>Google Business Profile API</h3>
            <p className="text-[11px] mb-2" style={{ color: '#6b7280' }}>Resmi dari Google. Butuh Business Profile Manager account.</p>
            <span className="text-[9px] px-2 py-1 rounded-full font-semibold" style={{ background: '#fee2e2', color: '#dc2626' }}>Butuh akun tambahan</span>
          </div>
          <div className="text-left p-4 rounded-2xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: '#10b981' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <h3 className="text-sm font-bold mb-1" style={{ color: '#111827' }}>Apify (Recommended)</h3>
            <p className="text-[11px] mb-2" style={{ color: '#6b7280' }}>Gak perlu akun Business Profile. Langsung jalan.</p>
            <span className="text-[9px] px-2 py-1 rounded-full font-semibold" style={{ background: '#d1fae5', color: '#065f46' }}>✅ Recommended</span>
          </div>
        </div>

        <div className="max-w-md mx-auto mb-6 space-y-3">
          <div className="text-left">
            <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Apify API Key / Google API Key</label>
            <input
              value={settings.apiKey}
              onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
              placeholder="Aqw3kL9m... atau AIza..."
              className="w-full px-3 py-2.5 rounded-xl border text-xs font-mono"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827' }}
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Location IDs (koma separated)</label>
            <input
              value={settings.actorId}
              onChange={e => setSettings(s => ({ ...s, actorId: e.target.value }))}
              placeholder="ChIJN1t4GKcBry... (opsional)"
              className="w-full px-3 py-2.5 rounded-xl border text-xs font-mono"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827' }}
            />
          </div>
        </div>
        <button
          onClick={() => { saveSettings(settings); }}
          className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: '#4285f4' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#3367d6')}
          onMouseLeave={e => (e.currentTarget.style.background = '#4285f4')}
        >
          Hubungkan
        </button>
        <p className="text-[10px] mt-3" style={{ color: '#9ca3af' }}>
          Credential tersimpan di browser ini saja. Tidak dikirim ke server manapun.
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm">
            <img src={GMB_LOGO} alt="Google" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: '#111827' }}>Google My Business</h1>
            <p className="text-xs" style={{ color: '#6b7280' }}>Kelola semua cabang FIFGROUP</p>
          </div>
        </div>
        {mounted && (
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: '#d1fae5', color: '#065f46' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                ● Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: '#fef3c7', color: '#d97706' }}>
                ⚠️ Belum terhubung
              </span>
            )}
          </div>
        )}
      </div>

      {mounted && (isConnected ? connectedPanel : notConnectedPanel)}
    </div>
  );
}
