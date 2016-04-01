'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const util = require('util');
const path = require('path');
const async = require('async');
const pjson = require('../package.json');
const Inert = require('inert');
const Vision = require('vision');
const h2o2 = require('h2o2');

const args = require('./cmdargs').parseArgs({
}, process.argv);

const logger = require('./logger');
const utils = require('./utils');

const HapiSwagger = require('hapi-swagger');
const ROUTES = [
  ...require('../routes/status'),
];

const server = new Hapi.Server();

const UI_CONFIG = {};
const WEB_CONFIG = {};

server.on('request-error', function(req, e){
  logger.error(e);
  if(e.stack){
    logger.error(e.stack);
  }
});

server.on('log', (event, tags) => {
  if(tags.error){
    return logger.error(event);
  }
  return logger.info(event);
});


const {
  PORT = 8080,
  HOST = 'localhost',
  WEB_ROOT = 'web/site/',
} = WEB_CONFIG;

const webRoot = path.resolve(__dirname, '../', WEB_ROOT);
const indexFileLoc = path.resolve(webRoot, './index.html');

let started = function(err){
  if(err){
    return logger.error(err.toString(), err);
  }
  logger.info(`${pjson.name} v${pjson.version} website started on http://${HOST}:${PORT}`);
};

server.started = started;
server.connection({host: HOST, port: PORT});

server.ext('onRequest', function (request, next) {
  logger.info('Inbound started: ', {'Correlation-Id': request.id, 'URL': request.url.href});
  return next.continue();
});

server.ext('onPreResponse', function (request, reply) {
  if (request.response.isBoom && request.response.output && (request.response.output.statusCode===404)) {
    let parts = request.url.path.split('/');
    const isIndexRoute = (parts[1]!=='api') && (utils.getExtension(parts[parts.length-1]) === '');
    if(isIndexRoute){
      logger.info('Inbound completed: ', {statusCode: 200, 'Correlation-Id': request.id, 'URL': request.url.href, 'Response': request.response.output});
      //return reply.file(indexFileLoc).header('Correlation-Id', request.id);
      return reply.view('index', request).header('Correlation-Id', request.id);
    }
  }
  logger.info('Inbound completed: ', {statusCode: request.response.statusCode, 'Correlation-Id': request.id, 'URL': request.url.href, 'Response': request.response.payload});

  if(request.response.header && request.id){
    request.response.header('Correlation-Id', request.id);
  }

  return reply.continue();
});

let registerPackages = [
  Inert,
  Vision,
  {
    register: HapiSwagger,
    options: {
      info: {
        title: pjson.name+' Documentation',
        version: pjson.vresion
      }
    }
  },
];

if(args.hot){
  const Webpack = require('webpack');
  registerPackages.push({
    register: require('hapi-webpack-plugin'),
    options: './configs/webpack.client.js',
  });
}

server.register(registerPackages, (err) => {
  if(err){
    logger.error(err);
  }

  server.views({
    engines: {
      html: {
        compile: (template, compileOptions)=>{
          return (context, renderOptions)=>{
            const ctx = utils.extend(context, {UI_CONFIG});
            return template.replace(/{{([a-z0-9_.-]+)}}/gi, (match, token)=>{
              return JSON.stringify(utils.valueFromObjectCI(ctx, token, false));
            });
          }
        }
      }
    },
    relativeTo: webRoot,
    path: './'
  });
});

server.route([
  {
    method: 'GET',
    path: '/',
    handler: {
      view: 'index'
    }
  },
  {
    method: 'GET',
    path: '/index.html',
    handler: {
      view: 'index'
    }
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: webRoot
      }
    }
  },
].concat(ROUTES));

logger.info(`Static content folder: ${webRoot}`);

setImmediate(()=>server.emit('ready', server));

module.exports = server;
