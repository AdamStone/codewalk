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



  it('only renders subtrees once expanded',

    function() {
      tree = repo.objs['tree2 sha'];
      FileTree = TestUtils.renderIntoDocument(
        <Component tree={tree} repo={repo}/>
      );

      // before click
      files = TestUtils
        .scryRenderedDOMComponentsWithClass(
          FileTree, 'file');

      expect(files.length).toBe(1);
      expect(files[0].props.name)
        .toBe('child blob sha');

      // click
      folder = TestUtils
        .findRenderedDOMComponentWithClass(
          FileTree, 'folder');

      TestUtils.Simulate.click(folder);

      // after click
      files = TestUtils
        .scryRenderedDOMComponentsWithClass(
          FileTree, 'file');

      expect(files.length).toBe(2);
      expect(files[1].props.name)
        .toBe('subchild blob sha');
    });

});
