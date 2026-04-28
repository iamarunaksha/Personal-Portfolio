import React from 'react';
import { portfolioData } from '../../config/portfolioData';
import { useWindowDrag } from '../../hooks/useWindowDrag';
import { useWindowResize } from '../../hooks/useWindowResize';

export default function SpotifyWidget({ isDark }) {
  const { position, isDragging, handlePointerDown: dragStart } = useWindowDrag({ x: 24, y: 220 });
  
  // We set a min height of 116 (compact audio player).
  // The large playlist player needs at least ~360px to look decent.
  const { size, isResizing, handleResizeStart } = useWindowResize(337, 116, 250, 116);

  // Build the Spotify embed URL with the correct theme
  // theme=0 is dark, theme=1 is light. We also strip any existing theme param.
  const baseUrl = portfolioData.spotifyEmbedUrl;
  if (!baseUrl) return null;

  const themeParam = isDark ? '0' : '1';
  let embedUrl = baseUrl;
  // Remove existing theme param if present
  embedUrl = embedUrl.replace(/[&?]theme=\d/g, '');
  // Add our theme param
  embedUrl += (embedUrl.includes('?') ? '&' : '?') + `theme=${themeParam}`;

  // Spotify renders black empty space if the iframe height is between ~152px and ~352px.
  // We snap the height back to the compact mode (116) until the user drags far enough to show the tracklist (>=360).
  const displayHeight = (size.height > 116 && size.height < 360) ? 116 : size.height;

  return (
    <div
      className={`absolute rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl border select-none z-20 ${
        isDark
          ? 'bg-black/30 border-white/15'
          : 'bg-white/50 border-white/50'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: displayHeight,
        cursor: 'default',
        userSelect: 'none',
        padding: '5px'
      }}
    >
      {/* Drag Handle */}
      <div
        className="h-5 w-full flex items-center justify-center"
        onPointerDown={dragStart}
      >
        <div className={`w-8 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/15'}`} />
      </div>

      <iframe
        src={embedUrl}
        width="100%"
        height={displayHeight - 30}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-b-2xl"
        style={{ border: 'none' }}
      />

      {/* Resize Handle */}
      <div
        className={`absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-30 ${
          isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
        }`}
        onPointerDown={(e) => handleResizeStart(e, 'right-bottom')}
      />

      {/* iframe overlay during drag to prevent iframe from stealing events */}
      {isDragging && <div className="absolute inset-0 z-50" />}
    </div>
  );
}
