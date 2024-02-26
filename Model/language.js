const {Query} = require('../lib/Execute');
const constants=require('../routes/constant')
let log4js = require('log4js');
let logger = log4js.getLogger();
logger.level = config.get('server.debug_level');
const { QueryTypes } = require('sequelize');
const request=require('request');
const universal=require('../util/Universal');
class action{
    static async find(criteria){
        let _data=await  models.language.findAll({where:criteria})
        return _data;
    }   
}
module.exports={
    action:action
}