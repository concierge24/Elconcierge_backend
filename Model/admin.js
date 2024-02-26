const {Query} = require('../lib/Execute');
const constants=require('../routes/constant')
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
const { QueryTypes } = require('sequelize');
const request=require('request');
const universal=require('../util/Universal');
const { tiff } = require('image-size/lib/types');

class permissionaction{
    /**
     * @description used for remove an duplicate value of admin category if its already assinged
     * @param {*Number} _adminId 
     */
    static async unassigned(_adminId){
        return new Promise(async (resolve,reject)=>{
            try{
                let aData=await models.admin_category_permission.destroy({
                    where:{
                        admin_id:_adminId
                    }
                });
                resolve();
            }
            catch(Err){
                    reject(Err)
            }
    })
    }
    /**
     * @description used for assigned an category to admin
     * @param {*Array} _categoryIdArray 
     * @param {*Number} _adminId 
     */
    static async assigned(_categoryIdArray,_adminId){
        logger.debug("=======>",models.admin_category_permission)
        return new Promise(async (resolve,reject)=>{
              try{
                  let categoryData=[];
                  if(_categoryIdArray && _categoryIdArray.length>0){
                      for(const [index,i] of _categoryIdArray.entries()){
                          categoryData.push({
                              admin_id:_adminId,
                              category_id:i
                          })
                      }
                  }
                  let aData=await models.admin_category_permission.bulkCreate(categoryData);
                  resolve(aData);
              }
              catch(Err){
                      reject(Err)
              }
      })
}
/**
 * @description used for listing an asssingment data
 * @param {*NUmber} _adminId 
 */
static list(_adminId){
    return new Promise(async (resolve,reject)=>{
        try{
            let assingedData=await models.admin_category_permission.findAll({where:{
                admin_id:_adminId
            },
            attributes:["category_id","admin_id","id"]
            });
            logger.debug("=====assingedData===>>",assingedData)
            resolve(assingedData);
        }
        catch(Err){
                reject(Err)
        }
})
}
}
module.exports={
    permissionaction:permissionaction
}