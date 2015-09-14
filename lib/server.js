import fs from 'fs';
import path from 'path';
import broccoli from 'broccoli';
import tinylr from 'tiny-lr';
import docsTree from './trees/output';

export default function docify(options = {}) {
  let port = options.port || 3000;
  let docsPath = options.src || 'docs';
  let pkgPath = options.pkg || process.cwd();
  let themePath = options.theme
              || fs.existsSync('docs/theme') && 'docs/theme'
              || path.join(__dirname, '../themes/minimal');

  let builder = new broccoli.Builder(docsTree({ docsPath, pkgPath, themePath }));
  let server = broccoli.server.serve(builder, { host: 'localhost', port });

  // Start a livereload server
  let lrserver = tinylr();
  lrserver.listen(35729, () => {
    setTimeout(() => {
      // Trigger a reload on first start
      lrserver.changed({ body: { files: [ 'livereload files' ] } });
    }, 1000);
  });

  // Notify it on changes
  server.watcher.on('change', function() {
    lrserver.changed({ body: { files: [ 'livereload files' ] } });
  });

}
