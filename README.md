# Rousseau

[![Build Status](https://travis-ci.org/GitbookIO/rousseau.png?branch=master)](https://travis-ci.org/GitbookIO/rousseau)
[![NPM version](https://badge.fury.io/js/rousseau.svg)](http://badge.fury.io/js/rousseau)

Rousseau is a lightweight proofreader written in Javascript, it can be used in Node.JS and in the browser. It has been build to be integrated into the [GitBook Editor](https://www.gitbook.com).

### Installation

```
$ npm install rousseau
```

### API

```js
var rousseau = require("rousseau");

rousseau('So the cat was stolen.', function(err, results) {

});
```

`results` is an array of object like:

```js
{
    // Type of check that output this suggestion
    type: "so",

    // Level of importance
    // "warn", "error"
    'level': "warn",

    // Index in the text
    index: 10,

    // Size of the section in the text
    offset: 2,

    // Message to describe the suggestion
    message: "omit 'So' from the beginning of sentences",

    // Replacements suggestion
    replacements: [
        {
            value: ""
        }
    ]
}
```
