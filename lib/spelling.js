// Simple spellchecker

var _ = require("lodash")
var Spellchecker = require("hunspell-spellchecker");

var tokenize = require("./tokenize");
var levels = require("./levels");
var cache = require("./cache").namespace("spelling");


module.exports = function(text, opts) {
    opts = _.defaults(opts || {}, {
        dictionary: null
    });

    // No dictionnary
    if (!opts.dictionary) return [];

    var sp = new Spellchecker();
    sp.use(opts.dictionary);

    return tokenize.flow(
        tokenize.re(/([^\s]+)/),
        tokenize.test(/\w/),

        tokenize.define(function(word) {
            word = word.replace(/[^a-zA-Z']/g, '');
            word = word.toLowerCase();
            if (/^[0-9]+$/.test(word)) return null;

            var isWrong = cache.get(word);
            if (isWrong === undefined) {
                isWrong = !sp.check(word);
                cache.set(word, isWrong);
            }

            if (!isWrong) return null;
            return {
                level: levels.CRITICAL,
                message: '"'+word+'" is misspelled'
            };
        })
    )(text);
};
