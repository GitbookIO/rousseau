var _ = require("lodash");
var should = require("should");

var rousseau = require("../lib");
var english = require("../lib/en/english");


describe("English", function() {
    describe("Sentences", function() {
        it("should split correctly", function() {
            var sentences = english.sentences()("First. Second.");
            _.pluck(sentences, "value").should.be.eql(["First.", "Second."]);
        });
    });

    describe("Adverbs", function() {
        var results = rousseau("Allegedly, this sentence is terrible.");

        it("should detect", function() {
            results.should.have.length(1);
            results[0].type.should.be.exactly("adverbs");
        });
    });

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

    describe("Passive", function() {
        describe("-ed", function() {
            var results = rousseau("He was judged.");

            it("should detect", function() {
                results.should.have.length(1);
                results[0].type.should.be.exactly("passive");
            });
        });

        describe("predefined", function() {
            var results = rousseau("He was bitten.");

            it("should detect", function() {
                results.should.have.length(1);
                results[0].type.should.be.exactly("passive");
            });

            it("should suggest replacements", function() {
                results[0].replacements.length.should.be.exactly(1);
            });
        });
    });

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

    describe("So", function() {
        var results = rousseau("So the cat was stole.");

        it("should detect", function() {
            results.should.have.length(1);
            results[0].type.should.be.exactly("so");
        });
    });

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
});

