describe("Lexical Illusions", function() {


    it("should detect", function() {
        var results = rousseau("the the", { only: ["lexical-illusion"] });
        results.should.have.length(1);
        results[0].type.should.be.exactly("lexical-illusion");
        results[0].index.should.be.exactly(4);
    });

    it("should split correctly sentences", function() {
        var results = rousseau("offer to sell, sell", { only: ["lexical-illusion"] });
        results.should.have.length(0);
    });
});
