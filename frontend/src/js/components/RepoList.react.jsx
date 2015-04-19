"use strict";

var React = require('react');

var Router = require('react-router'),
    Link = Router.Link;

// TEMP
var repos = [
  {
    owner: 'AdamStone',
    name: 'xrd-plot'
  }
]

module.exports = React.createClass({
  render: function() {
    var repoTiles = repos.map(function(repo, i) {
      var params = {
        owner: repo.owner,
        repo: repo.name
      };
      return (
        <div key={i} className="repo-tile">
          <h1>
            <Link to="repo" params={params}>
              {repo.name}
            </Link>
          </h1>
        </div>
      );
    });

    return (
      <div className="repo-list">
        {repoTiles}
      </div>
    );
  }
});
