describe("Readibility", function() {
    var results = rousseau(
        // Hard to read
        "Rousseau highlights long, complex sentences and common errors;"
        + " if you see a warning highlight, shorten the sentence or split it."

        // Very hard to read
        + "If you see a error highlight, your sentence is so dense and complicated that your readers"
        + " will get lost trying to follow its meandering, splitting logic —"
        + " try editing this sentence to remove the error."
    );

    it("should detect", function() {
        results.should.have.length(2);

        results[0].type.should.be.exactly("readibility");
        results[0].level.should.be.exactly("warn");

        results[1].type.should.be.exactly("readibility");
        results[1].level.should.be.exactly("error");
    });
});
