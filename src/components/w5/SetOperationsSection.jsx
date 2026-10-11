import { useEffect, useRef, useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

const W = 300;
const H = 200;
const TWO = { A: [110, 100, 68], B: [190, 100, 68] };
const THREE = { A: [122, 80, 58], B: [178, 80, 58], C: [150, 128, 58] };

const inCircle = (c, x, y) => (x - c[0]) ** 2 + (y - c[1]) ** 2 <= c[2] ** 2;

// Draws a Venn diagram. `pred(a, b, c)` decides which regions are shaded.
function Venn({ three, pred, color = "#7C3AED", onRegion }) {
  const ref = useRef(null);
  const g = three ? THREE : TWO;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(W, H);
    const hex = color.replace("#", "");
    const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const a = inCircle(g.A, x, y);
        const b = inCircle(g.B, x, y);
        const c = three ? inCircle(g.C, x, y) : false;
        const on = pred(a, b, c);
        const k = (y * W + x) * 4;
        img.data[k] = on ? rgb[0] : 19;
        img.data[k + 1] = on ? rgb[1] : 14;
        img.data[k + 2] = on ? rgb[2] : 32;
        img.data[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#E4D9FF";
    ctx.fillStyle = "#E4D9FF";
    ctx.font = "bold 14px Consolas, monospace";
    Object.entries(g).forEach(([name, c]) => {
      ctx.beginPath();
      ctx.arc(c[0], c[1], c[2], 0, Math.PI * 2);
      ctx.stroke();
      const dx = name === "A" ? -c[2] + 4 : name === "B" ? c[2] - 16 : -4;
      const dy = name === "C" ? c[2] - 6 : -c[2] + 16;
      ctx.fillText(name, c[0] + dx, c[1] + dy);
    });
    ctx.strokeRect(1, 1, W - 2, H - 2);
    ctx.fillText("U", 8, H - 8);
  }, [pred, three, color, g]);

  function handle(e) {
    if (!onRegion) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    onRegion(inCircle(g.A, x, y), inCircle(g.B, x, y), three ? inCircle(g.C, x, y) : false);
  }

  return <canvas ref={ref} width={W} height={H} onClick={handle} className="w-full h-auto rounded-lg border border-[#2A2140] touch-manipulation" style={{ maxWidth: 360 }} />;
}

const OPS = [
  { id: "union", label: "A ∪ B", note: "Union: in A or in B (or both).", pred: (a, b) => a || b },
  { id: "inter", label: "A ∩ B", note: "Intersection: in both A and B.", pred: (a, b) => a && b },
  { id: "diff", label: "A − B", note: "Difference: in A but not in B.", pred: (a, b) => a && !b },
  { id: "diffba", label: "B − A", note: "Difference the other way. Order matters.", pred: (a, b) => b && !a },
  { id: "comp", label: "A′ (complement)", note: "Everything in U that is not in A.", pred: (a) => !a },
  { id: "sym", label: "A ⊕ B", note: "Symmetric difference: in exactly one of A, B.", pred: (a, b) => a !== b },
  { id: "disj", label: "A ∩ B = ∅ ?", note: "Disjoint sets share no region. Here the overlap is shaded so you can see it.", pred: (a, b) => a && b },
];

function OperationExplorer() {
  const [op, setOp] = useState(OPS[0]);
  const [three, setThree] = useState(false);
  const [picked, setPicked] = useState(null);

  const pred = three ? (a, b, c) => (op.id === "union" ? a || b || c : op.id === "inter" ? a && b && c : op.pred(a, b)) : op.pred;

  return (
    <Panel>
      <SectionTitle title="Venn diagram explorer">Pick an operation and the matching region lights up. Tap any region to see which sets it belongs to.</SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {OPS.map((o) => <Btn key={o.id} active={op.id === o.id} onClick={() => setOp(o)} className="font-mono">{o.label}</Btn>)}
      </div>
      <div className="mt-2 flex gap-2 items-center text-sm text-[#9C93B3]">
        Diagram:
        <Btn active={!three} onClick={() => setThree(false)}>2 sets</Btn>
        <Btn active={three} onClick={() => setThree(true)}>3 sets (union / intersection)</Btn>
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-4 items-center">
        <Venn three={three} pred={pred} onRegion={(a, b, c) => setPicked({ a, b, c })} />
        <div className="text-sm space-y-2">
          <p className="text-white font-mono text-lg">{three && (op.id === "union" || op.id === "inter") ? (op.id === "union" ? "A ∪ B ∪ C" : "A ∩ B ∩ C") : op.label}</p>
          <p className="text-[#C9BFE3]">{op.note}</p>
          {picked && (
            <p className="font-mono text-[#F4B942]">
              You tapped a point with: A={String(picked.a)} B={String(picked.b)}{three ? ` C=${String(picked.c)}` : ""}
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

const toSet = (text) => new Set(text.split(",").map((s) => s.trim()).filter(Boolean));
const show = (s) => `{${[...s].join(", ")}}`;

function ElementLab() {
  const [aText, setA] = useState("1, 2, 3, 4");
  const [bText, setB] = useState("3, 4, 5");
  const [uText, setU] = useState("1, 2, 3, 4, 5, 6, 7");
  const A = toSet(aText);
  const B = toSet(bText);
  const U = toSet(uText);
  const union = new Set([...A, ...B]);
  const inter = new Set([...A].filter((x) => B.has(x)));
  const diff = new Set([...A].filter((x) => !B.has(x)));
  const comp = new Set([...U].filter((x) => !A.has(x)));
  const sym = new Set([...union].filter((x) => !inter.has(x)));
  const field = "w-full rounded-lg bg-[#0A0714] border border-[#2A2140] px-2 py-1.5 font-mono text-sm text-white";

  return (
    <Panel>
      <SectionTitle title="Operations with real elements">Edit the lists (comma separated). Everything recomputes live, and the code on the right does the same thing.</SectionTitle>
      <div className="mt-3 grid sm:grid-cols-3 gap-2">
        <label className="text-xs text-[#9C93B3]">A<input className={field} value={aText} onChange={(e) => setA(e.target.value)} /></label>
        <label className="text-xs text-[#9C93B3]">B<input className={field} value={bText} onChange={(e) => setB(e.target.value)} /></label>
        <label className="text-xs text-[#9C93B3]">U<input className={field} value={uText} onChange={(e) => setU(e.target.value)} /></label>
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#2A2140] bg-[#0F0A1A] p-3 font-mono text-sm space-y-1 text-[#E4D9FF] overflow-x-auto">
          <p>A ∪ B = <span className="text-[#4ADE80]">{show(union)}</span></p>
          <p>A ∩ B = <span className="text-[#4ADE80]">{show(inter)}</span></p>
          <p>A − B = <span className="text-[#4ADE80]">{show(diff)}</span></p>
          <p>A′ = <span className="text-[#4ADE80]">{show(comp)}</span></p>
          <p>A ⊕ B = <span className="text-[#4ADE80]">{show(sym)}</span></p>
          <p className="text-[#F4B942]">|A ∪ B| = {A.size} + {B.size} − {inter.size} = {A.size + B.size - inter.size} {A.size + B.size - inter.size === union.size ? "(matches)" : ""}</p>
          <p>{inter.size === 0 ? "A and B are disjoint." : "A and B overlap."}</p>
        </div>
        <CodeBlock title="python" code={`A = {1, 2, 3, 4}\nB = {3, 4, 5}\nU = set(range(1, 8))\n\nA | B      # union\nA & B      # intersection\nA - B      # difference\nU - A      # complement\nA ^ B      # symmetric difference\n\n# SQL analogy\n# SELECT id FROM a UNION     SELECT id FROM b\n# SELECT id FROM a INTERSECT SELECT id FROM b\n# SELECT id FROM a EXCEPT    SELECT id FROM b`} />
      </div>
    </Panel>
  );
}

const IDENTITIES = [
  { law: "Identity laws", forms: ["A ∪ ∅ = A", "A ∩ U = A"], lhs: (a) => a || false, rhs: (a) => a, vars: 1 },
  { law: "Domination laws", forms: ["A ∪ U = U", "A ∩ ∅ = ∅"], lhs: () => true, rhs: () => true, vars: 1, note: "Left side A ∪ U is all of U." },
  { law: "Idempotent laws", forms: ["A ∪ A = A", "A ∩ A = A"], lhs: (a) => a || a, rhs: (a) => a, vars: 1 },
  { law: "Complementation law", forms: ["(A′)′ = A"], lhs: (a) => !(!a), rhs: (a) => a, vars: 1 },
  { law: "Commutative laws", forms: ["A ∪ B = B ∪ A", "A ∩ B = B ∩ A"], lhs: (a, b) => a || b, rhs: (a, b) => b || a, vars: 2 },
  { law: "Associative laws", forms: ["A ∪ (B ∪ C) = (A ∪ B) ∪ C", "A ∩ (B ∩ C) = (A ∩ B) ∩ C"], lhs: (a, b, c) => a || (b || c), rhs: (a, b, c) => (a || b) || c, vars: 3 },
  { law: "Distributive laws", forms: ["A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)", "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)"], lhs: (a, b, c) => a || (b && c), rhs: (a, b, c) => (a || b) && (a || c), vars: 3 },
  { law: "De Morgan's laws", forms: ["(A ∩ B)′ = A′ ∪ B′", "(A ∪ B)′ = A′ ∩ B′"], lhs: (a, b) => !(a && b), rhs: (a, b) => !a || !b, vars: 2 },
  { law: "Absorption laws", forms: ["A ∪ (A ∩ B) = A", "A ∩ (A ∪ B) = A"], lhs: (a, b) => a || (a && b), rhs: (a) => a, vars: 2 },
  { law: "Complement laws", forms: ["A ∪ A′ = U", "A ∩ A′ = ∅"], lhs: (a) => a || !a, rhs: () => true, vars: 1 },
];

function IdentityChecker() {
  const [i, setI] = useState(7);
  const id = IDENTITIES[i];
  const three = id.vars === 3;
  const rows = [];
  const n = id.vars;
  for (let m = 0; m < 1 << n; m++) {
    const a = !!(m & 1);
    const b = !!(m & 2);
    const c = !!(m & 4);
    rows.push({ a, b, c, l: id.lhs(a, b, c), r: id.rhs(a, b, c) });
  }
  const same = rows.every((r) => r.l === r.r);
  const t = (v) => (v ? "1" : "0");

  return (
    <Panel>
      <SectionTitle title="Set identities and their law names">Pick a law. Both sides are drawn as Venn diagrams (first form shown), and a membership table checks every case.</SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {IDENTITIES.map((x, k) => <Btn key={x.law} active={i === k} onClick={() => setI(k)}>{x.law}</Btn>)}
      </div>
      <div className="mt-3 rounded-xl border border-[#2A2140] bg-[#0F0A1A] p-3">
        {id.forms.map((f) => <p key={f} className="font-mono text-[#F4B942] text-sm sm:text-base break-words">{f}</p>)}
      </div>
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        <div><p className="text-xs text-[#9C93B3] mb-1">Left side</p><Venn three={three} pred={id.lhs} color="#7C3AED" /></div>
        <div><p className="text-xs text-[#9C93B3] mb-1">Right side</p><Venn three={three} pred={id.rhs} color="#4ADE80" /></div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="font-mono text-sm">
          <thead>
            <tr className="text-[#B48CFF]">
              <th className="px-3 py-1">A</th>{n > 1 && <th className="px-3 py-1">B</th>}{n > 2 && <th className="px-3 py-1">C</th>}<th className="px-3 py-1">left</th><th className="px-3 py-1">right</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, k) => (
              <tr key={k} className="border-t border-[#211934] text-[#E4D9FF]">
                <td className="px-3 py-1">{t(r.a)}</td>{n > 1 && <td className="px-3 py-1">{t(r.b)}</td>}{n > 2 && <td className="px-3 py-1">{t(r.c)}</td>}
                <td className="px-3 py-1">{t(r.l)}</td><td className="px-3 py-1">{t(r.r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={`mt-2 text-sm ${same ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{same ? "Every row matches, so the identity holds." : "Some rows differ."}</p>
      {id.note && <p className="mt-1 text-xs text-[#9C93B3]">{id.note}</p>}
    </Panel>
  );
}

function InclusionExclusion() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(9);
  const [ab, setAB] = useState(4);
  const safeAB = Math.min(ab, a, b);
  return (
    <Panel>
      <SectionTitle title="Inclusion-exclusion, live">Elements in the overlap get counted twice when we add |A| and |B|, so we subtract the overlap once.</SectionTitle>
      <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm text-[#C9BFE3]">
        <label>|A| = {a}<input type="range" min="0" max="20" value={a} onChange={(e) => setA(+e.target.value)} className="w-full" /></label>
        <label>|B| = {b}<input type="range" min="0" max="20" value={b} onChange={(e) => setB(+e.target.value)} className="w-full" /></label>
        <label>|A ∩ B| = {safeAB}<input type="range" min="0" max="20" value={safeAB} onChange={(e) => setAB(+e.target.value)} className="w-full" /></label>
      </div>
      <div className="mt-3 flex h-8 rounded-lg overflow-hidden font-mono text-xs text-white">
        <div style={{ flex: a - safeAB || 0.0001 }} className="bg-[#7C3AED] flex items-center justify-center">{a - safeAB}</div>
        <div style={{ flex: safeAB || 0.0001 }} className="bg-[#F4B942] text-black flex items-center justify-center">{safeAB}</div>
        <div style={{ flex: b - safeAB || 0.0001 }} className="bg-[#4ADE80] text-black flex items-center justify-center">{b - safeAB}</div>
      </div>
      <p className="mt-3 font-mono text-[#F4B942] text-sm break-words">|A ∪ B| = {a} + {b} − {safeAB} = {a + b - safeAB}</p>
      <p className="mt-1 font-mono text-xs text-[#9C93B3] break-words">Three sets: |A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |A ∩ C| − |B ∩ C| + |A ∩ B ∩ C|</p>
    </Panel>
  );
}

export default function SetOperationsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 5 · SET OPERATIONS" title="Set Operations, Venn Diagrams and Identities">
        Combine sets, see the result in a Venn diagram, and learn the named laws that let you simplify set expressions.
      </SectionHeader>
      <OperationExplorer />
      <ElementLab />
      <InclusionExclusion />
      <IdentityChecker />

      <WorkedExample
        tag="WORKED EXAMPLE 1"
        title="Prove (A ∩ B)′ = A′ ∪ B′ by element chasing"
        given={[<p key="g">A and B are subsets of a universal set U.</p>]}
        asked={[<p key="a">Show that (A ∩ B)′ = A′ ∪ B′ (De Morgan's law).</p>]}
        steps={[
          { title: "Plan", text: "To show two sets are equal, show each is a subset of the other." },
          { title: "Left ⊆ right", text: "Take x ∈ (A ∩ B)′. Then x ∉ A ∩ B, so it is not true that x is in both. So x ∉ A or x ∉ B, which means x ∈ A′ or x ∈ B′, so x ∈ A′ ∪ B′." },
          { title: "Right ⊆ left", text: "Take x ∈ A′ ∪ B′. Then x ∉ A or x ∉ B, so x is not in both. So x ∉ A ∩ B, which means x ∈ (A ∩ B)′." },
          { title: "Conclude", text: "Each set is a subset of the other, so they are equal." },
        ]}
        answer="(A ∩ B)′ = A′ ∪ B′."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 2"
        title="Prove A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C) with a membership table"
        given={[<p key="g">A, B, C are subsets of U. Write 1 if an element is in the set and 0 if not.</p>]}
        asked={[<p key="a">Show the distributive law holds.</p>]}
        steps={[
          { title: "List all 8 cases of (A, B, C)", text: "An element can be in or out of each of the three sets." },
          { title: "Compute the left side", text: "B ∩ C is 1 only when B = C = 1. Then A ∪ (B ∩ C) is 1 when A = 1 or both B and C are 1.", formula: "left column: 0 0 0 1 1 1 1 1  (rows 000, 001, 010, 011, 100, 101, 110, 111)" },
          { title: "Compute the right side", text: "A ∪ B and A ∪ C are both 1 when A = 1, or when B = 1 and C = 1.", formula: "right column: 0 0 0 1 1 1 1 1" },
          { title: "Compare", text: "The columns are identical in all 8 rows. Use the Identity Checker above to see this table live." },
        ]}
        answer="The two sides agree in every row, so the sets are equal."
      />

      <Quiz
        questions={[
          { q: "Which law says A ∪ (A ∩ B) = A?", options: ["Absorption", "Idempotent", "Domination"], answer: 0, why: "Absorption: the A ∩ B part is absorbed because it is already inside A." },
          { q: "If |A| = 6, |B| = 5 and |A ∩ B| = 2, what is |A ∪ B|?", options: ["11", "9", "13"], answer: 1, why: "6 + 5 − 2 = 9." },
          { q: "(A ∪ B)′ equals:", options: ["A′ ∪ B′", "A′ ∩ B′", "A ∩ B"], answer: 1, why: "De Morgan: complement of a union is the intersection of the complements." },
        ]}
      />
      <Reflection
        fact={<p>SQL's UNION, INTERSECT and EXCEPT are set operations, and search engines use intersection when you add more keywords: every extra word shrinks the result set.</p>}
        question={<p>If A = {"{1, 2, 3}"} and B = {"{3, 4}"}, compute |A ∪ B| by inclusion-exclusion and check it against listing the elements. Why is the subtraction needed?</p>}
      />
    </div>
  );
}
