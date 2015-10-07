// Sentences should be preceded by a space

var tokenize = require("../tokenize");
var levels = require("../levels");
var english = require("tokenize-english")(tokenize);

module.exports = tokenize.check(
    // Tokenize as sentences
    english.sentences(),

    // Output
    tokenize.define(function(sentence, current, prev) {
        if (!prev || sentence[0] == ' ') return null;

        return {
            message: "sentence should be preceded by a space"
        };
    })
);
module.exports.level = levels.WARNING;
