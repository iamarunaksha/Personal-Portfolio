import React, { useState, useEffect } from 'react';
import Window from './Window';
import TerminalApp from './Apps/TerminalApp';
import SafariApp from './Apps/SafariApp';
import VSCodeApp from './Apps/VSCodeApp';
import SpotifyApp from './Apps/SpotifyApp';
import CalendarWidget from './Widgets/CalendarWidget';
import SpotifyWidget from './Widgets/SpotifyWidget';
import WeatherWidget from './Widgets/WeatherWidget';
import FinderApp from './Apps/FinderApp';
import SettingsApp from './Apps/SettingsApp';
import TrashApp from './Apps/TrashApp';
import LaunchpadOverlay from './Apps/LaunchpadOverlay';
import MailApp from './Apps/MailApp';

export default function Desktop({ theme, themePreference, setThemePreference }) {
  const [timeStr, setTimeStr] = useState('Sun 5 Apr 6:42 PM');
  const [isThemePopupOpen, setIsThemePopupOpen] = useState(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);

  // Window Management State
  const [openApps, setOpenApps] = useState([]); // Array of app IDs currently mounted
  const [minimizedApps, setMinimizedApps] = useState([]); // Array of hidden app IDs
  const [activeApp, setActiveApp] = useState(null); // ID of foreground window

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTimeStr(`${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  // Bulletproof click-outside logic for the Control Center popup
  const controlCenterRef = React.useRef(null);
  
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (controlCenterRef.current && !controlCenterRef.current.contains(e.target)) {
        setIsThemePopupOpen(false);
      }
    };
    if (isThemePopupOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isThemePopupOpen]);


  const themeOptions = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'system', label: 'System', icon: '💻' },
  ];

  const wallpaperUrl = theme === 'dark' 
    ? '/boot/dark-3.png'
    : '/boot/light-3.png';

  const dockApps = [
    { id: 'finder', name: 'Finder', img: '/dock-icons/finder.png' },
    { id: 'launchpad', name: 'Launchpad', img: '/dock-icons/apps.png' },
    { id: 'safari', name: 'Safari', img: '/dock-icons/safari.png' },
    { id: 'vscode', name: 'VS Code', img: '/dock-icons/VScode.png' },
    { id: 'spotify', name: 'Spotify', img: '/dock-icons/Spotify.png' },
    { id: 'mail', name: 'Mail', img: '/dock-icons/mail.png' },
    { id: 'terminal', name: 'Terminal', img: '/dock-icons/terminal.png' },
    { id: 'settings', name: 'Settings', img: '/dock-icons/settings.png' },
  ];

  // Window Actions
  const handleOpenApp = (id) => {
    // If it's Launchpad, we trigger the overlay instead of a Window instance
    if (id === 'launchpad') {
      setIsLaunchpadOpen(true);
      return;
    }
    
    if (!openApps.includes(id)) {
      setOpenApps([...openApps, id]);
    }
    
    // Restore from minimize if it was hiding
    if (minimizedApps.includes(id)) {
      setMinimizedApps(minimizedApps.filter(appId => appId !== id));
    }
    
    setActiveApp(id);
  };

  const handleCloseApp = (id) => {
    setOpenApps(openApps.filter(appId => appId !== id));
    setMinimizedApps(minimizedApps.filter(appId => appId !== id));
    if (activeApp === id) setActiveApp(null);
  };

  const handleMinimizeApp = (id) => {
    if (!minimizedApps.includes(id)) {
      setMinimizedApps([...minimizedApps, id]);
    }
    if (activeApp === id) setActiveApp(null);
  };

  const handleFocusApp = (id) => {
    setActiveApp(id);
  };

  // [SENIOR TIP]: This is "Derived State". Never store `isDark` as its own separate useState variable if it strictly depends on `theme`.
  // Having a single source of truth (`theme`) prevents the UI from accidentally falling out of sync.
  const isDark = theme === 'dark';

  return (
    <div 
      className="h-screen w-screen bg-cover bg-center overflow-hidden flex flex-col transition-all duration-1000"
      style={{ backgroundImage: `url(${wallpaperUrl})` }}
    >
      {/* Menu Bar */}
      {/* [SENIOR TIP]: We're mimicking Apple's glassmorphism using `backdrop-blur-2xl`. 
          Watch out: Heavy blurs are GPU-intensive. In a real production app, ensure the background image is optimized! */}
      <div 
        className={`h-[26px] w-full px-4 flex justify-between items-center backdrop-blur-2xl ${
          isDark 
            ? 'bg-black/20 text-white border-b border-white/10' 
            : 'bg-white/30 text-black border-b border-black/5'
        }`}
      >
        <div className="flex items-center gap-4 text-[13px] leading-none mb-[1px]">
          <span className="pt-[1px] px-1 cursor-default flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 814 1000" fill="currentColor"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.2-81-105.5-207.6-105.5-328.5 0-193.2 125.7-295.8 249.2-295.8 65.7 0 120.5 43.1 161.7 43.1 39.2 0 100.4-45.8 174.6-45.8 28.2 0 129.6 2.6 196.6 99.4zM554.1 159.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.9 32.4-57.1 83.6-57.1 135.5 0 7.8.6 15.6 1.3 18.2 2.6.6 6.4 1.3 10.2 1.3 45.4 0 102.5-30.4 141.5-71.4z"/></svg></span>
          <span className="font-bold cursor-default">Portfolio</span>
          <span className="font-medium cursor-default">File</span>
          <span className="font-medium cursor-default">Edit</span>
          <span className="font-medium cursor-default">View</span>
          <span className="font-medium cursor-default">Go</span>
          <span className="font-medium cursor-default">Window</span>
          <span className="font-medium cursor-default">Help</span>
        </div>
        
        <div className="flex items-center gap-3.5 text-[13px] font-medium leading-none mb-[1px]">
          {/* Wifi */}
          <div className="flex items-center cursor-pointer pb-[1px]">
             {/* [SENIOR TIP]: We use CSS `invert` based on theme rather than loading two separate dark/light PNG files. 
                 This cuts down network requests and guarantees the icon flips instantaneously without loading flashes. */}
             {/* <img 
               src="/wifi-2.png" 
               alt="WiFi" 
               className={`w-[17px] object-contain ${isDark ? 'invert' : ''}`} 
             /> */}

            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"></path>
            </svg>
             
          </div>

          {/* Battery */}
          <div className="flex items-center gap-[6px] cursor-pointer">
            <span>98%</span>
            <div className="relative flex items-center pt-[1px]">
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="1" width="19" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" opacity={isDark ? "0.4" : "0.3"}/>
                <path d="M21 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={isDark ? "0.4" : "0.3"}/>
                <rect x="2" y="2.5" width="16" height="7" rx="1" fill="currentColor"/>
              </svg>
            </div>
          </div>
          
          {/* Siri */}
          <div className="flex items-center justify-center cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" fill="url(#siri-gradient)" />
              <defs>
                <linearGradient id="siri-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#40C4FF"/>
                  <stop offset="0.5" stopColor="#7C4DFF"/>
                  <stop offset="1" stopColor="#FF4081"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Control Center */}
          <div className="relative flex items-center cursor-pointer pb-[1px]" ref={controlCenterRef}>
            <div onClick={() => setIsThemePopupOpen(prev => !prev)} className={`px-2 py-0.5 rounded-md ${isThemePopupOpen ? (isDark ? 'bg-white/20' : 'bg-black/10') : ''}`}>
              <svg viewBox="0 0 29 29" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M7.5,13h14a5.5,5.5,0,0,0,0-11H7.5a5.5,5.5,0,0,0,0,11Zm0-9h14a3.5,3.5,0,0,1,0,7H7.5a3.5,3.5,0,0,1,0-7Zm0,6A2.5,2.5,0,1,0,5,7.5,2.5,2.5,0,0,0,7.5,10Zm14,6H7.5a5.5,5.5,0,0,0,0,11h14a5.5,5.5,0,0,0,0-11Zm1.43439,8a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,22.93439,24Z"></path>
              </svg>
            </div>

            {/* macOS Style Control Center Popup */}
            {isThemePopupOpen && (
              <div 
                className={`absolute top-[32px] right-[-8px] w-[280px] p-3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] cursor-default ${
                  isDark 
                    ? 'bg-[#1c1c1e]/40 backdrop-blur-[40px] border border-white/10'
                    : 'bg-white/40 backdrop-blur-[40px] border border-white/40'
                }`}
              >
                {/* Appearance Module */}
                <div className={`p-3 rounded-2xl flex flex-col gap-3 ${isDark ? 'bg-white/10' : 'bg-white/60 shadow-sm'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isDark ? 'bg-[#0A84FF]' : 'bg-[#007AFF]'}`}>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span className={`text-[13px] font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Appearance</span>
                  </div>

                  {/* Segmented Control */}
                  <div className={`flex p-[3px] rounded-lg ${isDark ? 'bg-black/30' : 'bg-black/5'} w-full`}>
                    {[
                      { id: 'light', label: 'Light' },
                      { id: 'dark', label: 'Dark' },
                      { id: 'system', label: 'Auto' }
                    ].map((opt) => {
                      const isActive = themePreference === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setThemePreference(opt.id);
                          }}
                          className={`flex-1 py-1 text-[12px] font-medium rounded-md transition-all ${
                            isActive 
                              ? (isDark ? 'bg-[#636366] text-white shadow-sm' : 'bg-white text-black shadow-sm')
                              : (isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black')
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Date & Time */}
          <div className="pl-1 leading-none font-medium text-[13px] cursor-pointer">
            {timeStr}
          </div>
        </div>
      </div>

      {/* Desktop Area for Widgets Level */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* We use pointer-events-auto on the widgets themselves so you can click/drag them */}
        <div className="pointer-events-auto">
          <WeatherWidget />
          <CalendarWidget isDark={isDark} />
          <SpotifyWidget isDark={isDark} />
        </div>
      </div>

      {/* Screen Covering Launchpad Overlay */}
      <LaunchpadOverlay isLaunchpadOpen={isLaunchpadOpen} setIsLaunchpadOpen={setIsLaunchpadOpen} />

      {/* Desktop Area for Icons & Windows */}
      <div className="flex-1 p-4 flex flex-col items-end gap-6 pt-8 pr-8 relative z-20 pointer-events-none">
        
        {/* Render Open Windows */}
        {openApps.map((appId, index) => {
          // We look up the app name from dockApps
          const appMeta = dockApps.find(app => app.id === appId) || { name: 'Application' };
          // Stagger initial window spawns so they don't cover each other perfectly
          const initialX = 100 + (index * 40);
          const initialY = 50 + (index * 40);

          return (
            <Window 
              key={appId}
              id={appId}
              title={appMeta.name}
              isActive={activeApp === appId}
              isMinimized={minimizedApps.includes(appId)}
              zIndex={activeApp === appId ? 50 : 10 + index}
              onClose={handleCloseApp}
              onMinimize={handleMinimizeApp}
              onFocus={handleFocusApp}
              initialX={initialX}
              initialY={initialY}
            >
              {/* Render the specific App based on ID */}
              {appId === 'terminal' && <TerminalApp />}
              {appId === 'safari' && <SafariApp />}
              {appId === 'vscode' && <VSCodeApp />}
              {appId === 'spotify' && <SpotifyApp />}
              {appId === 'finder' && <FinderApp />}
              {appId === 'settings' && <SettingsApp themePreference={themePreference} setThemePreference={setThemePreference} />}
              {appId === 'trash' && <TrashApp />}
              {appId === 'mail' && <MailApp />}
              
              {/* Fallback for unbuilt apps */}
              {!['terminal', 'safari', 'vscode', 'spotify', 'finder', 'settings', 'trash', 'mail'].includes(appId) && (
                <div className="flex items-center justify-center h-full w-full text-white/50">
                  {appMeta.name} is under construction...
                </div>
              )}
            </Window>
          );
        })}

      </div>

      {/* Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50">
        {/* [SENIOR TIP]: Using padding instead of fixed heights allows the dock to elegantly wrap around its children.
            The scale origin is set to `origin-bottom` so when an icon balloons in size it grows UPWARDS perfectly like macOS. */}
        <div 
          className={`flex items-end gap-5 px-3 py-2 pt-2 pb-1.5 rounded-3xl backdrop-blur-2xl shadow-2xl border ${
            isDark 
              ? 'bg-black/30 backdrop-blur-2xl border border-white/20 shadow-2xl' 
              : 'bg-white/20 backdrop-blur-2xl border border-white/20 shadow-2xl'
          }`}
        >
          {dockApps.map((app, i) => {
             const isOpen = openApps.includes(app.id);

             return (
               <div 
                 key={i} 
                 className="dock-item group relative flex flex-col items-center cursor-pointer"
                 onClick={() => handleOpenApp(app.id)}
               >
                  {/* Tooltip */}
                  <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 flex flex-col items-center">
                    {/* The Pill Content */}
                    <div className="relative z-10 px-2 py-[3px] bg-[#242424]/90 backdrop-blur-md border-[0.5px] border-white/20 text-[#eeeeee] text-[9px] font-normal tracking-wide rounded-[8px] shadow-sm whitespace-nowrap">
                      {app.name}
                    </div>
                    {/* The Seamless Triangle Caret */}
                    <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] bg-[#242424] rotate-45 border-b-[0.5px] border-r-[0.5px] border-white/20 z-20"></div>
                  </div>
                  
                  {/* App Icon */}
                  <div className="w-12 h-12 flex items-center justify-center">
                     <img src={app.img} alt={app.name} className="w-full h-full object-contain filter drop-shadow-md" />
                  </div>
                  
                  {/* Active indicator dot */}
                  <div className={`mt-1 w-1 h-1 rounded-full ${isOpen ? (isDark ? 'bg-white/80' : 'bg-black/80') : 'opacity-0'}`} />
               </div>
             );
          })}
          
          {/* Separator */}
          <div className="w-[1px] h-10 mx-1 bg-gray-400/30 self-center mb-2"></div>

          {/* Trash */}
          <div className="dock-item group relative flex flex-col items-center cursor-pointer" onClick={() => handleOpenApp('trash')}>
              <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 flex flex-col items-center">
                  <div className="relative z-10 px-2 py-[3px] bg-[#242424]/90 backdrop-blur-md border-[0.5px] border-white/20 text-[#eeeeee] text-[9px] font-normal tracking-wide rounded-[8px] shadow-sm whitespace-nowrap">
                    Trash
                  </div>
                  <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-[7px] h-[7px] bg-[#242424] rotate-45 border-b-[0.5px] border-r-[0.5px] border-white/20 z-20"></div>
                </div>
              <div className="w-12 h-12 flex items-center justify-center">
                 <img src="/dock-icons/bin.png" alt="Trash" className="w-full h-full object-contain filter drop-shadow-md" />
              </div>
              <div className={`mt-1 w-1 h-1 rounded-full ${openApps.includes('trash') ? (isDark ? 'bg-white/80' : 'bg-black/80') : 'opacity-0'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
