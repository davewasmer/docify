import expect from 'must';
import fs from 'fs';
import path from 'path';
import build from '../lib/build';

describe('baker', function() {
  describe('build', function() {
    before(function() {
      this.output = build();
      return this.output;
    });
    it('should return a promise', function() {
      expect(this.output.then).to.be.a.function();
    });
    it('should build top level markdown files into top level folders with index.html files', function() {
      expectFileToExist('getting-started/index.html');
    });
    it('should build API doc files for each source file with docblock comments', function() {
      expectFileToExist('api/lib/build/index.html');
      expectFileToNotExist('api/lib/serve/index.html');
    });
  });
});

function expectFileToExist(filepath) {
  expect(fs.existsSync(path.join(__dirname, '..', 'docs-dist', filepath))).to.be.true();
}
function expectFileToNotExist(filepath) {
  expect(!fs.existsSync(path.join(__dirname, '..', 'docs-dist', filepath))).to.be.true();
}
