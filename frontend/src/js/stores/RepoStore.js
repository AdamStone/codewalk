"use strict";

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants'),
    RepoActions = require('../actions/RepoActions'),
    Server = require('../utils/ServerAPI');


var _dispatchToken,
    _data;

var _pending = {
  getCommits: {},
  getTree: {},
  getBlob: {},
  getDiff: {}
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
      Server.getCommits(owner, repoName, branch)
        .then(function(commits) {
          RepoActions.gotCommits(
            owner, repoName, commits, branch);
        }, errorHandler)
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

      Server.getTree(owner, repoName, sha)
        .then(function(tree) {
          RepoActions.gotTree(owner, repoName, tree);
        }, errorHandler)
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

      Server.getBlob(owner, repoName, sha)
        .then(function(content) {
          RepoActions.gotBlob(owner, repoName, sha, content);
        }, errorHandler)
        .done(function() {
          delete _pending.getBlob[args];
        });
    }
  },

  getDiff: function(owner, repoName, baseSha, headSha) {

    var args = Array.prototype.slice.call(arguments)
      .join('');

    if (!_pending.getDiff[args]) {
      _pending.getDiff[args] = true;

      Server.getDiff(owner, repoName, baseSha, headSha)
        .then(function(files) {
          RepoActions.gotDiff(owner, repoName, headSha, files);
        }, errorHandler)
        .done(function() {
          delete _pending.getDiff[args];
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

    // payload data vars
    var action = payload.action,
        data = action.data,
        owner = data.owner,
        repoName = data.repoName,
        branch = data.branch,
        content = data.content,
        tree = data.tree,
        commits = data.commits,
        files = data.files,
        sha = data.sha;

    var target, commit, blob;
    switch(action.actionType) {

      case Constants.Repo.GOT_COMMITS:

        // data: owner, repo, commits, branch

        target = _getOrInit(owner, repoName, branch);
        var commitSha = commits.map(
          function(commit) {
            return commit.sha;
          }
        );
        target.branch.commits = commitSha;
        commits.forEach(function(commit, index) {
          if (index === 0) {
            commit.commit.diffed = 'all';
          }
          target.repo.objs[commit.sha] = commit;
        });

        break;


      case Constants.Repo.GOT_TREE:

        // data: owner, repo, tree

        target = _getOrInit(owner, repoName);
        _.extend(target.repo.objs, tree.objs);
        break;


      case Constants.Repo.GOT_BLOB:

        // data: owner, repo, sha, content

        target = _getOrInit(owner, repoName);
        blob = target.repo.objs[sha];
        blob.content = content;
        break;


      case Constants.Repo.GOT_DIFF:

        // data: owner, repo, sha, files

        target = _getOrInit(owner, repoName);
        commit = target.repo.objs[sha].commit;
        commit.diffed = {};

          files.forEach(function(file) {
            // file params:
            //  additions, deletions, changes (int),
            //  filename, patch, sha,
            //  status (added, modified, deleted)

            commit.diffed[file.sha] = file;
          });
        break;


      default:
        return true;
    }
    sessionStorage.RepoStore = JSON.stringify(_data);
    RepoStore.emitChange();
    return true;
  });

module.exports = RepoStore;


function errorHandler(err) {
  // TODO display errors
  console.log(JSON.parse(err.response.text));
}
