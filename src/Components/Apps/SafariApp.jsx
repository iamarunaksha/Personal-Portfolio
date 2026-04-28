import React, { useState, useEffect } from 'react';
import { portfolioData } from '../../config/portfolioData';

export default function SafariApp() {
  const [profile, setProfile] = useState(null);
  const [solvedStats, setSolvedStats] = useState(null);
  const [badgesData, setBadgesData] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(true);

  const [heatmapScrollLeft, setHeatmapScrollLeft] = useState(0);
  const heatmapRef = React.useRef(null);
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [browserUrl, setBrowserUrl] = useState(`leetcode.com/u/${portfolioData.leetcodeUrl.split('/u/')[1]?.replace('/', '') || 'iamarunaksha'}`);
  const [inputUrl, setInputUrl] = useState(browserUrl);
  
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, count: 0, date: '', type: 'heatmap', text: '' });
  
  const formatTooltipDate = (dateStr) => {
    if(!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let m = parseInt(month, 10) - 1;
    let d = parseInt(day, 10);
    return `${months[m]} ${d}, ${year}`;
  };

  const handleUrlSubmit = (e) => {
    if (e.key === 'Enter') {
      let url = inputUrl.trim();
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      setBrowserUrl(url);
    }
  };

  const handleMouseEnter = (e, block) => {
     if (!block.date) return;
     const rect = e.target.getBoundingClientRect();
     setTooltip({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top,
        count: block.count,
        date: block.date,
        type: 'heatmap'
     });
  };

  const handleBadgeHover = (e, badgeName) => {
     const rect = e.target.getBoundingClientRect();
     
     let formattedName = badgeName;
     if (formattedName.toLowerCase().includes('100 days')) {
        formattedName = '100 Days Badge';
     } else if (formattedName.toLowerCase().includes('50 days')) {
        formattedName = '50 Days';
     } else {
        formattedName = formattedName.replace(/\s\d{4}$/, '');
     }

     setTooltip({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top,
        type: 'badge',
        text: formattedName
     });
  };

  const handleMouseLeave = () => {
     setTooltip(prev => ({ ...prev, visible: false }));
  };
  
  const username = portfolioData.leetcodeUrl.split('/u/')[1]?.replace('/', '') || 'iamarunaksha';

  const fetchLCData = async () => {
    try {
      
      setLoading(true);
      setCalendarLoading(true);

      // Fetch all data in parallel — 4 endpoints for complete data
      const [userInfoRes, profileRes, badgesRes, calendarRes, submissionRes] = await Promise.all([
        fetch(`https://alfa-leetcode-api.onrender.com/${username}`).then(res => res.json()),
        fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`).then(res => res.json()),
        fetch(`https://alfa-leetcode-api.onrender.com/${username}/badges`).then(res => res.json()),
        fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar?year=${selectedYear}`).then(res => res.json()),
        fetch(`https://alfa-leetcode-api.onrender.com/${username}/submission`).then(res => res.json())
      ]);

      // --- Profile (from /{username} for avatar/name + /userProfile for stats) ---
      if (userInfoRes || profileRes) {
        setProfile({
          name: userInfoRes?.name || portfolioData.name || username,
          username: username,
          avatar: userInfoRes?.avatar || "",
          ranking: profileRes?.ranking || userInfoRes?.ranking || "N/A",
          reputation: profileRes?.reputation || userInfoRes?.reputation || 0,
          views: profileRes?.postViewCount || profileRes?.postViewCountV2 || "1000",
          solutions: profileRes?.solutionCount || profileRes?.totalSolved || 0,
          discuss: profileRes?.categoryDiscussCount || 50,
          gitHub: userInfoRes?.gitHub || portfolioData.githubUrl || "",
          linkedIN: userInfoRes?.linkedIN || portfolioData.linkedinUrl || "",
          country: userInfoRes?.country || "India"
        });
      }

      // --- Solved Stats from /userProfile ---
      if (profileRes) {
        setSolvedStats({
          solvedProblem: profileRes.totalSolved || 0,
          totalProblem: profileRes.totalQuestions || 3906,
          easySolved: profileRes.easySolved || 0,
          mediumSolved: profileRes.mediumSolved || 0,
          hardSolved: profileRes.hardSolved || 0,
          easyTotal: profileRes.totalEasy || 938,
          mediumTotal: profileRes.totalMedium || 2044,
          hardTotal: profileRes.totalHard || 924,
        });
      }

      // --- Badges from /{username}/badges ---
      if (badgesRes) {
        // Fix relative icon paths by prepending leetcode.com
        const fixedBadges = (badgesRes.badges || []).map(b => ({
          ...b,
          icon: b.icon.startsWith('/') ? `https://leetcode.com${b.icon}` : b.icon
        }));

        setBadgesData({
          badgesCount: badgesRes.badgesCount || 0,
          badges: fixedBadges,
          activeBadge: badgesRes.activeBadge ? {
            ...badgesRes.activeBadge,
            icon: badgesRes.activeBadge.icon.startsWith('/') 
              ? `https://leetcode.com${badgesRes.activeBadge.icon}` 
              : badgesRes.activeBadge.icon
          } : null,
          upcomingBadges: badgesRes.upcomingBadges || []
        });
      }

      // --- Calendar with year-specific data ---
      if (calendarRes) {
        const years = (calendarRes.activeYears || []).sort((a, b) => b - a);
        
        let calStr = calendarRes.submissionCalendar || "{}";
        if (typeof calStr === 'object') {
          calStr = JSON.stringify(calStr);
        }

        setCalendar({
          submissionCalendar: calStr,
          activeYears: years,
          totalActiveDays: calendarRes.totalActiveDays || 0,
          streak: calendarRes.streak || 0
        });
      }

      // --- Recent Submissions ---
      if (submissionRes && submissionRes.submission) {
        setRecentActivity(submissionRes.submission.filter(s => s.statusDisplay === 'Accepted'));
      }

      setLoading(false);
      setCalendarLoading(false);
    } catch (err) {
      console.error("Failed to fetch LeetCode data via Alfa API:", err);
      setLoading(false);
      setCalendarLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLCData();
  }, [username]);
  
  // Refetch calendar data when year changes — API supports ?year= param
  useEffect(() => {
    if (!calendar) return; // Skip on initial render before first fetch
    const fetchYearCalendar = async () => {
      try {
        setCalendarLoading(true);
        const calendarRes = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar?year=${selectedYear}`).then(r => r.json());
        if (calendarRes) {
          let calStr = calendarRes.submissionCalendar || "{}";
          if (typeof calStr === 'object') calStr = JSON.stringify(calStr);
          setCalendar(prev => ({
            ...prev,
            submissionCalendar: calStr,
            totalActiveDays: calendarRes.totalActiveDays || 0,
            streak: calendarRes.streak || 0
          }));
        }
        setCalendarLoading(false);
      } catch (err) {
        console.error("Failed to fetch year calendar:", err);
        setCalendarLoading(false);
      }
    };
    fetchYearCalendar();
  }, [selectedYear]);

  // Process Heatmap Data
  const generateHeatmapBlocks = () => {
    if (!calendar || !calendar.submissionCalendar) return [];
    const parsed = JSON.parse(calendar.submissionCalendar);
    const subMap = {};
    
    // Process Unix TS into "YYYY-MM-DD" local format
    for (const [ts, count] of Object.entries(parsed)) {
      const date = new Date(parseInt(ts) * 1000);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const ds = `${y}-${m}-${d}`;
      subMap[ds] = (subMap[ds] || 0) + count;
    }

    const monthsData = [];
    for (let m = 0; m < 12; m++) {
      const monthBlocks = [];
      const startDate = new Date(selectedYear, m, 1);
      const endDate = new Date(selectedYear, m + 1, 0); // Last day of month
      
      // Calculate offset for current month (0: Sunday, 6: Saturday)
      const offset = startDate.getDay();
      for (let i = 0; i < offset; i++) {
        monthBlocks.push({ date: null, count: 0, level: -1 });
      }

      let current = new Date(startDate);
      while (current <= endDate) {
        const yStr = current.getFullYear();
        const mStr = String(current.getMonth() + 1).padStart(2, '0');
        const dStr = String(current.getDate()).padStart(2, '0');
        const ds = `${yStr}-${mStr}-${dStr}`;
        const count = subMap[ds] || 0;
        
        let level = 0;
        if (count === 1) level = 1;
        else if (count >= 2 && count <= 3) level = 2;
        else if (count >= 4 && count <= 5) level = 3;
        else if (count >= 6) level = 4;

        monthBlocks.push({ date: ds, count, level });
        current.setDate(current.getDate() + 1);
      }
      monthsData.push(monthBlocks);
    }
    return monthsData;
  };

  const getHeatmapColor = (level) => {
    if (level === -1) return 'transparent';
    const colors = ['#2B2B2B', '#0e4429', '#006d32', '#26a641', '#39d353'];
    return colors[level] || colors[0];
  };

  const blocks = generateHeatmapBlocks();

  return (
    <div className="w-full h-full flex flex-col bg-[#1A1A1A] text-white font-sans overflow-hidden">
      
      {/* Tooltip fixed layer */}
      {tooltip.visible && (
         <div 
           className="fixed z-50 bg-[#282828] border border-[#404040] shadow-xl text-white text-[12px] px-3 py-1.5 rounded-md pointer-events-none transform -translate-x-1/2 -translate-y-full transition-opacity duration-150 whitespace-nowrap"
           style={{ left: tooltip.x, top: tooltip.y - 6 }}
         >
           {tooltip.type === 'heatmap' ? (
             <><span className="font-semibold text-white">{tooltip.count} submissions</span> <span className="text-[#8C8C8C]">on {formatTooltipDate(tooltip.date)}</span></>
           ) : (
             <span className="font-semibold text-white">{tooltip.text}</span>
           )}
           <div className="absolute left-1/2 bottom-[-5px] transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#404040]"></div>
           <div className="absolute left-1/2 bottom-[-4px] transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#282828]"></div>
         </div>
      )}

      {/* Safari MacOS Header Frame */}
      <div className="h-12 bg-[#2D2D2D] border-b border-[#1A1A1A] flex items-center px-4 shrink-0 shadow-sm relative z-10 w-full rounded-t-lg">
        {/* Left window controls spacer */}
        <div className="flex gap-3 w-16"></div>
        {/* Nav arrows */}
        <div className="flex gap-2 text-[#8C8C8C]">
          <svg className="w-5 h-5 cursor-text opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          <svg className="w-5 h-5 cursor-text opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </div>
        {/* Address Bar */}
        <div className="flex-1 max-w-xl mx-auto ml-6 mr-6">
          <div className="bg-[#1A1A1A] border border-[#404040] rounded-md h-7 flex items-center px-3 gap-2 cursor-text group">
            <svg className="w-3 h-3 text-[#8C8C8C]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
            <input 
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleUrlSubmit}
              className="bg-transparent border-none outline-none text-[#CCCCCC] text-[13px] font-medium tracking-wide w-full"
            />
          </div>
        </div>
        <div className="w-16"></div>
      </div>

      {/* LeetCode Page Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#1A1A1A]">
        {!browserUrl.includes('leetcode.com') ? (
           <div className="w-full h-full relative group bg-white">
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1A1A] z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500">
                <svg className="w-16 h-16 text-[#404040] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <p className="text-[#8C8C8C] text-sm">Most sites block embedding for security.</p>
                <a 
                  href={browserUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-4 px-6 py-2 bg-[#404040] rounded-full text-white text-[13px] font-medium hover:bg-[#505050] transition pointer-events-auto"
                >
                  Open in New Tab
                </a>
             </div>
             <iframe 
               src={browserUrl} 
               className="w-full h-full border-none bg-white relative z-0" 
               title="Browser Content"
             />
           </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <svg className="w-12 h-12 text-[#FFA116] mb-4" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125 2.513 5.3 5.3 0 0 0 1.633 2.874l5.622 5.06a5.36 5.36 0 0 0 2.139 1.146 5.344 5.344 0 0 0 2.643.084 5.284 5.284 0 0 0 2.3-1.157l1.276-1.353a.534.534 0 0 0-.767-.732l-1.305 1.393a4.228 4.228 0 0 1-3.12 1.395 4.3 4.3 0 0 1-3.123-1.29L3.597 17.26a4.25 4.25 0 0 1-1.306-2.302 4.25 4.25 0 0 1 .1-2.025 4.229 4.229 0 0 1 .97-1.688l3.854-4.124 5.405-5.787a.384.384 0 0 1 .28-.112.38.38 0 0 1 .28.11l9.141 9.773a.53.53 0 0 0 .768.733l-9.141-9.774A1.374 1.374 0 0 0 13.483 0zm4.567 13.916l-7.393 7.915a.535.535 0 0 0 .768.732l7.394-7.915a.535.535 0 0 0-.769-.733z"/>
              </svg>
              <div className="text-[#8C8C8C] text-sm">Loading LeetCode Data...</div>
            </div>
          </div>
        ) : !profile ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] text-[#8C8C8C] p-8">
            <h2 className="text-xl font-bold mb-2">Notice</h2>
            <p className="text-center mb-8 max-w-sm text-[14px]">
              The LeetCode data is currently unavailable. Please verify your username in the URL bar or try again later.
            </p>
            <button 
              onClick={() => fetchLCData()} 
              className="px-6 py-2.5 bg-[#333333] hover:bg-[#444444] rounded-lg font-medium transition text-sm text-white"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="max-w-[1200px] mx-auto p-4 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 mt-2">
            
            {/* Left Column: Official Sidebar Profile Section */}
            {/* ITEM 1: Identity Card */}
            <div className="bg-[#262626] rounded-xl p-4 shadow-sm border border-[#333333] flex flex-col justify-center h-full order-1">
               <div className="flex gap-4 items-start mb-4">
                    <img 
                      src={profile.avatar} 
                      alt="Avatar" 
                      className="w-20 h-20 rounded-lg object-cover bg-black border border-[#404040]"
                    />
                    <div className="flex flex-col pt-1">
                      <div className="flex items-center gap-1">
                        <h2 className="text-[17px] font-bold text-white leading-tight">{profile.name}</h2>
                        <svg className="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </div>
                      <p className="text-[12px] text-[#8C8C8C] mt-0.5">{profile.username}</p>
                      <div className="mt-2 text-[13px] text-white">
                         Rank <span className="font-bold">{profile.ranking?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 text-[#8C8C8C] text-[13px]">
                    <div className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-[#8C8C8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                       <span>India</span>
                    </div>
                    <a href={profile.gitHub?.startsWith('http') ? profile.gitHub : `https://github.com/${profile.gitHub}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group cursor-pointer">
                       <svg className="w-4 h-4 text-[#8C8C8C] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.11.82-.26.82-.577v-2.165c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.235 1.84 1.235 1.07 1.835 2.809 1.305 3.495.998.108-.776.42-1.305.76-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.125-.3-.535-1.524.115-3.175 0 0 1.005-.32 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.55 3.285-1.23 3.285-1.23.655 1.65.245 2.875.12 3.175.77.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                       <span className="truncate max-w-[180px] group-hover:text-white transition-colors">{profile.gitHub ? profile.gitHub.replace(/https?:\/\/(www\.)?github\.com\//, '') : profile.username}</span>
                    </a>
                    <a href={profile.linkedIN?.startsWith('http') ? profile.linkedIN : `https://linkedin.com/in/${profile.linkedIN}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group cursor-pointer">
                       <svg className="w-4 h-4 text-[#8C8C8C] group-hover:text-[#0A66C2] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                       <span className="truncate max-w-[180px] group-hover:text-white transition-colors">{profile.linkedIN ? profile.linkedIN.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '') : profile.username}</span>
                    </a>
                  </div>
               </div>

               {/* ITEM 3: Community Stats Card */}
               <div className="bg-[#262626] rounded-xl p-4 shadow-sm border border-[#333333] flex flex-col justify-center h-full order-3">
                  <h3 className="text-[13px] font-bold text-white mb-4">Community Stats</h3>
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-blue-400 opacity-90"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg></div>
                        <div className="flex flex-col">
                           <span className="text-[13px] text-white">Views <span className="font-bold text-[14px] ml-1">{profile.views}</span></span>
                           <span className="text-[11px] text-[#2DB55D] font-medium leading-none mt-0.5">Last week <span className="font-bold">+100</span></span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-blue-500 opacity-90"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v4h2v-4h3l-4-4-4 4h3z"/></svg></div>
                        <div className="flex flex-col">
                           <span className="text-[13px] text-white">Solution <span className="font-bold text-[14px] ml-1">{profile.solutions}</span></span>
                           <span className="text-[11px] text-[#8C8C8C] font-medium leading-none mt-0.5">Last week <span className="font-bold">5</span></span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-teal-400 opacity-90"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></div>
                        <div className="flex flex-col">
                           <span className="text-[13px] text-white">Discuss <span className="font-bold text-[14px] ml-1">{profile.discuss}</span></span>
                           <span className="text-[11px] text-[#8C8C8C] font-medium leading-none mt-0.5">Last week <span className="font-bold">50</span></span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-[#FFA116] opacity-90"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>
                        <div className="flex flex-col">
                           <span className="text-[13px] text-white">Reputation <span className="font-bold text-[14px] ml-1">{profile.reputation}</span></span>
                           <span className="text-[11px] text-[#8C8C8C] font-medium leading-none mt-0.5">Last week <span className="font-bold">0</span></span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* ITEM 2: Top Row: Solved Stats & Badges */}
               <div className="grid grid-cols-1 lg:grid-cols-[minmax(420px,_1.5fr)_1fr] gap-4 h-full min-w-0 order-2">
                  
                  {/* Advanced Solved Card - Polished Layout */}
                  <div className="bg-[#262626] rounded-xl p-5 shadow-sm border border-[#333333] flex items-center gap-8 min-h-[160px] h-full">
                     {/* Circular Ring SVG - Precise Segment Alignment */}
                     <div className="relative w-[110px] h-[110px] shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                           {/* BG circle */}
                           <circle cx="50" cy="50" r="46" stroke="#333333" strokeWidth="4" fill="transparent" />
                           {/* Easy Segment */}
                           <circle 
                             cx="50" cy="50" r="46" stroke="#00B8A3" strokeWidth="4.5" fill="transparent" strokeLinecap="round" 
                             style={{ strokeDasharray: 289, strokeDashoffset: 289 - ((solvedStats?.easySolved || 0) / (solvedStats?.totalProblem || 3892)) * 289, transition: 'all 1.5s ease-out' }}
                           />
                           {/* Med Segment */}
                           <circle 
                             cx="50" cy="50" r="46" stroke="#FFC01E" strokeWidth="4.5" fill="transparent" strokeLinecap="round" 
                             style={{ 
                               strokeDasharray: 289, 
                               strokeDashoffset: 289 - ((solvedStats?.mediumSolved || 0) / (solvedStats?.totalProblem || 3892)) * 289, 
                               transform: `rotate(${(solvedStats?.easySolved / solvedStats?.totalProblem) * 360}deg)`, 
                               transformOrigin: 'center',
                               transition: 'all 1.5s ease-out' 
                             }}
                           />
                           {/* Hard Segment */}
                           <circle 
                             cx="50" cy="50" r="46" stroke="#EF4743" strokeWidth="4.5" fill="transparent" strokeLinecap="round" 
                             style={{ 
                               strokeDasharray: 289, 
                               strokeDashoffset: 289 - ((solvedStats?.hardSolved || 0) / (solvedStats?.totalProblem || 3892)) * 289, 
                               transform: `rotate(${((solvedStats?.easySolved + solvedStats?.mediumSolved) / solvedStats?.totalProblem) * 360}deg)`, 
                               transformOrigin: 'center',
                               transition: 'all 1.5s ease-out' 
                             }}
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                           <div className="text-[20px] font-bold text-white leading-tight">
                              {solvedStats?.solvedProblem}
                           </div>
                           <div className="text-[12px] text-[#8C8C8C] leading-none mb-1">/{solvedStats?.totalProblem}</div>
                           <div className="text-[11px] text-[#00B8A3] font-bold">
                              Solved
                           </div>
                        </div>
                     </div>

                     {/* Difficulty Bars - Widen and Refined Spacing */}
                     <div className="flex-1 flex flex-col gap-4 pr-2">
                        <div className="flex flex-col">
                           <div className="flex justify-between items-center text-[12px] mb-1.5">
                              <span className="text-[#8C8C8C] font-medium">Easy</span>
                              <span className="text-white font-bold">{solvedStats?.easySolved} <span className="text-[#8C8C8C] font-normal text-[11px]">/ {solvedStats?.easyTotal}</span></span>
                           </div>
                           <div className="h-1.5 w-full bg-[#353535] rounded-full overflow-hidden">
                              <div className="h-full bg-[#00B8A3] rounded-full transition-all duration-1000" style={{ width: `${(solvedStats.easySolved/solvedStats.easyTotal)*100}%` }}></div>
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <div className="flex justify-between items-center text-[12px] mb-1.5">
                              <span className="text-[#8C8C8C] font-medium">Medium</span>
                              <span className="text-white font-bold">{solvedStats?.mediumSolved} <span className="text-[#8C8C8C] font-normal text-[11px]">/ {solvedStats?.mediumTotal}</span></span>
                           </div>
                           <div className="h-1.5 w-full bg-[#353535] rounded-full overflow-hidden">
                              <div className="h-full bg-[#FFC01E] rounded-full transition-all duration-1000" style={{ width: `${(solvedStats.mediumSolved/solvedStats.mediumTotal)*100}%` }}></div>
                           </div>
                        </div>
                        <div className="flex flex-col">
                           <div className="flex justify-between items-center text-[12px] mb-1.5">
                              <span className="text-[#8C8C8C] font-medium">Hard</span>
                              <span className="text-white font-bold">{solvedStats?.hardSolved} <span className="text-[#8C8C8C] font-normal text-[11px]">/ {solvedStats?.hardTotal}</span></span>
                           </div>
                           <div className="h-1.5 w-full bg-[#353535] rounded-full overflow-hidden">
                              <div className="h-full bg-[#EF4743] rounded-full transition-all duration-1000" style={{ width: `${(solvedStats.hardSolved/solvedStats.hardTotal)*100}%` }}></div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Badges Widget */}
                  <div className="bg-[#262626] rounded-xl p-4 shadow-sm border border-[#333333] flex flex-col justify-between h-full">
                     <div className="flex justify-between items-center">
                        <span className="text-[13px] text-[#8C8C8C] font-semibold flex items-center gap-1.5">
                           Badges
                           <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                        </span>
                     </div>
                     <div className="text-[28px] font-bold text-white mt-1">{badgesData?.badgesCount || 0}</div>
                     <div className="flex gap-3 mt-2 mb-2 items-center flex-wrap justify-center">
                        {badgesData?.badges?.slice(0, 4).map((badge, i) => (
                          <img 
                            key={i} 
                            src={badge.icon} 
                            alt={badge.displayName} 
                            onMouseEnter={(e) => handleBadgeHover(e, badge.displayName)}
                            onMouseLeave={handleMouseLeave}
                            className="w-12 h-12 object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.05)] hover:scale-110 transition cursor-pointer"
                          />
                        ))}
                     </div>
                     <div>
                        <p className="text-[#8C8C8C] text-[11px]">Most Recent Badge</p>
                        <p className="text-[13px] font-bold text-white mt-0.5">{badgesData?.badges?.[0]?.displayName || "Loading..."}</p>
                     </div>
                  </div>
               </div>

               {/* ITEM 4: Submission Heatmap Section */}
               <div className="bg-[#262626] rounded-xl p-6 shadow-sm border border-[#333333] flex flex-col justify-between h-full min-w-0 overflow-hidden order-4">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-[16px] font-bold text-white">
                        {blocks.flat().reduce((acc, b) => acc + (b.count || 0), 0)} submissions in {selectedYear}
                     </h3>
                     <div className="flex items-center gap-4 text-[13px] text-[#8C8C8C]">
                        <span>Total active days: <span className="text-white font-bold">{calendar?.totalActiveDays || 0}</span></span>
                        <span>Max streak: <span className="text-white font-bold">{calendar?.streak || 0}</span></span>
                        
                        {/* Interactive Dynamic Year Selector */}
                        <div className="relative">
                           <button 
                             onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                             className="bg-[#333333] px-3 py-1.5 rounded-lg text-white font-medium flex items-center gap-2 cursor-pointer border border-[#444444] text-[12px] hover:bg-[#404040] transition"
                           >
                              {selectedYear} <svg className="w-3 h-3 text-[#8C8C8C]" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                           </button>
                           {isYearDropdownOpen && (
                              <div className="absolute right-0 top-full mt-2 w-24 bg-[#282828] border border-[#404040] rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                                {calendar?.activeYears?.map(yr => (
                                   <div 
                                     key={yr} 
                                     onClick={() => { setSelectedYear(yr); setIsYearDropdownOpen(false); }}
                                     className={`px-3 py-2 text-[12px] cursor-pointer hover:bg-[#404040] transition ${selectedYear === yr ? "text-[#FFA116] font-bold" : "text-white"}`}
                                   >
                                      {yr}
                                   </div>
                                ))}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Heatmap Layout with Hidden Scrollbar */}
                  <div className="relative group/heatmap w-full">
                     {/* Scroll Left */}
                     {heatmapScrollLeft > 0 && (
                        <button 
                          onClick={() => heatmapRef.current?.scrollBy({ left: -350, behavior: 'smooth' })}
                          className="absolute left-0 top-0 bottom-[40px] w-12 bg-gradient-to-r from-[#262626] via-[#262626]/80 to-transparent flex items-center justify-start opacity-0 group-hover/heatmap:opacity-100 transition-opacity duration-200 z-10 pointer-events-none"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#3A3A3A] shadow-[0_0_8px_rgba(0,0,0,0.5)] border border-[#4D4D4D] flex items-center justify-center text-white hover:bg-[#4A4A4A] transition-colors pointer-events-auto cursor-pointer ml-1">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                          </div>
                        </button>
                      )}

                     {/* Scroll Right */}
                     <button 
                       onClick={() => heatmapRef.current?.scrollBy({ left: 350, behavior: 'smooth' })}
                       className="absolute right-0 top-0 bottom-[40px] w-12 bg-gradient-to-l from-[#262626] via-[#262626]/80 to-transparent flex items-center justify-end opacity-0 group-hover/heatmap:opacity-100 transition-opacity duration-200 z-10 pointer-events-none"
                     >
                        <div className="w-7 h-7 rounded-full bg-[#3A3A3A] shadow-[0_0_8px_rgba(0,0,0,0.5)] border border-[#4D4D4D] flex items-center justify-center text-white hover:bg-[#4A4A4A] transition-colors pointer-events-auto cursor-pointer mr-1">
                           <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </div>
                     </button>

                     <div 
                       ref={heatmapRef}
                       onScroll={(e) => setHeatmapScrollLeft(e.target.scrollLeft)} 
                       className="flex overflow-x-auto overflow-y-hidden gap-4 pb-2 no-scrollbar scroll-smooth relative z-0"
                       style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                     >
                        {["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].map((monthKey, mIdx) => {
                        const monthBlocks = blocks[mIdx] || [];
                        const isMonthFullySolved = monthBlocks.length > 0 && monthBlocks.filter(b => b.date).every(b => b.count > 0);
                        
                        return (
                           <div key={mIdx} className="flex flex-col items-center gap-2 shrink-0">
                              <div className="grid grid-rows-7 grid-flow-col gap-[3.5px]">
                                 {monthBlocks.map((b, i) => (
                                    <div 
                                      key={i} 
                                      onMouseEnter={(e) => handleMouseEnter(e, b)}
                                      onMouseLeave={handleMouseLeave}
                                      className={`w-[12px] h-[12px] rounded-[2.5px] transition-shadow ${b.level === -1 ? "opacity-0 pointer-events-none" : "hover:ring-1 hover:ring-white/40 cursor-pointer"}`} 
                                      style={{ backgroundColor: b.level === -1 ? 'transparent' : getHeatmapColor(b.level) }}
                                    />
                                 ))}
                              </div>
                              
                              <div className="mt-2 w-8 h-8 flex items-center justify-center">
                                 {isMonthFullySolved ? (
                                    <div className="group relative w-full h-full flex items-center justify-center">
                                       <img src={`/leetcode-icons/${monthKey}.png`} alt={`${monthKey}`} className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,161,22,0.15)] group-hover:scale-110 transition duration-300" onError={(e) => { e.target.style.display = 'none'; }} />
                                    </div>
                                 ) : (
                                    <div className="text-[10px] font-bold text-[#8C8C8C] uppercase tracking-tighter opacity-60">
                                       {monthKey}
                                    </div>
                                 )}
                              </div>
                           </div>
                        );
                     })}
                     </div>
                  </div>

                  {/* <div className="mt-8 flex items-center justify-between text-[11px] text-[#8C8C8C] border-t border-[#333333] pt-4">
                     <span className="opacity-0">Placeholder</span>
                     <div className="flex items-center gap-1.5 font-medium">
                        <span className="mr-1 opacity-70">Less</span>
                        <div className="w-[11px] h-[11px] rounded-[2px] bg-[#2B2B2B]"></div>
                        <div className="w-[11px] h-[11px] rounded-[2px] bg-[#0e4429]"></div>
                        <div className="w-[11px] h-[11px] rounded-[2px] bg-[#006d32]"></div>
                        <div className="w-[11px] h-[11px] rounded-[2px] bg-[#26a641]"></div>
                        <div className="w-[11px] h-[11px] rounded-[2px] bg-[#39d353]"></div>
                        <span className="ml-1 opacity-70">More</span>
                     </div>
                  </div> */}
               </div>
               
          </div>
        )}
      </div>
    </div>
  );
}
