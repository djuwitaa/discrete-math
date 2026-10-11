import { useEffect, useRef, useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";

const F = ({ children }) => <span className="font-mono text-[#F4B942]">{children}</span>;
const Box = ({ children, className = "" }) => (
  <div className={`rounded-xl bg-[#0F0A1A] border border-[#211934] p-3 sm:p-4 ${className}`}>{children}</div>
);

const numInput = "bg-[#0A0714] border border-[#2A2140] rounded-lg px-3 py-2 text-[#E4D9FF] font-mono w-20 text-base";
const btn = "px-4 py-2 rounded-lg text-sm border transition";
const btnOn = "bg-[#7C3AED] border-transparent text-white";
const btnOff = "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]";
const clampInt = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(Number(v)) || 0));

const fmtN = (v) => {
  if (!Number.isFinite(v)) return "overflow";
  if (Math.abs(v) >= 1e9) return v.toExponential(3);
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
};
const r3 = (v) => String(Math.round(v * 1000) / 1000);

function useTicker(active, ms, fn) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [active, ms]);
}

const fibList = (n) => {
  const a = [0, 1];
  for (let i = 2; i <= n; i++) a.push(a[i - 1] + a[i - 2]);
  return a;
};

/* ------------------------------------------------------------------ */
/* Definition                                                          */
/* ------------------------------------------------------------------ */

function Definition() {
  return (
    <Panel>
      <SectionTitle title="What is a recurrence relation?">
        A recurrence relation describes each term of a sequence using earlier terms. It is the sequence version of a recursive function: a rule for
        stepping forward, plus a starting point.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <Box>
          <p className="text-xs font-semibold text-[#B48CFF] tracking-wide">RECURRENCE RELATION</p>
          <p className="mt-2 text-sm text-[#C9BFE3]">An equation that expresses a_n in terms of one or more of a_(n-1), a_(n-2), ..., a_0.</p>
          <p className="mt-2 font-mono text-sm text-[#F4B942] break-words">a_n = 3·a_(n-1) - 2·a_(n-2)</p>
        </Box>
        <Box>
          <p className="text-xs font-semibold text-[#B48CFF] tracking-wide">INITIAL CONDITIONS</p>
          <p className="mt-2 text-sm text-[#C9BFE3]">The first few terms, given directly. Without them the rule alone has infinitely many solutions.</p>
          <p className="mt-2 font-mono text-sm text-[#F4B942] break-words">a_0 = 1,  a_1 = 4</p>
        </Box>
        <Box>
          <p className="text-xs font-semibold text-[#B48CFF] tracking-wide">SOLUTION</p>
          <p className="mt-2 text-sm text-[#C9BFE3]">A formula for a_n that uses only n, and satisfies both the recurrence and the initial conditions.</p>
          <p className="mt-2 font-mono text-sm text-[#F4B942] break-words">a_n = 3^n  (try it!)</p>
        </Box>
        <Box>
          <p className="text-xs font-semibold text-[#B48CFF] tracking-wide">LINEAR HOMOGENEOUS, CONSTANT COEFFICIENTS</p>
          <p className="mt-2 text-sm text-[#C9BFE3]">Degree k: a_n is a fixed combination of the k previous terms, with no extra term added.</p>
          <p className="mt-2 font-mono text-sm text-[#F4B942] break-words">a_n = c1·a_(n-1) + ... + ck·a_(n-k)</p>
        </Box>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Models                                                              */
/* ------------------------------------------------------------------ */

const MODELS = [
  { id: "hanoi", label: "Tower of Hanoi", rec: "H(n) = 2·H(n-1) + 1,  H(0) = 0", closed: "H(n) = 2^n - 1", init: [0], next: (p) => 2 * p[p.length - 1] + 1, note: "Move n - 1 disks away, move the biggest, move n - 1 disks back on top." },
  { id: "stairs", label: "Climbing stairs", rec: "S(n) = S(n-1) + S(n-2),  S(0) = 1, S(1) = 1", closed: "S(n) = Fibonacci(n + 1)", init: [1, 1], next: (p) => p[p.length - 1] + p[p.length - 2], note: "The last move was either one step or two steps." },
  { id: "bits", label: "Bit strings, no 00", rec: "B(n) = B(n-1) + B(n-2),  B(1) = 2, B(2) = 3", closed: "B(n) = Fibonacci(n + 2)", init: [1, 2], next: (p) => p[p.length - 1] + p[p.length - 2], note: "End in 1 (any good string before it) or end in 10 (any good string two shorter)." },
  { id: "growth", label: "Savings account", rec: "A(n) = (1 + r)·A(n-1) + d,  A(0) = start", closed: "", init: null, next: null, note: "Each year the balance earns interest and you add a deposit." },
];

function Models() {
  const [id, setId] = useState("hanoi");
  const [n, setN] = useState(6);
  const [rate, setRate] = useState(5);
  const [dep, setDep] = useState(100);
  const m = MODELS.find((x) => x.id === id);
  const vals = [];
  if (id === "growth") {
    vals.push(1000);
    for (let i = 1; i <= 20; i++) vals.push((1 + rate / 100) * vals[i - 1] + dep);
  } else {
    m.init.forEach((v) => vals.push(v));
    while (vals.length <= 20) vals.push(m.next(vals));
  }
  const shown = vals.slice(0, n + 1);
  const mx = Math.max(...shown);
  const W = 560;
  const barW = W / shown.length;

  return (
    <Panel>
      <SectionTitle title="Modelling with recurrences">
        The hardest step is often the first one: reading a story and finding the rule that connects one case to the previous cases. Pick a model, then
        slide n to see the terms grow.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {MODELS.map((x) => (
          <button key={x.id} onClick={() => setId(x.id)} className={`${btn} ${id === x.id ? btnOn : btnOff}`}>{x.label}</button>
        ))}
      </div>
      <Box className="mt-3">
        <p className="font-mono text-xs sm:text-sm text-[#F4B942] break-words">
          {id === "growth" ? `A(n) = ${r3(1 + rate / 100)}·A(n-1) + ${dep},  A(0) = 1000` : m.rec}
        </p>
        {m.closed && <p className="mt-1 font-mono text-xs sm:text-sm text-[#4ADE80] break-words">Closed form: {m.closed}</p>}
        <p className="mt-2 text-sm text-[#C9BFE3]">{m.note}</p>
      </Box>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="text-sm text-[#C9BFE3]">n = <F>{n}</F>
          <input type="range" min={1} max={20} value={n} onChange={(e) => setN(Number(e.target.value))} className="block w-44 accent-[#7C3AED]" />
        </label>
        {id === "growth" && (
          <>
            <label className="text-sm text-[#C9BFE3]">interest r = <F>{rate}%</F>
              <input type="range" min={0} max={15} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="block w-36 accent-[#7C3AED]" />
            </label>
            <label className="text-sm text-[#C9BFE3]">deposit d = <F>{dep}</F>
              <input type="range" min={0} max={500} step={50} value={dep} onChange={(e) => setDep(Number(e.target.value))} className="block w-36 accent-[#7C3AED]" />
            </label>
          </>
        )}
      </div>
      <div className="mt-3 overflow-x-auto">
        <svg viewBox="0 0 580 150" className="w-full h-auto min-w-[320px]">
          {shown.map((v, i) => {
            const h = mx > 0 ? (v / mx) * 110 : 0;
            return (
              <g key={i}>
                <rect x={10 + i * barW + 1} y={125 - h} width={Math.max(2, barW - 3)} height={h} rx="2" fill={i === n ? "#F4B942" : "#7C3AED"} />
                {shown.length <= 12 && <text x={10 + i * barW + barW / 2} y={142} textAnchor="middle" fontSize="9" fill="#9C93B3" className="font-mono">{i}</text>}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-sm text-[#C9BFE3]">Value at n = {n}: <F>{fmtN(vals[n])}</F></p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Rabbits                                                             */
/* ------------------------------------------------------------------ */

function Rabbits() {
  const [month, setMonth] = useState(1);
  const [play, setPlay] = useState(false);
  const running = play && month < 9;
  useTicker(running, 900, () => setMonth((m) => Math.min(9, m + 1)));
  const rows = [];
  let a = 0;
  let b = 1;
  for (let i = 1; i <= 9; i++) {
    rows.push({ m: i, adults: a, babies: b });
    const na = a + b;
    b = a;
    a = na;
  }
  const row = rows[month - 1];
  const total = row.adults + row.babies;

  return (
    <Panel>
      <SectionTitle title="Fibonacci's rabbits">
        Start with one newborn pair. A pair needs one month to mature, and after that every adult pair produces a new pair each month. Rabbits never die.
        How many pairs are there after n months?
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button onClick={() => { if (month >= 9) setMonth(1); setPlay(!running); }} className={`${btn} ${running ? btnOn : btnOff}`}>{running ? "Pause" : "Play"}</button>
        <button onClick={() => { setPlay(false); setMonth(Math.min(9, month + 1)); }} className={`${btn} ${btnOff}`}>Next month</button>
        <button onClick={() => { setPlay(false); setMonth(1); }} className={`${btn} ${btnOff}`}>Reset</button>
        <span className="text-sm text-[#C9BFE3]">Month <F>{month}</F>: <F>{total}</F> pairs</span>
      </div>
      <div className="mt-3 overflow-x-auto">
        <svg viewBox="0 0 580 170" className="w-full h-auto min-w-[320px]">
          {rows.slice(0, month).map((r, i) => {
            const cx = 10 + i * 62;
            const dots = [];
            for (let k = 0; k < r.adults + r.babies; k++) dots.push(k < r.adults ? "#7C3AED" : "#4ADE80");
            return (
              <g key={i}>
                <text x={cx + 26} y={14} textAnchor="middle" fontSize="10" fill="#9C93B3" className="font-mono">m{r.m}</text>
                {dots.slice(0, 30).map((c, k) => (
                  <circle key={k} cx={cx + 8 + (k % 4) * 13} cy={30 + Math.floor(k / 4) * 13} r="5" fill={c} />
                ))}
                <text x={cx + 26} y={162} textAnchor="middle" fontSize="11" fill="#F4B942" className="font-mono">{r.adults + r.babies}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-[#9C93B3]">Purple = adult pairs, green = newborn pairs. Each month's total is the sum of the previous two totals.</p>
      <div className="mt-3 rounded-lg bg-[#0F0A1A] border border-[#211934] p-3 text-sm text-[#C9BFE3]">
        Why it works: the pairs this month are the pairs we had last month, plus one new pair for every pair that was already adult last month, which are
        exactly the pairs that existed two months ago.
        <p className="mt-2 font-mono text-[#F4B942]">R(n) = R(n-1) + R(n-2),  R(1) = R(2) = 1</p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Hanoi                                                               */
/* ------------------------------------------------------------------ */

const hanoiMoves = (n, a, b, c, out = []) => {
  if (n === 0) return out;
  hanoiMoves(n - 1, a, c, b, out);
  out.push([a, c]);
  hanoiMoves(n - 1, b, a, c, out);
  return out;
};

function Hanoi() {
  const [n, setN] = useState(3);
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  const moves = hanoiMoves(n, 0, 1, 2);
  const running = play && step < moves.length;
  useTicker(running, 600, () => setStep((s) => Math.min(moves.length, s + 1)));

  const pegs = [[], [], []];
  for (let d = n; d >= 1; d--) pegs[0].push(d);
  for (let i = 0; i < step; i++) {
    const [from, to] = moves[i];
    pegs[to].push(pegs[from].pop());
  }
  const pick = (v) => { setN(v); setStep(0); setPlay(false); };

  return (
    <Panel>
      <SectionTitle title="Tower of Hanoi and H(n)">
        Move all disks from the left peg to the right peg, one at a time, never putting a bigger disk on a smaller one. To move n disks: move n - 1 disks
        out of the way, move the biggest disk, then move the n - 1 disks back on top. That sentence is the recurrence.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        {[1, 2, 3, 4, 5].map((v) => (
          <button key={v} onClick={() => pick(v)} className={`${btn} ${n === v ? btnOn : btnOff}`}>{v} disks</button>
        ))}
      </div>
      <div className="mt-3 overflow-x-auto">
        <svg viewBox="0 0 360 150" className="w-full h-auto min-w-[300px]">
          <rect x="10" y="136" width="340" height="5" rx="2" fill="#2A2140" />
          {pegs.map((p, pi) => (
            <g key={pi}>
              <rect x={60 + pi * 120 - 3} y="30" width="6" height="106" fill="#2A2140" />
              {p.map((d, k) => (
                <rect key={d} x={60 + pi * 120 - (14 + d * 8)} y={122 - k * 16} width={(14 + d * 8) * 2} height="14" rx="4" fill={["#7C3AED", "#B48CFF", "#F4B942", "#4ADE80", "#F87171"][d - 1]} />
              ))}
            </g>
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={() => { if (step >= moves.length) setStep(0); setPlay(!running); }} className={`${btn} ${running ? btnOn : btnOff}`}>{running ? "Pause" : "Auto solve"}</button>
        <button onClick={() => { setPlay(false); setStep(Math.min(moves.length, step + 1)); }} className={`${btn} ${btnOff}`}>One move</button>
        <button onClick={() => { setPlay(false); setStep(0); }} className={`${btn} ${btnOff}`}>Reset</button>
      </div>
      <p className="mt-3 text-sm text-[#C9BFE3]">
        Move <F>{step}</F> of <F>{moves.length}</F>. The recurrence says <F>H({n}) = 2·H({n - 1}) + 1 = {moves.length}</F>, and <F>2^{n} - 1 = {2 ** n - 1}</F>.
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Stairs and bit strings                                              */
/* ------------------------------------------------------------------ */

const stairWays = (n) => {
  if (n === 0) return [[]];
  const out = [];
  stairWays(n - 1).forEach((w) => out.push([...w, 1]));
  if (n >= 2) stairWays(n - 2).forEach((w) => out.push([...w, 2]));
  return out;
};

function Stairs() {
  const [n, setN] = useState(5);
  const ways = stairWays(n);
  const [pick, setPick] = useState(0);
  const way = ways[Math.min(pick, ways.length - 1)];
  const fib = fibList(n + 2);
  const pos = [0];
  way.forEach((s) => pos.push(pos[pos.length - 1] + s));

  return (
    <Panel>
      <SectionTitle title="Climbing stairs: counting by the last move">
        You climb n stairs taking 1 or 2 steps at a time. Let S(n) be the number of different ways. The last move was a 1-step (leaving n - 1 stairs
        before it) or a 2-step (leaving n - 2), and these two groups never overlap. So S(n) = S(n-1) + S(n-2).
      </SectionTitle>
      <label className="mt-4 block text-sm text-[#C9BFE3]">stairs n = <F>{n}</F>
        <input type="range" min={1} max={8} value={n} onChange={(e) => { setN(Number(e.target.value)); setPick(0); }} className="block w-52 accent-[#7C3AED]" />
      </label>
      <p className="mt-2 text-sm text-[#C9BFE3]">Ways: <F>{ways.length}</F> (and Fibonacci({n + 1}) = <F>{fib[n + 1]}</F>). Tap one to see it drawn.</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ways.map((w, i) => (
          <button key={i} onClick={() => setPick(i)} className={`px-2 py-1.5 rounded-md text-xs font-mono border ${i === pick ? btnOn : btnOff}`}>{w.join("+")}</button>
        ))}
      </div>
      <div className="mt-3 overflow-x-auto">
        <svg viewBox={`0 0 ${40 * (n + 2)} 90`} className="w-full h-auto min-w-[280px]">
          {Array.from({ length: n + 1 }, (_, i) => (
            <rect key={i} x={10 + i * 38} y={80 - i * 8} width="38" height={8 + i * 8} fill="#211934" stroke="#2A2140" />
          ))}
          {pos.map((p, i) => (
            <circle key={i} cx={29 + p * 38} cy={72 - p * 8} r="5" fill={i === pos.length - 1 ? "#4ADE80" : "#F4B942"} />
          ))}
        </svg>
      </div>
    </Panel>
  );
}

function BitStrings() {
  const [n, setN] = useState(3);
  const all = [];
  for (let v = 0; v < 2 ** n; v++) all.push(v.toString(2).padStart(n, "0"));
  const good = all.filter((s) => !s.includes("00"));
  const counts = [];
  let a = 1;
  let b = 2;
  for (let i = 1; i <= n; i++) {
    counts.push(b);
    const t = a + b;
    a = b;
    b = t;
  }

  return (
    <Panel>
      <SectionTitle title="Bit strings with no two consecutive 0s">
        Let B(n) count the bit strings of length n that never contain 00. A good string either ends in 1 (remove it and any good string of length n - 1
        remains) or ends in 10 (remove both and any good string of length n - 2 remains). Green strings are the good ones.
      </SectionTitle>
      <label className="mt-4 block text-sm text-[#C9BFE3]">length n = <F>{n}</F>
        <input type="range" min={1} max={5} value={n} onChange={(e) => setN(Number(e.target.value))} className="block w-52 accent-[#7C3AED]" />
      </label>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {all.map((s) => {
          const ok = !s.includes("00");
          return <span key={s} className={`px-2 py-1 rounded-md text-xs font-mono border ${ok ? "border-[#4ADE80] text-[#4ADE80] bg-[#173626]/40" : "border-[#2A2140] text-[#9C93B3] line-through"}`}>{s}</span>;
        })}
      </div>
      <p className="mt-3 text-sm text-[#C9BFE3]">
        Good strings: <F>{good.length}</F> out of <F>{all.length}</F>. Sequence B(1), B(2), ...: <F>{counts.join(", ")}</F>
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Explorer                                                            */
/* ------------------------------------------------------------------ */

const explorerPresets = [
  { name: "Fibonacci", c: [1, 1], a: [0, 1] },
  { name: "Doubling", c: [2, 0], a: [1, 2] },
  { name: "5, -6 (roots 2 and 3)", c: [5, -6], a: [1, 0] },
  { name: "Oscillating", c: [0, -1], a: [1, 2] },
  { name: "Lucas", c: [1, 1], a: [2, 1] },
];

function Explorer() {
  const [c1, setC1] = useState(1);
  const [c2, setC2] = useState(1);
  const [a0, setA0] = useState(0);
  const [a1, setA1] = useState(1);
  const [shown, setShown] = useState(12);
  const [play, setPlay] = useState(false);
  const [logScale, setLogScale] = useState(false);
  const N = 12;
  const terms = [a0, a1];
  while (terms.length < N) terms.push(c1 * terms[terms.length - 1] + c2 * terms[terms.length - 2]);
  const running = play && shown < N;
  useTicker(running, 450, () => setShown((s) => Math.min(N, s + 1)));

  const f = (v) => (logScale ? Math.sign(v) * Math.log10(1 + Math.abs(v)) : v);
  const mx = Math.max(1e-9, ...terms.map((v) => Math.abs(f(v))));
  const bw = 560 / N;
  const apply = (p) => { setC1(p.c[0]); setC2(p.c[1]); setA0(p.a[0]); setA1(p.a[1]); setShown(N); setPlay(false); };
  const field = (label, val, set, lo, hi) => (
    <label className="text-sm text-[#C9BFE3]">{label}
      <input type="number" value={val} onChange={(e) => { set(clampInt(e.target.value, lo, hi)); setShown(N); }} className={`${numInput} block mt-1`} />
    </label>
  );

  return (
    <Panel>
      <SectionTitle title="Recurrence explorer">
        Build your own order 2 recurrence <F>a_n = c1·a_(n-1) + c2·a_(n-2)</F>. Change the coefficients and starting values and watch the sequence grow,
        shrink, or oscillate.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {explorerPresets.map((p) => (
          <button key={p.name} onClick={() => apply(p)} className={`${btn} ${btnOff}`}>{p.name}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {field("c1", c1, setC1, -9, 9)}
        {field("c2", c2, setC2, -9, 9)}
        {field("a0", a0, setA0, -20, 20)}
        {field("a1", a1, setA1, -20, 20)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => { if (shown >= N) setShown(2); setPlay(!running); }} className={`${btn} ${running ? btnOn : btnOff}`}>{running ? "Pause" : "Animate bars"}</button>
        <button onClick={() => setLogScale(!logScale)} className={`${btn} ${logScale ? btnOn : btnOff}`}>Log scale</button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <svg viewBox="0 0 580 180" className="w-full h-auto min-w-[320px]">
          <line x1="10" x2="570" y1="90" y2="90" stroke="#2A2140" />
          {terms.slice(0, shown).map((v, i) => {
            const h = (Math.abs(f(v)) / mx) * 80;
            return <rect key={i} x={10 + i * bw + 2} y={v >= 0 ? 90 - h : 90} width={bw - 5} height={h} rx="2" fill={v >= 0 ? "#7C3AED" : "#F87171"} />;
          })}
        </svg>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm font-mono">
          <thead>
            <tr className="text-[#9C93B3]"><th className="text-left pr-3">n</th>{terms.slice(0, shown).map((_, i) => <th key={i} className="px-2 text-right">{i}</th>)}</tr>
          </thead>
          <tbody>
            <tr className="text-[#F4B942]"><td className="pr-3">a_n</td>{terms.slice(0, shown).map((v, i) => <td key={i} className="px-2 text-right">{fmtN(v)}</td>)}</tr>
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Iteration                                                           */
/* ------------------------------------------------------------------ */

const ITER = {
  arith: {
    label: "a_n = a_(n-1) + 3,  a_1 = 2",
    lines: [
      ["a_n = a_(n-1) + 3", "Start from the rule."],
      ["    = (a_(n-2) + 3) + 3 = a_(n-2) + 2·3", "Replace a_(n-1) using the rule again."],
      ["    = (a_(n-3) + 3) + 2·3 = a_(n-3) + 3·3", "Once more. A pattern appears: k threes."],
      ["    = a_(n-k) + k·3", "General pattern after k substitutions."],
      ["    = a_1 + (n-1)·3   (take k = n - 1)", "Stop when we reach the initial condition."],
      ["    = 2 + 3(n - 1) = 3n - 1", "Simplify. This is the closed form."],
    ],
    f: (n) => 3 * n - 1, from: 1, rec: (p) => p + 3, start: 2,
  },
  geo: {
    label: "a_n = 2·a_(n-1),  a_0 = 3",
    lines: [
      ["a_n = 2·a_(n-1)", "Start from the rule."],
      ["    = 2·(2·a_(n-2)) = 2^2·a_(n-2)", "Substitute for a_(n-1)."],
      ["    = 2^2·(2·a_(n-3)) = 2^3·a_(n-3)", "Substitute again."],
      ["    = 2^k·a_(n-k)", "General pattern."],
      ["    = 2^n·a_0   (take k = n)", "Stop at the initial condition."],
      ["    = 3·2^n", "Closed form."],
    ],
    f: (n) => 3 * 2 ** n, from: 0, rec: (p) => 2 * p, start: 3,
  },
  hanoi: {
    label: "H(n) = 2·H(n-1) + 1,  H(0) = 0",
    lines: [
      ["H(n) = 2·H(n-1) + 1", "Start from the rule."],
      ["     = 2(2·H(n-2) + 1) + 1 = 4·H(n-2) + 2 + 1", "Substitute."],
      ["     = 4(2·H(n-3) + 1) + 3 = 8·H(n-3) + 4 + 2 + 1", "Substitute again. Powers of 2 collect up."],
      ["     = 2^k·H(n-k) + (2^(k-1) + ... + 2 + 1)", "General pattern."],
      ["     = 2^n·H(0) + (2^(n-1) + ... + 1)   (k = n)", "Reach the initial condition."],
      ["     = 0 + (2^n - 1) = 2^n - 1", "Geometric sum gives the closed form."],
    ],
    f: (n) => 2 ** n - 1, from: 0, rec: (p) => 2 * p + 1, start: 0,
  },
};

function Iteration() {
  const [key, setKey] = useState("arith");
  const [step, setStep] = useState(1);
  const [n, setN] = useState(6);
  const it = ITER[key];
  const seq = [it.start];
  for (let i = it.from + 1; i <= it.from + 12; i++) seq.push(it.rec(seq[seq.length - 1]));
  const idx = n - it.from;
  const rec = idx >= 0 && idx < seq.length ? seq[idx] : null;

  return (
    <Panel>
      <SectionTitle title="Solving by iteration (backtracking)">
        Keep substituting the rule into itself until you reach the initial condition, spot the pattern, and write the closed form. Press the button to
        reveal one line at a time.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(ITER).map(([k, v]) => (
          <button key={k} onClick={() => { setKey(k); setStep(1); }} className={`${btn} ${key === k ? btnOn : btnOff} font-mono text-xs`}>{v.label}</button>
        ))}
      </div>
      <Box className="mt-3 overflow-x-auto">
        {it.lines.slice(0, step).map((l, i) => (
          <div key={i} className="mb-2">
            <p className="font-mono text-xs sm:text-sm text-[#F4B942] whitespace-pre">{l[0]}</p>
            <p className="text-xs text-[#9C93B3]">{l[1]}</p>
          </div>
        ))}
      </Box>
      <div className="mt-3 flex gap-2">
        <button disabled={step >= it.lines.length} onClick={() => setStep(step + 1)} className={`${btn} ${btnOn} disabled:opacity-40`}>Next line</button>
        <button onClick={() => setStep(1)} className={`${btn} ${btnOff}`}>Reset</button>
      </div>
      <label className="mt-3 block text-sm text-[#C9BFE3]">check at n = <F>{n}</F>
        <input type="range" min={it.from + 1} max={it.from + 11} value={Math.max(n, it.from + 1)} onChange={(e) => setN(Number(e.target.value))} className="block w-52 accent-[#7C3AED]" />
      </label>
      <p className="mt-2 text-sm text-[#C9BFE3]">
        Recurrence gives <F>{rec === null ? "?" : fmtN(rec)}</F>, closed form gives <F>{fmtN(it.f(Math.max(n, it.from + 1)))}</F>.
        {rec !== null && rec === it.f(Math.max(n, it.from + 1)) ? " They agree." : ""}
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Characteristic equation                                             */
/* ------------------------------------------------------------------ */

function solveChar(c1, c2, a0, a1) {
  const disc = c1 * c1 + 4 * c2;
  if (disc > 1e-9) {
    const s = Math.sqrt(disc);
    const r1 = (c1 + s) / 2;
    const r2 = (c1 - s) / 2;
    const A = (a1 - a0 * r2) / (r1 - r2);
    const B = a0 - A;
    return { kind: "distinct", disc, r1, r2, A, B, f: (n) => A * r1 ** n + B * r2 ** n,
      text: `a_n = ${r3(A)}·(${r3(r1)})^n + ${r3(B)}·(${r3(r2)})^n` };
  }
  if (Math.abs(disc) <= 1e-9) {
    const r = c1 / 2;
    if (r === 0) return { kind: "zero", disc };
    const A = a0;
    const B = a1 / r - a0;
    return { kind: "repeated", disc, r1: r, A, B, f: (n) => (A + B * n) * r ** n,
      text: `a_n = (${r3(A)} + ${r3(B)}·n)·(${r3(r)})^n` };
  }
  return { kind: "complex", disc };
}

const charPresets = [
  { name: "5, -6", c: [5, -6], a: [1, 0] },
  { name: "Fibonacci", c: [1, 1], a: [0, 1] },
  { name: "Repeated root", c: [4, -4], a: [1, 4] },
  { name: "Complex roots", c: [2, -2], a: [0, 1] },
];

function Characteristic() {
  const [c1, setC1] = useState(5);
  const [c2, setC2] = useState(-6);
  const [a0, setA0] = useState(1);
  const [a1, setA1] = useState(0);
  const [bn, setBn] = useState(10);
  const sol = solveChar(c1, c2, a0, a1);
  const terms = [a0, a1];
  while (terms.length < 11) terms.push(c1 * terms[terms.length - 1] + c2 * terms[terms.length - 2]);
  const phi = (1 + Math.sqrt(5)) / 2;
  const fibs = fibList(30);
  const binet = Math.round((phi ** bn - (1 - phi) ** bn) / Math.sqrt(5));
  const field = (label, val, set, lo, hi) => (
    <label className="text-sm text-[#C9BFE3]">{label}
      <input type="number" value={val} onChange={(e) => set(clampInt(e.target.value, lo, hi))} className={`${numInput} block mt-1`} />
    </label>
  );

  return (
    <Panel>
      <SectionTitle title="Characteristic equation method">
        For a_n = c1·a_(n-1) + c2·a_(n-2), try a_n = r^n. Plugging in and dividing by r^(n-2) leaves a quadratic: <F>r^2 = c1·r + c2</F>. Its roots decide the
        shape of every solution.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
        <Box><p className="font-semibold text-[#4ADE80]">Two distinct roots</p><p className="mt-1 font-mono text-xs text-[#F4B942]">a_n = A·r1^n + B·r2^n</p></Box>
        <Box><p className="font-semibold text-[#4ADE80]">One repeated root</p><p className="mt-1 font-mono text-xs text-[#F4B942]">a_n = (A + B·n)·r^n</p></Box>
        <Box><p className="font-semibold text-[#4ADE80]">Complex roots</p><p className="mt-1 text-xs text-[#C9BFE3]">Sines and cosines appear; beyond this course.</p></Box>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {charPresets.map((p) => (
          <button key={p.name} onClick={() => { setC1(p.c[0]); setC2(p.c[1]); setA0(p.a[0]); setA1(p.a[1]); }} className={`${btn} ${btnOff}`}>{p.name}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        {field("c1", c1, setC1, -9, 9)}
        {field("c2", c2, setC2, -9, 9)}
        {field("a0", a0, setA0, -20, 20)}
        {field("a1", a1, setA1, -20, 20)}
      </div>
      <Box className="mt-3">
        <p className="font-mono text-xs sm:text-sm text-[#F4B942] break-words">r^2 - {c1}·r - ({c2}) = 0,  discriminant = {c1 * c1 + 4 * c2}</p>
        {sol.kind === "distinct" && <p className="mt-1 text-sm text-[#C9BFE3]">Distinct roots <F>{r3(sol.r1)}</F> and <F>{r3(sol.r2)}</F>.</p>}
        {sol.kind === "repeated" && <p className="mt-1 text-sm text-[#C9BFE3]">Repeated root <F>{r3(sol.r1)}</F>.</p>}
        {sol.kind === "complex" && <p className="mt-1 text-sm text-[#F87171]">The roots are complex, so there is no real exponential closed form here.</p>}
        {sol.kind === "zero" && <p className="mt-1 text-sm text-[#F87171]">Double root 0: every term after a_1 is 0.</p>}
        {sol.text && <p className="mt-1 font-mono text-xs sm:text-sm text-[#4ADE80] break-words">{sol.text}</p>}
      </Box>
      {sol.f && (
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm font-mono">
            <thead><tr className="text-[#9C93B3]"><th className="text-left pr-3">n</th>{terms.map((_, i) => <th key={i} className="px-2 text-right">{i}</th>)}</tr></thead>
            <tbody>
              <tr className="text-[#F4B942]"><td className="pr-3">recursive</td>{terms.map((v, i) => <td key={i} className="px-2 text-right">{fmtN(v)}</td>)}</tr>
              <tr className="text-[#B48CFF]"><td className="pr-3">formula</td>{terms.map((_, i) => <td key={i} className="px-2 text-right">{fmtN(Math.round(sol.f(i) * 1e6) / 1e6)}</td>)}</tr>
              <tr className="text-[#4ADE80]"><td className="pr-3">match</td>{terms.map((v, i) => <td key={i} className="px-2 text-right">{Math.abs(v - sol.f(i)) < 1e-6 * Math.max(1, Math.abs(v)) ? "yes" : "no"}</td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
      <Box className="mt-4">
        <p className="text-xs font-semibold text-[#B48CFF] tracking-wide">FIBONACCI: BINET'S FORMULA</p>
        <p className="mt-2 font-mono text-xs sm:text-sm text-[#F4B942] break-words">f_n = (φ^n - ψ^n) / √5,  φ = (1+√5)/2, ψ = (1-√5)/2</p>
        <label className="mt-2 block text-sm text-[#C9BFE3]">n = <F>{bn}</F>
          <input type="range" min={0} max={30} value={bn} onChange={(e) => setBn(Number(e.target.value))} className="block w-52 accent-[#7C3AED]" />
        </label>
        <p className="mt-2 text-sm text-[#C9BFE3]">Recursion: <F>{fibs[bn]}</F>. Binet: <F>{binet}</F>. {fibs[bn] === binet ? "They match." : "Rounding error appears."}</p>
      </Box>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Divide and conquer                                                  */
/* ------------------------------------------------------------------ */

function MergeTree() {
  const [n, setN] = useState(8);
  const [lvl, setLvl] = useState(0);
  const [play, setPlay] = useState(false);
  const L = Math.log2(n);
  const running = play && lvl < L;
  useTicker(running, 900, () => setLvl((v) => Math.min(L, v + 1)));
  const pick = (v) => { setN(v); setLvl(0); setPlay(false); };

  return (
    <Panel>
      <SectionTitle title="Divide and conquer: merge sort">
        Merge sort splits a list in half, sorts each half recursively, then merges. The cost obeys <F>T(n) = 2·T(n/2) + n</F>. Every level of the
        recursion tree does about n work, and there are log2(n) + 1 levels.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        {[4, 8, 16].map((v) => <button key={v} onClick={() => pick(v)} className={`${btn} ${n === v ? btnOn : btnOff}`}>n = {v}</button>)}
        <button onClick={() => { if (lvl >= L) setLvl(0); setPlay(!running); }} className={`${btn} ${running ? btnOn : btnOff}`}>{running ? "Pause" : "Split level by level"}</button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <svg viewBox="0 0 580 190" className="w-full h-auto min-w-[320px]">
          {Array.from({ length: L + 1 }, (_, k) => {
            const cnt = 2 ** k;
            const w = 560 / cnt;
            if (k > lvl) return null;
            return (
              <g key={k}>
                {Array.from({ length: cnt }, (_, i) => (
                  <g key={i}>
                    <rect x={10 + i * w + 1} y={10 + k * 36} width={w - 2} height="26" rx="4" fill={k === lvl ? "#7C3AED" : "#211934"} stroke="#2A2140" />
                    <text x={10 + i * w + w / 2} y={27 + k * 36} textAnchor="middle" fontSize="11" fill="#E4D9FF" className="font-mono">{n / cnt}</text>
                  </g>
                ))}
                <text x="572" y={27 + k * 36} textAnchor="end" fontSize="10" fill="#F4B942" className="font-mono">{cnt}·{n / cnt} = {n}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-sm text-[#C9BFE3]">
        Levels shown: <F>{lvl + 1}</F> of <F>{L + 1}</F>. Total merge cost when complete: <F>{n} · {L} = {n * L}</F>, which is of order n·log n.
      </p>
    </Panel>
  );
}

function Master() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [d, setD] = useState(1);
  const crit = Math.log(a) / Math.log(b);
  const eq = Math.abs(crit - d) < 1e-9;
  const verdict = eq ? { t: `Θ(n^${d} · log n)`, why: "Work is balanced across levels, so the log n levels all add up equally." }
    : crit > d ? { t: `Θ(n^${r3(crit)})`, why: "The leaves dominate: the number of subproblems grows faster than the work shrinks." }
    : { t: `Θ(n^${d})`, why: "The root dominates: the top level costs more than everything below it." };

  return (
    <Panel>
      <SectionTitle title="A quick look at the Master theorem">
        Many divide and conquer algorithms satisfy <F>T(n) = a·T(n/b) + n^d</F>: split into a subproblems of size n/b and do n^d extra work. Compare d with
        log_b(a). Try the common cases.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="text-sm text-[#C9BFE3]">a = <F>{a}</F><input type="range" min={1} max={8} value={a} onChange={(e) => setA(Number(e.target.value))} className="block w-32 accent-[#7C3AED]" /></label>
        <label className="text-sm text-[#C9BFE3]">b = <F>{b}</F><input type="range" min={2} max={4} value={b} onChange={(e) => setB(Number(e.target.value))} className="block w-32 accent-[#7C3AED]" /></label>
        <label className="text-sm text-[#C9BFE3]">d = <F>{d}</F><input type="range" min={0} max={3} value={d} onChange={(e) => setD(Number(e.target.value))} className="block w-32 accent-[#7C3AED]" /></label>
      </div>
      <Box className="mt-3">
        <p className="font-mono text-xs sm:text-sm text-[#F4B942] break-words">T(n) = {a}·T(n/{b}) + n^{d},  log_{b}({a}) = {r3(crit)}</p>
        <p className="mt-2 font-mono text-sm text-[#4ADE80]">T(n) = {verdict.t}</p>
        <p className="mt-1 text-sm text-[#C9BFE3]">{verdict.why}</p>
      </Box>
      <p className="mt-2 text-xs text-[#9C93B3]">Merge sort is a = 2, b = 2, d = 1. Binary search is a = 1, b = 2, d = 0, giving log n.</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Benchmark                                                           */
/* ------------------------------------------------------------------ */

function naiveFib(n, c) {
  c.calls++;
  return n < 2 ? n : naiveFib(n - 1, c) + naiveFib(n - 2, c);
}

function Benchmark() {
  const [n, setN] = useState(25);
  const [res, setRes] = useState(null);
  const fibs = fibList(n + 1);
  const naiveCalls = 2 * fibs[n + 1] - 1;
  const rows = [
    ["Naive recursion", naiveCalls, "exponential, about 1.6^n"],
    ["Memoized recursion", n < 1 ? 1 : 2 * n - 1, "linear, n"],
    ["Iterative loop", Math.max(0, n - 1), "linear, n"],
    ["Closed form (Binet)", 1, "constant, ignoring pow"],
  ];
  const run = () => {
    const c = { calls: 0 };
    const t0 = performance.now();
    const v = naiveFib(n, c);
    setRes({ n, v, calls: c.calls, ms: Math.round(performance.now() - t0) });
  };

  return (
    <Panel>
      <SectionTitle title="Same recurrence, four implementations">
        A recurrence tells you what the answer is. How you compute it decides whether it takes microseconds or years. Slide n to see how many operations
        each strategy needs.
      </SectionTitle>
      <label className="mt-4 block text-sm text-[#C9BFE3]">n = <F>{n}</F>
        <input type="range" min={5} max={32} value={n} onChange={(e) => { setN(Number(e.target.value)); setRes(null); }} className="block w-56 accent-[#7C3AED]" />
      </label>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead><tr className="text-left text-[#9C93B3]"><th className="pr-3">Method</th><th className="pr-3">Operations</th><th>Growth</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-[#211934]"><td className="pr-3 py-1.5 text-[#E4D9FF]">{r[0]}</td><td className="pr-3 font-mono text-[#F4B942]">{r[1].toLocaleString()}</td><td className="text-[#C9BFE3]">{r[2]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={run} className={`mt-3 ${btn} ${btnOn}`}>Run naive fib({n}) for real</button>
      {res && <p className="mt-2 text-sm text-[#C9BFE3]">fib({res.n}) = <F>{res.v}</F>, made <F>{res.calls.toLocaleString()}</F> calls in about <F>{res.ms} ms</F>.</p>}
      <div className="mt-4"><CodeBlock title="fib_four_ways.py" code={`from functools import lru_cache
import math

def fib_naive(n):                # T(n) = T(n-1) + T(n-2) + 1  -> exponential
    return n if n < 2 else fib_naive(n - 1) + fib_naive(n - 2)

@lru_cache(maxsize=None)
def fib_memo(n):                 # each n computed once -> linear
    return n if n < 2 else fib_memo(n - 1) + fib_memo(n - 2)

def fib_iter(n):                 # keep only the last two terms -> linear, O(1) space
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

def fib_closed(n):               # Binet, exact only while floats are precise (n < ~70)
    phi = (1 + math.sqrt(5)) / 2
    return round(phi ** n / math.sqrt(5))

print(fib_naive(25), fib_memo(25), fib_iter(25), fib_closed(25))  # all 75025`} /></div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

const QUIZ = [
  { q: "Which initial conditions does a_n = 3·a_(n-1) - 2·a_(n-2) need?", o: ["None", "a_0 only", "a_0 and a_1", "a_n for all n"], a: 2, why: "It looks back two terms, so two starting values are needed to get going." },
  { q: "The characteristic equation of a_n = 5a_(n-1) - 6a_(n-2) is:", o: ["r^2 = 5r - 6", "r^2 = 6r - 5", "r = 5 - 6", "r^2 + 5r + 6 = 0"], a: 0, why: "Replace a_n by r^n and divide by r^(n-2): r^2 = 5r - 6, so r = 2 or 3." },
  { q: "A recurrence has a repeated root r. The general solution is:", o: ["A·r^n", "A·r^n + B·r^n", "(A + B·n)·r^n", "A·r^n + B·n"], a: 2, why: "A·r^n + B·r^n collapses to one constant, so we need the extra factor n to get two free constants." },
  { q: "Solving a_n = a_(n-1) + 4 with a_0 = 1 by iteration gives:", o: ["4n", "4n + 1", "4^n", "n + 4"], a: 1, why: "We add 4 exactly n times to the starting value 1." },
  { q: "T(n) = 2T(n/2) + n has solution of order:", o: ["n", "n log n", "n^2", "log n"], a: 1, why: "Each of the log n levels costs about n, so the total is n log n." },
];

function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  if (i >= QUIZ.length) {
    return (
      <Panel>
        <SectionTitle title="Quiz: recurrence relations" />
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
      <SectionTitle title="Quiz: recurrence relations">Choose an answer to get instant feedback.</SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="text-xs text-[#9C93B3]">Question {i + 1} of {QUIZ.length}</p>
        <p className="mt-2 text-[#E4D9FF]">{item.q}</p>
        <div className="mt-4 grid gap-2">
          {item.o.map((label, idx) => {
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

export default function RecurrenceSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 7 · RECURRENCE RELATIONS</p>
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white">Recurrence Relations</h2>
        <p className="mt-2 text-[#9C93B3]">
          Many counting and algorithm problems are easiest to describe by relating a case to smaller cases. Here we learn to write those relations, explore
          them, and solve them to get a direct formula.
        </p>
      </div>

      <Definition />
      <Models />
      <Rabbits />
      <Hanoi />
      <Stairs />
      <BitStrings />
      <Explorer />
      <Iteration />
      <Characteristic />
      <MergeTree />
      <Master />

      <WorkedExample
        tag="EXAMPLE 1 · MODELLING"
        title="Bit strings of length n with no two consecutive 0s"
        given={<p>B(n) is the number of bit strings of length n that do not contain 00. We know B(1) = 2 (strings 0 and 1) and B(2) = 3 (strings 01, 10, 11).</p>}
        asked={<p>Find a recurrence for B(n) and compute B(5).</p>}
        steps={[
          { title: "Split by the last bit", text: "A good string of length n ends in 1 or in 0." },
          { title: "Ends in 1", text: "The first n - 1 bits can be any good string, so there are B(n-1) of these." },
          { title: "Ends in 0", text: "Then the bit before it must be 1 (otherwise 00). The first n - 2 bits can be any good string, so B(n-2) of these." },
          { title: "Combine", text: "The two cases are disjoint and cover everything.", formula: "B(n) = B(n-1) + B(n-2)" },
          { title: "Compute", text: "B(3) = 3 + 2 = 5, B(4) = 5 + 3 = 8, B(5) = 8 + 5 = 13.", formula: "B(5) = 13" },
        ]}
      />

      <WorkedExample
        tag="EXAMPLE 2 · ITERATION"
        title="Solve a_n = 2·a_(n-1) with a_0 = 3"
        given={<p>The recurrence a_n = 2·a_(n-1) for n ≥ 1 and the initial condition a_0 = 3.</p>}
        asked={<p>Find a closed form for a_n.</p>}
        steps={[
          { title: "Write the first terms", text: "a_1 = 6, a_2 = 12, a_3 = 24. Each term doubles." },
          { title: "Iterate", text: "Substitute the rule into itself n times.", formula: "a_n = 2·a_(n-1) = 2^2·a_(n-2) = ... = 2^n·a_0" },
          { title: "Insert a_0", text: "With a_0 = 3:", formula: "a_n = 3·2^n" },
          { title: "Check", text: "n = 3 gives 3·8 = 24, matching the list above. To be fully rigorous, prove it by induction: the formula holds for n = 0, and if a_k = 3·2^k then a_(k+1) = 2·3·2^k = 3·2^(k+1)." },
        ]}
      />

      <WorkedExample
        tag="EXAMPLE 3 · ITERATION"
        title="Solve a_n = a_(n-1) + 2n with a_0 = 4"
        given={<p>a_n = a_(n-1) + 2n for n ≥ 1 and a_0 = 4. The amount added changes with n.</p>}
        asked={<p>Find a closed form for a_n.</p>}
        steps={[
          { title: "Unroll", text: "Replace each a_(k) by a_(k-1) + 2k until we reach a_0.", formula: "a_n = a_0 + 2·1 + 2·2 + ... + 2n" },
          { title: "Factor out the 2", text: "The extra terms form 2(1 + 2 + ... + n).", formula: "a_n = 4 + 2·(1 + 2 + ... + n)" },
          { title: "Use the sum formula", text: "1 + 2 + ... + n = n(n+1)/2.", formula: "a_n = 4 + n(n+1)" },
          { title: "Check", text: "a_1 = 4 + 2 = 6 and the rule gives 4 + 2·1 = 6. a_2 = 4 + 6 = 10 and the rule gives 6 + 4 = 10." },
        ]}
      />

      <WorkedExample
        tag="EXAMPLE 4 · CHARACTERISTIC EQUATION"
        title="Solve a_n = 5·a_(n-1) - 6·a_(n-2), a_0 = 1, a_1 = 0"
        given={<p>A linear homogeneous recurrence of degree 2 with constant coefficients, and two initial values.</p>}
        asked={<p>Find a closed form for a_n.</p>}
        steps={[
          { title: "Characteristic equation", text: "Try a_n = r^n and divide by r^(n-2).", formula: "r^2 - 5r + 6 = 0" },
          { title: "Find the roots", text: "Factor the quadratic.", formula: "(r - 2)(r - 3) = 0,  r = 2 or r = 3" },
          { title: "General solution", text: "Two distinct roots give a combination of two exponentials.", formula: "a_n = A·2^n + B·3^n" },
          { title: "Use initial conditions", text: "n = 0 gives A + B = 1. n = 1 gives 2A + 3B = 0.", formula: "B = -2, A = 3" },
          { title: "Answer", text: "Substitute back.", formula: "a_n = 3·2^n - 2·3^n" },
          { title: "Check", text: "n = 2: the recurrence gives 5·0 - 6·1 = -6, and the formula gives 12 - 18 = -6." },
        ]}
      />

      <WorkedExample
        tag="EXAMPLE 5 · HANOI"
        title="H(n) = 2·H(n-1) + 1 has solution H(n) = 2^n - 1"
        given={<p>H(0) = 0 and H(n) = 2·H(n-1) + 1 for n ≥ 1. Here H(n) is the minimum number of moves to transfer n disks.</p>}
        asked={<p>Show by induction that H(n) = 2^n - 1.</p>}
        steps={[
          { title: "BASIS STEP", text: "For n = 0 the formula gives 2^0 - 1 = 0, which equals H(0)." },
          { title: "INDUCTIVE HYPOTHESIS", text: "Assume H(k) = 2^k - 1 for some k ≥ 0." },
          { title: "INDUCTIVE STEP", text: "Use the recurrence and then the hypothesis.", formula: "H(k+1) = 2·H(k) + 1 = 2(2^k - 1) + 1 = 2^(k+1) - 1" },
          { title: "CONCLUSION", text: "By induction, H(n) = 2^n - 1 for all n ≥ 0. With 64 disks that is about 1.8 × 10^19 moves." },
        ]}
      />

      <Benchmark />
      <Quiz />

      <Reflection
        fact="A recurrence is only a description. The same Fibonacci rule takes 2.7 million calls at n = 32 when coded naively, yet 31 additions in a loop."
        question="The recurrence a_n = 2·a_(n-1) - a_(n-2) has characteristic equation (r - 1)^2 = 0. Which closed form do you expect, and how would you check it from a_0 = 1 and a_1 = 3?"
        hint="Repeated root r = 1, so a_n = (A + B·n)·1^n. Use a_0 and a_1 to find A and B."
      />
    </div>
  );
}
