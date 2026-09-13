import { useState } from "react";
import { Check, ChevronDown, Lightbulb, X } from "lucide-react";

const operators = [
  { symbol: "¬p", name: "Negation", words: '"not p"', example: 'p: "It is raining." ¬p: "It is not raining."', rule: "Flips one truth value." },
  { symbol: "p ∧ q", name: "Conjunction", words: '"p and q"', example: '"I study and I submit the assignment."', rule: "True only when both statements are true." },
  { symbol: "p ∨ q", name: "Disjunction", words: '"p or q"', example: '"I will drink tea or coffee."', rule: "True when at least one statement is true." },
  { symbol: "p ⊕ q", name: "Exclusive OR", words: '"p or q, but not both"', example: '"Choose either online or on-campus attendance."', rule: "True only when exactly one statement is true." },
  { symbol: "p → q", name: "Implication", words: '"if p, then q"', example: '"If it rains, then I bring an umbrella."', rule: "False only when p is true and q is false." },
  { symbol: "p ↔ q", name: "Biconditional", words: '"p if and only if q"', example: '"You pass if and only if you meet every requirement."', rule: "True when p and q share the same truth value." },
];

const truthSteps = [
  ["1", "Count variables", "For n variables, create 2ⁿ rows. Two variables means 2² = 4 rows."],
  ["2", "List every input", "For p and q: TT, TF, FT, FF. Change q every row, and p every two rows."],
  ["3", "Solve inside parentheses", "Make a column for each inner expression before the complete expression."],
  ["4", "Read the final column", "All T means tautology, all F means contradiction, a mix means contingency."],
];

const variations = [
  { label: "Original", formula: "p → q", words: '"if p then q"', equivalent: true, move: "Start with the hypothesis and conclusion." },
  { label: "Converse", formula: "q → p", words: '"if q then p"', equivalent: false, move: "Switch hypothesis and conclusion." },
  { label: "Contrapositive", formula: "¬q → ¬p", words: '"if not q then not p"', equivalent: true, move: "Negate and switch both terms." },
  { label: "Inverse", formula: "¬p → ¬q", words: '"if not p then not q"', equivalent: false, move: "Negate both terms." },
];

function Panel({ children, className = "" }) {
  return <section className={`rounded-2xl bg-[#130E20] border border-[#2A2140] p-6 ${className}`}>{children}</section>;
}

function SectionTitle({ title, children }) {
  return <div><h3 className="text-white font-heading text-lg font-semibold">{title}</h3>{children && <p className="mt-1 text-sm text-[#9C93B3]">{children}</p>}</div>;
}

function DiscreteVisual() {
  const [mode, setMode] = useState("discrete");
  const isDiscrete = mode === "discrete";
  return (
    <Panel>
      <SectionTitle title="Discrete vs continuous: see the difference">
        Discrete values jump between separate points. Continuous values can sit anywhere along an interval.
      </SectionTitle>
      <div className="mt-4 flex gap-2">
        <button onClick={() => setMode("discrete")} className={`rounded-lg px-3 py-2 text-sm border ${isDiscrete ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "border-[#2A2140] text-[#9C93B3]"}`}>Discrete count</button>
        <button onClick={() => setMode("continuous")} className={`rounded-lg px-3 py-2 text-sm border ${!isDiscrete ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "border-[#2A2140] text-[#9C93B3]"}`}>Continuous measurement</button>
      </div>
      <div className="mt-5 rounded-xl bg-[#0F0A1A] border border-[#211934] p-5">
        <div className="relative h-12 flex items-center">
          <div className="absolute left-1 right-1 h-px bg-[#5B5470]" />
          {isDiscrete ? (
            <div className="relative w-full flex justify-between">
              {[0, 1, 2, 3, 4, 5].map((value) => <div key={value} className="flex flex-col items-center gap-1"><span className="w-4 h-4 rounded-full bg-[#A66CFF] border-2 border-[#E4D9FF]" /><span className="font-mono text-xs text-[#B48CFF]">{value}</span></div>)}
            </div>
          ) : (
            <div className="relative w-full">
              <span className="absolute left-[43%] -top-5 w-4 h-4 rounded-full bg-[#F4B942] border-2 border-white" />
              <span className="absolute left-[38%] top-4 font-mono text-xs text-[#F4B942]">22.6°C</span>
              <span className="absolute left-0 top-4 font-mono text-xs text-[#9C93B3]">20°C</span>
              <span className="absolute right-0 top-4 font-mono text-xs text-[#9C93B3]">25°C</span>
            </div>
          )}
        </div>
        <p className="mt-6 text-sm text-[#E4D9FF]">{isDiscrete ? <><strong>Example:</strong> Number of students: 0, 1, 2, 3. There is no possible value between 2 and 3 students.</> : <><strong>Example:</strong> Temperature: 22.6°C, 22.61°C, or any value between 20°C and 25°C is meaningful.</>}</p>
      </div>
    </Panel>
  );
}

function OperatorDeck() {
  const [open, setOpen] = useState(0);
  return (
    <Panel>
      <SectionTitle title="Logical operators: the sentence connectors">
        A compound proposition combines one or more simple propositions using logical operators.
      </SectionTitle>
      <div className="mt-4 grid md:grid-cols-2 gap-2">
        {operators.map((operator, index) => (
          <button key={operator.symbol} onClick={() => setOpen(open === index ? null : index)} className={`rounded-xl border p-4 text-left transition ${open === index ? "bg-[#1D1530] border-[#7C3AED]" : "bg-[#0F0A1A] border-[#211934] hover:border-[#7C3AED]/60"}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-lg text-[#F4B942]">{operator.symbol}</span>
              <span className="text-white font-medium text-sm">{operator.name}</span>
              <ChevronDown className={`ml-auto w-4 h-4 text-[#B48CFF] transition ${open === index ? "rotate-180" : ""}`} />
            </div>
            <p className="mt-2 font-mono text-xs text-[#B48CFF]">{operator.words}</p>
            {open === index && <div className="mt-3 border-t border-[#2A2140] pt-3"><p className="text-sm text-[#E4D9FF] italic">{operator.example}</p><p className="text-sm text-[#9C93B3] mt-2">{operator.rule}</p></div>}
          </button>
        ))}
      </div>
    </Panel>
  );
}

function PrecedenceAndTruthTable() {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Panel>
        <SectionTitle title="Order of logical operators">
          Follow this precedence when parentheses do not state a different order.
        </SectionTitle>
        <ol className="mt-4 space-y-2">
          {[["1", "¬", "Negation"], ["2", "∧", "Conjunction"], ["3", "∨ and ⊕", "Disjunction and exclusive OR"], ["4", "→", "Implication"], ["5", "↔", "Biconditional"]].map(([number, symbol, name]) => <li key={number} className="flex items-center gap-3 rounded-lg bg-[#0F0A1A] border border-[#211934] px-3 py-2"><span className="w-6 h-6 rounded-full bg-[#1D1530] text-[#B48CFF] font-mono text-xs grid place-items-center">{number}</span><span className="font-mono text-[#F4B942]">{symbol}</span><span className="text-sm text-[#E4D9FF]">{name}</span></li>)}
        </ol>
        <div className="mt-4 rounded-lg bg-[#1A1330] p-3 text-sm text-[#E4D9FF]"><strong>Example:</strong> ¬p ∨ q means (¬p) ∨ q, not ¬(p ∨ q).</div>
      </Panel>
      <Panel>
        <SectionTitle title="How to construct a truth table">
          Build the input rows first, then calculate one operation at a time.
        </SectionTitle>
        <div className="mt-4 space-y-2">{truthSteps.map(([number, title, detail]) => <div key={number} className="flex gap-3"><span className="shrink-0 font-mono text-[#F4B942]">{number}</span><p className="text-sm text-[#9C93B3]"><strong className="text-[#E4D9FF]">{title}:</strong> {detail}</p></div>)}</div>
        <button onClick={() => setShowAnswer((current) => !current)} className="mt-4 inline-flex items-center gap-2 text-sm text-[#B48CFF] hover:text-white"><Lightbulb className="w-4 h-4" /> {showAnswer ? "Hide worked table" : "Show p ∧ q worked table"}</button>
        {showAnswer && <table className="mt-3 w-full font-mono text-sm border-collapse overflow-hidden rounded-lg border border-[#2A2140]"><thead className="bg-[#1A1330] text-[#F4B942]"><tr><th className="p-2">p</th><th className="p-2">q</th><th className="p-2">p ∧ q</th></tr></thead><tbody className="text-center text-[#E4D9FF]">{[["T", "T", "T"], ["T", "F", "F"], ["F", "T", "F"], ["F", "F", "F"]].map((row) => <tr key={row.join("")} className="border-t border-[#2A2140]">{row.map((value, index) => <td key={index} className={`p-2 ${value === "T" && index === 2 ? "text-[#4ADE80]" : ""}`}>{value}</td>)}</tr>)}</tbody></table>}
      </Panel>
    </div>
  );
}

function ImplicationVariations() {
  const [selected, setSelected] = useState(0);
  const item = variations[selected];
  return (
    <Panel>
      <SectionTitle title="Implication variations">
        Begin with <span className="font-mono text-[#F4B942]">p → q</span>, read as "if p then q." Switching or negating terms creates related, but not always equivalent, statements.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {variations.map((variation, index) => <button key={variation.label} onClick={() => setSelected(index)} className={`rounded-xl border p-3 text-left transition ${selected === index ? "bg-[#1D1530] border-[#7C3AED]" : "bg-[#0F0A1A] border-[#211934] hover:border-[#7C3AED]"}`}><p className="text-xs text-[#B48CFF]">{variation.label}</p><p className="font-mono text-[#E4D9FF] mt-1">{variation.formula}</p></button>)}
      </div>
      <div className={`mt-4 rounded-xl border p-4 ${item.equivalent ? "bg-[#173626]/40 border-[#255239]" : "bg-[#3A1C22]/30 border-[#5C2F37]"}`}>
        <p className="font-mono text-lg text-white">{item.formula} <span className="font-sans text-sm text-[#9C93B3]">{item.words}</span></p>
        <p className="mt-2 text-sm text-[#E4D9FF]">{item.move}</p>
        <p className={`mt-2 text-sm font-medium ${item.equivalent ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{item.equivalent ? "Equivalent to the original conditional." : "Not logically equivalent to the original conditional."}</p>
      </div>
      <div className="mt-4 rounded-lg bg-[#1A1330] p-4 text-sm text-[#E4D9FF]"><strong>Logical equivalence:</strong> Two compound propositions are equivalent when they always have the same truth value, regardless of the truth values of their propositional variables. Therefore, <span className="font-mono text-[#F4B942]">p → q</span> and <span className="font-mono text-[#F4B942]">¬q → ¬p</span> are logically equivalent.</div>
    </Panel>
  );
}

export default function FoundationsSection() {
  const [choice, setChoice] = useState(null);
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 1 · FOUNDATIONS</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">The language of discrete mathematics</h2>
        <p className="mt-2 text-[#9C93B3] max-w-3xl">Discrete mathematics studies countable structures and precise logical reasoning. Propositional logic turns statements into values that can be tested, combined, and proven.</p>
      </div>
      <DiscreteVisual />
      <OperatorDeck />
      <PrecedenceAndTruthTable />
      <ImplicationVariations />
      <Panel>
        <SectionTitle title="Quick check: is this a proposition?" />
        <p className="text-[#E4D9FF] mt-2 italic">"Jakarta is the capital of Indonesia."</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Yes, it has a truth value", "No, it is only an opinion"].map((label, index) => <button key={label} onClick={() => setChoice(index)} className={`rounded-lg border px-4 py-2 text-sm transition ${choice === null ? "bg-[#0F0A1A] border-[#211934] hover:border-[#7C3AED]" : index === 0 ? "bg-[#173626]/50 border-[#255239] text-[#4ADE80]" : choice === index ? "bg-[#3A1C22]/50 border-[#5C2F37] text-[#F87171]" : "bg-[#0F0A1A] border-[#211934] text-[#5B5470]"}`}>{label}</button>)}
        </div>
        {choice !== null && <p className="mt-3 text-sm text-[#9C93B3]">{choice === 0 ? <><Check className="inline w-4 h-4 text-[#4ADE80]" /> Correct. It is declarative and can be evaluated as true.</> : <><X className="inline w-4 h-4 text-[#F87171]" /> A proposition can be an objective statement. It only needs one definite truth value.</>}</p>}
      </Panel>
    </div>
  );
}
