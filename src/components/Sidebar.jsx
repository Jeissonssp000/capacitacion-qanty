
export default function Sidebar({ isOpen, onToggle, lessons, currentClass, onSelectClass }) {
  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onToggle}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-[#1e1e1e] border-r border-[#333] z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-[#333]">
          <h2 className="text-xl font-bold text-gray-200">Clases Linux</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)] p-2">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">Lecciones</h3>
            {lessons.map((lesson, idx) => {
              if (lesson.isChallenge) return null;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectClass(idx);
                    if (window.innerWidth < 768) onToggle();
                  }}
                  className={`w-full text-left px-4 py-3 rounded mb-1 transition-colors ${
                    currentClass === idx 
                      ? 'bg-[#3b3a39] text-white font-semibold' 
                      : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-gray-200'
                  }`}
                >
                  {idx + 1}. {lesson.title}
                </button>
              );
            })}
          </div>

          <div>
            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2 px-4 mt-4 border-t border-[#333] pt-4">Retos</h3>
            {lessons.map((lesson, idx) => {
              if (!lesson.isChallenge) return null;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectClass(idx);
                    if (window.innerWidth < 768) onToggle();
                  }}
                  className={`w-full text-left px-4 py-3 rounded mb-1 transition-colors ${
                    currentClass === idx 
                      ? 'bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/50' 
                      : 'text-amber-600/70 hover:bg-amber-500/10 hover:text-amber-500'
                  }`}
                >
                  🏆 {lesson.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
