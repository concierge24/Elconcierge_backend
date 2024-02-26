var mysql = require('mysql');
var async = require('async');
var constant=require('./../config/const')
multiConnection={};
var universalFunc=require('../util/Universal')
var consts=require('./../config/const')
var crypto = require('crypto'),
    algorithm = consts.SERVER.CYPTO.ALGO,
    password =  consts.SERVER.CYPTO.PWD
    var log4js = require('log4js');
    var logger = log4js.getLogger();
    // var chunk = require('chunk');
    logger.level = config.get('server.debug_level');
function makeMultiConnection() {
    let connetionLimit=100;
    console.log("in the makeMultiConnection");
    switch(constant.SERVER.WHITE_LABLE.STATUS){

        case 0:
    //    console.log("===ERR!==DAtA==",cblConnection);

        let sql = "select ccd.name,ccd.host,ccd.username,ccd.password from  cbl_customer_dbs ccd join cbl_customer cc on ccd.customer_id=cc.id where ";
        sql += "cc.is_block=0 and ccd.is_deleted=0";
       
            var stmt = cblConnection.query(sql,function(err,data){

                //console.log(data)
            //    console.log("===ERR!==DAtA==",err,data)
                //

                if(err){
                    console.log(err)
                }
                else{
                    // logger.debug(data)
                    if(data && data.length>0){

                        async.each(data,async function(i){                            
                           
                            var password= await universalFunc.getDecryptData(i.password)
                            // logger.debug("===",i.host,i.name,i.username,password)
                            connetionLimit=i.name=="yummy_0122"?100:10
                            multiConnection[i.name] = mysql.createPool({
                                connectionLimit: connetionLimit,
                                host     : i.host,
                                user     : i.username,
                                password : password,
                                database : i.name,
                                // keepAliveInitialDelay: 10000, // 0 by default.
                                enableKeepAlive: true
                            });

                        // multiConnection[i.name].getConnection((err, connectionm) => {
                        //         console.log("======multiConnection=Err!==>>",err)
                        //         if (err) {
                        //             if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        //                 console.error('Database connection was closed.')
                        //             }
                        //             if (err.code === 'ER_CON_COUNT_ERROR') {
                        //                 console.error('Database has too many connections.')
                        //             }
                        //             if (err.code === 'ECONNREFUSED') {
                        //                 console.error('Database connection was refused.')
                        //             }
                        //         }
                        //         if (connectionm) connectionm.destroy();
                        //         return
                        //     })
                            // multiConnection[i.name] = mysql.createConnection({
                            //     host     : i.host,
                            //     user     : i.username,
                            //     password : password,
                            //     database : i.name
                            //     });
                            // multiConnection[i.name].connect();
                                // console.log(multiConnection[i.name]);
                        })
                    }
                }
            }) 
            break;
}

}
makeMultiConnection()
