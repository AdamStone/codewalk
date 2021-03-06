"use strict";

var React = require('react');

var ViewActions = require('../actions/ViewActions');

module.exports = React.createClass({

  getDefaultProps: function() {

    return {
      checkedOut: 0
    };
  },



  checkout: function(commitIndex) {

    if (commitIndex !== this.props.checkedOut) {
      var repo = this.props.repo,
          sha = this.props.commits[commitIndex].sha;
      ViewActions.checkout(repo.owner, repo.name,
                           commitIndex, sha);
    }
  },



  render: function() {

    var commits = this.props.commits,
        checkedOut = this.props.checkedOut;

    var listItems = [];

    for (var i = 0; i < commits.length; i++) {
      var commit = commits[i],
          message = commit.commit.message.split('\n'),
          heading = message[0],
          body = message.slice(1, message.length);

      if (checkedOut === i) {
        listItems.push(
          <li onClick={this.checkout.bind(this, i)} ref={i} key={i}
              className="checked-out">
            {heading}
          </li>
        );
      }
      else {
        listItems.push(
          <li onClick={this.checkout.bind(this, i)} ref={i} key={i}>
            {heading}
          </li>
        );
      }
    }

    // show spinner until commits load
    var spinner = (
      <div className="spinner-container">
        <span className="fa fa-spin fa-spinner"></span>
      </div>
    );


    return (
      <div className="commit-list">
        <h2 className="header">Commit History</h2>
        <ul>
          {listItems}
        </ul>
        {listItems.length ?
          null : spinner
        }
      </div>
    );
  }
});
