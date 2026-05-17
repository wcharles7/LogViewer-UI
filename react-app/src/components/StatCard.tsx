interface Props {
  label:    string;
  value:    number | string;
  color?:   string;
  active?:  boolean;
  onClick?: () => void;
}

export function StatCard({ label, value, color = '#2C2C2A', active = false, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background:   active ? '#E6F1FB' : '#F1EFE8',
        borderRadius: '8px',
        padding:      '12px 16px',
        minWidth:     '100px',
        cursor:       onClick ? 'pointer' : 'default',
        border:       active ? '1px solid #378ADD' : '1px solid transparent',
        transition:   'all 0.15s',
        userSelect:   'none',
      }}
    >
      <div style={{ fontSize: '11px', color: '#888780', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '22px', fontWeight: 500, color }}>{value}</div>
    </div>
  );
}