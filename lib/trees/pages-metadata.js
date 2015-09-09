import { map } from 'broccoli-stew';
import fm from 'front-matter';
import { ConcatJSON } from './utils';

export default function pagesMetadataTree(options) {
  // Extract the frontmatter - turn each file into a JSON representation of its
  // YAML frontmatter
  let extractedFrontmatter = map(options.pagesSrc, (content) => {
    let parsed = fm(content);
    return JSON.stringify(parsed);
  });

  return new ConcatJSON(extractedFrontmatter, {
    dest: 'pages'
  });
}
