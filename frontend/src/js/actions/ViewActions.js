"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants');

module.exports = {

  checkout: function(owner, repoName, commitIndex, sha) {

    AppDispatcher.handleViewAction({
      actionType: Constants.View.CHECKOUT,
      data: {
        owner: owner,
        repoName: repoName,
        commitIndex: commitIndex,
        sha: sha
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
  },



  setLayout: function(layout) {

    AppDispatcher.handleViewAction({
      actionType: Constants.View.SET_LAYOUT,
      data: {
        layout: layout
      }
    });
  },


};
