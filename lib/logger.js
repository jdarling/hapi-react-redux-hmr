'use strict';

const pjson = require('../package.json');
const util = require('util');
const exclude = require('./utils').exclude;
const os = require('os');
const HOSTNAME = os.hostname();
const PID = process.pid;
const VERSION = pjson.version;
const APP_NAME = pjson.name;

const LOG_MODE = process.argv.reduce((mode, item)=>{
  const match = item.match(/(-l|--log.mode=)(.+)/i)
  if(match&&match[2]){
    return match[2];
  }
  return mode;
}, 'pretty');

const isSpecialObject = (value)=>(value instanceof Date || value instanceof RegExp);

const reformLogObjects = (...args)=>{
  return args.map((value, index)=>{
    if(((typeof(value)==='object')&&(!isSpecialObject(value)))||Array.isArray(value)){
      return util.inspect(value, {depth: null, colors: true});
    }
    return value;
  });
};

/* istanbul ignore next */
let _outputHandler = (pkt)=>console.log.apply(console, reformLogObjects(exclude(pkt, 'logger')));
if(LOG_MODE==='json'){
  //_outputHandler = (pkt)=>console.log.apply(console, exclude(pkt, 'logger'));
  _outputHandler = (pkt)=>{
    console.log(JSON.stringify(exclude(pkt, 'logger')));
  };
}

/* istanbul ignore next */
const outputHandler = (logger, level, dt, ...args)=>{
  let levelName = Object.keys(logger.levels).filter((name)=>logger.levels[name]===level)[0]||'UNKNOWN';
  var pkt = {
    logger,
    level,
    levelName,
    dateTime: dt,
    host: HOSTNAME,
    pid: PID,
    version: VERSION,
    appName: APP_NAME,
    data: args
  };
  _outputHandler(pkt);
};

const logger = {
  levels: {
    DEBUG: 10,
    INFO: 20,
    WARN: 40,
    ERROR: 50,
  },
  debug(...args){
    //let outputHandler = this.outputHandler();
    args.unshift(this, this.levels.DEBUG, new Date());
    outputHandler.apply(outputHandler, args);
  },
  info(...args){
    //let outputHandler = this.outputHandler();
    args.unshift(this, this.levels.INFO, new Date());
    outputHandler.apply(outputHandler, args);
  },
  warn(...args){
    //let outputHandler = this.outputHandler();
    args.unshift(this, this.levels.WARN, new Date());
    outputHandler.apply(outputHandler, args);
  },
  error(...args){
    //let outputHandler = this.outputHandler();
    args.unshift(this, this.levels.ERROR, new Date());
    if(args[args.length-1] instanceof Error){
      let error = args.pop();
      let errMsg = error.toString();
      if(error.stack){
        errMsg = errMsg + '\n' + error.stack;
      }
      args.push(errMsg);
    }
    outputHandler.apply(outputHandler, args);
  },
  setOutputHandler(handler){
    _outputHandler = handler;
  },
  outputHandler(){
    return _outputHandler;
  },
};

module.exports = logger;
