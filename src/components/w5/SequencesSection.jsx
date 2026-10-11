import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

function Slider({ label, value, onChange, min, max, step = 1 }) {
  return (
    <label className="block text-xs text-[#C9BFE3]">
      {label}: <span className="font-mono text-[#F4B942]">{value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#7C3AED]" />
    </label>
  );
}

function SequencePlot({ terms, color = "#B48CFF" }) {
  const W = 360;
  const H = 180;
  const max = Math.max(...terms.map((t) => Math.abs(t)), 1);
  const bw = W / terms.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-lg bg-[#0A0714] border border-[#2A2140]">
      <line x1="0" x2={W} y1={H / 2} y2={H / 2} stroke="#2A2140" />
      {terms.map((t, i) => {
        const h = (Math.abs(t) / max) * (H / 2 - 12);
        return <rect key={i} x={i * bw + 2} y={t >= 0 ? H / 2 - h : H / 2} width={Math.max(bw - 4, 1)} height={h} fill={color} rx="2" />;
      })}
    </svg>
  );
}

function SequenceLab() {
  const [kind, setKind] = useState("arith");
  const [a, setA] = useState(3);
  const [d, setD] = useState(4);
  const [r, setR] = useState(2);
  const [n, setN] = useState(8);
  const terms = Array.from({ length: n }, (_, i) => (kind === "arith" ? a + d * i : a * Math.pow(r, i)));
  const sum = terms.reduce((x, y) => x + y, 0);
  return (
    <Panel>
      <SectionTitle title="Sequence lab">
        A sequence is a function from the natural numbers to a set: a₀, a₁, a₂, and so on. Arithmetic sequences add a constant, geometric ones multiply by a constant.
      </SectionTitle>
      <div className="mt-3 flex gap-2"><Btn active={kind === "arith"} onClick={() => setKind("arith")}>Arithmetic</Btn><Btn active={kind === "geo"} onClick={() => setKind("geo")}>Geometric</Btn></div>
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        <Slider label="first term a" value={a} onChange={setA} min={-5} max={10} />
        {kind === "arith" ? <Slider label="difference d" value={d} onChange={setD} min={-5} max={10} /> : <Slider label="ratio r" value={r} onChange={setR} min={-3} max={3} />}
        <Slider label="number of terms n" value={n} onChange={setN} min={2} max={12} />
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-3 items-center">
        <SequencePlot terms={terms} color={kind === "arith" ? "#B48CFF" : "#F4B942"} />
        <div className="font-mono text-sm space-y-1 text-[#E4D9FF]">
          <p className="break-words">{terms.join(", ")}</p>
          <p className="text-[#4ADE80]">{kind === "arith" ? `aₙ = ${a} + ${d}n` : `aₙ = ${a} · (${r})ⁿ`}</p>
          <p className="text-[#F4B942]">sum of the {n} terms = {sum}</p>
        </div>
      </div>
    </Panel>
  );
}

const SPECIAL = [
  { name: "Squares", f: (n) => n * n, form: "n²" },
  { name: "Cubes", f: (n) => n ** 3, form: "n³" },
  { name: "Powers of 2", f: (n) => 2 ** n, form: "2ⁿ" },
  { name: "Triangular", f: (n) => (n * (n + 1)) / 2, form: "n(n+1)/2" },
  { name: "Factorials", f: (n) => { let p = 1; for (let i = 2; i <= n; i++) p *= i; return p; }, form: "n!" },
  { name: "Fibonacci", f: (n) => { let x = 0, y = 1; for (let i = 0; i < n; i++) [x, y] = [y, x + y]; return x; }, form: "fₙ = fₙ₋₁ + fₙ₋₂" },
];

function SpecialSequences() {
  return (
    <Panel>
      <SectionTitle title="Special sequences you should recognise" />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead className="text-left text-[#B48CFF]"><tr><th className="p-2">name</th><th className="p-2">formula</th><th className="p-2">n = 1 to 10</th></tr></thead>
          <tbody>
            {SPECIAL.map((s) => (
              <tr key={s.name} className="border-t border-[#211934] text-[#E4D9FF]">
                <td className="p-2 font-heading">{s.name}</td><td className="p-2 text-[#F4B942]">{s.form}</td>
                <td className="p-2 whitespace-nowrap">{Array.from({ length: 10 }, (_, i) => s.f(i + 1)).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

const SUMS = [
  { id: "n", label: "Σ k", f: (k) => k, closed: (n) => (n * (n + 1)) / 2, form: "n(n+1)/2" },
  { id: "sq", label: "Σ k²", f: (k) => k * k, closed: (n) => (n * (n + 1) * (2 * n + 1)) / 6, form: "n(n+1)(2n+1)/6" },
  { id: "cu", label: "Σ k³", f: (k) => k ** 3, closed: (n) => ((n * (n + 1)) / 2) ** 2, form: "[n(n+1)/2]²" },
  { id: "g", label: "Σ 2ᵏ (k = 0 to n)", f: (k) => 2 ** k, closed: (n) => 2 ** (n + 1) - 1, form: "2ⁿ⁺¹ - 1", from: 0 },
];

function SigmaCalculator() {
  const [id, setId] = useState("n");
  const [n, setN] = useState(10);
  const s = SUMS.find((x) => x.id === id);
  const from = s.from ?? 1;
  const ks = Array.from({ length: n - from + 1 }, (_, i) => i + from);
  const direct = ks.reduce((t, k) => t + s.f(k), 0);
  return (
    <Panel>
      <SectionTitle title="Summation notation and closed forms">
        Σ is a for loop that adds. The closed form gives the answer without looping.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">{SUMS.map((x) => <Btn key={x.id} active={x.id === id} onClick={() => setId(x.id)}>{x.label}</Btn>)}</div>
      <div className="mt-3 max-w-sm"><Slider label="upper limit n" value={n} onChange={setN} min={1} max={20} /></div>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <div className="font-mono text-sm space-y-1">
          <p className="text-[#C9BFE3] break-words">{ks.map((k) => s.f(k)).join(" + ")}</p>
          <p className="text-[#F4B942]">loop total = {direct}</p>
          <p className="text-[#4ADE80]">formula {s.form} = {s.closed(n)}</p>
          <p className={direct === s.closed(n) ? "text-[#4ADE80]" : "text-[#F87171]"}>{direct === s.closed(n) ? "They match." : "Mismatch."}</p>
        </div>
        <CodeBlock title="python" code={`total = 0\nfor k in range(${from}, ${n + 1}):\n    total += ${id === "sq" ? "k*k" : id === "cu" ? "k**3" : id === "g" ? "2**k" : "k"}\nprint(total)   # ${direct}`} />
      </div>
    </Panel>
  );
}

function GaussPairing() {
  const [n, setN] = useState(10);
  const pairs = Math.floor(n / 2);
  return (
    <Panel>
      <SectionTitle title="Gauss pairing: why 1 + 2 + ... + n = n(n+1)/2">
        Write the list forwards and backwards. Every column adds to n + 1, and there are n columns, so twice the sum is n(n+1).
      </SectionTitle>
      <div className="mt-3 max-w-sm"><Slider label="n" value={n} onChange={setN} min={2} max={12} /></div>
      <div className="mt-3 overflow-x-auto">
        <table className="font-mono text-sm">
          <tbody>
            <tr>{Array.from({ length: n }, (_, i) => <td key={i} className="px-2 py-1 text-[#B48CFF] text-center">{i + 1}</td>)}</tr>
            <tr>{Array.from({ length: n }, (_, i) => <td key={i} className="px-2 py-1 text-[#F4B942] text-center">{n - i}</td>)}</tr>
            <tr>{Array.from({ length: n }, (_, i) => <td key={i} className="px-2 py-1 border-t border-[#2A2140] text-[#4ADE80] text-center">{n + 1}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 font-mono text-sm text-[#E4D9FF]">2S = {n} · {n + 1} = {n * (n + 1)}, so S = {(n * (n + 1)) / 2}. ({pairs} symmetric pairs when folded in half.)</p>
    </Panel>
  );
}

function NestedLoops() {
  const [m, setM] = useState(3);
  const [k, setK] = useState(4);
  const cells = [];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= k; j++) cells.push(i * j);
  return (
    <Panel>
      <SectionTitle title="Double sums are nested loops">
        Σᵢ Σⱼ i·j adds the product for every pair (i, j). It is the same shape as a double for loop and as a Cartesian product.
      </SectionTitle>
      <div className="mt-3 grid sm:grid-cols-2 gap-3 max-w-lg"><Slider label="i from 1 to" value={m} onChange={setM} min={1} max={6} /><Slider label="j from 1 to" value={k} onChange={setK} min={1} max={6} /></div>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <div className="overflow-x-auto">
          <table className="font-mono text-sm border-collapse">
            <tbody>
              {Array.from({ length: m }, (_, i) => (
                <tr key={i}>{Array.from({ length: k }, (_, j) => <td key={j} className="border border-[#2A2140] px-3 py-1 text-center text-[#E4D9FF]">{(i + 1) * (j + 1)}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 font-mono text-sm text-[#F4B942]">Total = {cells.reduce((a, b) => a + b, 0)} = [{(m * (m + 1)) / 2}] · [{(k * (k + 1)) / 2}]</p>
        </div>
        <CodeBlock title="python" code={`total = 0\nfor i in range(1, ${m + 1}):\n    for j in range(1, ${k + 1}):\n        total += i * j\nprint(total)  # ${cells.reduce((a, b) => a + b, 0)}`} />
      </div>
    </Panel>
  );
}

function Countability() {
  const [step, setStep] = useState(10);
  const N = 6;
  const path = [];
  for (let s = 0; s < 2 * N - 1; s++) {
    const diag = [];
    for (let i = 0; i < N; i++) {
      const j = s - i;
      if (j >= 0 && j < N) diag.push([i, j]);
    }
    if (s % 2 === 0) diag.reverse();
    path.push(...diag);
  }
  const shown = path.slice(0, step);
  const pos = ([i, j]) => [30 + j * 50, 30 + i * 50];
  return (
    <Panel>
      <SectionTitle title="Cardinality and countable sets">
        A set is countable if its elements can be listed as a first, second, third, and so on. The integers and even the rational numbers can be listed. Drag the slider to walk the zig-zag through all fractions i/j.
      </SectionTitle>
      <div className="mt-3 max-w-sm"><Slider label="elements listed" value={step} onChange={setStep} min={1} max={path.length} /></div>
      <svg viewBox="0 0 330 330" className="mt-3 w-full max-w-sm h-auto rounded-lg bg-[#0A0714] border border-[#2A2140]">
        {Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => <text key={`${i}${j}`} x={30 + j * 50} y={34 + i * 50} textAnchor="middle" fontSize="12" fill="#5B5470" fontFamily="Consolas, monospace">{i + 1}/{j + 1}</text>))}
        {shown.slice(1).map((p, k) => {
          const [x1, y1] = pos(shown[k]);
          const [x2, y2] = pos(p);
          return <line key={k} x1={x1} y1={y1 - 4} x2={x2} y2={y2 - 4} stroke="#B48CFF" strokeWidth="1.5" />;
        })}
        {shown.length > 0 && (() => { const [x, y] = pos(shown[shown.length - 1]); return <circle cx={x} cy={y - 4} r="14" fill="none" stroke="#F4B942" strokeWidth="2" />; })()}
      </svg>
      <p className="mt-2 text-sm text-[#C9BFE3]">The real numbers are different. Cantor's diagonal argument shows that any list of reals misses one: build a number whose n-th digit differs from the n-th digit of the n-th listed number. So the reals are uncountable.</p>
    </Panel>
  );
}

export default function SequencesSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 5 · SEQUENCES, SUMS, CARDINALITY" title="Sequences, Summations and Cardinality">
        Terms, closed forms, sigma and pi notation, double sums, and how to compare the sizes of infinite sets.
      </SectionHeader>
      <SequenceLab />
      <SpecialSequences />
      <SigmaCalculator />
      <GaussPairing />
      <NestedLoops />
      <Panel>
        <SectionTitle title="Product notation and useful sum facts" />
        <div className="mt-2 font-mono text-sm text-[#E4D9FF] space-y-1">
          <p>Π from k=1 to n of k = n!   (so Π k for n = 5 is 120)</p>
          <p>Σ c·aₖ = c · Σ aₖ</p>
          <p>Σ (aₖ + bₖ) = Σ aₖ + Σ bₖ</p>
          <p>Σ from k=0 to n of rᵏ = (rⁿ⁺¹ - 1) / (r - 1), for r ≠ 1</p>
        </div>
      </Panel>
      <Countability />

      <WorkedExample
        tag="WORKED EXAMPLE 1"
        title="Arithmetic sequence"
        given={[<p key="g">a₃ = 11 and a₇ = 23 in an arithmetic sequence.</p>]}
        asked={[<p key="a">Find a₀, d and a₁₀.</p>]}
        steps={[
          { title: "Find d", text: "From index 3 to 7 we add d four times.", formula: "4d = 23 - 11 = 12, so d = 3" },
          { title: "Find a₀", formula: "a₃ = a₀ + 3d, so 11 = a₀ + 9, a₀ = 2" },
          { title: "Find a₁₀", formula: "a₁₀ = 2 + 3 · 10 = 32" },
        ]}
        answer="a₀ = 2, d = 3, a₁₀ = 32."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 2"
        title="Geometric sum"
        given={[<p key="g">Σ from k=0 to 6 of 3ᵏ.</p>]}
        asked={[<p key="a">Evaluate it with the closed form.</p>]}
        steps={[
          { title: "Apply the formula with r = 3, n = 6", formula: "(3⁷ - 1) / (3 - 1) = (2187 - 1) / 2 = 1093" },
          { title: "Check by adding", formula: "1 + 3 + 9 + 27 + 81 + 243 + 729 = 1093" },
        ]}
        answer="1093."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 3"
        title="Sum of the first n even numbers"
        given={[<p key="g">2 + 4 + 6 + ... + 2n.</p>]}
        asked={[<p key="a">Find a closed form.</p>]}
        steps={[
          { title: "Factor out 2", formula: "2(1 + 2 + ... + n)" },
          { title: "Use Gauss", formula: "2 · n(n+1)/2 = n(n+1)" },
        ]}
        answer="n(n+1). For n = 4: 2 + 4 + 6 + 8 = 20 = 4 · 5."
      />
      <Quiz
        questions={[
          { q: "Σ from k=1 to 100 of k equals:", options: ["5000", "5050", "10100"], answer: 1, why: "100 · 101 / 2 = 5050." },
          { q: "Which set is NOT countable?", options: ["Integers", "Rationals", "Real numbers in [0, 1]"], answer: 2, why: "Cantor's diagonal argument." },
          { q: "Geometric sequence 5, 10, 20, ... has ratio:", options: ["2", "5", "10"], answer: 0, why: "Each term is twice the previous one." },
        ]}
      />
    </div>
  );
}
