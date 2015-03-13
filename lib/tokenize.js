var _ = require("lodash");

// Tokenize a text using a transformative function
function tokenize(fn) {
    return function(text) {
        var prev = undefined;

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

        return _.chain(text)
            .map(function(token) {
                var tokens = fn(token.value, _.clone(token), _.clone(prev)) || [];

                // Force as object
                if (_.isString(tokens)) tokens = {
                    value: tokens,
                    index: 0,
                    offset: tokens.length
                };

                // Force as array
                if (!_.isArray(tokens)) tokens = [tokens];

                // prev is now token
                prev = token;

                return _.map(tokens, function(subtoken) {
                    // Transform as an absolute token
                    subtoken.index = token.index + (subtoken.index || 0);
                    subtoken.offset = subtoken.offset || subtoken.value.length;
                    return subtoken;
                })
            })
            .compact()
            .flatten()
            .value();
    };
}

// Tokenize a text using a RegExp
function tokenizeRe(re, opts) {
    opts = _.defaults(opts || {}, {
        match: 0
    });

    return tokenize(function(text) {
        var tokens = [];
        var match;
        var start = 0;

        while (match = re.exec(text)) {
            var index = match.index;
            var value = match[opts.match] || "";
            var offset = value.length;

            tokens.push({
                value: value,
                index: index + start,
                offset: offset
            });


            text = text.slice(index + offset);
            start = start + index + offset;
        }
        return tokens;
    });
}

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

module.exports = tokenize;
module.exports.flow = _.flow;
module.exports.define = tokenizeDefine;
module.exports.filter = tokenizeFilter;
module.exports.re = tokenizeRe;
module.exports.sentences = _.partial(tokenizeRe, new RegExp('([^\n\\.!?]+)([\\.!?]+)', 'i'));
module.exports.words = _.partial(tokenizeRe, /\w+/);
module.exports.characters = _.partial(tokenizeRe, /[^\s]/);
