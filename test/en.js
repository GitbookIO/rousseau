var _ = require("lodash");
var should = require("should");

var rousseau = require("../lib");
var testRousseau = require('./helper').testRousseau;

describe("English", function() {
    describe("Adverbs", function() {
        it("should detect", function(done) {
            testRousseau("Allegedly, this sentence is terrible.", {
                only: ["adverbs"]
            }, done, function(results) {
                results.should.have.length(1);
                results[0].type.should.be.exactly("adverbs");
            });
        });
    });

    describe("Lexical Illusions", function() {
        it("should detect", function(done) {
            testRousseau("the the", {
                only: ["lexical-illusion"]
            }, done, function(results) {
                results.should.have.length(1);
                results[0].type.should.be.exactly("lexical-illusion");
                results[0].index.should.be.exactly(4);
            });
        });

        it("should split correctly sentences", function(done) {
            testRousseau("offer to sell, sell", {
                only: ["lexical-illusion"]
            }, done, function(results) {
                results.should.have.length(0);
            });
        });
    });

    describe("Passive", function() {
        describe("-ed", function(done) {
            it("should detect", function(done) {
                testRousseau("He was judged.", {
                    only: ["passive"]
                }, done, function(results) {
                    results.should.have.length(1);
                    results[0].type.should.be.exactly("passive");
                    results[0].index.should.be.exactly(3);
                    results[0].offset.should.be.exactly(10);
                });
            });
        });

        describe("predefined", function() {
            it("should detect and suggest replacements", function(done) {
                testRousseau("He was bitten.", {
                    only: ["passive"]
                }, done, function(results) {
                    results.should.have.length(1);
                    results[0].type.should.be.exactly("passive");
                    results[0].replacements.length.should.be.exactly(1);
                });
            });
        });
    });

    describe("Readibility", function() {
        var TEXT =
            // Hard to read
            "Rousseau highlights long, complex sentences and common errors;"
            + " if you see a warning highlight, shorten the sentence or split it."

            // Very hard to read
            + "If you see an error highlight, your sentence is so dense and complicated that your readers"
            + " will get lost trying to follow its meandering, splitting logic —"
            + " try editing this sentence to remove the error.";

        it("should detect", function(done) {
            testRousseau(TEXT, {
                only: ["readibility"]
            }, done, function(results) {
                results.should.have.length(2);

                results[0].type.should.be.exactly("readibility");
                results[0].level.should.be.exactly("suggestion");

                results[1].type.should.be.exactly("readibility");
                results[1].level.should.be.exactly("warning");
            });
        });

        it("should detect for splitted sentences", function(done) {
            var tokens = [
                {
                    value: "When an x86-based computer is turned on, it begins a complex path to get to the stage where control is transferred to our kernel's \"main\" routine (",
                    index: 62,
                    offset: 147
                },
                {
                    value: "). For this course, we are only going to consider the BIOS boot method and not it's successor (UEFI).",
                    index: 218,
                    offset: 101
                }
            ];

            testRousseau(tokens, {
                only: ["readibility"]
            }, done, function(results) {
                results[0].type.should.be.exactly("readibility");
                results[0].index.should.equal(62);
                results[0].offset.should.equal(158);
            });
        })
    });

    describe("Sentences", function() {
        describe('Start', function() {
            it("should detect sentences not starting with a space", function(done) {
                testRousseau("Hello Barney.The bird in the word./nThis is after a new line.", {
                    only: ["sentence:start"]
                }, done, function(results) {
                    results.should.have.length(1);
                    results[0].index.should.be.exactly(13);
                    results[0].offset.should.be.exactly(1);
                    results[0].type.should.be.exactly("sentence:start");
                });
            });
        });

        describe('End', function() {
            it("should detect sentences not ending with a space before punctuation", function(done) {
                testRousseau("Hello Barney. The bird in the word .", {
                    only: ["sentence:end"]
                }, done, function(results) {
                    results.should.have.length(1);
                    results[0].index.should.be.exactly(34);
                    results[0].offset.should.be.exactly(1);
                    results[0].type.should.be.exactly("sentence:end");
                });
            });

            it("should not signal this error if punctation is not a dot", function(done) {
                testRousseau("The bird in the word !", {
                    only: ["sentence:end"]
                }, done, function(results) {
                    results.should.have.length(0);
                });
            });
        });

        describe('Uppercase', function() {
            it("should detect sentences not starting with a uppercase", function(done) {
                testRousseau("hello Barney. The bird in the word !", {
                    only: ["sentence:uppercase"]
                }, done, function(results) {
                    results.should.have.length(1);
                    results[0].index.should.be.exactly(0);
                    results[0].offset.should.be.exactly(5);
                    results[0].type.should.be.exactly("sentence:uppercase");
                    results[0].replacements.length.should.be.exactly(1);
                    results[0].replacements[0].value.should.be.exactly('Hello');
                });
            });

            it("should detect sentences not starting with a uppercase (startign with spaces)", function(done) {
                testRousseau("Hello Barney! the bird in the word !", {
                    only: ["sentence:uppercase"]
                }, done, function(results) {
                    results.should.have.length(1);
                    results[0].index.should.be.exactly(14);
                    results[0].offset.should.be.exactly(3);
                    results[0].type.should.be.exactly("sentence:uppercase");
                    results[0].replacements.length.should.be.exactly(1);
                    results[0].replacements[0].value.should.be.exactly('The');
                });
            });
        });
    });

    describe("Simplicity", function() {
        it("should detect and suggest replacement", function(done) {
            testRousseau("Acquire more stars", {
                only: ["simplicity"]
            }, done, function(results) {
                results.should.have.length(1);
                results[0].type.should.be.exactly("simplicity");
                results[0].replacements.length.should.be.exactly(1);
            });
        });
    });

    describe("So", function() {
        it("should detect", function(done) {
            testRousseau("So the cat was stole.", {
                only: ["so"]
            }, done, function(results) {
                results.should.have.length(1);
                results[0].type.should.be.exactly("so");
            });
        });
    });

    describe("Weasel", function() {
        describe("List", function() {
            it("should detect", function(done) {
                testRousseau("Remarkably few developers write well.", {
                    only: ["weasel"]
                }, done, function(results) {
                    results.should.have.length(2);
                    results[0].type.should.be.exactly("weasel");
                    results[0].index.should.be.exactly(0);
                    results[0].offset.should.be.exactly(10);

                    results[1].type.should.be.exactly("weasel");
                    results[1].index.should.be.exactly(11);
                    results[1].offset.should.be.exactly(3);
                });
            });
        });

        describe("Exceptions", function() {
            it("should not detect 'too many'", function(done) {
                testRousseau("I have too many things.", {
                    only: ["weasel"]
                }, done, function(results) {
                    results.should.have.length(0);
                });
            });

            it("should not detect 'too few'", function(done) {
                testRousseau("I have too few things.", {
                    only: ["weasel"]
                }, done, function(results) {
                    results.should.have.length(0);
                });
            });
        });
    });
});

