"use strict";

var React = require('react');

var RepoList = require('./components/RepoList.react.jsx'),
    RepoView = require('./components/RepoView.react.jsx');

var Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
    HistoryLocation = Router.HistoryLocation,
    Link = Router.Link,
    Route = Router.Route,
    RouteHandler = Router.RouteHandler;


var App = React.createClass({
  render: function() {
    return <RouteHandler/>;
  }
});


var routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={RepoList}/>
    <Route name="repo" path=":owner/:repo" handler={RepoView}/>
    <Route name="branch" path=":owner/:repo/:branch" handler={RepoView}/>
  </Route>
);


/*Router.run(routes, HistoryLocation, function(Handler) {*/
Router.run(routes, function(Handler) {
  React.render(<Handler/>, document.body);
});
