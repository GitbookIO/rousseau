var _ = require("lodash");
var crc = require("crc");
var cache = require("./cache").namespace("tokenizer");

/*
Token is an object represented by:

{
    "value": "text content",

    // Position of the index
    "index": 0,

    // Length of the token
    "offset": "text content".length
}
*/



// Return a string id for a tokens list
function tokensId(tokens, prepend) {
    if (!prepend) return null;
    return crc.crc32(_.reduce(tokens, function(prev, token) {
        return prev+":"+token.index+"-"+token.offset+"-"+token.value;
    }, prepend || "")).toString(16);
}

// Tokenize a text using a transformative function
function tokenize(fn, opts) {
    opts = _.defaults(opts || {}, {
        cache: _.constant(null)
    });

    return function(text) {
        var prev = undefined;
        var cacheId, cacheValue;

        // if string, convert to one large token
        if (_.isString(text)) {
            text = [
                {
                    value: text,
                    index: 0,
                    offset: text.length
                }
            ];
        }

        cacheId = tokensId(text, opts.cache());
        if (cacheId) {
            cacheValue = cache.get(cacheId);
            if (cacheValue) {
                return cacheValue;
            }
        }

        return _.chain(text)
            .map(function(token, i) {
                var next = text[i + 1];
                var tokens = fn(
                    // Current text value
                    token.value,

                    // Current complete token
                    _.clone(token),

                    // Previous token
                    prev? _.clone(prev) : null,

                    // Next token
                    next? _.clone(next) : null
                ) || [];

                // Normalize tokens and return
                tokens = normalizeTokens(token, tokens);

                // Update reference to prev
                prev = token;

                return tokens;
            })
            .compact()
            .flatten()
            .tap(function(_tokens) {
                if (!cacheId) return;
                cache.set(cacheId, _tokens);
            })
            .value();
    };
}

// Debug a tokenizing flow
function tokenizeDebug() {
    return tokenize(function(tok) {
        console.log('token', tok);
        return tok;
    });
}

// Normalize and resolve tokens
function normalizeTokens(relative, tokens) {
    var _index = 0;

    // Force as array
    if (!_.isArray(tokens)) tokens = [tokens];

    return _.map(tokens, function(subtoken) {
        if (_.isString(subtoken)) {
            subtoken = {
                value: subtoken,
                index: _index,
                offset: subtoken.length
            };
        }

        if (_.isObject(subtoken)) {
            // Transform as an absolute token
            subtoken.index = relative.index + (subtoken.index || 0);
            subtoken.offset = subtoken.offset || subtoken.value.length;

            _index = _index + subtoken.index + subtoken.offset;
        }

        return subtoken;
    });
}

// Tokenize a text using a RegExp
function tokenizeRe(re, opts) {
    opts = _.defaults(opts || {}, {
        split: false
    });

    return tokenize(function(text) {
        var tokens = [];
        var match;
        var start = 0;

        while (match = re.exec(text)) {
            var index = match.index;
            var value = match[0] || "";
            var offset = value.length;

            tokens.push({
                value: value,
                index: index + start,
                offset: offset,
                match: match
            });

            text = text.slice(index + offset);
            start = start + index + offset;
        }

        if (opts.split && text) {
            tokens.push({
                value: text,
                index: start,
                offset: text.length
            });
        }

        return tokens;
    }, {
        cache: function() {
            return re.toString();
        }
    });
}

// Split and merge tokens
// Used to split as sentences even if sentences is separated in multiple tokens (ex: markup)
// if fn results contain a 'null', it will split in two tokens
function tokenizeSplitMerge(fn) {
    return function(tokens) {
        var result = [];
        var accu = [];

        function pushAccu() {
            if (accu.length == 0) return;

            result.push(_.pluck(accu, 'value').join(''));
            accu = [];
        }

        tokenize(function(token) {
            var toks = fn.apply(null, arguments);

            // Normalize tokens
            toks = normalizeTokens(token, toks);

            // Accumulate tokens and push to final results
            _.each(toks, function(tok) {
                if (!tok) {
                    pushAccu();
                } else {
                    accu.push(tok);
                }
            });
        })(tokens);

        // Push tokens left in accumulator
        pushAccu();

        return result;
    };
}

// Merge all tokens into one
var tokenizeMerge = _.partial(tokenizeSplitMerge, _.identity);

// Convert a list of tokens to some suggestions
function tokenizeDefine(infos) {
    return tokenize(function(text, tok) {
        var _infos = _.isFunction(infos)? infos.apply(null, arguments) : _.clone(infos);
        if (!_infos) return null;

        // Defaults for the sugegstion
        _infos = _.defaults(_infos, {
            message: "",
            replacements: []
        });

        _infos = _.extend(tok, _infos, {
            index: 0
        });

        _infos.message = _.template(_infos.message)(_infos);

        return _infos;
    });
}

// Filter when tokenising
function tokenizeFilter(fn) {
    return tokenize(function(text, tok) {
        if (fn.apply(null, arguments)) {
            return tok.value;
        }
        return undefined;
    });
}

// Filter by testing a regex
function tokenizeTest(re) {
    return tokenizeFilter(function(text, tok) {
        return re.test(text);
    }, {
        cache: re.toString()
    });
}

// Group and process a token as a group
function tokenizeFlow() {
    var fn = _.flow.apply(_, arguments);
    return tokenize(fn);
}

// Apply a test on tokens
function tokenizeCheck() {
    var fn = tokenizeFlow.apply(null, arguments);

    return function(text, opts, callback) {
        try {
            callback(null, fn(text, opts));
        } catch(err) {
            callback(err);
        }
    };
}

module.exports = tokenize;
module.exports.debug = tokenizeDebug;
module.exports.check = tokenizeCheck;
module.exports.flow = tokenizeFlow;
module.exports.define = tokenizeDefine;
module.exports.filter = tokenizeFilter;
module.exports.splitAndMerge = tokenizeSplitMerge;
module.exports.merge = tokenizeMerge;
module.exports.re = tokenizeRe;
module.exports.test = tokenizeTest;

var WORD_BOUNDARY_CHARS = '\t\r\n\u00A0 !\"#$%&()*+,\-.\\/:;<=>?@\[\\\]^_`{|}~';
var WORD_BOUNDARY_REGEX = new RegExp('[' + WORD_BOUNDARY_CHARS + ']');
var SPLIT_REGEX = new RegExp(
    '([^' + WORD_BOUNDARY_CHARS + ']+)');

module.exports.sections = _.partial(tokenizeRe, /([^\n\.,;!?]+)/i, { split: true });
module.exports.words = _.partial(tokenizeRe, SPLIT_REGEX);
module.exports.characters = _.partial(tokenizeRe, /[^\s]/);
