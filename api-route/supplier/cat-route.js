
var CatController=require('../../controller/admin/CategoryController')
var Auth=require('../../lib/Auth')
// var category=require('../routes/category')
const Joi = require('joi')
const expressJoi = require('express-joi-validator');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports=(app)=>{
/**
 * @swagger
 * /supplier/brand_list_cat:
 *   get:
 *     description: For Brand list Api
 *     tags:
 *       - Supplier API`S
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: sectionId
 *         required: true
 *         type: number
 *       - in: query
 *         name: cat_id
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: encypt
 *         schema:
 *           $ref: '#/definitions/Stock'
 */
app.get('/supplier/brand_list_cat',

Auth.supplierAuth,
// Auth.checkforAuthorityofThisSupplier,
Auth.checkCblAuthority,

expressJoi({query: {
                // limit:Joi.number().required(),
                // offset:Joi.number().required(),
                cat_id:Joi.number().required(),
                sectionId:Joi.number().required()
    }
}),
CatController.BrandListAccCat
)

}