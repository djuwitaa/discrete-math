import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { SectionHeader, Btn } from "../shared/SectionHeader";

const PROOFS = [
  {
    id: "sum",
    label: "Sum of 1..n",
    stmt: "1 + 2 + ... + n = n(n+1)/2",
    ok: (n) => { let s = 0; for (let i = 1; i <= n; i++) s += i; return s === (n * (n + 1)) / 2; },
    left: (n) => (n * (n + 1)) / 2, from: 1,
    basis: "n = 1: left side 1, right side 1 · 2 / 2 = 1.",
    hyp: "Assume 1 + ... + k = k(k+1)/2.",
    step: "Add (k + 1) to both sides.",
    formula: "k(k+1)/2 + (k+1) = (k+1)(k+2)/2",
  },
  {
    id: "odd",
    label: "Odd numbers",
    stmt: "1 + 3 + 5 + ... + (2n - 1) = n²",
    ok: (n) => { let s = 0; for (let i = 1; i <= n; i++) s += 2 * i - 1; return s === n * n; },
    from: 1,
    basis: "n = 1: left side 1, right side 1² = 1.",
    hyp: "Assume 1 + 3 + ... + (2k - 1) = k².",
    step: "Add the next odd number 2(k + 1) - 1 = 2k + 1 to both sides.",
    formula: "k² + 2k + 1 = (k + 1)²",
  },
  {
    id: "geo",
    label: "Geometric sum",
    stmt: "1 + 2 + 4 + ... + 2ⁿ = 2ⁿ⁺¹ - 1",
    ok: (n) => { let s = 0; for (let i = 0; i <= n; i++) s += 2 ** i; return s === 2 ** (n + 1) - 1; },
    from: 0,
    basis: "n = 0: left side 1, right side 2¹ - 1 = 1.",
    hyp: "Assume 1 + 2 + ... + 2ᵏ = 2ᵏ⁺¹ - 1.",
    step: "Add 2ᵏ⁺¹ to both sides.",
    formula: "2ᵏ⁺¹ - 1 + 2ᵏ⁺¹ = 2 · 2ᵏ⁺¹ - 1 = 2ᵏ⁺² - 1",
  },
  {
    id: "sq",
    label: "Sum of squares",
    stmt: "1² + 2² + ... + n² = n(n+1)(2n+1)/6",
    ok: (n) => { let s = 0; for (let i = 1; i <= n; i++) s += i * i; return s * 6 === n * (n + 1) * (2 * n + 1); },
    from: 1,
    basis: "n = 1: left side 1, right side 1 · 2 · 3 / 6 = 1.",
    hyp: "Assume 1² + ... + k² = k(k+1)(2k+1)/6.",
    step: "Add (k + 1)² to both sides and factor out (k + 1).",
    formula: "k(k+1)(2k+1)/6 + (k+1)²\n= (k+1)[k(2k+1) + 6(k+1)] / 6\n= (k+1)(2k² + 7k + 6) / 6\n= (k+1)(k+2)(2k+3) / 6",
  },
  {
    id: "div",
    label: "Divisibility",
    stmt: "n³ - n is divisible by 3",
    ok: (n) => (n ** 3 - n) % 3 === 0,
    from: 1,
    basis: "n = 1: 1 - 1 = 0, and 3 divides 0.",
    hyp: "Assume k³ - k = 3m for some integer m.",
    step: "Expand (k + 1)³ - (k + 1).",
    formula: "(k+1)³ - (k+1) = k³ + 3k² + 3k + 1 - k - 1\n= (k³ - k) + 3(k² + k)\n= 3m + 3(k² + k) = 3(m + k² + k)",
  },
  {
    id: "ineq",
    label: "Inequality",
    stmt: "2ⁿ > n² for n ≥ 5",
    ok: (n) => 2 ** n > n * n, from: 5,
    basis: "n = 5: 2⁵ = 32 > 25 = 5².",
    hyp: "Assume 2ᵏ > k² for some k ≥ 5.",
    step: "Double both sides, then show 2k² ≥ (k + 1)² when k ≥ 5.",
    formula: "2ᵏ⁺¹ = 2 · 2ᵏ > 2k²\n2k² - (k+1)² = k² - 2k - 1 = (k-1)² - 2 > 0  for k ≥ 5\nso 2ᵏ⁺¹ > (k+1)²",
  },
  {
    id: "subsets",
    label: "Number of subsets",
    stmt: "A set with n elements has 2ⁿ subsets",
    ok: (n) => 2 ** n === 2 ** n, from: 0,
    basis: "n = 0: the empty set has exactly one subset (itself), and 2⁰ = 1.",
    hyp: "Assume every set with k elements has 2ᵏ subsets.",
    step: "Take a set with k + 1 elements and pick one element x. Subsets without x are the subsets of the remaining k elements: 2ᵏ of them. Subsets with x are those same subsets with x added: another 2ᵏ.",
    formula: "2ᵏ + 2ᵏ = 2ᵏ⁺¹",
  },
];

function Checker({ p }) {
  const [upTo, setUpTo] = useState(0);
  const ns = [];
  for (let n = p.from; n < p.from + upTo; n++) ns.push(n);
  const allOk = ns.every((n) => p.ok(n));
  return (
    <Panel>
      <SectionTitle title="Live brute-force checker">
        Not a proof, but a sanity check that the statement is not obviously wrong.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setUpTo(upTo + 1)}>Test next n</Btn>
        <Btn onClick={() => setUpTo(30)}>Test 30 values</Btn>
        <Btn onClick={() => setUpTo(0)}>Reset</Btn>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {ns.map((n) => <span key={n} className={`px-2 py-1 rounded font-mono text-xs ${p.ok(n) ? "bg-[#4ADE80]/20 text-[#4ADE80]" : "bg-[#F87171]/20 text-[#F87171]"}`}>{n}</span>)}
      </div>
      {upTo > 0 && <p className="mt-2 font-mono text-sm text-[#F4B942]">{allOk ? `Holds for every tested n (${p.from} to ${p.from + upTo - 1}).` : "Found a failure."} Induction extends this to all n.</p>}
    </Panel>
  );
}

export default function InductionProofsSection() {
  const [id, setId] = useState("sum");
  const p = PROOFS.find((x) => x.id === id);
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 6 · MATHEMATICAL INDUCTION" title="Induction Proofs, Step by Step">
        Pick a statement and read the proof in Given, Asked, Solution form. Each uses Basis, Hypothesis, Step and Conclusion.
      </SectionHeader>
      <div className="flex flex-wrap gap-2">{PROOFS.map((x) => <Btn key={x.id} active={x.id === id} onClick={() => setId(x.id)}>{x.label}</Btn>)}</div>
      <WorkedExample
        key={p.id}
        tag="INDUCTION PROOF"
        title={p.label}
        given={[<p key="g">P(n): {p.stmt}</p>]}
        asked={[<p key="a">Prove P(n) for all n ≥ {p.from}.</p>]}
        steps={[
          { title: "Basis step", text: p.basis },
          { title: "Inductive hypothesis", text: p.hyp },
          { title: "Inductive step (prove P(k + 1))", text: p.step, formula: p.formula },
          { title: "Conclusion", text: `P(${p.from}) is true and P(k) implies P(k + 1) for every k ≥ ${p.from}, so by mathematical induction P(n) is true for all n ≥ ${p.from}.` },
        ]}
        answer="Proved."
      />
      <Checker key={`c-${p.id}`} p={p} />
      <Panel>
        <SectionTitle title="Tips for the inductive step" />
        <ul className="mt-2 text-sm text-[#E4D9FF] list-disc pl-5 space-y-1">
          <li>Write P(k + 1) in full first so you know the target.</li>
          <li>Find P(k) inside P(k + 1), then replace it using the hypothesis.</li>
          <li>For divisibility, write the hypothesis as an equation with a witness (k³ - k = 3m).</li>
          <li>For inequalities, chain: left of P(k + 1) is greater than something you can bound, which is at least the right side.</li>
        </ul>
      </Panel>
    </div>
  );
}
