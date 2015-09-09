import server from '../server';
import program from 'commander';
import pkg from '../../package.json';

/**
 * The `$ docify server` command builds the documentation for your project,
 * then launches a preview webserver and watches your source files for any
 * changes. When you change any source file (i.e. change a page in your
 * `docs/` folder, or update a source code comment), the server will rebuild the
 * documentation.
 *
 * The server also incorporates a Livereload server, allow you to connect your
 * browser and refresh the page when a change occurs. Check out the [Livereload
 * extension for Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
 * (or your own browser) for connecting.
 *
 * @title $ docify server
 */

program.version(pkg.version)
  .option('--source', 'Folder containing documentation source (defaults to ./docs)')
  .option('--theme', 'A folder containing a theme to use')
  .parse(process.argv);

server({
  src: program.source,
  theme: program.theme,
  pkg: process.cwd()
});
