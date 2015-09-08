---
title: Getting Started with Baker
---

# Getting started with Baker

Baker is a tool to quickly and easily add documentation to any Node module or npm based project.

There are two types of documentation that Baker can generate: **pages** and **API docs**.

## Pages

Pages are written as Markdown or HTML files, stored in a top-level `docs/` folder in your project:

```
package.json
index.js
docs/
  getting-started.md
  contributing.html
```

Pages are great for guides, contributing guidelines, and other types of unstructured, long-form content.

## API Docs

API documentation is automatically generated from any top-level JS files, or files contained in `lib/`. Documentation is written as JSDoc style comments, and parsed via [Dox](https://github.com/tj/dox).

```
/**
 * A short description goes here.
 *
 * @param {Object}  options  a description of options
 */
function foo(options) {
```
