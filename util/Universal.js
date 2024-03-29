// const bcrypt = require('bcrypt');
/**
 * ---------------------------------------------------------------------------------
 * @description used for perform common operation that can be reuse in any function
 * ---------------------------------------------------------------------------------
 */
const bcrypt = require('bcryptjs');
const consts = require('../config/const')
const Jwt = require('jsonwebtoken');
var constant = require('../routes/constant');
const ExecuteQ=require('../lib/Execute')
const sendResponse = require('../routes/sendResponse')
let _ = require('underscore');
var moment = require('moment');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
const global=require('./globalMsg');
const common = require('../common/agent');
// let crypto = require('crypto');
// let cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq');
var request = require('request');
let uniqid = require("uniqid");
var crypto = require('crypto')
 const   algorithm = consts.SERVER.CYPTO.ALGO
const  crypto_password =  consts.SERVER.CYPTO.PWD
let fs=require('fs');
const { resolve } = require('path');
const csv = require('fast-csv');

var CryptData = function (stringToCrypt) {
    logger.debug("===STring==",stringToCrypt);
    return new Promise((resolve,reject)=>{

           if(stringToCrypt){
                var hash = bcrypt.hashSync(stringToCrypt, 10);
                logger.debug("=========HASH PASSWORD==",hash)
                resolve(hash);
            }
            else{
                resolve("");
            }
            // if(stringToCrypt){
            //     bcrypt.genSalt(10, function(err, salt) {
            //         bcrypt.hash(stringToCrypt, salt, function(err, hash) {
            //             resolve(hash);
            //         });
            //     });
            // }
            // else{
            //     resolve("");
            // }
    })
};
var compareCryptedData = function (stringToCompare, CryptedString) {
    var res = bcrypt.compare(stringToCompare, CryptedString);
    return res;
};
function addMinutesInString(time, minsToAdd) {
    function D(J){ return (J<10? '0':'') + J};
    
    var piece = time.split(':');
    
    var mins = piece[0]*60 + +piece[1] + +minsToAdd;
  
    return D(mins%(24*60)/60 | 0) + ':' + D(mins%60)+":00";  
  }  

  var generateJwtAccessToken=function(data){
    // console.log("============ENTER===ING===",data);
    // console.log("=======Access TOoken==",Jwt.sign({ id: data.user_id, username: data.username, scope: scopes }, APP_CONSTANTS.SERVER.JWT_SECRET_KEY, { algorithm: 'HS256', expiresIn: "1h" } ))
    return Jwt.sign(data,config.get("agent.jwt_secret_key"), { algorithm: 'HS256' } );
  
}

var getVersioning = function(path){
    // var path=req.path;
    var getting_version=path.indexOf("v");
    var api_version=0
    if(getting_version>0){
        var after_v = path.substr(path.indexOf("v")+1);
         api_version=parseInt(after_v.substr(0, after_v.indexOf("/")));
    }
    return api_version;
}
const getCustomerIdByAccessToken=(dbName,accessToken,languageId)=>{
    return new Promise(async (resolve,reject)=>{
            var sql = "select id from user where access_token = ? ";
            var userDAta=await ExecuteQ.Query(dbName,sql,[accessToken]);
            if(userDAta && userDAta.length>0){
                resolve(result[0]);
            }
            else{
                var msg = "invalid access token ";
                reject(msg)
            }
    })
}
const getDayDiff=(booking_from_date,booking_to_date,offset)=>{
    var total_duration=0;
    var from_date_time=moment(moment(booking_from_date).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss'),'YYYY-MM-DD HH:mm:ss');
    var to_date_time=moment(moment(booking_to_date).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss'),'YYYY-MM-DD HH:mm:ss');
    var diffday=to_date_time.diff(from_date_time,'days');
    return new Promise((resolve,reject)=>{
        resolve(parseInt(diffday))
    })
}
const getHourDiff=(booking_from_date,booking_to_date,offset)=>{
    var total_duration=0;
    var from_date_time=moment(moment(booking_from_date).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss'),'YYYY-MM-DD HH:mm:ss');
    var to_date_time=moment(moment(booking_to_date).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss'),'YYYY-MM-DD HH:mm:ss');
    var diffHours=to_date_time.diff(from_date_time,'hours');
    return new Promise((resolve,reject)=>{
        resolve(parseInt(diffHours))
    })
}

const AllParentCat=async (dbName,language_id,type,supplier_id,category_id,categorySd)=>{
    // var GetAgentDbData=await getAgentDbInformation(req.dbName);
    // var agentConnection=await RunTimeAgentConnection(GetAgentDbData);
    return new Promise(async (resolve,reject)=>{
        try{
        var sql;
        let orderBySql="sc.id Asc"
        let categorySData = [];

        if (categorySd && categorySData.length>0) {
            categorySData = categorySd;
        } else {
            categorySData=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? and `value`=?",["category_sequence","1"]);
        }
      
        let mainCategorySequenceAllowed = await ExecuteQ.Query(dbName,
            "select `key`, value from tbl_setting where `key`=? and value='1'",["is_main_category_sequence_wise"]);

        let orderBySequenceWithIsAssign = " order by is_assign DESC,order_no ";
        let orderBySequence  = " order by is_assign DESC,order_no ";

        if(mainCategorySequenceAllowed && mainCategorySequenceAllowed.length>0){
             orderBySequenceWithIsAssign = " order by categories.sequence_no asc ";
             orderBySequence  = " categories.sequence_no asc ";
    
        }
            
        if(categorySData && categorySData.length>0){
            orderBySql="sc.order_no Asc,bp.order_no Asc"
        }

        if(parseInt(category_id)==0 || category_id==undefined){
            if(type==undefined){
                logger.debug("=======here================1===========")
                sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.order_instructions,categories.image,categories.icon,categories.is_dine,categories.category_flow,categories.parent_id,categories.sequence_no,categories.type,categories.is_service_single_selection,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and is_default=0 order by order_no asc"
            }
            else{
                logger.debug("=======here================2===========")
                // if(supplier_id!=undefined && supplier_id!=0){
                //     logger.debug("=======here================3===========",supplier_id)
                //     sql="select IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,categories.image,categories.icon,categories.category_flow,categories.parent_id,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id join supplier_category sc on sc.category_id = categories.id where categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and sc.supplier_id = "+supplier_id+" group by name order by is_default desc;"
                // }else{
                    logger.debug("=======here================4===========")
                    sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.order_instructions,categories.image,categories.icon,categories.is_dine,categories.category_flow,categories.parent_id,categories.sequence_no,categories.type,categories.is_service_single_selection,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? order by is_assign DESC,order_no"
                // }
            }     
       }

       else{
                if(type==undefined){
                    logger.debug("=======here================1===========")
                    sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.is_service_single_selection,categories.order_instructions,categories.image,categories.icon,categories.category_flow,categories.sequence_no,categories.is_dine,categories.parent_id,categories.type,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and is_default=0 "+orderBySequence+" "
                }
                else{
                    logger.debug("=======here================2===========")
                    // if(supplier_id!=undefined && supplier_id!=0){
                    //     logger.debug("=======here================3===========",supplier_id)
                    //     sql="select IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,categories.image,categories.icon,categories.category_flow,categories.parent_id,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id join supplier_category sc on sc.category_id = categories.id where categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and sc.supplier_id = "+supplier_id+" group by name order by is_default desc;"
                    // }else{
                        logger.debug("=======here================4===========")
                        sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id  and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.cart_image_upload,categories.order_instructions,categories.is_service_single_selection,categories.image,categories.icon,categories.category_flow,categories.is_dine,categories.sequence_no,categories.parent_id,categories.type,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and categories.parent_id="+category_id+" "+orderBySequence+" "
                    // }
                }    
       } 
       let data=await ExecuteQ.Query(dbName,sql,[0,0,parseInt(language_id)]) 
       resolve(data)
    }
    catch(Err){
        logger.debug("===Err!==",Err);
        reject(Err)
    }
    //    var st= multiConnection[dbName].query(sql,[0,0,parseInt(language_id)],function(err,data){
    //        logger.debug(st.sql);

    //         if(err){
    //             reject(err)
    //         }
    //         else{
                // resolve(data)
        //     }
        // })
    })
}
// // **************change by mukesh 07-12-20************
// const AllSubCat=async(dbName,language_id,supplier_id,type, categorySD)=>{
//     return new Promise(async (resolve,reject)=>{
//         try{
//             let orderBySql="sc.id Asc"
//             let categorySData= [];

//             if (categorySD && categorySD.length>0) {
//                 categorySData=categorySD;
//             } else {
//                 categorySData=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? and `value`=?",["category_sequence","1"]);
//             }
        
//         if(categorySData && categorySData.length>0){
//             orderBySql="order_no Asc,bp.order_no Asc"
//         }
//         if(supplier_id!=0 && supplier_id!=undefined && type=="supplier"){
//             var sql = "select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF( ( select count(*) from supplier_category where supplier_category.supplier_id = "+supplier_id+" and "+
//                       "( supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id ) ) > 0, 1, 0 ) as is_assign, "+
//                       "(select order_no from supplier_category where supplier_category.supplier_id = "+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) GROUP by supplier_category.supplier_id limit 1) as order_no, "+
//                       "sc.sub_category_id, categories.image, categories.icon, categories.parent_id, categories.id,categories.menu_type, categories_ml.name from categories inner join categories_ml "+
//                       "on categories_ml.category_id = categories.id join supplier_category sc on sc.sub_category_id = categories.id or sc.detailed_sub_category_id=categories.id "+
//                       "where categories.parent_id != ? and categories.is_deleted = ? and categories_ml.language_id = ? and sc.supplier_id="+supplier_id+" group by name "
//         }else{
//             var sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.supplier_id="+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id)) > 0, 1, 0) as is_assign, "+
//             "(select (order_no) from supplier_category where supplier_category.supplier_id = "+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) group by supplier_category.supplier_id,supplier_category.sub_category_id limit 1) as order_no," +
//             "categories.image,categories.icon,categories.parent_id,categories.id,categories_ml.name,categories.menu_type from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.parent_id!=? and categories.is_deleted=? and categories_ml.language_id=? order by is_assign DESC,order_no asc"
//         }
//         let data=await ExecuteQ.Query(dbName,sql,[0,0,parseInt(language_id)])
//         // var st= multiConnection[dbName].query(sql,[0,0,parseInt(language_id)],function(err,data){
//         //    logger.debug("===STMT==",st.sql)
//         //     if(err){
//         //         reject(err)
//         //     }
//         //     else{
//                 resolve(data)
//         //     }
//         // })
//     }
//         catch(Err){
//             reject(Err)
//         }
//     })


// }
// const AllParentCat=async (dbName,language_id,type,supplier_id,category_id)=>{
//     // var GetAgentDbData=await getAgentDbInformation(req.dbName);
//     // var agentConnection=await RunTimeAgentConnection(GetAgentDbData);
//     return new Promise(async (resolve,reject)=>{
//         try{
//         var sql;
//         let orderBySql="sc.id Asc"
//         let categorySData=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? and `value`=?",["category_sequence","1"]);
      
//         let mainCategorySequenceAllowed = await ExecuteQ.Query(dbName,
//             "select `key`, value from tbl_setting where `key`=? and value='1'",["is_main_category_sequence_wise"]);

//         let orderBySequenceWithIsAssign = " order by is_assign DESC,order_no ";
//         let orderBySequence  = " order by is_assign DESC,order_no ";

//         if(mainCategorySequenceAllowed && mainCategorySequenceAllowed.length>0){
//              orderBySequenceWithIsAssign = " order by categories.sequence_no asc ";
//              orderBySequence  = " categories.sequence_no asc ";
    
//         }
            
//         if(categorySData && categorySData.length>0){
//             orderBySql="sc.order_no Asc,bp.order_no Asc"
//         }

//         if(parseInt(category_id)==0 || category_id==undefined){
//             if(type==undefined){
//                 logger.debug("=======here================1===========")
//                 sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.order_instructions,categories.image,categories.icon,categories.is_dine,categories.category_flow,categories.parent_id,categories.sequence_no,categories.type,categories.is_service_single_selection,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and is_default=0 order by order_no asc"
//             }
//             else{
//                 logger.debug("=======here================2===========")
//                 // if(supplier_id!=undefined && supplier_id!=0){
//                 //     logger.debug("=======here================3===========",supplier_id)
//                 //     sql="select IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,categories.image,categories.icon,categories.category_flow,categories.parent_id,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id join supplier_category sc on sc.category_id = categories.id where categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and sc.supplier_id = "+supplier_id+" group by name order by is_default desc;"
//                 // }else{
//                     logger.debug("=======here================4===========")
//                     sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.order_instructions,categories.image,categories.icon,categories.is_dine,categories.category_flow,categories.parent_id,categories.sequence_no,categories.type,categories.is_service_single_selection,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? order by is_assign DESC,order_no"
//                 // }
//             }     
//        }

//        else{
//                 if(type==undefined){
//                     logger.debug("=======here================1===========")
//                     sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.is_service_single_selection,categories.order_instructions,categories.image,categories.icon,categories.category_flow,categories.sequence_no,categories.is_dine,categories.parent_id,categories.type,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and is_default=0 "+orderBySequence+" "
//                 }
//                 else{
//                     logger.debug("=======here================2===========")
//                     // if(supplier_id!=undefined && supplier_id!=0){
//                     //     logger.debug("=======here================3===========",supplier_id)
//                     //     sql="select IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,categories.image,categories.icon,categories.category_flow,categories.parent_id,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id join supplier_category sc on sc.category_id = categories.id where categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and sc.supplier_id = "+supplier_id+" group by name order by is_default desc;"
//                     // }else{
//                         logger.debug("=======here================4===========")
//                         sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id  and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.cart_image_upload,categories.order_instructions,categories.is_service_single_selection,categories.image,categories.icon,categories.category_flow,categories.is_dine,categories.sequence_no,categories.parent_id,categories.type,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and categories.parent_id="+category_id+" "+orderBySequence+" "
//                     // }
//                 }    
//        } 
//        let data=await ExecuteQ.Query(dbName,sql,[0,0,parseInt(language_id)]) 
//        resolve(data)
//     }
//     catch(Err){
//         logger.debug("===Err!==",Err);
//         reject(Err)
//     }
//     //    var st= multiConnection[dbName].query(sql,[0,0,parseInt(language_id)],function(err,data){
//     //        logger.debug(st.sql);

//     //         if(err){
//     //             reject(err)
//     //         }
//     //         else{
//                 // resolve(data)
//         //     }
//         // })
//     })
// }
// **************change by mukesh 07-12-20************
const AllSubCat=async(dbName,language_id,supplier_id,type, categorySD)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let orderBySql="sc.id Asc"
            let categorySData= [];

            if (categorySD && categorySD.length>0) {
                categorySData=categorySD;
            } else {
                categorySData=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? and `value`=?",["category_sequence","1"]);
            }
        
        if(categorySData && categorySData.length>0){
            orderBySql="order_no Asc,bp.order_no Asc"
        }
        if(supplier_id!=0 && supplier_id!=undefined && type=="supplier"){
            var sql = "select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF( ( select count(*) from supplier_category where supplier_category.supplier_id = "+supplier_id+" and "+
                      "( supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id ) ) > 0, 1, 0 ) as is_assign, "+
                      "(select order_no from supplier_category where supplier_category.supplier_id = "+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) GROUP by supplier_category.supplier_id limit 1) as order_no, "+
                      "sc.sub_category_id, categories.image, categories.icon, categories.parent_id, categories.id,categories.menu_type, categories_ml.name from categories inner join categories_ml "+
                      "on categories_ml.category_id = categories.id join supplier_category sc on sc.sub_category_id = categories.id or sc.detailed_sub_category_id=categories.id "+
                      "where categories.parent_id != ? and categories.is_deleted = ? and categories_ml.language_id = ? and sc.supplier_id="+supplier_id+" group by name "
        }else{
            var sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.supplier_id="+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id)) > 0, 1, 0) as is_assign, "+
            "(select (order_no) from supplier_category where supplier_category.supplier_id = "+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) group by supplier_category.supplier_id,supplier_category.sub_category_id limit 1) as order_no," +
            "categories.image,categories.icon,categories.parent_id,categories.id,categories_ml.name,categories.menu_type from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.parent_id!=? and categories.is_deleted=? and categories_ml.language_id=? order by is_assign DESC,order_no asc"
        }
        let data=await ExecuteQ.Query(dbName,sql,[0,0,parseInt(language_id)])
        // var st= multiConnection[dbName].query(sql,[0,0,parseInt(language_id)],function(err,data){
        //    logger.debug("===STMT==",st.sql)
        //     if(err){
        //         reject(err)
        //     }
        //     else{
                resolve(data)
        //     }
        // })
    }
        catch(Err){
            reject(Err)
        }
    })


}
const AllParentCatV1=async (dbName,language_id,type,supplier_id,category_id,requiredSettingArray)=>{
    // var GetAgentDbData=await getAgentDbInformation(req.dbName);
    // var agentConnection=await RunTimeAgentConnection(GetAgentDbData);
    return new Promise(async (resolve,reject)=>{
        try{
            
        var sql;
        let orderBySql="sc.id Asc"
        let categorySData = requiredSettingArray && requiredSettingArray['category_sequence'] ? requiredSettingArray['category_sequence']: [];
        let mainCategorySequenceAllowed = requiredSettingArray && requiredSettingArray['is_main_category_sequence_wise'] ? requiredSettingArray['is_main_category_sequence_wise']: [];
        // let mainCategorySequenceAllowed = await ExecuteQ.Query(dbName,
        //     "select `key`, value from tbl_setting where `key`=? and value='1'",["is_main_category_sequence_wise"]);

        let orderBySequenceWithIsAssign = " order by is_assign DESC,order_no ";
        let orderBySequence  = " order by is_assign DESC,order_no ";

        if(mainCategorySequenceAllowed && mainCategorySequenceAllowed.length>0){
             orderBySequenceWithIsAssign = " order by categories.sequence_no asc ";
             orderBySequence  = " categories.sequence_no asc ";
    
        }
            
        if(categorySData && categorySData.length>0){
            orderBySql="sc.order_no Asc,bp.order_no Asc"
        }

        if(parseInt(category_id)==0 || category_id==undefined){
            if(type==undefined){
                logger.debug("=======here================1===========")
                sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.order_instructions,categories.image,categories.icon,categories.is_dine,categories.category_flow,categories.parent_id,categories.sequence_no,categories.type,categories.is_service_single_selection,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and is_default=0 order by order_no asc"
            }
            else{
                logger.debug("=======here================2===========")
                // if(supplier_id!=undefined && supplier_id!=0){
                //     logger.debug("=======here================3===========",supplier_id)
                //     sql="select IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,categories.image,categories.icon,categories.category_flow,categories.parent_id,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id join supplier_category sc on sc.category_id = categories.id where categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and sc.supplier_id = "+supplier_id+" group by name order by is_default desc;"
                // }else{
                    logger.debug("=======here================4===========")
                    sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.order_instructions,categories.image,categories.icon,categories.is_dine,categories.category_flow,categories.parent_id,categories.sequence_no,categories.type,categories.is_service_single_selection,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? order by is_assign DESC,order_no"
                // }
            }     
       }

       else{
                if(type==undefined){
                    logger.debug("=======here================1===========")
                    sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.is_service_single_selection,categories.order_instructions,categories.image,categories.icon,categories.category_flow,categories.sequence_no,categories.is_dine,categories.parent_id,categories.type,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and is_default=0 "+orderBySequence+" "
                }
                else{
                    logger.debug("=======here================2===========")
                    // if(supplier_id!=undefined && supplier_id!=0){
                    //     logger.debug("=======here================3===========",supplier_id)
                    //     sql="select IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,categories.image,categories.icon,categories.category_flow,categories.parent_id,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id join supplier_category sc on sc.category_id = categories.id where categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and sc.supplier_id = "+supplier_id+" group by name order by is_default desc;"
                    // }else{
                        logger.debug("=======here================4===========")
                        sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(supplier_id)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id  and supplier_category.supplier_id = "+parseInt(supplier_id)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.cart_image_upload,categories.order_instructions,categories.is_service_single_selection,categories.image,categories.icon,categories.category_flow,categories.is_dine,categories.sequence_no,categories.parent_id,categories.type,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=? and categories.is_deleted=? and categories_ml.language_id=? and categories.parent_id="+category_id+" "+orderBySequence+" "
                    // }
                }    
       } 
       let data=await ExecuteQ.Query(dbName,sql,[0,0,parseInt(language_id)]) 
       resolve(data)
    }
    catch(Err){
        logger.debug("===Err!==",Err);
        reject(Err)
    }
    //    var st= multiConnection[dbName].query(sql,[0,0,parseInt(language_id)],function(err,data){
    //        logger.debug(st.sql);

    //         if(err){
    //             reject(err)
    //         }
    //         else{
                // resolve(data)
        //     }
        // })
    })
}

const AllSubCatV1=async(dbName,language_id,supplier_id,type, requiredSettingArray)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let orderBySql="sc.id Asc"
            let categorySData = requiredSettingArray && requiredSettingArray['category_sequence'] ? requiredSettingArray['category_sequence']: [];

        
        if(categorySData && categorySData.length>0){
            orderBySql="order_no Asc,bp.order_no Asc"
        }
        if(supplier_id!=0 && supplier_id!=undefined && type=="supplier"){
            var sql = "select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF( ( select count(*) from supplier_category where supplier_category.supplier_id = "+supplier_id+" and "+
                      "( supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id ) ) > 0, 1, 0 ) as is_assign, "+
                      "(select order_no from supplier_category where supplier_category.supplier_id = "+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) GROUP by supplier_category.supplier_id limit 1) as order_no, "+
                      "sc.sub_category_id, categories.image, categories.icon, categories.parent_id, categories.id,categories.menu_type, categories_ml.name from categories inner join categories_ml "+
                      "on categories_ml.category_id = categories.id join supplier_category sc on sc.sub_category_id = categories.id or sc.detailed_sub_category_id=categories.id "+
                      "where categories.parent_id != ? and categories.is_deleted = ? and categories_ml.language_id = ? and sc.supplier_id="+supplier_id+" group by name "
        }else{
            var sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.supplier_id="+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id)) > 0, 1, 0) as is_assign, "+
            "(select (order_no) from supplier_category where supplier_category.supplier_id = "+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) group by supplier_category.supplier_id,supplier_category.sub_category_id limit 1) as order_no," +
            "categories.image,categories.icon,categories.parent_id,categories.id,categories_ml.name,categories.menu_type from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.parent_id!=? and categories.is_deleted=? and categories_ml.language_id=? order by is_assign DESC,order_no asc"
        }
        let data=await ExecuteQ.Query(dbName,sql,[0,0,parseInt(language_id)])
        // var st= multiConnection[dbName].query(sql,[0,0,parseInt(language_id)],function(err,data){
        //    logger.debug("===STMT==",st.sql)
        //     if(err){
        //         reject(err)
        //     }
        //     else{
                resolve(data)
        //     }
        // })
    }
        catch(Err){
            reject(Err)
        }
    })


}
/**
 * @description used for getting an meaurment unit km/mile
 * @param {*String} dbName 
 */
const getMeausringUnitV1=(dbName, requiredSettingArray)=>{
    return new Promise(async (resolve,reject)=>{
        let mUnit=6371;
        try{
            let mUnitData = requiredSettingArray && requiredSettingArray['delivery_distance_unit'] ? requiredSettingArray['delivery_distance_unit']: [];
            if(mUnitData && mUnitData.length>0){
                if(parseInt(mUnitData[0].value)==1){
                    mUnit=3959;
                }
            }
            logger.debug('===getMeausringUnitV1===',mUnit)
            resolve(mUnit)
        }
        catch(Err){
            logger.debug('===getMeausringUnitV1===',mUnit)
            resolve(mUnit)
        }

    })
}

// const AllSubCat=async(dbName,language_id,supplier_id,type)=>{
//     return new Promise(async (resolve,reject)=>{
//         try{
//             let orderBySql="sc.id Asc"
//         let categorySData=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? and `value`=?",["category_sequence","1"]);
//         if(categorySData && categorySData.length>0){
//             orderBySql="order_no Asc,bp.order_no Asc"
//         }
//         if(supplier_id!=0 && supplier_id!=undefined && type=="supplier"){
//             var sql = "select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF( ( select count(*) from supplier_category where supplier_category.supplier_id = "+supplier_id+" and "+
//                       "( supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id ) ) > 0, 1, 0 ) as is_assign, "+
//                       "(select order_no from supplier_category where supplier_category.supplier_id = "+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) GROUP by supplier_category.supplier_id limit 1) as order_no, "+
//                       "sc.sub_category_id, categories.image, categories.icon, categories.parent_id, categories.id,categories.menu_type, categories_ml.name from categories inner join categories_ml "+
//                       "on categories_ml.category_id = categories.id join supplier_category sc on sc.sub_category_id = categories.id or sc.detailed_sub_category_id=categories.id "+
//                       "where categories.parent_id != ? and categories.is_deleted = ? and categories_ml.language_id = ? and sc.supplier_id="+supplier_id+" group by name "
//         }else{
//             var sql="select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.supplier_id="+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id)) > 0, 1, 0) as is_assign, "+
//             "(select (order_no) from supplier_category where supplier_category.supplier_id = "+parseInt(supplier_id)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) group by supplier_category.supplier_id,supplier_category.sub_category_id limit 1) as order_no," +
//             "categories.image,categories.icon,categories.parent_id,categories.id,categories_ml.name,categories.menu_type from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.parent_id!=? and categories.is_deleted=? and categories_ml.language_id=? order by is_assign DESC,order_no asc"
//         }
//         let data=await ExecuteQ.Query(dbName,sql,[0,0,parseInt(language_id)])
//         // var st= multiConnection[dbName].query(sql,[0,0,parseInt(language_id)],function(err,data){
//         //    logger.debug("===STMT==",st.sql)
//         //     if(err){
//         //         reject(err)
//         //     }
//         //     else{
//                 resolve(data)
//         //     }
//         // })
//     }
//         catch(Err){
//             reject(Err)
//         }
//     })


// }
const finalCatData=(cat_data,all_sub_cat)=>{
    var final_data=[],supplier_data=[],flow
    return new Promise((resolve,reject)=>{
        for (const i of cat_data) {
            logger.debug("===!!")
            // i.type=0;
            flow=i.category_flow.split(">", 2).pop();
            // if(flow=="Suppliers" || flow=="PickUpTime"){                   
            //     i.sub_category=_.filter(suppler_data,function(s){
            //         s.type=1
            //         return s.id==i.id
            //     })
            //     for(const j of  i.sub_category){
            //         j.sub_category=getNestedChildren(all_sub_cat,j.id);
            //     }
            // }
            // else{
                i.sub_category= getNestedChildren(all_sub_cat,i.id);    
            // }
            final_data.push(i)
          
        }
        logger.debug("=====>>>");
        resolve(final_data);
    })
}
function getNestedChildren(arr, parent) {
    var out = [];
    for(var i in arr) {
        if(arr[i].parent_id == parent) {
            var sub_category = getNestedChildren(arr, arr[i].id);
            if(sub_category.length) {
                arr[i].sub_category = sub_category
            }
            out.push(arr[i])
        }
    }
    // logger.debug("=========OUT==",out);
    return out;
}
const AllParentCatByLocation=(dbName,languageId,latitude,longitude)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let mUnit=await getMeausringUnit(dbName)
    var sql = "select distinct cml.name,st.delivery_radius,ct.is_quantity,sb.id as supplier_branch_id, ct.is_agent, ct.type,ct.menu_type, ct.agent_list, ct.order, ct.new_order, ct.id, ct.supplier_placement_level, ct.image, ct.icon, "
    sql += "cml.description, ct.category_flow, ("+mUnit+" * acos (cos ( radians("+latitude+") )* cos( radians( st.latitude ) )* cos( radians( st.longitude ) - radians("+longitude+") ) "
    sql += "+ sin ( radians("+latitude+") )* sin( radians( st.latitude ) ))) AS distance,st.latitude,st.longitude from categories ct "
    sql += "join categories_ml cml on ct.id = cml.category_id join supplier_category  sc on sc.category_id = ct.id join supplier st on st.id = sc.supplier_id  join supplier_branch sb on sb.supplier_id = st.id "
    sql += "where ct.parent_id = ? and ct.is_deleted = ? and ct.is_live = ? and cml.language_id = ? and is_default = ? group by cml.name having distance<st.delivery_radius order by new_order "
    let data=await ExecuteQ.Query(dbName,sql,[0,0,parseInt(language_id)])
    // var st= multiConnection[dbName].query(sql,[0,0,parseInt(language_id)],function(err,data){
    //     logger.debug("===STMT==",st.sql)
    //      if(err){
    //          reject(err)
    //      }
    //      else{
             resolve(data)
    //      }
    //  })
        }
        catch(Err){
            reject(Err)
        }
})
}

const getCatServiceType=(dbName,id,serviceType)=>{
    logger.debug("======REQUES")
        return new Promise(async  (resolve,reject)=>{
            let sql="select `type` from categories where `id`=?"
            // multiConnection[dbName].e
            let data=await ExecuteQ.Query(dbName,sql,[id])
            logger.debug("==CATE==TERMIN=DAta==>>",data);
            if(data && data.length>0){  
                resolve(parseInt(data[0].type))
            }
            else{
                resolve(serviceType)
            }
        })
}
const getMsgText = (languageId, req, status) => {

    let lang=req.userLanguage && req.userLanguage!=undefined?req.userLanguage:"en"; 
    i18n.setLocale(lang);
    var languageId = parseInt(languageId)
    var serviceType = parseInt(req.service_type);
    console.log("===userLanguage==lang====msg==typeOf==category_id==serviceType=>>",req.userLanguage,lang,typeof lang,req.category_id,serviceType);
    var status = parseInt(status),terminology
    var msg_text = ""
    let common_msg_text=""
    return new Promise(async (resolve,reject)=>{
        if(serviceType>10){
                if(req.category_id!=undefined && req.category_id!="" && req.category_id!=null){
                    terminology=await getTerminologyByCategory(req.dbName,req.category_id);
                    serviceType=await getCatServiceType(req.dbName,req.category_id,serviceType)
                }
                else{
                    terminology=await getTerminology(req.dbName);
                }
          }
          else{
            terminology=await getTerminology(req.dbName);
          }
        // let terminology=await getTerminology(req.dbName);
        console.log("=========lang==servicetype========status======",languageId,serviceType,typeof Status)
        let english=terminology.english;
        let other=terminology.other;



        let eng_confirm_terminology=english.status["1"]!=undefined && english.status["1"]!=""?english.status["1"]:"confirmed"
        let eng_reject_terminology=english.status["2"]!=undefined && english.status["2"]!=""?english.status["2"]:"rejected"
        let eng_ontheway_terminology=english.status["3"]!=undefined && english.status["3"]!=""?english.status["3"]: parseInt(serviceType)==8?"started":"on the way"
        let eng_nearyou_terminology=english.status["4"]!=undefined && english.status["4"]!=""?english.status["4"]:"near you"
        let eng_deliverd_terminology=english.status["5"]!=undefined && english.status["5"]!=""?english.status["5"]:parseInt(serviceType)==8?"ended":"delivered"
        let eng_ratinggiven_terminology=english.status["6"]!=undefined && english.status["6"]!=""?english.status["6"]:"rating given"
        let eng_track_terminology=english.status["7"]!=undefined && english.status["7"]!=""?english.status["7"]:"track"
        let eng_cancelled_terminology=english.status["8"]!=undefined && english.status["8"]!=""?english.status["8"]:"cancelled"
        let eng_picked_terminology=english.status["10"]!=undefined && english.status["10"]!=""?english.status["10"]: parseInt(serviceType) == 8 ?"reached":"ready to be picked"
        let eng_inthekitched_terminology=english.status["11"]!=undefined && english.status["11"]!=""?english.status["11"]:parseInt(serviceType)==8?"on the way":"in the kitchen"

        //****for ecommerce************ */ 
        /**for order shipped */
        let eng_shipped_terminology=english.status["10"]!=undefined && english.status["10"]!=""?english.status["10"]:parseInt(serviceType)==8?"reached":"shipped"
        /**for order packed */        
        let eng_packed_terminology = english.status["11"]!=undefined && english.status["11"]!=""?english.status["11"]:"packed"
        /**for out for delivery */        
        let eng_outForDelivery_terminology = english.status["3"]!=undefined && english.status["3"]!=""?english.status["3"]:"out for delivery"
        //**************************** */ 

        let other_confirm_terminology=other.status["1"]!=undefined && other.status["1"]!=""?other.status["1"]:"تم تأكيد"
        let other_reject_terminology=other.status["2"]!=undefined && other.status["2"]!=""?other.status["2"]:"مرفوض"
        let other_ontheway_terminology=other.status["3"]!=undefined && other.status["3"]!=""?other.status["3"]:"علي الطريق"
        let other_nearyou_terminology=other.status["4"]!=undefined && other.status["4"]!=""?other.status["4"]:"بالقرب منك"
        let other_deliverd_terminology=other.status["5"]!=undefined && other.status["5"]!=""?other.status["5"]:"تم التوصيل"
        let other_ratinggiven_terminology=other.status["6"]!=undefined && other.status["6"]!=""?other.status["6"]:"تصنيف معين"
        let other_track_terminology=other.status["7"]!=undefined && other.status["7"]!=""?other.status["7"]:"تتبع"
        let other_cancelled_terminology=other.status["8"]!=undefined && other.status["8"]!=""?other.status["8"]:"ألغيت"
        let other_picked_terminology=other.status["10"]!=undefined && other.status["10"]!=""?other.status["10"]:"على استعداد ليتم التقاطها"
        let other_inthekitched_terminology=other.status["11"]!=undefined && other.status["11"]!=""?other.status["11"]:"في المطبخ"

        console.log("====TStatus===eng_inthekitched_terminology==english>>",status,eng_inthekitched_terminology,english)

        switch (serviceType) {
            case 0: /*********common check for messages like errors and validations */
                switch(languageId){
                        case 14:
                            switch(status){
                                case 0:
                                    msg_text=global.message.common.payment.en.no_gate_way
                                    break;
                                case 1:
                                    msg_text=global.message.common.payment.en.error
                                    break;
                                case 2:
                                    msg_text=global.message.notification.enable.en.success
                                    break;
                                case 3:
                                    msg_text=global.message.notification.disable.en.success
                                    break;
                            }
                            break;
                        case 15:
                            switch(status){
                                case 0:
                                    msg_text=global.message.common.payment.arb.no_gate_way
                                    break;
                                case 1:
                                    msg_text=global.message.common.payment.arb.error
                                    break;
                                case 2:
                                    msg_text=global.message.notification.enable.arb.success
                                    break;
                                case 3:
                                    msg_text=global.message.notification.disable.arb.success
                                    break;
                            }

                            break;
                               
                }
                break;
            case 1: /*************** */
                logger.debug("=============servicetype=========++",serviceType)
                case 1: /*************** */
                logger.debug("=============servicetype=========++",serviceType)
                switch (languageId) {
                    case 15 :
                            logger.debug("=============languageId=========++",languageId)
                            switch(status){
                                case 0 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.pending)
                                    msg_text = common_msg_text
                                    break;
                                case 1 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.confirmed)
                                    console.log("=15=common_msg_text=====>>",common_msg_text)
                                    msg_text = common_msg_text+other_confirm_terminology
                                    break;
                                case 2 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.rejected)
                                    msg_text = common_msg_text+other_reject_terminology
                                    break;
                                case 3 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.on_the_way)
                                    msg_text = common_msg_text+other_ontheway_terminology
                                    break;
                                case 4 : 
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.near_you)
                                    msg_text = common_msg_text+other_nearyou_terminology
                                    break;
                                case 5 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.delivered)
                                    msg_text = common_msg_text+other_deliverd_terminology
                                    break;
                                case 6 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.rating_given)
                                    msg_text = common_msg_text+other_ratinggiven_terminology
                                    break;
                                case 7 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.track)
                                    msg_text = common_msg_text+other_track_terminology
                                    break;
                                case 8 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.cancelled)
                                    msg_text = common_msg_text+other_cancelled_terminology
                                    break;
                                case 10 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.ready_to_be_picked)
                                    msg_text =common_msg_text+other_picked_terminology
                                    break;
                                case 11 :
                                    common_msg_text=i18n.__(global.message.food_delivery.orders.eng.in_the_kitchen)
                                    logger.debug("=============msg_text=====1====++",msg_text)
                                    msg_text = common_msg_text+other_inthekitched_terminology
                                    logger.debug("=============msg_text=====2====++",msg_text)
                                    break;
                            }
                            console.log("=common_msg_text=before=conversion==msg_text=>>",common_msg_text,msg_text)
                            // msg_text=i18n.__(msg_text)
                            msg_text=await getMsgAfterTerminology(english,msg_text);
                            break;
                    case 14 :
                        logger.debug("=============languageId=========++",languageId)
                        switch(status){
                            case 0 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.pending)
                                msg_text = common_msg_text
                                break;
                            case 1 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.confirmed)
                                console.log("==14=common_msg_text=====>>",common_msg_text)
                                msg_text = common_msg_text+eng_confirm_terminology
                                break;
                            case 2 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.rejected)
                                msg_text = common_msg_text+eng_reject_terminology
                                break;
                            case 3 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.on_the_way)
                                msg_text = common_msg_text+eng_ontheway_terminology
                                break;
                            case 4 : 
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.near_you)
                                msg_text = common_msg_text+eng_nearyou_terminology
                                break;
                            case 5 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.delivered)
                                msg_text = common_msg_text+eng_deliverd_terminology
                                break;
                            case 6 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.rating_given)
                                msg_text = common_msg_text+eng_ratinggiven_terminology
                                break;
                            case 7 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.track)
                                msg_text = common_msg_text+eng_track_terminology
                                break;
                            case 8 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.cancelled)
                                msg_text = common_msg_text+eng_cancelled_terminology
                                break;
                            case 10 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.ready_to_be_picked)
                                msg_text =common_msg_text+eng_picked_terminology
                                break;
                            case 11 :
                                common_msg_text=i18n.__(global.message.food_delivery.orders.eng.in_the_kitchen)
                                logger.debug("=============msg_text=====1====++",msg_text)
                                msg_text = common_msg_text+eng_inthekitched_terminology
                                logger.debug("=============msg_text=====2====++",msg_text)
                                break;
                        }
                        console.log("=common_msg_text=before=conversion==msg_text=>>",common_msg_text,msg_text)
                        // msg_text=i18n.__(msg_text)
                        msg_text=await getMsgAfterTerminology(english,msg_text);
                        break;
                    case 16:
                        switch(status){
                            case 0 :
                                msg_text = global.message.food_delivery.orders.spanish.pending
                                break;
                            case 1 :
                                msg_text = global.message.food_delivery.orders.spanish.confirmed
                                break;
                            case 2 :
                                msg_text = global.message.food_delivery.orders.spanish.rejected
                                break;
                            case 3 :
                                msg_text = global.message.food_delivery.orders.spanish.on_the_way
                                break;
                            case 4 : 
                                msg_text = global.message.food_delivery.orders.spanish.near_you
                                break;
                            case 5 :
                                msg_text = global.message.food_delivery.orders.spanish.delivered
                                break;
                            case 6 :
                                msg_text = global.message.food_delivery.orders.spanish.rating_given
                                break;
                            case 7 :
                                msg_text = global.message.food_delivery.orders.spanish.track
                                break;
                            case 8 :
                                msg_text = global.message.food_delivery.orders.spanish.cancelled
                                break;
                            case 10 :
                                msg_text = global.message.food_delivery.orders.spanish.ready_to_be_picked
                                break;
                            case 11 :
                                msg_text = global.message.food_delivery.orders.spanish.in_the_kitchen
                                break;
                        }
                        msg_text=i18n.__(msg_text)
                        break;
                }
                break;
            case 2:
                switch (languageId) {
                    case 14 || 15:
                        switch(status){
                            case 0 :
                                msg_text = global.message.ecommerce.orders.eng.pending
                                break;
                            case 1 :
                                msg_text = global.message.ecommerce.orders.eng.confirmed+eng_confirm_terminology
                                break;
                            case 2 :
                                msg_text = global.message.ecommerce.orders.eng.rejected+eng_reject_terminology
                                break;
                            case 3 :
                                msg_text = global.message.ecommerce.orders.eng.on_the_way+eng_outForDelivery_terminology
                                break;
                            case 4 : 
                                msg_text = global.message.ecommerce.orders.eng.near_you+eng_nearyou_terminology
                                break;
                            case 5 :
                                msg_text = global.message.ecommerce.orders.eng.delivered+eng_deliverd_terminology
                                break;
                            case 6 :
                                msg_text = global.message.ecommerce.orders.eng.rating_given+eng_ratinggiven_terminology
                                break;
                            case 7 :
                                msg_text = global.message.ecommerce.orders.eng.track+eng_track_terminology
                                break;
                            case 8 :
                                msg_text = global.message.ecommerce.orders.eng.cancelled+eng_cancelled_terminology
                                break;
                            case 10 :
                                msg_text = global.message.ecommerce.orders.eng.ready_to_be_picked+eng_shipped_terminology
                                break;
                            case 11 :
                                msg_text = global.message.ecommerce.orders.eng.packed+eng_packed_terminology
                                break;
                        }
                        msg_text=i18n.__(msg_text)
                        msg_text=await getMsgAfterTerminology(english,msg_text)
                        break;
                }
                break;
            case 8:
                // switch (languageId) {
                //     case 14 || 15:
                        switch(status){
                            case 0 :
                                msg_text = global.message.home_service.orders.eng.pending
                                break;
                            case 1 :
                                msg_text = global.message.home_service.orders.eng.confirmed+eng_confirm_terminology
                                break;
                            case 2 :
                                msg_text = global.message.home_service.orders.eng.rejected+eng_reject_terminology
                                break;
                            case 3 :
                                msg_text = global.message.home_service.orders.eng.on_the_way+eng_ontheway_terminology
                                break;
                            case 4 : 
                                msg_text = global.message.home_service.orders.eng.near_you+eng_nearyou_terminology
                                break;
                            case 5 :
                                msg_text = global.message.home_service.orders.eng.delivered+eng_deliverd_terminology
                                break;
                            case 6 :
                                msg_text = global.message.home_service.orders.eng.rating_given+eng_ratinggiven_terminology
                                break;
                            case 7 :
                                msg_text = global.message.home_service.orders.eng.track+eng_track_terminology
                                break;
                            case 8 :
                                msg_text = global.message.home_service.orders.eng.cancelled+eng_cancelled_terminology
                                break;
                            case 10 :
                                msg_text = global.message.home_service.orders.eng.ready_to_be_picked+eng_picked_terminology
                                break;
                            case 11 :
                                msg_text = global.message.home_service.orders.eng.packed+eng_inthekitched_terminology
                                break;
                        }
                        msg_text=i18n.__(msg_text)
                        msg_text=await  getMsgAfterTerminology(english,msg_text)
                        break;
                // }
                break;
        }
        console.log("========in last msg text========",msg_text)
        resolve(msg_text)
    })
}


const getErrMsgText = (msgCategory, msgType, dbName, serviceType, languageId) => {
    logger.debug("===========msgCategory, msgType, dbName, serviceType, languageId==================",
    msgCategory, msgType, dbName, serviceType, languageId);
    return new Promise(async (resolve, reject) => {
        let terminology = await getTerminology(dbName);
        let english = terminology.english;
        let other = terminology.other;
        let err_text = ""
        switch (serviceType) { /**************for service type****************/
            case 1: /*****for food****/
                switch (languageId) {
                    case 14:/****************for english language*************** */
                        switch (msgCategory) {/**********to check error category************************/
                            case 0: /****FOR RATING ERROR MESSAGES*********/
                                switch (msgType) {/**********to check error type************************/
                                    case 0: /**********Already rate error***************/
                                        err_text = global.message.food_delivery.errorMessages.eng.ratingErorr.already_rate
                                        break;
                                    case 1:/*****************rating err************** */
                                        err_text = global.message.food_delivery.errorMessages.eng.ratingErorr.rating_error
                                        break;
                                }
                                break;
                            case 1:/***FOR SUPPLIER ERROR MESSAGES */
                                switch (msgType) {
                                    case 0: /**********supplier delivery errorr***************/
                                        err_text = global.message.food_delivery.errorMessages.eng.suppliererror.supplier_does_not_deliver_in_your_area
                                        break;
                                }
                                break;

                        }
                        err_text = await getMsgAfterTerminology(english, err_text)
                        break;
                    case 15:/****************for other language*************** */
                        switch (msgCategory) {/**********to check error category************************/
                            case 0: /****FOR RATING ERROR MESSAGES*********/
                                switch (msgType) {/**********to check error type************************/
                                    case 0: /**********Already rate error***************/
                                        err_text = global.message.food_delivery.errorMessages.eng.ratingErorr.already_rate
                                        break;
                                    case 1:/***********rating error************************** */
                                        err_text = global.message.food_delivery.errorMessages.eng.ratingErorr.rating_error
                                        break;
                                }
                                break;
                            case 1:/***FOR SUPPLIER ERROR MESSAGES */
                                switch (msgType) {
                                    case 0: /**********supplier delivery errorr***************/
                                        err_text = global.message.food_delivery.errorMessages.arb.suppliererror.supplier_does_not_deliver_in_your_area
                                        break;
                                }
                                break;
                        }
                        err_text = await getMsgAfterTerminology(other, err_text)
                        break;
                }
                break;
            case 2: /*****for ecommerce****/
                switch (languageId) {
                    case 14:/****************for english language*************** */
                        switch (msgCategory) {/**********to check error category************************/
                            case 0: /****FOR RATING ERROR MESSAGES*********/
                                switch (msgType) {/**********to check error type************************/
                                    case 0: /**********Already rate error***************/
                                        err_text = global.message.ecommerce.errorMessages.eng.ratingErorr.already_rate
                                        break;
                                    case 1:/***********rating error************************** */
                                        err_text = global.message.ecommerce.errorMessages.eng.ratingErorr.rating_error
                                        break;
                                }
                                break;
                            case 1:/***FOR SUPPLIER ERROR MESSAGES */
                                switch (msgType) {
                                    case 0: /**********supplier delivery errorr***************/
                                        err_text = global.message.ecommerce.errorMessages.eng.suppliererror.supplier_does_not_deliver_in_your_area
                                        break;
                                }
                                break;
                        }
                        err_text = await getMsgAfterTerminology(english, err_text)
                        break;
                    case 15:/****************for other language*************** */
                        switch (msgCategory) {/**********to check error category************************/
                            case 0: /****FOR RATING ERROR MESSAGES*********/
                                switch (msgType) {/**********to check error type************************/
                                    case 0: /**********Already rate error***************/
                                        err_text = global.message.ecommerce.errorMessages.arb.ratingErorr.already_rate
                                        break;
                                    case 1:/***********rating error************************** */
                                        err_text = global.message.ecommerce.errorMessages.arb.ratingErorr.rating_error
                                        break;
                                }
                                break;
                            case 1:/***FOR SUPPLIER ERROR MESSAGES */
                                switch (msgType) {
                                    case 0: /**********supplier delivery errorr***************/
                                        err_text = global.message.ecommerce.errorMessages.arb.suppliererror.supplier_does_not_deliver_in_your_area
                                        break;
                                }
                                break;
                        }
                        err_text = await getMsgAfterTerminology(other, err_text)
                        break;
                }
                break;
            case 8: /*****for home services****/
                switch (languageId) {
                    case 14:/****************for english language*************** */
                        switch (msgCategory) {/**********to check error category************************/
                            case 0: /****FOR RATING ERROR MESSAGES*********/
                                switch (msgType) {/**********to check error type************************/
                                    case 0: /**********Already rate error***************/
                                        err_text = global.message.home_service.errorMessages.eng.ratingErorr.already_rate
                                        break;
                                    case 1:/***********rating error************************** */
                                        err_text = global.message.home_service.errorMessages.eng.ratingErorr.rating_error
                                        break;
                                }
                                break;
                            case 1:/***FOR SUPPLIER ERROR MESSAGES******** */
                                switch (msgType) {
                                    case 0: /**********supplier delivery errorr***************/
                                        err_text = global.message.home_service.errorMessages.eng.suppliererror.supplier_does_not_deliver_in_your_area
                                        break;
                                }
                                break;
                        }
                        err_text = await getMsgAfterTerminology(english, err_text)
                        break;
                    case 15:/****************for other language*************** */
                        switch (msgCategory) {/**********to check error category************************/
                            case 0: /****FOR RATING ERROR MESSAGES*********/
                                switch (msgType) {/**********to check error type************************/
                                    case 0: /**********Already rate error***************/
                                        err_text = global.message.home_service.errorMessages.arb.ratingErorr.already_rate
                                        break;
                                    case 1:/***********rating error************************** */
                                        err_text = global.message.home_service.errorMessages.eng.ratingErorr.rating_error
                                        break;
                                }
                                break;
                            case 1:/***FOR SUPPLIER ERROR MESSAGES */
                                switch (msgType) {
                                    case 0: /**********supplier delivery errorr***************/
                                        err_text = global.message.home_service.errorMessages.arb.suppliererror.supplier_does_not_deliver_in_your_area
                                        break;
                                }
                                break;
                        }
                        err_text = await getMsgAfterTerminology(other, err_text)
                        break;
                }
                break;
        }
        logger.debug("==========err_text===",err_text)
        resolve(err_text);
    })
}
const getStripSecretKey=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.strip.secret_key")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}

const getPOSKeys=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=?";
        multiConnection[dbName].query(sql,["pos_key","pos_client_id"],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}

const is_decimal_quantity_allowed=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,["is_decimal_quantity_allowed"],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}
const isEnabledMultipleBaseDeliveryCharges=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,["is_enabled_multiple_base_delivery_charges"],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}

const getMumybeneKeyData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        console.log("3333333333333333333333333")
        let key_object={};
        let sql="select `key`,`value` from tbl_setting  WHERE `key`='mumybene_username' or `key`='mumybene_password'";
        console.log(config.get("payment.mumybene.mumybene_username"),"666666666666666666666666666666",config.get("payment.mumybene.mumybene_password"))
        multiConnection[dbName].query(sql,(err,data)=>{

        console.log(err,"777777777777777777777777",data)
            if(err){
                reject(err)
            }
            else{
                console.log("4444444444444444444444444444",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    console.log("5555555555555555555555555",key_object)
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}


const getMyFatoorahToken=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.myfatoorah.secret_key")],(err,data)=>{ //myfatoorah_secret_key
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}

const getConvergeData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.converge.merchantID"),config.get("payment.converge.merchantUserID"),config.get("payment.converge.merchantPIN")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}

const getZoomKeys=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=?";
        multiConnection[dbName].query(sql,["zoom_api_key","zoom_api_secret","zoom_email"],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key.toLowerCase()]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
const getPayhereData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.payhere.merchantID")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}

const getCheckoutSecretKey=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={};
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.checkout.secret_key")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                //resolve(data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
const getConektaSecretKey=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.conekta.secret_key")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}
const getSquareupSecretKey=(dbName)=>{
    logger.debug("======dbName=====",dbName);
    return new Promise((resolve,reject)=>{
        let key_object={};
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.squareup.square_token")],(err,data)=>{
            if(err){
                logger.debug("=====err====",err);
                reject(err)
            }
            else{
                logger.debug("=======RAZOR SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
const getUserData=(dbName,token)=>{
    return new Promise((resolve,reject)=>{
        let sql="select us.firstname,us.wallet_amount,ua.customer_address,ua.address_line_1,ua.address_line_2,ua.pincode,concat(us.firstname,',',us.lastname) as name,us.email,us.phone_no,us.mobile_no,us.id from user us left join user_address ua on ua.user_id=us.id where us.access_token=?";
        multiConnection[dbName].query(sql,[token],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}
const getAuthorizeNetKeys=(dbName)=>{
    let key_object={};
    return new Promise(async (resolve,reject)=>{
        try {
            logger.debug("=========dbName============",dbName)
            let data=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? or `key`=?",[
                config.get("payment.authorize_net.api_login_id"),
                config.get("payment.authorize_net.transaction_key")
            ])
            if(data && data.length>0){
                for(const [index,i] of data.entries()){
                    key_object[i.key]=i.value
                }
                resolve(key_object)
            }
            else{
                resolve(key_object)
            }
        }
        catch (e) {
            resolve({})
        }
    })
}

const getSafe2Paykey=(dbName)=>{
    let key_object={};
    return new Promise(async (resolve,reject)=>{
        try {
            logger.debug("=========dbName============",dbName)
            let data=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? ",
            [
                "safe2pay_apikey"
            ])
            if(data && data.length>0){
                for(const [index,i] of data.entries()){
                    key_object[i.key]=i.value
                }
                resolve(key_object)
            }
            else{
                resolve(key_object)
            }
        }
        catch (e) {
            resolve({})
        }
    })
}

const getAgentData=(dbName,token)=>{
    return new Promise(async  (resolve,reject)=>{
        ;
        let sql="select us.name,us.email,us.phone_number,us.phone_number as phone_no,us.phone_number as mobile_no,us.id,'test' as customer_address, 'test' as  address_line_1, 'test' as  address_line_2 from cbl_user us where us.access_token=?";
        let getAgentDbData=await common.GetAgentDbInformation(dbName); 
        let agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
        token = token.replace('Bearer ', '');
        token = token.replace('bearer ', '');
        var data = await ExecuteQ.QueryAgent(agentConnection,sql,[token]);
        resolve(data)
        // multiConnection[agentDb].query(sql,[token],(err,data)=>{
        //     if(err){
        //         reject(err)
        //     }
        //     else{
        //         resolve(data)
        //     }
        // })
    })
}
const getRazorPayData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.razorpay.secret_key"),config.get("payment.razorpay.publish_key")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                logger.debug("=======RAZOR SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                        if(i.key==config.get("payment.razorpay.secret_key")){
                            key_object[config.get("payment.razorpay.secret_key")]=i.value;
                        }
                        else{
                            key_object[config.get("payment.razorpay.publish_key")]=i.value;
                        }
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
const getSaferPayData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}

        let sql="select `key`,`value` from tbl_setting where `key` IN (?)";
        multiConnection[dbName].query(sql,[[config.get("payment.saferpay.username"),config.get("payment.saferpay.password"), config.get("payment.saferpay.terminalId"), config.get("payment.saferpay.customerId")]],(err,data)=>{

            if(err){
                reject(err)
            }
            else{
                logger.debug("=======saferpay SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                        if(i.key==config.get("payment.saferpay.username")){
                            key_object[config.get("payment.saferpay.username")]=i.value;
                        }
                        else if(i.key==config.get("payment.saferpay.password")){
                            key_object[config.get("payment.saferpay.password")]=i.value;
                        }
                        else if(i.key==config.get("payment.saferpay.customerId")){
                            key_object[config.get("payment.saferpay.customerId")]=i.value;
                        } else {
                            key_object[config.get("payment.saferpay.terminalId")]=i.value;
                        }
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
const getEncryptData=(text)=>{
    return new Promise((resolve,reject)=>{
        logger.debug("===============texyt========",text,typeof text);
        const cipher = crypto.createCipher(algorithm,crypto_password);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        logger.debug("=========crypted========",crypted)
        resolve(crypted)

    })

}
const getTerminology=(dbName)=>{
            logger.debug("======REQUES")
        return new Promise(async  (resolve,reject)=>{
            
            let sql="select `value` from tbl_setting where `key`=?"
            // multiConnection[dbName].e
            let data=await ExecuteQ.Query(dbName,sql,["terminology"])
            // logger.debug("===DAta==>>",data);
            if(data && data.length>0){
                    let terminology= JSON.parse(data[0].value);
                    // logger.debug("=========TRM===>>",terminology);
                    resolve(terminology)
            }
            else{
                resolve({})
            }
        })
}

const getClientLanguage = (dbName)=>{
    return new Promise(async(resolve,reject)=>{
        let sql = "select value from tbl_setting where `key`=?"
        let data = await ExecuteQ.Query(dbName,sql,["language_type"]);
        if(data && data.length>0){
            if(parseInt(data[0].value)>=1){
                resolve(data)
            }else{
                resolve([])
            }
        }else{
            resolve([])
        }
    })
}

const getMsgAfterTerminology=(data,message)=>{
    let msg=message
    console.log("======TERM==DATA!=MSG=>>",data,msg);
    return new Promise((resolve,reject)=>{
            for (let key in data){
                if(data.hasOwnProperty(key)){
                    if(data[key]!="" && data[key]!=undefined){
                        msg=msg.replace(key,data[key])
                        console.log("===FRACKIES=PHRASIED>>",msg,key,`${data[key]}`)
                    }
                }
            }
            resolve(msg)

    })
}
const getDeliveryChargeAlgo=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            let data = await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=?", [config.get("algorithem.delivery_charge_key")]);
            resolve(data)
        }catch (e) {
            resolve([])
        }
    })

}

// const getCurrency=(dbName)=>{
//     return new Promise( async (resolve,reject)=>{
//         let defaultCurrency="usd";
//         let currenncyData=await ExecuteQ.Query(dbName,`select currency_name,currency_symbol from currency_conversion limit 1`,[])
//         if(currenncyData && currenncyData.length>0){
//             defaultCurrency=currenncyData[0].currency_name
//         } 
//         resolve(defaultCurrency)
//     })
// }

const getTwilioData=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        let twilio_data={}
        try {
            let data = await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=? or `key`=?",
                [
                config.get("twilio.s_id"),
                config.get("twilio.auth_key"),
                config.get("twilio.number_key"),
                "twillio_service_sid"]);
            logger.debug("=======Twilio==DaTA!======",data)
            if(data && data.length>0){
                for(const i of data){
                    logger.debug("=======I=Key=DATA!==",i.key,i.value)
                    twilio_data[i.key]=i.value
                }
                logger.debug("======Twiloi====",twilio_data)
                resolve(twilio_data);

            }
            else{
                 resolve(twilio_data)
            }

        }catch (e) {
            logger.debug("====Twilio===Err===>",e)
            resolve(twilio_data);
        }
    })
}

const getBandwidthData=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        let BandwidthData={}
        try {
            let data = await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=? or `key`=? or `key`=?",
                [
                    "bandwidth_basic_auth_user_name",
                    "bandwidth_basic_auth_password",
                    "bandwidth_application_id",
                    "bandwidth_user_id",
                    "bandwidth_from_number"
                ]);
            logger.debug("======getBandwidthData=DaTA!======",data)
            if(data && data.length>0){
                for(const i of data){
                    logger.debug("======getBandwidthDataey=DATA!==",i.key,i.value)
                    BandwidthData[i.key]=i.value
                }
                logger.debug("=====getBandwidthData====",BandwidthData)
                resolve(BandwidthData);

            }
            else{
                 resolve(BandwidthData)
            }

        }catch (e) {
            logger.debug("====Twilio===Err===>",e)
            resolve(BandwidthData);
        }
    })
}

const getSemaPhoreData=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        let semaphore={}
        try {
            let data = await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=? or `key`=? ",
                [
                    "semaphore_apikey",
                    "semaphore_sendername"
                ]);
            logger.debug("======semaphore=DaTA!======",data)
            if(data && data.length>0){
                for(const i of data){
                    logger.debug("======semaphore=DATA!==",i.key,i.value)
                    semaphore[i.key]=i.value
                }
                logger.debug("=====semaphore====",semaphore)
                resolve(semaphore);

            }
            else{
                 resolve(semaphore)
            }

        }catch (e) {
            logger.debug("====semaphore===Err===>",e)
            resolve(semaphore);
        }
    })
}

const getTwilioAuthyData=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        let twilio_data={}
        try {
            let data = await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=? or `key`=? ",
                ["is_twilio_authy_enable","authy_production_key"]);
            logger.debug("=======Twilio==DaTA!======",data)
            if(data && data.length>0){
                for(const i of data){
                    logger.debug("=======I=Key=DATA!==",i.key,i.value)
                    twilio_data[i.key]=i.value
                }
                logger.debug("======Twiloi====",twilio_data)
                resolve(twilio_data);

            }
            else{
                 resolve(twilio_data)
            }

        }catch (e) {
            logger.debug("====Twilio===Err===>",e)
            resolve(twilio_data);
        }
    })
}

const disableOtpVerification=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        let twilio_data={}
        try {
            let data = await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=?",
                ["bypass_otp"]);
            if(data && data.length>0){
                if(data[0].value==1){
                    resolve(data);
                }else{
                    resolve([]);
                }
            }else{
                resolve([])
            }

        }catch (e) {
            logger.debug("====Twilio===Err===>",e)
            resolve(twilio_data);
        }
    })
}




const getPaystackSecretKey=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.paystack.secret_key")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}



const checkNumberMasking=(dbName)=>{
    return new Promise(async(resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key`=? and value=1";
        let result = await ExecuteQ.Query(dbName,sql,["is_number_masking_enable"])
        resolve(result);
    })
}


const getPeachSecretKey=(dbName)=>{
    let key_object={};
    return new Promise(async (resolve,reject)=>{
        try {
            let data=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? or `key`=?",[
                config.get("payment.peach.peach_auth_token"),
                config.get("payment.peach.peach_entityid")
            ])
            if(data && data.length>0){
                for(const [index,i] of data.entries()){
                    key_object[i.key]=i.value
                }
                resolve(key_object)
            }
            else{
                resolve(key_object)
            }
        }
        catch (e) {
            resolve({})
        }
    })
}


const getThawaniKeys=(dbName)=>{
    let key_object={};
    return new Promise(async (resolve,reject)=>{
        try {
            logger.debug("=========dbName============",dbName)
            let data=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? or `key`=?",[
                "thawani_api_key",
                "thawani_public_key"
            ])
            if(data && data.length>0){
                for(const [index,i] of data.entries()){
                    key_object[i.key]=i.value
                }
                resolve(key_object)
            }
            else{
                resolve(key_object)
            }
        }
        catch (e) {
            resolve({})
        }
    })
}
const smtpData=(dbName)=>{
    let smtp_data={};
    return new Promise(async (resolve,reject)=>{
        try {
            let data=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=? or `key`=? or `key`=? or `key`=? or `key`=?",[
                config.get("smtp.from_email_key"),
                config.get("smtp.password_key"),
                config.get("smtp.smptp_service_key"),
                "smtp_from_email",
                "smtp_host",
                "smtp_port",
                "smtp_secure"
            ])
            if(data && data.length>0){
                for(const [index,i] of data.entries()){
                    smtp_data[i.key]=i.value
                }
                resolve(smtp_data)
            }
            else{
                resolve(smtp_data)
            }
        }
        catch (e) {
            resolve({})
        }
    })
}
const getRecieverReferralPrice=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
            try{
                let data=await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=?", ["referral_receive_price"]);
                if(data && data.length>0){
                    resolve(parseInt(data[0].value))
                }
                else{
                    resolve(0)
                }

            }catch (e) {
                  logger.debug("=======Err!",e)
                    resolve(0)
            }
    })
}
const getGivenReferralPrice=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let data=await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=?", ["referral_given_price"]);
            if(data && data.length>0){
                resolve(parseInt(data[0].value))
            }
            else{
                resolve(0)
            }

        }catch (e) {
            logger.debug("=======Err!",e)
            resolve(0)
        }
    })
}

const deliveryCommissionWise = (dbName)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let data=await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=?", ["commission_delivery_wise"]);
            if(data && data.length>0){
                resolve(parseInt(data[0].value))
            }
            else{
                resolve(0)
            }

        }catch (e) {
            logger.debug("=======Err!",e)
            resolve(0)
        }
    })
}

// const getFileNameWithUserIdWithCustomPrefix = (thumbFlag, fullFileName, type, userId) => {
//     // console.log("==thumbFlag, fullFileName, type, userId==",thumbFlag, fullFileName, type, userId)
//     let prefix = '';
//     if (type == consts.FILE_UPLOAD.FILE_TYPES.LOGO) {
//         prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.ORIGINAL;
//     }
//     else if (type == consts.FILE_UPLOAD.FILE_TYPES.CAT) {
//         // console.log("*******ENTERING********")
//         prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.CAT_ORIGINAL;
//     }
//     else if (type == consts.FILE_UPLOAD.FILE_TYPES.FEED) {
//         // console.log("*******ENTERING********")
//         prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.FEED_ORIGINAL;
//     }
//     else if (type == consts.FILE_UPLOAD.FILE_TYPES.CHAT) {
//         // console.log("*******ENTERING********")
//         prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.CHAT_ORIGINAL;
//     }
//     const ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);

//     if (thumbFlag && type == consts.FILE_UPLOAD.FILE_TYPES.LOGO) {
//         prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.THUMB;
//     }
//     else if (thumbFlag && type == consts.FILE_UPLOAD.FILE_TYPES.CAT) {
//         prefix = CONSTANTS.APP_CONSTANTS.DATABASE.PROFILE_PIC_PREFIX.CAT_THUMB;
//     }
//     else if (thumbFlag && type == consts.FILE_UPLOAD.FILE_TYPES.FEED) {
//         prefix = CONSTANTS.APP_CONSTANTS.DATABASE.PROFILE_PIC_PREFIX.FEED_THUMB;
//     }
//     let timestamp = new Date().getTime();
//     return prefix + timestamp + ext;
// };



const getUserLeftReferralAmount=(dbName,userId)=>{
    let referralAmount=0
    return new Promise(async (resolve,reject)=>{
        try {
            let totalRefferalData = await ExecuteQ.Query(dbName, `select IFNULL(SUM(CASE 
                                WHEN ur.from_id=?   
                                THEN ur.receive_price
                                WHEN ur.to_id=? 
                                THEN ur.given_price
                                ELSE 0
                            END),0) AS CreditCardTotal from user us
                             join user_referral as ur on us.id =ur.to_id and ur.ready_for_use=1`, [userId, userId]);
            if (totalRefferalData && totalRefferalData.length > 0) {
                referralAmount = parseFloat(totalRefferalData[0].CreditCardTotal)
            }
            let usedReferralData = await ExecuteQ.Query(dbName, "select IFNULL(SUM(used_price),0) as usedRefAmount from referral_used where used_by=?", [userId]);
            if (usedReferralData && usedReferralData.length > 0) {
                if(parseFloat(usedReferralData[0].usedRefAmount)>referralAmount){
                    referralAmount=0
                }
                else{
                    referralAmount = referralAmount - parseFloat(usedReferralData[0].usedRefAmount)
                }
                
            }
            logger.debug("====referralAmount====",referralAmount)
            resolve(referralAmount)
        }
        catch (e) {
            logger.debug("==========Err!==",e)
            resolve(referralAmount)
        }
    })

}
const getPaypalData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.paypal.secret_key"),config.get("payment.paypal.client_key")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                logger.debug("=======RAZOR SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}

const getDeliveryTypeKey=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,["is_enable_delivery_type"],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                logger.debug("=======RAZOR SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}

const disableAgentOrderLocationAssignment = (dbName)=>{
    return new Promise(async(resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key`=? and value=1";
        let data = await ExecuteQ.Query(dbName,sql,["disable_agent_order_assign_notification"]);
        if(data && data.length>0){
            resolve(true);
        }else{
            resolve(false);
        }
    })
}

const getSuperAdminEmail = (dbName)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let sql = "select email,phone_number,iso,country_code from admin where is_superadmin=1 order by id asc limit 1";
            let params = []
            let result = await ExecuteQ.Query(dbName,sql,params);
            if(result && result.length>0){
                resolve(result[0].email);
            }else{
                resolve("");
            }

        }catch(e){
            logger.debug("+===============e=======",e);
            resolve("")
        }
    })

}


const getBraintreeData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.venmo.merchant_id"),config.get("payment.venmo.public_key"),config.get("payment.venmo.private_key")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                logger.debug("=======RAZOR SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                        key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
const getAuthTokeOfPayPal=(client_key,secret_key)=>{
    return new Promise((resolve,reject)=>{
        let paypal_api = process.env.NODE_ENV == 'live' ? 'https://api.sandbox.paypal.com' : 'https://api.paypal.com'
        logger.debug("========dbName,client_key,secret_key====paypal_api==",process.env.NODE_ENV,client_key,secret_key,paypal_api)
        // QVVCczNXOVZUT3Z1MGlDUHljOTJZQld0eDB6RW12bTJoOUJVVEl6MmRRcHB2dkQtblhCX29qUGJEaGtWM2gwVWVPbzE5VTZhOE9fdDJKaUo6RUhJOXZwdnJiUGQxVU1NYzdfd0dnYWJnSDJUN0ltbTB3ZFpVakFOQXZRV2wtZzZPVE0yRWVsbWFVQXFzQ0I3YzJJQW9LTUtPZWxGdERuemE=
        var options = {
            'method': 'POST',
            'url': paypal_api+'/v1/oauth2/token',
            'headers': {
                'Authorization': 'Basic '+Buffer.from(client_key + ":" + secret_key).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                'grant_type': 'client_credentials'
            }
        };
        request(options, function (error, response,body) {
            logger.debug("===Body!==",body);
            if (!error) {
                var data=body && body!=undefined?JSON.parse(body):body
                resolve(data)
            } else {
                logger.debug("===Else Body!==");
                reject();
            }
        });
    })
}


const getFileNameWithUserIdWithCustomPrefix = (thumbFlag, fullFileName, type, userId) => {
    // console.log("==thumbFlag, fullFileName, type, userId==",thumbFlag, fullFileName, type, userId)
    let prefix = '';
    if (type == consts.FILE_UPLOAD.FILE_TYPES.LOGO) {
        prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.ORIGINAL;
    }
    else if (type == consts.FILE_UPLOAD.FILE_TYPES.CAT) {
        // console.log("*******ENTERING********")
        prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.CAT_ORIGINAL;
    }
    else if (type == consts.FILE_UPLOAD.FILE_TYPES.FEED) {
        // console.log("*******ENTERING********")
        prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.FEED_ORIGINAL;
    }
    else if (type == consts.FILE_UPLOAD.FILE_TYPES.CHAT) {
        // console.log("*******ENTERING********")
        prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.CHAT_ORIGINAL;
    }
    const ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);

    if (thumbFlag && type == consts.FILE_UPLOAD.FILE_TYPES.LOGO) {
        prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.THUMB;
    }
    else if (thumbFlag && type == consts.FILE_UPLOAD.FILE_TYPES.CAT) {
        prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.CAT_THUMB;
    }
    else if (thumbFlag && type == consts.FILE_UPLOAD.FILE_TYPES.FEED) {
        prefix = consts.FILE_UPLOAD.PROFILE_PIC_PREFIX.FEED_THUMB;
    }
    let timestamp = new Date().getTime();
    return prefix + timestamp + ext;
};


const getFcmServerKey = (dbName)=>{
    return new Promise(async(resolve,reject)=>{
        let sql = "select `value` from tbl_setting where `key` =? "
        let result = await ExecuteQ.Query(dbName,sql,['fcm_server_key']);
        if(result && result.length>0){
            resolve(result[0].value);
        }else{
            resolve("")
        }
    })
}

const isUserSubscriptionEnabled = (dbName)=>{
    return new Promise(async(resolve,reject)=>{
        let sql = "select `value` from tbl_setting where `key` =? "
        let result = await ExecuteQ.Query(dbName,sql,['is_user_subscription']);
        if(result && result.length>0){
            resolve(result[0].value);
        }else{
            resolve("")
        }
    })
}
// const isCommissionDynamicEnabled = (dbName)=>{
//     return new Promise(async(resolve,reject)=>{
//         let sql = "select `value` from tbl_setting where `key` =? "
//         let result = await ExecuteQ.Query(dbName,sql,['is_commission_dynamic']);
//         if(result && result.length>0){
//             resolve(result[0].value);
//         }else{
//             resolve("")
//         }
//     })
// }
const isCommissionDynamicEnabled=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let key_object={}
            let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=?";
            let data=await ExecuteQ.Query(dbName,sql,['is_commission_dynamic','is_admin_commission_on_netamount'])
            if(data && data.length>0){
                for(const [index,i] of data.entries()){
                        key_object[i.key]=i.value;
                }
                resolve(key_object)
            }
            else{
                resolve({})
            }
        }
        catch(Err){
            reject(Err)
        }
    })
}


const getUserPriceType = (dbName)=>{
    return new Promise(async(resolve,reject)=>{
        let sql = "select `value` from tbl_setting where `key` =? "
        let result = await ExecuteQ.Query(dbName,sql,['user_type_check']);
        if(result && result.length>0){
            if(parseInt(result[0].value)==1){
                resolve(result);
            }else{
                resolve([])
            }
        }else{
            resolve([])
        }
    })
}

const taxGatewayAccToLocation= (dbName)=>{
    return new Promise(async(resolve,reject)=>{
        let sql = "select `value` from tbl_setting where `key` =? "
        let result = await ExecuteQ.Query(dbName,sql,['is_area_wise']);
        if(result && result.length>0){
            if(result[0].value==1){
                resolve(result);
            }else{
                resolve([])
            }
        }else{
            resolve([])
        }
    })
}

const checkLocationwiseTaxAndpaymentGateway= (dbName,supplier_id,latitude,longitude)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let sql = "select st_contains(coordinates,point(?,?)) as is_under,tax,payment_gateways,delivery_charges from supplier_delivery_areas ";
            sql += "where supplier_id=?  having is_under>0"
        let params = [latitude,longitude,supplier_id]
        let result = await ExecuteQ.Query(dbName,sql,params);
        if(result && result){
            resolve(result)
        }else{
            resolve([])
        }
        }catch(e){
            logger.debug("===========err=======",e)
            reject(e);
        }
    })
}
const checkLocationWiseCategories = (dbName,
    latitude,longitude,category_id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let sql = "select st_contains(coordinates,point(?,?)) as is_under from categories_areas ";
            sql += "where category_id=?  having is_under>0"
        let params = [latitude,longitude,category_id]
        let result = await ExecuteQ.Query(dbName,sql,params);
        if(result && result){
            resolve(result)
        }else{
            resolve([])
        }
        }catch(e){
            logger.debug("===========err=======",e)
            resolve([]);
        }
    })
}
const getSupplierDistanceWiseMinOrder= (dbName,supplier_id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let sql = "select * from supplier_min_order_distance where supplier_id=?"
        let params = [supplier_id]
        let result = await ExecuteQ.Query(dbName,sql,params);
        if(result && result){
            resolve(result)
        }else{
            resolve([])
        }
        }catch(e){
            logger.debug("===========err=======",e)
            resolve([])
        }
    })
}

const getOrderTypeWisePaymentGateways= (dbName,supplier_id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let sql = "select * from order_type_wise_payment_gateways	 where supplier_id=?"
        let params = [supplier_id]
        let result = await ExecuteQ.Query(dbName,sql,params);
        if(result && result){
            resolve(result)
        }else{
            resolve([])
        }
        }catch(e){
            logger.debug("===========err=======",e)
            resolve([])
        }
    })
}

const getSupplierWeightWiseDeliveryCharge= (dbName,supplier_id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let sql = "select * from weight_wise_delivery_charge where supplier_id=?"
        let params = [supplier_id]
        let result = await ExecuteQ.Query(dbName,sql,params);
        if(result && result){
            resolve(result)
        }else{
            resolve([])
        }
        }catch(e){
            logger.debug("===========err=======",e)
            resolve([])
        }
    })
}



const checkUserZone = (dbName,latitude,longitude)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let sql = "select st_contains(coordinates,point(?,?)) as is_under,name,id,is_live,coordinates from 	admin_geofence_areas where is_live=1 ";
            sql += " having is_under>0"
        let params = [latitude,longitude    ]
        let result = await ExecuteQ.Query(dbName,sql,params);
        if(result && result){
            resolve(result)
        }else{
            resolve([])
        }
        }catch(e){
            logger.debug("===========err=======",e)
            reject(e);
        }
    })
}



const getSupplierDeliveryCompanies = (dbName,supplier_ids)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            
            let sql = `select dc.*,sadc.supplier_id from supplier_assigned_delivery_companies
            sadc 
            join delivery_companies dc on dc.id = sadc.delivery_company_id
            where supplier_id  IN(${supplier_ids.join(",")})`
        let params = []
        let result = await ExecuteQ.Query(dbName,sql,[]);
        if(result && result){
            resolve(result)
        }else{
            resolve([])
        }
        }catch(e){
            logger.debug("===========err=======",e)
            resolve([])
        }
    })
}
const getSupplierDeliveryTypes= (dbName,supplier_id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let sql = "select * from supplier_delivery_types where supplier_id=?"
        let params = [supplier_id]
        let result = await ExecuteQ.Query(dbName,sql,params);
        if(result && result){
            resolve(result)
        }else{
            resolve([])
        }
        }catch(e){
            logger.debug("===========err=======",e)
            resolve([])
        }
    })
}
const checkLocationPaymentGateway= (dbName,latitude,longitude)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let sql = "select st_contains(coordinates,point(?,?)) as is_under,payment_gateways from area ";
            sql += " having is_under>0"
        let params = [latitude,longitude    ]
        let result = await ExecuteQ.Query(dbName,sql,params);
        if(result && result){
            resolve(result)
        }else{
            resolve([])
        }
        }catch(e){
            logger.debug("===========err=======",e)
            reject(e);
        }
    })
}

const getTerminologyByCategory=(dbName,id)=>{
    logger.debug("======REQUES")
return new Promise(async  (resolve,reject)=>{
    let sql="select `terminology`,`type` from categories where `id`=?"
    // multiConnection[dbName].e
    let data=await ExecuteQ.Query(dbName,sql,[id])
    logger.debug("==CATE==TERMIN=DAta==>>",data);
    if(data && data.length>0){  
        if(data[0].terminology!=null && data[0].terminology!="" && data[0].terminology!=undefined){
            let terminology= JSON.parse(data[0].terminology);
            // logger.debug("=========TRM===>>",terminology);
            resolve(terminology)
        }
        else{
            let sql="select `value` from tbl_setting where `key`=?"
            // multiConnection[dbName].e
            let defaultTerminology=await ExecuteQ.Query(dbName,sql,["terminology"])
            // logger.debug("===DAta==>>",data);
            if(defaultTerminology && defaultTerminology.length>0){
                    let terminology= JSON.parse(defaultTerminology[0].value);
                    // logger.debug("=========TRM===>>",terminology);
                    resolve(terminology)
            }
            else{
                resolve({})
            }
        }
    }
    else{
        resolve({})
    }
})
}
const getShippingData=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        try{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=?";
        let data=await ExecuteQ.Query(dbName,sql,[config.get("server.shipping.api_key_name"),config.get("server.shipping.api_secret_key_name")])
        // multiConnection[dbName].query(sql,[config.get("server.shipping.api_key_name"),config.get("server.shipping.api_secret_key_name")],(err,data)=>{
        //     if(err){
        //         reject(err)
        //     }
        //     else{
                logger.debug("=======RAZOR SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
        //     }
        // })
            }
            catch(Err){
                reject(Err)
            }
    })
}
const getShippingOrderDetail=(shippingData,orderId)=>{
    return new Promise((resolve,reject)=>{
        var options = {
            'method': 'GET',
            'url': 'https://ssapi.shipstation.com/orders?orderNumber='+orderId,
            'headers': {
                'Host': 'ssapi.shipstation.com',
                'Authorization': 'Basic '+Buffer.from(shippingData.api_key + ":" + shippingData.api_secret).toString('base64')
            }
        };
        request(options, function (error, response) { 
            logger.debug("===Body!==",error,response.body);
            if (!error) {
                if(response.body=="Too Many Request"){
                    resolve([])
                }else{
                    var data=response.body && response.body!=undefined?JSON.parse(response.body):response.body
                    resolve(data.orders)
                }
            } else {
                logger.debug("===Else Body!==");
                resolve([])
            }
        });
    })
}
const addOrderInShipStation=(shippingData,orderData)=>{
    logger.debug("===SHIp=ORD=DATA==",orderData);
    return new Promise((resolve,reject)=>{
            var options = {
                'method': 'POST',
                'url': 'https://ssapi.shipstation.com/orders/createorder',
                'headers': {
                    'Host': 'ssapi.shipstation.com',
                    'Authorization': 'Basic '+Buffer.from(shippingData.api_key + ":" + shippingData.api_secret).toString('base64'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            };
            request(options, function (error, response) { 
                logger.debug("===Body!==",error,response.body);
                    resolve()
            });
    })
}
const getCyberSourceData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=?";
        multiConnection[dbName].query(sql,[
        config.get("payment.cybersource.cybersource_merchant_secret_key"),
        config.get("payment.cybersource.cybersource_merchant_id"),
        config.get("payment.cybersource.cybersource_merchant_key_id")

    ],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                logger.debug("=======RAZOR SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
const getDecryptData=(text)=>{
    console.log("====INput For Encrype==>>",text,algorithm,crypto_password)
    return new Promise(async (resolve,reject)=>{
        try{
        var decipher = crypto.createDecipher(algorithm,crypto_password)
        var password = decipher.update(text,'hex','utf8')
        password += decipher.final('utf8'); 
        resolve(password)
        }
        catch(Err){
            logger.debug("=Err!=>>",Err)
            resolve(password)
        }
    })
}
const getPayTabData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=?";
        multiConnection[dbName].query(sql,[
        config.get("payment.paytab.paytab_secret_key"),
        config.get("payment.paytab.paytab_merchant_id"),
        config.get("payment.paytab.paytab_merchant_email")
    ],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                logger.debug("=======RAZOR SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
const oneClickData=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=?";
        multiConnection[dbName].query(sql,[config.get("server.1click2deliver.api_secret_key_name")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                logger.debug("=======RAZOR SETTING DATA========",data)
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
const getGiftPurchasedTemplate=(languageId,templateData)=>{
    return new Promise((resolve,reject)=>{
        if(parseInt(languageId)==14){
           let template= `<head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="x-apple-disable-message-reformatting">
            <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
            <title></title>
            <style>
                html,
                body {
                    margin: 0 auto !important;
                    letter-spacing: 0.5px;
                    padding: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                    font-family: ClanPro-Book, HelveticaNeue-Light, Helvetica Neue Light, Helvetica, Arial, sans-serif;
                }
        
                * {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }
        
                div[style*="margin: 16px 0"] {
                    margin: 0 !important;
                }
        
                table,
                td {
                    mso-table-lspace: 0pt !important;
                    mso-table-rspace: 0pt !important;
                }
        
                table {
                    border-spacing: 0 !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                    margin: 0 auto !important;
                }
        
                table table table {
                    table-layout: auto;
                }
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                [x-apple-data-detectors],
                .x-gmail-data-detectors,
                .x-gmail-data-detectors *,
                .aBn {
                    border-bottom: 0 !important;
                    cursor: default !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
        
                .a6S {
                    display: none !important;
                    opacity: 0.01 !important;
                }
        
                img.g-img div {
                    display: none !important;
                }
        
                .button-link {
                    text-decoration: none !important;
                }
        
                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                    / iPhone 6 and 6 / .email-container {
                        min-width: 375px !important;
                    }
                }
            </style>
            <style>
                .button-td,
                .button-a {
                    transition: all 100ms ease-in;
                }
        
                / Media Queries / @media screen and (max-width: 600px) {
                    / What it does: Adjust typography on small screens to improve readability */.email-container p {
                        font-size: 17px !important;
                        line-height: 22px !important;
                    }
        
                    .email-container {
                        padding: 10px 10px !important;
                    }
                }
            </style>
        </head>
        
        <body width="100%" bgcolor="#edf2f7" style="margin: 0; mso-line-height-rule: exactly;">
            <center style="width: 100%;     background-color: #edf2f7; text-align: left;">
                <div style="max-width: 600px; margin: auto; padding: 50px 10px;" class="email-container">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
                        style="max-width: 600px; box-shadow: 0px 5px 30px rgba(29, 43, 56, 0.21);">
                        <tbody>
                            <tr>
                                <td bgcolor="#ffffff">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td
                                                    style="font-size: 17px; line-height: 20px; color: #555555;text-align: left;padding:20px 20px 40px; background: `+templateData.titleBgColor+`;">
                                                    <div style="width: 100%;text-align: left;padding: 20px 0px;">
                                                        <img src='`+templateData.logo_url+`' width="200"
                                                            height="" alt="alt_text" border="0" class="g-img">
                                                    </div>
                                                    <h2 style="color:#fff;font-size: 24px; margin-bottom: 10px;">Hi,`+templateData.name+`
                                                        </h2>
                                                    <p style="font-size: 14px;color:#fff;">As a thanks for your purchase, please
                                                        find below details of your gift.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="padding: 40px;">
                                                    <table
                                                        style="background: #fff; width: 500px; margin: 0 auto;border-radius: 6px;box-shadow: 0px 5px 3px rgba(29, 43, 56, 0.12);">
                                                        <tr>
                                                            <td colspan="2">
                                                                <div style="background: #000; padding: 20px;border-radius: 10px 10px 0px 0px;
                                                                text-align: center;">
                                                                    <h3 style="color:#fff;font-size: 43px;margin: 10px;">
                                                                        <strong>`+templateData.messageFlat+`</strong></h3>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2">
                                                                <div style="padding:40px 40px 0px;text-align: center;">
                                                                    <h3 style="margin-top: 0px;
                                                                    font-size: 24px;
                                                                    margin-bottom: 10px;">`+templateData.messageFlat+`</h3>
                                                                    <p>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                    `+templateData.business_name+`. Click to get an started.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2">
                                                                <div style="padding: 40px 40px 0px;text-align: center;">
                                                                    <h6 style="font-size: 18px;
                                                                    margin-top: 0px;
                                                                    text-transform: uppercase;    margin-bottom: 10px;">Gift
                                                                        Name</h6>
                                                                    <h1 style="text-transform: uppercase; font-size: 25px;letter-spacing: 7px;    border: 1px dashed #ddd;
                                                                        padding: 15px;
                                                                        border-radius: 8px;
                                                                        width: 250px;
                                                                        margin: 0 auto;">
                                                                        `+templateData.gift_name+`</h1>
        
                                                                    <ul style="text-align: left;
                                                                    line-height: 24px;
                                                                    font-size: 14px;">
                                                                        <li>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                            `+templateData.business_name+`. Click to get an started.</li>
                                                                        <li>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                        `+templateData.business_name+`.</li>
                                                                        <li>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                        `+templateData.business_name+`. Click to get an started.</li>
                                                                        <li>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                        `+templateData.business_name+`.</li>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div style="padding: 40px;">
                                                                    <a style="color: #000;" href=""><i class="fa fa-download"
                                                                            aria-hidden="true"></i></a>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div style="padding: 40px;text-align: right;">
                                                                    <a style="color: #000;" href=""><i
                                                                            class="fa fa-share-square"
                                                                            aria-hidden="true"></i></a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                </div>
            </center>
        </body>
        </html>`
        resolve(template)
        }
        else{
            let template= `<head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="x-apple-disable-message-reformatting">
            <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
            <title></title>
            <style>
                html,
                body {
                    margin: 0 auto !important;
                    letter-spacing: 0.5px;
                    padding: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                    font-family: ClanPro-Book, HelveticaNeue-Light, Helvetica Neue Light, Helvetica, Arial, sans-serif;
                }
        
                * {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }
        
                div[style*="margin: 16px 0"] {
                    margin: 0 !important;
                }
        
                table,
                td {
                    mso-table-lspace: 0pt !important;
                    mso-table-rspace: 0pt !important;
                }
        
                table {
                    border-spacing: 0 !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                    margin: 0 auto !important;
                }
        
                table table table {
                    table-layout: auto;
                }
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                [x-apple-data-detectors],
                .x-gmail-data-detectors,
                .x-gmail-data-detectors *,
                .aBn {
                    border-bottom: 0 !important;
                    cursor: default !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
        
                .a6S {
                    display: none !important;
                    opacity: 0.01 !important;
                }
        
                img.g-img div {
                    display: none !important;
                }
        
                .button-link {
                    text-decoration: none !important;
                }
        
                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                    / iPhone 6 and 6 / .email-container {
                        min-width: 375px !important;
                    }
                }
            </style>
            <style>
                .button-td,
                .button-a {
                    transition: all 100ms ease-in;
                }
        
                / Media Queries / @media screen and (max-width: 600px) {
                    / What it does: Adjust typography on small screens to improve readability */.email-container p {
                        font-size: 17px !important;
                        line-height: 22px !important;
                    }
        
                    .email-container {
                        padding: 10px 10px !important;
                    }
                }
            </style>
        </head>
        
        <body width="100%" bgcolor="#edf2f7" style="margin: 0; mso-line-height-rule: exactly;">
            <center style="width: 100%;     background-color: #edf2f7; text-align: left;">
                <div style="max-width: 600px; margin: auto; padding: 50px 10px;" class="email-container">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
                        style="max-width: 600px; box-shadow: 0px 5px 30px rgba(29, 43, 56, 0.21);">
                        <tbody>
                            <tr>
                                <td bgcolor="#ffffff">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td
                                                    style="font-size: 17px; line-height: 20px; color: #555555;text-align: left;padding:20px 20px 40px; background: #ef6937;">
                                                    <div style="width: 100%;text-align: left;padding: 20px 0px;">
                                                        <img src="https://cdn-assets.royoapps.com/1587486364549_AFOC_Transitional_Logo-02.png" width="200"
                                                            height="" alt="alt_text" border="0" class="g-img">
                                                    </div>
                                                    <h2 style="color:#fff;font-size: 24px; margin-bottom: 10px;">Hi,`+userData[0].name+`
                                                        </h2>
                                                    <p style="font-size: 14px;color:#fff;">As a thanks for your purchase, please
                                                        find below details of your coupon.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div style="padding: 40px;">
                                                    <table
                                                        style="background: #fff; width: 500px; margin: 0 auto;border-radius: 6px;box-shadow: 0px 5px 3px rgba(29, 43, 56, 0.12);">
                                                        <tr>
                                                            <td colspan="2">
                                                                <div style="background: #000; padding: 20px;border-radius: 10px 10px 0px 0px;
                                                                text-align: center;">
                                                                    <h3 style="color:#fff;font-size: 43px;margin: 10px;">
                                                                        <strong>`+templateData.messageFlat+`</strong></h3>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2">
                                                                <div style="padding:40px 40px 0px;text-align: center;">
                                                                <h3 style="margin-top: 0px;
                                                                font-size: 24px;
                                                                margin-bottom: 10px;">`+templateData.messageFlat+`</h3>
                                                                    <p>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                    `+templateData.business_name+`. Click to get an started.</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2">
                                                                <div style="padding: 40px 40px 0px;text-align: center;">
                                                                    <h6 style="font-size: 18px;
                                                                    margin-top: 0px;
                                                                    text-transform: uppercase;    margin-bottom: 10px;">Coupon
                                                                        Code</h6>
                                                                    <h1 style="text-transform: uppercase; font-size: 25px;letter-spacing: 7px;    border: 1px dashed #ddd;
                                                                        padding: 15px;
                                                                        border-radius: 8px;
                                                                        width: 250px;
                                                                        margin: 0 auto;">
                                                                        `+templateData.gift_name+`</h1>
        
                                                                    <ul style="text-align: left;
                                                                    line-height: 24px;
                                                                    font-size: 14px;">
                                                                        <li>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                            `+templateData.business_name+`. Click to get an started.</li>
                                                                        <li>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                        `+templateData.business_name+`.</li>
                                                                        <li>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                        `+templateData.business_name+`. Click to get an started.</li>
                                                                        <li>Act now and save up to `+templateData.messageFlat+` when you a book early at
                                                                        `+templateData.business_name+`.</li>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div style="padding: 40px;">
                                                                    <a style="color: #000;" href=""><i class="fa fa-download"
                                                                            aria-hidden="true"></i>Download</a>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div style="padding: 40px;text-align: right;">
                                                                    <a style="color: #000;" href=""><i
                                                                            class="fa fa-share-square"
                                                                            aria-hidden="true"></i>Share</a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                </div>
            </center>
        </body>
        </html>`
        resolve(template)
        }
    })
    
}
const validationHeaderColumn=(row,serviceType)=>{
    logger.debug("======columnDATaTitle===>>",row)
    return new Promise((resolve,reject)=>{
        let isValid=true;
        switch(parseInt(serviceType)){
            case 1:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    // else if(row[5]!="is_product"){
                    //     isValid=false
                    // }
                    break;
            case 2:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    // else if(row[5]!="is_product"){
                    //     isValid=false
                    // }
                    break;
    }
    logger.debug("====isValid=>>",isValid)
    resolve(isValid)
    })
}

const validationHeaderCategoryVariantColumns=(row,serviceType)=>{
    logger.debug("======columnDATaTitle===>>",row)
    return new Promise((resolve,reject)=>{
        let isValid=true;
        if (row[0]!="variantName") {
            isValid=false
        }else if(row[1]!="variantNameOl"){
            isValid=false
        }
        else if(row[1]!="variantValue"){
            isValid=false
        }
    logger.debug("====isValid=>>",isValid)
    resolve(isValid)
    })
}

const getModifiedCategoryVariantData=(dataRows)=>{
    let variantArray=[],variantJson={};
            return new Promise(async (resolve,reject)=>{
            for(const [index,i] of dataRows.entries()){
                variantJson["variantName"]=i[0]
                variantJson["variantNameOl"]=i[1]
                variantJson["variantValue"]=i[2]
                variantArray.push(variantJson)
                variantJson={}
            }
            resolve(variantArray)
        })
      
}

const validationHeaderColumnWithCategory=(row,serviceType)=>{
    logger.debug("======columnDATaTitle===>>",row)
    return new Promise((resolve,reject)=>{
        let isValid=true;
        switch(parseInt(serviceType)){
            case 1:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    // else if(row[5]!="is_product"){
                    //     isValid=false
                    // }
                    break;
            case 2:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    // else if(row[5]!="is_product"){
                    //     isValid=false
                    // }
                    break;
            default:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    // else if(row[5]!="is_product"){
                    //     isValid=false
                    // }
                    break;
    }
    logger.debug("====isValid=>>",isValid)
    resolve(isValid)
    })
}
const validationHeaderColumnNew=(row,serviceType)=>{
    logger.debug("======columnDATaTitle===>>",row)
    return new Promise((resolve,reject)=>{
        let isValid=true;
        switch(parseInt(serviceType)){
            case 1:
                    if (row[0]!="productName") {
                        isValid=false
                    }
                    else if(row[1]!="productNameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="productDesc"){
                        isValid=false
                    }
                    else if(row[3]!="productDescInOl"){
                        isValid=false
                    }
                    else if(row[4]!="productQuantity"){
                        isValid=false
                    }
                    else if(row[5]!="productImage"){
                        isValid=false
                    }
                    else if(row[6]!="productPrice"){
                        isValid=false
                    }
                    else if(row[7]!="handlingAdmin"){
                        isValid=false
                    }
                    else if(row[8]!="discount"){
                        isValid=false
                    }
                    else if(row[9]!="priceValidFrom"){
                        isValid=false
                    }
                    else if(row[10]!="priceValidTo"){
                        isValid=false
                    }
                    else if(row[11]!="customizationName"){
                        isValid=false
                    }
                    else if(row[12]!="isCustMandatory"){
                        isValid=false
                    }
                    else if(row[13]!="isMultipleCust"){
                        isValid=false
                    }
                    else if(row[14]!="minCustSelection"){
                        isValid=false
                    }
                    else if(row[15]!="maxCustSelection"){
                        isValid=false
                    }
                    else if(row[16]!="CustomizationTypesName"){
                        isValid=false
                    }
                    else if(row[17]!="CustomizationTypesPrice"){
                        isValid=false
                    }
                    else if(row[18]!="CustomizationTypesDefault"){
                        isValid=false
                    }
                    else if(row[19]!="custTypeQuantity"){
                        isValid=false
                    }
                    // else if(row[5]!="is_product"){
                    //     isValid=false
                    // }
                    break;
            case 2:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    // else if(row[5]!="is_product"){
                    //     isValid=false
                    // }
                    break;
    }
    logger.debug("====isValid=>>",isValid)
    resolve(isValid)
    })
}
const validationSupplierHeaderColumn=(row,serviceType)=>{
    logger.debug("======columnDATaTitle===>>",row)
    return new Promise((resolve,reject)=>{
        let isValid=true;
        switch(parseInt(serviceType)){
            case 1:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    else if(row[6]!="price"){
                        isValid=false
                    }
                    else if(row[7]!="handlingFee"){
                        isValid=false
                    }
                    else if(row[8]!="discountInPercentage"){
                        isValid=false
                    }
                    else if(row[9]!="priceValidFromDate"){
                        isValid=false
                    }
                    else if(row[10]!="priceValidToDate"){
                        isValid=false
                    }
                    break;
            case 2:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    else if(row[6]!="price"){
                        isValid=false
                    }
                    else if(row[7]!="handlingFee"){
                        isValid=false
                    }
                    else if(row[8]!="discountInPercentage"){
                        isValid=false
                    }
                    else if(row[9]!="priceValidFromDate"){
                        isValid=false
                    }
                    else if(row[10]!="priceValidToDate"){
                        isValid=false
                    }
                    break;
    }
    logger.debug("====isValid=>>",isValid)
    resolve(isValid)
    })
}

const validationSupplierHeaderColumnForVariants=(row,serviceType)=>{
    logger.debug("======columnDATaTitle===>>",row)
    return new Promise((resolve,reject)=>{
        let isValid=true;
        switch(parseInt(serviceType)){
            case 1:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    else if(row[6]!="price"){
                        isValid=false
                    }
                    else if(row[7]!="handlingFee"){
                        isValid=false
                    }
                    else if(row[8]!="discountInPercentage"){
                        isValid=false
                    }
                    else if(row[9]!="priceValidFromDate"){
                        isValid=false
                    }
                    else if(row[10]!="priceValidToDate"){
                        isValid=false
                    }
                    break;
            case 2:
                    if (row[0]!="name") {
                        isValid=false
                    }
                    else if(row[1]!="nameInOl"){
                        isValid=false
                    }
                    else if(row[2]!="description"){
                        isValid=false
                    }
                    else if(row[3]!="descriptionInOl"){
                        isValid=false
                    }
                    else if(row[4]!="quantity"){
                        isValid=false
                    }
                    else if(row[5]!="image"){
                        isValid=false
                    }
                    else if(row[6]!="price"){
                        isValid=false
                    }
                    else if(row[7]!="handlingFee"){
                        isValid=false
                    }
                    else if(row[8]!="discountInPercentage"){
                        isValid=false
                    }
                    else if(row[9]!="priceValidFromDate"){
                        isValid=false
                    }
                    else if(row[10]!="priceValidToDate"){
                        isValid=false
                    }
                    else if(row[11]!="variantKeyName"){
                        isValid=false;
                    }
                    else if(row[12]!="variantKeyValue"){
                        isValid=false;
                    }
                    else if(row[13]!="variantKeyName"){
                        isValid=false;
                    }
                    else if(row[14]!="variantKeyValue"){
                        isValid=false;
                    }
                    else if(row[15]!="variantKeyName"){
                        isValid=false;
                    }
                    else if(row[16]!="variantKeyValue"){
                        isValid=false;
                    }
                    else if(row[17]!="imageTwo"){
                        isValid=false;
                    }
                    else if(row[18]!="imageThree"){
                        isValid=false;
                    }
                    else if(row[19]!="ImageFour"){
                        isValid=false;
                    }
                    else if(row[20]!="videoUrl"){
                        isValid=false;
                    }
                    break;
    }
    logger.debug("====isValid=>>",isValid)
    resolve(isValid)
    })
}
const refundStripePayment=(card_payment_id,amount,dbName)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let strip_secret_key_data = await getStripSecretKey(dbName);
            logger.debug("====STRIP=DATA==>>", Math.round(parseFloat(amount * 100)))
            const stripe = require('stripe')(strip_secret_key_data[0].value);  
            stripe.refunds.create(
                {
                     charge: card_payment_id,
                     amount : Math.round(parseFloat(amount*100))
             },
                function (err, refund) {
                    if (err) {
                        logger.debug("=============err===========1==",err)
                       reject(err);
                    }else{
                        logger.debug("===========refund ===========",refund)
                        resolve();
                    }
                }
            );
        }catch(err){
            logger.debug("==========err===",err);
            reject(err)
        }
    })
}
const copyAddsOnExistingPoduct=(dbName,oldProductIds,newProductIds)=>{
    return new Promise(async (resolve,reject)=>{
                    try{
                        logger.debug("==cpAddsOn==oldProductIds,newProductIds===",oldProductIds,newProductIds)
                        if(oldProductIds && oldProductIds.length>0){
                                for(const [index,i] of oldProductIds.entries()){
                                    if(newProductIds && newProductIds.length>0){

                                        // for(const [index1,j] of newProductIds.entries()){

                                            let addsOnData=await ExecuteQ.Query(dbName,`select id,name,is_multiple,min_adds_on,addon_limit,max_adds_on,is_mandatory
                                            from product_adds_on where product_id=?`,[i])
                                            logger.debug("=addsOnData====",addsOnData)
                                            if(addsOnData && addsOnData.length>0){
                                                for(const [index3,k] of addsOnData.entries()){
                                                   let addsOnDataIn= await ExecuteQ.Query(dbName,`insert into product_adds_on(name,is_multiple,min_adds_on,addon_limit,max_adds_on,
                                                        is_mandatory,product_id) values(?,?,?,?,?,?,?)`,
                                                        [k.name,k.is_multiple,k.min_adds_on,k.addon_limit,k.max_adds_on,k.is_mandatory,newProductIds[index]]);

                                                    let addssOnType=await ExecuteQ.Query(dbName,`insert into product_adds_on_type(name,price,is_default,quantity,adds_on_id) select 
                                                    pat.name,pat.price,pat.is_default,pat.quantity,${addsOnDataIn.insertId}
                                                    from product_adds_on_type pat where pat.adds_on_id=?`,[k.id])
                                                }
                                            }
                                            // let addsOnData=await ExecuteQ.Query(dbName,`insert into product_adds_on(name,is_multiple,min_adds_on,addon_limit,max_adds_on,
                                            //     is_mandatory,product_id)`,[i]);
                                    // }
                                    }
                                }
                                resolve()
                        }
                        else{
                            resolve()
                        }
                    }
                    catch(Err){
                        logger.debug("=====Adds==ON==Err!==>>",Err)
                        resolve()
                    }
        })

}
function categoriesWithMlName(categories,categoryMl){
    return new Promise((resolve,reject)=>{
        var category = [];
        var categoryLength = categories.length;
        var categoryMllength = categoryMl.length;
    
        for (var i = 0; i < categoryLength; i++) {
            (function (i) {
                var categoriesMl = [];
                for (var j = 0; j < categoryMllength; j++) {
                    (function (j) {
                        if (categories[i].id == categoryMl[j].category_id) {
                            categoriesMl.push({
                                "id": categoryMl[j].id,
                                "name": categoryMl[j].name,
                                "language_id": categoryMl[j].language_id,
                                "language_name": categoryMl[j].language_name,
                                "description": categoryMl[j].description
                            });
                            if (j == categoryMllength - 1 ) {
                                category.push({
                                    "category_id": categories[i].id,
                                    "is_sub_category": categories[i].is_sub_category,
                                    "image": categories[i].image,
                                    "is_product":categories[i].is_product,
                                    "is_question":categories[i].is_question,
                                    "icon": categories[i].icon,
                                    "illustration": categories[i].illustration,
                                    "is_live": categories[i].is_live,
                                    "is_variant": categories[i].is_variant,
                                    "category_flow": categories[i].category_flow,
                                    "is_agent": categories[i].is_agent,
                                    "agent_list": categories[i].agent_list,
                                    "payment_after_confirmation": categories[i].payment_after_confirmation,
                                    "is_quantity": categories[i].is_quantity,
                                    "type": categories[i].type,
                                    "start_time":categories[i].start_time,
                                    "end_time":categories[i].end_time,
                                    "tax":categories[i].tax,
                                    "terminology":categories[i].terminology,
                                    "menu_type":categories[i].menu_type,
                                    "category_name": categoriesMl
                                });
                                if (i == categoryLength - 1) {
                                    // logger.debug("=============categorycategorycategory====1===",category.length)
                                    resolve(category);
                                }
                            }
    
                        }
                        else {
                            // console.log("=============",categoriesMl.length)
                            if (j == categoryMllength - 1 ) {
                                category.push({
                                    "category_id": categories[i].id,
                                    "is_sub_category": categories[i].is_sub_category,
                                    "image": categories[i].image,
                                    "is_product":categories[i].is_product,
                                    "is_question":categories[i].is_question,
                                    "icon": categories[i].icon,
                                    "illustration": categories[i].illustration,
                                    "is_live": categories[i].is_live,
                                    "category_name": categoriesMl,
                                    "is_variant": categories[i].is_variant,
                                    "category_flow": categories[i].category_flow,
                                    "is_agent": categories[i].is_agent,
                                    "agent_list": categories[i].agent_list,
                                    "is_quantity": categories[i].is_quantity,
                                    "start_time":categories[i].start_time,
                                    "end_time":categories[i].end_time,
                                    "payment_after_confirmation": categories[i].payment_after_confirmation,
                                    "tax":categories[i].tax,
                                    "terminology":categories[i].terminology,
                                    "menu_type":categories[i].menu_type,
                                    "type": categories[i].type
                                });
                                if (i == categoryLength - 1) {
                                    // logger.debug("=============categorycategorycategory====2===",category.length)
                                    resolve(category);
                                }
                            }
                        }
    
                    }(j))
                }
    
    
            }(i))
    
        }
    })
}
const getDhlKeyData=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        logger.debug("====DBNAME==>>",dbName);
        try{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=?";
        let dhlData=await ExecuteQ.Query(dbName,sql,[config.get("server.dhl.dhl_site_key"),
        config.get("server.dhl.dhl_password"),config.get("server.dhl.dhl_account_number")]);
            logger.debug("=======RAZOR SETTING DATA========",dhlData)
            if(dhlData && dhlData.length>0){
                for(const [index,i] of dhlData.entries()){
                        key_object[i.key]=i.value;
                }
                resolve(key_object)
            }
            else{
                resolve({})
            }
        }
        catch(Err){
            logger.debug("=====ERR!==>>",Err);
            resolve({})
        }
    })
}


const nthLevelCategoryQueryString=(dbName,parentId,data,supplierId)=>{
    // logger.debug("=====DATA!=",parentId,data)
    let nthleveData=data;
    let returnJson,insertedValues=[],insertLength="(?,?,?,?),",querystring='';
    return new Promise((resolve,reject)=>{
        for (const j of data) {
                if(j.data && j.data.length>0){
                    returnJson= makingSupplierQuery(dbName,parentId,0,nthleveData,supplierId); 
                    logger.debug("====nthLevel==returnJson==>>",returnJson);
                    insertedValues=returnJson.values;
                    querystring=returnJson.querystring;
                }
                else{
                    logger.debug("===Upto=2nd=Level==>>>",parentId,j);
                    querystring+=insertLength;
                    querystring+=insertLength;
                    insertedValues.push(supplierId,parentId,j.id,0);
                    insertedValues.push(supplierId,parentId,0,0);
                }
        }
        logger.debug("====AFTER-LOOP=>>>",querystring);
        resolve({insertedValues:insertedValues,querystring:querystring});
    })
}
function makingSupplierQuery(dbName,parentId,id, data,supplierId) {
    async function getNestedChildren(dbName,parentId,id, data,supplierId) {
        for(const [inedx,i] of data.entries()) {
            // logger.debug("===arr[i].data=",parentId,i.data)
            if(i.data && i.data.length>0) {
                logger.debug("=====inex=call=>>",inedx,id,data);
                getNestedChildren(dbName,parentId,i.id, i.data,supplierId);
            }
            else{
                logger.debug("====3rd Level",parentId,id,data)
            }
        }
        if(id!==0){
           
            if(data[0].data.length<=0){
                for(const [ind,j] of data.entries()){
                    values.push(supplierId,parentId,id,j.id);
                    querystring+=insertLength;
                }
                // values.push(supplierId,parentId,id,data[0].id);
            }
            else{
                querystring+=insertLength;
                values.push(supplierId,parentId,id,0);
            }
            logger.debug("===arr[i].data===",values,querystring);
        }
    }
    var values = [],insertLength="(?,?,?,?),",querystring='';
    getNestedChildren(dbName,parentId,id, data,supplierId);
    return {values:values,querystring:querystring};
}
/**
 * @description used for getting an all sub categories ids upto nth level of parent categories
 * @param {*Array} subData 
 * @param {*} parentId 
 */
const getNestedChildrenIds=(subData, parentId)=>{
    async function getNestedChildreK(subData, parentId){
    for([inedx,i] of subData.entries()) {
        if(i.parent_id == parentId) {
            logger.debug("=====",i.id)
            outIds.push(i.id)
            getNestedChildreK(subData, i.id);
        }
    }
}
var outIds = [];
getNestedChildreK(subData,parentId);
return outIds;
}
const getModifiedProdutData=(dataRows)=>{
    let productArray=[],productJson={};
    return new Promise(async (resolve,reject)=>{
    for(const [index,i] of dataRows.entries()){
        productJson["productName"]=i[0]
        productJson["productNameInOl"]=i[1]
        productJson["productDesc"]=i[2]
        productJson["productDescInOl"]=i[3]
        productJson["productQuantity"]=i[4]
        productJson["productImage"]=i[5]
        productJson["productPrice"]=i[6]
        productJson["handlingAdmin"]=i[7]
        productJson["discount"]=i[8];
        productJson["priceValidFrom"]=i[9];
        productJson["priceValidTo"]=i[10];
        productJson["customizationName"]=i[11];
        productJson["isCustMandatory"]=i[12];
        productJson["isMultipleCust"]=i[13];
        productJson["minCustSelection"]=i[14];
        productJson["maxCustSelection"]=i[15];
        productJson["custTypeName"]=i[16];
        productJson["custTypePrice"]=i[17];
        productJson["custTypeIsDefault"]=i[18];
        productJson["custTypeQuantity"]=i[19];
        productArray.push(productJson)
        productJson={}
    }
    resolve(productArray)
})
}
const getModifiedProdutDataForVariants=(dataRows)=>{
    let productArray=[],productJson={};
    return new Promise(async (resolve,reject)=>{
    for(const [index,i] of dataRows.entries()){
        productJson["productName"]=i[0]
        productJson["productNameInOl"]=i[1]
        productJson["productDesc"]=i[2]
        productJson["productDescInOl"]=i[3]
        productJson["productQuantity"]=i[4]
        productJson["productImage"]=i[5]
        productJson["productPrice"]=i[6]
        productJson["handlingAdmin"]=i[7]
        productJson["discount"]=i[8];
        productJson["priceValidFrom"]=i[9];
        productJson["priceValidTo"]=i[10];
        productJson["variantKeyNameOne"]=i[11];
        productJson["variantKeyValueOne"]=i[12];
        productJson["variantKeyNameTwo"]=i[13];
        productJson["variantKeyValueTwo"]=i[14];
        productJson["variantKeyNameThird"]=i[15];
        productJson["variantKeyValueThird"]=i[16];
        productJson["imageTwo"]=i[17];
        productJson["imageThree"]=i[18];
        productJson["ImageFour"]=i[19];
        productJson["videoUrl"]=i[20];
        productArray.push(productJson)
        productJson={}
        // variantKeyName      variantKeyValue
    }
    resolve(productArray)
})
}

const validateVariantKeyValue = (dbName,
    variantKeyNameOne,variantKeyValueOne,
    variantKeyNameTwo,variantKeyValueTwo,
    variantKeyNameThird,variantKeyValueThird,
    category_id,res)=>{
        let variantData = [
            {variantKeyName:variantKeyNameOne,variantKeyValue:variantKeyValueOne},
            {variantKeyName:variantKeyNameTwo,variantKeyValue:variantKeyValueTwo},
            {variantKeyName:variantKeyNameThird,variantKeyValue:variantKeyValueThird},

        ]
    return new Promise(async(resolve,reject)=>{
        for(const [index,i] of variantData.entries()){
            if(i.variantKeyName!=="" && i.variantKeyValue!==""){
                let result = await ExecuteQ.Query(dbName,
                    "select id from cat_variants where cat_id=? and name=?",
                    [category_id,i.variantKeyName])
                if(result && result.length>0){
                    let result2 = await ExecuteQ.Query(dbName,
                        "select id from variants where cat_variant_id=? and value=?",
                        [result[0].id,i.variantKeyValue]);
                    if(!(result2 && result2.length>0)){
                        let msg = "variant value "+i.variantKeyValue+" doesn't match"
                        return sendResponse.sendErrorMessage(msg,res,400); 
                    }
                }else{
                    let msg = "variant key "+i.variantKeyName+" or category id doesn't match"
                    return sendResponse.sendErrorMessage(msg,res,400);
                }
            }
        }
        resolve();
    })
}

const addVariantsProductsIds = (dbName,variantData,
    category_id,res,product_id,parent_id)=>{
    return new Promise(async(resolve,reject)=>{
        for(const [index,i] of variantData.entries()){
            if(i.variantKeyName!=="" && i.variantKeyValue!==""){
                let result = await ExecuteQ.Query(dbName,
                    "select id from cat_variants where cat_id=? and name=?",
                    [category_id,i.variantKeyName])
                if(result && result.length>0){
                    let result2 = await ExecuteQ.Query(dbName,
                        "select id from variants where cat_variant_id=? and value=?",
                        [result[0].id,i.variantKeyValue]);
                    if(result2 && result2.length>0){
                        let query = "insert into product_variants(product_id,parent_id,variant_id) values(?,?,?)";
                        await ExecuteQ.Query(dbName,query,[product_id,parent_id,result2[0].id])
                    }
                }
            }
        }
        resolve();
    })
}

const getMainCategoryId = (dbName,subCatId)=>{
    return new Promise(async(resolve,reject)=>{
        let query = "select parent_id from  categories where id=? and parent_id!=0"
        let params = [subCatId]
        let result = await ExecuteQ.Query(dbName,query,params);
        if(result && result.length>0){
            getMainCategoryId(dbName,result[0].parent_id);
        }else{
            resolve(subCatId);
        }
    })
}

const getModifiedProdutDataForCategories=(dataRows)=>{
    let productArray=[],productJson={};
            return new Promise(async (resolve,reject)=>{
            for(const [index,i] of dataRows.entries()){
                productJson["categories"]=i[0]
                productJson["categoriesInOl"]=i[1]
                productJson["catTaxInPercentage"]=i[2]
                productJson["categoriesDesc"]=i[3]
                productJson["categoriesDescInOl"]=i[4]
                productJson["productName"]=i[5]
                productJson["productNameInOl"]=i[6]
                productJson["productDesc"]=i[7]
                productJson["productDescInOl"]=i[8]
                productJson["productQuantity"]=i[9]
                productJson["productImage"]=i[10]
                productJson["customizationName"]=i[11];
                productJson["isCustMandatory"]=i[12];
                productJson["isMultipleCust"]=i[13];
                productJson["minCustSelection"]=i[14];
                productJson["maxCustSelection"]=i[15];
                productJson["custTypeName"]=i[16];
                productJson["custTypePrice"]=i[17];
                productJson["custTypeIsDefault"]=i[18];
                productJson["custTypeQuantity"]=i[19];
                productArray.push(productJson)
                productJson={}
            }
            resolve(productArray)
        })
      
}
const getMuthoFunData=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        let twilio_data={}
        try {
            let data = await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=? or `key`=?",
                [config.get("muthoFun.username"),config.get("muthoFun.password")]);
            logger.debug("=======Twilio==DaTA!======",data)
            if(data && data.length>0){
                for(const i of data){
                    logger.debug("=======I=Key=DATA!==",i.key,i.value)
                    twilio_data[i.key]=i.value
                }
                logger.debug("======Twiloi====",twilio_data)
                resolve(twilio_data);

            }
            else{
                 resolve(twilio_data)
            }

        }catch (e) {
            logger.debug("====Twilio===Err===>",e)
            resolve(twilio_data);
        }
    })
}

function parseTime(s) {
    var c = s.split(':');
    return parseInt(c[0]) * 60 + parseInt(c[1]);
}

function calculateTimeslot(start_time, end_time, interval){
    var i, formatted_time;
    var time_slots = new Array();
    for(var i=start_time; i<=end_time; i = i+interval){
      formatted_time = convertHours(i);
      time_slots.push(formatted_time);
  }
  return time_slots;
}
function convertHours(mins){
    var hour = Math.floor(mins/60);
    var mins = mins%60;
    var converted = pad(hour, 2)+':'+pad(mins, 2)+':00';
    return converted;
}
function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}
const TimeSlots=(from_time,to_time,interval)=>{
    return new Promise((resolve,reject)=>{  
        var from_times=parseTime(from_time);
        var to_times=parseTime(to_time);
        var time_slots=calculateTimeslot(from_times,to_times,interval);
        logger.debug("========TIME==SLOTS==",time_slots);
        resolve(time_slots);
 })
}

/**
 * @description used for listing an Urls with XML format
 * @param {*Object} urls 
 */
const getExistingUrlsFromXml=(pathExmlFile,urls)=>{
    const convert = require('xml-js'),
    options = { compact: true, ignoreComment: true, spaces: 4 };
    return new Promise((resolve,reject)=>{
        fs.readFile(pathExmlFile, (err, data) => {
            if (data) { 
              const existingSitemapList = JSON.parse(convert.xml2json(data,    options));
              let newUrlS=existingSitemapList.urlset.url.push(
                urls
                );
            logger.debug("==existingSitemapList===>>",existingSitemapList,existingSitemapList.urlset.url[0])
            resolve(existingSitemapList);
            }
            else{
                resolve({})
            }
          });
    })
}
/**
 * @description used for writing an Urls with XML format
 * @param {*Object} urls 
 */
const writeNewUrlsInXml=(pathExmlFile,finalXML)=>{
    return new Promise((resolve,reject)=>{

        fs.writeFile(pathExmlFile, finalXML, (err) => {
            if (err) {
             return console.log(err);
            }
             console.log("The file was saved!");
             resolve()
           });
    })
}
/**
 * @description used for getting an all keys
 * @param {*String} dbName 
 */
const getAnAllDialogKeys=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        let dialgoKeys={}
        try {
            let data = await ExecuteQ.Query(dbName, "select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=? or `key`=? or `key`=?",
                ["dialog_private_key","dialog_project_id","dialog_client_email","supplier_entities_key","product_entities_key"]);
            // logger.debug("=======Twilio==DaTA!======",data)
            if(data && data.length>0){
                for(const i of data){
                    // logger.debug("=======I=Key=DATA!==",i.key,i.value)
                    dialgoKeys[i.key]=i.value
                }
                // logger.debug("======Twiloi====",dialgoKeys)
                resolve(dialgoKeys);
            }
            else{
                 resolve(dialgoKeys)
            }
        }catch (e) {
            logger.debug("====Dialog===Err===>",e)
            resolve(dialgoKeys);
        }
    })
}
/**
 * @description used for getting level data of users 
 * @param {*String} dbName 
 * @param {*Int} userId 
 */
const getUserLoyalityLevelData=(dbName,userId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            
            let userLoyalityPoint=0,loyalityLevel=[];
            let userLoayalityData=await ExecuteQ.Query(dbName,`select id,loyalty_points from user where id=?`,[userId]);
            userLoyalityPoint=userLoayalityData && userLoayalityData.length>0?userLoayalityData[0].loyalty_points:0
            let loyalityLevelData=await ExecuteQ.Query(dbName,`select description,name,id,image,total_loyality_points,is_for_all_category,per_point_order_amount,per_point_amount,per_point_amount_type from loyality_level where is_deleted=? order by total_loyality_points desc`,[0]);
            if(loyalityLevelData && loyalityLevelData.length>0){
                for await (const [index,i] of loyalityLevelData.entries()){
                    //first check which loyality level user exist
                    if(parseInt(userLoyalityPoint)>=parseInt(i.total_loyality_points)){
                        if(loyalityLevel.length<=0){
                            loyalityLevel.push(i)
                        }
                    }
                    if(index==loyalityLevelData.length-1){
                        if(loyalityLevel.length<=0){
                            loyalityLevel.push(i)
                        }
                    }
                }
            }
            resolve(loyalityLevel)
        }
        catch(Err){
            reject(Err)
        }
    })
}

const checkIfUserStripeCard=(dbName,userId) => {
    return new Promise(async (resolve,reject)=>{
        try{
            let query = "select id from user_cards where user_id=? and is_deleted=?";
            let params = [userId,0]
            let result = await ExecuteQ.Query(dbName,query,params);

            if(result && result.length>0){
                resolve(1);
            }else{
                resolve(0)
            }

        }
        catch(Err){
            resolve(0);
        }
    })
}

/**
 * @description used for getting an used loyality point data of users
 * @param {*String} dbName 
 * @param {*Int} userId 
 */
const usedLoyalityPointData=(dbName,userId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let totalEarnedPoint=await ExecuteQ.Query(dbName,`select loyalty_points,(total_loyality_amount-used_loyality_amount) as totalLeftAmount,total_loyality_amount from user where id=?`,[userId]);
            // let usedData=await ExecuteQ.Query(dbName,`select * from loyality_point_earning lpe join orders ors on ors.id=lpe.order_id where lpe.user_id=? and lpe.is_ready_for_use=? order by ors.id DESC`,[userId,1]);
             let usedData=await ExecuteQ.Query(dbName,`
             select IFNULL(lpe.user_id,0) as user_id,
             IFNULL(lpe.user_id,0) as user_id,IFNULL(ors.id,0) as order_id,
             IFNULL(lpe.is_ready_for_use,0) as is_ready_for_use,
             IFNULL(lpe.earned_amount,0) as earned_amount,
             IFNULL(lpe.earned_points,0) as earned_points,
             IFNULL(ors.used_loyality_point_amount,0) as used_loyality_point_amount from 
             loyality_point_earning lpe join orders ors on
              ors.id=lpe.order_id where  lpe.user_id=${userId} and lpe.is_ready_for_use=1
              union
              select IFNULL(lpe.user_id,0) as user_id,
             IFNULL(lpe.user_id,0) as user_id,IFNULL(ors.id,0) as order_id,
             IFNULL(lpe.is_ready_for_use,0) as is_ready_for_use,
             IFNULL(lpe.earned_amount,0) as earned_amount,
             IFNULL(lpe.earned_points,0) as earned_points,
             IFNULL(ors.used_loyality_point_amount,0) as used_loyality_point_amount from 
              orders ors left join loyality_point_earning lpe on
              ors.id=lpe.order_id where  ors.user_id=${userId} and ors.used_loyality_point_amount>0
               order by order_id desc;`,[]);
            resolve({totalPointAmountEarned:totalEarnedPoint[0].total_loyality_amount,usedData:usedData,totalEarning:totalEarnedPoint[0].loyalty_points,leftPointAmount:totalEarnedPoint[0].totalLeftAmount})
        }
        catch(Err){
            logger.debug("===Err!==",Err)
            reject(Err)
        }
    })

}
/**
 * @description used for getting an meaurment unit km/mile
 * @param {*String} dbName 
 */
const getMeausringUnit=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        let mUnit=6371;
        try{
            let mUnitData=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=?",["delivery_distance_unit"])
            if(mUnitData && mUnitData.length>0){
                if(parseInt(mUnitData[0].value)==1){
                    mUnit=3959;
                }
            }
            logger.debug('===getMeausringUnit===',mUnit)
            resolve(mUnit)
        }
        catch(Err){
            logger.debug('===getMeausringUnit===',mUnit)
            resolve(mUnit)
        }

    })
}

const getSurveyMonkeyKeys=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let key_object={}
        // kIUio9AhTOeRitWY9ro0eg - survey_monkey_client_id
        // 114415990428829210514102715480742990120 - survey_monkey_secret
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=?";
        multiConnection[dbName].query(sql,['survey_monkey_client_id','survey_monkey_secret'],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                if(data && data.length>0){
                    for(const [index,i] of data.entries()){
                            key_object[i.key]=i.value;
                    }
                    resolve(key_object)
                }
                else{
                    resolve({})
                }
            }
        })
    })
}
/**
 * @description used for adding an order in dhl shipment
 * @param {*Xml} finalDhlXMl 
 * @param {*Object} orderData 
 * @param {*String} dbName 
 */
const addOrderInDhl=(finalDhlXMl,orderData,dbName)=>{
    logger.debug("===SHIp=ORD=DATA==",finalDhlXMl);
    return new Promise((resolve,reject)=>{
            var options = {
                'method': 'POST',
                'url':  config.get("server.dhl.base_url"),
                'headers': {
                    'Content-Type': 'application/xml'
                },
                body:finalDhlXMl
            };
            request(options,async function (error1, response1, body1) {
                    // logger.debug("===error1,response1!==",error1,response1);
                    if(error1){
                        reject(error1)
                    }else{
                    var xml2js1 = require('xml2js');
                    var parser1 = new xml2js1.Parser({explicitArray: false, trim: true});
                    parser1.parseString(body1, async (err1, result1) => {
                            logger.debug("======result1==res:ShipmentResponse=>>>>",result1);
                            if(result1){
                                let successResponse=result1['res:ShipmentResponse'];
                                let validationErrResponse=result1['res:ShipmentValidateErrorResponse'];
                                let errorResponse=result1['res:ErrorResponse'];
                            if(successResponse && successResponse!=undefined){
                                logger.debug("====SUCESS==>>",successResponse);
                                let ShippingCharge=successResponse["ShippingCharge"];
                                let PackageCharge=successResponse["PackageCharge"];
                                let AirwayBillNumber=successResponse["AirwayBillNumber"];
                                let ChargeableWeight=successResponse["ChargeableWeight"];
                                let base64Image=successResponse["LabelImage"]["OutputImage"]
                                logger.debug("===ShippingCharge==PackageCharge==AirwayBillNumber==ChargeableWeight===base64Image>>",
                                ShippingCharge,PackageCharge,AirwayBillNumber,ChargeableWeight,base64Image)
                                await ExecuteQ.Query(dbName,`update orders set is_dhl_assigned=? where id=?`,[1,orderData.order_id])
                                await ExecuteQ.Query(dbName,`insert into dhl_shipment(bar_code,shipping_charge,package_charge,chargeabl_weight,airway_bill_number,base64_image,order_id) values(?,?,?,?,?,?,?)`,["",ShippingCharge,PackageCharge,ChargeableWeight,AirwayBillNumber,base64Image,orderData.order_id])
                                resolve();
                            }
                            else if(validationErrResponse && validationErrResponse!=undefined){
                                let errResponseActionStatus=validationErrResponse["Response"]["Status"]["Condition"]["ConditionData"]
                                logger.debug("====errResponseActionStatus===",errResponseActionStatus)
                                reject(errResponseActionStatus)
                            }
                            else if(errorResponse && errorResponse!=undefined){
                                let errResponseActionStatus=errorResponse["Response"]["Status"]["Condition"]["ConditionData"]
                                logger.debug("====errResponseActionStatus===",errorResponse)
                                reject(errorResponse)
                            }
                            else{
                                reject("Error in Dhl Shipment")
                            }
                        }
                        else{
                            reject("Error in Dhl Shipment")
                        }
                    })
                }
            });
    })
}

/**
 * @description used for adding an order in shiprocket shipment
 * @param {*Xml} finalDhlXMl 
 * @param {*Object} orderData 
 * @param {*String} dbName 
 */
const addOrderInShipRocket=(finalRequestBody,orderData,dbName,shiprocket_auth_token)=>{
    // logger.debug("===SHIp=ORD=DATA==",finalDhlXMl);
    return new Promise((resolve,reject)=>{
            var options = {
                'method': 'POST',
                'url':  "https://apiv2.shiprocket.in/v1/external/shipments/create/forward-shipment",
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer '+shiprocket_auth_token
                },
                body:finalRequestBody,
                json:true
            };
            logger.debug("==========jons data final ========",JSON.stringify(options.body))
            request(options,async function (error1, response1, body1) {
                    // logger.debug("===error1,response1!==",error1,response1);
                    if(error1){
                        reject(error1)
                    }else{

                        if(body1 && body1.status==0){
                            reject(body1.payload.error_message)
                        }else if(body1 && body1.status_code==422){
                            reject(body1.message)
                        }else if(body1 && body1.status==1){
                            let shipment_id = body1.shipment_id;
                            let awb_code = body1.awb_code;
                            let label_url = body1.label_url;
                            let manifest_url = body1.manifest_url;
                            let pickup_token_number = body1.pickup_token_number
                            await ExecuteQ.Query(dbName,`update orders set is_shiprocket_assigned=? where id=?`,[1,orderData.order_id])
                            await ExecuteQ.Query(dbName,`insert into shiprocket_shipment(shipment_id,awb_code,label_url,manifest_url,pickup_token_number,order_id) values(?,?,?,?,?,?)`,
                            [shipment_id,awb_code,label_url,manifest_url,pickup_token_number,orderData.order_id])
                            resolve();
                        }else{
                            reject("Error during order shipment");
                        }

                }
            });
    })
}


// {
//     "id": 754701,
//     "first_name": "API",
//     "last_name": "USER",
//     "email": "ishan.116a@yopmail.com",
//     "company_id": 652300,
//     "created_at": "2020-08-28 17:42:57",
//     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjc1NDcwMSwiaXNzIjoiaHR0cHM6Ly9hcGl2Mi5zaGlwcm9ja2V0LmluL3YxL2V4dGVybmFsL2F1dGgvbG9naW4iLCJpYXQiOjE1OTk3Mjg1NzksImV4cCI6MTYwMDU5MjU3OSwibmJmIjoxNTk5NzI4NTc5LCJqdGkiOiJPNVpTT0VSTlB0Um9MYlVzIn0.ZLB-VWV8MrOXryruQ5_tTqqqugfZ3DN_1da_CZyfYCs"
// }
/**
 * @description used for tracking an dhl shipment
 * @param {*Xml} finalDhlXMl 
 */
const trackOrderInDhl=(finalDhlXMl)=>{
    logger.debug("===SHIp=ORD=DATA==",finalDhlXMl);
    return new Promise((resolve,reject)=>{
            var options = {
                'method': 'POST',
                'url':  config.get("server.dhl.base_url"),
                'headers': {
                    'Content-Type': 'application/xml'
                },
                body:finalDhlXMl
            };
            request(options,async function (error1, response1, body1) {
                    logger.debug("===error1,response1!==",error1,body1);
                    if(error1){
                        reject(error1)
                    }else{
                    var xml2js1 = require('xml2js');
                    var parser1 = new xml2js1.Parser({explicitArray: false, trim: true});
                    parser1.parseString(body1, async (err1, result1) => {
                            logger.debug("======result1==res:ShipmentResponse=>>>>",result1);
                            if(result1){
                                let successResponse=result1['req:TrackingResponse'];
                                // let ActionStatus=successResponse["AWBInfo"]["Status"]["ActionStatus"] ShipmentTrackingErrorResponse
                                // logger.debug("===successResponse===>>",successResponse["AWBInfo"]["Status"]);
                                let validationErrResponse=result1['res:TrackingResponse'];
                                let errorResponse=result1['res:ErrorResponse'];
                            if(successResponse && successResponse!=undefined){
                                logger.debug("====SUCESS==>>",successResponse["AWBInfo"]);
                                resolve(successResponse["AWBInfo"]);
                            }
                            else{
                                reject("Error in Dhl Shipment")
                            }
                        }
                        else{
                            reject("Error in Dhl Shipment")
                        }
                    })
                }
            });
    })
}
/**
 * @description used for modify products array
 * @param {*Array} result 
 * @param {*} required_day 
 * @param {*} required_hour 
 * @param {*} screen_flow 
 */
const modifyProductResult=(result,required_day,required_hour,screen_flow)=>{
    logger.debug("===ScreenFlow:=>",screen_flow);
    return new Promise((resolve,reject)=>{
        var adds_on_ar=[],adds_on,final_json={},price_varies,available_flag=false,not_available_id=[];
        if(result && result.length>0){

            for(var i = 0; i< result.length;i++){

                    adds_on=_.groupBy(JSON.parse(result[i].adds_on),"name");

                    _.each(adds_on,function(value,key,object){
                            final_json.name=key
                            final_json.value=value
                            adds_on_ar.push(final_json);
                            final_json={}                                
                    })
                    result[i].adds_on=adds_on_ar;
                    result[i].perProductLoyalityDiscount=0;
                    result[i].required_day=required_day;
                    result[i].required_hour=required_hour;
                    logger.debug("= result[i].adds_on=adds_on_ar=IsArray=AdsOnArray", result[i].adds_on,adds_on_ar,Array.isArray(result[i].adds_on),Array.isArray(adds_on_ar))                    
                    adds_on_ar=[];
                    if(result[i].pricing_type == 1){
                        result[i].hourly_price =JSON.parse(result[i].price);
                        // if(screen_flow && screen_flow.length>0 && screen_flow[0].app_type==5)
                        // {
                            result[i].price_type=1;
                            price_varies = result[i].hourly_price
                            // logger.debug("======PRICE_VARIES==",price_varies);
                            if(price_varies && price_varies.length>0){
                                // [{"min_hour":"1","max_hour":"1","price_per_hour":"300"},
                                // {"min_hour":"2","max_hour":"2","price_per_hour":"300"}
                                // {"min_hour":"3","max_hour":"180","price_per_hour":"300"}]
                                _.each(price_varies,function(j){
                                    logger.debug("==:required_hour=:required_day:=min_hour:=:max_hour=",required_hour,required_day,j.min_hour,j.max_hour);
                                  if(required_day>=1){
                                        if(required_day==j.min_hour && required_day==j.max_hour){
                                            available_flag=true
                                        }
                                    }
                                    else{
                                        if(required_hour==j.min_hour/60 && required_hour==j.max_hour/60){
                                            available_flag=true
                                        }
                                    }
                                })
                                if(available_flag==false){
                                    not_available_id.push(result[i].product_id)
                                    // result.splice(i,1)
                                }
                                available_flag=false;
                            }                                          
                        // }

                        
                        
                    }else{
                        result[i].price_type=0;                           
                        delete result[i].hourly_price;
                    } 
                 
                    if(i==result.length-1 || result.length<=0){
                        resolve(result);
                    }                    
        }
    }
    else{
        resolve([])
    }
})
}

const getPagofacilKeys=(dbName)=>{
    let key_object={};
    return new Promise(async (resolve,reject)=>{
        try {
            logger.debug("=========dbName============",dbName)
            logger.debug("=========dbName======2======",dbName)

            let data=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? or `key`=?",[
                "idSucursa",
                "idUsuario"
            ])
            logger.debug("=--------data---------",data)
            logger.debug("=--------data---------",data)

            if(data && data.length>0){
                for(const [index,i] of data.entries()){
                    key_object[i.key]=i.value
                }
                resolve(key_object)
            }
            else{
                resolve(key_object)
            }
        }
        catch (e) {
            resolve({})
        }
    })
}

const getTelrKeys=(dbName)=>{
    let key_object={};
    return new Promise(async (resolve,reject)=>{
        try {
            logger.debug("=========dbName============",dbName)
            logger.debug("=========dbName======2======",dbName)

            let data=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? or `key`=?",[
                "telr_store_id",
                "telr_authkey",
                "merchent_id",
                "api_key"
            ])
            logger.debug("=--------data---------",data)
            logger.debug("=--------data---------",data)

            if(data && data.length>0){
                for(const [index,i] of data.entries()){
                    key_object[i.key]=i.value
                }
                resolve(key_object)
            }
            else{
                resolve(key_object)
            }
        }
        catch (e) {
            resolve({})
        }
    })
}

const getPayMayaKeys=(dbName)=>{
    let key_object={};
    return new Promise(async (resolve,reject)=>{
        try {
            logger.debug("=========dbName======2======",dbName)

            let data=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=? or `key`=?",[
                "paymaya_public_key",
                "paymaya_secret_key"
            ])
            logger.debug("=--------data---------",data)

            if(data && data.length>0){
                for(const [index,i] of data.entries()){
                    key_object[i.key]=i.value
                }
                resolve(key_object)
            }
            else{
                resolve(key_object)
            }
        }
        catch (e) {
            resolve({})
        }
    })
}
const getCurrency=(dbName)=>{
    return new Promise( async (resolve,reject)=>{
        let defaultCurrency="usd";
        let currenncyData=await ExecuteQ.Query(dbName,`select currency_name,currency_symbol from currency_conversion limit 1`,[])
        if(currenncyData && currenncyData.length>0){
            defaultCurrency=currenncyData[0].currency_name
        } 
        resolve(defaultCurrency)
    })
}
/**
 * @description used for getting an status in name
 * @param {*INt} app_type 
 * @param {*Int} selected_status 
 */
const getStatusByName=(app_type,selected_status,is_dine_in)=>{
    let status;
    switch (selected_status) {
        case 0:
            status = 'Pending';
            break;
        case 1:
            status = 'Confirmed';
            break;
        case 2:
            status = 'Rejected';
            break;
        case 3:
            switch (app_type) {
                case 1: case 3: case 4:
                    status = 'On The Way';
                    break;
                case 8:
                    status = 'Started';
                    break;
                case 2:
                    status = 'Out For Delivery';
                    break;
                default:
                    status = 'On The Way';
                    break;
            }
            break;
        case 4:
            switch (app_type) {
                case 1:
                    status = 'Arrived';
                    break;
                default:
                    status = 'Near You';
                    break;
            }
            break;
        case 5:
            switch (app_type) {
                case 8:
                    status = 'Ended';
                    break;
                case 1: case 2:
                    status = is_dine_in == 1 ? 'Served' : 'Delivered';
                    break;
                default:
                    status = 'Completed';
                    break;
            }
            break;
        case 6:
            status = 'Rating Given';
            break;
        case 7:
            status = 'Track';
            break;
        case 8:
            status = 'Customer Cancelled';
            break;
        case 9:
            status = 'Scheduled';
            break;
        case 10:
            switch (app_type) {
                case 1:
                    status = is_dine_in == 1 ? 'Ready To Serve' : 'Ready To Be Picked';
                    break;
                case 8:
                    status = 'Reached';
                    break;
                default:
                    status = 'Shipped';
                    break;
            }
            break;
        case 11:
            switch (app_type) {
                case 2: case 4: case 3:
                    status = 'Packed';
                    break;
                case 1:
                    status = 'In Kitchen';
                    break;
                case 8:
                    status = 'On The Way';
                    break;
                default:
                    status = 'Packed';
                    break;
            }
            break;
    }
    logger.debug("======status===>>",status)
    return status
}
/**
 * @description used for getting an google matrix analytic like distance,mile etc
 * @param {*Double} source_latitude 
 * @param {*Double} source_longitude 
 * @param {*Double} dest_latitude 
 * @param {*Double} dest_longitude 
 */
const getDistanceMatrix=(source_latitude,source_longitude,dest_latitude,dest_longitude,apiKey)=>{
    return new Promise(async(resolve, reject) => {
        let u_lat_long = source_latitude+","+source_longitude
        let a_lat_long = dest_latitude+","+dest_longitude
        const distance = require('google-distance');
        distance.apiKey = apiKey;
        distance.get(
            {
                index: 1,
                origin: a_lat_long,
                destination: u_lat_long
            },
            function (err, data) {
                if (err) {
                    console.log(err);
                    resolve({})
                }else{
                    resolve(data)
                }
            });
    })
}
/**
 * @description used for getting an google api key
 * @param {*String} dbName 
 */
const getGoogleApiKey=(dbName)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let query = "select value from tbl_setting where `key` = 'google_map_key'"
            let query2 = "select value from tbl_setting where `key` = 'google_map_key_backend'"
            let result = await ExecuteQ.Query(dbName,query,[]);
            let result2=await ExecuteQ.Query(dbName,query2,[]);
            if(result2 && result2.length>0){
                resolve(result2[0].value);
            }
            else{
                resolve(result[0].value);
            }
           
        }catch(err){
            logger.debug("==========err======",err);
            resolve("")
        }
    })
}

const loginToShipRocket = (email,password)=>{
    return new Promise((resolve,reject)=>{
        var options = {
            "method": "POST",
            "url":  "https://apiv2.shiprocket.in/v1/external/auth/login",
            "headers": {
                "Content-Type": "application/json"
            },
            body:{
                "email": email,
                "password":password
            },
            json: true
        }; 
        logger.debug("=======options========",options)
        // options = JSON.stringify(options);
        request(options,async function (error1, response1, body1) {
            logger.debug("======body1=====error1=====body1===",body1,error1);
            if((error1)!==null){
                reject(error1.message);
            }else if(body1 && Object.keys(body1).length>0){
                if(body1.status_code==200){
                    resolve(body1.token)
                }
                else{
                    reject(body1.message)
                }
                
            }else{
                reject("An error occured during login to shiprocket")
            }

        })
    })
}
const getShipRocketKeyData=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
        logger.debug("====DBNAME==>>",dbName);
        try{
        let key_object={}
        let sql="select `key`,`value` from tbl_setting where `key`=? or `key`=? ";
        let dhlData=await ExecuteQ.Query(dbName,sql,["shiprocket_email","shiprocket_password"]);
            logger.debug("=======RAZOR SETTING DATA========",dhlData)
            if(dhlData && dhlData.length>0){
                for(const [index,i] of dhlData.entries()){
                        key_object[i.key]=i.value;
                }
                resolve(key_object)
            }
            else{
                resolve({})
            }
        }
        catch(Err){
            logger.debug("=====ERR!==>>",Err);
            resolve({})
        }
    })
}
const getSound=(dbName)=>{
    return new Promise(async (resolve,reject)=>{
            try{
                let sData=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key`=?",["notification_sound"]);
                let sound=sData && sData.length>0?sData[0].value:"default";
                logger.debug("====SOUND====>",sound)
                resolve(sound)
            }
            catch(Err){
                resolve("default")
            }
    })
}
const getpayuLatamSecretKey=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key`=?";
        multiConnection[dbName].query(sql,[config.get("payment.payuLatam.basic_auth")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}


const getpayuLatamApiLoginkey=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key` =? ";
        
        multiConnection[dbName].query(sql,[config.get("payment.payuLatam.payu_latam_api_login")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}

const getpayuLatamMerchantId=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key` =? ";
        
        multiConnection[dbName].query(sql,[config.get("payment.payuLatam.payu_latam_merchant_id")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}


const getpayuLatamAccountId=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key` =? ";
        
        multiConnection[dbName].query(sql,[config.get("payment.payuLatam.payu_latam_account_id")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}


const getpayuLatamApiKey=(dbName)=>{
    return new Promise((resolve,reject)=>{
        let sql="select `key`,`value` from tbl_setting where `key` =? ";
        
        multiConnection[dbName].query(sql,[config.get("payment.payuLatam.payu_latam_api_key")],(err,data)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(data)
            }
        })
    })
}
const uniqueId = ()=>{
    return uniqid();
}




const sendSemaphoreMessage = (apikey,
    sendername,message,number)=>{
    return new Promise((resolve,reject)=>{
        var options = {
            "method": "POST",
            "url":  "https://api.semaphore.co/api/v4/messages",
            "headers": {
                "Content-Type": "application/json"
            },
            body:{
                "apikey":apikey,
                "number":number,
                "message":message,
                "sendername":sendername
                },
            json: true
        }; 
        logger.debug("=======options========",options)
        // options = JSON.stringify(options);
        request(options,async function (error1, response1, body1) {
            console.log("======sendSemaphoreMessage=Err==",error1,body1);
        })
        resolve();
    })
}

const getSafaSmsPayKey = (dbName) => {
    return new Promise(async (resolve,reject)=>{
        let safaSmsPay = {}
        try {
            let data = await ExecuteQ.Query(dbName,
                 "select `key`,`value` from tbl_setting where `key`=? or `key`=? or `key`=? or `key`=? ",
                [
                "safapay_username",
                "safapay_password",
                "safapay_number",
                "safapay_sender"
            ]);
            logger.debug("=======safaSmsPay==DaTA!======",data);
            if(data && data.length>0){
                for(const i of data){
                    logger.debug("=======I=Key=safaSmsPay!==",safaSmsPay);
                    safaSmsPay[i.key]=i.value
                }
                logger.debug("======safaSmsPay====",safaSmsPay);
                resolve(safaSmsPay);
            }
            else{
                 resolve(safaSmsPay);
            }
        }catch (e) {
            logger.debug("====Dialog===Err===>",e);
            resolve(safaSmsPay);
        }
    })

}
const getUserId=(token,dbName)=>{
    return new Promise(async (resolve,reject)=>{
        try{
    if(token!=undefined && token!=""){
        var sql = " select id from user where access_token = ? ";
        let result=await ExecuteQ.Query(dbName,sql,[token]);
        if(result.length){
            id = result[0].id;
            //logger.debug("ddddd",id,result);
            resolve(id);
        }else{
            resolve(0);
        }
    }
    else{
        resolve(0)
    }
}
catch(Err){
    resolve(0)
}
    })

}

const saferpayTransactionCatptur= async (dbName,order_id)=>{
    return new Promise( async (resolve,reject)=>{
        
        let orderData=await ExecuteQ.Query(dbName,`select * from orders where id=?`,[order_id])
        
        let safer_pay_data=await getSaferPayData(dbName);
        let username = safer_pay_data.saferpay_username;
        let password = safer_pay_data.saferpay_password;

        let authToken = "Basic " + new Buffer(username + ":" + password).toString("base64");

        var headers = {
            "Content-type": "application/json",
            "accetp": "application/json; charset=utf-8",
            'Authorization': authToken
        };

        let payload = {
            "RequestHeader": {
                "SpecVersion": "1.20",
                "CustomerId" : safer_pay_data.saferpay_customer_id,
                "RequestId": orderData[0].saferpay_request_id,
                "RetryIndicator": 0
            },
            "TransactionReference": {
              "TransactionId": orderData[0].card_payment_id
            }
          }
          

        let url = "https://test.saferpay.com/api/Payment/v1/Transaction/Capture";

        if (process.env.NODE_ENV == 'prod')
            url = "https://www.saferpay.com/api/Payment/v1/Transaction/Capture";
        // url = "https://www.saferpay.com/api/payment/v1/PaymentPage/Initialize";
        var options = {
            'method': 'POST',
            'url': url,
            'headers': headers,
            'body': payload,
            'json': true
        };
        request(options, function (error, response) { 
            logger.debug("===Body!==",error,response.body);
            if (!error) {
                resolve(response.body)
            } else {
                resolve({})
            }
        });
    })
}

const saferpayTransactionRefund= async (dbName,order_id)=>{
    return new Promise( async (resolve,reject)=>{
        
        let orderData=await ExecuteQ.Query(dbName,`select * from orders where id=?`,[order_id])
        let orderNetAmount=orderData && orderData.length>0?orderData[0].net_amount:0
        let referralAmount=0;
        let safer_pay_data=await getSaferPayData(dbName);
        let username = safer_pay_data.saferpay_username;
        let password = safer_pay_data.saferpay_password;

        let authToken = "Basic " + new Buffer(username + ":" + password).toString("base64");

        var headers = {
            "Content-type": "application/json",
            "accetp": "application/json; charset=utf-8",
            'Authorization': authToken
        };

        let payload = {
            "RequestHeader": {
                "SpecVersion": "1.20",
                "CustomerId" : safer_pay_data.saferpay_customer_id,
                "RequestId": orderData[0].saferpay_request_id,
                "RetryIndicator": 0
            },
            "TransactionReference": {
              "TransactionId": orderData[0].card_payment_id
            },
            "Refund": {
                "Amount": {
                    "Value": Math.round(parseFloat((orderNetAmount-referralAmount)*100)),
                    "CurrencyCode": "USD"
                }
            },
            "CaptureReference": {
                "CaptureId": orderData[0].saferpay_captureId
            }
          }

        let url = "https://test.saferpay.com/api/Payment/v1/Transaction/Capture";

        if (process.env.NODE_ENV == 'prod')
            url = "https://www.saferpay.com/api/Payment/v1/Transaction/Capture";
        // url = "https://www.saferpay.com/api/payment/v1/PaymentPage/Initialize";
        var options = {
            'method': 'POST',
            'url': url,
            'headers': headers,
            'body': payload,
            'json': true
        };
        request(options, function (error, response) { 
            logger.debug("===Body!==",error,response.body);
            if (!error) {
                resolve(response.body)
            } else {
                resolve({})
            }
        });
    })
}

const validateSupplierHeader=(row,serviceType)=>{
    return new Promise((resolve,reject)=>{
    let isValid=true;
    // switch(parseInt(serviceType)){
    //     case true:
                if (row[0].toLowerCase()!="name") {
                    console.log("======")
                    isValid=false
                }
                else if(row[1].toLowerCase()!="email"){
                    isValid=false
                }
                else if(row[2].toLowerCase()!="password"){
                    isValid=false
                }
                else if(row[3].toLowerCase()!="address"){
                    isValid=false
                }
                else if(row[4].toLowerCase()!="description"){
                    isValid=false
                }
                else if(row[5].toLowerCase()!="image"){
                    isValid=false
                }
                else if(row[6].toLowerCase()!="havemultiplebranch"){
                    isValid=false
                }
                else if(row[7].toLowerCase()!="pickupcommisioninpercentage"){
                    isValid=false
                }
                else if(row[8].toLowerCase()!="deliverycommisioninpercentage"){
                    isValid=false
                }
                else if(row[9].toLowerCase()!="licensenumber"){
                    isValid=false
                }
                else if(row[10].toLowerCase()!="countrycode"){
                    isValid=false
                }
                else if(row[11].toLowerCase()!="phonenumber"){
                    isValid=false
                }
                else if(row[12].toLowerCase()!="latitude"){
                    isValid=false
                }
                else if(row[13].toLowerCase()!="longitude"){
                    isValid=false
                }
                // break;
// }
logger.debug("====isValid=>>",isValid)
resolve(isValid)
// return isValid;
})
}

/**
 * @description used for parsing an csv and get an
 * @param {*Object} req 
 */
const supplierCsvParsingAndValidation=(req)=>{
    return new Promise((resolve,reject)=>{
            let fileRows = [];
            if (req.files.file) {
                csv.parseFile(req.files.file.path)
                    .on("data", function (data) {
                        // logger.debug("=====DATA!==>>",data);
                        fileRows.push(data); // push each row
                    })
                    .on("end", async function () {
                        logger.debug("==============>>",fileRows[0])
                       let headerValidate=await validateSupplierHeader(fileRows[0], req.service_type);
                       if(!headerValidate){
                          reject(constant.fileMessage.INVALID_HEADER);
                       }
                       else{
                        const dataRows = fileRows.slice(1, fileRows.length);
                        resolve(dataRows)
                       }
                       
                       logger.debug("=======headerValidate====>>",headerValidate)
                    })
                }
                else{
                    reject(constant.fileMessage.INVALID_FILE)
                }
    })
}
/**
 * @description used for check file in csv extension or not
 * @param {*String} fileName 
 */
const csvFileExtensionValidataion=(fileName)=>{
    return new Promise((resolve,reject)=>{
            let fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
            if (fileExtension == "csv") {
                resolve()
            }
            else{
                reject(constant.fileMessage.INVALID_FILE)
            }
    })
}
/**
 * @description used for key value
 * @param {*String} dbName 
 */
const getKeysValue=async (keyNameArray,dbName)=>{
    return new Promise(async (resolve,reject)=>{
            try{
                let keyData=await ExecuteQ.Query(dbName,"select `key`,`value` from tbl_setting where `key` IN (?) and value=?",[keyNameArray,"1"]);
                resolve(keyData)
            }
            catch(Err){
                logger.debug("=====getKeysValue=====",Err)
                resolve([])
            }
    })
}
class jwt{
    /**
     * @description used for genrateing an jwt token
     * @param {Object} data 
     */
    static genrate(data){
        let jwtToken=Jwt.sign(data,config.get("agent.jwt_secret_key"), { algorithm: 'HS256' } );
        return jwtToken;
    }
}
class token{
    constructor(_isMultpleEnabale,_phoneNumber,_email,_id){
        this._isMultpleEnabale=_isMultpleEnabale;
        this._phoneNumber=_phoneNumber;
        this._email=_email;
        this._id=_id;
    }
    genrate(){
        let jwtToken=jwt.genrate({email: this._email,id:this._id})
        logger.debug("====jwtToken=>",jwtToken);
        return jwtToken;
    }
}
class encrypt{
    constructor(_text){
        this._text=_text;
    }
    async data(){
        let cipher = crypto.createCipher(algorithm,crypto_password);
        let crypted = cipher.update(this._text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        logger.debug("=====crypted====>>",crypted)
        return crypted;
    }
}
class filter{
    /**
     * @description used for filter setting keys and value 
     * @param {*String} _key 
     * @param {*Array} _keyArray 
     * @param {*Array} keyValue 
     */
    constructor(_key,_keyArray,keyValue){
        this._key=_key;
        this._keyArray=_keyArray;
        this._keyValue=keyValue;
    }
    value(){
        let _data=_.filter(
            this._keyValue,
            function(i) { return this.values.indexOf(i.key) > -1; },
            { "values": this._keyArray } /* "context" with values to look for */
          );
        return _data;
    }
    key(){
        let _data=this._keyValue.filter(item => item.key.indexOf(this._key) !== -1);
        return _data;
    }
}
class geo{
    constructor(categories,georegion){
        this._categories=categories;
        this._georegion=georegion;
    }
    async categories(){
        let finalCategories=[]
        if(this.georegion && this.georegion.length>0){
            for(const [index,i] of this.categories.entries() ){
                for (const [index2,j] of this._georegion.entries()){
                        if(j.category_id==i.id){
                            finalCategories.push(i)
                        }
                }
                if(index==this.categories.length-1){
                    return finalCategories
                }
            }
        }
        else{
            return this._categories
        }
        }
}
module.exports={
    geo:geo,
    jwt:jwt,
    filter:filter,
    encrypt:encrypt,
    token:token,
    getKeysValue:getKeysValue,
    csvFileExtensionValidataion:csvFileExtensionValidataion,
    supplierCsvParsingAndValidation:supplierCsvParsingAndValidation,
    getUserId:getUserId,
    getSemaPhoreData:getSemaPhoreData,
    sendSemaphoreMessage:sendSemaphoreMessage,
    getSound:getSound,
    getShipRocketKeyData:getShipRocketKeyData,
    addOrderInShipRocket:addOrderInShipRocket,
    getDistanceMatrix:getDistanceMatrix,
    getStatusByName:getStatusByName,
    getCurrency:getCurrency,
    modifyProductResult:modifyProductResult,
    trackOrderInDhl:trackOrderInDhl,
    addOrderInDhl:addOrderInDhl,
    getMeausringUnit:getMeausringUnit,
    usedLoyalityPointData:usedLoyalityPointData,
    getUserLoyalityLevelData:getUserLoyalityLevelData,
    getAnAllDialogKeys:getAnAllDialogKeys,
    writeNewUrlsInXml:writeNewUrlsInXml,
    getExistingUrlsFromXml:getExistingUrlsFromXml,
    getMuthoFunData:getMuthoFunData,
    getModifiedProdutDataForCategories:getModifiedProdutDataForCategories,
    getModifiedProdutData:getModifiedProdutData,
    getNestedChildrenIds:getNestedChildrenIds,
    nthLevelCategoryQueryString:nthLevelCategoryQueryString,
    getDhlKeyData:getDhlKeyData,
    categoriesWithMlName:categoriesWithMlName,
    copyAddsOnExistingPoduct:copyAddsOnExistingPoduct,
    refundStripePayment:refundStripePayment,
    validationSupplierHeaderColumn:validationSupplierHeaderColumn,
    validationHeaderColumn:validationHeaderColumn,
    validationHeaderColumnWithCategory:validationHeaderColumnWithCategory,
    getGiftPurchasedTemplate:getGiftPurchasedTemplate,
    oneClickData:oneClickData,
    getPayTabData:getPayTabData,
    getDecryptData:getDecryptData,
    getCyberSourceData:getCyberSourceData,
    addOrderInShipStation:addOrderInShipStation,
    getShippingOrderDetail:getShippingOrderDetail,
    getShippingData:getShippingData,
    getTerminologyByCategory:getTerminologyByCategory,
    getAuthTokeOfPayPal:getAuthTokeOfPayPal,
    getBraintreeData:getBraintreeData,
    getPaypalData:getPaypalData,
    getUserLeftReferralAmount:getUserLeftReferralAmount,
    getRecieverReferralPrice:getRecieverReferralPrice,
    getGivenReferralPrice:getGivenReferralPrice,
    smtpData:smtpData,
    getPaystackSecretKey:getPaystackSecretKey,
    getTwilioData:getTwilioData,
    getDeliveryChargeAlgo:getDeliveryChargeAlgo,
    getMsgAfterTerminology:getMsgAfterTerminology,
    getTerminology:getTerminology,
    getEncryptData:getEncryptData,
    getRazorPayData:getRazorPayData,
    getUserData:getUserData,
    getAgentData:getAgentData,
    getConektaSecretKey:getConektaSecretKey,
    getStripSecretKey:getStripSecretKey,
    is_decimal_quantity_allowed:is_decimal_quantity_allowed,
    isEnabledMultipleBaseDeliveryCharges:isEnabledMultipleBaseDeliveryCharges,
    getMumybeneKeyData:getMumybeneKeyData,
    getMyFatoorahToken:getMyFatoorahToken,
    getConvergeData:getConvergeData,
    getZoomKeys:getZoomKeys,
    getPayhereData:getPayhereData,
    getCheckoutSecretKey:getCheckoutSecretKey,
    getMsgText:getMsgText,
    AllParentCatByLocation:AllParentCatByLocation,
    AllSubCat:AllSubCat,
    AllParentCat:AllParentCat,
 AllSubCatV1: AllSubCatV1,
    AllParentCatV1: AllParentCatV1, 
    getMeausringUnitV1: getMeausringUnitV1,

   finalCatData:finalCatData,
    getHourDiff:getHourDiff,
    getDayDiff:getDayDiff,
    getCustomerIdByAccessToken:getCustomerIdByAccessToken,
    CryptData:CryptData,
    addMinutesInString:addMinutesInString,
    compareCryptedData:compareCryptedData,
    generateJwtAccessToken:generateJwtAccessToken,
    getVersioning:getVersioning,
    getErrMsgText:getErrMsgText,
    getFileNameWithUserIdWithCustomPrefix:getFileNameWithUserIdWithCustomPrefix,
    getFcmServerKey:getFcmServerKey,
    isUserSubscriptionEnabled:isUserSubscriptionEnabled,
    isCommissionDynamicEnabled:isCommissionDynamicEnabled,
    getSquareupSecretKey:getSquareupSecretKey,
    getClientLanguage:getClientLanguage,
    getUserPriceType:getUserPriceType,
    disableOtpVerification:disableOtpVerification,
    taxGatewayAccToLocation:taxGatewayAccToLocation,
    checkLocationwiseTaxAndpaymentGateway:checkLocationwiseTaxAndpaymentGateway,
    deliveryCommissionWise:deliveryCommissionWise,
    checkLocationPaymentGateway:checkLocationPaymentGateway,
    validationHeaderColumnNew:validationHeaderColumnNew,
    getPeachSecretKey:getPeachSecretKey,
    TimeSlots:TimeSlots,
    getSurveyMonkeyKeys:getSurveyMonkeyKeys,
    getPOSKeys:getPOSKeys,
    getAuthorizeNetKeys:getAuthorizeNetKeys,
    getThawaniKeys:getThawaniKeys,
    getPagofacilKeys:getPagofacilKeys,
    getTelrKeys:getTelrKeys,
    loginToShipRocket:loginToShipRocket,
    getSupplierDistanceWiseMinOrder:getSupplierDistanceWiseMinOrder,
    getGoogleApiKey:getGoogleApiKey,
    getDistanceMatrix:getDistanceMatrix,
    validationSupplierHeaderColumnForVariants:validationSupplierHeaderColumnForVariants,
    getModifiedProdutDataForVariants:getModifiedProdutDataForVariants,
    validateVariantKeyValue:validateVariantKeyValue,
    addVariantsProductsIds:addVariantsProductsIds,
    getSupplierWeightWiseDeliveryCharge:getSupplierWeightWiseDeliveryCharge,
    getSupplierDeliveryTypes:getSupplierDeliveryTypes,
    getOrderTypeWisePaymentGateways:getOrderTypeWisePaymentGateways,
    getDeliveryTypeKey:getDeliveryTypeKey,
    validationHeaderCategoryVariantColumns:validationHeaderCategoryVariantColumns,
    getModifiedCategoryVariantData:getModifiedCategoryVariantData,
    getPayMayaKeys:getPayMayaKeys,
    getTwilioAuthyData:getTwilioAuthyData,
    disableAgentOrderLocationAssignment:disableAgentOrderLocationAssignment,
    getSuperAdminEmail:getSuperAdminEmail,


    getpayuLatamSecretKey : getpayuLatamSecretKey,
    getpayuLatamApiKey : getpayuLatamApiKey,
    getpayuLatamApiLoginkey :getpayuLatamApiLoginkey,
    uniqueId : uniqueId,
    getpayuLatamMerchantId : getpayuLatamMerchantId,
    getpayuLatamAccountId  : getpayuLatamAccountId,
    checkNumberMasking:checkNumberMasking,
    getBandwidthData:getBandwidthData,
    checkLocationWiseCategories:checkLocationWiseCategories,
    getSupplierDeliveryCompanies:getSupplierDeliveryCompanies,
    getSafaSmsPayKey:getSafaSmsPayKey,
    getSafe2Paykey:getSafe2Paykey,
    getMainCategoryId:getMainCategoryId,
    checkIfUserStripeCard:checkIfUserStripeCard,
    checkUserZone:checkUserZone,
    getSaferPayData: getSaferPayData,
    saferpayTransactionCatptur: saferpayTransactionCatptur,
    saferpayTransactionRefund: saferpayTransactionRefund
}
