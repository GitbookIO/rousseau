#! /usr/bin/env node

var _ = require('lodash');
var color = require('bash-color');
var Table = require('cli-table');
var findLineColumn = require('find-line-column');

var fs = require('fs');
var path = require('path');

var rousseau = require('../lib');
var tokenizeHTML = require('tokenize-htmltext');

// Colors for levels
var LEVELS = {
    critical: color.red,
    error: color.red,
    warning: color.yellow,
    suggestion: color.cyan
};

// By default read input stream
var input = process.argv[2];

// Original file content
var fileContent = "";

// Parse input file
function parseFile(input) {
    fileContent = fs.readFileSync(input, { encoding: "utf-8" });
    var ext = path.extname(input);

    if (ext == '.html') return tokenizeHTML(fileContent);

    return fileContent;
}

if (!input) {
    console.log("Need at least one argument, ex: rousseau ./my.txt");
    process.exit(1);
} else {
    input = path.resolve(process.cwd(), input);
}

// Read and lint file
var content = parseFile(input);

rousseau(content, function(err, results) {
    if (err) {
        console.log(color.red("Error: "+(err.stack || err)));
        return process.exit(1);
    }

    var levels = {};
    var table = new Table({
        chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
         , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
         , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
         , 'right': '' , 'right-mid': '' , 'middle': ' ' },
        style: { 'padding-left': 0, 'padding-right': 0 }
    });

    if (results.length > 0) {
        console.log("Results for '"+color.wrap(input, "white", "underline")+"':");
        console.log("");

        _.each(results, function(result) {
            var color = LEVELS[result.level];
            var startPos = findLineColumn(fileContent, result.index);
            var endPos = findLineColumn(fileContent, result.index + result.offset);

            levels[result.level] = (levels[result.level] || 0) + 1;

            table.push([
                    "  ", startPos.line+":"+startPos.col,
                    endPos.line+":"+endPos.col,
                    color("["+result.level+"]"),
                    result.message
            ]);
        });

        console.log(table.toString());
        console.log("");
        console.log(color.cyan(results.length+" Problems ("+(levels.error || 0)+" errors, "+(levels.warning || 0)+" warnings)"));
    } else {
        console.log(color.green("All good!"))
    }
});
