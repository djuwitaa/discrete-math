import { useMemo, useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

const PALETTE = ["#7C3AED", "#F4B942", "#4ADE80", "#F87171", "#38BDF8", "#F472B6", "#FB923C", "#A3E635"];

function DominoGame() {
  const N = 8;
  const [removed, setRemoved] = useState(new Set(["0,0", "7,7"]));
  const [doms, setDoms] = useState([]);
  const [first, setFirst] = useState(null);
  const [msg, setMsg] = useState("Tap a cell, then an adjacent cell, to place a domino.");
  const [color, setColor] = useState(true);

  const covered = useMemo(() => {
    const m = new Map();
    doms.forEach((d, i) => { m.set(d[0], i); m.set(d[1], i); });
    return m;
  }, [doms]);
  const free = N * N - removed.size - covered.size;

  const click = (r, c) => {
    const k = `${r},${c}`;
    if (removed.has(k)) return;
    if (covered.has(k)) {
      setDoms(doms.filter((d) => d[0] !== k && d[1] !== k));
      setFirst(null);
      setMsg("Domino removed.");
      return;
    }
    if (!first) { setFirst(k); setMsg("Now tap a neighbouring cell."); return; }
    const [r0, c0] = first.split(",").map(Number);
    if (Math.abs(r0 - r) + Math.abs(c0 - c) === 1) {
      setDoms([...doms, [first, k]]);
      setMsg("Placed.");
    } else setMsg("Those cells are not neighbours. Try again.");
    setFirst(null);
  };

  const toggleHole = (preset) => {
    setDoms([]);
    setFirst(null);
    setRemoved(new Set(preset));
  };
  const white = N * N - removed.size;
  let blackLeft = 0;
  let whiteLeft = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const k = `${r},${c}`;
    if (removed.has(k)) continue;
    if ((r + c) % 2 === 0) blackLeft++; else whiteLeft++;
  }

  return (
    <Panel>
      <SectionTitle title="Domino tiling playground">
        A domino covers exactly two neighbouring squares. Try to tile the whole board with no overlaps and no gaps. First the full board, then the mutilated board with two opposite corners removed.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => toggleHole([])}>Full 8 × 8</Btn>
        <Btn onClick={() => toggleHole(["0,0", "7,7"])}>Opposite corners removed</Btn>
        <Btn onClick={() => toggleHole(["0,0", "0,1"])}>Two neighbours removed</Btn>
        <Btn onClick={() => { setDoms([]); setFirst(null); }}>Clear dominoes</Btn>
        <Btn active={color} onClick={() => setColor(!color)}>Show coloring</Btn>
      </div>
      <div className="mt-3 grid gap-1 w-full max-w-md mx-auto" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
        {Array.from({ length: N * N }, (_, i) => {
          const r = Math.floor(i / N);
          const c = i % N;
          const k = `${r},${c}`;
          const gone = removed.has(k);
          const di = covered.get(k);
          const dark = (r + c) % 2 === 0;
          let bg = color ? (dark ? "#3B2F5C" : "#8C7BB8") : "#211934";
          if (di !== undefined) bg = PALETTE[di % PALETTE.length];
          if (first === k) bg = "#F4B942";
          return (
            <button key={k} onClick={() => click(r, c)} disabled={gone} className="aspect-square rounded-sm touch-manipulation" style={{ background: gone ? "transparent" : bg, border: gone ? "1px dashed #F87171" : "1px solid #0A0714" }} aria-label={`cell ${r},${c}`} />
          );
        })}
      </div>
      <p className="mt-3 text-sm text-[#C9BFE3] text-center">{msg}</p>
      <p className="font-mono text-sm text-center text-[#F4B942]">dominoes: {doms.length} · free squares: {free}{free === 0 ? " · fully tiled!" : ""}</p>
      <p className="font-mono text-xs text-center text-[#9C93B3]">dark squares: {blackLeft} · light squares: {whiteLeft} (total {white})</p>
    </Panel>
  );
}

function ColoringProof() {
  const [step, setStep] = useState(0);
  const lines = [
    "Color the board like a chessboard. Every domino covers one dark and one light square, because neighbours always have opposite colors.",
    "The full board has 32 dark and 32 light squares.",
    "Remove two opposite corners. They have the SAME color (both dark in our picture), so 30 dark and 32 light squares remain.",
    "A tiling by 31 dominoes would cover 31 dark and 31 light squares.",
    "30 ≠ 31, so no tiling exists. This is a proof by contradiction.",
  ];
  const N = 8;
  return (
    <Panel>
      <SectionTitle title="Why the mutilated board cannot be tiled">A coloring (invariant) argument. Step through it.</SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Btn>
        <Btn disabled={step === lines.length - 1} onClick={() => setStep(step + 1)}>Next</Btn>
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-4 items-center">
        <svg viewBox="0 0 160 160" className="w-full max-w-xs mx-auto h-auto">
          {Array.from({ length: N * N }, (_, i) => {
            const r = Math.floor(i / N);
            const c = i % N;
            const dark = (r + c) % 2 === 0;
            const corner = (r === 0 && c === 0) || (r === 7 && c === 7);
            const hide = step >= 2 && corner;
            const fill = step === 0 ? "#211934" : dark ? "#3B2F5C" : "#C9B8F0";
            return <rect key={i} x={c * 20} y={r * 20} width="19" height="19" fill={hide ? "none" : fill} stroke={hide ? "#F87171" : "none"} strokeDasharray="3" />;
          })}
          {step === 0 && <rect x="20" y="20" width="39" height="19" fill="#F4B942" rx="3" opacity="0.9" />}
        </svg>
        <p className="text-sm text-[#E4D9FF]">{lines[step]}</p>
      </div>
    </Panel>
  );
}

// Recursive L-tromino tiling of a 2^k board with one missing square.
function tileDeficient(k, hr, hc) {
  const size = 2 ** k;
  const grid = Array.from({ length: size }, () => Array(size).fill(-1));
  const order = [];
  let id = 0;
  const rec = (top, left, n, mr, mc, depth) => {
    if (n === 1) return;
    const h = n / 2;
    const cr = top + h - 1;
    const cc = left + h - 1;
    const quads = [[top, left], [top, left + h], [top + h, left], [top + h, left + h]];
    const centres = [[cr, cc], [cr, cc + 1], [cr + 1, cc], [cr + 1, cc + 1]];
    const mq = (mr >= top + h ? 2 : 0) + (mc >= left + h ? 1 : 0);
    const my = id++;
    const cells = [];
    centres.forEach(([r, c], q) => {
      if (q !== mq) { grid[r][c] = my; cells.push([r, c]); }
    });
    order.push({ id: my, depth, cells });
    quads.forEach(([t, l], q) => {
      const [sr, sc] = q === mq ? [mr, mc] : centres[q];
      rec(t, l, h, sr, sc, depth + 1);
    });
  };
  rec(0, 0, size, hr, hc, 0);
  return { grid, order, size };
}

function TrominoLab() {
  const [k, setK] = useState(3);
  const [hole, setHole] = useState([5, 2]);
  const [shown, setShown] = useState(100);
  const size = 2 ** k;
  const hr = Math.min(hole[0], size - 1);
  const hc = Math.min(hole[1], size - 1);
  const h = [hr, hc];
  const { grid, order } = useMemo(() => tileDeficient(k, hr, hc), [k, hr, hc]);
  const visible = new Set(order.slice(0, Math.min(shown, order.length)).map((o) => o.id));
  const cell = 280 / size;
  return (
    <Panel>
      <SectionTitle title="Deficient board and L-trominoes (proof by induction made visible)">
        Claim: every 2ⁿ × 2ⁿ board with one square removed can be tiled by L-shaped trominoes. Tap a square to move the hole, use the slider to watch the recursion place tiles.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        {[1, 2, 3, 4].map((x) => <Btn key={x} active={k === x} onClick={() => { setK(x); setShown(100); }}>{2 ** x} × {2 ** x}</Btn>)}
      </div>
      <label className="mt-3 block max-w-sm text-xs text-[#C9BFE3]">trominoes placed: <span className="font-mono text-[#F4B942]">{Math.min(shown, order.length)} / {order.length}</span>
        <input type="range" min="0" max={order.length} value={Math.min(shown, order.length)} onChange={(e) => setShown(+e.target.value)} className="w-full accent-[#7C3AED]" />
      </label>
      <svg viewBox="0 0 280 280" className="mt-3 w-full max-w-sm mx-auto h-auto rounded-lg bg-[#0A0714] border border-[#2A2140]">
        {grid.map((row, r) => row.map((id, c) => {
          const isHole = r === h[0] && c === h[1];
          const on = id >= 0 && visible.has(id);
          return (
            <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} onClick={() => { setHole([r, c]); setShown(100); }}
              fill={isHole ? "#F87171" : on ? PALETTE[id % PALETTE.length] : "#130E20"} stroke="#0A0714" strokeWidth="1" style={{ cursor: "pointer" }} />
          );
        }))}
      </svg>
      <p className="mt-2 text-xs text-[#9C93B3] text-center">Red square is the hole. Each color is one L-tromino. Total squares left: {size * size - 1} = 3 · {order.length}.</p>
    </Panel>
  );
}

function ThreeColoring() {
  const [n, setN] = useState(6);
  return (
    <Panel>
      <SectionTitle title="Straight trominoes and a 3-coloring">
        Color the board with three colors in diagonal stripes. Every straight 1 × 3 tromino, horizontal or vertical, covers one square of each color. So a tiling needs equal counts of each color.
      </SectionTitle>
      <div className="mt-3 flex gap-2"><Btn onClick={() => setN(n === 6 ? 5 : n === 5 ? 4 : 6)}>board: {n} × {n}</Btn></div>
      <div className="mt-3 grid gap-1 w-full max-w-xs mx-auto" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {Array.from({ length: n * n }, (_, i) => {
          const r = Math.floor(i / n);
          const c = i % n;
          return <div key={i} className="aspect-square rounded-sm" style={{ background: ["#7C3AED", "#F4B942", "#4ADE80"][(r + c) % 3] }} />;
        })}
      </div>
      <p className="mt-2 text-sm text-[#C9BFE3] text-center">
        {n * n} squares. {n * n % 3 === 0 ? "Divisible by 3, so counting alone does not forbid a tiling." : `${n * n} is not divisible by 3, so no tiling exists at all.`}
      </p>
    </Panel>
  );
}

export default function TilingSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 4 · PROOF IN ACTION" title="Tiling with Dominoes and Trominoes">
        Checkerboards are a playground for proofs: coloring arguments, contradiction, and induction all show up.
      </SectionHeader>
      <DominoGame />
      <ColoringProof />
      <TrominoLab />
      <ThreeColoring />
      <CodeBlock title="python: recursive L-tromino tiling" code={`def tile(top, left, n, hole, grid, next_id):\n    if n == 1:\n        return next_id\n    h = n // 2\n    centre = [(top+h-1, left+h-1), (top+h-1, left+h),\n              (top+h,   left+h-1), (top+h,   left+h)]\n    quads  = [(top, left), (top, left+h), (top+h, left), (top+h, left+h)]\n    hq = (hole[0] >= top+h) * 2 + (hole[1] >= left+h)\n    tid = next_id; next_id += 1\n    for q in range(4):\n        if q != hq:\n            grid[centre[q][0]][centre[q][1]] = tid   # centre tromino\n    for q in range(4):\n        sub_hole = hole if q == hq else centre[q]\n        next_id = tile(*quads[q], h, sub_hole, grid, next_id)\n    return next_id`} />

      <WorkedExample
        tag="WORKED EXAMPLE 1"
        title="Mutilated chessboard"
        given={[<p key="g">An 8 × 8 board with two opposite corners removed.</p>]}
        asked={[<p key="a">Can it be tiled with 31 dominoes?</p>]}
        steps={[
          { title: "Color it like a chessboard", text: "Each domino covers one square of each color." },
          { title: "Count colors", text: "Opposite corners share a color, so the board has 30 of one color and 32 of the other." },
          { title: "Compare", text: "31 dominoes need 31 of each color. 30 ≠ 31, contradiction." },
        ]}
        answer="No, such a tiling is impossible."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 2"
        title="Induction for the L-tromino theorem"
        given={[<p key="g">P(n): every 2ⁿ × 2ⁿ board with one square deleted can be tiled by L-trominoes.</p>]}
        asked={[<p key="a">Prove P(n) for all n ≥ 1.</p>]}
        steps={[
          { title: "Basis step (n = 1)", text: "A 2 × 2 board minus one square is exactly one L-tromino." },
          { title: "Inductive hypothesis", text: "Assume P(k): every 2ᵏ × 2ᵏ board with one square deleted can be tiled." },
          { title: "Inductive step", text: "Take a 2ᵏ⁺¹ × 2ᵏ⁺¹ board with one deleted square. Split it into four 2ᵏ × 2ᵏ quadrants. The deleted square lies in one quadrant. Place one L-tromino at the centre that covers one square in each of the other three quadrants. Now every quadrant has exactly one missing square, so by the hypothesis each can be tiled." },
          { title: "Conclusion", text: "P(k) implies P(k + 1), and P(1) holds, so P(n) holds for all n ≥ 1." },
        ]}
        answer="Proved. The code above is this proof turned into a recursive algorithm."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 3"
        title="Counting condition"
        given={[<p key="g">A 2ⁿ × 2ⁿ board with one square removed.</p>]}
        asked={[<p key="a">Why is the number of squares divisible by 3?</p>]}
        steps={[
          { title: "Compute", formula: "4ⁿ - 1 = (4 - 1)(4ⁿ⁻¹ + ... + 1) = 3 · (something)" },
        ]}
        answer="Since 4 ≡ 1 (mod 3), 4ⁿ - 1 ≡ 0 (mod 3), which is necessary for tiling by trominoes."
      />
      <Quiz
        questions={[
          { q: "How many squares does a domino cover?", options: ["2", "3", "4"], answer: 0, why: "Two neighbouring squares." },
          { q: "In the mutilated board proof, what is the key invariant?", options: ["Each domino covers one dark and one light square", "Dominoes are red"], answer: 0, why: "That forces equal color counts." },
          { q: "Which proof method does the L-tromino theorem use?", options: ["Induction", "Contrapositive only", "Counterexample"], answer: 0, why: "Each case reduces to four smaller boards." },
        ]}
      />
    </div>
  );
}
