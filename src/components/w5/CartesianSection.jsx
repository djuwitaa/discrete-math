import { useEffect, useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

function Chips({ items, onRemove, color }) {
  return (
    <div className="flex flex-wrap gap-2 min-h-9">
      {items.map((x) => (
        <button key={x} onClick={() => onRemove(x)} className="px-3 py-1 rounded-full border font-mono text-sm text-white touch-manipulation" style={{ borderColor: color, background: `${color}33` }} title="Tap to remove">{x}</button>
      ))}
    </div>
  );
}

const FILTERS = [
  { id: "all", label: "no filter", test: () => true },
  { id: "diff", label: "first is not second", test: (a, b) => String(a) !== String(b) },
  { id: "lt", label: "first < second (numbers)", test: (a, b) => Number(a) < Number(b) },
  { id: "even", label: "first + second is even", test: (a, b) => (Number(a) + Number(b)) % 2 === 0 },
];

function ProductLab() {
  const [A, setA] = useState(["1", "2", "3"]);
  const [B, setB] = useState(["1", "2", "3"]);
  const [addA, setAddA] = useState("");
  const [addB, setAddB] = useState("");
  const [flip, setFlip] = useState(false);
  const [filter, setFilter] = useState(FILTERS[0]);

  const left = flip ? B : A;
  const right = flip ? A : B;
  const pairs = left.length * right.length;
  const kept = left.reduce((n, a) => n + right.filter((b) => filter.test(a, b)).length, 0);

  const add = (list, setList, v, clear) => {
    const t = v.trim();
    if (t && !list.includes(t) && list.length < 6) setList([...list, t]);
    clear("");
  };

  return (
    <Panel>
      <SectionTitle title="Cartesian product lab">
        A × B is the set of all ordered pairs (a, b) with a from A and b from B. Order matters: (1, 2) is different from (2, 1).
      </SectionTitle>
      <div className="mt-3 grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#B48CFF]">Set A (tap an element to remove)</p>
          <Chips items={A} onRemove={(x) => setA(A.filter((y) => y !== x))} color="#7C3AED" />
          <div className="mt-2 flex gap-2">
            <input value={addA} onChange={(e) => setAddA(e.target.value)} className="w-20 rounded-lg bg-[#0A0714] border border-[#2A2140] px-2 py-1 font-mono text-white" />
            <Btn onClick={() => add(A, setA, addA, setAddA)}>add</Btn>
          </div>
        </div>
        <div>
          <p className="text-xs text-[#F4B942]">Set B</p>
          <Chips items={B} onRemove={(x) => setB(B.filter((y) => y !== x))} color="#F4B942" />
          <div className="mt-2 flex gap-2">
            <input value={addB} onChange={(e) => setAddB(e.target.value)} className="w-20 rounded-lg bg-[#0A0714] border border-[#2A2140] px-2 py-1 font-mono text-white" />
            <Btn onClick={() => add(B, setB, addB, setAddB)}>add</Btn>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <Btn active={!flip} onClick={() => setFlip(false)}>A × B</Btn>
        <Btn active={flip} onClick={() => setFlip(true)}>B × A</Btn>
        <span className="text-xs text-[#9C93B3]">Compare them: same size, different pairs.</span>
      </div>
      <p className="mt-3 font-mono text-[#F4B942] text-sm">|{flip ? "B × A" : "A × B"}| = {left.length} · {right.length} = {pairs}</p>
      <div className="mt-2 overflow-x-auto">
        <table className="font-mono text-sm border-collapse">
          <thead>
            <tr><th className="p-2 text-[#9C93B3]">{flip ? "B \\ A" : "A \\ B"}</th>{right.map((b) => <th key={b} className="p-2 text-[#F4B942]">{b}</th>)}</tr>
          </thead>
          <tbody>
            {left.map((a) => (
              <tr key={a}>
                <th className="p-2 text-[#B48CFF]">{a}</th>
                {right.map((b) => {
                  const ok = filter.test(flip ? b : a, flip ? a : b);
                  return (
                    <td key={b} className={`p-2 border border-[#2A2140] text-center ${ok ? "bg-[#7C3AED]/25 text-white" : "text-[#5B5470]"}`}>({a},{b})</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <p className="text-xs text-[#9C93B3] mb-1">A relation is just a subset of the product. Pick a rule (applied to the A element then the B element) and the chosen pairs light up:</p>
        <div className="flex flex-wrap gap-2">{FILTERS.map((f) => <Btn key={f.id} active={filter.id === f.id} onClick={() => setFilter(f)}>{f.label}</Btn>)}</div>
        <p className="mt-2 font-mono text-sm text-[#4ADE80]">{kept} of {pairs} pairs are in the relation.</p>
      </div>
    </Panel>
  );
}

const USERS = [["u1", "Ayu"], ["u2", "Bimo"], ["u3", "Citra"]];
const ORDERS = [["o1", "u1", "Book"], ["o2", "u2", "Pen"], ["o3", "u1", "Lamp"], ["o4", "u3", "Bag"]];

function CrossJoinDemo() {
  const [step, setStep] = useState(0);
  const [where, setWhere] = useState(false);
  const [playing, setPlaying] = useState(false);
  const rows = [];
  USERS.forEach((u) => ORDERS.forEach((o) => rows.push({ u, o, match: o[1] === u[0] })));
  const total = rows.length;

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= total) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 350);
    return () => clearInterval(t);
  }, [playing, total]);

  const visible = rows.slice(0, step).filter((r) => !where || r.match);

  return (
    <Panel>
      <SectionTitle title="SQL CROSS JOIN is a Cartesian product">
        Every row of users is paired with every row of orders. A WHERE clause keeps only the pairs that satisfy a condition.
      </SectionTitle>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <CodeBlock title="sql" code={`SELECT *\nFROM users CROSS JOIN orders\n${where ? "WHERE orders.user_id = users.id" : "-- no WHERE: all pairs"};`} />
        <CodeBlock title="python" code={`from itertools import product\nrows = product(users, orders)\nif where:\n    rows = [r for r in rows\n            if r[1].user_id == r[0].id]`} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => { setStep(0); setPlaying(true); }}>Play join</Btn>
        <Btn onClick={() => setStep(Math.min(step + 1, total))}>Step</Btn>
        <Btn onClick={() => { setStep(total); setPlaying(false); }}>Show all</Btn>
        <Btn onClick={() => { setStep(0); setPlaying(false); }}>Reset</Btn>
        <Btn active={where} onClick={() => setWhere(!where)}>WHERE user_id = id</Btn>
      </div>
      <p className="mt-2 font-mono text-sm text-[#F4B942]">{USERS.length} users × {ORDERS.length} orders = {total} rows. Showing {visible.length}.</p>
      <div className="mt-2 overflow-x-auto max-h-72 overflow-y-auto">
        <table className="w-full font-mono text-xs sm:text-sm">
          <thead className="text-[#B48CFF] text-left"><tr><th className="p-1">user</th><th className="p-1">order</th><th className="p-1">item</th></tr></thead>
          <tbody>
            {visible.map((r, i) => (
              <tr key={i} className={`border-t border-[#211934] ${r.match ? "text-[#4ADE80]" : "text-[#E4D9FF]"}`}>
                <td className="p-1">{r.u[1]}</td><td className="p-1">{r.o[0]}</td><td className="p-1">{r.o[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-[#9C93B3]">Green rows are the ones where the order really belongs to that user. That is the relation hiding inside the product.</p>
    </Panel>
  );
}

export default function CartesianSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 5 · CARTESIAN PRODUCTS" title="Cartesian Products">
        Build every possible pair from two sets, see how fast the count grows, and meet relations as subsets of a product.
      </SectionHeader>
      <ProductLab />
      <CrossJoinDemo />

      <WorkedExample
        tag="WORKED EXAMPLE 1"
        title="Compute A × B"
        given={[<p key="g">A = {"{1, 2}"}, B = {"{a, b, c}"}.</p>]}
        asked={[<p key="a">List A × B and find its size.</p>]}
        steps={[
          { title: "Pair each element of A with every element of B", formula: "1 with a, b, c:  (1,a) (1,b) (1,c)\n2 with a, b, c:  (2,a) (2,b) (2,c)" },
          { title: "Count", text: "|A| · |B| = 2 · 3 = 6 pairs." },
        ]}
        answer="A × B = {(1,a), (1,b), (1,c), (2,a), (2,b), (2,c)}, |A × B| = 6."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 2"
        title="A × B is not B × A"
        given={[<p key="g">A = {"{1, 2}"}, B = {"{a}"}.</p>]}
        asked={[<p key="a">Show that A × B ≠ B × A.</p>]}
        steps={[
          { title: "Compute both", formula: "A × B = {(1,a), (2,a)}\nB × A = {(a,1), (a,2)}" },
          { title: "Compare", text: "(1, a) is in A × B but not in B × A, since in B × A the first entry must come from B." },
        ]}
        answer="The sets differ, so the product is not commutative. They are equal only when A = B or one of them is empty."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 3"
        title="Three sets"
        given={[<p key="g">|A| = 4, |B| = 5, |C| = 3.</p>]}
        asked={[<p key="a">Find |A × B × C|, the number of ordered triples (a, b, c).</p>]}
        steps={[
          { title: "Use the product rule for each coordinate", formula: "4 · 5 · 3 = 60" },
        ]}
        answer="60 triples."
      />

      <Quiz
        questions={[
          { q: "|A| = 7 and |B| = 0. What is |A × B|?", options: ["7", "0", "1"], answer: 1, why: "There is no element of B to pair with, so there are no pairs." },
          { q: "Is (2, 5) the same as (5, 2)?", options: ["Yes", "No"], answer: 1, why: "Ordered pairs care about position." },
          { q: "A relation from A to B is:", options: ["Any subset of A × B", "Always all of A × B", "A function"], answer: 0, why: "Functions are special relations. A relation can be any subset of the pairs." },
        ]}
      />
      <Reflection
        fact={<p>A SQL CROSS JOIN computes the literal Cartesian product of two tables: every row of one paired with every row of the other. Next week's relations are formally defined as subsets of a Cartesian product. A relation is just some of the pairs, not all of them.</p>}
        question={<p>If |A| = 1,000 and |B| = 1,000, a CROSS JOIN of two such tables produces 1,000,000 rows. What does this tell you about using CROSS JOIN carelessly on large tables?</p>}
        hint="Discuss in pairs (2 minutes). Think about what a WHERE clause is really doing to that product."
      />
    </div>
  );
}
