"use strict";

var keyMirror = require('react/lib/keyMirror');

module.exports = {

  Repo: keyMirror({
    GOT_COMMITS: null,
    GOT_TREE: null,
    GOT_BLOB: null,
    GOT_DIFF: null
  }),

  View: keyMirror({
    VIEW_FILE: null,
    TOGGLE_FOLDER: null,
    CHECKOUT: null,
    SET_LAYOUT: null,

    // mobile layout types
    COMMITS_LAYOUT: null,
    CODE_LAYOUT: null
  })

};
