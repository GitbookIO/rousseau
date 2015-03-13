// Automated Readability Index
// http://en.wikipedia.org/wiki/Automated_Readability_Index

var tokenize = require("../tokenize");


module.exports = tokenize.flow(
    // Tokenize as sentences
    tokenize.sentences(),

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
                level = "warn";
            } else if (score > 16) {
                level = "error";
            }
        }

        if (!level) return null;
        return {
            level: level,
            message: "this sentence is hard to read"
        }
    })
);
