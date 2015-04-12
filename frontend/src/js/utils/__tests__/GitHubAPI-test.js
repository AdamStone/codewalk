jest.dontMock('../GitHubAPI');

var GitHub, repo, objStore, sha, key;


describe('getCommits', function() {
  beforeEach(function() {
    GitHub = require('../GitHubAPI');
    repo = GitHub.getRepo("AdamStone", "xrd-plot");
    objStore = {};
    sha = "5d483de3f14e217e3b23ac21ca13ac65e894fc46";
  });

  pit('returns API response [objs] if no objStore provided',

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

  pit('saves objs and returns [sha] if objStore provided',

    function() {
      return repo.getCommits(objStore)
        .then(function(commits) {
          expect(Object.keys(objStore).length)
            .toEqual(commits.length);
          for (var obj in objStore) {
            obj = objStore[obj];
            expect(obj.sha).toBeDefined();
            expect(obj.commit).toBeDefined();
          }
          commits.forEach(function(commit) {
            expect(typeof commit).toBe('string');
            expect(commit.length).toBe(40);
          });
        });
    });
});



describe('getTree', function() {
  beforeEach(function() {
    GitHub = require('../GitHubAPI');
    repo = GitHub.getRepo("AdamStone", "xrd-plot");
    objStore = {};
  });

  pit('returns API response [objs] if no objStore provided',

    function() {
      return repo.getTree(sha)
        .then(function(tree) {
          expect(tree.length).toBeTruthy();
          tree.forEach(function(obj) {
            expect(obj.path).toBeDefined();
            expect(obj.sha).toBeDefined();
            expect(obj.type in {"tree": 1, "blob": 1})
              .toBeTruthy();
          });
        });
    });

  pit('saves objs and returns {sha tree} if objStore provided',

    function() {
      return repo.getTree(sha, objStore)
        .then(function(tree) {
          // check recursively
          checkTree(tree, objStore);
        });
    });

});



function checkTree(tree, objStore) {
  expect(typeof tree[' sha']).toBe('string');
  expect(tree[' sha'].length).toBe(40);
  expect(tree[' files'].length).toBeDefined();

  expect(objStore[tree[' sha']].children.length).toBeTruthy();

  for (key in tree) {
    if (!(key in {' sha':1, ' files':1})) {
      checkTree(tree[key], objStore);
    }
  }
}
