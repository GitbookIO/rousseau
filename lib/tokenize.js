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
                var _index = 0;
                var tokens = fn(token.value, _.clone(token), _.clone(prev)) || [];

                // Force as array
                if (!_.isArray(tokens)) tokens = [tokens];

                // prev is now token
                prev = token;

                return _.map(tokens, function(subtoken) {
                    if (_.isString(subtoken)) {
                        subtoken = {
                            value: subtoken,
                            index: _index,
                            offset: subtoken.length
                        };
                    }

                    // Transform as an absolute token
                    subtoken.index = token.index + (subtoken.index || 0);
                    subtoken.offset = subtoken.offset || subtoken.value.length;

                    _index = _index + subtoken.index + subtoken.offset;

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

// Group and process a token as a group
function tokenizeFlow() {
    var fn = _.flow.apply(_, arguments);
    return tokenize(fn);
}

module.exports = tokenize;
module.exports.flow = tokenizeFlow;
module.exports.define = tokenizeDefine;
module.exports.filter = tokenizeFilter;
module.exports.re = tokenizeRe;

module.exports.sections = _.partial(tokenizeRe, /([^\n\.,;!?]+)/i, { split: true });
module.exports.words = _.partial(tokenizeRe, /\w+/);
module.exports.characters = _.partial(tokenizeRe, /[^\s]/);
