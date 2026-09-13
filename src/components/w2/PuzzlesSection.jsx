import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import confetti from "canvas-confetti";

const burst = () => confetti({ particleCount: 65, spread: 60, origin: { y: 0.7 }, colors: ["#7C3AED", "#A66CFF", "#F4B942", "#4ADE80"] });
const TABS = [
  ["knights", "Knights & Knaves"], ["trunks", "Three Trunks"], ["muddy", "Muddy Foreheads"],
  ["fork", "Fork in the Road"], ["murder", "Murder Mystery"], ["zebra", "Zebra Puzzle"],
];

function Shell({ title, children }) {
  return <div className="rounded-2xl bg-[#130E20] border border-[#2A2140] p-6"><p className="text-white font-heading font-semibold">{title}</p>{children}</div>;
}

function IntroTable({ rows, caption }) {
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
                return <td key={cellIndex} className={`p-2 ${highlight ? "text-[#4ADE80] font-semibold" : ""}`}>{text}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <p className="px-3 py-2 text-xs text-[#9C93B3] bg-[#0F0A1A] border-t border-[#211934]">{caption}</p>}
    </div>
  );
}

function ChoiceGame({ question, choices, answer, explanation, table, tableCaption }) {
  const [choice, setChoice] = useState(null);
  const correct = choice === answer;
  function pick(index) {
    if (choice !== null) return;
    setChoice(index);
    if (index === answer) burst();
  }
  return (
    <>
      <p className="mt-2 text-sm text-[#9C93B3]">{question}</p>
      <div className="mt-4 grid gap-2">
        {choices.map((item, index) => (
          <button key={item} onClick={() => pick(index)} className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
            choice === null ? "bg-[#0F0A1A] border-[#211934] hover:border-[#7C3AED]" :
            index === answer ? "bg-[#173626]/50 border-[#255239] text-[#4ADE80]" :
            index === choice ? "bg-[#3A1C22]/50 border-[#5C2F37] text-[#F87171]" : "bg-[#0F0A1A] border-[#211934] text-[#5B5470]"
          }`}>
            {choice !== null && index === answer ? <Check className="inline w-4 h-4 mr-2" /> : choice === index ? <X className="inline w-4 h-4 mr-2" /> : <span className="mr-2">○</span>}{item}
          </button>
        ))}
      </div>
      {choice !== null && <div className={`mt-4 rounded-lg p-3 text-sm ${correct ? "bg-[#173626]/40 text-[#E4D9FF]" : "bg-[#3A1C22]/40 text-[#E4D9FF]"}`}>{explanation}</div>}
      {choice !== null && table && (
        <div className="mt-4">
          <p className="text-xs tracking-wide text-[#F4B942] font-mono mb-1">TRUTH TABLE — WHY THIS WORKS</p>
          <IntroTable rows={table} caption={tableCaption} />
        </div>
      )}
    </>
  );
}

function Knights() {
  return <Shell title="Puzzle 1: Knights & Knaves">
    <p className="mt-2 text-sm text-[#9C93B3]">On this island, a <strong className="text-[#E4D9FF]">Knight</strong> always tells the truth, and a <strong className="text-[#E4D9FF]">Knave</strong> always lies. A says "B is a knight." B says "We are opposite types." We test every combination and keep only the one where nobody breaks their own rule.</p>
    <IntroTable
      caption="'!' marks the value that stays consistent with each speaker's rule. Only the A = Knave, B = Knave row survives without contradiction."
      rows={[
        ["World", "A's statement (\"B is a knight\")", "Is A consistent?", "B's statement (\"We are opposite\")", "Is B consistent?"],
        ["A Knight, B Knight", "True", "Knight told truth ✓", "False (same type)", "!Knight told a lie ✗"],
        ["A Knight, B Knave", "False", "!Knight told a lie ✗", "True (opposite types)", "Knave told truth ✗"],
        ["A Knave, B Knave", "False", "Knave lied ✓", "False (same type)", "Knave lied ✓"],
        ["A Knave, B Knight", "True", "!Knave told truth ✗", "True (opposite types)", "Knight told truth, but A's claim was true so A (a knave) can't say it ✗"],
      ]}
    />
    <p className="mt-3 text-sm text-[#E4D9FF]">Reasoning: try each of the 4 worlds and check if every knight told the truth and every knave lied. Only <strong>A = Knave, B = Knave</strong> passes both checks.</p>
    <ChoiceGame
      question={'So which world can exist if knights always tell the truth and knaves always lie?'}
      choices={["A Knight, B Knight", "A Knight, B Knave", "A Knave, B Knave", "A Knave, B Knight"]}
      answer={2}
      explanation={'Both are knaves. A lies that B is a knight; B lies that they are opposite. Every other world makes a knight lie or a knave tell the truth.'}
    />
  </Shell>;
}

function Trunks() {
  return <Shell title="Puzzle 2: The Three Trunks">
    <p className="mt-2 text-sm text-[#9C93B3]">Exactly one inscription is true. Trunk 1 says "This trunk is empty." Trunk 2 says "This trunk is empty." Trunk 3 says "The treasure is in Trunk 2." Test each possible hiding place and count how many inscriptions come out true.</p>
    <IntroTable
      caption="Only placing the treasure in Trunk 1 produces exactly one true statement (marked with ✓)."
      rows={[
        ["Treasure in", "Trunk 1 says \"I'm empty\"", "Trunk 2 says \"I'm empty\"", "Trunk 3 says \"Treasure in 2\"", "# True"],
        ["Trunk 1", "False", "True", "False", "!1 ✓"],
        ["Trunk 2", "True", "False", "True", "2 ✗"],
        ["Trunk 3", "True", "True", "False", "2 ✗"],
      ]}
    />
    <ChoiceGame
      question={'Given the table above, where is the treasure?'}
      choices={["Trunk 1", "Trunk 2", "Trunk 3"]}
      answer={0}
      explanation="If treasure is in Trunk 1, inscriptions read F, T, F: exactly one true. The other two hypotheses each create two true inscriptions."
    />
  </Shell>;
}

function Muddy() {
  const [round, setRound] = useState(0);
  return <Shell title="Puzzle 3: Muddy Foreheads">
    <p className="mt-2 text-sm text-[#9C93B3]">Both children are muddy, but neither can see their own forehead. Father publicly says: "At least one of you is muddy." Watch how the same public statement produces different answers each time it is repeated.</p>
    <IntroTable
      caption="Child 1 and Child 2 both reason about what the other person can see, and about what the other person's silence reveals."
      rows={[
        ["Round", "What each child sees", "What each child knows so far", "Answer"],
        ["Round 1", "Sees mud only on the other child", "Cannot rule out being clean themselves yet", "!\"No\" (both)"],
        ["Round 2", "Hears both said \"No\" in round 1", "If I were clean, the other child would have seen only a clean forehead and answered \"Yes\" in round 1 — but they didn't", "!\"Yes\" (both)"],
      ]}
    />
    <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
      {round === 0 && <><p className="text-[#E4D9FF]">Round 1: each sees mud on the other person, so both answer <strong>"No."</strong></p><button onClick={() => setRound(1)} className="mt-3 rounded-lg bg-[#7C3AED] px-3 py-2 text-sm text-white">Ask again</button></>}
      {round === 1 && <><p className="text-[#E4D9FF]">Round 2: each hears the other said "No." If I were clean, the other child would have known immediately in round 1.</p><button onClick={() => { setRound(2); burst(); }} className="mt-3 rounded-lg bg-[#7C3AED] px-3 py-2 text-sm text-white">Reveal the aha moment</button></>}
      {round === 2 && <p className="text-[#4ADE80] font-medium">🎉 Both answer "Yes!" Their shared ignorance in round 1 proves both foreheads are muddy.</p>}
    </div>
  </Shell>;
}

function ForkRoad() {
  return <Shell title="New puzzle: The fork in the road">
    <p className="mt-2 text-sm text-[#9C93B3]">A villager always tells the truth or always lies. One road leads to ruins; the other goes into the jungle. You get one Yes/No question.</p>
    <ChoiceGame
      question="What should you ask?"
      choices={[
        '"Does this road lead to the ruins?"',
        '"If I asked you whether the left road leads to the ruins, would you say Yes?"',
        '"Are you a truth-teller?"',
      ]}
      answer={1}
      explanation="Ask the villager what they would say. A truth-teller truthfully reports their Yes/No answer; a liar lies about their false answer. Both lead you to the same reliable response: take the left road exactly when the answer is Yes."
      tableCaption="'Left → ruins?' is the hidden fact. 'Would say' is what the villager actually answers to the nested question. Notice the answer is 'Yes' in both worlds exactly when the left road really leads to the ruins — so the question is safe regardless of who you ask."
      table={[
        ["Villager type", "Left road → ruins?", "Direct answer they'd give to \"does left lead to ruins?\"", "What they say when asked \"would you say Yes?\"", "Your conclusion"],
        ["Truth-teller", "True", "Yes (tells truth)", "!Yes (truthfully reports own Yes)", "Take left ✓"],
        ["Truth-teller", "False", "No (tells truth)", "!No (truthfully reports own No)", "Take right ✓"],
        ["Liar", "True", "No (would lie)", "!Yes (lies about their own \"No\")", "Take left ✓"],
        ["Liar", "False", "Yes (would lie)", "!No (lies about their own \"Yes\")", "Take right ✓"],
      ]}
    />
  </Shell>;
}

function Murder() {
  const [showClues, setShowClues] = useState(false);
  return <Shell title="New puzzle: Who killed Mr. Cooper?">
    <p className="mt-2 text-sm text-[#9C93B3]">One suspect is guilty. The two innocent men tell the truth; the guilty man's statements may or may not be true.</p>
    <button onClick={() => setShowClues((value) => !value)} className="mt-4 inline-flex items-center gap-1 text-sm text-[#B48CFF] hover:text-white"><ChevronDown className={`w-4 h-4 ${showClues ? "rotate-180" : ""}`} /> {showClues ? "Hide" : "Show"} statements</button>
    {showClues && <ul className="mt-3 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4 space-y-2 text-sm text-[#E4D9FF]">
      <li><strong>Smith:</strong> "I did not kill Cooper. Cooper was Jones's friend. Williams disliked him."</li>
      <li><strong>Jones:</strong> "I did not know Cooper. I was out of town on the day of the killing."</li>
      <li><strong>Williams:</strong> "I did not kill Cooper. I saw Smith and Jones with Cooper that day. Either Smith or Jones killed him."</li>
    </ul>}
    <ChoiceGame
      question="Who is the murderer?"
      choices={["Mr. Smith", "Mr. Jones", "Mr. Williams"]}
      answer={1}
      explanation="Jones is guilty. If Smith were guilty, truthful Williams says Jones was with Cooper, contradicting truthful Jones's claim he was out of town. If Williams were guilty, truthful Smith says Jones knew Cooper, contradicting truthful Jones. Only Jones can be guilty while Smith and Williams remain truthful."
      tableCaption="Only the 'Jones is guilty' hypothesis avoids forcing a truthful, innocent man into a contradiction (marked with ✓)."
      table={[
        ["Guilty suspect", "Smith's statements", "Jones's statements", "Williams's statements", "Contradiction?"],
        ["Smith", "May lie (guilty)", "Truthful: was out of town", "Truthful: saw Smith & Jones with Cooper", "Williams places Jones with Cooper, but Jones (truthful) says he was out of town ✗"],
        ["Jones", "Truthful: didn't kill Cooper, Williams disliked him", "May lie (guilty)", "Truthful: Smith or Jones killed him", "!No contradiction: everyone truthful stays consistent ✓"],
        ["Williams", "Truthful: Cooper was Jones's friend", "Truthful: didn't know Cooper", "May lie (guilty)", "Smith (truthful) says Cooper was Jones's friend, but Jones (truthful) says he didn't know Cooper ✗"],
      ]}
    />
  </Shell>;
}

const zebraClues = [
  "The Englishman lives in the red house. The Spaniard owns the dog. The Japanese man is a painter. The Italian drinks tea.",
  "The Norwegian lives in the first house. The green house is immediately to the right of the white house. Milk is drunk in the middle house.",
  "The photographer breeds snails. The diplomat lives in the yellow house. The green-house owner drinks coffee.",
  "The Norwegian lives next to the blue house. The violinist drinks orange juice. The fox is next to the physician; the horse is next to the diplomat.",
];

function Zebra() {
  const [clue, setClue] = useState(0);
  const [answered, setAnswered] = useState(false);
  return <Shell title="New puzzle: The Zebra Puzzle">
    <p className="mt-2 text-sm text-[#9C93B3]">Five men live in consecutive houses. Match each nationality, job, house color, pet, and drink. Reveal clues as if you are filling the logic grid yourself.</p>
    <div className="mt-4 rounded-xl bg-[#0F0A1A] border border-[#211934] p-4">
      <p className="font-mono text-xs text-[#B48CFF]">CLUE {clue + 1} OF {zebraClues.length}</p>
      <p className="text-sm text-[#E4D9FF] mt-2 leading-relaxed">{zebraClues[clue]}</p>
      {clue < zebraClues.length - 1 && <button onClick={() => setClue((current) => current + 1)} className="mt-3 text-sm text-[#B48CFF] hover:text-white">Reveal next clue →</button>}
    </div>
    {clue === zebraClues.length - 1 && !answered && <ChoiceGame question="Final challenge: who owns the zebra, and who drinks mineral water?" choices={["Japanese owns the zebra; Norwegian drinks mineral water", "Englishman owns the zebra; Italian drinks mineral water", "Spaniard owns the zebra; Japanese drinks mineral water"]} answer={0} explanation="By systematically marking each clue in a five-house grid, the only consistent solution places the zebra with the Japanese man and mineral water with the Norwegian." />}
    {clue === zebraClues.length - 1 && <button onClick={() => setAnswered(true)} className="mt-4 text-xs text-[#9C93B3] hover:text-white">Mark puzzle as reviewed</button>}
  </Shell>;
}

export default function PuzzlesSection() {
  const [tab, setTab] = useState("knights");
  const content = { knights: <Knights />, trunks: <Trunks />, muddy: <Muddy />, fork: <ForkRoad />, murder: <Murder />, zebra: <Zebra /> };
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wide text-[#B48CFF] font-mono mb-2">LOGIC PUZZLES</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white">More puzzles to unlock</h2>
        <p className="mt-2 text-[#9C93B3] max-w-2xl">Test a world, find the contradiction, and eliminate it. Every puzzle has instant feedback so the reasoning is visible, not just the answer.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TABS.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`rounded-full border px-3 py-1.5 text-sm transition ${tab === id ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "bg-[#130E20] border-[#2A2140] text-[#9C93B3] hover:border-[#7C3AED]"}`}>{label}</button>)}
      </div>
      {content[tab]}
    </div>
  );
}
