"use strict";

var React = require('react'),
    TreeView = require('react-treeview');

var ViewActions = require('../actions/ViewActions'),
    walkerFactory = require('../utils/WalkerFactory');

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
        changed = this.props.changed,
        viewing = this.props.viewing,
        expanded = this.props.expanded,
        repo = this.props.repo,
        fileClick = this.fileClick,
        folderClick = this.folderClick;

    var treeView = null;
    if (tree) {

      // walk tree to build JSX

      var walker = walkerFactory(tree, repo.objs);

      walker.onBlob = function(obj) {

        // build blob JSX

        var sha = obj.sha,
            path = obj.path.split('/'),
            filename = path[path.length - 1],
            viewingThis = (sha === viewing);

        var classString = "file";

        if (viewingThis) {
          this.containsViewing = true;
          classString += " viewing";
        }

        if (changed && (changed === 'all' ||
                       sha in changed)) {

          classString += " changed";
          this.containsChanged = true;
        }

        return (
          <div key={sha}
               name={sha}
               className={classString}
               onClick={fileClick}>
            {filename}
          </div>
        );
      };


      walker.onTree = function(obj, subWalker) {

        // build tree JSX

        var sha = obj.sha,
            path = obj.path.split('/'),
            isExpanded = expanded[sha];

        var subTreeView = subWalker.walk();

        var labelClass = "folder";

        if (subWalker.containsViewing) {
          this.containsViewing = true;

          // Color folder if collapsed and contains viewing
          if (!isExpanded) {
            labelClass += " viewing";
          }
        }

        if (subWalker.containsChanged) {
          this.containsChanged = true;

          // Color folder if collapsed and contains changed
          if (!isExpanded) {
            labelClass += " changed";
          }
        }

        labelClass += (isExpanded ? " expanded" : "");

        var nodeLabel = (
          <span name={sha}
                onClick={folderClick}
                className={labelClass}>
            {path[path.length - 1]}
          </span>
        );

        return (
          <TreeView key={sha}
                    collapsed={!isExpanded}
                    nodeLabel={nodeLabel}>
            {subTreeView}
          </TreeView>
        );
      };

      treeView = walker.walk();
    }


    // show spinner until commits load
    var spinner = (
      <div className="spinner-container">
        <span className="fa fa-spin fa-spinner"></span>
      </div>
    );


    return (
      <div className="file-tree">
        <h2 className="header">Source code</h2>
        <div className="filesystem">
          {treeView}
        </div>
        {tree ?
          null : spinner
        }
      </div>
    );
  }
});
