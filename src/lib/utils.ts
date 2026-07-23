import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}K`;
  return `Rp ${amount}`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-rose-400';
}

export function getHealthColor(status: string): string {
  if (status === 'healthy' || status === 'on_track' || status === 'good') return 'bg-emerald-500';
  if (status === 'watch' || status === 'stable') return 'bg-amber-500';
  return 'bg-rose-500';
}

export function getTrendIcon(value: number): { icon: string; color: string } {
  if (value > 0) return { icon: 'up', color: 'text-emerald-400' };
  if (value < 0) return { icon: 'down', color: 'text-rose-400' };
  return { icon: 'neutral', color: 'text-slate-400' };
}
