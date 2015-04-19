"use strict";

var React = require('react'),
    Remarkable = require('remarkable'),
    md = new Remarkable();


module.exports = React.createClass({

  render: function() {
    var markdown = this.props.markdown;

          /*.split('\n'),
          heading = message[0];

      body = message.slice(1, message.length)
      // strip ======= or ------- if present
      if (body.length && body[0].match(/^=+$|^-+$/)) {
        body = body.slice(1, body.length)
      }
      body = body.join('\n');*/

    return (
      <div className="commit-message"
           dangerouslySetInnerHTML={
             {__html: md.render(markdown) }}>
      </div>
    );
  }
});
