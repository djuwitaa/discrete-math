import { useState } from "react";
import { Check, Lightbulb, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import confetti from "canvas-confetti";

const LAWS = [
  {
    name: "Implication", cue: "Replace the promise", law: "p → q  ≡  ¬p ∨ q", tip: "The only broken promise is p true and q false.",
    vars: ["p", "q"], rows: [["T", "T", "T", "T"], ["T", "F", "F", "F"], ["F", "T", "T", "T"], ["F", "F", "T", "T"]],
  },
  {
    name: "De Morgan", cue: "Break + flip", law: "¬(p ∧ q)  ≡  ¬p ∨ ¬q", tip: "Push ¬ inside every term and flip ∧ ↔ ∨.",
    vars: ["p", "q"], rows: [["T", "T", "F", "F"], ["T", "F", "T", "T"], ["F", "T", "T", "T"], ["F", "F", "T", "T"]],
  },
  {
    name: "De Morgan", cue: "Break + flip", law: "¬(p ∨ q)  ≡  ¬p ∧ ¬q", tip: "Use the same move for a negated OR.",
    vars: ["p", "q"], rows: [["T", "T", "F", "F"], ["T", "F", "F", "F"], ["F", "T", "F", "F"], ["F", "F", "T", "T"]],
  },
  {
    name: "Double negation", cue: "Two NOTs cancel", law: "¬¬p  ≡  p", tip: "Like two sign flips: back to the original.",
    vars: ["p"], rows: [["T", "T", "T"], ["F", "F", "F"]],
  },
  {
    name: "Complement", cue: "A thing + its opposite", law: "p ∨ ¬p  ≡  T", tip: "At least one of p and not-p is always true.",
    vars: ["p"], rows: [["T", "T", "T"], ["F", "T", "T"]],
  },
  {
    name: "Complement", cue: "A thing + its opposite", law: "p ∧ ¬p  ≡  F", tip: "They can never both be true.",
    vars: ["p"], rows: [["T", "F", "F"], ["F", "F", "F"]],
  },
  {
    name: "Absorption", cue: "p already covers p AND q", law: "p ∨ (p ∧ q)  ≡  p", tip: "If p is true, the whole OR is true; if p is false, both sides are false.",
    vars: ["p", "q"], rows: [["T", "T", "T", "T"], ["T", "F", "T", "T"], ["F", "T", "F", "F"], ["F", "F", "F", "F"]],
  },
  {
    name: "Contrapositive", cue: "Reverse + negate both", law: "p → q  ≡  ¬q → ¬p", tip: "This is equivalent. The converse q → p is not.",
    vars: ["p", "q"], rows: [["T", "T", "T", "T"], ["T", "F", "F", "F"], ["F", "T", "T", "T"], ["F", "F", "T", "T"]],
  },
];

const WORKED_EXAMPLES = [
  {
    title: "Example 1: simplify ¬(p → q)",
    problem: "¬(p → q)",
    steps: [
      { law: "Implication law", cue: "p → q ≡ ¬p ∨ q", result: "¬(¬p ∨ q)", note: "First rewrite the implication so there is no arrow left to deal with." },
      { law: "De Morgan's law", cue: "¬(a ∨ b) ≡ ¬a ∧ ¬b", result: "¬¬p ∧ ¬q", note: "Distribute the outer NOT across the OR and flip ∨ into ∧." },
      { law: "Double negation", cue: "¬¬p ≡ p", result: "p ∧ ¬q", note: "Two NOTs on p cancel out." },
    ],
    final: "p ∧ ¬q",
    meaning: "\"Not (if p then q)\" really means \"p is true, but q is false\". This is exactly the one case that breaks the promise.",
  },
  {
    title: "Example 2: simplify (p ∧ q) ∨ (p ∧ ¬q)",
    problem: "(p ∧ q) ∨ (p ∧ ¬q)",
    steps: [
      { law: "Distributive law", cue: "factor out the shared p", result: "p ∧ (q ∨ ¬q)", note: "Both terms share p, so pull it outside the parentheses." },
      { law: "Complement law", cue: "q ∨ ¬q ≡ T", result: "p ∧ T", note: "q or not-q is always true, no matter what q is." },
      { law: "Identity law", cue: "p ∧ T ≡ p", result: "p", note: "ANDing with T never changes the other side." },
    ],
    final: "p",
    meaning: "Whether q is true or false doesn't matter here. The expression only ever depends on p.",
  },
  {
    title: "Example 3: simplify ¬(p ∨ q) ∨ (¬p ∧ q)",
    problem: "¬(p ∨ q) ∨ (¬p ∧ q)",
    steps: [
      { law: "De Morgan's law", cue: "¬(a ∨ b) ≡ ¬a ∧ ¬b", result: "(¬p ∧ ¬q) ∨ (¬p ∧ q)", note: "Break the negated OR first." },
      { law: "Distributive law", cue: "factor out the shared ¬p", result: "¬p ∧ (¬q ∨ q)", note: "Both terms share ¬p." },
      { law: "Complement law", cue: "¬q ∨ q ≡ T", result: "¬p ∧ T", note: "q or not-q is always true." },
      { law: "Identity law", cue: "¬p ∧ T ≡ ¬p", result: "¬p", note: "ANDing with T never changes the other side." },
    ],
    final: "¬p",
    meaning: "No matter what q is, the whole expression only ever tracks the opposite of p.",
  },
];

const CHALLENGES = [
  {
    prompt: "Which shortcut rewrites p → q?",
    options: ["¬p ∨ q", "p ∨ ¬q", "¬q → ¬p"],
    answer: 0,
    why: "An implication fails only at p = T and q = F, exactly like ¬p ∨ q.",
  },
  {
    prompt: "Simplify ¬(p ∨ q).",
    options: ["¬p ∨ ¬q", "¬p ∧ ¬q", "p ∧ q"],
    answer: 1,
    why: "De Morgan: distribute NOT and flip OR into AND.",
  },
  {
    prompt: "What does p ∧ ¬p always become?",
    options: ["T", "F", "p"],
    answer: 1,
    why: "p and its opposite cannot both be true: a contradiction.",
  },
  {
    prompt: "Simplify (p ∧ q) ∨ (p ∧ ¬q).",
    options: ["p", "q", "T"],
    answer: 0,
    why: "Factor out p: p ∧ (q ∨ ¬q). Since q ∨ ¬q ≡ T, this becomes p ∧ T ≡ p.",
  },
  {
    prompt: "Which statement is logically equivalent to p → q?",
    options: ["q → p", "¬p → ¬q", "¬q → ¬p"],
    answer: 2,
    why: "The contrapositive ¬q → ¬p always matches p → q. The converse and inverse do not.",
  },
];

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-[#130E20] border border-[#2A2140] ${className}`}>{children}</div>;
}

function CheatKey() {
  const [open, setOpen] = useState(null);
  const [showProof, setShowProof] = useState(null);
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-[#F4B942]" />
        <p className="text-white font-heading font-semibold">Cheat key: pattern recognition before memorization</p>
      </div>
      <p className="mt-1 text-sm text-[#9C93B3]">Tap a card when an expression looks scary. The cue tells you the fastest legal move. Then verify it with the truth table if you want proof, not just trust.</p>
      <div className="mt-4 grid md:grid-cols-2 gap-2">
        {LAWS.map((item, index) => (
          <button
            key={item.law}
            onClick={() => setOpen(open === index ? null : index)}
            className={`rounded-xl border text-left px-4 py-3 transition ${open === index ? "bg-[#1D1530] border-[#7C3AED]" : "bg-[#0F0A1A] border-[#211934] hover:border-[#7C3AED]/60"}`}
          >
            <div className="flex justify-between gap-2">
              <span className="text-white text-sm font-medium">{item.name}</span>
              <span className="text-[#F4B942] text-xs font-mono">{item.cue}</span>
            </div>
            <p className="font-mono text-[#E4D9FF] mt-2 text-sm">{item.law}</p>
            {open === index && (
              <div className="mt-3 border-t border-[#2A2140] pt-3" onClick={(event) => event.stopPropagation()}>
                <p className="text-xs text-[#9C93B3] leading-relaxed">{item.tip}</p>
                <button
                  onClick={() => setShowProof(showProof === index ? null : index)}
                  className="mt-3 text-xs inline-flex items-center gap-1 text-[#B48CFF] hover:text-white"
                >
                  {showProof === index ? "Hide truth table" : "Prove it with a truth table →"}
                </button>
                {showProof === index && (
                  <table className="mt-2 w-full font-mono text-xs border-collapse overflow-hidden rounded-lg border border-[#2A2140]">
                    <thead className="bg-[#1A1330] text-[#F4B942]">
                      <tr>
                        {item.vars.map((v) => <th key={v} className="p-1.5">{v}</th>)}
                        <th className="p-1.5">LHS</th>
                        <th className="p-1.5">RHS</th>
                      </tr>
                    </thead>
                    <tbody className="text-center text-[#E4D9FF]">
                      {item.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-[#2A2140]">
                          {row.map((value, cellIndex) => <td key={cellIndex} className="p-1.5">{value}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {showProof === index && <p className="mt-2 text-[11px] text-[#4ADE80]">LHS and RHS match on every row. That's what "logically equivalent" means.</p>}
              </div>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
}

function WorkedExample({ example }) {
  const [step, setStep] = useState(0);
  const revealed = example.steps.slice(0, step);
  const done = step >= example.steps.length;
  return (
    <Card className="p-5">
      <p className="text-white font-heading font-semibold">{example.title}</p>
      <p className="mt-1 text-sm text-[#9C93B3]">Click through each move one at a time and see exactly which law justifies it.</p>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4 font-mono text-lg text-[#F4B942]">{example.problem}</div>
      <div className="mt-3 space-y-2">
        {revealed.map((s, index) => (
          <div key={index} className="rounded-lg bg-[#1A1330] border border-[#2A2140] p-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-[#7C3AED]/30 text-[#B48CFF] font-medium">{s.law}</span>
              <span className="text-[#5B5470] font-mono">{s.cue}</span>
            </div>
            <p className="mt-2 text-sm text-[#9C93B3]">{s.note}</p>
            <p className="mt-2 font-mono text-white text-base">≡ {s.result}</p>
          </div>
        ))}
      </div>
      {!done ? (
        <button onClick={() => setStep((current) => current + 1)} className="mt-4 px-3 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#A66CFF] text-white text-sm font-medium">
          {step === 0 ? "Show step 1" : `Show step ${step + 1}`}
        </button>
      ) : (
        <div className="mt-4 rounded-lg bg-[#173626]/40 border border-[#255239] p-3">
          <p className="text-[#4ADE80] font-mono text-sm">Simplest form: {example.final}</p>
          <p className="mt-1 text-sm text-[#E4D9FF]">{example.meaning}</p>
          <button onClick={() => setStep(0)} className="mt-3 text-xs inline-flex items-center gap-1 text-[#9C93B3] hover:text-white"><RotateCcw className="w-3.5 h-3.5" /> Restart example</button>
        </div>
      )}
    </Card>
  );
}

function WorkedExamples() {
  return (
    <div>
      <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">STEP BY STEP</p>
      <h3 className="font-heading text-xl font-semibold text-white">How to actually simplify an expression</h3>
      <p className="mt-1 text-sm text-[#9C93B3] max-w-2xl">Every simplification is the same recipe: spot a pattern from the cheat key, apply exactly one law, write the new expression, and repeat until nothing more can change.</p>
      <div className="mt-4 space-y-4">
        {WORKED_EXAMPLES.map((example) => <WorkedExample key={example.title} example={example} />)}
      </div>
    </div>
  );
}

function LawSprint() {
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const challenge = CHALLENGES[round];

  function choose(index) {
    if (choice !== null) return;
    setChoice(index);
    if (index === challenge.answer) setScore((current) => current + 1);
  }

  function next() {
    if (round === CHALLENGES.length - 1) {
      setComplete(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 }, colors: ["#7C3AED", "#A66CFF", "#F4B942", "#4ADE80"] });
      return;
    }
    setRound((current) => current + 1);
    setChoice(null);
  }

  function reset() {
    setRound(0);
    setChoice(null);
    setScore(0);
    setComplete(false);
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-white font-heading font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#F4B942]" /> Law sprint</p>
          <p className="text-sm text-[#9C93B3] mt-1">Pick the shortcut; get an explanation immediately.</p>
        </div>
        <span className="font-mono text-xs text-[#B48CFF]">{complete ? `${score}/${CHALLENGES.length}` : `Round ${round + 1}/${CHALLENGES.length}`}</span>
      </div>
      {complete ? (
        <div className="mt-5 rounded-xl bg-[#173626]/50 border border-[#255239] p-4">
          <p className="text-[#4ADE80] font-semibold flex items-center gap-2"><Trophy className="w-4 h-4" /> Sprint complete: {score}/{CHALLENGES.length} correct.</p>
          <p className="text-sm text-[#E4D9FF] mt-1">Use the cheat key above any time you need to re-anchor a law.</p>
          <button onClick={reset} className="mt-3 text-sm inline-flex items-center gap-1 text-[#9C93B3] hover:text-white"><RotateCcw className="w-4 h-4" /> Play again</button>
        </div>
      ) : (
        <>
          <p className="mt-5 text-lg text-white font-medium">{challenge.prompt}</p>
          <div className="mt-4 grid gap-2">
            {challenge.options.map((option, index) => {
              const correct = index === challenge.answer;
              const chosen = choice === index;
              return (
                <button
                  key={option}
                  onClick={() => choose(index)}
                  className={`font-mono rounded-lg border px-4 py-3 text-left transition ${
                    choice === null ? "bg-[#0F0A1A] border-[#211934] hover:border-[#7C3AED]" :
                    correct ? "bg-[#173626]/50 border-[#255239] text-[#4ADE80]" :
                    chosen ? "bg-[#3A1C22]/50 border-[#5C2F37] text-[#F87171]" : "bg-[#0F0A1A] border-[#211934] text-[#5B5470]"
                  }`}
                >
                  <span className="mr-2">{choice !== null && correct ? <Check className="inline w-4 h-4" /> : choice !== null && chosen ? <X className="inline w-4 h-4" /> : "○"}</span>{option}
                </button>
              );
            })}
          </div>
          {choice !== null && (
            <div className="mt-4 rounded-lg bg-[#1A1330] border border-[#2A2140] p-3">
              <p className="text-sm text-[#E4D9FF]">{challenge.why}</p>
              <button onClick={next} className="mt-3 px-3 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#A66CFF] text-white text-sm font-medium">
                {round === CHALLENGES.length - 1 ? "Finish sprint" : "Next shortcut"}
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default function EquivalencesSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">PROPOSITIONAL EQUIVALENCE</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">Different symbols, same meaning</h2>
        <p className="mt-2 text-[#9C93B3] max-w-2xl">Equivalence is not a giant list to memorize. Learn the visual patterns, use their shortcut cues, verify each one with a truth table, then walk through full worked examples before testing yourself.</p>
      </div>
      <CheatKey />
      <WorkedExamples />
      <LawSprint />
    </div>
  );
}
