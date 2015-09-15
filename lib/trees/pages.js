import Handlebars from 'handlebars';
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
    data(contents, relativepath) {
      contents.attributes.url = contents.attributes.url || withoutExt(relativepath);
      let pageData = {
        page: contents.attributes,
        project: options.projectMetadata,
        build: {
          ghPages: options.ghPages
        }
      };
      let body = markdown(contents.body);
      pageData.html = Handlebars.compile(body)(pageData);
      return pageData;
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
