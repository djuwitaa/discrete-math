import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";

// ---------------------------------------------------------------------------
// 1. Quantifier intro
// ---------------------------------------------------------------------------
function QuantifierIntro() {
  return (
    <Panel>
      <SectionTitle title="Quantifiers: making a propositional function into a proposition, without picking just one value">
        In Predicate Basics we turned P(x) into a proposition by substituting one specific value for x. Quantifiers give us a second way
        to do this. Instead of picking a single value, we make a claim about <strong className="text-[#E4D9FF]">every</strong> value or
        <strong className="text-[#E4D9FF]"> at least one</strong> value in the domain at once.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg bg-[#0F0A1A] border border-[#7C3AED]/50 p-4">
          <p className="font-mono text-2xl text-[#B48CFF]">∀x P(x)</p>
          <p className="mt-1 text-sm text-[#E4D9FF]"><strong>Universal quantifier</strong>: "for all x, P(x)"</p>
        </div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#F4B942]/50 p-4">
          <p className="font-mono text-2xl text-[#F4B942]">∃x P(x)</p>
          <p className="mt-1 text-sm text-[#E4D9FF]"><strong>Existential quantifier</strong>: "there exists an x such that P(x)"</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#9C93B3]">Both always work relative to a <strong className="text-[#E4D9FF]">domain / universe of discourse</strong>. The quantifier only ranges over that set. Change the domain, and the truth value of the same quantified statement can change too.</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Reusable: evaluate a predicate over a small finite domain and show the
// row-by-row truth table, plus the aggregated quantified conclusion.
// ---------------------------------------------------------------------------
function QuantifierDemo({ symbol, colorClass, domainLabel, predicateLabel, values, test, aggregate, explainTrue, explainFalse }) {
  const results = values.map((v) => ({ v, ok: test(v) }));
  const holds = aggregate(results.map((r) => r.ok));
  return (
    <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
      <p className="text-xs text-[#9C93B3]">{domainLabel}</p>
      <p className="mt-1 font-mono text-sm text-[#F4B942]">{predicateLabel}</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full font-mono text-sm border-collapse text-center">
          <thead className="text-[#B48CFF]"><tr><th className="p-2 border-b border-[#2A2140]">x</th>{results.map((r) => <th key={r.v} className="p-2 border-b border-[#2A2140]">{r.v}</th>)}</tr></thead>
          <tbody><tr><td className="p-2 text-[#9C93B3]">P(x)</td>{results.map((r) => <td key={r.v} className={`p-2 ${r.ok ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{r.ok ? "T" : "F"}</td>)}</tr></tbody>
        </table>
      </div>
      <div className={`mt-3 rounded-lg p-3 text-sm ${holds ? "bg-[#173626]/40 text-[#4ADE80]" : "bg-[#3A1C22]/40 text-[#F87171]"}`}>
        <span className={`font-mono font-bold ${colorClass}`}>{symbol}</span> is <strong>{holds ? "TRUE" : "FALSE"}</strong>: {holds ? explainTrue : explainFalse}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Universal quantifier
// ---------------------------------------------------------------------------
function UniversalQuantifier() {
  return (
    <Panel>
      <SectionTitle title="The universal quantifier: ∀">
        <span className="font-mono text-[#B48CFF]">∀x P(x)</span> reads "for all x, P(x)" (or "for every x, P(x)"). It is true exactly when
        P(x) is true for <strong className="text-[#E4D9FF]">every single element</strong> of the domain. One failure is enough to make the whole statement false.
      </SectionTitle>
      <QuantifierDemo
        symbol="∀x P(x)"
        colorClass="text-[#B48CFF]"
        domainLabel="Domain: {1, 2, 3, 4}"
        predicateLabel='P(x): "x > 0"'
        values={[1, 2, 3, 4]}
        test={(x) => x > 0}
        aggregate={(oks) => oks.every(Boolean)}
        explainTrue="every element of the domain makes P(x) true, so the universal claim holds with no exceptions."
        explainFalse="at least one element breaks the pattern."
      />
      <QuantifierDemo
        symbol="∀x Q(x)"
        colorClass="text-[#B48CFF]"
        domainLabel="Domain: {2, 4, 6, 7}"
        predicateLabel='Q(x): "x is even"'
        values={[2, 4, 6, 7]}
        test={(x) => x % 2 === 0}
        aggregate={(oks) => oks.every(Boolean)}
        explainTrue="every element of the domain makes Q(x) true."
        explainFalse={<>x = 7 is a <strong>counterexample</strong>, a single element where the predicate fails is always enough to make a universal statement false.</>}
      />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 3. Existential quantifier
// ---------------------------------------------------------------------------
function ExistentialQuantifier() {
  return (
    <Panel>
      <SectionTitle title="The existential quantifier: ∃">
        <span className="font-mono text-[#F4B942]">∃x P(x)</span> reads "there exists an x such that P(x)" (or "for some x, P(x)"). It is
        true as soon as P(x) is true for <strong className="text-[#E4D9FF]">at least one</strong> element of the domain. You only need to find one witness.
      </SectionTitle>
      <QuantifierDemo
        symbol="∃x P(x)"
        colorClass="text-[#F4B942]"
        domainLabel="Domain: {1, 2, 3, 4}"
        predicateLabel='P(x): "x > 3"'
        values={[1, 2, 3, 4]}
        test={(x) => x > 3}
        aggregate={(oks) => oks.some(Boolean)}
        explainTrue="x = 4 is a witness. Just one success is enough."
        explainFalse="no element of the domain satisfies P(x)."
      />
      <QuantifierDemo
        symbol="∃x R(x)"
        colorClass="text-[#F4B942]"
        domainLabel="Domain: {1, 2, 3}"
        predicateLabel='R(x): "x > 5"'
        values={[1, 2, 3]}
        test={(x) => x > 5}
        aggregate={(oks) => oks.some(Boolean)}
        explainTrue="a witness exists in the domain."
        explainFalse="every element fails, so there is no witness anywhere in the domain, so the existential claim is false."
      />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 4. Translating quantified statements (English <-> logic)
// ---------------------------------------------------------------------------
function TranslationRow({ item }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3">
      <p className="text-sm text-[#E4D9FF] italic">"{item.english}"</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="mt-2 rounded-lg border border-[#2A2140] bg-[#130E20] px-3 py-1.5 text-xs text-[#9C93B3] hover:border-[#7C3AED] hover:text-white transition">Reveal translation</button>
      ) : (
        <div className="mt-2 space-y-1">
          <p className="font-mono text-sm text-[#F4B942]">{item.logic}</p>
          <p className="text-xs text-[#9C93B3]">{item.legend}</p>
        </div>
      )}
    </div>
  );
}

const translationExamples = [
  {
    english: "Every student in this class has taken a course in computer science.",
    legend: 'Domain: students in this class. C(x): "x has taken a course in computer science."',
    logic: "∀x C(x)",
  },
  {
    english: "Some student in this class has visited Alaska.",
    legend: 'Domain: students in this class. V(x): "x has visited Alaska."',
    logic: "∃x V(x)",
  },
  {
    english: "All animals are mammals.",
    legend: 'Domain: animals. M(x): "x is a mammal." (This statement is actually FALSE, because birds are a counterexample.)',
    logic: "∀x M(x)",
  },
  {
    english: "No student in this class has visited Antarctica.",
    legend: 'Domain: students in this class. A(x): "x has visited Antarctica." "No one" means the existential claim fails for everyone.',
    logic: "¬∃x A(x)   (equivalently: ∀x ¬A(x))",
  },
];

function TranslatingStatements() {
  return (
    <Panel>
      <SectionTitle title="Translating between English and quantified statements">
        The hardest part of predicate logic is often just this translation step. Read each English sentence, guess the logic yourself, then reveal.
      </SectionTitle>
      <div className="mt-4 grid gap-3">
        {translationExamples.map((item) => <TranslationRow key={item.english} item={item} />)}
      </div>
      <div className="mt-5 rounded-lg bg-[#1A1330] p-4 text-sm text-[#E4D9FF]">
        <strong>De Morgan's laws for quantifiers</strong>: negating a quantifier flips it into the other one:
        <div className="mt-2 font-mono text-sm text-[#F4B942] space-y-1">
          <p>¬∀x P(x) ≡ ∃x ¬P(x) <span className="font-sans text-xs text-[#9C93B3]">→ "not everyone satisfies P" means "someone fails P"</span></p>
          <p>¬∃x P(x) ≡ ∀x ¬P(x) <span className="font-sans text-xs text-[#9C93B3]">→ "no one satisfies P" means "everyone fails P"</span></p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 5. Nested quantifiers: intro
// ---------------------------------------------------------------------------
export function NestedIntro() {
  return (
    <Panel>
      <SectionTitle title="Nested quantifiers">
        A predicate with two or more variables, like Q(x, y), needs a quantifier for <strong className="text-[#E4D9FF]">every</strong> variable
        before it becomes a full proposition. When one quantifier sits inside the scope of another, we call them <strong className="text-[#E4D9FF]">nested quantifiers</strong>.
      </SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="font-mono text-lg text-center text-[#F4B942]">∀x ∃y Q(x, y)</p>
        <p className="mt-3 text-sm text-[#E4D9FF]">Read it from the <strong>outside in, left to right</strong>: "for every x, there exists a y, such that Q(x, y)." The outer quantifier (∀x) is decided first; for each choice of x, the inner quantifier (∃y) is then evaluated using that fixed x.</p>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 6. Order matters: interactive relation-grid lab
// ---------------------------------------------------------------------------
const PEOPLE = ["Alice", "Bob", "Cara", "Dan"];

function defaultRelation() {
  // Start with a state where ∃y∀x is false but ∀x∃y is true, a good teaching moment.
  return [
    [false, true, false, false],
    [false, false, true, false],
    [true, false, false, false],
    [false, false, false, true],
  ];
}

export function NestedQuantifierLab() {
  const [rel, setRel] = useState(defaultRelation());
  function toggle(x, y) {
    setRel((current) => current.map((row, i) => row.map((cell, j) => (i === x && j === y ? !cell : cell))));
  }
  const forallXexistsY = rel.every((row) => row.some(Boolean));
  const existsYforallX = PEOPLE.map((_, y) => PEOPLE.every((_, x) => rel[x][y])).some(Boolean);
  const forallXforallY = rel.every((row) => row.every(Boolean));
  const existsXexistsY = rel.some((row) => row.some(Boolean));

  const statements = [
    { symbol: "∀x∀y Follows(x, y)", translation: "Everyone follows everyone (including themselves).", holds: forallXforallY },
    { symbol: "∀x∃y Follows(x, y)", translation: "Everyone follows someone.", holds: forallXexistsY },
    { symbol: "∃y∀x Follows(x, y)", translation: "There is someone whom everyone follows (a universal influencer).", holds: existsYforallX },
    { symbol: "∃x∃y Follows(x, y)", translation: "At least one follow relationship exists somewhere.", holds: existsXexistsY },
  ];

  return (
    <Panel>
      <SectionTitle title="Order matters: ∀x∃y vs ∃y∀x">
        Swapping the order of two <strong className="text-[#E4D9FF]">different</strong> quantifiers can completely change the meaning.
        Build your own "Follows(x, y)" relation below (like a mini social network: row x follows column y) and watch all four
        combinations update live.
      </SectionTitle>
      <div className="mt-4 grid md:grid-cols-2 gap-5">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
          <p className="text-xs text-[#9C93B3] mb-2">Click a cell to toggle "row follows column." Rows = x, columns = y.</p>
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-1"></th>
                {PEOPLE.map((p) => <th key={p} className="p-1 text-xs font-mono text-[#B48CFF]">{p.slice(0, 1)}</th>)}
              </tr>
            </thead>
            <tbody>
              {PEOPLE.map((rowPerson, x) => (
                <tr key={rowPerson}>
                  <td className="p-1 text-xs font-mono text-[#B48CFF] text-right pr-2">{rowPerson}</td>
                  {PEOPLE.map((colPerson, y) => (
                    <td key={colPerson} className="p-1">
                      <button onClick={() => toggle(x, y)} title={`${rowPerson} follows ${colPerson}?`} className={`w-9 h-9 rounded-md border font-mono text-xs transition ${rel[x][y] ? "bg-[#255239] border-[#4ADE80] text-white" : "bg-[#130E20] border-[#2A2140] text-[#5B5470] hover:border-[#7C3AED]"}`}>
                        {rel[x][y] ? "✓" : ""}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[11px] text-[#5B5470]">Tip: make one whole column all green to see ∃y∀x flip to TRUE. That column is a "universal influencer" everyone follows.</p>
        </div>
        <div className="space-y-2">
          {statements.map((item) => (
            <div key={item.symbol} className={`rounded-lg border p-3 ${item.holds ? "bg-[#173626]/40 border-[#255239]" : "bg-[#3A1C22]/30 border-[#5C2F37]"}`}>
              <p className="font-mono text-sm text-[#E4D9FF]">{item.symbol}</p>
              <p className="text-xs text-[#9C93B3] mt-0.5">{item.translation}</p>
              <p className={`text-xs font-semibold mt-1 ${item.holds ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{item.holds ? "TRUE" : "FALSE"}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-[#9C93B3]">Notice ∀x∃y and ∃y∀x can disagree even though they use the exact same predicate. ∀x∃y only needs a (possibly different) target for each x, but ∃y∀x demands one single y that works for everyone at once, which is a much stronger claim. That's why order changes the meaning whenever the quantifiers are different (∀ then ∃, or ∃ then ∀).</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 7. Translating nested quantified statements
// ---------------------------------------------------------------------------
const nestedTranslations = [
  {
    english: "For every real number x there is a real number y such that x + y = 0.",
    legend: "Domain: real numbers. This is TRUE. Just pick y = −x for any x.",
    logic: "∀x∃y (x + y = 0)",
  },
  {
    english: "There is a real number y such that for every real number x, x + y = 0.",
    legend: "Domain: real numbers. This is FALSE. One fixed y cannot cancel out every possible x.",
    logic: "∃y∀x (x + y = 0)",
  },
  {
    english: "The sum of two positive integers is always positive.",
    legend: 'Domain: integers.',
    logic: "∀x∀y ((x > 0 ∧ y > 0) → (x + y > 0))",
  },
  {
    english: "There is a student who has taken every course offered by the department.",
    legend: 'Domain: students and courses. T(x, y): "student x has taken course y."',
    logic: "∃x∀y T(x, y)",
  },
];

export function NestedTranslations() {
  return (
    <Panel>
      <SectionTitle title="Translating nested quantified statements">
        The same "guess, then reveal" approach works with two variables, so just watch the order of the words "every" and "some" closely.
      </SectionTitle>
      <div className="mt-4 grid gap-3">
        {nestedTranslations.map((item) => <TranslationRow key={item.english} item={item} />)}
      </div>
    </Panel>
  );
}

export default function QuantifiersSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 3 · PREDICATE LOGIC</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">Quantifiers</h2>
        <p className="mt-2 text-[#9C93B3] max-w-3xl">Quantifiers let a predicate speak about an entire domain at once, either every element or just one. Nested quantifiers (next tabs) let us describe relationships between several variables.</p>
      </div>
      <QuantifierIntro />
      <UniversalQuantifier />
      <ExistentialQuantifier />
      <TranslatingStatements />
    </div>
  );
}
