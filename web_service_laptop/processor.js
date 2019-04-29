'use strict';

const {promisify} = require('util');
const readFile = promisify(require('fs').readFile);
const writeFile = promisify(require('fs').writeFile);
const appendFile = promisify(require('fs').appendFile);
const Path = require('path');


function Processor (fileName) {
    this.fileName = fileName;
}

Processor.prototype.writeFile = async function (sensorType, sensorId, value) {
    
    try {
        let data = `sensorId: ${sensorId} value: ${value}`

        await appendFile(`${sensorType}.txt`, `${data}\n`, (err, data) => {
            if (err) throw err;
            // console.log('Temp updated!');
        });

        await appendFile(`${sensorType}_${sensorId}.txt`, `${value}\n`, (err,  data) => {
            if (err) throw err;
            // console.log('Individual temp updated!');
        });

    } catch (err) {
        console.log(err);
    }
}

Processor.prototype.readFile = async function (fileName) {
   
    try {
       return await readFile(fileName, 'utf8');

    } catch (err) {
        console.log(err);
    }
}

function init () {
    return new Processor();
}

module.exports = { init };
