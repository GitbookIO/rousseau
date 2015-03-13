/*
Sentence Boundary Detection (SBD)
Split text into sentences with a vanilla rule based approach (i.e working ~95% of the time).

Split a text based on period, question and exclamation marks.
Skips (most) abbreviations (Mr., Mrs., PhD.)
Skips numbers/currency
Skips urls, websites, email addresses, phone nr.
Counts ellipsis and ?! as single punctuation
*/

var _ = require("lodash");
var tokenize = require("../tokenize");
var utils = require("../utils");


var newline_placeholder = " @~@ ";
var newline_placeholder_t = newline_placeholder.trim();

var abbreviations = [
    "ie",
    "eg",
    "ext", // + number?
    "Fig",
    "fig",
    "Figs",
    "figs",
    "et al",
    "Co",
    "Corp",
    "Ave",
    "Inc",
    "Ex",
    "Viz",
    "vs",
    "Vs",
    "repr",
    "Rep",
    "Dem",
    "trans",
    "Vol",
    "pp",
    "rev",
    "est",
    "Ref",
    "Refs",
    "Eq",
    "Eqs",
    "Ch",
    "Sec",
    "Secs",
    "mi",
    "Dept",

    "Univ",
    "Nos",
    "No",
    "Mol",
    "Cell",

    "Miss", "Mrs", "Mr", "Ms",
    "Prof", "Dr",
    "Sgt", "Col", "Gen", "Rep", "Sen",'Gov', "Lt", "Maj", "Capt","St",

    "Sr", "Jr", "jr", "Rev",
    "PhD", "MD", "BA", "MA", "MM",
    "BSc", "MSc",

    "Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Sept","Oct","Nov","Dec",
    "Sun","Mon","Tu","Tue","Tues","Wed","Th","Thu","Thur","Thurs","Fri","Sat"
];

function isCapitalized(str) {
    return /^[A-Z][a-z].*/.test(str) || isNumber(str);
}

// Start with opening quotes or capitalized letter
function isSentenceStarter(str) {
    return isCapitalized(str) || /``|"|'/.test(str.substring(0,2));
}

function isCommonAbbreviation(str) {
    return ~abbreviations.indexOf(str.replace(/\W+/g, ''));
}

// This is going towards too much rule based
function isTimeAbbreviation(word, next) {
    if (word === "a.m." || word === "p.m.") {
        var tmp = next.replace(/\W+/g, '').slice(-3).toLowerCase();

        if (tmp === "day") {
            return true;
        }
    }

    return false;
}

function isDottedAbbreviation(word) {
    var matches = word.replace(/[\(\)\[\]\{\}]/g, '').match(/(.\.)*/);
    return matches && matches[0].length > 0;
}

// TODO look for next words, if multiple capitalized -> not sentence ending
function isCustomAbbreviation(str) {
    if (str.length <= 3)
        return true;

    return isCapitalized(str);
}

// Uses current word count in sentence and next few words to check if it is
// more likely an abbreviation + name or new sentence.
function isNameAbbreviation(wordCount, words) {
    if (words.length > 0) {
        if (wordCount < 5 && words[0].length < 6 && isCapitalized(words[0])) {
            return true;
        }

        var capitalized = words.filter(function(str) {
            return /[A-Z]/.test(str.charAt(0));
        });

        return capitalized.length >= 3;
    }

    return false;
}

function isNumber(str, dotPos) {
    if (dotPos) {
        str = str.slice(dotPos-1, dotPos+2);
    }

    return !isNaN(str);
}

// Phone number matching
// http://stackoverflow.com/a/123666/951517
function isPhoneNr(str) {
    return str.match(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/);
}

// Match urls / emails
// http://stackoverflow.com/a/3809435/951517
function isURL(str) {
    return str.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
}

// Starting a new sentence if beginning with capital letter
// Exception: The word is enclosed in brackets
function isConcatenated(word) {
    var i = 0;

    if ((i = word.indexOf(".")) > -1 ||
        (i = word.indexOf("!")) > -1 ||
        (i = word.indexOf("?")) > -1)
    {
        var c = word.charAt(i + 1);

        // Check if the next word starts with a letter
        if (c.match(/[a-zA-Z].*/)) {
            return [word.slice(0, i), word.slice(i+1)];
        }
    }

    return false;
}

function isBoundaryChar(word) {
    return word === "." ||
           word === "!" ||
           word === "?";
}


var tokenizeSentences = _.partial(tokenize, function(text) {
    if (text.length === 0)
        return [];

    var newline_boundary = true;

    if (newline_boundary) {
        text = text.replace(/\n+|[-#=_+*]{4,}/g, newline_placeholder);
    }

    var index = 0;
    var temp  = [];

    // Split the text into words
    var words = text.match(/\S+/g);

    var sentences = [];
    var current   = [];

    var wordCount = 0;

    for (var i=0, L=words.length; i < L; i++) {
        wordCount++;

        // Add the word to current sentence
        current.push(words[i]);

        // Sub-sentences (Bijzin?), reset counter
        if (~words[i].indexOf(',')) {
            wordCount = 0;
        }

        if (isBoundaryChar(words[i])      ||
            utils.endsWithChar(words[i], "?!") ||
            words[i] === newline_placeholder_t)
        {
            if (newline_boundary && words[i] === newline_placeholder_t) {
                current.pop();
            }

            sentences.push(current);

            wordCount = 0;
            current   = [];

            continue;
        }

        // A dot might indicate the end sentences
        // Exception: The next sentence starts with a word (non abbreviation)
        //            that has a capital letter.
        if (utils.endsWithChar(words[i], '.')) {

            // Check if there is a next word
            if (i+1 < L) {
                // This should be improved with machine learning

                // Single character abbr.
                if (words[i].length === 2 && isNaN(words[i].charAt(0))) {
                    continue;
                }

                // Common abbr. that often do not end sentences
                if (isCommonAbbreviation(words[i])) {
                    continue;
                }

                // Next word starts with capital word, but current sentence is
                // quite short
                if (isSentenceStarter(words[i+1])) {
                    if (isTimeAbbreviation(words[i], words[i+1])) {
                        continue;
                    }

                    // Dealing with names at the start of sentences
                    if (isNameAbbreviation(wordCount, words.slice(i, 6))) {
                        continue;
                    }

                    if (isNumber(words[i+1]) && isCustomAbbreviation(words[i])) {
                        continue;
                    }
                }
                else {
                    // Skip ellipsis
                    if (utils.endsWith(words[i], "..")) {
                        continue;
                    }

                    //// Skip abbreviations
                    // Short words + dot or a dot after each letter
                    if (isDottedAbbreviation(words[i]) || isCustomAbbreviation(words[i])) {
                        continue;
                    }
                }
            }

            sentences.push(current);
            current   = [];
            wordCount = 0;

            continue;
        }

        // Check if the word has a dot in it
        if ((index = words[i].indexOf(".")) > -1) {
            if (isNumber(words[i], index)) {
                continue;
            }

            // Custom dotted abbreviations (like K.L.M or I.C.T)
            if (isDottedAbbreviation(words[i])) {
                continue;
            }

            // Skip urls / emails and the like
            if (isURL(words[i]) || isPhoneNr(words[i])) {
                continue;
            }
        }

        if (temp = isConcatenated(words[i])) {
            current.pop();
            current.push(temp[0]);
            sentences.push(current);

            current = [];
            wordCount = 0;
            current.push(temp[1]);
        }
    }

    if (current.length)
        sentences.push(current);

    /** After processing */
    var result   = [];
    var sentence = "";

    // Clear "empty" sentences
    sentences = sentences.filter(function(s) {
        return s.length > 0;
    });

    for (i=0; i < sentences.length; i++) {
        sentence = sentences[i].join(" ");

        // Single words, could be "enumeration lists"
        if (sentences[i].length === 1 && sentences[i][0].length < 4 &&
            sentences[i][0].indexOf('.') > -1)
        {
            // Check if there is a next sentence
            // It should not be another list item
            if (sentences[i+1] && sentences[i+1][0].indexOf('.') < 0) {
                sentence += " " + sentences[i+1].join(" ");
                i++;
            }
        }

        result.push(sentence);
    }

    return result;
});


module.exports = {
    sentences: tokenizeSentences
};
