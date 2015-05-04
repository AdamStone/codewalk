"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants');

module.exports = {

  checkout: function(commitIndex) {

    AppDispatcher.handleViewAction({
      actionType: Constants.View.CHECKOUT,
      data: {
        commitIndex: commitIndex
      }
    });
  },



  toggleFolder: function(sha) {

    AppDispatcher.handleViewAction({
      actionType: Constants.View.TOGGLE_FOLDER,
      data: {
        sha: sha
      }
    });
  },



  viewFile: function(sha) {

    AppDispatcher.handleViewAction({
      actionType: Constants.View.VIEW_FILE,
      data: {
        sha: sha
      }
    });
  },



  closeFileView: function() {

    AppDispatcher.handleViewAction({
      actionType: Constants.View.VIEW_FILE,
      data: {
        sha: null
      }
    });
  }

};
