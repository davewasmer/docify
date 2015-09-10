import build from '../build';
import program from 'commander';
import pkg from '../../package.json';

/**
 * Run the follow command from your project's root directory:
 *
 * ```sh
 * $ docify build
 * ```
 *
 * to compile the docs for that project.
 *
 * The `build` command takes several options to customize it's behavior:
 *
 * ```txt
 * --source       directory containing documentation source (defaults to ./docs)
 * --destination  directory to write the generated docs to (defaults to ./docs-dist)
 * --theme        directory containing a theme to use
 * ```
 *
 * If you are looking to use docify programmatically (i.e. from your code),
 * check out the [main module (lib/build.js)](/api/build)
 *
 * @title $ docify build
 */

program.version(pkg.version)
  .option('--source', 'Folder containing documentation source (defaults to ./docs)')
  .option('--destination', 'Folder to write the generated docs to (defaults to ./docs-dist)')
  .option('--theme', 'A folder containing a theme to use')
  .option('--gh-pages', 'Build the docs for Github Pages hosting (use base tag, skip pretty url conversion, etc.)')
  .parse(process.argv);

build({
  src: program.source,
  dest: program.destination,
  theme: program.theme,
  pkg: process.cwd(),
  ghPages: program.ghPages
});
