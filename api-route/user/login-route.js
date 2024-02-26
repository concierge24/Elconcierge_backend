var controller=require('../../controller')
var Auth=require('../../lib/Auth')
var category=require('../../routes/category')
const Joi = require('joi')
const expressJoi = require('express-joi-validator');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const connection=require('../../mySqlModel/index');
module.exports=(app)=>{
/**
 * @swagger
 * /login:
 *   post:
 *     description: api used making an login
 *     tags:
 *       - App API`S
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: body
 *          name: body
 *          required: false
 *          schema:
 *            type: object
 *            properties: 
 *              password:
 *                  type: string
 *                  required: true
 *              countryCode:
 *                  type: string
 *                  required: true
 *              mobileNumber:
 *                  type: string
 *                  required: true
 *              latitude:
 *                  type: number
 *                  required: true
 *              longitude:
 *                  type: number
 *                  required: true
 *              deviceToken:
 *                  type: string
 *                  required: false
 *              deviceType:
 *                  type: number
 *                  required: true
 *              languageId:
 *                  type: number
 *                  required: true
 *              phoneNumber:
 *                  type: string
 *                  required: true
 *              email:
 *                  type: string
 *                  required: false
 *     responses:
 *       200:
 *         description: encypt
 *         schema:
 *           $ref: '#/definitions/Stock'
 */
app.post('/login',
connection.sequeliz.connect,
Auth.checkCblAuthority,
expressJoi({
    body: 
    {  
                password:Joi.string().required(),
                deviceToken:Joi.string().required(),
                deviceType:Joi.number().required(),
                latitude:Joi.number().optional().allow(""),
                longitude:Joi.number().optional().allow(""),
                countryCode:Joi.string().optional().allow(""),
                phoneNumber:Joi.string().optional().allow(""),
                email:Joi.string().optional().allow(""),
                mobileNumber:Joi.string().optional().allow(""),
                languageId:Joi.number().required()
    }
}),
controller.userLoginController.User.Login
)
}