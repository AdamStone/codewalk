"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants');

module.exports = {

  gotCommits: function(repo, commits, branch) {

    branch = typeof branch !== 'undefined' ?
                        branch : 'master';

    AppDispatcher.handleServerAction({
      actionType: Constants.Repo.GOT_COMMITS,
      data: {
        repo: repo,
        commits: commits,
        branch: branch
      }
    });
  },

  gotTree: function(repo, tree) {
    AppDispatcher.handleServerAction({
      actionType: Constants.Repo.GOT_TREE,
      data: {
        repo: repo,
        tree: tree
      }
    });
  }

};
