const patterns = {
  code: /^(`+)((?:(?!\1).|[\r\n])+)\1/,
  parentheses: /^\(([^)]|\\.)+\)/,
  bracket: /^\[([^\]]|\\.)+\]/,
  math: /^\$([^$]|\\.)+\$/,
  underscore: /^_/,
  asterisk: /^\*/,
  tilde: /^~/,
  sharp: /^#/,
  exclamation: /^!/,
  angleRight: /^>/,
  integer: /^\d+/,
  dot: /^\./,
  pipe: /^\|/,
  dash: /^-/,
  plus: /^\+/,
  equal: /^=/,
  colon: /^:/,
  symbol: /^[^ \r\n`\[\]\(\)*_]+/i,
  newline: /^\r?\n/,
  space: /^ +/
};

module.exports = patterns;
