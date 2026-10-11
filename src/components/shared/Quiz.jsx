import { useState } from "react";
import { Panel } from "./ui";

// Multiple choice quiz with instant feedback.
// questions: [{ q, options: [string], answer: index, why }]
export function Quiz({ title = "Quick check", questions }) {
  const [picked, setPicked] = useState({});
  const score = questions.filter((item, i) => picked[i] === item.answer).length;
  const answered = Object.keys(picked).length;

  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono">{title.toUpperCase()}</p>
        <p className="text-xs text-[#9C93B3]">Score {score} / {questions.length}</p>
      </div>
      <div className="mt-3 space-y-5">
        {questions.map((item, i) => {
          const choice = picked[i];
          return (
            <div key={i}>
              <p className="text-sm text-white">{i + 1}. {item.q}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.options.map((option, j) => {
                  let state = "border-[#2A2140] text-[#C9BFE3] hover:border-[#7C3AED]/60";
                  if (choice !== undefined) {
                    if (j === item.answer) state = "border-[#4ADE80] text-[#4ADE80]";
                    else if (j === choice) state = "border-[#F87171] text-[#F87171]";
                    else state = "border-[#2A2140] text-[#5B5470]";
                  }
                  return (
                    <button
                      key={j}
                      disabled={choice !== undefined}
                      onClick={() => setPicked({ ...picked, [i]: j })}
                      className={`px-3 py-2 rounded-lg border text-sm text-left touch-manipulation ${state}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {choice !== undefined && (
                <p className="mt-2 text-sm text-[#9C93B3]">{choice === item.answer ? "Correct. " : "Not quite. "}{item.why}</p>
              )}
            </div>
          );
        })}
      </div>
      {answered > 0 && (
        <button onClick={() => setPicked({})} className="mt-4 px-4 py-2 rounded-lg border border-[#2A2140] text-[#9C93B3] text-sm hover:text-white">Reset quiz</button>
      )}
    </Panel>
  );
}
