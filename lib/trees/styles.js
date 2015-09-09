import sass from 'broccoli-sass';
import autoprefixer from 'broccoli-autoprefixer';

export default function stylesTree(options) {
  let styles = sass([ options.stylesSrc ], 'styles.scss', '/styles.css');
  return autoprefixer(styles);
}
