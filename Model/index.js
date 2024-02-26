'use strict';
//=============Model Route========================
const supplierModel=require('./supplierModel');
const bookingCarFlow=require('./bookingCartFlow');
const services=require('./services');
const users = require('./user');
const agents = require('./agent');
const supplier=require('./supplierModel');
const setting=require('./setting');
const category=require('./category');
const admin=require('./admin');
const langauge=require('./language');
const banner=require('./banner');
const brand=require('./brand');
const product=require('./product')
module.exports = {
    supplierModel:supplierModel,
    bookingCarFlow:bookingCarFlow,
    services:services,
    users:users,
    agents:agents,
    supplier:supplier,
    setting:setting,
    category:category,
    admin:admin,
    langauge:langauge,
    banner:banner,
    brand:brand,
    product:product
};
