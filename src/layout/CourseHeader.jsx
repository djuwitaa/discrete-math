const WEEK_META = {
  1: {
    eyebrow: "WEEK 1 · FOUNDATIONS",
    title: "Discrete Mathematics",
    description: "Build the fundamentals: discrete and continuous quantities, propositions, truth values, and truth tables.",
    chips: ["T or F: never both", "countable ≠ measurable"],
  },
  2: {
    eyebrow: "WEEK 2 · PROPOSITIONAL LOGIC",
    title: "Propositional Logic",
    description: "Apply propositional logic through real-world rules, systematic puzzles, and equivalence shortcuts.",
    chips: ["p → q ≡ ¬p ∨ q", "¬(p ∧ q) ≡ ¬p ∨ ¬q"],
  },
  3: {
    eyebrow: "WEEK 3 · PREDICATE LOGIC AND QUANTIFIER",
    title: "Predicate Logic and Quantifier",
    description: "Go beyond fixed statements: variables, predicates, domains, and quantifiers that reason about entire universes of objects.",
    chips: ["∀x P(x): for every x", "∃x P(x): for some x"],
  },
  4: {
    eyebrow: "WEEK 4 · INFERENCE & PROOFS",
    title: "Rules of Inference and Proofs",
    description: "Learn how valid arguments are built from premises, then use direct proof, contraposition, contradiction, and cases to prove statements.",
    chips: ["p, p → q ∴ q", "¬q, p → q ∴ ¬p"],
  },
  5: {
    eyebrow: "WEEK 5 · SETS, FUNCTIONS, SEQUENCES AND SUMS",
    title: "Sets, Functions, Sequences and Sums",
    description: "The vocabulary of all discrete math: sets and their operations, functions and their types, sequences, summations, cardinality, and the basic counting rules.",
    chips: ["|A ∪ B| = |A| + |B| - |A ∩ B|", "f: A → B", "|A × B| = |A| · |B|"],
  },
  6: {
    eyebrow: "WEEK 6 · INDUCTION AND RECURSION 1",
    title: "Mathematical Induction",
    description: "Prove a statement for every positive integer with just two checks: the basis step and the inductive step. Learn the template and practice it step by step.",
    chips: ["P(1) ∧ ∀k (P(k) → P(k+1))", "∴ ∀n P(n)"],
  },
  7: {
    eyebrow: "WEEK 7 · INDUCTION AND RECURSION 2",
    title: "Strong Induction, Recursion and Recurrences",
    description: "Use strong induction and the well ordering principle, define objects recursively, and solve recurrence relations.",
    chips: ["P(1..k) → P(k+1)", "a(n) = a(n-1) + a(n-2)"],
  },
};

export default function CourseHeader({ week }) {
  const meta = WEEK_META[week] ?? WEEK_META[1];
  return (
    <header className="border-b border-[#211934] px-3 sm:px-5 lg:px-6 py-5 md:py-8">
      <div className="max-w-screen-2xl mx-auto">
        <p className="font-mono text-[11px] sm:text-xs text-[#B48CFF] tracking-wide">{meta.eyebrow} · DISCRETE MATHEMATICS</p>
        <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl font-semibold text-white mt-2 sm:mt-3 leading-tight">{meta.title}</h1>
        <p className="text-sm sm:text-base text-[#9C93B3] mt-2">{meta.description}</p>
        <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3 font-mono text-xs sm:text-sm text-[#5B5470]">
          {meta.chips.map((chip) => <span key={chip} className="px-3 py-1.5 rounded-lg bg-[#130E20] border border-[#2A2140]">{chip}</span>)}
        </div>
      </div>
    </header>
  );
}
