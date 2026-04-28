import { useState, useEffect, useRef } from 'react';

export function useWindowResize(initialWidth, initialHeight, minWidth = 300, minHeight = 250) {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isResizing, setIsResizing] = useState(false);
  
  const resizeStateRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    direction: null
  });

  const handleResizeStart = (e, direction) => {
    // Prevent drag logic or other interactions
    e.stopPropagation();
    if(e.cancelable !== false) {
       e.preventDefault();
    }
    
    if (e.target && e.target.setPointerCapture && e.pointerId) {
      e.target.setPointerCapture(e.pointerId);
    }
    
    setIsResizing(true);
    resizeStateRef.current = {
      startX: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      startY: e.clientY || (e.touches && e.touches[0].clientY) || 0,
      startWidth: size.width,
      startHeight: size.height,
      direction
    };
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (e) => {
      // Handle both mouse and touch events
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      
      const state = resizeStateRef.current;
      const dx = clientX - state.startX;
      const dy = clientY - state.startY;

      setSize(() => {
         let newWidth = state.startWidth;
         let newHeight = state.startHeight;

         if (state.direction.includes('right')) {
           newWidth = Math.max(minWidth, state.startWidth + dx);
         }
         if (state.direction.includes('bottom')) {
           newHeight = Math.max(minHeight, state.startHeight + dy);
         }
         return { width: newWidth, height: newHeight };
      });
    };

    const handleUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    
    // Backup for mobile
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isResizing, minWidth, minHeight]);

  return { size, isResizing, handleResizeStart };
}
