import React, { useState } from 'react';
import { portfolioData } from '../../config/portfolioData';

// Authentic macOS SF Symbol style outline icons for Sidebar
const SidebarDocIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const SidebarExpIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const SidebarEduIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

// Large Markdown Document icon for the main folder view
const DocumentIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#cccccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M10 13l-1.5 1.5L7 13"></path>
    <path d="M14 17l1.5-1.5L17 17"></path>
  </svg>
);

export default function FinderApp() {
  const [activeTab, setActiveTab] = useState('Documents'); // 'Documents', 'Experience', 'Education'
  const [selectedFile, setSelectedFile] = useState(null); // Used to show file details
  const [searchQuery, setSearchQuery] = useState(''); // Used for searching files

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'Documents', label: 'Documents', icon: <SidebarDocIcon /> },
    { id: 'Experience', label: 'Experience', icon: <SidebarExpIcon /> },
    { id: 'Education', label: 'Education', icon: <SidebarEduIcon /> },
  ];

  const handleFileClick = (file) => {
    // If it's the resume, we want to maybe open a PDF viewer, for now we just set it as active
    setSelectedFile(file);
  };

  const renderContent = () => {
    if (activeTab === 'Documents') {
      const showResume = 'resume.pdf'.includes(searchQuery.toLowerCase());
      
      return (
        <div className="flex flex-wrap gap-6 p-6">
          {showResume && (
            <div 
              className={`flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer ${selectedFile?.id === 'resume' ? 'bg-white/10' : 'hover:bg-white/5'}`}
              onDoubleClick={() => {
                 if (portfolioData.resumeUrl) {
                    window.open(portfolioData.resumeUrl, '_blank');
                 } else {
                    alert("Resume URL is broken");
                 }
              }}
              onClick={() => handleFileClick({ id: 'resume', type: 'pdf', title: 'Resume.pdf' })}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-12 h-12" />
              <span className="text-[12px] text-white">Resume.pdf</span>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'Experience') {
      const filteredExp = portfolioData.experience.filter(exp => exp.id.toLowerCase().includes(searchQuery.toLowerCase()));
      return (
        <div className="flex flex-wrap gap-6 p-6">
          {filteredExp.map(exp => (
            <div 
              key={exp.id}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer w-28 text-center border transition-colors ${selectedFile?.id === exp.id ? 'bg-white/10 border-white/20 shadow-sm' : 'border-transparent hover:bg-white/5'}`}
              onClick={() => handleFileClick({ ...exp, type: 'md' })}
            >
              <DocumentIcon />
              <span className={`text-[12px] truncate w-full px-1 rounded ${selectedFile?.id === exp.id ? 'bg-[#0A84FF] text-white' : 'text-white'}`}>{exp.id}</span>
            </div>
          ))}
          {filteredExp.length === 0 && (
            <div className="w-full text-center text-white/50 py-10">No items match your search.</div>
          )}
        </div>
      );
    }

    if (activeTab === 'Education') {
      const filteredEdu = portfolioData.education.filter(edu => edu.id.toLowerCase().includes(searchQuery.toLowerCase()));
      return (
        <div className="flex flex-wrap gap-6 p-6">
          {filteredEdu.map(edu => (
            <div 
              key={edu.id}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer w-28 text-center border transition-colors ${selectedFile?.id === edu.id ? 'bg-white/10 border-white/20 shadow-sm' : 'border-transparent hover:bg-white/5'}`}
              onClick={() => handleFileClick({ ...edu, type: 'md' })}
            >
              <DocumentIcon />
              <span className={`text-[12px] truncate w-full px-1 rounded ${selectedFile?.id === edu.id ? 'bg-[#0A84FF] text-white' : 'text-white'}`}>{edu.id}.md</span>
            </div>
          ))}
          {filteredEdu.length === 0 && (
            <div className="w-full text-center text-white/50 py-10">No items match your search.</div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1E1E1E] text-[#CCCCCC] font-sans text-[13px] pt-0 select-none rounded-b-xl overflow-hidden shadow-2xl border border-[#333333]">
      
      {/* Finder Toolbar */}
      <div className="h-12 bg-[#2d2d2d] border-b border-[#111111] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button className="w-7 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="w-7 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors opacity-50 cursor-not-allowed">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div className="font-semibold text-white tracking-wide">{activeTab}</div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-48 h-6 bg-[#1a1a1a] rounded-md border border-[#333333] flex items-center px-2">
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
        <div className="w-40 bg-[#1e1e1e]/90 backdrop-blur-xl shrink-0 flex flex-col py-2 border-r border-[#111111] overflow-y-auto">
          <div className="px-3 text-[11px] font-semibold text-white/50 mb-1 mt-2">Favorites</div>
          {sidebarItems.map(item => (
            <div 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedFile(null); }}
              className={`flex items-center gap-2 px-3 py-1.5 mx-2 rounded-md cursor-pointer transition-colors ${
                activeTab === item.id ? 'bg-white/10 text-white font-medium' : 'text-white/80 hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="text-[13px]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#1e1e1e] overflow-y-auto relative">
          {renderContent()}

          {/* Modal Card File Preview (if a markdown file is selected) */}
          {selectedFile && selectedFile.type === 'md' && (
            <div 
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 transition-all" 
              onClick={() => setSelectedFile(null)}
            >
              <div 
                className="w-full max-w-md max-h-[90%] bg-[#252526] border border-white/10 rounded-xl p-8 overflow-y-auto shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-5">
                   <div>
                     <h2 className="text-2xl font-bold text-white mb-1.5">{selectedFile.title}</h2>
                     <div className="text-[13px] text-white/50">{selectedFile.date}</div>
                   </div>
                   <button 
                     onClick={() => setSelectedFile(null)} 
                     className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                   >
                     ✕
                   </button>
                </div>
                
                <div className="w-full h-[1px] bg-white/10 mb-5"></div>
                
                <p className="text-[#cccccc] leading-relaxed whitespace-pre-line text-[14px]">
                  {selectedFile.markdown}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
