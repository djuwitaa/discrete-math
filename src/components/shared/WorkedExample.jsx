import { useState } from "react";
import { Panel } from "./ui";

// The answer format taught in class: Given, Asked, Solution.
// `given` and `asked` are shown immediately. `steps` are revealed one by one,
// each step is { title, text, formula }. `answer` is shown after the last step.
export function WorkedExample({ tag, title, given, asked, steps, answer }) {
  const [shown, setShown] = useState(0);
  const finished = shown >= steps.length;

  return (
    <Panel>
      {tag && <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-1">{tag}</p>}
      <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>

      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#7C3AED]/40 p-4">
          <p className="text-xs font-semibold text-[#B48CFF] tracking-wide">1. GIVEN</p>
          <div className="mt-2 text-sm text-[#E4D9FF] space-y-1">{given}</div>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#F4B942]/40 p-4">
          <p className="text-xs font-semibold text-[#F4B942] tracking-wide">2. ASKED</p>
          <div className="mt-2 text-sm text-[#E4D9FF] space-y-1">{asked}</div>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#4ADE80]/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-[#4ADE80] tracking-wide">3. SOLUTION</p>
          <p className="text-xs text-[#5B5470]">Step {Math.min(shown, steps.length)} of {steps.length}</p>
        </div>

        {shown === 0 && <p className="mt-2 text-sm text-[#9C93B3]">Try to solve it yourself first, then reveal the steps one at a time.</p>}

        <ol className="mt-2 space-y-3">
          {steps.slice(0, shown).map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-xs text-[#B48CFF] pt-0.5 w-5 shrink-0">{i + 1}.</span>
              <div className="min-w-0">
                {step.title && <p className="text-sm font-semibold text-[#E4D9FF]">{step.title}</p>}
                {step.text && <p className="text-sm text-[#C9BFE3]">{step.text}</p>}
                {step.formula && <p className="mt-1 font-mono text-sm text-[#F4B942] break-words">{step.formula}</p>}
              </div>
            </li>
          ))}
        </ol>

        {finished && answer && (
          <div className="mt-4 rounded-lg bg-[#173626]/40 border border-[#255239] p-3 text-sm text-[#4ADE80]">
            <span className="font-semibold">Answer: </span>{answer}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {!finished && (
            <>
              <button onClick={() => setShown(shown + 1)} className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm">{shown === 0 ? "Show first step" : "Next step"}</button>
              <button onClick={() => setShown(steps.length)} className="px-4 py-2 rounded-lg border border-[#2A2140] text-[#9C93B3] text-sm hover:text-white">Show all</button>
            </>
          )}
          {shown > 0 && <button onClick={() => setShown(0)} className="px-4 py-2 rounded-lg border border-[#2A2140] text-[#9C93B3] text-sm hover:text-white">Reset</button>}
        </div>
      </div>
    </Panel>
  );
}
