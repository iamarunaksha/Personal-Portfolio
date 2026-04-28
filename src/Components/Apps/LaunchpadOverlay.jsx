import React, { useState } from 'react';
import { portfolioData } from '../../config/portfolioData';

export default function LaunchpadOverlay({ isLaunchpadOpen, setIsLaunchpadOpen }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isLaunchpadOpen) return null;

  // Filter skills based on search
  const filteredTech = portfolioData.techStackIcons.filter(tech => 
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[60px] animate-fade-in flex flex-col items-center pt-16 overflow-hidden"
      onClick={() => setIsLaunchpadOpen(false)}
    >
      
      {/* Search Bar */}
      <div 
        className="w-80 h-8 flex items-center bg-white/20 rounded-md px-3 border border-white/20 shadow-md backdrop-blur-md mb-12 hover:bg-white/30 transition-colors focus-within:bg-white/30 focus-within:w-96 duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the bar
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search" 
          autoFocus
          className="bg-transparent border-none outline-none text-white ml-2 w-full text-center placeholder:text-white/70 tracking-wide text-[16px]" 
        />
      </div>

      {/* Grid of Apps (Skills) */}
      <div 
        className="max-w-6xl w-full px-12 grid grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-x-4 gap-y-12 pb-16"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking grid area
      >
        {filteredTech.map((tech, idx) => (
          <div 
            key={idx}
            className="flex flex-col items-center gap-2 group cursor-pointer"
            onClick={() => {
              // Usually Launchpad apps open things. Here we could trigger a specific VSCode project search, 
              // but for now they just proudly bounce.
              setIsLaunchpadOpen(false);
            }}
          >
            {/* The Icon Container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl sm:rounded-[22px] flex items-center justify-center shadow-lg border border-white/20 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 group-hover:-translate-y-2 relative overflow-hidden">
               {/* Glossy Overlay */}
               <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20 pointer-events-none"></div>
               {/* Tech Target */}
               <img src={tech.src} alt={tech.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-md z-10" />
            </div>
            {/* Tag */}
            <span className="text-white text-[12px] sm:text-[14px] font-medium tracking-wide drop-shadow-md shadow-black truncate w-full text-center px-1">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
