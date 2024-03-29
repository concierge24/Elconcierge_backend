var sendResponse = require('../routes/sendResponse');
var constant = require('../routes/constant');
var consts = require('./../config/const')
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
const agentUniversal = require('./../common/agent')
const ExecuteQ = require('../lib/Execute');
const universalFunc = require('../util/Universal')
var crypto = require('crypto')
algorithm = consts.SERVER.CYPTO.ALGO,
    crypto_password = consts.SERVER.CYPTO.PWD

exports.branchAuthentication = async function (req, res, cb) {
    console.log("..fll..", accessToken);
    var values = [req.headers.authorization];
    if (req.headers.secretdbkey != undefined && req.headers.secretdbkey != "") {
        var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
        dbConnection = multiConnection[DbName]
    } else {
        dbConnection = connection
    }
    var q = ' select id from supplier_branch where access_token = ? ';
    dbConnection.query(q, values, async function (err, result) {
        console.log("....er....", err, result);
        if (result.length > 0) {
            req.user = result[0];
            req.dbName = DbName;
            let results = await ExecuteQ.Query(req.dbName, "select app_type from screen_flow", []);
            req.service_type = results[0].app_type
            return cb(null, result[0].id);
        } else {
            var data = {};
            sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);
        }
    });

}


/*
 * ------------------------------------------------------
 * function to check the authorities of the admin
 * Input:admin id, section id
 * Output: Success Message or Error
 * ------------------------------------------------------
 */
exports.checkforAuthorityofThisAdmin = async function (req, res, cb) {
    logger.debug("Inside ()()()(()) check fn", req.body, req.user, req.user.id);
    var sectionId = req.body.sectionId || req.query.sectionId || req.params.sectionId
    logger.debug("sectionId ********* check fn", sectionId, req.params);
    var sql = "SELECT `is_superadmin`,`is_active` FROM admin where id=? limit 1 ",
        dbConnection
    if (req.headers.secretdbkey != undefined && req.headers.secretdbkey != "") {
        var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
        dbConnection = multiConnection[DbName]
    } else {
        dbConnection = connection
    }
    dbConnection.query(sql, [parseInt(req.user.id)], function (err, result) {
        if (err) {
            sendResponse.somethingWentWrongError(res);
        } else {
            if (result[0].is_active == 1) {

                if (result[0].is_superadmin == 1) {
                    return cb(null);
                } else {
                    return cb(null);
                    // var sql = "select id from admin_authority where section_id=? && admin_id=? limit 1"
                    // dbConnection.query(sql, [parseInt(sectionId), parseInt(req.user.id)], function (err, checkAuthority) {
                    //     if (err) {
                    //         logger.debug(err)
                    //         sendResponse.somethingWentWrongError(res);
                    //     }
                    //     else {
                    //       //  console.log(checkAuthority)
                    //         if (checkAuthority.length) {
                    //             return cb(null);
                    //         }
                    //         else {
                    //             sendResponse.invalidAccessTokenError(res);
                    //         }
                    //     }
                    //
                    // })
                }
            } else {
                var data = {};
                sendResponse.sendSuccessData(data, constant.responseMessage.NOT_ACTIVE, res, constant.responseStatus.NOT_ACTIVE);
            }
        }

    })

}



/*
 * ------------------------------------------------------
 * function to check the authorities of the admin
 * Input:admin id, section id
 * Output: Success Message or Error
 * ------------------------------------------------------
 */
exports.checkforAuthorityofThisAdminV1 = async function (req, res, cb) {
    try{
            logger.debug("Inside ()()()(()) check fn", req.body, req.user, req.user.id);
            let sectionId = req.body.sectionId || req.query.sectionId || req.params.sectionId;
            let result = await models.admin.findAll({
                where: {
                    id: parseInt(req.user.id)
                },
                attributes:["is_superadmin","is_active"]
            });
            if (result[0].is_active == 1) {

                if (result[0].is_superadmin == 1) {
                    return cb(null);
                } else {
                    return cb(null);
                   
                }
            } else {
                var data = {};
                sendResponse.sendSuccessData(data, constant.responseMessage.NOT_ACTIVE, res, constant.responseStatus.NOT_ACTIVE);
            }
        }
        catch(Err){
            logger.debug("=======ERR!====>>",Err)
            var data = {};
            sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);
        }

}




/*
 * ------------------------------------------------------
 * Authenticate a user through Access token and return id
 * Input:Access token
 * Output: Admin_id Or Json error
 * ------------------------------------------------------
 */
exports.authenticateAccessTokenV1 = async function (req, res, next) {

    var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
    try {
        let result = models.admin.findOne({
            where: {
                access_token: req.headers.authorization
            }
        });
        let result2 = result ? models.screen_flow.findAll({}) : sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);
        await Promise.all([result, result2]).then(async (process) => {
            if (process[0] && process[1]) {
                req.user=process[0];
                req.service_type = process[1].app_type
                req.is_single_vendor = process[1].is_single_vendor
                next(null, process[0].id)
            } else {
                console.log("access token invalid in common function");
                var data = {};
                sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);
            }
        }).catch(err => {
            console.error("access token invalid in common function",err);
            var data = {};
            sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN)
        })
    } catch (err) {
        console.log("access token invalid in common function");
        var data = {};
        sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);
    }
}

/*
 * ------------------------------------------------------
 * Authenticate a user through Access token and return id
 * Input:Access token
 * Output: Admin_id Or Json error
 * ------------------------------------------------------
 */
exports.authenticateAccessToken = async function (req, res, next) {

   
    try {
            let DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
            let  sql = "select id,email from admin";
            sql += " where access_token =? limit 1";
            let values = [req.headers.authorization];

            let result=await ExecuteQ.Query(DbName,sql,values)
            if (result && result.length>0) {
                req.user=result[0];
                req.dbName=DbName;
                let results = await ExecuteQ.Query(req.dbName,"select app_type,is_single_vendor from screen_flow",[]);
                req.service_type = results[0].app_type
                req.is_single_vendor = results[0].is_single_vendor
                return next(null, result[0].id);
            } else {
                console.log("access token invalid in common function");
                var data = {};
                sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);
            }
        
    } catch (err) {
        console.log("access token invalid in common function",err);
        var data = {};
        sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);
    }
}
exports.userAuthenticate = async (req, res, next) => {
    // logger.debug("==req.headers===H",req.headers)
    var values = [req.headers.authorization];
    logger.debug("============req.headers.secretdbkey and req.headers.secretdbkey==============", req.headers.secretdbkey)
    if (req.headers.secretdbkey != undefined && req.headers.secretdbkey != "") {
        var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
        dbConnection = multiConnection[DbName]
    } else {
        dbConnection = connection
    }
    logger.debug("=====================()()(===========")
    var sql = "select id from user where access_token = ? ";
    var st = dbConnection.query(sql, [values], async function (err, result) {
        logger.debug(st.sql);
        if (err) {
            var msg = "db error :";
            return sendResponse.sendErrorMessage(msg, res, 400);
        } else {
            logger.debug(result);
            if (result.length) {
                id = result[0].id;
                req.users = result[0];
                req.dbName = DbName
                let results = await ExecuteQ.Query(req.dbName, "select app_type from screen_flow", []);
                req.service_type = results[0].app_type
                logger.debug("=====result=====", result);
                next(null, result);
            } else {
                var msg = "invalid accessToken pass";
                return sendResponse.sendErrorMessage(msg, res, 401);
            }
        }
    })
}
/**
 * @description used for authenticate user
 * @param {*Object} req 
 * @param {*Object} res 
 * @param {*} next 
 */
exports.userAuthenticateV1 = async (req, res, next) => {
    try{ 
        logger.debug("======req.headers.authorization====>>",)
        let token=req.headers.authorization || "";
        let result=await models.user.findAll({where:{
            access_token:token
        },attributes:["id"]})
        logger.debug(result);
        if (result && result.length>0) {
            id = result[0].id;
            req.users = result[0];
            let results = await models.screen_flow.findAll()
            req.service_type = results[0].app_type
            logger.debug("=====result=====", result);
            next(null, result);
        } else {
            var msg = "invalid accessToken pass";
            return sendResponse.sendErrorMessage(msg, res, 401);
        }
        }
        catch(Err){
                logger.debug("====ERR!=====>>",Err)
                  var msg = "db error :";
                 return sendResponse.sendErrorMessage(msg, res, 400);
        }
}

exports.agentAuthenticate = async (req, res, next) => {
    try {
        logger.debug("============req.headers.secretdbkey and req.headers.secretdbkey==============", req.headers.secretdbkey)
        if (req.headers.secretdbkey != undefined && req.headers.secretdbkey != "") {

            var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
            req.dbName = DbName
        }
        let user_id = req.body.user_id;
        let getAgentDbData = await agentUniversal.GetAgentDbInformation(req.dbName);
        let agentConnection = await agentUniversal.RunTimeAgentConnection(getAgentDbData);
        let sqlQuery = "select id from cbl_user where id=?";
        let agentData = await ExecuteQ.QueryAgent(agentConnection, sqlQuery, [user_id])
        console.log("=agentData==dbName==req.dbName==>>", DbName, agentData, req.dbName)
        if (agentData && agentData.length > 0) {
            req.agent = agentData[0];
            req.dbName = DbName
            let results = await ExecuteQ.Query(req.dbName, "select app_type from screen_flow", []);
            req.service_type = results[0].app_type
            // logger.debug("=====result=====",result);
            next(null, results);
        } else {
            console.log("==agentAuthenticate==Else=>>")
            var msg = "invalid accessToken pass";
            return sendResponse.sendErrorMessage(msg, res, 401);
        }
    } catch (Err) {
        console.log("==agentAuthenticate==Err!==", Err)
        var msg = "invalid accessToken pass";
        return sendResponse.sendErrorMessage(msg, res, 401);

    }


}
exports.supplierAuth = async (req, res, next) => {

    try {
        var values = [req.headers.authorization],
            dbConnection;
        if (req.headers.secretdbkey != undefined && req.headers.secretdbkey != "") {
            var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
            dbConnection = multiConnection[DbName]
        } else {
            dbConnection = connection
        }
        var q = ' select supplier_id,id from supplier_admin where access_token = ? ';
        var values = [req.headers.authorization];
        let result = await ExecuteQ.Query(DbName, q, values);

        var q1 = ' select supplier_id,id,is_head_branch from supplier_branch where access_token = ? ';
        var values1 = [req.headers.authorization];
        let result2 = await ExecuteQ.Query(DbName, q1, values1)
        if (result.length) {
            result[0].isBranch = false;
            result[0].supplierBranchId = 0;
            result[0].isHeadBranch = 0;
            req.supplier = result[0];
            req.user = result[0];
            req.dbName = DbName;
            let results = await ExecuteQ.Query(req.dbName, "select app_type from screen_flow", []);
            req.service_type = results[0].app_type
            return next(null, result[0].id);

        } else if (result2.length) {
            result2[0].isBranch = true;
            result2[0].supplierBranchId = result2[0].id;
            result2[0].isHeadBranch = result2[0].is_head_branch;
            req.supplier = result2[0];
            req.user = result2[0];
            req.dbName = DbName;
            let results = await ExecuteQ.Query(req.dbName, "select app_type from screen_flow", []);
            req.service_type = results[0].app_type
            return next(null, result2[0].id);
        } else {
            var data = {};
            sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);

        }
    } catch (Err) {
        logger.debug("====SupplierAuth==Err!", Err)
        var data = {};
        sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);

    }
    // dbConnection.query(q, values,async function(err, result) {
    //     console.log("supplier admin",err,result);
    //     if (result.length) {
    //         result[0].isBranch = false;
    //         result[0].supplierBranchId = 0;
    //         result[0].isHeadBranch = 0;
    //         req.supplier=result[0];
    //         req.user=result[0];
    //         req.dbName=DbName;
    //         let results = await ExecuteQ.Query(req.dbName,"select app_type from screen_flow",[]);
    //         req.service_type = results[0].app_type
    //         return next(null, result[0].id);

    //     } else {
    //         var q = ' select supplier_id,id,is_head_branch from supplier_branch where access_token = ? ';
    //         var values = [req.headers.authorization];        
    //         dbConnection.query(q, values,async function(err, result) {

    //             if (result.length) {
    //                 result[0].isBranch = true;
    //                 result[0].supplierBranchId = result[0].id;
    //                 result[0].isHeadBranch = result[0].is_head_branch;
    //                 req.supplier=result[0];
    //                 req.user=result[0];
    //                 req.dbName=DbName;
    //                 let results = await ExecuteQ.Query(req.dbName,"select app_type from screen_flow",[]);
    //                 req.service_type = results[0].app_type
    //                 return next(null, result[0].id);
    //             }else{
    //                 //  console.log("access token invalid in common function");
    //                 var data = {};
    //                 sendResponse.sendSuccessData(data, constant.responseMessage.INVALID_ACCESS_TOKEN, res, constant.responseStatus.INVALID_ACCESS_TOKEN);

    //             }
    //         });

    //       }
    // });

}
exports.checkforAuthorityofThisSupplier = async function (req, res, cb) {
    console.log("Inside authority check fn");
    var sectionId = req.body.sectionId || req.query.sectionId || req.params.sectionId
    var dbConnection;
    console.log("sectionId ********* check fn", sectionId, req.params);

    if (req.headers.secretdbkey != undefined && req.headers.secretdbkey != "") {

        var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
        dbConnection = multiConnection[DbName]
    } else {
        dbConnection = connection
    }

    console.log('req.supplier', req.supplier);
    if (req.supplier.isBranch) {
        return cb(null);
    }
    var sql = "SELECT `is_superadmin`,`is_active` FROM supplier_admin where id=? limit 1 "
    dbConnection.query(sql, [parseInt(req.supplier.id)], function (err, result) {
        if (err) {
            logger.debug("=======", err)
            sendResponse.somethingWentWrongError(res);
        } else {
            if (result[0].is_active == 1) {

                if (result[0].is_superadmin == 1) {
                    return cb(null);
                } else {
                    var sql = "select id from supplier_authority where supplier_section_id=? && supplier_admin_id=? limit 1"
                    dbConnection.query(sql, [sectionId, parseInt(req.supplier.id)], function (err, checkAuthority) {
                        if (err) {
                            logger.debug("=======", err)
                            sendResponse.somethingWentWrongError(res);
                        } else {
                            //   console.log(checkAuthority)
                            if (checkAuthority.length) {
                                return cb(null);
                            } else {
                                sendResponse.invalidAccessTokenError(res);
                            }
                        }

                    })
                }


            } else {
                var data = {};
                sendResponse.sendSuccessData(data, constant.responseMessage.NOT_ACTIVE, res, constant.responseStatus.NOT_ACTIVE);
            }


        }

    })

}
exports.storeDbInRequest = async (req, res, next) => {
    try {
        var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
        req.dbName = DbName
        logger.debug("==============dbname======", req.dbName)
        let results = await ExecuteQ.Query(req.dbName, "select app_type,is_single_vendor from screen_flow", []);
        req.service_type = results[0].app_type
        req.is_single_vendor = results[0].is_single_vendor;
        next(null, req.dbName);
    } catch (Err) {
        sendResponse.somethingWentWrongError(res)
    }
}

exports.storeDbInRequestV1 = async (req, res, next) => {
    try {
        let results = await models.screen_flow.findAll();
        req.service_type = results[0].app_type
        req.is_single_vendor = results[0].is_single_vendor;
        next(null, req.dbName);
    } catch (Err) {
        sendResponse.somethingWentWrongError(res)
    }
}
exports.storeDbInRequest1 = async (req, res, next) => {
    // logger.debug("==req.headers===H",req.headers)
    try {

        logger.debug("=-=--=-=-=-=-=-=-=-secretdbkey=-=-=-=-=-=-", req.headers.secretdbkey);
        var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
        req.dbName = DbName
        logger.debug("==============dbname======", req.dbName)
        next(null, req.dbName);
    } catch (Err) {
        sendResponse.somethingWentWrongError(res)
    }
}

exports.storeRequestInMongoDb = async (req, res, next) => {
    try {
        // logger.debug("==req.headers===H",req.headers)

        // logger.debug("=-=--=-=-=-=-=-=-=-secretdbkey=-=-=-=-=-=-",mongoConnection,mongoConnection.db.getCollection(),mongoConnection.db.collection().find({}),req.path,req.headers.secretdbkey);
        // let globlalConn=mongoConnection.db;
        // let mDbConnection=globlalConn.db(config.get('mongoDb.database'));

        var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
        req.dbName = DbName;
        // logger.debug("=====storeRequestInMongoDb==dbName===>>",DbName,req.path)
        // const  collectionName= mDbConnection.collection('client_request_data');
        //     collectionName.insert(
        //       { clientCode: DbName, apiPath: req.path,createdOn: new Date() },
        //       (error, result) => {
        //           logger.debug("===Error====>>",error);
        //         // if (error) return process.exit(1);
        //         // callback(result);
        //         next()
        //       }
        //     );
    } catch (Err) {
        logger.debug("==Mongo==Err===>>", Err)
        next()
    }

}
exports.checkCblAuthority = async (req,res,next)=>{   
    try{
// logger.debug("=========req.headers=====",req.headers);
        var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);

        let sql = "select * from check_cbl_authority";
        let result=await ExecuteQ.Query(DbName,sql,[]);

        
        let isCacheOn=0;
        let cacheTime=10;
        let isCacheOnData=await ExecuteQ.Query(DbName,"select onOff,reset,cachTime from cache",[]);
        isCacheOn=isCacheOnData && isCacheOnData.length>0 && parseInt(isCacheOnData[0].onOff)==1?1:0
        cacheTime=isCacheOnData && isCacheOnData.length>0?parseInt(isCacheOnData[0].cachTime):10
        req.isCacheOn=isCacheOn
        req.cacheTime=cacheTime;

        let settingLogoData=await ExecuteQ.Query(DbName,"select `key`,`value` from tbl_setting where `key`=?",["logo_url"]);
        let logoUrl=settingLogoData && settingLogoData.length>0?settingLogoData[0].value:"";
        req.dbName = DbName
        req.logo_url=logoUrl
        req.business_name=result && result.length>0 && result[0].business_name!=null && result[0].business_name!=undefined?result[0].business_name:"Royo"
        req.help_email=result && result.length>0 && result[0].help_email!=null && result[0].help_email!=undefined?result[0].help_email:"ops@Royo.com"
            
        next(null);
 
}
catch(Err){
    logger.debug("=====checkCblAuthority===>>",Err)
    next(null);
}
}


exports.checkCblAuthorityV1 = async (req, res, next) => {
    try {   
        let result=await models.check_cbl_authority.findAll();
        let isCacheOn=0;
        let cacheTime=10;
        let isCacheOnData =await models.cache.findAll();
        isCacheOn=isCacheOnData && isCacheOnData.length>0 && parseInt(isCacheOnData[0].onOff)==1?1:0
        cacheTime=isCacheOnData && isCacheOnData.length>0?parseInt(isCacheOnData[0].cachTime):10          
        req.isCacheOn=isCacheOn
        req.isCacheOn=isCacheOn;
        let settingLogoData=await models.tbl_setting.findAll({where:{
            key:"logo_url"
        }})
        let logoUrl=settingLogoData && settingLogoData.length>0?settingLogoData[0].value:"";
        req.dbName = DbName
        req.logo_url=logoUrl
        req.business_name=result && result.length>0 && result[0].business_name!=null && result[0].business_name!=undefined?result[0].business_name:"Royo"
        req.help_email=result && result.length>0 && result[0].help_email!=null && result[0].help_email!=undefined?result[0].help_email:"ops@Royo.com"
        next(null);
        }
        catch(Err){
            next(null);
        }
}


exports.checkAdminPermissions = async (req, res, next) => {
    try {
        var DbName = await universalFunc.getDecryptData(req.headers.secretdbkey);
        logger.debug("========DbName=111=>>", DbName, req.path);

        let sql = "SELECT `is_superadmin`,`is_active` FROM admin where id=? limit 1 "

        const ROUTE_PATH = req.path

        let adminDetails = await ExecuteQ.Query(req.dbName, sql, [req.user.id])

        if (adminDetails[0].is_active) {
            if (adminDetails[0].is_superadmin == 1) {
                next(null);
            } else {
                logger.debug('==========ROUTE_PATH====ROUTE_PATH======', ROUTE_PATH);

                await checkPermission(ROUTE_PATH, req.dbName, req.user.id, res)

                next(null)

            }
        } else {
            var data = {};
            sendResponse.sendSuccessData(data, constant.responseMessage.NOT_ACTIVE, res, constant.responseStatus.NOT_ACTIVE);
        }


    } catch (err) {
        logger.debug("=================err====", err)
        sendResponse.somethingWentWrongError(res)
    }

}


function checkPermission(ROUTE_PATH, dbName, adminId, res) {
    return new Promise(async (resolve, reject) => {
        try {
            let admin_section_category = ""
            let admin_section = ""

            var criteria;

            switch (ROUTE_PATH) {
                /*****************************DASHBOARD**********************************/

                /* CHECK PERMISSION FOR  LIST */
                case consts.ROUTE_PATH.DASHBOARD.LIST.ADMIN_DASHBOARD:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.DASHBOARD,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;


                    /******************************MENU********************************* */

                    /* CHECK PERMISSION FOR LIST */
                case consts.ROUTE_PATH.CATALOGUE.LIST.CATEGORY_LIST:
                case consts.ROUTE_PATH.CATALOGUE.LIST.SUB_CATEGORY_LIST:
                case consts.ROUTE_PATH.CATALOGUE.LIST.LIST_PRODUCTS:
                case consts.ROUTE_PATH.CATALOGUE.LIST.LIST_DETAILED_SUB_CATEGORIES:
                case consts.ROUTE_PATH.CATALOGUE.LIST.ADMIN_GET_CATEGORIES_LIST:
                case consts.ROUTE_PATH.CATALOGUE.LIST.LIST_SUPPLIER_PRODUCTS:
                case consts.ROUTE_PATH.CATALOGUE.LIST.LIST_SUPPLIER_CATEGORIES:
                case consts.ROUTE_PATH.CATALOGUE.LIST.SUB_CATEGORY_DATA:
                case consts.ROUTE_PATH.CATALOGUE.LIST.PRODUCT_VARIANT_LIST:
                case consts.ROUTE_PATH.CATALOGUE.LIST.LIST_SUPPLIER_BRANCH_PRODUCTS:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.CATALOGUE,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /* CHECK PERMISSION FOR CREATE */
                case consts.ROUTE_PATH.CATALOGUE.CREATE.ADD_CATEGORY:
                case consts.ROUTE_PATH.CATALOGUE.CREATE.ADD_PRODUCT:
                case consts.ROUTE_PATH.CATALOGUE.CREATE.ADD_SUB_CATEGORY:
                case consts.ROUTE_PATH.CATALOGUE.CREATE.ADD_SUPPLIER_PRODUCT:
                case consts.ROUTE_PATH.CATALOGUE.CREATE.ADD_PRODUCT_PRICING_BY_ADMIN:
                case consts.ROUTE_PATH.CATALOGUE.CREATE.ADD_CATEGORY_OF_SUPPLIER:
                case consts.ROUTE_PATH.CATALOGUE.CREATE.ADD_SUPPLIER_BRANCH_PRODUCT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.CATALOGUE,
                        admin_section: consts.ADMIN_SECTIONS.CREATE
                    }
                    break;

                    /* CHECK PERMISSION FOR UPDATE */
                case consts.ROUTE_PATH.CATALOGUE.UPDATE.EDIT_CATEGORY:
                case consts.ROUTE_PATH.CATALOGUE.UPDATE.EDIT_SUB_CATEGORY:
                case consts.ROUTE_PATH.CATALOGUE.UPDATE.ASSIGN_PRODUCT_TO_SUPPLIER:
                case consts.ROUTE_PATH.CATALOGUE.UPDATE.ASSIGN_PRODUCT_TO_SUPPLIER_BRANCH:
                case consts.ROUTE_PATH.CATALOGUE.UPDATE.EDIT_PRODUCT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.CATALOGUE,
                        admin_section: consts.ADMIN_SECTIONS.UPDATE
                    }
                    break;

                    /**CHECK PERMISSION FOR DELETE */
                case consts.ROUTE_PATH.CATALOGUE.DELETE.DELETE_PRODUCT:
                case consts.ROUTE_PATH.CATALOGUE.DELETE.DELETE_CATEGORY:
                case consts.ROUTE_PATH.CATALOGUE.DELETE.DELETE_SUPPLIER_PRODUCT:
                case consts.ROUTE_PATH.CATALOGUE.DELETE.DELETE_SUPPLIER_CATEGORY:
                case consts.ROUTE_PATH.CATALOGUE.DELETE.DELETE_SUPPLIER_BRANCH_PRODUCT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.CATALOGUE,
                        admin_section: consts.ADMIN_SECTIONS.DELETE
                    }
                    break;
                    /** CHECK PERMISSION FOR BLOCK */
                case consts.ROUTE_PATH.CATALOGUE.BLOCK.BLOCK_CATEGORY:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.CATALOGUE,
                        admin_section: consts.ADMIN_SECTIONS.BLOCK
                    }
                    break;


                    /*********************************RESTAURANTS*********************************/

                    /**CHECK PERMISSION FOR LIST  */
                case consts.ROUTE_PATH.SUPPLIERS.LIST.SUPPLIER_LISTING:
                case consts.ROUTE_PATH.SUPPLIERS.LIST.GET_SUPPLIER_INFO_TAB1:
                case consts.ROUTE_PATH.SUPPLIERS.LIST.GET_SUPPLIER_INFO_TAB2:
                case consts.ROUTE_PATH.SUPPLIERS.LIST.GET_SUPPLIER_SUMMARY:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.SUPPLIERS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /* CHECK PERMISSION FOR CREATE */
                case consts.ROUTE_PATH.SUPPLIERS.CREATE.ADD_BRANCH:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.SUPPLIERS,
                        admin_section: consts.ADMIN_SECTIONS.CREATE
                    }
                    break;

                    /** CHECK PERMISSION FOR UPDATE */
                case consts.ROUTE_PATH.SUPPLIERS.UPDATE.GET_SUPPLIER_SUB_INFO_TAB1:
                case consts.ROUTE_PATH.SUPPLIERS.UPDATE.SAVE_SUPPLIER_IMAGE_2:
                case consts.ROUTE_PATH.SUPPLIERS.UPDATE.UPDATE_SUPPLIER_SUMMARY:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.SUPPLIERS,
                        admin_section: consts.ADMIN_SECTIONS.UPDATE
                    }
                    break;

                    /** CHECK PERMISSION FOR DELETE */

                    /** CHECK PERMISSION FOR BLOCK */
                case consts.ROUTE_PATH.SUPPLIERS.BLOCK.ACTIVE_OR_INACTIVE_SUPPLIER:
                case consts.ROUTE_PATH.SUPPLIERS.BLOCK.CHANGE_BRANCH_STATUS:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.SUPPLIERS,
                        admin_section: consts.ADMIN_SECTIONS.BLOCK
                    }
                    break;

                    /*********************************BRANDS*********************************/

                    /**CHECK PERMISSION FOR LIST  */
                case consts.ROUTE_PATH.BRANDS.LIST.ADMIN_BRAND_LIST:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.BRANDS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /**CHECK PERMISSION FOR CREATE  */
                case consts.ROUTE_PATH.BRANDS.CREATE.ADMIN_ADD_BRAND:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.BRANDS,
                        admin_section: consts.ADMIN_SECTIONS.CREATE
                    }
                    break;

                    /**CHECK PERMISSION FOR UPDATE  */
                case consts.ROUTE_PATH.BRANDS.UPDATE.UPDATE_BRAND:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.BRANDS,
                        admin_section: consts.ADMIN_SECTIONS.UPDATE
                    }
                    break;

                    /**CHECK PERMISSION FOR DELETE  */
                case consts.ROUTE_PATH.BRANDS.DELETE.DELETE_BRAND:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.BRANDS,
                        admin_section: consts.ADMIN_SECTIONS.DELETE
                    }
                    break;

                    /*********************************AGENTS*********************************/

                    /**CHECK PERMISSION FOR LIST  */
                case consts.ROUTE_PATH.AGENTS.LIST.ADMIN_AGENT_LIST:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.AGENTS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /**CHECK PERMISSION FOR CREATE  */
                case consts.ROUTE_PATH.AGENTS.CREATE.ADMIN_AGENT_CREATE:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.AGENTS,
                        admin_section: consts.ADMIN_SECTIONS.CREATE
                    }
                    break;

                    /**CHECK PERMISSION FOR UPDATE  */
                case consts.ROUTE_PATH.AGENTS.UPDATE.ADMIN_AGENT_UPDATE || consts.ROUTE_PATH.AGENTS.UPDATE.ADMIN_RESET_AGENT_PASSWORD:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.AGENTS,
                        admin_section: consts.ADMIN_SECTIONS.UPDATE
                    }
                    break;

                    /**CHECK PERMISSION FOR DELETE  */
                case consts.ROUTE_PATH.AGENTS.DELETE.ADMIN_DELETE_AGENT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.AGENTS,
                        admin_section: consts.ADMIN_SECTIONS.DELETE
                    }
                    break;

                    /** CHECK PERMISSION FOR BLOCK */
                case consts.ROUTE_PATH.AGENTS.BLOCK.ADMIN_BLOCK_UNLBLOCK_AGENT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.AGENTS,
                        admin_section: consts.ADMIN_SECTION_
                    }
                    break;



                    /*********************************ORDERS*********************************/

                    /**CHECK PERMISSION FOR LIST*/
                case consts.ROUTE_PATH.ORDERS.LIST.ADMIN_ORDER_LIST || consts.ROUTE_PATH.ORDERS.LIST.ORDER_DESCRIPTION ||
                consts.ROUTE_PATH.ORDERS.LIST.ADMIN_AGENT_ACCORDING_AREA:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.ORDERS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /**CHECK PERMISSION FOR UPDATE*/
                case consts.ROUTE_PATH.ORDERS.UPDATE.CONFIRM_PENDING_ORDER_BY_ADMIN || consts.ROUTE_PATH.ORDERS.UPDATE.ORDER_PROGRESS_BY_ADMIN ||
                consts.ROUTE_PATH.ORDERS.UPDATE.ORDER_NEARBY_BY_ADMIN || consts.ROUTE_PATH.ORDERS.UPDATE.ORDER_SHIPPED_BY_ADMIN ||
                consts.ROUTE_PATH.ORDERS.UPDATE.ORDER_DELIVERED_BY_ADMIN || consts.ROUTE_PATH.ORDERS.UPDATE.ADMIN_BOOKING_ASSIGNMENT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.ORDERS,
                        admin_section: consts.ADMIN_SECTIONS.UPDATE
                    }
                    break;

                    /*********************************BANNERS*********************************/
                    /**CHECK PERMISSION FOR LIST  */
                case consts.ROUTE_PATH.BANNERS.LIST.LIST_ADVERTISEMENTS:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.BANNERS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /**CHECK PERMISSION FOR CREATE  */
                case consts.ROUTE_PATH.BANNERS.CREATE.ADD_BANNER_ADVERTISEMENT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.BANNERS,
                        admin_section: consts.ADMIN_SECTIONS.CREATE
                    }
                    break;

                    /**CHECK PERMISSION FOR UPDATE  */
                case consts.ROUTE_PATH.BANNERS.UPDATE.ADMIN_UPDATE_BANNER_ADVERTISEMENT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.BANNERS,
                        admin_section: consts.ADMIN_SECTIONS.UPDATE
                    }
                    break;

                    /**CHECK PERMISSION FOR DELETE  */
                case consts.ROUTE_PATH.BANNERS.DELETE.DELETE_ADVERTISEMENT_NEW:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.BANNERS,
                        admin_section: consts.ADMIN_SECTIONS.DELETE
                    }
                    break;


                    /*********************************PROMOTIONS*********************************/
                    /**CHECK PERMISSION FOR LIST  */
                case consts.ROUTE_PATH.PROMOTIONS.LIST.LIST_PROMO:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.PROMOTIONS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /**CHECK PERMISSION FOR CREATE  */
                case consts.ROUTE_PATH.PROMOTIONS.CREATE.ADD_PROMO:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.PROMOTIONS,
                        admin_section: consts.ADMIN_SECTIONS.CREATE
                    }
                    break;

                    /**CHECK PERMISSION FOR UPDATE  */
                case consts.ROUTE_PATH.PROMOTIONS.UPDATE.UPDATE_PROMO:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.PROMOTIONS,
                        admin_section: consts.ADMIN_SECTIONS.UPDATE
                    }
                    break;

                    /**CHECK PERMISSION FOR DELETE  */
                case consts.ROUTE_PATH.PROMOTIONS.DELETE.DELETE_PROMO:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.PROMOTIONS,
                        admin_section: consts.ADMIN_SECTIONS.DELETE
                    }
                    break;


                    /*******************************USERS****************************************/
                    /**CHECK PERMISSION FOR LIST */
                case consts.ROUTE_PATH.USERS.LIST.GET_USERS:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.USERS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /**CHECK PERMISSION FOR BLOCK */
                case consts.ROUTE_PATH.USERS.BLOCK.ACTIVE_DEACTIVE_USER:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.USERS,
                        admin_section: consts.ADMIN_SECTIONS.BLOCK
                    }
                    break;

                    /*******************************REPORTS****************************************/
                    /**CHECK PERMISSION FOR LIST */
                case consts.ROUTE_PATH.REPORTS.LIST.USER_REPORT:
                case consts.ROUTE_PATH.REPORTS.LIST.ORDER_REPORT:
                case consts.ROUTE_PATH.REPORTS.LIST.SUPPLIER_REPORT:
                case consts.ROUTE_PATH.REPORTS.LIST.AGENT_REPORT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.REPORTS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /*******************************ACCOUNTING**********************************/
                    /**CHECK PERMISSION FOR LIST */
                case consts.ROUTE_PATH.ACCOUNTING.LIST.ADMIN_ACCOUNT_STATEMENT:
                case consts.ROUTE_PATH.ACCOUNTING.LIST.ACCOUNT_PAYABLE_LIST:
                case consts.ROUTE_PATH.ACCOUNTING.LIST.ACCOUNT_RECEIVABLE_LIST:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.ACCOUNTING,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /**CHECK PERMISSION FOR UPDATE */
                case consts.ROUTE_PATH.ACCOUNTING.UPDATE.ACCOUNT_PAYAMENT:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.ACCOUNTING,
                        admin_section: consts.ADMIN_SECTIONS.UPDATE
                    }
                    break;

                    /*****************************SETTINGS*************************/
                    /**CHECK PERMISSION FOR LIST */
                case consts.ROUTE_PATH.SETTINGS.LIST.LIST_USERS_FOR_SETTINGS:
                case consts.ROUTE_PATH.SETTINGS.LIST.ADMIN_DEFAULT_ADDRESS_LIST:
                case consts.ROUTE_PATH.SETTINGS.LIST.ADMIN_SETTINGS_LIST:
                case consts.ROUTE_PATH.SETTINGS.LIST.LIST_SUPPLIERS_FOR_SETTINGS:
                case consts.ROUTE_PATH.SETTINGS.LIST.LIST_TERMSCONDITIONS:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.SETTINGS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /**CHECK PERMISSION FOR CREATE */

                    /**CHECK PERMISSION FOR UPDATE */
                case consts.ROUTE_PATH.SETTINGS.UPDATE.ADMIN_UPDATE_TERMINOLOGIES:
                case consts.ROUTE_PATH.SETTINGS.UPDATE.SEND_SYSTEM_EMAIL:
                case consts.ROUTE_PATH.SETTINGS.UPDATE.SEND_PUSH_TO_CUSTOMER:
                case consts.ROUTE_PATH.SETTINGS.UPDATE.ADMIN_ADD_SETTINGS:
                case consts.ROUTE_PATH.SETTINGS.UPDATE.ADMIN_DEFAULT_DDRESS_ADD:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.SETTINGS,
                        admin_section: consts.ADMIN_SECTIONS.UPDATE
                    }
                    break;

                    /*****************************SUBADMINS====================================== */
                    /**CHECK PERMISSION FOR LIST */
                case consts.ROUTE_PATH.SUB_ADMINS.LIST.ADMIN_SUB_ADMIN_LIST:
                    criteria = {
                        admin_section_category: consts.ADMIN_SECTION_CATEGORIES.SUB_ADMINS,
                        admin_section: consts.ADMIN_SECTIONS.LIST
                    }
                    break;

                    /**CHECK PERMISSION FOR UPDATE */
                    // case consts.ROUTE_PATH.SUB_ADMINS.UPDATE.MAKE_ADMIN_ACTIVE_OR_INACTIVE:
                    //     criteria = {
                    //         admin_section_category: consts.ADMIN_SECTION_CATEGORIES.SUB_ADMINS,
                    //         admin_section: consts.ADMIN_SECTIONS.UPDATE
                    //     }
                    //     break;

            }

            // { admin_section_category: 'MENU', admin_section: 'LIST' }
            logger.debug("-===================criteria===", criteria)

            let query_for_get_section = "select asct.id as section_category_id,asn.id as section_id from admin_section_category asct join admin_sections asn on asct.id = asn.section_category_id ";
            query_for_get_section += "where asct.section_category_name = ? and asn.sections_name = ? "
            let params_for_get_section = [criteria.admin_section_category, criteria.admin_section]

            let sectionDetails = await ExecuteQ.Query(dbName, query_for_get_section, params_for_get_section)

            let query_for_check_authority = "select id from admin_authority where section_id=? and admin_id=?"

            let params_for_check_authority = [sectionDetails[0].section_id, adminId]

            let permissionDetails = await ExecuteQ.Query(dbName, query_for_check_authority, params_for_check_authority)

            if (permissionDetails && permissionDetails.length > 0) {
                resolve()
            } else {
                sendResponse.permissionError(res)
            }
        } catch (err) {
            logger.debug("==========errrrrrrr=========", err)
            reject(err)
        }
    })

}