'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const Umzug = require('umzug')
const env = process.env.NODE_ENV || 'development';
//Load the configuration from the config.js
const config = require(__dirname + '/../config/config1.json')[env];
 
//Create an empty object which can store our databases
const db={}
 
//Extract the database information into an array
const databases = Object.keys(config.databases);
 
//Loop over the array and create a new Sequelize instance for every database from config.js
for(let i = 0; i < databases.length; ++i) {
    let database = databases[i];
    let dbPath = config.databases[database];
    //Store the database connection in our db object
 let   sequelize = new Sequelize( dbPath.database, dbPath.username, dbPath.password, dbPath );
 sequelize.authenticate();
 {
   console.log("connection successfull")
 }
 const umzug = new Umzug({
        migrations: {
            // indicates the folder containing the migration .js files
            path: path.join(__dirname, '../migrations'),
            // inject sequelize's QueryInterface in the migrations
            params: [
            sequelize.getQueryInterface()
            ]     
        },
        // indicates that the migration data should be store in the database
        // itself through sequelize. The default configuration creates a table
        // named `SequelizeMeta`.
        storage: 'sequelize',
        storageOptions: {
            sequelize: sequelize
        }
        })
        ;(async () => {
            
                // checks migrations and run them if they are not already applied
                await umzug.up()
                console.log('All migrations performed successfully')
        })()
        }
