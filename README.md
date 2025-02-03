# Nuxt Kysely

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

## Introduction

Nuxt Kysely is a Nuxt module that integrates Kysely, a type-safe SQL query builder for TypeScript, into your Nuxt application. This module simplifies database interactions by providing a fluent and type-safe API for constructing SQL queries.

## Installation

To install the Nuxt Kysely module, run the following command:

```bash
npm install nuxt-kysely
```

Or if you prefer using yarn:

```bash
yarn add nuxt-kysely
```

## Configuration

Add `nuxt-kysely` to the `modules` section of your `nuxt.config.js`:

```js
export default {
  modules: [
    'nuxt-kysely',
  ],
  kysely: {
    // Kysely configuration options
  }
}
```

## Usage

Once the module is installed and configured, you can use Kysely in your Nuxt application as follows:

```ts

const { db } = useDatabase()
db.selectFrom('person')
  .where('id', 'is', 1)
  .selectAll()
  .executeTakeFirst()

```

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->


## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  npm install

  # Generate type stubs
  npm run dev:prepare

  # Develop with the playground
  npm run dev

  # Build the playground
  npm run dev:build

  # Run ESLint
  npm run lint

  # Run Vitest
  npm run test
  npm run test:watch

  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/my-module

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/my-module

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/my-module

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
