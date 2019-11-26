module.exports = `// text

text space => text { raw: left.raw + " " }
text symbol => text { raw: left.raw + right.raw }
space symbol => text { raw: " " + right.raw }
symbol space => text { raw: left.raw + " " }


// inline code

backtick text|symbol => inline_code_start { code: right.raw }
inline_code_start text => inline_code_start { code: left.code + right.raw }
inline_code_start backtick => inline_code { code: left.code }

// code block

backtick backtick => double_backtick
double_backtick backtick => triple_backtick

text triple_backtick => double_backtick_eliminated

triple_backtick text|symbol|newline => code_block_start { code: right.raw }
code_block_start text|symbol|newline => code_block_start { code: left.code + right.raw }
code_block_start triple_backtick => code_block { code: left.code }

// [] delimited

bracket_open text => bracket_start { text: right.raw }
bracket_start text|symbol|space => bracket_start { text: left.text + right.raw }
bracket_start bracket_close => bracket { text: left.text }

// () delimited

paren_open text|symbol => paren_start { text: right.raw }
paren_start text|symbol|space => paren_start { text: left.text + right.raw }
paren_start paren_close => parentheses { text: left.text }

// link

bracket parentheses => link { title: left.text, link: right.text }

// image

exclamation bracket => exclamated_bracket { title: right.text }
exclamated_bracket parentheses => image { title: left.title, link: right.text }

// double * and _

asterisk asterisk => double_asterisk
underscore underscore => double_underscore

// * wrapped text

asterisk text => asterisk_text_start { text: right.raw }
asterisk_text_start text|symbol|space => asterisk_text_start { text: left.text + right.raw }
asterisk_text_start asterisk => asterisk_text { text: left.text }

// _ wrapped text

underscore text => underscore_text_start { text: right.raw }
underscore_text_start text|space => underscore_text_start { text: left.text + right.raw }
underscore_text_start underscore => underscore_text { text: left.text }

// ** wrapped text

double_asterisk text => double_asterisk_text_start { text: right.raw }
double_asterisk_text_start text|space => double_asterisk_text_start { text: left.text + right.raw }
double_asterisk_text_start double_asterisk => double_asterisk_text { text: left.text }

// __ wrapped text

double_underscore text => double_underscore_text_start { text: right.raw }
double_underscore_text_start text|space => double_underscore_text_start { text: left.text + right.raw }
double_underscore_text_start double_underscore => double_underscore_text { text: left.text }

// multisharp

multisharp sharp => multisharp { count: left.count + 1 }
sharp sharp => multisharp { count: 2 }

// not heading

text sharp => text { raw: left.raw + right.raw }

// headings

sharp text => heading_start { level: 1, text: right.raw }
multisharp text => heading_start { level: left.count, text: right.raw }
heading_start text => heading_start { level: left.level, text: left.text + right.raw }
heading_start newline => heading { level: left.level, text: left.text }

// not unordered list

text asterisk => text { raw: left.raw + right.raw }

// unordered list item

asterisk_text_start newline => possible_unordered_list_item { text: left.text }
possible_unordered_list_item newline => unordered_list_item { text: left.text }

// unordered list

possible_unordered_list_item possible_unordered_list_item => unordered_list { items: [left.text, right.text] }
possible_unordered_list_item unordered_list_item => unordered_list { items: [left.text, right.text] }
unordered_list unordered_list => unordered_list { items: [...left.items, ...right.items]}
unordered_list possible_unordered_list_item => unordered_list { items: [...left.items, right.text]}
unordered_list unordered_list_item => unordered_list { items: [...left.items, right.text]}

// not blockquote

text greater => text { raw: left.raw + right.raw }

// blockquote

greater text => blockquote_start { text: right.raw }
blockquote_start text|symbol => blockquote_start { text: left.text + right.raw }
blockquote_start newline => blockquote_end { text: left.text }
blockquote_end text|symbol => blockquote_start { text: left.text + ' ' + right.raw }
blockquote_end newline => blockquote { text: left.text }

asterisk_text|double_asterisk_text|underscore_text|double_underscore_text newline => block { content: [left] }
text|number|symbol|space newline => block { content: [left] }
blockquote|heading|code_block|inline_code newline => block { content: [left] }
unordered_list|unordered_list_item newline => block { content: [left] }
link|image newline => block { content: [left] }

//inline elements

link|image|text|space|symbol|greater|inline_code block => block { content: [left, ...right.content]}

// this should finish the parsing process
document eof => beandown { blocks: left.blocks }

// document

document block|blockquote|heading|newline => document { blocks: [...left.blocks, right]}
block|blockquote|heading|newline block|blockquote|heading|newline => document { blocks: [left, right]}`
