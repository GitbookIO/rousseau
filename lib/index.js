var _ = require("lodash");

var languages = require("./languages");

function rousseau(text, options) {
    var language;

    options = _.defaults(options || {}, {
        // Language to use
        language: "en",

        // Only checks to apply
        only: [],

        // Checks to disable/configure
        checks: {}
    });

    // Get associated language
    language = languages[options.language];
    if (!language) throw "Language '"+options.language+"' not found";

    // Disable associated checks
    var checks = _.omit(language, function(check, name) {
        if (options.only.length > 0 && !_.contains(options.only, name)) return true;
        return options.checks[name] === false;
    });

    // Apply checks
    var results = _.chain(checks)
        .map(function(check, checkType) {
            return _.map(check(text) || [], function(tok) {
                tok.type = tok.type || checkType;
                return tok;
            });
        })
        .flatten()
        .value();

    return results;
}


module.exports = rousseau;
module.exports.languages = _.keys(languages);
