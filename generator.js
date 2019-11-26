const { parse } = require('./parser')

const rules = {
  beandown(cst, generator) {
    const { blocks } = cst
    const generated = blocks.map(generator)
    const divs = generated.map(g => `<div> ${g} </div>`)
    return divs.join('\n')
  },
  newline(cst, generator) {
    return '<br>'
  },
  block(cst, generator) {
    const { content } = cst
    const generated = content.map(generator)
    return generated.join('')
  },
  asterisk_text(cst, generator) {
    const { text } = cst
    return `<i> ${text} </i>`
  },
  underscore_text(cst, generator) {
    return rules.asterisk_text(cst, generator)
  },
  double_asterisk_text(cst, generator) {
    const { text } = cst
    return `<b> ${text} </b>`
  },
  double_underscore_text(cst, generator) {
    return rules.double_asterisk_text(cst, generator)
  },
  heading(cst, generator) {
    const { level, text } = cst
    return `<h${level}> text </h${level}>`
  },
  text(cst, generator) {
    const { raw } = cst
    return `<span> ${raw} </span>`
  },
  inline_code(cst, generator) {
    const { code } = cst
    return `<code>${code}</code>`
  },
  code_block(cst, generator) {
    const result = rules.inline_code(cst, generator)
    return `<pre> ${result} </pre>`
  },
  link(cst, generator) {
    const { link, title } = cst
    return `<a href="${link}"> ${title} </a>`
  },
  image(cst, generator) {
    const { link, title } = cst
    return `<img src="${link}" title="${title}">`
  },
  blockquote(cst, generator) {
    const { text } = cst
    return `<blockquote> ${text} </blockquote>`
  },
  unordered_list(cst, generator) {
    const { items } = cst
    const lis = items.map(item => `<li>${item}</li>`).join('\n')
    return `<ul>${lis}</ul>`
  }
}

generator = cst => rules[cst.name](cst, generator)

const generate = input => generator(parse(input))

module.exports.generate = generate
module.exports.rules = rules
module.exports.generator = generator
