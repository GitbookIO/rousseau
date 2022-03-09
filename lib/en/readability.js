// Automated Readability Index
// http://en.wikipedia.org/wiki/Automated_Readability_Index

var tokenize = require("../tokenize");
var levels = require("../levels");
var english = require("tokenize-english")(tokenize);

module.exports = tokenize.check(
    // Tokenize as sentences
    english.sentences(),

    // Output
    tokenize.define(function(sentence) {
        var level;
        var size = sentence.length;
        var words = tokenize.words()(sentence).length;
        var characters = tokenize.characters()(sentence).length;
        var sentences = 1;
        var score = 4.75*(characters/words) + 0.5 * (words/sentences) - 21.43;

        if (words > 14) {
            if (score > 12 && score <= 16) {
                level = levels.SUGGESTION;
            } else if (score > 16) {
                level = levels.WARNING;
            }
        }

        if (!level) return null;
        return {
            level: level,
            message: "sentence is "+(level == levels.WARNING? "very " : "")+"hard to read"
        };
    })
);
module.exports.level = levels.WARNING;
