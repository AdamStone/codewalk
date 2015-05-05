"use strict";

var request = require('superagent'),
    promisify = require('promisify-node');

module.exports = promisify({

  getCommits: function(owner, repo, branch, callback) {
    request
      .get(['', owner, repo, 'commits', branch].join('/'))
      .end(function(err, result) {
        if (err) {
          return callback(err);
        }
        return callback(null, JSON.parse(result.text));
      });
  },

  getTree: function(owner, repo, sha, callback) {
    request
      .get(['', owner, repo, 'tree', sha].join('/'))
      .end(function(err, result) {
        if (err) {
          return callback(err);
        }
        return callback(null, JSON.parse(result.text));
      });
  },

  getBlob: function(owner, repo, sha, callback) {
    request
      .get(['', owner, repo, 'blob', sha].join('/'))
      .end(function(err, result) {
        if (err) {
          return callback(err);
        }
        return callback(null, result.text);
      });
  },

  getDiff: function(owner, repo, baseSha, headSha, callback) {
    request
      .get(['', owner, repo, 'diff', baseSha, headSha].join('/'))
      .end(function(err, result) {
        if (err) {
          return callback(err);
        }
        return callback(null, JSON.parse(result.text));
      });
  }

});
