export default function WeekNavigation({ sections, activeSection, onSectionChange }) {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-[#0A0714]/90 border-b border-[#211934]">
      <div className="px-3 sm:px-5 lg:px-6 py-2.5 flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible scroll-thin">
        {sections.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition border ${
              activeSection === item.id
                ? "bg-gradient-to-r from-[#7C3AED] to-[#A66CFF] text-white border-transparent"
                : "bg-[#130E20] text-[#9C93B3] border-[#2A2140] hover:border-[#7C3AED]/60 hover:text-[#E4D9FF]"
            }`}
          >
            <span className="font-mono text-xs opacity-70">{item.number}</span>{item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
