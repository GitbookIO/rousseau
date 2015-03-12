var should = require("should");
var rousseau = require("../lib")

describe("So", function() {
    var results = rousseau("So the cat was stole.");

    it("should detect", function() {
        results.should.have.length(1);
        should(results[0].type).be.exactly("so");
    });
});
