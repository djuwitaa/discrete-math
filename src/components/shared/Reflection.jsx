import { Panel } from "./ui";

// "Fun fact and critical question" card used at the end of a topic.
export function Reflection({ fact, question, hint }) {
  return (
    <Panel>
      <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-3">REFLECTION TIME</p>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0F0A1A] border border-[#F4B942]/40 p-4">
          <p className="text-xs font-semibold text-[#F4B942] tracking-wide">FUN FACT</p>
          <div className="mt-2 text-sm text-[#E4D9FF] space-y-2">{fact}</div>
        </div>
        <div className="rounded-xl bg-[#0F0A1A] border border-[#7C3AED]/40 p-4">
          <p className="text-xs font-semibold text-[#B48CFF] tracking-wide">CRITICAL QUESTION</p>
          <div className="mt-2 text-sm text-[#E4D9FF] space-y-2">{question}</div>
          {hint && <p className="mt-2 text-xs text-[#9C93B3]">{hint}</p>}
        </div>
      </div>
    </Panel>
  );
}
