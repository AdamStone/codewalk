"use strict";

var keyMirror = require('react/lib/keyMirror');

module.exports = {

  Repo: keyMirror({
    GOT_COMMITS: null,
    GOT_TREE: null,
    GOT_BLOB: null
  }),

  View: keyMirror({
    VIEW_FILE: null
  })

};
