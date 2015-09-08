import path from 'path';
import broccoli from 'broccoli';
import { sync as copyDereferenceSync } from 'copy-dereference';
import rimraf from 'rimraf';
import docsTree from './build-tree';

/**
 * Creates a broccoli Builder to build the docs with the supplied options.
 * Returns a promise which resolves when the build is finished. Cleans up after
 * itself, and accepts options to customize the input and output folders, as
 * well as the theme used.
 *
 * @method docify
 *
 * @param  {Object} options
 * @param  {Object} options.root  the docs folder to build, defaults to ./docs
 *
 * @return {Promise}
 */
export default function docify(options = {}) {
  let root = options.src || path.join(process.cwd(), 'docs');
  let dest = options.dest || path.join(process.cwd(), 'docs-dist');
  let theme = options.theme || path.join(__dirname, '../themes/minimal');
  let pkg = options.pkg || path.join(root, '..');

  let builder = new broccoli.Builder(docsTree({ root, pkg, theme }));

  rimraf.sync(dest);
  return builder.build()
  .then((hash) => {
    copyDereferenceSync(hash.directory, dest);
  }).finally(() => {
    return builder.cleanup();
  }).then(() => {
    return dest;
  });
}
