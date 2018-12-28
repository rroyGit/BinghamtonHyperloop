'use strict';

const axios = require('axios');


function VisualWS(baseUrl) {
  this.webServiceUrl = `${baseUrl}/temp`;

}

module.exports = VisualWS;

//wrappers to call remote web services

VisualWS.prototype.getTemp = async function (sensorId) {
  try {
    const url = this.webServiceUrl + "/" + `${sensorId}`;
  
    console.log(url);
    const response = await axios.get(url);

    return response.data;
  }
  catch (err) {
    console.error(err);
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};

