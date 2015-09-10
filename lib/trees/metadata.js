import mergeTrees from 'broccoli-merge-trees';
import { ConcatJSON } from './utils';
import apiMetadataTree from './api-metadata';
import pagesMetadataTree from './pages-metadata';

export default function metadataTree(options) {
  let apiMetadata = apiMetadataTree(options);
  let pagesMetadata = pagesMetadataTree(options);
  return new ConcatJSON(mergeTrees([ apiMetadata, pagesMetadata ]), {
    dest: 'metadata.json'
  });
}
