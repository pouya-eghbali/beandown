const patterns = require("./patterns");
function tokenize(string) {
  let tokens = [];
  let pattern, match, matched;
  let i = 0;
  while (i < string.length) {
    matched = false;
    for (let name in patterns) {
      if (patterns.hasOwnProperty(name)) {
        pattern = patterns[name];
        match = string.slice(i).match(pattern);
        if (match != null) {
          tokens.push({
            name: name,
            index: i,
            raw: match[0]
          });
          i += match[0].length;
          matched = true;
          break;
        }
      }
    }
    if (!matched) throw new Error(`Lexing error at ${i}`);
  }
  tokens.push({
    name: "newline",
    index: string.length,
    raw: "\n"
  });
  tokens.push({
    name: "eof",
    index: string.length,
    raw: "eof"
  });
  return tokens;
}

/**
 * bean cannot parse if starter and enders
 * are the same. This function inserts ender
 * tokens for these pairs so we can parse them
 * using bean.
 *
 * (for example, italic starts with an
 *  underscore and ends with an underscore)
 *
 * @param {[Object]} tokens
 */
function insertEnders(tokens) {
  const result = [];
  const starts = [];
  let lastToken = null;
  for (let index = 0; index < tokens.length; ) {
    const token = tokens[index];
    const { name } = token;
    let pushCount = 1;
    let pushEnder = false;
    if (name == "newline") starts.length = 0;
    else if (["asterisk", "underscore"].includes(name)) {
      if (lastToken == name) {
        starts
          .slice(-1)
          .pop()
          .push(name);
      } else if (starts.length) {
        const last = starts.slice(-1).pop();
        const lastName = last[0];
        const { length } = last;
        const names = tokens.slice(index, index + length);
        const isEnder = names.every(({ name }) => name == lastName);
        if (isEnder) {
          starts.pop();
          pushEnder = true;
          pushCount = length;
        } else {
          starts.push([name]);
        }
      } else {
        starts.push([name]);
      }
    }
    lastToken = name;
    tokens.slice(index, index + pushCount).forEach(token => result.push(token));
    if (pushEnder) result.push({ name: `${name}Ender` });
    index += pushCount;
  }
  return result;
}

/**
 * Indents are only important in lists,
 * this function inserts indent and dedent
 * tokens where it matters
 * @param {[Object]} tokens
 */
const insertIndents = tokens => {
  const result = tokens.slice(0, 1);
  let indentLevels = [0];
  let listCount = 0;
  const indentLevel = () => indentLevels[indentLevels.length - 1];
  for (const index in tokens.slice(0, -2)) {
    const [left, middle, right] = tokens.slice(index, index + 3);
    const spaceLength = () => middle.raw.length;
    if (
      (left.name == "newline" && middle.name == "newline") ||
      (left.name == "newline" &&
        middle.name == "space" &&
        right.name == "newline")
    ) {
      // empty line, do nothing
    } else if (
      listCount &&
      left.name == "newline" &&
      middle.name == "space" &&
      spaceLength() != indentLevel()
    ) {
      const dent = indentLevel() > spaceLength() ? "dedent" : "indent";
      const token = {
        name: dent,
        raw: dent,
        index: middle.index
      };
      if (dent == "dedent") {
        while (indentLevel() > spaceLength()) {
          result.push(token);
          indentLevels.pop();
          listCount--;
        }
      } else {
        result.push(token);
        indentLevels.push(spaceLength());
      }
    } else if (listCount && left.name == "newline" && middle.name != "space") {
      while (indentLevels.length > 1) {
        const token = { name: "dedent", raw: "dedent", index: middle.index };
        result.push(token);
        indentLevels.pop();
      }
    }
    if (
      left.name == "integer" &&
      middle.name == "dot" &&
      right.name == "space"
    ) {
      listCount++;
    } else if (left.name == "dash") {
      listCount++;
    }
    result.push(middle);
  }
  const eof = tokens.pop();
  while (indentLevels.length > 1) {
    const token = { name: "dedent", raw: "dedent", index: eof.index };
    result.push(token);
    indentLevels.pop();
  }
  result.push(eof);
  return result;
};

function lexer(string) {
  const steps = [tokenize, insertEnders, insertIndents];
  return steps.reduce((data, step) => step(data), string);
}

module.exports = lexer;
