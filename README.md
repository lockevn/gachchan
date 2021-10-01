# gachchan (BETA)

> Helper functions I found useful

> Still in BETA mode (adding and refining package structure will be performed)

> Weekly push (working) code to this lib with fully unit test.

## Project setup

This was built as a lib work for both NodeJS and Browser
using 1.3 in this https://dev.to/riversun/recipes-on-how-to-create-a-library-that-supports-both-browser-and-node-js-201m#(1-3)

Building JavaScript Library in ES6 using Webpack and Babel

1. Install dependencies using `npm i`
2. Run `npm run build`
3. A Bundled file `index will be generated in`dist/` directory.

4. run `npm test` to execute unit test

See more https://www.codementor.io/davidtang/unit-testing-and-tdd-in-node-js-part-1-8t714s877

Use plugin to auto run https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest

run `npm run testinnode` to test some feature in node (setTimeout, which I don't have time to mock properly in `jest`)

# (NOT READY) Debug

See how https://gist.github.com/paambaati/54d33e409b4f7cf059cc

But I prefer run node test/index.js for easier

# How to consume this lib from other project

This is public project,
just put "gachchan": "git+https://github.com/lockevn/gachchan.git#master" into your package.json, then `npm i` or `yarn`

> if you have problem (on local machine), delete package-lock.json and retry

> if you have problem on Heroku (might be a problem with package-lock.json), don't commit the package-lock.json to project repo https://stackoverflow.com/questions/64526838/build-fails-with-host-key-verification-failed-while-installing-node-modules

If we setup this lib as private project, see this to consume https://lockevn.medium.com/consume-private-github-repository-as-npm-package-80733cd135a1

# (NOT AVAILABLE) build this as github npm package, and consume in other proj

https://www.matthaliski.com/blog/using-private-npm-packages-with-rails-heroku-and-github/
