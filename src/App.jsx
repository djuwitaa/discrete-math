import { useState } from "react";
import FoundationsSection from "./components/w1/FoundationsSection";
import ApplicationsSection from "./components/w2/ApplicationsSection";
import EquivalencesSection from "./components/w2/EquivalencesSection";
import PuzzlesSection from "./components/w2/PuzzlesSection";
import PredicatesSection from "./components/w3/PredicatesSection";
import QuantifiersSection from "./components/w3/QuantifiersSection";
import QuantifierExamplesSection from "./components/w3/QuantifierExamplesSection";
import TranslationSection from "./components/w3/TranslationSection";
import NestedQuantifiersSection from "./components/w3/NestedQuantifiersSection";
import InferenceRulesSection from "./components/w4/InferenceRulesSection";
import BuildingArgumentsSection from "./components/w4/BuildingArgumentsSection";
import ProofMethodsSection from "./components/w4/ProofMethodsSection";
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
      { id: "qexamples", number: "03", label: "Quantifier Examples" },
      { id: "translation", number: "04", label: "Translation" },
      { id: "nested", number: "05", label: "Nested Quantifiers" },
    ],
    components: {
      predicates: PredicatesSection,
      quantifiers: QuantifiersSection,
      qexamples: QuantifierExamplesSection,
      translation: TranslationSection,
      nested: NestedQuantifiersSection,
    },
  },
  4: {
    defaultSection: "rules",
    nav: [
      { id: "rules", number: "01", label: "Rules of Inference" },
      { id: "arguments", number: "02", label: "Building Arguments" },
      { id: "proofs", number: "03", label: "Proof Methods" },
    ],
    components: {
      rules: InferenceRulesSection,
      arguments: BuildingArgumentsSection,
      proofs: ProofMethodsSection,
    },
  },
};

export default function App() {
  const [week, setWeek] = useState(1);
  const [sectionByWeek, setSectionByWeek] = useState({
    2: SECTIONS_BY_WEEK[2].defaultSection,
    3: SECTIONS_BY_WEEK[3].defaultSection,
    4: SECTIONS_BY_WEEK[4].defaultSection,
  });

  const weekConfig = SECTIONS_BY_WEEK[week];
  const section = sectionByWeek[week];
  const ActiveComponent = weekConfig?.components[section];

  function handleSectionChange(nextSection) {
    setSectionByWeek((current) => ({ ...current, [week]: nextSection }));
  }

  return (
    <div className="min-h-screen bg-[#0A0714] text-[#F3F0FA]"     style={{ fontFamily: "Rubik, Calibri, sans-serif" }}>
      <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Rubik:wght@400;500;600&display=swap');
            .font-heading { font-family: 'Poppins', Calibri, sans-serif; }
            .font-mono, code, pre, kbd { font-family: Consolas, monospace; }
            input, button, select, textarea { font-family: inherit; }
            .font-mono input, input.font-mono, select.font-mono { font-family: Consolas, monospace; }
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
