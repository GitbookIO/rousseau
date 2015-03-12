var should = require("should");
var rousseau = require("../lib")

describe("Passive", function() {
    it("should fail for non-existant language", function(done) {
        rousseau("He was judged.", function(err, results) {
            should.not.exist(err);
            results.should.have.length(1);
            should(results[0].type).be.exactly("passive");
            done();
        });
    });
})