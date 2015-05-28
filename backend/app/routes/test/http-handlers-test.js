var expect, atob, handlers, constants, sha, key;


describe('getCommits', function() {

  this.timeout(5000);

  beforeEach(function() {
    expect = require('expect');
    atob = require('atob');
    handlers = require('../http-handlers');
    constants = require('../../config/constants');
  });



  it('returns API response commits { commits: [objs] }',

    function(done) {

      var request = {
        params: {
          owner: 'AdamStone',
          repo: 'xrd-plot'
        }
      };

      handlers.getCommits(request, function(result) {

        var commits = result.commits;

        expect(commits.length).toExist();
        commits.forEach(function(commit) {
          expect(commit.sha).toExist();
          expect(commit.commit).toExist();
        });

        done();
      });

    });

  it('returns { hitLimit: true } for too-large projects',

    function(done) {

      var request = {
        params: {
          owner: 'lisa-lab',
          repo: 'pylearn2'
        }
      };

      handlers.getCommits(request, function(result) {

        var hitLimit = result.hitLimit,
            limit = (constants.github.PAGE_LIMIT *
                     constants.github.PER_PAGE);

        expect(hitLimit).toBe(limit);

        done();
      });

    });
});



describe('getTree', function() {
  beforeEach(function() {
    expect = require('expect');
    handlers = require('../http-handlers');
    sha = "5d483de3f14e217e3b23ac21ca13ac65e894fc46";
  });



  it('returns objs and sha filesystem model',

    function(done) {

      var request = {
        params: {
          owner: 'AdamStone',
          repo: 'xrd-plot',
          sha: sha
        }
      };

      handlers.getTree(request, function(tree) {
        // check recursively
        checkTree(tree.fileSystem, tree.objs);

        done();
      });

    });

});



describe('getBlob', function() {
  beforeEach(function() {
    expect = require('expect');
    handlers = require('../http-handlers');
    sha = "b512c09d476623ff4bf8d0d63c29b784925dbdf8";
  });



  it('returns JSON with base64 content',

    function(done) {

      var request = {
        params: {
          owner: 'AdamStone',
          repo: 'xrd-plot',
          sha: sha
        }
      };

      handlers.getBlob(request, function(content) {
        expect(atob(content)).toBe('node_modules');
        done();
      });

    });
});




function checkTree(fileSystem, objStore) {
  // filesystem is nested object of tree and file
  // sha pointing at objects in objStore

  expect(typeof fileSystem[' sha']).toBe('string');
  expect(fileSystem[' sha'].length).toBe(40);

  expect(objStore[fileSystem[' sha']].children.length).toExist();

  for (key in fileSystem) {
    if (!(key in {' sha':1, ' files':1})) {
      checkTree(fileSystem[key], objStore);
    }
  }
}
