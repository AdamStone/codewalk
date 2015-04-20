"use strict";

var React = require('react'),
    Encoder = require('node-html-encoder').Encoder,
    hljs = require('highlight.js');

var RepoStore = require('../stores/RepoStore'),
    ViewActions = require('../actions/ViewActions');

var encoder = new Encoder('entity');  // or 'numerical'

module.exports = React.createClass({



  close: function() {
    ViewActions.closeFileView();
  },



  handleKeyDown: function(e) {
    if (e.keyCode === 27) {  // ESC
      this.close();
    }
  },



  highlight: function() {
    var code = this.refs.code.getDOMNode();
    hljs.highlightBlock(code);
  },



  componentDidUpdate: function() {
    this.highlight();
  },



  render: function () {

    var content = this.props.content || '';
    content = encoder.htmlEncode(content);


    var lang = null,
        filename = this.props.filename;

    // if filename with extension provided,
    // set extension as class for higlight.js
    if (filename && filename.split('.').length > 1) {
      lang = filename.split('.').reverse()[0];
    }

    var code = <code ref="code"
                     className={lang}
                     dangerouslySetInnerHTML={
                       {__html: content }}/>;
    return (
      <div style={{overflow: 'auto',
                   height: '100%'}}>

        {/* CLOSE BUTTON */}
        <span className="fa fa-close close-button"
              onClick={this.close}
              style={{position: 'absolute',
                      top: '0.5em',
                      color: '#eee',
                      textShadow: '0 0 1px #000',
                      right: '1.5em',
                      padding: '0.5em',
                      cursor: 'pointer'}}/>

        {/* CONTENT */}
        <div className="file-view">
          <pre>
            {code}
          </pre>
        </div>
      </div>
    );
  },



  componentDidMount: function() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.highlight();
  },



  componentWillUnmount: function() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

});
