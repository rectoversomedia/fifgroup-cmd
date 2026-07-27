import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    competitors: {
      fifgo: [
        { id: 'c1', app_id: 'fifgo', name: 'FIFGO', rank: 1, rank_change: 0, rating: 4.2, downloads: '850K', category: 'Finance', country: 'ID' },
        { id: 'c2', app_id: 'fifgo', name: 'CashCash', rank: 2, rank_change: 1, rating: 4.0, downloads: '720K', category: 'Finance', country: 'ID' },
        { id: 'c3', app_id: 'fifgo', name: 'EasyCash', rank: 3, rank_change: -1, rating: 3.9, downloads: '680K', category: 'Finance', country: 'ID' },
        { id: 'c4', app_id: 'fifgo', name: 'Duitku', rank: 4, rank_change: 0, rating: 3.8, downloads: '620K', category: 'Finance', country: 'ID' },
        { id: 'c5', app_id: 'fifgo', name: 'PinjolPro', rank: 5, rank_change: 2, rating: 3.7, downloads: '540K', category: 'Finance', country: 'ID' },
      ],
      fifada: [
        { id: 'c6', app_id: 'fifada', name: 'FIFADA', rank: 1, rank_change: 0, rating: 3.8, downloads: '210K', category: 'Finance', country: 'ID' },
        { id: 'c7', app_id: 'fifada', name: 'AstraPay', rank: 2, rank_change: 0, rating: 4.1, downloads: '890K', category: 'Finance', country: 'ID' },
        { id: 'c8', app_id: 'fifada', name: 'DanaSiap', rank: 3, rank_change: 1, rating: 3.9, downloads: '320K', category: 'Finance', country: 'ID' },
        { id: 'c9', app_id: 'fifada', name: 'KTAInstan', rank: 4, rank_change: -1, rating: 3.6, downloads: '280K', category: 'Finance', country: 'ID' },
      ],
    },
  };
  return NextResponse.json(data);
}
