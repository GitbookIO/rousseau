var tokenize = require("../tokenize");
var adverbs = require("./data/adverbs");

var re = new RegExp('\\b(' + adverbs.join('|') + ')(y)\\b', 'gi');

module.exports = tokenize.flow(
    tokenize.re(re),
    tokenize.define({
        level: "warn",
        message: 'adverbs can weaken meaning'
    })
);
