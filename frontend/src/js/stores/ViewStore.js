"use strict";

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants'),
    _ = require('lodash');



var _dispatchToken,
    _data;

var _getInitialState = function() {
  return {
    file: null
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
        sha = data.sha;


    switch(action.actionType) {

      case Constants.View.VIEW_FILE:

        // data: sha
        _data.file = sha;
        break;


      default:
        return true;
    }
    sessionStorage.ViewStore = JSON.stringify(_data);
    ViewStore.emitChange();
    return true;
  });

module.exports = ViewStore;
