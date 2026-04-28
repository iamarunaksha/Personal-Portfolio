import React, { useState } from 'react';
import { useWindowDrag } from '../hooks/useWindowDrag';
import { useWindowResize } from '../hooks/useWindowResize';

export default function Window({ 
  id, 
  title, 
  children, 
  onClose,
  onMinimize,
  onFocus, 
  zIndex, 
  isActive,
  isMinimized,
  initialWidth = 600,
  initialHeight = 450,
  initialX = 100,
  initialY = 100
}) {
  const { position, isDragging, handlePointerDown } = useWindowDrag({ x: initialX, y: initialY });
  const { size, isResizing, handleResizeStart } = useWindowResize(initialWidth, initialHeight);
  const [isMaximized, setIsMaximized] = useState(false);

  // For fullscreen
  const maxStyle = isMaximized ? {
    width: '100%',
    height: 'calc(100% - 26px)', // Leave space for menu bar
    left: 0,
    top: 26,
    borderRadius: 0,
  } : {
    width: size.width,
    height: size.height,
    left: position.x,
    top: position.y,
  };

  return (
    <div 
      className={`absolute rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/10 backdrop-blur-3xl transform-gpu ${
        (!isDragging && !isResizing) ? 'transition-all duration-300' : ''
      } ${
        isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'shadow-xl saturate-50'
      } ${isMinimized ? 'opacity-0 scale-75 pointer-events-none blur-sm' : 'opacity-100 scale-100 pointer-events-auto'}`}
      style={{
        ...maxStyle,
        zIndex: zIndex,
        userSelect: (isDragging || isResizing) ? 'none' : 'auto',
        backgroundColor: 'rgba(30,30,30,0.85)'
      }}
      onPointerDown={() => onFocus(id)}
    >
      <div 
        className="h-7 w-full flex items-center justify-between px-3 cursor-default"
        onPointerDown={handlePointerDown}
      >
        {/* MacOS Traffic Lights - MUST stop propagation so clicking buttons doesn't trigger a window drag! */}
        <div 
          className="flex gap-2 items-center cursor-default"
          onPointerDown={(e) => e.stopPropagation()} 
        >
          {/* Close */}
          <button 
            onClick={() => onClose(id)}
            className="w-3 h-3 rounded-full bg-[#FF5F56] border-[0.5px] border-black/10 hover:brightness-75 transition-all flex items-center justify-center group outline-none focus:outline-none"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black">✕</span>
          </button>
          
          {/* Minimize */}
          <button 
            onClick={() => { if (onMinimize) onMinimize(id); }}
            className="w-3 h-3 rounded-full bg-[#FFBD2E] border-[0.5px] border-black/10 hover:brightness-75 transition-all flex items-center justify-center group outline-none focus:outline-none"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-black leading-none mb-[1px]">-</span>
          </button>
          
          {/* Maximize */}
          <button 
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-3 h-3 rounded-full bg-[#27C93F] border-[0.5px] border-black/10 hover:brightness-75 transition-all flex items-center justify-center group outline-none focus:outline-none"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">+</span>
          </button>
        </div>

        {/* Window Title */}
        <div className={`text-[13px] font-medium tracking-wide ${isActive ? 'text-white' : 'text-gray-400'}`}>
          {title}
        </div>

        {/* Empty space to balance the traffic lights on the right side */}
        <div className="text-white/50 text-[13px] font-semibold w-16 text-right pr-2"></div>
      </div>

      {/* Embedded App Content */}
      <div className="flex-1 relative bg-black/40 w-full h-full overflow-hidden">
        {children}
      </div>

      {/* --- RESIZE HANDLES --- */}
      {!isMaximized && (
        <>
          {/* Right Edge */}
          <div 
            className="absolute right-0 top-0 w-2 h-full cursor-e-resize z-50 hover:bg-white/5 transition-colors"
            onPointerDown={(e) => handleResizeStart(e, 'right')}
          />
          {/* Bottom Edge */}
          <div 
            className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize z-50 hover:bg-white/5 transition-colors"
            onPointerDown={(e) => handleResizeStart(e, 'bottom')}
          />
          {/* Bottom-Right Corner - Highest z-index to prioritize diagonal resize over horizontal/vertical */}
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-[60] hover:bg-white/10 transition-colors"
            onPointerDown={(e) => handleResizeStart(e, 'bottom-right')}
          />
        </>
      )}

      {/* Invisible dragging overlay: prevents IFrames (like Spotify) from stealing mouse events during a fast drag */}
      {(isDragging || isResizing) && <div className="absolute inset-0 z-50"></div>}
    </div>
  );
}
