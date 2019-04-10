'use strict';

const axios = require('axios');


function WebServiceController(baseUrl) {
  this.webServiceUrl = `${baseUrl}/temp`;

}

module.exports = WebServiceController;

//wrappers to call remote web services

WebServiceController.prototype.getTemp = async function (sensorId) {
  try {
    const url = this.webServiceUrl + "/" + `${sensorId}`;
    const response = await axios.get(url);

    return response.data;

  }
  catch (err) {
    console.error(err);
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};

