import mergeTrees from 'broccoli-merge-trees';
import { ExpandJSON, markdown, withoutExt } from './utils';

export default function pagesTree(options) {
  let srcAndCompiler = mergeTrees([
    options.compilerTree,
    options.pagesSrc
  ]);
  return new ExpandJSON(srcAndCompiler, {
    namespace: 'pages',
    template: 'page.hbs',
    data(contents) {
      return {
        html: markdown(contents.body),
        page: contents.attributes,
        project: options.projectMetadata,
        build: {
          ghPages: options.ghPages
        }
      };
    },
    rename(relativepath, data) {
      if (data.page.url) {
        return data.page.url + '.html';
      } else {
        return withoutExt(relativepath) + '.html';
      }
    }
  });
}
