import React from 'react';
import { LogEntry } from '../api/logApi';
import { LevelBadge } from './LevelBadge';

interface Props {
  logs:       LogEntry[];
  selectedId: number | null;
  onSelect:   (log: LogEntry) => void;
}

export function LogTable({ logs, selectedId, onSelect }: Props) {
  if (!logs.length) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#888780', fontSize: '13px' }}>
        No logs match your filters.
      </div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
      <thead>
        <tr style={{ position: 'sticky', top: 0, zIndex: 2, background: '#F1EFE8' }}>
          {['Timestamp', 'Level', 'Message', 'Source', 'Method', 'Status', 'Duration'].map(h => (
            <th key={h} style={{
              padding:     '8px 12px',
              textAlign:   'left',
              fontSize:    '11px',
              fontWeight:  500,
              color:       '#888780',
              borderBottom:'0.5px solid #D3D1C7',
              whiteSpace:  'nowrap',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <tr
            key={log.logEntryId}
            onClick={() => onSelect(log)}
            style={{
              cursor:      'pointer',
              borderBottom:'0.5px solid #D3D1C7',
              background:  selectedId === log.logEntryId ? '#E6F1FB' : 'white',
              transition:  'background 0.1s',
            }}
            onMouseEnter={e => {
              if (selectedId !== log.logEntryId)
                (e.currentTarget as HTMLTableRowElement).style.background = '#F1EFE8';
            }}
            onMouseLeave={e => {
              if (selectedId !== log.logEntryId)
                (e.currentTarget as HTMLTableRowElement).style.background = 'white';
            }}
          >
            <td style={{ padding: '7px 12px', color: '#888780', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
              {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })}
            </td>
            <td style={{ padding: '7px 12px' }}>
              <LevelBadge level={log.levelName} />
            </td>
            <td style={{ padding: '7px 12px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={log.message}>
              {log.message}
            </td>
            <td style={{ padding: '7px 12px', color: '#5F5E5A', fontSize: '11px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={log.source ?? ''}>
              {log.source ?? '—'}
            </td>
            <td style={{ padding: '7px 12px', color: '#888780', fontSize: '11px' }}>
              {log.httpMethod ?? '—'}
            </td>
            <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: '11px',
              color: log.statusCode && log.statusCode >= 500 ? '#A32D2D'
                   : log.statusCode && log.statusCode >= 400 ? '#854F0B'
                   : '#3B6D11' }}>
              {log.statusCode ?? '—'}
            </td>
            <td style={{ padding: '7px 12px', color: '#888780', fontSize: '11px', whiteSpace: 'nowrap' }}>
              {log.durationMs != null ? `${log.durationMs}ms` : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
