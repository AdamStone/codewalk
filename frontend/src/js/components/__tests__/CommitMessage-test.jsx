jest.dontMock('../CommitMessage.react.jsx');

// globals
_ = require('lodash');

var React, TestUtils, Component, CommitMessage,
    markdown, rendered;

describe('CommitMessage', function() {

  beforeEach(function() {

    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../CommitMessage.react.jsx');
  });



  it('renders empty div if no message',

    function() {

      CommitMessage = TestUtils.renderIntoDocument(
        <Component markdown={''}/>
      );

      div = TestUtils
        .findRenderedDOMComponentWithTag(
          CommitMessage, 'div');

      expect(div.getDOMNode().innerHTML).toBe('');
    });



  it('renders commit message as markdown',

    function() {

      markdown = [
        'commit header',
        '=======',
        'commit body',
      ].join('\n');

      rendered = [
        '<h1>commit header</h1>\n',
        '<p>commit body</p>\n'
      ].join('');

      CommitMessage = TestUtils.renderIntoDocument(
        <Component markdown={markdown}/>
      );

      div = TestUtils
        .findRenderedDOMComponentWithTag(
          CommitMessage, 'div');

      expect(div.getDOMNode().innerHTML)
        .toBe(rendered);
    });

});
