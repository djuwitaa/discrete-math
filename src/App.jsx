import { useState } from "react";
import FoundationsSection from "./components/w1/FoundationsSection";
import ApplicationsSection from "./components/w2/ApplicationsSection";
import EquivalencesSection from "./components/w2/EquivalencesSection";
import PuzzlesSection from "./components/w2/PuzzlesSection";
import PredicatesSection from "./components/w3/PredicatesSection";
import QuantifiersSection from "./components/w3/QuantifiersSection";
import CourseHeader from "./layout/CourseHeader";
import CourseSidebar from "./layout/CourseSidebar";
import WeekNavigation from "./layout/WeekNavigation";

const SECTIONS_BY_WEEK = {
  2: {
    defaultSection: "applications",
    nav: [
      { id: "applications", number: "01", label: "Applications" },
      { id: "puzzles", number: "02", label: "Puzzles" },
      { id: "equivalences", number: "03", label: "Equivalences" },
    ],
    components: {
      applications: ApplicationsSection,
      puzzles: PuzzlesSection,
      equivalences: EquivalencesSection,
    },
  },
  3: {
    defaultSection: "predicates",
    nav: [
      { id: "predicates", number: "01", label: "Predicate Basics" },
      { id: "quantifiers", number: "02", label: "Quantifiers" },
    ],
    components: {
      predicates: PredicatesSection,
      quantifiers: QuantifiersSection,
    },
  },
};

export default function App() {
  const [week, setWeek] = useState(1);
  const [sectionByWeek, setSectionByWeek] = useState({
    2: SECTIONS_BY_WEEK[2].defaultSection,
    3: SECTIONS_BY_WEEK[3].defaultSection,
  });

  const weekConfig = SECTIONS_BY_WEEK[week];
  const section = sectionByWeek[week];
  const ActiveComponent = weekConfig?.components[section];

  function handleSectionChange(nextSection) {
    setSectionByWeek((current) => ({ ...current, [week]: nextSection }));
  }

  return (
    <div className="min-h-screen bg-[#0A0714] text-[#F3F0FA]" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-heading { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <CourseHeader week={week} />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row">
        <CourseSidebar week={week} onWeekChange={setWeek} />
        <div className="min-w-0 flex-1">
          {weekConfig && <WeekNavigation sections={weekConfig.nav} activeSection={section} onSectionChange={handleSectionChange} />}
          <main className="px-6 py-10">
            {week === 1 ? <FoundationsSection /> : ActiveComponent ? <ActiveComponent /> : null}
          </main>
        </div>
      </div>
      <footer className="border-t border-[#211934] px-6 py-8 text-center text-sm text-[#5B5470]">
        Created by Djuwita · since 2026
      </footer>
    </div>
  );
}
