describe("Simplicity", function() {
    var results = rousseau("Acquire more stars");

    it("should detect", function() {
        results.should.have.length(1);
        results[0].type.should.be.exactly("simplicity");
    });

    it("should give a suggestion", function() {
        results[0].replacements.length.should.be.exactly(1);
    });
});
