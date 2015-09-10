---
title: Getting Started with Docify
url: getting-started
---

# Getting started with Docify

Docify is a tool to quickly and easily add documentation to any Node module or npm based project.

## Concepts

There are two types of documentation that Docify can generate: **pages** and **API docs**.

### Pages

Pages are written as Markdown or HTML files, stored in a top-level `docs/` folder in your project:

```
package.json
index.js
docs/
  getting-started.md
  contributing.html
```

Pages are great for guides, contributing guidelines, and other types of unstructured, long-form content.

### API Docs

API documentation is automatically generated from any JS files contained in `lib/`. Documentation is written as JSDoc style comments, and parsed via [Dox](https://github.com/tj/dox).

```js
/**
 * A short description goes here.
 *
 * @param {Object}  options  a description of options
 */
function foo(options) {}
```

> Dox parses JSDoc-_like_ comments, which means it parses valid JSDoc tags, but you can also create your own, which you could then use in your own theme to display additional information.

> You can swap in your own comment parser too. Check out the [customization guide](customizing-docify) for details.

## Using docify

There are two ways to use Docify: globally via the CLI, or locally via the programmatic interface.

### The Docify CLI

The CLI comes with three commands:

* `build` - build the docs for the project, and put them in `docs-dist/` (by default).
* `server` - build the docs, launch a preview webserver on localhost, and rebuild on changes.
* `publish` - build the docs and commit them to the gh-pages branch of the repo.

### The Docify module

For many projects, you may want further control over when and how Docify builds. In those cases, you can use the Docify module programmatically by simply importing it:

```js
import docify from 'docify';

docify().then((outputDir) => {
  // Your docs are built in the outputDir.
});
```

See the [API docs for the build module](api/lib/build.js) for details on what options are available via the programmatic interface.
