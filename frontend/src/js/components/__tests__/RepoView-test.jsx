jest.dontMock('../RepoView.react.jsx');
jest.dontMock('../../utils/mockRouter.jsx');

// globals
_ = require('lodash');

var React, TestUtils, Component, RepoView,
    Router, App, RepoStore, ViewStore, mockRouter;

describe('RepoView', function() {

  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../RepoView.react.jsx');
    RepoStore = require('../../stores/RepoStore');
    ViewStore = require('../../stores/ViewStore');
    mockRouter = require('../../utils/mockRouter.jsx');
  });



  it('calls RepoStore.getCommits if props.repo is empty',

    function() {

      // simulate url /:owner/:repo
      RepoView = mockRouter(Component, {}, {
        getCurrentParams: function() {
          return {
            owner: 'TestOwner',
            repo: 'jest-test-repo'
          };
        }
      });

      TestUtils.renderIntoDocument(<RepoView/>);

      expect(RepoStore.getCommits.mock.calls[0][0])
        .toBe('TestOwner');
      expect(RepoStore.getCommits.mock.calls[0][1])
        .toBe('jest-test-repo');

      // defaults to master branch
      expect(RepoStore.getCommits.mock.calls[0][2])
        .toBe('master');
    });



  it('calls getCommits for specified branch if empty',

    function() {

      // simulate url /:owner/:repo
      RepoView = mockRouter(Component, {}, {
        getCurrentParams: function() {
          return {
            owner: 'TestOwner',
            repo: 'jest-test-repo',
            branch: 'needsCommits'
          };
        }
      });

      TestUtils.renderIntoDocument(<RepoView/>);

      expect(RepoStore.getCommits.mock.calls[0][2])
        .toBe('needsCommits');
    });



  it('calls getTree if checked out commit tree is missing',

    function() {

      // simulate url /:owner/:repo
      RepoView = mockRouter(Component, {}, {
        getCurrentParams: function() {
          return {
            owner: 'TestOwner',
            repo: 'jest-test-repo',
            branch: 'hasCommits'
          };
        }
      });

      TestUtils.renderIntoDocument(<RepoView/>);

      expect(RepoStore.getTree).toBeCalled();
    });



  it('calls getBlob if expected file content is missing',

    function() {

      ViewStore.get.mockImplementation(function() {
        return {
          file: 'child blob sha',
          checkedOut: 0
        }
      });

      // simulate url /:owner/:repo
      RepoView = mockRouter(Component, {}, {
        getCurrentParams: function() {
          return {
            owner: 'TestOwner',
            repo: 'jest-test-repo',
            branch: 'hasTree'
          };
        }
      });

      TestUtils.renderIntoDocument(<RepoView/>);

      expect(RepoStore.getBlob).toBeCalled();
    });

});
