import { VscMenu, VscClose } from 'react-icons/vsc';

export default function BottomInterface({
  lesson,
  currentInput,
  isTerminalOpen,
  onAction,
  onType,
  isSidebarOpen,
  onToggleSidebar,
  currentDirectory
}) {
  return (
    <div className="flex-1 bg-[#1a1a1a] border-t-2 border-[#333] p-4 flex flex-col justify-between select-none shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-10">

      {/* Lesson Description */}
      <div className="mb-4 text-gray-300 text-sm md:text-base leading-relaxed pr-2">
        <div className="flex items-center mb-1">
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 mr-2 bg-[#2d2d2d] rounded-full shadow flex items-center justify-center text-white md:hidden hover:bg-gray-700 transition-colors shrink-0"
          >
            {isSidebarOpen ? <VscClose size={18} /> : <VscMenu size={18} />}
          </button>
          <h3 className="font-bold text-white text-lg">{lesson.title}</h3>
        </div>
        <p>{lesson.description}</p>
      </div>

      {/* User Input Display */}
      <div className="bg-[#1e1e1e] border border-[#444] rounded p-2 mb-4 font-mono text-[10px] sm:text-xs text-green-400 min-h-[40px] flex items-center overflow-x-hidden">
        {isTerminalOpen ? (
          <span className="text-white mr-2 whitespace-nowrap"><span className="text-green-500">qanty@linux-mint</span>:<span className="text-blue-400">{currentDirectory}</span>$</span>
        ) : (
          <span className="text-white mr-2 whitespace-nowrap">$</span>
        )}
        <span className="break-all">{currentInput}<span className="animate-pulse bg-white/50 w-2 h-4 inline-block ml-1 align-middle"></span></span>
      </div>

      {/* Interactive Buttons */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {lesson.buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => isTerminalOpen && onType(btn.value || btn.label)}
              disabled={!isTerminalOpen && btn.label !== "ctrl + alt + t"}
              className={`px-4 py-2 rounded font-semibold text-sm transition-transform active:scale-95 shadow-md ${!isTerminalOpen && btn.label !== "ctrl + alt + t"
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-[#2d2d2d] text-gray-200 hover:bg-[#3d3d3d] border border-[#444]'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Actions (Fixed Bottom) */}
      <div className="pt-2 border-t border-[#333] flex flex-wrap gap-2 mt-auto">
        <button
          onClick={() => onAction('ctrl+alt+t')}
          className="flex-[1.5] py-2 md:py-3 bg-[#0d47a1] hover:bg-[#1565c0] text-white rounded font-bold transition-all active:scale-95 shadow-lg whitespace-nowrap text-xs md:text-sm"
        >
          ctrl + alt + t
        </button>
        <button
          onClick={() => isTerminalOpen && onAction('clean')}
          disabled={!isTerminalOpen}
          className={`flex-1 py-2 md:py-3 rounded font-bold transition-all active:scale-95 shadow-lg text-xs md:text-sm ${isTerminalOpen ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-gray-800 text-gray-600'
            }`}
        >
          ctrl + c (cancelar)
        </button>
        <button
          onClick={() => isTerminalOpen && onAction('enter')}
          disabled={!isTerminalOpen}
          className={`flex-[1.2] py-2 md:py-3 rounded font-bold transition-all active:scale-95 shadow-lg text-xs md:text-sm ${isTerminalOpen ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-gray-800 text-gray-600'
            }`}
        >
          [ Enter ]
        </button>
      </div>

    </div>
  );
}
