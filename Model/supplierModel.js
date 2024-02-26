'use strict';
const { Logger } = require('mongodb');
const Execute=require('../lib/Execute')
let randomize = require('randomatic');
let func = require('../routes/commonfunction');
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
/**
 * @desc used for getting an detail for getting an data
 * @param {*Array} params 
 * @param {*String} dbName 
 */
const getSupplierAdminData=(attributes,dbName,params)=>{
    return new Promise(async (resolve,reject)=>{
            try{
               let paramAttribute;
                if(Array.isArray(attributes) &&  attributes.length){
                        paramAttribute=attributes.join(",")
                }
                let supplierAdminResult=await Execute.Query(dbName,`select ${paramAttribute} from supplier_admin where supplier_id=?`,params)
                resolve(supplierAdminResult)
            }
            catch(Err){
                reject(Err)
            }   
        })
}
/**
 * @description used for listing an supplier without pagination
 * @param {*String} attributes 
 * @param {*String} dbName 
 * @param {*Array} params 
 */
const supplierListWithoutPagination=(attributes,dbName,params)=>{
    return new Promise(async (resolve,reject)=>{
            try{
               let paramAttribute;
                if(Array.isArray(attributes) &&  attributes.length){
                        paramAttribute=attributes.join(",")
                }
              
                let supplierAdminResult=await Execute.Query(dbName,`select ${paramAttribute} from supplier`,params)
                resolve(supplierAdminResult)
            }
            catch(Err){
                reject(Err)
            }   
        })
}
/**
 * @description used for insert an record in supplier one by one
 */
class bulk {
    constructor (dbName,supplierData){
        this.dbName=dbName
        this.supplierData=supplierData
    }
    // async updateDetail(sql,inputParams,dbName){
    async insert() {
        return new Promise(async (resolve,reject)=>{
        try{
          
        let sData=this.supplierData;
        let insertData;
        for await (let [index, i] of sData.entries()) {
            console.log("===>>",i[0],i[1],i[2])
            let isDupSupplier=await Execute.Query(this.dbName,`select id from supplier where email=? and is_deleted=?`,[i[1],0]);

            logger.debug("=====isDupSupplier===>>",isDupSupplier);

            if(isDupSupplier && isDupSupplier.length<=0 && i[1]!="" && i[1]!=undefined){
                var supSql = " insert into supplier(logo,supplier_image,stripe_account,rating_total,urgentButton,commisionButton,device_type,device_token,delivery_prior_time,delivery_prior_days,delivery_prior_total_time,delivery_min_time,delivery_max_time,urgent_delivery_time,total_rating_by_user,step_completed,business_start_date,urgent_type,urgent_price,is_urgent,is_postpone,total_reviews,rating,payment_method,handling_supplier,handling_admin,pricing_level,is_recommended,access_token,approved_by,is_deleted,terms_and_conditions,uniqueness,trade_license_no,status,name,email,mobile_number_1,address,password,created_by,latitude,longitude,commission,pickup_commission,is_active,self_pickup,country_code,iso,is_sponser,license_number,description,brand,linkedin_link,facebook_link,nationality,speciality,gst_price,country_of_origin,is_out_network,user_created_id)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                 insertData=await Execute.Query(this.dbName,supSql,[
                    i[14]==undefined?"":i[14],
                    i[5],
                     "",
                     0,
                     0,
                     0,
                     1,
                     "",
                     0,
                     0,
                     0,
                     0,
                     0,
                     0,
                     0,
                    0,
                    new Date(),
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0.0,
                    0.0,
                    0,
                    0,
                    func.encrypt(i[1] + new Date()),
                     1,
                     0,
                    "",
                    "",
                    "",
                     1,
                    i[0],
                    i[1],
                    i[11],
                    i[3],
                    md5(i[2]),
                    1,
                    i[12],
                    i[13],
                    i[8],
                    i[7],
                    1,
                    2,
                    i[10],
                    i[15]==undefined?"IND":i[15],
                   (i[7]).toLowerCase()=="yes"?1:0,
                   i[9],
                   i[4],
                   "",
                   "",
                   "",
                   "",
                   "",
                   0,
                   "",
                   0,
                   randomize('A0', 30)
                ])
                logger.debug("======insertData=====>>",insertData)
                var supAdminSql = "insert into supplier_admin(supplier,approved_by,email,password,phone_number,is_superadmin,created_by_clikat,access_token,supplier_id,is_active)values(?,?,?,?,?,?,?,?,?,?)";
                await Execute.Query(this.dbName,supAdminSql,[
                    insertData.insertId,
                    1,
                    i[1],
                    md5(i[2]),
                    // i[11],
                    1,
                    1,
                    0,
                    func.encrypt(i[1] + new Date()),
                    insertData.insertId,
                    1
                ]);
                // let imageSql="select image_path,orderImage from supplier_image where supplier_id = ? order by id desc";
                 let imageSql=`insert into supplier_image(image_path,orderImage,supplier_id) values(?,?,?)`
                 await Execute.Query(this.dbName,imageSql,[i[5],1,insertData.insertId]);


                await Execute.Query(this.dbName,"insert into supplier_ml(description,uniqueness,terms_and_conditions,name,address,language_id,supplier_id) values(?,?,?,?,?,?,?)",["","","",i[0], i[3], 14, insertData.insertId]);
                  
                await Execute.Query(this.dbName,"insert into supplier_ml(description,uniqueness,terms_and_conditions,name,address,language_id,supplier_id) values(?,?,?,?,?,?,?)",["","","",i[0], i[3], 15, insertData.insertId]);
                let timings =
                [
        
                    {  "supplier_id":  insertData.insertId, "week_id": 0, "week": "mon", "start_time": "00:00:00", "end_time": "23:59:59", "is_open": 1 },
                    {  "supplier_id":  insertData.insertId, "week_id": 1, "week": "tue", "start_time": "00:00:00", "end_time": "23:59:59", "is_open": 1 },
                    {  "supplier_id":  insertData.insertId, "week_id": 2, "week": "wed", "start_time": "00:00:00", "end_time": "23:59:59", "is_open": 1 },
                    {  "supplier_id":  insertData.insertId, "week_id": 3, "week": "thu", "start_time": "00:00:00", "end_time": "23:59:59", "is_open": 1 },
                    {  "supplier_id":  insertData.insertId, "week_id": 4, "week": "fri", "start_time": "00:00:00", "end_time": "23:59:59", "is_open": 1 },
                    {  "supplier_id":  insertData.insertId, "week_id": 5, "week": "sat", "start_time": "00:00:00", "end_time": "23:59:59", "is_open": 1 },
                    {  "supplier_id":  insertData.insertId, "week_id": 6, "week": "sun", "start_time": "00:00:00", "end_time": "23:59:59", "is_open": 1 }
                ]
                let deliveryMinTime = 15,deliveryMaxTime=15,deliveryPriorDays=0,deliveryPriorTime=0,urgentDeliveryTime=30;
                let deliveryPriorTotalTime = parseInt(deliveryPriorTime) + parseInt(deliveryPriorDays)*24*60;    
                let  updateValues = [deliveryMinTime, deliveryMaxTime, deliveryPriorDays, 
                deliveryPriorTime, urgentDeliveryTime, deliveryPriorTotalTime, insertData.insertId];
                let deliverTimeSql = "update supplier set delivery_min_time = ?,delivery_max_time = ?,delivery_prior_days = ?,delivery_prior_time ";
                deliverTimeSql +=" = ? ,urgent_delivery_time = ?,delivery_prior_total_time = ? where id = ? limit 1";
                await Execute.Query(this.dbName,deliverTimeSql,updateValues);
                let deleteSql = "delete from supplier_timings where supplier_id = ?";
                await Execute.Query(this.dbName,deleteSql,[insertData.insertId]);
                for(const [index1,j] of timings.entries()){
                    var sqlTiming = "insert into supplier_timings(supplier_id,week_id,start_time,end_time,is_open) values(?,?,?,?,?)";
                    await Execute.Query(this.dbName,sqlTiming,[insertData.insertId,j.week_id,j.start_time,j.end_time,j.is_open])
                }
                let branchSql = "insert into supplier_branch(supplier_id,name,branch_name,phone,mobile_1,mobile_2,email,address,is_head_branch,latitude,longitude,is_live,password,commission) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                let branchData=await Execute.Query(this.dbName,branchSql,[insertData.insertId,i[0],i[0],i[11],i[11],i[11],i[1],i[3],1,i[12],i[13],1,md5(i[2]),i[8]]);

                let branchSqlMl = "insert into supplier_branch_ml(name,branch_name,language_id,supplier_branch_id,address) values(?,?,?,?,?)"
                await Execute.Query(this.dbName,branchSqlMl,[i[0],i[0],14,branchData.insertId,i[3]])
                let branchSqlMl1 = "insert into supplier_branch_ml(name,branch_name,language_id,supplier_branch_id,address) values(?,?,?,?,?)"
                await Execute.Query(this.dbName,branchSqlMl1,[i[0],i[0],15,branchData.insertId,i[3]]);
                // (?,?,?,?)
                await Execute.Query(this.dbName,"insert into supplier_category(supplier_id,category_id,sub_category_id,detailed_sub_category_id) values (?,?,?,?)",[insertData.insertId,0,0,0]); 
            }
        }
        resolve (insertData);
    }
    catch(Err){
        logger.debug("=bulk=insert=Err!===>",Err)
        reject(Err)
    }
    })
    }
}
class tags{
    static async list(){
        let _data=await  models.supplier_tags.findAll({})
        return _data;
    }
}

module.exports={
    tags:tags,
    bulk:bulk,
    supplierListWithoutPagination:supplierListWithoutPagination,
    getSupplierAdminData:getSupplierAdminData
}