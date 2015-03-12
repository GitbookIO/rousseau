#! /usr/bin/env node

var _ = require('lodash');
var color = require('bash-color');
var Table = require('cli-table');

var fs = require('fs');
var path = require('path');

var rousseau = require('../lib');

// Colors for levels
var LEVELS = {
    error: color.red,
    warn: color.yellow
};


// By default read input stream
var input = process.argv[2];

if (!input) {
    console.log("Need at least one argument, ex: rousseau ./my.txt");
    process.exit(1);
} else {
    input = path.resolve(process.cwd(), input);
}

// Read and lint file
var content = fs.readFileSync(input, { encoding: "utf-8" });


var results = rousseau(content);
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
        levels[result.level] = (levels[result.level] || 0) + 1;

        table.push(["  ", result.index+":"+result.offset, color("["+result.level+"]"), result.message]);
    });

    console.log(table.toString());
    console.log("");
    console.log(color.cyan(results.length+" Problems ("+levels.error+" errors, "+levels.warn+" warnings)"));
} else {
    console.log(COLOR_GREEN+"All good!"+COLOR_END)
}
