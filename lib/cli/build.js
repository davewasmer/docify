import build from '../build';
import program from 'commander';
import pkg from '../../package.json';

/**
 * Run `docify build` from the root directory of a project to compile the docs.
 * If you are looking to use docify programmatically (i.e. from your code),
 * check out the {@link build.js|main module}
 *
 * @title $ docify build
 */

program.version(pkg.version)
  .option('--source', 'Folder containing documentation source (defaults to ./docs)')
  .option('--destination', 'Folder to write the generated docs to (defaults to ./docs-dist)')
  .option('--theme', 'A folder containing a theme to use')
  .parse(process.argv);

build({
  src: program.source,
  dest: program.destination,
  theme: program.theme,
  pkg: process.cwd()
});
