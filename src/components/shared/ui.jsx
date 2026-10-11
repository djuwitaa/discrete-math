// Shared presentational building blocks reused across week sections so every
// week feels consistent (dark panels, headings, and data tables).

export function Panel({ children, className = "" }) {
  return <section className={`rounded-2xl bg-[#130E20] border border-[#2A2140] p-3 sm:p-5 ${className}`}>{children}</section>;
}

export function SectionTitle({ title, children }) {
  return (
    <div>
      <h3 className="text-white font-heading text-lg font-semibold">{title}</h3>
      {children && <p className="mt-1 text-sm text-[#9C93B3]">{children}</p>}
    </div>
  );
}

/**
 * Simple data table. `rows[0]` is the header row. Prefix a cell string with
 * "!" to highlight it green/bold (used to draw the eye to the answer).
 */
export function DataTable({ rows, caption }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-[#211934]">
      <table className="w-full font-mono text-sm border-collapse">
        <thead className="bg-[#1A1330] text-[#F4B942]">
          <tr>{rows[0].map((header, index) => <th key={index} className="p-2 text-left">{header}</th>)}</tr>
        </thead>
        <tbody className="text-[#E4D9FF]">
          {rows.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-[#2A2140]">
              {row.map((value, cellIndex) => {
                const highlight = typeof value === "string" && value.startsWith("!");
                const text = highlight ? value.slice(1) : value;
                return <td key={cellIndex} className={`p-2 align-top ${highlight ? "text-[#4ADE80] font-semibold" : ""}`}>{text}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <p className="px-3 py-2 text-xs text-[#9C93B3] bg-[#0F0A1A] border-t border-[#211934]">{caption}</p>}
    </div>
  );
}
