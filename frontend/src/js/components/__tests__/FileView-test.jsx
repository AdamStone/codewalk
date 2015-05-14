jest.dontMock('../FileView.react.jsx');

// globals
_ = require('lodash');
hljs = require('highlight.js');

var React, TestUtils, Component, FileView, ViewActions,
    filename, blob, commit, code, innerHtml, Encoder, encoder,
    RepoStore, repo;

describe('FileView', function() {

  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../FileView.react.jsx');
    ViewActions = require('../../actions/ViewActions');
    RepoStore = require('../../stores/RepoStore');
    Encoder = require('node-html-encoder').Encoder;
    encoder = new Encoder('entity');
    filename = 'somefile';

    repo = RepoStore.get()['TestOwner']['jest-test-repo'];
    commit = repo.objs['diffed commit sha'];
  });



  it('renders available blob content',

    function() {

      blob = repo.objs['bold blob sha'];

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename}
                   commit={commit}
                   blob={blob}/>
      );

      code = TestUtils.findRenderedDOMComponentWithTag(
        FileView, 'code');

      innerHtml = code.props.dangerouslySetInnerHTML.__html
      expect(innerHtml).toBeTruthy();
    });



  it('adds file extension to <code> className',

    function() {

      blob = repo.objs['bold blob sha'];
      filename = 'some-js-file.js';

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename}
                   commit={commit}
                   blob={blob}/>
      );

      code = TestUtils.findRenderedDOMComponentWithTag(
        FileView, 'code');

      expect(code.props.className).toBe('js');
    });



  it('escapes html content',

    function() {

      blob = repo.objs['bold blob sha'];

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename}
                   commit={commit}
                   blob={blob}/>
      );

      code = TestUtils.findRenderedDOMComponentWithTag(
        FileView, 'code');

      innerHtml = code.props.dangerouslySetInnerHTML.__html
      expect(innerHtml).toMatch(
        encoder.htmlEncode(blob.content)
      );
    });



  it('closes on ESC keydown',

    function() {

      blob = repo.objs['bold blob sha'];

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename}
                   commit={commit}
                   blob={blob}/>
      );

      var event = document.createEvent("HTMLEvents");
      //    initEvent(type, bubbles, cancalable)
      event.initEvent("keydown", false, true);
      event.keyCode = 27;
      document.dispatchEvent(event);

      expect(ViewActions.closeFileView).toBeCalled();
    });



  it('closes on X span click',

    function() {

      blob = repo.objs['bold blob sha'];

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename}
                   commit={commit}
                   blob={blob}/>
      );

      var close = TestUtils.findRenderedDOMComponentWithClass(
        FileView, 'close-button'
      );

      TestUtils.Simulate.click(close);

      expect(ViewActions.closeFileView).toBeCalled();
    });



  it('wraps lines in <span> with class `changed` or `unchanged`',

    function() {

      blob = repo.objs['changed blob sha'];

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename}
                   commit={commit}
                   blob={blob}/>
      );

      code = TestUtils.findRenderedDOMComponentWithTag(
        FileView, 'code');

      innerHtml = code.props.dangerouslySetInnerHTML.__html
      var unchangedLine = innerHtml.split('&#10;')[0],
          changedLine = innerHtml.split('&#10;')[1];

      expect(unchangedLine).toMatch(
        /^<span class="unchanged">.*<\/span>$/
      );

      expect(changedLine).toMatch(
        /^<span class="changed">.*<\/span>$/
      );

    });

});

