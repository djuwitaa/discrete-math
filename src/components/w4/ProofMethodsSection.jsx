import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { TruthToggle, Badge } from "./Widgets";
import { tf } from "./rules";

const METHODS = [
  { name: "Direct proof", start: "Assume p is true.", end: "Show q is true through a chain of known facts.", use: "The hypothesis gives you something concrete to work with." },
  { name: "Proof by contraposition", start: "Assume ¬q is true.", end: "Show ¬p is true.", use: "The conclusion q is awkward to reach, but its negation gives you a clean start." },
  { name: "Proof by contradiction", start: "Assume the statement is false.", end: "Reach a contradiction, such as r ∧ ¬r.", use: "You are proving a negative claim, or nothing direct comes to mind." },
  { name: "Proof by cases", start: "Split into cases that cover every possibility.", end: "Prove the claim in each case.", use: "The statement behaves differently for different kinds of input, like even and odd." },
];

function Overview() {
  return (
    <Panel>
      <SectionTitle title="What is a proof?">
        A <strong className="text-[#E4D9FF]">proof</strong> is a valid argument that starts from definitions, axioms, and already proven results, and
        ends at the statement we want. Most theorems have the form <span className="font-mono text-[#F4B942]">p → q</span>, so the method
        we pick is about <em>how</em> to get from p to q.
        <p>Check the real application of definition, axiom, and theorem in this link: <a href="https://www.youtube.com/watch?v=FBVFi1rTwRk" className="text-[#F4B942] underline">YT Vid - 
KURT GODEL PROVES "GOD EXISTS" WITH THE SCIENCE OF LOGIC</a></p>
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {METHODS.map((m) => (
          <div key={m.name} className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-4">
            <p className="text-sm font-semibold text-[#B48CFF]">{m.name}</p>
            <p className="mt-2 text-sm text-[#E4D9FF]"><span className="text-[#9C93B3]">Start: </span>{m.start}</p>
            <p className="text-sm text-[#E4D9FF]"><span className="text-[#9C93B3]">Finish: </span>{m.end}</p>
            <p className="mt-2 text-xs text-[#9C93B3]">Good when: {m.use}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#9C93B3]">
        Two helpers to remember: a <strong className="text-[#E4D9FF]">counterexample</strong> disproves a universal claim, and a
        <strong className="text-[#E4D9FF]"> constructive proof</strong> proves "there exists" by showing one example.
      </p>
    </Panel>
  );
}

const PRESETS = [
  { p: "it rains", q: "the ground is wet" },
  { p: "n is even", q: "n² is even" },
  { p: "I study", q: "I pass" },
];

function ContrapositiveLab() {
  const [preset, setPreset] = useState(0);
  const [vals, setVals] = useState({ p: true, q: true });
  const { p, q } = PRESETS[preset];
  const imp = (a, b) => !a || b;
  const forms = [
    { name: "Original", sym: "p → q", text: `If ${p}, then ${q}.`, v: imp(vals.p, vals.q), group: 0 },
    { name: "Converse", sym: "q → p", text: `If ${q}, then ${p}.`, v: imp(vals.q, vals.p), group: 1 },
    { name: "Inverse", sym: "¬p → ¬q", text: `If not (${p}), then not (${q}).`, v: imp(!vals.p, !vals.q), group: 1 },
    { name: "Contrapositive", sym: "¬q → ¬p", text: `If not (${q}), then not (${p}).`, v: imp(!vals.q, !vals.p), group: 0 },
  ];

  return (
    <Panel>
      <SectionTitle title="Contrapositive lab">
        Proof by contraposition works because <span className="font-mono text-[#F4B942]">p → q</span> is logically equivalent to
        <span className="font-mono text-[#F4B942]"> ¬q → ¬p</span>. Flip p and q below and watch which forms always agree.
      </SectionTitle>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((item, i) => (
          <button key={i} onClick={() => setPreset(i)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${i === preset ? "bg-[#7C3AED] border-transparent text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]"}`}>
            p: {item.p}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <TruthToggle name="p" value={vals.p} onChange={(v) => setVals((c) => ({ ...c, p: v }))} />
        <TruthToggle name="q" value={vals.q} onChange={(v) => setVals((c) => ({ ...c, q: v }))} />
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {forms.map((f) => (
          <div key={f.name} className={`rounded-lg bg-[#0F0A1A] border p-4 ${f.group === 0 ? "border-[#7C3AED]/60" : "border-[#F4B942]/40"}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#E4D9FF]">{f.name}</p>
              <Badge ok={f.v}>{tf(f.v)}</Badge>
            </div>
            <p className="font-mono text-[#F4B942] mt-1">{f.sym}</p>
            <p className="text-sm text-[#C9BFE3] mt-1">{f.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#9C93B3]">
        Purple cards (original and contrapositive) always show the same value. Gold cards (converse and inverse) always match each other,
        but can differ from the original. So proving the converse does <strong className="text-[#E4D9FF]">not</strong> prove the original.
      </p>
    </Panel>
  );
}

const CHOOSER = [
  { s: "If n² is even, then n is even.", a: "contra", why: "Working with n² to get n is awkward. Assume n is odd instead, and the algebra becomes easy." },
  { s: "If n is odd, then n² is odd.", a: "direct", why: "Write n = 2k + 1 and expand. The hypothesis hands you a formula to compute with." },
  { s: "√2 is irrational.", a: "contradiction", why: "There is no hypothesis to start from. Assume √2 is rational and look for a clash." },
  { s: "For every integer n, n(n + 1) is even.", a: "cases", why: "Even n and odd n behave differently, so split into those two cases." },
  { s: "If 3n + 2 is odd, then n is odd.", a: "contra", why: "Assuming n is even gives 3n + 2 = 2(3k + 1) right away." },
];
const CHOICES = [["direct", "Direct"], ["contra", "Contraposition"], ["contradiction", "Contradiction"], ["cases", "Cases"]];

function MethodChooser() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const item = CHOOSER[i];

  if (i >= CHOOSER.length) {
    return (
      <Panel>
        <SectionTitle title="Pick the method" />
        <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-5 text-center">
          <p className="text-2xl font-heading text-white">{score} / {CHOOSER.length}</p>
          <button onClick={() => { setI(0); setScore(0); setPicked(null); }} className="mt-4 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">Try again</button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <SectionTitle title="Pick the method">Several methods can work, but one is usually the smoothest. Choose the most natural start for each statement.</SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="text-xs text-[#9C93B3]">Statement {i + 1} of {CHOOSER.length}</p>
        <p className="mt-2 font-mono text-[#F4B942]">{item.s}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CHOICES.map(([id, label]) => {
            const state = !picked ? "idle" : id === item.a ? "right" : picked === id ? "wrong" : "idle";
            return (
              <button key={id} onClick={() => { if (!picked) { setPicked(id); if (id === item.a) setScore((s) => s + 1); } }}
                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                  state === "right" ? "bg-[#173626]/60 border-[#4ADE80] text-[#4ADE80]"
                  : state === "wrong" ? "bg-[#3A1C22]/60 border-[#F87171] text-[#F87171]"
                  : "bg-[#130E20] border-[#2A2140] text-[#C9BFE3] hover:border-[#7C3AED]/60"}`}>
                {label}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className="mt-3">
            <p className="text-sm text-[#C9BFE3]">{picked === item.a ? "Correct. " : "Not the smoothest choice. "}{item.why}</p>
            <button onClick={() => { setI(i + 1); setPicked(null); }} className="mt-3 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">{i === CHOOSER.length - 1 ? "See score" : "Next"}</button>
          </div>
        )}
      </div>
    </Panel>
  );
}

const PROOFS = [
  {
    id: "direct", name: "Direct proof",
    claim: "If n is odd, then n² is odd.",
    plan: "Assume p (n is odd). Compute until q (n² is odd) appears.",
    steps: [
      "Assume n is odd.",
      "By definition of odd, n = 2k + 1 for some integer k.",
      "Then n² = (2k + 1)² = 4k² + 4k + 1.",
      "Rewrite: n² = 2(2k² + 2k) + 1.",
      "Since 2k² + 2k is an integer, n² has the form 2m + 1, so n² is odd. ∎",
    ],
  },
  {
    id: "contra", name: "Contraposition",
    claim: "If 3n + 2 is odd, then n is odd.",
    plan: "Prove the contrapositive: if n is even, then 3n + 2 is even.",
    steps: [
      "We prove the contrapositive: if n is even, then 3n + 2 is even.",
      "Assume n is even, so n = 2k for some integer k.",
      "Then 3n + 2 = 3(2k) + 2 = 6k + 2.",
      "Rewrite: 6k + 2 = 2(3k + 1), and 3k + 1 is an integer.",
      "So 3n + 2 is even. The contrapositive holds, hence the original statement holds. ∎",
    ],
  },
  {
    id: "contradiction", name: "Contradiction",
    claim: "√2 is irrational.",
    plan: "Assume √2 is rational and derive a clash with 'lowest terms'.",
    steps: [
      "Assume √2 is rational: √2 = a/b with integers a, b with no common factor.",
      "Squaring gives 2 = a²/b², so a² = 2b².",
      "So a² is even, which forces a to be even. Write a = 2c.",
      "Then 4c² = 2b², so b² = 2c², which makes b even too.",
      "Now a and b are both even, contradicting that they have no common factor. So √2 is irrational. ∎",
    ],
  },
  {
    id: "cases", name: "Cases",
    claim: "For every integer n, n(n + 1) is even.",
    plan: "Every integer is even or odd, so check both cases.",
    steps: [
      "Every integer n is either even or odd. We check both cases.",
      "Case 1: n is even. Then n = 2k, so n(n + 1) = 2k(n + 1), which is even.",
      "Case 2: n is odd. Then n + 1 is even, so n + 1 = 2k.",
      "Then n(n + 1) = n(2k) = 2(nk), which is even.",
      "In both cases n(n + 1) is even. ∎",
    ],
  },
];

// Fixed shuffle so the exercise is the same on every render.
const ORDER = [3, 0, 4, 2, 1];

function ProofOrdering() {
  const [id, setId] = useState("direct");
  const [done, setDone] = useState([]);
  const [wrong, setWrong] = useState(null);
  const proof = PROOFS.find((p) => p.id === id);
  const shuffled = ORDER.map((idx) => ({ idx, text: proof.steps[idx] }));
  const finished = done.length === proof.steps.length;

  function switchProof(next) {
    setId(next); setDone([]); setWrong(null);
  }
  function pick(idx) {
    if (idx === done.length) { setDone([...done, idx]); setWrong(null); }
    else setWrong(idx);
  }

  return (
    <Panel>
      <SectionTitle title="Assemble the proof">
        The steps of each proof are scrambled. Click them in the order a reader would need them. A wrong click will tell you so, and a hint is
        always available.
      </SectionTitle>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROOFS.map((p) => (
          <button key={p.id} onClick={() => switchProof(p.id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${p.id === id ? "bg-[#7C3AED] border-transparent text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]"}`}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="text-xs text-[#9C93B3]">Claim</p>
        <p className="font-mono text-[#F4B942]">{proof.claim}</p>
        <p className="mt-1 text-sm text-[#9C93B3]">Plan: {proof.plan}</p>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#9C93B3] mb-2">Scrambled steps</p>
          <div className="space-y-2">
            {shuffled.map(({ idx, text }) => {
              const used = done.includes(idx);
              return (
                <button key={idx} disabled={used} onClick={() => pick(idx)}
                  className={`w-full text-left rounded-lg border p-3 text-sm transition ${
                    used ? "opacity-30 border-[#2A2140] text-[#5B5470]"
                    : wrong === idx ? "border-[#F87171] bg-[#3A1C22]/40 text-[#F87171]"
                    : "border-[#2A2140] bg-[#130E20] text-[#E4D9FF] hover:border-[#7C3AED]/60"}`}>
                  {text}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-xs text-[#9C93B3] mb-2">Your proof</p>
          <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4 min-h-[10rem] space-y-2">
            {done.length === 0 && <p className="text-sm text-[#5B5470]">Click the first step to begin.</p>}
            {done.map((idx, n) => (
              <p key={idx} className="text-sm text-[#E4D9FF]"><span className="font-mono text-[#B48CFF]">{n + 1}.</span> {proof.steps[idx]}</p>
            ))}
          </div>
          {wrong !== null && <p className="mt-2 text-sm text-[#F87171]">That step does not come next. Hint: {done.length === 0 ? "start with the assumption or setup." : "what does the last line you wrote let you do?"}</p>}
          {finished && <p className="mt-2 text-sm text-[#4ADE80]">Proof complete. Notice how it opens with its method (assume, contrapositive, cases, or contradiction) before computing.</p>}
          <button onClick={() => { setDone([]); setWrong(null); }} className="mt-3 px-4 py-2 rounded-lg border border-[#2A2140] text-[#9C93B3] text-sm">Reset</button>
        </div>
      </div>
    </Panel>
  );
}

export default function ProofMethodsSection() {
  return (
    <div className="space-y-6">
      <Overview />
      <ContrapositiveLab />
      <MethodChooser />
      <ProofOrdering />
    </div>
  );
}
