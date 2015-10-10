var htmlparser = require('htmlparser2');

// Tokenize some html content to return tokens of text
function tokenize(content) {
    var tokens = [];
    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs) { },
        ontext: function(text) {
            var start = parser.startIndex;

            tokens.push({
                value: text,
                index: start,
                offset: text.length
            });
        },
        onclosetag: function(tagname) { }
    });
    parser.write(content);
    parser.end();

    return tokens;
}

module.exports = {
    tokenize: tokenize
};
