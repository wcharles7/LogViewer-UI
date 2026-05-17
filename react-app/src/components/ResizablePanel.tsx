import React, { useState, useCallback, useRef } from 'react';

interface Props {
  children:    React.ReactNode;
  defaultWidth?: number;
  minWidth?:   number;
  maxWidth?:   number;
}

export function ResizablePanel({
  children,
  defaultWidth = 400,
  minWidth     = 280,
  maxWidth     = 800,
}: Props) {
  const [width,     setWidth]     = useState(defaultWidth);
  const [dragging,  setDragging]  = useState(false);
  const startX     = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startX.current     = e.clientX;
    startWidth.current = width;
    setDragging(true);

    const onMouseMove = (e: MouseEvent) => {
      const delta    = startX.current - e.clientX;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth.current + delta));
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
  }, [width, minWidth, maxWidth]);

  return (
    <div style={{ display: 'flex', width, minWidth: width, flexShrink: 0 }}>

      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        style={{
          width:      '4px',
          cursor:     'col-resize',
          flexShrink: 0,
          background: dragging ? '#378ADD' : 'transparent',
          borderLeft: '0.5px solid #D3D1C7',
          transition: 'background 0.15s',
          userSelect: 'none',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#B5D4F4')}
        onMouseLeave={e => {
          if (!dragging) e.currentTarget.style.background = 'transparent';
        }}
      />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

    </div>
  );
}