"use strict";

var Hapi = require('hapi'),
    Path = require('path');

var routes = require('./routes/http-routes');

var staticPath = Path.join(__dirname, '..', '..',
                           'frontend', 'public');

var server = new Hapi.Server();
server.connection({
  port: 5000
});

server.path(staticPath);


routes.forEach(function(route) {
  server.route(route);
});

module.exports = server;
