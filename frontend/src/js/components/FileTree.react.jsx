"use strict";

var React = require('react'),
    TreeView = require('react-treeview');

var ViewActions = require('../actions/ViewActions');

module.exports = React.createClass({

  folderClick: function(e) {
    var sha = e.currentTarget.attributes.name.value;
    ViewActions.toggleFolder(sha);
  },



  fileClick: function(e) {
    var sha = e.currentTarget.attributes.name.value;
    ViewActions.viewFile(sha);
  },



  render: function() {

    var tree = this.props.tree,
        diffed = this.props.diffed,
        viewing = this.props.viewing,
        repo = this.props.repo;

    var view = null;
    if (tree) {
      // build file structure recursively
      view = walk(tree, diffed, repo.objs, this)[0];
    }

    return (
      <div className="file-tree">
        {view}
      </div>
    );
  }
});



function walk(tree, diffed, objStore, thisObj) {

  // track whether tree contains a file being viewed
  var containsViewing = false,
      containsChanged = false;

  var mapped = tree.children.map(function(sha) {
    var obj = objStore[sha];

    // BLOBS
    if (obj.type === 'blob') {
      var path = obj.path.split('/'),
          filename = path[path.length - 1],
          viewing = thisObj.props.viewing === sha;

      var classString = "file";

      if (viewing) {
        containsViewing = true;
        classString += " viewing";
      }

      if (diffed && (diffed === 'all' ||
                     sha in diffed)) {

        classString += " changed";
        containsChanged = true;
      }

      return (
        <div key={sha}
             name={sha}
             className={classString}
             onClick={thisObj.fileClick}>
          {filename}
        </div>
      );
    }

    // TREES
    if (obj.type === 'tree') {
      var path = obj.path.split('/'),
          expanded = thisObj.props.expanded[sha];

      var subWalk = walk(obj, diffed, objStore, thisObj),
          subTree = subWalk[0],
          subViewing = subWalk[1],
          subChanged = subWalk[2];

      var labelClass = "folder";

      if (subViewing) {
        containsViewing = true;

        // Color folder if collapsed and contains viewing
        if (!expanded) {
          labelClass += " viewing";
        }
      }

      if (subChanged) {
        containsChanged = true;

        // Color folder if collapsed and contains changed
        if (!expanded) {
          labelClass += " changed";
        }
      }

      labelClass += (expanded ? " expanded" : "");

      var nodeLabel = (
        <span name={sha}
              onClick={thisObj.folderClick}
              className={labelClass}>
          {path[path.length - 1]}
        </span>
      );

      return (
        <TreeView key={sha}
                  collapsed={!expanded}
                  nodeLabel={nodeLabel}>
          {subTree}
        </TreeView>
      );
    }

  });

  return [mapped, containsViewing, containsChanged];
}
