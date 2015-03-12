var should = require("should");
var rousseau = require("../lib")

describe("Passive", function() {
    describe("-ed", function() {
        var results = rousseau("He was judged.");

        it("should detect", function() {
            results.should.have.length(1);
            should(results[0].type).be.exactly("passive");
        });
    });

    describe("predefined", function() {
        var results = rousseau("He was bitten.");

        it("should detect", function() {
            results.should.have.length(1);
            should(results[0].type).be.exactly("passive");
        });

        it("should suggest replacements", function() {
            results[0].replacements.length.should.be.exactly(1);
        });
    });
});
