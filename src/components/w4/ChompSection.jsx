import { useEffect, useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

// State: array of row lengths (non increasing). Cell (0,0) is poisoned.
const keyOf = (s) => s.join(",");

function applyMove(state, r, c) {
  return state.map((len, i) => (i >= r ? Math.min(len, c) : len));
}

function legalMoves(state) {
  const moves = [];
  state.forEach((len, r) => {
    for (let c = 0; c < len; c++) if (!(r === 0 && c === 0)) moves.push([r, c]);
  });
  return moves;
}

function makeSolver() {
  const memo = new Map();
  // true when the player to move can force a win
  const wins = (state) => {
    const k = keyOf(state);
    if (memo.has(k)) return memo.get(k);
    let result = false;
    for (const [r, c] of legalMoves(state)) {
      if (!wins(applyMove(state, r, c))) { result = true; break; }
    }
    memo.set(k, result);
    return result;
  };
  const best = (state) => {
    const moves = legalMoves(state);
    if (moves.length === 0) return null;
    for (const [r, c] of moves) if (!wins(applyMove(state, r, c))) return [r, c];
    return null;
  };
  return { wins, best, size: () => memo.size };
}

const solver = makeSolver();

const SIZES = [
  { label: "3 × 4", rows: 3, cols: 4 },
  { label: "4 × 5", rows: 4, cols: 5 },
  { label: "5 × 6", rows: 5, cols: 6 },
  { label: "4 × 4 (square)", rows: 4, cols: 4 },
  { label: "2 × 6", rows: 2, cols: 6 },
];

function ChompGame() {
  const [size, setSize] = useState(SIZES[0]);
  const [mode, setMode] = useState("cpu");
  const [state, setState] = useState(() => Array(SIZES[0].rows).fill(SIZES[0].cols));
  const [turn, setTurn] = useState(0);
  const [winner, setWinner] = useState(null);
  const [hover, setHover] = useState(null);
  const [hint, setHint] = useState(null);
  const [log, setLog] = useState([]);
  const [cpuFirst, setCpuFirst] = useState(false);

  const names = mode === "cpu" ? (cpuFirst ? ["Computer", "You"] : ["You", "Computer"]) : ["Player 1", "Player 2"];
  const isCpuTurn = mode === "cpu" && names[turn] === "Computer" && winner === null;

  const reset = (sz = size, m = mode, first = cpuFirst) => {
    setSize(sz);
    setMode(m);
    setCpuFirst(first);
    setState(Array(sz.rows).fill(sz.cols));
    setTurn(0);
    setWinner(null);
    setHint(null);
    setLog([]);
  };

  const play = (r, c, who) => {
    const isPoison = r === 0 && c === 0;
    const next = applyMove(state, r, c);
    setLog((l) => [...l, `${names[who]} ate from row ${r + 1}, column ${c + 1}`]);
    setHint(null);
    if (isPoison) {
      setState(next);
      setWinner(1 - who);
      return;
    }
    setState(next);
    setTurn(1 - who);
  };

  useEffect(() => {
    if (!isCpuTurn) return undefined;
    const t = setTimeout(() => {
      const mv = solver.best(state);
      const moves = legalMoves(state);
      let r;
      let c;
      if (mv) [r, c] = mv;
      else if (moves.length) [r, c] = moves[moves.length - 1];
      else [r, c] = [0, 0];
      play(r, c, turn);
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCpuTurn, state, turn]);

  const onCell = (r, c) => {
    if (winner !== null || isCpuTurn) return;
    if (c >= state[r]) return;
    play(r, c, turn);
  };

  const showHint = () => setHint(solver.best(state));
  const cpuWouldWin = solver.wins(state);
  const preview = hover && hover[0] < state.length && hover[1] < state[hover[0]] ? hover : null;

  return (
    <Panel>
      <SectionTitle title="Play Chomp">
        Take turns picking a square. You eat that square and everything below and to the right of it. The top left square is poisoned: whoever is forced to eat it loses.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {SIZES.map((s) => <Btn key={s.label} active={size.label === s.label} onClick={() => reset(s)}>{s.label}</Btn>)}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Btn active={mode === "cpu"} onClick={() => reset(size, "cpu", cpuFirst)}>vs Computer</Btn>
        <Btn active={mode === "pvp"} onClick={() => reset(size, "pvp", false)}>2 players</Btn>
        {mode === "cpu" && <Btn active={cpuFirst} onClick={() => reset(size, mode, !cpuFirst)}>{cpuFirst ? "Computer goes first" : "You go first"}</Btn>}
        <Btn onClick={() => reset()}>Restart</Btn>
        <Btn disabled={winner !== null || isCpuTurn} onClick={showHint}>Hint</Btn>
      </div>

      <p className="mt-3 text-sm font-heading text-[#E4D9FF]">
        {winner !== null ? `${names[winner]} wins!` : isCpuTurn ? "Computer is thinking..." : `${names[turn]}'s turn`}
      </p>

      <div className="mt-3 grid gap-1 w-full max-w-md mx-auto" style={{ gridTemplateColumns: `repeat(${size.cols}, 1fr)` }} onMouseLeave={() => setHover(null)}>
        {Array.from({ length: size.rows * size.cols }, (_, i) => {
          const r = Math.floor(i / size.cols);
          const c = i % size.cols;
          const alive = c < (state[r] ?? 0);
          const poison = r === 0 && c === 0;
          const willEat = preview && alive && r >= preview[0] && c >= preview[1];
          const isHint = hint && hint[0] === r && hint[1] === c;
          let bg = alive ? "#8B5A2B" : "transparent";
          if (poison && alive) bg = "#16A34A";
          if (willEat) bg = "#F87171";
          if (isHint) bg = "#F4B942";
          return (
            <button key={i} disabled={!alive} onClick={() => onCell(r, c)} onMouseEnter={() => setHover([r, c])}
              className="aspect-square rounded-md text-xs touch-manipulation transition-all duration-300"
              style={{ background: bg, opacity: alive ? 1 : 0, transform: alive ? "scale(1)" : "scale(0.2)", border: alive ? "1px solid #3E2713" : "none", color: "white" }}>
              {poison && alive ? "☠" : ""}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-[#9C93B3] text-center">
        {hint ? `Hint: the winning move is row ${hint[0] + 1}, column ${hint[1] + 1} (gold).` : `Position evaluation for the player to move: ${state.every((l, i) => (i === 0 ? l === 1 : l === 0)) ? "only poison left" : cpuWouldWin ? "can force a win" : "is losing against perfect play"}.`}
      </p>
      {log.length > 0 && <p className="mt-2 font-mono text-xs text-[#C9BFE3] text-center">{log[log.length - 1]}</p>}
      <p className="mt-2 text-xs text-[#9C93B3] text-center">Solver has analysed {solver.size()} positions so far (memoized).</p>
    </Panel>
  );
}

function SquareStrategy() {
  const [n, setN] = useState(5);
  const [pick, setPick] = useState(false);
  const cell = 40;
  return (
    <Panel>
      <SectionTitle title="A winning strategy for L-shapes and squares">
        On an n × n square, the first player eats the square at row 2, column 2. That leaves a symmetric L-shape with two equal arms. After that, whatever the opponent eats from one arm, copy it on the other arm. The opponent is eventually left with the poison.
      </SectionTitle>
      <div className="mt-3 flex gap-2"><Btn onClick={() => setN(n === 7 ? 3 : n + 1)}>size: {n} × {n}</Btn><Btn active={pick} onClick={() => setPick(!pick)}>{pick ? "Show L-shape" : "Show board"}</Btn></div>
      <svg viewBox={`0 0 ${n * cell} ${n * cell}`} className="mt-3 w-full max-w-xs mx-auto h-auto">
        {Array.from({ length: n * n }, (_, i) => {
          const r = Math.floor(i / n);
          const c = i % n;
          const eaten = pick && r >= 1 && c >= 1;
          const poison = r === 0 && c === 0;
          const arm = !eaten && (r === 0 || c === 0) && !poison;
          return <rect key={i} x={c * cell + 1} y={r * cell + 1} width={cell - 2} height={cell - 2} rx="4" fill={eaten ? "none" : poison ? "#16A34A" : arm && pick ? (r === 0 ? "#F4B942" : "#B48CFF") : "#8B5A2B"} stroke={eaten ? "#2A2140" : "none"} strokeDasharray="3" />;
        })}
      </svg>
      <p className="mt-2 text-xs text-[#9C93B3] text-center">Gold arm and purple arm have equal length. Mirror every move.</p>
    </Panel>
  );
}

export default function ChompSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 4 · PROOF IN ACTION" title="The Game of Chomp">
        A two player game where we can prove who wins without knowing how to win. That is a non-constructive proof, and it uses proof by contradiction.
      </SectionHeader>
      <ChompGame />
      <SquareStrategy />
      <CodeBlock title="python: solve Chomp with memoized minimax" code={`from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef wins(state):                 # state = tuple of row lengths\n    for r in range(len(state)):\n        for c in range(state[r]):\n            if (r, c) == (0, 0):\n                continue\n            nxt = tuple(min(l, c) if i >= r else l\n                        for i, l in enumerate(state))\n            if not wins(nxt):        # leaves opponent in a losing spot\n                return True\n    return False                     # only poison left, or every move loses\n\nprint(wins((5, 5, 5, 5)))            # True: first player wins`} />

      <WorkedExample
        tag="WORKED EXAMPLE 1"
        title="Strategy stealing: the first player wins"
        given={[<p key="g">Chomp on any rectangular board larger than 1 × 1, perfect play from both sides.</p>]}
        asked={[<p key="a">Prove that the first player has a winning strategy.</p>]}
        steps={[
          { title: "Setup", text: "Consider the move M where the first player eats only the bottom right square. This is always legal." },
          { title: "Case 1: M is a winning move", text: "Then the first player wins by playing M. Done." },
          { title: "Case 2: M is not winning", text: "Then the second player has a winning reply R to the position after M. Whatever R eats, it also eats the bottom right square, since that square is already gone or lies in the eaten region." },
          { title: "Steal the strategy", text: "But then the first player could have played R directly on move 1. R leaves the same position that M followed by R would leave. That position is losing for whoever must move, so playing R first wins." },
          { title: "Conclusion", text: "In both cases the first player can win. The argument does not tell us what the winning move is, only that one exists." },
        ]}
        answer="The first player always has a winning strategy. This is proof by cases combined with strategy stealing."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 2"
        title="2 × n boards"
        given={[<p key="g">A board with two rows and n columns.</p>]}
        asked={[<p key="a">Find the winning first move.</p>]}
        steps={[
          { title: "Aim for a position the opponent cannot win", text: "Leave the bottom row exactly one square shorter than the top row." },
          { title: "Move", text: "Eat the bottom right square (row 2, column n)." },
          { title: "Maintain the invariant", text: "If the opponent eats from the top row, remove the matching amount from the bottom row to keep the difference at one. If the opponent eats from the bottom row, eat from the top row to restore it." },
          { title: "End", text: "The position becomes top row = 2, bottom row = 1 after the opponent moves, or similar, and finally the opponent faces only the poison." },
        ]}
        answer="Eat the last square of the bottom row, then keep the bottom row one shorter than the top."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 3"
        title="Square boards"
        given={[<p key="g">An n × n board.</p>]}
        asked={[<p key="a">State and justify the winning strategy.</p>]}
        steps={[
          { title: "First move", text: "Eat row 2, column 2, leaving two arms of length n - 1 next to the poison." },
          { title: "Mirror", text: "Whatever the opponent takes from one arm, take the same number from the other arm." },
          { title: "Why it works", text: "After each of your moves the two arms have equal length, so the opponent always has a move and eventually only the poison remains for them." },
        ]}
        answer="Eat (2, 2), then mirror."
      />
      <Quiz
        questions={[
          { q: "Which proof idea shows the first player wins any rectangular Chomp?", options: ["Strategy stealing", "Mathematical induction on rows", "Pigeonhole"], answer: 0, why: "If the second player had a reply to the smallest move, the first could play it at once." },
          { q: "Does the strategy stealing proof tell us the winning move?", options: ["Yes", "No"], answer: 1, why: "It is non-constructive: it proves existence only." },
          { q: "On a square board, the first winning move is:", options: ["Eat the corner", "Eat (2, 2)", "Eat the poison"], answer: 1, why: "It leaves a symmetric L-shape." },
        ]}
      />
      <Reflection
        fact={<p>Chomp is solved for every 2 row board and every square board, yet for general rectangles nobody knows a simple formula for the winning move. Computers find it by searching, exactly like the minimax code above.</p>}
        question={<p>The strategy stealing proof is non-constructive. Is a proof that something exists, without showing it, still useful? Give an example from programming.</p>}
      />
    </div>
  );
}
