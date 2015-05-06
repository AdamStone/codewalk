"use strict";

var React = require('react'),
    Router = require('react-router'),
    Navigation = Router.Navigation,
    Link = Router.Link;


module.exports = React.createClass({

  mixins: [Navigation],

  getInitialState: function() {
    return {
      input: ''
    };
  },


  submit: function(e) {
    e.preventDefault();

    var matched = this.state.input.match(
      /^https:\/\/github.com\/(\w[\w-]+)\/(\w[\w-]+)\/?$/
    );

    if (matched) {

      var params = {
        owner: matched[1],
        repo: matched[2]
      };

      this.context.router.transitionTo('repo', params);
    }
    else {
      // TODO display hint
    }
  },


  changed: function(e) {

    this.setState({
      input: e.target.value
    });
  },


  render: function() {

    return (
      <div className="landing-page container">

        <div className="row">
          <div className="twelve columns">

            <h1 className="header">
              {"< codewalk >"}
            </h1>

            <div>
              <span className="fa fa-github-alt github-icon">
              </span>
            </div>

          </div>
        </div>

        <div className="row">
          <div className="twelve columns">

              <form onSubmit={this.submit}>
                <label>Enter a GitHub repo URL</label>
                <input placeholder="https://github.com/owner/repo"
                       className="repo-url-input"
                       value={this.state.input}
                       onChange={this.changed}
                       name="repo-url-input"
                       type="url"/>
                <button type="submit">Walk</button>
            </form>

          </div>
        </div>

        <p>or</p>

        <Link to="repo"
              params={{owner: 'AdamStone',
                       repo: 'codewalk'}}>

          <button>
            Walk this project's repo
          </button>

        </Link>

      </div>
    );
  }
});
