'use strict';

const axios = require('axios');

function WebServiceController(baseUrl) {
  this.wsTempUrl = `${baseUrl}/temp`;
  this.wsDistUrl = `${baseUrl}/dist`;
  this.wsSpeedUrl = `${baseUrl}/speed`;
  this.wsIPAddr = `${baseUrl}/ipAddr`;
}

module.exports = WebServiceController;

//wrappers to call remote web service

WebServiceController.prototype.getTemp = async function (sensorId) {
  try {
    const url = this.wsTempUrl + '/' + `${sensorId}`;
    const response = await axios.get(url);

    return response.data;

  }
  catch (err) {
    console.error(err);
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};

WebServiceController.prototype.getDist = async function (sensorId) {
  try {
    const url = this.wsDistUrl + '/' + `${sensorId}`;
    const response = await axios.get(url);

    return response.data;

  }
  catch (err) {
    console.error(err);
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};

WebServiceController.prototype.getSpeed = async function (sensorId) {
  try {
    const url = this.wsSpeedUrl + '/' + `${sensorId}`;
    const response = await axios.get(url);

    return response.data;

  }
  catch (err) {
    console.error(err);
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};
