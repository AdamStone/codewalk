"use strict";

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants'),
    RepoActions = require('../actions/RepoActions'),
    GitHub = require('../utils/GitHubAPI'),
    _ = require('lodash');


var _dispatchToken,
    _data,
    Repo;

var _pending = {
  getCommits: {},
  getTree: {},
  getBlob: {}
};


var _getOrInit = function(owner, repoName, branch) {
  branch = typeof branch !== 'undefined' ?
                      branch : 'master';

  var _owner = _data[owner] || {};
  _data[owner] = _owner;

  var _repo = _owner[repoName] || {
    branches: {},
    objs: {},
    owner: owner,
    name: repoName
  };
  _owner[repoName] = _repo;

  var _branch = _repo.branches[branch] || {};
  _repo.branches[branch] = _branch;

  return {
    owner: _owner,
    repo: _repo,
    branch: _branch
  };
};


var _getInitialState = function() {
  return {

  };
};


if (!sessionStorage.RepoStore) {
  _data = _getInitialState();
}
else {
  _data = JSON.parse(sessionStorage.RepoStore);
}

var RepoStore = _.extend({

  get: function() {
    return _data;
  },

  getCommits: function(owner, repoName, branch) {
    branch = typeof branch !== 'undefined' ?
                        branch : 'master';

    var args = Array.prototype.slice.call(arguments)
      .join('');

    if (!_pending.getCommits[args]) {
      _pending.getCommits[args] = true;

      Repo = GitHub.getRepo(owner, repoName);
      Repo.getCommits(branch)
        .then(function(commits) {
          RepoActions.gotCommits(
            owner, repoName, commits, branch);
        })
        .done(function() {
          delete _pending.getCommits[args];
        });
    }
  },

  getTree: function(owner, repoName, sha) {

    var args = Array.prototype.slice.call(arguments)
      .join('');

    if (!_pending.getTree[args]) {
      _pending.getTree[args] = true;

      Repo = GitHub.getRepo(owner, repoName);
      Repo.getTree(sha)
        .then(function(tree) {
          RepoActions.gotTree(owner, repoName, tree);
        })
        .done(function() {
          delete _pending.getTree[args];
        });
    }
  },

  getBlob: function(owner, repoName, sha) {

    var args = Array.prototype.slice.call(arguments)
      .join('');

    if (!_pending.getBlob[args]) {
      _pending.getBlob[args] = true;

      Repo = GitHub.getRepo(owner, repoName);
      Repo.getBlob(sha)
        .then(function(content) {
          RepoActions.gotBlob(owner, repoName, sha, content);
        })
        .done(function() {
          delete _pending.getBlob[args];
        });
    }
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

}, EventEmitter.prototype);



_dispatchToken = AppDispatcher.register(
  function(payload) {

    var action = payload.action,
        data = action.data,
        owner = data.owner,
        repoName = data.repoName,
        branch = data.branch,
        sha = data.sha;


    var target;
    switch(action.actionType) {

      case Constants.Repo.GOT_COMMITS:

        // data: owner, repo, commits, branch
        var commits = data.commits;

        target = _getOrInit(owner, repoName, branch);
        var commitSha = commits.map(
          function(commit) {
            return commit.sha;
          }
        );
        target.branch.commits = commitSha;
        commits.forEach(function(commit) {
          target.repo.objs[commit.sha] = commit;
        });

        break;


      case Constants.Repo.GOT_TREE:

        // data: owner, repo, tree
        var tree = data.tree;

        target = _getOrInit(owner, repoName);
        _.extend(target.repo.objs, tree.objs);
        break;


      case Constants.Repo.GOT_BLOB:

        // data: owner, repo, sha, content
        var content = data.content;

        target = _getOrInit(owner, repoName);
        var blob = target.repo.objs[sha];
        blob.content = content;
        break;


      default:
        return true;
    }
    sessionStorage.RepoStore = JSON.stringify(_data);
    RepoStore.emitChange();
    return true;
  });

module.exports = RepoStore;
