import { useEffect, useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

function Dominoes() {
  const N = 12;
  const [base, setBase] = useState(true);
  const [step, setStep] = useState(true);
  const [fallen, setFallen] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => {
      setFallen((f) => {
        const next = f + 1;
        const canContinue = f === 0 ? base : step;
        if (!canContinue || next > N) {
          setRunning(false);
          return f;
        }
        return next;
      });
    }, 300);
    return () => clearInterval(t);
  }, [running, base, step]);

  return (
    <Panel>
      <SectionTitle title="The domino picture of induction">
        Induction proves P(1), P(2), P(3), ... all at once. Two things are enough: the first domino falls (basis step) and every falling domino knocks over the next one (inductive step). Break either one and see what happens.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn active={base} onClick={() => { setBase(!base); setFallen(0); setRunning(false); }}>Basis step: {base ? "holds" : "broken"}</Btn>
        <Btn active={step} onClick={() => { setStep(!step); setFallen(0); setRunning(false); }}>Inductive step: {step ? "holds" : "broken"}</Btn>
        <Btn onClick={() => { setFallen(0); setRunning(true); }}>Push!</Btn>
        <Btn onClick={() => { setFallen(0); setRunning(false); }}>Reset</Btn>
      </div>
      <svg viewBox="0 0 360 120" className="mt-4 w-full h-auto rounded-lg bg-[#0A0714] border border-[#2A2140]">
        <line x1="0" x2="360" y1="100" y2="100" stroke="#2A2140" strokeWidth="2" />
        {Array.from({ length: N }, (_, i) => {
          const down = i < fallen;
          const x = 18 + i * 28;
          const gap = !step && i === 5;
          return (
            <g key={i} transform={`translate(${x} 100) rotate(${down ? 75 : 0})`} style={{ transition: "transform 0.25s" }}>
              <rect x="-4" y="-60" width="8" height="60" rx="2" fill={gap ? "#F87171" : down ? "#4ADE80" : "#B48CFF"} />
            </g>
          );
        })}
        {Array.from({ length: N }, (_, i) => <text key={i} x={18 + i * 28} y="115" textAnchor="middle" fontSize="9" fill="#9C93B3" fontFamily="Consolas, monospace">{i + 1}</text>)}
      </svg>
      <p className="mt-2 font-mono text-sm text-[#F4B942]">dominoes fallen: {fallen} of {N}</p>
      <p className="text-xs text-[#9C93B3]">Basis broken: nothing starts. Step broken: the chain stops where the red one is not placed correctly, even though the first ones fell.</p>
    </Panel>
  );
}

function Template() {
  const items = [
    ["Statement", "Write P(n) clearly. Say what n ranges over (n ≥ 1, n ≥ 0, ...)."],
    ["Basis step", "Prove P(first value) directly. Compute both sides."],
    ["Inductive hypothesis", "Assume P(k) is true for an arbitrary k ≥ first value. Write it out."],
    ["Inductive step", "Prove P(k + 1) using P(k). Start from one side of P(k + 1), rewrite it to expose P(k), substitute, and simplify to the other side."],
    ["Conclusion", "By mathematical induction, P(n) holds for all n ≥ first value."],
  ];
  const [done, setDone] = useState([]);
  return (
    <Panel>
      <SectionTitle title="The 5 part template (tick them off as you learn them)" />
      <ol className="mt-3 space-y-2">
        {items.map(([h, t], i) => (
          <li key={h}>
            <button onClick={() => setDone(done.includes(i) ? done.filter((x) => x !== i) : [...done, i])} className={`w-full text-left rounded-xl border p-3 touch-manipulation ${done.includes(i) ? "border-[#4ADE80] bg-[#4ADE80]/10" : "border-[#2A2140] bg-[#0F0A1A]"}`}>
              <span className="font-heading text-sm text-[#F4B942]">{i + 1}. {h}</span>
              <span className="block text-sm text-[#E4D9FF] mt-1">{t}</span>
            </button>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

function PChecker() {
  const [max, setMax] = useState(10);
  const [show, setShow] = useState(0);
  const rows = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <Panel>
      <SectionTitle title="Checking P(n) by hand first: 1 + 2 + ... + n = n(n+1)/2">
        Testing small cases builds confidence but is not a proof. Induction covers all n.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setShow(Math.min(show + 1, max))}>Check next n</Btn>
        <Btn onClick={() => setShow(max)}>Check all</Btn>
        <Btn onClick={() => setShow(0)}>Reset</Btn>
        <Btn onClick={() => setMax(max === 10 ? 20 : 10)}>up to {max === 10 ? 20 : 10}</Btn>
      </div>
      <div className="mt-3 overflow-x-auto max-h-64 overflow-y-auto">
        <table className="w-full font-mono text-sm">
          <thead className="text-[#B48CFF] text-left"><tr><th className="p-1">n</th><th className="p-1">left side</th><th className="p-1">n(n+1)/2</th><th className="p-1">ok</th></tr></thead>
          <tbody>
            {rows.slice(0, show).map((n) => {
              const l = (n * (n + 1)) / 2;
              return <tr key={n} className="border-t border-[#211934] text-[#E4D9FF]"><td className="p-1">{n}</td><td className="p-1">{l}</td><td className="p-1">{l}</td><td className="p-1 text-[#4ADE80]">yes</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Pipeline() {
  const nodes = ["Version 1 works", "v1 works ⇒ v2 works", "v2 works ⇒ v3 works", "...", "all versions work"];
  const [lit, setLit] = useState(0);
  return (
    <Panel>
      <SectionTitle title="Where this shows up in real software">
        A test suite checks a few cases (the basis). A proof about a rule that each step preserves (an invariant) shows the property holds after any number of steps, for example after any number of deposits into a bank account.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2"><Btn onClick={() => setLit(Math.min(lit + 1, nodes.length))}>Advance</Btn><Btn onClick={() => setLit(0)}>Reset</Btn></div>
      <svg viewBox="0 0 500 70" className="mt-3 w-full h-auto">
        {nodes.map((t, i) => (
          <g key={t}>
            <rect x={i * 100 + 2} y="10" width="92" height="46" rx="8" fill={i < lit ? "#4ADE80" : "#130E20"} stroke="#7C3AED" style={{ transition: "fill 0.3s" }} />
            <text x={i * 100 + 48} y="38" textAnchor="middle" fontSize="9" fill={i < lit ? "#0A0714" : "#E4D9FF"} fontFamily="Poppins, sans-serif">{t}</text>
          </g>
        ))}
      </svg>
    </Panel>
  );
}

export default function InductionIdeaSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 6 · MATHEMATICAL INDUCTION" title="The Idea of Induction">
        A way to prove a statement P(n) for every natural number n, with only two checks.
      </SectionHeader>
      <Dominoes />
      <Panel>
        <SectionTitle title="Ladder analogy">
          You can reach the first rung (basis). If you can get from any rung to the next one (step), you can reach every rung. You do not have to climb them all to know it.
        </SectionTitle>
        <p className="mt-2 font-mono text-sm text-[#F4B942]">P(1) and (for all k ≥ 1: P(k) → P(k + 1))  ⇒  for all n ≥ 1: P(n)</p>
      </Panel>
      <Template />
      <PChecker />
      <Pipeline />
      <CodeBlock title="python: testing is not proving" code={`def claim(n):\n    return n * n + n + 41   # famous prime generator\n\ndef is_prime(x):\n    return x > 1 and all(x % d for d in range(2, int(x**0.5) + 1))\n\nprint(all(is_prime(claim(n)) for n in range(40)))   # True\nprint(is_prime(claim(40)))                           # False: 40^2 + 40 + 41 = 1681 = 41^2\n# 40 passing cases did not make the statement true for all n.`} />
      <WorkedExample
        tag="WORKED EXAMPLE"
        title="Reading an induction proof"
        given={[<p key="g">P(n): 1 + 2 + ... + n = n(n+1)/2.</p>]}
        asked={[<p key="a">Prove P(n) for all n ≥ 1.</p>]}
        steps={[
          { title: "Basis step", text: "n = 1: left side is 1, right side is 1 · 2 / 2 = 1. Equal." },
          { title: "Inductive hypothesis", text: "Assume 1 + 2 + ... + k = k(k+1)/2 for some k ≥ 1." },
          { title: "Inductive step", text: "Add k + 1 to both sides.", formula: "1 + ... + k + (k+1) = k(k+1)/2 + (k+1)\n= (k+1)(k/2 + 1)\n= (k+1)(k+2)/2" },
          { title: "Conclusion", text: "That is exactly P(k + 1). By induction, P(n) holds for all n ≥ 1." },
        ]}
        answer="Proved for all n ≥ 1."
      />
      <Quiz
        questions={[
          { q: "What does the basis step do?", options: ["Proves P for the first value", "Proves P(k) implies P(k+1)", "Assumes P(n) for all n"], answer: 0, why: "It starts the chain." },
          { q: "In the inductive step you are allowed to:", options: ["Assume P(k) for arbitrary k", "Assume P(k+1)", "Test several values of k"], answer: 0, why: "You assume P(k) and prove P(k+1)." },
          { q: "If only the inductive step is proved, the statement is:", options: ["Still proved", "Not proved", "False"], answer: 1, why: "Without a basis, nothing is ever knocked down." },
        ]}
      />
      <Reflection
        fact={<p>Induction is the proof twin of recursion. A recursive function that has a base case and calls itself on smaller input is correct for the same reason an induction proof is: the base is right and each step trusts the smaller case.</p>}
        question={<p>If a recursive function has no base case, what part of an induction proof is missing? What happens when you run it?</p>}
      />
    </div>
  );
}
