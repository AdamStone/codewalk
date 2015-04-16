jest.dontMock('../CommitList.react.jsx');

var React, TestUtils, Component, CommitList,
    RepoStore, repo;

describe('CommitList', function() {

  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../CommitList.react.jsx');
    RepoStore = require('../../stores/RepoStore');

    repo = RepoStore.get()['jest-test-repo'];
  });



  it('calls RepoStore.getCommits if props.repo is empty',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo}/>
      );

      expect(RepoStore.getCommits.mock.calls[0][0])
        .toBe('AdamStone');
      expect(RepoStore.getCommits.mock.calls[0][1])
        .toBe('jest-test-repo');
    });



  it('calls getCommits for master branch by default',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo}/>
      );

      expect(RepoStore.getCommits.mock.calls[0][2])
        .toBe('master');
    });



  it('calls getCommits for other branch if specified',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="needsCommits"/>
      );

      expect(RepoStore.getCommits.mock.calls[0][2])
        .toBe('needsCommits');
    });



  it('renders first lines of known commit messages',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="hasCommits"/>
      );
      var listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
                                                CommitList, 'li');
      expect(listNodes[0].props.children)
        .toBe('commit1 header');
      expect(listNodes[1].props.children)
        .toBe('commit2 header');
    });



  it('marks first commit checked-out by default',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="hasCommits"/>
      );
      var listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
                                                CommitList, 'li');
      expect(listNodes[0].getDOMNode().className)
        .toBe('checked-out');
    });



  it('marks specified checked-out otherwise',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo}
                   branch="hasCommits"
                   checkedOut={1}/>
      );
      var listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
                                                CommitList, 'li');
      expect(listNodes[1].getDOMNode().className)
        .toBe('checked-out');
    });

});
