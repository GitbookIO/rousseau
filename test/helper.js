var rousseau = require("../lib");

function testRousseau(text, opts, done, fn) {
    rousseau(text, opts || {}, function(err, results) {
        if (err) return done(err);
        try {
            fn(results);
            done();
        } catch(err) {
            done(err);
        }
    });
}

module.exports = {
    testRousseau: testRousseau
};
