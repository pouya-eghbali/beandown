const { parse } = require("./parser");
const katex = require("katex");
const prism = require("prismjs");
const loadLanguages = require("prismjs/components/index");

const rules = {
  beandown(cst, generator) {
    const { blocks } = cst;
    const generated = blocks.map(generator);
    const divs = generated.map(g => `<div> ${g} </div>`);
    return divs.join("\n");
  },
  block(cst, generator) {
    const { content } = cst;
    const result = content.map(generator).join("\n");
    return `<p> ${result} </p>`;
  },
  heading(cst, generator) {
    const { content, level } = cst;
    const result = generator(content);
    return `<h${level}> ${result} </h${level}>`;
  },
  line(cst, generator) {
    const { content } = cst;
    return content.map(generator).join("\n");
  },
  text(cst, generator) {
    const { content } = cst;
    return content.map(generator).join("");
  },
  space(cst) {
    return cst.raw;
  },
  symbol(cst) {
    return cst.raw;
  },
  link(cst) {
    const { content } = cst;
    const title = content.title.raw.slice(1, -1);
    const href = content.href.raw.slice(1, -1);
    return `<a href="${href}"> ${title} </a>`;
  },
  image(cst) {
    const { content } = cst;
    const title = content.title.raw.slice(1, -1);
    const href = content.href.raw.slice(1, -1);
    return `<img src="${href}" alt="${title}">`;
  },
  blockquote(cst, generator) {
    const { content } = cst;
    const result = content.map(generator).join("\n");
    return `<blockquote> ${result} </blockquote>`;
  },
  unorderedList(cst, generator) {
    const { content } = cst;
    const result = content.map(generator).join("\n");
    return `<ul> ${result} </ul>`;
  },
  unorderedListItem(cst, generator) {
    const { content } = cst;
    const result = generator(content);
    return `<li> ${result} </li>`;
  },
  orderedList(cst, generator) {
    const { content } = cst;
    const result = content.map(generator).join("\n");
    return `<ol> ${result} </ol>`;
  },
  orderedListItem(cst, generator) {
    const { content } = cst;
    const result = generator(content);
    return `<li> ${result} </li>`;
  },
  code(cst) {
    const code = cst.raw.replace(/^`+/, "").replace(/`+$/, "");
    const isMultiline = code.indexOf("\n") != -1;
    if (!isMultiline) return `<code>${code}</code>`;
    const lines = code.split("\n");
    const firstLine = lines.shift();
    const codeLines = lines.join("\n");
    const lang = firstLine.trim();
    if (lang == "mermaid") return `<div class="mermaid">${codeLines}</div>`;
    if (lang == "katex") return katex.renderToString(codeLines);
    const langClass = lang ? `language-${lang}` : "";
    const langRef = prism.languages[lang];
    const highlighted = langRef
      ? prism.highlight(codeLines, langRef, lang)
      : codeLines;
    return `<pre class="${langClass}"><code>${highlighted}</code></pre>`;
  },
  table(cst, generator) {
    const { header, rows } = cst;
    const processedHeader = generator(header);
    const processedRows = rows.map(generator).join("\n");
    return `
      <table>
        <thead> ${processedHeader} </thead>
        <tbody> ${processedRows} </tbody>
      </table>`;
  },
  tableRowLine(cst, generator) {
    const { row } = cst;
    return generator(row);
  },
  tableCell(cst, generator) {
    const { type, content } = cst;
    const result = generator(content);
    return `<${type}> ${result} </${type}>`;
  },
  tableRow(cst) {
    const { cells, type } = cst;
    const processedCells = cells
      .map(cell => ({ ...cell, type }))
      .map(generator)
      .join("\n");
    return `<tr> ${processedCells} </tr>`;
  },
  underscoreText(cst, generator) {
    const { content } = cst;
    const result = content.map(generator).join("\n");
    return `<i> ${result} </i>`;
  },
  doubleAsteriskText(cst, generator) {
    const { content } = cst;
    const result = content.map(generator).join("\n");
    return `<b> ${result} </b>`;
  },
  math(cst) {
    return katex.renderToString(cst.raw.slice(1, -1));
  },
  listBlock(cst, generator) {
    const { content } = cst;
    return content.map(generator).join("\n");
  },
  spaceOrderedListItem(cst, generator) {
    return rules.orderedListItem(cst, generator);
  },
  spaceUnorderedListItem(cst, generator) {
    return rules.unorderedListItem(cst, generator);
  },
  spaceUnorderedList(cst, generator) {
    return rules.unorderedList(cst, generator);
  },
  spaceOrderedList(cst, generator) {
    return rules.orderedList(cst, generator);
  },
  newline() {
    return `</br>`;
  }
};

generator = cst => {
  console.log({ name: cst.name });
  return rules[cst.name](cst, generator);
};

const generate = input => generator(parse(input));

module.exports.generate = generate;
module.exports.rules = rules;
module.exports.generator = generator;
