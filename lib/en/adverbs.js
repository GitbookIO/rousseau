var tokenize = require("../tokenize");
var levels = require("../levels");
var adverbs = require("./data/adverbs");

var re = new RegExp('\\b(' + adverbs.join('|') + ')(y)\\b', 'gi');

module.exports = tokenize.flow(
    tokenize.re(re),
    tokenize.define({
        level: levels.WARNING,
        message: 'adverbs can weaken meaning'
    })
);
