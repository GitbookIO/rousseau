var should = require("should");
var rousseau = require("../lib")

describe("Languages", function() {
    it("should fail for non-existant language", function(done) {
        rousseau("", { language: "invalid" }, function(err, results) {
            should.exist(err);
            done();
        });
    });
})