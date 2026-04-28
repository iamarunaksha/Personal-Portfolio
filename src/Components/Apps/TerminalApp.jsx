import React, { useState, useRef, useEffect } from 'react';
import { portfolioData } from '../../config/portfolioData';

export default function TerminalApp() {
  const [history, setHistory] = useState([
    { type: 'output', text: `Last login: ${new Date().toDateString()} on console` },
    { type: 'output', text: `Welcome to ${portfolioData.name}'s Portfolio CLI.` },
    { type: 'output', text: `Type 'help' to see available commands.` }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setHistory(prev => [...prev, { type: 'input', text: cmd }]);
      setInput('');

      // Process Command
      setTimeout(() => {
        let output = '';
        switch (cmd.toLowerCase()) {
          case 'help':
            output = `Available commands:\n- whoami : prints about me\n- skills : lists technical skills\n- clear  : clears the terminal`;
            break;
          case 'whoami':
            output = portfolioData.aboutMe;
            break;
          case 'skills':
            output = portfolioData.skills.join('  •  ');
            break;
          case 'clear':
            setHistory([]);
            return; // Skip adding output
          case '':
            return; // Empty command
          default:
            output = `zsh: command not found: ${cmd}`;
        }
        setHistory(prev => [...prev, { type: 'output', text: output }]);
      }, 100);
    }
  };

  return (
    <div className="w-full h-full bg-[#1C1C1E] text-white/90 font-mono text-[13px] p-2 flex flex-col pt-8">
      {/* Scrollable Output Area */}
      <div className="flex-1 overflow-y-auto px-2">
        {history.map((line, i) => (
          <div key={i} className="mb-1 whitespace-pre-wrap">
            {line.type === 'input' ? (
              <div>
                <span className="text-green-400">➜</span> <span className="text-blue-400">~</span> {line.text}
              </div>
            ) : (
              <div className="text-gray-300">{line.text}</div>
            )}
          </div>
        ))}
        
        {/* Active Input Line */}
        <div className="flex items-center mt-1">
          <span className="text-green-400 mr-2">➜</span> 
          <span className="text-blue-400 mr-2">~</span>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent outline-none border-none text-white/90"
            autoFocus
            spellCheck="false"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
