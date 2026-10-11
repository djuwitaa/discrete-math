import { useEffect, useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";

const F = ({ children }) => <span className="font-mono text-[#F4B942]">{children}</span>;

const numInput = "bg-[#0A0714] border border-[#2A2140] rounded-lg px-3 py-2 text-[#E4D9FF] font-mono w-20 text-base";
const btn = "px-4 py-2 rounded-lg text-sm border transition";
const btnOn = "bg-[#7C3AED] border-transparent text-white";
const btnOff = "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]";
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.floor(Number(v)) || lo));

/* ------------------------------------------------------------------ */
/* Statement                                                           */
/* ------------------------------------------------------------------ */

function Statement() {
  return (
    <Panel>
      <SectionTitle title="The principle">
        Line up the nonnegative integers 0, 1, 2, 3, ... and pick any collection of them. As long as you picked at least one, there is always a
        smallest one. That sounds obvious, but it is a real property that not every number system has.
      </SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#7C3AED]/40 p-4">
        <p className="text-xs font-semibold text-[#B48CFF] tracking-wide">WELL ORDERING PRINCIPLE (WOP)</p>
        <p className="mt-2 text-sm text-[#E4D9FF]">Every nonempty set of nonnegative integers has a least element.</p>
        <p className="mt-2 font-mono text-xs sm:text-sm text-[#F4B942] break-words">S ⊆ {"{0, 1, 2, ...}"}, S ≠ ∅  →  ∃m ∈ S  ∀x ∈ S  (m ≤ x)</p>
        <p className="mt-2 text-xs text-[#9C93B3]">The same is true with "positive integers" in place of "nonnegative integers".</p>
      </div>
      <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3"><p className="font-semibold text-[#4ADE80]">Needs nonempty</p><p className="mt-1 text-[#C9BFE3]">The empty set has no elements at all, so no least one.</p></div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3"><p className="font-semibold text-[#4ADE80]">Needs a floor</p><p className="mt-1 text-[#C9BFE3]">Integers can go down forever (..., -2, -1, 0), so Z is not well ordered.</p></div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3"><p className="font-semibold text-[#4ADE80]">Needs gaps</p><p className="mt-1 text-[#C9BFE3]">Between 0 and any positive real there is always a smaller positive real.</p></div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Set explorer                                                        */
/* ------------------------------------------------------------------ */

const isPrime = (n) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};
const prevPrime = (c) => {
  for (let x = c - 1; x >= 2; x--) if (isPrime(x)) return x;
  return null;
};

const PRESETS = [
  { name: "Multiples of 7", set: "{7, 14, 21, ...}", lo: 0, hi: 30, dense: false, start: 28, has: true, least: "7",
    contains: (x) => x > 0 && x % 7 === 0, smaller: (c) => (c > 7 ? c - 7 : null) },
  { name: "Primes", set: "{2, 3, 5, 7, ...}", lo: 0, hi: 30, dense: false, start: 29, has: true, least: "2",
    contains: isPrime, smaller: prevPrime },
  { name: "n with n² > 50", set: "{n ∈ N : n² > 50}", lo: 0, hi: 30, dense: false, start: 20, has: true, least: "8",
    contains: (x) => x >= 0 && x * x > 50, smaller: (c) => (c - 1 >= 0 && (c - 1) * (c - 1) > 50 ? c - 1 : null) },
  { name: "All integers Z", set: "{..., -1, 0, 1, ...}", lo: -10, hi: 10, dense: false, start: 3, has: false, least: null,
    contains: () => true, smaller: (c) => c - 1, why: "Whatever m you propose, m - 1 is also an integer and is smaller." },
  { name: "Positive reals", set: "{x ∈ R : x > 0}", lo: 0, hi: 2, dense: true, start: 1, has: false, least: null,
    contains: (x) => x > 0, smaller: (c) => c / 2, why: "Whatever m > 0 you propose, m/2 is still positive and smaller." },
  { name: "Positive rationals", set: "{x ∈ Q : x > 0}", lo: 0, hi: 2, dense: true, start: 1, has: false, least: null,
    contains: (x) => x > 0, smaller: (c) => c / 2, why: "If m is a positive rational, so is m/2, and m/2 < m." },
  { name: "Empty set", set: "∅", lo: 0, hi: 30, dense: false, start: null, has: false, least: null,
    contains: () => false, smaller: () => null, why: "WOP only promises a least element when the set is nonempty." },
];

const fmt = (c) => (c !== 0 && Math.abs(c) < 1 ? `1/${Math.round(1 / c)}` : String(c));

function SetExplorer() {
  const [idx, setIdx] = useState(0);
  const [hist, setHist] = useState([PRESETS[0].start]);
  const [play, setPlay] = useState(false);
  const p = PRESETS[idx];
  const cur = hist[hist.length - 1];
  const next = cur === null || cur === undefined ? null : p.smaller(cur);
  const atLeast = cur !== null && cur !== undefined && next === null;

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => {
      setHist((h) => {
        const c = h[h.length - 1];
        const nx = PRESETS[idx].smaller(c);
        if (nx === null || h.length >= 40) return h;
        return [...h, nx];
      });
    }, 500);
    return () => clearInterval(id);
  }, [play, idx]);

  const pick = (i) => { setIdx(i); setHist([PRESETS[i].start]); setPlay(false); };
  const step = () => { if (next !== null) setHist([...hist, next]); };

  const W = 560;
  const X = (v) => 20 + ((v - p.lo) / (p.hi - p.lo)) * W;
  const ints = [];
  for (let v = p.lo; v <= p.hi; v++) ints.push(v);

  return (
    <Panel>
      <SectionTitle title="Does this set have a least element?">
        Pick a set, then play the "challenge": start at some member and keep asking for a smaller one. If the game ends, we found the least element.
        If it never ends, there is none.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((q, i) => <button key={q.name} onClick={() => pick(i)} className={`${btn} ${i === idx ? btnOn : btnOff}`}>{q.name}</button>)}
      </div>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
        <p className="font-mono text-sm text-[#F4B942] break-words">S = {p.set}</p>
        <svg viewBox="0 0 600 90" className="w-full h-auto mt-2" role="img" aria-label="number line">
          <line x1="20" y1="50" x2="580" y2="50" stroke="#2A2140" strokeWidth="2" />
          {ints.filter((v) => (p.hi - p.lo <= 30 ? true : v % 5 === 0)).map((v) => (
            <g key={v}>
              <line x1={X(v)} y1="46" x2={X(v)} y2="54" stroke="#4B3A7A" />
              {(p.hi - p.lo <= 20 || v % 5 === 0) && <text x={X(v)} y="76" textAnchor="middle" fontSize="10" className="font-mono" fill="#9C93B3">{v}</text>}
            </g>
          ))}
          {p.dense && p.contains(0.001) && <rect x={X(0)} y="46" width={W} height="8" fill="#7C3AED" opacity="0.6" rx="4" />}
          {p.dense && <circle cx={X(0)} cy="50" r="6" fill="#0A0714" stroke="#F87171" strokeWidth="2" />}
          {!p.dense && ints.filter((v) => p.contains(v)).map((v) => <circle key={v} cx={X(v)} cy="50" r="5" fill="#7C3AED" />)}
          {cur !== null && cur !== undefined && cur >= p.lo && cur <= p.hi && (
            <polygon points={`${X(cur)},40 ${X(cur) - 7},24 ${X(cur) + 7},24`} fill={atLeast ? "#4ADE80" : "#F4B942"} />
          )}
        </svg>
        {p.dense && <p className="text-xs text-[#9C93B3]">The open circle at 0 is not in the set. The purple band is the set.</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={step} disabled={next === null} className={`${btn} ${btnOn} disabled:opacity-40`}>Find a smaller element</button>
        <button onClick={() => setPlay((v) => !v)} disabled={next === null} className={`${btn} ${play ? btnOn : btnOff} disabled:opacity-40`}>{play ? "Pause" : "Auto play"}</button>
        <button onClick={() => pick(idx)} className={`${btn} ${btnOff}`}>Reset</button>
      </div>
      <div className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
        <p className="text-xs text-[#9C93B3]">Descending chain of members</p>
        <p className="mt-1 font-mono text-sm text-[#E4D9FF] break-words">
          {hist.length === 0 || hist[0] === null ? "(nothing to pick, the set is empty)" : hist.slice(-12).map(fmt).join(" > ")}
          {hist.length > 12 && <span className="text-[#9C93B3]"> (showing last 12 of {hist.length})</span>}
        </p>
        {p.has && atLeast && <p className="mt-2 text-sm text-[#4ADE80]">Stuck at {fmt(cur)}: nothing smaller is in S. The least element is {p.least}. WOP holds here.</p>}
        {!p.has && cur !== null && cur !== undefined && <p className="mt-2 text-sm text-[#F87171]">Verdict: no least element. {p.why}</p>}
        {!p.has && p.start === null && <p className="mt-2 text-sm text-[#F87171]">Verdict: no least element. {p.why}</p>}
        {p.has && !atLeast && <p className="mt-2 text-sm text-[#9C93B3]">Keep going. A smaller member always exists until we hit the bottom.</p>}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Equivalence with induction                                          */
/* ------------------------------------------------------------------ */

function Equivalence() {
  const [dir, setDir] = useState(0);
  const dirs = [
    {
      title: "Well ordering ⇒ induction",
      lines: [
        "Suppose P(1) is true and P(k) → P(k+1) always holds. We want P(n) for all n ≥ 1.",
        "Assume not. Then the set S of n where P(n) fails is nonempty, so WOP gives it a least element m.",
        "m ≠ 1 because P(1) is true, so m - 1 ≥ 1 and P(m - 1) is true (m is the least failure).",
        "But then the step gives P(m), a contradiction. So S is empty and P(n) holds for all n.",
      ],
    },
    {
      title: "Induction ⇒ well ordering",
      lines: [
        "Let S be a set of nonnegative integers with no least element. We show S is empty.",
        "Let P(n) say: none of 0, 1, ..., n belongs to S. (This is a strong induction statement.)",
        "P(0): if 0 were in S it would be the least element, so 0 is not in S.",
        "If none of 0..k is in S, then k+1 cannot be in S either, otherwise it would be least. So P(k+1) holds.",
        "By induction no n is in S. So S is empty. Hence any nonempty set has a least element.",
      ],
    },
  ];
  return (
    <Panel>
      <SectionTitle title="Well ordering and induction are two faces of one idea">
        We treat them as logically equivalent. Anything you can prove with one you can prove with the other. Pick a direction to see the sketch.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {dirs.map((d, i) => <button key={d.title} onClick={() => setDir(i)} className={`${btn} ${i === dir ? btnOn : btnOff}`}>{d.title}</button>)}
      </div>
      <ol className="mt-4 space-y-2">
        {dirs[dir].lines.map((l, i) => (
          <li key={l} className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3 flex gap-3 text-sm text-[#C9BFE3]">
            <span className="font-mono text-[#B48CFF]">{i + 1}.</span><span>{l}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-[#9C93B3]">
        Induction is "climb the ladder". Well ordering is "if the ladder were broken, look at the lowest broken rung". Same ladder, two ways of looking.
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Minimal counterexample template + hunt                              */
/* ------------------------------------------------------------------ */

function Template() {
  const steps = [
    ["ASSUME the claim fails", "Suppose P(n) is false for at least one n in the domain."],
    ["FORM the set of counterexamples", "S = { n : P(n) is false }. By assumption S is nonempty."],
    ["APPLY WOP", "S has a least element m. This m is the minimal counterexample."],
    ["USE minimality", "Every n < m is NOT a counterexample, so P(n) is true for all smaller n."],
    ["DERIVE a contradiction", "Use the smaller true cases to show P(m) is true (or that a smaller counterexample exists)."],
    ["CONCLUDE", "So S is empty, and P(n) holds for every n."],
  ];
  return (
    <Panel>
      <SectionTitle title="Proof technique: the minimal counterexample">
        Instead of climbing up, we suppose the claim is false and look at the smallest place where it breaks. Then we show that place cannot exist.
      </SectionTitle>
      <ol className="mt-4 space-y-2">
        {steps.map(([name, text], i) => (
          <li key={name} className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3 flex gap-3">
            <span className="font-mono text-[#B48CFF] text-sm">{i + 1}.</span>
            <div className="min-w-0"><p className="font-mono text-sm text-[#F4B942]">{name}</p><p className="text-sm text-[#C9BFE3]">{text}</p></div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

const CLAIMS = [
  { name: "n² - n + 41 is prime", test: (n) => isPrime(n * n - n + 41), note: "Looks true for a long time, but n = 41 gives 41², which is not prime." },
  { name: "2ⁿ > n²", test: (n) => 2 ** n > n * n, note: "Fails for n = 2, 3, 4 and then holds. The least failure is n = 2." },
  { name: "n² + n is even", test: (n) => (n * n + n) % 2 === 0, note: "No counterexample exists, so the set of failures is empty and the claim is true." },
];

function ClaimHunt() {
  const [c, setC] = useState(0);
  const claim = CLAIMS[c];
  const cells = Array.from({ length: 50 }, (_, i) => i + 1);
  const fails = cells.filter((n) => !claim.test(n));
  const least = fails.length ? fails[0] : null;
  return (
    <Panel>
      <SectionTitle title="Hunt for the minimal counterexample">
        Green cells make the claim true, red cells break it. WOP says that if any red cell exists, there is a leftmost one.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {CLAIMS.map((q, i) => <button key={q.name} onClick={() => setC(i)} className={`${btn} font-mono ${i === c ? btnOn : btnOff}`}>{q.name}</button>)}
      </div>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3 flex flex-wrap gap-1">
        {cells.map((n) => {
          const bad = !claim.test(n);
          return <span key={n} className={`w-8 h-8 flex items-center justify-center rounded border font-mono text-xs ${n === least ? "bg-[#F87171] text-[#0A0714] border-[#F4B942] border-2" : bad ? "border-[#F87171] text-[#F87171] bg-[#3A1C22]/50" : "border-[#255239] text-[#4ADE80] bg-[#173626]/40"}`}>{n}</span>;
        })}
      </div>
      <p className="mt-3 text-sm text-[#C9BFE3]">
        {least === null ? "No counterexample among 1 to 50." : <>Minimal counterexample in 1 to 50: <span className="font-mono text-[#F87171]">n = {least}</span>.</>} {claim.note}
      </p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Division algorithm visual                                           */
/* ------------------------------------------------------------------ */

function DivisionViz() {
  const [a, setA] = useState(47);
  const [b, setB] = useState(9);
  const [q, setQ] = useState(0);
  const [play, setPlay] = useState(false);
  const qmax = Math.floor(a / b);

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => {
      setQ((v) => {
        if (v >= qmax) { setPlay(false); return v; }
        return v + 1;
      });
    }, 700);
    return () => clearInterval(id);
  }, [play, qmax]);

  const set = (na, nb) => { setA(na); setB(nb); setQ(0); setPlay(false); };
  const W = 560;
  const X = (v) => 20 + (v / Math.max(a, 1)) * W;
  const values = Array.from({ length: q + 1 }, (_, i) => a - i * b);
  const r = a - qmax * b;

  return (
    <Panel>
      <SectionTitle title="Division by repeated subtraction">
        The set S = {"{ a - bq : q ≥ 0 and a - bq ≥ 0 }"} lives inside the nonnegative integers. WOP says it has a least element, and that least element
        is the remainder. Watch b get subtracted from a until we cannot go on.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#C9BFE3]">
        a <input className={numInput} type="number" min="0" max="99" value={a} onChange={(e) => set(clamp(e.target.value, 0, 99), b)} />
        b <input className={numInput} type="number" min="1" max="30" value={b} onChange={(e) => set(a, clamp(e.target.value, 1, 30))} />
        <button onClick={() => { setQ(0); setPlay(true); }} className={`${btn} ${btnOn}`}>Animate</button>
        <button onClick={() => setQ(Math.min(qmax, q + 1))} className={`${btn} ${btnOff}`}>Subtract b once</button>
      </div>
      <div className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
        <svg viewBox="0 0 600 100" className="w-full h-auto" role="img" aria-label="repeated subtraction on a number line">
          <line x1="20" y1="60" x2="580" y2="60" stroke="#2A2140" strokeWidth="2" />
          {[0, a].map((v) => <text key={v} x={X(v)} y="90" textAnchor="middle" fontSize="11" className="font-mono" fill="#9C93B3">{v}</text>)}
          {values.map((v, i) => i > 0 && (
            <path key={`arc${i}`} d={`M ${X(values[i - 1])} 58 Q ${(X(values[i - 1]) + X(v)) / 2} ${58 - Math.max(14, (b / a) * 280 * 0.4)} ${X(v)} 58`} fill="none" stroke="#F4B942" strokeWidth="1.5" />
          ))}
          {values.map((v, i) => (
            <g key={i}>
              <circle cx={X(v)} cy="60" r="6" fill={i === qmax ? "#4ADE80" : i === q ? "#B48CFF" : "#7C3AED"} />
              {(i === q) && <text x={X(v)} y="42" textAnchor="middle" fontSize="11" className="font-mono" fill="#E4D9FF">{v}</text>}
            </g>
          ))}
        </svg>
        <p className="font-mono text-sm text-[#E4D9FF] break-words">
          q = {q}: a - b·q = {a} - {b}·{q} = <span className="text-[#F4B942]">{a - b * q}</span>
          {q === qmax ? <span className="text-[#4ADE80]">  (next value would be negative, so this is the least element)</span> : ""}
        </p>
        {q === qmax && <p className="mt-1 font-mono text-sm text-[#4ADE80] break-words">{a} = {b}·{qmax} + {r}, with 0 ≤ {r} &lt; {b}</p>}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Infinite descent countdown                                          */
/* ------------------------------------------------------------------ */

function Descent() {
  const [mode, setMode] = useState("int");
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  const START = 12;

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => setStep((s) => (mode === "int" && s >= START - 1 ? s : Math.min(s + 1, 60))), 400);
    return () => clearInterval(id);
  }, [play, mode]);

  const value = mode === "int" ? START - step : 1 / 2 ** step;
  const stopped = mode === "int" && step >= START - 1;
  const shown = mode === "int" ? String(value) : step === 0 ? "1" : `1/2^${step}`;
  const pct = mode === "int" ? (value / START) * 100 : Math.max(1, value * 100);
  const change = (m) => { setMode(m); setStep(0); setPlay(false); };

  return (
    <Panel>
      <SectionTitle title="No infinite descent">
        Start at 12 and keep stepping to a strictly smaller positive integer. How long can you go? Compare with positive reals, where each halving
        gives a new, smaller number forever.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => change("int")} className={`${btn} ${mode === "int" ? btnOn : btnOff}`}>Positive integers</button>
        <button onClick={() => change("real")} className={`${btn} ${mode === "real" ? btnOn : btnOff}`}>Positive reals (halving)</button>
        <button onClick={() => setPlay((p) => !p)} disabled={stopped} className={`${btn} ${play ? btnOn : btnOff} disabled:opacity-40`}>{play ? "Pause" : "Count down"}</button>
        <button onClick={() => setStep((s) => s + 1)} disabled={stopped} className={`${btn} ${btnOff} disabled:opacity-40`}>One step</button>
        <button onClick={() => change(mode)} className={`${btn} ${btnOff}`}>Reset</button>
      </div>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="font-mono text-3xl text-center" style={{ color: stopped ? "#F87171" : "#F4B942" }}>{shown}</p>
        <div className="mt-3 h-4 rounded bg-[#1A1330] overflow-hidden"><div className="h-4 transition-all duration-300" style={{ width: `${pct}%`, background: stopped ? "#F87171" : "#7C3AED" }} /></div>
        <p className="mt-3 text-sm text-[#C9BFE3] text-center">
          {stopped ? "Stuck at 1: there is no smaller positive integer. The descent had to stop." : `Steps taken: ${step}. ${mode === "real" ? "Still going, and it never has to stop." : "Only " + (START - 1 - step) + " steps left, at most."}`}
        </p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Euclid variant                                                      */
/* ------------------------------------------------------------------ */

const GCD_CODE = `def gcd(a, b):
    # variant: b, a nonnegative integer
    while b != 0:
        a, b = b, a % b      # new b = a % b is strictly less than old b
    return a                 # b hit 0, loop ended

# Why does it stop?  a % b < b, so the sequence of b values
# is strictly decreasing AND stays >= 0. By well ordering
# (no infinite descent) it must reach 0.

def broken(n):
    while n != 0:            # n = 5 -> 3 -> 1 -> -1 -> -3 ...
        n -= 2               # leaves the nonnegative integers,
                             # so the argument no longer applies
    return n`;

function euclidSteps(a, b) {
  const rows = [{ a, b }];
  while (b !== 0) { [a, b] = [b, a % b]; rows.push({ a, b }); }
  return rows;
}

function EuclidDemo() {
  const [a, setA] = useState(252);
  const [b, setB] = useState(105);
  const [shown, setShown] = useState(99);
  const [play, setPlay] = useState(false);
  const rows = euclidSteps(a, b);

  useEffect(() => {
    if (!play) return undefined;
    const id = setInterval(() => {
      setShown((s) => {
        if (s >= rows.length - 1) { setPlay(false); return s; }
        return s + 1;
      });
    }, 800);
    return () => clearInterval(id);
  }, [play, rows.length]);

  const change = (na, nb) => { setA(na); setB(nb); setShown(99); setPlay(false); };
  const maxB = Math.max(b, 1);

  return (
    <Panel>
      <SectionTitle title="In code: the termination measure (variant)">
        To show a loop ends, find a quantity that is a nonnegative integer and gets strictly smaller on every pass. Well ordering then rules out an endless loop.
        That quantity is called a variant (or termination measure).
      </SectionTitle>
      <div className="mt-4"><CodeBlock title="python: Euclid's gcd and a loop that never ends" code={GCD_CODE} /></div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#C9BFE3]">
        a <input className={numInput} type="number" min="1" max="9999" value={a} onChange={(e) => change(clamp(e.target.value, 1, 9999), b)} />
        b <input className={numInput} type="number" min="0" max="9999" value={b} onChange={(e) => change(a, clamp(e.target.value, 0, 9999))} />
        <button onClick={() => { setShown(0); setPlay(true); }} className={`${btn} ${btnOn}`}>Run step by step</button>
      </div>
      <div className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3 space-y-1 overflow-x-auto">
        <div className="min-w-[300px] space-y-1">
          {rows.slice(0, shown + 1).map((r, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-xs">
              <span className="w-28 shrink-0 text-[#E4D9FF]">a={r.a} b={r.b}</span>
              <div className="grow h-3 rounded bg-[#1A1330] overflow-hidden"><div className="h-3 bg-[#F4B942]" style={{ width: `${Math.max(1, (r.b / maxB) * 100)}%` }} /></div>
            </div>
          ))}
        </div>
        <p className="font-mono text-sm text-[#C9BFE3] pt-2 break-words">
          variant b: {rows.slice(0, shown + 1).map((r) => r.b).join(" > ")}
          {shown >= rows.length - 1 && <span className="text-[#4ADE80]">  stops at 0, gcd = {rows[rows.length - 1].a}</span>}
        </p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Min-heap                                                            */
/* ------------------------------------------------------------------ */

function siftUp(h, i) {
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (h[p] <= h[i]) break;
    [h[p], h[i]] = [h[i], h[p]];
    i = p;
  }
}
function siftDown(h, i) {
  for (;;) {
    let m = i;
    const l = 2 * i + 1;
    const r = l + 1;
    if (l < h.length && h[l] < h[m]) m = l;
    if (r < h.length && h[r] < h[m]) m = r;
    if (m === i) return;
    [h[m], h[i]] = [h[i], h[m]];
    i = m;
  }
}
function makeHeap(vals) {
  const h = [];
  vals.forEach((v) => { h.push(v); siftUp(h, h.length - 1); });
  return h;
}

function MinHeap() {
  const [state, setState] = useState(() => ({ heap: makeHeap([42, 15, 8, 23, 4, 16, 31]), out: [] }));
  const { heap, out } = state;
  const [val, setVal] = useState(12);
  const [play, setPlay] = useState(false);

  const extractFrom = (s) => {
    if (s.heap.length === 0) return s;
    const h = [...s.heap];
    const top = h[0];
    const last = h.pop();
    if (h.length) { h[0] = last; siftDown(h, 0); }
    return { heap: h, out: [...s.out, top] };
  };
  const extract = () => setState(extractFrom);
  const insert = (v) => {
    setState((s) => {
      if (s.heap.length >= 15) return s;
      const h = [...s.heap, v];
      siftUp(h, h.length - 1);
      return { ...s, heap: h };
    });
  };

  const running = play && heap.length > 0;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setState(extractFrom), 900);
    return () => clearInterval(id);
  }, [running]);

  const pos = (i) => {
    const level = Math.floor(Math.log2(i + 1));
    const within = i + 1 - 2 ** level;
    return { x: ((within + 0.5) / 2 ** level) * 560 + 20, y: level * 52 + 28 };
  };

  return (
    <Panel>
      <SectionTitle title="Real application: a min-heap priority queue">
        Task schedulers, Dijkstra's shortest path, and event simulators all repeat "give me the smallest priority". Priorities are nonnegative integers,
        so a least element always exists, and a heap finds it at the top of the tree.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#C9BFE3]">
        <input className={numInput} type="number" min="0" max="99" value={val} onChange={(e) => setVal(clamp(e.target.value, 0, 99))} />
        <button onClick={() => insert(val)} className={`${btn} ${btnOff}`}>Insert</button>
        <button onClick={extract} disabled={heap.length === 0} className={`${btn} ${btnOn} disabled:opacity-40`}>Extract min</button>
        <button onClick={() => setPlay((p) => !p)} disabled={heap.length === 0} className={`${btn} ${running ? btnOn : btnOff} disabled:opacity-40`}>{running ? "Pause" : "Extract all"}</button>
        <button onClick={() => { setState({ heap: makeHeap([42, 15, 8, 23, 4, 16, 31]), out: [] }); setPlay(false); }} className={`${btn} ${btnOff}`}>Reset</button>
      </div>
      <div className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#211934] p-3">
        <svg viewBox="0 0 600 220" className="w-full h-auto" role="img" aria-label="min heap">
          {heap.map((_, i) => i > 0 && (
            <line key={`e${i}`} x1={pos((i - 1) >> 1).x} y1={pos((i - 1) >> 1).y} x2={pos(i).x} y2={pos(i).y} stroke="#4B3A7A" strokeWidth="2" />
          ))}
          {heap.map((v, i) => (
            <g key={i}>
              <circle cx={pos(i).x} cy={pos(i).y} r="18" fill={i === 0 ? "#7C3AED" : "#1A1330"} stroke={i === 0 ? "#B48CFF" : "#F4B942"} strokeWidth="2" />
              <text x={pos(i).x} y={pos(i).y + 5} textAnchor="middle" fontSize="14" className="font-mono" fill="#E4D9FF">{v}</text>
            </g>
          ))}
          {heap.length === 0 && <text x="300" y="110" textAnchor="middle" fill="#9C93B3" fontSize="14">The queue is empty</text>}
        </svg>
        <p className="font-mono text-sm text-[#E4D9FF] break-words">extracted so far: <span className="text-[#4ADE80]">{out.length ? out.join(", ") : "(none)"}</span></p>
        <p className="text-xs text-[#9C93B3] mt-1">The root (purple) is always the least element. Extracting repeatedly produces a sorted list, because each remaining set still has a least element.</p>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

const QUIZ = [
  { q: "Which set has NO least element?", o: ["{n ∈ N : n is even and n > 10}", "{1/n : n ≥ 1}", "{3, 5, 8}", "{n ∈ N : n² > 100}"], a: 1, why: "1, 1/2, 1/3, ... decreases forever toward 0 without ever reaching a smallest value. The others are sets of nonnegative integers." },
  { q: "In a minimal counterexample proof, what is the first thing you do?", o: ["Prove the base case", "Assume the claim fails and let m be the least failing value", "Assume P(k) and prove P(k+1)", "Pick m = 0"], a: 1, why: "You suppose some counterexample exists, then WOP lets you choose the smallest one." },
  { q: "Why does the loop 'while n > 0: n = n // 2' stop?", o: ["Because n is a float", "Because n is a nonnegative integer that strictly decreases", "Because Python stops after 1000 loops", "It does not stop"], a: 1, why: "n is a variant: nonnegative, integer, strictly smaller each pass. No infinite descent." },
  { q: "Does the set of integers Z satisfy the Well Ordering Principle?", o: ["Yes, every set has a least element", "No, Z itself has no least element", "Yes, because 0 is the smallest", "Only for negative numbers"], a: 1, why: "Z is nonempty but has no least integer. WOP needs a lower bound like 0." },
  { q: "In the division algorithm proof, which set has its least element taken?", o: ["{a + bq}", "{a - bq : q ∈ Z, a - bq ≥ 0}", "{b - aq}", "{q : q > 0}"], a: 1, why: "That set is nonempty and made of nonnegative integers, so it has a least element: the remainder." },
];

function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  if (i >= QUIZ.length) {
    return (
      <Panel>
        <SectionTitle title="Quiz: well ordering" />
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
      <SectionTitle title="Quiz: well ordering">Choose an answer to get instant feedback.</SectionTitle>
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

export default function WellOrderingSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 7 · INDUCTION AND RECURSION</p>
        <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white">The Well Ordering Principle</h2>
        <p className="mt-2 text-[#9C93B3]">
          Every nonempty collection of nonnegative integers has a smallest member. This simple fact powers a whole style of proof, explains why loops
          terminate, and is secretly the same thing as induction.
        </p>
      </div>

      <Statement />
      <SetExplorer />
      <Equivalence />
      <Template />
      <ClaimHunt />

      <WorkedExample
        tag="EXAMPLE 1 · PRIME DIVISOR"
        title="Every integer n ≥ 2 has a prime divisor"
        given={<>
          <p>An integer n ≥ 2. A prime is an integer p ≥ 2 whose only positive divisors are 1 and p.</p>
        </>}
        asked={<p>Prove that every integer n ≥ 2 is divisible by at least one prime.</p>}
        steps={[
          { title: "ASSUME the claim fails", text: "Suppose some integer n ≥ 2 has no prime divisor." },
          { title: "FORM the set", text: "Let S be the set of all integers ≥ 2 with no prime divisor. S is nonempty and made of positive integers." },
          { title: "APPLY WOP", text: "S has a least element m. So m ≥ 2 and m has no prime divisor." },
          { title: "m is not prime", text: "If m were prime, then m divides m, so m would have a prime divisor (itself). Contradiction. So m is composite.", formula: "m = a·b,  1 < a < m" },
          { title: "USE minimality", text: "Since 2 ≤ a < m, a is not in S, so a has a prime divisor p." },
          { title: "DERIVE the contradiction", text: "p divides a and a divides m, so p divides m. But m was supposed to have no prime divisor." },
          { title: "CONCLUDE", text: "So S is empty. Every n ≥ 2 has a prime divisor." },
        ]}
        answer="Every integer n ≥ 2 has a prime divisor."
      />

      <WorkedExample
        tag="EXAMPLE 2 · DIVISION ALGORITHM"
        title="Existence of the quotient and remainder"
        given={<>
          <p>Integers a ≥ 0 and b ≥ 1.</p>
          <p>Define <F>S = {"{ a - bq : q ∈ Z, a - bq ≥ 0 }"}</F>.</p>
        </>}
        asked={<p>Show there are integers q and r with <F>a = bq + r</F> and <F>0 ≤ r &lt; b</F>.</p>}
        steps={[
          { title: "S is nonempty", text: "Take q = 0. Then a - b·0 = a ≥ 0, so a ∈ S." },
          { title: "S consists of nonnegative integers", text: "By definition every element is an integer that is at least 0. So WOP applies." },
          { title: "APPLY WOP", text: "Let r = a - bq be the least element of S, for some integer q.", formula: "a = bq + r,  r ≥ 0" },
          { title: "Show r < b", text: "Suppose r ≥ b. Then r - b = a - b(q + 1) ≥ 0, so r - b is also in S." },
          { title: "DERIVE the contradiction", text: "But r - b < r (since b ≥ 1), which contradicts r being the least element of S. So r < b." },
          { title: "CONCLUDE", text: "We found q and r with a = bq + r and 0 ≤ r < b.", extra: <p className="text-xs text-[#9C93B3]">The visualization below subtracts b over and over to land on exactly this r.</p> },
        ]}
        answer="The remainder is the least nonnegative value of a - bq."
      />
      <DivisionViz />

      <WorkedExample
        tag="EXAMPLE 3 · PRODUCT OF PRIMES"
        title="Every integer n ≥ 2 is a product of primes (minimal counterexample)"
        given={<>
          <p>Integers n ≥ 2. A single prime counts as a product of one prime.</p>
        </>}
        asked={<p>Prove every n ≥ 2 is a product of primes, using the Well Ordering Principle.</p>}
        steps={[
          { title: "ASSUME the claim fails", text: "Let S = { n ≥ 2 : n is not a product of primes }. Suppose S is nonempty." },
          { title: "APPLY WOP", text: "S has a least element m." },
          { title: "m is not prime", text: "A prime is a product of one prime, so m ∉ S if m were prime. Hence m is composite.", formula: "m = a·b,  2 ≤ a, b < m" },
          { title: "USE minimality", text: "Because a and b are smaller than m and at least 2, neither is in S. Both are products of primes." },
          { title: "DERIVE the contradiction", text: "Then m = a·b is a product of primes, so m ∉ S. This contradicts m ∈ S." },
          { title: "CONCLUDE", text: "S is empty, so every n ≥ 2 is a product of primes." },
        ]}
        answer="Every integer n ≥ 2 is a product of primes. Compare this with the strong induction proof from the previous topic: same idea, different packaging."
      />

      <WorkedExample
        tag="EXAMPLE 4 · NO INFINITE DESCENT"
        title="There is no infinite strictly decreasing sequence of positive integers"
        given={<>
          <p>A sequence a1 &gt; a2 &gt; a3 &gt; ... where every term is a positive integer.</p>
        </>}
        asked={<p>Show such a sequence cannot go on forever.</p>}
        steps={[
          { title: "ASSUME the opposite", text: "Suppose there is an infinite sequence a1 > a2 > a3 > ... of positive integers." },
          { title: "FORM the set", text: "Let S = { a1, a2, a3, ... }. S is a nonempty set of positive integers." },
          { title: "APPLY WOP", text: "S has a least element, say a_j." },
          { title: "DERIVE the contradiction", text: "But a_(j+1) is also in S and a_(j+1) < a_j. That contradicts a_j being the least." },
          { title: "CONCLUDE", text: "No infinite descent exists. Any strictly decreasing chain of positive integers must stop.", extra: <p className="text-xs text-[#9C93B3]">This is the reason a loop with a decreasing nonnegative integer variant always terminates.</p> },
        ]}
        answer="Every strictly decreasing sequence of positive integers is finite."
      />
      <Descent />

      <EuclidDemo />
      <MinHeap />
      <Quiz />

      <Reflection
        fact={<p>Zermelo proved in 1904 that every set can be well ordered, but that needs the axiom of choice. Nobody has ever written down an explicit well ordering of the real numbers.</p>}
        question={<p>Does well ordering hold for the set of positive rational numbers? Explain with an example.</p>}
        hint="Hint: look at the subset {1, 1/2, 1/3, 1/4, ...} of the positive rationals."
      />
    </div>
  );
}
