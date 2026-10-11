import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";
import { NestedIntro, NestedQuantifierLab, NestedTranslations } from "./QuantifiersSection";

const F = ({ children }) => <span className="font-mono text-[#F4B942]">{children}</span>;
const tf = (v) => (v ? "T" : "F");
const pill = (active) => `px-3 py-1.5 rounded-full text-sm border transition ${active ? "bg-[#7C3AED] border-transparent text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]"}`;

// ---------------------------------------------------------------------------
// Step-by-step approach checklist
// ---------------------------------------------------------------------------
function Approach() {
  const steps = [
    ["Write Given", "List the predicates, what each variable stands for, and the domain."],
    ["Write Asked", "Say clearly what you must produce: a formula, a truth value, or a negation."],
    ["Read the words in order", "Underline every 'every', 'each', 'some', 'there is'. The first one you meet is the outer quantifier."],
    ["Build from the outside in", "Write the outer quantifier first, then the inner one. Order matters when the quantifiers are different."],
    ["Choose the connective", "After ∀ use →. After ∃ use ∧. Do this for each quantifier."],
    ["Read it back and test", "Translate your formula back to English and try it on a tiny example."],
  ];
  return (
    <Panel>
      <SectionTitle title="How to attack a nested quantifier problem">Follow these six steps every time. The first two are the Given and Asked parts of your answer. The rest is the Solution.</SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map(([title, text], i) => (
          <div key={title} className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3">
            <p className="text-sm font-semibold text-[#B48CFF]"><span className="font-mono mr-2 text-[#F4B942]">{i + 1}</span>{title}</p>
            <p className="mt-1 text-xs text-[#9C93B3] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Nested loops cheat sheet
// ---------------------------------------------------------------------------
function LoopCases() {
  const cases = [
    { f: "∀x ∀y P(x,y)", name: "True for all pairs", text: "Loop over every x, and for each x loop over every y.", stop: "Stop with FALSE at the first pair where P(x,y) is false." },
    { f: "∀x ∃y P(x,y)", name: "A match for every x", text: "For each x, loop over y until you find one y that works.", stop: "Stop with FALSE if some x has no matching y at all." },
    { f: "∃x ∀y P(x,y)", name: "One x fits all y", text: "Loop over x until you find one x that works with every y.", stop: "Stop with FALSE if no x works for all y." },
    { f: "∃x ∃y P(x,y)", name: "At least one pair", text: "Loop until you hit any pair (x, y) where P(x,y) is true.", stop: "FALSE only after checking every pair and finding none." },
  ];
  return (
    <Panel>
      <SectionTitle title="Think of nested quantifiers as nested loops">
        The outer quantifier is the outer loop and the inner quantifier is the inner loop. With infinite domains we cannot really loop, but the way of thinking still works.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {cases.map((c, i) => (
          <div key={c.f} className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-4">
            <p className="text-xs text-[#9C93B3]">CASE {i + 1}</p>
            <p className="font-mono text-lg text-[#F4B942]">{c.f}</p>
            <p className="mt-1 text-sm font-semibold text-[#E4D9FF]">{c.name}</p>
            <p className="mt-1 text-sm text-[#C9BFE3]">{c.text}</p>
            <p className="mt-1 text-xs text-[#9C93B3]">{c.stop}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Step-by-step evaluator over a finite domain
// ---------------------------------------------------------------------------
const DOMAIN = [1, 2, 3];
const PREDICATES = [
  { id: "sum", label: "x + y = 4", fn: (x, y) => x + y === 4 },
  { id: "lt", label: "x < y", fn: (x, y) => x < y },
  { id: "le", label: "x ≤ y", fn: (x, y) => x <= y },
  { id: "eq", label: "x = y", fn: (x, y) => x === y },
];
const PATTERNS = [
  { id: "aa", f: "∀x ∀y", oQ: "∀", oV: "x", iQ: "∀", iV: "y" },
  { id: "ae", f: "∀x ∃y", oQ: "∀", oV: "x", iQ: "∃", iV: "y" },
  { id: "ea", f: "∃x ∀y", oQ: "∃", oV: "x", iQ: "∀", iV: "y" },
  { id: "ee", f: "∃x ∃y", oQ: "∃", oV: "x", iQ: "∃", iV: "y" },
  { id: "eya", f: "∃y ∀x", oQ: "∃", oV: "y", iQ: "∀", iV: "x" },
  { id: "aye", f: "∀y ∃x", oQ: "∀", oV: "y", iQ: "∃", iV: "x" },
];

function buildWalkthrough(pattern, pred) {
  const { oQ, oV, iQ, iV } = pattern;
  const call = (o, i) => (oV === "x" ? pred.fn(o, i) : pred.fn(i, o));
  const label = (o, i) => (oV === "x" ? `P(${o},${i})` : `P(${i},${o})`);
  const steps = [];
  let result = oQ === "∀";
  let decided = false;

  for (const o of DOMAIN) {
    const checks = DOMAIN.map((i) => ({ i, v: call(o, i) }));
    const inner = iQ === "∀" ? checks.every((c) => c.v) : checks.some((c) => c.v);
    const list = checks.map((c) => `${label(o, c.i)}=${tf(c.v)}`).join(", ");
    let note;
    if (iQ === "∀") note = inner ? `${iQ}${iV} holds: every ${iV} works.` : `${iQ}${iV} fails: ${iV} = ${checks.find((c) => !c.v).i} is a counterexample.`;
    else note = inner ? `${iQ}${iV} holds: witness ${iV} = ${checks.find((c) => c.v).i}.` : `${iQ}${iV} fails: no ${iV} works for ${oV} = ${o}.`;
    steps.push({ text: `Fix ${oV} = ${o}. Check ${list}. ${note}`, tone: inner ? "ok" : "bad" });

    if (oQ === "∀" && !inner) {
      steps.push({ text: `Because the outer quantifier is ∀, one failing ${oV} (${oV} = ${o}) already makes the whole statement FALSE. We can stop.`, tone: "bad" });
      result = false; decided = true; break;
    }
    if (oQ === "∃" && inner) {
      steps.push({ text: `Because the outer quantifier is ∃, one working ${oV} (${oV} = ${o}) already makes the whole statement TRUE. We can stop.`, tone: "ok" });
      result = true; decided = true; break;
    }
  }
  if (!decided) {
    result = oQ === "∀";
    steps.push({
      text: oQ === "∀" ? `Every ${oV} passed, so the statement is TRUE.` : `No ${oV} worked, so the statement is FALSE.`,
      tone: result ? "ok" : "bad",
    });
  }
  return { steps, result };
}

function Walkthrough({ pattern, pred }) {
  const [shown, setShown] = useState(1);
  const { steps, result } = buildWalkthrough(pattern, pred);
  const done = shown >= steps.length;
  return (
    <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
      <p className="text-xs text-[#9C93B3]">Walkthrough for <span className="font-mono text-[#F4B942]">{pattern.f} ({pred.label})</span> over domain {"{1, 2, 3}"}</p>
      <ol className="mt-3 space-y-2">
        {steps.slice(0, shown).map((s, i) => (
          <li key={i} className={`rounded-lg p-3 text-sm flex gap-3 ${s.tone === "ok" ? "bg-[#173626]/30 text-[#C9F5D9]" : "bg-[#3A1C22]/30 text-[#F8C9C9]"}`}>
            <span className="font-mono text-xs opacity-70 pt-0.5">{i + 1}.</span><span>{s.text}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!done && <button onClick={() => setShown(shown + 1)} className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">Next step</button>}
        {!done && <button onClick={() => setShown(steps.length)} className="px-4 py-2 rounded-lg border border-[#2A2140] text-[#9C93B3] text-sm hover:text-white">Show all</button>}
        {done && <span className={`text-sm font-semibold ${result ? "text-[#4ADE80]" : "text-[#F87171]"}`}>Final result: {result ? "TRUE" : "FALSE"}</span>}
      </div>
    </div>
  );
}

function StepEvaluator() {
  const [predId, setPredId] = useState("sum");
  const [patId, setPatId] = useState("ae");
  const pred = PREDICATES.find((p) => p.id === predId);
  const pattern = PATTERNS.find((p) => p.id === patId);

  return (
    <Panel>
      <SectionTitle title="Evaluate it step by step">
        Pick a predicate and a quantifier pattern. The grid shows every value of P(x, y). Then walk through the evaluation one step at a time, exactly like a nested loop that stops as soon as the answer is clear.
      </SectionTitle>

      <p className="mt-4 text-xs text-[#9C93B3]">1. Choose P(x, y)</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {PREDICATES.map((p) => <button key={p.id} onClick={() => setPredId(p.id)} className={`${pill(p.id === predId)} font-mono`}>{p.label}</button>)}
      </div>
      <p className="mt-3 text-xs text-[#9C93B3]">2. Choose the quantifiers</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {PATTERNS.map((p) => <button key={p.id} onClick={() => setPatId(p.id)} className={`${pill(p.id === patId)} font-mono`}>{p.f}</button>)}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="font-mono text-sm text-center border-collapse">
          <thead>
            <tr><th className="p-2 text-xs text-[#9C93B3]">x \ y</th>{DOMAIN.map((y) => <th key={y} className="p-2 w-12 text-[#B48CFF]">{y}</th>)}</tr>
          </thead>
          <tbody>
            {DOMAIN.map((x) => (
              <tr key={x}>
                <td className="p-2 text-[#B48CFF]">{x}</td>
                {DOMAIN.map((y) => {
                  const v = pred.fn(x, y);
                  return <td key={y} className={`p-2 w-12 border border-[#2A2140] ${v ? "bg-[#173626]/50 text-[#4ADE80]" : "bg-[#3A1C22]/40 text-[#F87171]"}`}>{tf(v)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Walkthrough key={`${predId}-${patId}`} pattern={pattern} pred={pred} />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Pick-the-formula quiz
// ---------------------------------------------------------------------------
const QUIZ = [
  { s: "Everyone likes everyone.", opts: ["∀x ∀y L(x,y)", "∀x ∃y L(x,y)", "∃x ∀y L(x,y)", "∃x ∃y L(x,y)"], a: 0, why: "Two 'every' words give two ∀. Any x and any y must satisfy L." },
  { s: "Everyone likes someone.", opts: ["∀x ∀y L(x,y)", "∀x ∃y L(x,y)", "∃y ∀x L(x,y)", "∃x ∃y L(x,y)"], a: 1, why: "'Everyone' comes first, so ∀x is outside. Then 'someone' gives ∃y inside. Each person may like a different someone." },
  { s: "Someone is liked by everyone.", opts: ["∀x ∃y L(x,y)", "∃y ∀x L(x,y)", "∃x ∀y L(x,y)", "∀y ∃x L(x,y)"], a: 1, why: "'Someone' is the outer choice (one fixed y), and 'everyone' (all x) likes that same y." },
  { s: "Someone does not like anyone.", opts: ["∃x ∀y ¬L(x,y)", "∀x ∃y ¬L(x,y)", "¬∃x ∃y L(x,y)", "∃x ∃y ¬L(x,y)"], a: 0, why: "There is one person x such that for every y, x does not like y. 'Not anyone' means every y fails." },
  { s: "Nobody likes everybody.", opts: ["∀x ∀y ¬L(x,y)", "∀x ∃y ¬L(x,y)", "∃x ∀y ¬L(x,y)", "¬∀x ∀y L(x,y)"], a: 1, why: "For each person x, there is at least one y whom x does not like. That is ∀x ∃y ¬L(x,y)." },
];

function FormulaQuiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  if (i >= QUIZ.length) {
    return (
      <Panel>
        <SectionTitle title="Pick the formula" />
        <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-5 text-center">
          <p className="text-2xl font-heading text-white">{score} / {QUIZ.length}</p>
          <button onClick={() => { setI(0); setScore(0); setPicked(null); }} className="mt-4 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">Try again</button>
        </div>
      </Panel>
    );
  }
  const q = QUIZ[i];
  return (
    <Panel>
      <SectionTitle title="Pick the formula">Let L(x, y) = "x likes y." The domain is all people.</SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="text-xs text-[#9C93B3]">Question {i + 1} of {QUIZ.length}</p>
        <p className="mt-1 text-[#E4D9FF]">"{q.s}"</p>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {q.opts.map((opt, k) => {
            const state = picked === null ? "idle" : k === q.a ? "right" : picked === k ? "wrong" : "idle";
            return (
              <button
                key={opt}
                onClick={() => { if (picked === null) { setPicked(k); if (k === q.a) setScore((s) => s + 1); } }}
                className={`font-mono text-sm text-left px-3 py-2 rounded-lg border transition ${state === "right" ? "bg-[#173626]/60 border-[#4ADE80] text-[#4ADE80]" : state === "wrong" ? "bg-[#3A1C22]/60 border-[#F87171] text-[#F87171]" : "bg-[#130E20] border-[#2A2140] text-[#E4D9FF] hover:border-[#7C3AED]/60"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-3">
            <p className="text-sm text-[#C9BFE3]">{picked === q.a ? "Correct. " : "Not quite. "}{q.why}</p>
            <button onClick={() => { setI(i + 1); setPicked(null); }} className="mt-3 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">{i === QUIZ.length - 1 ? "See score" : "Next"}</button>
          </div>
        )}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Negation quiz
// ---------------------------------------------------------------------------
const NEG = [
  { f: "¬∀x ∃y L(x,y)", english: "Not everyone likes someone.", opts: ["∃x ∀y ¬L(x,y)", "∀x ∃y ¬L(x,y)", "∃x ∃y ¬L(x,y)", "∀x ∀y ¬L(x,y)"], a: 0, why: "Flip ∀x to ∃x, then flip ∃y to ∀y, and negate L. Someone likes nobody." },
  { f: "¬∃x ∀y L(x,y)", english: "There is no one who likes everyone.", opts: ["∃x ∃y ¬L(x,y)", "∀x ∃y ¬L(x,y)", "∀x ∀y ¬L(x,y)", "∃x ∀y ¬L(x,y)"], a: 1, why: "Flip ∃x to ∀x, then ∀y to ∃y, and negate L. Everyone has at least one person they do not like." },
  { f: "¬∀x ∀y L(x,y)", english: "Not everyone likes everyone.", opts: ["∀x ∀y ¬L(x,y)", "∃x ∀y ¬L(x,y)", "∃x ∃y ¬L(x,y)", "∀x ∃y ¬L(x,y)"], a: 2, why: "Both ∀ flip to ∃. There is a pair (x, y) where x does not like y." },
];

function NegationQuiz() {
  const [answers, setAnswers] = useState({});
  return (
    <Panel>
      <SectionTitle title="Push the negation inside">
        Rule of thumb: move the ¬ from left to right, and flip every quantifier it passes (∀ becomes ∃, ∃ becomes ∀). At the end, the predicate itself gets the ¬.
      </SectionTitle>
      <div className="mt-4 space-y-3">
        {NEG.map((q, i) => {
          const a = answers[i];
          return (
            <div key={q.f} className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
              <p className="font-mono text-[#F4B942]">{q.f}</p>
              <p className="text-xs text-[#9C93B3]">{q.english} Which formula is equivalent?</p>
              <div className="mt-3 grid sm:grid-cols-2 gap-2">
                {q.opts.map((opt, k) => {
                  const state = a === undefined ? "idle" : k === q.a ? "right" : a === k ? "wrong" : "idle";
                  return (
                    <button
                      key={opt}
                      disabled={a !== undefined}
                      onClick={() => setAnswers((cur) => ({ ...cur, [i]: k }))}
                      className={`font-mono text-sm text-left px-3 py-2 rounded-lg border transition ${state === "right" ? "bg-[#173626]/60 border-[#4ADE80] text-[#4ADE80]" : state === "wrong" ? "bg-[#3A1C22]/60 border-[#F87171] text-[#F87171]" : "bg-[#130E20] border-[#2A2140] text-[#E4D9FF] hover:border-[#7C3AED]/60"}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {a !== undefined && <p className="mt-3 text-sm text-[#C9BFE3]">{a === q.a ? "Correct. " : "Not quite. "}{q.why}</p>}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export default function NestedQuantifiersSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 3 · PREDICATE LOGIC</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">Nested Quantifiers</h2>
        <p className="mt-2 text-[#9C93B3] max-w-3xl">Take it slowly. First we learn to read nested quantifiers, then to evaluate them, then to translate and negate them.</p>
      </div>

      <NestedIntro />
      <Approach />
      <LoopCases />
      <StepEvaluator />
      <NestedQuantifierLab />

      <WorkedExample
        tag="EVALUATION"
        title="∀x ∃y (x + y = 0) over the real numbers"
        given={<>
          <p>Predicate: <F>x + y = 0</F></p>
          <p>Domain for both x and y: all real numbers</p>
        </>}
        asked={<p>The truth value of <F>∀x ∃y (x + y = 0)</F>.</p>}
        steps={[
          { title: "Read it in English", text: "For every real number x, there is a real number y such that x + y = 0." },
          { title: "Fix an arbitrary x", text: "Let x be any real number. The outer ∀ means we must succeed for this x, whatever it is." },
          { title: "Look for a witness y", text: "Solve x + y = 0 for y.", formula: "y = -x" },
          { title: "Check that the witness is allowed", text: "If x is real, then -x is real too, so y is in the domain." },
          { title: "Conclude", text: "Every x has a matching y. Different x values use different y values, and that is allowed." },
        ]}
        answer="TRUE."
      />

      <WorkedExample
        tag="EVALUATION"
        title="∃y ∀x (x + y = 0) over the real numbers"
        given={<>
          <p>Predicate: <F>x + y = 0</F></p>
          <p>Domain for both x and y: all real numbers</p>
        </>}
        asked={<p>The truth value of <F>∃y ∀x (x + y = 0)</F>.</p>}
        steps={[
          { title: "Read it in English", text: "There is one real number y such that, for every real number x, x + y = 0." },
          { title: "Notice what changed", text: "Now y is chosen first and cannot depend on x. One single y must work for all x at the same time." },
          { title: "Test a candidate", text: "Suppose y = 5. Then x = 1 gives 1 + 5 = 6, which is not 0. So y = 5 fails." },
          { title: "Generalize", text: "For any fixed y, choose x = 1 - y. Then x + y = 1, not 0. So no y can work." },
        ]}
        answer="FALSE. Swapping ∀x ∃y to ∃y ∀x changed the truth value, so order matters."
      />

      <WorkedExample
        tag="EVALUATION"
        title="∀x ∀y (x + y = y + x) over the real numbers"
        given={<p>Predicate: <F>x + y = y + x</F>. Domain: all real numbers.</p>}
        asked={<p>The truth value of <F>∀x ∀y (x + y = y + x)</F>.</p>}
        steps={[
          { title: "Same quantifier type", text: "Both quantifiers are ∀, so the order of x and y does not matter." },
          { title: "Check every pair", text: "Addition of real numbers is commutative, so the equality holds for any pair (x, y)." },
        ]}
        answer="TRUE."
      />

      <WorkedExample
        tag="TRANSLATION"
        title="The sum of two positive integers is always positive"
        given={<p>Domain: all integers. Two variables x and y.</p>}
        asked={<p>Write the sentence with quantifiers.</p>}
        steps={[
          { title: "Spot the quantifiers", text: "'Two positive integers' means any x and any y, so we need ∀x ∀y." },
          { title: "Find the condition", text: "x and y are both positive.", formula: "(x > 0 ∧ y > 0)" },
          { title: "Find the claim", text: "Then the sum is positive.", formula: "(x + y > 0)" },
          { title: "Connect with →", text: "The condition leads to the claim, and we are under ∀, so we use an implication.", formula: "∀x ∀y ((x > 0 ∧ y > 0) → (x + y > 0))" },
        ]}
        answer="∀x ∀y ((x > 0 ∧ y > 0) → (x + y > 0))"
      />

      <WorkedExample
        tag="TRANSLATION"
        title="Someone does not like anyone"
        given={<>
          <p><F>L(x, y)</F> = "x likes y"</p>
          <p>Domain: all people</p>
        </>}
        asked={<p>Write the sentence as a nested quantified formula.</p>}
        steps={[
          { title: "Read the words in order", text: "'Someone' comes first. That is the outer quantifier ∃x." },
          { title: "Next word", text: "'Anyone' in a negative sentence means every y. So the inner quantifier is ∀y." },
          { title: "Place the negation", text: "x does not like y, for each y.", formula: "¬L(x, y)" },
          { title: "Combine", formula: "∃x ∀y ¬L(x, y)" },
          { title: "Test it", text: "Imagine a hermit who likes no one. Then ∀y ¬L(hermit, y) is true, so the statement is true." },
        ]}
        answer="∃x ∀y ¬L(x, y). It is an existential followed by a negated universal."
      />

      <WorkedExample
        tag="TRANSLATION AND ORDER"
        title="If a person is female and is a parent, then this person is someone's mother"
        given={<>
          <p><F>F(x)</F>: "x is female"</p>
          <p><F>P(x)</F>: "x is a parent"</p>
          <p><F>M(x, y)</F>: "x is the mother of y"</p>
          <p>Domain: all people, for both x and y</p>
        </>}
        asked={<p>Write the sentence with quantifiers and explain why the order is ∀x ∃y.</p>}
        steps={[
          { title: "Outer quantifier", text: "'A person' who is a female parent means any person, so ∀x. The condition is F(x) ∧ P(x).", formula: "∀x ((F(x) ∧ P(x)) → ...)" },
          { title: "Inner quantifier", text: "'Someone's mother' means there exists a y whom x is the mother of.", formula: "∃y M(x, y)" },
          { title: "Combine", formula: "∀x ((F(x) ∧ P(x)) → ∃y M(x, y))" },
          { title: "Move ∃y to the front (optional)", text: "y does not appear in F(x) ∧ P(x), so we may pull ∃y out of the implication.", formula: "∀x ∃y ((F(x) ∧ P(x)) → M(x, y))" },
          { title: "Why not ∃y ∀x?", text: "∃y ∀x would say there is one specific person y such that every female parent is the mother of that same y. That is a very different (and silly) statement.", formula: "∃y ∀x ((F(x) ∧ P(x)) → M(x, y))" },
          { title: "Key point", text: "In ∀x ∃y, the y can depend on x, so each mother may have a different child. That is what we want." },
        ]}
        answer="∀x ∃y ((F(x) ∧ P(x)) → M(x, y))"
      />

      <FormulaQuiz />
      <NestedTranslations />

      <div className="pt-2">
        <h3 className="font-heading text-xl font-semibold text-white">Negating nested quantifiers</h3>
        <p className="mt-1 text-sm text-[#9C93B3] max-w-3xl">These are the same De Morgan style rules from before, applied one quantifier at a time.</p>
      </div>

      <Panel>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#0F0A1A] border border-[#7C3AED]/50 p-4">
            <p className="text-xs text-[#B48CFF]">RULE 1: NEGATING A UNIVERSAL</p>
            <p className="mt-1 font-mono text-[#F4B942]">¬∀x P(x) ≡ ∃x ¬P(x)</p>
            <p className="mt-1 text-sm text-[#C9BFE3]">"Not everyone has P" is the same as "someone does not have P".</p>
          </div>
          <div className="rounded-lg bg-[#0F0A1A] border border-[#F4B942]/50 p-4">
            <p className="text-xs text-[#F4B942]">RULE 2: NEGATING AN EXISTENTIAL</p>
            <p className="mt-1 font-mono text-[#F4B942]">¬∃x P(x) ≡ ∀x ¬P(x)</p>
            <p className="mt-1 text-sm text-[#C9BFE3]">"No one has P" is the same as "everyone does not have P".</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-[#9C93B3]">Everyday example: "Not everyone likes pizza" means "there is someone who does not like pizza".</p>
      </Panel>

      <WorkedExample
        tag="NEGATION"
        title="Negate ∀x ∃y L(x, y)"
        given={<>
          <p><F>L(x, y)</F> = "x likes y". Domain: all people.</p>
          <p>Formula: <F>∀x ∃y L(x, y)</F> ("Everyone likes someone")</p>
        </>}
        asked={<p>An equivalent formula where ¬ is directly in front of L.</p>}
        steps={[
          { title: "Write the negation", formula: "¬∀x ∃y L(x, y)" },
          { title: "Flip the first quantifier", text: "¬∀x becomes ∃x ¬.", formula: "∃x ¬∃y L(x, y)" },
          { title: "Flip the second quantifier", text: "¬∃y becomes ∀y ¬.", formula: "∃x ∀y ¬L(x, y)" },
          { title: "Read it back", text: "There is someone who likes no one. This is the opposite of 'everyone likes someone'." },
        ]}
        answer="∃x ∀y ¬L(x, y)"
      />

      <NegationQuiz />
    </div>
  );
}
