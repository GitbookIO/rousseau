var _ = require("lodash");

var languages = require("./languages");

function rousseau(text, options, callback) {
    var language;

    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }

    options = _.defaults(options || {}, {
        // Language to use
        language: "en",

        // Checks to disable/configure
        checks: {}
    });

    // Get associated language
    language = languages[options.language];
    if (!language) {
        return callback(new Error("Language '"+options.language+"' not found"));
    }

    // Disable associated checks
    var checks = _.omit(language, function(check, name) {
        return options.checks[name];
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

    callback(undefined, results);
}


module.exports = rousseau;
