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

function init (port, processor) {
    
    const app = express();
    app.locals.port = port;
    app.locals.processor = processor;
    setupRoutes(app);
    
    const server = app.listen(port, async function() {
      console.log(`PID ${process.pid} listening on port ${port}`);
    });
    return server;
}
// export to other files
module.exports = { init };

function setupRoutes(app) {
    app.use(cors());              //for security workaround in future projects
    app.use(bodyParser.json());  //all incoming bodies are JSON
    
    
    // get temp reading from file
    // (e.g. /temp/1)
    app.get(`${TEMP}/:sensorId`, doReadTemp(app));

    // write temp readings to file
    // (e.g. /temp?sensorId=1&value=67)
    app.get(`${TEMP}?`, doWriteTemp(app));
    app.use(doErrors()); //must be last; setup for server errors   
}

function doReadTemp (app) {
  return errorWrap(async function(req, res) {
    try {
      const sensorId = req.params.sensorId; 
      
      const fileName = `temp${sensorId}.txt`;
      const value = await app.locals.processor.readFile(fileName);
      res.send(value);
     
    } catch(err) {
      res.send("BAD");
      console.log(err);
    }
  });
}

function doWriteTemp (app) {
  return errorWrap(async function(req, res) {
    try {
      if (req.query.sensorId == null || req.query.sensorId.length === 0 
        || req.query.value == null || req.query.value.length ===0) {
        throw {
          isDomain: true,
          errorCode: `BAD_REQUEST`,
          message: `Incorrect url, try like so temp?sensorId=1&value=26`,
        };
      }

      const [sensorId, value] = [req.query.sensorId, req.query.value];
    
      await app.locals.processor.writeFile(sensorId, value);
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
  