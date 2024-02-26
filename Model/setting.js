let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');

class keys{
    constructor(_criteria,_attributes){
        this._criteria=_criteria;
        this._attributes=_attributes;
    }
   async value(){
        let _key_data=await models.tbl_setting.findAll(this._criteria,this._attributes)
        return _key_data;
    }

}
module.exports.keys=keys