import React, { useState } from 'react';
import { portfolioData } from '../../config/portfolioData';

// Authentic Official VS Code Codicons (SVGs)
const FilesIcon = ({ active }) => (
  <svg stroke="currentColor" fill={active ? "#ffffff" : "#858585"} strokeWidth="0" viewBox="0 0 24 24" height="26" width="26" xmlns="http://www.w3.org/2000/svg" className="transition-colors">
    <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"></path>
  </svg>
);

const SearchIcon = ({ active }) => (
  <svg viewBox="0 0 16 16" fill={active ? "#ffffff" : "#858585"} width="24" height="24">
    <path d="M15.7 14.3L11.5 10.1C12.4 8.9 13 7.3 13 5.5 13 2.5 10.5 0 7.5 0S2 2.5 2 5.5 4.5 11 7.5 11c1.8 0 3.4-.6 4.6-1.5l4.2 4.2.7-.7-.3-.7zM3 5.5C3 3 5 1 7.5 1S12 3 12 5.5 10 10 7.5 10 3 8 3 5.5z" />
  </svg>
);

const BranchIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
    <path fillRule="evenodd" d="M11.75 1.5a1.75 1.75 0 00-1.026 3.172l-1.05 1.312a4.234 4.234 0 00-2.31-1.096V3.25a1.75 1.75 0 10-1.5 0v9.5a1.75 1.75 0 101.5 0V7.15c.677.202 1.282.595 1.761 1.134.425.476.685 1.077.781 1.716a1.75 1.75 0 101.5-1.123 4.223 4.223 0 00-.776-1.55l1.042-1.302A1.75 1.75 0 1011.75 1.5zM2.5 2.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM12 4a.75.75 0 100-1.5.75.75 0 000 1.5zM4 13.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm8-2.5a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
    <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"/>
  </svg>
);

export default function VSCodeApp() {
  const [activeTab, setActiveTab] = useState(portfolioData.projects[0]?.id);
  const [activeActivity, setActiveActivity] = useState('files'); // 'files' | 'search' | 'git'
  const [openTabs, setOpenTabs] = useState(portfolioData.projects.map(p => p.id));
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  const activeProject = portfolioData.projects.find(p => p.id === activeTab);

  const handleTabClose = (e, id) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t !== id);
    setOpenTabs(newTabs);
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[0]);
    } else if (newTabs.length === 0) {
      setActiveTab(null);
    }
  };

  const handleFileClick = (id) => {
    if (!openTabs.includes(id)) {
      setOpenTabs([...openTabs, id]);
    }
    setActiveTab(id);
  };

  // Search Logic
  const filteredProjects = portfolioData.projects.filter(p => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    // Searches title, description, and technologies inside the codebase emulator
    return (
      (p.title || '').toLowerCase().includes(lowerQ) ||
      (p.description || '').toLowerCase().includes(lowerQ) ||
      (p.tech || []).some(t => (t || '').toLowerCase().includes(lowerQ))
    );
  });

  return (
    <div className="w-full h-full flex flex-col bg-[#1E1E1E] text-[#CCCCCC] font-sans text-[13px] pt-0 select-none">
      
      {/* VS Code Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Activity Bar (Far Left) */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 shrink-0">
          <div 
            className={`cursor-pointer p-2 w-full flex justify-center border-l-2 ${activeActivity === 'files' ? 'border-[#ffffff]' : 'border-transparent'} hover:text-white group`}
            onClick={() => setActiveActivity('files')}
            title="Explorer"
          >
            <FilesIcon active={activeActivity === 'files'} />
          </div>
          <div 
            className={`cursor-pointer p-2 w-full flex justify-center border-l-2 ${activeActivity === 'search' ? 'border-[#ffffff]' : 'border-transparent'} hover:text-white group`}
            onClick={() => setActiveActivity('search')}
            title="Search"
          >
            <SearchIcon active={activeActivity === 'search'} />
          </div>

        </div>

        {/* Sidebar Panel */}
        <div className="w-64 bg-[#252526] flex flex-col shrink-0 border-r border-[#333333]">
          {/* files VIEW */}
          {activeActivity === 'files' && (
            <>
              <div className="uppercase text-[11px] px-5 py-3 font-normal tracking-wide text-[#CCCCCC]">Explorer</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 cursor-pointer font-bold px-1 hover:bg-[#2A2D2E]">
                  <span className="text-gray-400 rotate-90 w-4 pb-[2px] transition-transform">›</span> PROJECTS
                </div>
                <div className="pl-4 mt-[2px] flex flex-col border-l border-transparent ml-[2px]">
                  {portfolioData.projects.map(proj => (
                    <div 
                      key={proj.id}
                      onClick={() => handleFileClick(proj.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 cursor-pointer hover:bg-[#2A2D2E] ${activeTab === proj.id ? 'bg-[#37373D] text-[#ffffff]' : 'text-[#CCCCCC]'}`}
                    >
                      <span className="text-[#69B2EA] font-mono font-bold text-[14px]">M↓</span> {proj.title}.md
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* search VIEW */}
          {activeActivity === 'search' && (
            <div className="flex flex-col h-full">
              <div className="uppercase text-[11px] px-5 py-3 font-normal tracking-wide text-[#CCCCCC]">Search</div>
              <div className="px-4 pb-4">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#3C3C3C] text-[#CCCCCC] border border-[#3C3C3C] focus:border-[#007ACC] focus:outline-none rounded-sm px-2 py-1 text-[13px] placeholder:text-[#858585]"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto px-2">
                {searchQuery && (
                  <div className="text-[11px] text-[#858585] mb-2 px-2 uppercase tracking-wide">
                    {filteredProjects.length} results found
                  </div>
                )}
                {filteredProjects.length === 0 ? (
                  <div className="text-[#858585] text-center mt-4">No results found in portfolio.</div>
                ) : (
                  filteredProjects.map(proj => (
                    <div key={proj.id} className="mb-2">
                      <div 
                        className="flex items-center gap-1.5 px-2 py-1 cursor-pointer hover:bg-[#2A2D2E] text-white"
                        onClick={() => handleFileClick(proj.id)}
                      >
                        <span className="text-gray-400 w-4 font-mono text-center">›</span>
                        <span className="text-[#69B2EA] font-mono font-bold text-[14px]">M↓</span> {proj.title}.md
                      </div>
                      {/* Search match preview snippets */}
                      {searchQuery && (
                        <div className="pl-8 text-[12px] text-[#CCCCCC] opacity-80 py-0.5 truncate border-l border-[#3C3C3C] ml-6">
                           ...<span className="bg-[#4D2A00]">{searchQuery}</span>...
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1E1E1E]">
          {/* Tabs Group */}
          <div className="h-9 bg-[#252526] flex items-end overflow-x-auto overflow-y-hidden custom-scrollbar">
             {openTabs.map(tabId => {
               const proj = portfolioData.projects.find(p => p.id === tabId);
               return (
                 <div 
                   key={tabId}
                   onClick={() => setActiveTab(tabId)}
                   className={`h-[35px] flex items-center justify-between gap-3 px-3 min-w-[120px] max-w-[200px] border-r border-[#2D2D2D] cursor-pointer group ${
                     activeTab === tabId 
                       ? 'bg-[#1E1E1E] text-white border-t border-t-[#007ACC]' 
                       : 'bg-[#2D2D2D] text-[#969696] hover:bg-[#2B2B2B] border-t border-t-transparent'
                   }`}
                 >
                   <div className="flex items-center gap-1.5 truncate">
                     <span className="text-[#69B2EA] font-mono font-bold text-[12px]">M↓</span> 
                     <span className="truncate text-[13px]">{proj?.title}.md</span>
                   </div>
                   <div 
                     onClick={(e) => handleTabClose(e, tabId)}
                     className={`w-5 h-5 flex items-center justify-center rounded hover:bg-[#404040] ${activeTab === tabId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                   >
                     <span className="text-[10px] mb-[1px]">✕</span>
                   </div>
                 </div>
               );
             })}
          </div>

          {/* Code Content Container (Breadcrumbs + Code) */}
          {activeProject ? (
            <div className="flex-1 flex flex-col h-full bg-[#1E1E1E]">
              
              {/* Breadcrumbs */}
              <div className="h-6 px-4 flex items-center text-[12px] text-[#969696] shadow-sm">
                <span>portfolio</span> <span className="mx-1">›</span> <span>public</span> <span className="mx-1">›</span> <span>projects</span> <span className="mx-1">›</span> <span className="text-[#69B2EA] font-mono opacity-80 mr-1">M↓</span> {activeProject.title}.md
              </div>

              {/* Markdown Preview Area */}
              <div className="flex-1 overflow-auto bg-[#0D1117] text-[#C9D1D9] p-8 pb-16 custom-scrollbar">
                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                  
                  {/* Header Title */}
                  <div className="border-b border-[#30363D] pb-3">
                    <h1 className="text-4xl font-extrabold text-[#E6EDF3] tracking-tight">{activeProject.title}</h1>
                  </div>
                  
                  {/* Non-technical Description */}
                  <p className="text-[16px] leading-relaxed text-[#8B949E] whitespace-pre-line">
                    {activeProject.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(activeProject.tech || []).map(t => (
                      <span key={t} className="px-3 py-1 rounded-full text-[12px] font-medium border border-[#30363D] bg-[#21262D] hover:bg-[#30363D] transition-colors cursor-default">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Project Image Showcase */}
                  <div className="mt-4 rounded-xl overflow-hidden border border-[#30363D] bg-[#161B22] shadow-2xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    <img 
                      src={activeProject.image} 
                      alt={activeProject.title}
                      className="w-full h-auto object-cover max-h-[500px]"
                      onError={(e) => {
                         // Fallback placeholder logic
                         e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='%23161B22' width='800' height='400'/%3E%3Ctext fill='%238B949E' x='50%25' y='50%25' font-family='sans-serif' font-size='16' text-anchor='middle' alignment-baseline='middle'%3EImage coming soon. Place image at ${activeProject.image}%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>

                  {/* Call to Action Links */}
                  <div className="flex items-center gap-4 mt-6">
                    {activeProject.liveUrl && (
                      <a 
                        href={activeProject.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-2.5 bg-[#238636] hover:bg-[#2EA043] transition-colors text-white text-[14px] font-semibold rounded-lg shadow-sm flex items-center gap-2"
                      >
                        Live Demo
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                    {activeProject.githubUrl && (
                      <a 
                        href={activeProject.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-2.5 bg-[#21262D] hover:bg-[#30363D] border border-[#363B42] hover:border-[#8B949E] transition-all text-[#C9D1D9] text-[14px] font-semibold rounded-lg flex items-center gap-2"
                      >
                        View Source on GitHub
                      </a>
                    )}
                  </div>
                  
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#1E1E1E]">
              <div className="text-center">
                <svg className="mx-auto opacity-10 mb-4" viewBox="0 0 24 24" fill="#ffffff" width="120" height="120">
                  <path d="M2.5 17.5l-1-2.5 7.5-6L14 12l6.5-7.5L22.5 7 14 16l-5-3-6.5 4.5z"/>
                </svg>
                <div className="text-[#858585] text-lg font-normal mb-8">VS Code - Portfolio Editor</div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-left text-[13px]">
                  <span className="text-[#858585] justify-self-end">Show All Commands</span>
                  <span className="text-[#CCCCCC] font-bold tracking-wider">⇧⌘P</span>
                  <span className="text-[#858585] justify-self-end">Go to File</span>
                  <span className="text-[#CCCCCC] font-bold tracking-wider">⌘P</span>
                  <span className="text-[#858585] justify-self-end">Find in Files</span>
                  <span className="text-[#CCCCCC] font-bold tracking-wider">⇧⌘F</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VS Code Bottom Status Bar */}
      <div className="h-[22px] bg-[#007ACC] text-white flex items-center justify-between px-2 text-[12px] shrink-0 font-sans cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 hover:bg-white/20 px-1 py-[2px] rounded">
            <BranchIcon /> main*
          </div>
          <div className="flex items-center gap-1 hover:bg-white/20 px-1 py-[2px] rounded">
            <ErrorIcon /> 0 <span className="opacity-70 ml-1">⚠</span> 0
          </div>
        </div>
        <div className="flex items-center gap-4 text-[12px] opacity-90 pr-2">
          <span className="hover:bg-white/20 px-1 py-[2px] rounded mb-[1px]">UTF-8</span>
          <span className="hover:bg-white/20 px-1 py-[2px] rounded mb-[1px]">LF</span>
          <span className="hover:bg-white/20 px-1 py-[2px] rounded mb-[1px]">Markdown</span>
        </div>
      </div>

    </div>
  );
}