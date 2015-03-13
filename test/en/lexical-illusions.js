describe("Lexical Illusions", function() {
    var results = rousseau("the the");

    it("should detect", function() {
        results.should.have.length(1);
        results[0].type.should.be.exactly("lexical-illusion");
        results[0].index.should.be.exactly(4);
    });
});
