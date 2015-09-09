import { execSync as run } from 'child_process';
import build from '../build';
import program from 'commander';
import pkg from '../../package.json';

/**
 * Builds the docs using the `build` command, and then commits them to your
 * `gh-pages` branch:
 *
 * ```txt
 * my-project$ docify publish
 * my-project$ git checkout gh-pages
 * my-project$ git status
 * # On branch master
 * # Your branch is ahead of 'origin/gh-pages' by 1 commit.
 * #
 * nothing to commit (working directory clean)
 * ```
 *
 * > **Note:** the publish command won't actually push your gh-pages branch.
 * You'll still need to do that manually.
 *
 * ## Setting up
 *
 * The `publish` commands assumes a few things about your project are aleady
 * setup:
 *
 * 1. You have your gh-pages branch already setup. For instructions, check out
 * [Github's guide](https://help.github.com/articles/creating-project-pages-manually/).
 * 2. You have your docs output folder (`docs-dist/` by default) added to your
 * `.gitignore` file.
 *
 * @title $ docify publish
 */

program.version(pkg.version)
  .option('--source', 'Folder containing documentation source (defaults to ./docs)')
  .option('--theme', 'A folder containing a theme to use')
  .option('-p, --push', 'Push the changes to the gh-pages branch to the upstream repo when complete')
  .parse(process.argv);

build({
  src: program.source,
  dest: program.destination,
  theme: program.theme,
  pkg: process.cwd()
}).then((outputDir) => {
  let message = program.message || 'Publishing docify docs';
  run('git checkout -q gh-pages');
  run(`cp -R ${ outputDir }/ .`);
  run('git add . --all');
  run(`git commit -m "${ message.replace(/"/, '\\"') }"`);
  if (program.push) {
    run('git push');
  }
  let lastBranch = run("git reflog HEAD | grep checkout | head -n 1 | cut -d ' ' -f 6");
  run(`git checkout -q ${lastBranch}`);
  console.log('Your docs have been committed to the gh-pages branch.');
  if (!program.push) {
    console.log("Your changes have *not* been pushed to Github - don't forget to push it up!");
  }
}).catch((err) => {
  console.error('Error publishing to Github Pages:');
  console.error(err.stdout.toString());
  console.error(err.stdin.toString());
});
