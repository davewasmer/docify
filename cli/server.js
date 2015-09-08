import server from '../lib/server';
import program from 'commander';
import pkg from '../package.json';

program.version(pkg.version)
  .option('--source', 'Folder containing documentation source (defaults to ./docs)')
  .option('--theme', 'A folder containing a theme to use')
  .parse(process.argv);

server({
  src: program.source,
  theme: program.theme,
  pkg: process.cwd()
});
