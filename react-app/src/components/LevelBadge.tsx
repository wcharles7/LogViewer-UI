import React from 'react';

const LEVEL_STYLES: Record<string, React.CSSProperties> = {
  Error:       { background: '#FCEBEB', color: '#A32D2D', border: '0.5px solid #F09595' },
  Warning:     { background: '#FAEEDA', color: '#854F0B', border: '0.5px solid #FAC775' },
  Information: { background: '#E6F1FB', color: '#185FA5', border: '0.5px solid #85B7EB' },
  Debug:       { background: '#F1EFE8', color: '#5F5E5A', border: '0.5px solid #B4B2A9' },
};

interface Props { level: string; }

export function LevelBadge({ level }: Props) {
  const style = LEVEL_STYLES[level] ?? LEVEL_STYLES['Debug'];
  return (
    <span style={{
      ...style,
      display:      'inline-flex',
      alignItems:   'center',
      padding:      '2px 8px',
      borderRadius: '4px',
      fontSize:     '10px',
      fontWeight:   500,
      letterSpacing:'0.04em',
      whiteSpace:   'nowrap',
    }}>
      {level}
    </span>
  );
}
