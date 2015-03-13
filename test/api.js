var should = require("should");
var rousseau = require("../lib");

describe("API", function() {
    it("should provides list of languages", function() {
        rousseau.should.have.property("languages");
        rousseau.languages.length.should.be.above(0);
    });
});

