"use strict";

var promisify = require('promisify-node'),
    GitHub = require('github'),
    Boom = require('boom');

var credentials = require('../config/gitignore.credentials'),
    constants = require('../config/constants');


var github = new GitHub({
  // required
  version: "3.0.0",
  // optional
  protocol: "https",
  host: "api.github.com",
  timeout: constants.github.TIMEOUT,
  headers: {
    "user-agent": "AdamStone/Codewalk"
  }
});

github.authenticate(credentials.gitHub);

var api = {
  repos: promisify(github.repos),
  gitdata: promisify(github.gitdata)
};


module.exports = {

  // COMMITS

  getCommits: function(request, reply) {
    var owner = request.params.owner,
        repoName = request.params.repo,
        branch = request.params.branch;

    var options = {
      user: owner,
      repo: repoName,
      sha: branch || 'master',
      per_page: constants.github.PER_PAGE
    };

    // use promises to handle multiple pages
    var promiseChain,
        allCommits = [];

    // predefine API call success handler
    var handleCommits = function(commits) {

      // save commits from this call
      allCommits = allCommits.concat(commits);

      // if link header present ...
      var link = commits.meta.link;
      if (link) {

        // with rel="next" ...
        var next = link.match(/<.*>; rel="next"/);
        if (next) {

          // then more commits are on the next page ...
          var nextPage = parseInt(
            next[0].match(/(?:\?|&)page=([0-9]+)/)[1]
          );

          // if not over the page limit ...
          if (nextPage <= constants.github.PAGE_LIMIT) {

            // append another link to the promise chain ...
            promiseChain = promiseChain
              .then(handleCommits, function(err) {
                return reply(boom(err));
              });

            // and GET next page and return Promise
            options.page = nextPage;
            return api.repos.getCommits(options);
          }

          // else page limit reached, so append .done()
          else {
            promiseChain = promiseChain
              .done(function() {
                // make oldest come first
                allCommits.reverse();
                var commitLimit = (constants.github.PER_PAGE *
                                   constants.github.PAGE_LIMIT);
                return reply({
                  commits: allCommits,
                  hitLimit: commitLimit
                });
              });

            // and finish
            return true;
          }
        }
      }

      // else no more pages, so append .done()
      promiseChain = promiseChain
        .done(function() {
          // make oldest come first
          allCommits.reverse();
            return reply({
              commits: allCommits,
              hitLimit: false
            });
          });

      // and finish
      return true;
    };


    // START chain execution
    promiseChain = api.repos.getCommits(options)
      .then(handleCommits, function(err) {
        return reply(boom(err));
      });
  },


  // TREE

  getTree: function(request, reply) {
    var owner = request.params.owner,
        repoName = request.params.repo,
        sha = request.params.sha;

    var options = {
      user: owner,
      repo: repoName,
      sha: sha,
      recursive: true
    };

    var objs = {};

    api.gitdata.getTree(options)
      .then(function(result) {

        // find children of subtrees by using
        // paths to rebuild file system

        var fileSystem = {
          ' files': [],
          ' sha': sha
        };

        var path, folders, currentDir,
            trees = [];

        result.tree.forEach(function(item) {

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
      }, function(err) {
        return reply(boom(err));
      })
      .done();
  },


  // BLOB

  getBlob: function(request, reply) {
    var owner = request.params.owner,
        repoName = request.params.repo,
        sha = request.params.sha;

    var options = {
      user: owner,
      repo: repoName,
      sha: sha,
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    };

    api.gitdata.getBlob(options)
      .then(function(response) {
        return reply(response.content);
      }, function(err) {
        return reply(boom(err));
      })
      .done();
  },


  // DIFF

  getDiff: function(request, reply) {
    var owner = request.params.owner,
        repoName = request.params.repo,
        baseSha = request.params.baseSha,
        headSha = request.params.headSha;

    var options = {
      user: owner,
      repo: repoName,
      base: baseSha,
      head: headSha
    };

    api.repos.compareCommits(options)
      .then(function(result) {
        return reply(result.files);
      }, function(err) {
        return reply(boom(err));
      })
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


function boom(err) {
  if (err.error === 404) {
    return Boom.notFound(
        "The requested repo could not be found"
    );
  }
  else {
    return Boom.badImplementation();
  }
}
