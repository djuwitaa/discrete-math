const SECTIONS = [
  { id: "applications", number: "01", label: "Applications" },
  { id: "puzzles", number: "02", label: "Puzzles" },
  { id: "equivalences", number: "03", label: "Equivalences" },
];

export default function WeekNavigation({ activeSection, onSectionChange }) {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur bg-[#0A0714]/90 border-b border-[#211934]">
      <div className="px-6 py-3 flex flex-wrap gap-2">
        {SECTIONS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition border ${
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
