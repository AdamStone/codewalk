"use strict";

var React = require('react'),
    TreeView = require('react-treeview');

var RepoStore = require('../stores/RepoStore'),
    ViewActions = require('../actions/ViewActions');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      expanded: {}
    };
  },



  folderClick: function(e) {
    var expanded = this.state.expanded,
        sha = e.currentTarget.attributes.name.value;
    expanded[sha] = !expanded[sha]
    this.setState({
      expanded: expanded
    });
  },



  fileClick: function(e) {
    var sha = e.currentTarget.attributes.name.value;
    ViewActions.viewFile(sha);
  },



  render: function() {

    var tree = this.props.tree,
        repo = this.props.repo;

    var view = null;
    if (tree) {
      // build file structure recursively
      view = walk(tree, repo.objs, this);
    }

    return (
      <div className="file-tree">
        {view}
      </div>
    );
  }
});



function walk(tree, objStore, thisObj) {

  return tree.children.map(function(sha) {
    var obj = objStore[sha];

    // BLOBS
    if (obj.type === 'blob') {
      var path = obj.path.split('/'),
          filename = path[path.length - 1];
      return (
        <div key={sha}
             name={sha}
             className="file"
             onClick={thisObj.fileClick}>
          {filename}
        </div>
      );
    }

    // TREES
    if (obj.type === 'tree') {
      var path = obj.path.split('/'),
          expanded = thisObj.state.expanded[sha],
          nodeLabel = (
            <span name={sha}
                  onClick={thisObj.folderClick}
                  className={"folder" + (expanded ?
                                      " expanded" : "")}>
              {path[path.length - 1]}
            </span>
          );

      // walk subtrees only if expanded
      var subTree = null;
      if (expanded) {
        subTree = walk(obj, objStore, thisObj)
      }

      return (
        <TreeView key={sha}
                  collapsed={!expanded}
                  nodeLabel={nodeLabel}>
          {subTree}
        </TreeView>
      );
    }

  });
}
