import build from '../lib/build';
import program from 'commander';
import pkg from '../package.json';

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
