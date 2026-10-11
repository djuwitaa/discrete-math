import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { CodeBlock } from "../shared/CodeBlock";
import { Reflection } from "../shared/Reflection";
import { Quiz } from "../shared/Quiz";
import { SectionHeader, Btn } from "../shared/SectionHeader";

function SumRule() {
  const [lang, setLang] = useState(3);
  const [art, setArt] = useState(5);
  return (
    <Panel>
      <SectionTitle title="The sum rule">
        If a task can be done in n₁ ways OR n₂ ways, and the two sets of ways never overlap, there are n₁ + n₂ ways. Use it for mutually exclusive alternatives: you do one task or the other, never both.
      </SectionTitle>
      <p className="mt-2 text-sm text-[#C9BFE3]">A student picks ONE elective: language courses OR art courses.</p>
      <div className="mt-3 grid sm:grid-cols-2 gap-3 max-w-lg">
        <label className="text-xs text-[#C9BFE3]">language courses: <span className="font-mono text-[#F4B942]">{lang}</span><input type="range" min="0" max="8" value={lang} onChange={(e) => setLang(+e.target.value)} className="w-full accent-[#7C3AED]" /></label>
        <label className="text-xs text-[#C9BFE3]">art courses: <span className="font-mono text-[#F4B942]">{art}</span><input type="range" min="0" max="8" value={art} onChange={(e) => setArt(+e.target.value)} className="w-full accent-[#7C3AED]" /></label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {Array.from({ length: lang }, (_, i) => <span key={`l${i}`} className="px-3 py-1 rounded-lg bg-[#7C3AED]/30 border border-[#7C3AED] text-xs font-mono text-white">Lang {i + 1}</span>)}
        {Array.from({ length: art }, (_, i) => <span key={`a${i}`} className="px-3 py-1 rounded-lg bg-[#F4B942]/20 border border-[#F4B942] text-xs font-mono text-white">Art {i + 1}</span>)}
      </div>
      <p className="mt-3 font-mono text-[#4ADE80]">{lang} + {art} = {lang + art} choices</p>
      <p className="mt-2 text-xs text-[#9C93B3]">Common trap: using the sum rule when the tasks are really sequential (that needs a product), or the other way round.</p>
    </Panel>
  );
}

function ProductTree() {
  const [colors, setColors] = useState(2);
  const [sizes, setSizes] = useState(2);
  const [shirt, setShirt] = useState(false);
  const C = ["Red", "Blue", "Green"].slice(0, colors);
  const S = ["S", "M", "L"].slice(0, sizes);
  const leaves = colors * sizes;
  const W = 420;
  const lw = W / leaves;
  return (
    <Panel>
      <SectionTitle title="The product rule as a decision tree">
        If a procedure has two steps, with n₁ ways for the first and n₂ ways for the second whatever the first was, there are n₁ · n₂ ways in total. Each branch at level 1 spawns a full copy of the level 2 branches.
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <Btn onClick={() => setColors(colors % 3 + 1)}>colors: {colors}</Btn>
        <Btn onClick={() => setSizes(sizes % 3 + 1)}>sizes: {sizes}</Btn>
        <Btn active={shirt} onClick={() => setShirt(!shirt)}>highlight a path</Btn>
      </div>
      <svg viewBox={`0 0 ${W} 200`} className="mt-3 w-full h-auto rounded-lg bg-[#0A0714] border border-[#2A2140]">
        <circle cx={W / 2} cy="20" r="8" fill="#B48CFF" />
        {C.map((c, i) => {
          const cx = ((i + 0.5) * W) / colors;
          return (
            <g key={c}>
              <line x1={W / 2} y1="20" x2={cx} y2="85" stroke="#5B5470" />
              <text x={cx} y="78" textAnchor="middle" fill="#F4B942" fontSize="12" fontFamily="Poppins, sans-serif">{c}</text>
              <circle cx={cx} cy="90" r="6" fill="#F4B942" />
              {S.map((s, j) => {
                const li = i * sizes + j;
                const lx = (li + 0.5) * lw;
                const hot = shirt && i === 0 && j === 0;
                return (
                  <g key={s}>
                    <line x1={cx} y1="90" x2={lx} y2="160" stroke={hot ? "#4ADE80" : "#5B5470"} strokeWidth={hot ? 3 : 1} />
                    <circle cx={lx} cy="165" r="9" fill={hot ? "#4ADE80" : "#7C3AED"} />
                    <text x={lx} y="190" textAnchor="middle" fill="#E4D9FF" fontSize="11" fontFamily="Consolas, monospace">{c[0]}{s}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <p className="mt-2 font-mono text-[#4ADE80]">{colors} colors × {sizes} sizes = {leaves} leaves = {leaves} outcomes</p>
      <p className="text-xs text-[#9C93B3]">Count the leaves: the number of root to leaf paths is exactly the number of outcomes.</p>
    </Panel>
  );
}

const QUESTIONS = [
  { t: "Choose a main dish from 4 or a soup from 3, only one item.", rule: "sum", n: 7 },
  { t: "Build an outfit: 5 shirts and 3 trousers, one of each.", rule: "product", n: 15 },
  { t: "A 3 digit PIN, each digit 0 to 9.", rule: "product", n: 1000 },
  { t: "Travel from A to B by 2 buses or 3 trains (one trip).", rule: "sum", n: 5 },
];

function Classifier() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const q = QUESTIONS[i];
  return (
    <Panel>
      <SectionTitle title="Which rule applies?" />
      <p className="mt-2 text-sm text-[#E4D9FF]">{q.t}</p>
      <div className="mt-3 flex gap-2"><Btn onClick={() => setPick("sum")}>Sum rule</Btn><Btn onClick={() => setPick("product")}>Product rule</Btn></div>
      {pick && <p className={`mt-3 text-sm ${pick === q.rule ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{pick === q.rule ? `Correct. Answer: ${q.n}.` : `Not quite. This one uses the ${q.rule} rule. Answer: ${q.n}.`}</p>}
      <div className="mt-3"><Btn onClick={() => { setI((i + 1) % QUESTIONS.length); setPick(null); }}>Next question</Btn></div>
    </Panel>
  );
}

function InclusionExclusionCount() {
  const [a, setA] = useState(10);
  const [b, setB] = useState(8);
  const [both, setBoth] = useState(3);
  const safeBoth = Math.min(both, a, b);
  return (
    <Panel>
      <SectionTitle title="Subtraction rule (inclusion-exclusion)">
        When two ways can overlap, the sum rule double counts. Subtract the overlap: n₁ + n₂ - (ways common to both).
      </SectionTitle>
      <div className="mt-3 grid sm:grid-cols-3 gap-3 max-w-xl">
        {[["students taking Math", a, setA], ["students taking CS", b, setB], ["taking both", both, setBoth]].map(([l, v, f]) => (
          <label key={l} className="text-xs text-[#C9BFE3]">{l}: <span className="font-mono text-[#F4B942]">{v}</span><input type="range" min="0" max="20" value={v} onChange={(e) => f(+e.target.value)} className="w-full accent-[#7C3AED]" /></label>
        ))}
      </div>
      <p className="mt-3 font-mono text-sm text-[#4ADE80]">{a} + {b} - {safeBoth} = {a + b - safeBoth} students in at least one course</p>
    </Panel>
  );
}

function PasswordSpace() {
  const [len, setLen] = useState(8);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(false);
  const [digit, setDigit] = useState(false);
  const [sym, setSym] = useState(false);
  const size = (lower ? 26 : 0) + (upper ? 26 : 0) + (digit ? 10 : 0) + (sym ? 32 : 0);
  const total = Math.pow(size, len);
  const perSec = 1e10;
  const secs = total / perSec;
  const human = secs < 1 ? "under a second" : secs < 3600 ? `${(secs / 60).toFixed(1)} minutes` : secs < 86400 * 365 ? `${(secs / 86400).toFixed(1)} days` : `${(secs / 86400 / 365).toExponential(2)} years`;
  return (
    <Panel>
      <SectionTitle title="Password space calculator (product rule in security)">
        Each position is an independent choice, so the number of passwords is (alphabet size) to the power (length).
      </SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn active={lower} onClick={() => setLower(!lower)}>a-z (26)</Btn>
        <Btn active={upper} onClick={() => setUpper(!upper)}>A-Z (26)</Btn>
        <Btn active={digit} onClick={() => setDigit(!digit)}>0-9 (10)</Btn>
        <Btn active={sym} onClick={() => setSym(!sym)}>symbols (32)</Btn>
      </div>
      <label className="mt-3 block max-w-sm text-xs text-[#C9BFE3]">length: <span className="font-mono text-[#F4B942]">{len}</span><input type="range" min="1" max="16" value={len} onChange={(e) => setLen(+e.target.value)} className="w-full accent-[#7C3AED]" /></label>
      <p className="mt-3 font-mono text-sm text-[#E4D9FF]">{size}^{len} = {size === 0 ? 0 : total.toExponential(3)} passwords</p>
      <p className="font-mono text-sm text-[#F4B942]">At 10 billion guesses per second, brute force takes about {size === 0 ? "n/a" : human}.</p>
    </Panel>
  );
}

function ByteToggler() {
  const [bits, setBits] = useState([0, 1, 0, 0, 0, 0, 0, 1]);
  const value = bits.reduce((v, b) => v * 2 + b, 0);
  return (
    <Panel>
      <SectionTitle title="Byte toggler">
        A byte has 8 bits, each either 0 or 1. By the product rule there are 2 · 2 · 2 · 2 · 2 · 2 · 2 · 2 = 2⁸ = 256 distinct bytes.
      </SectionTitle>
      <div className="mt-3 flex gap-1 sm:gap-2">
        {bits.map((b, i) => (
          <button key={i} onClick={() => setBits(bits.map((x, j) => (j === i ? 1 - x : x)))} className={`w-9 h-12 sm:w-11 sm:h-14 rounded-lg font-mono text-xl border touch-manipulation ${b ? "bg-[#7C3AED] border-[#B48CFF] text-white" : "bg-[#0A0714] border-[#2A2140] text-[#9C93B3]"}`}>{b}</button>
        ))}
      </div>
      <p className="mt-3 font-mono text-sm text-[#4ADE80]">value = {value}, character = {value >= 32 && value < 127 ? `'${String.fromCharCode(value)}'` : "(not printable)"}</p>
      <p className="font-mono text-xs text-[#9C93B3]">Range 0 to 255, which is {2 ** 8} values.</p>
    </Panel>
  );
}

export default function CountingRulesSection() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="WEEK 5 · SUM AND PRODUCT RULES" title="Counting: Sum and Product Rules">
        The two basic tools for counting without listing everything.
      </SectionHeader>
      <SumRule />
      <ProductTree />
      <Classifier />
      <InclusionExclusionCount />
      <PasswordSpace />
      <ByteToggler />
      <CodeBlock title="python: verify counts by brute force" code={`from itertools import product\n\ncolors, sizes = ["R", "B"], ["S", "M"]\nprint(len(list(product(colors, sizes))))      # 4, product rule\n\nprint(len(["fr", "de", "es"] + ["a1", "a2", "a3", "a4", "a5"]))  # 8, sum rule\n\nprint(len(list(product("01", repeat=8))))      # 256 bytes`} />

      <WorkedExample
        tag="WORKED EXAMPLE 1"
        title="License plates"
        given={[<p key="g">A plate has 3 letters followed by 3 digits. Letters and digits may repeat.</p>]}
        asked={[<p key="a">How many plates exist?</p>]}
        steps={[
          { title: "Six independent choices", formula: "26 · 26 · 26 · 10 · 10 · 10" },
          { title: "Compute", formula: "17,576 · 1,000 = 17,576,000" },
        ]}
        answer="17,576,000 plates."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 2"
        title="No repeated digits"
        given={[<p key="g">A 4 digit code uses digits 0 to 9 with no repeats.</p>]}
        asked={[<p key="a">How many codes?</p>]}
        steps={[
          { title: "Each choice shrinks the pool", formula: "10 · 9 · 8 · 7" },
          { title: "Compute", formula: "5040" },
        ]}
        answer="5040 codes."
      />
      <WorkedExample
        tag="WORKED EXAMPLE 3"
        title="Overlapping alternatives"
        given={[<p key="g">Binary strings of length 8 that start with 1 or end with 00.</p>]}
        asked={[<p key="a">How many are there?</p>]}
        steps={[
          { title: "Start with 1", formula: "2⁷ = 128" },
          { title: "End with 00", formula: "2⁶ = 64" },
          { title: "Both (start with 1 and end with 00)", formula: "2⁵ = 32" },
          { title: "Subtract the overlap", formula: "128 + 64 - 32 = 160" },
        ]}
        answer="160 strings."
      />
      <Quiz
        questions={[
          { q: "How many 5 bit strings are there?", options: ["10", "25", "32"], answer: 2, why: "2⁵ = 32." },
          { q: "Choose a pizza size from 3 and a topping from 6. Total combos?", options: ["9", "18"], answer: 1, why: "Two steps, so multiply." },
          { q: "Why do we subtract in inclusion-exclusion?", options: ["Overlap is counted twice", "To make the number smaller"], answer: 0, why: "Items in both groups were added once per group." },
        ]}
      />
      <Reflection
        fact={<p>License plates, IP addresses and phone numbers are all designed using the product rule. Engineers calculate exactly how many characters or digits are needed so the total combinations exceed the number of vehicles, devices or numbers that will ever need to be assigned.</p>}
        question={<p>A byte is 8 bits, each either 0 or 1. Using the product rule, how many distinct byte values are possible? Why do you think computer memory is measured in powers of 2?</p>}
      />
    </div>
  );
}
