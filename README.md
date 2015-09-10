# docify [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

Drop-in customizable project page, API documentation, and Github Pages support for your npm module.

Check out the [documentation website](http://davewasmer.github.io/docify) (generated with Docify and hosted on Github Pages!) for details on how to use Docify.

# Installation

There are two ways to use Docify: globally via the CLI, or locally via the programmatic interface.

## Installing the CLI globally

Install Docify as a global CLI:

```sh
$ npm install -g docify
```

You'll then have the `docify` command available. You can run `docify build` in your project to build the docs. Check out the [Getting Started guide](getting-started) for more details.

## Installing the module locally

Install Docify into your project:

```sh
$ npm install --save-dev docify
```

Check out the [module API docs](api/lib/build.js) for details on how to use Docify programmatically.

## License

MIT © [Dave Wasmer](http://davewasmer.com)


[npm-image]: https://badge.fury.io/js/docify.svg
[npm-url]: https://npmjs.org/package/docify
[travis-image]: https://travis-ci.org/davewasmer/docify.svg?branch=master
[travis-url]: https://travis-ci.org/davewasmer/docify
[daviddm-image]: https://david-dm.org/davewasmer/docify.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/davewasmer/docify
[coveralls-image]: https://coveralls.io/repos/davewasmer/docify/badge.svg
[coveralls-url]: https://coveralls.io/r/davewasmer/docify
