
var seqModelcontroller=require("../../controller/admin/seqModelController");
var model=require('../../mySqlModel/index')
var auth=require('../../lib/Auth')


module.exports=(app)=>{
    /**
     * @swagger
     * /admin/generate/models:
     *   get:
     *     description: generate auto models with sequelize ORM
     *     tags:
     *       - Admin API`S
     *     produces:
     *       - application/json
     * 
     *     responses:
     *       200:
     *         description: encypt
     *         schema:
     *           $ref: '#/definitions/Stock'
     */
    
app.get('/admin/generate/models',model.sequeliz.connect,auth.authenticateAccessToken,seqModelcontroller.Models.generate)
}


// model.sequeliz.connect,auth.authenticateAccessToken,