import { VscMenu, VscClose } from 'react-icons/vsc';

export default function BottomInterface({
  lesson,
  currentInput,
  isTerminalOpen,
  onAction,
  onType,
  isSidebarOpen,
  onToggleSidebar,
  currentDirectory,
  explanation,
  challengeCompleted,
  secretFileDiscovered,
  isLastLesson
}) {
  return (
    <div className="flex-1 bg-[#1a1a1a] border-t-2 border-[#333] p-4 flex flex-col justify-between select-none shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-10">

      {/* Lesson Description */}
      <div className="mb-4 text-gray-300 text-sm md:text-base leading-relaxed pr-2">
        <div className="flex items-center mb-1">
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 mr-2 bg-[#2d2d2d] rounded-full shadow flex items-center justify-center text-white hover:bg-gray-700 transition-colors shrink-0"
          >
            {isSidebarOpen ? <VscClose size={18} /> : <VscMenu size={18} />}
          </button>
          <div className="flex-1 flex items-center pr-2">
            <h3 className="font-bold text-white text-lg flex items-center gap-3">
              {lesson.title}
              {lesson.isChallenge && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors duration-300 ${challengeCompleted ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-[#333] text-gray-400 border border-[#555]'}`}>
                  {challengeCompleted ? '[✓] ¡Completado!' : '[ ] Incompleto'}
                </span>
              )}
            </h3>
          </div>
        </div>
        <p>{lesson.description}</p>
      </div>

      {explanation && (
        <div className="bg-[#0f2942] border border-[#1e4e8c] rounded p-3 mb-4 text-blue-100 text-sm shadow-md animate-pulse-once">
           <h4 className="font-bold text-blue-300 mb-1 flex items-center gap-1">
             <span role="img" aria-label="info">💡</span> Explicación:
           </h4>
           <p className="whitespace-pre-wrap leading-relaxed">{explanation}</p>
        </div>
      )}

      {/* Interactive Buttons */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {lesson.buttons.map((btn, i) => {
            if (btn.value === ".secret_password.txt" && !secretFileDiscovered) return null;
            return (
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
            );
          })}
        </div>
      </div>

      {/* Global Actions (Fixed Bottom) */}
      <div className="pt-2 border-t border-[#333] flex flex-wrap gap-2 mt-auto">
        <button
          onClick={() => onAction('ctrl+alt+t')}
          className="flex-1 py-2 md:py-3 bg-[#0d47a1] hover:bg-[#1565c0] text-white rounded font-bold transition-all active:scale-95 shadow-lg whitespace-nowrap text-xs md:text-sm"
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
          className={`flex-1 py-2 md:py-3 rounded font-bold transition-all active:scale-95 shadow-lg text-xs md:text-sm ${isTerminalOpen ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-gray-800 text-gray-600'
            }`}
        >
          [ Enter ]
        </button>
        {challengeCompleted && !isLastLesson && (
          <button
             onClick={() => onAction('next_lesson')}
             className="flex-1 py-2 md:py-3 rounded font-bold shadow-lg text-xs md:text-sm bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white animate-[fadeIn_0.5s_ease-out] transition-all active:scale-95"
          >
            Próximo Reto
          </button>
        )}
      </div>

    </div>
  );
}
