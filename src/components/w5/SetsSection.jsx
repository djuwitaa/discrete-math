import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

const NUMBER_SETS = [
  { sym: "N", name: "Natural numbers", desc: "0, 1, 2, 3, ... (some books start at 1)", color: "#F4B942" },
  { sym: "Z", name: "Integers", desc: "..., -2, -1, 0, 1, 2, ...", color: "#4ADE80" },
  { sym: "Q", name: "Rational numbers", desc: "p/q with p, q integers and q not 0", color: "#60A5FA" },
  { sym: "R", name: "Real numbers", desc: "Every point on the number line", color: "#B48CFF" },
  { sym: "C", name: "Complex numbers", desc: "a + bi where i squared is -1", color: "#F87171" },
];

// Each probe lists which sets contain it.
const PROBES = [
  { label: "7", sets: ["N", "Z", "Q", "R", "C"] },
  { label: "0", sets: ["N", "Z", "Q", "R", "C"] },
  { label: "-3", sets: ["Z", "Q", "R", "C"] },
  { label: "1/2", sets: ["Q", "R", "C"] },
  { label: "-0.75", sets: ["Q", "R", "C"] },
  { label: "√2", sets: ["R", "C"] },
  { label: "π", sets: ["R", "C"] },
  { label: "3 + 2i", sets: ["C"] },
];

function NumberSetExplorer() {
  const [probe, setProbe] = useState(PROBES[3]);
  const radii = [140, 112, 86, 60, 34];
  const order = ["C", "R", "Q", "Z", "N"];

  return (
    <Panel>
      <SectionTitle title="Special number sets: pick a number and see where it lives">
        The sets are nested like Russian dolls: N is inside Z, Z is inside Q, Q is inside R, and R is inside C.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {PROBES.map((p) => (
          <Btn key={p.label} active={probe.label === p.label} onClick={() => setProbe(p)} className="font-mono">{p.label}</Btn>
        ))}
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4 items-center">
        <svg viewBox="0 0 300 300" className="w-full h-auto max-w-sm mx-auto">
          {order.map((sym, i) => {
            const info = NUMBER_SETS.find((s) => s.sym === sym);
            const inside = probe.sets.includes(sym);
            return (
              <g key={sym}>
                <circle cx="150" cy="150" r={radii[i]} fill={inside ? info.color : "#130E20"} fillOpacity={inside ? 0.28 : 0.6} stroke={info.color} strokeWidth={inside ? 2.5 : 1} style={{ transition: "all 0.4s" }} />
                <text x="150" y={150 - radii[i] + 16} textAnchor="middle" fill={info.color} fontSize="14" fontFamily="Consolas, monospace" fontWeight="bold">{sym}</text>
              </g>
            );
          })}
          <text x="150" y="155" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="Consolas, monospace">{probe.label}</text>
        </svg>
        <div className="space-y-2">
          {NUMBER_SETS.map((s) => {
            const inside = probe.sets.includes(s.sym);
            return (
              <div key={s.sym} className={`rounded-lg border p-3 text-sm ${inside ? "border-[#4ADE80]/60 bg-[#173626]/30" : "border-[#2A2140] opacity-60"}`}>
                <span className="font-mono font-semibold" style={{ color: s.color }}>{s.sym}</span>
                <span className="text-white"> {s.name}</span>
                <span className="block text-xs text-[#9C93B3]">{s.desc}</span>
                <span className="block text-xs font-mono mt-1">{probe.label} {inside ? "∈" : "∉"} {s.sym}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-sm text-[#9C93B3]">Also common: Z+ (positive integers 1, 2, 3, ...), Q+, R+, and the notation N ⊂ Z ⊂ Q ⊂ R ⊂ C.</p>
    </Panel>
  );
}

function Basics() {
  const rows = [
    ["Roster notation", "A = {1, 2, 3}", "List the elements. Order and repeats do not matter."],
    ["Set-builder notation", "B = { x ∈ Z | x is even and 0 < x < 10 }", "Describe the rule. Read the bar as 'such that'."],
    ["Membership", "2 ∈ A,  5 ∉ A", "∈ means 'is an element of'."],
    ["Empty set", "∅ = { }", "The set with no elements. |∅| = 0."],
    ["Universal set", "U", "Everything we are talking about in this problem."],
    ["Cardinality", "|A| = 3", "The number of elements in a finite set."],
    ["Equality", "{1, 2, 3} = {3, 2, 1, 1}", "Same elements means the same set."],
    ["Subset", "A ⊆ B", "Every element of A is also in B."],
    ["Proper subset", "A ⊂ B", "A ⊆ B and A ≠ B."],
  ];
  return (
    <Panel>
      <SectionTitle title="What is a set?">
        A set is an unordered collection of distinct objects, called elements. Sets are the basic building block of everything else this week.
      </SectionTitle>
      <div className="mt-3 overflow-x-auto rounded-xl border border-[#211934]">
        <table className="w-full text-sm">
          <thead className="bg-[#1A1330] text-[#F4B942] text-left">
            <tr><th className="p-2">Idea</th><th className="p-2">Notation</th><th className="p-2">Meaning</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-[#2A2140] align-top">
                <td className="p-2 text-white whitespace-nowrap">{r[0]}</td>
                <td className="p-2 font-mono text-[#F4B942]">{r[1]}</td>
                <td className="p-2 text-[#C9BFE3]">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function subsetsOf(items) {
  const out = [];
  for (let mask = 0; mask < 1 << items.length; mask++) {
    out.push(items.filter((_, i) => mask & (1 << i)));
  }
  return out;
}

function PowerSetLab() {
  const pool = ["a", "b", "c", "d", "e"];
  const [chosen, setChosen] = useState(["a", "b", "c"]);
  const [size, setSize] = useState(null);

  function toggle(x) {
    setSize(null);
    setChosen((cur) => (cur.includes(x) ? cur.filter((y) => y !== x) : pool.filter((y) => cur.includes(y) || y === x)));
  }

  const all = subsetsOf(chosen);
  const shown = size === null ? all : all.filter((s) => s.length === size);

  return (
    <Panel>
      <SectionTitle title="Power set lab">
        The power set P(A) is the set of all subsets of A, including ∅ and A itself. Tap elements to add or remove them and watch the count double.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map((x) => <Btn key={x} active={chosen.includes(x)} onClick={() => toggle(x)} className="font-mono">{x}</Btn>)}
      </div>
      <p className="mt-3 font-mono text-sm text-[#F4B942]">|A| = {chosen.length}, so |P(A)| = 2^{chosen.length} = {all.length}</p>
      <div className="mt-2 flex flex-wrap gap-2 items-center text-sm text-[#9C93B3]">
        Filter by size:
        <Btn active={size === null} onClick={() => setSize(null)}>all</Btn>
        {Array.from({ length: chosen.length + 1 }, (_, k) => <Btn key={k} active={size === k} onClick={() => setSize(k)}>{k}</Btn>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {shown.map((s, i) => (
          <span key={i} className="px-2 py-1 rounded-md bg-[#0F0A1A] border border-[#2A2140] font-mono text-sm text-[#E4D9FF]">{s.length ? `{${s.join(", ")}}` : "∅"}</span>
        ))}
      </div>
      <p className="mt-3 text-sm text-[#9C93B3]">Why 2^n? Each element has two choices: in the subset or out. That is the product rule from later in this week.</p>
    </Panel>
  );
}

function PythonSetDemo() {
  const [items, setItems] = useState([3, 1, 2]);
  const [text, setText] = useState("2");
  const [log, setLog] = useState("Try adding a number that is already in the set.");

  function add() {
    const n = Number(text);
    if (Number.isNaN(n)) return;
    if (items.includes(n)) setLog(`s.add(${n}) changed nothing. Sets drop duplicates.`);
    else {
      setItems([...items, n]);
      setLog(`s.add(${n}) added a new element.`);
    }
  }

  return (
    <Panel>
      <SectionTitle title="Sets in code: Python set">Python's set follows the math rules: no duplicates, no order, fast membership tests.</SectionTitle>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <CodeBlock title="python" code={`s = {3, 1, 2}\ns.add(2)        # no change\nprint(2 in s)   # True  (membership)\nprint(len(s))   # cardinality\nA = frozenset({1, 2})  # immutable set\nprint(A <= s)   # subset test`} />
        <div className="rounded-xl border border-[#2A2140] bg-[#0F0A1A] p-3">
          <p className="text-xs text-[#9C93B3]">Live set s</p>
          <div className="mt-2 flex flex-wrap gap-2 min-h-10">
            {items.map((n) => <span key={n} className="px-3 py-1.5 rounded-full bg-[#7C3AED]/30 border border-[#7C3AED] font-mono text-white">{n}</span>)}
          </div>
          <p className="mt-2 font-mono text-sm text-[#F4B942]">len(s) = {items.length}</p>
          <div className="mt-3 flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} className="w-20 rounded-lg bg-[#0A0714] border border-[#2A2140] px-2 py-1 font-mono text-white" />
            <Btn onClick={add}>s.add(x)</Btn>
            <Btn onClick={() => { setItems([3, 1, 2]); setLog("Reset."); }}>reset</Btn>
          </div>
          <p className="mt-2 text-sm text-[#C9BFE3]">{log}</p>
          <p className="mt-2 font-mono text-xs text-[#9C93B3]">{`${Number(text)} in s -> ${items.includes(Number(text))}`}</p>
        </div>
      </div>
    </Panel>
  );
}

export default function SetsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 5 · SETS" title="Sets and Number Sets">
        Sets, special number sets, subsets and power sets, with live demos and the same ideas in code.
      </SectionHeader>
      <Basics />
      <NumberSetExplorer />
      <PowerSetLab />
      <PythonSetDemo />

      <WorkedExample
        tag="WORKED EXAMPLE 1"
        title="List all subsets of {a, b, c}"
        given={[<p key="g">A = {"{a, b, c}"}</p>]}
        asked={[<p key="a">All subsets of A, and how many there are.</p>]}
        steps={[
          { title: "Count first", text: "|A| = 3, so we expect 2^3 = 8 subsets." },
          { title: "Subsets of size 0 and 1", formula: "∅,  {a},  {b},  {c}" },
          { title: "Subsets of size 2", formula: "{a, b},  {a, c},  {b, c}" },
          { title: "Subset of size 3", formula: "{a, b, c}" },
          { title: "Check the count", text: "1 + 3 + 3 + 1 = 8. It matches 2^3." },
        ]}
        answer="P(A) has 8 elements: ∅, {a}, {b}, {c}, {a,b}, {a,c}, {b,c}, {a,b,c}."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 2"
        title="True or false? Elements versus subsets"
        given={[<p key="g">S = {"{1, 2, {3}}"}</p>]}
        asked={[<p key="a">Decide: 1 ∈ S, {"{1}"} ∈ S, {"{1}"} ⊆ S, {"{3}"} ∈ S, 3 ∈ S.</p>]}
        steps={[
          { title: "List the elements of S", text: "S has exactly three elements: the number 1, the number 2, and the set {3}." },
          { title: "1 ∈ S", text: "True. The number 1 is listed.", formula: "1 ∈ S : T" },
          { title: "{1} ∈ S", text: "False. The set {1} is not one of the three elements.", formula: "{1} ∈ S : F" },
          { title: "{1} ⊆ S", text: "True. Its only element, 1, is in S.", formula: "{1} ⊆ S : T" },
          { title: "{3} ∈ S", text: "True. {3} is the third element.", formula: "{3} ∈ S : T" },
          { title: "3 ∈ S", text: "False. The number 3 is inside the set {3}, but it is not itself an element of S.", formula: "3 ∈ S : F" },
        ]}
        answer="T, F, T, T, F. Always ask: is it listed as an element, or is it only inside an element?"
      />

      <Quiz
        questions={[
          { q: "Which set is NOT a subset of Z?", options: ["N", "Q", "{-1, 0, 1}"], answer: 1, why: "Q contains fractions like 1/2, which are not integers." },
          { q: "What is |P({1, 2, 3, 4})|?", options: ["8", "16", "4"], answer: 1, why: "2^4 = 16." },
          { q: "Is ∅ a subset of every set?", options: ["Yes", "No"], answer: 0, why: "Every element of ∅ (there are none) is in the other set, so the condition holds vacuously." },
          { q: "{1, 2, 2, 3} has cardinality:", options: ["4", "3", "2"], answer: 1, why: "Duplicates are ignored, so the set is {1, 2, 3}." },
        ]}
      />

      <Reflection
        fact={<p>Python's built-in set and frozenset types are direct implementations of mathematical sets. Duplicates are removed automatically and membership tests (x in my_set) run in average O(1) time using hashing.</p>}
        question={<p>If |A| = 10, how many subsets does A have? How many of those subsets have EXACTLY 3 elements?</p>}
        hint="Hint: the second question needs a tool from a later week: combinations."
      />
    </div>
  );
}
