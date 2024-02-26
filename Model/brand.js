let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
const { QueryTypes,} = require('sequelize');
const universal=require('../util/Universal')
const _=require('underscore');

class action{
    static async list(_languageId){
    //     let _data=await  models.brands.findAll({
    //         where: {
    //             deleted_by:0
              
    //         },
    //         include: [
    //         {
    //             model: models.brands_ml,as: "brands_mls",
    //             where: { language_id: 14 }
    //         },
    //         {
    //             model: models.cat_brands,as: "cat_brands",
    //             required: true
    //         }
    //     ],
    //     attributes:["brands_mls.name","brands.image","cat_brands.cat_id","brands.id"]
    // });
    let _data=await sequelized.query("select `cb`.`cat_id`,`brm`.`name`,`br`.`image`,`br`.`id` from `brands` `br` join `brands_ml` `brm` on brm.brand_id=br.id left join `cat_brands` `cb` on `cb`.`brand_id`=`br`.`id` where `brm`.`language_id`=? and `br`.`deleted_by`=? group by `br`.`id`",{ replacements:[_languageId,0],type: QueryTypes.SELECT });

   
    return _data;
    }   
}

module.exports={
    action:action
}