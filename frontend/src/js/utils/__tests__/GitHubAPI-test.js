jest.dontMock('../GitHubAPI');

var GitHub, repo, sha, key;


describe('getCommits', function() {
  beforeEach(function() {
    GitHub = require('../GitHubAPI');
    repo = GitHub.getRepo("AdamStone", "xrd-plot");
    sha = "5d483de3f14e217e3b23ac21ca13ac65e894fc46";
  });



  pit('returns API response commits [objs]',

    function() {

      return repo.getCommits()
        .then(function(commits) {
          expect(commits.length).toBeTruthy();
          commits.forEach(function(commit) {
            expect(commit.sha).toBeDefined();
            expect(commit.commit).toBeDefined();
          });
        });
    });
});



describe('getTree', function() {
  beforeEach(function() {
    GitHub = require('../GitHubAPI');
    repo = GitHub.getRepo("AdamStone", "xrd-plot");
  });



  pit('returns objs and sha filesystem model',

    function() {

      return repo.getTree(sha)
        .then(function(tree) {

          // check recursively
          checkTree(tree.fileSystem, tree.objs);
        });
    });

});


describe('getBlob', function() {
  beforeEach(function() {
    GitHub = require('../GitHubAPI');
    repo = GitHub.getRepo("AdamStone", "xrd-plot");
    sha = "b512c09d476623ff4bf8d0d63c29b784925dbdf8";
  });



  pit('returns file content',

    function() {

      return repo.getBlob(sha)
        .then(function(content) {
          expect(content).toBe('node_modules');
        });
    });
});




function checkTree(fileSystem, objStore) {
  // filesystem is nested object of tree and file
  // sha pointing at objects in objStore

  expect(typeof fileSystem[' sha']).toBe('string');
  expect(fileSystem[' sha'].length).toBe(40);
  expect(fileSystem[' files'].length).toBeDefined();

  expect(objStore[fileSystem[' sha']].children.length).toBeTruthy();

  for (key in fileSystem) {
    if (!(key in {' sha':1, ' files':1})) {
      checkTree(fileSystem[key], objStore);
    }
  }
}
