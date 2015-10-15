// Sentences should be preceded by a space

var tokenize = require("../tokenize");
var levels = require("../levels");
var english = require("tokenize-english")(tokenize);

module.exports = tokenize.check(
    // Tokenize as sentences
    english.sentences(),

    // Output
    tokenize.define(function(sentence, current, prev) {
        if (!prev || (prev.index + prev.offset) < current.index || sentence[0] == ' ') return null;

        return {
            index: 0,
            offset: 1,
            message: "sentence should be preceded by a space"
        };
    })
);
module.exports.level = levels.ERROR;
