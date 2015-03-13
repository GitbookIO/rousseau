// http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/

// Example:
// Many readers are not aware that the
// the brain will automatically ignore
// a second instance of the word "the"
// when it starts a new line.

var tokenize = require("../tokenize");

module.exports = tokenize.flow(
    // Tokenize as sentences
    tokenize.words(),

    // For each sentences
    tokenize.filter(function(word, token, prev) {
        return (prev && token.value.toLowerCase() === prev.value.toLowerCase());
    }),

    // Output
    tokenize.define({
        level: "error",
        message: '"<%- value %>" is repeated'
    })
);
