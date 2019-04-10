'use strict';

const express = require('express');
const upload = require('multer')();
const fs = require('fs');
const mustache = require('mustache');
const path = require('path');
const { URL } = require('url');

const bodyParser = require('body-parser');

const STATIC_DIR = '../statics';
const TEMPLATES_DIR = '../templates';

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

function server(port, base, model, dir) {
  const app = express();
  app.locals.port = port;
  app.locals.base = base;
  app.locals.model = model;
  app.locals.dir = dir;

  // base = '/home'
  app.use(base, express.static(dir));
  
  
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  setupTemplates(app, TEMPLATES_DIR);
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`GNC Web Server listening on port ${port}`);
  });
}

module.exports = server;

/******************************** Routes *******************************/
const INDEX_PAGE = '/';
const MODEL_PAGE = '/home/model';

function setupRoutes(app) {
  
  const BASE = app.locals.base;

  app.get(INDEX_PAGE, redirectHome(app));
  
  // BASE = 'home/'
  app.get(BASE, toHomePage(app));
  app.get(MODEL_PAGE, toModelPage(app));

  
  // web service routes
  app.get(`/temp/:sensorId`, getTemp(app));

  app.use(doErrors()); //must be last - setup for server errors
}

/*************************** Action Routines ***************************/
function redirectHome(app) {
  return errorWrap(async function(req, res) {
    try {
      res.redirect(app.locals.base);
    }
    catch (err) {
      console.error(err);
    }
  });
}

function toHomePage(app) {
  return errorWrap(async function(req, res) {
    try {
      res.sendFile(path.join(app.locals.dir, '/statics/index.html'));
    }
    catch (err) {
      console.error(err);
    }
  });
}

function toModelPage(app) {
  return errorWrap(async function(req, res) {
    try {
      res.sendFile(path.join(app.locals.dir, '/statics/model.html'));
    }
    catch (err) {
      console.error(err);
    }
  });
}

function getTemp(app) {
  
  return errorWrap(async function(req, res) {
    try {

      const sensorId = req.params.sensorId;
      const sensorValue = await app.locals.model.getTemp(sensorId);
      
      //const model = { base: app.locals.base, name: name, content: contentData };
      //const html = doMustache(app, 'docUploaded', model);
      
      res.send(`${sensorValue}`);
    }
    catch (err) {
      console.error(err);
      console.log("ERROR in pc_server");
    }
  });
}

//action routines for routes + any auxiliary functions.

/************************ General Utilities ****************************/

// generate html string to green text search term
function generateCustomHTML(lines, terms) {
  let termArray = terms.split(" ");
  let retArray = [];
   
  for (let line of lines) {
    for (let term of termArray) {
      line = line.toLowerCase().replace(term.toLowerCase(), getHTMLString(term.toLowerCase()));
    }
    retArray.push(line);
  }
  return retArray;
}

function getHTMLString(term) {
  return `<span class=\"search-term\"> ${term} </span>`
}

/** return object containing all non-empty values from object values */
function getNonEmptyValues(values) {
  const out = {};
  Object.keys(values).forEach(function(k) {
    const v = values[k];
    if (v && v.trim().length > 0) out[k] = v.trim();
  });
  return out;
}

/** Return a URL relative to req.originalUrl.  Returned URL path
 *  determined by path (which is absolute if starting with /). For
 *  example, specifying path as ../search.html will return a URL which
 *  is a sibling of the current document.  Object queryParams are
 *  encoded into the result's query-string and hash is set up as a
 *  fragment identifier for the result.
 */
function relativeUrl(req, path='', queryParams={}, hash='') {
  const url = new URL('http://dummy.com');
  url.protocol = req.protocol;
  url.hostname = req.hostname;
  url.port = req.socket.address().port;
  url.pathname = req.originalUrl.replace(/(\?.*)?$/, '');
  if (path.startsWith('/')) {
    url.pathname = path;
  }
  else if (path) {
    url.pathname += `/${path}`;
  }
  url.search = '';
  Object.entries(queryParams).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });
  url.hash = hash;
  return url.toString();
}

/************************** Template Utilities *************************/


/** Return result of mixing view-model view into template templateId
 *  in app templates.
 */
function doMustache(app, templateId, view) {
  const templates = { footer: app.templates.footer };
  return mustache.render(app.templates[templateId], view, templates);
}

/** Add contents all dir/*.ms files to app templates with each 
 *  template being keyed by the basename (sans extensions) of
 *  its file basename.
 */
function setupTemplates(app, dir) {
  app.templates = {};
  for (let fname of fs.readdirSync(dir)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}

// error handlers

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
