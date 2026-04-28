import React from 'react';
import { useWindowDrag } from '../../hooks/useWindowDrag';
import { useWindowResize } from '../../hooks/useWindowResize';

export default function WeatherWidget() {
  const { position, isDragging, handlePointerDown: dragStart } = useWindowDrag({ x: 24, y: 40 });
  const { size, isResizing, handleResizeStart } = useWindowResize(160, 160, 120, 120);

  // We explicitly bind width and height to the resize hook's width 
  // to seamlessly enforce a 1:1 aspect ratio.
  const w = size.width;
  const scale = w / 160;

  // Dynamic Temperature Logic
  // getMonth() returns 0-11 (April is 3, October is 9)
  const currentMonth = new Date().getMonth();
  const isSummer = currentMonth >= 3 && currentMonth <= 9;
  
  const currentTemp = isSummer ? 36 : 26;
  const highTemp = isSummer ? 37 : 28;
  const lowTemp = isSummer ? 28 : 21;

  return (
    <div
      className="absolute rounded-3xl shadow-xl overflow-hidden select-none z-10 bg-gradient-to-br from-[#4A8AD4] to-[#2B60AC] text-white"
      style={{
        left: position.x,
        top: position.y,
        width: w,
        height: w,
        cursor: 'default',
      }}
      onPointerDown={dragStart}
    >
      <div 
        className="flex flex-col h-full w-full justify-between box-border" 
        style={{ padding: `${14 * scale}px` }}
      >
        {/* Top Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 opacity-90">
            <span className="font-semibold tracking-tight" style={{ fontSize: `${13 * scale}px` }}>
              Kolkata
            </span>
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              style={{ width: `${10 * scale}px`, height: `${10 * scale}px`, transform: 'rotate(45deg)', marginLeft: '1px', marginBottom: '4px' }}
            >
              {/* <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /> */}
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
          <span className="font-extralight tracking-tight" style={{ fontSize: `${42 * scale}px`, lineHeight: '1.1' }}>
            {currentTemp}°
          </span>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-[2px]">
          <svg 
            viewBox="0 0 24 24" 
            fill="#FFD60A" 
            style={{ width: `${14 * scale}px`, height: `${14 * scale}px`, marginBottom: '2px' }}
          >
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 100 10 5 5 0 000-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium opacity-100" style={{ fontSize: `${11 * scale}px`, lineHeight: 1.1 }}>
            Mostly Sunny
          </span>
          <span className="font-medium opacity-90 tracking-wide" style={{ fontSize: `${11 * scale}px`, lineHeight: 1.1 }}>
            H:{highTemp}° L:{lowTemp}°
          </span>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-[15%] h-[15%] cursor-nwse-resize z-30 rounded-br-3xl hover:bg-white/10"
        onPointerDown={(e) => handleResizeStart(e, 'right-bottom')}
      />
    </div>
  );
}
