export function SectionHeader({ eyebrow, title, children }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">{eyebrow}</p>
      <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-white">{title}</h2>
      {children && <p className="mt-2 text-[#9C93B3]">{children}</p>}
    </div>
  );
}

export function Btn({ children, onClick, active = false, disabled = false, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg text-sm border touch-manipulation disabled:opacity-40 ${active ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "border-[#2A2140] text-[#C9BFE3] hover:border-[#7C3AED]/60"} ${className}`}
    >
      {children}
    </button>
  );
}
