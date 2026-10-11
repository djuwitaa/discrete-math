import { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Columns3,
  Layers,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import { generateTruthTable, checkEquivalence } from "../../utils/logicEvaluator";

const burst = () => confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 }, colors: ["#7C3AED", "#A66CFF", "#F4B942", "#4ADE80"] });

const PRESETS = [
  { label: "Def. of Implication", expr1: "p → q", expr2: "¬p ∨ q" },
  { label: "De Morgan's Law (AND)", expr1: "¬(p ∧ q)", expr2: "¬p ∨ ¬q" },
  { label: "De Morgan's Law (OR)", expr1: "¬(p ∨ q)", expr2: "¬p ∧ ¬q" },
  { label: "Contrapositive", expr1: "p → q", expr2: "¬q → ¬p" },
  { label: "Converse (Non-equivalent)", expr1: "p → q", expr2: "q → p" },
  { label: "Distributive Law", expr1: "p ∨ (q ∧ r)", expr2: "(p ∨ q) ∧ (p ∨ r)" },
  { label: "Absorption Law", expr1: "p ∨ (p ∧ q)", expr2: "p" },
  { label: "Tautology (p ∨ ¬p)", expr1: "p ∨ ¬p", expr2: "T" },
  { label: "Contradiction (p ∧ ¬p)", expr1: "p ∧ ¬p", expr2: "F" },
];

const SYMBOL_KEYS = [
  { label: "¬", desc: "NOT" }, { label: "∧", desc: "AND" }, { label: "∨", desc: "OR" },
  { label: "⊕", desc: "XOR" }, { label: "→", desc: "IMPLIES" }, { label: "↔", desc: "IFF" },
  { label: "(", desc: "Open" }, { label: ")", desc: "Close" },
  { label: "p", desc: "Var" }, { label: "q", desc: "Var" }, { label: "r", desc: "Var" },
  { label: "T", desc: "True" }, { label: "F", desc: "False" },
];

function ModeButton({ active, onClick, icon: Icon, children, activeClass = "bg-[#7C3AED] text-white" }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? activeClass : "text-[#9C93B3] hover:text-white"}`}>
      <Icon className="w-3.5 h-3.5" /> {children}
    </button>
  );
}

export default function TruthTableVisualizer() {
  const [expression, setExpression] = useState("p → q");
  const [mode, setMode] = useState("single"); // single | compare | quiz
  const [compareExpr, setCompareExpr] = useState("¬p ∨ q");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const tableData = useMemo(() => generateTruthTable(expression), [expression]);
  const compareResult = useMemo(() => (mode === "compare" ? checkEquivalence(expression, compareExpr) : null), [expression, compareExpr, mode]);

  function resetQuiz() { setQuizAnswers({}); setQuizSubmitted(false); }
  function switchMode(next) { setMode(next); resetQuiz(); }
  function insertSymbol(symbol) { setExpression((current) => current + symbol); resetQuiz(); }
  function selectPreset(preset) { setExpression(preset.expr1); setCompareExpr(preset.expr2); resetQuiz(); }
  function toggleQuizCell(rowIndex) {
    if (quizSubmitted) return;
    setQuizAnswers((current) => {
      const value = current[rowIndex];
      if (value === undefined) return { ...current, [rowIndex]: true };
      if (value === true) return { ...current, [rowIndex]: false };
      const next = { ...current };
      delete next[rowIndex];
      return next;
    });
  }
  function submitQuiz() {
    if (!tableData) return;
    const correct = tableData.rows.filter((row, index) => quizAnswers[index] === row.result).length;
    setQuizSubmitted(true);
    if (correct === tableData.rows.length) burst();
  }
  const quizScore = quizSubmitted && tableData ? tableData.rows.filter((row, index) => quizAnswers[index] === row.result).length : null;

  return (
    <section className="rounded-2xl bg-[#130E20] border border-[#2A2140] p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">INTERACTIVE TOOL</p>
          <h3 className="text-white font-heading text-lg font-semibold">Truth table visualizer &amp; equivalence prover</h3>
          <p className="mt-1 text-sm text-[#9C93B3] max-w-2xl">Type any propositional expression to build its truth table row-by-row, compare two statements to test equivalence, or quiz yourself by filling in the result column.</p>
        </div>
        <div className="flex items-center gap-1 bg-[#0F0A1A] p-1 rounded-xl border border-[#211934] self-start md:self-auto">
          <ModeButton active={mode === "single"} onClick={() => switchMode("single")} icon={Layers}>Single</ModeButton>
          <ModeButton active={mode === "compare"} onClick={() => switchMode("compare")} icon={Columns3}>Compare</ModeButton>
          <ModeButton active={mode === "quiz"} onClick={() => switchMode("quiz")} icon={Sparkles} activeClass="bg-[#F4B942] text-[#130E20]">Self-test</ModeButton>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#9C93B3] mb-2">Course presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button key={preset.label} onClick={() => selectPreset(preset)} className="text-xs px-2.5 py-1 rounded-md bg-[#0F0A1A] hover:bg-[#1D1530] text-[#9C93B3] hover:text-white border border-[#211934] transition-colors">
              <span className="font-semibold text-[#B48CFF]">{preset.label}:</span>{" "}
              <span className="font-mono text-[#E4D9FF]">{preset.expr1}</span>
              {mode === "compare" && <span className="font-mono text-[#4ADE80]"> ≡ {preset.expr2}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9C93B3] mb-2">{mode === "compare" ? "Expression 1 (LHS)" : "Logical expression"}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={expression}
                onChange={(event) => { setExpression(event.target.value); resetQuiz(); }}
                placeholder="e.g. (p ∧ q) → r"
                className="flex-1 px-3 py-2.5 bg-[#130E20] border border-[#2A2140] rounded-lg font-mono text-sm text-white focus:outline-none focus:border-[#7C3AED] placeholder:text-[#5B5470]"
              />
              <button onClick={() => { setExpression(""); resetQuiz(); }} className="px-3 py-2.5 rounded-lg bg-[#1D1530] hover:bg-[#2A2140] text-[#9C93B3] text-xs font-medium border border-[#2A2140] transition-colors">Clear</button>
            </div>

            {mode === "compare" && (
              <div className="mt-4 pt-4 border-t border-[#2A2140]">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4ADE80] mb-2">Expression 2 (RHS to compare)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={compareExpr}
                    onChange={(event) => setCompareExpr(event.target.value)}
                    placeholder="e.g. ¬p ∨ q"
                    className="flex-1 px-3 py-2.5 bg-[#130E20] border border-[#255239] rounded-lg font-mono text-sm text-white focus:outline-none focus:border-[#4ADE80] placeholder:text-[#5B5470]"
                  />
                  <button onClick={() => setCompareExpr("")} className="px-3 py-2.5 rounded-lg bg-[#1D1530] hover:bg-[#2A2140] text-[#9C93B3] text-xs font-medium border border-[#2A2140] transition-colors">Clear</button>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[#2A2140]">
              <div className="text-[11px] font-semibold text-[#9C93B3] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Logic keypad</span><span className="font-normal">Click to insert into Expression 1</span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-13 gap-1.5">
                {SYMBOL_KEYS.map((key) => (
                  <button key={key.label} onClick={() => insertSymbol(key.label)} title={key.desc} className="p-2 rounded-lg bg-[#1D1530] hover:bg-[#7C3AED] active:scale-95 text-[#E4D9FF] hover:text-white font-mono text-sm font-semibold border border-[#2A2140] transition-all flex flex-col items-center justify-center">
                    <span>{key.label}</span>
                    <span className="text-[9px] text-[#9C93B3] leading-none">{key.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {mode === "compare" && compareResult && (
            <div className={`p-4 rounded-xl border ${compareResult.isEquivalent ? "bg-[#173626]/40 border-[#255239] text-[#E4D9FF]" : "bg-[#3A1C22]/40 border-[#5C2F37] text-[#E4D9FF]"}`}>
              <div className="flex items-start gap-3">
                {compareResult.isEquivalent ? <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-[#F87171] shrink-0 mt-0.5" />}
                <div>
                  <h4 className="text-sm font-bold flex flex-wrap items-center gap-2">
                    <span>{compareResult.isEquivalent ? "Logically equivalent!" : "Not equivalent"}</span>
                    <span className={`font-mono px-2 py-0.5 rounded text-xs ${compareResult.isEquivalent ? "bg-[#173626] text-[#4ADE80]" : "bg-[#3A1C22] text-[#F87171]"}`}>{expression} {compareResult.isEquivalent ? "≡" : "≢"} {compareExpr}</span>
                  </h4>
                  <p className="text-xs sm:text-sm mt-1.5 text-[#9C93B3]">
                    {compareResult.isEquivalent
                      ? "The truth values match on every single row of the truth table, so the two statements can be safely swapped in any proof."
                      : "The statements differ in truth value under at least one row. See the counterexample below."}
                  </p>
                  {!compareResult.isEquivalent && compareResult.counterExample && (
                    <div className="mt-3 p-2.5 rounded-lg bg-[#0F0A1A] border border-[#5C2F37] font-mono text-xs text-[#F87171]">
                      <strong>Counterexample:</strong> {Object.entries(compareResult.counterExample).map(([key, value]) => `${key} = ${value ? "T" : "F"}`).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {mode === "quiz" && tableData && (
            <div className="bg-[#2A2410]/50 border border-[#4A3F1A] rounded-xl p-4 text-[#F4E0A1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold flex items-center gap-2 text-[#F4B942]"><Sparkles className="w-4 h-4" /> Self-test: fill in the result column!</h4>
                <p className="text-xs text-[#9C93B3] mt-0.5">Click the empty cells in the final column to toggle between <span className="text-[#4ADE80] font-bold">T</span>, <span className="text-[#F87171] font-bold">F</span>, or unselected.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={submitQuiz} disabled={quizSubmitted} className="px-4 py-2 rounded-lg bg-[#F4B942] hover:bg-[#e0a92f] disabled:opacity-50 text-[#130E20] font-semibold text-xs transition-all">Verify answers</button>
                <button onClick={resetQuiz} className="px-3 py-2 rounded-lg bg-[#1D1530] hover:bg-[#2A2140] text-[#9C93B3] text-xs font-medium border border-[#2A2140] transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}

          {tableData ? (
            <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] overflow-hidden">
              <div className="p-3 border-b border-[#211934] flex flex-wrap items-center justify-between gap-2 bg-[#130E20]">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#E4D9FF]">Truth table ({tableData.rows.length} rows)</span>
                  <span className="text-[#9C93B3]">Formula: <span className="font-mono text-[#B48CFF]">{tableData.expression}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  {tableData.isTautology && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#173626] text-[#4ADE80] border border-[#255239]">Tautology (always true)</span>}
                  {tableData.isContradiction && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#3A1C22] text-[#F87171] border border-[#5C2F37]">Contradiction (always false)</span>}
                  {tableData.isContingency && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#1A2A3A] text-[#7DD3FC] border border-[#2C5270]">Contingency (mixed)</span>}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse font-mono text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#130E20] border-b border-[#211934] text-[#9C93B3]">
                      <th className="py-2.5 px-3 w-10 text-[#5B5470] font-normal">#</th>
                      {tableData.variables.map((name) => <th key={name} className="py-2.5 px-4 font-bold text-[#E4D9FF] border-r border-[#211934]">{name}</th>)}
                      {tableData.subColumns.map((sub) => <th key={sub.label} className="py-2.5 px-4 text-[#B48CFF] border-r border-[#211934] font-semibold">{sub.label}</th>)}
                      <th className="py-2.5 px-5 text-[#4ADE80] font-bold bg-[#1D1530]/60">{mode === "quiz" ? "Your answer" : tableData.expression}</th>
                      {mode === "quiz" && quizSubmitted && <th className="py-2.5 px-4 text-[#E4D9FF]">Actual</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#211934]">
                    {tableData.rows.map((row, index) => {
                      const userAnswer = quizAnswers[index];
                      const isCorrect = userAnswer === row.result;
                      return (
                        <tr key={index} className="hover:bg-[#1D1530]/40 transition-colors">
                          <td className="py-2 px-3 text-[#5B5470]">{index + 1}</td>
                          {tableData.variables.map((name) => <td key={name} className={`py-2 px-4 font-bold border-r border-[#211934] ${row.inputs[name] ? "text-[#4ADE80]" : "text-[#9C93B3]"}`}>{row.inputs[name] ? "T" : "F"}</td>)}
                          {tableData.subColumns.map((sub) => <td key={sub.label} className={`py-2 px-4 border-r border-[#211934] ${row.subValues[sub.label] ? "text-[#B48CFF]" : "text-[#9C93B3]"}`}>{row.subValues[sub.label] ? "T" : "F"}</td>)}
                          {mode === "quiz" ? (
                            <td className="py-2 px-4 bg-[#1D1530]/30">
                              <button onClick={() => toggleQuizCell(index)} className={`w-12 h-8 rounded-md font-bold text-sm transition-all border ${userAnswer === true ? "bg-[#255239] border-[#4ADE80] text-white" : userAnswer === false ? "bg-[#5C2F37] border-[#F87171] text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:border-[#7C3AED]"}`}>
                                {userAnswer === true ? "T" : userAnswer === false ? "F" : "?"}
                              </button>
                            </td>
                          ) : (
                            <td className={`py-2 px-5 font-bold bg-[#1D1530]/30 ${row.result ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{row.result ? "T" : "F"}</td>
                          )}
                          {mode === "quiz" && quizSubmitted && (
                            <td className="py-2 px-4 bg-[#130E20]">
                              <span className="inline-flex items-center gap-1.5">
                                <span className={`font-bold ${row.result ? "text-[#4ADE80]" : "text-[#F87171]"}`}>{row.result ? "T" : "F"}</span>
                                {isCorrect ? <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> : <XCircle className="w-4 h-4 text-[#F87171]" />}
                              </span>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {mode === "quiz" && quizSubmitted && quizScore !== null && (
                <div className="p-3 bg-[#130E20] border-t border-[#211934] flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold text-[#E4D9FF]">Score: </span>
                    <span className={`font-bold ${quizScore === tableData.rows.length ? "text-[#4ADE80]" : "text-[#F4B942]"}`}>{quizScore} / {tableData.rows.length} correct</span>
                    {quizScore === tableData.rows.length ? <span className="ml-2 text-[#4ADE80] text-xs">🎉 Perfect! You mastered this truth table!</span> : <span className="ml-2 text-[#F4B942] text-xs">Review the marked rows and try again.</span>}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-[#0F0A1A] border border-[#211934] rounded-xl text-center text-[#9C93B3]">
              <HelpCircle className="w-8 h-8 text-[#5B5470] mx-auto mb-2" />
              <p className="text-sm">Enter a valid propositional logic expression above (e.g. <span className="font-mono text-[#B48CFF]">p → (q ∨ r)</span>) to generate its truth table. Up to 6 variables are supported.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3"><Info className="w-4 h-4 text-[#B48CFF]" /> Classification rules</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#130E20] border border-[#211934]">
                <div className="font-bold text-[#4ADE80] mb-0.5">Tautology</div>
                <div className="text-[#9C93B3]">A compound proposition that is <strong className="text-white">always true</strong>, no matter the inputs.</div>
                <div className="mt-1 font-mono text-[11px] text-[#5B5470]">Example: p ∨ ¬p ≡ T</div>
              </div>
              <div className="p-3 rounded-lg bg-[#130E20] border border-[#211934]">
                <div className="font-bold text-[#F87171] mb-0.5">Contradiction</div>
                <div className="text-[#9C93B3]">A compound proposition that is <strong className="text-white">always false</strong>, no matter the inputs.</div>
                <div className="mt-1 font-mono text-[11px] text-[#5B5470]">Example: p ∧ ¬p ≡ F</div>
              </div>
              <div className="p-3 rounded-lg bg-[#130E20] border border-[#211934]">
                <div className="font-bold text-[#7DD3FC] mb-0.5">Contingency</div>
                <div className="text-[#9C93B3]">Neither always true nor always false. Its truth value <strong className="text-white">depends</strong> on the variables.</div>
                <div className="mt-1 font-mono text-[11px] text-[#5B5470]">Example: p → q</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-[#F4B942]" /> How to use this tool</h4>
            <ul className="text-xs text-[#9C93B3] space-y-1.5 list-disc list-inside">
              <li>Type directly, or click the keypad buttons.</li>
              <li>Use <strong className="text-[#E4D9FF]">Compare</strong> mode to test whether two statements are logically equivalent, with a counterexample if they aren't.</li>
              <li>Use <strong className="text-[#E4D9FF]">Self-test</strong> mode to hide the answer column and quiz yourself row by row.</li>
              <li>ASCII shortcuts also work: <span className="font-mono">! ~ &amp; | ^ -&gt; &lt;-&gt;</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
