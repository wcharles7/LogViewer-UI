import { useState, useEffect, useCallback, useRef } from 'react';
import { getLogs, getStats, getSources, LogEntry, LogPagedResponse, LogStats, LogQuery } from '../api/logApi';

export function useLogs(query: LogQuery) {
  const [data,    setData]    = useState<LogPagedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const result = await getLogs(query);
      setData(result);
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(query)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useStats() {
  const [stats,   setStats]   = useState<LogStats | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [s, src] = await Promise.all([getStats(), getSources()]);
      setStats(s);
      setSources(src);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, sources, loading, refetch: fetch };
}

export function useAutoRefresh(refetch: () => void, intervalMs = 10000) {
  useEffect(() => {
    const id = setInterval(refetch, intervalMs);
    return () => clearInterval(id);
  }, [refetch, intervalMs]);
}
