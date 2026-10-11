import { WorkedExample } from "../shared/WorkedExample";

const asNodes = (value) => (Array.isArray(value) ? value : [value]).map((line, i) => <p key={i}>{line}</p>);

// Wrapper around WorkedExample so answer sheets can pass plain strings or arrays of strings.
export function ExerciseItem({ tag, title, given, asked, steps, answer }) {
  return <WorkedExample tag={tag} title={title} given={asNodes(given)} asked={asNodes(asked)} steps={steps} answer={answer} />;
}

// Small truth table. `highlight` is a list of row indexes to mark.
export function MiniTable({ headers, rows, highlight = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="font-mono text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-1.5 text-left text-[#B48CFF] border-b border-[#2A2140] font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className={highlight.includes(r) ? "bg-[#F4B942]/10" : ""}>
              {row.map((cell, c) => (
                <td key={c} className={`px-3 py-1.5 border-b border-[#1D1630] ${cell === "T" ? "text-[#4ADE80]" : cell === "F" ? "text-[#F87171]" : "text-[#E4D9FF]"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SheetHeader({ week, title, intro }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">{`WEEK ${week} · EXERCISES`}</p>
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-[#9C93B3] max-w-3xl">{intro}</p>
    </div>
  );
}

export function GroupTitle({ children }) {
  return <h3 className="font-heading text-xl font-semibold text-[#F4B942] pt-4">{children}</h3>;
}
