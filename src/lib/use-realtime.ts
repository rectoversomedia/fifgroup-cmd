import * as React from 'react';

export function useRealtime<T>(
  fetcher: () => Promise<T>,
  interval = 30_000
): { data: T | null; lastUpdated: Date | null; isLoading: boolean } {
  const [data, setData] = React.useState<T | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
          setLastUpdated(new Date());
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    const timer = setInterval(load, interval);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [fetcher, interval]);

  return { data, lastUpdated, isLoading };
}

export function useRealtimeRaw<T>(
  fetcher: () => Promise<T>,
  interval = 30_000
): T | null {
  const { data } = useRealtime(fetcher, interval);
  return data;
}
