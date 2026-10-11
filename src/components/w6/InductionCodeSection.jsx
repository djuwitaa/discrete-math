import { useEffect, useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";
import { SectionHeader, Btn } from "../shared/SectionHeader";

function LoopInvariant() {
  const arr = [4, 9, 2, 7, 5, 1];
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  useEffect(() => {
    if (!auto) return undefined;
    const t = setInterval(() => setI((x) => { if (x >= arr.length) { setAuto(false); return x; } return x + 1; }), 700);
    return () => clearInterval(t);
  }, [auto, arr.length]);
  const total = arr.slice(0, i).reduce((a, b) => a + b, 0);
  return (
    <Panel>
      <SectionTitle title="Loop invariant = induction on iterations">
        Claim: after i iterations, total equals the sum of the first i items. Basis: i = 0, total = 0 (empty sum). Step: if it holds before an iteration, adding arr[i] keeps it true afterwards.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setI(Math.min(i + 1, arr.length))}>Run one iteration</Btn>
        <Btn onClick={() => { setI(0); setAuto(true); }}>Play</Btn>
        <Btn onClick={() => { setI(0); setAuto(false); }}>Reset</Btn>
      </div>
      <div className="mt-3 flex gap-2 flex-wrap">
        {arr.map((v, k) => <span key={k} className={`w-10 h-10 grid place-items-center rounded-lg font-mono border ${k < i ? "bg-[#4ADE80]/25 border-[#4ADE80] text-white" : k === i ? "border-[#F4B942] text-white" : "border-[#2A2140] text-[#9C93B3]"}`}>{v}</span>)}
      </div>
      <p className="mt-3 font-mono text-sm text-[#F4B942]">i = {i}, total = {total}, invariant: total == sum(arr[:{i}]) is {String(total === arr.slice(0, i).reduce((a, b) => a + b, 0))}</p>
      <div className="mt-3"><CodeBlock title="python" code={`total = 0\nfor i, x in enumerate(arr):\n    # invariant: total == sum(arr[:i])\n    total += x\n# after the loop i = len(arr), so total == sum(arr)`} /></div>
    </Panel>
  );
}

function BinarySearch() {
  const arr = [2, 5, 8, 12, 16, 23, 38, 42, 56, 72, 91];
  const [target, setTarget] = useState(23);
  const [steps, setSteps] = useState(0);
  const trace = [];
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    trace.push({ lo, hi, mid });
    if (arr[mid] === target) break;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  const cur = trace[Math.min(steps, trace.length - 1)];
  return (
    <Panel>
      <SectionTitle title="Binary search and its invariant">
        Invariant: if the target is in the array, it is inside arr[lo..hi]. Each step keeps this true while halving the range, which is why binary search is correct and takes about log₂ n steps.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        {[23, 91, 2, 50].map((t) => <Btn key={t} active={t === target} onClick={() => { setTarget(t); setSteps(0); }}>find {t}</Btn>)}
        <Btn onClick={() => setSteps(Math.min(steps + 1, trace.length - 1))}>Next step</Btn>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {arr.map((v, k) => {
          const inside = k >= cur.lo && k <= cur.hi;
          return <span key={k} className={`w-10 h-10 grid place-items-center rounded font-mono text-sm border ${k === cur.mid ? "border-[#F4B942] bg-[#F4B942]/25 text-white" : inside ? "border-[#7C3AED] text-white" : "border-[#2A2140] text-[#5B5470]"}`}>{v}</span>;
        })}
      </div>
      <p className="mt-2 font-mono text-sm text-[#E4D9FF]">step {Math.min(steps, trace.length - 1) + 1}: lo = {cur.lo}, hi = {cur.hi}, mid = {cur.mid}, arr[mid] = {arr[cur.mid]}</p>
      <p className="font-mono text-xs text-[#9C93B3]">{trace.length} steps in total for {arr.length} elements.</p>
    </Panel>
  );
}

function FactorialStack() {
  const [n, setN] = useState(4);
  const [t, setT] = useState(0);
  const total = 2 * n;
  const frames = [];
  for (let k = 0; k < n; k++) if (t > k) frames.push(`fact(${n - k})`);
  const unwinding = t >= n;
  return (
    <Panel>
      <SectionTitle title="Recursion is induction in code">
        The base case is the basis step. Trusting fact(n - 1) to be correct is the inductive hypothesis. Multiplying by n is the inductive step.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setN(n === 6 ? 2 : n + 1)}>n = {n}</Btn>
        <Btn onClick={() => setT(Math.min(t + 1, total))}>Step</Btn>
        <Btn onClick={() => setT(0)}>Reset</Btn>
      </div>
      <div className="mt-3 flex flex-col-reverse gap-1 max-w-xs min-h-24">
        {frames.slice(0, unwinding ? Math.max(0, 2 * n - t) : frames.length).map((f, i) => (
          <div key={i} className="rounded-lg border border-[#7C3AED] bg-[#7C3AED]/20 px-3 py-1 font-mono text-sm text-white">{f}</div>
        ))}
      </div>
      <p className="mt-2 text-xs text-[#9C93B3]">{t === 0 ? "Press Step to call fact." : unwinding ? "Base case reached, now returning and multiplying." : "Calls pile up on the stack."}</p>
      <div className="mt-3"><CodeBlock title="python" code={`def fact(n):\n    if n == 0:       # basis\n        return 1\n    return n * fact(n - 1)   # step uses the hypothesis`} /></div>
    </Panel>
  );
}

function Hanoi() {
  const [n, setN] = useState(3);
  const [pegs, setPegs] = useState([[3, 2, 1], [], []]);
  const [sel, setSel] = useState(null);
  const [moves, setMoves] = useState(0);
  const reset = (k) => { setN(k); setPegs([Array.from({ length: k }, (_, i) => k - i), [], []]); setSel(null); setMoves(0); };
  const click = (p) => {
    if (sel === null) { if (pegs[p].length) setSel(p); return; }
    if (sel !== p) {
      const disk = pegs[sel][pegs[sel].length - 1];
      const top = pegs[p][pegs[p].length - 1];
      if (!top || disk < top) {
        const next = pegs.map((x) => [...x]);
        next[sel].pop();
        next[p].push(disk);
        setPegs(next);
        setMoves(moves + 1);
      }
    }
    setSel(null);
  };
  const won = pegs[2].length === n;
  return (
    <Panel>
      <SectionTitle title="Play Tower of Hanoi">
        Move all disks to the right peg. A bigger disk never sits on a smaller one. The minimum number of moves is 2ⁿ - 1, and induction proves it: move n - 1 disks away, move the big one, move n - 1 disks back, so H(n) = 2H(n - 1) + 1.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">{[2, 3, 4, 5].map((k) => <Btn key={k} active={n === k} onClick={() => reset(k)}>{k} disks</Btn>)}</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {pegs.map((p, i) => (
          <button key={i} onClick={() => click(i)} className={`h-44 rounded-xl border flex flex-col-reverse items-center justify-start pb-2 gap-1 touch-manipulation ${sel === i ? "border-[#F4B942]" : "border-[#2A2140]"} bg-[#0A0714]`}>
            {p.map((d) => <div key={d} className="h-5 rounded" style={{ width: `${25 + d * 14}%`, background: ["", "#B48CFF", "#F4B942", "#4ADE80", "#F87171", "#38BDF8"][d] }} />)}
          </button>
        ))}
      </div>
      <p className="mt-2 font-mono text-sm text-[#F4B942]">moves: {moves} (minimum {2 ** n - 1}) {won ? (moves === 2 ** n - 1 ? "· optimal!" : "· solved") : ""}</p>
    </Panel>
  );
}

function RealApp() {
  const [k, setK] = useState(0);
  const chain = [
    ["Base", "Account balance starts at 0, which is valid."],
    ["Step", "Each deposit adds a positive amount, and a withdrawal is only allowed if balance ≥ amount."],
    ["Invariant", "balance ≥ 0 stays true after one operation, so after any number of operations."],
    ["Result", "The bank never shows a negative balance, proven for every possible sequence."],
  ];
  return (
    <Panel>
      <SectionTitle title="Real application: a bank account invariant">
        Systems engineers use induction to prove that a rule holds after any number of operations, not just in the tests that were written.
      </SectionTitle>
      <div className="mt-3 flex gap-2"><Btn onClick={() => setK(Math.min(k + 1, chain.length))}>Next</Btn><Btn onClick={() => setK(0)}>Reset</Btn></div>
      <div className="mt-3 space-y-2">
        {chain.slice(0, k).map(([h, t]) => (
          <div key={h} className="rounded-xl border border-[#4ADE80]/50 bg-[#4ADE80]/10 p-3">
            <p className="font-heading text-sm text-[#4ADE80]">{h}</p>
            <p className="text-sm text-[#E4D9FF]">{t}</p>
          </div>
        ))}
      </div>
      <div className="mt-3"><CodeBlock title="python" code={`class Account:\n    def __init__(self):\n        self.balance = 0          # basis: invariant holds\n\n    def deposit(self, x):\n        assert x > 0\n        self.balance += x         # step: still >= 0\n\n    def withdraw(self, x):\n        if 0 < x <= self.balance: # guard keeps the invariant\n            self.balance -= x`} /></div>
    </Panel>
  );
}

export default function InductionCodeSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 6 · MATHEMATICAL INDUCTION" title="Induction in Code">
        Loops, recursion, algorithms and games are all places where induction shows up. Watch it run.
      </SectionHeader>
      <LoopInvariant />
      <FactorialStack />
      <BinarySearch />
      <Hanoi />
      <RealApp />
      <Reflection
        fact={<p>Formal verification tools used on aircraft software, CPU designs and cryptographic libraries rely on induction to prove that a property holds for every possible run of a program.</p>}
        question={<p>A loop runs 1,000,000 times and you only tested 10 inputs. What would you need to show to be sure it is correct for all iterations?</p>}
      />
    </div>
  );
}
