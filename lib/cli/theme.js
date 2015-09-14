import path from 'path';
import cpr from 'cpr';
import mkdirp from 'mkdirp';

/**
 * The `$ docify theme` command simply copies the default minimal theme into
 * your local docs directory, making it easy for you to tweak and tune the
 * theme without having to create your own from scratch.
 *
 * @title $ docify theme
 */

mkdirp.sync('docs');

let srcThemeDir = path.join(__dirname, '../../themes/minimal/');
let destThemeDir = path.join(process.cwd(), 'docs/theme');
cpr(srcThemeDir, destThemeDir, {
  deleteFirst: false,
  overwrite: false
}, (err) => {
  if (err) { throw err; }
});
