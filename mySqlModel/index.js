'use strict';
let Sequelize=require('sequelize');
let sendResponse = require('./../routes/sendResponse');
let constant = require('./../routes/constant');
let log4js = require('log4js');
let logger = log4js.getLogger();
const universalFunc=require('../util/Universal')
class sequeliz {
        static async connect (req,res,next){
            let dbName= await universalFunc.getDecryptData(req.headers.secretdbkey);
            let sequelize=new Sequelize(dbName, config.get('databaseSettings.user'),config.get('databaseSettings.password'),{
                dialect:"mysql",
                host:config.get('databaseSettings.host')
            });
            sequelize
            .authenticate()
            .then(() => {
                logger.info('<<<<==============Connection has been established successfully.=====>>>>>>');
                let initModels=require('./init-models')
                var models=initModels(sequelize);
                global.models=models;
                global.sequelized=sequelize;
                next()
            })
            .catch(err => {
              console.error('<<<<<=========Unable to connect to the database:=====>>>>>', err);
              sendResponse.sendErrorMessageWithTranslation(req,constant.responseMessage.ERROR_IN_EXECUTION, res, 500);
            });
        }
}
module.exports.sequeliz=sequeliz;


