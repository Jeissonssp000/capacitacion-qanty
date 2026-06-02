import { useRef, useEffect } from 'react';
import { VscClose, VscChromeMinimize, VscChromeMaximize } from 'react-icons/vsc';

export default function Terminal({ isOpen, onClose, history, currentDirectory, currentInput, isRunning, onType, onEnter, onCtrlC }) {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen, currentInput]);

  useEffect(() => {
    if (isOpen && inputRef.current && !isRunning) {
      inputRef.current.focus();
    }
  }, [isOpen, isRunning]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      onCtrlC();
    } else if (e.key === 'Enter') {
      onEnter();
    }
  };

  return (
    <div 
      className="absolute bg-[#300a24] flex flex-col shadow-2xl z-20 w-full h-full"
      onClick={() => inputRef.current && !isRunning && inputRef.current.focus()}
    >
      {/* Window Header */}
      <div className="h-6 bg-[#3b3a39] flex items-center justify-between px-2 cursor-default select-none border-b border-black/50">
        <div className="text-gray-300 text-xs font-semibold">qanty@linux-mint: {currentDirectory}</div>
        <div className="flex items-center space-x-1">
          <button className="w-4 h-4 flex items-center justify-center hover:bg-white/20 rounded-full text-gray-400">
            <VscChromeMinimize size={12} />
          </button>
          <button className="w-4 h-4 flex items-center justify-center hover:bg-white/20 rounded-full text-gray-400">
            <VscChromeMaximize size={12} />
          </button>
          <button onClick={onClose} className="w-4 h-4 flex items-center justify-center hover:bg-red-500 rounded-full text-gray-400 hover:text-white">
            <VscClose size={12} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        style={{scrollbarWidth: 'thin', scrollbarColor: '#666 #333'}}
        className="flex-1 p-2 overflow-y-auto text-green-400 font-mono text-[10px] sm:text-xs md:text-sm leading-tight whitespace-pre-wrap break-all"
      >
        {history.map((line, i) => (
          <div key={i} className={line.isCommand ? "" : "font-bold text-white mb-2"}>
            {line.isCommand ? (
              <span className="text-green-400 font-bold">
                <span className="text-green-500">qanty@linux-mint</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">{line.dir || "~"}</span>
                <span className="text-white">$ </span>
                {line.text}
              </span>
            ) : (
              <span>{line.text}</span>
            )}
          </div>
        ))}
        
        {/* Current Input Line */}
        {!isRunning && (
          <div className="text-green-400 font-bold flex">
            <span>
              <span className="text-green-500">qanty@linux-mint</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">{currentDirectory}</span>
              <span className="text-white">$ </span>
            </span>
            <span className="flex-1 relative ml-1">
              <input 
                ref={inputRef}
                type="text"
                value={currentInput || ""}
                onChange={(e) => onType(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 opacity-0 cursor-default"
                autoFocus
                autoCapitalize="off"
                spellCheck="false"
                autoComplete="off"
              />
              <span className="break-all">{currentInput}</span>
              <span className="animate-pulse bg-white/50 w-2 h-4 inline-block align-middle"></span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
