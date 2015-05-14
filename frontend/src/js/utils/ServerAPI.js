"use strict";

var request = require('superagent'),
    Promise = require('promise');

module.exports = {

  getCommits: function(owner, repo, branch) {
    return new Promise(function(resolve, reject) {

      request
        .get(['', owner, repo, 'commits', branch].join('/'))
        .end(function(err, result) {
          if (err) {
            reject(err);
          }
          else {
            resolve(JSON.parse(result.text));
          }
        });

    });
  },

  getTree: function(owner, repo, sha) {
    return new Promise(function(resolve, reject) {

      request
        .get(['', owner, repo, 'tree', sha].join('/'))
        .end(function(err, result) {
          if (err) {
            reject(err);
          }
          else {
            resolve(JSON.parse(result.text));
          }
        });

    });
  },

  getBlob: function(owner, repo, sha) {
    return new Promise(function(resolve, reject) {

      request
        .get(['', owner, repo, 'blob', sha].join('/'))
        .end(function(err, result) {
          if (err) {
            reject(err);
          }
          else {
            resolve(result.text);
          }
        });

    });
  },

  getDiff: function(owner, repo, baseSha, headSha) {
    return new Promise(function(resolve, reject) {

      request
        .get(['', owner, repo, 'diff', baseSha, headSha].join('/'))
        .end(function(err, result) {
          if (err) {
            reject(err);
          }
          else {
            resolve(JSON.parse(result.text));
          }
        });

    });
  }

};
