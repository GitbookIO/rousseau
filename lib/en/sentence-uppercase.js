// Sentences should start with a uppercase letter

var _ = require("lodash");
var tokenize = require("../tokenize");
var levels = require("../levels");
var english = require("tokenize-english")(tokenize);

var TRIM_RE = /^\s+/;

module.exports = tokenize.check(
    // Tokenize as sentences
    english.sentences(),

    // Output
    tokenize.define(function(sentence, current, prev) {
        var  words = tokenize.words()(sentence);

        // Is the letter uppercase?
        if (words.length == 0 || words[0].value[0] == words[0].value[0].toUpperCase()) return null;

        return {
            index: words[0].index,
            offset: words[0].offset,
            message: "sentence should start with an uppercase letter",
            replacements: [
                {
                    value: _.capitalize(words[0].value)
                }
            ]
        };
    })
);
module.exports.level = levels.ERROR;
