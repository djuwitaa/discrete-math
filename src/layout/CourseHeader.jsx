export default function CourseHeader({ week }) {
  const isWeekOne = week === 1;
  return (
    <header className="border-b border-[#211934] px-6 py-8 md:py-10">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs text-[#B48CFF] tracking-wide">
          {isWeekOne ? "WEEK 1 · FOUNDATIONS" : "WEEK 2 · PROPOSITIONAL LOGIC"} · DISCRETE MATHEMATICS
        </p>
        <h1 className="font-heading text-3xl md:text-5xl font-semibold text-white mt-3 leading-tight">
          {isWeekOne ? "Discrete Mathematics" : "Propositional Logic"}
        </h1>
        <p className="text-[#9C93B3] mt-3 max-w-xl">
          {isWeekOne
            ? "Build the fundamentals: discrete and continuous quantities, propositions, truth values, and truth tables."
            : "Apply propositional logic through real-world rules, systematic puzzles, and equivalence shortcuts."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3 font-mono text-sm text-[#5B5470]">
          <span className="px-3 py-1.5 rounded-lg bg-[#130E20] border border-[#2A2140]">{isWeekOne ? "T or F: never both" : "p → q ≡ ¬p ∨ q"}</span>
          <span className="px-3 py-1.5 rounded-lg bg-[#130E20] border border-[#2A2140]">{isWeekOne ? "countable ≠ measurable" : "¬(p ∧ q) ≡ ¬p ∨ ¬q"}</span>
        </div>
      </div>
    </header>
  );
}
