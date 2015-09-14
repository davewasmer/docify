import path from 'path';
import fs from 'fs';
import cpr from 'cpr';
import { execSync as run } from 'child_process';
import mkdirp from 'mkdirp';

/**
 * The `$ docify init` command sets up your project to work with docify easily.
 * It does a couple things:
 *
 * 1. It copies the default minimal theme into your docs folder, giving you a
 *    local copy that is easy to tweak without starting from scratch
 * 2. It sets up your gh-pages branch properly so you are ready to deploy your
 *    docs to Github Pages
 *
 * @title $ docify init
 */

let status = run('git status --porcelain');
if (status.toString().match(/[^\s]/)) {
  console.log('Your project must have a clean git status to get started. Please commit or stash changes, and try again.');
  process.exit(1);
}

mkdirp.sync('docs');

let srcThemeDir = path.join(__dirname, '../../themes/minimal/');
let destThemeDir = path.join(process.cwd(), 'docs/theme');
cpr(srcThemeDir, destThemeDir, {
  deleteFirst: false,
  overwrite: false
}, (err) => {
  if (err) { throw err; }

  fs.appendFileSync('.gitignore', 'docs-dist\n');
  run('git add .gitignore docs/theme');
  run('git commit -m "docify init: added docs-dist to .gitignore, installed local theme"');

  let currentBranch = run('git rev-parse --abbrev-ref HEAD').toString();
  run('git checkout --orphan gh-pages');
  run('git rm --cached -r .');
  run('git add .gitignore');
  run('git commit -m "docify init: initial gh-pages branch commit"');
  run('git clean -fd');
  run(`git checkout ${ currentBranch }`);

  console.log('Repository initialized! Ready for to publish your first docs - just run `docify publish`');

});
