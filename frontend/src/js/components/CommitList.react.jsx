"use strict";

var React = require('react');

var RepoStore = require('../stores/RepoStore');

module.exports = React.createClass({

  getDefaultProps: function() {

    return {
      branch: 'master',
      checkedOut: 0
    };
  },



  componentDidMount: function() {

    // If commits aren't already in store,
    // ask it to get them.
    var branchName = this.props.branch,
        repo = this.props.repo,
        branch = repo.branches[branchName];

    if (branch && !branch.commits.length) {
      RepoStore.getCommits(repo.owner,
                             repo.name,
                             branchName);
    }
  },



  render: function() {

    var repo = this.props.repo,
        branch = this.props.branch,
        commits = repo.branches[branch].commits,
        checkedOut = this.props.checkedOut;

    var listItems = [];

    for (var i = 0; i < commits.length; i++) {
      var commit = repo.objs[commits[i]];
      var message = commit.commit.message.split('\n');
      var heading = message[0];
      var body = message.slice(1, message.length);

      if (checkedOut === i) {
        listItems.push(
          <li key={i} className="checked-out">
            {heading}
          </li>
        );
      }
      else {
        listItems.push(
          <li key={i}>
            {heading}
          </li>
        );
      }
    }

    return (
      <ul className="commit-list">
        {listItems}
      </ul>
    );
  }
});
