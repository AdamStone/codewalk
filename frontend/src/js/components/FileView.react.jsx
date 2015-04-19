"use strict";

var React = require('react'),
    Encoder = require('node-html-encoder').Encoder;

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



  render: function () {

    var content = this.props.content || '';
    content = encoder.htmlEncode(content);

    return (
      <div style={{overflow: 'auto',
                   height: '100%'}}>

        {/* CLOSE BUTTON */}
        <span className="fa fa-close close-button"
              onClick={this.close}
              style={{position: 'absolute',
                      top: '0.5em',
                      right: '1.5em',
                      padding: '0.5em',
                      cursor: 'pointer'}}/>

        {/* CONTENT */}
        <div className="file-view">
          <pre dangerouslySetInnerHTML={
               {__html: content }}></pre>
        </div>
      </div>
    );
  },



  componentDidMount: function() {
    document.addEventListener("keydown", this.handleKeyDown);
  },



  componentWillUnmount: function() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

});
