"use strict";

var React = require('react'),
    Router = require('react-router'),
    Navigation = Router.Navigation,
    Link = Router.Link;

var RepoStore = require('../stores/RepoStore'),
    ViewStore = require('../stores/ViewStore'),
    ViewActions = require('../actions/ViewActions'),
    Constants = require('../constants/Constants'),
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

  mixins: [Navigation],

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

  setLayout: function(layout) {
    ViewActions.setLayout(layout);
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

    var layoutWrapper,
        commitsButtonClass = 'fa fa-list commits-layout-button',
        messageButtonClass = 'fa fa-book message-layout-button',
        codeButtonClass = 'fa fa-code code-layout-button';

    switch(this.state.view.layout) {

      case Constants.View.COMMITS_LAYOUT:
        layoutWrapper = 'commits-layout';
        commitsButtonClass += ' active';
        break;

      case Constants.View.MESSAGE_LAYOUT:
        layoutWrapper = 'message-layout';
        messageButtonClass += ' active';
        break;

      case Constants.View.CODE_LAYOUT:
        layoutWrapper = 'code-layout';
        codeButtonClass += ' active';
        break;
    }

    var layoutButtons = [
      <button className={commitsButtonClass}
            title="Show commit history"
            onClick={
              this.setLayout.bind(this,
                Constants.View.COMMITS_LAYOUT)
            }></button>,

      <button className={messageButtonClass}
            title="Show commit message for this commit"
            onClick={
              this.setLayout.bind(this,
                Constants.View.MESSAGE_LAYOUT)
            }></button>,

      <button className={codeButtonClass}
            title="Show source code for this commit"
            onClick={
              this.setLayout.bind(this,
                Constants.View.CODE_LAYOUT)
            }></button>
    ];


    layoutButtons = layoutButtons.map(
      function(button, i) {
        return (
        <li key={i}
            className="layout-button">
          { button }
        </li>
        );
      }
    );



    return (
      <div className="viewport">

        {/* NAVIGATION */}
        <nav className="navbar">
          <ul>

            <li>
              <Link to="app">
                Codewalk
              </Link>
            </li>

            <li className="button-group">
              <ul>
                { layoutButtons }
              </ul>
            </li>

          </ul>
        </nav>

        {/* CONTENT */}
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
