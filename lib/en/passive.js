var _ = require("lodash");
var tokenize = require("../tokenize");
var passive = require("./data/passive");

var re = new RegExp('\\b(am|are|were|being|is|been|was|be)\\b\\s*([\\w]+ed|' + _.pluck(passive.list, "orig").join('|') + ')\\b', 'gi');

module.exports = tokenize.flow(
    tokenize.re(re, {
        match: 2
    }),
    tokenize.define(function (text, token, prev) {
        var replacement = _.find(passive.list, { orig: text });
        if (replacement) replacement = [{ value: replacement }];

        return {
            level: "warn",
            message: '"__value__" may be passive voice',
            replacements: replacement
        };
    })
);
