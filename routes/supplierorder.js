/**
 * Created by cbl98 on 11/5/16.
 */

var func = require('./commonfunction');
var async = require('async');
var sendResponse = require('./sendResponse');
var constant = require('./constant');
var loginFunctions = require('./loginfunctionsupplier');
var orderFunction=require('./orderFunction');
var adminOrders=require('./adminOrders');
var pushNotifications=require('./pushNotifications');
var supplierOrder=require('./supplierorder')
var AdminMail = "ops@royo.com"
//var AdminMail = "mohit0641@gmail.com"
var emailTemp = require('./email');
var moment = require('moment');
var _=require('underscore');
var common=require('../common/agent')
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
var Execute=require('../lib/Execute')
const Universal=require('../util/Universal')
const smsManager = require('../lib/smsManager')

exports.supplierOrderListing=  function(req,res) {
    var accessToken =0 ;
    var sectionId=0;
    var supplier_id;
    var supplierId;
    var data={};
    var limit;
    var start_date=req.body.start_date || '1991-01-11';
    var end_date=req.body.end_date || '2025-01-11';
    var offset;
    var orderType=0;
    var tab_status=req.body.tab_status; 
    var sub_status; 
    var serachType = 0,serachText,total_order_count=0;
    var payment_type=req.body.payment_type!=undefined && req.body.payment_type!=""?req.body.payment_type:0
    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                offset=parseInt(req.body.offset);
                if(req.body.limit)
                {
                    limit=parseInt(req.body.limit);
                }
                if(req.body.orderType){
                    orderType=parseInt(req.body.orderType);
                }
                console.log("===========tab status parsed======2=====",tab_status)
                if(req.body.sub_status){
                    sub_status = parseInt(req.body.sub_status)
                }
                // if(req.body.serachType){
                //     serachType=parseInt(req.body.serachType);
                // }
                if(req.body.serachText){
                    serachText=req.body.serachText;
                    serachType=1
                }
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb)
        {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        supplierId:['authenticate',function (cb) {
            getId(req.dbName,res,supplier_id,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else
                {
                    supplierId=result[0].supplier_id;
                    cb(null);
                }
            })
        }],
        listsupplierorder:['supplierId',function(cb){

            loginFunctions.listSupplierOrder(req.dbName,res,supplierId,limit,offset,orderType,tab_status,sub_status,
                serachType,serachText,payment_type,
                start_date,
                end_date,
                function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    // orders
                    data.orders=result.orders;
                    total_order_count=result.total_orders;
                    // if(result.length){
                    //     data.orders=result;
                    // }
                    // else {
                    //     data.orders=[];
                    // }
                    cb(null)
                }
            })

        }],
        status:['listsupplierorder',function(cb){
            var final_data=[];    
            var orderHistory= data.orders   
            var leng=orderHistory.length,agentConnection={}
            if(leng>0){
            async.each(orderHistory,async function (i, callback2) 
                {
                    // console.log("===",i.id,i.status,i.is_agent)
                    // if(i.is_agent==1){

                        var getAgentDbData=await common.GetAgentDbInformation(req.dbName);                                               
                        logger.debug("===AGENT==CONNECTION==>>==2=",Object.entries(agentConnection).length)
                        if(Object.entries(agentConnection).length===0){
                           agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                        }  
                        var sqlQuery="select `ors`.`status`,`usr`.`name`,`usr`.`image`,`usr`.`id` as `agent_id` from `cbl_user_orders` ors join `cbl_user` `usr` on `usr`.id=`ors`.`user_id`  where order_id=?";
                        agentConnection.query(sqlQuery,[i.id],function(err,statusData){   
                        console.log("====statusData====",err) 
                        if (err) {
                            sendResponse.somethingWentWrongError(res);
                        }
                        else{       
                            // console.log("====statusData====",statusData)                        
                            if(statusData && statusData.length>0){     
                                                              
                                // i.status=statusData[0].status;
                                i.agent_name=statusData[0].name;
                                i.agent_image=statusData[0].image;
                                i.agent_id=statusData[0].agent_id;                                
                                // i.agent_name=
                                final_data.push(i)
                                callback2(null)
                            }
                            else{
                                final_data.push(i)
                                callback2(null)
                            }
                        }
                    });
                // }
                // else{
                //     final_data.push(i)
                //     callback2(null)
                // }
            
        },function(err) {            
            if (err) {
                cb(err);
            }
            else{                
                var order_data=_.sortBy(final_data,'id').reverse();
                data.orders=order_data
                data.total_order = total_order_count
                cb(null)
            }
          }); 
        }
        else{
            cb(null)
        }
                        
        }],
        totalOrders:['status',function (cb) {
            if(orderType==0){
                var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                    'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                    'join user u on o.user_id=u.id where s.id= ? order by o.id ';
            }
            else if(orderType==1){
                var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                    'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                    'join user u on o.user_id=u.id where s.id= ? and o.status = 0 order by o.id ';

            }
            else if(orderType==2){
                var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                    'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                    'join user u on o.user_id=u.id where s.id= ? and o.status = 0 and o.urgent = 1 order by o.id ';

            }
            else if(orderType==3){
                var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                    'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                    'join user u on o.user_id=u.id where s.id= ? and o.status = 5 order by o.id ';

            }

           /* var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
            'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
            'join user u on o.user_id=u.id where s.id= ? order by o.id';*/

            multiConnection[req.dbName].query(sql,[supplierId],function (err,orders) {
                if(err)
                {
                    console.log('error------',err);
                    sendResponse.somethingWentWrongError(res);

                }
                else {
                    // data.total_order=orders.length;
                    cb(null);
                }
            })
        }]
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })
}
exports.supplierOrderListingV2 =  function(req,res) {
    var accessToken =0 ;
    var sectionId=0;
    var supplier_id;
    var supplierId;
    var supplierBranchId=0;
    var data={};
    var limit;
    var start_date=req.body.start_date || '1991-01-11';
    var end_date=req.body.end_date || '2025-01-11';
    var offset;
    var orderType=0;
    var tab_status=req.body.tab_status; 
    var sub_status; 
    var serachType = 0,serachText,total_order_count=0;
    var payment_type=req.body.payment_type!=undefined && req.body.payment_type!=""?req.body.payment_type:0
    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                offset=parseInt(req.body.offset);
                if(req.body.limit)
                {
                    limit=parseInt(req.body.limit);
                }
                if(req.body.orderType){
                    orderType=parseInt(req.body.orderType);
                }
                console.log("===========tab status parsed======2=====",tab_status)
                if(req.body.sub_status){
                    sub_status = parseInt(req.body.sub_status)
                }
                // if(req.body.serachType){
                //     serachType=parseInt(req.body.serachType);
                // }
                if(req.body.serachText){
                    serachText=req.body.serachText;
                    serachType=1
                }
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb)
        {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        supplierId:['authenticate',function (cb) {
            getId(req.dbName,res,supplier_id,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else
                {
                    supplierId=result[0].supplier_id;
                    // supplierBranchId=result[0].supplier_branch_id;
                    supplierBranchId= req.supplier&&req.supplier.isHeadBranch?0:req.supplier.supplierBranchId;
                    cb(null);
                }
            })
        }],
        listsupplierorder:['supplierId',function(cb){

            loginFunctions.listSupplierOrderV2(req.dbName,res,supplierId,limit,offset,orderType,tab_status,sub_status,
                serachType,serachText,payment_type,
                start_date,
                end_date,
                function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    // orders
                    data.orders=result.orders;
                    total_order_count=result.total_orders;
                    // if(result.length){
                    //     data.orders=result;
                    // }
                    // else {
                    //     data.orders=[];
                    // }
                    cb(null)
                }
            },supplierBranchId)

        }],
        status:['listsupplierorder',function(cb){
            var final_data=[];    
            var orderHistory= data.orders   
            var leng=orderHistory.length,agentConnection={}
            if(leng>0){
            async.each(orderHistory,async function (i, callback2) 
                {
                    // console.log("===",i.id,i.status,i.is_agent)
                    // if(i.is_agent==1){

                        var getAgentDbData=await common.GetAgentDbInformation(req.dbName);                                               
                        logger.debug("===AGENT==CONNECTION==>>==2=",Object.entries(agentConnection).length)
                        if(Object.entries(agentConnection).length===0){
                           agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                        }  
                        var sqlQuery="select `ors`.`status`,`usr`.`name`,`usr`.`image`,`usr`.`id` as `agent_id` from `cbl_user_orders` ors join `cbl_user` `usr` on `usr`.id=`ors`.`user_id`  where order_id=?";
                        agentConnection.query(sqlQuery,[i.id],function(err,statusData){   
                        console.log("====statusData====",err) 
                        if (err) {
                            sendResponse.somethingWentWrongError(res);
                        }
                        else{       
                            // console.log("====statusData====",statusData)                        
                            if(statusData && statusData.length>0){     
                                                              
                                // i.status=statusData[0].status;
                                i.agent_name=statusData[0].name;
                                i.agent_image=statusData[0].image;
                                i.agent_id=statusData[0].agent_id;                                
                                // i.agent_name=
                                final_data.push(i)
                                callback2(null)
                            }
                            else{
                                final_data.push(i)
                                callback2(null)
                            }
                        }
                    });
                // }
                // else{
                //     final_data.push(i)
                //     callback2(null)
                // }
            
        },function(err) {            
            if (err) {
                cb(err);
            }
            else{                
                var order_data=_.sortBy(final_data,'id').reverse();
                data.orders=order_data
                data.total_order = total_order_count
                cb(null)
            }
          }); 
        }
        else{
            cb(null)
        }
                        
        }],
        totalOrders:['status',function (cb) {
            if(orderType==0){
                var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                    'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                    'join user u on o.user_id=u.id where s.id= ? order by o.id ';
            }
            else if(orderType==1){
                var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                    'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                    'join user u on o.user_id=u.id where s.id= ? and o.status = 0 order by o.id ';

            }
            else if(orderType==2){
                var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                    'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                    'join user u on o.user_id=u.id where s.id= ? and o.status = 0 and o.urgent = 1 order by o.id ';

            }
            else if(orderType==3){
                var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                    'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                    'join user u on o.user_id=u.id where s.id= ? and o.status = 5 order by o.id ';

            }

           /* var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
            'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
            'join user u on o.user_id=u.id where s.id= ? order by o.id';*/

            multiConnection[req.dbName].query(sql,[supplierId],function (err,orders) {
                if(err)
                {
                    console.log('error------',err);
                    sendResponse.somethingWentWrongError(res);

                }
                else {
                    // data.total_order=orders.length;
                    cb(null);
                }
            })
        }]
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })
}

exports.supplierOrderDescription = function (req,res) {
    var accessToken =0 ;
    var sectionId=0;
    var orderId=0;
    var supplierId;
    var data;
    async.auto({
        blankField:function(cb)
        {
            if(req.body && req.body.accessToken && req.body.authSectionId && req.body.orderId)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                orderId= req.body.orderId;
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb)
        {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplierId=result;
                    //console.log("supplierId:  ",supplierId);
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb)
        // {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplierId,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             //console.log("checkauthority complete");
        //             cb(null);
        //         }
        //     });

        // }],
        orderdescription:['blankField','authenticate',function(cb){
            orderFunction.orderDescription(req.dbName,res,orderId,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                     // data.productList = result;
                      data = result
                    cb(null);
                }
            })

        }],
        // getAgentDetail:['orderdescription',async function(cb){
        //     var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
        //     var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
        //     var sql = "select cu.id, cuo.order_id, cu.name, cu.email, cu.image, cu.commission from "+
        //               "cbl_user cu join cbl_user_orders cuo on cu.id = cuo.user_id where cuo.order_id = ?"
        //     let stmt = agentConnection.query(sql,[orderId],function(err,result){
        //         logger.debug("===========statement in get agent detail======",stmt.sql)
        //         if(err){
        //             logger.debug("==========err in get aget detail========",err)
        //             sendResponse.somethingWentWrongError(res);
        //         }else{
        //             data.agentDetail=result
        //             cb(null);
        //         }
        //     })
        //   }]
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })

}

exports.supplierOrderDescriptionV2 = function (req,res) {
    var accessToken =0 ;
    var sectionId=0;
    var orderId=0;
    var supplierId;
    var data;
    async.auto({
        blankField:function(cb)
        {
            if(req.body && req.body.accessToken && req.body.authSectionId && req.body.orderId)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                orderId= req.body.orderId;
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb)
        {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplierId=result;
                    //console.log("supplierId:  ",supplierId);
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb)
        // {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplierId,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             //console.log("checkauthority complete");
        //             cb(null);
        //         }
        //     });

        // }],
        orderdescription:['blankField','authenticate',function(cb){
            orderFunction.orderDescriptionV2(req.dbName,res,orderId,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                     // data.productList = result;
                      data = result
                    cb(null);
                }
            })

        }],
        // getAgentDetail:['orderdescription',async function(cb){
        //     var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
        //     var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
        //     var sql = "select cu.id, cuo.order_id, cu.name, cu.email, cu.image, cu.commission from "+
        //               "cbl_user cu join cbl_user_orders cuo on cu.id = cuo.user_id where cuo.order_id = ?"
        //     let stmt = agentConnection.query(sql,[orderId],function(err,result){
        //         logger.debug("===========statement in get agent detail======",stmt.sql)
        //         if(err){
        //             logger.debug("==========err in get aget detail========",err)
        //             sendResponse.somethingWentWrongError(res);
        //         }else{
        //             data.agentDetail=result
        //             cb(null);
        //         }
        //     })
        //   }]
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })

}

exports.supplierPendingOrders = function(req,res) {
var accessToken=0;
var sectionId=0
var supplier_id=0;
var supplierId=0;
var data;
    async.auto({
        blankField:function(cb)
        {
            if(req.body && req.body.accessToken && req.body.authSectionId)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb)
        {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb)
        // {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        supplierId:['authenticate',function (cb) {
            getId(req.dbName,res,supplier_id,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else
                {
                    supplierId=result[0].supplier_id;
                    cb(null);
                }
            })
        }],
       orderList:['blankField','authenticate','checkauthority','supplierId',function(cb){
           loginFunctions.supplierPendingOrdersList(req.dbName,res,supplierId,function (err,result) {
             if(err)
             {
                 sendResponse.somethingWentWrongError(res);
             }
             else {
             data=result;
                 //console.log('data----',result);
                 cb(null);
             }
         })  
       
       }]
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })
}

exports.supplierConfirmPendingOrder = function (req,res) {
    var accessToken =0 ;
    var sectionId=0;
    var orderId=0;
    var status=0;
    var supplier_id=0;
    var data;
    var reason=0;
    var email=[];
    var deviceToken=0;
    var user_delivery_address=0;
    let ordersPrice=[]
    var userId=0;
    var deviceType=0;
    var supplierId=0;
    var supplierName=0;
    var notificationStatus;
    var notificationLanguage;
    var userEmailId;
    var userName;
    var net_amount;
    var created_on;
    var schedule_date;
    var payment_type;
    var self_pickup=0;
    var offset=req.body.offset!=undefined && req.body.offset!="" && req.body.offset!=null?req.body.offset:4
    var preparation_time = req.body.preparation_time!=undefined?req.body.preparation_time:"00:00:00"
    var delivery_date_time = req.body.delivery_date_time!=undefined?req.body.delivery_date_time:"00:00:00"
    let countryCode = "";
    let  mobileNumber  =  "";
    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId && req.body.orderId && req.body.status)
            {
                if(req.body.status == 1)
                {
                    accessToken=req.body.accessToken;
                    sectionId=req.body.authSectionId;
                    orderId= req.body.orderId;
                    status=req.body.status;
                    cb(null);    
                }
                else 
                {
                    
                    // if(req.body && req.body.reason)
                    // {
                        accessToken=req.body.accessToken;
                        sectionId=req.body.authSectionId;
                        orderId= req.body.orderId;
                        status=req.body.status;
                        reason=req.body.reject_reasons!=undefined && req.body.reject_reasons!=""?req.body.reject_reasons:" ";
                        cb(null);
                    // }
                    // else 
                    // {
                    //     var msq='reason required';
                    //     sendResponse.sendErrorMessage(msq,res,0);
                    // }
                }
                
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb) {
                func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                    if(err)
                    {
                        sendResponse .somethingWentWrongError(res);
                    }
                    else
                    {
                        supplier_id=result;
                        cb(null);
                    }

                },1)
            }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        checkOrderStatus : ['authenticate',function(cb){
            orderFunction.checkOrderStatus(req.dbName,orderId,cb,res)
        }],
        checkOrderPaymentType:['checkOrderStatus',async (cb)=>{
            let sql = "select payment_type,payment_source from orders where id =?"
            let values = [orderId]
            let result=await Execute.Query(req.dbName,sql,values)
            // multiConnection[req.dbName].query(sql, values, function(err, result){
                if(result[0].payment_type==1 && result[0].payment_source=="zelle"){
                    let msg = "Payment mode is zelle and admin does not confirmed yet"
                    sendResponse.sendErrorMessage(msg,res,500);
                }
                else{
                    cb(null);
                }
            // })
        }],
        pendingorder:['checkOrderPaymentType',function(cb){
            orderFunction.confirmPendingOrder(req.dbName,res,orderId,status,reason,
                offset,preparation_time,delivery_date_time,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    cb(null);
                }
            })

        }],
        refundAmount:['pendingorder',async function(cb){
            if(status=="2"){
                await orderFunction.refund_stripe_payments(req.dbName,res,req,orderId);
            }
            cb(null);
        }],   
        //notificationData: ['pendingorder', function (cb) {
        notificationData: ['refundAmount', function (cb) {

                adminOrders.getValue(req.dbName,res, orderId, function (err, values) {
                    console.log(".......log.......",values);
                    if (err) {
                        sendResponse.somethingWentWrongError(res);
                    }
                    else {
                        deviceToken = values.device_token;
                        userId = values.user_id;
                        req.category_id=values.category_id;
                        self_pickup=values.self_pickup;
                        deviceType = values.device_type;
                        supplierId = values.supplier_id;
                        supplierName = values.supplier_name;
                        notificationLanguage = values.notification_language;
                        notificationStatus = values.notification_status;
                        userEmailId =values.email;
                        userName= values.userName;
                        countryCode = values.country_code;
                        mobileNumber  =  values.mobile_no;
                        net_amount= values.net_amount;
                        user_delivery_address=values.user_delivery_address;
                        ordersPrice=values.order_prices;
                        created_on= moment(values.created_on).format('YYYY-MM-DD HH:mm');
                        schedule_date= moment(values.schedule_date).format('YYYY-MM-DD HH:mm');
                        if(values.payment_type==0){
                            payment_type = "cash";
                        }
                        else {
                            payment_type='Online Transaction'
                        }
                        cb(null);
                    }
                });
            }],
        sendPushNotification: ['notificationData',async function (cb) {
            let clientLanguage = await Universal.getClientLanguage(req.dbName);
            if(clientLanguage && clientLanguage.length>0){
                notificationLanguage = 16
            }
                if (status == 1) {
                    if (notificationStatus == 0) {
                        return cb(null);
                    }
                    else {
                        if (deviceType == 0) {
                            // if (notificationLanguage == 14) {
                            //     var data = {
                            //         "status": 0,
                            //         "message":" Your Order Has been Confirmed",
                            //         "orderId":orderId

                            //     }
                            // }
                            // else {
                                var data = {
                                    "status": status,
                                    "message": await Universal.getMsgText(notificationLanguage,req,status),
                                    "orderId":orderId,
                                    "self_pickup":self_pickup

                                }
                            // }
                            /*      message = data.message;
                             console.log("......",message);*/
                            pushNotifications.sendFcmPushNotification(deviceToken,data,req.dbName,function (err, result) {
                                console.log(".........errrrrrr.......",err,result);
                                if (err) {
                                    console.log("err2",err);
                                    cb(null)
                                }
                                else {
                                    //console.log("push sent");
                                    cb(null);
                                }
                            });
                        }
                        else {
                            // if (notificationLanguage == 14) {
                            //     var data = {
                            //         "status": 0,
                            //         "message":"Your Order Has been Confirmed",
                            //         "orderId":orderId

                            //         //  "data": {"supplier_name": supplierName}
                            //     }
                            // }
                            // else {
                                var data = {
                                    "status": status,
                                    "message":await Universal.getMsgText(notificationLanguage,req,status),
                                    "orderId":orderId,
                                    "self_pickup":self_pickup
                                }
                            // }

                            var path ="user";
                            var sound = "ping.aiff";
                            pushNotifications.sendFcmPushNotification(deviceToken,data,req.dbName,function (err, result) {
                                console.log(".........errrrrrr.......",err,result);
                                if (err) {
                                    console.log("err2",err);
                                    cb(null)
                                }
                                else {
                                    //console.log("push sent");
                                    cb(null);
                                }
                            });
                        }
                    }
                }
                else {
                    if (notificationStatus == 0) {
                        return  cb(null);
                    }
                    else {
                        if (deviceType == 0) {
                            // if (notificationLanguage == 14) {
                            //     var data = {
                            //         "status":1,
                            //         "message": "Regret Your Order Has Been Rejected From "+supplierName,
                            //         "orderId":orderId

                            //         //   "data": {"supplier_name": supplierName}
                            //     }
                            // }
                            // else {
                                var data = {
                                    "status":1,
                                    "message": await Universal.getMsgText(notificationLanguage,req,status),
                                    "orderId":orderId,
                                    "self_pickup":self_pickup

                                    //   "data": {"supplier_name": supplierName}
                                }
                            // }
                            message = data.message;
                            pushNotifications.sendFcmPushNotification(deviceToken,data,req.dbName,function (err, result) {
                                 console.log(".........errrrrrr.......",err,result);
                                if (err) {
                                    console.log("err2",err);
                                    cb(null)
                                }
                                else {
                                    //console.log("push sent");
                                    cb(null);
                                }
                            });
                        }
                        else {
                            // if (notificationLanguage == 14) {
                            //     var data = {
                            //         "status":1,
                            //         "message": "Regret Your Order Has Been Rejected From "+supplierName,
                            //         "orderId":orderId


                            //         //  "data": {"supplier_name": supplierName}
                            //     }
                            // }
                            // else {
                                var data = {
                                    "status": 1,
                                    "message":await Universal.getMsgText(notificationLanguage,req,status),
                                    "orderId":orderId,
                                    "self_pickup":self_pickup
                                    //  "data": {"supplier_name": supplierName}
                                }
                            // }
                            var path ="user";
                            var sound = "ping.aiff";
                            pushNotifications.sendFcmPushNotification(deviceToken,data,req.dbName,function (err, result) {
                                  console.log(".........errrrrrr.......",err,result);
                                if (err) {
                                    console.log("err2",err);
                                    cb(null)
                                }
                                else {
                                    //console.log("push sent");
                                    cb(null);
                                }
                            });
                        }
                    }
                }
            }],
            sendUserAgentNotification: ['sendPushNotification', async function (cb) {
                var date1 = moment().utcOffset(offset);
                var progress_date=date1._d
                console.log("........Progress.DAte......",progress_date);
                var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
                var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                var sqlQuery="select cbl_user_orders.*,cbl_user.device_token from cbl_user_orders join cbl_user on cbl_user.id=cbl_user_orders.user_id where order_id=?";
                var user_order_data=await Execute.QueryAgent(agentConnection,sqlQuery,[orderId]);
                if(user_order_data && user_order_data.length>0){
                    user_order_data[0].current_date_time=moment().utcOffset(offset).format("YYYY-MM-DD HH:mm:ss");
                }
                var data = {
                    type: "OrderInProgress",
                    message: await Universal.getMsgText(notificationLanguage,req,status),
                    data: user_order_data && user_order_data.length>0?user_order_data[0]:{},
                    items:[]
                };
                var agent_token=user_order_data && user_order_data.length>0?user_order_data[0].device_token:""
                logger.debug("==Not:DATA!=agent_token=",data,agent_token);
                await pushNotifications.sendFcmPushNotificationToAgent(req.dbName,agent_token,data);
                cb(null)
                // pushNotifications.sendFcmPushNotificationToAgent(agent_token,data,function (err, result) {
                //     console.log(".........errrrrrr.......",err,result);
                //     if (err) {
                //         console.log("err2",err);
                //         cb(null)
                //     }
                //     else {
                //         cb(null);
                //     }
                // });

            }],
        sendMail:['sendPushNotification',function(cb){
                if(status == 1){
                    /* if(notificationLanguage == 14){
                     var subject = "royo.com -Confirmation of Order No "+orderId;
                     var  content ="Dear"+userName+" \n\n";
                     content +="Thank you for placing your order with royo. Your order has been Confirmed. \n\n";
                     content+="Below are the details of your transaction: \n";
                     content+="Total Order Amount:" +net_amount+"\n";
                     content+="Order Place Date: "+created_on+" \n";
                     content+="Expected Delivery Time: "+schedule_date+"\n";
                     content+="Order Ref Number:"+orderId+"\n";
                     content+="Supplier Name:"+supplierName+"\n";
                     content+="Payment Method:"+payment_type+"\n\n";
                     content+="For Further Details, please login to your Account to know Latest Status of your Order. \n\n";
                     content+="Please Do Not Hesitate to contact Us if you need any Further Assistance  \n";
                     content+="Tel: 04- 343 6039  \n";
                     content+=" Email: ops@royo.com  \n";
                     content+="  Or Use Our Live Chat Service to Talk to our Customer Service Representative  \n";
                     content+="Team royo \n";
                     }
                     else {
                     var subject = "كليكات- تم تاكيد طلبك رقم  "+orderId;
                     var  content ="العزيز"+userName+" \n\n";
                     //content +="Thank you for placing your order with royo. Your order has been Confirmed. \n\n";
                     // content+="Below are the details of your transaction: \n";
                     content+="اجمالي قيمه الطلب: " +net_amount+"\n";
                     content+="تاريخ ووقت تنفيذ الطلب: "+created_on+" \n";
                     content+="تاريخ ووقت توصيل الطلب المتوقع: "+schedule_date+"\n";
                     content+="رقم الطلب: "+orderId+"\n";
                     content+="اسم مزود الخدمة: "+supplierName+"\n";
                     content+="طريقه الدفع: "+payment_type+"\n\n";
                     content+="للاطلاع على تفاصيل طلبك ومتابعه حاله طلبك الرجاء الدخول عبر حسابك الى التطبيق. \n\n";
                     content+="الرجاء عدم التردد بالتواصل معنا للحصول على المساعدة والدعم عبر القنوات التأليه: \n";
                     content+="04-343 6039 هاتف:  \n";
                     content+=" ops@royo.comايميل: \n";
                     content+="  او يمكنكم التحدث مباشره مع أحد موظفين خدمه العملاء عن طريق نظام المحادثة للدعم المباشر المتواجد في التطبيق  \n";
                     content+="اخلاء مسؤوليه \n";
                     }*/
                    emailTemp.acceptOrder(self_pickup,req,req.dbName,res,AdminMail,userName,net_amount,created_on,schedule_date,orderId,supplierName,supplierName,payment_type,userEmailId,notificationLanguage,function(err,result){
                        if(err){
                            console.log("..****fb register email*****....",err);
                        }
                    })

                }
                else{
                    emailTemp.orderRejections(self_pickup,req,req.dbName,res,AdminMail,userName,net_amount,created_on,schedule_date,orderId,supplierName,supplierName,payment_type,userEmailId,notificationLanguage,function(err,result){
                        if(err){
                            console.log("..****rejection email*****....",err);
                        }
                    })
                }
                cb(null)

            }],
            changeAgentOrderStatus: ['sendMail',async function (cb) {
                var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
                var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                var sqlQuery="update cbl_user_orders set status=? where order_id=?";
                agentConnection.query(sqlQuery,[status,orderId],async function(err,agentData){
                logger.debug("===============adminOrder===agent connection======1===",err)
                    if (err) {
                        logger.debug("===============adminOrder===agent connection======2===",err)
                        sendResponse.somethingWentWrongError(res);
                    }
                    else{
                        cb(null)
                    }
                });
            }],
        savePushNotification: ['sendPushNotification',async function (cb) {
                if (notificationStatus == 0) {
                    cb(null);
                }
                else {
                    let notification_message = await Universal.getMsgText(notificationLanguage,req,status)
                    if(notificationLanguage ==14){
                        
                        if (status == 1) {
                            adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_ACCEPTED,notification_message,cb)
                        }
                        else {
                            adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_REJECTED,notification_message,cb)
                        }
                    }
                    else {
                        if (status == 1) {
                            adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_ACCEPTED,notification_message, cb)
                        }
                        else {
                            adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_REJECTED,notification_message, cb)
                        }
                    }
                }
            }],
            shipStationOrderAdding: ['savePushNotification',async function (cb) {
                try{
                     let shipStationData=await Universal.getShippingData(req.dbName);
                     let is_decimal_quantity_allowed_val=await Universal.is_decimal_quantity_allowed(req.dbName)
                    var is_decimal_quantity_allowed = "0";
                    if(is_decimal_quantity_allowed_val[0] && is_decimal_quantity_allowed_val[0].value){
                        is_decimal_quantity_allowed = is_decimal_quantity_allowed_val[0].value
                    }
                     logger.debug("=====shipStationData===>>",shipStationData);
                     if(Object.keys(shipStationData).length>0){
                         let user_address_data=await Execute.Query(req.dbName,"select * from user_address where id=?",[user_delivery_address]);
                         let orderData={
                             "orderNumber": "JUSTCBD-"+orderId,
                             "orderDate": created_on,
                             "orderStatus": "awaiting_shipment",
                             "customerId": userId,
                             "customerUsername": userName,
                             "customerEmail": userEmailId,
                             "billTo": {
                                "name": userName
                             },
                             "shipTo": {
                             "name": userName,
                             "street1": user_address_data && user_address_data.length>0?user_address_data[0].address_line_1:"",
                             "street2": user_address_data && user_address_data.length>0?user_address_data[0].customer_address:"",
                             "phone": user_address_data && user_address_data.length>0?user_address_data[0].phone_number:"",
                             "postalCode":user_address_data && user_address_data.length>0?user_address_data[0].pincode:"",
                             "city":user_address_data && user_address_data.length>0?user_address_data[0].city:"",
                             "state":user_address_data && user_address_data.length>0?user_address_data[0].city:"",
                             "country":user_address_data && user_address_data.length>0?user_address_data[0].city:"",
                             "residential": false
                             },
                             "items": [
                             ],
                             "amountPaid": parseFloat(net_amount),
                             "customerNotes": "Please ship as soon as possible!",
                             "paymentMethod": payment_type
                         }
                         if(ordersPrice && ordersPrice.length>0){
                             for(const [index,i] of ordersPrice.entries()){
                                 var i_quantity = parseInt(i.quantity)
                                if(is_decimal_quantity_allowed == "1"){
                                    i_quantity = parseFloat(i.quantity)
                                }
                                 orderData.items.push(
                                     {
                                     
                                         "name": i.product_name,
                                         "imageUrl": i.image_path,
                                         "quantity": i_quantity,
                                         "unitPrice": parseFloat(i.price),
                                         "taxAmount": parseFloat(i.handling_admin),
                                         "warehouseLocation": i.supplier_address,
                                         "productId": i.product_id
                                     }
                                 )
                             }
                         }
                         await Universal.addOrderInShipStation(shipStationData,orderData);
                         cb(null)
                     }
                     else{
                         cb(null)
                     }
                     
                }
                catch(Err){
                    logger.debug("====ShipStattionError==",Err)
                    cb(null)
                }
            }],
        sendTextMsgToUser:['shipStationOrderAdding',async function(cb){

                let twiliodata=await Universal.getTwilioData(req.dbName);
                let bandWidthData = await Universal.getBandwidthData(req.dbName);
                let notification_message = await Universal.getMsgText(notificationLanguage,req,status)
                let semaphoreData = await Universal.getSemaPhoreData(req.dbName);

                let allowTextMsgOnStatusChange = await Execute.Query(req.dbName,
                    "select `key`,value from tbl_setting where `key`=? and value=1",
                    ["allowTextMsgOnStatusChange"]
                )
                
            
                if(Object.keys(twiliodata).length>0 && allowTextMsgOnStatusChange.length>0 ){
            
                    var client = require('twilio')(twiliodata[config.get("twilio.s_id")],twiliodata[config.get("twilio.auth_key")]);
                    var smsOptions = {
                        from: twiliodata[config.get("twilio.number_key")],
                        to: countryCode + mobileNumber.toString().replace(/\s/g,''),
                        body: notification_message
                    };
                    logger.debug("=====smsOptions=>>==",smsOptions)
                    client.messages.create(smsOptions, function (err, message) {
                        console.log("=========Twilio==ER!==",err,message)
                        cb(null);
                    });
                }    else if (Object.keys(bandWidthData).length>0
                && allowTextMsgOnStatusChange.length>0 ){
                  
                 await  smsManager.bandwidth(notification_message,
                       countryCode + mobileNumber.toString().replace(/\s/g,''),
                       bandWidthData.bandwidth_basic_auth_user_name,
                       bandWidthData.bandwidth_basic_auth_password,
                       bandWidthData.bandwidth_application_id,
                       bandWidthData.bandwidth_user_id,
                       bandWidthData.bandwidth_from_number
                        )
                        cb(null)
               }else if(Object.keys(semaphoreData).length>0 && 
               allowTextMsgOnStatusChange.length>0){
                   await Universal.sendSemaphoreMessage(
                       semaphoreData.semaphore_apikey,
                       semaphoreData.semaphore_sendername,
                       message,
                       mobileNumber.toString().replace(/\s/g,'')
                       )
               }else{
                   logger.debug("=============keys not found========",twiliodata);
                   cb(null)
               }
            }]
    }, 
        function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            data=[];
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })
}

exports.supplierOrderShipped = function (req,res) {
    var accessToken = 0;
    var sectionId=0;
    var orderId=0;
    var status=0;
    var supplier_id=0;
    var data;
    var offset=req.body.offset!=undefined && req.body.offset!="" && req.body.offset!=null?req.body.offset:4
    var  deviceToken , userId, deviceType, supplierId,
    supplierName ,
    notificationLanguage ,
    notificationStatus ,
    userEmailId,
    userName,
    net_amount,
    created_on,
    schedule_date,payment_type,self_pickup=0;
    let countryCode = "";
    let  mobileNumber  =  "";

    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId && req.body.orderId && req.body.status)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                orderId= req.body.orderId;
                status=req.body.status;
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb) {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        ShippedOrder:['blankField','authenticate',function(cb){
            orderFunction.orderShipped(req.dbName,res,orderId,status,offset,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    cb(null);
                }
            })

        }],
        changeAgentOrder:['ShippedOrder',async function(cb){
            try{
            var bQuery="select is_agent,user_id from orders where id=?"
            // multiConnection[req.dbName].query(bQuery,[orderId],async function(err,data){
            //     if (err) {
            //         sendResponse.somethingWentWrongError(res);
            //     }
            //     else{
                let data=await Execute.Query(req.dbName,bQuery,[orderId])
                    if(data && data.length>0){
                        var date1 = moment().utcOffset(offset);
                        var on_the_way_date=date1._d
                        console.log("........Progress.DAte......",on_the_way_date);
                        var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
                        var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                        var sqlQuery="update cbl_user_orders set status=?,shipped_on=? where order_id=? and customer_id=?";
                        agentConnection.query(sqlQuery,[status,on_the_way_date,orderId,data[0].user_id],async function(err,agentData){
                        //    console.log(err)
                            if (err) {
                                sendResponse.somethingWentWrongError(res);
                            }
                            else{
                                cb(null)
                            }
                        });
                    }
                    else{
                        cb(null)
                    }
                }
                catch(Err){
                    logger.debug("===Err!==",Err);
                    sendResponse.somethingWentWrongError(res);
                }
                //     }
                // })
          }],
          notificationData: ['changeAgentOrder', function (cb) {
            adminOrders.getValue(req.dbName,res, orderId, function (err, values) {
                console.log(".......log.......",values);
                if (err) {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    deviceToken = values.device_token;
                    userId = values.user_id;
                    self_pickup=self_pickup;
                    req.category_id=values.category_id;
                    deviceType = values.device_type;
                    supplierId = values.supplier_id;
                    supplierName = values.supplier_name;
                    notificationLanguage = values.notification_language;
                    notificationStatus = values.notification_status;
                    userEmailId =values.email;
                    userName= values.userName;
                    countryCode = values.country_code;
                    mobileNumber  =  values.mobile_no;
                    net_amount= values.net_amount;
                    created_on= moment(values.created_on).format('YYYY-MM-DD HH:mm');
                    schedule_date= moment(values.schedule_date).format('YYYY-MM-DD HH:mm');
                    if(values.payment_type==0){
                        payment_type = "cash";
                    }
                    else {
                        payment_type='Online Transaction'
                    }
                    cb(null);
                }
            });
        }],
          sendUserPushNotification: ['notificationData', async function (cb) {
            let clientLanguage = await Universal.getClientLanguage(req.dbName);
            if(clientLanguage && clientLanguage.length>0){
                notificationLanguage = 16
            }
            if(notificationStatus==0){
                cb(null)
            }
            else {
                var data = {
                    "status": notificationStatus,
                    "message": await Universal.getMsgText(notificationLanguage, req, status),
                    "orderId": orderId,
                    "self_pickup": self_pickup
                }
                pushNotifications.sendFcmPushNotification(deviceToken, data, req.dbName,function (err, result) {
                    console.log(".........errrrrrr.......", err, result);
                    if (err) {
                        console.log("err2", err);
                        cb(null)
                    } else {
                        cb(null);
                    }
                });
            }
        }],
        savePushNotification: ['sendUserPushNotification',async function (cb) {
            if (notificationStatus == 0) {
                cb(null);
            }
            else {
                let message = await Universal.getMsgText(notificationLanguage, req, status);
                if(notificationLanguage ==14){
                    if (status == 1) {
                        adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_ACCEPTED,message,cb)
                    }
                    else {
                        adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_REJECTED,message,cb)
                    }
                }
                else {
                    if (status == 1) {
                        adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_ACCEPTED,message, cb)
                    }
                    else {
                        adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_REJECTED,message, cb)
                    }
                }
            }
        }],
        sendTextMsgToUser:['savePushNotification',async function(cb){

            let twiliodata=await Universal.getTwilioData(req.dbName);

            let bandWidthData = await Universal.getBandwidthData(req.dbName);
            let notification_message = await Universal.getMsgText(notificationLanguage,req,status)
            let semaphoreData = await Universal.getSemaPhoreData(req.dbName);

            let allowTextMsgOnStatusChange = await Execute.Query(req.dbName,
                "select `key`,value from tbl_setting where `key`=? and value=1",
                ["allowTextMsgOnStatusChange"]
            )
            
        
            if(Object.keys(twiliodata).length>0 && allowTextMsgOnStatusChange.length>0 ){
        
                var client = require('twilio')(twiliodata[config.get("twilio.s_id")],twiliodata[config.get("twilio.auth_key")]);
                var smsOptions = {
                    from: twiliodata[config.get("twilio.number_key")],
                    to: countryCode + mobileNumber.toString().replace(/\s/g,''),
                    body: notification_message
                };
                logger.debug("=====smsOptions=>>==",smsOptions)
                client.messages.create(smsOptions, function (err, message) {
                    console.log("=========Twilio==ER!==",err,message)
                    cb(null);
                });
            }else if (Object.keys(bandWidthData).length>0
            && allowTextMsgOnStatusChange.length>0 ){
              
              await smsManager.bandwidth(notification_message,
                   countryCode + mobileNumber.toString().replace(/\s/g,''),
                   bandWidthData.bandwidth_basic_auth_user_name,
                   bandWidthData.bandwidth_basic_auth_password,
                   bandWidthData.bandwidth_application_id,
                   bandWidthData.bandwidth_user_id,
                   bandWidthData.bandwidth_from_number
                    )
                    cb(null)
           }else if(Object.keys(semaphoreData).length>0 && 
           allowTextMsgOnStatusChange.length>0){
               await Universal.sendSemaphoreMessage(
                   semaphoreData.semaphore_apikey,
                   semaphoreData.semaphore_sendername,
                   message,
                   mobileNumber.toString().replace(/\s/g,'')
                   )
           }else{
               logger.debug("=============keys not found========",twiliodata);
               cb(null)
           }
        }]
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);

        }else{
            data=[];
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);        }
    })
}

exports.supplierOrderInProgress = function (req,res) {
    var accessToken = 0;
    var sectionId=0;
    var orderId=0;
    var status=0;
    var supplier_id=0;
    var data;
    var offset=req.body.offset!=undefined && req.body.offset!="" && req.body.offset!=null?req.body.offset:4
    var  deviceToken , userId, deviceType, supplierId,
    supplierName ,
    notificationLanguage ,
    notificationStatus ,
    userEmailId,
    userName,
    net_amount,
    created_on,
    schedule_date,payment_type,
    self_pickup=0;
    let countryCode = "";
    let  mobileNumber  =  "";

    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId && req.body.orderId && req.body.status)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                orderId= req.body.orderId;
                status=req.body.status;
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb) {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        ShippedOrder:['blankField','authenticate',function(cb){
            
            orderFunction.orderInProgress(req.dbName,res,orderId,status,offset,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    cb(null);
                }
            })

        }],
        
        changeAgentOrder:['ShippedOrder',async function(cb){
            // var bQuery="select is_agent,user_id from orders where id=? and is_agent=?"
            // multiConnection[req.dbName].query(bQuery,[orderId,1],async function(err,data){
            //     if (err) {
            //         sendResponse.somethingWentWrongError(res);
            //     }
            //     else{
            //         if(data && data.length>0){
                        var date1 = moment().utcOffset(offset);
                        var progress_date=date1._d
                        console.log("........Progress.DAte......",progress_date);
                        var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
                        var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                        var sqlQuery="update cbl_user_orders set status=?,progress_on=? where order_id=?";
                        agentConnection.query(sqlQuery,[status,progress_date,orderId],async function(err,agentData){
                        //    console.log(err)
                            if (err) {
                                sendResponse.somethingWentWrongError(res);
                            }
                            else{
                                cb(null)
                            }
                        });
                //     }
                //     else{
                //         cb(null)
                //     }
                //     }
                // })
          }],
          notificationData: ['changeAgentOrder', function (cb) {
            adminOrders.getValue(req.dbName,res, orderId, function (err, values) {
                console.log(".......log.......",values);
                if (err) {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    deviceToken = values.device_token;
                    userId = values.user_id;
                    deviceType = values.device_type;
                    req.category_id=values.category_id;
                    supplierId = values.supplier_id;
                    supplierName = values.supplier_name;
                    notificationLanguage = values.notification_language;
                    notificationStatus = values.notification_status;
                    userEmailId =values.email;
                    userName= values.userName;
                    countryCode = values.country_code;
                    mobileNumber  =  values.mobile_no;
                    net_amount= values.net_amount;
                    created_on= moment(values.created_on).format('YYYY-MM-DD HH:mm');
                    schedule_date= moment(values.schedule_date).format('YYYY-MM-DD HH:mm');
                    if(values.payment_type==0){
                        payment_type = "cash";
                    }
                    else {
                        payment_type='Online Transaction'
                    }
                    cb(null);
                }
            });
        }],
          sendUserPushNotification: ['notificationData', async function (cb) {
            let clientLanguage = await Universal.getClientLanguage(req.dbName);
            if(clientLanguage && clientLanguage.length>0){
                notificationLanguage = 16
            }
              var data = {
                  "status": status,
                  "message": await Universal.getMsgText(notificationLanguage, req, status),
                  "orderId": orderId,
                  "self_pickup": self_pickup
              }
              logger.debug("+====================data for notif=++++++", data, notificationLanguage, req.service_type, status)

              pushNotifications.sendFcmPushNotification(deviceToken, data,req.dbName, function (err, result) {
                  console.log(".........errrrrrr.......", err, result);
                  if (err) {
                      console.log("err2", err);
                      cb(null)
                  } else {
                      cb(null);
                  }
              });

        }],
        sendUserAgentNotification: ['sendUserPushNotification', async function (cb) {
                        var date1 = moment().utcOffset(offset);
                        var progress_date=date1._d
                        console.log("........Progress.DAte......",progress_date);
                        var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
                        var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                        var sqlQuery="select cbl_user_orders.*,cbl_user.device_token from cbl_user_orders join cbl_user on cbl_user.id=cbl_user_orders.user_id where order_id=?";
                        var user_order_data=await Execute.QueryAgent(agentConnection,sqlQuery,[orderId])
                        if(user_order_data && user_order_data.length>0){
                            user_order_data[0].current_date_time=moment().utcOffset(offset).format("YYYY-MM-DD HH:mm:ss");
                            }
                        var data = {
                            type: "OrderInProgress",
                            "message": await Universal.getMsgText(notificationLanguage, req, status),
                            data: user_order_data && user_order_data.length>0?user_order_data[0]:{},
                            items:[]
                        };
                        var agent_token=user_order_data && user_order_data.length>0?user_order_data[0].device_token:""
                        logger.debug("==Not:DATA!=agent_token=",data,agent_token);
                        await pushNotifications.sendFcmPushNotificationToAgent(req.dbName,agent_token,data);
                        cb(null)
                        // pushNotifications.sendFcmPushNotificationToAgent(agent_token,data,function (err, result) {
                        //     console.log(".........errrrrrr.......",err,result);
                        //     if (err) {
                        //         console.log("err2",err);
                        //         cb(null)
                        //     }
                        //     else {
                        //         cb(null);
                        //     }
                        // });

        }],
        savePushNotification: ['sendUserAgentNotification',async function (cb) {
            if (notificationStatus == 0) {
                cb(null);
            }
            else {
                    let notification_message = await Universal.getMsgText(notificationLanguage, req, status)
                if(notificationLanguage ==14){
                    if (status == 1) {
                        adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_ACCEPTED,notification_message,cb)
                    }
                    else {
                        adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_REJECTED,notification_message,cb)
                    }
                }
                else {
                    if (status == 1) {
                        adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_ACCEPTED,notification_message, cb)
                    }
                    else {
                        adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_REJECTED,notification_message, cb)
                    }
                }
            }
        }],
        sendTextMsgToUser:['savePushNotification',async function(cb){

            let twiliodata=await Universal.getTwilioData(req.dbName);
            let allowTextMsgOnStatusChange = await Execute.Query(req.dbName,
                "select `key`,value from tbl_setting where `key`=? and value=1",
                ["allowTextMsgOnStatusChange"]
            )
            let bandWidthData = await Universal.getBandwidthData(req.dbName);
            let notification_message = await Universal.getMsgText(notificationLanguage,req,status)
            let semaphoreData = await Universal.getSemaPhoreData(req.dbName);

        
            if(Object.keys(twiliodata).length>0 && allowTextMsgOnStatusChange.length>0 ){
        
                var client = require('twilio')(twiliodata[config.get("twilio.s_id")],twiliodata[config.get("twilio.auth_key")]);
                var smsOptions = {
                    from: twiliodata[config.get("twilio.number_key")],
                    to: countryCode + mobileNumber.toString().replace(/\s/g,''),
                    body: notification_message
                };
                logger.debug("=====smsOptions=>>==",smsOptions)
                client.messages.create(smsOptions, function (err, message) {
                    console.log("=========Twilio==ER!==",err,message)
                    cb(null);
                });
            }else if (Object.keys(bandWidthData).length>0
            && allowTextMsgOnStatusChange.length>0 ){
              
             await smsManager.bandwidth(notification_message,
                   countryCode + mobileNumber.toString().replace(/\s/g,''),
                   bandWidthData.bandwidth_basic_auth_user_name,
                   bandWidthData.bandwidth_basic_auth_password,
                   bandWidthData.bandwidth_application_id,
                   bandWidthData.bandwidth_user_id,
                   bandWidthData.bandwidth_from_number
                    )
                    cb(null)
           }else if(Object.keys(semaphoreData).length>0 && 
           allowTextMsgOnStatusChange.length>0){
               await Universal.sendSemaphoreMessage(
                   semaphoreData.semaphore_apikey,
                   semaphoreData.semaphore_sendername,
                   message,
                   mobileNumber.toString().replace(/\s/g,'')
                   )
}
else{
               logger.debug("=============keys not found========",twiliodata);
               cb(null)
           }
        }]
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);

        }else{
            data=[];
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);        }
    })
}
exports.supplierOrderNearby = function (req,res) {
    var accessToken = 0;
    var sectionId=0;
    var orderId=0;
    var status=0;
    var supplier_id=0;
    var data;
    var offset=req.body.offset!=undefined && req.body.offset!="" && req.body.offset!=null?req.body.offset:4
    let countryCode = "";
    let  mobileNumber  =  "";
    
    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId && req.body.orderId && req.body.status)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                orderId= req.body.orderId;
                status=req.body.status;
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb) {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,0, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        OrderNearby:['blankField','authenticate',function(cb){

            orderFunction.orderNearby(req.dbName,res,orderId,status,offset,req.service_type,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    cb(null);
                }
            })

        }],
        notificationData: ['OrderNearby', function (cb) {
            adminOrders.getValue(req.dbName,res, orderId, function (err, values) {
                console.log(".......log.......",values);
                if (err) {
                    sendResponse.somethingWentWrongError(res);
                }            
                else {
                    deviceToken = values.device_token;
                    userId = values.user_id;
                    deviceType = values.device_type;
                    supplierId = values.supplier_id;
                    supplierName = values.supplier_name;
                    self_pickup=values.self_pickup;
                    notificationLanguage = values.notification_language;
                    notificationStatus = values.notification_status;
                    userEmailId =values.email;
                    userName= values.userName;
                    countryCode = values.country_code;
                    mobileNumber  =  values.mobile_no;
                    net_amount= values.net_amount;
                    created_on= moment(values.created_on).format('YYYY-MM-DD HH:mm');
                    schedule_date= moment(values.schedule_date).format('YYYY-MM-DD HH:mm');
                    if(values.payment_type==0){
                        payment_type = "cash";
                    }
                    else {
                        payment_type='Online Transaction'
                    }
                    cb(null);
                }
            });
        }],
        changeAgentOrderStatus: ['notificationData', async function (cb) {
            //     var bQuery="select is_agent,user_id from orders where id=? and is_agent=?"
            //    let stmt  =  multiConnection[req.dbName].query(bQuery,[orderId,1],async function(err,data){
            //        logger.debug("=============sttm===========.swql===",stmt.sql)
            //         if (err) {
            //             sendResponse.somethingWentWrongError(res);
            //         }
            //         else{
            //             if(data && data.length>0){
                            var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
                            var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                            var date10 = moment().utcOffset(offset);
                            var reached_on=date10._d;
                            var sqlQuery="update cbl_user_orders set status=?,reached_on=? where order_id=? and customer_id=?";
                            let stmt2 = agentConnection.query(sqlQuery,[status,reached_on,orderId,userId],async function(err,agentData){                        
                                logger.debug("=============sttm===========.swql==222=",stmt2.sql)
                                if (err) {
                                    sendResponse.somethingWentWrongError(res);
                                }
                                else{

                                    let query1 = "select id from cbl_user_orders where id=? and progress_on='0000-00-00 00:00:00' and customer_id=?";
                                    let result1 = await agentConnection.query(query1,[orderId,userId]);
                                    if(result1 && result1.length){
                                        var sql1= 'update cbl_user_orders set progress_on=? where id=?  and customer_id=?';
                                        await agentConnection.query(sql1,[reached_on,orderid,userId]);
                                    }
                                    cb(null)
                                }
                            });
                //         }
                //         else{
                //             cb(null)
                //         }
                //     }
                // })
        }],
        sendUserPushNotification: ['changeAgentOrderStatus', async function (cb) {
                if(notificationStatus==0){
                    cb(null)
                }
                else {
                    var data = {
                        "status": status,
                        "message": await Universal.getMsgText(notificationLanguage, req, status),
                        "orderId": orderId
                    }
                    pushNotifications.sendFcmPushNotification(deviceToken, data,req.dbName, function (err, result) {
                        console.log(".........errrrrrr.......", err, result);
                        if (err) {
                            console.log("err2", err);
                            cb(null)
                        } else {
                            cb(null);
                        }
                    });
                }
    
            }],
        sendUserAgentNotification: ['sendUserPushNotification', async function (cb) {
                var date1 = moment().utcOffset(offset);
                var progress_date=date1._d
                console.log("........Progress.DAte......",progress_date);
                var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
                var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                var sqlQuery="select cbl_user_orders.*,cbl_user.device_token from cbl_user_orders join cbl_user on cbl_user.id=cbl_user_orders.user_id where order_id=?";
                var user_order_data=await Execute.QueryAgent(agentConnection,sqlQuery,[orderId]);
                if(user_order_data && user_order_data.length>0){
                    user_order_data[0].current_date_time=moment().utcOffset(offset).format("YYYY-MM-DD HH:mm:ss");
                }
                var data = {
                    type: "OrderReadyToBePicked",
                    message: await Universal.getMsgText(notificationLanguage,req,status),
                    data: user_order_data && user_order_data.length>0?user_order_data[0]:{},
                    items:[]
                };
                var agent_token=user_order_data && user_order_data.length>0?user_order_data[0].device_token:""
                logger.debug("==Not:DATA!=agent_token=",data,agent_token);
                await pushNotifications.sendFcmPushNotificationToAgent(req.dbName,agent_token,data);
                cb(null)
                // pushNotifications.sendFcmPushNotificationToAgent(agent_token,data,function (err, result) {
                //     console.log(".........errrrrrr.......",err,result);
                //     if (err) {
                //         console.log("err2",err);
                //         cb(null)
                //     }
                //     else {
                //         cb(null);
                //     }
                // });
    
            }],
        sendTextMsgToUser:['sendUserAgentNotification',async function(cb){

                let twiliodata=await Universal.getTwilioData(req.dbName);
                let allowTextMsgOnStatusChange = await Execute.Query(req.dbName,
                    "select `key`,value from tbl_setting where `key`=? and value=1",
                    ["allowTextMsgOnStatusChange"]
                )
                let bandWidthData = await Universal.getBandwidthData(req.dbName);
                let semaphoreData = await Universal.getSemaPhoreData(req.dbName);

                let notification_message = await Universal.getMsgText(notificationLanguage,req,status)

                if(Object.keys(twiliodata).length>0 && allowTextMsgOnStatusChange.length>0 ){
            
                    var client = require('twilio')(twiliodata[config.get("twilio.s_id")],twiliodata[config.get("twilio.auth_key")]);
                    var smsOptions = {
                        from: twiliodata[config.get("twilio.number_key")],
                        to: countryCode + mobileNumber.toString().replace(/\s/g,''),
                        body: notification_message
                    };
                    logger.debug("=====smsOptions=>>==",smsOptions)
                    client.messages.create(smsOptions, function (err, message) {
                        console.log("=========Twilio==ER!==",err,message)
                        cb(null);
                    });
                }else if (Object.keys(bandWidthData).length>0
                && allowTextMsgOnStatusChange.length>0 ){
                  
                 await  smsManager.bandwidth(notification_message,
                       countryCode + mobileNumber.toString().replace(/\s/g,''),
                       bandWidthData.bandwidth_basic_auth_user_name,
                       bandWidthData.bandwidth_basic_auth_password,
                       bandWidthData.bandwidth_application_id,
                       bandWidthData.bandwidth_user_id,
                       bandWidthData.bandwidth_from_number
                        )
                        cb(null)
               }
               else if(Object.keys(semaphoreData).length>0 && 
                           allowTextMsgOnStatusChange.length>0){
                               await Universal.sendSemaphoreMessage(
                                   semaphoreData.semaphore_apikey,
                                   semaphoreData.semaphore_sendername,
                                   message,
                                   mobileNumber.toString().replace(/\s/g,'')
                                   )
               }
               else{
                   logger.debug("=============keys not found========",twiliodata);
                   cb(null)
               }
            }]    
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            data=[];
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })
}
/**
 * @description used for order delivered by supplier
 */
exports.supplierDeliveredOrder = function (req,res) {

    var accessToken = 0;

    var sectionId=0;
    var orderId=0;
    var status=0;
    var supplier_id=0;
    var data;
    var email=[];
    var deviceToken=0;
    var userId=0;
    var deviceType=0;
    var supplierId=0;
    var supplierName=0;
    var notificationStatus;
    var notificationLanguage;
    var offset=req.body.offset!=undefined && req.body.offset!="" && req.body.offset!=null?req.body.offset:4
    var  deviceToken , userId, deviceType, supplierId,
    supplierName ,
    notificationLanguage ,
    notificationStatus ,
    userEmailId,
    userName,
    net_amount,
    created_on,
    schedule_date,payment_type,self_pickup=0;
    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId && req.body.orderId && req.body.status)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                orderId= req.body.orderId;
                status=req.body.status;
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb) {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        isAlreadyDelivered: ['authenticate', async function (cb) {
            try{
                let orderData=await Execute.Query(req.dbName,`select id from orders where id=? and status=?`,[orderId,status]);
                logger.debug("========>>")
                if(orderData && orderData.length>0){
                                var msg = "order is already delivered";
                                return sendResponse.sendErrorMessage(msg, res, 400);
                }
                else{
                    cb(null)
                }
            }
            catch(Err){
                logger.debug("======Err!==",Err)
                sendResponse.somethingWentWrongError(res);
            }
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        changeAgentOrder:['authenticate','isAlreadyDelivered',async function(cb){
            // var bQuery="select is_agent,user_id from orders where id=? and is_agent=?"
            // multiConnection[req.dbName].query(bQuery,[orderId,1],async function(err,data){
            //     if (err) {
            //         sendResponse.somethingWentWrongError(res);
            //     }
            //     else{

                    // if(data && data.length>0){
                        var getAgentDbData=await common.GetAgentDbInformation(req.dbName);
                        var agentConnection=await common.RunTimeAgentConnection(getAgentDbData);
                        var netAmmountAndCommission = await getOrderNetAmmountAndCommission(agentConnection,orderId)
                        if(netAmmountAndCommission && netAmmountAndCommission.length>0){
                            let deliveryChargeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=? and `value`=?",["commission_delivery_wise","1"])
                            logger.debug("===deliveryChargeData===",deliveryChargeData)
                            let calculateCommission=0;
                            if(deliveryChargeData && deliveryChargeData.length>0){
                                    calculateCommission = await calculateTotalCommission(agentConnection,netAmmountAndCommission[0].delivery_charges,netAmmountAndCommission[0].user_id,req.dbName,orderId)
                                 
                            }
                            else{
                                calculateCommission = await calculateTotalCommission(agentConnection,netAmmountAndCommission[0].net_amount,netAmmountAndCommission[0].user_id,req.dbName,orderId)
                            }
                            console.log("111111111111111111111111111")
                            let query5 = "select (SELECT value FROM "+req.dbName+".`tbl_setting` WHERE `key` = 'is_enabled_agent_base_price' LIMIT 1) is_enabled_agent_base_price, (SELECT value FROM "+req.dbName+".`tbl_setting` WHERE `key` = 'allow_agentwallet_to_pay_for_cashorder' LIMIT 1) allow_agentwallet_to_pay_for_cashorder,cuo.payment_type, cu.base_price,cu.delivery_charge_share from cbl_user_orders cuo left join cbl_user cu on cuo.user_id=cu.id where order_id=?";
                            let result5 = await Execute.QueryAgent(agentConnection,query5,[orderId]);

                            if(result5[0] && result5[0].payment_type=="0" && result5[0].allow_agentwallet_to_pay_for_cashorder && result5[0].allow_agentwallet_to_pay_for_cashorder=="1"){
                                console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",result5)
                                
                                var agentOrderDetails = await Execute.QueryAgent(agentConnection,"SELECT (select wallet_amount from cbl_user where id=cbl_user_orders.user_id) as agent_wallet_balance, `tip_agent`, `commission_ammount`,`net_amount`, agent_base_price, agent_delivery_charge_share,user_id,(net_amount - (tip_agent + commission_ammount + agent_base_price + agent_delivery_charge_share)) amount_payable, (tip_agent + commission_ammount + agent_base_price + agent_delivery_charge_share) agent_amount FROM `cbl_user_orders` WHERE order_id=?",[orderId]);
                                console.log("ccccccccccccccccccccccccccccccc",agentOrderDetails)
                                if(agentOrderDetails[0].agent_wallet_balance < agentOrderDetails[0].amount_payable){
                                    console.log("dddddddddddddddddddddddd")
                                    var message = "Delivery boy do not have enough balance in wallet";
                                    return sendResponse.sendErrorMessage(message, res, 400)
                                }else{
                                    console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
                                    let query1 = "update cbl_user set wallet_amount=wallet_amount-? where id=?"
                                    let params1 = [agentOrderDetails[0].amount_payable,agentOrderDetails[0].user_id]
                                    await Execute.QueryAgent(agentConnection,query1,params1);
                                    await agentPayablePayment(req.dbName, res, agentOrderDetails[0].agent_amount,orderId, agentOrderDetails[0].user_id)
                                }
                            }
                            
                            if(result5[0] && result5[0].is_enabled_agent_base_price  && result5[0].is_enabled_agent_base_price=="1"){
                                var data_to_update = "";
                                if(result5[0].base_price && result5[0].base_price!="0"){
                                    data_to_update = "agent_base_price='"+result5[0].base_price+"'"
                                }
                                if(result5[0].delivery_charge_share && result5[0].delivery_charge_share!="0"){
                                    if(data_to_update!=""){
                                        data_to_update += ","
                                    }
                                    data_to_update += "agent_delivery_charge_share='"+result5[0].delivery_charge_share+"'"
                                }
                                if(data_to_update!=""){
                                    await Execute.QueryAgent(agentConnection,"update cbl_user_orders set "+data_to_update+" where order_id=?",[orderId]);
                                    await multiConnection[req.dbName].query("update orders set "+data_to_update+" where id =?",[orderId])
                                }
                            }
                            // await updateAgentCommission(agentConnection,netAmmountAndCommission[0].cbl_id,calculateCommission)
                            logger.debug("========final calculated commission ammoutn======",calculateCommission)
                            var date10 = moment().utcOffset(offset);
                            var delivered_on=date10._d;
                            var sqlQuery="update cbl_user_orders set status=?,delivered_on=?,commission_ammount=? where order_id=?";
                            agentConnection.query(sqlQuery,[status,delivered_on,calculateCommission,orderId],async function(err,agentData){                        
                               if (err) {
                                    sendResponse.somethingWentWrongError(res);
                                }
                                else{
                                    cb(null)
                                }
                            });
                        }else{
                            cb(null)
                        }
                    // }
                    // else{
                    //     cb(null)
                    // }
                //     }
                // })
          }],
        deliveredOrder:['blankField','authenticate','changeAgentOrder',function(cb){
            orderFunction.deliveredOrder(req.dbName,res,orderId,status,offset,req.service_type,function (err,result) {
                console.log("..........err........deliver....result.........",err,result);
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    cb(null);
                }
            })

        }],
        payToAgentAndSupplier: ['deliveredOrder', function (cb) {

            orderFunction.payToAgentAndSupplier(req.dbName,res, orderId, function (err, result) {
                console.log("..........err........deliver....result.........",err,result);
                
                if (err) {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    cb(null);
                }
            })
    
        }],
        //notificationData: ['deliveredOrder', function (cb) {
        notificationData: ['payToAgentAndSupplier', function (cb) {
            adminOrders.getValue(req.dbName,res, orderId, function (err, values) {
                console.log(".......log.......",values);
                if (err) {
                    sendResponse.somethingWentWrongError(res);
                }            
                else {
                    deviceToken = values.device_token;
                    userId = values.user_id;
                    deviceType = values.device_type;
                    req.category_id=values.category_id;
                    supplierId = values.supplier_id;
                    supplierName = values.supplier_name;
                    notificationLanguage = values.notification_language;
                    notificationStatus = values.notification_status;
                    self_pickup=values.self_pickup
                    userEmailId =values.email;
                    userName= values.userName;
                    net_amount= values.net_amount;
                    created_on= moment(values.created_on).format('YYYY-MM-DD HH:mm');
                    schedule_date= moment(values.schedule_date).format('YYYY-MM-DD HH:mm');
                    if(values.payment_type==0){
                        payment_type = "cash";
                    }
                    else {
                        payment_type='Online Transaction'
                    }
                    cb(null);
                }
            });
        }],
        updateReferToUser: ['notificationData', async function (cb) {
            try {
                let pointOrderData=await Execute.Query(req.dbName,`select * from loyality_point_earning where order_id=? and is_ready_for_use=? and user_id=?`,[orderId,0,userId]);
                if(pointOrderData && pointOrderData.length>0){
                        await Execute.Query(req.dbName,`update loyality_point_earning set is_ready_for_use=1 where order_id=? and user_id=?`,[orderId,userId])
                        await Execute.Query(req.dbName,`update user set total_loyality_amount=total_loyality_amount+?,loyalty_points=loyalty_points+1 where id=?`,[pointOrderData[0].earned_amount,userId])
                }
                let userData = await Execute.Query(req.dbName,`select id,user_id from orders where user_id=? and status=?`,[userId,5])
                if(userData && userData.length>0){
                    cb(null)
                }
                else{
                    await Execute.Query(req.dbName,`update user_referral set ready_for_use=? where to_id=?`,[1,userId]);
                    cb(null)
                }
            }catch (e) {
                cb(null)
            }
        }],
        sendUserPushNotification: ['updateReferToUser', async function (cb) {
            let clientLanguage = await Universal.getClientLanguage(req.dbName);
            if(clientLanguage && clientLanguage.length>0){
                notificationLanguage = 16
            }
            if(notificationStatus==0){
                cb(null)
            }
            else {
                var data = {
                    "status": status,
                    "message": await Universal.getMsgText(notificationLanguage, req, status),
                    "orderId": orderId,
                    "self_pickup": self_pickup
                }
                pushNotifications.sendFcmPushNotification(deviceToken, data, req.dbName,function (err, result) {
                    console.log(".........errrrrrr.......", err, result);
                    if (err) {
                        console.log("err2", err);
                        cb(null)
                    } else {
                        cb(null);
                    }
                });
            }
    
        }],
        sendMail:['sendUserPushNotification',async function(cb){
            emailTemp.deliverOrder(self_pickup,req,req.dbName,res,'',userName,net_amount,created_on,schedule_date,orderId,supplierName,supplierName,payment_type,userEmailId,notificationLanguage,function(err,result){
                if(err){
                    console.log("..****fb register email*****....",err);
                }else{
                    cb(null);
                }
            })
        }],
        sendTextMsgToUser:['sendMail',async function(cb){

            let twiliodata=await Universal.getTwilioData(req.dbName);
            let allowTextMsgOnStatusChange = await Execute.Query(req.dbName,
                "select `key`,value from tbl_setting where `key`=? and value=1",
                ["allowTextMsgOnStatusChange"]
            )
            let bandWidthData = await Universal.getBandwidthData(req.dbName);
            let semaphoreData = await Universal.getSemaPhoreData(req.dbName);

            let notification_message = await Universal.getMsgText(notificationLanguage,req,status)

            if(Object.keys(twiliodata).length>0 && allowTextMsgOnStatusChange.length>0 ){
        
                var client = require('twilio')(twiliodata[config.get("twilio.s_id")],twiliodata[config.get("twilio.auth_key")]);
                var smsOptions = {
                    from: twiliodata[config.get("twilio.number_key")],
                    to: countryCode + mobileNumber.toString().replace(/\s/g,''),
                    body: notification_message
                };
                logger.debug("=====smsOptions=>>==",smsOptions)
                client.messages.create(smsOptions, function (err, message) {
                    console.log("=========Twilio==ER!==",err,message)
                    cb(null);
                });
            }else if (Object.keys(bandWidthData).length>0
            && allowTextMsgOnStatusChange.length>0 ){
              
             await  smsManager.bandwidth(notification_message,
                   countryCode + mobileNumber.toString().replace(/\s/g,''),
                   bandWidthData.bandwidth_basic_auth_user_name,
                   bandWidthData.bandwidth_basic_auth_password,
                   bandWidthData.bandwidth_application_id,
                   bandWidthData.bandwidth_user_id,
                   bandWidthData.bandwidth_from_number
                    )
                    cb(null)
           }else if(Object.keys(semaphoreData).length>0 && 
           allowTextMsgOnStatusChange.length>0){
               await Universal.sendSemaphoreMessage(
                   semaphoreData.semaphore_apikey,
                   semaphoreData.semaphore_sendername,
                   message,
                   mobileNumber.toString().replace(/\s/g,'')
                   )
            }else{
               logger.debug("=============keys not found========",twiliodata);
               cb(null)
           }
        }],   
      /*  notificationData: ['deliveredOrder', function (cb) {
            adminOrders.getValue(res, orderId, function (err, values) {
                if (err) {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    deviceToken = values.device_token;
                    userId = values.user_id;
                    deviceType = values.device_type;
                    supplierId = values.supplier_id;
                    supplierName = values.supplier_name;
                    notificationLanguage = values.notification_language;
                    notificationStatus = values.notification_status;
                    cb(null);
                }
            });
        }],
        sendPushNotification: ['notificationData', function (cb) {
            if (status == 1) {
                if (notificationStatus == 0) {
                    return cb(null);
                }
                else {
                    if (deviceType == 0) {
                        if (notificationLanguage == 14) {
                            var data = {
                                "status": 0,
                                "message":" Your Order Has been Delivered",
                                "orderId":orderId

                            }
                        }
                        else {
                            var data = {
                                "status": 0,
                                "message": "وقد تم تسليم طلبك",
                                "orderId":orderId

                            }
                        }
                        message = data.message;
                        console.log("......",message);
                        pushNotifications.sendAndroidPushNotification(deviceToken,data, function (err, result) {
                            if (err) {
                                var msg = "something went wrong";
                                return sendResponse.sendErrorMessage(msg, res, 500);
                            }
                            else {
                                cb(null);
                            }
                        });
                    }
                    else {
                        if (notificationLanguage == 14) {
                            var data = {
                                status: 0,
                                message:"Your Order Has been Confirmed"
                                //  "data": {"supplier_name": supplierName}
                            }
                        }
                        else {
                            var data = {
                                status: 0,
                                message:"تم تاكيد طلبك "
                                //  "data": {TYPE:0,msg:}
                                //   "data": {"supplier_name": supplierName}
                            }
                        }
                        var path = "user";
                        var sound = "ping.aiff";
                        pushNotifications.sendIosPushNotification(deviceToken, data, path,sound ,function (err, result) {
                            if (err) {
                                var msg = "something went wrong";
                                return sendResponse.sendErrorMessage(msg, res, 500);
                            }
                            else {
                                cb(null);
                            }
                        });
                    }
                }
            }
            else {
                if (notificationStatus == 0) {
                    return  cb(null);
                }
                else {
                    if (deviceType == 0) {
                        if (notificationLanguage == 14) {
                            var data = {
                                "status":1,
                                "message": "Regret Your Order Has Been Rejected From "+supplierName,
                                "orderId":orderId

                                //   "data": {"supplier_name": supplierName}
                            }
                        }
                        else {
                            var data = {
                                "status":1,
                                "message": "مع الاسف تم رفض طلبك من قبل "+supplierName,
                                "orderId":orderId

                                //   "data": {"supplier_name": supplierName}
                            }
                        }
                        message = data.message;
                        pushNotifications.sendAndroidPushNotification(deviceToken, data, cb);
                    }
                    else {
                        if (notificationLanguage == 14) {
                            var data = {
                                "status":1,
                                "message": "Regret Your Order Has Been Rejected From "+supplierName,
                                "orderId":orderId


                                //  "data": {"supplier_name": supplierName}
                            }
                        }
                        else {
                            var data = {
                                "status": 1,
                                "message": "مع الاسف تم رفض طلبك من قبل "+supplierName,
                                "orderId":orderId


                                //  "data": {"supplier_name": supplierName}
                            }
                        }
                        var paths = "user";
                        var sound = "ping.aiff";

                        pushNotifications.sendIosPushNotification(deviceToken, data, paths, sound,cb);
                    }
                }
            }
        }],
        savePushNotification: ['sendPushNotification', function (cb) {
            if (notificationStatus == 0) {
                cb(null);
            }
            else {
                if(notificationLanguage ==14){
                    adminOrders.saveNoticationData(res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_DELIVERED,constant.pushNotificationMessage.ORDER_DELIVERED_ENGLISH, cb)
                }
                else {
                    adminOrders.saveNoticationData(res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_DELIVERED,constant.pushNotificationMessage.ORDER_DELIVERED_ARABIC, cb)
                }
            }
        }]*/
        /*getmailaddress:['deliveredOrder',function(cb) {
            adminEmail(res,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    for(var i=0;i<result.length;i++) {
                     (function (i) {
                      email.push(result[i].email)
                    }(i))
                    }
                    //console.log('email11-------',email);
                    cb(null);
                }
            })
        }],
        SendEmail:['getmailaddress',function(cb) {
            var msg='Order Deivered to User';
            var sub='Order delivered';
            func.sendMailthroughSMTP(res,sub,email,msg,0,function(err,result){
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else
                {
                    data=[];
                    cb(null);

                }
            });
        }],
        notificationData:['SendEmail',function (cb) {
            adminOrders.getValue(res,orderId,function (err,values) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else{
                    deviceToken=values.device_token;
                    userId=values.user_id;
                    deviceType=values.device_type;
                    supplierId=values.supplier_id;
                    supplierName=values.supplier_name;
                    notificationLanguage = values.notification_language;
                    notificationStatus = values.notification_status;
                    cb(null);
                }
            });
        }],  
        sendPushNotification: ['notificationData', function (cb) {

            if (notificationStatus == 0) {
                cb(null);
            }
            else {
                if (deviceType == 0) {

                    if (notificationLanguage == 14) {
                        var data = {
                            "status": constant.pushNotificationStatus.ORDER_DELIVERED,
                            "message": constant.pushNotificationMessage.ORDER_DELIVERED_ENGLISH,
                            "data": {"supplier_name": supplierName}
                        }
                    }
                    else {
                        var data = {
                            "status": constant.pushNotificationStatus.ORDER_DELIVERED,
                            "message": constant.pushNotificationMessage.ORDER_DELIVERED_ARABIC,
                            "data": {"supplier_name": supplierName}
                        }
                    }

                    message = data.message;

                    pushNotifications.sendAndroidPushNotification(deviceToken, data, function (err, result) {
                        if (err) {
                            var msg = "something went wrong";
                            return sendResponse.sendErrorMessage(msg, res, 500);
                        }
                        else {
                            cb(null);
                        }

                    });
                }
                else {

                    if (notificationLanguage == 14) {
                        var data = {
                            "status": constant.pushNotificationStatus.ORDER_DELIVERED,
                            "message": constant.pushNotificationMessage.ORDER_DELIVERED_ENGLISH,
                            "data": {"supplier_name": supplierName}
                        }
                    }
                    else {
                        var data = {
                            "status": constant.pushNotificationStatus.ORDER_DELIVERED,
                            "message": constant.pushNotificationMessage.ORDER_DELIVERED_ARABIC,
                            "data": {"supplier_name": supplierName}
                        }
                    }

                    var path ="/home/royo/testing_branch/royo-backend/ClikatDevelopment.pem";
                    var sound = "ping.aiff";
                    pushNotifications.sendIosPushNotification(deviceToken,data,path,sound,function (err, result) {
                        if (err) {
                            cb(null)
                        } else {
                            cb(null);
                        }
                    });
                }
            }
        }],
        savePushNotification: ['sendPushNotification', function (cb) {

            if (notificationStatus == 0) {
                cb(null);
            }
            else {
                adminOrders.saveNoticationData(res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_DELIVERED, message, cb)
            }
        }]*/
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);

        }else{
            data=[];
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })
}



function agentPayablePayment(dbName,res,totalAmount,order_Id, agentId) {

    return new Promise((resolve,reject)=>{

        async.auto({
            update: async function (cb) {
                let getAgentDbData=await common.GetAgentDbInformation(dbName);        
                let agentConnection=await common.RunTimeAgentConnection(getAgentDbData); 
                
                var amount=parseFloat(totalAmount);
                var orderId=parseInt(order_Id);
                var user_id=parseInt(agentId);
                var transaction_mode = 1;

                var selSql="select tip_agent, waiting_charges, commission_ammount, agent_base_price, agent_delivery_charge_share, delivery_charges from cbl_user_orders where user_id = '"+user_id+"' and order_id = '"+orderId+"'";
                let orderExistingDetails = await Execute.QueryAgent(agentConnection,selSql,[]);
                var tip_agent = orderExistingDetails[0].tip_agent;
                var total_amount = amount;
                var total_paid = amount;
                var total_left = 0;
                var waiting_charges = orderExistingDetails[0].waiting_charges;
                var delivery_charges = orderExistingDetails[0].delivery_charges;
                var commission_ammount = orderExistingDetails[0].commission_ammount;
                var agent_base_price = orderExistingDetails[0].agent_base_price;
                var agent_delivery_charge_share = orderExistingDetails[0].agent_delivery_charge_share;
                var status = 1;
                sql ="INSERT INTO `cbl_account_payable_order` (`user_id`, `tip_agent`, `order_id`, `total_amount`, `total_paid`, `total_left`, `status`, `transaction_mode`, `waiting_charges`,`commission_ammount`, `delivery_charges`,`agent_base_price`, `agent_delivery_charge_share`) VALUES ('"+user_id+"', '"+tip_agent+"', '"+orderId+"', '"+total_amount+"', '"+total_paid+"', '"+total_left+"', '"+status+"', '"+transaction_mode+"', '"+waiting_charges+"', '"+commission_ammount+"', '"+delivery_charges+"', '"+agent_base_price+"', '"+agent_delivery_charge_share+"')";

                await Execute.QueryAgent(agentConnection,sql,[]);
                cb(null);
                    
            }
        },function (err,result) {
            if(err){
                reject(err)
            }
            else {
                resolve(result)
            }
        });
        
                
        
                
                
    })        
    
}
async function getOrderNetAmmountAndCommission(agentConnection,orderId){
    var sql = "select cuo.delivery_charges,cu.name,cuo.net_amount,cu.id as user_id,cu.commission,"+
              "cuo.id as cbl_id ,cuo.user_id,cuo.order_id from cbl_user cu  join "+
              "cbl_user_orders cuo on cu.id = cuo.user_id where cuo.order_id = ?"
    return new Promise(async (resolve,reject)=>{
        try{
            var res_data = await Execute.QueryAgent(agentConnection,sql,[orderId]);
            resolve(res_data)
        }catch(err){
            logger.debug("=======err!!=====",err)
            reject(err)
        }

    })
}


async function calculateTotalCommission(agentConnection,net_amount,user_id,dbName,orderId){
    var sql = "select commission,agent_commission_type from cbl_user where id = ?"
    return new Promise(async (resolve,reject)=>{
        try{
            var res_data = await Execute.QueryAgent(agentConnection,sql,[user_id]);

            let blockTimeCommissionDetails =  await getCommissionPercentageForBlockTime(agentConnection,orderId,dbName);

            logger.debug("=============agent_commission_type=====",blockTimeCommissionDetails)
            let commission = res_data[0].commission
            let totalAmmount = 0;


            if(blockTimeCommissionDetails && blockTimeCommissionDetails.length>0){
                commission =  blockTimeCommissionDetails[0].block_time_commission
            }

            if(res_data[0].agent_commission_type!==0){
                totalAmmount = commission
            }else{

                totalAmmount = (commission/100)*net_amount
            }
            logger.debug("----------net ammount -------------",totalAmmount)
            resolve(totalAmmount);
        }catch(err){
            logger.debug("=====eerr!!=====calculateTotalCommission=====",err)
            reject(err)
        }
    })
}

async function getCommissionPercentageForBlockTime (agentConnection,orderId,dbName){

    return new Promise(async (resolve,reject)=>{
        try{
            let query = "select created_on from orders where id=?"
            let result  = await Execute.Query(dbName,query,orderId);

            let bookingTime = moment(new Date(result[0].created_on)).format('HH:mm:ss');

            let bookingDate = moment(result[0].created_on).format('YYYY-MM-DD');

            let blockTimeDetails = await Execute.QueryAgent(agentConnection,
                ` select * from cbl_user_block_times where blockDate<="${bookingDate}" and blockEndDate>="${bookingDate}"
                and blockTime<="${bookingTime}" and blockEndTime>="${bookingTime}" `,[])
            
            resolve(blockTimeDetails)
        }catch(err){
            logger.debug("=======err!!=====",err)
            reject(err)
        }

    })
}

async function updateAgentCommission(agentConnection,cbl_id,commissionAmmount){
    var sql = "update cbl_user_orders set commission_ammount=? where id=?"
    return new Promise(async (resolve,reject)=>{
        try{
            var update_data = await Execute.QueryAgent(agentConnection,sql,[commissionAmmount,cbl_id]);
            resolve();
        }catch(err){
            logger.debug("=======err in updateAgentCommission========",err)
            reject(err)
        }
    })
}




exports.supplierOrdersTrackedList = function (req,res) {
    var accessToken = 0;
    var sectionId=0;
    var supplier_id=0;
    var supplierId=0;
    var data={},limit=0,offset=100;
    console.log("/////",req.body)
    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                limit=parseInt(req.body.limit);
                offset=parseInt(req.body.offset);
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb) {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        supplierId:['authenticate',function (cb) {
            getId(req.dbName,res,supplier_id,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else
                {
                    supplierId=result[0].supplier_id;
                    cb(null);
                }
            })
        }],
        trackedOrders:['supplierId',function(cb){
            supplierOrder.trackedOrders(req.dbName,res,supplierId,limit,offset,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    console.log("....",result.length);
                    if(result.length){
                        data.orders=result;
                    }
                    else {
                        data.orders=[];
                    }
                    cb(null);
                }
            })

        }],
        totalOrders:['trackedOrders',function (cb) {
            var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                'join user u on o.user_id=u.id where s.id= ? AND o.status= 7 ';
            multiConnection[req.dbName].query(sql,[supplierId],function (err,orders) {
                if(err)
                {
                    console.log('error------',err);
                    sendResponse.somethingWentWrongError(res);

                }
                else {
                    data.total_order=orders.length;
                    cb(null);
                }
            })
        }]
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);

        }else{
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);        }
    })
}

exports.updateTrackedOrderbySupplier = function (req,res) {
    var accessToken = 0;
    var sectionId=0;
    var supplier_id=0;
    var orderId=0;
    var date=0;
    var status=0;
    var data;
    var deviceToken=0;
    var userId=0;
    var deviceType=0;
    var supplierId=0;
    var supplierName=0;
    var notificationStatus;
    var notificationLanguage;
    
    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId && req.body.orderId && req.body.date && req.body.status)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                orderId=req.body.orderId;
                date=req.body.date;
                status=req.body.status;
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb) {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        updateTrackedOrder:['authenticate',function(cb){
            orderFunction.updateOrder(req.dbName,res,status,orderId,date,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    cb(null);
                }
            })

        }],
        notificationData: ['updateTrackedOrder', function (cb) {
            adminOrders.getValue(req.dbName,res, orderId, function (err, values) {
                console.log(".......log.......",values);
                if (err) {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    deviceToken = values.device_token;
                    userId = values.user_id;
                    deviceType = values.device_type;
                    supplierId = values.supplier_id;
                    supplierName = values.supplier_name;
                    notificationLanguage = values.notification_language;
                    notificationStatus = values.notification_status;
                    userName = values.userName;
                    cb(null);
                }
            });
        }],
        sendPushNotification: ['notificationData', function (cb) {

            if (notificationStatus == 0) {
                cb(null);
            }
            else {
                if (deviceType == 0) {
                    if (notificationLanguage == 14) {
                        var data = {
                            "status": 0,
                            "message": "Your Order Expected Deleivery time: "+date,
                            "orderId":orderId

                            // "data": {"supplier_name": supplierName}
                        }
                    }
                    else {
                        var data = {
                            "status": 0,
                            "message": "موعد توصيل طلبك المتوقع هو "+date,
                            "orderId":orderId


                            //  "data": {"supplier_name": supplierName}
                        }
                    }

                    message = data.message;

                    pushNotifications.sendAndroidPushNotification(deviceToken, data, function (err, result) {
                        if (err) {
                            cb(null);
                        }
                        else {
                            cb(null);
                        }

                    });
                }
                else {
                    if (notificationLanguage == 14) {
                        var data = {
                            "status": 0,
                            "message":"Your Order Expected Deleivery time: "+date,
                        }
                    }
                    else {
                        var data = {
                            "status": 0,
                            "message": "موعد توصيل طلبك المتوقع هو "+date,
                        }
                    }
                    var path ="user";
                    var sound = "ping.aiff";
                    pushNotifications.sendIosPushNotification(deviceToken,data,path,sound,function (err, result) {
                        if (err) {
                            cb(null)
                        } else {
                            cb(null);
                        }
                    });
                }
            }
        }],
        savePushNotification: ['sendPushNotification', function (cb) {
            if (notificationStatus == 0) {
                cb(null);
            }
            else {
                if(notificationLanguage ==14){
                    adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_TRACKED,constant.pushNotificationMessage.ORDER_TRACKED_ENGLISH, cb)
                }
                else {
                    adminOrders.saveNoticationData(req.dbName,res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_TRACKED,constant.pushNotificationMessage.ORDER_TRACKED_ARABIC, cb)
                }

            }
        }],
        sendAdminMail:['savePushNotification',function(cb){
            emailTemp.trackOrder(res,AdminMail,orderId,date,userName,function(err,result){
                if(err){
                    console.log("..****fb register email*****....",err);
                }
            });
            cb(null)
        }]
      /*  notificationData:['updateTrackedOrder',function (cb)
        {
            adminOrders.getValue(res,orderId,function (err,values) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else{
                    deviceToken=values.device_token;
                    userId=values.user_id;
                    deviceType=values.device_type;
                    supplierId=values.supplier_id;
                    supplierName=values.supplier_name;
                    notificationLanguage = values.notification_language;
                    notificationStatus = values.notification_status;
                    cb(null);
                }
            });
        }],
        sendPushNotification: ['notificationData', function (cb) 
        {

            if (notificationStatus == 0) {
                cb(null);
            }
            else {
                if (deviceType == 0) {
                    if (notificationLanguage == 14) {
                        var data = {
                            "status": constant.pushNotificationStatus.ORDER_TRACKED,
                            "message": constant.pushNotificationMessage.ORDER_TRACKED_ENGLISH,
                            "data": {"supplier_name": supplierName}
                        }
                    }
                    else {
                        var data = {
                            "status": constant.pushNotificationStatus.ORDER_TRACKED,
                            "message": constant.pushNotificationMessage.ORDER_TRACKED_ARABIC,
                            "data": {"supplier_name": supplierName}
                        }
                    }

                    message = data.message;

                    pushNotifications.sendAndroidPushNotification(deviceToken, data, function (err, result) {
                        if (err) {
                            var msg = "something went wrong";
                            return sendResponse.sendErrorMessage(msg, res, 500);
                        }
                        else {
                            cb(null);
                        }

                    });
                }
                else {
                    if (notificationLanguage == 14) {
                        var data = {
                            "status": constant.pushNotificationStatus.ORDER_TRACKED,
                            "message": constant.pushNotificationMessage.ORDER_TRACKED_ENGLISH,
                            "data": {"supplier_name": supplierName}
                        }
                    }
                    else {
                        var data = {
                            "status": constant.pushNotificationStatus.ORDER_TRACKED,
                            "message": constant.pushNotificationMessage.ORDER_TRACKED_ARABIC,
                            "data": {"supplier_name": supplierName}
                        }
                    }
                    var path ="/home/royo/testing_branch/royo-backend/ClikatDevelopment.pem";
                    var sound = "ping.aiff";
                    pushNotifications.sendIosPushNotification(deviceToken,data,path,sound,function (err, result) {
                        if (err) {
                            cb(null)
                        } else {
                            cb(null);
                        }
                    });
                }
            }


        }],
        savePushNotification: ['sendPushNotification', function (cb)
        {

            if (notificationStatus == 0) {
                cb(null);
            }
            else {
                adminOrders.saveNoticationData(res, userId, supplierId, orderId, constant.pushNotificationStatus.ORDER_TRACKED, message, cb)
            }

        }]*/
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);

        }else{
            data=[];
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })
}

exports.scheduledOrder = function(req,res) {
    var accessToken=0;
    var sectionId=0
    var supplier_id=0;
    var supplierId=0;
    var data={},limit=0,count=5000;
    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                  if(req.body.limit){
                      limit=req.body.limit;
                  }
                  if(req.body.count){
                      count=req.body.count;
                  }
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb) {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId,res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        supplierId:['authenticate',function (cb) {
            getId(req.dbName,res,supplier_id,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else
                {
                    supplierId=result[0].supplier_id;
                    cb(null);
                }
            })
        }],
        orderList:['supplierId',function(cb){
            loginFunctions.supplierScheduleOrdersList(req.dbName,res,supplierId,limit,count,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    console.log(".....",result);
                    if(result.length){
                        data.orders=result;
                    }
                    else {
                        data.orders=[];
                    }                    //console.log('data----',result);
                    cb(null);
                }
            })

        }],
        totalOrders:['orderList',function (cb) {
            var sql='select o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                'join user u on o.user_id=u.id where s.id= ? AND o.status= 9';
            multiConnection[req.dbName].query(sql,[supplierId],function (err,orders) {
                if(err)
                {
                    console.log('error------',err);
                    sendResponse.somethingWentWrongError(res);

                }
                else {
                    data.total_order=orders.length;
                    cb(null);
                }
            })
        }]
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })
}


exports.trackedOrders = function(dbName,res,id,limit,offset,callback) {
    var product=[];
    var results=[];
    var cate=[];
    var orderId=[];
    async.auto({
        orders:function (cb) {
            var sql='select  o.promo_discount,o.promo_code,o.redeem_promo,o.apply_promo,o.id,o.created_on,o.schedule_date,s.name as supplier,o.status,u.email As User_Name,u.mobile_no ' +
                'from orders o join supplier_branch sb on sb.id=o.supplier_branch_id join supplier s on sb.supplier_id=s.id '+
                'join user u on o.user_id=u.id where s.id= ? AND o.status= ? LIMIT ?,?';
            multiConnection[dbName].query(sql,[id,7,limit,offset],function (err,orders) {
                if(err)
                {
                    console.log('error------',err);
                    sendResponse.somethingWentWrongError(res);

                }
                else if(orders.length) {

                    for(var i=0;i<orders.length;i++)
                    {
                        (function (i) {
                            orderId.push(orders[i].id);
                            if(i==(orders.length-1)){
                                results = orders;
                                cb(null);
                            }
                        }(i))
                    }
                }
                else {
                    callback(null,[])
                }
            })
        },
        product:['orders',function(cb){
            var sql2='select op.order_id,op.product_name from order_prices op where op.order_id IN('+orderId+')';
            multiConnection[dbName].query(sql2,function (err,product1) {
                if (err) {
                    console.log('error------', err);
                    sendResponse.somethingWentWrongError(res);

                }
                else {
                    for(var i=0;i<results.length;i++) {

                        (function (i) {
                            product=[];
                            for(var j=0;j<product1.length;j++)
                            {

                                (function(j){
                                    if(product1[j].order_id == results[i].id)
                                    {
                                        product.push(product1[j].product_name)
                                        if(j==product1.length-1) {
                                            results[i].product=product;
                                        }
                                    }
                                    else {
                                        if(j==product1.length-1)
                                        {
                                            results[i].product=product;
                                        }
                                    }
                                }(j));

                            }
                            if(i==results.length-1)
                            {
                                cb(null);
                            }
                        }(i))

                    }

                }
            })
        }],
        category:['product',function(cb){
            var sql3='select c.name,c.id,op.order_id from order_prices op join product p on p.id=op.product_id join categories c on c.id=p.category_id  where op.order_id IN('+orderId+')';
            multiConnection[dbName].query(sql3,function (err,cat) {
                if (err) {
                    console.log('error------', err);
                    sendResponse.somethingWentWrongError(res);

                }
                else {
                    for(var i=0;i<results.length;i++) {

                        (function (i) {
                            cate=[];
                            for(var j=0;j<cat.length;j++)
                            {
                                (function(j){
                                    if(cat[j].order_id == results[i].id)
                                    {
                                        cate.push(cat[j].name);
                                        if(j==cat.length-1) {
                                            results[i].category=cate;
                                        }
                                    }
                                    else {
                                        if(j==cat.length-1)
                                        {
                                            results[i].category=cate;
                                        }
                                    }
                                }(j));
                            }
                            if(i==results.length-1)
                            {
                                cb(null);
                            }
                        }(i))
                    }

                }
            })
        }]
    },function(err,data){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            data=results;
            //console.log('final1====',data);
            callback(null,data)
        }
    })

}

function getId(dbName, res, id, cb) {
    var sql = 'select supplier_id from supplier_admin where id=?';
    multiConnection[dbName].query(sql, [id], function (err, result) {
        if (err) {
            console.log('error------', err);
            sendResponse.somethingWentWrongError(res);

        }
        else {
            //console.log('result-----',id);
            if (result.length) {
                cb(null,result);
            } else {
                var sql = 'select supplier_id,id as supplier_branch_id from supplier_branch where id=?';
                multiConnection[dbName].query(sql, [id], function (err, result) {
                    if (err) {
                        console.log('error------', err);
                        sendResponse.somethingWentWrongError(res);

                    }
                    else {
                        //console.log('result-----',id);
                        if (result.length){
                            cb(null, result);
                        }else{
                            sendResponse.somethingWentWrongError(res);
                        }
                    }
                })
            }

        }
    })
}

exports.rateCommentListing=  function(req,res) {
    var accessToken =0 ;
    var sectionId=0;
    var supplier_id;
    var supplierId;
    var data=[];
    var limit;
   console.log("sfdsdfsdf",req.body)
    async.auto({
        blankField:function(cb) {
            if(req.body && req.body.accessToken && req.body.authSectionId)
            {
                accessToken=req.body.accessToken;
                sectionId=req.body.authSectionId;
                
                cb(null);
            }
            else
            {
                sendResponse.parameterMissingError(res);
            }
        },
        authenticate:['blankField',function (cb)
        {
            func.authenticateSupplierAccessToken(req.dbName,accessToken, res,function(err,result){
                if(err)
                {
                    sendResponse .somethingWentWrongError(res);
                }
                else
                {
                    supplier_id=result;
                    cb(null);
                }

            },1)
        }],
        // checkauthority:['authenticate',function(cb) {
        //     func.checkforAuthorityofThisSupplier(req.dbName,supplier_id,sectionId, res,function (err,result) {
        //         if(err)
        //         {
        //             sendResponse.somethingWentWrongError(res);
        //         }
        //         else
        //         {
        //             cb(null);
        //         }
        //     });

        // }],
        supplierId:['authenticate',function (cb) {
            getId(req.dbName,res,supplier_id,function (err,result) {
                if(err)
                {
                    sendResponse.somethingWentWrongError(res);
                }
                else
                {
                    supplierId=result[0].supplier_id;
                    cb(null);
                }
            })
        }],
        rateComment:['supplierId',function(cb){
           // var sql="select sr.id,s.name,CONCAT(u.firstname,' ',u.lastname) As User_Name,sr.rating,sr.comment,sr.is_approved,sr.rated_on from supplier_rating sr join supplier s on s.id=sr.supplier_id " +
            var sql="select o.id,CONCAT(u.firstname,' ',u.lastname) As User_Name,s.name as supplier,o.CommentApprove as is_approved,o.is_read,o.net_amount,c.currency_name,o.rating,o.comment,o.rated_on " +
                "from orders o join user u on u.id=o.user_id join currency_conversion c on c.id=o.currency_id join supplier_branch sb on sb.id=o.supplier_branch_id " +
                "join supplier s on s.id=sb.supplier_id where o.status = 6 and s.id =? order by o.id DESC";

            multiConnection[req.dbName].query(sql,[supplierId],function (err,feedback) {
                if(err)
                {
                    console.log('error------',err);
                    sendResponse.somethingWentWrongError(res);
                }
                else {
                    data=feedback;
                    cb(null)
                }
            })

        }],
    },function(err,result){
        if(err) {
            sendResponse.somethingWentWrongError(res);
        }else{
            sendResponse.sendSuccessData(data, constant.responseMessage.SUCCESS, res,constant.responseStatus.SUCCESS);
        }
    })
}
