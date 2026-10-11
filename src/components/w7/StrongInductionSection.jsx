import { useEffect, useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";

const F = ({ children }) => <span className="font-mono text-[#F4B942]">{children}</span>;

const numInput = "bg-[#0A0714] border border-[#2A2140] rounded-lg px-3 py-2 text-[#E4D9FF] font-mono w-24 text-base";
const btn = "px-4 py-2 rounded-lg text-sm border transition";
const btnOn = "bg-[#7C3AED] border-transparent text-white";
const btnOff = "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]";

/* ------------------------------------------------------------------ */
/* 1. Weak vs strong, principle, template                              */
/* ------------------------------------------------------------------ */

function Compare() {
  return (
    <Panel>
      <SectionTitle title="Weak induction vs strong induction">
        You already know ordinary induction (also called weak induction). Strong induction is the same engine with a bigger
        toolbox: in the inductive step you may use <em>every</em> earlier case, not just the last one.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#F4B942]/40 p-4">
          <p className="text-sm font-semibold text-[#F4B942]">Weak (ordinary) induction</p>
          <p className="mt-2 text-sm text-[#C9BFE3]">Basis: prove <F>P(1)</F>.</p>
          <p className="text-sm text-[#C9BFE3]">Step: assume only <F>P(k)</F>, prove <F>P(k+1)</F>.</p>
          <p className="mt-2 font-mono text-xs sm:text-sm text-[#E4D9FF] break-words">P(1) ∧ ∀k [P(k) → P(k+1)] → ∀n P(n)</p>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#4ADE80]/40 p-4">
          <p className="text-sm font-semibold text-[#4ADE80]">Strong induction</p>
          <p className="mt-2 text-sm text-[#C9BFE3]">Basis: prove <F>P(1)</F> (sometimes several base cases).</p>
          <p className="text-sm text-[#C9BFE3]">Step: assume <F>P(1), P(2), ..., P(k)</F> all hold, prove <F>P(k+1)</F>.</p>
          <p className="mt-2 font-mono text-xs sm:text-sm text-[#E4D9FF] break-words">P(1) ∧ ∀k [(P(1) ∧ ... ∧ P(k)) → P(k+1)] → ∀n P(n)</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#9C93B3]">
        Is strong induction more powerful? Not really. Anything provable by one can be proved by the other (we will see why in the next
        topic). Strong induction just gives you a more convenient hypothesis, so the proof is shorter and more natural.
      </p>
    </Panel>
  );
}

function Template() {
  const steps = [
    ["BASIS STEP(S)", "Prove P(b) for the starting value(s). If the inductive step reaches back by up to m cases, you usually need m base cases."],
    ["INDUCTIVE HYPOTHESIS", "Assume P(j) is true for ALL j with b ≤ j ≤ k, for some arbitrary k ≥ b."],
    ["INDUCTIVE STEP", "Using the hypothesis (any of the earlier cases you need), prove P(k+1)."],
    ["CONCLUSION", "By strong induction, P(n) is true for every n ≥ b."],
  ];
  return (
    <Panel>
      <SectionTitle title="The template">Copy this skeleton every time. The labels are what graders look for.</SectionTitle>
      <ol className="mt-4 space-y-2">
        {steps.map(([name, text], i) => (
          <li key={name} className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3 flex gap-3">
            <span className="font-mono text-[#B48CFF] text-sm">{i + 1}.</span>
            <div className="min-w-0">
              <p className="font-mono text-sm text-[#F4B942]">{name}</p>
              <p className="text-sm text-[#C9BFE3]">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#7C3AED]/40 p-4">
        <p className="text-sm font-semibold text-[#B48CFF]">When should I reach for strong induction?</p>
        <ul className="mt-2 text-sm text-[#C9BFE3] list-disc pl-5 space-y-1">
          <li>The step for <F>k+1</F> needs a case that is <em>not</em> k, such as k-3, or a number that splits into two smaller pieces.</li>
          <li>Prime factorization: n = a·b, and a and b can be anywhere below n.</li>
          <li>Postage stamps: to make k+1 cents you reach back 4 steps to k-3.</li>
          <li>Fibonacci style recurrences: f(k+1) uses both f(k) and f(k-1).</li>
          <li>Divide and conquer (merge sort): a list of size n splits into pieces of about n/2.</li>
        </ul>
        <p className="mt-2 text-xs text-[#9C93B3]">Rule of thumb: if you write "P(k) is not enough, I also need..." in your scratch work, switch to strong induction.</p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Dependency arrows animation                                      */
/* ------------------------------------------------------------------ */

const NODES = 10;
const nx = (i) => 30 + (i - 1) * 50;
const BASE_Y = 135;

function DependencyRow({ mode, target }) {
  const color = mode === "weak" ? "#F4B942" : "#4ADE80";
  const from = mode === "weak" ? [target - 1] : Array.from({ length: target - 1 }, (_, i) => i + 1);
  return (
    <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
      <p className="text-sm font-semibold" style={{ color }}>
        {mode === "weak" ? "Weak induction: one arrow back" : "Strong induction: arrows to every earlier case"}
      </p>
      <svg viewBox="0 0 520 165" className="w-full h-auto mt-2" role="img" aria-label={`${mode} induction dependencies`}>
        {from.map((j) => {
          const x1 = nx(target);
          const x2 = nx(j);
          const peak = Math.abs(x1 - x2) * 0.45;
          return (
            <path key={j} d={`M ${x1} ${BASE_Y - 16} Q ${(x1 + x2) / 2} ${BASE_Y - 16 - peak} ${x2} ${BASE_Y - 16}`}
              fill="none" stroke={color} strokeWidth="2" opacity="0.85" />
          );
        })}
        {Array.from({ length: NODES }, (_, i) => i + 1).map((i) => {
          const isTarget = i === target;
          const usable = from.includes(i);
          const known = i < target;
          return (
            <g key={i}>
              <circle cx={nx(i)} cy={BASE_Y} r="16"
                fill={isTarget ? "#7C3AED" : usable ? color : known ? "#2A2140" : "#0A0714"}
                fillOpacity={usable ? 0.9 : 1}
                stroke={isTarget ? "#B48CFF" : known ? color : "#2A2140"} strokeWidth="2" />
              <text x={nx(i)} y={BASE_Y + 5} textAnchor="middle" className="font-mono" fontSize="14"
                fill={isTarget ? "#fff" : usable ? "#0A0714" : "#9C93B3"}>{i}</text>
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-[#9C93B3]">
        Proving <span className="font-mono text-[#B48CFF]">P({target})</span> may use:{" "}
        <span className="font-mono" style={{ color }}>
          {from.length === 0 ? "nothing (it is a base case)" : from.map((j) => `P(${j})`).join(", ")}
        </span>
      </p>
    </div>
  );
}

function DependencyAnimation() {
  const [target, setTarget] = useState(5);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => setTarget((t) => (t >= NODES ? 2 : t + 1)), 900);
    return () => clearInterval(id);
  }, [play]);

  return (
    <Panel>
      <SectionTitle title="Dependency arrows">
        Slide to choose the case you are proving, <F>P(k+1)</F>. Each arrow shows an earlier case the proof is allowed to lean on.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-[#C9BFE3] flex items-center gap-2 grow min-w-[220px]">
          <span className="font-mono text-[#F4B942]">k+1 = {target}</span>
          <input type="range" min="1" max={NODES} value={target} onChange={(e) => { setPlay(false); setTarget(Number(e.target.value)); }}
            className="grow accent-[#7C3AED] h-8" />
        </label>
        <button onClick={() => setPlay((p) => !p)} className={`${btn} ${play ? btnOn : btnOff}`}>{play ? "Pause" : "Play animation"}</button>
      </div>
      <div className="mt-4 grid gap-3">
        <DependencyRow mode="weak" target={target} />
        <DependencyRow mode="strong" target={target} />
      </div>
      <p className="mt-3 text-sm text-[#9C93B3]">
        Strong induction never loses anything: the weak arrow is always one of the strong arrows. It simply allows more.
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Prime factor tree                                                */
/* ------------------------------------------------------------------ */

function smallestDivisor(n) {
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return d;
  return n;
}

function buildTree(n) {
  const d = smallestDivisor(n);
  if (d === n) return { n, kids: [] };
  return { n, kids: [buildTree(d), buildTree(n / d)] };
}

function layoutTree(root) {
  const nodes = [];
  const edges = [];
  let leaf = 0;
  let maxDepth = 0;
  const walk = (node, depth) => {
    maxDepth = Math.max(maxDepth, depth);
    let x;
    const kidPos = node.kids.map((k) => walk(k, depth + 1));
    if (kidPos.length === 0) {
      x = leaf * 56 + 28;
      leaf += 1;
    } else {
      x = (kidPos[0].x + kidPos[kidPos.length - 1].x) / 2;
    }
    const me = { n: node.n, x, depth, prime: node.kids.length === 0 };
    nodes.push(me);
    kidPos.forEach((k) => edges.push({ a: me, b: k }));
    return me;
  };
  walk(root, 0);
  return { nodes, edges, leaves: leaf, maxDepth };
}

function primeList(n) {
  const d = smallestDivisor(n);
  return d === n ? [n] : [...primeList(d), ...primeList(n / d)];
}

function FactorTree() {
  const [n, setN] = useState(360);
  const [text, setText] = useState("360");
  const [reveal, setReveal] = useState(99);
  const [play, setPlay] = useState(false);

  const layout = layoutTree(buildTree(n));

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => {
      setReveal((r) => {
        if (r >= layout.maxDepth) { setPlay(false); return r; }
        return r + 1;
      });
    }, 800);
    return () => clearInterval(id);
  }, [play, layout.maxDepth]);

  const choose = (v) => {
    setText(String(v));
    const num = Math.floor(Number(v));
    if (Number.isFinite(num) && num >= 2 && num <= 2000) {
      setN(num);
      setReveal(99);
      setPlay(false);
    }
  };
  const replay = () => { setReveal(0); setPlay(true); };

  const H = (layout.maxDepth + 1) * 62 + 20;
  const W = Math.max(layout.leaves * 56, 112);
  const visible = (d) => d <= reveal;

  return (
    <Panel>
      <SectionTitle title="Factor tree builder">
        Enter any n from 2 to 2000. The tree shows the strong induction idea: if n is composite, split it as a·b, then trust the
        hypothesis for both a and b, which are smaller but could be anywhere below n.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input className={numInput} inputMode="numeric" value={text} onChange={(e) => choose(e.target.value)} aria-label="n" />
        {[12, 97, 360, 1001, 1024].map((v) => (
          <button key={v} onClick={() => choose(v)} className={`${btn} ${n === v ? btnOn : btnOff} font-mono`}>{v}</button>
        ))}
        <button onClick={replay} className={`${btn} ${btnOff}`}>Build step by step</button>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl bg-[#0F0A1A] border border-[#211934] p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minWidth: Math.min(W, 340) }} role="img" aria-label="factor tree">
          {layout.edges.filter((e) => visible(e.b.depth)).map((e, i) => (
            <line key={i} x1={e.a.x} y1={e.a.depth * 62 + 40} x2={e.b.x} y2={e.b.depth * 62 + 22} stroke="#7C3AED" strokeWidth="2" />
          ))}
          {layout.nodes.filter((nd) => visible(nd.depth)).map((nd, i) => {
            const shrink = String(nd.n).length > 3 ? 12 : 14;
            return (
              <g key={i}>
                <circle cx={nd.x} cy={nd.depth * 62 + 22} r="19" fill={nd.prime ? "#173626" : "#1A1330"} stroke={nd.prime ? "#4ADE80" : "#F4B942"} strokeWidth="2" />
                <text x={nd.x} y={nd.depth * 62 + 22 + 5} textAnchor="middle" className="font-mono" fontSize={shrink} fill="#E4D9FF">{nd.n}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-3 text-sm text-[#C9BFE3]">
        <span className="font-mono text-[#F4B942]">{n}</span> = <span className="font-mono text-[#4ADE80]">{primeList(n).join(" · ")}</span>
        {layout.nodes.length === 1 && <span className="text-[#9C93B3]"> (n is prime, so it is its own product of primes)</span>}
      </p>
      <p className="mt-1 text-xs text-[#9C93B3]">Gold circles are composite and keep splitting. Green circles are prime and stop the recursion.</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Postage stamps                                                   */
/* ------------------------------------------------------------------ */

const BASES = { 12: [3, 0], 13: [2, 1], 14: [1, 2], 15: [0, 3] };
function stampRep(n) {
  if (BASES[n]) return BASES[n];
  const [a, b] = stampRep(n - 4);
  return [a + 1, b];
}

function StampCalculator() {
  const [n, setN] = useState(27);
  const [fours, fives] = stampRep(n);
  const chain = [];
  for (let m = n; m >= 12; m -= 4) { chain.push(m); if (m <= 15) break; }
  const cells = Array.from({ length: 49 }, (_, i) => i + 12);

  return (
    <Panel>
      <SectionTitle title="Stamp calculator">
        Pick an amount from 12 to 60. The four green cells (12, 13, 14, 15) are the base cases. Every other amount is built by adding one 4-cent stamp
        to the amount 4 cents lower, which is exactly the step <F>P(k-3) → P(k+1)</F>.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-[#C9BFE3] flex items-center gap-2 grow min-w-[220px]">
          <span className="font-mono text-[#F4B942] w-16">{n} cents</span>
          <input type="range" min="12" max="60" value={n} onChange={(e) => setN(Number(e.target.value))} className="grow accent-[#7C3AED] h-8" />
        </label>
      </div>
      <div className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
        <div className="flex flex-wrap gap-1">
          {cells.map((c) => {
            const base = c <= 15;
            const inChain = chain.includes(c);
            const cls = c === n ? "bg-[#7C3AED] text-white border-[#B48CFF]"
              : base ? "border-[#4ADE80] text-[#4ADE80] bg-[#173626]/50"
              : inChain ? "border-[#F4B942] text-[#F4B942] bg-[#1A1330]"
              : "border-[#2A2140] text-[#9C93B3]";
            return <span key={c} className={`w-8 h-8 flex items-center justify-center rounded border font-mono text-xs ${cls}`}>{c}</span>;
          })}
        </div>
        <p className="mt-2 text-xs text-[#9C93B3]">Purple: chosen amount. Gold: the chain n, n-4, n-8, ... down to a base case.</p>
      </div>
      <div className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
        <p className="text-sm text-[#C9BFE3]">
          <span className="font-mono text-[#F4B942]">{n}</span> = <span className="font-mono text-[#B48CFF]">{fours} × 4</span> + <span className="font-mono text-[#F4B942]">{fives} × 5</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {Array.from({ length: fours }, (_, i) => <span key={`a${i}`} className="px-2 py-1 rounded bg-[#7C3AED] text-white font-mono text-xs">4</span>)}
          {Array.from({ length: fives }, (_, i) => <span key={`b${i}`} className="px-2 py-1 rounded bg-[#F4B942] text-[#0A0714] font-mono text-xs">5</span>)}
        </div>
        <p className="mt-2 font-mono text-xs text-[#9C93B3] break-words">chain: {chain.join(" → ")}</p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Fibonacci bound                                                  */
/* ------------------------------------------------------------------ */

const FIB = [0, 1, 1];
for (let i = 3; i <= 20; i++) FIB[i] = FIB[i - 1] + FIB[i - 2];

function FibBound() {
  const [k, setK] = useState(6);
  const rows = Array.from({ length: 14 }, (_, i) => i + 1);
  return (
    <Panel>
      <SectionTitle title="Fibonacci stays below 2^n">
        Slide to a value of n. The step uses the two cases right below it, so weak induction (which only remembers one) is not enough.
      </SectionTitle>
      <div className="mt-4">
        <label className="text-sm text-[#C9BFE3] flex items-center gap-2">
          <span className="font-mono text-[#F4B942] w-12">n = {k}</span>
          <input type="range" min="3" max="14" value={k} onChange={(e) => setK(Number(e.target.value))} className="grow accent-[#7C3AED] h-8" />
        </label>
        <p className="mt-2 text-sm text-[#C9BFE3] font-mono break-words">
          f({k}) = f({k - 1}) + f({k - 2}) = {FIB[k - 1]} + {FIB[k - 2]} = {FIB[k]} &lt; {2 ** (k - 1)} + {2 ** (k - 2)} ≤ {2 ** k}
        </p>
      </div>
      <div className="mt-3 overflow-x-auto rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
        <div className="min-w-[300px] space-y-1">
          {rows.map((i) => {
            const used = i === k - 1 || i === k - 2;
            const pct = Math.max(2, (FIB[i] / 2 ** i) * 100);
            return (
              <div key={i} className={`flex items-center gap-2 text-xs font-mono ${i === k ? "text-white" : used ? "text-[#4ADE80]" : "text-[#9C93B3]"}`}>
                <span className="w-24 shrink-0">n={i} f={FIB[i]}</span>
                <div className="grow h-3 rounded bg-[#1A1330] overflow-hidden">
                  <div className="h-3" style={{ width: `${pct}%`, background: i === k ? "#7C3AED" : used ? "#4ADE80" : "#4B3A7A" }} />
                </div>
                <span className="w-14 text-right shrink-0">/{2 ** i}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[#9C93B3]">The bar is f(n) as a share of 2^n. It never reaches 100%. Green rows are the two cases used for the selected n.</p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Chocolate bar                                                    */
/* ------------------------------------------------------------------ */

const CELL = 44;
const SIZES = [[2, 3], [3, 4], [4, 5]];

function Chocolate() {
  const [size, setSize] = useState(1);
  const [R, C] = SIZES[size];
  const [pieces, setPieces] = useState([{ r0: 0, c0: 0, r1: SIZES[1][0], c1: SIZES[1][1] }]);
  const [breaks, setBreaks] = useState(0);
  const total = R * C;

  const reset = (s) => {
    setSize(s);
    setPieces([{ r0: 0, c0: 0, r1: SIZES[s][0], c1: SIZES[s][1] }]);
    setBreaks(0);
  };

  const split = (idx, axis, at) => {
    const p = pieces[idx];
    const parts = axis === "h"
      ? [{ ...p, r1: at }, { ...p, r0: at }]
      : [{ ...p, c1: at }, { ...p, c0: at }];
    setPieces([...pieces.slice(0, idx), ...parts, ...pieces.slice(idx + 1)]);
    setBreaks((b) => b + 1);
  };

  const randomBreak = () => {
    const open = pieces.map((p, i) => ({ p, i })).filter(({ p }) => p.r1 - p.r0 > 1 || p.c1 - p.c0 > 1);
    if (open.length === 0) return;
    const { p, i } = open[Math.floor(Math.random() * open.length)];
    const canH = p.r1 - p.r0 > 1;
    const canV = p.c1 - p.c0 > 1;
    const horizontal = canH && (!canV || Math.random() < 0.5);
    if (horizontal) split(i, "h", p.r0 + 1 + Math.floor(Math.random() * (p.r1 - p.r0 - 1)));
    else split(i, "v", p.c0 + 1 + Math.floor(Math.random() * (p.c1 - p.c0 - 1)));
  };

  const done = pieces.length === total;

  return (
    <Panel>
      <SectionTitle title="Break the chocolate bar">
        Tap a gap between squares to break a piece along that line. Every break splits one piece into two. Try different orders: the counter
        always ends at the same number.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {SIZES.map(([r, c], i) => (
          <button key={i} onClick={() => reset(i)} className={`${btn} font-mono ${i === size ? btnOn : btnOff}`}>{r} × {c}</button>
        ))}
        <button onClick={randomBreak} disabled={done} className={`${btn} ${btnOff} disabled:opacity-40`}>Random break</button>
        <button onClick={() => reset(size)} className={`${btn} ${btnOff}`}>Reset</button>
      </div>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
        <svg viewBox={`-6 -6 ${C * CELL + 12} ${R * CELL + 12}`} className="w-full h-auto mx-auto" style={{ maxWidth: C * CELL * 2 }} role="img" aria-label="chocolate bar">
          {pieces.map((p, i) => (
            <g key={`${p.r0}-${p.c0}-${p.r1}-${p.c1}`}>
              <rect x={p.c0 * CELL + 2} y={p.r0 * CELL + 2} width={(p.c1 - p.c0) * CELL - 4} height={(p.r1 - p.r0) * CELL - 4} rx="6"
                fill={(p.r1 - p.r0) * (p.c1 - p.c0) === 1 ? "#6B4423" : "#8A5A2E"} stroke="#F4B942" strokeOpacity="0.5" />
              {Array.from({ length: p.r1 - p.r0 - 1 }, (_, j) => p.r0 + 1 + j).map((r) => (
                <rect key={`h${r}`} x={p.c0 * CELL + 2} y={r * CELL - 10} width={(p.c1 - p.c0) * CELL - 4} height="20"
                  className="fill-transparent hover:fill-[#F4B942]/50 cursor-pointer" onClick={() => split(i, "h", r)} />
              ))}
              {Array.from({ length: p.c1 - p.c0 - 1 }, (_, j) => p.c0 + 1 + j).map((c) => (
                <rect key={`v${c}`} x={c * CELL - 10} y={p.r0 * CELL + 2} width="20" height={(p.r1 - p.r0) * CELL - 4}
                  className="fill-transparent hover:fill-[#F4B942]/50 cursor-pointer" onClick={() => split(i, "v", c)} />
              ))}
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-2"><p className="text-xs text-[#9C93B3]">Pieces</p><p className="font-mono text-lg text-[#B48CFF]">{pieces.length}</p></div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-2"><p className="text-xs text-[#9C93B3]">Breaks</p><p className="font-mono text-lg text-[#F4B942]">{breaks}</p></div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-2"><p className="text-xs text-[#9C93B3]">Pieces - breaks</p><p className="font-mono text-lg text-[#4ADE80]">{pieces.length - breaks}</p></div>
      </div>
      <p className="mt-3 text-sm text-[#C9BFE3]">
        The invariant: <F>pieces = breaks + 1</F> at every moment.{" "}
        {done ? <span className="text-[#4ADE80]">All {total} squares are separate after exactly {breaks} = {total} - 1 breaks.</span> : <span className="text-[#9C93B3]">Keep breaking until you have {total} single squares.</span>}
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Code demos                                                          */
/* ------------------------------------------------------------------ */

const PRIME_CODE = `def prime_factors(n):
    """Strong induction in code: the recursive calls are on
    d and n // d, which can be ANY smaller numbers."""
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:                    # composite: n = d * (n // d)
            return prime_factors(d) + prime_factors(n // d)
    return [n]                            # base case: n is prime

print(prime_factors(360))   # [2, 2, 2, 3, 3, 5]`;

const COIN_CODE = `from functools import lru_cache

def can_make(n, coins):
    """Can n cents be paid exactly using the given coin values?"""
    @lru_cache(maxsize=None)
    def go(m):
        if m == 0:                        # base case
            return True
        if m < 0:
            return False
        return any(go(m - c) for c in coins)   # reach back by c, any c
    return go(n)

print([n for n in range(0, 20) if not can_make(n, (4, 5))])
# [1, 2, 3, 6, 7, 11]  -> everything from 12 up works`;

function canMake(n, coins, memo = new Map()) {
  if (n === 0) return [];
  if (n < 0) return null;
  if (memo.has(n)) return memo.get(n);
  let res = null;
  for (const c of coins) {
    const sub = canMake(n - c, coins, memo);
    if (sub) { res = [...sub, c]; break; }
  }
  memo.set(n, res);
  return res;
}

function CodeLab() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(5);
  const [n, setN] = useState(23);
  const [pn, setPn] = useState(360);
  const coins = [a, b].filter((c) => c >= 1);
  const combo = canMake(n, coins);
  const memo = new Map();
  const grid = Array.from({ length: 31 }, (_, i) => i);
  const bad = grid.filter((m) => !canMake(m, coins, memo));
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Number(v) || lo));

  return (
    <Panel>
      <SectionTitle title="In code">
        Recursion is induction that runs. The base case is the basis step, and the recursive calls are the inductive hypothesis, used on
        whichever smaller inputs you need.
      </SectionTitle>
      <div className="mt-4 grid lg:grid-cols-2 gap-3">
        <CodeBlock title="python: prime factorization" code={PRIME_CODE} />
        <CodeBlock title="python: coin change feasibility" code={COIN_CODE} />
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
          <p className="text-sm font-semibold text-[#B48CFF]">Live: prime_factors(n)</p>
          <input className={`${numInput} mt-2`} type="number" min="2" max="100000" value={pn} onChange={(e) => setPn(clamp(e.target.value, 2, 100000))} />
          <p className="mt-2 font-mono text-sm text-[#4ADE80] break-words">[{primeList(pn).join(", ")}]</p>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
          <p className="text-sm font-semibold text-[#B48CFF]">Live: can_make(n, coins)</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#9C93B3] items-center">
            coins <input className={`${numInput} w-16`} type="number" min="1" max="20" value={a} onChange={(e) => setA(clamp(e.target.value, 1, 20))} />
            <input className={`${numInput} w-16`} type="number" min="1" max="20" value={b} onChange={(e) => setB(clamp(e.target.value, 1, 20))} />
            n <input className={`${numInput} w-16`} type="number" min="0" max="30" value={n} onChange={(e) => setN(clamp(e.target.value, 0, 30))} />
          </div>
          <p className="mt-2 font-mono text-sm break-words" style={{ color: combo ? "#4ADE80" : "#F87171" }}>
            {combo ? `True: ${n} = ${combo.length ? combo.join(" + ") : "0 (no coins)"}` : "False: no exact combination"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {grid.map((m) => (
              <span key={m} className={`w-7 h-7 flex items-center justify-center rounded border font-mono text-[11px] ${bad.includes(m) ? "border-[#F87171] text-[#F87171] bg-[#3A1C22]/50" : "border-[#255239] text-[#4ADE80] bg-[#173626]/40"}`}>{m}</span>
            ))}
          </div>
          <p className="mt-1 text-xs text-[#9C93B3]">Red cells cannot be paid. With 4 and 5, red stops at 11, so 12 and up is all green.</p>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Real application: merge sort                                        */
/* ------------------------------------------------------------------ */

function MergeSortApp() {
  const [n, setN] = useState(13);
  const left = Math.ceil(n / 2);
  const right = Math.floor(n / 2);
  return (
    <Panel>
      <SectionTitle title="Real application: proving merge sort correct">
        Merge sort splits a list of n items into halves and sorts each half recursively. Its correctness proof needs strong induction,
        because the halves have size about n/2, not n-1.
      </SectionTitle>
      <label className="mt-4 text-sm text-[#C9BFE3] flex items-center gap-2">
        <span className="font-mono text-[#F4B942] w-24">n = {n}</span>
        <input type="range" min="2" max="24" value={n} onChange={(e) => setN(Number(e.target.value))} className="grow accent-[#7C3AED] h-8" />
      </label>
      <div className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3 space-y-2">
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: n }, (_, i) => <span key={i} className={`w-6 h-6 rounded text-[10px] font-mono flex items-center justify-center ${i < left ? "bg-[#7C3AED] text-white" : "bg-[#F4B942] text-[#0A0714]"}`}>{i + 1}</span>)}
        </div>
        <p className="text-sm text-[#C9BFE3]">
          Left half has <span className="font-mono text-[#B48CFF]">{left}</span> items, right half has <span className="font-mono text-[#F4B942]">{right}</span>. The hypothesis
          "merge sort works for every size below n" covers both halves at once, and the merge step then glues two sorted lists into one sorted list.
        </p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

const QUIZ = [
  { q: "Prove 1 + 2 + ... + n = n(n+1)/2.", a: 0, why: "Going from n=k to n=k+1 just adds one term to a known sum. Weak induction is enough." },
  { q: "Prove every integer n ≥ 2 is a product of primes.", a: 1, why: "If n = a·b, you need the claim for both a and b, and neither has to be n-1. Strong induction." },
  { q: "Prove f(n) < 2^n for Fibonacci numbers, where f(n) = f(n-1) + f(n-2).", a: 1, why: "The step uses two earlier cases, so assume all earlier cases." },
  { q: "Prove 2^n > n for all n ≥ 1.", a: 0, why: "2^(k+1) = 2·2^k, which relates directly to the previous case. Weak induction works." },
  { q: "Prove every amount ≥ 12 cents can be made from 4 and 5 cent stamps.", a: 1, why: "The step goes back from k+1 to k-3, so you need more than the last case." },
];

function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  if (i >= QUIZ.length) {
    return (
      <Panel>
        <SectionTitle title="Quiz: weak or strong?" />
        <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-5 text-center">
          <p className="text-2xl font-heading text-white">{score} / {QUIZ.length}</p>
          <button onClick={() => { setI(0); setScore(0); setPicked(null); }} className="mt-4 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">Try again</button>
        </div>
      </Panel>
    );
  }
  const item = QUIZ[i];
  const labels = ["Weak induction is enough", "Strong induction is the natural choice"];
  return (
    <Panel>
      <SectionTitle title="Quiz: weak or strong?">Which form of induction fits best? Answer, read the reason, then move on.</SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="text-xs text-[#9C93B3]">Question {i + 1} of {QUIZ.length}</p>
        <p className="mt-2 text-[#E4D9FF]">{item.q}</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-2">
          {labels.map((label, idx) => {
            const state = picked === null ? "idle" : idx === item.a ? "right" : picked === idx ? "wrong" : "idle";
            return (
              <button key={idx} onClick={() => { if (picked === null) { setPicked(idx); if (idx === item.a) setScore((s) => s + 1); } }}
                className={`px-3 py-3 rounded-lg text-sm border text-left transition ${state === "right" ? "bg-[#173626]/60 border-[#4ADE80] text-[#4ADE80]" : state === "wrong" ? "bg-[#3A1C22]/60 border-[#F87171] text-[#F87171]" : "bg-[#130E20] border-[#2A2140] text-[#C9BFE3] hover:text-white"}`}>
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

export default function StrongInductionSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 7 · INDUCTION AND RECURSION</p>
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white">Strong Induction</h2>
        <p className="mt-2 text-[#9C93B3]">
          Sometimes the previous case is not enough to prove the next one. Strong induction lets you assume every earlier case at once. We will see
          the idea, watch it work on primes, stamps, Fibonacci numbers and a chocolate bar, and then write it as code.
        </p>
      </div>

      <Compare />
      <Template />
      <DependencyAnimation />

      <WorkedExample
        tag="EXAMPLE 1 · PRIME FACTORIZATION"
        title="Every integer n ≥ 2 is a product of primes"
        given={<>
          <p>P(n): "n is a prime, or n is a product of primes".</p>
          <p>An integer n ≥ 2 is composite if n = a·b with 1 &lt; a, b &lt; n.</p>
        </>}
        asked={<p>Prove <F>P(n)</F> for all integers n ≥ 2, using strong induction.</p>}
        steps={[
          { title: "BASIS STEP", text: "n = 2 is prime, so P(2) is true. (A prime counts as a product with one factor.)", formula: "P(2) holds" },
          { title: "INDUCTIVE HYPOTHESIS", text: "Let k ≥ 2 and assume P(j) is true for every j with 2 ≤ j ≤ k. Every such j is a product of primes.", formula: "P(2), P(3), ..., P(k)" },
          { title: "INDUCTIVE STEP: case 1", text: "Look at k+1. If it is prime, P(k+1) is true right away." },
          { title: "INDUCTIVE STEP: case 2", text: "If k+1 is composite, write k+1 = a·b with 2 ≤ a, b ≤ k. Both a and b are in the range covered by the hypothesis, so each is a product of primes.", formula: "a = p1···pr,  b = q1···qs" },
          { title: "Combine", text: "Then k+1 = a·b = p1···pr·q1···qs is a product of primes.", extra: <FactorHint /> },
          { title: "CONCLUSION", text: "By strong induction, P(n) holds for every n ≥ 2." },
        ]}
        answer="Every integer n ≥ 2 can be written as a product of primes."
      />
      <FactorTree />

      <WorkedExample
        tag="EXAMPLE 2 · POSTAGE STAMPS"
        title="Every amount of 12 cents or more can be made from 4-cent and 5-cent stamps"
        given={<>
          <p>Stamps of value 4 cents and 5 cents, as many of each as we like.</p>
          <p>P(n): "n cents can be formed exactly".</p>
        </>}
        asked={<p>Prove <F>P(n)</F> for all n ≥ 12.</p>}
        steps={[
          { title: "BASIS STEPS", text: "The step will reach back 4 cases, so we need 4 base cases.", formula: "12 = 4+4+4\n13 = 4+4+5\n14 = 4+5+5\n15 = 5+5+5" },
          { title: "INDUCTIVE HYPOTHESIS", text: "Let k ≥ 15 and assume P(j) for every j with 12 ≤ j ≤ k." },
          { title: "INDUCTIVE STEP", text: "We want k+1 cents. Since k+1 ≥ 16, we have k+1-4 = k-3 ≥ 12, so k-3 is in the range of the hypothesis. Form k-3 cents with 4 and 5 cent stamps." },
          { title: "Add one stamp", text: "Add one more 4-cent stamp to get k-3+4 = k+1 cents. So P(k+1) is true." },
          { title: "CONCLUSION", text: "The four base cases plus the step prove P(n) for all n ≥ 12." },
        ]}
        answer="Every n ≥ 12 is a sum of 4s and 5s. (Weak induction cannot jump back 4 cases, which is why strong induction fits.)"
      />
      <StampCalculator />

      <WorkedExample
        tag="EXAMPLE 3 · RECURRENCE BOUND"
        title="Fibonacci numbers satisfy f(n) < 2^n"
        given={<>
          <p>f(1) = 1, f(2) = 1, and f(n) = f(n-1) + f(n-2) for n ≥ 3.</p>
          <p>P(n): f(n) &lt; 2^n.</p>
        </>}
        asked={<p>Prove <F>P(n)</F> for all n ≥ 1.</p>}
        steps={[
          { title: "BASIS STEPS", text: "The recurrence uses two earlier terms, so we check two values.", formula: "f(1) = 1 < 2 = 2^1\nf(2) = 1 < 4 = 2^2" },
          { title: "INDUCTIVE HYPOTHESIS", text: "Let k ≥ 2 and assume f(j) < 2^j for all 1 ≤ j ≤ k." },
          { title: "INDUCTIVE STEP", text: "Since k+1 ≥ 3, the recurrence applies. Both f(k) and f(k-1) are covered by the hypothesis.", formula: "f(k+1) = f(k) + f(k-1)\n       < 2^k + 2^(k-1)" },
          { title: "Finish the inequality", text: "Because 2^(k-1) < 2^k, we get a clean power of 2.", formula: "2^k + 2^(k-1) < 2^k + 2^k = 2^(k+1)" },
          { title: "CONCLUSION", text: "So f(k+1) < 2^(k+1), and by strong induction f(n) < 2^n for all n ≥ 1." },
        ]}
        answer="f(n) < 2^n for every n ≥ 1."
      />
      <FibBound />

      <WorkedExample
        tag="EXAMPLE 4 · BREAKING A CHOCOLATE BAR"
        title="A bar of n squares needs exactly n - 1 breaks"
        given={<>
          <p>A rectangular chocolate bar made of n unit squares.</p>
          <p>One move: break one piece into two along a grid line.</p>
          <p>P(n): "a bar of n squares needs exactly n - 1 breaks to become n single squares".</p>
        </>}
        asked={<p>Prove <F>P(n)</F> for all n ≥ 1, however the breaks are chosen.</p>}
        steps={[
          { title: "BASIS STEP", text: "A bar of 1 square is already a single square, so 0 breaks are needed.", formula: "n = 1: 1 - 1 = 0 breaks" },
          { title: "INDUCTIVE HYPOTHESIS", text: "Assume P(j) for all 1 ≤ j ≤ k: a piece of j squares needs exactly j - 1 breaks." },
          { title: "INDUCTIVE STEP", text: "Take a bar of k+1 ≥ 2 squares. The first break splits it into two pieces with a and b squares, where a + b = k+1 and 1 ≤ a, b ≤ k." },
          { title: "Use the hypothesis twice", text: "By hypothesis the first piece needs a - 1 more breaks and the second needs b - 1. This is where strong induction is needed: a and b can be any sizes below k+1.", formula: "total = 1 + (a - 1) + (b - 1) = a + b - 1 = (k+1) - 1 = k" },
          { title: "CONCLUSION", text: "A bar of k+1 squares needs exactly k breaks. By strong induction P(n) holds for all n ≥ 1." },
        ]}
        answer="Always n - 1 breaks, no matter the order. Each break raises the piece count by exactly one."
      />
      <Chocolate />

      <CodeLab />
      <MergeSortApp />
      <Quiz />

      <Reflection
        fact={<p>The proof that every integer is a product of primes goes back to Euclid's Elements, and the "split into two smaller pieces" argument is the oldest example of strong induction in mathematics, long before the name existed.</p>}
        question={<p>Why can't weak induction easily prove the prime factorization theorem?</p>}
        hint="Hint: if k+1 = a·b, which earlier cases do you need? Is either of them k?"
      />
    </div>
  );
}

function FactorHint() {
  return <p className="text-xs text-[#9C93B3]">Try it live in the factor tree below: each split in the tree is one use of the hypothesis.</p>;
}
