var _ = require("lodash");
var tokenize = require("../tokenize");
var levels = require("../levels");
var simpler = require("./data/simpler");

var re = new RegExp('\\b(' + _.pluck(simpler, "value").join('|') + ')\\b', 'gi');

module.exports = tokenize.check(
    tokenize.re(re),
    tokenize.define(function (text, token, prev) {
        var replacement = _.find(simpler, { value: text.toLowerCase() });
        if (replacement && replacement.replace) replacement = [{ value: replacement.replace }];

        return {
            message: '"<%= value %>" has a simpler alternative',
            replacements: replacement
        };
    })
);
module.exports.level = levels.SUGGESTION;
