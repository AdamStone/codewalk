"use strict";

var EventEmitter = require('events').EventEmitter,
    merge = require('react/lib/merge');

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants'),
    Utils = require('../utils/Utils');


var _dispatchToken,
    _data;

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
  var action = payload.action;

  switch(action.actionType) {



    default:
      return true;
  }
  sessionStorage.RepoStore = JSON.stringify(_data);
  RepoStore.emitChange();
  return true;
});

module.exports = RepoStore;
