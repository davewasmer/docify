import path from 'path';
import mergeTrees from 'broccoli-merge-trees';
import { ExpandJSON, withoutExt } from './utils';

export default function apiTree(options) {
  let srcAndCompiler = mergeTrees([
    options.compilerTree,
    options.apiSrc
  ]);
  return new ExpandJSON(srcAndCompiler, {
    namespace: 'apis',
    template: 'api.hbs',
    data(contents) {
      return {
        api: contents,
        project: options.projectMetadata
      };
    },
    rename(relativepath, data) {
      if (data.api.url) {
        return path.join('api', data.api.url + '.html');
      } else {
        return path.join('api', relativepath + '.html');
      }
    }
  });
}