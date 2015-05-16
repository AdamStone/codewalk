"use strict";

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants'),
    RepoStore = require('./RepoStore'),
    walkerFactory = require('../utils/WalkerFactory');



var _dispatchToken,
    _data;

var _getInitialState = function() {
  return {
    file: null,
    checkedOut: 0,
    expanded: {}
  };
};

if (!sessionStorage.ViewStore) {
  _data = _getInitialState();
}
else {
  _data = JSON.parse(sessionStorage.ViewStore);
}

var ViewStore = _.extend({

  get: function() {
    return _.clone(_data);
  },

  getDispatchToken: function() {
    return _dispatchToken;
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
        sha = data.sha,
        owner = data.owner,
        repoName = data.repoName,
        commitIndex = data.commitIndex;

    var repo, commit, tree, changed;
    switch(action.actionType) {

      case Constants.View.VIEW_FILE:

        // data: sha

        _data.file = sha;
        break;


      case Constants.View.TOGGLE_FOLDER:

        // data: sha

        _data.expanded[sha] = !_data.expanded[sha];
        break;


      case Constants.View.CHECKOUT:

        // data: owner, repoName, commitIndex, sha

        // Set new checkedOut and close any open file

        _data.checkedOut = commitIndex;
        _data.file = null;

        // Auto-expand folders containing changes

        repo = RepoStore.get()[owner][repoName];
        commit = repo.objs[sha].commit;
        tree = repo.objs[commit.tree.sha];
        changed = commit.changed;

        autoExpand(repo, tree, changed);
        break;


      // STORE DEPENDENCIES


      case Constants.Repo.GOT_TREE:

        // data: owner, repoName, tree

        AppDispatcher.waitFor([RepoStore.getDispatchToken()]);

        if (_data.checkedOut === 0) {

          // First commit tree, autoexpand all folders

          repo = RepoStore.get()[owner][repoName];
          tree = repo.objs[data.tree.fileSystem[" sha"]];
          changed = 'all';

          autoExpand(repo, tree, changed);
        }
        break;


      case Constants.Repo.GOT_DIFF:

        // data: owner, repoName, sha

        AppDispatcher.waitFor([RepoStore.getDispatchToken()]);

        // Auto-expand folders containing changes

        repo = RepoStore.get()[owner][repoName];
        commit = repo.objs[sha].commit;
        tree = repo.objs[commit.tree.sha];
        changed = commit.changed;

        autoExpand(repo, tree, changed);
        break;


      default:
        return true;
    }
    sessionStorage.ViewStore = JSON.stringify(_data);
    ViewStore.emitChange();
    return true;
  });

module.exports = ViewStore;




function autoExpand(repo, tree, changed) {

  var expanded = {}; // reset

  if (!changed) {
    return;
  }

  // SETUP walker to find folders containing changed
  var walker = walkerFactory(tree, repo.objs);

  walker.onBlob = function(obj) {
    var sha = obj.sha;
    if (changed === 'all' || sha in changed) {
      this.containsChanged = true;
    }
  };

  walker.onTree = function(obj, subWalker) {

    subWalker.walk();

    if (subWalker.containsChanged) {
      this.containsChanged = true;
      expanded[obj.sha] = true;
    }
  };

  // START walk
  walker.walk();

  // SET new expanded state
  _data.expanded = expanded;
}
