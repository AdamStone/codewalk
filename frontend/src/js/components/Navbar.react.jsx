"use strict";

var React = require('react'),
    Router = require('react-router'),
    Navigation = Router.Navigation,
    Link = Router.Link;

var ViewActions = require('../actions/ViewActions'),
    Constants = require('../constants/Constants');


module.exports = React.createClass({

  mixins: [Navigation],

  setLayout: function(layout) {
    ViewActions.setLayout(layout);
  },

  render: function() {

    var repo = this.props.repo,
        view = this.props.view;

    var commitsButtonClass = 'commits-layout-button',
        messageButtonClass = 'message-layout-button',
        codeButtonClass = 'code-layout-button';

    switch(view.layout) {

      case Constants.View.COMMITS_LAYOUT:
        commitsButtonClass += ' active';
        break;

      case Constants.View.MESSAGE_LAYOUT:
        messageButtonClass += ' active';
        break;

      case Constants.View.CODE_LAYOUT:
        codeButtonClass += ' active';
        break;
    }

    var layoutButtons = [
      <button className={commitsButtonClass}
            title="Show commit history"
            onClick={
              this.setLayout.bind(this,
                Constants.View.COMMITS_LAYOUT)}>
        <span className="fa fa-list"></span>
      </button>,

      <button className={messageButtonClass}
            title="Show commit message for this commit"
            onClick={
              this.setLayout.bind(this,
                Constants.View.MESSAGE_LAYOUT)}>
        <span className="fa fa-book"></span>
      </button>,

      <button className={codeButtonClass}
            title="Show source code for this commit"
            onClick={
              this.setLayout.bind(this,
                Constants.View.CODE_LAYOUT)}>
        <span className="fa fa-code"></span>
      </button>
    ];


    layoutButtons = layoutButtons.map(
      function(button, i) {
        return (
        <li key={i}
            className="icon-li layout-button-li">
          { button }
        </li>
        );
      }
    );


    // warnings
    var warnings = [];
    for (var key in repo.warnings) {
      var message = repo.warnings[key];
      warnings.push(
      <li key={key}>{ message }</li>
      );
    }


    return (
      <nav className="navbar">
        <ul>

          <li>
            <Link to="app">
              Codewalk
            </Link>
          </li>

          <li className="icon-li">
            <a className="icon-container"
               title="View this repo on GitHub"
               href={"https://github.com/" + repo.owner + '/' + repo.name }>
              <span className="fa fa-github-alt"></span>
            </a>
          </li>

        { warnings.length ?
          <li className="icon-li">
            <span className="icon-container warning"
                  tabIndex="0">
              <span className="fa fa-warning">
              </span>
              <ul className="dropdown">
                { warnings }
              </ul>
            </span>
          </li>

          : null
        }

          <li className="button-group">
            <ul>
              { layoutButtons }
            </ul>
          </li>

        </ul>
      </nav>
    );
  }
});
