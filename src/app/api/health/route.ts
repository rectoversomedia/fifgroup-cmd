import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    apps: [
      {
        id: 'fifgo',
        name: 'FIFGO',
        platform: 'android' as const,
        icon: 'https://play-lh.googleusercontent.com/placeholder/fifgo.png',
        rating: 4.2,
        rating_change: 0.1,
        downloads: '850K',
        downloads_change: 23,
        ascore: 78,
        ascore_change: 4,
        health_status: 'healthy' as const,
        alerts: 0,
        last_updated: new Date().toISOString(),
        country: 'ID',
        category: 'Finance',
      },
      {
        id: 'fifada',
        name: 'FIFADA',
        platform: 'android' as const,
        icon: 'https://play-lh.googleusercontent.com/placeholder/fifada.png',
        rating: 3.8,
        rating_change: -0.2,
        downloads: '210K',
        downloads_change: 3,
        ascore: 61,
        ascore_change: -2,
        health_status: 'watch' as const,
        alerts: 2,
        last_updated: new Date().toISOString(),
        country: 'ID',
        category: 'Finance',
      },
    ],
  };
  return NextResponse.json(data);
}
