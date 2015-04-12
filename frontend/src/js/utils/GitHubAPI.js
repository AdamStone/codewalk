"use strict";

var promisify = require('promisify-node'),
    GitHub = require('github-api'),
    Credentials = require('../config/gitignore.credentials');


var github = new GitHub(Credentials.gitHub);

module.exports = {

  getRepo: function(userName, repoName) {
    var repo = github.getRepo(userName, repoName);
    repo = promisify(repo);

    // return object with methods acting on repo
    return {

      getCommits: function(objStore, branch) {
        // if no objStore provided, returns raw API
        // response (array of commit objects. Else,
        // stores commit objects and returns array
        // of sha only.

        // defaults to master branch
        branch = typeof branch !== 'undefined' ?
                            branch : 'master';

        // return the promise object
        return repo.getCommits(branch)
          .then(function(commits) {

            // make oldest come first
            commits.reverse();

            if (!objStore) {
              return commits;
            }

            var shaArray = [];
            commits.forEach(function(commit) {
              shaArray.push(commit.sha);
              objStore[commit.sha] = commit;
            });
            return shaArray;

          });
      },

      getTree: function(sha, objStore) {
        // If objStore is provided, new objects are
        // saved and sha filesystem model is returned.
        // Else, returns raw API result (array of objs)

        return repo.getTree(sha + '?recursive=true')
          .then(function(tree) {

            if (!objStore) {
              return tree;
            }

            // find children of subtrees by using
            // paths to rebuild file system

            var fileSystem = {
              ' files': [],
              ' sha': sha
            };

            // first, sort:
            //  all blobs longest-to-shortest path, then
            //  all trees longest-to-shortest path
            tree.sort(function(a, b) {
              if (a.type === b.type) {
                return (b.path.split('/').length -
                        a.path.split('/').length);
              }
              return (a.type === "tree");
            });

            // then process each object:
            tree.forEach(function(item) {

              // BLOBS

              var path, folders, currentDir;
              if (item.type === "blob") {
                path = item.path.split('/');
                folders = path.slice(0, path.length - 1);

                // make sure path exists in structure
                currentDir = fileSystem;
                folders.forEach(
                  function(folder) {
                    currentDir[folder] = (currentDir[folder] || {
                      ' files': [],
                      ' sha': null
                    });
                    currentDir = currentDir[folder];
                  }
                );

                // add file sha to end of path
                currentDir[' files'].push(item.sha);

                // store object if new
                if (objStore && !(item.sha in objStore)) {
                  objStore[item.sha] = item;
                }
              }

              // TREES

              if (item.type === "tree") {
                // by sorting first, all blobs will be done

                folders = item.path.split('/');

                // traverse model to tree path
                currentDir = fileSystem;
                folders.forEach(function(folder) {
                  currentDir = currentDir[folder];
                });

                // set tree sha
                currentDir[' sha'] = item.sha;

                item.children = getChildrenSha(currentDir);

                // store object if new
                if (objStore && !(item.sha in objStore)) {
                  objStore[item.sha] = item;
                }
              }
            }); // END forEach

            // finally, add top-level tree itself
            var item = {
              sha: fileSystem[' sha']
            };
            item.mode = "040000";
            item.path = "";
            item.type = "tree";

            item.children = getChildrenSha(fileSystem);

            // store object if new
            if (objStore && !(item.sha in objStore)) {
              objStore[item.sha] = item;
            }

            return fileSystem;
          });
      }
    };
  }
};





function getChildrenSha(currentDir) {

  // get sha of child trees and blobs
  var children = [];
  for (var key in currentDir) {
    if (key !== ' files' && key !== ' sha') {
      children.push(currentDir[key][' sha']);
    }
  }
  currentDir[' files'].forEach(function(sha) {
    children.push(sha);
  });
  return children;
}
