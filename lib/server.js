import docsTree from './trees/output';
import path from 'path';
import broccoli from 'broccoli';
import tinylr from 'tiny-lr';

export default function docify(options = {}) {
  let root = options.src || path.join(process.cwd(), 'docs');
  let theme = options.theme || path.join(__dirname, '../themes/minimal');
  let pkg = options.pkg || process.cwd();
  let port = options.port || 3000;

  let builder = new broccoli.Builder(docsTree({ root, pkg, theme }));
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
