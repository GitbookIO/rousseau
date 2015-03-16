var _ = require("lodash");

var languages = require("./languages");
var levels = require("./levels");
var cache = require("./cache");
var spelling = require("./spelling");

function rousseau(text, options) {
    var checks;

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
        checks: {
            spelling: false
        }
    });

    // Build list of checks from language
    checks = _.chain([
            options.language,
            _.first(options.language.split("_"))
        ])
        .uniq()
        .reduce(function(_checks, lng) {
            return checks || languages[lng];
        }, null)
        .assign()
        .extend({ spelling: spelling })
        .omit(function(check, name) {
            // Check if only this one
            if (options.only.length > 0 && !_.contains(options.only, name)) return true;

            // Check if enabled
            if (options.checks[name] === false) return true

            // Check if level is supperior to the filtered one
            if (check.level && levels.order(check.level) < levels.order(options.level)) return true;

            return false;
        })
        .value();

    // Init cache
    cache.rename(options.language);
    cache.setLimit(options.cache);

    // Apply checks
    var results = _.chain(checks)
        // Apply checks
        .map(function(check, checkType) {
            return _.map(check(text, options.checks[checkType] || {}) || [], function(tok) {
                tok.type = tok.type || checkType;
                tok.level = tok.level || check.level || levels.SUGGESTION;

                // Filter tokens
                if (levels.order(tok.level) < levels.order(options.level)) return null;

                return tok;
            });
        })
        .flatten()
        .compact()

        // Sort suggestions by position and level
        .sort(function(t1, t2) {
            if (t1.index < t2.index) {
                return -1;
            } else if (t1.index > t2.index) {
                return 1;
            } else {
                return (levels.order(t1.level) < levels.order(t2.level)) ?-1 : 1;
            }
        })

        // Return suggestions
        .value();

    return results;
}


module.exports = rousseau;
module.exports.languages = _.keys(languages);
module.exports.levels = levels;