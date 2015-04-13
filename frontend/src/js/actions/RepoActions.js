"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants');

module.exports = {

  // USER ACTIONS

  getCommits: function(owner, repo, branch) {

    branch = typeof branch !== 'undefined' ?
                        branch : 'master';

    AppDispatcher.handleViewAction({
      actionType: Constants.Repo.GET_COMMITS,
      data: {
        owner: owner,
        repo: repo,
        branch: branch
      }
    });
  },



  // SERVER ACTIONS

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
  }

};
