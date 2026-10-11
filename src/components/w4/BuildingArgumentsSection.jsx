import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { FALLACIES, RULES } from "./rules";
import { ArgumentForm, TruthToggle } from "./Widgets";

const PROBLEMS = [
  {
    title: "Rainy day",
    story: "If it rains, the ground is wet. If the ground is wet, the match is cancelled. It rains. Show that the match is cancelled.",
    steps: [
      { f: "p → q", note: "If it rains, the ground is wet" },
      { f: "q → r", note: "If the ground is wet, the match is cancelled" },
      { f: "p", note: "It rains" },
      { f: "q", rule: "mp", refs: "1, 3" },
      { f: "r", rule: "mp", refs: "2, 4" },
    ],
  },
  {
    title: "Study plan",
    story: "If I study, I pass. I did not pass. If I do not study, I go to the party. Show that I go to the party.",
    steps: [
      { f: "s → p", note: "If I study, I pass" },
      { f: "¬p", note: "I did not pass" },
      { f: "¬s → a", note: "If I do not study, I go to the party" },
      { f: "¬s", rule: "mt", refs: "1, 2" },
      { f: "a", rule: "mp", refs: "3, 4" },
    ],
  },
  {
    title: "Weekend",
    story: "It is cold and it is windy. If it is cold, we stay home. Show that we stay home or we go shopping.",
    steps: [
      { f: "c ∧ w", note: "It is cold and it is windy" },
      { f: "c → h", note: "If it is cold, we stay home" },
      { f: "c", rule: "simp", refs: "1" },
      { f: "h", rule: "mp", refs: "2, 3" },
      { f: "h ∨ s", rule: "add", refs: "4" },
    ],
  },
  {
    title: "Bug hunt",
    story: "The bug is in the client or the server. The bug is not in the client. If the bug is in the server, the logs show an error. Show that the logs show an error.",
    steps: [
      { f: "c ∨ s", note: "The bug is in the client or the server" },
      { f: "¬c", note: "The bug is not in the client" },
      { f: "s → e", note: "If the bug is in the server, the logs show an error" },
      { f: "s", rule: "ds", refs: "1, 2" },
      { f: "e", rule: "mp", refs: "3, 4" },
    ],
  },
];

function ProofBuilder() {
  const [pIndex, setPIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const problem = PROBLEMS[pIndex];
  const derived = problem.steps.map((s, i) => [s, i]).filter(([s]) => s.rule);
  const allRight = derived.every(([s, i]) => answers[i] === s.rule);

  function switchProblem(i) {
    setPIndex(i); setAnswers({}); setChecked(false);
  }

  return (
    <Panel>
      <SectionTitle title="Proof builder">
        A formal argument is a numbered list. Premises come first, and every later line must be justified by a rule applied to earlier lines.
        Choose the rule that justifies each derived line.
      </SectionTitle>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROBLEMS.map((item, i) => (
          <button key={item.title} onClick={() => switchProblem(i)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${i === pIndex ? "bg-[#7C3AED] border-transparent text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]"}`}>
            {item.title}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-[#C9BFE3]">{problem.story}</p>

      <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] overflow-x-auto">
        {problem.steps.map((step, i) => {
          const ok = checked && step.rule && answers[i] === step.rule;
          const bad = checked && step.rule && answers[i] !== step.rule;
          return (
            <div key={i} className={`flex flex-wrap items-center gap-3 px-4 py-2.5 border-t first:border-t-0 border-[#211934] ${ok ? "bg-[#173626]/20" : bad ? "bg-[#3A1C22]/20" : ""}`}>
              <span className="font-mono text-xs text-[#5B5470] w-5">{i + 1}</span>
              <span className="font-mono text-[#F4B942] w-24">{step.f}</span>
              {step.rule ? (
                <>
                  <select
                    value={answers[i] ?? ""}
                    onChange={(e) => { setAnswers((cur) => ({ ...cur, [i]: e.target.value })); setChecked(false); }}
                    className="bg-[#130E20] border border-[#2A2140] rounded-lg px-2 py-1 text-sm text-[#E4D9FF]"
                  >
                    <option value="">Choose a rule</option>
                    {RULES.map((rule) => <option key={rule.id} value={rule.id}>{rule.name}</option>)}
                  </select>
                  <span className="font-mono text-xs text-[#9C93B3]">from line {step.refs}</span>
                  {ok && <span className="text-xs text-[#4ADE80]">Correct</span>}
                  {bad && <span className="text-xs text-[#F87171]">Check this rule again</span>}
                </>
              ) : (
                <span className="text-sm text-[#9C93B3]">Premise: {step.note}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setChecked(true)} className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">Check my proof</button>
        <button onClick={() => { setAnswers({}); setChecked(false); }} className="px-4 py-2 rounded-lg border border-[#2A2140] text-[#9C93B3] text-sm">Reset</button>
        {checked && allRight && <span className="text-sm text-[#4ADE80]">The argument is complete and valid.</span>}
      </div>
    </Panel>
  );
}

function FallacyHunter() {
  const [fallId, setFallId] = useState("ac");
  const [vals, setVals] = useState({ p: true, q: true });
  const fall = FALLACIES.find((f) => f.id === fallId);
  const premisesTrue = fall.premises.every(([, fn]) => fn(vals));
  const concl = fall.conclusion[1](vals);
  const counter = premisesTrue && !concl;

  return (
    <Panel>
      <SectionTitle title="Fallacy hunter">
        Two forms look just like Modus Ponens and Modus Tollens, but they are <strong className="text-[#E4D9FF]">not valid</strong>.
        To show an argument is invalid, you only need one <strong className="text-[#E4D9FF]">counterexample</strong>: a row where every premise is true and the conclusion is false.
      </SectionTitle>

      <div className="mt-4 flex flex-wrap gap-2">
        {FALLACIES.map((f) => (
          <button key={f.id} onClick={() => setFallId(f.id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${f.id === fallId ? "bg-[#7C3AED] border-transparent text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]"}`}>
            {f.name}
          </button>
        ))}
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
          <p className="text-xs text-[#9C93B3] mb-2">Challenge: find values that break the argument</p>
          <div className="flex gap-2">
            {["p", "q"].map((name) => <TruthToggle key={name} name={name} value={vals[name]} onChange={(v) => setVals((cur) => ({ ...cur, [name]: v }))} />)}
          </div>
          <div className="mt-4"><ArgumentForm premises={fall.premises} conclusion={fall.conclusion} values={vals} /></div>
          <div className={`mt-4 rounded-lg p-3 text-sm ${counter ? "bg-[#3A1C22]/40 text-[#F87171]" : "bg-[#1A1330] text-[#9C93B3]"}`}>
            {counter
              ? "Counterexample found. Both premises are true, yet the conclusion is false, so the argument is invalid."
              : "No counterexample here. Keep flipping the values."}
          </div>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4 text-sm text-[#C9BFE3]">
          <p className="text-xs text-[#9C93B3] mb-1">In words</p>
          {fall.example.map((line) => <p key={line}>{line}</p>)}
          <p className="mt-3 text-[#9C93B3]">
            Remember: <span className="font-mono text-[#F4B942]">p → q</span> only says what happens when p is true.
            It says nothing about what happens when p is false, or about what else could cause q.
          </p>
        </div>
      </div>
    </Panel>
  );
}

function ValidityChecker() {
  const [argId, setArgId] = useState("mp");
  const all = [...RULES.filter((r) => ["mp", "mt", "hs", "ds"].includes(r.id)), ...FALLACIES];
  const arg = all.find((a) => a.id === argId);
  const names = ["p", "q", "r"].filter((n) => arg.vars.includes(n));
  const rows = Array.from({ length: 2 ** names.length }, (_, i) =>
    Object.fromEntries(names.map((n, j) => [n, Boolean((i >> (names.length - 1 - j)) & 1)])));
  const critical = rows.filter((v) => arg.premises.every(([, fn]) => fn(v)));
  const valid = critical.every((v) => arg.conclusion[1](v));

  return (
    <Panel>
      <SectionTitle title="Truth table validity test">
        A second way to test validity: write the truth table, keep only the <strong className="text-[#E4D9FF]">critical rows</strong> (all premises true),
        and check that the conclusion is true in each of them.
      </SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        {all.map((a) => (
          <button key={a.id} onClick={() => setArgId(a.id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${a.id === argId ? "bg-[#7C3AED] border-transparent text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]"}`}>
            {a.name}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-[#211934]">
        <table className="w-full font-mono text-sm text-center border-collapse">
          <thead className="bg-[#1A1330] text-[#F4B942]">
            <tr>
              {names.map((n) => <th key={n} className="p-2">{n}</th>)}
              {arg.premises.map(([label]) => <th key={label} className="p-2">{label}</th>)}
              <th className="p-2">∴ {arg.conclusion[0]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v, i) => {
              const isCritical = arg.premises.every(([, fn]) => fn(v));
              const c = arg.conclusion[1](v);
              const cell = (b) => <span className={b ? "text-[#4ADE80]" : "text-[#F87171]"}>{b ? "T" : "F"}</span>;
              return (
                <tr key={i} className={`border-t border-[#2A2140] ${isCritical ? (c ? "bg-[#173626]/30" : "bg-[#3A1C22]/50") : ""}`}>
                  {names.map((n) => <td key={n} className="p-2">{cell(v[n])}</td>)}
                  {arg.premises.map(([label, fn]) => <td key={label} className="p-2">{cell(fn(v))}</td>)}
                  <td className="p-2">{cell(c)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="px-3 py-2 text-xs text-[#9C93B3] bg-[#0F0A1A] border-t border-[#211934]">Highlighted rows are the critical rows.</p>
      </div>
      <div className={`mt-3 rounded-lg p-3 text-sm ${valid ? "bg-[#173626]/40 text-[#4ADE80]" : "bg-[#3A1C22]/40 text-[#F87171]"}`}>
        {valid ? "Every critical row has a true conclusion, so the argument is valid." : "A critical row has a false conclusion, so the argument is invalid."}
      </div>
    </Panel>
  );
}

export default function BuildingArgumentsSection() {
  return (
    <div className="space-y-6">
      <ProofBuilder />
      <FallacyHunter />
      <ValidityChecker />
    </div>
  );
}
