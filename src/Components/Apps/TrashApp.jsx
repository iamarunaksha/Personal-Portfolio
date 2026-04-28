import React, { useState } from 'react';
import { portfolioData } from '../../config/portfolioData';

// Reusable SVG icons for different file types
const ZipIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#EAB308">
    <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm6 0h2v2h-2V8zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2z"/>
  </svg>
);

const PdfIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#EF4444">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 9.5c0 .83-.67 1.5-1.5 1.5H6v2H4.5V7.5h3c.83 0 1.5.67 1.5 1.5v.5zm4.5 3c0 .83-.67 1.5-1.5 1.5h-2.5V7.5h2.5c.83 0 1.5.67 1.5 1.5v3.5zm5-.5h-2v1.5h-1.5V7.5H19v1.5h-2v1.5h1.5V12z"/>
    <path d="M6 8.5h1.5v1.5H6zM11 8.5h1.5v3.5H11z"/>
  </svg>
);

const JsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#FCD34D">
    <path d="M3 3h18v18H3V3zm14.5 14c1.66 0 3-1.34 3-3V9h-2v5c0 .55-.45 1-1 1s-1-.45-1-1v-1h-2v2c0 1.66 1.34 3 3 3zM9 17c-2.76 0-5-2.24-5-5V9h2v3c0 1.65 1.35 3 3 3s3-1.35 3-3V9h2v3c0 2.76-2.24 5-5 5z"/>
  </svg>
);

const ExeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#3B82F6">
    <path d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v16h16V4H4zm3 4h10v2H7V8zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
  </svg>
);

export default function TrashApp() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [emptyTrash, setEmptyTrash] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = portfolioData.trashItems?.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'zip': return <ZipIcon />;
      case 'pdf': return <PdfIcon />;
      case 'js': return <JsIcon />;
      case 'exe': return <ExeIcon />;
      default: return <JsIcon />;
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Are you sure you want to permanently erase the items in the Trash?')) {
      setEmptyTrash(true);
      setSelectedItem(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1E1E1E] text-[#CCCCCC] font-sans text-[13px] pt-0 select-none rounded-b-xl overflow-hidden shadow-2xl border border-[#333333]">
      
      {/* Trash Toolbar */}
      <div className="h-12 bg-[#2d2d2d] border-b border-[#111111] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button className="w-7 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors opacity-50 cursor-not-allowed">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="w-7 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors opacity-50 cursor-not-allowed">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div className="font-semibold text-white tracking-wide flex items-center gap-2">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
             Trash
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={handleEmptyTrash}
             disabled={emptyTrash}
             className={`px-3 py-1 rounded-md border border-[#333333] text-[12px] bg-[#1a1a1a] ${emptyTrash ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 text-white cursor-pointer'}`}
           >
             Empty
           </button>
           <div className="w-48 h-6 bg-[#1a1a1a] rounded-md border border-[#333333] flex items-center px-2 ml-2 focus-within:border-white/20 transition-colors">
             <svg width="12" height="12" fill="#858585" viewBox="0 0 16 16"><path d="M15.7 14.3L11.5 10.1C12.4 8.9 13 7.3 13 5.5 13 2.5 10.5 0 7.5 0S2 2.5 2 5.5 4.5 11 7.5 11c1.8 0 3.4-.6 4.6-1.5l4.2 4.2.7-.7-.3-.7zM3 5.5C3 3 5 1 7.5 1S12 3 12 5.5 10 10 7.5 10 3 8 3 5.5z" /></svg>
             <input 
               type="text" 
               placeholder="Search" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent border-none outline-none text-[#cccccc] text-[11px] ml-2 w-full placeholder:text-[#858585]"
             />
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-40 bg-[#1e1e1e]/90 backdrop-blur-xl shrink-0 flex flex-col py-2 border-r border-[#111111] overflow-y-auto hidden sm:flex">
          <div className="px-3 text-[11px] font-semibold text-white/50 mb-1 mt-2">Favorites</div>
          
          {/* <div className="flex items-center gap-2 px-3 py-1.5 mx-2 rounded-md cursor-pointer transition-colors text-white/80 hover:bg-white/10 opacity-50">
             <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
             <span className="text-[13px]">Desktop</span>
          </div> */}
          <div className="flex items-center gap-2 px-3 py-1.5 mx-2 rounded-md cursor-pointer transition-colors bg-[#0058d0] text-white">
             <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
             <span className="text-[13px]">Trash</span>
          </div>

        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#1c1c1c] overflow-y-auto p-4 shrink-0">
          
          {emptyTrash ? (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-[14px]">
               No items
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-[14px]">
               <span>No items match "{searchQuery}"</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-12 gap-y-8">
              {filteredItems.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedItem(item.name)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-pointer w-24 text-center border transition-colors ${
                    selectedItem === item.name ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                  onDoubleClick={() => alert(`${item.message}`)}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-black/20 rounded-lg shadow-sm border border-white/5">
                    {getIcon(item.icon)}
                  </div>
                  <span className={`text-[11px] leading-tight break-all ${selectedItem === item.name ? 'text-white font-semibold' : 'text-white/80'}`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
