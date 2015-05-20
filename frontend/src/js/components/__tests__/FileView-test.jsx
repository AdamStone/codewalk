// global
window._ = require('lodash');
window.hljs = require('highlight.js');

var expect, React, TestUtils, Component, FileView, ViewActions,
    filename, blob, commit, code, innerHtml, Encoder, encoder,
    RepoStore, repo, spy;

describe('FileView', function() {

  beforeEach(function() {
    expect = require('expect');
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../FileView.react.jsx');
    ViewActions = require('../../actions/ViewActions');
    RepoStore = require('../../stores/__mocks__/RepoStore');
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
      expect(innerHtml).toExist();
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
      expect(innerHtml).toContain(
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

      spy = expect.spyOn(ViewActions, 'closeFileView');

      var event = document.createEvent("HTMLEvents");
      //    initEvent(type, bubbles, cancalable)
      event.initEvent("keydown", false, true);
      event.keyCode = 27;
      document.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
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

      spy = expect.spyOn(ViewActions, 'closeFileView');

      TestUtils.Simulate.click(close);

      expect(spy).toHaveBeenCalled();
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
