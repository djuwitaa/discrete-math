import { ExerciseItem, GroupTitle, SheetHeader } from "./ExerciseItem";

const DEFS = "Naming convention: predicate names and named individuals start with a capital letter, variables are lowercase.";

// Builds one step for a "three ways" translation part.
const way3 = (label, statement, defs, ways, note) => ({
  title: `${label} ${statement}`,
  text: note,
  formula: `${defs}\n\nWay 1: ${ways[0]}\nWay 2: ${ways[1]}\nWay 3: ${ways[2]}`,
});

const way2 = (label, statement, defs, ways, note) => ({
  title: `${label} ${statement}`,
  text: note,
  formula: `${defs}\n\nWay 1 (domain: students in the class): ${ways[0]}\nWay 2 (domain: all people): ${ways[1]}`,
});

export default function Week3Exercises() {
  return (
    <div className="space-y-6">
      <SheetHeader
        week={3}
        title="Assignment 2: Answer Sheet"
        intro="Predicate logic, quantifiers and nested quantifiers. Every problem uses Given, Asked, Solution. For the translation problems, the ways differ only in the domain and in how many variables the predicate has, so many answers are valid. Yours should be equivalent to the ones shown."
      />

      <GroupTitle>1. Predicate Logic</GroupTitle>

      <ExerciseItem
        tag="PROBLEM 1.1"
        title="Three ways to translate (school statements, part 1)"
        given={[DEFS, "Domain choices: (1) people in your school, (2) all people with a predicate InSchool(x), (3) two variables, x over people and y over a second domain (countries, subjects, vehicles...)."]}
        asked={["Translate each of statements a) to e) in three different ways."]}
        steps={[
          { title: "How to read the task", text: 'When the domain is only "people in your school", the phrase "in your school" is already built into the domain, so we do not need it in the formula. When the domain is all people, we must add InSchool(x). Using a two-variable predicate moves a constant (like Uzbekistan) into an argument.' },
          way3("a)", "Someone in your school has visited Uzbekistan.",
            "Visited(x): x has visited Uzbekistan\nVisitedPlace(x, y): x has visited y\nInSchool(x): x is in your school",
            ["∃x Visited(x)   [domain: people in school]", "∃x (InSchool(x) ∧ Visited(x))   [domain: all people]", "∃x (InSchool(x) ∧ VisitedPlace(x, Uzbekistan))   [x: people, y: countries]"],
            '"Someone" means ∃. Use ∧ to join the conditions on the same x.'),
          way3("b)", "Everyone in your class has studied calculus and C++.",
            "Calculus(x): x has studied calculus\nCpp(x): x has studied C++\nInClass(x): x is in your class\nStudied(x, y): x has studied y",
            ["∀x (Calculus(x) ∧ Cpp(x))   [domain: people in class]", "∀x (InClass(x) → (Calculus(x) ∧ Cpp(x)))   [domain: all people]", "∀x (InClass(x) → (Studied(x, Calculus) ∧ Studied(x, Cpp)))   [x: people, y: subjects]"],
            'With ∀ and a restriction ("in your class"), use → . "Calculus and C++" stays as ∧ inside the conclusion.'),
          way3("c)", "No one in your school owns both a bicycle and a motorcycle.",
            "Bicycle(x): x owns a bicycle\nMotorcycle(x): x owns a motorcycle\nOwns(x, y): x owns y",
            ["¬∃x (Bicycle(x) ∧ Motorcycle(x))   [domain: people in school]", "∀x (InSchool(x) → ¬(Bicycle(x) ∧ Motorcycle(x)))   [domain: all people]", "¬∃x (InSchool(x) ∧ Owns(x, Bicycle) ∧ Owns(x, Motorcycle))   [x: people, y: vehicles]"],
            '"No one ..." is ¬∃. By the negation rule, ¬∃x P(x) ≡ ∀x ¬P(x), which is the form used in Way 2. Careful: "not both" means ¬(A ∧ B), not ¬A ∧ ¬B.'),
          way3("d)", "There is a person in your school who is not happy.",
            "Happy(x): x is happy\nAttends(x, y): x attends y",
            ["∃x ¬Happy(x)   [domain: people in school]", "∃x (InSchool(x) ∧ ¬Happy(x))   [domain: all people]", "∃x (Attends(x, School) ∧ ¬Happy(x))   [x: people, y: institutions]"],
            'The negation belongs on the predicate: "not happy" is ¬Happy(x). Writing ¬∃x Happy(x) would mean "nobody is happy", which is much stronger.'),
          way3("e)", "Everyone in your school was born in the twentieth century.",
            "Born20(x): x was born in the twentieth century\nBornIn(x, y): x was born in century y",
            ["∀x Born20(x)   [domain: people in school]", "∀x (InSchool(x) → Born20(x))   [domain: all people]", "∀x (InSchool(x) → BornIn(x, Twentieth))   [x: people, y: centuries]"],
            "We are only translating, so we do not need to decide if it is true in real life."),
        ]}
        answer="Translations a) to e) are shown above. The pattern: ∃ goes with ∧, ∀ goes with →, and a restricted domain removes the need for InSchool(x)."
      />

      <ExerciseItem
        tag="PROBLEM 1.2"
        title="Three ways to translate (school statements, part 2)"
        given={[DEFS, "Same three styles of translation as Problem 1.1."]}
        asked={["Translate each of statements a) to e) in three different ways."]}
        steps={[
          way3("a)", "A student in your school has lived in Vietnam.",
            "Lived(x): x has lived in Vietnam\nLivedIn(x, y): x has lived in y\nStudent(x): x is a student in your school",
            ["∃x Lived(x)   [domain: students in school]", "∃x (Student(x) ∧ Lived(x))   [domain: all people]", "∃x (Student(x) ∧ LivedIn(x, Vietnam))   [x: people, y: countries]"],
            '"A student ... has" means ∃.'),
          way3("b)", "There is a student in your school who cannot speak Hindi.",
            "Hindi(x): x can speak Hindi\nSpeaks(x, y): x can speak y",
            ["∃x ¬Hindi(x)   [domain: students in school]", "∃x (Student(x) ∧ ¬Hindi(x))   [domain: all people]", "∃x (Student(x) ∧ ¬Speaks(x, Hindi))   [x: people, y: languages]"],
            '"cannot speak" is the negation of the predicate, ¬Hindi(x).'),
          way3("c)", "A student in your school knows Java, Prolog, and C++.",
            "Java(x), Prolog(x), Cpp(x): x knows that language\nKnows(x, y): x knows y",
            ["∃x (Java(x) ∧ Prolog(x) ∧ Cpp(x))   [domain: students in school]", "∃x (Student(x) ∧ Java(x) ∧ Prolog(x) ∧ Cpp(x))   [domain: all people]", "∃x (Student(x) ∧ Knows(x, Java) ∧ Knows(x, Prolog) ∧ Knows(x, Cpp))   [x: people, y: languages]"],
            "It must be the same student who knows all three, so one ∃ covers all three conditions."),
          way3("d)", "Everyone in your class enjoys Thai food.",
            "Enjoys(x): x enjoys Thai food\nLikes(x, y): x enjoys y\nInClass(x): x is in your class",
            ["∀x Enjoys(x)   [domain: people in class]", "∀x (InClass(x) → Enjoys(x))   [domain: all people]", "∀x (InClass(x) → Likes(x, ThaiFood))   [x: people, y: foods]"],
            '"Everyone in your class" is ∀ with → .'),
          way3("e)", "Someone in your class does not play hockey.",
            "Hockey(x): x plays hockey\nPlays(x, y): x plays y",
            ["∃x ¬Hockey(x)   [domain: people in class]", "∃x (InClass(x) ∧ ¬Hockey(x))   [domain: all people]", "∃x (InClass(x) ∧ ¬Plays(x, Hockey))   [x: people, y: sports]"],
            "Same shape as 1.1 d)."),
        ]}
        answer="Translations a) to e) are shown above."
      />

      <ExerciseItem
        tag="PROBLEM 1.3"
        title="Two ways: class domain and all-people domain"
        given={["Way 1: the domain is the students in your class.", "Way 2: the domain is all people, so we need InClass(x): x is a student in your class."]}
        asked={["Translate each of statements a) to e) in these two ways."]}
        steps={[
          way2("a)", "Everyone in your class has a cellular phone.", "Phone(x): x has a cellular phone", ["∀x Phone(x)", "∀x (InClass(x) → Phone(x))"], "Universal, so → with the restriction in the all-people domain."),
          way2("b)", "Somebody in your class has seen a foreign movie.", "Foreign(x): x has seen a foreign movie", ["∃x Foreign(x)", "∃x (InClass(x) ∧ Foreign(x))"], "Existential, so ∧."),
          way2("c)", "There is a person in your class who cannot swim.", "Swim(x): x can swim", ["∃x ¬Swim(x)", "∃x (InClass(x) ∧ ¬Swim(x))"], "Negate the predicate, not the quantifier."),
          way2("d)", "All students in your class can solve quadratic equations.", "Quadratic(x): x can solve quadratic equations", ["∀x Quadratic(x)", "∀x (InClass(x) → Quadratic(x))"], "Universal, so →."),
          way2("e)", "Some student in your class does not want to be rich.", "WantRich(x): x wants to be rich", ["∃x ¬WantRich(x)", "∃x (InClass(x) ∧ ¬WantRich(x))"], "Define the positive predicate WantRich(x), then negate it in the formula."),
        ]}
        answer="Translations a) to e) are shown above."
      />

      <ExerciseItem
        tag="PROBLEM 1.4"
        title="Perfect people and friends"
        given={["Domain: all people.", "P(x): x is perfect", "F(x): x is your friend"]}
        asked={["Translate statements a) to f)."]}
        steps={[
          { title: "a) No one is perfect.", text: '"No one" means there does not exist someone who is perfect. The equivalent ∀ form says everyone is not perfect.', formula: "¬∃x P(x)   ≡   ∀x ¬P(x)" },
          { title: "b) Not everyone is perfect.", text: "This only says at least one person fails to be perfect. It is weaker than a).", formula: "¬∀x P(x)   ≡   ∃x ¬P(x)" },
          { title: "c) All your friends are perfect.", text: '"All your friends" restricts x to friends, so use → .', formula: "∀x (F(x) → P(x))" },
          { title: "d) At least one of your friends is perfect.", text: "Existential, so ∧. The same x is a friend and perfect.", formula: "∃x (F(x) ∧ P(x))" },
          { title: "e) Everyone is your friend and is perfect.", text: "No restriction here. Every person in the domain has both properties.", formula: "∀x (F(x) ∧ P(x))" },
          { title: "f) Not everybody is your friend or someone is not perfect.", text: 'Two parts joined by "or". Part 1: ¬∀x F(x). Part 2: ∃x ¬P(x).', formula: "¬∀x F(x) ∨ ∃x ¬P(x)\n≡ ∃x ¬F(x) ∨ ∃x ¬P(x)\n≡ ∃x (¬F(x) ∨ ¬P(x))\n≡ ¬∀x (F(x) ∧ P(x))   [the negation of e)]" },
        ]}
        answer="a) ¬∃xP(x)   b) ¬∀xP(x)   c) ∀x(F(x) → P(x))   d) ∃x(F(x) ∧ P(x))   e) ∀x(F(x) ∧ P(x))   f) ¬∀xF(x) ∨ ∃x¬P(x)"
      />

      <ExerciseItem
        tag="PROBLEM 1.5"
        title="Find a domain that makes it true and one that makes it false"
        given={["Four statements. The truth value depends on the domain, so we choose domains on purpose."]}
        asked={["For each statement, give one domain where it is true and one where it is false."]}
        steps={[
          { title: "a) Everyone is studying discrete mathematics.", formula: "∀x Studying(x)", text: "True: the domain is the students enrolled in this class, since all of them study it. False: the domain is all students at the university, since many study other subjects." },
          { title: "b) Everyone is older than 21 years.", formula: "∀x Older21(x)", text: "True: the domain is the lecturers at your faculty (all are older than 21). False: the domain is first-year students, where at least one person is 18 or 19." },
          { title: "c) Every two people have the same mother.", formula: "∀x ∀y (Mother(x) = Mother(y))", text: "True: the domain is the children of one single mother (full siblings), or even a domain with only one person. False: the domain is two unrelated people, who have different mothers." },
          { title: "d) No two different people have the same grandmother.", formula: "∀x ∀y ((x ≠ y) → (Grandmother(x) ≠ Grandmother(y)))", text: "True: the domain is a set of people from unrelated families, or just one person. False: the domain contains two cousins or two siblings, because they share a grandmother." },
        ]}
        answer="One true domain and one false domain for each statement are shown above. Any valid pair works."
      />

      <GroupTitle>2. Quantifiers and Nested Quantifiers</GroupTitle>

      <ExerciseItem
        tag="PROBLEM 2.1"
        title="Translate, negate, and explain in English"
        given={["Domain: all animals.", "Negation rules: ¬∀x P(x) ≡ ∃x ¬P(x),  ¬∃x P(x) ≡ ∀x ¬P(x),  ¬(A → B) ≡ A ∧ ¬B,  ¬(A ∧ B) ≡ ¬A ∨ ¬B"]}
        asked={["For each statement: (1) write it with quantifiers, (2) negate it so no negation is left of a quantifier, (3) say the negation in simple English."]}
        steps={[
          { title: "a) All dogs have fleas.", text: "Define Dog(x), Fleas(x).", formula: "Statement: ∀x (Dog(x) → Fleas(x))\nNegate:    ∃x ¬(Dog(x) → Fleas(x))\n        ≡ ∃x (Dog(x) ∧ ¬Fleas(x))\nEnglish:  At least one dog has no fleas." },
          { title: "b) There is a horse that can add.", text: "Define Horse(x), Add(x).", formula: "Statement: ∃x (Horse(x) ∧ Add(x))\nNegate:    ∀x ¬(Horse(x) ∧ Add(x))\n        ≡ ∀x (Horse(x) → ¬Add(x))\nEnglish:  No horse can add." },
          { title: "c) Every koala can climb.", text: "Define Koala(x), Climb(x).", formula: "Statement: ∀x (Koala(x) → Climb(x))\nNegate:    ∃x (Koala(x) ∧ ¬Climb(x))\nEnglish:  There is a koala that cannot climb." },
          { title: "d) No monkey can speak French.", text: "Define Monkey(x), French(x).", formula: "Statement: ∀x (Monkey(x) → ¬French(x))\nNegate:    ∃x ¬(Monkey(x) → ¬French(x))\n        ≡ ∃x (Monkey(x) ∧ French(x))\nEnglish:  Some monkey can speak French." },
          { title: "e) There exists a pig that can swim and catch fish.", text: "Define Pig(x), Swim(x), Catch(x).", formula: "Statement: ∃x (Pig(x) ∧ Swim(x) ∧ Catch(x))\nNegate:    ∀x ¬(Pig(x) ∧ Swim(x) ∧ Catch(x))\n        ≡ ∀x (Pig(x) → (¬Swim(x) ∨ ¬Catch(x)))\nEnglish:  Every pig either cannot swim or cannot catch fish (or both)." },
        ]}
        answer="Negations: a) ∃x(Dog(x) ∧ ¬Fleas(x))  b) ∀x(Horse(x) → ¬Add(x))  c) ∃x(Koala(x) ∧ ¬Climb(x))  d) ∃x(Monkey(x) ∧ French(x))  e) ∀x(Pig(x) → (¬Swim(x) ∨ ¬Catch(x)))"
      />

      <ExerciseItem
        tag="PROBLEM 2.2"
        title="Negate without a negation symbol"
        given={["Domain: real numbers.", "Rule: negation flips the quantifier and negates the predicate. Negating the predicate flips the comparison: > becomes ≤, ≥ becomes <, ∨ becomes ∧ (De Morgan)."]}
        asked={["Write the negation of each statement without using ¬."]}
        steps={[
          { title: "a) ∀x (x > 1)", formula: "¬∀x (x > 1) ≡ ∃x ¬(x > 1) ≡ ∃x (x ≤ 1)" },
          { title: "b) ∀x (x ≤ 2)", formula: "¬∀x (x ≤ 2) ≡ ∃x ¬(x ≤ 2) ≡ ∃x (x > 2)" },
          { title: "c) ∃x (x ≥ 4)", formula: "¬∃x (x ≥ 4) ≡ ∀x ¬(x ≥ 4) ≡ ∀x (x < 4)" },
          { title: "d) ∃x (x < 0)", formula: "¬∃x (x < 0) ≡ ∀x ¬(x < 0) ≡ ∀x (x ≥ 0)" },
          { title: "e) ∀x ((x < -1) ∨ (x > 2))", text: "After flipping ∀ to ∃, apply De Morgan: ¬(A ∨ B) ≡ ¬A ∧ ¬B.", formula: "∃x ¬((x < -1) ∨ (x > 2))\n≡ ∃x (¬(x < -1) ∧ ¬(x > 2))\n≡ ∃x ((x ≥ -1) ∧ (x ≤ 2))" },
          { title: "f) ∃x ((x < 4) ∨ (x > 7))", text: "After flipping ∃ to ∀, apply De Morgan.", formula: "∀x ¬((x < 4) ∨ (x > 7))\n≡ ∀x ((x ≥ 4) ∧ (x ≤ 7))" },
        ]}
        answer="a) ∃x(x ≤ 1)  b) ∃x(x > 2)  c) ∀x(x < 4)  d) ∀x(x ≥ 0)  e) ∃x((x ≥ -1) ∧ (x ≤ 2))  f) ∀x((x ≥ 4) ∧ (x ≤ 7))"
      />

      <ExerciseItem
        tag="PROBLEM 2.3"
        title="System specifications"
        given={["Write each specification with predicates, quantifiers and connectives.", "A proposition with no variable (like 'errors detected') can be a plain letter."]}
        asked={["Translate specifications a) to d)."]}
        steps={[
          { title: "a) When there is less than 30 megabytes free on the hard disk, a warning message is sent to all users.", text: 'The condition is one fact about the disk, so it is a proposition L. The warning goes to every user, so ∀u. Domain of u: all users.', formula: "L : there is less than 30 MB free on the hard disk\nWarned(u) : a warning message is sent to user u\n\nL → ∀u Warned(u)   ≡   ∀u (L → Warned(u))" },
          { title: "b) No directories can be opened and no files can be closed when system errors have been detected.", text: "E is the condition. Inside the conclusion we need two parts joined by ∧: one about directories and one about files. Domain: all objects in the file system.", formula: "E : system errors have been detected\nDir(x): x is a directory     File(x): x is a file\nOpen(x): x can be opened     Close(x): x can be closed\n\nE → (∀x (Dir(x) → ¬Open(x)) ∧ ∀x (File(x) → ¬Close(x)))" },
          { title: "c) The file system cannot be backed up if there is a user currently logged on.", text: '"A cannot happen if B" means B → ¬A. Domain: users.', formula: "LoggedOn(x): user x is currently logged on\nB : the file system can be backed up\n\n∃x LoggedOn(x) → ¬B\n≡ ∀x (LoggedOn(x) → ¬B)" },
          { title: "d) Video on demand can be delivered when there are at least 8 MB of memory available and the connection speed is at least 56 kbps.", text: 'The word "when" introduces the condition. Both facts must hold, so they are joined by ∧ in the hypothesis.', formula: "M : at least 8 MB of memory is available\nS : the connection speed is at least 56 kbps\nV : video on demand can be delivered\n\n(M ∧ S) → V" },
        ]}
        answer="a) L → ∀u Warned(u)   b) E → (∀x(Dir(x) → ¬Open(x)) ∧ ∀x(File(x) → ¬Close(x)))   c) ∃x LoggedOn(x) → ¬B   d) (M ∧ S) → V"
      />

      <ExerciseItem
        tag="PROBLEM 2.4"
        title="Translate formulas into English"
        given={['S(x, y): "x is in state y".', "Domain: x ranges over all systems, y over all possible states."]}
        asked={["Write each formula as a plain English sentence."]}
        steps={[
          { title: "a) ∃x S(x, open)", text: "∃ is read as 'there is' or 'some'.", formula: "Some system is in the open state." },
          { title: "b) ∀x (S(x, malfunctioning) ∨ S(x, diagnostic))", text: "∀ is read as 'every'. The ∨ is inclusive, but one system cannot really be in both.", formula: "Every system is either malfunctioning or in the diagnostic state." },
          { title: "c) ∃x S(x, open) ∨ ∃x S(x, diagnostic)", text: "Two separate ∃ joined by ∨. The two systems do not need to be the same.", formula: "Some system is open, or some system is in the diagnostic state." },
          { title: "d) ∃x ¬S(x, available)", text: "The negation is on S, not on the quantifier.", formula: "Some system is not available." },
          { title: "e) ∀x ¬S(x, working)", text: "Every system fails to be in the working state. Equivalent to ¬∃x S(x, working).", formula: "No system is working." },
        ]}
        answer="a) Some system is open.  b) Every system is malfunctioning or in diagnostic mode.  c) Some system is open or some system is in diagnostic mode.  d) Some system is not available.  e) No system is working."
      />

      <ExerciseItem
        tag="PROBLEM 2.5"
        title="∃x (P(x) ∨ Q(x)) ≡ ∃x P(x) ∨ ∃x Q(x)"
        given={["P(x) and Q(x) are predicates over the same domain.", "Two statements are logically equivalent if they have the same truth value in every domain and for every choice of P and Q."]}
        asked={["Show that ∃x (P(x) ∨ Q(x)) and ∃x P(x) ∨ ∃x Q(x) are logically equivalent."]}
        steps={[
          { title: "Plan", text: "Prove both directions. If each one implies the other, they always have the same truth value." },
          { title: "Direction 1: left implies right", text: "Assume ∃x (P(x) ∨ Q(x)) is true. Then there is some element c in the domain with P(c) ∨ Q(c) true. Case 1: P(c) is true, so ∃x P(x) is true. Case 2: Q(c) is true, so ∃x Q(x) is true. In both cases, ∃x P(x) ∨ ∃x Q(x) is true.", formula: "∃x (P(x) ∨ Q(x))  ⟹  ∃x P(x) ∨ ∃x Q(x)" },
          { title: "Direction 2: right implies left", text: "Assume ∃x P(x) ∨ ∃x Q(x) is true. Case 1: ∃x P(x) is true, so there is some a with P(a) true. Then P(a) ∨ Q(a) is true, so ∃x (P(x) ∨ Q(x)) is true. Case 2: ∃x Q(x) is true, so there is some b with Q(b) true. Then P(b) ∨ Q(b) is true, so the left side is true.", formula: "∃x P(x) ∨ ∃x Q(x)  ⟹  ∃x (P(x) ∨ Q(x))" },
          { title: "Conclude", text: "Each side implies the other, so they are true in exactly the same situations." },
        ]}
        answer="∃x (P(x) ∨ Q(x)) ≡ ∃x P(x) ∨ ∃x Q(x). Note that ∃ does NOT distribute over ∧ in the same way. Only ∃ over ∨ and ∀ over ∧ distribute."
      />
    </div>
  );
}
