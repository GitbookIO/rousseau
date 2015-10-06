var should = require('should');

var tokenize = require("../lib/tokenize");

describe('Tokenizer', function() {

    it('tokenize.characters()', function() {
        var tokens = tokenize.characters()('abc');

        tokens.should.have.lengthOf(3);
        tokens[0].value.should.equal('a');
        tokens[0].index.should.equal(0);
        tokens[1].value.should.equal('b');
        tokens[1].index.should.equal(1);
        tokens[2].value.should.equal('c');
        tokens[2].index.should.equal(2);
    });

    it('tokenize.words()', function() {
        var tokens = tokenize.characters()('a b c');

        tokens.should.have.lengthOf(3);
        tokens[0].value.should.equal('a');
        tokens[0].index.should.equal(0);
        tokens[1].value.should.equal('b');
        tokens[1].index.should.equal(2);
        tokens[2].value.should.equal('c');
        tokens[2].index.should.equal(4);
    });

    it('tokenize.splitAndMerge(fn)', function() {
        var tokens = tokenize.flow(
            tokenize.characters(),
            tokenize.splitAndMerge(function(tok) {
                if (tok == '.') return [tok, null];
                return tok;
            })
        )('ab.c');

        tokens.should.have.lengthOf(2);
        tokens[0].value.should.equal('ab.');
        tokens[0].index.should.equal(0);
        tokens[0].offset.should.equal(3);

        tokens[1].value.should.equal('c');
        tokens[1].index.should.equal(3);
        tokens[1].offset.should.equal(1);
    });
});

