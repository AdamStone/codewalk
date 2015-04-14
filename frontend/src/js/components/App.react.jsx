var React = require('react');

var RepoStore = require('../stores/RepoStore'),
    CommitList = require('./CommitList.react.jsx');


function getAppState() {
  return {
    repos: RepoStore.get(),
    viewing: 'xrd-plot'
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

    var repo = this.state.repos[this.state.viewing];

    return (
      <div className="viewport">
        <nav className="toolbar">
        </nav>

        <div className="content">

          <div className="left-bar">
            <CommitList repo={repo}/>
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
