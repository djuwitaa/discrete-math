import { useState } from "react";
import { Check, Lightbulb, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import confetti from "canvas-confetti";

const LAWS = [
  { name: "Implication", cue: "Replace the promise", law: "p → q  ≡  ¬p ∨ q", tip: "The only broken promise is p true and q false." },
  { name: "De Morgan", cue: "Break + flip", law: "¬(p ∧ q)  ≡  ¬p ∨ ¬q", tip: "Push ¬ inside every term and flip ∧ ↔ ∨." },
  { name: "De Morgan", cue: "Break + flip", law: "¬(p ∨ q)  ≡  ¬p ∧ ¬q", tip: "Use the same move for a negated OR." },
  { name: "Double negation", cue: "Two NOTs cancel", law: "¬¬p  ≡  p", tip: "Like two sign flips: back to the original." },
  { name: "Complement", cue: "A thing + its opposite", law: "p ∨ ¬p  ≡  T", tip: "At least one of p and not-p is always true." },
  { name: "Complement", cue: "A thing + its opposite", law: "p ∧ ¬p  ≡  F", tip: "They can never both be true." },
  { name: "Absorption", cue: "p already covers p AND q", law: "p ∨ (p ∧ q)  ≡  p", tip: "If p is true, the whole OR is true; if p is false, both sides are false." },
  { name: "Contrapositive", cue: "Reverse + negate both", law: "p → q  ≡  ¬q → ¬p", tip: "This is equivalent. The converse q → p is not." },
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
];

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl bg-[#130E20] border border-[#2A2140] ${className}`}>{children}</div>;
}

function CheatKey() {
  const [open, setOpen] = useState(null);
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-[#F4B942]" />
        <p className="text-white font-heading font-semibold">Cheat key: pattern recognition before memorization</p>
      </div>
      <p className="mt-1 text-sm text-[#9C93B3]">Tap a card when an expression looks scary. The cue tells you the fastest legal move.</p>
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
            {open === index && <p className="text-xs text-[#9C93B3] mt-2 leading-relaxed">{item.tip}</p>}
          </button>
        ))}
      </div>
    </Card>
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
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-white font-heading font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#F4B942]" /> Law sprint</p>
          <p className="text-sm text-[#9C93B3] mt-1">Pick the shortcut; get an explanation immediately.</p>
        </div>
        <span className="font-mono text-xs text-[#B48CFF]">{complete ? `${score}/3` : `Round ${round + 1}/3`}</span>
      </div>
      {complete ? (
        <div className="mt-5 rounded-xl bg-[#173626]/50 border border-[#255239] p-4">
          <p className="text-[#4ADE80] font-semibold flex items-center gap-2"><Trophy className="w-4 h-4" /> Sprint complete: {score}/3 correct.</p>
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
        <p className="mt-2 text-[#9C93B3] max-w-2xl">Equivalence is not a giant list to memorize. Learn the visual patterns, use their shortcut cues, then practice them like a mini-game.</p>
      </div>
      <CheatKey />
      <LawSprint />
    </div>
  );
}
