var should = require("should");
var rousseau = require("../lib")

describe("Simplicity", function() {
    var results = rousseau("Acquire more stars");

    it("should detect", function() {
        results.should.have.length(1);
        should(results[0].type).be.exactly("simplicity");
    });

    it("should give a suggestion", function() {
        should(results[0].replacements.length).be.exactly(1);
    });
});
