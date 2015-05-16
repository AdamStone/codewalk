//jest.dontMock('../http-handlers');
//
//var promisify, handlers, sha, key, fn;
//
//
//describe('getCommits', function() {
//  beforeEach(function() {
//    console.log('requiring handlers');
//    handlers = require('../http-handlers');
//    console.log('requiring promisify');
//    promisify = require('promisify-node');
//  });
//
//
//
//  it('returns API response commits [objs]',
//
//    function() {
//
//      var request = {
//        params: {
//          owner: 'AdamStone',
//          repo: 'xrd-plot'
//        }
//      };
//      expect(true);
//
//      // use promises / wrapper to deal with async
//      fn = promisify(function(callback) {
//        console.log('calling getCommits');
//        handlers.getCommits(request, function(result) {
//          console.log('reply called');
//          return callback(null, result);
//        });
//      });
//
//      console.log('returning fn');
//      return fn()
//        .then(function(commits) {
//          console.log('then called');
//          expect(commits.length).toBeTruthy();
//          commits.forEach(function(commit) {
//            expect(commit.sha).toBeDefined();
//            expect(commit.commit).toBeDefined();
//          });
//        });
//    });
//});
//
//
//
//describe('getTree', function() {
//  beforeEach(function() {
//    handlers = require('../http-handlers');
//    promisify = require('promisify-node');
//    sha = "5d483de3f14e217e3b23ac21ca13ac65e894fc46";
//  });
//
//
//
//  pit('returns objs and sha filesystem model',
//
//    function() {
//
//      var request = {
//        params: {
//          owner: 'AdamStone',
//          repo: 'xrd-plot',
//          sha: sha
//        }
//      };
//
//      fn = promisify(function(callback) {
//        handlers.getTree(request, function(result) {
//          return callback(null, result);
//        });
//      });
//
//      return fn()
//        .then(function(tree) {
//
//          // check recursively
//          checkTree(tree.fileSystem, tree.objs);
//        });
//    });
//
//});
//
//
//
//describe('getBlob', function() {
//  beforeEach(function() {
//    handlers = require('../http-handlers');
//    promisify = require('promisify-node');
//    sha = "b512c09d476623ff4bf8d0d63c29b784925dbdf8";
//  });
//
//
//
//  pit('returns file content',
//
//    function() {
//
//      var request = {
//        params: {
//          owner: 'AdamStone',
//          repo: 'xrd-plot',
//          sha: sha
//        }
//      };
//
//      fn = promisify(function(callback) {
//        handlers.getBlob(request, function(result) {
//          return callback(null, result);
//        });
//      });
//
//      return fn()
//        .then(function(content) {
//          expect(content).toBe('node_modules');
//        });
//    });
//});
//
//
//
//
//function checkTree(fileSystem, objStore) {
//  // filesystem is nested object of tree and file
//  // sha pointing at objects in objStore
//
//  expect(typeof fileSystem[' sha']).toBe('string');
//  expect(fileSystem[' sha'].length).toBe(40);
//  expect(fileSystem[' files'].length).toBeDefined();
//
//  expect(objStore[fileSystem[' sha']].children.length).toBeTruthy();
//
//  for (key in fileSystem) {
//    if (!(key in {' sha':1, ' files':1})) {
//      checkTree(fileSystem[key], objStore);
//    }
//  }
//}
