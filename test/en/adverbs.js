describe("Adverbs", function() {
    var results = rousseau("Allegedly, this sentence is terrible.");

    it("should detect", function() {
        results.should.have.length(1);
        results[0].type.should.be.exactly("adverbs");
    });
});
