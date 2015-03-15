var fs = require('fs');
var color = require('bash-color');
var path = require('path');
var Benchmark = require('benchmark');
var benchmarks = require('beautify-benchmark');

var rousseau = require("./lib");

var TEXT = fs.readFileSync(path.resolve(__dirname, "./LICENSE"), { encoding: "utf-8" });

console.log("Start benchmarking with a text of "+TEXT.length+" characters");
console.log("");

var suite = new Benchmark.Suite;

// Add tests
suite.add('With cache', function() {
    rousseau(TEXT, {
        cache: 100000
    });
})
.add('Without cache', function() {
    rousseau(TEXT, {
        cache: 0
    });
})
.on('cycle', function(event) {
    benchmarks.add(event.target);
})
.on('complete', function() {
    benchmarks.log();
})
.run({
    'async': false
});
