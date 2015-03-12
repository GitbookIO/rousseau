var _ = require("lodash");

var languages = require("./languages");

function rousseau(text, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }

    options = _.defaults(options || {}, {
        language: "en",
        checks: {}
    });

    if (!languages[options.language]) {
        return callback(new Error("Language '"+options.language+"' not found"));
    }

    callback(undefined, []);
}


module.exports = rousseau;
