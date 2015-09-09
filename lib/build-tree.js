import fs from 'fs';
import path from 'path';
import glob from 'glob';
import fm from 'front-matter';
import dox from 'dox';
import handlebars from 'handlebars';
import marked from 'marked';
import { rename, mv, find, map } from 'broccoli-stew';
import mergeTrees from 'broccoli-merge-trees';
import sass from 'broccoli-sass';
import autoprefixer from 'broccoli-autoprefixer';
import funnel from 'broccoli-funnel';
import highlight from 'highlight.js';

// JSDoc tags that can be used multiple times
const multiTagTypes = [ 'param' ];

export default function docsTree(options) {

  ///////////
  // Setup //
  ///////////

  // Some common directories
  let rootPath = options.root;
  let pkgPath = options.pkg;
  let themePath = options.theme;

  // Setup the theme
  let markdownOptions = {
    gfm: true,
    breaks: false,
    highlight(code, lang) {
      if (lang) {
        return highlight.highlight(lang, code, true).value;
      } else {
        return highlight.highlightAuto(code).value;
      }
    }
  };
  dox.setMarkedOptions(markdownOptions);
  marked.setOptions(markdownOptions);
  globMap(themePath, 'partials/**/*.hbs', (filename) => {
    let contents = fs.readFileSync(filename, 'utf-8');
    let partialName = path.basename(filename, '.hbs');
    handlebars.registerPartial(partialName, contents);
  });
  let pageTemplate = templateFromFile(themePath, 'page.hbs');
  let apiTemplate = templateFromFile(themePath, 'api.hbs');

  // Setup template metadata
  let pagesMeta = {};
  let apiMeta = {};
  let projectMeta = require(path.join(pkgPath, 'package.json'));


  ///////////////////
  // Metadata Tree //
  ///////////////////

  // We have to read the metadata first, and combine the api and pages files into
  // a folder, so that by the time the templating trees run later, all the
  // metadata has been processed.

  // Pages metadata
  let pagesMetadataTree = map(rootPath, '*.{md,html}', (content, relativepath) => {
    let { attributes, body } = fm(content);
    attributes.url = attributes.url || path.basename(withoutExt(relativepath));
    attributes.url = path.normalize('/' + attributes.url);
    pagesMeta[relativepath] = attributes;
    return body;
  });
  pagesMetadataTree = mv(pagesMetadataTree, '/pages');

  // API metadata
  let sourceFiles = find(path.join(pkgPath, 'lib'), { include: [ '**/*.js' ] });
  let sourceFilesWithDocComments = funnel(sourceFiles, {
    exclude: [
      function sourceHasNoDoxComments(apiPath) {
        let contents = fs.readFileSync(path.join(pkgPath, 'lib', apiPath), 'utf-8');
        let comments = dox.parseComments(contents);
        return comments.length === 1 && comments[0].tags.length === 0;
      }
    ]
  });
  let apiMetadataTree = map(sourceFilesWithDocComments, (contents, relativepath) => {
    let meta = metaForAPIFile(contents, relativepath);
    apiMeta[relativepath] = meta;
    return contents;
  });
  apiMetadataTree = mv(apiMetadataTree, '/api');

  // Merge them to feed into compiled pages and api trees
  let metadataTree = mergeTrees([ apiMetadataTree, pagesMetadataTree ]);


  ////////////////
  // Pages Tree //
  ////////////////

  // Select the pages from the metadata tree
  let pagesTree = funnel(metadataTree, {
    exclude: [ 'api/**/*' ]
  });


  // Compile markdown and inject into page template
  pagesTree = map(pagesTree, (content, relativepath) => {
    relativepath = path.relative('pages', relativepath);
    return pageTemplate({
      html: marked(content),
      page: pagesMeta[relativepath],
      pages: pagesMeta,
      apis: apiMeta,
      project: projectMeta
    });
  });

  // Rename any markdown files to HTML
  pagesTree = mv(pagesTree, 'pages/*', '/');
  pagesTree = rename(pagesTree, (relativepath) => {
    if (pagesMeta[relativepath]) {
      relativepath = pagesMeta[relativepath].url + '.html';
    }
    relativepath = relativepath.replace('.md', '.html');
    return relativepath;
  });


  //////////////
  // API Tree //
  //////////////

  // Select the API files from the metadata tree
  let apiTree = funnel(metadataTree, {
    exclude: [ 'pages/**/*' ]
  });

  // Inject into API template
  apiTree = map(apiTree, (content, relativepath) => {
    return apiTemplate({
      api: metaForAPIFile(content, relativepath),
      apis: apiMeta,
      pages: pagesMeta,
      project: projectMeta
    });
  });

  // Rename to html files and move into the api/ folder
  apiTree = rename(apiTree, '.js', '.html');


  /////////////////
  // Styles Tree //
  /////////////////

  let stylesTree = sass([ themePath ], 'styles.scss', '/styles.css');
  stylesTree = autoprefixer(stylesTree);


  /////////////////
  // Assets Tree //
  /////////////////

  let assetsTree = funnel(rootPath, {
    exclude: [
      '**/*.{md,html}',
      `${ themePath }/**/*`
    ]
  });


  ////////////////
  // Final Tree //
  ////////////////

  let output = mergeTrees([ stylesTree, assetsTree, pagesTree, apiTree ]);
  output = rename(output, (relativepath) => {
    let folder = withoutExt(relativepath);
    if (path.extname(relativepath) === '.html' && path.basename(folder) !== 'index') {
      return path.join(folder, 'index.html');
    } else {
      return relativepath;
    }
  });

  return output;
}


/////////////
// Helpers //
/////////////

function globMap(parent, pattern, fn) {
  return glob.sync(path.join(parent, pattern)).map(fn);
}

function templateFromFile(...paths) {
  return handlebars.compile(fs.readFileSync(path.join(...paths), 'utf-8'));
}

function withoutExt(filepath) {
  return path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)));
}

function metaForAPIFile(contents, relativepath) {
  let meta = dox.parseComments(contents).map((comment) => {
    // Convert tags from array to object keyed on tag type
    comment.tags = (comment.tags || []).reduce((tags, tag) => {

      let type = tag.type;
      if (multiTagTypes.indexOf(type) > -1) {
        tags[type] = tags[type] || [];
        tags[type].push(tag);
      } else {
        tags[type] = tag;
      }

      if (tag.type === 'example') {
        tag.string = marked(tag.string);
      }

      if (type === 'param') {
        if (tag.name.indexOf('.') > -1) {
          tag.isNested = true;
        }
      }
      return tags;
    }, {});

    return comment;
  });
  let firstComment = meta[0];
  meta.url = path.normalize(firstComment.tags.url || withoutExt(relativepath));
  meta.filepath = relativepath.replace(/^api/, 'lib');
  // The file's name is the first comments's namespace, module, or ctx name
  meta.name = (firstComment.tags.title && firstComment.tags.title.string)
              || (firstComment.tags.namespace && firstComment.tags.namespace.string)
              || (firstComment.tags.module && firstComment.tags.module.string)
              || (firstComment.ctx && firstComment.ctx.name);
  // Reconstruct the filepath
  meta.path = 'lib/' + relativepath;
  return meta;
}
