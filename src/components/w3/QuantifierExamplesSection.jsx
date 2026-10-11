import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { WorkedExample } from "../shared/WorkedExample";

const F = ({ children }) => <span className="font-mono text-[#F4B942]">{children}</span>;

function ParkingLot() {
  const [full, setFull] = useState([true, true, true, true, true, true]);
  const all = full.every(Boolean);
  const some = full.some(Boolean);
  const toggle = (i) => setFull((cur) => cur.map((v, j) => (j === i ? !v : v)));

  return (
    <Panel>
      <SectionTitle title="Interactive: parking spaces at PresUniv">
        Let <F>P(x)</F> = "x is full." The universe of discourse is all parking spaces at PresUniv. Click a space to switch it between full and empty.
      </SectionTitle>
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
        {full.map((isFull, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`rounded-lg border py-4 text-sm transition ${isFull ? "bg-[#3A1C22]/50 border-[#F87171]/60 text-[#F87171]" : "bg-[#173626]/40 border-[#4ADE80]/50 text-[#4ADE80]"}`}
          >
            <span className="block font-mono text-xs opacity-70">Space {i + 1}</span>
            {isFull ? "Full" : "Empty"}
          </button>
        ))}
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div className={`rounded-lg border p-3 ${all ? "bg-[#173626]/40 border-[#255239]" : "bg-[#3A1C22]/30 border-[#5C2F37]"}`}>
          <p className="font-mono text-[#E4D9FF]">∀x P(x)</p>
          <p className="text-xs text-[#9C93B3] mt-1">"All parking spaces are full." / "Every parking space is full."</p>
          <p className={`mt-1 text-sm font-semibold ${all ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{all ? "TRUE: every space is full." : "FALSE: at least one space is empty."}</p>
        </div>
        <div className={`rounded-lg border p-3 ${some ? "bg-[#173626]/40 border-[#255239]" : "bg-[#3A1C22]/30 border-[#5C2F37]"}`}>
          <p className="font-mono text-[#E4D9FF]">∃x P(x)</p>
          <p className="text-xs text-[#9C93B3] mt-1">"Some parking space is full." / "At least one parking space is full."</p>
          <p className={`mt-1 text-sm font-semibold ${some ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{some ? "TRUE: at least one space is full." : "FALSE: no space is full."}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-[#9C93B3]">
        Try it: start with all spaces full, then empty one space. <F>∀x P(x)</F> breaks immediately. Then empty all of them, and only then does <F>∃x P(x)</F> break.
      </p>
    </Panel>
  );
}

function WhenTrueFalse() {
  return (
    <Panel>
      <SectionTitle title="When is a quantified statement true or false?">Keep this table in your notes. Every quantifier question comes back to it.</SectionTitle>
      <div className="mt-4 overflow-x-auto rounded-xl border border-[#211934]">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#1A1330] text-[#F4B942]">
            <tr><th className="p-3 text-left"></th><th className="p-3 text-left font-mono">∀x P(x)</th><th className="p-3 text-left font-mono">∃x P(x)</th></tr>
          </thead>
          <tbody className="text-[#E4D9FF]">
            <tr className="border-t border-[#2A2140]"><td className="p-3 text-[#9C93B3]">Name</td><td className="p-3">Universal quantifier</td><td className="p-3">Existential quantifier</td></tr>
            <tr className="border-t border-[#2A2140]"><td className="p-3 text-[#9C93B3]">True when</td><td className="p-3 text-[#4ADE80]">P(x) is true for every x.</td><td className="p-3 text-[#4ADE80]">There is an x for which P(x) is true.</td></tr>
            <tr className="border-t border-[#2A2140]"><td className="p-3 text-[#9C93B3]">False when</td><td className="p-3 text-[#F87171]">There is an x for which P(x) is false.</td><td className="p-3 text-[#F87171]">P(x) is false for every x.</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-[#9C93B3]">Notice the pattern: to make a ∀ statement false you need just one counterexample, and to make a ∃ statement true you need just one witness.</p>
    </Panel>
  );
}

const CLASSIFY = [
  { expr: "CS-Upitt-graduate(x) ∧ Honor-student(x)", say: "x is a CS-Upitt-graduate and x is an honor student.", prop: false, why: "The variable x is free. Without a quantifier or a specific value for x, there is no definite truth value." },
  { expr: "∃x (CS-Upitt-graduate(x) ∧ Honor-student(x))", say: "There is a person who is a CS-Upitt-graduate and also an honor student.", prop: true, why: "The quantifier binds x, so this is a definite claim that is either true or false in the given universe." },
  { expr: "x + 1 > x", say: "x plus one is greater than x.", prop: false, why: "x is free again. We cannot say true or false until x is bound or replaced." },
  { expr: "∀x (x + 1 > x)", say: "For every real number x, x + 1 > x.", prop: true, why: "Binding x with ∀ makes it a proposition. It is true over the real numbers." },
  { expr: "P(5)", say: "P of five, for example 5 > 3.", prop: true, why: "Replacing x with a specific value also gives a proposition." },
];

function PropositionCheck() {
  const [answers, setAnswers] = useState({});
  return (
    <Panel>
      <SectionTitle title="Quantified statement or open statement?">
        A <strong className="text-[#E4D9FF]">proposition</strong> needs a definite truth value. A variable can be made definite in two ways: give it a value, or bind it with a quantifier.
        A variable that is still unbound is called a <strong className="text-[#E4D9FF]">free variable</strong>. Decide for each expression.
      </SectionTitle>
      <div className="mt-4 space-y-3">
        {CLASSIFY.map((item, i) => {
          const a = answers[i];
          const answered = a !== undefined;
          return (
            <div key={i} className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
              <p className="font-mono text-sm text-[#F4B942] break-words">{item.expr}</p>
              <p className="text-xs text-[#9C93B3] mt-1">{item.say}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[[true, "Proposition"], [false, "Not a proposition"]].map(([val, label]) => {
                  const right = answered && val === item.prop;
                  const wrong = answered && a === val && val !== item.prop;
                  return (
                    <button
                      key={label}
                      disabled={answered}
                      onClick={() => setAnswers((cur) => ({ ...cur, [i]: val }))}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition ${right ? "bg-[#173626]/60 border-[#4ADE80] text-[#4ADE80]" : wrong ? "bg-[#3A1C22]/60 border-[#F87171] text-[#F87171]" : "bg-[#130E20] border-[#2A2140] text-[#C9BFE3] hover:border-[#7C3AED]/60"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {answered && <p className="mt-3 text-sm text-[#C9BFE3]">{a === item.prop ? "Correct. " : "Not quite. "}{item.why}</p>}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export default function QuantifierExamplesSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 3 · PREDICATE LOGIC</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">Quantifier Examples</h2>
        <p className="mt-2 text-[#9C93B3] max-w-3xl">Every example here follows the same answer format: Given, Asked, Solution. Use it on your own homework and exams too.</p>
      </div>

      <WorkedExample
        tag="UNIVERSAL QUANTIFIER"
        title="Is ∀x P(x) true for x + 1 > x?"
        given={<>
          <p>Predicate: <F>P(x)</F> = "x + 1 &gt; x"</p>
          <p>Domain: all real numbers</p>
        </>}
        asked={<p>The truth value of <F>∀x P(x)</F>.</p>}
        steps={[
          { title: "Recall the rule", text: "∀x P(x) is true only if P(x) is true for every x in the domain." },
          { title: "Test the predicate", text: "Subtract x from both sides of x + 1 > x.", formula: "x + 1 > x  ⟹  1 > 0" },
          { title: "Check the result", text: "1 > 0 is true no matter which real number x is, so P(x) is true for every real x." },
        ]}
        answer="∀x P(x) is TRUE over the real numbers, with no exceptions."
      />

      <WorkedExample
        tag="UNIVERSAL QUANTIFIER"
        title="Reading ∀x P(x) in plain English"
        given={<>
          <p>Predicate: <F>P(x)</F> = "x is full."</p>
          <p>Universe of discourse: all parking spaces at PresUniv.</p>
        </>}
        asked={<p>Translate <F>∀x P(x)</F> into natural language.</p>}
        steps={[
          { title: "Read the quantifier", text: "∀ means 'for all' or 'for every'." },
          { title: "Fill in the universe", text: "x ranges over parking spaces at PresUniv." },
          { title: "Fill in the predicate", text: "P(x) says that the space is full." },
        ]}
        answer={'"All parking spaces at PresUniv are full." Equivalent forms: "Every parking space at PresUniv is full." and "For each parking space at PresUniv, that space is full."'}
      />

      <ParkingLot />
      <WhenTrueFalse />

      <WorkedExample
        tag="EXISTENTIAL QUANTIFIER"
        title="Is ∃x P(x) true for x > 3?"
        given={<>
          <p>Predicate: <F>P(x)</F> = "x &gt; 3"</p>
          <p>Domain: all real numbers</p>
        </>}
        asked={<p>The truth value of <F>∃x P(x)</F>.</p>}
        steps={[
          { title: "Recall the rule", text: "∃x P(x) is true if we can find at least one x that makes P(x) true. One witness is enough." },
          { title: "Look for a witness", text: "Try x = 4.", formula: "4 > 3 is true" },
          { title: "Conclude", text: "We found a witness, so there is no need to check the other numbers." },
        ]}
        answer="∃x P(x) is TRUE. It is false only when P(x) is false for every element of the domain."
      />

      <WorkedExample
        tag="EXISTENTIAL QUANTIFIER"
        title="Is ∃x Q(x) true for x = x + 1?"
        given={<>
          <p>Predicate: <F>Q(x)</F> = "x = x + 1"</p>
          <p>Domain: all real numbers</p>
        </>}
        asked={<p>The truth value of <F>∃x Q(x)</F>.</p>}
        steps={[
          { title: "Recall the rule", text: "∃x Q(x) is true only if at least one element of the domain makes Q(x) true." },
          { title: "Try to solve the equation", text: "Subtract x from both sides of x = x + 1.", formula: "0 = 1" },
          { title: "Interpret", text: "0 = 1 is a contradiction, so no real number satisfies Q(x). There is no witness." },
        ]}
        answer="∃x Q(x) is FALSE, because Q(x) is false for every real number."
      />

      <WorkedExample
        tag="EXISTENTIAL QUANTIFIER"
        title="Reading ∃x P(x) in plain English"
        given={<>
          <p>Predicate: <F>P(x)</F> = "x is full."</p>
          <p>Universe of discourse: parking spaces at PresUniv.</p>
        </>}
        asked={<p>Translate <F>∃x P(x)</F> into natural language.</p>}
        steps={[
          { title: "Read the quantifier", text: "∃ means 'there exists', 'some', or 'at least one'." },
          { title: "Fill in the universe and predicate", text: "At least one parking space at PresUniv is full." },
        ]}
        answer={'"Some parking space at PresUniv is full." Equivalent forms: "There is a parking space at PresUniv that is full." and "At least one parking space at PresUniv is full."'}
      />

      <PropositionCheck />
    </div>
  );
}
