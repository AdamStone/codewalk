"use strict";

var React = require('react'),
    Remarkable = require('remarkable'),
    md = new Remarkable();


module.exports = React.createClass({

  render: function() {
    var markdown = (this.props.markdown ?
                    '# ' + this.props.markdown : null);
    return (
      <div className="commit-message"
           dangerouslySetInnerHTML={
             {__html: md.render(markdown) }}>
      </div>
    );
  }
});
