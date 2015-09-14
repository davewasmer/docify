import program from 'commander';
import pkg from '../../package.json';

let result = program.version(pkg.version)
  .command('init', 'Setup the current repo with a docs folder, gh-pages branch, and customizable theme')
  .command('theme', 'Copies the default minimal theme into your local docs folder for easy customization')
  .command('build', 'Build the docs for this project and output to the destination folder')
  .command('server', 'Run a preview server on localhost, and rebuild on changes')
  .command('publish', 'Build and deploy docs to Github Pages')
  .parse(process.argv);

if (result) {
  console.log(`\nCommand "${ process.argv[2] }" not recognized`);
  program.outputHelp();
}
