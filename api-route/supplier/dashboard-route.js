
var DashboardCntrl=require('../../controller/supplier/dashboardController')
var Auth=require('../../lib/Auth')
// var category=require('../routes/category')
const Joi = require('joi')
const expressJoi = require('express-joi-validator');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
module.exports=(app)=>{
/**
 * @swagger
 * /supplier/dashboard:
 *   get:
 *     description: For Creating an new brands
 *     tags:
 *       - Supplier API`S   
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: end_date
 *         required: true
 *         type: string 
 *       - in: query
 *         name: start_date
 *         required: true
 *         type: string 
 *       - in: query
 *         name: sectionId
 *         required: true
 *         type: string 
 *       - in: query
 *         name : supplier_id
 *         required: true
 *         type : string
 *     responses:
 *       200:
 *         description: encypt
 *         schema:
 *           $ref: '#/definitions/Stock'
 */
app.get('/supplier/dashboard',
multipartMiddleware,
Auth.supplierAuth,
// Auth.checkforAuthorityofThisSupplier,
Auth.checkCblAuthority,
expressJoi({query: {
                start_date:Joi.string().required(),
                end_date:Joi.string().required(),
                sectionId:Joi.string().optional().allow(""),
                supplier_id:Joi.string().required()
    }
}),
DashboardCntrl.Dashboard
)

/**
 * @swagger
 * /v2/supplier/dashboard:
 *   get:
 *     description: For Creating an new brands
 *     tags:
 *       - Supplier API`S   
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: end_date
 *         required: true
 *         type: string 
 *       - in: query
 *         name: start_date
 *         required: true
 *         type: string 
 *       - in: query
 *         name: sectionId
 *         required: true
 *         type: string 
 *       - in: query
 *         name : supplier_id
 *         required: true
 *         type : string
 *     responses:
 *       200:
 *         description: encypt
 *         schema:
 *           $ref: '#/definitions/Stock'
 */
app.get('/v2/supplier/dashboard',
multipartMiddleware,
Auth.supplierAuth,
// Auth.checkforAuthorityofThisSupplier,
Auth.checkCblAuthority,
expressJoi({query: {
                start_date:Joi.string().required(),
                end_date:Joi.string().required(),
                sectionId:Joi.string().optional().allow(""),
                supplier_id:Joi.string().required()
    }
}),
DashboardCntrl.DashboardV2
)

}