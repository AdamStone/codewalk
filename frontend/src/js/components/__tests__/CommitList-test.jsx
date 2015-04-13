jest.dontMock('../CommitList.react.jsx');

var React, TestUtils, Component, CommitList,
    RepoActions, repo;

describe('CommitList', function() {

  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../CommitList.react.jsx');
    RepoActions = require('../../actions/RepoActions');

    repo = {
      owner: "AdamStone",
      name: "xrd-plot",
      objs: {
        'sha1': {
          commit: {
            message: 'sha1 header' + '\n' +
                     'sha1 content'
          }
        },
        'sha2': {
          commit: {
            message: 'sha2 header' + '\n' +
                     'sha2 content'
          }
        }
      },
      branches: {
        master: {
          commits: []
        },
        needsCommits: {
          commits: []
        },
        hasCommits: {
          commits: ['sha1', 'sha2']
        }
      }
    };
  });



  it('calls GET_COMMITS action if props.repo is empty',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo}/>
      );

      expect(RepoActions.getCommits.mock.calls[0][0])
        .toBe('AdamStone');
      expect(RepoActions.getCommits.mock.calls[0][1])
        .toBe('xrd-plot');
    });



  it('calls GET_COMMITS for master branch by default',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo}/>
      );

      expect(RepoActions.getCommits.mock.calls[0][2])
        .toBe('master');
    });



  it('calls GET_COMMITS for other branch if specified',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="needsCommits"/>
      );

      expect(RepoActions.getCommits.mock.calls[0][2])
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
        .toBe('sha1 header');
      expect(listNodes[1].props.children)
        .toBe('sha2 header');
    });



  it('marks first commit checked-out by default',

    function() {

      CommitList = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="hasCommits"/>
      );
      var listNodes = TestUtils.scryRenderedDOMComponentsWithTag(
                                                CommitList, 'li');
      expect(listNodes[0].getDOMNode().className).toBe('checked-out');
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
      expect(listNodes[1].getDOMNode().className).toBe('checked-out');
    });

});
