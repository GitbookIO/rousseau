var should = require("should");
var rousseau = require("../lib")

describe("Adverbs", function() {
    var results = rousseau("Allegedly, this sentence is terrible.");

    it("should detect", function() {
        results.should.have.length(1);
        should(results[0].type).be.exactly("adverbs");
    });
});
