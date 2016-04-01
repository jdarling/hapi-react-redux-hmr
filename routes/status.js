const os = require('os');
const pjson = require('../package');
const path = require('path');

const statusHandler = (req, reply)=>{
  return reply({
    pid: process.pid,
    version: pjson.version,
    os: {
      hostname: os.hostname(),
      loadavg: os.loadavg(),
      uptime: os.uptime(),
      freemem: os.freemem(),
      totalmem: os.totalmem(),
      cpus: os.cpus(),
      type: os.type(),
      release: os.release(),
      arch: os.arch(),
      platform: os.platform(),
    },
    pid: process.pid,
    env: process.env,
    argv: process.argv,
  });
};

module.exports = [
  {
    method: 'GET',
    path: '/health',
    handler: statusHandler
  },
  {
    method: 'GET',
    path: '/status',
    handler: statusHandler
  },
];
