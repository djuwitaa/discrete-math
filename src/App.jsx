import { useState } from "react";
import FoundationsSection from "./components/w1/FoundationsSection";
import ApplicationsSection from "./components/w2/ApplicationsSection";
import EquivalencesSection from "./components/w2/EquivalencesSection";
import PuzzlesSection from "./components/w2/PuzzlesSection";
import CourseHeader from "./layout/CourseHeader";
import CourseSidebar from "./layout/CourseSidebar";
import WeekNavigation from "./layout/WeekNavigation";

const weekTwoSections = {
  applications: ApplicationsSection,
  puzzles: PuzzlesSection,
  equivalences: EquivalencesSection,
};

export default function App() {
  const [week, setWeek] = useState(2);
  const [section, setSection] = useState("applications");
  const WeekTwoSection = weekTwoSections[section];

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
          {week === 2 && <WeekNavigation activeSection={section} onSectionChange={setSection} />}
          <main className="px-6 py-10">
            {week === 1 ? <FoundationsSection /> : <WeekTwoSection />}
          </main>
        </div>
      </div>
      <footer className="border-t border-[#211934] px-6 py-8 text-center text-sm text-[#5B5470]">
        Week 3: Predicates & Quantifiers. Review the core rules before continuing.
      </footer>
    </div>
  );
}
