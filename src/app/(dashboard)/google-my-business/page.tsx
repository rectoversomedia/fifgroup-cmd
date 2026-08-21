'use client';

import * as React from 'react';
import {
  Star, Globe, MapPin, Phone,
  ChatCircle, MagnifyingGlass, ArrowClockwise,
  ArrowRight, WarningCircle, CheckCircle, Clock, Cross,
} from '@phosphor-icons/react';
import { useAuth } from '@/components/auth-provider';

const GMB_LOGO = 'https://www.google.com/favicon.ico';
const STORAGE_KEY = 'gmb_places_api_key';

type GMBReview = {
  author: string;
  rating: number;
  text: string;
  date: string;
  relativeDate: string;
};

type GMBBranch = {
  placeId: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  reviews: GMBReview[];
  openingHours: string[];
  website: string;
  status: 'open' | 'closed' | 'unknown';
};

type GMBData = {
  branches: GMBBranch[];
  errors?: string[];
  fetchedAt: string;
};

function loadApiKey(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch (_) { return ''; }
}

function saveApiKey(key: string) {
  try { localStorage.setItem(STORAGE_KEY, key); } catch (_) {}
}

export default function GoogleMyBusinessPage() {
  const { isAdmin } = useAuth();
  const [apiKey, setApiKey] = React.useState('');
  const [showKey, setShowKey] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [mounted, setMounted] = React.useState(false);
  const [data, setData] = React.useState<GMBData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastFetch, setLastFetch] = React.useState<string | null>(null);

  React.useEffect(() => {
    const savedKey = loadApiKey();
    setApiKey(savedKey);
    setMounted(true);
  }, []);

  const fetchData = React.useCallback(async (key: string) => {
    if (!key.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/gmb?apiKey=${encodeURIComponent(key)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Request failed');
      }
      const json: GMBData = await res.json();
      setData(json);
      setLastFetch(new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta',
      }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (mounted && apiKey) fetchData(apiKey);
  }, [mounted, apiKey, fetchData]);

  const branches = data?.branches ?? [];
  const errors = data?.errors ?? [];
  const avgRating = branches.filter(b => b.rating > 0).length > 0
    ? branches.filter(b => b.rating > 0).reduce((a, b) => a + b.rating, 0) / branches.filter(b => b.rating > 0).length
    : 0;
  const totalReviews = branches.reduce((a, b) => a + b.reviewCount, 0);
  const unresponded = branches.reduce((a, b) => a + b.reviews.filter(r => r.text.length > 50).length, 0);

  const filteredBranches = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );

  const selectedBranchData = branches.find(b => b.placeId === selectedBranch);
  const branchReviews = selectedBranch
    ? selectedBranchData?.reviews ?? []
    : branches.flatMap(b => b.reviews.slice(0, 3)).slice(0, 20);

  const isConfigured = mounted && apiKey.trim() !== '';
  const isLoading = mounted && loading;

  const handleSaveKey = () => {
    saveApiKey(apiKey);
    setShowSettings(false);
    fetchData(apiKey);
  };

  const handleReset = () => {
    saveApiKey('');
    setApiKey('');
    setData(null);
    setError(null);
    setShowSettings(false);
  };

  const setupScreen = (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#fef3c7' }}>
          <Globe size={40} style={{ color: '#f59e0b' }} />
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#111827' }}>Google Places API</h2>
        <p className="text-sm max-w-md mx-auto mb-6" style={{ color: '#6b7280' }}>
          Masukkan Google Places API Key untuk menarik data rating, review, dan info cabang FIFGROUP langsung dari Google Maps.
        </p>

        <div className="max-w-md mx-auto mb-4 space-y-3 text-left">
          <div>
            <label className="text-[10px] font-semibold block mb-1" style={{ color: '#9ca3af' }}>Google Places API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2.5 rounded-xl border text-xs font-mono pr-16"
                style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827' }}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-2 py-1 rounded-lg"
                style={{ color: '#6b7280', background: '#e5e7eb' }}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveKey}
          disabled={!apiKey.trim()}
          className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
          style={{ background: '#4285f4' }}
        >
          Hubungkan
        </button>

        <div className="max-w-md mx-auto mt-6">
          <p className="text-[10px] font-semibold mb-2" style={{ color: '#374151' }}>Cara dapat API Key:</p>
          <div className="text-left space-y-1.5">
            {[
              ['1', 'Buka', 'https://console.cloud.google.com/apis/library/places-backend.googleapis.com'],
              ['2', 'Buat project GCP atau pilih existing', ''],
              ['3', 'Enable "Places API (New)"', ''],
              ['4', 'Buka Credentials → Create Credentials → API Key', ''],
              ['5', 'Copy API Key dan paste di atas', ''],
            ].map(([n, ...rest]) => (
              <p key={n} className="text-[10px] flex items-start gap-1.5" style={{ color: '#6b7280' }}>
                <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: '#e5e7eb', color: '#374151' }}>{n}</span>
                <span>{rest[0]}</span>
                {rest[1] && <a href={rest[1]} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#4285f4' }}>{rest[1]}</a>}
              </p>
            ))}
          </div>
        </div>

        <p className="text-[10px] mt-4" style={{ color: '#9ca3af' }}>
          API Key tersimpan di browser ini saja. Tidak dikirim ke server manapun.
        </p>
      </div>
    </div>
  );

  const dashboardPanel = (
    <div className="space-y-5">

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cabang', value: branches.length, icon: Globe, color: '#4285f4' },
          { label: 'Avg Rating', value: avgRating > 0 ? avgRating.toFixed(1) + '★' : '—', icon: Star, color: '#f59e0b' },
          { label: 'Total Reviews', value: totalReviews > 0 ? totalReviews.toLocaleString() : '—', icon: ChatCircle, color: '#10b981' },
          { label: 'Avg Reviews/Cabang', value: branches.length > 0 ? Math.round(totalReviews / branches.filter(b => b.reviewCount > 0).length || 0) : '—', icon: ChatCircle, color: '#8b5cf6' },
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

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari cabang..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm"
            style={{ background: '#fff', border: '1px solid #e5e7eb', color: '#111827' }}
          />
        </div>
        {lastFetch && (
          <div className="flex items-center gap-1.5 text-[10px]" style={{ color: '#9ca3af' }}>
            <Clock size={12} />
            Updated {lastFetch} WIB
          </div>
        )}
        <button
          onClick={() => fetchData(apiKey)}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50"
          style={{ border: '1px solid #e5e7eb', color: '#6b7280', background: '#fff' }}
        >
          <ArrowClockwise size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
        {isAdmin && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all"
            style={{ border: '1px solid #e5e7eb', color: '#6b7280', background: '#fff' }}
          >
            ⚙️ Settings
          </button>
        )}
      </div>

      {/* API Key Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold" style={{ color: '#111827' }}>Google Places API Key</h3>
            <button onClick={() => setShowSettings(false)} className="p-1 rounded-lg" style={{ color: '#9ca3af' }}>
              <Cross size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3 py-2.5 rounded-xl border text-xs font-mono"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb', color: '#111827' }}
            />
            <button onClick={() => setShowKey(!showKey)} className="px-3 py-2.5 rounded-xl text-xs" style={{ background: '#f3f4f6', color: '#6b7280' }}>
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSaveKey} className="px-4 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#4285f4' }}>
              Simpan
            </button>
            <button onClick={handleReset} className="px-4 py-2 rounded-xl text-xs font-semibold" style={{ color: '#ef4444', background: '#fef2f2' }}>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <WarningCircle size={20} style={{ color: '#ef4444' }} />
          <p className="text-xs" style={{ color: '#dc2626' }}>{error}</p>
          <button onClick={() => setError(null)} className="ml-auto"><Cross size={14} style={{ color: '#9ca3af' }} /></button>
        </div>
      )}

      {/* Data Notice */}
      {data && errors.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
          <WarningCircle size={20} style={{ color: '#f59e0b' }} />
          <p className="text-xs" style={{ color: '#92400e' }}>
            {errors.length} cabang tidak ditemukan di Google Maps. Data cabang lain tetap ditampilkan.
          </p>
        </div>
      )}

      {/* Branch List + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Branch List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <p className="text-xs font-bold" style={{ color: '#374151' }}>
              📍 Daftar Cabang ({filteredBranches.length})
            </p>
          </div>
          <div className="divide-y max-h-[420px] overflow-y-auto" style={{ borderColor: '#f3f4f6' }}>
            {isLoading ? (
              <div className="py-8 text-center">
                <ArrowClockwise size={20} className="animate-spin mx-auto mb-2" style={{ color: '#e5e7eb' }} />
                <p className="text-xs" style={{ color: '#9ca3af' }}>Memuat...</p>
              </div>
            ) : filteredBranches.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs" style={{ color: '#9ca3af' }}>Tidak ada cabang ditemukan</p>
              </div>
            ) : filteredBranches.map(branch => (
              <button
                key={branch.placeId}
                onClick={() => setSelectedBranch(branch.placeId === selectedBranch ? null : branch.placeId)}
                className="w-full text-left px-4 py-3 transition-all hover:bg-gray-50"
                style={{ background: selectedBranch === branch.placeId ? '#eff6ff' : 'transparent' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-xs font-semibold truncate" style={{ color: selectedBranch === branch.placeId ? '#1e3a5f' : '#111827' }}>{branch.name}</p>
                      {branch.status === 'open' && <span className="shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />}
                      {branch.status === 'closed' && <span className="shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: '#9ca3af' }} />}
                    </div>
                    <p className="text-[10px] truncate" style={{ color: '#9ca3af' }}>
                      <MapPin size={10} className="inline mr-0.5" />{branch.address}
                    </p>
                    {branch.phone && (
                      <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>
                        <Phone size={10} className="inline mr-0.5" />{branch.phone}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {branch.rating > 0 ? (
                      <>
                        <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>★ {branch.rating.toFixed(1)}</p>
                        <p className="text-[10px]" style={{ color: '#9ca3af' }}>{branch.reviewCount} review</p>
                      </>
                    ) : (
                      <span className="text-[10px]" style={{ color: '#d1d5db' }}>—</span>
                    )}
                  </div>
                </div>
                {branch.reviews.length > 0 && (
                  <p className="text-[9px] mt-1.5" style={{ color: '#6b7280' }}>
                    💬 {branch.reviews.length} review terlihat
                  </p>
                )}
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
            {!selectedBranch && branches.length > 0 && (
              <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                ↑ Pilih cabang di kiri untuk lihat detail
              </span>
            )}
          </div>
          <div className="divide-y max-h-[480px] overflow-y-auto" style={{ borderColor: '#f3f4f6' }}>
            {isLoading ? (
              <div className="py-12 text-center">
                <ArrowClockwise size={24} className="animate-spin mx-auto mb-2" style={{ color: '#e5e7eb' }} />
                <p className="text-xs" style={{ color: '#9ca3af' }}>Memuat reviews...</p>
              </div>
            ) : branchReviews.length === 0 ? (
              <div className="py-12 text-center">
                <ChatCircle size={32} className="mx-auto mb-2" style={{ color: '#e5e7eb' }} />
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  {selectedBranch ? 'Belum ada review untuk cabang ini' : 'Tidak ada review ditemukan'}
                </p>
              </div>
            ) : branchReviews.map((review, idx) => {
              const branchRef = branches.find(b => b.reviews.includes(review));
              return (
                <div key={idx} className="px-4 py-3">
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
                  </div>
                  {review.text && (
                    <p className="text-[11px] ml-10" style={{ color: '#374151' }}>{review.text}</p>
                  )}
                  {branchRef && (
                    <div className="flex items-center gap-1 mt-1.5 ml-10">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                        📍 {branchRef.name}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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
            {isConfigured ? (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: '#d1fae5', color: '#065f46' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                ● Google Places API Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: '#fef3c7', color: '#d97706' }}>
                ⚠️ Perlu setup API Key
              </span>
            )}
          </div>
        )}
      </div>

      {!mounted ? null : isConfigured ? dashboardPanel : setupScreen}
    </div>
  );
}
