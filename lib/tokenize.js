var _ = require('lodash');
var Tokenizer = require('tokenize-text');

var cache = require('./cache').namespace('tokenizer');

// Create tokenizer with cache config
var tokenize = new Tokenizer({
    cacheGet: cache.get,
    cacheSet: cache.set
});

// Convert a list of tokens to some suggestions
function tokenizeDefine(infos) {
    return tokenize.split(function(text, tok) {
        var _infos = _.isFunction(infos)? infos.apply(null, arguments) : _.clone(infos);
        if (!_infos) return null;

        // Defaults for the sugegstion
        _infos = _.defaults(_infos, {
            index: 0,
            message: "",
            replacements: []
        });

        _infos = _.extend(tok, _infos);

        _infos.message = _.template(_infos.message)(_infos);

        return _infos;
    });
}

// Apply a test on tokens
function tokenizeCheck() {
    var fn = tokenize.serie.apply(tokenize, arguments);

    return function(text, opts, callback) {
        try {
            callback(null, fn(text, opts));
        } catch(err) {
            callback(err);
        }
    };
}


module.exports = tokenize;
module.exports.check = tokenizeCheck;
module.exports.define = tokenizeDefine;
