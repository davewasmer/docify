import build from './build';
import server from './serve';
import program from 'commander';
import pkg from '../package.json';

program.version(pkg.version)
  .option('--source', 'Folder containing documentation source (defaults to ./docs)')
  .option('--destination', 'Folder to write the generated docs to (defaults to ./docs-dist)')
  .option('--server', 'Run as a local webserver to preview your docs, and watch your source files for changes')
  .option('--theme', 'A folder containing a theme to use')
  .parse(process.argv);

if (program.server) {
  server({
    src: program.source,
    theme: program.theme,
    pkg: process.cwd()
  });
} else {
  build({
    src: program.source,
    dest: program.destination,
    theme: program.theme,
    pkg: process.cwd()
  });
}
