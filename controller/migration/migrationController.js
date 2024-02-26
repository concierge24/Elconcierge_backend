"use strict"
var Sequelize = require('sequelize')
var log4js = require('log4js');
var logger = log4js.getLogger();
var sendResponse = require('../.././routes/sendResponse');
var constant = require('../.././routes/constant');
var consts = require('../../config/const');
const Umzug = require('umzug');
const path = require('path');
const universalFunc=require('../../util/Universal')



class migration {
    static async migrateFiles(req, res, next) {
        try {
            logger.info("<<<<<<<<<<<=============In migration function=====================>>>>>>>>>>>>")

            let sql = "select ccd.name,ccd.host,ccd.username,ccd.password from  cbl_customer_dbs ccd join cbl_customer cc on ccd.customer_id=cc.id where ";
            sql += "cc.is_block=0 and ccd.is_deleted=0";

           let stmt = cblConnection.query(sql, async function (err, data) {
           
                for (const [index, i] of data.entries()) {

                    var password= await universalFunc.getDecryptData(i.password);
                    let sequelize = new Sequelize(i.name, i.username, password, {
                        dialect: "mysql",
                        host: i.host
                    });

                   let umzug = new Umzug({
                        migrations: {
                            path: path.join(__dirname, '../../migrations'),
                            params:[sequelize.getQueryInterface()]
                        },
                        storage: 'sequelize',
                        storageOptions: {
                            sequelize: sequelize
                        }
                    });
                    (async () => {
                        await umzug.up()
                        console.log('All migrations performed successfully');
                    })()
                }
                sendResponse.sendSuccessData({message:"All migrations performed successfully"}, constant.responseMessage.SUCCESS, res, 200);
            })
        } catch (err) {

            logger.debug("Error while migrating files to Dbs===>>", err);
            sendResponse.sendErrorMessageWithTranslation(req, constant.responseMessage.ERROR_IN_EXECUTION, res, 500);
        }
        cblConnection.end();
    }

}





module.exports = {
    migration: migration
}