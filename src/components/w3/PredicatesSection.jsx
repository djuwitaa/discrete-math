import { useState } from "react";
import { Check, Cpu, Database, ShieldCheck, Sparkles } from "lucide-react";
import { Panel, SectionTitle } from "../shared/ui";

// ---------------------------------------------------------------------------
// 1. Why propositional logic isn't enough
// ---------------------------------------------------------------------------
const sampleInputs = [-1, 0, 3, 4, 10];

function WhyNotEnough() {
  const [picked, setPicked] = useState(null);
  return (
    <Panel>
      <SectionTitle title="The core problem: why propositional logic isn't enough">
        Propositional logic can combine statements with ∧, ∨, ¬, →, ↔, but it has no way to talk about a whole
        <em> family</em> of statements that share a pattern, like "x is greater than 3." Try it yourself below.
      </SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="font-mono text-lg text-[#E4D9FF]">x &gt; 3 <span className="font-sans text-sm text-[#9C93B3]">→ true, false, or neither?</span></p>
        <p className="mt-2 text-sm text-[#9C93B3]">Pick a value for x and see what happens:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sampleInputs.map((value) => (
            <button key={value} onClick={() => setPicked(value)} className={`rounded-lg border px-3 py-1.5 text-sm font-mono transition ${picked === value ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:border-[#7C3AED]"}`}>x = {value}</button>
          ))}
        </div>
        {picked !== null ? (
          <div className={`mt-4 rounded-lg p-3 text-sm font-mono ${picked > 3 ? "bg-[#173626]/40 text-[#4ADE80]" : "bg-[#3A1C22]/40 text-[#F87171]"}`}>
            {picked} &gt; 3 is {picked > 3 ? "TRUE" : "FALSE"}
          </div>
        ) : (
          <div className="mt-4 rounded-lg p-3 text-sm bg-[#1A1330] text-[#B48CFF]">Nothing is picked yet, so right now "x &gt; 3" is neither true nor false.</div>
        )}
      </div>
      <p className="mt-4 text-sm text-[#E4D9FF]">
        Notice the truth value keeps <strong>flipping</strong> depending on what you plug in. That is exactly the problem:
        a statement with an unassigned variable is <strong className="text-[#F4B942]">not a proposition</strong>. It has no fixed truth
        value until the variable is given a specific value. Predicate logic is built to describe and reason about statements like this.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 2. Components of predicate logic: subject & predicate
// ---------------------------------------------------------------------------
function AnatomyOfPredicate() {
  return (
    <Panel>
      <SectionTitle title="Components of predicate logic: subject and predicate">
        Every predicate statement splits into two parts: a variable subject and a property being asserted about it.
      </SectionTitle>
      <div className="mt-5 rounded-xl bg-[#0F0A1A] border border-[#211934] p-5">
        <p className="font-mono text-xl text-center">
          <span className="rounded-lg bg-[#7C3AED]/30 border border-[#7C3AED] px-2 py-1 text-[#E4D9FF]">x</span>
          <span className="text-[#9C93B3]"> is </span>
          <span className="rounded-lg bg-[#1D1530] border border-[#F4B942] px-2 py-1 text-[#F4B942]">greater than 3</span>
        </p>
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#130E20] border border-[#7C3AED]/50 p-3">
            <p className="text-xs font-mono text-[#B48CFF] uppercase tracking-wide">Subject (x)</p>
            <p className="mt-1 text-sm text-[#E4D9FF]">The variable that the statement is about. It stands in for any object we might substitute later.</p>
          </div>
          <div className="rounded-lg bg-[#130E20] border border-[#F4B942]/50 p-3">
            <p className="text-xs font-mono text-[#F4B942] uppercase tracking-wide">Predicate ("is greater than 3")</p>
            <p className="mt-1 text-sm text-[#E4D9FF]">The property or relation the subject may or may not have. This is the part that becomes true or false.</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 3. Applications of predicate logic
// ---------------------------------------------------------------------------
const applications = [
  { icon: Database, title: "Database queries", detail: "SQL's WHERE clause is a predicate: \"price > 100\" filters rows where the predicate is true." },
  { icon: ShieldCheck, title: "Program verification", detail: "Preconditions and postconditions in software (like \"if x > 0\") are predicates that guard what code is allowed to run." },
  { icon: Cpu, title: "Formal specifications", detail: "Hardware and protocol designs describe required behaviour precisely using predicates over signals and states." },
  { icon: Sparkles, title: "Artificial intelligence", detail: "Knowledge bases and rule engines represent facts and rules as predicates so a machine can reason about them." },
];

function ApplicationsOfPredicateLogic() {
  return (
    <Panel>
      <SectionTitle title="Applications of predicate logic">
        Predicate logic is the backbone of anywhere we need to reason about properties of many objects at once, not just isolated facts.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {applications.map(({ icon: Icon, title, detail }) => (
          <div key={title} className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3">
            <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-[#B48CFF]" /><p className="text-sm font-semibold text-white">{title}</p></div>
            <p className="mt-1.5 text-xs text-[#9C93B3]">{detail}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 4. Universe of discourse + predicates as functions
// ---------------------------------------------------------------------------
function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function UniverseAndFunction() {
  const [domain, setDomain] = useState("integers");
  const domains = {
    integers: { label: "Domain: integers {2, 3, 4, 5, 6}", values: [2, 3, 4, 5, 6], test: (x) => isPrime(x) },
    reals: { label: "Domain: real numbers {2, 2.5, 3, 4, π}", values: [2, 2.5, 3, 4, Math.PI], test: (x) => isPrime(x) },
  };
  const current = domains[domain];
  return (
    <Panel>
      <SectionTitle title="Universe of discourse: the domain matters">
        The <strong className="text-[#E4D9FF]">universe of discourse</strong> (or domain) is the set of all values a variable is allowed to
        take. The same predicate can mean something completely different depending on which domain it ranges over.
      </SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="font-mono text-sm text-[#F4B942]">P(x): "x is a prime number"</p>
        <div className="mt-3 flex gap-2">
          <button onClick={() => setDomain("integers")} className={`rounded-lg border px-3 py-1.5 text-xs ${domain === "integers" ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "border-[#2A2140] text-[#9C93B3]"}`}>Domain = integers</button>
          <button onClick={() => setDomain("reals")} className={`rounded-lg border px-3 py-1.5 text-xs ${domain === "reals" ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "border-[#2A2140] text-[#9C93B3]"}`}>Domain = real numbers</button>
        </div>
        <p className="mt-3 text-xs text-[#9C93B3]">{current.label}</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full font-mono text-sm border-collapse">
            <thead className="text-[#F4B942]"><tr>{current.values.map((v) => <th key={v} className="p-2 border-b border-[#2A2140]">{typeof v === "number" ? Number(v.toFixed(2)) : v}</th>)}</tr></thead>
            <tbody><tr>{current.values.map((v) => <td key={v} className={`p-2 text-center ${current.test(v) ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{current.test(v) ? "T" : "F"}</td>)}</tr></tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-[#E4D9FF]">{domain === "integers" ? "Over the integers, primality is a meaningful, well-defined idea." : "Over the real numbers, \"prime\" barely applies at all, because almost nothing here is a whole number, so the predicate becomes false almost everywhere. Same P(x), different domain, different meaning."}</p>
      </div>
      <div className="mt-4 rounded-lg bg-[#1A1330] p-4 text-sm text-[#E4D9FF]">
        <strong>Predicates as functions:</strong> you can think of a predicate P as a function that maps every element of the domain to
        exactly one of two outputs: <span className="font-mono text-[#4ADE80]">True</span> or <span className="font-mono text-[#F87171]">False</span>.
        Formally, P : D → {"{True, False}"}, just like a math function maps inputs to outputs, except the only possible outputs are truth values.
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Reusable "guess then reveal" walkthrough for evaluating predicates
// ---------------------------------------------------------------------------
function EvalRow({ item }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <tr className="border-t border-[#211934]">
      <td className="p-3 align-top">
        <p className="font-mono text-[#F4B942]">{item.call}</p>
        <p className="text-xs text-[#9C93B3] mt-1">{item.substitution}</p>
      </td>
      <td className="p-3 align-top">
        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="rounded-lg border border-[#2A2140] bg-[#0F0A1A] px-3 py-1.5 text-xs text-[#9C93B3] hover:border-[#7C3AED] hover:text-white transition">Reveal truth value</button>
        ) : (
          <span className={`inline-block rounded-full border px-3 py-1 text-xs font-mono ${item.result ? "bg-[#173626]/50 border-[#255239] text-[#4ADE80]" : "bg-[#3A1C22]/50 border-[#5C2F37] text-[#F87171]"}`}>{item.result ? "TRUE" : "FALSE"}</span>
        )}
      </td>
    </tr>
  );
}

function PredicateWalkthrough({ title, statement, notation, cases }) {
  return (
    <Panel>
      <SectionTitle title={title}>{statement}</SectionTitle>
      <div className="mt-3 rounded-lg bg-[#0F0A1A] border border-[#211934] p-3 font-mono text-sm text-[#B48CFF]">{notation}</div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-[#211934]">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#1A1330] text-[#F4B942] text-left"><tr><th className="p-3 font-mono text-xs">Substitution</th><th className="p-3 font-mono text-xs">Truth value</th></tr></thead>
          <tbody>{cases.map((c) => <EvalRow key={c.call} item={c} />)}</tbody>
        </table>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 5. Propositional function (P(x): x > 3)
// ---------------------------------------------------------------------------
function PropositionalFunctionIntro() {
  return (
    <PredicateWalkthrough
      title="Propositional functions: turning a pattern into a proposition"
      statement={<>We denote the statement by <span className="font-mono text-[#F4B942]">P(x)</span>, where P is the predicate and x is the variable. Once a value is assigned to x, the statement becomes a proposition with a fixed truth value. This is why P(x) is also called a <strong className="text-[#E4D9FF]">propositional function</strong>.</>}
      notation='P(x) → "x > 3"'
      cases={[
        { call: "P(5)", substitution: 'Substitute x = 5 into "x > 3"', result: true },
        { call: "P(2)", substitution: 'Substitute x = 2 into "x > 3"', result: false },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// 6. Predicate examples: single & multiple arguments
// ---------------------------------------------------------------------------
function PredicateExamples() {
  return (
    <div className="space-y-5">
      <PredicateWalkthrough
        title="Example 1: Evaluating a one-variable predicate"
        statement={<>Let P(x) denote the statement "x is greater than 3." Find the truth values of P(4) and P(2).</>}
        notation="P(x) → x > 3"
        cases={[
          { call: "P(4)", substitution: 'We substitute x = 4 into "x > 3"', result: true },
          { call: "P(2)", substitution: 'We substitute x = 2 into "x > 3"', result: false },
        ]}
      />
      <PredicateWalkthrough
        title="Example 2: A predicate over named objects, not just numbers"
        statement={<>Let A(x) denote "Computer x is under attack." Campus status: only <strong className="text-[#E4D9FF]">CS2</strong> and <strong className="text-[#E4D9FF]">MATH1</strong> are currently under attack. The domain doesn't have to be numbers. It can be any set of objects.</>}
        notation='A(x) → "Computer x is under attack"'
        cases={[
          { call: "A(CS1)", substitution: "CS1 is not on the active-attack list", result: false },
          { call: "A(CS2)", substitution: "CS2 is on the active-attack list", result: true },
          { call: "A(MATH1)", substitution: "MATH1 is on the active-attack list", result: true },
        ]}
      />
      <PredicateWalkthrough
        title="Example 3: A predicate with two arguments"
        statement={<>Let Q(x, y) denote the statement "x = y + 3," where x and y are variables and Q is the predicate. A predicate can take more than one argument. It just needs a value for every variable before it becomes a proposition.</>}
        notation="Q(x, y) → x = y + 3"
        cases={[
          { call: "Q(1, 2)", substitution: 'Substitute x = 1, y = 2 into "x = y + 3" → "1 = 2 + 3"', result: false },
          { call: "Q(3, 0)", substitution: 'Substitute x = 3, y = 0 into "x = y + 3" → "3 = 0 + 3"', result: true },
        ]}
      />
      <PredicateWalkthrough
        title="Example 4: Two-argument predicate over named objects"
        statement={<>Let A(c, n) denote "Computer c is connected to network n." Status: MATH1 is connected to CAMPUS2, but not to CAMPUS1.</>}
        notation='A(c, n) → "Computer c is connected to network n"'
        cases={[
          { call: "A(MATH1, CAMPUS1)", substitution: "MATH1 is not connected to the CAMPUS1 network", result: false },
          { call: "A(MATH1, CAMPUS2)", substitution: "MATH1 is connected to the CAMPUS2 network", result: true },
        ]}
      />
      <PredicateWalkthrough
        title="Example 5: A predicate with three arguments"
        statement={<>Let R(x, y, z) denote "x + y = z," where x, y, and z are variables. Nothing stops a predicate from taking three, four, or any number of arguments.</>}
        notation="R(x, y, z) → x + y = z"
        cases={[
          { call: "R(1, 2, 3)", substitution: 'Substitute x = 1, y = 2, z = 3 → "1 + 2 = 3"', result: true },
          { call: "R(0, 0, 1)", substitution: 'Substitute x = 0, y = 0, z = 1 → "0 + 0 = 1"', result: false },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. n-place predicates (general definition)
// ---------------------------------------------------------------------------
function NPlacePredicate() {
  return (
    <Panel>
      <SectionTitle title="Generalizing: n-place predicates">
        Everything above is one pattern repeated: a predicate can take any number of variables.
      </SectionTitle>
      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
        <p className="font-mono text-lg text-center text-[#F4B942]">P(x<sub>1</sub>, x<sub>2</sub>, …, x<sub>n</sub>)</p>
        <p className="mt-3 text-sm text-[#E4D9FF]">A statement with n variables is the value of the <strong>propositional function</strong> P at the n-tuple (x<sub>1</sub>, x<sub>2</sub>, …, x<sub>n</sub>). P is also called an <strong className="text-white">n-place predicate</strong>, or an n-ary predicate.</p>
      </div>
      <div className="mt-4 grid sm:grid-cols-4 gap-2 text-center">
        {[["0-place", "A plain proposition (no variables at all)", "T (fixed sentence)"], ["1-place", "P(x)", "P(5)"], ["2-place", "Q(x, y)", "Q(1, 2)"], ["n-place", "R(x₁, …, xₙ)", "R(1, 2, 3, …)"]].map(([label, formula, example]) => (
          <div key={label} className="rounded-lg bg-[#1A1330] border border-[#2A2140] p-3">
            <p className="text-xs font-mono text-[#B48CFF]">{label}</p>
            <p className="mt-1 font-mono text-sm text-[#E4D9FF]">{formula}</p>
            <p className="mt-1 text-[11px] text-[#9C93B3]">{example}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[#9C93B3]">Fun fact: a 0-place predicate (a predicate with no variables left to fill in) is exactly what we called a <strong className="text-[#E4D9FF]">proposition</strong> back in Week 1. Propositional logic is really just the n = 0 special case of predicate logic.</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// 8. Application: predicates guarding real program execution
// ---------------------------------------------------------------------------
function ProgramExecutionDemo() {
  const [input, setInput] = useState(null);
  return (
    <Panel>
      <SectionTitle title="Applying it: predicates inside a real program">
        Consider this common statement in a computer program, where the condition is a predicate.
      </SectionTitle>
      <div className="mt-3 rounded-lg bg-[#0F0A1A] border border-[#211934] p-3 font-mono text-sm text-[#F4B942]">if x &gt; 0 then x := x + 1</div>
      <p className="mt-3 text-sm text-[#9C93B3]">Let P(x) be the statement "x &gt; 0." If P(x) is true, the assignment x := x + 1 runs; otherwise it's skipped. Try both inputs:</p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setInput(2)} className={`rounded-lg border px-3 py-1.5 text-sm font-mono ${input === 2 ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "border-[#2A2140] text-[#9C93B3]"}`}>Run with x = 2</button>
        <button onClick={() => setInput(0)} className={`rounded-lg border px-3 py-1.5 text-sm font-mono ${input === 0 ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "border-[#2A2140] text-[#9C93B3]"}`}>Run with x = 0</button>
      </div>
      {input !== null && (
        <div className="mt-4 rounded-xl bg-[#1A1330] border border-[#2A2140] p-4 space-y-2 text-sm">
          <p className="text-[#E4D9FF]"><Check className="inline w-4 h-4 mr-1 text-[#B48CFF]" />Evaluate the predicate condition P({input}):</p>
          <p className={`font-mono ${input > 0 ? "text-[#4ADE80]" : "text-[#F87171]"}`}>P({input}) → "{input} &gt; 0" is {input > 0 ? "TRUE" : "FALSE"}</p>
          {input > 0 ? (
            <p className="text-[#4ADE80]">✓ The assignment executes: x := {input} + 1 (x becomes {input + 1})</p>
          ) : (
            <p className="text-[#F87171]">✗ The condition is not met; the assignment is skipped (x stays {input})</p>
          )}
        </div>
      )}
    </Panel>
  );
}

export default function PredicatesSection() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">WEEK 3 · PREDICATE LOGIC</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">Predicate basics</h2>
        <p className="mt-2 text-[#9C93B3] max-w-3xl">Propositional logic treats every statement as an unbreakable block. Predicate logic opens that block up, letting us talk about variables, properties, and relationships, then plug in real values to get an answer.</p>
      </div>
      <WhyNotEnough />
      <AnatomyOfPredicate />
      <ApplicationsOfPredicateLogic />
      <UniverseAndFunction />
      <PropositionalFunctionIntro />
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2 mt-2">PREDICATES EXAMPLE</p>
        <PredicateExamples />
      </div>
      <NPlacePredicate />
      <ProgramExecutionDemo />
    </div>
  );
}
