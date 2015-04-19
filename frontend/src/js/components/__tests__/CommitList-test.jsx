jest.dontMock('../CommitList.react.jsx');

var React, TestUtils, Component, CommitList,
    RepoStore, repo, commitSha, commits;

describe('CommitList', function() {

  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../CommitList.react.jsx');
    RepoStore = require('../../stores/RepoStore');

    repo = RepoStore.get()['TestOwner']['jest-test-repo'];
    commitSha = repo.branches.hasCommits.commits;
    commits = commitSha.map(function(sha) {
      return repo.objs[sha];
    });
  });



  it('renders first lines of known commit messages',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component commits={commits}/>
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
        <Component commits={commits}/>
      );
      var listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
                                                CommitList, 'li');
      expect(listNodes[0].getDOMNode().className)
        .toBe('checked-out');
    });



  it('marks specified checked-out otherwise',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component commits={commits} checkedOut={1}/>
      );
      var listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
                                                CommitList, 'li');
      expect(listNodes[1].getDOMNode().className)
        .toBe('checked-out');
    });

});
