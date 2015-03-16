
![Rousseau](./preview.jpg)

[![Build Status](https://travis-ci.org/GitbookIO/rousseau.png?branch=master)](https://travis-ci.org/GitbookIO/rousseau)
[![NPM version](https://badge.fury.io/js/rousseau.svg)](http://badge.fury.io/js/rousseau)

Rousseau is a proofreader written in Javascript, it can be used in Node.JS, in the command line and in the browser.

### Installation

```
$ npm install rousseau
```

### API

```js
var rousseau = require("rousseau");

var results = rousseau('So the cat was stolen.');
```

`results` is an array of object like:

```js
{
    // Type of check that output this suggestion
    type: "so",

    // Level of importance
    // "suggestion", "warn", "error"
    level: "warn",

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

### Checks

You can disable any combination of the following by providing a key with value `false` as option `checks` to `rousseau`.

##### English

| ID    | Description     |
| ----- | --------------- |
| `passive` | Checks for passive voice |
| `lexical-illusion` | Checks for lexical illusions – cases where a word is repeated. |
| `so` | Checks for `so` at the beginning of the sentence. |
| `adverbs` | Checks for adverbs that can weaken meaning: really, very, extremely, etc. |
| `readibility` | Checks for readibility of sentences. |
| `simplicity` | Checks for simpler expressions |
| `weasel` | Checks for "weasel words." |


### Cache

Rousseau use an internal cache for certain operations (tokenization, spellchecking, ...); this cache can be configured using the option `cache`:

```js
var results = rousseau('So the cat was stolen.', {
    cache: 100 // A maximum of 100 elements will be stored in the memory cache
});
```

### Contributing

We'd love to accept your patches and contributions to improve Rousseau (supported languages, checks, ...). Learn more about how to contribute in [CONTRIBUTING.md](./CONTRIBUTING.md).
