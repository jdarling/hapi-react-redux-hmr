'use strict';

const async = require('async');
const server = require('./server');
const logger = require('./logger');

const startServer = () => {
  server.start(server.started);
};

server.on('ready', function(server){
  async.series([
    startServer
  ]);
});
