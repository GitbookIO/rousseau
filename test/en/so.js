describe("So", function() {
    var results = rousseau("So the cat was stole.");

    it("should detect", function() {
        results.should.have.length(1);
        results[0].type.should.be.exactly("so");
    });
});
