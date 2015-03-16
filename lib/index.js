var _ = require("lodash");

var languages = require("./languages");
var levels = require("./levels");
var cache = require("./cache");
var tokenize = require("./tokenize");

function rousseau(text, options, callback) {
    var checks, processCheck;

    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }


    options = _.defaults(options || {}, {
        // Language to use
        language: "en",

        // Minimum level
        level: levels.SUGGESTION,

        // Cache limit
        cache: 10000,

        // Only checks to apply
        only: [],

        // Checks to disable/configure
        checks: {}
    });

    // Build list of checks from language
    checks = _.chain([
            options.language,
            _.first(options.language.split("_"))
        ])
        .uniq()
        .reduce(function(_checks, lng) {
            return _checks || languages[lng];
        }, null)
        .omit(function(check, name) {
            // Check if only this one
            if (options.only.length > 0 && !_.contains(options.only, name)) return true;

            // Check if enabled
            if (options.checks[name] === false) return true

            // Check if level is supperior to the filtered one
            if (check.level && levels.order(check.level) < levels.order(options.level)) return true;

            return false;
        })
        .pairs()
        .value();

    // Extends with custom checks
    _.each(options.checks, function(check, checkName) {
        if (!_.isFunction(check)) return;
        checks.push([checkName, check]);
    });

    // Init cache
    cache.setLimit(options.cache);

    // Apply checks
    var results = [];

    processCheck = function() {
        var checkType;
        var check = checks.shift();

        if (!check) {
            // Sort suggestions by position and level
            results = results.sort(function(t1, t2) {
                if (t1.index < t2.index) {
                    return -1;
                } else if (t1.index > t2.index) {
                    return 1;
                } else {
                    return (levels.order(t1.level) < levels.order(t2.level)) ?-1 : 1;
                }
            });

            callback(undefined, results);
        } else {
            checkType = check[0];
            check = check[1];

            check(text, options.checks[checkType] || {}, function(err, _results) {
                if (err) return callback(err);

                _results = _.chain(_results)
                    .map(function(tok) {
                        tok.type = tok.type || checkType;
                        tok.level = tok.level || check.level || levels.SUGGESTION;

                        // Filter tokens
                        if (levels.order(tok.level) < levels.order(options.level)) return null;

                        return tok;
                    })
                    .compact()
                    .value();

                results = results.concat(_results);

                // Pass to next check
                processCheck();
            });
        }
    }

    processCheck();
}


module.exports = rousseau;
module.exports.languages = _.keys(languages);
module.exports.levels = levels;
module.exports.tokenize = tokenize;
module.exports.cache = cache;

