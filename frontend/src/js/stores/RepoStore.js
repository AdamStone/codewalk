"use strict";

var EventEmitter = require('events').EventEmitter,
    merge = require('react/lib/merge');

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants'),
    RepoActions = require('../actions/RepoActions'),
    Utils = require('../utils/Utils'),
    GitHub = require('../utils/GitHubAPI');



var _dispatchToken,
    _data;

var _getInitialState = function() {
  return {
    xrdPlot: {
      owner: "AdamStone",
      name: "xrd-plot",
      objs: {}, // hash-based obj store
      branches: {
        master: {
          commits: []
        }
      }
    }
  };
};


if (!sessionStorage.RepoStore) {
  _data = _getInitialState();
}
else {
  _data = JSON.parse(sessionStorage.RepoStore);
}

var RepoStore = merge(EventEmitter.prototype, {

  get: function() {
    return Utils.copy(_data);
  },

  emitChange: function() {
    this.emit('change');
  },

  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }

});



_dispatchToken = AppDispatcher.register(function(payload) {

  var action = payload.action,
      data = action.data,
      owner = data.owner,
      repo = data.repo,
      branch = data.branch,
      commits = data.commits;


  switch(action.actionType) {

    // USER ACTIONS

    case Constants.Repo.GET_COMMITS:

      // data: owner, repo, branch
      var Repo = GitHub.getRepo(owner, repo);
      Repo.getCommits(_data.xrdPlot.objs)
        .then(function(commits) {
          RepoActions.gotCommits(repo, commits, branch);
        });
      break;



    // SERVER ACTIONS

    case Constants.Repo.GOT_COMMITS:

      // data: repo, commits, branch
      if (!_data[repo].branches[branch]) {
        _data[repo].branches[branch] =  {
          commits: []
        };
      }
      _data[repo].branches[branch].commits = commits;
      break;



    default:
      return true;
  }
  sessionStorage.RepoStore = JSON.stringify(_data);
  RepoStore.emitChange();
  return true;
});

module.exports = RepoStore;
