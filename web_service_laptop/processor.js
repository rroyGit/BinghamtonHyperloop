'use strict';

const {promisify} = require('util');
const readFile = promisify(require('fs').readFile);
const appendFile = promisify(require('fs').appendFile);
const Path = require('path');


function Processor (fileName) {
    this.initial_writing = true;
    this.fileName = fileName;
}

Processor.prototype.writeFile = async function(data) {
    
    try {
        
        await appendFile('temp.txt', `${data}\n`, (res, err) => {
            if (err) throw err;
            console.log('Temp updated!');
        });

    } catch (err) {
        console.log(err);
    }
}

Processor.prototype.readFile = async function readFile () {


}

function init () {
    return new Processor();
}

module.exports = { init };
