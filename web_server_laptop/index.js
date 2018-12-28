#!/usr/bin/env nodejs
'use strict';

const assert = require('assert');
const process = require('process');

const visualWS = require('./visual_ws');
const teleData = require('./teleData');

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
    const port = getPort(args[0]);
    const wsBaseUrl = args[1];
    const teleWS = new visualWS(wsBaseUrl);
    teleData(port, BASE, teleWS);
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