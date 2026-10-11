import { useState } from "react";
import { Panel, SectionTitle } from "../shared/ui";
import { RULES } from "./rules";
import { ArgumentForm, TruthToggle } from "./Widgets";

function Intro() {
  return (
    <Panel>
      <SectionTitle title="Arguments and validity">
        An <strong className="text-[#E4D9FF]">argument</strong> is a list of statements called <strong className="text-[#E4D9FF]">premises</strong>,
        followed by a <strong className="text-[#E4D9FF]">conclusion</strong>. The argument is <strong className="text-[#E4D9FF]">valid</strong> when
        the conclusion is true in every situation where all the premises are true.
      </SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg bg-[#0F0A1A] border border-[#7C3AED]/50 p-4">
          <p className="text-sm text-[#E4D9FF]">Valid does not mean the conclusion is true. It means the conclusion <em>follows</em> from the premises.</p>
          <p className="mt-2 text-sm text-[#9C93B3]">If every cat can fly and Tom is a cat, then Tom can fly. The argument is valid, even though the first premise is false.</p>
        </div>
        <div className="rounded-lg bg-[#0F0A1A] border border-[#F4B942]/50 p-4">
          <p className="text-sm text-[#E4D9FF]">A <strong>rule of inference</strong> is a small argument form that is always valid.</p>
          <p className="mt-2 text-sm text-[#9C93B3]">We chain these rules together, one step at a time, to build larger arguments and proofs.</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#9C93B3]">
        Notation: the line separates the premises from the conclusion, and the symbol <span className="font-mono text-[#F4B942]">∴</span> reads "therefore".
      </p>
    </Panel>
  );
}

function RuleExplorer() {
  const [ruleId, setRuleId] = useState("mp");
  const [vals, setVals] = useState({ p: true, q: true, r: true });
  const rule = RULES.find((item) => item.id === ruleId);

  const allPremises = rule.premises.every(([, fn]) => fn(vals));
  const concl = rule.conclusion[1](vals);

  return (
    <Panel>
      <SectionTitle title="Rule explorer">
        Pick a rule, then flip the truth values of its variables. Watch what happens whenever <strong className="text-[#E4D9FF]">all the
        premises are true</strong>: the conclusion is always true as well. That is exactly why the rule is valid.
      </SectionTitle>

      <div className="mt-4 flex flex-wrap gap-2">
        {RULES.map((item) => (
          <button
            key={item.id}
            onClick={() => setRuleId(item.id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              item.id === ruleId ? "bg-[#7C3AED] border-transparent text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:text-[#E4D9FF]"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
          <p className="text-xs text-[#9C93B3] mb-2">Set the variables</p>
          <div className="flex flex-wrap gap-2">
            {rule.vars.map((name) => (
              <TruthToggle key={name} name={name} value={vals[name]} onChange={(v) => setVals((cur) => ({ ...cur, [name]: v }))} />
            ))}
          </div>
          <div className="mt-4"><ArgumentForm premises={rule.premises} conclusion={rule.conclusion} values={vals} /></div>
        </div>

        <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
          <p className="text-sm text-[#E4D9FF]">{rule.idea}</p>
          <div className="mt-3 rounded-lg bg-[#130E20] border border-[#2A2140] p-3 text-sm text-[#C9BFE3]">
            <p className="text-xs text-[#9C93B3] mb-1">In words</p>
            {rule.example.map((line, i) => (
              <p key={i} className={i === rule.example.length - 1 ? "mt-1 pt-1 border-t border-[#2A2140] text-[#F4B942]" : ""}>
                {i === rule.example.length - 1 ? "So: " : ""}{line}
              </p>
            ))}
          </div>
          <div className={`mt-3 rounded-lg p-3 text-sm ${allPremises ? (concl ? "bg-[#173626]/40 text-[#4ADE80]" : "bg-[#3A1C22]/40 text-[#F87171]") : "bg-[#1A1330] text-[#9C93B3]"}`}>
            {allPremises
              ? concl
                ? "All premises are true, and the conclusion is true. The rule works here."
                : "All premises are true but the conclusion is false. This never happens for a valid rule."
              : "At least one premise is false, so the rule promises nothing in this row. Try another assignment."}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function RuleSummary() {
  return (
    <Panel>
      <SectionTitle title="Cheat sheet">The eight rules we use most. Each one is a tautology written as an argument.</SectionTitle>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {RULES.map((rule) => (
          <div key={rule.id} className="rounded-lg bg-[#0F0A1A] border border-[#211934] p-3 flex flex-col gap-2">
            <p className="text-sm font-semibold text-[#B48CFF]">{rule.name}</p>
            <ArgumentForm premises={rule.premises} conclusion={rule.conclusion} />
            <p className="text-xs text-[#9C93B3] leading-relaxed">{rule.idea}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const QUIZ = [
  { text: ["If the server crashes, the site goes down.", "The server crashes."], concl: "The site goes down.", answer: "mp", why: "The hypothesis of the conditional is given, so we conclude the consequent." },
  { text: ["If the alarm rings, I wake up.", "I did not wake up."], concl: "The alarm did not ring.", answer: "mt", why: "The consequent is denied, so the hypothesis is denied." },
  { text: ["If I get the job, I move.", "If I move, I need a car."], concl: "If I get the job, I need a car.", answer: "hs", why: "Two conditionals share the middle statement, so they chain." },
  { text: ["Tea or coffee is served.", "Tea is not served."], concl: "Coffee is served.", answer: "ds", why: "One option of an OR is eliminated, which leaves the other." },
  { text: ["Ana is a student and Ana is a tutor."], concl: "Ana is a tutor.", answer: "simp", why: "We keep one side of a true AND." },
  { text: ["The test passed.", "The build is green."], concl: "The test passed and the build is green.", answer: "conj", why: "Two separate truths are combined with AND." },
  { text: ["The file is saved."], concl: "The file is saved or the file is deleted.", answer: "add", why: "We widen a true statement with OR. Only one side needs to be true." },
];

function IdentifyQuiz() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const item = QUIZ[index];
  const done = index >= QUIZ.length;

  function choose(id) {
    if (picked) return;
    setPicked(id);
    if (id === item.answer) setScore((s) => s + 1);
  }
  function next() {
    setPicked(null);
    setIndex((i) => i + 1);
  }
  function restart() {
    setIndex(0); setPicked(null); setScore(0);
  }

  return (
    <Panel>
      <SectionTitle title="Which rule is this?">Read the argument and name the rule of inference that justifies it.</SectionTitle>
      {done ? (
        <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-5 text-center">
          <p className="text-2xl font-heading text-white">{score} / {QUIZ.length}</p>
          <p className="mt-1 text-sm text-[#9C93B3]">{score === QUIZ.length ? "Perfect. You can spot every rule." : "Review the cheat sheet above and try again."}</p>
          <button onClick={restart} className="mt-4 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">Try again</button>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
          <p className="text-xs text-[#9C93B3]">Question {index + 1} of {QUIZ.length}</p>
          <div className="mt-2 text-[#E4D9FF] text-sm">
            {item.text.map((line) => <p key={line}>{line}</p>)}
            <p className="mt-1 pt-1 border-t border-[#2A2140] text-[#F4B942]">Therefore: {item.concl}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {RULES.map((rule) => {
              const isAnswer = rule.id === item.answer;
              const state = !picked ? "idle" : isAnswer ? "right" : picked === rule.id ? "wrong" : "idle";
              return (
                <button
                  key={rule.id}
                  onClick={() => choose(rule.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                    state === "right" ? "bg-[#173626]/60 border-[#4ADE80] text-[#4ADE80]"
                    : state === "wrong" ? "bg-[#3A1C22]/60 border-[#F87171] text-[#F87171]"
                    : "bg-[#130E20] border-[#2A2140] text-[#C9BFE3] hover:border-[#7C3AED]/60"
                  }`}
                >
                  {rule.name}
                </button>
              );
            })}
          </div>
          {picked && (
            <div className="mt-3">
              <p className="text-sm text-[#C9BFE3]">
                {picked === item.answer ? "Correct. " : `Not quite, it is ${RULES.find((r) => r.id === item.answer).name}. `}{item.why}
              </p>
              <button onClick={next} className="mt-3 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">{index === QUIZ.length - 1 ? "See score" : "Next"}</button>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

export default function InferenceRulesSection() {
  return (
    <div className="space-y-6">
      <Intro />
      <RuleExplorer />
      <RuleSummary />
      <IdentifyQuiz />
    </div>
  );
}
