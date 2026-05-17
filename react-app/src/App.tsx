import React, { useState, useCallback } from 'react';
import { LogEntry, LogQuery } from './api/logApi';
import { useLogs, useStats, useAutoRefresh } from './hooks/useLogs';
import { FiltersBar }  from './components/FiltersBar';
import { LogTable }    from './components/LogTable';
import { LogDetail }   from './components/LogDetail';
import { StatCard }    from './components/StatCard';
import { Pagination }  from './components/Pagination';
import { ResizablePanel } from './components/ResizablePanel';
import { ErrorChart } from './components/ErrorChart';

export default function App() {
  const [query,    setQuery]    = useState<LogQuery>({ page: 1, pageSize: 50 });
  const [selected, setSelected] = useState<LogEntry | null>(null);

  const { data, loading, error, refetch } = useLogs(query);
  const { stats, sources, refetch: refetchStats } = useStats(); // ← récupérer refetch

  // ✅ Refetch les deux en même temps
  const refetchAll = useCallback(() => {
    refetch();
    refetchStats();
  }, [refetch, refetchStats]);
  useAutoRefresh(refetchAll, 15000);

  const handleSelect = useCallback((log: LogEntry) => {
    setSelected(prev => prev?.logEntryId === log.logEntryId ? null : log);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setQuery(q => ({ ...q, page }));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'monospace', background: '#F1EFE8' }}>

      {/* Top bar */}
      <div style={{
        display:     'flex',
        alignItems:  'center',
        gap:         '12px',
        padding:     '10px 20px',
        background:  '#2C2C2A',
        color:       'white',
        flexShrink:  0,
      }}>
        <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em' }}>LOG VIEWER</span>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#1D9E75',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{ fontSize: '11px', color: '#888780', marginLeft: 'auto' }}>
          Auto-refresh every 15s
        </span>
        {loading && <span style={{ fontSize: '11px', color: '#EF9F27' }}>Loading...</span>}
      </div>

      {/* Stats bar */}
{stats && (
  <div style={{ display: 'flex', gap: '10px', padding: '10px 16px', background: 'white', borderBottom: '0.5px solid #D3D1C7', flexShrink: 0 }}>
    <StatCard
      label="Total"
      value={stats.totalCount}
      color="#2C2C2A"
      active={!query.levelName}
      onClick={() => setQuery(q => ({ ...q, levelName: undefined, page: 1 }))}
    />
    <StatCard
      label="Errors"
      value={stats.errorCount}
      color="#A32D2D"
      active={query.levelName === 'Error'}
      onClick={() => setQuery(q => ({ ...q, levelName: q.levelName === 'Error' ? undefined : 'Error', page: 1 }))}
    />
    <StatCard
      label="Warnings"
      value={stats.warningCount}
      color="#854F0B"
      active={query.levelName === 'Warning'}
      onClick={() => setQuery(q => ({ ...q, levelName: q.levelName === 'Warning' ? undefined : 'Warning', page: 1 }))}
    />
    <StatCard
      label="Info"
      value={stats.infoCount}
      color="#185FA5"
      active={query.levelName === 'Information'}
      onClick={() => setQuery(q => ({ ...q, levelName: q.levelName === 'Information' ? undefined : 'Information', page: 1 }))}
    />
  </div>
)}

      {/* Filters */}
      <FiltersBar query={query} sources={sources} onChange={setQuery} />

      {/* Error state */}
      {error && (
        <div style={{ padding: '16px', background: '#FCEBEB', color: '#A32D2D', fontSize: '13px', borderBottom: '0.5px solid #F09595' }}>
          Failed to connect to API: {error}. Make sure your .NET API is running .
        </div>
      )}

      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Table pane */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', background: 'white' }}>
            <LogTable
              logs={data?.data ?? []}
              selectedId={selected?.logEntryId ?? null}
              onSelect={handleSelect}
            />
          </div>

          {data && (
            <Pagination
              page={data.page}
              pages={data.pages}
              total={data.total}
              pageSize={data.pageSize}
              onChange={handlePageChange}
            />
          )}
        </div>

        {/* Detail pane */}
{selected && (
  <ResizablePanel defaultWidth={400} minWidth={280} maxWidth={800}>
    <LogDetail log={selected} onClose={() => setSelected(null)} />
  </ResizablePanel>
)}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D3D1C7; border-radius: 3px; }
      `}</style>
    </div>
  );
}
