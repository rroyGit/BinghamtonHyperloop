'use strict';

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const process = require('process');
const url = require('url');
const queryString = require('querystring');


const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;


//Main URLs
const TEMP = '/temp';
const DIST = '/dist';
const SPEED = '/speed';

const DATABASE_CLOSE = '/closeDB';
const DATABASE_CLEAR = '/clearDB';
const IP_ADDR = '/ipAddr';

function init (port, processor, pcDatabase) {

    const app = express();
    app.locals.port = port;
    app.locals.processor = processor;
    app.locals.pcDatabase = pcDatabase;

    setupRoutes(app);

    const server = app.listen(port, "0.0.0.0", async function() {
      console.log(`PID ${process.pid} listening on port ${port}`);
    });
    return server;
}
// export to other files
module.exports = { init };

function setupRoutes(app) {
    app.use(cors());              //for security workaround in future projects
    app.use(bodyParser.json());   //all incoming bodies are JSON

    //-----------------------------------------------TEMP----------------------
    // get last temperature reading from database with a sensorId
    // (e.g. /temp/1)
    app.get(`${TEMP}/:sensorId`, getTemp(app));

    // set temperature reading to database with a sensorId
    // (e.g. /temp?sensorId=1&value=67&seqNum=0)
    app.get(`${TEMP}?`, setTemp(app));
    //-----------------------------------------------DIST----------------------
    // get last distance reading from database with a sensorId
    // (e.g. /dist/1)
    app.get(`${DIST}/:sensorId`, getDist(app));

    // set distance reading to database with its sensorId
    // (e.g. /dist?sensorId=1&value=67)
    app.get(`${DIST}?`, setDist(app));
    //-----------------------------------------------SPEED---------------------
    // get last speed reading from database with a sensorId
    // (e.g. /speed/1)
    app.get(`${SPEED}/:sensorId`, getSpeed(app));

    // set temp reading to database with its sensorId
    // (e.g. /speed?sensorId=1&value=67)
    app.get(`${SPEED}?`, setSpeed(app));


    app.get(`${IP_ADDR}`, getIPAddr(app));

    // close database
    app.get(`${DATABASE_CLOSE}`, closeDatabase(app));
    // clear database
    app.get(`${DATABASE_CLEAR}`, clearDatabase(app));

    app.use(doErrors()); //must be last; setup for server errors
}

//-----------------------------------------------TEMP----------------------
function getTemp (app) {
  return errorWrap(async function(req, res) {
    try {
      if (req.params == undefined || req.params.sensorId == undefined || req.params.sensorId.length === 0) {
        throw {
          isDomain: true,
          errorCode: `BAD_REQUEST`,
          message: `Incorrect url, try like > /temp/1`,
        };
      }

      const sensorId = req.params.sensorId;

      //const fileName = `temp${sensorId}.txt`;
      //const value = await app.locals.processor.readFile(fileName);

      const returnObj = await app.locals.pcDatabase.readLastTemp(sensorId);

      res.statusCode = OK;
      res.json(returnObj);

    } catch(err) {
      let statusReport = getError(err);
      res.status(statusReport.status).json(statusReport);
    }
  });
}

function setTemp (app) {
  return errorWrap(async function(req, res) {
    try {

      if (req.query.sensorId === undefined || req.query.sensorId.length === 0
        || req.query.value === undefined || req.query.value.length === 0
        || req.query.seqNum === undefined || req.query.seqNum.length === 0) {
        throw {
          isDomain: true,
          errorCode: `BAD_REQUEST`,
          message: `Incorrect url, try like > /temp?sensorId=1&value=26&seqNum=0`,
        };
      }

      const [sensorId, value, seqNum] = [req.query.sensorId, req.query.value, req.query.seqNum];

      await app.locals.processor.writeFile('temp', sensorId, value);
      await app.locals.pcDatabase.writeTemp(sensorId, value, seqNum);

      res.statusCode = CREATED;

      const returnObj = {URL: `/temp?sensorId=${sensorId}&value=${value}&seqNum=${seqNum}`};
      res.json(returnObj);
    } catch(err) {
      let statusReport = getError(err);
      res.status(statusReport.status).json(statusReport);
    }
  });
}
//-----------------------------------------------DIST----------------------
function getDist (app) {
  return errorWrap(async function(req, res) {
    try {
      if (req.params == undefined || req.params.sensorId == undefined || req.params.sensorId.length === 0) {
        throw {
          isDomain: true,
          errorCode: `BAD_REQUEST`,
          message: `Incorrect url, try like > /dist/1`,
        };
      }

      const sensorId = req.params.sensorId;

      //const fileName = `dist${sensorId}.txt`;
      //const value = await app.locals.processor.readFile(fileName);

      const returnObj = await app.locals.pcDatabase.readLastDist(sensorId);

      res.statusCode = OK;
      res.json(returnObj);

    } catch(err) {
      let statusReport = getError(err);
      res.status(statusReport.status).json(statusReport);
    }
  });
}

function setDist (app) {
  return errorWrap(async function(req, res) {
    try {
      if (req.query.sensorId === undefined || req.query.sensorId.length === 0
        || req.query.value === undefined || req.query.value.length === 0
        || req.query.seqNum === undefined || req.query.seqNum.length === 0) {
        throw {
          isDomain: true,
          errorCode: `BAD_REQUEST`,
          message: `Incorrect url, try like > /dist?sensorId=1&value=26&seqNum=0`,
        };
      }

      const [sensorId, value, seqNum] = [req.query.sensorId, req.query.value, req.query.seqNum];

      await app.locals.processor.writeFile('dist', sensorId, value);
      await app.locals.pcDatabase.writeDist(sensorId, value, seqNum);

      res.statusCode = CREATED;

      const returnObj = {URL: `/dist?sensorId=${sensorId}&value=${value}&seqNum=${seqNum}`};
      res.json(returnObj);
    } catch(err) {
      let statusReport = getError(err);
      res.status(statusReport.status).json(statusReport);
    }
  });
}
//-----------------------------------------------SPEED---------------------
function getSpeed (app) {
  return errorWrap(async function(req, res) {
    try {
      if (req.params == undefined || req.params.sensorId == undefined || req.params.sensorId.length === 0) {
        throw {
          isDomain: true,
          errorCode: `BAD_REQUEST`,
          message: `Incorrect url, try like > /speed/1`,
        };
      }

      const sensorId = req.params.sensorId;

      //const fileName = `speed${sensorId}.txt`;
      //const value = await app.locals.processor.readFile(fileName);

      const returnObj = await app.locals.pcDatabase.readLastSpeed(sensorId);

      res.statusCode = OK;
      res.json(returnObj);

    } catch(err) {
      let statusReport = getError(err);
      res.status(statusReport.status).json(statusReport);
    }
  });
}

function setSpeed (app) {
  return errorWrap(async function(req, res) {
    try {
      if (req.query.sensorId === undefined || req.query.sensorId.length === 0
        || req.query.value === undefined || req.query.value.length === 0
        || req.query.seqNum === undefined || req.query.seqNum.length === 0) {
        throw {
          isDomain: true,
          errorCode: `BAD_REQUEST`,
          message: `Incorrect url, try like > /speed?sensorId=1&value=26&seqNum=0`,
        };
      }

      const [sensorId, value, seqNum] = [req.query.sensorId, req.query.value, req.query.seqNum];

      await app.locals.processor.writeFile('speed', sensorId, value);
      await app.locals.pcDatabase.writeSpeed(sensorId, value, seqNum);

      res.statusCode = CREATED;

      const returnObj = {URL: `/speed?sensorId=${sensorId}&value=${value}&seqNum=${seqNum}`};
      res.json(returnObj);
    } catch(err) {
      let statusReport = getError(err);
      res.status(statusReport.status).json(statusReport);
    }
  });
}

function getIPAddr (app) {
  return errorWrap(async function(req, res) {
    try {
      const addr = await app.locals.processor.readFile("IP_Addr.txt");

      res.statusCode = OK;
      res.json({ip: addr});
    } catch(err) {
      let statusReport = getError(err);
      res.status(statusReport.status).json(statusReport);
    }
  });
}

function closeDatabase (app) {
  return errorWrap(async function(req, res) {
    try {
      await app.locals.pcDatabase.close();
      res.send("GOOD");
    } catch(err) {
      console.log(err);
      res.send("BAD");
    }
  });
}

function clearDatabase (app) {
  return errorWrap(async function(req, res) {
    try {
      await app.locals.pcDatabase.clearDatabase();
      res.send("GOOD");
    } catch(err) {
      console.log(err);
      res.send("BAD");
    }
  });
}


//------------------------------------ERROR HANDLING INIT--------------------------------
function getError (err) {
  let errorObj;

  if (err.isDomain) {
    let statusType;
    switch (err.errorCode) {
      case "NOT_FOUND" :
        statusType = NOT_FOUND;
        break;
      case "EXISTS" :
        statusType = CONFLICT;
        break;
      default:
        statusType = BAD_REQUEST;
    }

    errorObj = {
      status: statusType,
      code: err.errorCode,
      message: err.message
    }
  } else {
    errorObj = {
      status: SERVER_ERROR,
      code: `INTERNAL`,
      message: err.toString(),
    }
  }

  return errorObj;
}

  /** Return error handler which ensures a server error results in nice
   *  JSON sent back to client with details logged on console.
   */
function doErrors(app) {
  return async function(err, req, res, next) {

    // catch JSON syntax error
    if (err instanceof SyntaxError) {
      const error = {error: "Invalid JSON", tips: "Check if body has correct JSON syntax" }
      res.statusCode = BAD_REQUEST;
      res.json(error);
    } else {
      res.status(SERVER_ERROR);
      res.json({ code: 'SERVER_ERROR', message: err.message });
      console.error(err);
    }
  };
}

  /** Set up error handling for handler by wrapping it in a
   *  try-catch with chaining to error handler on error.
   */
function errorWrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    }
    catch (err) {
      next(err);
    }
  };
}

  /** Return base URL of req for path.
   *  Useful for building links; Example call: baseUrl(req, TEMP)
   */
function baseUrl(req, path='/') {
  const port = req.app.locals.port;
  const url = `${req.protocol}://${req.hostname}:${port}${path}`;
  return url;
}
