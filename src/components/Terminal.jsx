import { useRef, useEffect } from 'react';
import { VscClose, VscChromeMinimize, VscChromeMaximize } from 'react-icons/vsc';

export default function Terminal({ isOpen, onClose, history, currentDirectory }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute bg-[#300a24] flex flex-col shadow-2xl z-20 w-full h-full">
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
      </div>
    </div>
  );
}
