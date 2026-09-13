import React, { useState, useRef, useMemo } from "react";
import { ChevronDown, Check, X, RotateCcw, Lightbulb, ArrowRight, Sparkles, Search, PartyPopper, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

/* =========================================================================
   PROPOSITIONAL LOGIC ENGINE
   Small hand-rolled parser/evaluator so students can type real expressions
   (p, q, r, s, T, F with ¬ ∧ ∨ ⊕ → ↔ or ASCII ~ & | ^ -> <->) and get a
   real truth table / equivalence check back.
   ========================================================================= */

function normalizeSymbols(str) {
  return str
    .replace(/<->/gi, "↔")
    .replace(/->/g, "→")
    .replace(/<=>/g, "↔")
    .replace(/=>/g, "→")
    .replace(/~|!/g, "¬")
    .replace(/&&|&/g, "∧")
    .replace(/\|\||\|/g, "∨")
    .replace(/\^/g, "⊕");
}

function tokenize(raw) {
  const s = normalizeSymbols(raw);
  const tokens = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === " " || c === "\t" || c === "\n") continue;
    if ("¬∧∨⊕→↔()".includes(c)) {
      tokens.push(c);
      continue;
    }
    if (c === "T" || c === "F") {
      tokens.push(c);
      continue;
    }
    if (/[pqrsPQRS]/.test(c)) {
      tokens.push(c.toLowerCase());
      continue;
    }
    throw new Error(`Didn't recognize "${c}" — use p, q, r, s, T, F and ¬ ∧ ∨ → ↔`);
  }
  return tokens;
}

function parseTokens(tokens) {
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];
  const expect = (t) => {
    if (next() !== t) throw new Error(`Expected "${t}"`);
  };

  function parseIff() {
    let left = parseImp();
    while (peek() === "↔") {
      next();
      left = { t: "↔", l: left, r: parseImp() };
    }
    return left;
  }
  function parseImp() {
    let left = parseXor();
    while (peek() === "→") {
      next();
      left = { t: "→", l: left, r: parseXor() };
    }
    return left;
  }
  function parseXor() {
    let left = parseOr();
    while (peek() === "⊕") {
      next();
      left = { t: "⊕", l: left, r: parseOr() };
    }
    return left;
  }
  function parseOr() {
    let left = parseAnd();
    while (peek() === "∨") {
      next();
      left = { t: "∨", l: left, r: parseAnd() };
    }
    return left;
  }
  function parseAnd() {
    let left = parseNot();
    while (peek() === "∧") {
      next();
      left = { t: "∧", l: left, r: parseNot() };
    }
    return left;
  }
  function parseNot() {
    if (peek() === "¬") {
      next();
      return { t: "¬", l: parseNot() };
    }
    return parseAtom();
  }
  function parseAtom() {
    const tok = peek();
    if (tok === "(") {
      next();
      const e = parseIff();
      expect(")");
      return e;
    }
    if (tok === "T" || tok === "F") {
      next();
      return { t: "const", v: tok === "T" };
    }
    if (tok && /^[pqrs]$/.test(tok)) {
      next();
      return { t: "var", name: tok };
    }
    throw new Error(tok ? `Unexpected "${tok}"` : "Expression ends too soon");
  }

  if (tokens.length === 0) throw new Error("Type an expression first");
  const tree = parseIff();
  if (pos !== tokens.length) throw new Error(`Unexpected "${tokens[pos]}" — check your parentheses`);
  return tree;
}

function compile(raw) {
  return parseTokens(tokenize(raw));
}

function extractVars(node, set = new Set()) {
  if (!node) return set;
  if (node.t === "var") set.add(node.name);
  if (node.l) extractVars(node.l, set);
  if (node.r) extractVars(node.r, set);
  return set;
}

function evalNode(node, env) {
  switch (node.t) {
    case "const":
      return node.v;
    case "var":
      return !!env[node.name];
    case "¬":
      return !evalNode(node.l, env);
    case "∧":
      return evalNode(node.l, env) && evalNode(node.r, env);
    case "∨":
      return evalNode(node.l, env) || evalNode(node.r, env);
    case "⊕":
      return evalNode(node.l, env) !== evalNode(node.r, env);
    case "→":
      return !evalNode(node.l, env) || evalNode(node.r, env);
    case "↔":
      return evalNode(node.l, env) === evalNode(node.r, env);
    default:
      throw new Error("Malformed expression");
  }
}

function allCombos(vars) {
  const n = vars.length;
  const rows = [];
  for (let i = 0; i < 1 << n; i++) {
    const env = {};
    vars.forEach((v, idx) => {
      env[v] = !!((i >> (n - 1 - idx)) & 1);
    });
    rows.push(env);
  }
  return rows;
}

function normalizeAnswer(str) {
  return normalizeSymbols(str)
    .replace(/\s+/g, "")
    .replace(/\bAND\b/gi, "∧")
    .replace(/\bOR\b/gi, "∨")
    .replace(/\bNOT\b/gi, "¬")
    .toUpperCase();
}

/* =========================================================================
   SMALL VISUAL PRIMITIVES
   ========================================================================= */

const TF = ({ v }) =>
  v ? (
    <span className="inline-flex items-center justify-center w-7 h-6 rounded-md bg-[#173626] text-[#4ADE80] border border-[#255239] font-mono text-xs font-semibold">
      T
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-7 h-6 rounded-md bg-[#3A1C22] text-[#F87171] border border-[#5C2F37] font-mono text-xs font-semibold">
      F
    </span>
  );

function Panel({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-[#130E20] border border-[#2A2140] ${className}`}>
      {children}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">{children}</p>
  );
}

function StepButton({ onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A66CFF] text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition"
    >
      {children}
    </button>
  );
}

function GhostButton({ onClick, children, active }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm border transition ${
        active
          ? "bg-[#1D1530] border-[#7C3AED] text-white"
          : "bg-transparent border-[#2A2140] text-[#9C93B3] hover:border-[#7C3AED]/60 hover:text-[#E4D9FF]"
      }`}
    >
      {children}
    </button>
  );
}

function celebrate() {
  confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 }, colors: ["#7C3AED", "#A66CFF", "#F4B942", "#4ADE80"] });
}

function SolvedBadge({ solved }) {
  if (!solved) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#173626] text-[#4ADE80] border border-[#255239]">
      <Trophy className="w-3.5 h-3.5" /> Solved!
    </span>
  );
}

/* =========================================================================
   TRUTH TABLE RENDERER
   ========================================================================= */

function TruthTable({ vars, columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#2A2140]">
      <table className="min-w-full text-sm font-mono">
        <thead>
          <tr className="bg-[#1A1330]">
            {vars.map((v) => (
              <th key={v} className="px-3 py-2 text-[#F4B942] text-center font-semibold border-b border-[#2A2140]">
                {v}
              </th>
            ))}
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-[#E4D9FF] text-center font-semibold border-b border-l border-[#2A2140] whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 ? "bg-[#0F0A1A]" : "bg-[#130E20]"}>
              {vars.map((v) => (
                <td key={v} className="px-3 py-2 text-center">
                  <TF v={row.env[v]} />
                </td>
              ))}
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 text-center border-l border-[#211934]">
                  <TF v={row.values[c.key]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================================
   SECTION 1 — REFRESHER
   ========================================================================= */

const OPERATORS = [
  {
    sym: "¬p",
    name: "Negation",
    desc: "Flips the truth value. True becomes false, false becomes true.",
    vars: ["p"],
    rows: [
      { p: true, r: false },
      { p: false, r: true },
    ],
  },
  {
    sym: "p ∧ q",
    name: "Conjunction",
    desc: "True only when both p and q are true.",
    vars: ["p", "q"],
    rows: [
      { p: true, q: true, r: true },
      { p: true, q: false, r: false },
      { p: false, q: true, r: false },
      { p: false, q: false, r: false },
    ],
  },
  {
    sym: "p ∨ q",
    name: "Disjunction",
    desc: "True when at least one of p, q is true.",
    vars: ["p", "q"],
    rows: [
      { p: true, q: true, r: true },
      { p: true, q: false, r: true },
      { p: false, q: true, r: true },
      { p: false, q: false, r: false },
    ],
  },
  {
    sym: "p ⊕ q",
    name: "Exclusive Or",
    desc: "True when p and q have different values.",
    vars: ["p", "q"],
    rows: [
      { p: true, q: true, r: false },
      { p: true, q: false, r: true },
      { p: false, q: true, r: true },
      { p: false, q: false, r: false },
    ],
  },
  {
    sym: "p → q",
    name: "Conditional",
    desc: "False only when p is true and q is false. Otherwise true — even when p is false.",
    vars: ["p", "q"],
    rows: [
      { p: true, q: true, r: true },
      { p: true, q: false, r: false },
      { p: false, q: true, r: true },
      { p: false, q: false, r: true },
    ],
  },
];

function OperatorCard({ op }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="text-left rounded-2xl bg-[#130E20] border border-[#2A2140] p-5 hover:border-[#7C3AED]/60 transition group w-full"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-2xl text-[#E4D9FF] group-hover:text-white transition">{op.sym}</span>
        <ChevronDown className={`w-4 h-4 text-[#7C3AED] transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      <p className="mt-2 font-heading text-white text-sm font-semibold">{op.name}</p>
      <p className="mt-1 text-[#9C93B3] text-sm leading-relaxed">{op.desc}</p>
      {open && (
        <div className="mt-4 font-mono text-xs">
          <div className={`grid gap-px bg-[#2A2140] rounded-lg overflow-hidden`} style={{ gridTemplateColumns: `repeat(${op.vars.length + 1}, minmax(0,1fr))` }}>
            {op.vars.map((v) => (
              <div key={v} className="bg-[#1A1330] text-[#F4B942] text-center py-1.5 font-semibold">{v}</div>
            ))}
            <div className="bg-[#1A1330] text-[#E4D9FF] text-center py-1.5 font-semibold">{op.sym.replace(/p|q/g, (m) => m)}</div>
            {op.rows.map((row, i) => (
              <React.Fragment key={i}>
                {op.vars.map((v) => (
                  <div key={v} className="bg-[#0F0A1A] flex items-center justify-center py-1.5">
                    <TF v={row[v]} />
                  </div>
                ))}
                <div className="bg-[#0F0A1A] flex items-center justify-center py-1.5">
                  <TF v={row.r} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}

function RefresherSection() {
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>QUICK REVIEW</Eyebrow>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">The five operators you already know</h2>
        <p className="mt-2 text-[#9C93B3] max-w-2xl">
          A proposition is a declarative sentence with exactly one truth value. Tap a card to open its truth table — you'll
          be combining these all through today's session.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OPERATORS.map((op) => (
          <OperatorCard key={op.name} op={op} />
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   SECTION 2 — APPLICATIONS
   ========================================================================= */

const KEYWORD_MAP = [
  { kw: "not, never", sym: "¬" },
  { kw: "and, but, also", sym: "∧" },
  { kw: "or, either…or", sym: "∨" },
  { kw: "if…then, implies", sym: "→" },
  { kw: "if and only if", sym: "↔" },
];

function KeywordMap() {
  const [active, setActive] = useState(null);
  return (
    <Panel className="p-5">
      <p className="text-white font-heading font-semibold mb-1">Keyword → symbol map</p>
      <p className="text-[#9C93B3] text-sm mb-4">Circle the connective words in a sentence first — they tell you where the parentheses go. Tap a row.</p>
      <div className="space-y-2">
        {KEYWORD_MAP.map((row) => (
          <button
            key={row.sym}
            onClick={() => setActive(row.sym)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition ${
              active === row.sym ? "bg-[#1D1530] border-[#7C3AED]" : "bg-[#0F0A1A] border-[#211934] hover:border-[#7C3AED]/50"
            }`}
          >
            <span className="text-[#E4D9FF]">"{row.kw}"</span>
            <span className={`font-mono text-lg ${active === row.sym ? "text-[#F4B942]" : "text-[#9C93B3]"}`}>{row.sym}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function WorkedExample({ title, sentence, steps, formula }) {
  const [shown, setShown] = useState(0);
  return (
    <Panel className="p-5">
      <p className="text-white font-heading font-semibold">{title}</p>
      <p className="mt-2 text-[#E4D9FF] text-sm italic border-l-2 border-[#7C3AED] pl-3">"{sentence}"</p>
      <div className="mt-4 space-y-3">
        {steps.slice(0, shown).map((s, i) => (
          <div key={i} className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-[#7C3AED]/20 text-[#B48CFF] text-xs font-mono flex items-center justify-center mt-0.5">{i + 1}</span>
            <div>
              <p className="text-sm text-white font-medium">{s.title}</p>
              <p className="text-sm text-[#9C93B3] mt-0.5">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
      {shown < steps.length ? (
        <div className="mt-4">
          <StepButton onClick={() => setShown((s) => s + 1)}>
            Reveal step {shown + 1} <ArrowRight className="w-3.5 h-3.5" />
          </StepButton>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between">
          <div className="font-mono text-lg text-[#F4B942] bg-[#1A1330] px-4 py-2 rounded-lg">{formula}</div>
          <button onClick={() => setShown(0)} className="text-[#9C93B3] hover:text-white text-sm inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      )}
    </Panel>
  );
}

function QuizQuestion({ n, sentence, legend, accepted, hint }) {
  const [val, setVal] = useState("");
  const [status, setStatus] = useState(null); // null | 'correct' | 'wrong'
  const [revealed, setRevealed] = useState(false);

  const check = () => {
    const norm = normalizeAnswer(val);
    const ok = accepted.some((a) => normalizeAnswer(a) === norm);
    setStatus(ok ? "correct" : "wrong");
  };

  return (
    <Panel className="p-5">
      <p className="text-[#F4B942] font-mono text-xs mb-2">QUESTION {n}</p>
      <p className="text-[#E4D9FF] text-sm italic border-l-2 border-[#7C3AED] pl-3">"{sentence}"</p>
      <p className="mt-2 text-[#9C93B3] text-xs">{legend}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setStatus(null);
          }}
          placeholder="Type your answer, e.g. (A ∨ B) → C or (A|B)->C"
          className="flex-1 min-w-[220px] bg-[#0F0A1A] border border-[#2A2140] focus:border-[#7C3AED] outline-none rounded-lg px-3 py-2 text-sm font-mono text-white placeholder:text-[#5B5470]"
        />
        <StepButton onClick={check}>Check</StepButton>
      </div>
      {status === "correct" && (
        <p className="mt-3 text-sm text-[#4ADE80] flex items-center gap-1.5"><Check className="w-4 h-4" /> That matches — nicely translated.</p>
      )}
      {status === "wrong" && (
        <p className="mt-3 text-sm text-[#F87171] flex items-center gap-1.5"><X className="w-4 h-4" /> Not quite the form on file. Recheck which connective wraps the whole sentence.</p>
      )}
      <div className="mt-3 flex items-center gap-3 text-xs">
        <button onClick={() => setRevealed((r) => !r)} className="text-[#9C93B3] hover:text-[#F4B942] inline-flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5" /> {revealed ? "Hide" : "Show"} hint
        </button>
      </div>
      {revealed && <p className="mt-2 text-sm text-[#9C93B3] bg-[#0F0A1A] rounded-lg px-3 py-2">{hint}</p>}
    </Panel>
  );
}

const SEARCH_ITEMS = [
  { id: 1, title: "10 Playful Cat Breeds to Know", tags: ["cats"] },
  { id: 2, title: "Training Your Dog to Sit and Stay", tags: ["dogs"] },
  { id: 3, title: "Cats and Dogs Living Together", tags: ["cats", "dogs"] },
  { id: 4, title: "Best Interactive Cat Toys of 2026", tags: ["cats"] },
  { id: 5, title: "Dog Park Etiquette Guide", tags: ["dogs"] },
  { id: 6, title: "Choosing the Right Pet Bird", tags: [] },
];

function BooleanSearchDemo() {
  const [op, setOp] = useState("AND");
  const results = SEARCH_ITEMS.filter((item) => {
    const hasCat = item.tags.includes("cats");
    const hasDog = item.tags.includes("dogs");
    if (op === "AND") return hasCat && hasDog;
    if (op === "OR") return hasCat || hasDog;
    return hasCat && !hasDog; // NOT
  });
  const queryText = op === "AND" ? "cats AND dogs" : op === "OR" ? "cats OR dogs" : "cats NOT dogs";
  return (
    <Panel className="p-5">
      <p className="text-white font-heading font-semibold flex items-center gap-2"><Search className="w-4 h-4 text-[#B48CFF]" /> Boolean search sandbox</p>
      <p className="text-[#9C93B3] text-sm mt-1">Every keyword combination is a proposition. Swap the connective and watch which articles satisfy it.</p>
      <div className="mt-4 flex gap-2">
        {["AND", "OR", "NOT"].map((o) => (
          <GhostButton key={o} onClick={() => setOp(o)} active={op === o}>{o}</GhostButton>
        ))}
      </div>
      <p className="mt-3 font-mono text-sm text-[#F4B942] bg-[#0F0A1A] inline-block px-3 py-1.5 rounded-lg">{queryText}</p>
      <ul className="mt-4 space-y-1.5">
        {SEARCH_ITEMS.map((item) => {
          const matched = results.some((r) => r.id === item.id);
          return (
            <li key={item.id} className={`text-sm px-3 py-2 rounded-lg border transition ${matched ? "border-[#255239] bg-[#173626]/40 text-white" : "border-[#211934] text-[#5B5470] line-through decoration-[#3A3350]"}`}>
              {item.title}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-[#9C93B3]">{results.length} of {SEARCH_ITEMS.length} results match.</p>
    </Panel>
  );
}

function NetworkAccessDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  const d = a || (!a && b) || c;
  return (
    <Panel className="p-5">
      <p className="text-white font-heading font-semibold">Network access rule</p>
      <p className="text-[#9C93B3] text-sm mt-1">"If the computer is on the local network, or it's off-network with a valid login, or it's the admin, internet is accessible."</p>
      <p className="mt-2 font-mono text-sm text-[#F4B942]">(a ∨ (¬a ∧ b) ∨ c) → d</p>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {[
          { label: "a — on local network", val: a, set: setA },
          { label: "b — has valid login", val: b, set: setB },
          { label: "c — is admin", val: c, set: setC },
        ].map((t) => (
          <button
            key={t.label}
            onClick={() => t.set((v) => !v)}
            className={`text-left rounded-lg border px-3 py-2.5 text-sm transition ${t.val ? "bg-[#1D1530] border-[#7C3AED] text-white" : "bg-[#0F0A1A] border-[#211934] text-[#9C93B3]"}`}
          >
            <div className="flex items-center justify-between">
              <span>{t.label}</span>
              <TF v={t.val} />
            </div>
          </button>
        ))}
      </div>
      <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium border ${d ? "bg-[#173626]/50 border-[#255239] text-[#4ADE80]" : "bg-[#3A1C22]/50 border-[#5C2F37] text-[#F87171]"}`}>
        d = {d ? "TRUE" : "FALSE"} — internet is {d ? "accessible" : "blocked"} for this computer.
      </div>
    </Panel>
  );
}

function LogicGateDemo() {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);
  const [gate, setGate] = useState("AND");
  const out = gate === "AND" ? p && q : gate === "OR" ? p || q : !p;
  const wire = (v) => (v ? "#4ADE80" : "#4A4360");
  return (
    <Panel className="p-5">
      <p className="text-white font-heading font-semibold">Logic circuit — gates are physical operators</p>
      <p className="text-[#9C93B3] text-sm mt-1">AND / OR / NOT gates are hardware implementations of ∧, ∨, ¬. Toggle the inputs and switch gates.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["AND", "OR", "NOT"].map((g) => (
          <GhostButton key={g} onClick={() => setGate(g)} active={gate === g}>{g}</GhostButton>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex flex-col gap-3">
          <button onClick={() => setP((v) => !v)} className="flex items-center gap-2 text-sm text-[#E4D9FF]">
            p <TF v={p} />
          </button>
          {gate !== "NOT" && (
            <button onClick={() => setQ((v) => !v)} className="flex items-center gap-2 text-sm text-[#E4D9FF]">
              q <TF v={q} />
            </button>
          )}
        </div>
        <svg viewBox="0 0 220 120" className="flex-1 max-w-xs h-28">
          <line x1="10" y1="35" x2="80" y2="35" stroke={wire(p)} strokeWidth="3" />
          {gate !== "NOT" && <line x1="10" y1="85" x2="80" y2="85" stroke={wire(q)} strokeWidth="3" />}
          <rect x="80" y="20" width="70" height="80" rx="14" fill="#1A1330" stroke="#7C3AED" strokeWidth="2" />
          <text x="115" y="65" textAnchor="middle" fill="#E4D9FF" fontSize="16" fontFamily="monospace" fontWeight="600">{gate}</text>
          <line x1="150" y1="60" x2="210" y2="60" stroke={wire(out)} strokeWidth="3" />
          <circle cx="212" cy="60" r="6" fill={wire(out)} />
        </svg>
      </div>
      <p className="mt-2 text-sm">
        Output: <span className={out ? "text-[#4ADE80]" : "text-[#F87171]"}>{out ? "TRUE" : "FALSE"}</span>
      </p>
    </Panel>
  );
}

const APPLICATION_CARDS = [
  { id: "translate", label: "1 · Translate English" },
  { id: "system", label: "2 · System Specs" },
  { id: "search", label: "3 · Boolean Search" },
  { id: "circuit", label: "4 · Logic Circuits" },
];

function ApplicationsSection() {
  const [tab, setTab] = useState("translate");
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>APPLICATIONS</Eyebrow>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">Where T/F reasoning actually gets used</h2>
        <p className="mt-2 text-[#9C93B3] max-w-2xl">
          Six places propositional logic shows up in computer science and everyday decisions. Work through each tab.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {APPLICATION_CARDS.map((c) => (
          <GhostButton key={c.id} onClick={() => setTab(c.id)} active={tab === c.id}>{c.label}</GhostButton>
        ))}
      </div>

      {tab === "translate" && (
        <div className="grid lg:grid-cols-2 gap-5">
          <KeywordMap />
          <div className="space-y-5">
            <WorkedExample
              title="Worked example: the free-coffee rule"
              sentence="You can have free coffee if you are a senior citizen and it is a Tuesday."
              steps={[
                { title: "Find the connectives", body: `"and" connects the two conditions; "if" signals the conditional — the whole rule is (condition) → (result).` },
                { title: "Rename the propositions", body: `p: "you are a senior citizen"   q: "it is a Tuesday"   r: "you get free coffee"` },
                { title: "Rewrite in logic", body: "Combine the pieces in the order the sentence implies." },
              ]}
              formula="(p ∧ q) → r"
            />
            <WorkedExample
              title="Worked example: the bookstore rule"
              sentence="You can purchase this book if you have $20, or you have $10 and a discount coupon."
              steps={[
                { title: "Name the propositions", body: `q: "you can purchase this book"   r: "you have $20"   s: "you have $10"   t: "you have a discount coupon"` },
                { title: "Trace the two paths", body: `"$20" alone is enough (r). Otherwise you need BOTH $10 AND a coupon (s ∧ t).` },
                { title: "Join the paths with OR", body: "Either path satisfies the purchase condition, so they're joined with ∨, then the whole thing implies q." },
              ]}
              formula="(r ∨ (s ∧ t)) → q"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <QuizQuestion
                n={1}
                sentence="If you are older than 13, or you are with your parents, then you can attend a PG-13 movie."
                legend="A = older than 13, B = with parents, C = can attend"
                accepted={["(A∨B)→C", "(A|B)->C"]}
                hint={`"or" joins the two conditions with ∨; "then" marks where → goes.`}
              />
              <QuizQuestion
                n={2}
                sentence="You are not allowed to drive a vehicle if your age is less than 18 or you have no age proof."
                legend="q = allowed to drive, r = age < 18, s = have age proof"
                accepted={["(r∨¬s)→¬q", "(r|~s)->~q"]}
                hint={`"not allowed to drive" is ¬q, not a fresh variable. "no age proof" is ¬s.`}
              />
            </div>
          </div>
        </div>
      )}

      {tab === "system" && (
        <Panel className="p-6">
          <p className="text-white font-heading font-semibold">Why not just leave requirements in English?</p>
          <ul className="mt-3 space-y-2 text-sm text-[#9C93B3]">
            <li>• Detects contradictory requirements before a single line of code is written.</li>
            <li>• Makes requirements testable — a logical expression is either satisfied or it isn't.</li>
            <li>• Removes the ambiguity that different engineers might read into plain English.</li>
          </ul>
          <div className="mt-5 border-t border-[#2A2140] pt-5">
            <p className="text-[#F4B942] font-mono text-xs mb-2">WORKED EXAMPLE — NETWORK ACCESS RULE</p>
          </div>
          <NetworkAccessDemo />
        </Panel>
      )}

      {tab === "search" && <BooleanSearchDemo />}
      {tab === "circuit" && <LogicGateDemo />}
    </div>
  );
}

/* =========================================================================
   SECTION 3 — PUZZLES
   ========================================================================= */

function KnightsPuzzle({ onSolved }) {
  const [selected, setSelected] = useState(null);
  const [tried, setTried] = useState({});
  const [solved, setSolved] = useState(false);

  const scenarios = [
    { pA: true, qB: true },
    { pA: true, qB: false },
    { pA: false, qB: false },
    { pA: false, qB: true },
  ].map((row) => {
    const aStatement = row.qB; // A says "B is a knight"
    const bStatement = row.pA !== row.qB; // B says "we are opposite types"
    const aConsistent = aStatement === row.pA;
    const bConsistent = bStatement === row.qB;
    return { ...row, aStatement, bStatement, aConsistent, bConsistent, valid: aConsistent && bConsistent };
  });

  function handlePick(idx) {
    setSelected(idx);
    setTried((t) => ({ ...t, [idx]: true }));
    if (scenarios[idx].valid && !solved) {
      setSolved(true);
      celebrate();
      onSolved?.();
    }
  }

  const row = selected !== null ? scenarios[selected] : null;
  const eliminatedCount = Object.entries(tried).filter(([idx, v]) => v && !scenarios[idx].valid).length;

  return (
    <Panel className="p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-white font-heading font-semibold">Puzzle 1 — The Encounter</p>
        <SolvedBadge solved={solved} />
      </div>
      <p className="text-[#9C93B3] text-sm mt-1">
        Person A says <span className="text-[#E4D9FF]">"B is a knight."</span> Person B says{" "}
        <span className="text-[#E4D9FF]">"The two of us are opposite types."</span> Knights always tell the truth;
        knaves always lie. <span className="text-white">Click a hypothesis and hunt for the one that survives without contradiction.</span>
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-[#9C93B3]">
        <Search className="w-3.5 h-3.5" />
        <span>{eliminatedCount}/3 contradictions eliminated{solved ? " — case closed!" : ""}</span>
      </div>

      <div className="mt-2 space-y-2">
        {scenarios.map((r, idx) => {
          const isSelected = selected === idx;
          const isEliminated = tried[idx] && !r.valid;
          return (
            <button
              key={idx}
              onClick={() => handlePick(idx)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition flex items-center justify-between gap-3 ${
                isSelected
                  ? r.valid
                    ? "bg-[#173626]/50 border-[#255239]"
                    : "bg-[#3A1C22]/50 border-[#5C2F37]"
                  : isEliminated
                  ? "bg-[#0F0A1A] border-[#211934] opacity-40"
                  : "bg-[#0F0A1A] border-[#211934] hover:border-[#7C3AED]/60"
              }`}
            >
              <span className={`text-sm ${isEliminated && !isSelected ? "line-through text-[#5B5170]" : "text-white"}`}>
                A: <strong>{r.pA ? "Knight" : "Knave"}</strong>, B: <strong>{r.qB ? "Knight" : "Knave"}</strong>
              </span>
              {isSelected ? (
                r.valid ? <Check className="w-4 h-4 text-[#4ADE80] shrink-0" /> : <X className="w-4 h-4 text-[#F87171] shrink-0" />
              ) : isEliminated ? (
                <X className="w-4 h-4 text-[#5B5170] shrink-0" />
              ) : (
                <span className="text-xs text-[#5B5170] font-mono shrink-0">test →</span>
              )}
            </button>
          );
        })}
      </div>

      {row && (
        <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${row.valid ? "bg-[#173626]/50" : "bg-[#3A1C22]/50"}`}>
          <p className={`font-semibold mb-1 ${row.valid ? "text-[#4ADE80]" : "text-[#F87171]"}`}>
            {row.valid ? "🎉 Valid solution — no contradiction!" : "✖ Contradiction found"}
          </p>
          <p className="text-[#E4D9FF] font-normal">
            {row.valid
              ? `Both are knaves. A lies claiming "B is a knight"; B lies claiming they're opposite (they're actually the same type). Nothing breaks.`
              : !row.aConsistent
              ? `A is assumed a ${row.pA ? "Knight" : "Knave"}, but A's statement "B is a knight" comes out ${row.aStatement ? "true" : "false"} — a ${row.pA ? "Knight can't lie" : "Knave can't tell the truth"}.`
              : `B is assumed a ${row.qB ? "Knight" : "Knave"}, but B's statement "we're opposite" comes out ${row.bStatement ? "true" : "false"} — a ${row.qB ? "Knight can't lie" : "Knave can't tell the truth"}.`}
          </p>
        </div>
      )}
    </Panel>
  );
}

function TrunksPuzzle({ onSolved }) {
  const [guess, setGuess] = useState(null);
  const [tried, setTried] = useState({});
  const [solved, setSolved] = useState(false);

  const worlds = [1, 2, 3].map((n) => {
    const p1 = n === 1;
    const p2 = n === 2;
    const insc1 = !p1; // trunk 1: "this is empty"
    const insc2 = !p2; // trunk 2: "this is empty"
    const insc3 = p2; // trunk 3: "treasure is in trunk 2"
    const trueCount = [insc1, insc2, insc3].filter(Boolean).length;
    return { n, insc1, insc2, insc3, trueCount, valid: trueCount === 1 };
  });

  function handleGuess(n) {
    setGuess(n);
    setTried((t) => ({ ...t, [n]: true }));
    if (worlds[n - 1].valid && !solved) {
      setSolved(true);
      celebrate();
      onSolved?.();
    }
  }

  const active = guess ? worlds[guess - 1] : null;

  return (
    <Panel className="p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-white font-heading font-semibold">Puzzle 2 — Three Trunks</p>
        <SolvedBadge solved={solved} />
      </div>
      <p className="text-[#9C93B3] text-sm mt-1">
        The Queen's rule: <span className="text-[#E4D9FF]">exactly one</span> inscription is true, the other two are false.
        <span className="text-white"> Open a trunk to test whether the treasure could really be there.</span>
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {worlds.map((w) => {
          const isGuess = guess === w.n;
          const isEliminated = tried[w.n] && !w.valid;
          return (
            <button
              key={w.n}
              onClick={() => handleGuess(w.n)}
              className={`relative rounded-xl border px-3 py-4 text-center transition ${
                isGuess
                  ? w.valid
                    ? "bg-[#173626]/50 border-[#255239]"
                    : "bg-[#3A1C22]/50 border-[#5C2F37]"
                  : isEliminated
                  ? "bg-[#0F0A1A] border-[#211934] opacity-40"
                  : "bg-[#0F0A1A] border-[#211934] hover:border-[#7C3AED]/60"
              }`}
            >
              <div className="text-2xl mb-1">🎁</div>
              <p className="text-white font-heading font-semibold">Trunk {w.n}</p>
              <p className="text-[10px] text-[#9C93B3] mt-1">{w.n === 3 ? '"Treasure in Trunk 2"' : '"This trunk is empty"'}</p>
              {isEliminated && !isGuess && <span className="absolute top-1.5 right-1.5 text-[#F87171] text-xs">✖</span>}
              {isGuess && <span className="absolute top-1.5 right-1.5 text-xs">{w.valid ? "✔" : "✖"}</span>}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="mt-4">
          <p className="text-xs text-[#9C93B3] mb-2">Evaluating hypothesis: treasure is in Trunk {active.n}</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[active.insc1, active.insc2, active.insc3].map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1 bg-[#0F0A1A] rounded-lg py-2 border border-[#211934]">
                <span className="text-[#9C93B3] text-xs">Inscription {i + 1}</span>
                <TF v={v} />
              </div>
            ))}
          </div>
          <div className={`mt-3 rounded-lg px-4 py-3 text-sm font-medium ${active.valid ? "bg-[#173626]/50 text-[#4ADE80]" : "bg-[#3A1C22]/50 text-[#F87171]"}`}>
            {active.trueCount} true inscription{active.trueCount === 1 ? "" : "s"} —{" "}
            {active.valid
              ? `🎉 satisfies the Queen's rule! The treasure really is in Trunk ${active.n}.`
              : "violates the Queen's rule (needs exactly one). Try another trunk."}
          </div>
        </div>
      )}
    </Panel>
  );
}

function MuddyPuzzle({ onSolved }) {
  const [state, setState] = useState(null); // null | "FT" | "TF" | "TT"
  const [round, setRound] = useState(0); // 0: choose reality, 1: round 1 revealed, 2: round 2 (aha!) revealed
  const [solved, setSolved] = useState(false);

  const s = state ? state[0] === "T" : null;
  const d = state ? state[1] === "T" : null;

  let round1Son, round1Daughter;
  if (state) {
    round1Son = !d
      ? "Yes — sees a clean sibling, so by the father's rule (s ∨ d) his own must be muddy."
      : "No — sees mud on his sibling, so the father's rule is already satisfied either way.";
    round1Daughter = !s
      ? "Yes — sees a clean sibling, so her own must be muddy."
      : "No — sees mud on her sibling, so she can't yet tell about herself.";
  }
  const bothCleanCase = state === "TT";

  function pickState(key) {
    setState(key);
    setRound(1);
  }

  function askAgain() {
    setRound(2);
    if (bothCleanCase && !solved) {
      setSolved(true);
      celebrate();
      onSolved?.();
    }
  }

  function reset() {
    setState(null);
    setRound(0);
  }

  return (
    <Panel className="p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-white font-heading font-semibold">Puzzle 3 — The Muddy Foreheads</p>
        <div className="flex items-center gap-2">
          <SolvedBadge solved={solved} />
          {state && (
            <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-[#9C93B3] hover:text-white">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>
      <p className="text-[#9C93B3] text-sm mt-1">
        Father: <span className="text-[#E4D9FF]">"At least one of you has a muddy forehead"</span> (s ∨ d ≡ True). Each
        child sees only the other's forehead, never their own.
      </p>

      {round === 0 && (
        <div className="mt-4">
          <p className="text-xs font-mono text-[#B48CFF] mb-2">Phase 1 of 3 — pick the real situation to start the story</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "FT", label: "Son clean, daughter muddy" },
              { key: "TF", label: "Son muddy, daughter clean" },
              { key: "TT", label: "Both muddy" },
            ].map((o) => (
              <button
                key={o.key}
                onClick={() => pickState(o.key)}
                className="rounded-lg border px-3 py-2.5 text-xs text-center transition bg-[#0F0A1A] border-[#211934] text-[#9C93B3] hover:border-[#7C3AED]/60 hover:text-white"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {round >= 1 && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-mono text-[#B48CFF]">Phase 2 of 3 — round 1: "Do you know your own forehead?"</p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-[#0F0A1A] rounded-lg p-3 border border-[#211934]">
              <p className="text-[#F4B942] font-mono text-xs mb-1">SON ANSWERS</p>
              <p className="text-[#E4D9FF]">{round1Son}</p>
            </div>
            <div className="bg-[#0F0A1A] rounded-lg p-3 border border-[#211934]">
              <p className="text-[#F4B942] font-mono text-xs mb-1">DAUGHTER ANSWERS</p>
              <p className="text-[#E4D9FF]">{round1Daughter}</p>
            </div>
          </div>

          {round === 1 && bothCleanCase && (
            <button
              onClick={askAgain}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#A66CFF] text-white font-medium text-xs hover:brightness-110 transition"
            >
              Both said "No" — father asks again! <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {round === 1 && !bothCleanCase && (
            <div className="rounded-lg px-4 py-3 text-sm bg-[#1A1330] border border-[#2A2140] text-[#E4D9FF]">
              The puzzle already resolved in round 1 — no second round needed for this state.
            </div>
          )}
        </div>
      )}

      {round === 2 && (
        <div className="mt-4">
          <p className="text-xs font-mono text-[#B48CFF] mb-2">Phase 3 of 3 — round 2: the "aha!" moment</p>
          <div className="rounded-lg p-4 bg-[#173626]/50 border border-[#255239] text-sm space-y-2">
            <p className="font-semibold text-[#4ADE80]">🎉 Both children answer "Yes!" simultaneously.</p>
            <p className="text-[#E4D9FF]">
              <strong>The son's deduction:</strong>{" "}
              <em>
                "If I were clean, my sister would have seen a clean face on me. She'd immediately know SHE must be the
                muddy one, and she'd have said 'Yes' in round 1. But she said 'No' — so I must be muddy too!"
              </em>
            </p>
            <p className="text-[#E4D9FF]">
              The daughter runs the exact same reasoning at the exact same instant. Both shout <strong>"Yes!"</strong> together.
            </p>
          </div>
        </div>
      )}
    </Panel>
  );
}

function PuzzlesSection() {
  const [tab, setTab] = useState("knights");
  const [solvedMap, setSolvedMap] = useState({ knights: false, trunks: false, muddy: false });
  const solvedCount = Object.values(solvedMap).filter(Boolean).length;
  const allSolved = solvedCount === 3;

  function markSolved(key) {
    setSolvedMap((m) => (m[key] ? m : { ...m, [key]: true }));
  }

  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>LOGIC PUZZLES</Eyebrow>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">Solve by systematic elimination</h2>
        <p className="mt-2 text-[#9C93B3] max-w-2xl">Map every combination, apply the constraints, and throw out anything contradictory. Three classic puzzles — click, test, eliminate, and get a burst of confetti when the logic clicks into place.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <GhostButton onClick={() => setTab("knights")} active={tab === "knights"}>
            1 · Knights & Knaves {solvedMap.knights && "✓"}
          </GhostButton>
          <GhostButton onClick={() => setTab("trunks")} active={tab === "trunks"}>
            2 · Three Trunks {solvedMap.trunks && "✓"}
          </GhostButton>
          <GhostButton onClick={() => setTab("muddy")} active={tab === "muddy"}>
            3 · Muddy Foreheads {solvedMap.muddy && "✓"}
          </GhostButton>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#9C93B3]">
          <Trophy className="w-4 h-4 text-[#F4B942]" />
          <span>{solvedCount}/3 puzzles solved</span>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-[#1A1330] overflow-hidden -mt-4">
        <div
          className="h-full bg-gradient-to-r from-[#7C3AED] to-[#4ADE80] transition-all duration-500"
          style={{ width: `${(solvedCount / 3) * 100}%` }}
        />
      </div>

      {tab === "knights" && <KnightsPuzzle onSolved={() => markSolved("knights")} />}
      {tab === "trunks" && <TrunksPuzzle onSolved={() => markSolved("trunks")} />}
      {tab === "muddy" && <MuddyPuzzle onSolved={() => markSolved("muddy")} />}

      {allSolved && (
        <div className="rounded-xl border border-[#4ADE80]/40 bg-[#173626]/40 px-4 py-3 text-sm text-[#4ADE80] font-medium flex items-center gap-2">
          <PartyPopper className="w-4 h-4" /> All three puzzles cracked — you think like a systematic elimination engine now!
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   SECTION 4 — EQUIVALENCES
   ========================================================================= */

const CLASSIFICATIONS = [
  { name: "Tautology", expr: "p ∨ ¬p", desc: "Always true, for every combination of inputs.", color: "#4ADE80" },
  { name: "Contradiction", expr: "p ∧ ¬p", desc: "Always false, for every combination of inputs.", color: "#F87171" },
  { name: "Contingency", expr: "p → q", desc: "Neither always true nor always false — depends on p and q.", color: "#F4B942" },
];

function ClassificationCard({ item }) {
  const tree = useMemo(() => compile(item.expr), [item.expr]);
  const vars = useMemo(() => Array.from(extractVars(tree)).sort(), [tree]);
  const rows = useMemo(
    () => allCombos(vars).map((env) => ({ env, values: { r: evalNode(tree, env) } })),
    [tree, vars]
  );
  return (
    <Panel className="p-5">
      <p className="font-heading font-semibold" style={{ color: item.color }}>{item.name}</p>
      <p className="text-[#9C93B3] text-sm mt-1">{item.desc}</p>
      <p className="mt-2 font-mono text-lg text-[#E4D9FF]">{item.expr}</p>
      <div className="mt-3">
        <TruthTable vars={vars} columns={[{ key: "r", label: item.expr }]} rows={rows} />
      </div>
    </Panel>
  );
}

const LAW_FAMILIES = [
  { name: "Identity laws", laws: ["p ∧ T ≡ p", "p ∨ F ≡ p"] },
  { name: "Domination laws", laws: ["p ∨ T ≡ T", "p ∧ F ≡ F"] },
  { name: "Idempotent laws", laws: ["p ∨ p ≡ p", "p ∧ p ≡ p"] },
  { name: "Double negation law", laws: ["¬(¬p) ≡ p"] },
  { name: "Commutative laws", laws: ["p ∨ q ≡ q ∨ p", "p ∧ q ≡ q ∧ p"] },
  { name: "Associative laws", laws: ["(p ∨ q) ∨ r ≡ p ∨ (q ∨ r)", "(p ∧ q) ∧ r ≡ p ∧ (q ∧ r)"] },
  { name: "Distributive laws", laws: ["p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)", "p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)"] },
  { name: "De Morgan's laws", laws: ["¬(p ∧ q) ≡ ¬p ∨ ¬q", "¬(p ∨ q) ≡ ¬p ∧ ¬q"], tip: `"Break the negation apart, flip the connective."` },
  { name: "Absorption laws", laws: ["p ∨ (p ∧ q) ≡ p", "p ∧ (p ∨ q) ≡ p"] },
  { name: "Negation laws", laws: ["p ∨ ¬p ≡ T", "p ∧ ¬p ≡ F"] },
  { name: "Conditional equivalences", laws: ["p → q ≡ ¬p ∨ q", "p → q ≡ ¬q → ¬p", "¬(p → q) ≡ p ∧ ¬q"], tip: "The contrapositive (¬q → ¬p) is always identical to p → q — the converse (q → p) is not." },
  { name: "Biconditional equivalences", laws: ["p ↔ q ≡ (p → q) ∧ (q → p)", "p ↔ q ≡ (p ∧ q) ∨ (¬p ∧ ¬q)", "¬(p ↔ q) ≡ p ↔ ¬q"] },
];

function LawAccordionItem({ family }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#2A2140] overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-4 py-3 bg-[#130E20] hover:bg-[#1A1330] transition">
        <span className="text-white font-medium text-sm">{family.name}</span>
        <ChevronDown className={`w-4 h-4 text-[#7C3AED] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 py-3 bg-[#0F0A1A] space-y-1.5">
          {family.laws.map((l) => (
            <p key={l} className="font-mono text-sm text-[#E4D9FF]">{l}</p>
          ))}
          {family.tip && <p className="text-xs text-[#9C93B3] mt-2 italic">{family.tip}</p>}
        </div>
      )}
    </div>
  );
}

function ProofStepper({ title, steps, result }) {
  const [shown, setShown] = useState(1);
  return (
    <Panel className="p-5">
      <p className="text-white font-heading font-semibold">{title}</p>
      <div className="mt-3 space-y-1.5 font-mono text-sm">
        {steps.slice(0, shown).map((s, i) => (
          <div key={i} className="flex items-baseline gap-3">
            <span className="text-[#E4D9FF]">{i === 0 ? "" : "≡"} {s.eq}</span>
            {i > 0 && <span className="text-xs text-[#9C93B3] font-sans not-italic">{s.reason}</span>}
          </div>
        ))}
      </div>
      {shown < steps.length ? (
        <div className="mt-4">
          <StepButton onClick={() => setShown((s) => s + 1)}>Next step <ArrowRight className="w-3.5 h-3.5" /></StepButton>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-[#4ADE80] flex items-center gap-1.5"><Check className="w-4 h-4" /> {result}</span>
          <button onClick={() => setShown(1)} className="text-[#9C93B3] hover:text-white text-sm inline-flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      )}
    </Panel>
  );
}

const PRESETS = [
  { name: "Definition of →", a: "p→q", b: "¬p∨q" },
  { name: "De Morgan's (∧)", a: "¬(p∧q)", b: "¬p∨¬q" },
  { name: "Contrapositive", a: "p→q", b: "¬q→¬p" },
  { name: "Distributive", a: "p∨(q∧r)", b: "(p∨q)∧(p∨r)" },
  { name: "Converse trap", a: "p→q", b: "q→p" },
];

function EquivalenceLab() {
  const [exprA, setExprA] = useState("p→q");
  const [exprB, setExprB] = useState("¬p∨q");
  const [activeField, setActiveField] = useState("A");
  const [result, setResult] = useState(null);
  const refA = useRef(null);
  const refB = useRef(null);

  const insert = (sym) => {
    const isA = activeField === "A";
    const ref = isA ? refA : refB;
    const val = isA ? exprA : exprB;
    const setVal = isA ? setExprA : setExprB;
    const el = ref.current;
    if (!el) {
      setVal(val + sym);
      return;
    }
    const start = el.selectionStart ?? val.length;
    const end = el.selectionEnd ?? val.length;
    const next = val.slice(0, start) + sym + val.slice(end);
    setVal(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + sym.length;
    });
  };

  const run = () => {
    try {
      const treeA = compile(exprA);
      const varsSet = extractVars(treeA);
      let treeB = null;
      if (exprB.trim()) {
        treeB = compile(exprB);
        extractVars(treeB, varsSet);
      }
      const vars = Array.from(varsSet).sort();
      if (vars.length === 0) throw new Error("Use at least one of p, q, r, s");
      if (vars.length > 4) throw new Error("Stick to 4 variables or fewer");
      const rows = allCombos(vars).map((env) => {
        const va = evalNode(treeA, env);
        const vb = treeB ? evalNode(treeB, env) : null;
        return { env, values: treeB ? { a: va, b: vb } : { a: va } };
      });
      const allTrue = rows.every((r) => r.values.a);
      const allFalse = rows.every((r) => !r.values.a);
      const classA = allTrue ? "Tautology" : allFalse ? "Contradiction" : "Contingency";
      const equivalent = treeB ? rows.every((r) => r.values.a === r.values.b) : null;
      setResult({ vars, rows, classA, equivalent, hasB: !!treeB });
    } catch (e) {
      setResult({ error: e.message });
    }
  };

  const loadPreset = (p) => {
    setExprA(p.a);
    setExprB(p.b);
    setTimeout(run, 0);
  };

  return (
    <Panel className="p-6">
      <p className="text-white font-heading font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#F4B942]" /> Equivalence & classification lab</p>
      <p className="text-[#9C93B3] text-sm mt-1">
        Type an expression to classify it, or fill both fields to test for equivalence — the real proof method from
        today: build both truth tables and compare the final columns. Use p, q, r, s and ¬ ∧ ∨ → ↔ (or ASCII ~ & | -&gt; &lt;-&gt;).
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <GhostButton key={p.name} onClick={() => loadPreset(p)}>{p.name}</GhostButton>
        ))}
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <input
          ref={refA}
          value={exprA}
          onFocus={() => setActiveField("A")}
          onChange={(e) => setExprA(e.target.value)}
          placeholder="Expression A, e.g. p→q"
          className="bg-[#0F0A1A] border border-[#2A2140] focus:border-[#7C3AED] outline-none rounded-lg px-3 py-2.5 text-sm font-mono text-white placeholder:text-[#5B5470]"
        />
        <input
          ref={refB}
          value={exprB}
          onFocus={() => setActiveField("B")}
          onChange={(e) => setExprB(e.target.value)}
          placeholder="Expression B (optional), e.g. ¬p∨q"
          className="bg-[#0F0A1A] border border-[#2A2140] focus:border-[#7C3AED] outline-none rounded-lg px-3 py-2.5 text-sm font-mono text-white placeholder:text-[#5B5470]"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {["¬", "∧", "∨", "→", "↔", "(", ")", "p", "q", "r", "s"].map((s) => (
          <button key={s} onClick={() => insert(s)} className="w-9 h-9 rounded-lg bg-[#1A1330] border border-[#2A2140] text-[#E4D9FF] font-mono hover:border-[#7C3AED] transition">
            {s}
          </button>
        ))}
        <StepButton onClick={run}>Check <ArrowRight className="w-3.5 h-3.5" /></StepButton>
      </div>

      {result?.error && <p className="mt-4 text-sm text-[#F87171]">{result.error}</p>}

      {result && !result.error && (
        <div className="mt-5 space-y-4">
          <TruthTable
            vars={result.vars}
            columns={result.hasB ? [{ key: "a", label: exprA }, { key: "b", label: exprB }] : [{ key: "a", label: exprA }]}
            rows={result.rows}
          />
          <div className="flex flex-wrap gap-3">
            <span className="text-sm px-3 py-1.5 rounded-lg bg-[#1A1330] border border-[#2A2140] text-[#E4D9FF]">
              A classifies as <strong style={{ color: result.classA === "Tautology" ? "#4ADE80" : result.classA === "Contradiction" ? "#F87171" : "#F4B942" }}>{result.classA}</strong>
            </span>
            {result.hasB && (
              <span className={`text-sm px-3 py-1.5 rounded-lg border font-medium ${result.equivalent ? "bg-[#173626]/50 border-[#255239] text-[#4ADE80]" : "bg-[#3A1C22]/50 border-[#5C2F37] text-[#F87171]"}`}>
                {result.equivalent ? "Equivalent — columns match on every row" : "Not equivalent — columns diverge somewhere"}
              </span>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}

function EquivalencesSection() {
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>PROPOSITIONAL EQUIVALENCE</Eyebrow>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">When different-looking statements mean the same thing</h2>
        <p className="mt-2 text-[#9C93B3] max-w-2xl">
          Two propositions are logically equivalent (p ≡ q) if they share the same truth value in every case. Classify
          a statement, browse the laws, then prove things yourself in the lab below.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {CLASSIFICATIONS.map((c) => (
          <ClassificationCard key={c.name} item={c} />
        ))}
      </div>

      <div>
        <p className="text-white font-heading font-semibold mb-3">The laws of equivalence</p>
        <div className="grid md:grid-cols-2 gap-3">
          {LAW_FAMILIES.map((f) => (
            <LawAccordionItem key={f.name} family={f} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <ProofStepper
          title="Worked proof: ¬(p → q) ≡ p ∧ ¬q"
          steps={[
            { eq: "¬(p → q)" },
            { eq: "¬(¬p ∨ q)", reason: "definition of →" },
            { eq: "¬(¬p) ∧ ¬q", reason: "De Morgan's law" },
            { eq: "p ∧ ¬q", reason: "double negation law" },
          ]}
          result="Proved without a single truth table row."
        />
        <ProofStepper
          title="Worked proof: (p ∧ q) → (p ∨ q) ≡ T"
          steps={[
            { eq: "(p ∧ q) → (p ∨ q)" },
            { eq: "¬(p ∧ q) ∨ (p ∨ q)", reason: "definition of →" },
            { eq: "(¬p ∨ ¬q) ∨ (p ∨ q)", reason: "De Morgan's law" },
            { eq: "(¬p ∨ p) ∨ (¬q ∨ q)", reason: "commutativity & associativity" },
            { eq: "T ∨ T", reason: "negation law" },
            { eq: "T", reason: "domination law" },
          ]}
          result="A tautology, confirmed by the law chain."
        />
      </div>

      <EquivalenceLab />
    </div>
  );
}

/* =========================================================================
   APP SHELL
   ========================================================================= */

const NAV = [
  { id: "refresher", n: "01", label: "Refresher" },
  { id: "applications", n: "02", label: "Applications" },
  { id: "puzzles", n: "03", label: "Puzzles" },
  { id: "equivalences", n: "04", label: "Equivalences" },
];

export default function App() {
  const [tab, setTab] = useState("refresher");

  return (
    <div className="min-h-screen bg-[#0A0714] text-[#F3F0FA]" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-heading { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <header className="border-b border-[#211934] px-6 py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs text-[#B48CFF] tracking-wide">WEEK 2 OF 16 · DISCRETE MATHEMATICS</p>
          <h1 className="font-heading text-3xl md:text-5xl font-semibold text-white mt-3 leading-tight">
            Propositional Logic, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A66CFF] to-[#F4B942]">Interactively</span>
          </h1>
          <p className="text-[#9C93B3] mt-3 max-w-xl">
            Applications, logical equivalences, and inference — worked through with your own hands instead of a
            static slide.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 font-mono text-sm text-[#5B5470]">
            <span className="px-3 py-1.5 rounded-lg bg-[#130E20] border border-[#2A2140]">p → q ≡ ¬p ∨ q</span>
            <span className="px-3 py-1.5 rounded-lg bg-[#130E20] border border-[#2A2140]">¬(p ∧ q) ≡ ¬p ∨ ¬q</span>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-10 backdrop-blur bg-[#0A0714]/90 border-b border-[#211934]">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap gap-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition border ${
                tab === item.id
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#A66CFF] text-white border-transparent"
                  : "bg-[#130E20] text-[#9C93B3] border-[#2A2140] hover:border-[#7C3AED]/60 hover:text-[#E4D9FF]"
              }`}
            >
              <span className="font-mono text-xs opacity-70">{item.n}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {tab === "refresher" && <RefresherSection />}
        {tab === "applications" && <ApplicationsSection />}
        {tab === "puzzles" && <PuzzlesSection />}
        {tab === "equivalences" && <EquivalencesSection />}
      </main>

      <footer className="border-t border-[#211934] px-6 py-8 text-center text-sm text-[#5B5470]">
        Week 3 next: Predicates & Quantifiers, Nested Quantifiers. Review today's laws before class.
      </footer>
    </div>
  );
}
