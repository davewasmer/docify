import path from 'path';
import broccoli from 'broccoli';
import { sync as copyDereferenceSync } from 'copy-dereference';
import rimraf from 'rimraf';
import docsTree from './trees/output';

/**
 * This module is the main entry point for docify when used programmatically. It
 * exposes a function which will build the docs for a project, and returns a
 * Promise that resolves to the output directory.
 *
 * Docify uses [Broccoli.js](https://github.com/broccolijs/broccoli) as a build
 * tool to compile the docs. This function runs Broccoli with the options you
 * supply.
 *
 * @title docify
 */


/**
 * Create a Broccoli.js Builder and build the project's documentation. Returns
 * a promise which resolves to the output directory that contains the built
 * docs.
 *
 * @method build
 *
 * @example
 *
 * ```js
 * import docify from 'docify';
 *
 * docify({
 *   src: 'docs',
 *   dest: 'docs-dist'
 * }).then((outputDir) => {
 *   // outputDir = 'docs-dist'
 * });
 * ```
 *
 * @param  {Object} options
 * @param  {String} options.src  the docs folder to build, defaults to
 * `"./docs"`
 * @param  {String} options.dest  the destination folder to write the docs to
 * @param  {String} options.theme  a directory containing a theme to use instead
 * of the default "minimal" theme.
 * @param  {String} options.pkg  the root folder for the package being
 * documented (defaults to `process.cwd()`)
 *
 * @return {Promise} Resolves to the output directory containing the built docs
 */
export default function build(options = {}) {
  let root = options.src || path.join(process.cwd(), 'docs');
  let dest = options.dest || path.join(process.cwd(), 'docs-dist');
  let theme = options.theme || path.join(__dirname, '../themes/minimal');
  let pkg = options.pkg || path.join(root, '..');

  let builder = new broccoli.Builder(docsTree({ root, pkg, theme, ghPages: options.ghPages }));

  rimraf.sync(dest);
  return builder.build()
  .then((hash) => {
    copyDereferenceSync(hash.directory, dest);
  }).then(() => {
    console.log(`Docs built! You can find them in ${ path.relative(process.cwd(), dest) }/`);
  }).catch((err) => {
    console.error('Error building docs:');
    console.error(err);
  }).finally(() => {
    return builder.cleanup();
  }).then(() => {
    return dest;
  });
}
