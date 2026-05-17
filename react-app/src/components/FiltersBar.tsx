import React from 'react';
import { LogQuery } from '../api/logApi';

interface Props {
  query:    LogQuery;
  sources:  string[];
  onChange: (q: LogQuery) => void;
}

const inputStyle: React.CSSProperties = {
  fontSize:     '12px',
  padding:      '5px 10px',
  height:       '30px',
  borderRadius: '8px',
  border:       '0.5px solid #D3D1C7',
  background:   '#F1EFE8',
  color:        '#2C2C2A',
  outline:      'none',
};

export function FiltersBar({ query, sources, onChange }: Props) {
  const set = (key: keyof LogQuery, value: string) =>
    onChange({ ...query, [key]: value || undefined, page: 1 });

  return (
    <div style={{
      display:    'flex',
      gap:        '8px',
      padding:    '10px 16px',
      background: 'white',
      borderBottom: '0.5px solid #D3D1C7',
      flexWrap:   'wrap',
      alignItems: 'center',
    }}>
      {/* Search */}
      <input
        style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
        placeholder="Search message, exception, source..."
        value={query.search ?? ''}
        onChange={e => set('search', e.target.value)}
      />

      {/* Level */}
      <select style={inputStyle} value={query.levelName ?? ''} onChange={e => set('levelName', e.target.value)}>
        <option value="">All levels</option>
        <option value="Error">Error</option>
        <option value="Warning">Warning</option>
        <option value="Information">Information</option>
        <option value="Debug">Debug</option>
      </select>

      {/* Source */}
      <select style={inputStyle} value={query.source ?? ''} onChange={e => set('source', e.target.value)}>
        <option value="">All sources</option>
        {sources.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Method */}
      <select style={inputStyle} value={query.httpMethod ?? ''} onChange={e => set('httpMethod', e.target.value)}>
        <option value="">All methods</option>
        {['GET','POST','PUT','DELETE','PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      {/* CorrelationId */}
      <input
        style={{ ...inputStyle, width: '200px' }}
        placeholder="CorrelationId..."
        value={query.correlationId ?? ''}
        onChange={e => set('correlationId', e.target.value)}
      />

      {/* Date From */}
      <input
        type="datetime-local"
        style={{ ...inputStyle, width: '180px' }}
        value={query.dateFrom ?? ''}
        onChange={e => set('dateFrom', e.target.value)}
      />

      {/* Date To */}
      <input
        type="datetime-local"
        style={{ ...inputStyle, width: '180px' }}
        value={query.dateTo ?? ''}
        onChange={e => set('dateTo', e.target.value)}
      />
    </div>
  );
}
