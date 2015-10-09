// There should be no space between a sentence and its ending punctuation
// http://english.stackexchange.com/questions/4645/is-it-ever-correct-to-have-a-space-before-a-question-or-exclamation-mark

var tokenize = require("../tokenize");
var levels = require("../levels");
var english = require("tokenize-english")(tokenize);

module.exports = tokenize.check(
    // Tokenize as sentences
    english.sentences(),

    // Output
    tokenize.define(function(sentence, current, prev) {
        if (sentence[sentence.length - 1] != '.' || sentence[sentence.length - 2] != ' ') return null;

        return {
            index: sentence.length - 2,
            offset: 1,
            message: "there should be no space between a sentence and its ending punctuation"
        };
    })
);
module.exports.level = levels.ERROR;
