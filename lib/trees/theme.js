import path from 'path';
import { map } from 'broccoli-stew';
import { registerPartial, withoutExt } from './utils';

export default function themeTree(options) {
  return map(options.themePath, (contents, relativepath) => {
    if (relativepath.match(/^partials/)) {
      registerPartial(withoutExt(path.relative('partials', relativepath)), contents);
    }
    return contents;
  });
}
