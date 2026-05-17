import React, { useEffect, useRef } from 'react';
import { LogStats } from '../api/logApi';

interface Props {
  stats: LogStats;
}

export function ErrorChart({ stats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !stats.last24h.length) return;

    import('chart.js/auto').then(({ default: Chart }) => {
      if (chartRef.current) chartRef.current.destroy();

      const labels   = stats.last24h.map(h => h.hour);
      const errors   = stats.last24h.map(h => h.errors);
      const warnings = stats.last24h.map(h => h.warnings);

      chartRef.current = new Chart(canvasRef.current!, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label:           'Errors',
              data:            errors,
              backgroundColor: '#E24B4A',
              borderRadius:    3,
            },
            {
              label:           'Warnings',
              data:            warnings,
              backgroundColor: '#EF9F27',
              borderRadius:    3,
            }
          ]
        },
        options: {
          responsive:          true,
          maintainAspectRatio: false,
          interaction:         { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#2C2C2A',
              titleColor:      '#D3D1C7',
              bodyColor:       'white',
              padding:         10,
              cornerRadius:    6,
            }
          },
          scales: {
            x: {
              grid:  { display: false },
              ticks: { color: '#888780', font: { size: 10 }, maxTicksLimit: 12 }
            },
            y: {
              grid:        { color: '#F1EFE8' },
              ticks:       { color: '#888780', font: { size: 10 }, stepSize: 1 },
              beginAtZero: true,
            }
          }
        }
      });
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [stats.last24h]);

  const totalErrors   = stats.last24h.reduce((a, h) => a + h.errors,   0);
  const totalWarnings = stats.last24h.reduce((a, h) => a + h.warnings, 0);
  const peakHour      = stats.last24h.reduce((a, h) => h.errors > a.errors ? h : a, { hour: '—', errors: 0, warnings: 0 });

  return (
    <div style={{
      background:   'white',
      borderBottom: '0.5px solid #D3D1C7',
      padding:      '12px 16px',
      flexShrink:   0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#2C2C2A' }}>Errors & warnings — last 24h</span>
        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#888780' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#E24B4A', display: 'inline-block' }} />
            Errors
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#EF9F27', display: 'inline-block' }} />
            Warnings
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', height: '160px', marginBottom: '12px' }}>
        <canvas ref={canvasRef} />
      </div>

      {/* Mini stats */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { label: 'Total errors',   value: totalErrors,        color: '#A32D2D' },
          { label: 'Total warnings', value: totalWarnings,      color: '#854F0B' },
          { label: 'Peak errors',    value: peakHour.errors,    color: '#A32D2D' },
          { label: 'Peak hour',      value: peakHour.hour,      color: '#2C2C2A' },
        ].map(s => (
          <div key={s.label} style={{ background: '#F1EFE8', borderRadius: '8px', padding: '8px 12px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#888780', marginBottom: '2px' }}>{s.label}</div>
            <div style={{ fontSize: '18px', fontWeight: 500, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}