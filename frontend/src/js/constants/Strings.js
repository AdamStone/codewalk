"use strict";

module.exports = {
  warnings: {
    commitLimit: function(limit) {
      return ('This repo contains more than ' + limit + ' commits, ' +
              'but only the last ' + limit + ' will be shown.');
    }
  }
};
