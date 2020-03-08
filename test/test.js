const lexer = require("../lexer");
const { parse } = require("../parser");
const { generate } = require("../generator");
const fs = require("fs");

const contents = fs.readFileSync("./test.md", { encoding: "utf8" });
const tokens = lexer(contents);
console.log({ tokens: tokens.slice(-100) });

const parsed = parse(contents);
console.dir({ parsed }, { depth: null });

fs.writeFileSync("test.cst.json", JSON.stringify(parsed, null, 2), {
  encoding: "utf8"
});

const generated = generate(contents);
console.log(generated);

const html = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="../node_modules/katex/dist/katex.min.css">
  <link rel="stylesheet" href="../node_modules/prismjs/themes/prism-okaidia.css">
  <script src="../node_modules/mermaid/dist/mermaid.min.js"></script>
  <title>Document</title>
</head>

<body>
  ${generated}
  <script>mermaid.initialize({startOnLoad:true});</script>
</body>

</html>
`;

fs.writeFileSync("test.html", html, { encoding: "utf8" });
