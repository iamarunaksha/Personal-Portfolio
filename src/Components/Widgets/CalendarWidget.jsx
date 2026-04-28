import React, { useState } from 'react';
import { useWindowDrag } from '../../hooks/useWindowDrag';
import { useWindowResize } from '../../hooks/useWindowResize';

export default function CalendarWidget({ isDark }) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();

  // Use generic hooks instead of inline logic
  const { position, isDragging, handlePointerDown: dragStart } = useWindowDrag({ x: 200, y: 40 });
  const { size, isResizing, handleResizeStart } = useWindowResize(160, 160, 120, 120);

  const w = size.width;
  const scale = w / 160;
  const year = today.getFullYear();
  const month = today.getMonth();

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  // Empty slots for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  const remaining = 42 - cells.length; // Fill out 6 rows
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: null, current: false });
  }

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  // Scale fonts dynamically based on width

  return (
    <div
      className={`absolute rounded-3xl shadow-xl overflow-hidden select-none z-10 ${
        isDark ? 'bg-[#1C1C1E]' : 'bg-white'
      }`}
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
        className="flex flex-col h-full w-full box-border" 
        style={{ padding: `${12 * scale}px` }}
      >
        {/* Month Header */}
        <div 
          className="font-bold tracking-widest text-[#FF3B30] mb-[4px]"
          style={{ fontSize: `${8 * scale}px`, lineHeight: 1 }}
        >
          {monthNames[month]}
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 w-full mb-[2px]">
          {days.map((d, i) => (
            <div
              key={i}
              className={`text-center font-bold ${isDark ? 'text-white/40' : 'text-black/40'}`}
              style={{ fontSize: `${8 * scale}px`, lineHeight: 1 }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 flex-1">
          {cells.map((cell, i) => {
            if (!cell.day) {
              return <div key={i} className="flex items-center justify-center" />;
            }
            const todayMatch = isToday(cell.day);
            return (
              <div key={i} className="flex items-center justify-center">
                <div
                  className={`flex items-center justify-center font-semibold transition-colors ${
                    todayMatch
                      ? 'bg-[#FF3B30] text-white'
                      : isDark
                        ? 'text-white/90'
                        : 'text-black/90'
                  }`}
                  style={{
                    width: `${16 * scale}px`,
                    height: `${16 * scale}px`,
                    borderRadius: '50%',
                    fontSize: `${10 * scale}px`,
                  }}
                >
                  {cell.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className={`absolute bottom-0 right-0 w-[15%] h-[15%] cursor-nwse-resize z-30 rounded-br-3xl ${
          isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
        }`}
        onPointerDown={(e) => handleResizeStart(e, 'right-bottom')}
      />
    </div>
  );
}
