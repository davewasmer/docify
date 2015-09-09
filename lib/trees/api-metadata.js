import fs from 'fs';
import path from 'path';
import { map } from 'broccoli-stew';
import funnel from 'broccoli-funnel';
import { ConcatJSON } from './utils';

export default function pagesMetadataTree(options) {
  // Exclude any source files that have no docblock style comments
  let sourceFilesWithDocblocks = funnel(options.apiSrc, {
    include: [ fileHasDocblocks ]
  });
  // Convert to serialized JSON of parsed commments
  let parsedComments = map(sourceFilesWithDocblocks, (contents, relativepath) => {
    return JSON.stringify(options.parseSource(contents, relativepath));
  });
  // Concat into a single `api` JSON file
  return new ConcatJSON(parsedComments, {
    dest: 'apis'
  });

  // Return true if the given file has docblock style comments (i.e. at least
  // one block comment with a @tag)
  function fileHasDocblocks(apiPath) {
    let contents = fs.readFileSync(path.join(options.libPath, apiPath), 'utf-8');
    return Boolean(options.parseSource(contents, apiPath));
  }
}
