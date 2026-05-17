import React from 'react';
import { LogEntry } from '../api/logApi';
import { LevelBadge } from './LevelBadge';

interface Props {
  log:      LogEntry | null;
  onClose:  () => void;
}

function Field({ label, value, mono = false, fullWidth = false }: {
  label: string; value: string | number | null | undefined;
  mono?: boolean; fullWidth?: boolean;
}) {
  if (value == null || value === '') return null;
  return (
    <div style={{
      background:   '#F1EFE8',
      borderRadius: '8px',
      padding:      '8px 10px',
      gridColumn:   fullWidth ? '1 / -1' : undefined,
    }}>
      <div style={{ fontSize: '10px', color: '#888780', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '12px', fontWeight: 500, color: '#2C2C2A', fontFamily: mono ? 'monospace' : undefined, wordBreak: 'break-all' }}>
        {String(value)}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ fontSize: '10px', fontWeight: 500, color: '#888780', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export function LogDetail({ log, onClose }: Props) {
  if (!log) return null;

  let parsedMeta: object | null = null;
  try { if (log.metadata) parsedMeta = JSON.parse(log.metadata); } catch {}

  return (
<div style={{
  flex:          1,
  display:       'flex',
  flexDirection: 'column',
  overflowY:     'auto',
  background:    'white',
}}>
      {/* Header */}
      <div style={{
        padding:       '12px 16px',
        borderBottom:  '0.5px solid #D3D1C7',
        display:       'flex',
        justifyContent:'space-between',
        alignItems:    'center',
        position:      'sticky',
        top:           0,
        background:    'white',
        zIndex:        1,
      }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#888780' }}>Log #{log.logEntryId}</span>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '18px', color: '#888780', lineHeight: 1, padding: '0 4px'
        }}>×</button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Overview */}
        <Section title="Overview">
          <div style={{ marginBottom: '4px' }}><LevelBadge level={log.levelName} /></div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#2C2C2A', lineHeight: 1.5 }}>
            {log.message}
          </div>
        </Section>

        {/* Request */}
        <Section title="Request">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <Field label="Timestamp"   value={new Date(log.timestamp).toLocaleString()} fullWidth />
            <Field label="Method"      value={log.httpMethod} />
            <Field label="Status"      value={log.statusCode} mono />
            <Field label="Duration"    value={log.durationMs != null ? `${log.durationMs} ms` : null} />
            <Field label="Path"        value={log.requestPath} mono fullWidth />
            <Field label="Source"      value={log.source} fullWidth />
            <Field label="IP Address"  value={log.ipAddress} mono />
            <Field label="Machine"     value={log.machineName} />
          </div>
        </Section>

        {/* Tracing */}
        <Section title="Tracing">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <Field label="CorrelationId" value={log.correlationId} mono fullWidth />
            <Field label="UserId"        value={log.userId}        mono fullWidth />
            <Field label="EventId"       value={log.eventId}       mono />
          </div>
        </Section>

        {/* Environment */}
        {(log.environment || log.applicationName) && (
          <Section title="Environment">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <Field label="Environment" value={log.environment} />
              <Field label="Application" value={log.applicationName} />
            </div>
          </Section>
        )}

        {/* Exception */}
        {log.exception && (
          <Section title="Exception">
            <div style={{
              background:   '#FCEBEB',
              borderRadius: '8px',
              padding:      '12px',
              borderLeft:   '2px solid #E24B4A',
            }}>
              <pre style={{
                fontFamily:  'monospace',
                fontSize:    '11px',
                color:       '#A32D2D',
                lineHeight:  1.6,
                whiteSpace:  'pre-wrap',
                wordBreak:   'break-all',
                margin:      0,
              }}>{log.exception}</pre>
            </div>
          </Section>
        )}

        {/* Metadata */}
        {log.metadata && (
          <Section title="Metadata">
            <div style={{
              background:   '#F1EFE8',
              borderRadius: '8px',
              padding:      '12px',
            }}>
              <pre style={{
                fontFamily:  'monospace',
                fontSize:    '11px',
                color:       '#2C2C2A',
                lineHeight:  1.6,
                whiteSpace:  'pre-wrap',
                margin:      0,
              }}>
                {parsedMeta ? JSON.stringify(parsedMeta, null, 2) : log.metadata}
              </pre>
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}
