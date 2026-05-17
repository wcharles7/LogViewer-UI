import React from 'react';

interface Props {
  page:     number;
  pages:    number;
  total:    number;
  pageSize: number;
  onChange: (page: number) => void;
}

const btnStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
  padding:      '4px 10px',
  fontSize:     '12px',
  borderRadius: '6px',
  border:       '0.5px solid #D3D1C7',
  background:   active ? '#2C2C2A' : disabled ? '#F1EFE8' : 'white',
  color:        active ? 'white' : disabled ? '#B4B2A9' : '#2C2C2A',
  cursor:       disabled ? 'not-allowed' : 'pointer',
});

export function Pagination({ page, pages, total, pageSize, onChange }: Props) {
  if (pages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  const pageNums: (number | '...')[] = [];
  if (pages <= 7) {
    for (let i = 1; i <= pages; i++) pageNums.push(i);
  } else {
    pageNums.push(1);
    if (page > 3) pageNums.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) pageNums.push(i);
    if (page < pages - 2) pageNums.push('...');
    pageNums.push(pages);
  }

  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      gap:            '6px',
      padding:        '10px 16px',
      borderTop:      '0.5px solid #D3D1C7',
      background:     'white',
      justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: '11px', color: '#888780' }}>
        {from}–{to} of {total} logs
      </span>

      <div style={{ display: 'flex', gap: '4px' }}>
        <button style={btnStyle(false, page === 1)} disabled={page === 1} onClick={() => onChange(page - 1)}>←</button>

        {pageNums.map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} style={{ padding: '4px 6px', fontSize: '12px', color: '#888780' }}>…</span>
            : <button key={p} style={btnStyle(p === page, false)} onClick={() => onChange(p as number)}>{p}</button>
        )}

        <button style={btnStyle(false, page === pages)} disabled={page === pages} onClick={() => onChange(page + 1)}>→</button>
      </div>
    </div>
  );
}
