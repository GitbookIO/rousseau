// Sentences should start with a uppercase letter

var tokenize = require("../tokenize");
var levels = require("../levels");
var english = require("tokenize-english")(tokenize);

var TRIM_RE = /^\s+|\s+$/gm;

module.exports = tokenize.check(
    // Tokenize as sentences
    english.sentences(),

    // Output
    tokenize.define(function(sentence, current, prev) {
        // Calcul position of first letter
        var firstLetterIndex = 0;
        var spaces = sentence.match(TRIM_RE);
        if (spaces) firstLetterIndex = spaces.length;

        // Is the letter uppercase?
        if (sentence.length <= firstLetterIndex || sentence[firstLetterIndex] == sentence[firstLetterIndex].toUpperCase()) return null;

        return {
            index: firstLetterIndex,
            offset: 1,
            message: "sentence should start with an uppercase letter"
        };
    })
);
module.exports.level = levels.ERROR;
