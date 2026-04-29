import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook to handle the 2D physics of dragging OS windows around the screen.
 * This is a great interview talking point: it demonstrates an understanding of 
 * DOM event propagation, state management, and memory cleanup.
 */
export function useWindowDrag(initialPosition = { x: 100, y: 100 }) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  
  // We use a ref here because the DOM events need immediate access 
  // without triggering react re-renders inside the event loop.
  // But wait, standard react state works fine for simple drags!
  const [offsetConfig, setOffsetConfig] = useState({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e) => {
    // Only drag on left click or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    e.preventDefault();
    e.stopPropagation();

    if (e.target && e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
    
    // Calculate the offset from the top-left of the window to where the user clicked 
    // on the drag handle (the header). This prevents the window from "snapping" 
    // to the cursor's center.
    setOffsetConfig({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    setIsDragging(true);
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e) => {
      // Calculate new position based on where the mouse is now,
      // minus the original click offset on the window.
      let newX = e.clientX - offsetConfig.x;
      let newY = e.clientY - offsetConfig.y;

      // Keep window within the top bounds (don't let it go under the menubar)
      if (newY < 26) newY = 26; // menubar is ~26px high

      // Clamp to viewport so widgets can't be dragged outside the screen
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (newX < 0) newX = 0;
      if (newY > vh - 40) newY = vh - 40; // keep at least 40px visible at bottom
      if (newX > vw - 40) newX = vw - 40; // keep at least 40px visible on right

      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    // We attach these to the global window so dragging doesn't stop 
    // if the user moves the mouse faster than the React component renders.
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Memory cleanup: removing listeners when the user drops the window
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, offsetConfig]);

  return { position, isDragging, handlePointerDown };
}
