export default function Sidebar({ isOpen, onToggle, lessons, sections, currentClass, onSelectClass }) {
  // Group lessons by section (preserving original index)
  const indexed = lessons.map((l, i) => ({ ...l, index: i }));
  const challenges = indexed.filter((l) => l.isChallenge);

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

          {/* Render each section */}
          {sections.map((sec) => {
            const items = indexed.filter((l) => l.section === sec.id);
            if (items.length === 0) return null;
            return (
              <div key={sec.id} className="mb-3">
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-4">
                  {sec.title}
                </h3>
                {items.map((lesson) => (
                  <button
                    key={lesson.index}
                    onClick={() => {
                      onSelectClass(lesson.index);
                      if (window.innerWidth < 768) onToggle();
                    }}
                    className={`w-full text-left px-4 py-2 rounded mb-0.5 transition-colors text-sm ${
                      currentClass === lesson.index
                        ? 'bg-[#3b3a39] text-white font-semibold'
                        : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-gray-200'
                    }`}
                  >
                    {lesson.title}
                  </button>
                ))}
              </div>
            );
          })}

          {/* Challenges section */}
          {challenges.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1 px-4 mt-2 border-t border-[#333] pt-3">
                Retos
              </h3>
              {challenges.map((lesson) => (
                <button
                  key={lesson.index}
                  onClick={() => {
                    onSelectClass(lesson.index);
                    if (window.innerWidth < 768) onToggle();
                  }}
                  className={`w-full text-left px-4 py-2 rounded mb-0.5 transition-colors text-sm ${
                    currentClass === lesson.index
                      ? 'bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/50'
                      : 'text-amber-600/70 hover:bg-amber-500/10 hover:text-amber-500'
                  }`}
                >
                  🏆 {lesson.title}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
