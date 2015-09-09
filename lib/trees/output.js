import path from 'path';
import defaults from 'lodash-node/modern/object/defaults';
import any from 'lodash-node/modern/collection/any';
import isEmpty from 'lodash-node/modern/lang/isEmpty';
import mergeTrees from 'broccoli-merge-trees';
import funnel from 'broccoli-funnel';
import dox from 'dox';
import { mv, rename } from 'broccoli-stew';
import { withoutExt, markdown } from './utils';

import metadataTree from './metadata';
import themeTree from './theme';
import assetsTree from './assets';
import stylesTree from './styles';
import pagesTree from './pages';
import apiTree from './api';

export default function docsTree(options = {}) {

  let pkgPath = options.pkgPath || process.cwd();

  options = defaults(options, {
    parseSource: parseSource,
    // Paths
    pkgPath: pkgPath,
    docsPath: path.join(pkgPath, 'docs'),
    libPath: path.join(pkgPath, 'lib'),
    themePath: path.join(__dirname, '../../themes/minimal'),
    // Meta seeds
    projectMetadata: require(path.join(pkgPath, 'package.json'))
  });

  options = defaults(options, {
    // Source file selections
    pagesSrc: funnel(options.docsPath, { include: [ '*.{md,html}' ] }),
    apiSrc: funnel(options.libPath, { include: [ '**/*.js' ] }),
    assetsSrc: funnel(options.pkgPath, { exclude: [ '*.{md,html}' ] }),
    stylesSrc: funnel(options.themePath, { include: [ '**/*.scss' ] })
  });

  options = defaults(options, {
    // Use a single metadataTree to allow for customization and avoid
    // duplicating the metadata generation work
    metadataTree: metadataTree(options),
    themeTree: themeTree(options)
  });

  // The compiler tree combines the collected metadata for pages and API docs,
  // plus the theme directory. It provides a "single step" environment where
  // pages and API docs can be compiled, ensuring that Broccoli watches all the
  // source files appropriately.
  options.compilerTree = mergeTrees([
    mv(options.themeTree, '__theme'),
    mv(options.metadataTree, '__metadata')
  ]);

  let output = mergeTrees([
    // assetsTree(options),
    stylesTree(options),
    pagesTree(options),
    apiTree(options)
  ]);

  // Pretty URLs
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

const multiTagTypes = [ 'param' ];

function parseSource(source, relativepath) {
  let blocks = dox.parseComments(source).map((comment) => {
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
        tag.string = markdown(tag.string);
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

  let firstBlock = blocks[0];
  let meta = {
    blocks: blocks,
    url: path.normalize(firstBlock.tags.url || path.join('lib', relativepath)),
    path: path.join('lib', relativepath),
    // The file's name is the first comments's namespace, module, or ctx name
    name: firstBlock.tags.title && firstBlock.tags.title.string
          || firstBlock.tags.namespace && firstBlock.tags.namespace.string
          || firstBlock.tags.module && firstBlock.tags.module.string
          || firstBlock.ctx && firstBlock.ctx.name
  };

  let hasTags = any(meta.blocks, (block) => { return !isEmpty(block.tags); });

  return hasTags ? meta : null;
}
