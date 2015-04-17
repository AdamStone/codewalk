"use strict";

var React = require('react'),
    Remarkable = require('remarkable'),
    md = new Remarkable();


module.exports = React.createClass({

  getDefaultProps: function() {
    return {
      branch: 'master',
      checkedOut: 0
    };
  },


  render: function() {

    var repo = this.props.repo,
        branch = this.props.branch,
        commits = repo.branches[branch].commits,
        checkedOut = this.props.checkedOut,
        body = null;

    if (commits.length) {
      var commit = repo.objs[commits[checkedOut]],
          message = commit.commit.message;/*.split('\n'),
          heading = message[0];

      body = message.slice(1, message.length)
      // strip ======= or ------- if present
      if (body.length && body[0].match(/^=+$|^-+$/)) {
        body = body.slice(1, body.length)
      }
      body = body.join('\n');*/
    }

    return (
      <div className="commit-message"
           dangerouslySetInnerHTML={
             {__html: md.render(message) }}>
      </div>
    );
  }
});
