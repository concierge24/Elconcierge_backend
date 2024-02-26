"use strict"
let async = require('async');
let sendResponse = require('../../routes/sendResponse');
let constant = require('../../routes/constant');
let func = require('../../routes/commonfunction');
let consts=require('./../../config/const')
let uploadMgr = require('../../lib/UploadMgr')
let lib=require('../../lib/NotificationMgr')
let _ = require('underscore');
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
let Execute=require('../../lib/Execute');
const randomstring = require("randomstring");
const common = require('../../common/agent')
let universal=require('../../util/Universal')
let randomEmail = require('random-email');
const moment = require('moment');
let web_request=require('request')
const emailTemplates = require('../../lib/templates/emailTemplates');
const model=require('../../Model/')

class User{
    /**
     * @description used for making an login web/app
     * @param {*Object} req 
     * @param {*Object} res 
     * @param {*Function} next 
     */
     static async Login(req,res,next){
        try{
            let _password=req.body.password;
            let _deviceToken=req.body.deviceToken;
            let _deviceType=req.body.deviceType;
            let _latitude=req.body.latitude;
            let _email=req.body.email;
            let _phoneNumber=req.body.phoneNumber;
            let _longitude=req.body.longitude;
            let _countryCode=req.body.countryCode || "+91";
            let _accessToken;
            let _isOtpVerified;
            let _setCriteria={
                where:{
                    key:["customer_multiple_login","ride_registeration","ride_base_url","ride_db_secret_key"]
                }
            };
            let _setAttribute=[];
            let  _key=new model.setting.keys(_setCriteria,_setAttribute);
            let  _keyValue=await _key.value()

            let  _multipleLogin=new universal.filter("customer_multiple_login",["customer_multiple_login"],_keyValue);
            let  _isMultpleEnabale=_multipleLogin.key();

            let  _rideRegisteration=new universal.filter("ride_registeration",["ride_base_url","ride_db_secret_key"],_keyValue);
            let  _isRideRegEnable=_rideRegisteration.key();
            let  _rideApiInfo=_rideRegisteration.value();

            let  _validate=new model.users.validate(_countryCode,_phoneNumber,_password,_email);

            let  _user=await _validate.login();

            let  _token=new universal.token(_isMultpleEnabale,_phoneNumber,_email,_user.id);
            let  _newToken=_token.genrate();

            _user["access_token"]=_newToken;
            let _details=new model.users.details(_user.id,_newToken,_email,"","","","","","","",_latitude,_longitude,_deviceToken,_deviceType);
            await _details.updateToken();
       
            let _rideInit=new model.users.ride(_user.country_code,_phoneNumber,_password,_email,_newToken,_deviceToken,_deviceType,_user.firstname,_user.mobile_no,_user.user_image,_user.latitude,_user.longitude,_isRideRegEnable,_rideApiInfo);
            await _rideInit.signLogin();
            await sequelized.close();
            sendResponse.sendSuccessData(_user, constant.responseMessage.SUCCESS, res,200);
        }
        catch (err) {
            logger.debug("==Login==Err!===>>", err);
            let errTypeMsg=typeof err ==='object'?err.sqlMessage:err
            errTypeMsg=errTypeMsg=='undefined' || errTypeMsg=='' || errTypeMsg==undefined?constant.responseMessage.INTERNAL_SERVER_ERROR:errTypeMsg
            logger.debug("Error in Supplier Import===>>",err,errTypeMsg);
            await sequelized.close();
            sendResponse.sendErrorMessageWithTranslation(req,errTypeMsg, res, 500);
        }
    }
    
}


module.exports={
    User:User
}