import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

const CORRECT_ORDER = [
  "State P(n) and what n ranges over",
  "Basis step: verify P(1)",
  "Assume P(k) for an arbitrary k (hypothesis)",
  "Show P(k + 1) using P(k) (inductive step)",
  "Conclude P(n) for all n by induction",
];

function ProofBuilder() {
  const [pool, setPool] = useState(() => [3, 0, 4, 1, 2]);
  const [chosen, setChosen] = useState([]);
  const done = chosen.length === CORRECT_ORDER.length;
  const right = done && chosen.every((v, i) => v === i);
  const pick = (v) => {
    setPool(pool.filter((x) => x !== v));
    setChosen([...chosen, v]);
  };
  return (
    <Panel>
      <SectionTitle title="Proof builder">Tap the parts in the correct order.</SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map((v) => <Btn key={v} onClick={() => pick(v)}>{CORRECT_ORDER[v]}</Btn>)}
      </div>
      <ol className="mt-3 list-decimal pl-5 space-y-1 text-sm text-[#E4D9FF]">
        {chosen.map((v, i) => <li key={v} className={v === i ? "text-[#4ADE80]" : "text-[#F87171]"}>{CORRECT_ORDER[v]}</li>)}
      </ol>
      {done && <p className="mt-2 text-sm text-[#F4B942]">{right ? "Perfect order." : "Not quite. Reset and try again."}</p>}
      <div className="mt-3"><Btn onClick={() => { setPool([3, 0, 4, 1, 2]); setChosen([]); }}>Reset</Btn></div>
    </Panel>
  );
}

const FLAWS = [
  {
    title: "All horses are the same color",
    claim: "In any group of n horses, all have the same color.",
    text: "Basis: one horse, trivially true. Step: take k + 1 horses. Remove one, the remaining k share a color. Put it back and remove another, those k share a color. The two groups overlap, so all k + 1 share a color.",
    flaw: "The step fails for k = 1 (n = 2). Two groups of one horse do not overlap, so the argument never links them. The inductive step must work for every k ≥ the basis value, and here it does not work for k = 1.",
  },
  {
    title: "Missing basis",
    claim: "n = n + 1 for all n.",
    text: "Assume k = k + 1. Add 1 to both sides: k + 1 = k + 2. That is P(k + 1), so P(n) holds for all n.",
    flaw: "The inductive step is valid, but there is no basis step. P(1) says 1 = 2, which is false. Without a true start, the chain never begins.",
  },
  {
    title: "Using the conclusion",
    claim: "Prove 1 + 2 + ... + n = n(n+1)/2.",
    text: "Assume it holds for all n and test it for n = k + 1 using the formula for n = k + 1.",
    flaw: "This assumes what is to be proved. The hypothesis is only P(k) for one arbitrary k, never P(k + 1).",
  },
  {
    title: "Hidden dependence on k",
    claim: "Every natural number is less than 1000.",
    text: "Basis: P(1): 1 < 1000. Step: if k < 1000 then k + 1 < 1001, so k + 1 < 1000.",
    flaw: "k + 1 < 1001 does not give k + 1 < 1000. The final algebra step silently changed the bound.",
  },
];

function FlawGallery() {
  const [i, setI] = useState(0);
  const [reveal, setReveal] = useState(false);
  const f = FLAWS[i];
  return (
    <Panel>
      <SectionTitle title="Find the flaw">These proofs look convincing. Where do they break?</SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">{FLAWS.map((x, j) => <Btn key={x.title} active={i === j} onClick={() => { setI(j); setReveal(false); }}>{x.title}</Btn>)}</div>
      <p className="mt-3 text-sm text-[#F4B942]">Claim: {f.claim}</p>
      <p className="mt-2 text-sm text-[#E4D9FF]">{f.text}</p>
      <div className="mt-3"><Btn onClick={() => setReveal(!reveal)}>{reveal ? "Hide" : "Reveal the flaw"}</Btn></div>
      {reveal && <p className="mt-2 text-sm text-[#4ADE80]">{f.flaw}</p>}
    </Panel>
  );
}

const BLANKS = [
  { prompt: "k(k+1)/2 + (k+1) = (k+1)( ___ )", answer: "k/2 + 1", options: ["k/2 + 1", "k + 1", "k/2"] },
  { prompt: "k² + 2k + 1 = ( ___ )²", answer: "k + 1", options: ["k + 1", "k", "2k + 1"] },
  { prompt: "2 · 2ᵏ = 2^( ___ )", answer: "k + 1", options: ["k + 1", "2k", "k"] },
  { prompt: "(k + 1)! = (k + 1) · ___", answer: "k!", options: ["k!", "(k + 1)", "2k"] },
];

function FillIn() {
  const [picked, setPicked] = useState({});
  return (
    <Panel>
      <SectionTitle title="Algebra trainer for the inductive step" />
      <div className="mt-3 space-y-3">
        {BLANKS.map((b, i) => (
          <div key={b.prompt}>
            <p className="font-mono text-sm text-[#E4D9FF]">{b.prompt}</p>
            <div className="mt-1 flex flex-wrap gap-2 items-center">
              {b.options.map((o) => {
                const chosen = picked[i] === o;
                return <Btn key={o} active={chosen} onClick={() => setPicked({ ...picked, [i]: o })}>{o}</Btn>;
              })}
              {picked[i] && <span className={`text-sm ${picked[i] === b.answer ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{picked[i] === b.answer ? "Correct" : "Try again"}</span>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default function InductionPracticeSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 6 · MATHEMATICAL INDUCTION" title="Practice and Common Mistakes">
        Build proofs, spot bad ones, and drill the algebra that makes the inductive step work.
      </SectionHeader>
      <ProofBuilder />
      <FlawGallery />
      <FillIn />
      <WorkedExample
        tag="PRACTICE 1"
        title="Factorial inequality"
        given={[<p key="g">P(n): n! ≥ 2ⁿ⁻¹ for n ≥ 1.</p>]}
        asked={[<p key="a">Prove P(n).</p>]}
        steps={[
          { title: "Basis step", text: "n = 1: 1! = 1 ≥ 2⁰ = 1." },
          { title: "Inductive hypothesis", text: "Assume k! ≥ 2ᵏ⁻¹ for some k ≥ 1." },
          { title: "Inductive step", formula: "(k+1)! = (k+1) · k! ≥ (k+1) · 2ᵏ⁻¹ ≥ 2 · 2ᵏ⁻¹ = 2ᵏ", text: "Since k + 1 ≥ 2." },
          { title: "Conclusion", text: "By induction, n! ≥ 2ⁿ⁻¹ for all n ≥ 1." },
        ]}
        answer="Proved."
      />
      <WorkedExample
        tag="PRACTICE 2"
        title="Divisibility by 6"
        given={[<p key="g">P(n): n(n+1)(n+2) is divisible by 6 for n ≥ 1.</p>]}
        asked={[<p key="a">Prove P(n).</p>]}
        steps={[
          { title: "Basis step", text: "1 · 2 · 3 = 6, divisible by 6." },
          { title: "Hypothesis", text: "k(k+1)(k+2) = 6m for some integer m." },
          { title: "Step", formula: "(k+1)(k+2)(k+3) = k(k+1)(k+2) + 3(k+1)(k+2)\n= 6m + 3(k+1)(k+2)", text: "(k+1)(k+2) is a product of consecutive integers, so it is even, say 2t. Then 3(k+1)(k+2) = 6t." },
          { title: "Conclusion", text: "The total is 6(m + t), divisible by 6." },
        ]}
        answer="Proved."
      />
      <Quiz
        title="Statement classifier"
        questions={[
          { q: "Which statement is a good candidate for induction?", options: ["There exists a prime above 100", "For all n ≥ 1, 1 + 3 + ... + (2n-1) = n²", "x² = 4 has a solution"], answer: 1, why: "It is a claim about every natural number with a recursive shape." },
          { q: "The inductive step for P(n) = 'n² + n is even' should show:", options: ["(k+1)² + (k+1) is even given k² + k is even", "k² + k is even for all k"], answer: 0, why: "Assume P(k), prove P(k + 1)." },
          { q: "A basis step that checks n = 1, 2, 3 only is:", options: ["Enough for a proof", "Not a proof of all n"], answer: 1, why: "More basis cases do not replace the inductive step." },
        ]}
      />
    </div>
  );
}
