import { VscTerminalBash, VscSearch } from 'react-icons/vsc';
import { useState, useEffect } from 'react';

const SEARCH_TERMS = ["terminal", "consola", "console", "comandos", "term", "shell", "xterm"];

export default function StartMenu({ isOpen, onTerminalOpen }) {
  const [searchTermIndex, setSearchTermIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSearchTermIndex(prev => (prev + 1) % SEARCH_TERMS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-8 left-0 w-64 bg-[#2a2a2a] border border-[#333] shadow-[0_-5px_15px_rgba(0,0,0,0.5)] rounded-tr-md flex flex-col z-30 select-none">
      {/* Search Bar */}
      <div className="p-2 border-b border-[#333]">
        <div className="bg-[#1a1a1a] rounded flex items-center p-1 border border-[#444]">
          <VscSearch className="text-gray-400 mx-2" />
          <input
            type="text"
            value={SEARCH_TERMS[searchTermIndex]}
            readOnly
            className="bg-transparent text-white outline-none w-full text-sm"
          />
        </div>
      </div>
      {/* Applications List */}
      <div className="flex-1 p-2">
        <div
          className="flex items-center space-x-2 p-2 hover:bg-[#3d3d3d] rounded cursor-pointer transition-colors"
          onClick={onTerminalOpen}
        >
          <VscTerminalBash size={24} className="text-gray-300" />
          <div className="flex flex-col">
            <span className="text-white text-sm font-semibold">Terminal</span>
            <span className="text-gray-400 text-xs">use la línea de comandos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
