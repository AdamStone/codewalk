"use strict";

var React = require('react');

var RepoStore = require('../stores/RepoStore');

module.exports = React.createClass({

  getDefaultProps: function() {

    return {
      checkedOut: 0
    };
  },



  render: function() {

    var commits = this.props.commits,
        checkedOut = this.props.checkedOut;

    var listItems = [];

    for (var i = 0; i < commits.length; i++) {
      var commit = commits[i];
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
