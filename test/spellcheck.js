var should = require("should");
var rousseau = require("../lib");

var DICT = require("./dictionaries/en.json");


describe("Spellchecking", function() {
    it("should signal mispellings", function() {
        var results = rousseau("hello helo", {
            only: ["spelling"],
            checks: {
                spelling: {
                    dictionary: DICT
                }
            }
        });

        results.length.should.be.equal(1);
        results[0].value.should.be.equal("helo");
        results[0].type.should.be.equal("spelling");
    });
});

