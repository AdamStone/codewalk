"use strict";

// node_modules
var React = require('react');

// flux
var RepoStore = require('../stores/RepoStore'),
    ViewStore = require('../stores/ViewStore'),
    Constants = require('../constants/Constants');

// components
var Navbar = require('./Navbar.react.jsx'),
    CommitList = require('./CommitList.react.jsx'),
    CommitMessage = require('./CommitMessage.react.jsx'),
    FileTree = require('./FileTree.react.jsx'),
    FileView = require('./FileView.react.jsx');


function getAppState() {
  return {
    repos: RepoStore.get(),
    view: ViewStore.get()
  };
};


var stores = [RepoStore, ViewStore];


module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return getAppState();
  },

  componentDidMount: function() {
    for (var i=0; i<stores.length; i++) {
      stores[i].addChangeListener(this._onChange);
    };
  },

  componentWillUnmount: function() {
    for (var i=0; i<stores.length; i++) {
      stores[i].removeChangeListener(this._onChange);
    };
  },


  render: function() {
    var repos = this.state.repos,
        view = this.state.view,

        router = this.context.router,
        params = router.getCurrentParams(),
        owner = params.owner,
        repoName = params.repo,
        branch = params.branch || 'master',

        checkedOut = view.checkedOut;

    var repo = (
      (repos[owner] && repos[owner][repoName]) ||
      { owner: owner, name: repoName }
    );

    var commits = [],
        commit = null,
        sha = null,
        tree = null,
        changed = {},
        message = '';

    // get commits, if repo known
    if (repo.branches && repo.branches[branch]) {
      var commitSha = repo.branches[branch].commits;

      commits = commitSha.map(function(sha) {
        return repo.objs[sha];
      });
    }

    // get tree, if commits known
    if (commits.length) {
      commit = commits[checkedOut].commit;
      sha = commit.tree.sha;
      changed = commit.changed;
      message = commit.message;

      tree = repo.objs[sha];
      if (typeof tree === 'undefined') {

        // commits have loaded, but not trees
        RepoStore.getTree(repo.owner, repo.name, sha);
      }
      else {

        // get diff if missing
        if (checkedOut > 0 && !commits[checkedOut].commit.changed) {

          var head = commits[checkedOut].sha,
              base = commits[checkedOut-1].sha;

          RepoStore.getDiff(repo.owner, repo.name,
                              base, head);
        }
      }
    }
    else {

      // commits haven't loaded
      RepoStore.getCommits(repo.owner, repo.name, branch);
    }

    // VIEW STATE
    var fileView = null;
    if (view.file && repo.objs) {
      // repo is initialized and file has been requested

      var blob = repo.objs[view.file];
      if (blob) {
        // file blob exists in repo

        // optimistically show FileView to prevent flicker
        var filename = blob.path.split('/').reverse()[0];
        fileView = (
          <div className="scroller file-view-scroller">
            <FileView filename={filename}
                      commit={commit}
                      blob={blob}/>
          </div>
        );

        if (typeof blob.content === 'undefined') {
          // blob is missing content

          RepoStore.getBlob(repo.owner, repo.name, blob.sha);
        }
      }
    }


    // Layout selection buttons for small screens

    var layoutWrapper;

    switch(this.state.view.layout) {

      case Constants.View.COMMITS_LAYOUT:
        layoutWrapper = 'commits-layout';
        break;

      case Constants.View.MESSAGE_LAYOUT:
        layoutWrapper = 'message-layout';
        break;

      case Constants.View.CODE_LAYOUT:
        layoutWrapper = 'code-layout';
        break;
    }

    return (
      <div className="viewport">

        <Navbar view={this.state.view} repo={repo}/>

        <div className="content">

          {/* Wrapper selects layout CSS */}
          <div className={layoutWrapper}>

            <div className="left-bar">
              <CommitList repo={repo}
                          commits={commits}
                          checkedOut={checkedOut}/>
            </div>

            <div className="content-view">
              <div className="scroller">
                <CommitMessage markdown={message}/>
              </div>

            </div>

            <div className="right-bar">

                <FileTree tree={tree}
                          changed={changed}
                          expanded={view.expanded}
                          viewing={view.file}
                          repo={repo}/>
            </div>

            {fileView}

          </div>

        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getAppState());
  }

});
