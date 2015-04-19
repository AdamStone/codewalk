jest.dontMock('../FileView.react.jsx');

var React, TestUtils, Component, FileView, content,
    pre, innerHtml, Encoder, encoder;

describe('CodeView', function() {

  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../FileView.react.jsx');
    Encoder = require('node-html-encoder').Encoder;
    encoder = new Encoder('entity');
  });


  it('renders blob content if available',

    function() {

      content = 'some file content';

      FileView = TestUtils.renderIntoDocument(
        <Component content={content}/>
      );

      pre = TestUtils.findRenderedDOMComponentWithTag(
        FileView, 'pre');

      innerHtml = pre.props.dangerouslySetInnerHTML.__html
      expect(innerHtml).toBe(content);
    });



  it('escapes html content',

    function() {

      content = '<b>some bold content</b>';

      FileView = TestUtils.renderIntoDocument(
        <Component content={content}/>
      );

      pre = TestUtils.findRenderedDOMComponentWithTag(
        FileView, 'pre');

      innerHtml = pre.props.dangerouslySetInnerHTML.__html
      expect(innerHtml).toBe(encoder.htmlEncode(content));
    });

});
