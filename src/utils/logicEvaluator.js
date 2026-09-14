// A small propositional-logic engine: tokenizer + recursive-descent parser +
// evaluator, used to power the Truth Table Visualizer. Supports the standard
// unicode operators (¬ ∧ ∨ ⊕ → ↔) as well as common ASCII fallbacks
// (! ~ & && | || ^ -> <->) so students can type on any keyboard.

const NOT = "not";
const AND = "and";
const OR = "or";
const XOR = "xor";
const IMPLIES = "implies";
const IFF = "iff";

const SYMBOL = { [NOT]: "¬", [AND]: "∧", [OR]: "∨", [XOR]: "⊕", [IMPLIES]: "→", [IFF]: "↔" };
// Higher number = binds tighter (evaluated first).
const PRECEDENCE = { [IFF]: 1, [IMPLIES]: 2, [OR]: 3, [XOR]: 3, [AND]: 4, [NOT]: 5 };

const TOKEN_PATTERN = /(<->|->|&&|\|\||[¬!~∧&∨|⊕^→↔()])|([A-Za-z][A-Za-z0-9]*)/g;

function tokenize(input) {
  const tokens = [];
  let match;
  TOKEN_PATTERN.lastIndex = 0;
  while ((match = TOKEN_PATTERN.exec(input)) !== null) {
    const [, symbolToken, wordToken] = match;
    if (symbolToken) {
      tokens.push({ raw: symbolToken, kind: symbolKind(symbolToken) });
    } else if (wordToken) {
      if (wordToken === "T" || /^true$/i.test(wordToken)) tokens.push({ kind: "const", value: true });
      else if (wordToken === "F" || /^false$/i.test(wordToken)) tokens.push({ kind: "const", value: false });
      else tokens.push({ kind: "var", name: wordToken });
    }
  }
  return tokens;
}

function symbolKind(raw) {
  switch (raw) {
    case "¬": case "!": case "~": return "not";
    case "∧": case "&": case "&&": return "and";
    case "∨": case "|": case "||": return "or";
    case "⊕": case "^": return "xor";
    case "→": case "->": return "implies";
    case "↔": case "<->": return "iff";
    case "(": return "lparen";
    case ")": return "rparen";
    default: return "unknown";
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }
  peek() { return this.tokens[this.pos]; }
  next() { return this.tokens[this.pos++]; }
  expect(kind) {
    const token = this.next();
    if (!token || token.kind !== kind) throw new Error(`Expected ${kind}`);
    return token;
  }
  parse() {
    if (this.tokens.length === 0) throw new Error("Empty expression");
    const node = this.parseIff();
    if (this.pos !== this.tokens.length) throw new Error("Unexpected token near end of expression");
    return node;
  }
  parseIff() {
    let left = this.parseImplies();
    while (this.peek()?.kind === "iff") {
      this.next();
      const right = this.parseImplies();
      left = { type: IFF, left, right };
    }
    return left;
  }
  parseImplies() {
    const left = this.parseOrXor();
    if (this.peek()?.kind === "implies") {
      this.next();
      const right = this.parseImplies(); // right-associative
      return { type: IMPLIES, left, right };
    }
    return left;
  }
  parseOrXor() {
    let left = this.parseAnd();
    while (this.peek()?.kind === "or" || this.peek()?.kind === "xor") {
      const op = this.next().kind === "or" ? OR : XOR;
      const right = this.parseAnd();
      left = { type: op, left, right };
    }
    return left;
  }
  parseAnd() {
    let left = this.parseNot();
    while (this.peek()?.kind === "and") {
      this.next();
      const right = this.parseNot();
      left = { type: AND, left, right };
    }
    return left;
  }
  parseNot() {
    if (this.peek()?.kind === "not") {
      this.next();
      const arg = this.parseNot(); // right-associative, allows ¬¬p
      return { type: NOT, arg };
    }
    return this.parseAtom();
  }
  parseAtom() {
    const token = this.peek();
    if (!token) throw new Error("Unexpected end of expression");
    if (token.kind === "lparen") {
      this.next();
      const node = this.parseIff();
      this.expect("rparen");
      return node;
    }
    if (token.kind === "const") { this.next(); return { type: "const", value: token.value }; }
    if (token.kind === "var") { this.next(); return { type: "var", name: token.name }; }
    throw new Error(`Unexpected token: ${token.raw ?? token.kind}`);
  }
}

/** Parse a logic string into an AST. Throws on invalid syntax. */
export function parseExpression(input) {
  const tokens = tokenize(input ?? "");
  return new Parser(tokens).parse();
}

/** Collect the sorted, unique variable names used in an AST. */
export function collectVariables(node, acc = new Set()) {
  if (!node) return acc;
  if (node.type === "var") acc.add(node.name);
  else if (node.type === NOT) collectVariables(node.arg, acc);
  else if (node.left || node.right) { collectVariables(node.left, acc); collectVariables(node.right, acc); }
  return acc;
}

function precedenceOf(node) {
  if (node.type === "var" || node.type === "const") return Infinity;
  return PRECEDENCE[node.type];
}

/** Render an AST back to a compact, minimally-parenthesized string. */
export function stringify(node) {
  if (node.type === "var") return node.name;
  if (node.type === "const") return node.value ? "T" : "F";
  if (node.type === NOT) {
    const argStr = stringify(node.arg);
    const wrapped = precedenceOf(node.arg) < PRECEDENCE[NOT] ? `(${argStr})` : argStr;
    return `${SYMBOL[NOT]}${wrapped}`;
  }
  const prec = PRECEDENCE[node.type];
  const leftStr = stringify(node.left);
  const rightStr = stringify(node.right);
  const left = precedenceOf(node.left) < prec ? `(${leftStr})` : leftStr;
  const right = precedenceOf(node.right) < prec ? `(${rightStr})` : rightStr;
  return `${left} ${SYMBOL[node.type]} ${right}`;
}

/** Evaluate an AST given a { varName: boolean } assignment. */
export function evaluate(node, assignment) {
  switch (node.type) {
    case "const": return node.value;
    case "var": return Boolean(assignment[node.name]);
    case NOT: return !evaluate(node.arg, assignment);
    case AND: return evaluate(node.left, assignment) && evaluate(node.right, assignment);
    case OR: return evaluate(node.left, assignment) || evaluate(node.right, assignment);
    case XOR: return evaluate(node.left, assignment) !== evaluate(node.right, assignment);
    case IMPLIES: return !evaluate(node.left, assignment) || evaluate(node.right, assignment);
    case IFF: return evaluate(node.left, assignment) === evaluate(node.right, assignment);
    default: throw new Error(`Unknown node type: ${node.type}`);
  }
}

/** Post-order walk collecting unique, non-trivial sub-expressions (excludes the root, variables, and constants). */
function collectSubExpressions(node, isRoot, seen, out) {
  if (!node || node.type === "var" || node.type === "const") return;
  if (node.type === NOT) collectSubExpressions(node.arg, false, seen, out);
  else { collectSubExpressions(node.left, false, seen, out); collectSubExpressions(node.right, false, seen, out); }
  if (!isRoot) {
    const label = stringify(node);
    if (!seen.has(label)) { seen.add(label); out.push({ label, node }); }
  }
}

/**
 * Build a full truth table for a logic string.
 * Returns null if the expression is empty or invalid.
 */
export function generateTruthTable(expression) {
  const trimmed = (expression ?? "").trim();
  if (!trimmed) return null;
  let root;
  try {
    root = parseExpression(trimmed);
  } catch {
    return null;
  }
  const variables = Array.from(collectVariables(root)).sort();
  if (variables.length === 0 && root.type !== "const") return null;
  if (variables.length > 6) return null; // keep the table readable (<= 64 rows)

  const subColumns = [];
  collectSubExpressions(root, true, new Set(), subColumns);

  const rowCount = 2 ** variables.length || 1;
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const inputs = {};
    variables.forEach((name, index) => {
      // p is the slowest-changing column, matching the course convention (TT, TF, FT, FF).
      const bitPosition = variables.length - index - 1;
      inputs[name] = ((i >> bitPosition) & 1) === 0;
    });
    const subValues = {};
    subColumns.forEach(({ label, node }) => { subValues[label] = evaluate(node, inputs); });
    rows.push({ inputs, subValues, result: evaluate(root, inputs) });
  }

  const isTautology = rows.every((row) => row.result === true);
  const isContradiction = rows.every((row) => row.result === false);
  return {
    expression: stringify(root),
    variables,
    subColumns,
    rows,
    isTautology,
    isContradiction,
    isContingency: !isTautology && !isContradiction,
  };
}

/**
 * Check whether two logic strings are logically equivalent (same truth value
 * on every row). Returns { isEquivalent, counterExample } — counterExample is
 * the first assignment where the two expressions disagree.
 */
export function checkEquivalence(expressionA, expressionB) {
  let rootA, rootB;
  try {
    rootA = parseExpression(expressionA);
    rootB = parseExpression(expressionB);
  } catch {
    return null;
  }
  const variables = Array.from(new Set([...collectVariables(rootA), ...collectVariables(rootB)])).sort();
  if (variables.length > 6) return null;
  const rowCount = 2 ** variables.length || 1;
  for (let i = 0; i < rowCount; i++) {
    const assignment = {};
    variables.forEach((name, index) => {
      const bitPosition = variables.length - index - 1;
      assignment[name] = ((i >> bitPosition) & 1) === 0;
    });
    if (evaluate(rootA, assignment) !== evaluate(rootB, assignment)) {
      return { isEquivalent: false, counterExample: assignment };
    }
  }
  return { isEquivalent: true, counterExample: null };
}

/** Convert common ASCII logic notation to the unicode symbols used in the course. */
export function normalizeLogicString(input) {
  try {
    return stringify(parseExpression(input));
  } catch {
    return input;
  }
}
