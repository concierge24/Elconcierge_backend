const {Query} = require('../lib/Execute');
const constants=require('../routes/constant')
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
const { QueryTypes,Sequelize,Op } = require('sequelize');
const universal=require('../util/Universal')
const _=require('underscore');

class modify {
    /**
     * @description used fir listing an category after modification with nth-level
     * @param {*String} _dbName 
     * @param {*Array}  _keyData 
     * @param {*Number} _languageId 
     * @param {*Number} _categoryId 
     * @param {*Number} _disableSubCategory 
     */
     static async list (_keyData,_languageId,_categoryId,_disableSubCategory,_supplierId,_type,_latitude,_longitude){
        let _subCategory=[];
        let _filterSequenceData=new universal.filter("category_sequence",["category_sequence"],_keyData);
        let _filterMainSequenceData=new universal.filter("is_main_category_sequence_wise",["is_main_category_sequence_wise"],_keyData);
        let _geofence=new universal.filter("enable_geofence_wise_categories",["enable_geofence_wise_categories"],_keyData);
        let _filterMainKeyValue=_filterMainSequenceData.key();
        let _filerSequenceKeyValue=_filterSequenceData.key();
        let _allParentCategory=await this._allParentCategory(_languageId,_categoryId,_supplierId,_filterMainKeyValue,_filerSequenceKeyValue);
        logger.debug("=====_latitude,_longitude=>>",_latitude,_longitude);
        _subCategory=parseInt(_disableSubCategory)==1?[]:await this._allSubCategories(_type,_languageId,_supplierId);
        let _allSubCategory=await this._allSubCategories(_type,_languageId,_supplierId);
        let _finalData=await universal.finalCatData(_allParentCategory,_allSubCategory);
        _finalData = _.sortBy(_finalData,'sequence_no');
        let _geoFenceData=_geofence.key();
        if(_geoFenceData && _geoFenceData.length>0){
        let _contains=Sequelize.literal("st_contains(coordinates,point("+_latitude+","+_longitude+"))");
        let _categoryByAreas=await models.categories_areas.findAll({ 
            attributes:[[_contains,'is_under'],"id","category_id"],
            having:{
                is_under:{
                    [Op.gt]:0
                }
            }
            });
            
        let geo=new universal.geo(_finalData,_categoryByAreas);
        _finalData=await geo.categories();

        }
        return _finalData;
    }
    /**
     * @description listing an all parent categories
     * @param {*Number} _languageId     
     * @param {*Number} _categoryId 
     * @param {*Array} _filterMainSequenceData 
     * @param {*Array} _filerSequenceKeyValue 
     */
    static async _allParentCategory(_languageId,_categoryId,_supplierId,_filterMainSequenceData,_filerSequenceKeyValue){
        logger.debug("===========>>",_languageId)
        let sql;
        let orderBySql="sc.id Asc"
        let orderBySequenceWithIsAssign = " order by is_assign DESC,order_no ";
        let orderBySequence  = " order by is_assign DESC,order_no ";
        orderBySequenceWithIsAssign=_filterMainSequenceData && _filterMainSequenceData.length>0?" order by categories.sequence_no asc ":orderBySequenceWithIsAssign;
        orderBySequence=_filerSequenceKeyValue && _filerSequenceKeyValue.length>0?"sc.order_no Asc,bp.order_no Asc":orderBySequence;
        sql=(parseInt(_categoryId)==0 || _categoryId==undefined || _categoryId=="")
        ?"select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(_supplierId)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id = "+parseInt(_supplierId)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.terminology,categories.cart_image_upload,categories.order_instructions,categories.image,categories.icon,categories.is_dine,categories.category_flow,categories.parent_id,categories.sequence_no,categories.type,categories.is_service_single_selection,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=0 and categories.is_deleted=0 and is_default=0 and categories_ml.language_id="+parseInt(_languageId)+" order by is_assign DESC,order_no"
        :
        "select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.category_id = categories.id and supplier_category.supplier_id="+parseInt(_supplierId)+") > 0, 1, 0) as is_assign,(select (order_no) from supplier_category where supplier_category.category_id = categories.id  and supplier_category.supplier_id = "+parseInt(_supplierId)+" and supplier_category.sub_category_id = 0 and supplier_category.detailed_sub_category_id = 0 group by supplier_category.supplier_id,supplier_category.category_id limit 1)  as order_no,categories.payment_after_confirmation,categories.cart_image_upload,categories.order_instructions,categories.is_service_single_selection,categories.image,categories.icon,categories.category_flow,categories.is_dine,categories.sequence_no,categories.parent_id,categories.type,categories.menu_type,categories.tax,categories.id,categories_ml.name from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.is_live=1 and categories.parent_id=0 and categories.is_deleted=0 and  is_default=0 and categories_ml.language_id="+parseInt(_languageId)+" and categories.parent_id="+_categoryId+" "+orderBySequence+""
        let result=await sequelized.query(sql,{ type: QueryTypes.SELECT});
        return result;

    }

      /**
       * @description used for getting an sub categories
       * @param {Number*} _type 
       * @param {*Number} _languageId 
       * @param {*Number} _supplierId 
       */
    static async _allSubCategories(_type,_languageId,_supplierId){  
        let sql=(_supplierId!=0 && _supplierId!=undefined && _type=="supplier")
        ?"select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF( ( select count(*) from supplier_category where supplier_category.supplier_id = "+_supplierId+" and "+
        "( supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id ) ) > 0, 1, 0 ) as is_assign, "+
        "(select order_no from supplier_category where supplier_category.supplier_id = "+parseInt(_supplierId)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) GROUP by supplier_category.supplier_id limit 1) as order_no, "+
        "sc.sub_category_id, categories.image, categories.icon, categories.parent_id, categories.id,categories.menu_type, categories_ml.name from categories inner join categories_ml "+
        "on categories_ml.category_id = categories.id join supplier_category sc on sc.sub_category_id = categories.id or sc.detailed_sub_category_id=categories.id "+
        "where categories.parent_id != ? and categories.is_deleted = ? and categories_ml.language_id = ? and sc.supplier_id="+_supplierId+" group by name "
        :
        "select IF((select count(*)  from questions  where questions.category_id=categories.id) > 0, 1, 0) as is_question,IF((select  count(*)  from  supplier_category where supplier_category.supplier_id="+parseInt(_supplierId)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id)) > 0, 1, 0) as is_assign, "+
            "(select (order_no) from supplier_category where supplier_category.supplier_id = "+parseInt(_supplierId)+" and (supplier_category.sub_category_id = categories.id OR supplier_category.detailed_sub_category_id = categories.id) group by supplier_category.supplier_id,supplier_category.sub_category_id limit 1) as order_no," +
            "categories.image,categories.icon,categories.parent_id,categories.id,categories_ml.name,categories.menu_type from categories inner join categories_ml on categories_ml.category_id=categories.id where categories.parent_id!=? and categories.is_deleted=? and categories_ml.language_id=? order by is_assign DESC,order_no asc"
        let result=await sequelized.query(sql,{ replacements:[0,0,parseInt(_languageId)],type: QueryTypes.SELECT});
        return result;
    }
}

module.exports={
    modify:modify
}