jest.dontMock('../../utils/mockStorage');
var mockStorage = require('../../utils/mockStorage');
mockStorage('sessionStorage');

var RepoStoreMock = jest.genMockFromModule('../RepoStore.js');


RepoStoreMock.get.mockImplementation(get);

module.exports = RepoStoreMock;


function get() {
  return {
    "TestOwner" : {
      "jest-test-repo": {
        owner: "TestOwner",
        name: "jest-test-repo",
        branches: {
          master: {
            commits: []
          },
          needsCommits: {
            commits: []
          },
          hasCommits: {
            commits: ['commit1 sha', 'commit2 sha']
          },
          hasTree: {
            commits: ['commit2 sha']
          }
        },
        objs: {
          'commit1 sha': {
            commit: {
              message: ['commit1 header',
                       '=======',
                       'tree IS NOT in objs'].join('\n'),
              tree: {
                sha: 'tree1 sha'
              }
            }
          },
          'commit2 sha': {
            commit: {
              message: ['commit2 header',
                       '-------',
                       'tree IS in objs'].join('\n'),
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
          },
          'content blob sha': {
            type: 'blob',
            path: 'content.blob',
            content: new Buffer('Test content')
                      .toString('base64')
          }
        }
      }
    }
  };
}
