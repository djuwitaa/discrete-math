import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";

const F = ({ children }) => <span className="font-mono text-[#F4B942]">{children}</span>;

function OperatorLab() {
  const [mode, setMode] = useState("all");
  const [items, setItems] = useState([
    { name: "Sparrow", bird: true, flies: true },
    { name: "Penguin", bird: true, flies: false },
    { name: "Rock", bird: false, flies: false },
  ]);
  const toggle = (i, key) => setItems((cur) => cur.map((it, j) => (j === i ? { ...it, [key]: !it[key] } : it)));

  const rows = items.map((it) => ({ ...it, imp: !it.bird || it.flies, and: it.bird && it.flies }));
  const result = mode === "all"
    ? { good: rows.every((r) => r.imp), bad: rows.every((r) => r.and), goodF: "∀x (B(x) → F(x))", badF: "∀x (B(x) ∧ F(x))" }
    : { good: rows.some((r) => r.and), bad: rows.some((r) => r.imp), goodF: "∃x (B(x) ∧ F(x))", badF: "∃x (B(x) → F(x))" };
  const cell = (v) => <span className={v ? "text-[#4ADE80]" : "text-[#F87171]"}>{v ? "T" : "F"}</span>;

  return (
    <Panel>
      <SectionTitle title="Why ∀ goes with → and ∃ goes with ∧">
        This is the most common mistake in translation. Choose a sentence, then click the B(x) and F(x) cells to change the objects in the domain. Compare the correct formula with the tempting wrong one.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {[["all", "All birds fly"], ["some", "Some birds fly"]].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} className={`px-3 py-1.5 rounded-full text-sm border transition ${mode === id ? "bg-[#7C3AED] border-transparent text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]"}`}>{label}</button>
        ))}
      </div>
      <p className="mt-3 text-xs text-[#9C93B3]">B(x): "x is a bird." F(x): "x flies." Domain: the three objects below.</p>

      <div className="mt-3 overflow-x-auto rounded-xl border border-[#211934]">
        <table className="w-full font-mono text-sm text-center border-collapse">
          <thead className="bg-[#1A1330] text-[#F4B942]">
            <tr><th className="p-2 text-left font-sans">Object</th><th className="p-2">B(x)</th><th className="p-2">F(x)</th><th className="p-2">B(x) → F(x)</th><th className="p-2">B(x) ∧ F(x)</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className="border-t border-[#2A2140]">
                <td className="p-2 text-left font-sans text-[#E4D9FF]">{r.name}</td>
                <td className="p-2"><button onClick={() => toggle(i, "bird")} className="px-2 py-0.5 rounded border border-[#2A2140] hover:border-[#7C3AED]">{cell(r.bird)}</button></td>
                <td className="p-2"><button onClick={() => toggle(i, "flies")} className="px-2 py-0.5 rounded border border-[#2A2140] hover:border-[#7C3AED]">{cell(r.flies)}</button></td>
                <td className="p-2">{cell(r.imp)}</td>
                <td className="p-2">{cell(r.and)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div className={`rounded-lg border p-3 ${result.good ? "bg-[#173626]/40 border-[#255239]" : "bg-[#3A1C22]/30 border-[#5C2F37]"}`}>
          <p className="text-xs text-[#4ADE80]">CORRECT FORM</p>
          <p className="font-mono text-[#E4D9FF]">{result.goodF}</p>
          <p className={`text-sm font-semibold ${result.good ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{result.good ? "TRUE" : "FALSE"}</p>
        </div>
        <div className="rounded-lg border border-[#2A2140] bg-[#0F0A1A] p-3">
          <p className="text-xs text-[#F87171]">COMMON MISTAKE</p>
          <p className="font-mono text-[#E4D9FF]">{result.badF}</p>
          <p className={`text-sm font-semibold ${result.bad ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{result.bad ? "TRUE" : "FALSE"}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-[#C9BFE3]">
        {mode === "all"
          ? "With ∧, the Rock makes the claim false, because the Rock is not a bird. 'All birds fly' says nothing about rocks. With →, a non-bird makes B(x) → F(x) true automatically, so only birds can break the statement."
          : "With →, the Rock makes the claim true automatically, because the Rock is not a bird. That would let 'Some birds fly' be true even when no bird flies. With ∧ we force one object to be a bird and to fly."}
      </p>
    </Panel>
  );
}

function Patterns() {
  const rows = [
    ["All A are B", "∀x (A(x) → B(x))", "All students are intelligent", "∀x (S(x) → I(x))"],
    ["Some A are B", "∃x (A(x) ∧ B(x))", "Some students are intelligent", "∃x (S(x) ∧ I(x))"],
    ["No A are B", "∀x (A(x) → ¬B(x))", "No students are intelligent", "∀x (S(x) → ¬I(x))"],
  ];
  return (
    <Panel>
      <SectionTitle title="Three patterns to memorize">Most English sentences reduce to one of these. Spot the keyword first: "all/every", "some/there is", or "no".</SectionTitle>
      <div className="mt-4 overflow-x-auto rounded-xl border border-[#211934]">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#1A1330] text-[#F4B942]"><tr><th className="p-2 text-left">English pattern</th><th className="p-2 text-left">Logic</th><th className="p-2 text-left">Example</th><th className="p-2 text-left">Formula</th></tr></thead>
          <tbody className="text-[#E4D9FF]">
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-[#2A2140]">
                <td className="p-2">{r[0]}</td>
                <td className="p-2 font-mono text-[#F4B942]">{r[1]}</td>
                <td className="p-2 text-[#C9BFE3]">{r[2]}</td>
                <td className="p-2 font-mono text-[#F4B942]">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

const TRY = [
  { s: "Every student studies.", legend: "S(x): x is a student. T(x): x studies.", f: "∀x (S(x) → T(x))" },
  { s: "Every dog is an animal.", legend: "D(x): x is a dog. A(x): x is an animal.", f: "∀x (D(x) → A(x))" },
  { s: "There is a man who is tall.", legend: "M(x): x is a man. T(x): x is tall.", f: "∃x (M(x) ∧ T(x))" },
  { s: "There is a student who likes discrete mathematics.", legend: "S(x): x is a student. L(x): x likes discrete mathematics.", f: "∃x (S(x) ∧ L(x))" },
  { s: "Some dogs are friendly.", legend: "D(x): x is a dog. Fr(x): x is friendly.", f: "∃x (D(x) ∧ Fr(x))" },
  { s: "Every mother loves her child.", legend: "Mo(x, y): x is the mother of y. L(x, y): x loves y.", f: "∀x ∀y (Mo(x, y) → L(x, y)), or in a more detail (if we break it down one by one): ∀x (M(x) → ∀y (ChildOf(y,x) → L(x,y)))" },
];

function TryThis() {
  const [open, setOpen] = useState({});
  return (
    <Panel>
      <SectionTitle title="Let's try this">Write your own formula on paper first, then reveal the answer to compare. Ask yourself: is the keyword "every" or "some"?</SectionTitle>
      <div className="mt-4 grid gap-3">
        {TRY.map((item, i) => (
          <div key={item.s} className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3">
            <p className="text-sm text-[#E4D9FF]"><span className="font-mono text-[#B48CFF] mr-2">{i + 1}.</span>{item.s}</p>
            <p className="text-xs text-[#9C93B3] mt-1">{item.legend}</p>
            {open[i] ? (
              <p className="mt-2 font-mono text-sm text-[#F4B942]">{item.f}</p>
            ) : (
              <button onClick={() => setOpen((cur) => ({ ...cur, [i]: true }))} className="mt-2 rounded-lg border border-[#2A2140] bg-[#130E20] px-3 py-1.5 text-xs text-[#9C93B3] hover:border-[#7C3AED] hover:text-white transition">Reveal answer</button>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default function TranslationSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 3 · PREDICATE LOGIC</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">Translating Quantified Statements</h2>
        <p className="mt-2 text-[#9C93B3] max-w-3xl">Turning an English sentence into logic is a skill, and it follows a routine: define the predicates, pick the quantifier, then choose the connective.</p>
      </div>

      <Patterns />
      <OperatorLab />

      <WorkedExample
        tag="TRANSLATION"
        title='"All birds fly"'
        given={<>
          <p><F>B(x)</F>: "x is a bird"</p>
          <p><F>F(x)</F>: "x flies"</p>
        </>}
        asked={<p>Write the sentence as a logic formula.</p>}
        steps={[
          { title: "Find the quantifier", text: "'All' means universal, so we start with ∀x." },
          { title: "Choose the connective", text: "'All birds fly' means: if something is a bird, then it flies. An implication fits.", formula: "B(x) → F(x)" },
          { title: "Combine", formula: "∀x (B(x) → F(x))" },
          { title: "Read it back", text: "For every x, if x is a bird, then x flies." },
        ]}
        answer="∀x (B(x) → F(x)). Using ∧ here would claim that everything in the domain is a bird and flies."
      />

      <WorkedExample
        tag="TRANSLATION"
        title='"Some birds can fly"'
        given={<>
          <p><F>B(x)</F>: "x is a bird"</p>
          <p><F>F(x)</F>: "x can fly"</p>
        </>}
        asked={<p>Write the sentence as a logic formula.</p>}
        steps={[
          { title: "Find the quantifier", text: "'Some' means at least one, so we start with ∃x." },
          { title: "Choose the connective", text: "The same x must be a bird and able to fly. That is a conjunction.", formula: "B(x) ∧ F(x)" },
          { title: "Combine", formula: "∃x (B(x) ∧ F(x))" },
          { title: "Read it back", text: "There is at least one x such that x is a bird and x can fly." },
        ]}
        answer="∃x (B(x) ∧ F(x))"
      />

      <WorkedExample
        tag="TRANSLATION WITH TWO VARIABLES"
        title='"Every man respects his parent"'
        given={<>
          <p><F>M(x)</F>: "x is a man"</p>
          <p><F>Par(y, x)</F>: "y is a parent of x"</p>
          <p><F>R(x, y)</F>: "x respects y"</p>
        </>}
        asked={<p>Write the sentence as a logic formula.</p>}
        steps={[
          { title: "Outer quantifier", text: "'Every man' gives ∀x with M(x) as the condition.", formula: "∀x (M(x) → ...)" },
          { title: "Inner quantifier", text: "'His parent' means every person y who is a parent of x.", formula: "∀y (Par(y, x) → R(x, y))" },
          { title: "Combine", formula: "∀x (M(x) → ∀y (Par(y, x) → R(x, y)))" },
          { title: "Read it back", text: "Every man respects every person who is his parent." },
          { title: "A different meaning", text: "If we want 'every man has at least one parent and respects every one of his parents', the inner part becomes existential.", formula: "∀x (M(x) → ∃y (Par(y, x) ∧ R(x, y)))" },
        ]}
        answer="∀x (M(x) → ∀y (Par(y, x) → R(x, y)))"
      />

      <TryThis />

      <div className="pt-2">
        <h3 className="font-heading text-xl font-semibold text-white">University exercise</h3>
        <p className="mt-1 text-sm text-[#9C93B3] max-w-3xl">
          Let <F>S(x)</F> = "x is a student", <F>L(y)</F> = "y is a lecturer", and <F>C(x, y)</F> = "x has attended a class taught by y". The domain is all people associated with a university.
        </p>
      </div>

      <WorkedExample
        tag="UNIVERSITY EXERCISE (a)"
        title='"Every student has attended a class taught by at least one lecturer."'
        given={<>
          <p><F>S(x)</F>: x is a student</p>
          <p><F>L(y)</F>: y is a lecturer</p>
          <p><F>C(x, y)</F>: x has attended a class taught by y</p>
        </>}
        asked={<p>Express the statement using quantifiers.</p>}
        steps={[
          { title: "Main phrase: 'Every student...'", text: "'Every' needs ∀. S(x) is the condition, so we use →.", formula: "∀x (S(x) → ...)" },
          { title: "Second phrase: '...at least one lecturer'", text: "'At least one' needs ∃. y must be a lecturer and x attended y's class, so we use ∧.", formula: "∃y (L(y) ∧ C(x, y))" },
          { title: "Combine", formula: "∀x (S(x) → ∃y (L(y) ∧ C(x, y)))" },
          { title: "Read it back", text: "For every person x, if x is a student, then there is a person y such that y is a lecturer and x has attended a class taught by y." },
        ]}
        answer="∀x (S(x) → ∃y (L(y) ∧ C(x, y)))"
      />

      <WorkedExample
        tag="UNIVERSITY EXERCISE (b)"
        title='"There is a lecturer whose class no student has attended."'
        given={<p><F>S(x)</F>, <F>L(y)</F>, <F>C(x, y)</F> as above.</p>}
        asked={<p>Express the statement using quantifiers.</p>}
        steps={[
          { title: "Main phrase: 'There is a lecturer...'", text: "'There is' needs ∃. y must be a lecturer, so we use ∧.", formula: "∃y (L(y) ∧ ...)" },
          { title: "Condition: '...no student attended'", text: "'No student' means every student did not attend. That is ∀x with an implication and a negated C.", formula: "∀x (S(x) → ¬C(x, y))" },
          { title: "Combine", formula: "∃y (L(y) ∧ ∀x (S(x) → ¬C(x, y)))" },
          { title: "Read it back", text: "There is a lecturer y such that every student x has not attended a class taught by y." },
        ]}
        answer="∃y (L(y) ∧ ∀x (S(x) → ¬C(x, y)))"
      />

      <WorkedExample
        tag="UNIVERSITY EXERCISE (c)"
        title="Negate the formula from part (a)"
        given={<>
          <p>The formula from (a): <F>∀x (S(x) → ∃y (L(y) ∧ C(x, y)))</F></p>
          <p>Rules: <F>¬∀x P(x) ≡ ∃x ¬P(x)</F>, <F>¬∃y P(y) ≡ ∀y ¬P(y)</F>, <F>¬(P → Q) ≡ P ∧ ¬Q</F></p>
        </>}
        asked={<p>The negation in symbols and in plain English.</p>}
        steps={[
          { title: "Put ¬ in front", formula: "¬∀x (S(x) → ∃y (L(y) ∧ C(x, y)))" },
          { title: "Flip the outer quantifier", text: "¬∀ becomes ∃¬.", formula: "∃x ¬(S(x) → ∃y (L(y) ∧ C(x, y)))" },
          { title: "Negate the implication", text: "¬(P → Q) becomes P ∧ ¬Q.", formula: "∃x (S(x) ∧ ¬∃y (L(y) ∧ C(x, y)))" },
          { title: "Flip the inner quantifier", text: "¬∃y becomes ∀y ¬.", formula: "∃x (S(x) ∧ ∀y ¬(L(y) ∧ C(x, y)))" },
          { title: "Apply De Morgan, then rewrite as an implication", text: "¬(L ∧ C) ≡ ¬L ∨ ¬C ≡ L → ¬C.", formula: "∃x (S(x) ∧ ∀y (L(y) → ¬C(x, y)))" },
        ]}
        answer="∃x (S(x) ∧ ∀y (L(y) → ¬C(x, y))). In English: there is at least one student who has not attended a class taught by any lecturer."
      />
    </div>
  );
}
