const patterns = {
  underscore: /^_/,
  asterisk: /^\*/,
  sharp: /^#/,
  bracket_open: /^\[/,
  bracket_close: /^\]/,
  paren_open: /^\(/,
  paren_close: /^\)/,
  exclamation: /^!/,
  greater: /^>/,
  integer: /^\d+/,
  dot: /^\./,
  dash: /^-/,
  equal: /^=/,
  colon: /^:/,
  backtick: /^`/,
  symbol: /^[^ \r\n`\[\]\(\)]+/i,
  newline: /^\r?\n/,
  space: /^ +/,
};

module.exports = patterns;
