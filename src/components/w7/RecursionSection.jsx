import { useEffect, useState } from "react";
import { Panel, SectionTitle, DataTable } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";

const F = ({ children }) => <span className="font-mono text-[#F4B942]">{children}</span>;

const numInput = "bg-[#0A0714] border border-[#2A2140] rounded-lg px-3 py-2 text-[#E4D9FF] font-mono w-28 text-base";
const btn = "px-4 py-2 rounded-lg text-sm border transition";
const btnOn = "bg-[#7C3AED] border-transparent text-white";
const btnOff = "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]";

/* ------------------------------------------------------------------ */
/* Intro                                                               */
/* ------------------------------------------------------------------ */

function Intro() {
  const cards = [
    ["Base case", "The answer for the smallest inputs, stated directly. It stops the recursion.", "#4ADE80"],
    ["Recursive step", "Define the answer for a bigger input using the answer for smaller ones.", "#F4B942"],
    ["Progress", "Each recursive call must move closer to a base case, otherwise it never ends.", "#B48CFF"],
  ];
  return (
    <Panel>
      <SectionTitle title="What is a recursive definition?">
        A recursive definition describes something in terms of smaller versions of itself. It is the definition-side twin of induction: the
        base case is the basis step, and the recursive rule is the inductive step.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {cards.map(([t, d, c]) => (
          <div key={t} className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
            <p className="text-sm font-semibold" style={{ color: c }}>{t}</p>
            <p className="mt-2 text-sm text-[#C9BFE3]">{d}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#9C93B3]">
        Recursion can define <strong className="text-[#E4D9FF]">functions</strong> (n!), <strong className="text-[#E4D9FF]">sequences</strong> (Fibonacci),
        <strong className="text-[#E4D9FF]"> sets</strong> (strings, palindromes, well-formed formulas) and <strong className="text-[#E4D9FF]">structures</strong> (binary trees).
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery of recursive functions with live traces                     */
/* ------------------------------------------------------------------ */

const GALLERY = [
  {
    id: "fact", name: "Factorial", kind: "num", init: "4", max: 8, hint: "n from 0 to 8",
    def: ["0! = 1", "n! = n · (n-1)!   for n ≥ 1"],
    run: (n) => {
      const log = [];
      const f = (k, d) => {
        log.push([d, `fact(${k})`]);
        if (k === 0) { log.push([d, "return 1   (base case)"]); return 1; }
        const r = k * f(k - 1, d + 1);
        log.push([d, `return ${k} * ${r / k} = ${r}`]);
        return r;
      };
      return { log, res: String(f(n, 0)) };
    },
  },
  {
    id: "fib", name: "Fibonacci", kind: "num", init: "4", max: 5, hint: "n from 0 to 5",
    def: ["F(0) = 0,  F(1) = 1", "F(n) = F(n-1) + F(n-2)   for n ≥ 2"],
    run: (n) => {
      const log = [];
      const f = (k, d) => {
        log.push([d, `fib(${k})`]);
        if (k < 2) { log.push([d, `return ${k}   (base case)`]); return k; }
        const a = f(k - 1, d + 1);
        const b = f(k - 2, d + 1);
        log.push([d, `return ${a} + ${b} = ${a + b}`]);
        return a + b;
      };
      return { log, res: String(f(n, 0)) };
    },
  },
  {
    id: "sum", name: "Sum 1..n", kind: "num", init: "5", max: 10, hint: "n from 0 to 10",
    def: ["S(0) = 0", "S(n) = n + S(n-1)   for n ≥ 1"],
    run: (n) => {
      const log = [];
      const f = (k, d) => {
        log.push([d, `S(${k})`]);
        if (k === 0) { log.push([d, "return 0   (base case)"]); return 0; }
        const r = k + f(k - 1, d + 1);
        log.push([d, `return ${k} + ${r - k} = ${r}`]);
        return r;
      };
      return { log, res: String(f(n, 0)) };
    },
  },
  {
    id: "pow", name: "Power 2^n", kind: "num", init: "5", max: 10, hint: "n from 0 to 10",
    def: ["2^0 = 1", "2^n = 2 · 2^(n-1)   for n ≥ 1"],
    run: (n) => {
      const log = [];
      const f = (k, d) => {
        log.push([d, `pow2(${k})`]);
        if (k === 0) { log.push([d, "return 1   (base case)"]); return 1; }
        const r = 2 * f(k - 1, d + 1);
        log.push([d, `return 2 * ${r / 2} = ${r}`]);
        return r;
      };
      return { log, res: String(f(n, 0)) };
    },
  },
  {
    id: "gcd", name: "GCD", kind: "pair", init: "48,18", hint: "two integers a,b (0 to 9999)",
    def: ["gcd(a, 0) = a", "gcd(a, b) = gcd(b, a mod b)   for b > 0"],
    run: ([a, b]) => {
      const log = [];
      const f = (x, y, d) => {
        log.push([d, `gcd(${x}, ${y})`]);
        if (y === 0) { log.push([d, `return ${x}   (base case)`]); return x; }
        const r = f(y, x % y, d + 1);
        log.push([d, `return ${r}`]);
        return r;
      };
      return { log, res: String(f(a, b, 0)) };
    },
  },
  {
    id: "len", name: "String length", kind: "text", init: "cat", hint: "a short word",
    def: ["len(\"\") = 0", "len(c + w) = 1 + len(w)"],
    run: (s) => {
      const log = [];
      const f = (w, d) => {
        log.push([d, `len("${w}")`]);
        if (w === "") { log.push([d, "return 0   (base case)"]); return 0; }
        const r = 1 + f(w.slice(1), d + 1);
        log.push([d, `return 1 + ${r - 1} = ${r}`]);
        return r;
      };
      return { log, res: String(f(s, 0)) };
    },
  },
  {
    id: "pal", name: "Palindrome", kind: "text", init: "racecar", hint: "a short word",
    def: ["A string of length 0 or 1 is a palindrome", "c w c is a palindrome when w is a palindrome", "anything else is not"],
    run: (s) => {
      const log = [];
      const f = (w, d) => {
        log.push([d, `isPal("${w}")`]);
        if (w.length <= 1) { log.push([d, "return True   (base case)"]); return true; }
        if (w[0] !== w[w.length - 1]) { log.push([d, `return False   ('${w[0]}' ≠ '${w[w.length - 1]}')`]); return false; }
        const r = f(w.slice(1, -1), d + 1);
        log.push([d, `return ${r ? "True" : "False"}`]);
        return r;
      };
      return { log, res: f(s, 0) ? "True" : "False" };
    },
  },
];

function parseInput(g, raw) {
  if (g.kind === "num") {
    const n = Math.floor(Number(raw));
    return Math.min(g.max, Math.max(0, Number.isFinite(n) ? n : 0));
  }
  if (g.kind === "pair") {
    const [a, b] = String(raw).split(",").map((v) => Math.min(9999, Math.max(0, Math.floor(Number(v)) || 0)));
    return [a ?? 0, b ?? 0];
  }
  return String(raw).toLowerCase().replace(/[^a-z]/g, "").slice(0, 10);
}

function Gallery() {
  const [gi, setGi] = useState(0);
  const [raw, setRaw] = useState(GALLERY[0].init);
  const g = GALLERY[gi];
  const { log, res } = g.run(parseInput(g, raw));
  const pick = (i) => { setGi(i); setRaw(GALLERY[i].init); };

  return (
    <Panel>
      <SectionTitle title="A gallery of recursive definitions">
        Choose a definition, type an input, and read the trace. Calls go down line by line until a base case, then the answers come back up.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {GALLERY.map((x, i) => <button key={x.id} onClick={() => pick(i)} className={`${btn} ${i === gi ? btnOn : btnOff}`}>{x.name}</button>)}
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#7C3AED]/40 p-4">
          <p className="text-xs font-semibold text-[#B48CFF] tracking-wide">DEFINITION</p>
          {g.def.map((l) => <p key={l} className="mt-1 font-mono text-sm text-[#F4B942] break-words">{l}</p>)}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input className={numInput} value={raw} onChange={(e) => setRaw(e.target.value)} aria-label="input" />
            <span className="text-xs text-[#9C93B3]">{g.hint}</span>
          </div>
          <p className="mt-3 text-sm text-[#C9BFE3]">Result: <span className="font-mono text-[#4ADE80]">{res}</span></p>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-3 overflow-x-auto max-h-80 overflow-y-auto">
          <p className="text-xs font-semibold text-[#9C93B3] tracking-wide mb-2">TRACE ({log.length} lines)</p>
          {log.map(([d, t], i) => (
            <p key={i} className={`font-mono text-xs whitespace-pre ${t.startsWith("return") ? "text-[#4ADE80]" : "text-[#E4D9FF]"}`} style={{ paddingLeft: d * 14 }}>{t}</p>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Recursively defined sets: WFF checker                               */
/* ------------------------------------------------------------------ */

function wffEnd(s, i) {
  if (i >= s.length) return -1;
  const c = s[i];
  if ("pqr".includes(c)) return i + 1;
  if (c === "¬") return wffEnd(s, i + 1);
  if (c === "(") {
    const a = wffEnd(s, i + 1);
    if (a < 0 || !"∧∨→↔".includes(s[a] ?? "x")) return -1;
    const b = wffEnd(s, a + 1);
    return b >= 0 && s[b] === ")" ? b + 1 : -1;
  }
  return -1;
}
const isWff = (s) => s.length > 0 && wffEnd(s, 0) === s.length;

function SetsPanel() {
  const [txt, setTxt] = useState("(p∧¬q)");
  const clean = txt.replace(/\s/g, "");
  const ok = isWff(clean);
  const samples = ["p", "¬¬q", "(p∧q)", "((p∨q)→¬r)", "p∧q", "(p∧)", "(pq)"];
  return (
    <Panel>
      <SectionTitle title="Recursively defined sets and structures">
        A set can be defined by listing basic members and rules that build new members from old ones. Anything that cannot be built this way is not in the set.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
          <p className="text-sm font-semibold text-[#B48CFF]">Binary trees</p>
          <p className="mt-2 text-sm text-[#C9BFE3]">Basis: a single vertex is a binary tree.</p>
          <p className="text-sm text-[#C9BFE3]">Step: a root with up to two binary trees as children is a binary tree.</p>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
          <p className="text-sm font-semibold text-[#B48CFF]">Strings over an alphabet Σ</p>
          <p className="mt-2 text-sm text-[#C9BFE3]">Basis: the empty string λ is in Σ*.</p>
          <p className="text-sm text-[#C9BFE3]">Step: if w ∈ Σ* and x ∈ Σ, then wx ∈ Σ*.</p>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4 sm:col-span-2">
          <p className="text-sm font-semibold text-[#B48CFF]">Well-formed formulas (WFFs) of propositional logic</p>
          <p className="mt-2 text-sm text-[#C9BFE3]">Basis: p, q, r are WFFs. Step: if A and B are WFFs, so are <F>¬A</F> and <F>(A ∧ B)</F>, <F>(A ∨ B)</F>, <F>(A → B)</F>, <F>(A ↔ B)</F>.</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="text-sm font-semibold text-[#B48CFF]">Live WFF checker (it recurses exactly like the definition)</p>
        <input className="mt-2 w-full bg-[#0A0714] border border-[#2A2140] rounded-lg px-3 py-2 text-[#E4D9FF] font-mono text-base" value={txt} onChange={(e) => setTxt(e.target.value)} aria-label="formula" />
        <div className="mt-2 flex flex-wrap gap-1">
          {["p", "q", "r", "¬", "∧", "∨", "→", "↔", "(", ")"].map((s) => (
            <button key={s} onClick={() => setTxt(txt + s)} className="w-10 h-10 rounded-lg border border-[#2A2140] bg-[#130E20] font-mono text-[#E4D9FF] hover:border-[#7C3AED]">{s}</button>
          ))}
          <button onClick={() => setTxt("")} className="px-3 h-10 rounded-lg border border-[#2A2140] text-[#9C93B3] text-sm">Clear</button>
        </div>
        <p className="mt-2 font-mono text-sm" style={{ color: ok ? "#4ADE80" : "#F87171" }}>{clean === "" ? "Type a formula" : ok ? "Well-formed formula" : "Not a WFF"}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {samples.map((s) => <button key={s} onClick={() => setTxt(s)} className="px-2 py-1 rounded border border-[#211934] font-mono text-xs text-[#9C93B3] hover:text-white">{s}</button>)}
        </div>
        <p className="mt-2 text-xs text-[#9C93B3]">Note that p∧q fails: our definition requires the outer parentheses, so every compound formula is unambiguous.</p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Layout helper (binary-ish trees)                                    */
/* ------------------------------------------------------------------ */

function layoutTree(root, dx, dy) {
  const nodes = [];
  const edges = [];
  let leaf = 0;
  let maxDepth = 0;
  const walk = (node, depth, path) => {
    maxDepth = Math.max(maxDepth, depth);
    const kids = node.kids.map((k, i) => walk(k, depth + 1, [...path, i]));
    const x = kids.length === 0 ? (leaf++) * dx + dx / 2 : (kids[0].x + kids[kids.length - 1].x) / 2;
    const me = { ref: node, x, y: depth * dy + dy / 2, depth, path };
    nodes.push(me);
    kids.forEach((k) => edges.push([me, k]));
    return me;
  };
  walk(root, 0, []);
  return { nodes, edges, width: Math.max(leaf, 1) * dx, height: (maxDepth + 1) * dy, leaves: leaf };
}

/* ------------------------------------------------------------------ */
/* Fibonacci call tree with memoization                                */
/* ------------------------------------------------------------------ */

function buildFib(n, memo) {
  const seen = new Set();
  let id = 0;
  const go = (k) => {
    const me = { k, id: id++, hit: false, kids: [] };
    if (memo && seen.has(k)) { me.hit = true; return me; }
    if (k >= 2) me.kids = [go(k - 1), go(k - 2)];
    seen.add(k);
    return me;
  };
  const root = go(n);
  return { root, count: id };
}

function FibTree() {
  const [n, setN] = useState(5);
  const [memo, setMemo] = useState(false);
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  const { root, count } = buildFib(n, memo);
  const plain = buildFib(n, false).count;
  const withMemo = buildFib(n, true).count;
  const lay = layoutTree(root, 44, 56);
  const shownStep = Math.min(step, count);

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => setStep((s) => { if (s >= 200) return s; return s + 1; }), 450);
    return () => clearInterval(id);
  }, [play]);

  const running = play && shownStep < count;
  const restart = (fn) => { fn(); setStep(0); setPlay(false); };

  return (
    <Panel>
      <SectionTitle title="Call tree of fib(n)">
        Every node is one call. Nodes light up in the order the program evaluates them (left subtree first). Turn memoization on and see the repeated
        subtrees disappear.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-[#C9BFE3] flex items-center gap-2 grow min-w-[200px]">
          <span className="font-mono text-[#F4B942] w-14">n = {n}</span>
          <input type="range" min="1" max="7" value={n} onChange={(e) => restart(() => setN(Number(e.target.value)))} className="grow accent-[#7C3AED] h-8" />
        </label>
        <button onClick={() => restart(() => setMemo(!memo))} className={`${btn} ${memo ? btnOn : btnOff}`}>Memoization: {memo ? "ON" : "OFF"}</button>
        <button onClick={() => { if (shownStep >= count) setStep(0); setPlay(!running); }} className={`${btn} ${running ? btnOn : btnOff}`}>{running ? "Pause" : "Animate"}</button>
        <button onClick={() => { setPlay(false); setStep(Math.min(count, shownStep + 1)); }} className={`${btn} ${btnOff}`}>Next call</button>
      </div>
      <div className="mt-3 overflow-x-auto rounded-xl bg-[#0F0A1A] border border-[#211934] p-2">
        <svg viewBox={`0 0 ${lay.width} ${lay.height}`} className="w-full h-auto" style={{ minWidth: Math.min(lay.width, 520) }} role="img" aria-label="fib call tree">
          {lay.edges.map(([a, b], i) => <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={b.ref.id < shownStep ? "#7C3AED" : "#2A2140"} strokeWidth="2" />)}
          {lay.nodes.map((nd) => {
            const seen = nd.ref.id < shownStep;
            const cur = nd.ref.id === shownStep - 1;
            const stroke = cur ? "#F4B942" : nd.ref.hit && seen ? "#60A5FA" : seen ? "#4ADE80" : "#2A2140";
            return (
              <g key={nd.ref.id}>
                <circle cx={nd.x} cy={nd.y} r="16" fill={cur ? "#3B2A10" : seen ? "#173626" : "#0A0714"} stroke={stroke} strokeWidth="2" />
                <text x={nd.x} y={nd.y + 4} textAnchor="middle" fontSize="12" className="font-mono" fill={seen ? "#E4D9FF" : "#5B5470"}>{nd.ref.k}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-2"><p className="text-xs text-[#9C93B3]">Calls so far</p><p className="font-mono text-lg text-[#F4B942]">{shownStep}/{count}</p></div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-2"><p className="text-xs text-[#9C93B3]">No memo</p><p className="font-mono text-lg text-[#F87171]">{plain}</p></div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-2"><p className="text-xs text-[#9C93B3]">With memo</p><p className="font-mono text-lg text-[#4ADE80]">{withMemo}</p></div>
      </div>
      <p className="mt-3 text-xs text-[#9C93B3]">Green: finished evaluating. Gold: the call happening right now. Blue (memo ON): answer reused from the cache, so the call returns immediately and has no children.</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Factorial call stack                                                */
/* ------------------------------------------------------------------ */

function StackAnimation() {
  const [n, setN] = useState(4);
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  const events = [];
  for (let k = n; k >= 0; k--) events.push({ type: "push", k });
  let acc = 1;
  for (let k = 0; k <= n; k++) { acc = k === 0 ? 1 : acc * k; events.push({ type: "pop", k, val: acc }); }
  const s = Math.min(step, events.length);
  const stack = [];
  let last = null;
  events.slice(0, s).forEach((e) => {
    if (e.type === "push") stack.push(e.k); else { stack.pop(); last = e; }
  });
  const running = play && s < events.length;

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => setStep((v) => Math.min(v + 1, 40)), 700);
    return () => clearInterval(id);
  }, [play]);

  const popped = events.slice(0, s).filter((e) => e.type === "pop");
  return (
    <Panel>
      <SectionTitle title="The call stack of factorial(n)">
        Each call waits for the next one, so frames pile up. At the base case the answers flow back down, one frame popped at a time.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-[#C9BFE3] flex items-center gap-2 grow min-w-[200px]">
          <span className="font-mono text-[#F4B942] w-14">n = {n}</span>
          <input type="range" min="1" max="7" value={n} onChange={(e) => { setN(Number(e.target.value)); setStep(0); setPlay(false); }} className="grow accent-[#7C3AED] h-8" />
        </label>
        <button onClick={() => { if (s >= events.length) setStep(0); setPlay(!running); }} className={`${btn} ${running ? btnOn : btnOff}`}>{running ? "Pause" : "Animate"}</button>
        <button onClick={() => { setPlay(false); setStep(Math.min(events.length, s + 1)); }} className={`${btn} ${btnOff}`}>Step</button>
        <button onClick={() => { setStep(0); setPlay(false); }} className={`${btn} ${btnOff}`}>Reset</button>
      </div>
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-3 min-h-[240px] flex flex-col-reverse gap-1">
          {stack.length === 0 && <p className="text-sm text-[#5B5470] text-center">stack is empty</p>}
          {stack.map((k, i) => (
            <div key={i} className={`rounded-lg px-3 py-2 font-mono text-sm border ${i === stack.length - 1 ? "border-[#F4B942] bg-[#3B2A10] text-[#F4B942]" : "border-[#2A2140] bg-[#1A1330] text-[#E4D9FF]"}`}>
              fact({k}){k === 0 ? "  base case" : `  waits for ${k} * fact(${k - 1})`}
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
          <p className="text-xs font-semibold text-[#9C93B3] tracking-wide">RETURN VALUES</p>
          {popped.length === 0 && <p className="mt-2 text-sm text-[#5B5470]">Nothing has returned yet.</p>}
          {popped.map((e) => <p key={e.k} className="mt-1 font-mono text-sm text-[#4ADE80]">fact({e.k}) returns {e.val}</p>)}
          {last && last.k === n && <p className="mt-3 text-sm text-[#C9BFE3]">Done: {n}! = <span className="font-mono text-[#F4B942]">{last.val}</span></p>}
          <p className="mt-3 text-xs text-[#9C93B3]">Maximum stack depth: {n + 1} frames.</p>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Fractals                                                            */
/* ------------------------------------------------------------------ */

function sierpinski(a, b, c, d, out) {
  if (d === 0) { out.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}L${c[0].toFixed(1)} ${c[1].toFixed(1)}Z`); return; }
  const m = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const ab = m(a, b), bc = m(b, c), ca = m(c, a);
  sierpinski(a, ab, ca, d - 1, out);
  sierpinski(ab, b, bc, d - 1, out);
  sierpinski(ca, bc, c, d - 1, out);
}

function treeLines(x, y, len, ang, spread, d, depth, out) {
  if (d === 0) return;
  const x2 = x + len * Math.sin(ang);
  const y2 = y - len * Math.cos(ang);
  out.push({ x, y, x2, y2, d });
  treeLines(x2, y2, len * 0.72, ang - spread, spread, d - 1, depth, out);
  treeLines(x2, y2, len * 0.72, ang + spread, spread, d - 1, depth, out);
}

function koch(p, q, d, out) {
  if (d === 0) { out.push(q); return; }
  const dx = (q[0] - p[0]) / 3, dy = (q[1] - p[1]) / 3;
  const a = [p[0] + dx, p[1] + dy];
  const b = [p[0] + 2 * dx, p[1] + 2 * dy];
  const peak = [a[0] + (dx * 0.5 - dy * Math.sqrt(3) / 2), a[1] + (dy * 0.5 + dx * Math.sqrt(3) / 2)];
  koch(p, a, d - 1, out);
  koch(a, peak, d - 1, out);
  koch(peak, b, d - 1, out);
  koch(b, q, d - 1, out);
}

function Fractals() {
  const [kind, setKind] = useState("tri");
  const [depth, setDepth] = useState(4);
  const [spread, setSpread] = useState(0.45);
  const [play, setPlay] = useState(false);
  const max = kind === "tri" ? 6 : kind === "tree" ? 9 : 5;
  const d = Math.min(depth, max);

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => setDepth((v) => (v >= 9 ? 0 : v + 1)), 900);
    return () => clearInterval(id);
  }, [play]);

  let body;
  let count;
  if (kind === "tri") {
    const out = [];
    sierpinski([300, 10], [20, 270], [580, 270], d, out);
    count = out.length;
    body = <path d={out.join("")} fill="#7C3AED" stroke="#B48CFF" strokeWidth={d > 4 ? 0.3 : 0.8} />;
  } else if (kind === "tree") {
    const out = [];
    treeLines(300, 280, 70, 0, spread, d, d, out);
    count = out.length;
    body = out.map((l, i) => <line key={i} x1={l.x} y1={l.y} x2={l.x2} y2={l.y2} stroke={l.d === 1 ? "#4ADE80" : "#B48CFF"} strokeWidth={Math.max(0.6, l.d * 0.9)} strokeLinecap="round" />);
  } else {
    const pts = [[300, 20]];
    const A = [300, 20], B = [560, 260], C = [40, 260];
    const out = [];
    koch(A, B, d, out); koch(B, C, d, out); koch(C, A, d, out);
    count = out.length;
    body = <polygon points={[...pts, ...out].map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")} fill="#1A1330" stroke="#F4B942" strokeWidth="1.2" />;
  }
  const label = { tri: "triangles", tree: "branches", koch: "segments" };

  return (
    <Panel>
      <SectionTitle title="Recursive drawing: fractals">
        A fractal is a picture that contains smaller copies of itself. Graphics programs draw them with a function that calls itself on smaller pieces
        and stops at depth 0 (the base case). The same idea draws trees in games, coastlines in terrain generators, and antenna shapes in phones.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {[["tri", "Sierpinski triangle"], ["tree", "Recursive tree"], ["koch", "Koch snowflake"]].map(([id, name]) => (
          <button key={id} onClick={() => { setKind(id); setPlay(false); setDepth((v) => Math.min(v, id === "tri" ? 6 : id === "tree" ? 9 : 5)); }} className={`${btn} ${kind === id ? btnOn : btnOff}`}>{name}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="text-sm text-[#C9BFE3] flex items-center gap-2 grow min-w-[200px]">
          <span className="font-mono text-[#F4B942] w-20">depth {d}</span>
          <input type="range" min="0" max={max} value={d} onChange={(e) => { setPlay(false); setDepth(Number(e.target.value)); }} className="grow accent-[#7C3AED] h-8" />
        </label>
        {kind === "tree" && (
          <label className="text-sm text-[#C9BFE3] flex items-center gap-2 min-w-[200px]">
            <span className="font-mono text-[#F4B942] w-24">angle {Math.round((spread * 180) / Math.PI)}°</span>
            <input type="range" min="0.15" max="1" step="0.01" value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="grow accent-[#7C3AED] h-8" />
          </label>
        )}
        <button onClick={() => setPlay(!play)} className={`${btn} ${play ? btnOn : btnOff}`}>{play ? "Stop growing" : "Grow"}</button>
      </div>
      <div className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#211934] p-2">
        <svg viewBox="0 0 600 290" className="w-full h-auto" role="img" aria-label={`${kind} fractal`}>{body}</svg>
      </div>
      <p className="mt-2 text-sm text-[#C9BFE3]">Depth {d} draws <span className="font-mono text-[#F4B942]">{count}</span> {label[kind]}. Each extra level multiplies the work, just like recursive calls multiply.</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Recursion vs iteration                                              */
/* ------------------------------------------------------------------ */

const fibNum = (n) => { let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; };

function RecVsIter() {
  const [n, setN] = useState(20);
  const calls = 2 * fibNum(n + 1) - 1;
  return (
    <Panel>
      <SectionTitle title="Recursion vs iteration">
        Anything recursive can be written as a loop, and the other way around. Recursion mirrors the definition and is easier to prove correct.
        Loops avoid stack frames. Neither is always better, so choose by clarity, and watch for repeated work.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
          <p className="text-sm font-semibold text-[#B48CFF]">Recursion</p>
          <ul className="mt-2 text-sm text-[#C9BFE3] list-disc pl-5 space-y-1">
            <li>Matches the mathematical definition</li>
            <li>Uses one stack frame per pending call</li>
            <li>Natural for trees, divide and conquer, backtracking</li>
          </ul>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
          <p className="text-sm font-semibold text-[#F4B942]">Iteration</p>
          <ul className="mt-2 text-sm text-[#C9BFE3] list-disc pl-5 space-y-1">
            <li>A loop with a few variables</li>
            <li>Constant extra memory</li>
            <li>Natural for simple counting and accumulating</li>
          </ul>
        </div>
      </div>
      <label className="mt-4 text-sm text-[#C9BFE3] flex items-center gap-2">
        <span className="font-mono text-[#F4B942] w-20">fib({n})</span>
        <input type="range" min="1" max="35" value={n} onChange={(e) => setN(Number(e.target.value))} className="grow accent-[#7C3AED] h-8" />
      </label>
      <DataTable rows={[
        ["Version", "Work for fib(" + n + ")", "Max extra memory"],
        ["Naive recursion", "!" + calls.toLocaleString() + " calls", n + " frames deep"],
        ["Recursion + memo", (2 * n + 1) + " calls", n + " frames deep, n cache entries"],
        ["Loop", n + " iterations", "2 variables"],
      ]} caption="The naive version is correct but repeats subproblems. Slide n up to see how fast the call count grows." />
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Structural induction: tree builder                                  */
/* ------------------------------------------------------------------ */

function expandAt(tree, path) {
  if (path.length === 0) return { kids: [{ kids: [] }, { kids: [] }] };
  const [i, ...rest] = path;
  return { kids: tree.kids.map((k, j) => (j === i ? expandAt(k, rest) : k)) };
}
const countInternal = (t) => (t.kids.length === 0 ? 0 : 1 + t.kids.reduce((s, k) => s + countInternal(k), 0));

function TreeBuilder() {
  const [tree, setTree] = useState({ kids: [] });
  const i = countInternal(tree);
  const lay = layoutTree(tree, 54, 60);
  const l = lay.leaves;
  const full = i >= 8;
  const grow = (path) => { if (!full) setTree(expandAt(tree, path)); };

  return (
    <Panel>
      <SectionTitle title="Build a full binary tree">
        Start with one leaf (the basis). Tap any leaf to give it two children (the recursive step). Every full binary tree can be made this way.
        Watch the counters after each move.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => { const leaves = lay.nodes.filter((n) => n.ref.kids.length === 0); if (leaves.length && !full) grow(leaves[Math.floor(Math.random() * leaves.length)].path); }} disabled={full} className={`${btn} ${btnOn} disabled:opacity-40`}>Expand a random leaf</button>
        <button onClick={() => setTree({ kids: [] })} className={`${btn} ${btnOff}`}>Reset</button>
      </div>
      <div className="mt-3 overflow-x-auto rounded-xl bg-[#0F0A1A] border border-[#211934] p-2">
        <svg viewBox={`0 0 ${lay.width} ${lay.height}`} className="w-full h-auto mx-auto" style={{ minWidth: Math.min(lay.width, 300), maxWidth: Math.max(lay.width * 1.5, 160) }} role="img" aria-label="binary tree">
          {lay.edges.map(([a, b], k) => <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#4B3A7A" strokeWidth="2" />)}
          {lay.nodes.map((nd, k) => {
            const leaf = nd.ref.kids.length === 0;
            return (
              <g key={k} onClick={leaf ? () => grow(nd.path) : undefined} className={leaf && !full ? "cursor-pointer" : ""}>
                <circle cx={nd.x} cy={nd.y} r="17" fill={leaf ? "#173626" : "#1A1330"} stroke={leaf ? "#4ADE80" : "#F4B942"} strokeWidth="2" />
                <text x={nd.x} y={nd.y + 4} textAnchor="middle" fontSize="11" className="font-mono" fill="#E4D9FF">{leaf ? "L" : "I"}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-2"><p className="text-xs text-[#9C93B3]">Internal (I)</p><p className="font-mono text-lg text-[#F4B942]">{i}</p></div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-2"><p className="text-xs text-[#9C93B3]">Leaves (L)</p><p className="font-mono text-lg text-[#4ADE80]">{l}</p></div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-2"><p className="text-xs text-[#9C93B3]">Leaves - internal</p><p className="font-mono text-lg text-[#B48CFF]">{l - i}</p></div>
      </div>
      <p className="mt-3 text-sm text-[#C9BFE3]">
        {full ? "Limit reached (8 internal nodes). " : ""}Each expansion turns one leaf into an internal node (internal +1) and adds two leaves (leaves +2, minus the one that
        became internal, so net +1). The gap leaves - internal stays at exactly 1.
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Base case pitfalls: simulated stack overflow                        */
/* ------------------------------------------------------------------ */

const SCEN = [
  { name: "Good: countdown(3)", code: "def countdown(n):\n    if n == 0: return\n    countdown(n - 1)", start: 3, base: true, reach: true },
  { name: "Bad: called with -1", code: "def countdown(n):\n    if n == 0: return\n    countdown(n - 1)   # -1, -2, -3 ...", start: -1, base: true, reach: false },
  { name: "Bad: no base case", code: "def countdown(n):\n    countdown(n - 1)", start: 3, base: false, reach: false },
];

function StackOverflow() {
  const [sc, setSc] = useState(0);
  const [limit, setLimit] = useState(12);
  const [depth, setDepth] = useState(0);
  const [play, setPlay] = useState(false);
  const s = SCEN[sc];
  const maxDepth = s.reach ? s.start + 1 : limit;
  const d = Math.min(depth, maxDepth);
  const done = d >= maxDepth;
  const running = play && !done;

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => setDepth((v) => v + 1), 350);
    return () => clearInterval(id);
  }, [play]);

  const reset = (fn) => { fn(); setDepth(0); setPlay(false); };
  const frames = Array.from({ length: d }, (_, i) => s.start - i);

  return (
    <Panel>
      <SectionTitle title="Base case pitfalls and stack overflow">
        If the base case is missing, or the input never reaches it, the calls pile up until the stack is full. Real Python stops at about 1000 frames.
        Here we use a small simulated limit so you can watch it happen.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {SCEN.map((x, i) => <button key={x.name} onClick={() => reset(() => setSc(i))} className={`${btn} ${i === sc ? btnOn : btnOff}`}>{x.name}</button>)}
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <div className="space-y-3">
          <CodeBlock title="python" code={s.code} />
          <label className="text-sm text-[#C9BFE3] flex items-center gap-2">
            <span className="font-mono text-[#F4B942] w-24">limit {limit}</span>
            <input type="range" min="5" max="30" value={limit} onChange={(e) => reset(() => setLimit(Number(e.target.value)))} className="grow accent-[#7C3AED] h-8" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { if (done) setDepth(0); setPlay(!running); }} className={`${btn} ${running ? btnOn : btnOff}`}>{running ? "Pause" : "Run"}</button>
            <button onClick={() => reset(() => {})} className={`${btn} ${btnOff}`}>Reset</button>
          </div>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
          <div className="flex flex-col-reverse gap-[3px] min-h-[160px]">
            {frames.map((v, i) => (
              <div key={i} className={`h-4 rounded px-2 font-mono text-[10px] leading-4 ${s.reach && i === frames.length - 1 && done ? "bg-[#173626] text-[#4ADE80]" : "bg-[#2A2140] text-[#C9BFE3]"}`} style={{ width: `${40 + (i / limit) * 60}%` }}>countdown({v})</div>
            ))}
          </div>
          <p className="mt-2 font-mono text-xs text-[#9C93B3]">depth {d} / limit {limit}</p>
          {done && s.reach && <p className="mt-1 text-sm text-[#4ADE80]">Base case reached at n = 0. The stack unwinds safely.</p>}
          {done && !s.reach && <p className="mt-1 text-sm text-[#F87171] font-mono break-words">RecursionError: maximum recursion depth exceeded</p>}
        </div>
      </div>
      <p className="mt-3 text-xs text-[#9C93B3]">Checklist: (1) is there a base case? (2) does every recursive call move strictly toward it? (3) does every possible input reach it?</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Folder size                                                         */
/* ------------------------------------------------------------------ */

const FS_RAW = { name: "project", kids: [
  { name: "README.md", size: 4 },
  { name: "src", kids: [
    { name: "app.js", size: 12 },
    { name: "utils", kids: [{ name: "math.js", size: 7 }, { name: "io.js", size: 5 }] },
  ] },
  { name: "assets", kids: [
    { name: "logo.png", size: 30 },
    { name: "fonts", kids: [{ name: "a.ttf", size: 20 }] },
  ] },
] };

function flattenFs() {
  const nodes = [];
  const events = [];
  const walk = (n, depth) => {
    const id = nodes.length;
    nodes.push({ id, name: n.name, depth, dir: !!n.kids });
    events.push({ t: "enter", id });
    let total = 0;
    if (n.kids) n.kids.forEach((k) => { total += walk(k, depth + 1); });
    else { total = n.size; events.push({ t: "file", id, size: n.size }); }
    events.push({ t: "exit", id, total });
    return total;
  };
  walk(FS_RAW, 0);
  return { nodes, events };
}
const FS = flattenFs();

const FS_PY = `import os

def dir_size(path):
    if os.path.isfile(path):          # base case: a file
        return os.path.getsize(path)
    total = 0
    for name in os.listdir(path):     # recursive step: sum the children
        total += dir_size(os.path.join(path, name))
    return total`;

const FS_JS = `function dirSize(node) {
  if (!node.children) return node.size;   // base case: a file
  let total = 0;
  for (const child of node.children) {    // recursive step
    total += dirSize(child);
  }
  return total;
}`;

function FolderTree() {
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  const [lang, setLang] = useState("py");
  const total = FS.events.length;
  const s = Math.min(step, total);
  const running = play && s < total;

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => setStep((v) => Math.min(v + 1, 100)), 650);
    return () => clearInterval(id);
  }, [play]);

  const entered = new Set();
  const totals = {};
  const open = [];
  FS.events.slice(0, s).forEach((e) => {
    if (e.t === "enter") { entered.add(e.id); open.push(e.id); }
    if (e.t === "exit") { totals[e.id] = e.total; open.pop(); }
  });
  const cur = s > 0 ? FS.events[s - 1].id : null;

  return (
    <Panel>
      <SectionTitle title="Real application: size of a folder">
        Computing the size of a directory is recursion on a recursively defined structure: a folder is files plus smaller folders.
        Step through and watch each folder wait for the totals of its children.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => { if (s >= total) setStep(0); setPlay(!running); }} className={`${btn} ${running ? btnOn : btnOff}`}>{running ? "Pause" : "Animate"}</button>
        <button onClick={() => { setPlay(false); setStep(Math.min(total, s + 1)); }} className={`${btn} ${btnOff}`}>Step</button>
        <button onClick={() => { setStep(0); setPlay(false); }} className={`${btn} ${btnOff}`}>Reset</button>
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-3 overflow-x-auto">
          {FS.nodes.map((n) => {
            const seen = entered.has(n.id);
            const done = totals[n.id] !== undefined;
            return (
              <div key={n.id} className={`flex items-center gap-2 font-mono text-sm py-1 rounded ${n.id === cur ? "bg-[#3B2A10]" : ""}`} style={{ paddingLeft: n.depth * 18 + 4, opacity: seen ? 1 : 0.3 }}>
                <span className={n.dir ? "text-[#F4B942]" : "text-[#9C93B3]"}>{n.dir ? "[dir]" : "[file]"}</span>
                <span className="text-[#E4D9FF]">{n.name}</span>
                {done && <span className="ml-auto pr-2 text-[#4ADE80]">{totals[n.id]} KB</span>}
              </div>
            );
          })}
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
          <p className="text-xs font-semibold text-[#9C93B3] tracking-wide">CALL STACK (open folders)</p>
          <div className="mt-2 flex flex-col-reverse gap-1">
            {open.length === 0 && <p className="text-sm text-[#5B5470]">empty</p>}
            {open.map((id, i) => <div key={id} className={`rounded px-2 py-1 font-mono text-xs border ${i === open.length - 1 ? "border-[#F4B942] text-[#F4B942]" : "border-[#2A2140] text-[#C9BFE3]"}`}>dir_size("{FS.nodes[id].name}")</div>)}
          </div>
          {totals[0] !== undefined && <p className="mt-3 text-sm text-[#4ADE80]">Total size of project: {totals[0]} KB</p>}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setLang("py")} className={`${btn} font-mono ${lang === "py" ? btnOn : btnOff}`}>Python</button>
        <button onClick={() => setLang("js")} className={`${btn} font-mono ${lang === "js" ? btnOn : btnOff}`}>JavaScript</button>
      </div>
      <div className="mt-2"><CodeBlock title={lang === "py" ? "python: dir_size" : "javascript: dirSize"} code={lang === "py" ? FS_PY : FS_JS} /></div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Code: Python and JavaScript                                         */
/* ------------------------------------------------------------------ */

const CODE_PY = `def fact(n):
    return 1 if n == 0 else n * fact(n - 1)

def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

def total(n):                 # 1 + 2 + ... + n
    return 0 if n == 0 else n + total(n - 1)

def power(b, n):
    return 1 if n == 0 else b * power(b, n - 1)

def gcd(a, b):
    return a if b == 0 else gcd(b, a % b)

def length(s):
    return 0 if s == "" else 1 + length(s[1:])

def is_pal(s):
    if len(s) <= 1:
        return True
    return s[0] == s[-1] and is_pal(s[1:-1])`;

const CODE_JS = `const fact = (n) => (n === 0 ? 1 : n * fact(n - 1));

const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));

const total = (n) => (n === 0 ? 0 : n + total(n - 1));

const power = (b, n) => (n === 0 ? 1 : b * power(b, n - 1));

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const length = (s) => (s === "" ? 0 : 1 + length(s.slice(1)));

const isPal = (s) =>
  s.length <= 1 || (s[0] === s[s.length - 1] && isPal(s.slice(1, -1)));`;

const CODE_TREE_PY = `# a binary tree is recursive: a node whose children are binary trees
class Node:
    def __init__(self, left=None, right=None):
        self.left, self.right = left, right

def leaves(t):
    if t.left is None and t.right is None:   # base case
        return 1
    return leaves(t.left) + leaves(t.right)  # recursive step

def internal(t):
    if t.left is None and t.right is None:
        return 0
    return 1 + internal(t.left) + internal(t.right)

# structural induction says leaves(t) == internal(t) + 1 for every full tree`;

function CodePanel() {
  const [lang, setLang] = useState("py");
  return (
    <Panel>
      <SectionTitle title="In code: the same definitions">The code reads almost exactly like the mathematical definitions above.</SectionTitle>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setLang("py")} className={`${btn} font-mono ${lang === "py" ? btnOn : btnOff}`}>Python</button>
        <button onClick={() => setLang("js")} className={`${btn} font-mono ${lang === "js" ? btnOn : btnOff}`}>JavaScript</button>
      </div>
      <div className="mt-3 grid lg:grid-cols-2 gap-3">
        <CodeBlock title={lang === "py" ? "python: recursive functions" : "javascript: recursive functions"} code={lang === "py" ? CODE_PY : CODE_JS} />
        <CodeBlock title="python: recursion on a tree" code={CODE_TREE_PY} />
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

const QUIZ = [
  { q: "What does this return? def f(n): return 0 if n == 0 else n + f(n - 1); f(4)", o: ["4", "10", "24", "It never ends"], a: 1, why: "f(4) = 4 + 3 + 2 + 1 + 0 = 10." },
  { q: "def g(n): return n * g(n - 1). What is wrong?", o: ["Nothing", "It has no base case, so it recurses forever", "It should use a loop", "n is too large"], a: 1, why: "Without a base case the calls never stop and the stack overflows." },
  { q: "How many calls does naive fib(4) make (counting fib(4) itself)?", o: ["5", "7", "9", "16"], a: 2, why: "fib(4) calls fib(3) and fib(2). Counting all nodes in the tree gives 9." },
  { q: "A full binary tree has 6 internal nodes. How many leaves does it have?", o: ["5", "6", "7", "12"], a: 2, why: "Leaves = internal + 1 = 7, by structural induction." },
  { q: "Which of these is a WFF under our definition?", o: ["p∧q", "(p∧q)", "(p¬q)", "∧pq"], a: 1, why: "A binary connective needs outer parentheses around two WFFs: (p∧q)." },
];

function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  if (i >= QUIZ.length) {
    return (
      <Panel>
        <SectionTitle title="Quiz: recursion" />
        <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-5 text-center">
          <p className="text-2xl font-heading text-white">{score} / {QUIZ.length}</p>
          <button onClick={() => { setI(0); setScore(0); setPicked(null); }} className="mt-4 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">Try again</button>
        </div>
      </Panel>
    );
  }
  const item = QUIZ[i];
  return (
    <Panel>
      <SectionTitle title="Quiz: recursion">Choose an answer to get instant feedback.</SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="text-xs text-[#9C93B3]">Question {i + 1} of {QUIZ.length}</p>
        <p className="mt-2 text-[#E4D9FF] break-words">{item.q}</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-2">
          {item.o.map((label, idx) => {
            const state = picked === null ? "idle" : idx === item.a ? "right" : picked === idx ? "wrong" : "idle";
            return (
              <button key={idx} onClick={() => { if (picked === null) { setPicked(idx); if (idx === item.a) setScore((v) => v + 1); } }}
                className={`px-3 py-3 rounded-lg text-sm border text-left transition font-mono ${state === "right" ? "bg-[#173626]/60 border-[#4ADE80] text-[#4ADE80]" : state === "wrong" ? "bg-[#3A1C22]/60 border-[#F87171] text-[#F87171]" : "bg-[#130E20] border-[#2A2140] text-[#C9BFE3] hover:text-white"}`}>
                {label}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-3">
            <p className="text-sm text-[#C9BFE3]">{item.why}</p>
            <button onClick={() => { setI(i + 1); setPicked(null); }} className="mt-3 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">{i + 1 === QUIZ.length ? "See score" : "Next"}</button>
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function RecursionSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 7 · RECURSION</p>
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white">Recursion and Recursive Definitions</h2>
        <p className="mt-2 text-[#9C93B3]">
          Define something by pointing at a smaller copy of itself, plus a place to stop. We will meet recursive functions, sets and trees, watch the
          calls and the stack animate, draw fractals, and prove facts about recursive structures with structural induction.
        </p>
      </div>

      <Intro />
      <Gallery />

      <WorkedExample
        tag="EXAMPLE 1 · DEFINE AND COMPUTE"
        title="A recursive definition of 1 + 2 + ... + n"
        given={<>
          <p>S(n) is the sum of the first n positive integers, with n ≥ 0 (the empty sum is 0).</p>
        </>}
        asked={<p>Write a recursive definition of S(n) and use it to compute S(4).</p>}
        steps={[
          { title: "Base case", text: "The sum of no numbers is 0.", formula: "S(0) = 0" },
          { title: "Recursive step", text: "The sum up to n is the sum up to n-1, plus n itself.", formula: "S(n) = S(n-1) + n   for n ≥ 1" },
          { title: "Expand downward", text: "Replace S(4) using the rule until we reach the base case.", formula: "S(4) = S(3) + 4\nS(3) = S(2) + 3\nS(2) = S(1) + 2\nS(1) = S(0) + 1 = 0 + 1 = 1" },
          { title: "Come back up", text: "Substitute the answers on the way back.", formula: "S(2) = 1 + 2 = 3\nS(3) = 3 + 3 = 6\nS(4) = 6 + 4 = 10" },
        ]}
        answer="S(4) = 10, matching the closed form 4·5/2 = 10."
      />
      <SetsPanel />

      <WorkedExample
        tag="EXAMPLE 2 · FIBONACCI"
        title="Compute F(5) from the recursive definition"
        given={<>
          <p>F(0) = 0, F(1) = 1.</p>
          <p>F(n) = F(n-1) + F(n-2) for n ≥ 2.</p>
        </>}
        asked={<p>The value of F(5), and how many calls are made.</p>}
        steps={[
          { title: "Two base cases", text: "The rule looks back two places, so we need two starting values: F(0) = 0 and F(1) = 1." },
          { title: "Build up from the base cases", text: "Each value is the sum of the previous two.", formula: "F(2) = F(1) + F(0) = 1 + 0 = 1\nF(3) = F(2) + F(1) = 1 + 1 = 2\nF(4) = F(3) + F(2) = 2 + 1 = 3\nF(5) = F(4) + F(3) = 3 + 2 = 5" },
          { title: "Count the naive calls", text: "Let C(n) be the number of calls. C(0) = C(1) = 1 and C(n) = 1 + C(n-1) + C(n-2).", formula: "C(2) = 3, C(3) = 5, C(4) = 9, C(5) = 15" },
          { title: "Compare with the table", text: "Only six different values (F(0) through F(5)) are needed. The naive tree recomputes F(3) twice and F(2) three times." },
        ]}
        answer="F(5) = 5, computed with 15 naive calls but only 6 distinct subproblems."
      />
      <FibTree />
      <StackAnimation />

      <WorkedExample
        tag="EXAMPLE 3 · EUCLID'S GCD"
        title="Trace gcd(48, 18) recursively"
        given={<>
          <p>gcd(a, 0) = a.</p>
          <p>gcd(a, b) = gcd(b, a mod b) for b &gt; 0.</p>
        </>}
        asked={<p>The value of gcd(48, 18) by repeated use of the rule.</p>}
        steps={[
          { title: "First call", text: "48 mod 18 = 12, so swap and reduce.", formula: "gcd(48, 18) = gcd(18, 12)" },
          { title: "Second call", text: "18 mod 12 = 6.", formula: "gcd(18, 12) = gcd(12, 6)" },
          { title: "Third call", text: "12 mod 6 = 0.", formula: "gcd(12, 6) = gcd(6, 0)" },
          { title: "Base case", text: "The second argument is 0, so the answer is the first argument.", formula: "gcd(6, 0) = 6" },
          { title: "Why it stops", text: "The second argument is a nonnegative integer that strictly shrinks each call (a mod b < b), so a base case is always reached." },
        ]}
        answer="gcd(48, 18) = 6. Try it in the gallery above with the input 48,18."
      />
      <Fractals />
      <RecVsIter />

      <WorkedExample
        tag="EXAMPLE 4 · STRUCTURAL INDUCTION"
        title="A full binary tree with n internal nodes has n + 1 leaves"
        given={<>
          <p>Full binary trees: (Basis) a single vertex is a full binary tree. (Recursive step) if T1 and T2 are full binary trees, joining them under a new root gives a full binary tree.</p>
          <p>Let l(T) be the number of leaves and i(T) the number of internal nodes.</p>
        </>}
        asked={<p>Prove <F>l(T) = i(T) + 1</F> for every full binary tree T.</p>}
        steps={[
          { title: "Structural induction in one sentence", text: "Show the property for the basis, then show the recursive rule preserves it. No numbering of cases is needed, we induct on how the object was built." },
          { title: "BASIS STEP", text: "A single vertex has 1 leaf and 0 internal nodes.", formula: "l = 1 = 0 + 1 = i + 1" },
          { title: "INDUCTIVE HYPOTHESIS", text: "Assume T1 and T2 satisfy the property.", formula: "l(T1) = i(T1) + 1\nl(T2) = i(T2) + 1" },
          { title: "INDUCTIVE STEP", text: "Let T be T1 and T2 joined under a new root. The leaves of T are the leaves of T1 and T2. The internal nodes of T are those of T1 and T2, plus the new root.", formula: "l(T) = l(T1) + l(T2)\ni(T) = i(T1) + i(T2) + 1" },
          { title: "Compute", text: "Use the hypothesis for both subtrees.", formula: "l(T) = (i(T1) + 1) + (i(T2) + 1)\n     = (i(T1) + i(T2) + 1) + 1\n     = i(T) + 1" },
          { title: "CONCLUSION", text: "The property holds for the basis and is preserved by the recursive rule, so it holds for every full binary tree." },
        ]}
        answer="l(T) = i(T) + 1 for all full binary trees. The builder below lets you see it grow."
      />
      <TreeBuilder />
      <StackOverflow />
      <CodePanel />
      <FolderTree />
      <Quiz />

      <Reflection
        fact={<p>Python caps recursion at about 1000 frames by default (see sys.getrecursionlimit()). Deep but legitimate recursions, such as walking a very long linked list, can hit it, which is one reason people rewrite them as loops.</p>}
        question={<p>Why must a recursive definition always include a base case that is reachable?</p>}
        hint="Hint: think about what the definition of f(n) = n * f(n-1) would say about f(3), and what happens when you try to evaluate it."
      />
    </div>
  );
}
