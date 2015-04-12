"use strict";

var Hapi = require('hapi'),
    Path = require('path');

var staticPath = Path.join(__dirname, '..', '..',
                           'frontend', 'public');

var server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 5000
});

server.path(staticPath);

module.exports = server;
