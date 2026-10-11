const WEEKS = Array.from({ length: 16 }, (_, index) => ({
  number: index + 1,
  label: index === 0 ? "Foundations" : index === 1 ? "Logic & Proofs" : index === 2 ?   "Predicate Logic and Quantifier" : index === 3 ? "Inference & Proofs" : `Week ${index + 1}`,
    available: index < 4,
}));

export default function CourseSidebar({ week, onWeekChange }) {
  return (
    <aside className="md:w-60 md:shrink-0 border-b md:border-b-0 md:border-r border-[#211934] px-4 py-3 md:p-4 md:py-6">
      <p className="hidden md:block font-mono text-[11px] text-[#5B5470] px-3 mb-2">COURSE ROADMAP</p>
      <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1 scroll-thin">
        {WEEKS.map((item) => (
          <button
            key={item.number}
            disabled={!item.available}
            onClick={() => item.available && onWeekChange(item.number)}
            className={`shrink-0 md:shrink md:w-full flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-left text-xs md:text-sm whitespace-nowrap md:whitespace-normal transition ${
              week === item.number
                ? "bg-[#1D1530] text-white border border-[#7C3AED]"
                : item.available
                  ? "text-[#9C93B3] hover:bg-[#130E20] hover:text-[#E4D9FF]"
                  : "text-[#4A435B] cursor-not-allowed"
            }`}
          >
            <span className="font-mono text-xs">{String(item.number).padStart(2, "0")}</span>
            <span>{item.label}</span>
            {!item.available && <span className="ml-auto text-[10px]">SOON</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
