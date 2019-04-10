#!/usr/bin/env nodejs
'use strict';

const assert = require('assert');
const process = require('process');

const WebServiceController = require('./js/WebServiceController');
const WebServer = require('./js/WebServer');

function usage() {
  console.error(`usage: ${process.argv[1]} PORT WS_BASE_URL`);
  process.exit(1);
}

function getPort(portArg) {
  let port = Number(portArg);
  if (!port) usage();
  return port;
}

const BASE = '/home';

async function go(args) {
  try {
    process.chdir(__dirname);
    const port = getPort(args[0]);
    const wsBaseUrl = args[1];
    const webServiceController = new WebServiceController(wsBaseUrl);
    WebServer(port, BASE, webServiceController, __dirname);
  }
  catch (err) {
    console.error(err);
  }
}
    
if (process.argv.length != 4) {
    usage();
} else {
    go(process.argv.slice(2));
}
