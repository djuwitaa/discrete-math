// Rules of inference. `premises` and `conclusion` are evaluated over p, q, r
// so the explorer can show, for any truth assignment, whether the rule holds.
export const RULES = [
  {
    id: "mp", name: "Modus Ponens", vars: ["p", "q"],
    premises: [["p", ({ p }) => p], ["p → q", ({ p, q }) => !p || q]],
    conclusion: ["q", ({ q }) => q],
    idea: "If a conditional is true and its hypothesis is true, the conclusion has to be true.",
    example: ["If it rains, the road is wet.", "It rains.", "The road is wet."],
  },
  {
    id: "mt", name: "Modus Tollens", vars: ["p", "q"],
    premises: [["¬q", ({ q }) => !q], ["p → q", ({ p, q }) => !p || q]],
    conclusion: ["¬p", ({ p }) => !p],
    idea: "If the conclusion of a true conditional is false, the hypothesis must have been false too.",
    example: ["If I studied, I passed.", "I did not pass.", "I did not study."],
  },
  {
    id: "hs", name: "Hypothetical Syllogism", vars: ["p", "q", "r"],
    premises: [["p → q", ({ p, q }) => !p || q], ["q → r", ({ q, r }) => !q || r]],
    conclusion: ["p → r", ({ p, r }) => !p || r],
    idea: "Conditionals chain together: the end of the first link feeds the start of the second.",
    example: ["If I oversleep, I miss the bus.", "If I miss the bus, I am late.", "If I oversleep, I am late."],
  },
  {
    id: "ds", name: "Disjunctive Syllogism", vars: ["p", "q"],
    premises: [["p ∨ q", ({ p, q }) => p || q], ["¬p", ({ p }) => !p]],
    conclusion: ["q", ({ q }) => q],
    idea: "If at least one of two options is true and one of them is ruled out, the other one is true.",
    example: ["The bug is in the client or in the server.", "The bug is not in the client.", "The bug is in the server."],
  },
  {
    id: "add", name: "Addition", vars: ["p", "q"],
    premises: [["p", ({ p }) => p]],
    conclusion: ["p ∨ q", ({ p, q }) => p || q],
    idea: "If p is true, then p OR anything is true, because an OR only needs one true side.",
    example: ["It is sunny.", "It is sunny or it is Monday."],
  },
  {
    id: "simp", name: "Simplification", vars: ["p", "q"],
    premises: [["p ∧ q", ({ p, q }) => p && q]],
    conclusion: ["p", ({ p }) => p],
    idea: "If both parts of an AND are true, each part is true on its own.",
    example: ["I have a laptop and a charger.", "I have a laptop."],
  },
  {
    id: "conj", name: "Conjunction", vars: ["p", "q"],
    premises: [["p", ({ p }) => p], ["q", ({ q }) => q]],
    conclusion: ["p ∧ q", ({ p, q }) => p && q],
    idea: "If two statements are each true, then they are true together.",
    example: ["The server is up.", "The database is up.", "The server is up and the database is up."],
  },
  {
    id: "res", name: "Resolution", vars: ["p", "q", "r"],
    premises: [["p ∨ q", ({ p, q }) => p || q], ["¬p ∨ r", ({ p, r }) => !p || r]],
    conclusion: ["q ∨ r", ({ q, r }) => q || r],
    idea: "p is either true or false. Whichever it is, one of the premises forces q or r to be true.",
    example: ["I take the bus or I walk.", "I do not take the bus or I am late.", "I walk or I am late."],
  },
];

// Fallacies: invalid forms that look like valid ones.
export const FALLACIES = [
  {
    id: "ac", name: "Affirming the Conclusion", vars: ["p", "q"],
    premises: [["q", ({ q }) => q], ["p → q", ({ p, q }) => !p || q]],
    conclusion: ["p", ({ p }) => p],
    example: ["If it rains, the road is wet.", "The road is wet.", "Therefore it rained. (A street cleaner could have caused it.)"],
  },
  {
    id: "dh", name: "Denying the Hypothesis", vars: ["p", "q"],
    premises: [["¬p", ({ p }) => !p], ["p → q", ({ p, q }) => !p || q]],
    conclusion: ["¬q", ({ q }) => !q],
    example: ["If I study, I pass.", "I did not study.", "Therefore I did not pass. (Maybe I already knew the material.)"],
  },
];

export const tf = (v) => (v ? "T" : "F");
