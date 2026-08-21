import { NextRequest, NextResponse } from 'next/server';

type BranchResult = {
  placeId: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  reviews: {
    author: string;
    rating: number;
    text: string;
    date: string;
    relativeDate: string;
  }[];
  openingHours: string[];
  website: string;
  status: 'open' | 'closed' | 'unknown';
};

type GMBResult = {
  branches: BranchResult[];
  fetchedAt: string;
};

// FIFGROUP branch data — placeIds should be filled with actual Google Maps place IDs
// To get placeIds: search the branch on Google Maps, copy the place ID from the URL
// e.g. https://www.google.com/maps/place/FIFGROUP+Jakarta+Pusat/@-6.1754,106.8249,...
// The placeId is the part after "place/": "ChIJ..."

const FIFGROUP_BRANCHES = [
  { name: 'FIFGROUP Jakarta Pusat', address: 'Jl. Sudirman No. 28, Jakarta Pusat', city: 'Jakarta Pusat' },
  { name: 'FIFGROUP Bandung', address: 'Jl. Asia Afrika No. 45, Bandung', city: 'Bandung' },
  { name: 'FIFGROUP Surabaya', address: 'Jl. Basuki Rahmat No. 12, Surabaya', city: 'Surabaya' },
  { name: 'FIFGROUP Medan', address: 'Jl. Merdeka No. 33, Medan', city: 'Medan' },
  { name: 'FIFGROUP Makassar', address: 'Jl. Pettarani No. 8, Makassar', city: 'Makassar' },
  { name: 'FIFGROUP Semarang', address: 'Jl. Pandanaran No. 22, Semarang', city: 'Semarang' },
];

async function fetchPlaceDetails(placeId: string, apiKey: string): Promise<Partial<BranchResult>> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,reviews,formatted_address,formatted_phone_number,opening_hours,website&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
    const data = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return {};
    }

    const r = data.result ?? {};
    return {
      placeId,
      name: r.name ?? '',
      address: r.formatted_address ?? '',
      phone: r.formatted_phone_number ?? '',
      rating: r.rating ?? 0,
      reviewCount: r.reviews ? r.reviews.length : 0,
      website: r.website ?? '',
      openingHours: r.opening_hours?.weekday_text ?? [],
      status: r.opening_hours?.open_now === true ? 'open' : r.opening_hours?.open_now === false ? 'closed' : 'unknown',
      reviews: (r.reviews ?? []).slice(0, 10).map((review: {
        author_name: string;
        rating: number;
        text: string;
        relative_time_description: string;
        time: number;
      }) => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        relativeDate: review.relative_time_description,
        date: new Date(review.time * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      })),
    };
  } catch {
    return {};
  }
}

async function searchPlace(query: string, apiKey: string): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data.status === 'OK' && data.results?.length > 0) {
      return data.results[0].place_id ?? null;
    }
  } catch { /* ignore */ }
  return null;
}

export async function GET(request: NextRequest) {
  const apiKey = request.nextUrl.searchParams.get('apiKey');
  const branchNamesParam = request.nextUrl.searchParams.get('branches');
  const mode = request.nextUrl.searchParams.get('mode') ?? 'details'; // 'search' or 'details'

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing apiKey parameter. Provide Google Places API key.' },
      { status: 400 }
    );
  }

  // If mode=search, just search for place IDs without fetching details
  if (mode === 'search') {
    const queries = branchNamesParam ? branchNamesParam.split(',') : FIFGROUP_BRANCHES.map(b => b.name);
    const results = await Promise.all(
      queries.map(async (q) => {
        const placeId = await searchPlace(q, apiKey);
        return { query: q, placeId };
      })
    );
    return NextResponse.json({ results, fetchedAt: new Date().toISOString() });
  }

  // Default: details mode — fetch full details for each branch
  const branchesToFetch = FIFGROUP_BRANCHES;
  const branches: BranchResult[] = [];
  const errors: string[] = [];

  for (const branch of branchesToFetch) {
    // Try to find the place
    let placeId: string | null = null;

    // Try direct place ID search first
    placeId = await searchPlace(`${branch.name} ${branch.address}`, apiKey);

    if (!placeId) {
      // Try without address
      placeId = await searchPlace(branch.name, apiKey);
    }

    if (!placeId) {
      errors.push(`No place found for: ${branch.name}`);
      branches.push({
        placeId: '',
        name: branch.name,
        address: branch.address,
        phone: '',
        rating: 0,
        reviewCount: 0,
        reviews: [],
        openingHours: [],
        website: '',
        status: 'unknown',
      });
      continue;
    }

    const details = await fetchPlaceDetails(placeId, apiKey);
    branches.push({
      placeId,
      name: details.name ?? branch.name,
      address: details.address ?? branch.address,
      phone: details.phone ?? '',
      rating: details.rating ?? 0,
      reviewCount: details.reviewCount ?? 0,
      reviews: details.reviews ?? [],
      openingHours: details.openingHours ?? [],
      website: details.website ?? '',
      status: details.status ?? 'unknown',
    });
  }

  return NextResponse.json({
    branches,
    errors: errors.length > 0 ? errors : undefined,
    fetchedAt: new Date().toISOString(),
  } as GMBResult);
}
