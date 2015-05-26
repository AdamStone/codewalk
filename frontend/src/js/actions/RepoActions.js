"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants');

module.exports = {

  gotCommits: function(owner, repoName, branch,
                       commits, hitLimit) {

    AppDispatcher.handleServerAction({
      actionType: Constants.Repo.GOT_COMMITS,
      data: {
        owner: owner,
        repoName: repoName,
        commits: commits,
        hitLimit: hitLimit,
        branch: branch
      }
    });
  },

  gotTree: function(owner, repoName, tree) {
    AppDispatcher.handleServerAction({
      actionType: Constants.Repo.GOT_TREE,
      data: {
        owner: owner,
        repoName: repoName,
        tree: tree
      }
    });
  },

  gotBlob: function(owner, repoName, sha, content) {
    AppDispatcher.handleServerAction({
      actionType: Constants.Repo.GOT_BLOB,
      data: {
        owner: owner,
        repoName: repoName,
        sha: sha,
        content: content
      }
    });
  },

  gotDiff: function(owner, repoName, sha, files) {
    AppDispatcher.handleServerAction({
      actionType: Constants.Repo.GOT_DIFF,
      data: {
        owner: owner,
        repoName: repoName,
        sha: sha,
        files: files
      }
    });
  }

};
