jest.dontMock('../FileTree.react.jsx');

// globals
_ = require('lodash');

var React, TestUtils, Component, FileTree, RepoStore,
    ViewActions, repo, tree, div, folder, files, children;

describe('FileTree', function() {
  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../FileTree.react.jsx');
    RepoStore = require('../../stores/RepoStore');
    ViewActions = require('../../actions/ViewActions');

    repo = RepoStore.get()['TestOwner']['jest-test-repo'];
  });



  it('renders empty div if no commits',

    function() {
      FileTree = TestUtils.renderIntoDocument(
        <Component tree={null} repo={repo}/>
      );

      div = TestUtils
        .findRenderedDOMComponentWithTag(
          FileTree, 'div');

      expect(div.props.children).toBeNull();
    });



  it('renders top-level components of file system',

    function() {

      tree = repo.objs['tree2 sha'];
      FileTree = TestUtils.renderIntoDocument(
        <Component tree={tree}
                   expanded={{}}
                   repo={repo}/>
      );

      div = TestUtils
        .findRenderedDOMComponentWithClass(
          FileTree, 'file-tree');

      children = div.props.children;

      // top-level components
      expect(children[0].key).toBe('child blob sha');
      expect(children[1].key).toBe('child tree sha');
    });



  it('adds `viewing` class to active file if visible',

    function() {

      tree = repo.objs['tree2 sha'];
      FileTree = TestUtils.renderIntoDocument(
        <Component tree={tree}
                   expanded={{}}
                   repo={repo}
                   viewing="child blob sha"/>
      );

      div = TestUtils
        .findRenderedDOMComponentWithClass(
          FileTree, 'file-tree');

      children = div.props.children;
      var className = children[0]._store.props.className;

      expect(className.split(' '))
        .toContain('viewing');
    });



  it('adds `viewing` class to parent folder if collapsed',

    function() {

      tree = repo.objs['tree2 sha'];
      FileTree = TestUtils.renderIntoDocument(
        <Component tree={tree}
                   expanded={{}}
                   repo={repo}
                   viewing="subchild blob sha"/>
      );

      div = TestUtils
        .findRenderedDOMComponentWithClass(
          FileTree, 'file-tree');

      children = div.props.children;
      var nodeLabel = children[1]._store.props.nodeLabel,
          className = nodeLabel._store.props.className;

      expect(className.split(' '))
        .toContain('viewing');
    });



    it('toggles expanded state on folder click',

      function() {
        tree = repo.objs['tree2 sha'];
        FileTree = TestUtils.renderIntoDocument(
          <Component tree={tree}
                     expanded={{}}
                     repo={repo}/>
        );

        var folder = TestUtils.findRenderedDOMComponentWithClass(
          FileTree, 'folder'
        );

        TestUtils.Simulate.click(folder);

        expect(ViewActions.toggleFolder.mock.calls[0][0])
          .toBe('child tree sha');
      });



    it('takes prop to mark folders with `expanded` class',

      function() {
        tree = repo.objs['tree2 sha'];
        FileTree = TestUtils.renderIntoDocument(
          <Component tree={tree}
                     expanded={{'child tree sha': true}}
                     repo={repo}/>
        );

        var folder = TestUtils.findRenderedDOMComponentWithClass(
          FileTree, 'folder'
        );

        expect(folder.props.className).toMatch(/expanded/);
      });



});
