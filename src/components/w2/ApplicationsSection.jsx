import { useState } from "react";
import { Lightbulb } from "lucide-react";

const examples = [
  { title: "Translate English", expression: "(senior ∧ Tuesday) → coffee", prompt: "A senior gets free coffee only on Tuesday.", explanation: "Conditions joined by AND appear before the arrow; the result is after it." },
  { title: "System requirements", expression: "local ∨ (login ∧ remote)", prompt: "Access is allowed locally, or remotely with a valid login.", explanation: "There are two routes to access: local, or the paired remote + login route." },
  { title: "Boolean search", expression: "cats ∧ ¬dogs", prompt: "Show cat content but exclude dog content.", explanation: "NOT narrows a set; AND keeps only results satisfying both conditions." },
];

export default function ApplicationsSection() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = examples[active];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">APPLICATIONS</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">Logic is a decision engine</h2>
        <p className="mt-2 text-[#9C93B3] max-w-2xl">Switch contexts and expose the logical structure beneath familiar rules, requirements, and searches.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {examples.map((example, index) => (
          <button key={example.title} onClick={() => { setActive(index); setRevealed(false); }} className={`rounded-xl border p-4 text-left transition ${active === index ? "bg-[#1D1530] border-[#7C3AED]" : "bg-[#130E20] border-[#2A2140] hover:border-[#7C3AED]/60"}`}>
            <span className="font-mono text-xs text-[#B48CFF]">MODE {index + 1}</span>
            <p className="mt-1 text-white font-medium">{example.title}</p>
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-[#130E20] border border-[#2A2140] p-6">
        <p className="text-[#E4D9FF] italic border-l-2 border-[#7C3AED] pl-3">"{item.prompt}"</p>
        <div className="mt-5 rounded-xl bg-[#0F0A1A] border border-[#211934] px-4 py-4">
          <p className="text-xs text-[#9C93B3] uppercase tracking-wide">Logical shape</p>
          <p className="font-mono text-xl text-[#F4B942] mt-2">{item.expression}</p>
        </div>
        <button onClick={() => setRevealed((value) => !value)} className="mt-4 inline-flex items-center gap-2 text-sm text-[#B48CFF] hover:text-white">
          <Lightbulb className="w-4 h-4" /> {revealed ? "Hide explanation" : "Why this structure?"}
        </button>
        {revealed && <p className="mt-3 text-sm text-[#E4D9FF]">{item.explanation}</p>}
      </div>
    </div>
  );
}
