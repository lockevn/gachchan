# gachchan common funcs for both Serverside and Clientside

[![npm version](https://badgen.net/npm/v/gachchan)](https://npm.im/gachchan) [![npm downloads](https://badgen.net/npm/dm/gachchan)](https://npm.im/gachchan)

## Using this template

- Search `my-ts-lib` and replace it with your custom package name.

Features:

- Package manager [pnpm](https://pnpm.js.org/), safe and fast
- Release with [semantic-release](https://npm.im/semantic-release)
- Bundle with [tsup](https://github.com/egoist/tsup)
- Test with [vitest](https://vitest.dev)

To skip CI (GitHub action), add `skip-ci` to commit message. To skip release, add `skip-release` to commit message.

## Install

```bash
npm i gachchan
```

## Sponsors

https://github.com/sponsors/lockevn

# To publish/release

`pnpm build` then commit code and `/dist` to repo. Create git tag and publish the git tag
