import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

const A = ["1", "2", "3", "4"];
const B = ["a", "b", "c", "d", "e"];

const PRESETS = [
  { name: "Bijection (4 to 4 shown on a, b, c, d)", map: [0, 1, 2, 3], bsize: 4 },
  { name: "Injective, not onto", map: [0, 1, 2, 3], bsize: 5 },
  { name: "Onto, not one-to-one", map: [0, 0, 1, 2], bsize: 3 },
  { name: "Neither", map: [0, 0, 1, 1], bsize: 4 },
  { name: "Not a function", map: [0, null, 2, 3], bsize: 4 },
];

function analyze(map, bsize) {
  const isFunction = map.every((m) => m !== null);
  const used = map.filter((m) => m !== null);
  const injective = isFunction && new Set(used).size === used.length;
  const range = new Set(used);
  const surjective = isFunction && range.size === bsize;
  return { isFunction, injective, surjective, bijective: injective && surjective, range };
}

function Flag({ label, ok }) {
  return <span className={`px-2 py-1 rounded-md text-xs border ${ok ? "border-[#4ADE80] text-[#4ADE80]" : "border-[#F87171] text-[#F87171]"}`}>{label}: {ok ? "yes" : "no"}</span>;
}

function ArrowDiagram() {
  const [map, setMap] = useState(PRESETS[1].map);
  const [bsize, setBsize] = useState(PRESETS[1].bsize);
  const [sel, setSel] = useState(null);
  const res = analyze(map, bsize);
  const ay = (i) => 30 + i * 45;
  const by = (j) => 20 + j * (190 / Math.max(bsize - 1, 1)) * (4 / 4);
  const hits = (j) => map.filter((m) => m === j).length;

  function clickB(j) {
    if (sel === null) return;
    setMap(map.map((m, i) => (i === sel ? j : m)));
    setSel(null);
  }

  return (
    <Panel>
      <SectionTitle title="Interactive arrow diagram: f from A to B">
        Tap an element of A, then tap an element of B to draw the arrow. The app tells you what kind of mapping you built.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => <Btn key={p.name} onClick={() => { setMap(p.map); setBsize(p.bsize); setSel(null); }}>{p.name}</Btn>)}
      </div>
      <div className="mt-2 flex gap-2 items-center text-sm text-[#9C93B3]">
        Size of codomain B:
        {[3, 4, 5].map((n) => <Btn key={n} active={bsize === n} onClick={() => { setBsize(n); setMap(map.map((m) => (m !== null && m >= n ? null : m))); }}>{n}</Btn>)}
        <Btn onClick={() => setMap([null, null, null, null])}>clear</Btn>
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-4 items-center">
        <svg viewBox="0 0 300 220" className="w-full h-auto max-w-sm mx-auto select-none">
          <text x="50" y="12" textAnchor="middle" fill="#B48CFF" fontSize="12" fontFamily="Consolas, monospace">Domain A</text>
          <text x="250" y="12" textAnchor="middle" fill="#F4B942" fontSize="12" fontFamily="Consolas, monospace">Codomain B</text>
          {map.map((m, i) => m !== null && (
            <line key={i} x1="68" y1={ay(i)} x2="232" y2={by(m)} stroke="#B48CFF" strokeWidth="2" markerEnd="url(#arr)" style={{ transition: "all .3s" }} />
          ))}
          <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#B48CFF" /></marker></defs>
          {A.map((x, i) => (
            <g key={x} onClick={() => setSel(i)} style={{ cursor: "pointer" }}>
              <circle cx="50" cy={ay(i)} r="16" fill={sel === i ? "#7C3AED" : "#130E20"} stroke="#B48CFF" strokeWidth="2" />
              <text x="50" y={ay(i) + 5} textAnchor="middle" fill="#fff" fontSize="14" fontFamily="Consolas, monospace">{x}</text>
            </g>
          ))}
          {B.slice(0, bsize).map((y, j) => {
            const inRange = res.range.has(j);
            return (
              <g key={y} onClick={() => clickB(j)} style={{ cursor: "pointer" }}>
                <circle cx="250" cy={by(j)} r="16" fill={inRange ? "#4ADE80" : "#130E20"} fillOpacity={inRange ? 0.3 : 1} stroke={hits(j) > 1 ? "#F87171" : "#F4B942"} strokeWidth="2" />
                <text x="250" y={by(j) + 5} textAnchor="middle" fill="#fff" fontSize="14" fontFamily="Consolas, monospace">{y}</text>
              </g>
            );
          })}
        </svg>
        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <Flag label="function" ok={res.isFunction} />
            <Flag label="injective" ok={res.injective} />
            <Flag label="surjective" ok={res.surjective} />
            <Flag label="bijective" ok={res.bijective} />
          </div>
          <p className="font-mono text-[#F4B942]">Range = {`{${[...res.range].sort().map((j) => B[j]).join(", ")}}`}, Codomain = {`{${B.slice(0, bsize).join(", ")}}`}</p>
          {!res.isFunction && <p className="text-[#F87171]">Some input in A has no arrow, so this is not a function on all of A.</p>}
          {res.isFunction && !res.injective && <p className="text-[#C9BFE3]">Red-ringed elements of B are hit more than once, so f is not one-to-one.</p>}
          {res.isFunction && !res.surjective && <p className="text-[#C9BFE3]">Elements of B with no green fill are never hit, so f is not onto.</p>}
          {res.bijective && <p className="text-[#4ADE80]">A perfect pairing. A bijection has an inverse function.</p>}
          <p className="text-xs text-[#9C93B3]">Selected: {sel === null ? "none" : `A element ${A[sel]}. Now tap an element of B.`}</p>
        </div>
      </div>
    </Panel>
  );
}

function Vocabulary() {
  const cards = [
    ["Function f: A → B", "Every element of A is sent to exactly one element of B."],
    ["Domain", "The set A of allowed inputs."],
    ["Codomain", "The set B that outputs are allowed to live in."],
    ["Range (image)", "The outputs that actually happen: { f(a) | a ∈ A }. Always a subset of the codomain."],
    ["Image and preimage", "f(a) is the image of a. f⁻¹({b}) is the set of inputs sent to b."],
    ["Injective (one-to-one)", "Different inputs give different outputs: f(a) = f(b) implies a = b."],
    ["Surjective (onto)", "Every element of B is hit: range = codomain."],
    ["Bijective", "Both injective and surjective. A perfect one-to-one correspondence."],
  ];
  return (
    <Panel>
      <SectionTitle title="Function vocabulary" />
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        {cards.map(([t, d]) => (
          <div key={t} className="rounded-xl border border-[#2A2140] bg-[#0F0A1A] p-3">
            <p className="font-mono text-[#F4B942] text-sm">{t}</p>
            <p className="text-sm text-[#C9BFE3] mt-1">{d}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const CURVES = [
  { id: "x", label: "f(x) = x", f: (x) => x, inj: true },
  { id: "x2", label: "f(x) = x²", f: (x) => x * x, inj: false },
  { id: "x3", label: "f(x) = x³", f: (x) => x ** 3, inj: true },
  { id: "floor", label: "f(x) = ⌊x⌋", f: (x) => Math.floor(x), inj: false },
];

function HorizontalLineTest() {
  const [c, setC] = useState(CURVES[1]);
  const [h, setH] = useState(1);
  const sx = (x) => 150 + x * 45;
  const sy = (y) => 110 - y * 18;
  const pts = [];
  for (let x = -3; x <= 3.001; x += 0.05) {
    const y = c.f(x);
    if (Math.abs(y) < 5.5) pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }
  // solutions of f(x) = h on a fine grid
  const hits = [];
  for (let x = -3; x <= 3; x += 0.01) {
    if (c.id === "floor") {
      if (Number.isInteger(h) && Math.abs(Math.floor(x) - h) < 1e-9 && hits.length < 3 && (hits.length === 0 || x - hits[hits.length - 1] > 0.5)) hits.push(x);
    } else if (Math.abs(c.f(x) - h) < 0.012 && (hits.length === 0 || x - hits[hits.length - 1] > 0.3)) hits.push(x);
  }

  return (
    <Panel>
      <SectionTitle title="Horizontal line test">Slide the line. If some horizontal line crosses the graph more than once, the function is not one-to-one.</SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {CURVES.map((k) => <Btn key={k.id} active={c.id === k.id} onClick={() => setC(k)} className="font-mono">{k.label}</Btn>)}
      </div>
      <input type="range" min="-4" max="4" step="1" value={h} onChange={(e) => setH(+e.target.value)} className="w-full mt-3" />
      <svg viewBox="0 0 300 220" className="w-full h-auto max-w-md mx-auto mt-2 bg-[#0F0A1A] rounded-lg">
        <line x1="0" y1="110" x2="300" y2="110" stroke="#2A2140" />
        <line x1="150" y1="0" x2="150" y2="220" stroke="#2A2140" />
        {c.id === "floor" ? (
          [-3, -2, -1, 0, 1, 2].map((k) => <line key={k} x1={sx(k)} y1={sy(k)} x2={sx(k + 1)} y2={sy(k)} stroke="#B48CFF" strokeWidth="3" />)
        ) : (
          <polyline points={pts.join(" ")} fill="none" stroke="#B48CFF" strokeWidth="3" />
        )}
        <line x1="0" y1={sy(h)} x2="300" y2={sy(h)} stroke="#F4B942" strokeWidth="2" strokeDasharray="5 4" />
        {hits.map((x, i) => <circle key={i} cx={sx(x)} cy={sy(h)} r="5" fill="#4ADE80" />)}
      </svg>
      <p className="mt-2 text-sm font-mono text-[#F4B942]">y = {h} crosses at {hits.length} point{hits.length === 1 ? "" : "s"}</p>
      <p className="text-sm text-[#C9BFE3]">{c.label} over the reals is {c.inj ? "one-to-one: every horizontal line crosses at most once." : "not one-to-one: some horizontal lines cross more than once."}</p>
    </Panel>
  );
}

function CompositionAndInverse() {
  const [x, setX] = useState(3);
  const g = (v) => 2 * v + 1;
  const f = (v) => v * v;
  const [inv, setInv] = useState(false);
  return (
    <Panel>
      <SectionTitle title="Composition and inverse">
        (f ∘ g)(x) = f(g(x)): apply g first, then f. Only bijections have an inverse f⁻¹ that undoes f.
      </SectionTitle>
      <label className="mt-3 block text-sm text-[#C9BFE3]">x = {x}<input type="range" min="-5" max="5" value={x} onChange={(e) => setX(+e.target.value)} className="w-full" /></label>
      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-sm">
        <span className="px-3 py-2 rounded-lg bg-[#130E20] border border-[#2A2140]">x = {x}</span>
        <span className="text-[#B48CFF]">→ g(x)=2x+1 →</span>
        <span className="px-3 py-2 rounded-lg bg-[#130E20] border border-[#2A2140]">{g(x)}</span>
        <span className="text-[#B48CFF]">→ f(x)=x² →</span>
        <span className="px-3 py-2 rounded-lg bg-[#7C3AED]/30 border border-[#7C3AED]">{f(g(x))}</span>
      </div>
      <p className="mt-2 text-sm text-[#C9BFE3]">(f ∘ g)({x}) = {f(g(x))}, but (g ∘ f)({x}) = {g(f(x))}. Order matters.</p>
      <div className="mt-4 border-t border-[#211934] pt-3">
        <Btn active={inv} onClick={() => setInv(!inv)}>{inv ? "Show f(x) = 2x + 3" : "Reverse the arrows: f⁻¹"}</Btn>
        <p className="mt-2 font-mono text-sm text-[#F4B942]">{inv ? "f⁻¹(y) = (y − 3) / 2   (undo + 3, then undo × 2)" : "f(x) = 2x + 3   (bijection from R to R)"}</p>
        <p className="mt-1 font-mono text-sm text-[#E4D9FF]">{inv ? `f⁻¹(${2 * x + 3}) = ${x}` : `f(${x}) = ${2 * x + 3}`}</p>
      </div>
    </Panel>
  );
}

function FloorCeil() {
  const [x, setX] = useState(2.4);
  return (
    <Panel>
      <SectionTitle title="Floor and ceiling">⌊x⌋ rounds down to the nearest integer, ⌈x⌉ rounds up. Both are functions from R to Z.</SectionTitle>
      <label className="mt-3 block text-sm text-[#C9BFE3]">x = {x.toFixed(1)}<input type="range" min="-4" max="4" step="0.1" value={x} onChange={(e) => setX(+e.target.value)} className="w-full" /></label>
      <p className="mt-2 font-mono text-[#F4B942]">⌊{x.toFixed(1)}⌋ = {Math.floor(x)}, ⌈{x.toFixed(1)}⌉ = {Math.ceil(x)}</p>
      <p className="text-xs text-[#9C93B3] mt-1">Careful with negatives: ⌊-2.4⌋ = -3, not -2.</p>
    </Panel>
  );
}

function hashBucket(s) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 8;
  return h;
}

function HashDemo() {
  const [text, setText] = useState("alice, bob, carol, dave, erin, frank");
  const words = text.split(",").map((w) => w.trim()).filter(Boolean);
  const buckets = Array.from({ length: 8 }, () => []);
  words.forEach((w) => buckets[hashBucket(w)].push(w));
  const collisions = buckets.some((b) => b.length > 1);
  return (
    <Panel>
      <SectionTitle title="A function that is not injective: hashing into 8 buckets">
        More inputs than buckets means some inputs must share a bucket. That is a collision, and it is expected.
      </SectionTitle>
      <input value={text} onChange={(e) => setText(e.target.value)} className="mt-3 w-full rounded-lg bg-[#0A0714] border border-[#2A2140] px-2 py-1.5 font-mono text-sm text-white" />
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {buckets.map((b, i) => (
          <div key={i} className={`rounded-lg border p-2 min-h-16 ${b.length > 1 ? "border-[#F87171] bg-[#F87171]/10" : "border-[#2A2140] bg-[#0F0A1A]"}`}>
            <p className="font-mono text-xs text-[#B48CFF]">bucket {i}</p>
            {b.map((w) => <p key={w} className="font-mono text-xs text-white break-all">{w}</p>)}
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-[#C9BFE3]">{collisions ? "Collision found: the hash is not injective." : "No collision yet. Add more words."}</p>
      <CodeBlock className="mt-3" title="python" code={`def bucket(s):\n    h = 0\n    for ch in s:\n        h = (h * 31 + ord(ch)) % 8\n    return h\n\n# pure function: same input, same output\n# not injective: 9 names, only 8 buckets\nusers = {"alice": 1001, "bob": 1002}  # dict = a function on its keys`} />
    </Panel>
  );
}

export default function FunctionsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 5 · FUNCTIONS" title="Functions">
        A function sends each input to exactly one output. Learn the vocabulary, then test injective, surjective and bijective mappings yourself.
      </SectionHeader>
      <Vocabulary />
      <ArrowDiagram />
      <HorizontalLineTest />

      <WorkedExample
        tag="PROOF TEMPLATE 1"
        title="Show f(x) = 2x + 3 is injective on R"
        given={[<p key="g">f: R → R, f(x) = 2x + 3.</p>]}
        asked={[<p key="a">Prove f is one-to-one.</p>]}
        steps={[
          { title: "Start from the definition", text: "Suppose f(a) = f(b). We must show a = b.", formula: "2a + 3 = 2b + 3" },
          { title: "Simplify", text: "Subtract 3 from both sides, then divide by 2.", formula: "2a = 2b  →  a = b" },
          { title: "Conclude", text: "f(a) = f(b) forces a = b, so f is injective." },
        ]}
        answer="f is injective."
      />
      <WorkedExample
        tag="PROOF TEMPLATE 2"
        title="Show f(x) = 2x + 3 is surjective onto R"
        given={[<p key="g">f: R → R, f(x) = 2x + 3.</p>]}
        asked={[<p key="a">Prove f is onto.</p>]}
        steps={[
          { title: "Start from the definition", text: "Take any y in the codomain R. We must find an x with f(x) = y." },
          { title: "Solve for x", formula: "2x + 3 = y  →  x = (y − 3) / 2" },
          { title: "Check x is in the domain", text: "(y − 3)/2 is a real number, so it is allowed." },
          { title: "Verify", formula: "f((y − 3)/2) = (y − 3) + 3 = y" },
        ]}
        answer="Every y is hit, so f is surjective. Together with injectivity, f is a bijection, and f⁻¹(y) = (y − 3)/2."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 3"
        title="The domain changes the answer: f(x) = x²"
        given={[<p key="g">f(x) = x² with three different domain and codomain choices.</p>]}
        asked={[<p key="a">Decide injective, surjective and bijective for each.</p>]}
        steps={[
          { title: "f: R → R", text: "f(2) = f(−2) = 4 with 2 ≠ −2, so not injective. Also −1 is never hit, so not surjective." },
          { title: "f: R → [0, ∞)", text: "Every nonnegative y has the root √y, so surjective. Still f(2) = f(−2), so not injective." },
          { title: "f: [0, ∞) → [0, ∞)", text: "If a² = b² with a, b ≥ 0 then a = b, so injective. And every y ≥ 0 is hit by √y, so surjective. Bijective." },
        ]}
        answer="The same formula can be neither, onto only, or bijective. Always state the domain and codomain."
      />
      <CompositionAndInverse />
      <FloorCeil />
      <HashDemo />

      <Quiz
        questions={[
          { q: "f: {1,2,3} → {a,b}. Can f be injective?", options: ["Yes", "No"], answer: 1, why: "Three inputs and only two outputs forces two inputs to share an output (pigeonhole)." },
          { q: "The range of a function is always:", options: ["Equal to the codomain", "A subset of the codomain", "Larger than the domain"], answer: 1, why: "Range is the set of outputs that actually occur." },
          { q: "Which functions have an inverse?", options: ["Injective ones", "Surjective ones", "Bijections"], answer: 2, why: "We need every output hit (to define f⁻¹ everywhere) and hit only once (to make f⁻¹ well defined)." },
          { q: "f(x) = x³ on R is:", options: ["Bijective", "Injective only", "Neither"], answer: 0, why: "Every real y has exactly one real cube root." },
        ]}
      />
      <Reflection
        fact={<p>Every pure function in programming (no side effects) is a mathematical function in exactly this sense: same input, always same output. Cryptographic hash functions are intentionally NOT injective and NOT invertible. Collisions are expected, and that is what makes them one-way.</p>}
        question={<p>A login system maps usernames to user IDs. Does that function need to be injective? Surjective? Both? What goes wrong if it is not?</p>}
        hint="Discuss in pairs (2 minutes) before we move to sequences."
      />
    </div>
  );
}
