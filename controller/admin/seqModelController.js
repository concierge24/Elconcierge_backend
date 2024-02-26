"use strict";
var log4js = require('log4js');
var logger = log4js.getLogger();
var sendResponse = require('../.././routes/sendResponse');
var constant = require('../.././routes/constant');
const SequelizeAuto = require('sequelize-auto')
class Models {
    static async generate(req, res, next) {
        try {
            logger.info("============welcome to generating models function=========>>>>>");

            const auto = new SequelizeAuto(config.get('databaseSettings.database'), config.get('databaseSettings.user'), null, {
                host: config.get('databaseSettings.host'),
                dialect: 'mysql',
                directory: './mySqlModel', // where to write files
                caseFile: 'c', // 
                singularize: true,
                logging:false
            });
            auto.run()
            logger.debug("<<<=====Generating sequelize models=====>>>>")
            sendResponse.sendSuccessData({
                message: "sequelize models generated......."
            }, constant.responseMessage.SUCCESS, res, 200);

        } catch (error) {
            logger.debug("<<<<=======Error while genertaing sequelize models===>>", err);
            sendResponse.sendErrorMessageWithTranslation(req, constant.responseMessage.ERROR_IN_EXECUTION, res, 500);
        }

    }
}


module.exports = {
   Models: Models
}