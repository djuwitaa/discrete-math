import { tf } from "./rules";

export function TruthToggle({ name, value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`font-mono px-4 py-2 rounded-lg border text-sm transition ${
        value ? "bg-[#173626]/50 border-[#4ADE80]/60 text-[#4ADE80]" : "bg-[#3A1C22]/50 border-[#F87171]/60 text-[#F87171]"
      }`}
    >
      {name} = {tf(value)}
    </button>
  );
}

export function Badge({ ok, children }) {
  return (
    <span className={`font-mono text-xs px-2 py-0.5 rounded ${ok ? "bg-[#173626]/60 text-[#4ADE80]" : "bg-[#3A1C22]/60 text-[#F87171]"}`}>{children}</span>
  );
}

// Premises stacked above a bar, conclusion below: the standard argument layout.
export function ArgumentForm({ premises, conclusion, values }) {
  return (
    <div className="w-full rounded-lg bg-[#130E20] border border-[#2A2140] overflow-hidden" style={{ fontFamily: "Consolas, monospace" }}>
      <div className="px-4 py-2.5 space-y-1.5">
        {premises.map(([label, fn]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-sm text-[#E4D9FF]">
            <span className="pl-5">{label}</span>
            {values && <Badge ok={fn(values)}>{tf(fn(values))}</Badge>}
          </div>
        ))}
      </div>
      <div className="h-0.5 bg-[#B48CFF]/70" />
      <div className="px-4 py-2.5 flex items-center justify-between gap-4 text-sm text-[#F4B942] bg-[#1A1330]">
        <span><span className="inline-block w-5 text-[#B48CFF]">∴</span>{conclusion[0]}</span>
        {values && <Badge ok={conclusion[1](values)}>{tf(conclusion[1](values))}</Badge>}
      </div>
    </div>
  );
}
