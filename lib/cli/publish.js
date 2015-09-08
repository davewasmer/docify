import { execSync as run } from 'child_process';
import build from '../lib/build';
import program from 'commander';
import pkg from '../package.json';

program.version(pkg.version)
  .option('--source', 'Folder containing documentation source (defaults to ./docs)')
  .option('--theme', 'A folder containing a theme to use')
  .parse(process.argv);

build({
  src: program.source,
  dest: program.destination,
  theme: program.theme,
  pkg: process.cwd()
}).then((outputDir) => {
  let message = program.message || 'Publishing docify docs';
  run('git checkout gh-pages');
  run(`cp -R ${ outputDir } .`);
  run(`git add . --all && git commit -m ${ message }`);
  run(`git push`);
  run("git checkout `git reflog HEAD | sed -n '/checkout/ !d; s/.* \\(\\S*\\)$/\\1/;p' | sed '2 !d'`");
});
