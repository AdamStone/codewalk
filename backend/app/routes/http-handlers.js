"use strict";

var promisify = require('promisify-node'),
    GitHub = require('github-api'),
    Boom = require('boom');

var Credentials = require('../config/gitignore.credentials');


var github = new GitHub(Credentials.gitHub);


module.exports = {


  // COMMITS

  getCommits: function(request, reply) {
    var owner = request.params.owner,
        repoName = request.params.repo,
        branch = request.params.branch;

    var repo = github.getRepo(owner, repoName);
    repo = promisify(repo);

    // default to master branch
    branch = branch ? branch : 'master';

    repo.getCommits(branch)
      .then(function(commits) {
        // make oldest come first
        commits.reverse();
        return reply(commits);
      }, errorHandler.bind({reply: reply}))
      .done();
  },


  // TREE

  getTree: function(request, reply) {
    var owner = request.params.owner,
        repoName = request.params.repo,
        sha = request.params.sha;

    var repo = github.getRepo(owner, repoName);
    repo = promisify(repo);

    var objs = {};

    repo.getTree(sha + '?recursive=true')
      .then(function(tree) {

        // find children of subtrees by using
        // paths to rebuild file system

        var fileSystem = {
          ' files': [],
          ' sha': sha
        };

        var path, folders, currentDir,
            trees = [];

        tree.forEach(function(item) {

          // build directory structure from blob paths
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

            // store object
            objs[item.sha] = item;

          }

          // put trees into their own array
          else {
            trees.push(item);
          }
        });

        // sort trees longest to shortest path
        trees.sort(function(a, b) {
            return (b.path.split('/').length -
                    a.path.split('/').length);
        });


        // build tree relationships
        trees.forEach(function(item) {

          folders = item.path.split('/');

          // traverse model to tree path
          currentDir = fileSystem;
          folders.forEach(function(folder) {
            currentDir = currentDir[folder];
          });

          // set tree sha
          currentDir[' sha'] = item.sha;

          // get children
          item.children = getChildrenSha(currentDir);

          // store object
          objs[item.sha] = item;
        });

        // finally, add top-level tree itself
        var item = {
          sha: fileSystem[' sha']
        };
        item.mode = "040000";
        item.path = "";
        item.type = "tree";

        item.children = getChildrenSha(fileSystem);

        // store object
        objs[item.sha] = item;

        return reply({
          fileSystem: fileSystem,
          objs: objs
        });
      }, errorHandler.bind({reply: reply}))
      .done();
  },


  // BLOB

  getBlob: function(request, reply) {
    var owner = request.params.owner,
        repoName = request.params.repo,
        sha = request.params.sha;

    var repo = github.getRepo(owner, repoName);
    repo = promisify(repo);

    repo.getBlob(sha)
      .then(function(content) {
        return reply(content);
      }, errorHandler.bind({reply: reply}))
      .done();
  },


  // DIFF

  getDiff: function(request, reply) {
    var owner = request.params.owner,
        repoName = request.params.repo,
        baseSha = request.params.baseSha,
        headSha = request.params.headSha;

    var repo = github.getRepo(owner, repoName);
    repo = promisify(repo);

    repo.compare(baseSha, headSha)
      .then(function(diff) {
        return reply(diff.files);
      }, errorHandler.bind({reply: reply}))
      .done();
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


function errorHandler(err) {
  if (err && err.error === 404) {
    return this.reply(
      Boom.notFound(
        "The requested repo could not be found"
      )
    );
  }
  if (err) {
    return this.reply(
      Boom.badImplementation()
    );
  }
}
