"use strict";

var React = require('react'),
    Encoder = require('node-html-encoder').Encoder;

var RepoStore = require('../stores/RepoStore');


var encoder = new Encoder('entity');  // or 'numerical'

module.exports = React.createClass({

  render: function () {

    var content = this.props.content || '';
    content = encoder.htmlEncode(content);

    return (
      <div className="file-view">
        <pre dangerouslySetInnerHTML={
             {__html: content }}></pre>
      </div>
    );
  }
});
