var tokenize = require("../tokenize");
var levels = require("../levels");
var adverbs = require("./data/adverbs");

var re = new RegExp('\\b(' + adverbs.join('|') + ')(y)\\b', 'gi');

module.exports = tokenize.check(
    tokenize.re(re),
    tokenize.define({
        message: 'adverbs can weaken meaning'
    })
);
module.exports.level = levels.WARNING;
