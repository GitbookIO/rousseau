describe("Weasel", function() {
    describe("List", function() {
        var results = rousseau("Remarkably few developers write well.", { only: ["weasel"] });

        it("should detect", function() {
            results.should.have.length(2);
            results[0].type.should.be.exactly("weasel");
            results[0].index.should.be.exactly(0);
            results[0].offset.should.be.exactly(10);

            results[1].type.should.be.exactly("weasel");
            results[1].index.should.be.exactly(11);
            results[1].offset.should.be.exactly(3);
        });
    });

    describe("Exceptions", function() {
        it("should not detect 'too many'", function() {
            var results = rousseau("I have too many things.", { only: ["weasel"] });
            results.should.have.length(0);
        });

        it("should not detect 'too few'", function() {
            var results = rousseau("I have too few things.", { only: ["weasel"] });
            results.should.have.length(0);
        });
    });
});
