// Read-only code sample. Always Consolas (via the .font-mono class), scrolls sideways on small screens.
export function CodeBlock({ title, code, className = "" }) {
  return (
    <div className={`rounded-xl border border-[#2A2140] bg-[#0A0714] overflow-hidden ${className}`}>
      {title && <div className="px-3 py-1.5 text-[11px] font-mono text-[#B48CFF] border-b border-[#2A2140] bg-[#130E20]">{title}</div>}
      <pre className="font-mono text-xs sm:text-sm text-[#E4D9FF] p-3 overflow-x-auto whitespace-pre leading-relaxed">{code}</pre>
    </div>
  );
}
