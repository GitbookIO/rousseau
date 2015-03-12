var should = require("should");
var rousseau = require("../lib")

describe("So", function() {
    it("should detect lexical illusions", function(done) {
        rousseau("the the", function(err, results) {
            should.not.exist(err);
            results.should.have.length(1);
            results[0].type.should.be.exactly("lexical-illusion");
            results[0].index.should.be.exactly(0);

            done();
        });
    });
})