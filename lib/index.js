var _ = require("lodash");

var languages = require("./languages");
var levels = require("./levels");
var cache = require("./cache");
var spelling = require("./spelling");

function rousseau(text, options) {
    var language;

    options = _.defaults(options || {}, {
        // Language to use
        language: "en",

        // Cache limit
        cache: 10000,

        // Only checks to apply
        only: [],

        // Checks to disable/configure
        checks: {
            spelling: false
        }
    });

    // Get associated language
    language = languages[options.language];
    if (!language) throw "Language '"+options.language+"' not found";

    // Init cache
    cache.rename(options.language);
    cache.setLimit(options.cache);

    // Disable associated checks
    var checks = _.chain(language)
        .extend({ spelling: spelling })
        .omit(function(check, name) {
            if (options.only.length > 0 && !_.contains(options.only, name)) return true;
            return options.checks[name] === false;
        })
        .value();

    // Apply checks
    var results = _.chain(checks)
        // Apply checks
        .map(function(check, checkType) {
            return _.map(check(text, options.checks[checkType] || {}) || [], function(tok) {
                tok.type = tok.type || checkType;
                return tok;
            });
        })
        .flatten()

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