"use strict";

var expect, React, TestUtils, Component, RepoView, Router,
    App, RepoStore, MockRepoStore, ViewStore, mockRouter, spy;

describe('RepoView', function() {

  beforeEach(function() {
    expect = require('expect');
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../RepoView.react.jsx');
    RepoStore = require('../../stores/RepoStore');
    MockRepoStore = require('../../stores/__mocks__/RepoStore');
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

      spy = expect.spyOn(RepoStore, 'getCommits');
      spy.calls = [];

      TestUtils.renderIntoDocument(<RepoView/>);

      expect(spy.calls[0].arguments).toEqual([
        'TestOwner', 'jest-test-repo', 'master'
      ]);

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

      spy = expect.spyOn(RepoStore, 'getCommits');
      spy.calls = [];

      TestUtils.renderIntoDocument(<RepoView/>);

      expect(spy.calls[0].arguments[2]).toBe('needsCommits');

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

      spy = expect.spyOn(RepoStore, 'getTree');
      RepoStore.get = MockRepoStore.get;

      TestUtils.renderIntoDocument(<RepoView/>);

      expect(spy).toHaveBeenCalled();

    });



  it('calls getBlob if expected file content is missing',

    function() {

      ViewStore.get = function() {
        return {
          file: 'child blob sha',
          checkedOut: 0,
          expanded: {}
        }
      };

      RepoStore.get = MockRepoStore.get;

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

      spy = expect.spyOn(RepoStore, 'getBlob');
      spy.calls = [];

      TestUtils.renderIntoDocument(<RepoView/>);

      expect(spy).toHaveBeenCalled();

    });

});
