---
title: Customizing Docify
url: /customizing-docify
---

# Customizing Docify

For small projects, the default `minimal` theme is a great fit. However, for larger projects, or ones that require more branding, you can customize the theme that Docify uses to generate the documentation.

Docify themes are pretty simple. They only require three files:

* `api.hbs` - used to render API documentation
* `page.hbs` - used to render documentation Pages
* `styles.scss` - your custom Sass stylesheet.

You can also optionally include partials in a `partials/` directory inside your theme folder, and they will automatically be registered and made availabe in your templates.

If you aren't familiar with Sass, don't worry - it's a strict superset of CSS, meaning you can write regular CSS in your `.scss` files and it should work just fine.

## Template Data

The two templates used by Docify (`api.hbs` and `page.hbs`) each receive data that can be used inside the template.

### `page.hbs`

For the `page.hbs` template, this data is mostly useful for rendering things like global navigation, project links, etc; most of the content will come directly from the page source.

Inside your page template, you access the following variables:

```js
{
  project: { /* this is your package.json */ },
  page: { /* the YAML frontmatter for the currently rendering page */ },
  pages: [
    // An array of all the pages in your project
  ],
  apis: [
    // An array of the metadata and documentation extracted from each source file
  ]
}
```

### `api.hbs`

Unlike the page template, the API documentation template is almost entirely data driven. You'll have access to all the same global metadata that the page template has (i.e. `project`, `pages`, `apis`), but you'll also have access to the metadata for the currently rendering API documentation file via `api`.

Docify uses [Dox](https://github.com/tj/dox) to parse JSDoc style comment blocks in your source code. Each source file will produce an array of documentation data extract from each comment block. Docify combines these into an array of file metadata:

```js
apis: [  // apis is the array of all extracted documentation in your project
  [
    // Each entry is an array of extracted docs from each comment in a particular file
  ]
]
```

See the documentation for [Dox](https://github.com/tj/dox) to get a sense of what is available, or take a look at the source for the built-in [minimal theme](https://github.com/davewasmer/docify/blob/master/themes/minimal/api.hbs).
