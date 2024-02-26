let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
const { QueryTypes } = require('sequelize');
const request=require('request');
const universal=require('../util/Universal');

class action{
    /**
     * @description used for getting an product for display on home screen
     * @param {*Number} _languageId 
     * @param {*Number} _categoryId 
     * @param {*Number} _latitude 
     * @param {*Number} _longitude 
     * @param {*Array} _keyData 
     */
    static async default(_languageId,_categoryId,_latitude,_longitude,_keyData){
        let _meaurementKeys=new universal.filter("delivery_distance_unit",["delivery_distance_unit"],_keyData);
        logger.debug("======_meaurementKeys====>>",_meaurementKeys);

        let mUnit=await universal.getMeausringUnitV1("",_meaurementKeys);

        var sql = "select p.avg_rating, IF((select count(*) from product where product.parent_id = p.id)> 0, 1, 0) as is_variant, p.id as product_id, IF((select count(*) from product_favourite "
        sql += "where product_favourite.product_id = p.id and product_favourite.user_id = 0 and product_favourite.status = 1)> 0, 1, 0) as is_favourite, p.is_product, p.duration, "
        sql += "price.display_price, s.id as supplier_id, s.logo as supplier_logo, quantity, purchased_quantity, c.is_quantity, c.is_agent, c.agent_list, c.menu_type, c.id as category_id, "
        sql += "c.category_flow, if(price.display_price = price.price, 0, 1) AS discount, s.name as supplier_name, s.delivery_radius, price.price as hourly_price, price.pricing_type, "
        sql += "price.urgent_type, price.urgent_value, price.can_urgent, bp.supplier_branch_id as supplier_branch_id, if(p.purchased_quantity >= p.quantity, 0, 1) AS availability, price.handling as handling_admin, "
        sql += "price.handling_supplier,price.house_cleaning_price, price.beauty_saloon_price, bp.detailed_sub_category_id, bar_code, sku, cml.name as detailed_name, pml.name, pml.product_desc, "
        sql += "price.price, pimage.image_path, pml.measuring_unit, price.price_type, price.price as fixed_price, price.price_type as price1, ("+mUnit+" * acos (cos (radians("+_latitude+") "
        sql += ")* cos(radians(s.latitude))* cos(radians(s.longitude) - radians("+_longitude+")) + sin (radians("+_latitude+"))* sin(radians(s.latitude)))) AS distance from supplier_branch_product bp "
        sql += "join categories c on bp.category_id = c.id join categories_ml cml on cml.category_id = c.id join product p on bp.product_id = p.id join product_ml pml on bp.product_id = pml.product_id "
        sql += "join product_image pimage on bp.product_id = pimage.product_id join product_pricing price on bp.product_id = price.product_id and price.price_type = IF ((SELECT COUNT(*) as counter "
        sql += "FROM product_pricing pc where pc.product_id = bp.product_id and pc.is_deleted = 0 having counter > 1), 1, 0) join supplier_branch sbb on sbb.id = bp.supplier_branch_id "
        sql += "join supplier s on s.id = sbb.supplier_id where bp.detailed_sub_category_id IN("+_categoryId+") and bp.detailed_sub_category_id != 0 and p.is_live = 1 and p.parent_id = 0 and p.is_deleted = 0 "
        sql += "and bp.is_deleted = 0 and price.is_deleted = 0 and pml.language_id = "+_languageId+" and sbb.is_deleted = 0 and s.is_deleted = 0 and s.is_active = 1 and cml.language_id = 14 "
        sql += "and (pimage.default_image = 1 or pimage.imageOrder = 1) and ((price.price_type = '1' and DATE(price.start_date) <= CURDATE() and DATE(price.end_date) >= CURDATE()) "
        sql += "or (price.price_type = 0)) and ((price.pricing_type = 1) or(price.pricing_type = 0 and price.price != 0)) GROUP BY product_id, sku having distance < s.delivery_radius"
        let result=await sequelized.query(sql,{ type: QueryTypes.SELECT});
        return result;

    }
}
class offer
{
    static async data(_serviceType,_languageId,_userId,_latitude,_longitude,_categoryId,_userTypeCheck,_userTypeId,_filterBy,_keyData)
    {
        let _hideOutStockEnable=new universal.filter("hide_out_of_stock_product",["hide_out_of_stock_product"],_keyData);
        let _outOfStockCheck=_hideOutStockEnable && _hideOutStockEnable.length>0?"and p.quantity>p.purchased_quantity":""
        let _orderTypeCondition=parseInt(_filterBy)==1?" and (s.self_pickup=0 or s.self_pickup=2) ":parseInt(_filterBy)==2?" and (s.self_pickup=1 or s.self_pickup=2) ":parseInt(filter_by)==3?" and s.is_dine_in=1 and s.is_scheduled=1 ":"";
        let _radiusCheckQuery="having distance<=delivery_radius";


    }

    static async filterOfferByUserType(_languageId,_userId,_latitude,_longitude,_categoryId,_userTypeCheck,_userTypeId,_filterBy){
        let sql="";
        let cateIds=await this.subCategoriesIds(_categoryId);
        // let subCateData=await ExecuteQ.Query(dbName,`select id,parent_id from categories where parent_id!=? and is_deleted=?`,[0,0])
       

        switch(_userTypeCheck){
            case _userTypeCheck && _userTypeCheck.length>0:
                switch(parseInt(categoryId)){
                    case 0:
                        sql = "select temp.*,( select CONCAT('[',COALESCE(GROUP_CONCAT(CONCAT('{','\"type_name\": \"', pdt.name, '\", ','\"name\": \"', pr.name,'\", ','\"addon_limit\": \"', pr.addon_limit,'\", ','\"is_mandatory\": \"', pr.is_mandatory,'\",     ','\"type_id\": \"', pdt.id,'\",','\"is_multiple\": \"', pr.is_multiple,'\",','\"min_adds_on\": \"', pr.min_adds_on,'\",','\"max_adds_on\": \"', pr.max_adds_on,'\",','\"id\": \"', pr.id, '\",','\"price\": \"', price, '\",','\"is_default\": \"', pdt.is_default, '\"','}') SEPARATOR ','),''),']') AS bData from product_adds_on pr left join product_adds_on_type pdt on pdt.adds_on_id=pr.id and pdt.is_deleted=0 where pr.product_id=temp.product_id and pr.is_deleted=0      ) as adds_on,IF(EXISTS(select product_favourite.id from product_favourite where product_favourite.product_id = temp.product_id and product_favourite.user_id = "+user_id+" and product_favourite.status = 1), 1, 0) as is_favourite,IF(EXISTS(select product_adds_on.id  from product_adds_on  where  product_adds_on.product_id = temp.product_id  and product_adds_on.is_deleted = 0 limit 1), 1, 0) as is_product_adds_on,IF(EXISTS(select questions.id  from questions where questions.category_id =temp.sub_category_id),1,0 ) as is_question,IF(EXISTS(select product.id from product where  product.parent_id = temp.parent_id and temp.parent_id!=0), 1, 0) as is_variant from (select user_type_id,latitude,if(display_price=price,0,1) AS discount,base_delivery_charges,longitude,parent_id,radius_price,delivery_radius,type,is_dine,payment_after_confirmation,is_agent,agent_list,duration, pricing_type, avg_rating, is_quantity, is_product, price_type, offer_id, fixed_price,delivery_charges,handling_supplier, handling_admin,";
                        sql += " parent_category_id,can_urgent, urgent_type, category_id,detailed_sub_category_id,sub_category_id, price, offer_name, display_price, measuring_unit, product_desc, name, image_path,";
                        sql += "is_dine_in,is_allergy_product,allergy_description,is_scheduled,is_subscription_required,purchase_limit,product_id, supplier_id,supplier_branch_id,self_pickup,supplier_name, supplier_image,cart_image_upload,order_instructions,quantity, purchased_quantity,distance ";
                        sql += "from (select ";
                     //    sql += "";
                        sql += " sbp.category_id as parent_category_id,s.is_dine_in,p.is_allergy_product,p.allergy_description,s.is_scheduled,p.is_subscription_required,p.purchase_limit,p.quantity as quantity,p.parent_id,p.payment_after_confirmation,p.cart_image_upload,p.purchased_quantity as purchased_quantity, p.avg_rating as avg_rating,ct.is_dine,ct.type,ct.menu_type,ct.agent_list,ct.order_instructions,ct.is_quantity as is_quantity, p.duration as duration,";
                        sql += "p.is_product as is_product,ct.is_agent,pp.pricing_type as price_type, pp.id as offer_id,pp.delivery_charges as delivery_charges, pp.handling as handling_admin, pp.handling_supplier, pp.can_urgent,";
                        sql += "pp.urgent_type,pp.user_type_id,p.item_unavailable, p.category_id, p.detailed_sub_category_id,p.sub_category_id, sb.supplier_id,sb.id as supplier_branch_id,pp.pricing_type, pp.price as fixed_price, pp.price, pp.offer_name, pp.display_price, pml.measuring_unit,";
                        sql += "pml.product_desc, pml.name, pi.image_path, p.id as product_id,s.self_pickup as self_pickup, s.name as supplier_name,sb.latitude,sb.longitude,s.radius_price,s.base_delivery_charges,sb.delivery_radius as delivery_radius, s.logo as supplier_image, ("+mUnit+" * acos (cos ( radians("+latitude+") )* cos( radians( sb.latitude ) )* cos( radians( sb.longitude ) - radians("+longitude+") )+ sin ( radians("+latitude+") )* sin( radians( sb.latitude ) ))) AS distance from "
                    
                        sql += "supplier_branch sb join supplier_branch_product sbp on sb.id = sbp.supplier_branch_id join supplier s on s.id = sb.supplier_id "
                        sql += "join product p on p.id = sbp.product_id join product_image pi on pi.product_id = p.id join product_ml pml on pml.product_id = p.id "
                        sql += "join product_pricing pp on pp.product_id = p.id join categories ct on ct.id = p.category_id left join supplier_image si on si.supplier_id = sb.supplier_id left join supplier_subscription ss on ss.supplier_id=s.id "
                    
                    
                    
                    
                        sql += "where pp.is_deleted = 0 and pp.user_type_id="+_userTypeId+" and  ct.is_live=1 and ct.is_deleted=0 and sbp.is_deleted = 0 and p.is_live = 1 and sb.is_live = 1 and (pi.imageOrder =1) and sb.is_deleted = 0 and p.is_deleted = 0 and pml.language_id = "+lanuageId+" ";
                        sql += ""+planQuery+" and s.is_live = 1  "+outOfStockCheck+" and s.is_deleted = 0 "+orderTypeCondition+" and pp.price_type = 1 and DATE(pp.start_date) <= CURDATE() and DATE(pp.end_date) >= CURDATE() ORDER BY ";
                        sql += "pp.price_type DESC) selection GROUP BY product_id "+radius_check_query+" order by offer_id DESC limit 10 offset 0) as temp ";
                    break;
                    default:
                }



        }



    }
    /**
     * @description for getting an all sub categories of main categories
     * @param {*Number} _categoryId 
     */
    static async subCategoriesIds(_categoryId){
        let cateIds=[];
        let subCateData=await models.categories.findAll({where:{parent_id:0,is_deleted:0}});
        if(subCateData && subCateData.length>0){
            let subIds=await universal.getNestedChildrenIds(subCateData,_categoryId);
            logger.debug("=====subIds==>>",subIds);
            if(subIds && subIds.length>0){
                cateIds=subIds;
            }
            else{
                cateIds.push(_categoryId)
            }
        }
        else{
            cateIds.push(_categoryId)
        }
        return cateIds;
    }
}
module.exports={
    action:action,
    offer:offer
}

