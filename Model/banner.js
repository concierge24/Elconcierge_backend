
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
const { QueryTypes } = require('sequelize');
const request=require('request');
const universal=require('../util/Universal');
const moment = require('moment');
class action{
    /**
     * @description used for listing an banner with all dependecy with supplier
     * @param {*Number} _latitude 
     * @param {*Number} _longitude 
     * @param {*String} _offset 
     * @param {*Number} _categoryId 
     * @param {*Array} _keyData 
     */
    static async list(_latitude,_longitude,_offset,_categoryId,_keyData){
        let _meaurementKeys=new universal.filter("delivery_distance_unit",["delivery_distance_unit"],_keyData);
        logger.debug("======_meaurementKeys====>>",_meaurementKeys)
        let mUnit=await universal.getMeausringUnitV1("",_meaurementKeys);
        let _currentTime=moment().utcOffset(_offset).format('YYYY-MM-DD');
        let sql;
        if(parseInt(_categoryId)==0){
             sql = "select s.delivery_radius,s.name as supplier_name,a.id,a.flow_banner_type,cc.type,cc.menu_type,cc.name as category_name, cc.category_order, cc.supplier_placement_level, cc.category_flow,a.category_id, a.banner_type,a.branch_id, a.category_id, IF((select count(*) from categories where parent_id = a.category_id),1,0) as is_subcategory, a.phone_image,"
            sql += "a.phone_video,a.website_video,a.website_image,a.name, a.supplier_id, a.branch_id,("+mUnit+" * acos (cos (radians("+_latitude+")) * cos(radians(sb.latitude))* cos("
            sql += "radians(sb.longitude) - radians("+_latitude+")) + sin (radians("+_latitude+"))* sin(radians(sb.latitude)))) AS distance  from advertisements a "
            sql += "left join supplier_branch sb on sb.id = a.branch_id join categories cc on cc.id = a.category_id join supplier s on s.id = a.supplier_id where a.is_active = 1 and  s.is_active = 1  and s.is_deleted = 0 and a.advertisement_type = 0 and "
            sql += "a.is_deleted = 0   and ((DATE(a.start_date) <= '"+_currentTime+"' and DATE(a.end_date) >= '"+_currentTime+"') or( DATE(a.start_date) = '0000-00-00' and DATE(a.end_date) = '0000-00-00' )) and sb.is_deleted = 0 and cc.is_live = 1 GROUP BY name having s.delivery_radius>=distance ORDER BY a.orders DESC"
    
        }
        else{
             sql = "select s.delivery_radius,s.name as supplier_name,a.id,a.flow_banner_type,cc.type,cc.menu_type,cc.name as category_name, cc.category_order, cc.supplier_placement_level, cc.category_flow,a.category_id, a.banner_type,a.branch_id, a.category_id, IF((select count(*) from categories where parent_id = a.category_id),1,0) as is_subcategory, a.phone_image,"
            sql += "a.phone_video,a.website_video,a.website_image,a.name, a.supplier_id, a.branch_id,("+mUnit+" * acos (cos (radians("+_latitude+")) * cos(radians(sb.latitude))* cos("
            sql += "radians(sb.longitude) - radians("+_longitude+")) + sin (radians("+_latitude+"))* sin(radians(sb.latitude)))) AS distance  from advertisements a "
            sql += "left join supplier_branch sb on sb.id = a.branch_id join categories cc on cc.id = a.category_id join supplier s on s.id = a.supplier_id where a.is_active = 1 and  s.is_active = 1  and s.is_deleted = 0 and a.advertisement_type = 0 and "
            sql += "a.is_deleted = 0   and ((DATE(a.start_date) <= '"+_currentTime+"' and DATE(a.end_date) >= '"+_currentTime+"') or( DATE(a.start_date) = '0000-00-00' and DATE(a.end_date) = '0000-00-00' )) and sb.is_deleted = 0 and cc.is_live = 1 and cc.id="+_categoryId+" GROUP BY name having s.delivery_radius>=distance ORDER BY a.orders DESC"
        }
        let result=await sequelized.query(sql,{ type: QueryTypes.SELECT });
        return result;
    }

}
module.exports={
    action:action
}