const {Query} = require('../lib/Execute');
const constants=require('../routes/constant')
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
const { QueryTypes } = require('sequelize');
const request=require('request');

module.exports.getUserDetailsById = (dbName,userId)=>{
    let methodName = "getUserDetailsById";

    return new Promise(async(resolve,reject)=>{
        try{
            let query = `select id,email,mobile_no as phoneNumber,country_code as countryCode,
            firstname as name
             from user where id=${userId}`;
            let result = await Query(dbName,query,[]);
            resolve(result[0]);
        }catch(Error){
            logger.debug({methodName:methodName,Error:Error});
            reject(Error);
        }

    })
}
/**
 * used for update an User Detail
 */
class phone {
        constructor (dbName,mobileNumber,countryCode,userId){
            this.dbName=dbName
            this.mobileNumber=mobileNumber
            this.countryCode=countryCode
            this.userId=userId
        }
        // async updateDetail(sql,inputParams,dbName){
        async update() {
            console.log("====inputParams====>>",this.dbName);
            let data=await Query(this.dbName,"update user set country_code=?,mobile_no=? where id=?",[this.countryCode,this.mobileNumber,this.userId])
            return data
        }
}
/**
 * @description used for validate by username/pwd and by phone number
 */
class validate {
    constructor (_countryCode,_phoneNumber,_password,_email){
        this._countryCode=_countryCode;
        this._phoneNumber=_phoneNumber;
        this._password=_password;
        this._email=_email;

    }
    async login(){
            return new Promise(async (resolve,reject)=>{
                try{


                    let details={};
                    let password = md5(this._password);
                    logger.debug("=====phoneNumber=====",this._phoneNumber)
                    let params = [];
                    let withoutPlusCountryCode=this._countryCode?this._countryCode.replace(/\+/g,""):"";
                    let sql = this._phoneNumber!=="" && this._phoneNumber!=undefined?
                    "select (SELECT message_id FROM `chats` WHERE (`send_to_type`='ADMIN' or `send_by_type`='ADMIN') and (send_by=user.user_created_id or send_to=user.user_created_id) and (`send_to_type`='USER' or `send_by_type`='USER') order by c_id desc limit 1) as message_id, user_created_id,abn_number,business_name,peach_customer_id,replace(country_code, '+', '') as country_code,access_token,referral_id,dateOfBirth,referral_link,user_created_id,device_type,longitude,latitude,is_active,id,email,replace(replace(replace(replace(mobile_no,'-',''),'(',''),')',''),' ','') as mobile_no,firstname,user_image,otp_verified,customer_payment_id,notification_status,authnet_profile_id from user where password = '"+password+"' having country_code='"+withoutPlusCountryCode+"' and mobile_no='"+this._phoneNumber+"'":
                    
                    " select (SELECT message_id FROM `chats` WHERE (`send_to_type`='ADMIN' or `send_by_type`='ADMIN') and (send_by=user.user_created_id or send_to=user.user_created_id) and (`send_to_type`='USER' or `send_by_type`='USER') order by c_id desc limit 1) as message_id,longitude,latitude,id_for_invoice,country_code,device_type,user_created_id,abn_number,business_name,peach_customer_id,access_token,referral_id,dateOfBirth,referral_link,user_created_id,is_active,id,email,mobile_no,firstname,authnet_profile_id,user_image,otp_verified,customer_payment_id,notification_status from user where email = '"+this._email+"' and password = '"+password+"'";
                    let result=await sequelized.query(sql,{ type: QueryTypes.SELECT });
                    if(result && result.length>0){
                        if(result[0].is_active==0){
                            reject(constants.responseMessage.NOT_ACTIVE);
                        }
                        else{
                            details.email = result[0].email;
                            details.isOtpVerified=parseInt(result[0].otp_verified);
                            details.referral_id=result[0].referral_id;
                            details.referral_link=result[0].referral_link;
                            // old_token=result[0].access_token;
                            details.id_for_invoice = result[0].id_for_invoice;
                            details.authnet_profile_id = result[0].authnet_profile_id;
                            details.wallet_amount = result[0].wallet_amount
                            details.authnet_profile_id = result[0].authnet_profile_id
                            details.abn_number = result[0].abn_number
                            details.business_name = result[0].business_name
                            details.mobile_no = result[0].mobile_no;
                            details.firstname = result[0].firstname;
                            details.gender = result[0].gender;
                            details.user_created_id=result[0].user_created_id
                            details.id = result[0].id;
                            details.user_image = result[0].user_image;
                            details.otp_verified = result[0].otp_verified;
                            details.customer_payment_id = result[0].customer_payment_id
                            details.notification_status = result[0].notification_status
                            details.peach_customer_id = result[0].peach_customer_id
                            details.user_created_id = result[0].user_created_id
                            details.message_id = result[0].message_id
                            details.country_code = result[0].country_code;
                            details.longitude = result[0].longitude;
                            details.latitude = result[0].latitude;
                            details.device_type = result[0].device_type;
                            details.dateOfBirth=result[0].dateOfBirth;
                            let _subscription=await models.user_subscription.findAll({where:{
                                user_id:result[0].id,
                                status:"1"
                            }});
                            details.is_subscribed=_subscription && _subscription.length>0?1:0;


                            resolve(details);
                        }
                    }
                    else{
                        reject(constants.errorResponseMessage.INVALID_USERNAME_PWD);
                    }
            }
            catch(Err){
                logger.debug("====Validate.login==Err==>",Err)
                reject(constants.responseMessage.ERROR_IN_EXECUTION)
            }
            })
    }
}
/**
 * @description used for an update/get an user information
 */
class details{
    constructor(_userId,_token,_email,_name,_idForInvoice,_businessName,_dateOfBirth,_userImage,_abnNumber,_licenseNumber,_latitude,_longitude,_deviceToken,_deviceType){
        this._userId=_userId;
        this._token=_token;
        this._email=_email;
        this._name=_name;
        this._idForInvoice=_idForInvoice;
        this._businessName=_businessName;
        this._dateOfBirth=_dateOfBirth;
        this._userImage=_userImage;
        this._abnNumber=_abnNumber;
        this._licenseNumber=_licenseNumber;
        this._latitude=_latitude;
        this._longitude=_longitude;
        this._deviceToken=_deviceToken;
        this._deviceType=_deviceType;

    }
    async updateToken(){
            logger.debug("===_userId===_token====>>",this._userId,this._token)
            return new Promise(async (resolve,reject)=>{
                    try{
                        await models.user.update({
                            access_token:this._token,
                            latitude:this._latitude,
                            longitude:this._longitude,
                            device_token:this._deviceToken,
                            device_type:this._deviceType,
                            is_logged_in:1
                        },{where:{id:this._userId}});
                        resolve();
                    }
                    catch(Err){
                        reject(constants.responseMessage.ERROR_IN_EXECUTION)
                    }
         })
    }
    async token(){
        return new Promise(async (resolve,reject)=>{
            try{
               let sql=" select (SELECT message_id FROM `chats` WHERE (`send_to_type`='ADMIN' or `send_by_type`='ADMIN') and (send_by=user.user_created_id or send_to=user.user_created_id) and (`send_to_type`='USER' or `send_by_type`='USER') order by c_id desc limit 1) as message_id,user.* from user where access_token = '"+this._token+"'";
                let result=await sequelized.query(sql,{ type: QueryTypes.SELECT });
                resolve(result[0] || {});
            }
            catch(Err){
                  reject(constants.responseMessage.ERROR_IN_EXECUTION)
            }
    })
    }
    async updateData(){
        logger.debug("===_userId===_token====>>",this)
        return new Promise(async (resolve,reject)=>{
                try{
                    await models.user.update({
                        firstname:this._name,
                        user_image:this._userImage,
                        is_active:1,
                        email:this._email,
                        abn_number:this._abnNumber,
                        business_name:this._businessName,
                        dateOfBirth:this._dateOfBirth,
                        id_for_invoice:this._idForInvoice,
                        license_number:this._licenseNumber
                    },{where:{access_token:this._token}});
                    resolve();
                }
                catch(Err){
                    logger.debug("====Err!===>>",Err)
                    reject(constants.responseMessage.ERROR_IN_EXECUTION)
                }
     })
}
}

class ride{
    /**
     * @description used for calling an ride api in case essential 
     * @param {*String} _countryCode 
     * @param {*String} _phoneNumber 
     * @param {*String} _password 
     * @param {*String} _email 
     * @param {*String} _accessToken 
     * @param {*String} _deviceToken 
     * @param {*String} _firstname 
     * @param {*String} _mobileNo 
     * @param {*String} _userImage 
     * @param {*String} _latitude 
     * @param {*String} _longitude 
     */
    constructor(_countryCode,_phoneNumber,_password,_email,_accessToken,_deviceToken,_deviceType,_firstname,_mobileNo,_userImage,_latitude,_longitude,_isRideRegEnable,_rideApiInfo){
        this._countryCode=_countryCode;
        this._phoneNumber=_phoneNumber;
        this._password=_password;
        this._email=_email;
        this._accessToken=_accessToken;
        this._deviceToken=_deviceToken;
        this._deviceType=_deviceType;
        this._firstname=_firstname;
        this._mobileNo=_mobileNo;
        this._userImage=_userImage;
        this._latitude=_latitude;
        this._longitude=_longitude;
        this._isRideRegEnable=_isRideRegEnable;
        this._rideApiInfo=_rideApiInfo;

    }
    async signLogin(){
        try {
            logger.debug("=====current=inputs=>",this)
            if(this._isRideRegEnable && this._isRideRegEnable.length>0){

                let _inputData={
                    language_id:1,
                    email:this._email,
                    access_token:this._accessToken,
                    fcm_id:this._deviceToken,
                    name:this._firstname,
                    phone_code:this._countryCode,
                    phone_number:this._mobileNo.replace(/\s/g,''),
                    device_type:this._deviceType==1?"Ios":"android",
                    address:"chandigarh",
                    latitude:this._latitude!=undefined?this._latitude:30.7333,
                    longitude:this._longitude!=undefined?this._longitude:76.7794,
                    gender:"male",
                    timezone:"+05:30",
                    profile_pic:this._userImage
                }

                let _rideBase=this._rideApiInfo.find(item=>item.key=="ride_base_url");
                let _dbSecretKey=this._rideApiInfo.find(item=>item.key=="ride_db_secret_key");

                const result = await request.post({
                    url: _rideBase["value"]+config.get("server.rides.registeration"),
                    headers: {
                        'secretdbkey':_dbSecretKey["value"]
                        },
                    method: "POST",
                    body:_inputData,
                    json: true
                }, function(error, response, body) {
                    logger.log("===rideApi=Error!=",error,"===body===",body);
                    return true;
                })
         }
         else{
             return true;
         }   
        }
        catch (err) {
            logger.debug("==Err==RideLogin=Resp=",err)
            return true
        }
    }
}
class document{
    /**
     * @description used for an update an document
     * @param {*Number} _userId 
     * @param {*String} _documents 
     * @param {*Number} _type
     */
        constructor(_userId,_documents,_type){
            this._userId=_userId;
            this._documents=_documents;   
            this._type=parseInt(_type);
        }
        async update(){
            return new Promise(async (resolve,reject)=>{
                logger.debug("===current=input-->",this)
            try{
                if(this._type==0){
                    await models.user.update({
                        documents:this._documents
                    },{where:{id:this._userId}});
                    resolve()
                }  
                else{
                    let update=await models.user.update({
                        license_images:this._documents
                    },{where:{id:this._userId}});
                    resolve()
                }
            }
            catch(Err){
                logger.debug("========Err=>>",Err)
                reject(constants.responseMessage.ERROR_IN_EXECUTION)
            }
        })
        }


}
module.exports.details=details;
module.exports.phone=phone;
module.exports.validate=validate;
module.exports.ride=ride;
module.exports.document=document;

