import { ExerciseItem, GroupTitle, MiniTable, SheetHeader } from "./ExerciseItem";

export default function Week2Exercises() {
  return (
    <div className="space-y-6">
      <SheetHeader
        week={2}
        title="Assignment 1: Answer Sheet"
        intro="Propositional logic and logical equivalences. Each problem is solved in the Given, Asked, Solution format. Try the problem on paper first, then reveal the steps one by one to compare."
      />

      <GroupTitle>1. Propositional Logic</GroupTitle>

      <ExerciseItem
        tag="PROBLEM 1.1"
        title="Midterm OR final: inclusive or exclusive?"
        given={['Syllabus rule: "Students who miss the midterm OR fail the final will not pass."']}
        asked={["Model the rule in propositional logic.", "Is the OR inclusive or exclusive, and does it matter?"]}
        steps={[
          { title: "Define the propositions", text: "Keep each base proposition simple and positive.", formula: "m : the student misses the midterm\nf : the student fails the final\np : the student passes" },
          { title: "Translate the sentence", text: 'The phrase "will not pass" is the conclusion, so ¬p. The condition is "miss the midterm OR fail the final".', formula: "(m ∨ f) → ¬p" },
          {
            title: "Compare inclusive and exclusive OR",
            text: "The two readings only differ in the row where both m and f are true.",
            extra: <MiniTable headers={["m", "f", "m ∨ f", "m ⊕ f"]} rows={[["T", "T", "T", "F"], ["T", "F", "T", "T"], ["F", "T", "T", "T"], ["F", "F", "F", "F"]]} highlight={[0]} />,
          },
          { title: "Decide", text: "With exclusive OR, a student who misses the midterm AND fails the final would make m ⊕ f false, so the rule would say nothing about them and they might pass. That is absurd, because this student did worse than everyone else. So the intended meaning is inclusive OR (∨). Yes, it matters, but only for the student who does both." },
        ]}
        answer="(m ∨ f) → ¬p, with inclusive OR. The difference appears only in the case where both m and f are true."
      />

      <ExerciseItem
        tag="PROBLEM 1.2"
        title={'"You cannot graduate unless you complete your thesis"'}
        given={['Statement: "You cannot graduate unless you complete your thesis."']}
        asked={["Rewrite it using →.", "Identify the hypothesis and the conclusion."]}
        steps={[
          { title: "Define the propositions", formula: "g : you graduate\nt : you complete your thesis" },
          { title: "Understand 'unless'", text: '"A unless B" means "if not B, then A". Here A is "you cannot graduate" (¬g) and B is "you complete your thesis" (t).', formula: "¬t → ¬g" },
          { title: "Find the equivalent natural form", text: "The contrapositive of ¬t → ¬g is g → t. Graduating requires the thesis, so completing the thesis is necessary for graduating.", formula: "¬t → ¬g  ≡  g → t" },
          {
            title: "Verify with a truth table",
            extra: <MiniTable headers={["g", "t", "¬t → ¬g", "g → t"]} rows={[["T", "T", "T", "T"], ["T", "F", "F", "F"], ["F", "T", "T", "T"], ["F", "F", "T", "T"]]} />,
          },
          { title: "Name the parts", text: "In g → t: hypothesis g (you graduate), conclusion t (you complete the thesis). In ¬t → ¬g: hypothesis ¬t (you do not complete the thesis), conclusion ¬g (you cannot graduate)." },
        ]}
        answer="g → t (equivalently ¬t → ¬g). In g → t the hypothesis is g and the conclusion is t."
      />

      <ExerciseItem
        tag="PROBLEM 1.3"
        title="Where do I use p → q in daily life?"
        given={["An open question. The answer should come from your own experience."]}
        asked={["Describe one real situation (an app, a policy, a habit) where you used p → q reasoning without noticing."]}
        steps={[
          { title: "Pick a situation", text: "Look for any rule that has an 'if ... then ...' shape, even if the words 'if' and 'then' are hidden." },
          { title: "Sample answer (an app)", text: 'Phone alarm: "If it is 6:00 AM on a weekday, then the alarm rings."', formula: "p : it is 6:00 AM on a weekday\nq : the alarm rings\np → q" },
          { title: "Check it like a logician", text: "When p is false (it is Sunday), the alarm may or may not ring and the rule is not broken. The rule is only broken when p is true and q is false." },
          { title: "Other ideas", text: 'Campus policy: "If your attendance is below 75%, you cannot take the final exam." Habit: "If I feel sleepy, I drink coffee." Write the one that is true for you, in your own words.' },
        ]}
        answer="Any honest example works if you can name p, name q, and say what makes the implication false."
      />

      <ExerciseItem
        tag="PROBLEM 1.4"
        title="Can every rule be modeled in propositional logic?"
        given={["Propositional logic uses statements that are exactly true or false and combines them with ¬, ∧, ∨, →, ↔."]}
        asked={["Decide if every real-world rule can be translated, and give a rule that resists translation."]}
        steps={[
          { title: "Short answer", text: "No. Propositional logic can only handle statements with a clear truth value, and it treats each simple statement as a single block." },
          { title: "Resists: vague or fuzzy rules", text: '"If it is hot, wear light clothes." How hot is hot? The truth value of "it is hot" is a matter of degree, not exactly T or F.' },
          { title: "Resists: rules about 'all' and 'some'", text: '"Every student must submit the assignment." We would need one proposition per student. Predicate logic (week 3) fixes this with ∀x.' },
          { title: "Resists: opinions, commands and questions", text: '"Be kind to others" is not true or false. It is a command, so it is not a proposition at all.' },
          { title: "Resists: self-reference", text: '"This sentence is false" cannot be assigned T or F without contradiction.' },
        ]}
        answer="No. Vague, quantified, opinion-based, or self-referential rules do not translate cleanly. Predicate logic handles the quantified case."
      />

      <ExerciseItem
        tag="PROBLEM 1.5 (a)"
        title="If I study Discrete Math and Linear Algebra then I will get good grades"
        given={['"If I study Discrete Math and Linear Algebra then I will get good grades."']}
        asked={["Define simple propositions and write the logical expression."]}
        steps={[
          { title: "Define propositions", formula: "d : I study Discrete Math\nl : I study Linear Algebra\ng : I get good grades" },
          { title: "Find the main connective", text: 'The sentence is "if ... then ...", so the main connective is →. The condition "D and L" is grouped with brackets so the implication applies to both.' },
          { title: "Write it", formula: "(d ∧ l) → g" },
        ]}
        answer="(d ∧ l) → g"
      />

      <ExerciseItem
        tag="PROBLEM 1.5 (b)"
        title="The sky is blue or the earth is round"
        given={['"The sky is blue or the earth is round."']}
        asked={["Translate into propositional logic."]}
        steps={[
          { title: "Define propositions", formula: "b : the sky is blue\nr : the earth is round" },
          { title: "Choose the connective", text: '"or" here is the ordinary inclusive or.', formula: "b ∨ r" },
        ]}
        answer="b ∨ r"
      />

      <ExerciseItem
        tag="PROBLEM 1.5 (c)"
        title="It is Monday and I am not at work"
        given={['"It is Monday and I am not at work."']}
        asked={["Translate. Base propositions must be positive."]}
        steps={[
          { title: "Define propositions", text: "Do not define 'I am not at work' as a base proposition. Define the positive version and negate it in the formula.", formula: "m : it is Monday\nw : I am at work" },
          { title: "Combine", text: '"not at work" becomes ¬w, joined with "and".', formula: "m ∧ ¬w" },
        ]}
        answer="m ∧ ¬w"
      />

      <ExerciseItem
        tag="PROBLEM 1.5 (d)"
        title="I will live to be 100 iff I exercise every day and I eat well"
        given={['"I will live to be 100 years old iff I exercise every day and I eat well."']}
        asked={["Translate using brackets where needed."]}
        steps={[
          { title: "Define propositions", formula: "l : I will live to be 100 years old\ne : I exercise every day\nw : I eat well" },
          { title: "Main connective", text: '"iff" splits the sentence into two sides: the left is "l" and the right is "e and w". So the main connective is ↔.' },
          { title: "Bracket the right side", text: "Without brackets, l ↔ e ∧ w could be read as (l ↔ e) ∧ w, which is a different statement. Brackets make our meaning clear.", formula: "l ↔ (e ∧ w)" },
        ]}
        answer="l ↔ (e ∧ w)"
      />

      <ExerciseItem
        tag="PROBLEM 1.5 (e)"
        title="I miss the bus if I sleep in"
        given={['"I miss the bus if I sleep in."']}
        asked={["Translate. Watch the direction of the implication."]}
        steps={[
          { title: "Define propositions", formula: "s : I sleep in\nb : I miss the bus" },
          { title: "Watch the word 'if'", text: '"q if p" means p → q. The part after "if" is the hypothesis. So "I sleep in" is the hypothesis.', formula: "s → b" },
          { title: "Common mistake", text: 'Writing b → s says "if I miss the bus then I slept in", which is a different (converse) statement.' },
        ]}
        answer="s → b"
      />

      <GroupTitle>2. Logical Equivalences</GroupTitle>

      <ExerciseItem
        tag="PROBLEM 2 (as printed)"
        title="¬(p ∧ q) ∨ (¬p ∧ q) ≡ ¬p : check first"
        given={["The claimed equivalence: ¬(p ∧ q) ∨ (¬p ∧ q) ≡ ¬p", "Hint: apply De Morgan to the first term, then look for a distributive step."]}
        asked={["Prove the equivalence using logical laws."]}
        steps={[
          { title: "Apply De Morgan to the first term", formula: "¬(p ∧ q) ∨ (¬p ∧ q)\n≡ (¬p ∨ ¬q) ∨ (¬p ∧ q)" },
          { title: "Distribute (A ∨ (B ∧ C) ≡ (A ∨ B) ∧ (A ∨ C))", text: "Let A = (¬p ∨ ¬q).", formula: "≡ ((¬p ∨ ¬q) ∨ ¬p) ∧ ((¬p ∨ ¬q) ∨ q)" },
          { title: "Simplify each side", text: "Left: idempotent law gives ¬p ∨ ¬q. Right: ¬q ∨ q is T (negation law), and anything OR T is T.", formula: "≡ (¬p ∨ ¬q) ∧ T\n≡ ¬p ∨ ¬q" },
          { title: "The laws give ¬p ∨ ¬q, not ¬p", text: "So the statement as printed is not an equivalence. A counterexample confirms it: p = T, q = F makes the left side true and ¬p false.", extra: <MiniTable headers={["p", "q", "¬(p ∧ q) ∨ (¬p ∧ q)", "¬p"]} rows={[["T", "T", "F", "F"], ["T", "F", "T", "F"], ["F", "T", "T", "T"], ["F", "F", "T", "T"]]} highlight={[1]} /> },
        ]}
        answer="As printed, the two sides are NOT equivalent (row 2 differs). The left side simplifies to ¬p ∨ ¬q. See the next problem for the version that works."
      />

      <ExerciseItem
        tag="PROBLEM 2 (likely intended)"
        title="¬(p ∨ q) ∨ (¬p ∧ q) ≡ ¬p"
        given={["The version with ∨ inside the first negation: ¬(p ∨ q) ∨ (¬p ∧ q) ≡ ¬p", "This matches the hint: De Morgan first, then a distributive step."]}
        asked={["Prove the equivalence using logical laws."]}
        steps={[
          { title: "Apply De Morgan to the first term", text: "¬(p ∨ q) ≡ ¬p ∧ ¬q.", formula: "¬(p ∨ q) ∨ (¬p ∧ q)\n≡ (¬p ∧ ¬q) ∨ (¬p ∧ q)" },
          { title: "Factor out ¬p (distributive law, read backwards)", text: "(A ∧ B) ∨ (A ∧ C) ≡ A ∧ (B ∨ C) with A = ¬p.", formula: "≡ ¬p ∧ (¬q ∨ q)" },
          { title: "Negation law", text: "¬q ∨ q is always true.", formula: "≡ ¬p ∧ T" },
          { title: "Identity law", formula: "≡ ¬p" },
          {
            title: "Double check with a truth table",
            extra: <MiniTable headers={["p", "q", "¬(p ∨ q) ∨ (¬p ∧ q)", "¬p"]} rows={[["T", "T", "F", "F"], ["T", "F", "F", "F"], ["F", "T", "T", "T"], ["F", "F", "T", "T"]]} />,
          },
        ]}
        answer="¬(p ∨ q) ∨ (¬p ∧ q) ≡ ¬p. Every row matches. Laws used: De Morgan, distributive, negation, identity."
      />
    </div>
  );
}
