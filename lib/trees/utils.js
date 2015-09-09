import path from 'path';
import fs from 'fs';
import defaults from 'lodash-node/modern/object/defaults';
import assign from 'lodash-node/modern/object/assign';
import get from 'lodash-node/modern/object/get';
import forOwn from 'lodash-node/modern/object/forOwn';
import walkSync from 'walk-sync';
import CachingWriter from 'broccoli-caching-writer';
import dox from 'dox';
import marked from 'marked';
import highlight from 'highlight.js';
import handlebars from 'handlebars';
import mkdirp from 'mkdirp';

// Pre-configure markdown options

let markdownOptions = {
  gfm: true,
  breaks: false,
  highlight(code, lang) {
    if (lang === 'txt') {
      return code;
    } else if (lang) {
      return highlight.highlight(lang, code, true).value;
    } else {
      return highlight.highlightAuto(code).value;
    }
  }
};
dox.setMarkedOptions(markdownOptions);
marked.setOptions(markdownOptions);

export function markdown(str) {
  return marked(str || '');
}


// A broccoli plugin which takes a directory of JSON files and concats them into
// a single file, keyed on their relative paths.

export const ConcatJSON = CachingWriter.extend({
  enforceSingleInputTree: true,
  init(inputTrees, options) {
    this._super.apply(this, arguments);
    this.destFile = options.dest;
  },
  updateCache(srcPath, destDir) {
    let json = walkSync(srcPath).reduce((allMetadata, filepath) => {
      let absolutepath = path.join(srcPath, filepath);
      if (fs.statSync(absolutepath).isFile()) {
        let contents = JSON.parse(fs.readFileSync(absolutepath, 'utf-8') || '{}');
        return assign(allMetadata, {
          [ filepath ]: contents
        });
      } else {
        return allMetadata;
      }
    }, {});
    fs.writeFileSync(path.join(destDir, this.destFile), JSON.stringify(json));
  }
});


// A broccoli plugin which takes a single JSON file whose keys are filepaths and
// expands it into actual files

export const ExpandJSON = CachingWriter.extend({
  enforceSingleInputTree: true,
  init(inputTrees, options) {
    this._super.apply(this, arguments);
    // What is the single source file to start with?
    this.srcFile = options.srcFile || 'metadata.json';
  },
  updateCache(srcPath, destDir) {
    let metadatapath = path.join(srcPath, '__metadata', this.srcFile);
    let metadata = JSON.parse(fs.readFileSync(metadatapath, 'utf-8'));

    let templatepath = path.join(srcPath, '__theme', this.template);
    let template = handlebars.compile(fs.readFileSync(templatepath, 'utf-8'));

    let documentType = get(metadata, this.namespace);
    forOwn(documentType, (fileMetadata, relativepath) => {
      // Compile the data for this particular document
      let data = defaults(this.data(fileMetadata), metadata);
      // Get the final file name (we do this now, while we have access to the
      // metadata for this file, rather than later, when it's harder to
      // associate the two)
      let dest = this.rename(relativepath, data);
      // Write it into broccoli's tmp dir
      let destFile = path.join(destDir, dest);
      // Make sure the containing dir exists!
      mkdirp.sync(path.dirname(destFile));
      // Write it!
      fs.writeFileSync(destFile, template(data));
    });
  }
});


// Given a path, remove the extension

export function withoutExt(filepath) {
  return path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)));
}


// Register a handlebars partial

export function registerPartial(name, contents) {
  handlebars.registerPartial(name, contents);
}
