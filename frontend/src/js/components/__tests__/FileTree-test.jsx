jest.dontMock('../FileTree.react.jsx');
jest.dontMock('../../utils/mockStorage');

var React, TestUtils, Component, FileTree, RepoStore,
    mockStorage, div, folder, files, children;

describe('FileTree', function() {
  beforeEach(function() {
    mockStorage = require('../../utils/mockStorage');
    mockStorage('sessionStorage');

    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    Component = require('../FileTree.react.jsx');
    RepoStore = require('../../stores/RepoStore');

    repo = {
      owner: "AdamStone",
      name: "xrd-plot",
      branches: {
        master: {
          commits: []
        },
        hasCommit: {
          commits: ['commit1 sha']
        },
        hasTree: {
          commits: ['commit2 sha']
        }
      },
      objs: {
        'commit1 sha': {
          commit: {
            message: 'tree IS NOT in objs',
            tree: {
              sha: 'tree1 sha'
            }
          }
        },
        'commit2 sha': {
          commit: {
            message: 'tree IS in objs',
            tree: {
              sha: 'tree2 sha'
            }
          }
        },
        'tree2 sha': {
          children: ['child blob sha',
                     'child tree sha']
        },
        'child blob sha': {
          type: 'blob',
          path: 'file1.blob'
        },
        'child tree sha': {
          type: 'tree',
          path: 'folder1',
          children: ['subchild blob sha']
        },
        'subchild blob sha': {
          type: 'blob',
          path: 'folder1/file2.blob'
        }
      }
    };
  });



  it('renders empty div if no commits',

    function() {
      FileTree = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="master"/>
      );

      div = TestUtils
        .findRenderedDOMComponentWithTag(
          FileTree, 'div');

      expect(div.props.children).toBeNull();
    });



  it('calls RepoStore.getTree if commit tree is missing',

    function() {
      FileTree = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="hasCommit"/>
      );

      expect(RepoStore.getTree).toBeCalled();
    });



  it('renders top-level components of file system',

    function() {
      FileTree = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="hasTree"/>
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
      FileTree = TestUtils.renderIntoDocument(
        <Component repo={repo} branch="hasTree"/>
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
