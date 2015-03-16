# How to contribute

The project is run on Github, in the typical free software way - we'd love to accept your patches and contributions to this project.

Prerequisites: familiarity with [GitHub PRs](https://help.github.com/articles/using-pull-requests) (pull requests) and issues.
Knowledge of Javascript.

This community seeks the following types of contributions:

- **ideas**: participate in an Issues thread or start your own to have your voice
heard.
- **new languages**: submit a PR to add your language
- **new checks** or improve existing ones
- **copy editing**: fix typos, clarify language, and generally improve the quality
of the content
- **documentation**: help keep the README easy to read and understadable with consistent formatting

## Add a new check

1. Describe your check in the `README.md`.
2. Create a file named with the `ID` for the new check, example: `end-with-right.js`.
3. Include it in the `<language>/index.js`.
4. Add some unit tests corresponding to yoru check.
5. Use the `tokenizer` to return suggestions, example to signal sentences ending with "Right?":

```js
var levels = require("../levels");
var tokenize = require("../tokenize");

module.exports = tokenize.check(
    // Tokenize as sentences
    tokenize.sentences(),

    // Match the ones ending with "right?"
    tokenize.re(/\bright\b\s\?$/i),

    // Output
    tokenize.define({
        level: levels.WARNING,
        message: "omit 'right?' at the end of sentences"
    })
);
```

## Add a new language

1. Create a folder named with the [ISO 639-1](http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code.
2. Add your language in the `lib/languages.js` file.
