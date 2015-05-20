"use strict";

module.exports = {

  get: function() {
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
              sha: 'commit1 sha',
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
              sha: 'commit2 sha',
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
              sha: 'tree2 sha',
              children: ['child blob sha',
                         'child tree sha']
            },
            'child blob sha': {
              type: 'blob',
              sha: 'child blob sha',
              path: 'file1.blob'
            },
            'child tree sha': {
              type: 'tree',
              sha: 'child tree sha',
              path: 'folder1',
              children: ['subchild blob sha']
            },
            'subchild blob sha': {
              type: 'blob',
              sha: 'subchild blob sha',
              path: 'folder1/file2.blob'
            },
            'content blob sha': {
              type: 'blob',
              sha: 'content blob sha',
              path: 'content.blob',
              content: 'Test content'
            },



            // DIFF TESTS
            'diffed commit sha': {
              commit: {
                message: 'commit message',
                tree: {
                  sha: 'tree diff sha'
                }
              },
              changed: {
                'changed blob sha': {
                  patch: [
                    '@@ -1,2 +1,2 @@',
                    'Line 1',
                    '-line 2',
                    '+Line 2'
                  ].join('\n')
                }
              },
              sha: 'diffed commit sha'
            },
            'diffed tree sha': {
              children: ['changed blob sha',
                         'bold blob sha'],
              sha: 'diffed tree sha'
            },
            'changed blob sha': {
              type: 'blob',
              sha: 'changed blob sha',
              path: 'changed.blob',
              content: ['Line 1', 'Line 2'].join('\n')
            },
            'bold blob sha': {
              type: 'blob',
              sha: 'bold blob sha',
              path: 'bold.blob',
              content:  '<b>some bold content</b>'
            }

          }
        }
      }
    };
  }
};
