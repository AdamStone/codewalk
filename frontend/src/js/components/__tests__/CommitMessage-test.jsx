jest.dontMock('../CommitMessage.react.jsx');

var React, TestUtils, Component, CommitMessage,
    RepoStore, repo;

describe('CommitMessage', function() {

  beforeEach(function() {


    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../CommitMessage.react.jsx');
    RepoStore = require('../../stores/RepoStore');

    repo = RepoStore.get()['jest-test-repo'];
  });



  it('renders empty div if no commits',

    function() {
      CommitMessage = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="needsCommits"/>
      );

      div = TestUtils
        .findRenderedDOMComponentWithTag(
          CommitMessage, 'div');

      expect(div.getDOMNode().innerHTML).toBe('');
    });



  it('renders body of checked out commit message',

    function() {
      CommitMessage = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="hasCommits"/>
      );

      div = TestUtils
        .findRenderedDOMComponentWithTag(
          CommitMessage, 'div');

      expect(div.getDOMNode().innerHTML)
        .toBeTruthy();
    });

});
