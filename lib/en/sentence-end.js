// There should be no space between a sentence and its ending punctuation
// http://english.stackexchange.com/questions/4645/is-it-ever-correct-to-have-a-space-before-a-question-or-exclamation-mark

var tokenize = require("../tokenize");
var levels = require("../levels");
var english = require("tokenize-english")(tokenize);

module.exports = tokenize.check(
    // Tokenize as sentences
    english.sentences(),

    tokenize.debug(),

    // Output
    tokenize.define(function(sentence, current, prev) {
        if (!prev || sentence[sentence.length - 1] != ' ') return null;

        return {
            message: "there should be no space between a sentence and its ending punctuation"
        };
    })
);
module.exports.level = levels.WARNING;
