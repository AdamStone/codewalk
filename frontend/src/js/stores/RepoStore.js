"use strict";

var EventEmitter = require('events').EventEmitter,
    merge = require('react/lib/merge');

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants'),
    RepoActions = require('../actions/RepoActions'),
    Utils = require('../utils/Utils'),
    GitHub = require('../utils/GitHubAPI');



var _dispatchToken,
    _data,
    Repo;

var _getInitialState = function() {
  return {
    'xrd-plot': {
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

  getCommits: function(owner, repo, branch) {
    branch = typeof branch !== 'undefined' ?
                        branch : 'master';

    Repo = GitHub.getRepo(owner, repo);
    Repo.getCommits(_data[repo].objs)
      .then(function(commits) {
        RepoActions.gotCommits(repo, commits, branch);
      }).done();
  },

  getTree: function(owner, repo, sha) {
    Repo = GitHub.getRepo(owner, repo);
    Repo.getTree(sha, _data[repo].objs)
      .then(function(tree) {
        RepoActions.gotTree(repo, tree);
      }).done();
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



_dispatchToken = AppDispatcher.register(
  function(payload) {

    var action = payload.action,
        data = action.data,
        repo = data.repo,
        branch = data.branch,
        commits = data.commits;


    switch(action.actionType) {

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
    console.log('emit changed');
    sessionStorage.RepoStore = JSON.stringify(_data);
    RepoStore.emitChange();
    return true;
  });

module.exports = RepoStore;
