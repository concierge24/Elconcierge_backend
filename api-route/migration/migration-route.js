"use strict";
var migrationcontroller=require("../../controller/migration/migrationController")
var model=require('../../mySqlModel/index');
var auth=require('../../lib/Auth')


module.exports=(app)=>{
    /**
     * @swagger
     * /admin/migrate_files_to_all_db:
     *   get:
     *     description: migration of files to all db's
     *     tags:
     *       - Admin API`S
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: encypt
     *         schema:
     *           $ref: '#/definitions/migration'
     */


    app.get('/admin/migrate_files_to_all_db',model.sequeliz.connect,auth.authenticateAccessToken,migrationcontroller.migration.migrateFiles)

}