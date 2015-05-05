"use strict";

var Joi = require('joi');

var handlers = require('./http-handlers');

var schema = {
  owner: Joi.string().regex(/^\w[\w-]+$/).max(39),
  repo: Joi.string().regex(/^\w[\w-]+$/).max(300),
  branch: Joi.string().regex(/^\w[\w-]+$/).max(300),
  sha: Joi.string().regex(/^\b([a-f0-9]{40})\b$/)
};

module.exports = [

// GET COMMITS
  {
    method: 'GET',
    path: '/{owner}/{repo}/commits/{branch?}',
    config: {
      validate: {
        params: {
          owner: schema.owner,
          repo: schema.repo,
          branch: schema.branch
        }
      }
    },
    handler: handlers.getCommits
  },

// GET TREE
  {
    method: 'GET',
    path: '/{owner}/{repo}/tree/{sha}',
    config: {
      validate: {
        params: {
          owner: schema.owner,
          repo: schema.repo,
          sha: schema.sha
        }
      }
    },
    handler: handlers.getTree
  },

// GET BLOB
  {
    method: 'GET',
    path: '/{owner}/{repo}/blob/{sha}',
    config: {
      validate: {
        params: {
          owner: schema.owner,
          repo: schema.repo,
          sha: schema.sha
        }
      }
    },
    handler: handlers.getBlob
  },

// GET DIFF
  {
    method: 'GET',
    path: '/{owner}/{repo}/diff/{baseSha}/{headSha}',
    config: {
      validate: {
        params: {
          owner: schema.owner,
          repo: schema.repo,
          baseSha: schema.sha,
          headSha: schema.sha
        }
      }
    },
    handler: handlers.getDiff
  }
];
