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
      ViewActions.checkout(commitIndex);
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

    return (
      <ul className="commit-list">
        {listItems}
      </ul>
    );
  }
});
