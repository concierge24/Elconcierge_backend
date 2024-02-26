var swaggerUI=require("swagger-ui-express")
var swaggerDocs=require("swagger-jsdoc")
var endpoint=require('./swagger-route')
// require('./')
const options = {
    swaggerDefinition: {
      // Like the one described here: https://swagger.io/specification/#infoObject
      info: {
        title: 'Cbl SAas APi`s ',
        version: '1.0.0',
        description: 'Cbl SAas APi`s',
      },
      securityDefinitions: {
        secretdbkey:{
          type: "apiKey",
          in: "header",
          name: "secretdbkey"
        },

        agent_db_secret_key:{
          type: "apiKey",
          in: "header",
          name: "agent_db_secret_key"
        },
        JWT:{
          type: "apiKey",
          in: "header",
          name: "Authorization"
        }
      },
      "security": [
        {
             "secretdbkey": [],
             "JWT":[],
             "agent_db_secret_key":[]
        }
    ]
    },
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: [
    './api-route/swagger-route.js',
    './api-route/category-route.js',
    './api-route/variant-route.js',
    './api-route/product-route.js',
    './api-route/admin/product-route.js',
    './api-route/admin/agent-route.js',
    './api-route/admin/area-route.js',
    './api-route/user/area-route.js',
    './api-route/user/rating-route.js',
     './api-route/user/payment-route.js',
    './api-route/user/address-route.js',
    './api-route/user/agent-route.js',
    './api-route/user/referral_route.js',
    './api-route/supplier/product-route.js',
    './api-route/supplier/cat-route.js',
    './api-route/supplier/agent-route.js',
    './api-route/supplier/order-route.js',
    './api-route/supplier/gift-route.js',
    './api-route/admin/variant-route.js',
    './api-route/admin/brand-route.js',
    './api-route/admin/cat-route.js',
    './api-route/common-route.js',
    './api-route/user/order-route.js',
    './api-route/user/home-route.js',
    './api-route/admin/dashboard-route.js',
    './api-route/supplier/dashboard-route.js',
    './api-route/admin/pgateway-route.js',
    './api-route/admin/banner-route.js',
    './api-route/admin/password-route.js',
    './api-route/admin/promo-route.js',
    './api-route/admin/supplier-route.js',
    './api-route/admin/settings-route.js',
    './api-route/admin/terminologies-route.js',
    './api-route/admin/termsConditions-route.js',
    './api-route/admin/placeHolder-route.js',
    './api-route/admin/order-route.js',
    './api-route/admin/gift-route.js',
    './api-route/admin/login-route.js',
    './api-route/admin/subAdmin-route.js',
    './api-route/admin/cancellationPolicy-route.js',
    './api-route/supplier/profile-route.js',
    './api-route/supplier/subscription-route.js',
    './api-route/admin/subscription-route.js',
    './api-route/admin/loyality-route.js',
    './api-route/user/wallet-route.js',
    './api-route/user/loyality-route.js',
    './api-route/admin/surveymonkey-route.js',
    './api-route/user/posts-route.js',
    './api-route/user/promo-route.js',
    './api-route/admin/pos-route.js',
    './api-route/agent/service-route.js',
    './api-route/admin/deliveryCompanies-route.js',
    './api-route/admin/countryCodes-route.js',
    './api-route/user/login-route.js',
    './api-route/migration/migration-route.js',
    './api-route/admin/seqModel-route.js'
  ],
  };
  
const specs=swaggerDocs(options)

module.exports=(app)=>{
  
    // console.log(specs)
    app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))
    // app.use('/api/v1', endpoint);
}
