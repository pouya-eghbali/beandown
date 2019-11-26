const { bean, beef } = require('bean-parser')
const fs = require("fs");
const beandownLexer = require("./lexer.js");
const { resolve } = require('path')
const beandownModel = fs.readFileSync(resolve(__dirname, "beandown.beef"), { encoding: "utf8" });

const helpers = {}
const model = beef(beandownModel, helpers);

const parse = source => {
  const tokens = beandownLexer(source);
  const [success, result] = bean(model, tokens);
  if (success) {
    const cst = result[0];
    return cst
  } else {
    console.log(result);

    const firstUnmatched = result[0].name
    const expecting = model.filter(m => m.left == firstUnmatched).map(({ right }) => right)
    const encountered = result[1].name
    const ParsingError = `Expecting one of ${expecting.join(', ')} but encountered ${encountered}`
    throw ParsingError
  }
}

module.exports.parse = parse
module.exports.model = model
module.exports.lexer = beandownLexer
