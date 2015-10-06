var should = require("should");
var html = require("../lib/utils/html");

describe("HTML Tokenizer", function() {
    it("should correctly tokenize html", function() {
        var tokens = html.tokenize('<b>hello</b> world');
        tokens.length.should.equal(2);

        tokens[0].value.should.equal('hello');
        tokens[0].index.should.equal(3);
        tokens[0].offset.should.equal(5);

        tokens[1].value.should.equal(' world');
        tokens[1].index.should.equal(12);
        tokens[1].offset.should.equal(6);
    });
});

