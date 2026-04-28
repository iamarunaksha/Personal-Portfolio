import React, { useState } from 'react';
import { portfolioData } from '../../config/portfolioData';

export default function MailApp() {
  // Select the first email by default
  const [selectedEmailId, setSelectedEmailId] = useState(portfolioData.emails[0]?.id || null);
  const [toastVisible, setToastVisible] = useState(false);

  const selectedEmail = portfolioData.emails.find(e => e.id === selectedEmailId);

  const handleForward = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1500);
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1E1E1E] text-[#CCCCCC] font-sans text-[13px] pt-0 select-none rounded-b-xl overflow-hidden shadow-2xl border border-[#333333]">
      
      {/* Mail Toolbar */}
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
          {/* <button className="w-7 h-6 flex items-center justify-center rounded-md hover:bg-white/10 text-white/80 transition-colors" title="Write New Message">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button> */}
        </div>
        <div className="flex items-center gap-2">
           {/* <div className="w-48 h-6 bg-[#1a1a1a] rounded-md border border-[#333333] flex items-center px-2">
             <svg width="12" height="12" fill="#858585" viewBox="0 0 16 16"><path d="M15.7 14.3L11.5 10.1C12.4 8.9 13 7.3 13 5.5 13 2.5 10.5 0 7.5 0S2 2.5 2 5.5 4.5 11 7.5 11c1.8 0 3.4-.6 4.6-1.5l4.2 4.2.7-.7-.3-.7zM3 5.5C3 3 5 1 7.5 1S12 3 12 5.5 10 10 7.5 10 3 8 3 5.5z" /></svg>
             <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-[#cccccc] text-[11px] ml-2 w-full placeholder:text-[#858585]"/>
           </div> */}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Inbox List */}
        <div className="w-64 bg-[#1e1e1e]/90 backdrop-blur-xl shrink-0 flex flex-col border-r border-[#111111] overflow-y-auto">
          {portfolioData.emails.map((email) => (
            <div 
              key={email.id}
              onClick={() => setSelectedEmailId(email.id)}
              className={`flex flex-col gap-1 px-4 py-3 border-b border-[#333333]/50 cursor-pointer transition-colors ${
                selectedEmailId === email.id ? 'bg-[#0058d0] text-white' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-baseline font-semibold">
                <span className={`truncate mr-2 ${selectedEmailId === email.id ? 'text-white' : 'text-white/90'}`}>{email.sender}</span>
                <span className={`text-[10px] shrink-0 ${selectedEmailId === email.id ? 'text-white/80' : 'text-[#858585]'}`}>{email.date.split(' ')[0]}</span>
              </div>
              <div className={`font-medium truncate text-[12px] ${selectedEmailId === email.id ? 'text-white/90' : 'text-white/80'}`}>
                {email.subject}
              </div>
              <div className={`truncate text-[11px] ${selectedEmailId === email.id ? 'text-white/70' : 'text-[#858585]'}`}>
                {email.preview}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area - Email View */}
        <div className="flex-1 bg-[#1c1c1c] overflow-y-auto relative p-8">
          {selectedEmail ? (
             <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-white mb-6">{selectedEmail.subject}</h1>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0a84ff] to-[#30d158] flex items-center justify-center text-white font-bold shadow-sm">
                         {selectedEmail.sender.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                         <span className="font-semibold text-white/90">{selectedEmail.sender}</span>
                         <span className="text-[11px] text-[#858585]">To: Future Colleague</span>
                      </div>
                   </div>
                   <span className="text-[11px] text-[#858585]">{selectedEmail.date}</span>
                </div>
                
                <div className="text-[#cccccc] text-[14px] leading-relaxed whitespace-pre-wrap font-sans">
                   {selectedEmail.body}
                </div>

                <div className="mt-12 flex gap-3">
                  <button className="px-4 py-1.5 rounded-md border border-white/20 hover:bg-white/10 text-white/90 transition-colors flex items-center gap-2" onClick={() => window.location.href = `mailto:${portfolioData.email}`}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ transform: 'scaleX(-1)' }}>
                      <polyline points="15 14 20 9 15 4"></polyline>
                      <path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>
                    </svg>
                    Reply
                  </button>

                  <button className="px-4 py-1.5 rounded-md border border-white/20 hover:bg-white/10 text-white/90 transition-colors flex items-center gap-2" onClick={handleForward}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="15 14 20 9 15 4"></polyline>
                    <path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>
                  </svg>
                  Forward
                </button>
                </div>
             </div>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-white/30">
               No Message Selected
             </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d2d2d] border border-white/10 text-white/90 text-[12px] shadow-xl transition-all duration-200 ${
        toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}>
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Portfolio link copied to clipboard
      </div>

    </div>
  );
}
