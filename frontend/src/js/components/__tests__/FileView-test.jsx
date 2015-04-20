jest.dontMock('../FileView.react.jsx');

var React, TestUtils, Component, FileView, ViewActions,
    filename, content, code, innerHtml, Encoder, encoder;

describe('FileView', function() {

  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../FileView.react.jsx');
    ViewActions = require('../../actions/ViewActions');
    Encoder = require('node-html-encoder').Encoder;
    encoder = new Encoder('entity');
    filename = 'somefile';
  });



  it('renders blob content if available',

    function() {

      content = 'some file content';

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename} content={content}/>
      );

      code = TestUtils.findRenderedDOMComponentWithTag(
        FileView, 'code');

      innerHtml = code.props.dangerouslySetInnerHTML.__html
      expect(innerHtml).toBe(content);
    });



  it('adds file extension to <code> className',

    function() {

      content = 'some file content';
      filename = 'some-js-file.js';

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename} content={content}/>
      );

      code = TestUtils.findRenderedDOMComponentWithTag(
        FileView, 'code');

      expect(code.props.className).toBe('js');
    });



  it('escapes html content',

    function() {

      content = '<b>some bold content</b>';

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename} content={content}/>
      );

      code = TestUtils.findRenderedDOMComponentWithTag(
        FileView, 'code');

      innerHtml = code.props.dangerouslySetInnerHTML.__html
      expect(innerHtml).toBe(encoder.htmlEncode(content));
    });



  it('closes on ESC keydown',

    function() {

      content = '<b>some bold content</b>';

      FileView = TestUtils.renderIntoDocument(
        <Component filename={filename} content={content}/>
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

        content = '<b>some bold content</b>';

        FileView = TestUtils.renderIntoDocument(
          <Component filename={filename} content={content}/>
        );

        var close = TestUtils.findRenderedDOMComponentWithClass(
          FileView, 'close-button'
        );

        TestUtils.Simulate.click(close);

        expect(ViewActions.closeFileView).toBeCalled();
      });

});
