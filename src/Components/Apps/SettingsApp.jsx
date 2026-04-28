import React, { useState } from 'react';
import { portfolioData } from '../../config/portfolioData';

// Reusable icons
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

export default function SettingsApp({ themePreference, setThemePreference }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'display'

  // Generic Vector Facebook-style Male Avatar
  const avatarSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E`;

  return (
    <div className="w-full h-full flex bg-[#1E1E1E] text-[#CCCCCC] font-sans text-[13px] pt-0 select-none rounded-b-xl overflow-hidden shadow-2xl border border-[#333333]">
      
      {/* Settings Left Sidebar */}
      <div className="w-64 bg-[#1e1e1e]/95 backdrop-blur-3xl shrink-0 flex flex-col py-2 border-r border-[#111111] overflow-y-auto">
        <div className="px-4 py-2">
           {/* <div className="w-full bg-[#1a1a1a] rounded-md border border-[#333333] flex items-center px-2 py-1">
             <svg width="12" height="12" fill="#858585" viewBox="0 0 16 16"><path d="M15.7 14.3L11.5 10.1C12.4 8.9 13 7.3 13 5.5 13 2.5 10.5 0 7.5 0S2 2.5 2 5.5 4.5 11 7.5 11c1.8 0 3.4-.6 4.6-1.5l4.2 4.2.7-.7-.3-.7zM3 5.5C3 3 5 1 7.5 1S12 3 12 5.5 10 10 7.5 10 3 8 3 5.5z" /></svg>
             <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[#cccccc] text-[12px] ml-2 w-full placeholder:text-[#858585]" disabled />
           </div> */}
        </div>

        {/* Apple ID Profile Stub */}
        <div 
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-3 px-3 py-2 mx-2 mt-2 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'profile' ? 'bg-[#0058d0] text-white' : 'hover:bg-white/10 text-white/90'
          }`}
        >
           <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/20 flex items-center justify-center">
             <img src="/face.png" onError={(e) => e.target.src = avatarSvg} alt="Profile" className="w-full h-full object-cover object-bottom" />
           </div>
           <div className="flex flex-col overflow-hidden">
             <span className="font-semibold text-[14px] truncate">{portfolioData.name}</span>
             <span className="text-[11px] opacity-70 truncate">Software Developer</span>
           </div>
        </div>

        <div className="mx-4 my-3 h-[1px] bg-white/10"></div>

        {/* Setting Tabs */}
        <div 
          onClick={() => setActiveTab('display')}
          className={`flex items-center gap-3 px-3 py-1.5 mx-2 rounded-lg cursor-pointer transition-colors ${
            activeTab === 'display' ? 'bg-[#0058d0] text-white' : 'hover:bg-white/10 text-white/90'
          }`}
        >
          <div className="w-6 h-6 rounded bg-[#ff9f0a] flex items-center justify-center text-white shrink-0 shadow-sm border border-black/20">
             <SunIcon />
          </div>
          <span className="text-[13px]">Display & Theme</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#1c1c1c] overflow-y-auto">
        
        {activeTab === 'profile' && (
           <div className="max-w-2xl mx-auto p-12 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 mb-4 shadow-xl">
                 <img src="/face.png" onError={(e) => e.target.src = avatarSvg} alt="Profile" className="w-full h-full object-cover object-bottom" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{portfolioData.name}</h2>
              <p className="text-white/50 text-[14px] mb-8">{portfolioData.role}</p>

              <div className="w-full bg-[#252526] rounded-xl border border-[#333333] overflow-hidden flex flex-col shadow-sm">
                 <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                   <span className="text-white/80">Email</span>
                   <a href={`mailto:${portfolioData.email}`} className="text-[#0A84FF] hover:underline cursor-pointer">{portfolioData.email}</a>
                 </div>
                 <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                   <span className="text-white/80">LinkedIn</span>
                   <a href={portfolioData.linkedinUrl} target="_blank" className="text-[#0A84FF] hover:underline cursor-pointer">View Profile</a>
                 </div>
                 <div className="flex items-center justify-between p-4 border-b border-[#333333]">
                   <span className="text-white/80">GitHub</span>
                   <a href={portfolioData.githubUrl} target="_blank" className="text-[#0A84FF] hover:underline cursor-pointer">View Repositories</a>
                 </div>
                 <div className="flex items-center justify-between p-4">
                   <span className="text-white/80">LeetCode</span>
                   <a href={portfolioData.leetcodeUrl} target="_blank" className="text-[#0A84FF] hover:underline cursor-pointer">View Statistics</a>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'display' && (
           <div className="max-w-2xl mx-auto p-12">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-lg bg-[#ff9f0a] flex items-center justify-center text-white shadow-lg border border-black/20">
                    <SunIcon />
                 </div>
                 <h2 className="text-2xl font-bold text-white">Display Settings</h2>
              </div>

              <div className="w-full bg-[#252526] rounded-xl border border-[#333333] overflow-hidden p-6 shadow-sm">
                 <h3 className="text-[14px] font-semibold text-white mb-4">Appearance</h3>
                 <div className="flex gap-4">
                    {/* Light Option */}
                    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setThemePreference?.('light')}>
                       <div className={`w-28 h-20 rounded-lg border-2 flex items-center justify-center transition-all bg-white ${themePreference === 'light' ? 'border-[#0a84ff]' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                          <div className="w-full h-full bg-cover bg-center rounded-md m-[1px]" style={{ backgroundImage: "url('/boot/light-3.png')" }}></div>
                       </div>
                       <span className={`text-[12px] ${themePreference === 'light' ? 'text-white' : 'text-white/50'}`}>Light</span>
                    </div>

                    {/* Dark Option */}
                    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setThemePreference?.('dark')}>
                       <div className={`w-28 h-20 rounded-lg border-2 flex items-center justify-center transition-all bg-black ${themePreference === 'dark' ? 'border-[#0a84ff]' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                          <div className="w-full h-full bg-cover bg-center rounded-md m-[1px]" style={{ backgroundImage: "url('/boot/dark-3.png')" }}></div>
                       </div>
                       <span className={`text-[12px] ${themePreference === 'dark' ? 'text-white' : 'text-white/50'}`}>Dark</span>
                    </div>

                    {/* Auto Option */}
                    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setThemePreference?.('system')}>
                       <div className={`w-28 h-20 rounded-lg border-2 flex items-center justify-center transition-all overflow-hidden ${themePreference === 'system' ? 'border-[#0a84ff]' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                          <div className="w-1/2 h-full bg-cover bg-left" style={{ backgroundImage: "url('/boot/light-3.png')" }}></div>
                          <div className="w-1/2 h-full bg-cover bg-right" style={{ backgroundImage: "url('/boot/dark-3.png')" }}></div>
                       </div>
                       <span className={`text-[12px] ${themePreference === 'system' ? 'text-white' : 'text-white/50'}`}>Auto</span>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
}
