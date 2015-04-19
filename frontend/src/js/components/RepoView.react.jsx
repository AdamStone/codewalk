"use strict";

var React = require('react');

var RepoStore = require('../stores/RepoStore'),
    ViewStore = require('../stores/ViewStore'),
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

        checkedOut = this.props.checkedOut || 0; // TEMP

    var repo = (
      (repos[owner] && repos[owner][repoName]) ||
      { owner: owner, name: repoName }
    );

    var commits = [],
        tree = null,
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
      var commit = commits[checkedOut].commit,
          sha = commit.tree.sha,
          message = commit.message;

      tree = repo.objs[sha];
      if (typeof tree === 'undefined') {

        // commits have loaded, but not trees
        RepoStore.getTree(repo.owner, repo.name, sha);
      }
    }
    else {

      // commits haven't loaded
      RepoStore.getCommits(repo.owner, repo.name, branch);
    }

    // VIEW STATE
    var fileView;
    if (view.file && repo.objs) {
      // repo is initialized and file has been requested

      var blob = repo.objs[view.file];
      if (blob) {
        // file blob exists in repo

        // optimistically show FileView to prevent flicker
        fileView = <FileView content={blob.content}/>;

        if (typeof blob.content === 'undefined') {
          // blob is missing content

          RepoStore.getBlob(repo.owner, repo.name, blob.sha);
        }
      }
    }

    return (
      <div className="viewport">
        <nav className="toolbar">
        </nav>

        <div className="content">

          <div className="left-bar">
            <CommitList commits={commits}
                        checkedOut={checkedOut}/>
          </div>

          <div className="content-view">
            {fileView || <CommitMessage markdown={message}/>}
          </div>

          <div className="right-bar">
            <FileTree tree={tree}
                      viewing={view.file}
                      repo={repo}/>
          </div>

        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getAppState());
  }

});
