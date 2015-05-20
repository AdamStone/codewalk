"use strict";

var context = require.context('./frontend/src/js', true, /-test\.jsx?$/);

context.keys().forEach(context);
