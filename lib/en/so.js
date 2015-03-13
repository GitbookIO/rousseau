// http://www.nytimes.com/2010/05/22/us/22iht-currents.html?_r=0
// http://comminfo.rutgers.edu/images/comprofiler/plug_profilegallery/84/pg_2103855866.pdf

var tokenize = require("../tokenize");
var english = require("./english");

module.exports = tokenize.flow(
    // Tokenize as sentences
    english.sentences(),

    // Match the ones starting with "so"
    tokenize.re(/^(\s)*so\b[\s\S]/i),

    // Output
    tokenize.define({
        level: "warn",
        message: "omit 'So' from the beginning of sentences"
    })
);
