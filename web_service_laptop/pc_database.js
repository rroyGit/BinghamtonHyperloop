'use strict';

const assert = require('assert');
const mongo = require('mongodb').MongoClient;

const {inspect} = require('util');


class GNCDatabase {

    // URL: mongodb://localhost:27017/databaseName

  constructor(dbUrl) {  
    let [,databaseName] = REG_DATABASE_NAME.exec(dbUrl);
    let [,serverUrl] = REG_SERVER_URL.exec(dbUrl);

    this.databaseName = databaseName;
    this.serverUrl = serverUrl;
  }

  /** This routine is used for all asynchronous initialization
   *  for instance of DocFinder.  It must be called by a client
   *  immediately after creating a new instance of this.
   */
  async init() {
    try {
      this.mongoDBConnection = await mongo.connect(this.serverUrl, {useNewUrlParser: true});
    } catch (err) {
      console.log(err.message + "\nDatabase FAILED to connect, check if server is online or port is correct");
      process.exit();
    }
    
    assert(this.mongoDBConnection != null);
    if (this.mongoDBConnection.isConnected()) console.log("Database Connected");
    else {
      console.log("Database NOT Connected");
      process.exit();
    }

    this.databaseConnection = await this.mongoDBConnection.db(this.databaseName);

    // create collection for storing various telemetry data such as temperature readings

    this.telemetryTempCollection = await this.createCollection("Temperature");
  }

  /** Release all resources held by this doc-finder.  Specifically,
   *  close any database connections.
   */
  async close() {
    if (this.mongoDBConnection != null) 
        await this.mongoDBConnection.close();
    console.log("MongoDB connection closed");
  }

  /** Clear database */
  async clear() {
    if (this.databaseConnection != null) {
        let collectionArray = await this.databaseConnection.listCollections().toArray();
        let iter = collectionArray.map(collection => (collection.name)).entries();

        let collectionEntry;
        while (collectionEntry = iter.next().value) {
        await this.databaseConnection.dropCollection(collectionEntry[1]);
        }
    }
  }

  async createCollection(collectionName) {
    return await this.databaseConnection.createCollection(collectionName);
  }

  // ------------------------------------------------------------------------------------

  async writeTemp(sensorId, sensorValue) {
    try {
        await this.telemetryTempCollection.insertOne( {sensorID: sensorId, sensorValue: sensorValue} );
    } catch (err){
        console.log(err);
        throw `One or more errors in Database: ${this.databaseName} Collection: temperature`;
    }
  }

  async readLastTemp(sensorId) {
    try {
        const document = await this.telemetryTempCollection.findOne({"sensorID": sensorId}, { sort: { _id: -1 }, limit: 1 });
        if (document == null) throw `No document satisfies the query - readLastTemp() sensorID ${sensorId}`;

        const sensorValue = document.sensorValue;
        return sensorValue;
    } catch (err){
        console.log(err);
        throw `One or more errors in Database: ${this.databaseName} Collection: temperature`;
    }
  }

}

module.exports = GNCDatabase;

//Add module global functions, constants classes as necessary
//(inaccessible to the rest of the program).

let databaseName;
let serverUrl;

let mongoDBConnection;
let databaseConnection;

let telemetryDataCollection;

//Used to prevent warning messages from mongodb.
const MONGO_OPTIONS = {
  useNewUrlParser: true
};

const REG_DATABASE_NAME = /\/(\w+)$/g;

const REG_SERVER_URL = /(^.*)\//g
