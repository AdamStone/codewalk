jest.dontMock('../FileTree.react.jsx');

var React, TestUtils, Component, FileTree, RepoStore,
    repo, tree, div, folder, files, children;

describe('FileTree', function() {
  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../FileTree.react.jsx');
    RepoStore = require('../../stores/RepoStore');

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
        <Component tree={tree} repo={repo}/>
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
        <Component tree={tree} repo={repo}
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
        <Component tree={tree} repo={repo}
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

});
