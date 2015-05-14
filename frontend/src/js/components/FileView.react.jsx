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



  highlight: function() {
    var code = this.refs.code.getDOMNode();
    hljs.highlightBlock(code);
  },



  componentDidUpdate: function() {
    this.highlight();
  },



  render: function () {

    var blob = this.props.blob,
        commit = this.props.commit,
        content = encoder.htmlEncode(
          blob.content || ''
        );

    if (content) {
      if (commit.diffed === 'all') {
        // first commit
        content = markAll(content, 'changed');
      }
      else {
        var diff = (commit.diffed && commit.diffed[blob.sha]),
            patch = (diff && diff.patch);

        if (patch) {
          content = applyPatch(patch, content);
        }
        else {
          content = markAll(content, 'unchanged');
        }
      }
    }

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
                      zIndex: '100',
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


function markAll(content, className) {

  // split file content into lines
  var fileLines = content.split('&#10;');

  for (var j=0; j < fileLines.length; j++) {

    fileLines[j] = [
      '<span class="' + className + '">',
        fileLines[j],
      '</span>'
    ].join('');
  }

  return fileLines.join('&#10;');
}


function applyPatch(patch, content) {

  // parse patch
  var parsed = patch.split(
    /@@\ -[0-9]+(?:,[0-9]+)?\ \+([0-9]+)(?:,[0-9]+)?\ @@.*/g
  );
  parsed.shift();  // drop initial empty string

  // split file content into lines
  var fileLines = content.split('&#10;');

  // CHANGED LINES
  if (parsed.length) {
    var sections = parsed.length/2;

    // for each @@ section of file patch
    for (var s=0; s < sections; s++) {
      var startLine = parsed[2*s + 0] - 1,
          lines = parsed[2*s + 1]

            // strip leading \n
            .replace(/^\n/, '')

            // split into lines
            .split('\n');

      // filter out deletions and end-of-file warning
      lines = lines.filter(function(line) {
        if (line[0] === '-' ||
            line === '\\ No newline at end of file') {
          return false;
        }
        else {
          return true;
        }
      });

      // wrap each changed line in <span class="changed">
      for (var i=0; i < lines.length; i++) {

        if (lines[i][0] === '+') {

          fileLines[i + startLine] = [
            '<span class="changed">',
              fileLines[i + startLine],
            '</span>'
          ].join('');
        }
      }
    }
  }

  // UNCHANGED LINES
  for (var j=0; j < fileLines.length; j++) {

    if (!fileLines[j].match(/^<span class="changed">/)) {

      fileLines[j] = [
        '<span class="unchanged">',
          fileLines[j],
        '</span>'
      ].join('');
    }
  }

  return fileLines.join('&#10;');
}
