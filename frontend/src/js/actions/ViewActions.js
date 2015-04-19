"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    Constants = require('../constants/Constants');

module.exports = {

  viewFile: function(sha) {

    AppDispatcher.handleViewAction({
      actionType: Constants.View.VIEW_FILE,
      data: {
        sha: sha
      }
    });
  }
};
