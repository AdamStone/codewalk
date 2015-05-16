module.exports = walkerFactory;

function walkerFactory(tree, objStore, onBlob, onTree) {

  return {
    // override these
    onBlob: onBlob || function(obj) { return obj; },
    onTree: onTree || function(obj) { return obj; },

    walk: function() {
      return tree.children.map(function(sha) {

        var obj = objStore[sha];

        // BLOBS
        if (obj.type === 'blob') {
          return this.onBlob(obj);
        }

        // TREES
        if (obj.type === 'tree') {
          var subWalker = walkerFactory(obj, objStore);
          subWalker.onBlob = this.onBlob;
          subWalker.onTree = this.onTree;
          return this.onTree(obj, subWalker);
        }

      }.bind(this));
    }
  };
}
