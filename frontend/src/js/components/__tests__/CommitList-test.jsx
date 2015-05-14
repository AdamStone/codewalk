jest.dontMock('../CommitList.react.jsx');

// globals
_ = require('lodash');

var React, TestUtils, Component, CommitList, ViewActions,
    RepoStore, repo, commitSha, commits, listNodes;

describe('CommitList', function() {

  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../CommitList.react.jsx');
    ViewActions = require('../../actions/ViewActions');
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
      listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
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
      listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
                                                CommitList, 'li');
      expect(listNodes[0].getDOMNode().className)
        .toBe('checked-out');
    });



  it('checks out commit on click if not currently checked out',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component commits={commits} checkedOut={0}/>
      );

      listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
                                                CommitList, 'li');

      TestUtils.Simulate.click(listNodes[1]);

      expect(ViewActions.checkout).toBeCalled();
    });



  it('marks specified commit checked-out',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component commits={commits} checkedOut={1}/>
      );
      listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
                                                CommitList, 'li');
      expect(listNodes[1].getDOMNode().className)
        .toBe('checked-out');
    });

});
