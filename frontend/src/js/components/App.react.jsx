var React = require('react');

var RepoStore = require('../stores/RepoStore');


function getAppState() {
  return {
    repos: RepoStore.get()
  };
};



module.exports = React.createClass({

  getInitialState: function() {
    return getAppState();
  },

  componentDidMount: function() {
    RepoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    RepoStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div className="viewport">
        <nav className="toolbar">
        </nav>

        <div className="content">

          <div className="left-bar">

          </div>

          <div className="editor">

          </div>

          <div className="right-bar">

          </div>

        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getAppState());
  }

});
