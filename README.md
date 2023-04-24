# Rune transliteration practice app

[![Node.js CI](https://github.com/tomaszgarbus/rune-ovningsbok/actions/workflows/node.js.yml/badge.svg)](https://github.com/tomaszgarbus/rune-ovningsbok/actions/workflows/node.js.yml)
[![Generate thumbnails](https://github.com/tomaszgarbus/rune-ovningsbok/actions/workflows/img-resize.yml/badge.svg)](https://github.com/tomaszgarbus/rune-ovningsbok/actions/workflows/img-resize.yml)

## [Try it out!](https://tomaszgarbus.github.io/rune-ovningsbok)

## About

Use real runic inscriptions, both historical and from popular culture, to practice transliteration.

Ideally, I would like to become a collaborative effort where more enthusiasts would contribute and review each others' content.

## Example
Consider this screenshot of a popular cartoon Adventure Time, where Finn is pouring a liquid from a mug with a mysterious Anglo-Saxon inscription.

Under each runic symbol, there is a field to transliterate it to a latin character. For convenience, you can navigate with arrows between symbols as well as automatically jump to the next one.

At the bottom, there is a mini virtual keyboard with regional characters. In the bottom right, you can also open a cheat sheet.

![img](screenshots/at_exercise.png)

## Adding rune rows (alphabets)

There are two types of alphabets in the app:

* **base** alphabets
* **inheriting** alphabets

Base alphabets are:
* older futhark
* younger futhark long-branch
* younger futhark short-twig
* anglo-saxon
* medieval

Inheriting alphabets are local variations on the base alphabets. For example, a single rune has been flipped horizontally on a particular runestone.

All alphabets are stored in `src/RuneRows.json` as a dictionary mapping ids to alphabets:
```
{
  "$ID_1": {...},
  "$ID_2": {...}
}
```

A base alphabet is defined as:
```
{
  "name": "...",
  "symbols": [
    {
      "rune": "X",
      "latin: "X"
    },
    {
      "rune": "X",
      "latin: ["X", "X", ...]
    },
    ...
  ]
}
```
where "X" stands for a single UTF-8 character.

An inheriting alphabet is defined as:
```
{
  "name": "...",
  "inherit_from": "$ID",
  "override_symbols": [
    {
      "rune": "X",
      "latin: "X"
    },
    {
      "rune": "X",
      "latin: ["X", "X", ...]
    },
    ...
  ]
}
```

## Adding exercises

Exercises live in `src/Exercises.json`. Follow the existing examples. Notes about the json schema:

* `id` is the unique identifier of the exercise,
* `img` must be a valid image name existing in `public/images`,
* `img_credit` should be a link or a description where you got the image from. The app automatically distinguished between links and natural language descriptions, so you don't need to worry about how it will be displayed,
* `title` is the displayed name of the exercise,
* `rowType` is a valid ID of a row type from `src/RuneRows.json`. Note that in most cases, you'll want to create a new alphabet, inheriting from one of the base alphabets,
* `description` is a short description of the historical or popular culture artifact concerned in the exercise. This is displayed before solving the exercise, so no spoilers please!
* `runes` is either a string or a list of one-char strings. Note that:
  1. each rune symbol must be present in the runic alphabet of choice (see `rowType`).
  1. if you want to use separators (such as ":"), make sure they are recognized as separators by the `IsSeparator` function in `src/Utils.js`.
* `explanationAfter` explains the meaning of the transliteration after solving the exercise,
* `sources` is a list of sources. You can mix valid links with non-link descriptions (such as book title).

After adding an exercise, start the server locally and verify that you can solve it in the app.

## Contributions

Contributions are very much welcome!

Here's how you can help grow the app:

### As a developer/UI&UX designer:
* Directly contribute code.
* Improve test coverage.
* Provide mocks or sketches for better UI.

### As a scholar/expert on runes:
* Review existing content.
* Provide better sources.
* Submit new content (feel free to submit in any format, I'll be happy to convert to jsons).

### As a user:
* File an [issue](https://github.com/tomaszgarbus/rune-ovningsbok/issues) with your suggestions.
## Stack
* ReactJS
* Node.js

### Getting started with the repo

1. Clone the repository: `git clone https://github.com/tomaszgarbus/rune-ovningsbok`
1. `cd` into `rune-ovningsbok`
1. Install Node dependencies: `npm install`
1. To run the tests: `npm test -- --coverage --watchAll`
1. You're good to go! Run `npm start` to run the app locally.

### Deployment to GH pages
Deployment to GH pages was set up by following [this guide](https://github.com/gitname/react-gh-pages). It suffices to run `npm run deploy` from the main directory of the repo.

### Thumbnalizer

The entry point of the app is the "List of exercises" view. It shows all available exercises (without lazy loading) and displays all the images. To reduce the required network throughput, we display downsized thumbnails instead (if available).

Thumbnails are created automatically by [img-resize workflow](https://github.com/tomaszgarbus/rune-ovningsbok/blob/main/.github/workflows/img-resize.yml).

Thus, a good practice after adding a new exercise, is to wait for the `img-resize` workflow to complete, download the generated artefact (a zip file with images) and extract it to `public/images/thumbnails`.