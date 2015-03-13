var _ = require("lodash");
var tokenize = require("../tokenize");
var levels = require("../levels");
var passive = require("./data/passive");

var re = new RegExp('\\b(am|are|were|being|is|been|was|be)\\b\\s*([\\w]+ed|' + _.pluck(passive.list, "value").join('|') + ')\\b', 'gi');

module.exports = tokenize.flow(
    tokenize.re(re),
    tokenize.define(function (text, token, prev) {
        var replacement = _.find(passive.list, { value: token.match[2] });
        if (replacement) replacement = [{ value: replacement }];

        return {
            level: levels.WARNING,
            message: '"<%- value %>" may be passive voice',
            replacements: replacement
        };
    })
);
