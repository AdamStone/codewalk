"use strict";

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants'),
    Strings = require('../constants/Strings'),
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

  getDispatchToken: function() {
    return _dispatchToken;
  },

  getCommits: function(owner, repoName, branch) {
    branch = typeof branch !== 'undefined' ?
                        branch : 'master';

    var args = Array.prototype.slice.call(arguments)
      .join('');

    if (!_pending.getCommits[args]) {
      _pending.getCommits[args] = true;

      Server.getCommits(owner, repoName, branch)
        .then(function(result) {
          var commits = result.commits,
              hitLimit = parseInt(result.hitLimit);
          RepoActions.gotCommits(owner, repoName, branch,
                                 commits, hitLimit);
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

        // data: owner, repoName, branch, commits, hitLimit

        target = _getOrInit(owner, repoName, branch);
        var commitSha = commits.map(
          function(commit) {
            return commit.sha;
          }
        );
        target.branch.commits = commitSha;

        commits.forEach(function(commit, index) {
          if (index === 0) {
            commit.commit.changed = 'all';
          }
          target.repo.objs[commit.sha] = commit;
        });

        // set a warning message if commit limit was reached
        var limit = data.hitLimit;
        if (limit) {
          target.repo.warnings = (target.repo.warnings || {});
          target.repo.warnings.commitLimit = (
            Strings.warnings.commitLimit(limit)
          );
        }

        break;


      case Constants.Repo.GOT_TREE:

        // data: owner, repoName, tree

        target = _getOrInit(owner, repoName);
        _.extend(target.repo.objs, tree.objs);
        break;


      case Constants.Repo.GOT_BLOB:

        // data: owner, repoName, sha, content

        target = _getOrInit(owner, repoName);
        blob = target.repo.objs[sha];
        blob.content = content;
        break;


      case Constants.Repo.GOT_DIFF:

        // data: owner, repoName, sha, files

        target = _getOrInit(owner, repoName);
        commit = target.repo.objs[sha].commit;
        commit.changed = {};

          files.forEach(function(file) {
            // file params:
            //  additions, deletions, changes (int),
            //  filename, patch, sha,
            //  status (added, modified, deleted)

            commit.changed[file.sha] = file;
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
