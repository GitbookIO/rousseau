var should = require('should');
var html = require('../lib/utils/html');

var testRousseau = require('./helper').testRousseau;
var english = require("../lib/en/english");

describe('Markup Proofreading', function() {
    it('should correctly tokenize html', function() {
        var tokens = html.tokenize('<b>hello</b> world');
        tokens.length.should.equal(2);

        tokens[0].value.should.equal('hello');
        tokens[0].index.should.equal(3);
        tokens[0].offset.should.equal(5);

        tokens[1].value.should.equal(' world');
        tokens[1].index.should.equal(12);
        tokens[1].offset.should.equal(6);
    });

    it.only('should correctly extract sentences', function() {
        var tokens = html.tokenize('<p>First <b>sentences</b>. Second.</p>');
        var sentences = english.sentences()(tokens);
        console.log(sentences);
        //sentences.should.have.lengthOf(2);
    });
});

