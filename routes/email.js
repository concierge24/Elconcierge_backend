var func = require('./commonfunction');
var async = require('async');
var sendResponse = require('./sendResponse');
var constant = require('./constant');
var loginFunctions = require('./loginFunctions');
var pushNotifications = require('./pushNotifications');
var nodemailer = require('nodemailer');
var validator = require("email-validator");
var phone = require('node-phonenumber')
let Universal=require('../util/Universal')
var log4js=require("log4js")
var logger = log4js.getLogger();
logger.level = 'debug';
let Execute=require('../lib/Execute');

exports.acceptOrder = async function(self_pickup,req,dbName,reply,AdminMail,name,
    amount,placeDate,deliveryDate,orderId,supplierNameEnglish,
    supplierNameArabic,paymentMethod,userEmail,notificationLanguage,callback){
    try{
    let smtpSqlSata=await Universal.smtpData(req.dbName);
    let decimalData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["price_decimal_length"]);
    let terminologyData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["terminology"]);
    let terminology=terminologyData && terminologyData.length>0?JSON.parse(terminologyData[0].value):{};
    let paymentMethodTxt=terminology["english"]["cod"]!=undefined && terminology["english"]["cod"]!=""?terminology["english"]["cod"]:paymentMethod;
    let deliveryTimeMsg=parseInt(self_pickup)==1?"pickup time":"delivery time"
    paymentMethodTxt=parseInt(self_pickup)==1?(terminology.english["cash_on_pickup"]!=undefined && terminology.english["cash_on_pickup"]!=""?terminology.english["cash_on_pickup"]:paymentMethodTxt):paymentMethodTxt
     deliveryTimeMsg=parseInt(self_pickup)==1?(terminology.english["order_expected_date"]!=undefined && terminology.english["order_expected_date"]!=""?terminology.english["order_expected_date"]:deliveryTimeMsg):deliveryTimeMsg


    let uptoFixed=decimalData && decimalData.length>0?parseInt(decimalData[0].value):2;
    let currencyData=await Execute.Query(req.dbName,"select currency_name from currency_conversion",[])
    let currencyName=currencyData && currencyData.length>0?currencyData[0].currency_name:"AED";
    let colorThemeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
    var data = [];
    

    let new_email_template_v10=await Execute.Query(req.dbName,
        "select `key`,`value` from tbl_setting where `key`=? and value=1 ",
        ["new_emain_template_v10"]);

    async.auto({
       getSupplierImage:function(cb){
           var sql = "select banner_image from advertisements where advertisement_type = 4 and start_date <= CURDATE() and end_date >= CURDATE()";
           multiConnection[dbName].query(sql,[], function(err, result) {
               if(result.length){
                   console.log("********************result************",result);
                   data = result;
                   cb(null);
               }else{
                   data = [];
                   cb(null);
               }
           });
       },
       sendMail:['getSupplierImage',function(cb){
           if(new_email_template_v10 && new_email_template_v10.length>0){
            var subject = ""+req.business_name+" -Confirmation of order no "+orderId;
            
            var email=`<!DOCTYPE html>
            <html>
            <head>
                <title>Email Tamplate</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            </head>
            <body style="font-family: Segoe UI, Roboto, Helvetica Neue,Helvetica, Arial,sans-serif; background: #fff;  max-width: 700px;  margin:40px 10px; padding: 0px; border-radius: 15px; display:table; margin: 15px auto;">
            <table  cellspacing="0" cellpanding="0" style="max-width:700px;  border-collapse: collapse; border-radius: 15px; border: 1px solid #eee;">
            <tr>
            <td style="padding: 0px;">
                <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2; " cellspacing="0" cellpanding="0">
                    <tbody>
                        <tr>
                            <td style="padding: 10px 20px;"> 
                                <img src=${req.logo_url}alt="" 
                                 style="display: inline-block; width: 100px; margin:0 0 0px; ">
                            </td>
                        </tr>
                    </tbody>
                </table>        
                <table style="width: 100%; ">
                    <tbody>
                        <tr>
                             <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                <h2>Booking Accepted!</h2>
                                <p  style="font-size: 16px; color: #666; margin:0px; ">Hi ${name}
                                </p>
                                 <p style="color: #666; font-size: 16px; line-height:20px;">Thank you for placing a request with ${supplierNameEnglish}.</p>
                                 <p style="color: #666; font-size: 16px; line-height:20px;">Your booking has been accepted.</p>
                                 <!-- <a href="#" style="background-color: #21a211;
                                color: #fff;
                                text-decoration: none;
                                padding: 10px;
                                display: inline-block;
                                text-align: center;
                                border-radius: 5px;margin: 30px 180px;">VIEW BOOKING ON BODY FORMULA</a> -->
                            </td>
                        </tr>                   
                    </tbody>
                </table>
<!------------------------table changes-------------------->
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Request Details</td>
                                        </tr>
                                        <tr>
                                            <td>Order Place Date: ${placeDate}</td>
                                        </tr>
                                        <tr>
                                            <td>Expected ${deliveryTimeMsg}: ${deliveryDate}</td>
                                        </tr>
                                    </tbody>
                                </table>
                <!------------------------table changes  end-------------------->
                <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2;text-align:center; " cellspacing="0" cellpanding="0">
                    <tbody>
                        <tr>
                            <td style="text-align: center; width: 0%;">
                                <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px;padding:10PX 20PX; text-decoration: none;"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                                <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px;padding:10PX 20PX; text-decoration: none;"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                                 <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px;padding:10PX 20PX; text-decoration: none;"><i class="fa fa-instagram" aria-hidden="true"></i></a>
                                 <P style="color: #666; font-size: 16px;">Need Help? You may email us at<a style="color: #000; text-decoration: underline;" href=${req.help_email} title=""> ${req.help_email} </a>Visit us <a href="#">here</a></P>
                            </td>
                        </tr>
                    </tbody>
                </table>  
          </td>
       </tr>
     </table>
</body>
</html>`
            

}else{
            if(notificationLanguage==14){

                var subject = ""+req.business_name+" -Confirmation of order no "+orderId;
                var email=`<!doctype html>
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                    xmlns:o="urn:schemas-microsoft-com:office:office">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="x-apple-disable-message-reformatting">
                    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
                
                    <title>
                        ORDER CONFIRMATION
                    </title>
                    <style>
                        html,
                        body {
                            margin: 0 auto !important;
                            letter-spacing: 0.5px;
                            padding: 0 !important;
                            height: 100% !important;
                            width: 100% !important;
                            font-family: 'Montserrat', sans-serif;
                        }
                
                        * {
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                        }
                
                        div[style*="margin: 16px 0"] {
                            margin: 0 !important;
                        }
                
                        table,
                        td {
                            mso-table-lspace: 0pt !important;
                            mso-table-rspace: 0pt !important;
                        }
                
                
                        table table table {
                            table-layout: auto;
                        }
                
                        img {
                            -ms-interpolation-mode: bicubic;
                        }
                
                        [x-apple-data-detectors],
                        .x-gmail-data-detectors,
                        .x-gmail-data-detectors *,
                        .aBn {
                            border-bottom: 0 !important;
                            cursor: default !important;
                            color: inherit !important;
                            text-decoration: none !important;
                            font-size: inherit !important;
                            font-family: inherit !important;
                            font-weight: inherit !important;
                            line-height: inherit !important;
                        }
                    </style>
                </head>
                
                <body width="100%" style="margin: 0;">
                    <center style="width: 100%; background: #edf2f740; text-align: left;">
                        <div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"
                            class="email-container">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
                                style="border: 1px solid #ddd; padding-bottom: 50px;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div style="padding:20px;text-align: center;">
                                                <div style="width:20%;margin: 0 auto;">
                                                    <img style="max-width: 100%;" src='`+req.logo_url+`' class="g-img">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div
                                                style="background-color: ${colorTheme};padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">
                                                <h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">ORDER CONFIRMATION
                                                </h2>
                                                <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;">Thank you for placing your order with  <strong>
                                                 </strong>${req.business_name}.</h2>
                                                <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;"> Your order has been confirmed</h2>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style="padding:20px 25px;text-align: left;font-size: 14px;line-height: 24px;">
                                                <h4 style="margin: 0px;">Order Details</h4>
                                                <p style="margin: 0px;">Order No. ${orderId}</p>
                                            </div>
                                        </td>
                                    </tr>`
                           let footer=`<tr>
                                        <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                                        margin: 0px 25px;
                                        max-width: 92%;
                                    "></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="margin: 0px 25px;">
                                                <tbody>
                                                    <tr>
                                                        <td style="width: 50%;">
                                                            <div style="padding: 15px 0px;margin: 0px 0px;">
                                                                <table
                                                                    style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 300; color: #0000009e;padding-right: 10px;">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style="font-weight: 600;font-size: 16px;">Billing
                                                                                Details</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style="width:">Total order amount: </td>
                                                                            <td style="text-align: right;">${currencyName} ${amount.toFixed(uptoFixed)}</td>
                                                                        </tr>
                                                                        <tr>
                                                                        <td style="width:">Order Place Date: </td>
                                                                        <td style="text-align: right;">${placeDate}</td>
                                                                       </tr>
                                                                       <tr>
                                                                       <td style="width:">Order ref number: </td>
                                                                       <td style="text-align: right;">${orderId}</td>
                                                                      </tr>
                                                                        <tr>
                                                                            <td style="width:">Expected ${deliveryTimeMsg}: </td>
                                                                            <td style="text-align: right;">${deliveryDate}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style="width:">Supplier name: </td>
                                                                            <td style="text-align: right;">${supplierNameEnglish} </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style="width:">Payment Method: </td>
                                                                            <td style="text-align: right;">${paymentMethodTxt} </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    
                                                </tbody>
                
                                            </table>
                
                                        </td>
                                        
                                    </tr>
                                    <tr>
                                        <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                                        margin: 0px 25px;
                                        max-width: 92%;
                                    "></td>
                                    </tr>
                                    <!-- <tr>
                                        <td><hr style="background-color: #e84b58;">
                                        </td>
                                    </tr> -->
                                </tbody>
                            </table>
                        </div>
                    </center>
                </body>
                </html>`
                email=email+footer;
 
             //    var email ='<html lang="en">';
             //    email+='<body style="background:#c1c1c1">';
             //    email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif; background: #ffffff !important;">';
             //    email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
             //    email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
             //    email+='<b>Dear '+name+'</b>';
             //    email+='<br>';
             //    email+='<br>';
             //    email+='Thank you for placing your order with '+req.business_name+'. Your order has been Confirmed. ';
             //    email+='';
             //    email+='<br>';
             //    email+='<br>';
             //    email+='Below are the details of your Transaction:';
             //    email+='';
             //    email+='';
             //    email+='<br>';
             //    email+='<table style="width:60%; margin-left:55px;">';
             //    email+='<tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Total Order Amount:: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+amount+'</td>';
             //    email+='</tr>';
             //    email+='<tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Place Date: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
             //    email+='</tr>';
             //    email+='<tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Expected Delivery Time:</td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+deliveryDate+'</td>';
             //    email+='</tr>';
             //    email+='<tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
             //    email+='</tr><tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">Supplier Name: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">'+supplierNameEnglish+'</td>';
             //    email+='</tr><tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Payment Method: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>'
             //    email+='</tr>'
             //    email+='</table>'
             //    email+='';
             //    email+='';
             //    email+='';
             //    email+='';
             //    email+='<br>';
             //    email+='For Further Details, please login to your Account to Confirm & Manage the Order';
             //    email+='';
             //    email+='';
             //    email+='<br>';
             // //    email+='Please Do Not Hesitate to contact Us if you need any Further Assistance';
             // //    email+='<br>';
             // //    email+='Tel: 04- 347 6654';
             // //    email+='<br>';
             // //    email+='Email: '+req.help_email+'';
             // //    email+='<br>';
             // //    email+='Or Use Our Live Chat Service to Talk to our Customer Service Representative';
             // //    email+='<br>';
             //    email+='';
             //    email+='';
             //    email+='</pre>';
             //    // email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
             //    email+='<br><br>';
             
             //    email += '<br>'
             //    for (var im=0;im<data.length;im++) {
             //        email += '<div><img style="width:100%" src="' + data[im].banner_image + '" ></div>';
             //    }
 
 
             // //    email+='<span style="margin-left: 25px; margin-top: 10px">Disclaimer:</span>';
             // //    email+='';
             // //    email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-left: 50px">';
             // //    email+='<li>'+req.business_name+'.com is not responsible of the Production of Products, Quality, Delivery, and The Product or Services Pricing. The Supplier is sole Responsible for all Provided Products </li>';
             // //    email+='<li>'+req.business_name+' is Online Platform Brings User and Supplier into one Market online place and hence '+req.business_name+' is not Responsible of any damage can be caused by the supplier offers services or Products. The Consumer is required to contact us in case of any unsatisfied experience for our further evaluation. </li>';
             // //    email+='<li>This is an email confirmation of the order and it cannot be used as Invoice of supplier. </li>';
             // //    email+='<li>The Completed Order is Subjected to The Terms & Conditions of '+req.business_name+' and Supplier indicated in our website & Mobile App</li>';
             // //    email+='<li>The Supplier hold sole Responsibility of Pricing, Product Availability and quality of service and the content provided.</li>';
             // //    email+='</ol>';
             //    email+='';
             //        email+='</section>';
             //    email+='</body>';
             //    email+='</html>';
 
 
            }
            else if(notificationLanguage==15){

                var subject = ""+req.business_name+"- تم تاكيد طلبك رقم"+orderId;
 
                var     email='<!DOCTYPE html>';
                email+='<html lang="en">';
                email+='<head>';
                email+='<meta charset="UTF-8">';
                email+='</head>';
                email+='<body style="background:#c1c1c1>';
                email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif; background: #ffffff  !important;">';
                email+='';
                email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
                email+='    <pre>';
                email+='';
                email+='';
                email+='<div style="font-size:15px; font-family: verdana san-serif;" dir="rtl">';
                email+='<br>';
                email+='         تفاصيل طلبك كالتالي:-';
                email+='<br>';
                email+='        <table style="width:60%; margin-right:55px; font-size: 15px">';
                email+='        <tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اجمالي قيمه الطلب</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+currencyName+' '+amount+ '</td>';
                email+='        </tr>';
                email+='        <tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> تاريخ ووقت تنفيذ الطلب:</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
                email+='        </tr>';
                email+='        <tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">تاريخ ووقت توصيل الطلب المتوقع: </td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+deliveryDate+'</td>';
                email+='        </tr>';
                email+='        <tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> رقم الطلب</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
                email+='        </tr><tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اسم مزود الخدمة</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+supplierNameArabic+'</td>';
                email+='        </tr><tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">طريقه الدفع</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>';
                email+='        </tr>';
                email+='    </table>';
                email+='';
                email+='';
                email+='<br>';
                email+='<p style="margin-right: 35px">';
                email+='';
                email+='';
                email+='للاطلاع على تفاصيل طلبك ومتابعه حاله طلبك الرجاء الدخول عبر حسابك الى التطبيق.';
                email+='';
                email+='<br>';
                email+='';
                email+='الرجاء عدم التردد بالتواصل معنا للحصول على المساعدة والدعم عبر القنوات التأليه: -';
                email+='<br>';
                email+='';
                // email+='هاتف:04-343 6039';
                email+='<br>';
                email+='ايميل:'+req.help_email+'';
                email+='<br>';
                email+='او يمكنكم التحدث مباشره مع أحد موظفين خدمه العملاء عن طريق نظام المحادثة للدعم المباشر المتواجد في التطبيق';
                email+='<br>';
                email+='';
                email+='</p>';
                email+='</div>';
                email+='</pre>';
                //email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
                email+='';
                email+='<div dir="rtl">';
                email+='    <br>';
                email += '<br>'
 
                for (var im=0;im<data.length;im++) {
                    console.log(".============================",data[im]);
                    email += '<div><img style="width:100%" src="' + data[im].banner_image + '" ></div>';
                }
                email+='<br>';
                email+='<span style="margin-right: 45px; margin-top: 10px">اخلاء مسؤوليه</span>';
                email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-right: 50px" >';
                email+='    <li>'+req.business_name+'.com ليست مسؤولة عن إنتاج المنتجات المعروضه ، جودتها ، توصيلها ، أو الخدمات وتسعيرها . مزورد الخدمه هو الوحيد المسؤول عن المنتجات المطلوبه.</li>';
                email+='<li>'+req.business_name+'.com هي منصةالكترونيه عبر الانترنت تربط المستخدم و مزود الخدمه عبر منصه الكترونيه واحده عبر الانترنت ، وبالتالي '+req.business_name+' ليست مسؤولة عن أي ضرر يمكن أن يحدث من قبل المورد او مايقدمه من خدمات أو منتجات . يرجى من المستهلك الاتصال بنا في حال عدم الرضاء عن جوده المنتج او الخدمه او تقييم مزود الخدمه عبر نظام التقييم لدينا </li>';
                email+='<li>هذاالبريد الإلكتروني مصدر من النظام، لا يمكن أن يستخدم كفاتورة.</li>';
                email+='<li>جميع الطلبات خاضعه لشروط واحكام تطبيق '+req.business_name+' و مزود الخدمه كما هو مبين في موقعنا على الانترنت و تطبيق الهاتف.</li>';
                email+='<li>مورد الخدمه وحده يتحمل المسؤولية كامله عن اسعار المنتجات ، توافر المنتج وجوده المنتج والخدمه.</li>';
                email+='</ol>';
                email+='';
                email+='<br>';
                email+='</div>';
                email+='';
              
                email+='</section>';
                email+='</body>';
                email+='</html>';
            }
            else{
             var subject = ""+req.business_name+".com -Confirmation of Order No "+orderId;
             var email ='<html lang="en">';
             email+='<body style="background:#c1c1c1">';
             email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif; background: #ffffff !important;">';
             email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
             email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
             email+='<b>Saludos '+name+','+'</b>';
             email+='<br>';
             email+='<br>';
             email+='Gracias por tu orden en '+req.business_name+', Tu orden ha sido confirmada por el local. ';
             email+='';
             email+='<br>';
             email+='<br>';
             email+='Detalles de la transaccion:';
             email+='';
             email+='';
             email+='<br>';
             email+='<table style="width:60%; margin-left:55px;">';
             email+='<tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Precio Total de la Orden: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+amount+'</td>';
             email+='</tr>';
             email+='<tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Fecha de la orden: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
             email+='</tr>';
             email+='<tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Tiempo estimado del delivery:</td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+deliveryDate+'</td>';
             email+='</tr>';
             email+='<tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Numero de Orden: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
             email+='</tr><tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">Nombre del Local: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">'+supplierNameEnglish+'</td>';
             email+='</tr><tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Metodo de pago: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>'
             email+='</tr>'
             email+='</table>'
             email+='';
             email+='';
             email+='';
             email+='';
             email+='<br>';
             email+='Para mas detalles, porfavor haz login en tu cuenta y revisa tus Ordenes en la navegación.';
             email+='';
             email+='';
             email+='<br>';
             email+='<br>';
             email+='<br>';
             email+='Si hay algún problema o eventualidad no dudes en escribirnos a '+req.help_email+' y responderemos lo mas rapido posible.';
             email+='';
             email+='';
             email+='</pre>';
             // email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
             email+='<br><br>';
          
             email += '<br>'
             for (var im=0;im<data.length;im++) {
                 email += '<div><img style="width:100%" src="' + data[im].banner_image + '" ></div>';
             }
 
 
             email+='';
             email+='';
                 email+='</section>';
             email+='</body>';
             email+='</html>';
            } 
           }

           
           func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[userEmail],email,0,function(err,result){
               if(err){
                   callback(err);
               }else{
                   callback(null)
               }
           });
       }]
   },function(err,result){  
       if(err){
           callback(err);
       }else{
           callback(null)
       }
   })

}
catch(Err){
    console.log("===deliverOrder=Error",Err)
    callback(null)
}}
exports.deliverOrder = async function(self_pickup,req,dbName,reply,AdminMail,name,amount,placeDate,deliveryDate,orderId,supplierNameEnglish,supplierNameArabic,paymentMethod,userEmail,notificationLanguage,callback){
    try{
    let smtpSqlSata=await Universal.smtpData(req.dbName);
    let currencyData=await Execute.Query(req.dbName,"select currency_name from currency_conversion",[])
    let currencyName=currencyData && currencyData.length>0?currencyData[0].currency_name:"AED";
    let colorThemeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let terminologyData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["terminology"]);
    let terminology=terminologyData && terminologyData.length>0?JSON.parse(terminologyData[0].value):{};
    let paymentMethodTxt=terminology["english"]["cod"]!=undefined && terminology["english"]["cod"]!=""?terminology["english"]["cod"]:paymentMethod;
     paymentMethodTxt=parseInt(self_pickup)==1?(terminology.english["cash_on_pickup"]!=undefined && terminology.english["cash_on_pickup"]!=""?terminology.english["cash_on_pickup"]:paymentMethodTxt):paymentMethodTxt
   let deliveryTimeText=parseInt(self_pickup)==1?(terminology.english["order_expected_date"]!=undefined && terminology.english["order_expected_date"]!=""?terminology.english["order_expected_date"]:"pickup time"):"delivery time"
   console.log("====paymentMethodTxt==deliveryTimeText>>",paymentMethodTxt,deliveryTimeText)

    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
    var data = [];
    let deliveredMsg=parseInt(self_pickup)==1?" ready for pickup ":" Delivered"
    
    let new_email_template_v10=await Execute.Query(req.dbName,
        "select `key`,`value` from tbl_setting where `key`=? and value=1 ",
        ["new_emain_template_v10"]);
    

    async.auto({
       getSupplierImage:function(cb){
           var sql = "select banner_image from advertisements where advertisement_type = 4 and start_date <= CURDATE() and end_date >= CURDATE()";
           multiConnection[dbName].query(sql,[], function(err, result) {
               if(result.length){
                   console.log("********************result************",result);
                   data = result;
                   cb(null);
               }else{
                   data = [];
                   cb(null);
               }
           });
       },
       sendMail:['getSupplierImage',function(cb){
           if(new_email_template_v10 && new_email_template_v10.length>0){
            var subject = ""+req.business_name+" -Delivered of order no "+orderId;
            
            var email=`<!DOCTYPE html>
            <html>
            <head>
                <title>Delivered Order</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            </head>
            <body style="font-family: Segoe UI, Roboto, Helvetica Neue,Helvetica, Arial,sans-serif; background: #fff;  max-width: 700px;  margin:40px 10px; padding: 0px; border-radius: 15px; display:table; margin: 15px auto;">
            <table  cellspacing="0" cellpanding="0" style="max-width:700px;  border-collapse: collapse; border-radius: 15px; border: 1px solid #eee;">
            <tr>
            <td style="padding: 0px;">
                <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2; " cellspacing="0" cellpanding="0">
                    <tbody>
                        <tr>
                            <td style="padding: 10px 20px;"> 
                                <img src=${req.logo_url}alt="" 
                                 style="display: inline-block; width: 100px; margin:0 0 0px; ">
                            </td>
                        </tr>
                    </tbody>
                </table>        
                <table style="width: 100%; ">
                    <tbody>
                        <tr>
                             <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                <h2>Order ${deliveredMsg}!</h2>
                                <p  style="font-size: 16px; color: #666; margin:0px; ">Hi ${name}
                                </p>
                                 <p style="color: #666; font-size: 16px; line-height:20px;">Thank you for placing a request with ${supplierNameEnglish}.</p>
                                 <p style="color: #666; font-size: 16px; line-height:20px;">Your booking has been accepted.</p>
                                 <!-- <a href="#" style="background-color: #21a211;
                                color: #fff;
                                text-decoration: none;
                                padding: 10px;
                                display: inline-block;
                                text-align: center;
                                border-radius: 5px;margin: 30px 180px;">VIEW BOOKING ON BODY FORMULA</a> -->
                            </td>
                        </tr>                   
                    </tbody>
                </table>
<!------------------------table changes-------------------->
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Request Details</td>
                                        </tr>
                                        <tr>
                                            <td>Order Place Date: ${placeDate}</td>
                                        </tr>
                                        <tr>
                                            <td>Expected ${deliveryTimeText}: ${deliveryDate}</td>
                                        </tr>
                                    </tbody>
                                </table>
                <!------------------------table changes  end-------------------->
                <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2;text-align:center; " cellspacing="0" cellpanding="0">
                    <tbody>
                        <tr>
                            <td style="text-align: center; width: 0%;">
                                <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px;padding:10PX 20PX; text-decoration: none;"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                                <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px;padding:10PX 20PX; text-decoration: none;"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                                 <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px;padding:10PX 20PX; text-decoration: none;"><i class="fa fa-instagram" aria-hidden="true"></i></a>
                                 <P style="color: #666; font-size: 16px;">Need Help? You may email us at<a style="color: #000; text-decoration: underline;" href="info@bodyformula.ca" title=""> ${req.help_email} </a>Visit us <a href="#">here</a></P>
                            </td>
                        </tr>
                    </tbody>
                </table>  
          </td>
       </tr>
     </table>
</body>
</html>`
           
           }else{
            if(notificationLanguage==14){

                var subject = ""+req.business_name+" -Delivered Order No "+orderId;
                var email=`<!doctype html>
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                    xmlns:o="urn:schemas-microsoft-com:office:office">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="x-apple-disable-message-reformatting">
                    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
                
                    <title>
                        ORDER${deliveredMsg}
                    </title>
                    <style>
                        html,
                        body {
                            margin: 0 auto !important;
                            letter-spacing: 0.5px;
                            padding: 0 !important;
                            height: 100% !important;
                            width: 100% !important;
                            font-family: 'Montserrat', sans-serif;
                        }
                
                        * {
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                        }
                
                        div[style*="margin: 16px 0"] {
                            margin: 0 !important;
                        }
                
                        table,
                        td {
                            mso-table-lspace: 0pt !important;
                            mso-table-rspace: 0pt !important;
                        }
                
                
                        table table table {
                            table-layout: auto;
                        }
                
                        img {
                            -ms-interpolation-mode: bicubic;
                        }
                
                        [x-apple-data-detectors],
                        .x-gmail-data-detectors,
                        .x-gmail-data-detectors *,
                        .aBn {
                            border-bottom: 0 !important;
                            cursor: default !important;
                            color: inherit !important;
                            text-decoration: none !important;
                            font-size: inherit !important;
                            font-family: inherit !important;
                            font-weight: inherit !important;
                            line-height: inherit !important;
                        }
                    </style>
                </head>
                
                <body width="100%" style="margin: 0;">
                    <center style="width: 100%; background: #edf2f740; text-align: left;">
                        <div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"
                            class="email-container">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
                                style="border: 1px solid #ddd; padding-bottom: 50px;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div style="padding:20px;text-align: center;">
                                                <div style="width:20%;margin: 0 auto;">
                                                    <img style="max-width: 100%;" src='`+req.logo_url+`' class="g-img">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div
                                                style="background-color: ${colorTheme};padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">
                                                <h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">ORDER${deliveredMsg}
                                                </h2>
                                                <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;">Thank you for placing your order with  <strong>
                                                 </strong>${req.business_name}.</h2>
                                                <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;"> Your order has been ${deliveredMsg}</h2>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style="padding:20px 25px;text-align: left;font-size: 14px;line-height: 24px;">
                                                <h4 style="margin: 0px;">Order details</h4>
                                                <p style="margin: 0px;">Order no. ${orderId}</p>
                                            </div>
                                        </td>
                                    </tr>`
                           let footer=`<tr>
                                        <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                                        margin: 0px 25px;
                                        max-width: 92%;
                                    "></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table style="margin: 0px 25px;">
                                                <tbody>
                                                    <tr>
                                                        <td style="width: 50%;">
                                                            <div style="padding: 15px 0px;margin: 0px 0px;">
                                                                <table
                                                                    style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 300; color: #0000009e;padding-right: 10px;">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style="font-weight: 600;font-size: 16px;">Billing
                                                                                details</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style="width:">Total order amount: </td>
                                                                            <td style="text-align: right;">${currencyName} ${amount}</td>
                                                                        </tr>
                                                                        <tr>
                                                                        <td style="width:">Order place date: </td>
                                                                        <td style="text-align: right;">${placeDate}</td>
                                                                       </tr>
                                                                       <tr>
                                                                       <td style="width:">Order ref number: </td>
                                                                       <td style="text-align: right;">${orderId}</td>
                                                                      </tr>
                                                                        <tr>
                                                                            <td style="width:">Expected ${deliveryTimeText}: </td>
                                                                            <td style="text-align: right;">${deliveryDate}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style="width:">Supplier name: </td>
                                                                            <td style="text-align: right;">${supplierNameEnglish} </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style="width:">Payment method: </td>
                                                                            <td style="text-align: right;">${paymentMethodTxt} </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    
                                                </tbody>
                
                                            </table>
                
                                        </td>
                                        
                                    </tr>
                                    <tr>
                                        <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                                        margin: 0px 25px;
                                        max-width: 92%;
                                    "></td>
                                    </tr>
                                    <!-- <tr>
                                        <td><hr style="background-color: #e84b58;">
                                        </td>
                                    </tr> -->
                                </tbody>
                            </table>
                        </div>
                    </center>
                </body>
                </html>`
                email=email+footer;
 
             //    var email ='<html lang="en">';
             //    email+='<body style="background:#c1c1c1">';
             //    email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif; background: #ffffff !important;">';
             //    email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
             //    email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
             //    email+='<b>Dear '+name+'</b>';
             //    email+='<br>';
             //    email+='<br>';
             //    email+='Thank you for placing your order with '+req.business_name+'. Your order has been Confirmed. ';
             //    email+='';
             //    email+='<br>';
             //    email+='<br>';
             //    email+='Below are the details of your Transaction:';
             //    email+='';
             //    email+='';
             //    email+='<br>';
             //    email+='<table style="width:60%; margin-left:55px;">';
             //    email+='<tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Total Order Amount:: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+amount+'</td>';
             //    email+='</tr>';
             //    email+='<tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Place Date: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
             //    email+='</tr>';
             //    email+='<tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Expected Delivery Time:</td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+deliveryDate+'</td>';
             //    email+='</tr>';
             //    email+='<tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
             //    email+='</tr><tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">Supplier Name: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">'+supplierNameEnglish+'</td>';
             //    email+='</tr><tr>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Payment Method: </td>';
             //    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>'
             //    email+='</tr>'
             //    email+='</table>'
             //    email+='';
             //    email+='';
             //    email+='';
             //    email+='';
             //    email+='<br>';
             //    email+='For Further Details, please login to your Account to Confirm & Manage the Order';
             //    email+='';
             //    email+='';
             //    email+='<br>';
             // //    email+='Please Do Not Hesitate to contact Us if you need any Further Assistance';
             // //    email+='<br>';
             // //    email+='Tel: 04- 347 6654';
             // //    email+='<br>';
             // //    email+='Email: '+req.help_email+'';
             // //    email+='<br>';
             // //    email+='Or Use Our Live Chat Service to Talk to our Customer Service Representative';
             // //    email+='<br>';
             //    email+='';
             //    email+='';
             //    email+='</pre>';
             //    // email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
             //    email+='<br><br>';
             
             //    email += '<br>'
             //    for (var im=0;im<data.length;im++) {
             //        email += '<div><img style="width:100%" src="' + data[im].banner_image + '" ></div>';
             //    }
 
 
             // //    email+='<span style="margin-left: 25px; margin-top: 10px">Disclaimer:</span>';
             // //    email+='';
             // //    email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-left: 50px">';
             // //    email+='<li>'+req.business_name+'.com is not responsible of the Production of Products, Quality, Delivery, and The Product or Services Pricing. The Supplier is sole Responsible for all Provided Products </li>';
             // //    email+='<li>'+req.business_name+' is Online Platform Brings User and Supplier into one Market online place and hence '+req.business_name+' is not Responsible of any damage can be caused by the supplier offers services or Products. The Consumer is required to contact us in case of any unsatisfied experience for our further evaluation. </li>';
             // //    email+='<li>This is an email confirmation of the order and it cannot be used as Invoice of supplier. </li>';
             // //    email+='<li>The Completed Order is Subjected to The Terms & Conditions of '+req.business_name+' and Supplier indicated in our website & Mobile App</li>';
             // //    email+='<li>The Supplier hold sole Responsibility of Pricing, Product Availability and quality of service and the content provided.</li>';
             // //    email+='</ol>';
             //    email+='';
             //        email+='</section>';
             //    email+='</body>';
             //    email+='</html>';
 
 
            }
            else if(notificationLanguage==15){
                var subject = "تم تسليم طلبك"+orderId;
 
                var     email='<!DOCTYPE html>';
                email+='<html lang="en">';
                email+='<head>';
                email+='<meta charset="UTF-8">';
                email+='</head>';
                email+='<body style="background:#c1c1c1>';
                email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif; background: #ffffff  !important;">';
                email+='';
                email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
                email+='    <pre>';
                email+='';
                email+='';
                email+='<div style="font-size:15px; font-family: verdana san-serif;" dir="rtl">';
                email+='<br>';
                email+='         تفاصيل طلبك كالتالي:-';
                email+='<br>';
                email+='        <table style="width:60%; margin-right:55px; font-size: 15px">';
                email+='        <tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اجمالي قيمه الطلب</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+currencyName+' '+amount+'</td>';
                email+='        </tr>';
                email+='        <tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> تاريخ ووقت تنفيذ الطلب:</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
                email+='        </tr>';
                email+='        <tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">تاريخ ووقت توصيل الطلب المتوقع: </td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+deliveryDate+'</td>';
                email+='        </tr>';
                email+='        <tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> رقم الطلب</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
                email+='        </tr><tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اسم مزود الخدمة</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+supplierNameArabic+'</td>';
                email+='        </tr><tr>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">طريقه الدفع</td>';
                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethodTxt+'</td>';
                email+='        </tr>';
                email+='    </table>';
                email+='';
                email+='';
                email+='<br>';
                email+='<p style="margin-right: 35px">';
                email+='';
                email+='';
                email+='للاطلاع على تفاصيل طلبك ومتابعه حاله طلبك الرجاء الدخول عبر حسابك الى التطبيق.';
                email+='';
                email+='<br>';
                email+='';
                email+='الرجاء عدم التردد بالتواصل معنا للحصول على المساعدة والدعم عبر القنوات التأليه: -';
                email+='<br>';
                email+='';
                // email+='هاتف:04-343 6039';
                email+='<br>';
                email+='ايميل:'+req.help_email+'';
                email+='<br>';
                email+='او يمكنكم التحدث مباشره مع أحد موظفين خدمه العملاء عن طريق نظام المحادثة للدعم المباشر المتواجد في التطبيق';
                email+='<br>';
                email+='';
                email+='</p>';
                email+='</div>';
                email+='</pre>';
                //email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
                email+='';
                email+='<div dir="rtl">';
                email+='    <br>';
                email += '<br>'
 
                for (var im=0;im<data.length;im++) {
                    console.log(".============================",data[im]);
                    email += '<div><img style="width:100%" src="' + data[im].banner_image + '" ></div>';
                }
                email+='<br>';
                email+='<span style="margin-right: 45px; margin-top: 10px">اخلاء مسؤوليه</span>';
                email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-right: 50px" >';
                email+='    <li>'+req.business_name+'.com ليست مسؤولة عن إنتاج المنتجات المعروضه ، جودتها ، توصيلها ، أو الخدمات وتسعيرها . مزورد الخدمه هو الوحيد المسؤول عن المنتجات المطلوبه.</li>';
                email+='<li>'+req.business_name+'.com هي منصةالكترونيه عبر الانترنت تربط المستخدم و مزود الخدمه عبر منصه الكترونيه واحده عبر الانترنت ، وبالتالي '+req.business_name+' ليست مسؤولة عن أي ضرر يمكن أن يحدث من قبل المورد او مايقدمه من خدمات أو منتجات . يرجى من المستهلك الاتصال بنا في حال عدم الرضاء عن جوده المنتج او الخدمه او تقييم مزود الخدمه عبر نظام التقييم لدينا </li>';
                email+='<li>هذاالبريد الإلكتروني مصدر من النظام، لا يمكن أن يستخدم كفاتورة.</li>';
                email+='<li>جميع الطلبات خاضعه لشروط واحكام تطبيق '+req.business_name+' و مزود الخدمه كما هو مبين في موقعنا على الانترنت و تطبيق الهاتف.</li>';
                email+='<li>مورد الخدمه وحده يتحمل المسؤولية كامله عن اسعار المنتجات ، توافر المنتج وجوده المنتج والخدمه.</li>';
                email+='</ol>';
                email+='';
                email+='<br>';
                email+='</div>';
                email+='';
              
                email+='</section>';
                email+='</body>';
                email+='</html>';
            }else{
             var subject = ""+req.business_name+" -Delivered of order no "+orderId;
             var email ='<html lang="en">';
             email+='<body style="background:#c1c1c1">';
             email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif; background: #ffffff !important;">';
             email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
             email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
             email+='<b>Saludos '+name+','+'</b>';
             email+='<br>';
             email+='<br>';
             email+='Gracias por tu orden en '+req.business_name+', Tu orden ha sido confirmada por el local. ';
             email+='';
             email+='<br>';
             email+='<br>';
             email+='Detalles de la transaccion:';
             email+='';
             email+='';
             email+='<br>';
             email+='<table style="width:60%; margin-left:55px;">';
             email+='<tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Precio Total de la Orden: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+amount+'</td>';
             email+='</tr>';
             email+='<tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Fecha de la orden: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
             email+='</tr>';
             email+='<tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Tiempo estimado del delivery:</td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+deliveryDate+'</td>';
             email+='</tr>';
             email+='<tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Numero de Orden: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
             email+='</tr><tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">Nombre del Local: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">'+supplierNameEnglish+'</td>';
             email+='</tr><tr>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Metodo de pago: </td>';
             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethodTxt+'</td>'
             email+='</tr>'
             email+='</table>'
             email+='';
             email+='';
             email+='';
             email+='';
             email+='<br>';
             email+='Para mas detalles, porfavor haz login en tu cuenta y revisa tus Ordenes en la navegación.';
             email+='';
             email+='';
             email+='<br>';
             email+='<br>';
             email+='<br>';
             email+='Si hay algún problema o eventualidad no dudes en escribirnos a '+req.help_email+' y responderemos lo mas rapido posible.';
             email+='';
             email+='';
             email+='</pre>';
             // email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
             email+='<br><br>';
          
             email += '<br>'
             for (var im=0;im<data.length;im++) {
                 email += '<div><img style="width:100%" src="' + data[im].banner_image + '" ></div>';
             }
 
 
             email+='';
             email+='';
                 email+='</section>';
             email+='</body>';
             email+='</html>';
            }
           }

           
           func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[userEmail],email,0,function(err,result){
               if(err){
                   callback(err);
               }else{
                   callback(null)
               }
           });
       }]
   },function(err,result){  
       if(err){
           callback(err);
       }else{
           callback(null)
       }
   })






}
catch(Err){
    console.log("===deliverOrder=Error",Err)
    callback(null)
}
}
// exports.acceptOrder = async function(req,dbName,reply,AdminMail,name,amount,placeDate,deliveryDate,orderId,supplierNameEnglish,supplierNameArabic,paymentMethod,userEmail,notificationLanguage,callback){
//     let smtpSqlSata=await Universal.smtpData(req.dbName);
//     var data = [];
    
//     async.auto({
//        getSupplierImage:function(cb){
//            var sql = "select banner_image from advertisements where advertisement_type = 4 and start_date <= CURDATE() and end_date >= CURDATE()";
//            multiConnection[dbName].query(sql,[], function(err, result) {
//                if(result.length){
//                    console.log("********************result************",result);
//                    data = result;
//                    cb(null);
//                }else{
//                    data = [];
//                    cb(null);
//                }
//            });
//        },
//        sendMail:['getSupplierImage',function(cb){
//            if(notificationLanguage==14){
//                var subject = ""+req.business_name+".com -Confirmation of Order No "+orderId;
//                var email ='<html lang="en">';
//                email+='<body style="background:#c1c1c1">';
//                email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif; background: #ffffff !important;">';
//                email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//                email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
//                email+='<b>Dear '+name+'</b>';
//                email+='<br>';
//                email+='<br>';
//                email+='Thank you for placing your order with '+req.business_name+'. Your order has been Confirmed. ';
//                email+='';
//                email+='<br>';
//                email+='<br>';
//                email+='Below are the details of your Transaction:';
//                email+='';
//                email+='';
//                email+='<br>';
//                email+='<table style="width:60%; margin-left:55px;">';
//                email+='<tr>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Total Order Amount:: </td>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+amount+'</td>';
//                email+='</tr>';
//                email+='<tr>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Place Date: </td>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
//                email+='</tr>';
//                email+='<tr>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Expected Delivery Time:</td>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+deliveryDate+'</td>';
//                email+='</tr>';
//                email+='<tr>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
//                email+='</tr><tr>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">Supplier Name: </td>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">'+supplierNameEnglish+'</td>';
//                email+='</tr><tr>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Payment Method: </td>';
//                email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>'
//                email+='</tr>'
//                email+='</table>'
//                email+='';
//                email+='';
//                email+='';
//                email+='';
//                email+='<br>';
//                email+='For Further Details, please login to your Account to Confirm & Manage the Order';
//                email+='';
//                email+='';
//                email+='<br>';
//             //    email+='Please Do Not Hesitate to contact Us if you need any Further Assistance';
//             //    email+='<br>';
//             //    email+='Tel: 04- 347 6654';
//             //    email+='<br>';
//             //    email+='Email: '+req.help_email+'';
//             //    email+='<br>';
//             //    email+='Or Use Our Live Chat Service to Talk to our Customer Service Representative';
//             //    email+='<br>';
//                email+='';
//                email+='';
//                email+='</pre>';
//                // email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//                email+='<br><br>';
            
//                email += '<br>'
//                for (var im=0;im<data.length;im++) {
//                    email += '<div><img style="width:100%" src="' + data[im].banner_image + '" ></div>';
//                }


//             //    email+='<span style="margin-left: 25px; margin-top: 10px">Disclaimer:</span>';
//             //    email+='';
//             //    email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-left: 50px">';
//             //    email+='<li>'+req.business_name+'.com is not responsible of the Production of Products, Quality, Delivery, and The Product or Services Pricing. The Supplier is sole Responsible for all Provided Products </li>';
//             //    email+='<li>'+req.business_name+' is Online Platform Brings User and Supplier into one Market online place and hence '+req.business_name+' is not Responsible of any damage can be caused by the supplier offers services or Products. The Consumer is required to contact us in case of any unsatisfied experience for our further evaluation. </li>';
//             //    email+='<li>This is an email confirmation of the order and it cannot be used as Invoice of supplier. </li>';
//             //    email+='<li>The Completed Order is Subjected to The Terms & Conditions of '+req.business_name+' and Supplier indicated in our website & Mobile App</li>';
//             //    email+='<li>The Supplier hold sole Responsibility of Pricing, Product Availability and quality of service and the content provided.</li>';
//             //    email+='</ol>';
//                email+='';
//                    email+='</section>';
//                email+='</body>';
//                email+='</html>';
//            }
//            else if(notificationLanguage==15){
//                var subject = " كليكات- تم تاكيد طلبك رقم"+orderId;

//                var     email='<!DOCTYPE html>';
//                email+='<html lang="en">';
//                email+='<head>';
//                email+='<meta charset="UTF-8">';
//                email+='</head>';
//                email+='<body style="background:#c1c1c1>';
//                email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif; background: #ffffff  !important;">';
//                email+='';
//                email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//                email+='    <pre>';
//                email+='';
//                email+='';
//                email+='<div style="font-size:15px; font-family: verdana san-serif;" dir="rtl">';
//                email+='<br>';
//                email+='         تفاصيل طلبك كالتالي:-';
//                email+='<br>';
//                email+='        <table style="width:60%; margin-right:55px; font-size: 15px">';
//                email+='        <tr>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اجمالي قيمه الطلب</td>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> USD '+amount+'</td>';
//                email+='        </tr>';
//                email+='        <tr>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> تاريخ ووقت تنفيذ الطلب:</td>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
//                email+='        </tr>';
//                email+='        <tr>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">تاريخ ووقت توصيل الطلب المتوقع: </td>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+deliveryDate+'</td>';
//                email+='        </tr>';
//                email+='        <tr>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> رقم الطلب</td>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
//                email+='        </tr><tr>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اسم مزود الخدمة</td>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+supplierNameArabic+'</td>';
//                email+='        </tr><tr>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">طريقه الدفع</td>';
//                email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>';
//                email+='        </tr>';
//                email+='    </table>';
//                email+='';
//                email+='';
//                email+='<br>';
//                email+='<p style="margin-right: 35px">';
//                email+='';
//                email+='';
//                email+='للاطلاع على تفاصيل طلبك ومتابعه حاله طلبك الرجاء الدخول عبر حسابك الى التطبيق.';
//                email+='';
//                email+='<br>';
//                email+='';
//                email+='الرجاء عدم التردد بالتواصل معنا للحصول على المساعدة والدعم عبر القنوات التأليه: -';
//                email+='<br>';
//                email+='';
//                email+='هاتف:04-343 6039';
//                email+='<br>';
//                email+='ايميل:'+req.help_email+'';
//                email+='<br>';
//                email+='او يمكنكم التحدث مباشره مع أحد موظفين خدمه العملاء عن طريق نظام المحادثة للدعم المباشر المتواجد في التطبيق';
//                email+='<br>';
//                email+='';
//                email+='</p>';
//                email+='</div>';
//                email+='</pre>';
//                //email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//                email+='';
//                email+='<div dir="rtl">';
//                email+='    <br>';
//                email += '<br>'

//                for (var im=0;im<data.length;im++) {
//                    console.log(".============================",data[im]);
//                    email += '<div><img style="width:100%" src="' + data[im].banner_image + '" ></div>';
//                }
//                email+='<br>';
//                email+='<span style="margin-right: 45px; margin-top: 10px">اخلاء مسؤوليه</span>';
//                email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-right: 50px" >';
//                email+='    <li>'+req.business_name+'.com ليست مسؤولة عن إنتاج المنتجات المعروضه ، جودتها ، توصيلها ، أو الخدمات وتسعيرها . مزورد الخدمه هو الوحيد المسؤول عن المنتجات المطلوبه.</li>';
//                email+='<li>'+req.business_name+'.com هي منصةالكترونيه عبر الانترنت تربط المستخدم و مزود الخدمه عبر منصه الكترونيه واحده عبر الانترنت ، وبالتالي '+req.business_name+' ليست مسؤولة عن أي ضرر يمكن أن يحدث من قبل المورد او مايقدمه من خدمات أو منتجات . يرجى من المستهلك الاتصال بنا في حال عدم الرضاء عن جوده المنتج او الخدمه او تقييم مزود الخدمه عبر نظام التقييم لدينا </li>';
//                email+='<li>هذاالبريد الإلكتروني مصدر من النظام، لا يمكن أن يستخدم كفاتورة.</li>';
//                email+='<li>جميع الطلبات خاضعه لشروط واحكام تطبيق '+req.business_name+' و مزود الخدمه كما هو مبين في موقعنا على الانترنت و تطبيق الهاتف.</li>';
//                email+='<li>مورد الخدمه وحده يتحمل المسؤولية كامله عن اسعار المنتجات ، توافر المنتج وجوده المنتج والخدمه.</li>';
//                email+='</ol>';
//                email+='';
//                email+='<br>';
//                email+='</div>';
//                email+='';
             
//                email+='</section>';
//                email+='</body>';
//                email+='</html>';
//            }else{
//             var subject = ""+req.business_name+".com -Confirmation of Order No "+orderId;
//             var email ='<html lang="en">';
//             email+='<body style="background:#c1c1c1">';
//             email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif; background: #ffffff !important;">';
//             email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//             email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
//             email+='<b>Saludos '+name+','+'</b>';
//             email+='<br>';
//             email+='<br>';
//             email+='Gracias por tu orden en '+req.business_name+', Tu orden ha sido confirmada por el local. ';
//             email+='';
//             email+='<br>';
//             email+='<br>';
//             email+='Detalles de la transaccion:';
//             email+='';
//             email+='';
//             email+='<br>';
//             email+='<table style="width:60%; margin-left:55px;">';
//             email+='<tr>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Precio Total de la Orden: </td>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+amount+'</td>';
//             email+='</tr>';
//             email+='<tr>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Fecha de la orden: </td>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
//             email+='</tr>';
//             email+='<tr>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Tiempo estimado del delivery:</td>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+deliveryDate+'</td>';
//             email+='</tr>';
//             email+='<tr>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Numero de Orden: </td>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
//             email+='</tr><tr>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">Nombre del Local: </td>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px">'+supplierNameEnglish+'</td>';
//             email+='</tr><tr>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Metodo de pago: </td>';
//             email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>'
//             email+='</tr>'
//             email+='</table>'
//             email+='';
//             email+='';
//             email+='';
//             email+='';
//             email+='<br>';
//             email+='Para mas detalles, porfavor haz login en tu cuenta y revisa tus Ordenes en la navegación.';
//             email+='';
//             email+='';
//             email+='<br>';
//             email+='<br>';
//             email+='<br>';
//             email+='Si hay algún problema o eventualidad no dudes en escribirnos a '+req.help_email+' y responderemos lo mas rapido posible.';
//             email+='';
//             email+='';
//             email+='</pre>';
//             // email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//             email+='<br><br>';
         
//             email += '<br>'
//             for (var im=0;im<data.length;im++) {
//                 email += '<div><img style="width:100%" src="' + data[im].banner_image + '" ></div>';
//             }


//             email+='';
//             email+='';
//                 email+='</section>';
//             email+='</body>';
//             email+='</html>';
//            }
           
//            func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[AdminMail,userEmail],email,0,function(err,result){
//                if(err){
//                    callback(err);
//                }else{
//                    callback(null)
//                }
//            });
//        }]
//    },function(err,result){  
//        if(err){
//            callback(err);
//        }else{
//            callback(null)
//        }
//    })

// }
exports.userRegister = async function(request,reply,adminEmail,name,password,userEmail,languageId,dbConnection,callback){
    var data = [];
    let smtpSqlSata=await Universal.smtpData(request.dbName);
    let colorThemeData=await Execute.Query(request.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let new_email_template_v10=await Execute.Query(request.dbName,"select `key`,`value` from tbl_setting where `key`=? and value=1 ",["new_emain_template_v10"]);
    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
    async.auto({
        getImage:function(cb){
            // var sql = "select banner_image from advertisements where advertisement_type = 4 and start_date <= CURDATE() and end_date >= CURDATE()";
            // dbConnection.query(sql,[], function(err, result) {
            //     if(result.length){
            //         data = result;
            //         cb(null);
            //     }else{
                    data = [];
                    cb(null);
            //     }
            // });
        },
        sendMail:['getImage',function(cb){

            if(0){
                `<!DOCTYPE html>
                <html>
                <head>
                    <title>Registration Email</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                </head>
                <body style="font-family: Segoe UI, Roboto, Helvetica Neue,Helvetica, Arial,sans-serif; background: #fff;  max-width: 700px;  margin:40px 10px; padding: 0px; border-radius: 15px; display:table; margin: 15px auto;">
                
                       <table  cellspacing="0" cellpanding="0" style="max-width:700px;  border-collapse: collapse; border-radius: 15px; border: 1px solid #eee;">
                            <tr>
                            <td style="padding: 0px;">
                           
                                <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2; " cellspacing="0" cellpanding="0">
                                    <tbody>
                                        <tr>
                                            <td style="padding: 10px 20px;"> 
                                                <img src="images/logo.png" alt="" 
                                                 style="display: inline-block; width: 100px; margin:0 0 0px; ">
                                            </td>
                                            
                                        </tr>
                                    </tbody>
                                </table>        
                                <table style="width: 100%; ">
                                    <tbody>
                                        <tr>
                                             <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                              <h3></h3>
                                                <p  style="font-size: 16px; color: #666; margin:0px; ">Successful Registration!
                                                </p>
                                                 <p style="color: #666; font-size: 16px; line-height:20px;">Congratulations Service provider name, you have been registered with Body Formula as a stylist at your doorstep </p>
                                                 <p style="color: #666; font-size: 16px; line-height:20px;">We’re glad you chose us to be Your Service Expert. </p>
                                                  <p style="color: #666; font-size: 16px; line-height:20px;">Our team works hard to serve you well, and we ensure that you are always matched with the right person for the job. It’s a tough task, but we continuously strive to ensure a stellar experience for you. So, trust us - you’re in good hands! </p>
                                                 
                                                <P style="color: #666; font-size: 16px;">Your ID – </P>
                                                <P style="color: #666; font-size: 16px;">Password - </P>
                                                <P style="color: #666; font-size: 16px;">Wishing your Business Prosperity and Success </P>
                                                <P style="color: #666; font-size: 16px;">If you have any questions along the way, email us at <a style="color: #000; text-decoration: underline;" href="info@bodyformula.ca" title="">info@bodyformula.ca </a>or text us at  <a href="#" style="color:#000;">1-236-332 8164.</a></P>
                                                <p>Speak to you soon!</p>
                                                <p>Team Body Formula</p>
                                            </td>
                                        </tr>                   
                                    </tbody>
                                </table>
                                <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2; " cellspacing="0" cellpanding="0">
                                    <tbody>
                                        <tr>
                                            <td style="padding: 10px 20px;"> 
                                                <h3 style="width: 300px;font-size: 14px;">Body Formula Ltd</h3>
                                                <p style="margin:0;">Unsubscribe</p>
                                            </td>
                                            <td style="text-align: right; width: 90%;  padding: 10px 10px;">
                                                
                                                <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                                            </td>
                                            <td style="text-align: right; width: 70%;  padding: 10px 10px;">
                                                
                                                <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                                            </td>
                                            <td style="text-align: right; width: 70%;  padding: 10px 10px;">
                                                
                                                <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
                                            </td>
                                            <td style="text-align: right; width: 70%;  padding: 10px 10px;">
                                                
                                                <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-instagram" aria-hidden="true"></i></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table> 
                          </td>
                       </tr>
                     </table>
                           
                </body>
                </html>`
            }else{
                if(languageId == 14)
                {
                    var subject = "Welcome To "+request.business_name+".com  ";
                    // var email='<!DOCTYPE html>';
                    // email+='<html lang="en">';
                    // email+='<head>';
                    // email+='<meta charset="UTF-8">';
                    // email+='<title>Registration Email</title>';
                    // email+='</head>';
                    // email+='<body>';
                    // email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
                    // email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
                    // email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
                    // email+='<b>Welcome To '+request.business_name+' App</b>';
                    // email+='';
                    // email+='        Dear User,';
                    // email+='</br>';
                    // email+='</br>';
                    // email+='        Thank you very much for Registering at '+request.business_name+' the Leading Online Market Place.';
                    // email+='</br>';
                    // email+='        Please find below your Access Details';
                    // email+='</br>';
                    // email+='</br>';
                    // email+='        Username :' +name;
                    // // email+='        Password : '+password;
                    // email+='<br>';
                    // email+='<br>';
                    // email+='        Now you can enjoy Ordering from Variety of Products/Service delivered to your Home step.';
                    // // email+='        Start Collecting Royo Loyalty Points which can be redeemed Against Multiple services & Products Vouchers';
                    // // email+='        <span style="display:table; margin:0 auto;"> Royo Life Couldn’t be Simpler</span>';
                    // email+='<br>';
                    // email+='<br>';
                    // email+='        For Inquires Please contact Us at :-';
                    // email+='        '+request.help_email+'';
                    // // email+='        Tel: 04- 343 6039';
                    // email+='<br>';
                    // email+='        Regards';
                    // email+='        '+request.business_name+' Team';
                    // email+='';
                    // email+='       </pre>';
                    // email+='';
                    // email+='';
                    // email+='';
                    // for (var im=0;im<data.length;im++) {
                    //     email += '<div><img style="width:100%;" src="' + data[im].banner_image + '" ></div>';
                    // }
                    // email+='</section>';
                    // email+='</body>';
                    // email+='</html>';
    
    
        var email =   "<!doctype html> "+
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">'+
        
        '<head>'+
            '<meta charset="utf-8">'+
            '<meta name="viewport" content="width=device-width">'+
            '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
            '<meta name="x-apple-disable-message-reformatting">'+
            '<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">'+
        
            '<title>'+
             'Welcome'+
            '</title>'+
            '<style>'+
                'html,'+
                'body {'+
                    'margin: 0 auto !important;'+
                    'letter-spacing: 0.5px;'+
                    'padding: 0 !important;'+
                    'height: 100% !important;'+
                    'width: 100% !important;'+
                    'font-family: "Montserrat",'+
                    'sans-serif;'+
                '}'+
        
                '* {'+
                    '-ms-text-size-adjust: 100%;'+
                    '-webkit-text-size-adjust: 100%;'+
                '}'+
        
                'div[style*="margin: 16px 0"] {'+
                    'margin: 0 !important;'+
                '}'+
        
                'table,'+
                'td {'+
                    'mso-table-lspace: 0pt !important;'+
                    'mso-table-rspace: 0pt !important;'+
                '}'+
        
        
                'table table table {'+
                    'table-layout: auto;'+
                '}'+
        
                'img {'+
                    '-ms-interpolation-mode: bicubic;'+
                '}'+
        
                '[x-apple-data-detectors],'+
                '.x-gmail-data-detectors,'+
                '.x-gmail-data-detectors *,'+
                '.aBn {'+
                    'border-bottom: 0 !important;'+
                    'cursor: default !important;'+
                    'color: inherit !important;'+
                    'text-decoration: none !important;'+
                    'font-size: inherit !important;'+
                    'font-family: inherit !important;'+
                    'font-weight: inherit !important;'+
                    'line-height: inherit !important;'+
                '}'+
            '</style>'+
        '</head>'+
        
        '<body width="100%" style="margin: 0;">'+
            '<center style="width: 100%; background: #edf2f740; text-align: left;">'+
                '<div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"'+
                    'class="email-container">'+
                    '<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"'+
                        'style="border: 1px solid #ddd; padding-bottom: 50px;">'+
                        '<tbody>'+
                            '<tr>'+
                                '<td>'+
                                    '<div style="padding:20px;text-align: center;">'+
                                        '<div style="width:20%;margin: 0 auto;">'+
                                            '<img style="max-width: 100%;" src='+request.logo_url+' class="g-img">'+
                                        '</div>'+
                                    '</div>'+
                                '</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>'+
                                    '<div '+
                                    ' style="background-color: "'+colorTheme+'";padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">'+
                                    '<h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">""'+
                                    ' </h2>'+
                                    '</div>'+
                                '</td>'+
                            '</tr>'+
        
                            '<tr>'+
                                '<td>'+
                                    '<div style="background-color: #88b1a90d; padding: 20px 20px;margin: 0px 25px 20px;">'+
                                        '<table style="width: 100%;font-size: 14px;font-weight: 300;">'+
                                            '<tbody>'+
                                                '<tr>'+
                                                    '<td style="font-weight: 600;font-size: 16px;padding-bottom: 10px;">Hi '+name+'!</td>'+
                                                '</tr>'+
                                                '<tr>'+
                                                    '<td style="padding-bottom: 10px;line-height: 20px;">Thank you very much for registering at '+request.business_name+'.</td>'+
                                                '</tr>'+
                                                '<tr>'+
                                                    '<td style="padding-bottom: 10px;">Please find below your access details</td>'+
                                                '</tr>'+
                                                '<tr>'+
                                                    '<td style="font-weight: 400;padding-bottom: 10px">Username: '+name+'</td>'+
                                                '</tr>'+
    
                                                '<tr>'+
                                                '<td style="font-weight: 400;padding-bottom: 10px">Email: '+userEmail+'</td>'+
                                                '</tr>'+
    
                                                '<tr>'+
                                                '<td style="font-weight: 400;padding-bottom: 10px">Password: '+password+'</td>'+
                                                '</tr>'+
    
                                                '<tr>'+
                                                '<td style="font-weight: 400;padding-bottom: 10px">Now you can enjoy Ordering from Variety of Products/Service delivered to your Home step.</td>'+
                                                '</tr>'+
    
                                            '</tbody>'+
                                        '</table>'+
                                    '</div>'+
                                '</td>'+
                            '</tr>'+
        
                            '<tr>'+
                                '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                                'margin: 0px 25px;'+
                                'max-width: 92%;'+
                            '"></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                                'margin: 0px 25px;'+
                                'max-width: 92%;'+
                            '"></td>'+
                            '</tr>'+
                            '<!-- <tr>'+
                                '<td><hr style="background-color: #e84b58;">'+
                                '</td>'+
                            '</tr> -->'+
                        '</tbody>'+
                    '</table>'+
                '</div>'+
            '</center>'+
        '</body>'+
        
        '</html>'
    
                }
                else {
                    var subject = "مرحبا بك في كليكات اول منصه الكترونيه للخدمات المنزليه";
    
                    var email='<!DOCTYPE html>';
                    email+='<html lang="en">';
                    email+='<head>';
                    email+='<meta charset="UTF-8">';
                    email+='<title>Registration Email</title>';
                    email+='</head>';
                    email+='<body>';
                    email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
                    email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
                    email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
                    email+='<div dir="rtl">';
                    email+=' مرحبا بكم في كليكات';
                    email+='';
                    email+='عميلنا العزيز';
                    email+='';
                    email+='نود ان نشكركم لتسجيلكم معنا في تطبيق كليكات اول واكبر منصة للخدمات المنزلية اون لاين في الامارات العربية المتحدة.';
                    email+='';
                    email+='';
                    email+='تفاصيل تسجيل الدخول الخاصة بك';
                    email+=Username+': اسم المستخدم';
                    email+=Password+':كلمه المرور';
                    email+='';
                    email+='';
                    email+='الان يمكنكم طلب جميع';
                    email+='الاحتياجات المنزلية وسيتم توصيلها الى باب منزلكم.  ابدأ بجمع نقاط الولاء التي يمكنكم استبدالها بقسائم شرائية متنوعه.';
                    email+='';
                    email+='';
                    email+='<span style=" display:table; margin: 0px auto">كليكات...لجعل حياتك أسهل.</span>';
                    email+='';
                    email+='للاستفسارات والمساعده الرجاء التواصل معنا على:-';
                    // email+='هاتف:04-343 6039';
                    email+='ايميل:'+request.help_email+'';
                    email+='';
                    email+='مع اطيب التحيات';
                    email+='فريق عمل كليكات';
                    email+='';
                    email+='        </div>';
                    email+='';
                    email+='';
                    email+='         </pre>';
                    email+='';
                    email+='';
                    email+='';
                    email+='';
                    email+='';
                    for (var im=0;im<data.length;im++) {
                        email += '<div><img style="width:100%;" src="' + data[im].banner_image + '" ></div>';
                    }
                    email+='</section>';
                    email+='</body>';
                    email+='</html>';
                }
            }



            func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[userEmail],
                email,0,function(err,result){
                if(err){
                    callback(err);
                }else{
                    callback(null)
                }
            });
        }]
    },function(err,result){
        if(err){

        }else{

        }
    })




}

// exports.userRegister = async function(request,reply,adminEmail,name,password,userEmail,languageId,dbConnection,callback){
//     var data = [];
//     let smtpSqlSata=await Universal.smtpData(request.dbName);
//     async.auto({
//         getImage:function(cb){
//             var sql = "select banner_image from advertisements where advertisement_type = 4 and start_date <= CURDATE() and end_date >= CURDATE()";
//             dbConnection.query(sql,[], function(err, result) {
//                 if(result.length){
//                     data = result;
//                     cb(null);
//                 }else{
//                     data = [];
//                     cb(null);
//                 }
//             });
//         },
//         sendMail:['getImage',function(cb){
//             if(languageId == 14)
//             {
//                 var subject = "Welcome To "+request.business_name+".com Leading Online Market Place ";
//                 var email='<!DOCTYPE html>';
//                 email+='<html lang="en">';
//                 email+='<head>';
//                 email+='<meta charset="UTF-8">';
//                 email+='<title>Registration Email</title>';
//                 email+='</head>';
//                 email+='<body>';
//                 email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
//                 email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//                 email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
//                 email+='<b>Welcome To '+request.business_name+' App</b>';
//                 email+='';
//                 email+='        Dear User,';
//                 email+='</br>';
//                 email+='</br>';
//                 email+='        Thank you very much for Registering at '+request.business_name+' the Leading Online Market Place.';
//                 email+='</br>';
//                 email+='        Please find below your Access Details';
//                 email+='</br>';
//                 email+='</br>';
//                 email+='        Username :' +name;
//                 // email+='        Password : '+password;
//                 email+='<br>';
//                 email+='<br>';
//                 email+='        Now you can enjoy Ordering from Variety of Products/Service delivered to your Home step.';
//                 // email+='        Start Collecting Royo Loyalty Points which can be redeemed Against Multiple services & Products Vouchers';
//                 // email+='        <span style="display:table; margin:0 auto;"> Royo Life Couldn’t be Simpler</span>';
//                 email+='<br>';
//                 email+='<br>';
//                 email+='        For Inquires Please contact Us at :-';
//                 email+='        '+request.help_email+'';
//                 // email+='        Tel: 04- 343 6039';
//                 email+='<br>';
//                 email+='        Regards';
//                 email+='        '+request.business_name+' Team';
//                 email+='';
//                 email+='       </pre>';
//                 email+='';
//                 email+='';
//                 email+='';
//                 for (var im=0;im<data.length;im++) {
//                     email += '<div><img style="width:100%;" src="' + data[im].banner_image + '" ></div>';
//                 }
//                 email+='</section>';
//                 email+='</body>';
//                 email+='</html>';
//             }
//             else {
//                 var subject = "مرحبا بك في كليكات اول منصه الكترونيه للخدمات المنزليه";

//                 var email='<!DOCTYPE html>';
//                 email+='<html lang="en">';
//                 email+='<head>';
//                 email+='<meta charset="UTF-8">';
//                 email+='<title>Registration Email</title>';
//                 email+='</head>';
//                 email+='<body>';
//                 email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
//                 email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//                 email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
//                 email+='<div dir="rtl">';
//                 email+=' مرحبا بكم في كليكات';
//                 email+='';
//                 email+='عميلنا العزيز';
//                 email+='';
//                 email+='نود ان نشكركم لتسجيلكم معنا في تطبيق كليكات اول واكبر منصة للخدمات المنزلية اون لاين في الامارات العربية المتحدة.';
//                 email+='';
//                 email+='';
//                 email+='تفاصيل تسجيل الدخول الخاصة بك';
//                 email+=Username+': اسم المستخدم';
//                 email+=Password+':كلمه المرور';
//                 email+='';
//                 email+='';
//                 email+='الان يمكنكم طلب جميع';
//                 email+='الاحتياجات المنزلية وسيتم توصيلها الى باب منزلكم.  ابدأ بجمع نقاط الولاء التي يمكنكم استبدالها بقسائم شرائية متنوعه.';
//                 email+='';
//                 email+='';
//                 email+='<span style=" display:table; margin: 0px auto">كليكات...لجعل حياتك أسهل.</span>';
//                 email+='';
//                 email+='للاستفسارات والمساعده الرجاء التواصل معنا على:-';
//                 email+='هاتف:04-343 6039';
//                 email+='ايميل:'+request.help_email+'';
//                 email+='';
//                 email+='مع اطيب التحيات';
//                 email+='فريق عمل كليكات';
//                 email+='';
//                 email+='        </div>';
//                 email+='';
//                 email+='';
//                 email+='         </pre>';
//                 email+='';
//                 email+='';
//                 email+='';
//                 email+='';
//                 email+='';
//                 for (var im=0;im<data.length;im++) {
//                     email += '<div><img style="width:100%;" src="' + data[im].banner_image + '" ></div>';
//                 }
//                 email+='</section>';
//                 email+='</body>';
//                 email+='</html>';
//             }


//             func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[userEmail],email,0,function(err,result){
//                 if(err){
//                     callback(err);
//                 }else{
//                     callback(null)
//                 }
//             });
//         }]
//     },function(err,result){
//         if(err){

//         }else{

//         }
//     })




// }


exports.orderRejections =async function(self_pickup,req,dbName,reply,AdminMail,userName,amount,placeDate,deliveryDate,orderId,supplierNameEnglish,supplierNameArabic,paymentMethod,userEmail,notificationLanguage,callback){

    let smtpSqlSata=await Universal.smtpData(req.dbName);
    let currencyData=await Execute.Query(req.dbName,"select currency_name from currency_conversion",[])
    let currencyName=currencyData && currencyData.length>0?currencyData[0].currency_name:"AED";
    let colorThemeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
    logger.debug("=========notif lang=========",notificationLanguage,currencyName)
    let terminologyData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["terminology"]);
    let terminology=terminologyData && terminologyData.length>0?JSON.parse(terminologyData[0].value):{};
    let paymentMethodTxt=terminology["english"]["cod"]!=undefined && terminology["english"]["cod"]!=""?terminology["english"]["cod"]:paymentMethod;
     paymentMethodTxt=parseInt(self_pickup)==1?(terminology.english["cash_on_pickup"]!=undefined && terminology.english["cash_on_pickup"]!=""?terminology.english["cash_on_pickup"]:paymentMethodTxt):paymentMethodTxt
   let deliveryTimeText=parseInt(self_pickup)==1?(terminology.english["order_expected_date"]!=undefined && terminology.english["order_expected_date"]!=""?terminology.english["order_expected_date"]:"pickup time"):"delivery time"
   console.log("====paymentMethodTxt==deliveryTimeText>>",paymentMethodTxt,deliveryTimeText)


    if(notificationLanguage==14){
        var subject = ""+req.business_name+".com -Rejection of Order No "+orderId;
        //var email='<!DOCTYPE html>';
        var email=`<!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="x-apple-disable-message-reformatting">
            <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        
            <title>
                ORDER REJECTION
            </title>
            <style>
                html,
                body {
                    margin: 0 auto !important;
                    letter-spacing: 0.5px;
                    padding: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                    font-family: 'Montserrat', sans-serif;
                }
        
                * {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }
        
                div[style*="margin: 16px 0"] {
                    margin: 0 !important;
                }
        
                table,
                td {
                    mso-table-lspace: 0pt !important;
                    mso-table-rspace: 0pt !important;
                }
        
        
                table table table {
                    table-layout: auto;
                }
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                [x-apple-data-detectors],
                .x-gmail-data-detectors,
                .x-gmail-data-detectors *,
                .aBn {
                    border-bottom: 0 !important;
                    cursor: default !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
            </style>
        </head>
        
        <body width="100%" style="margin: 0;">
            <center style="width: 100%; background: #edf2f740; text-align: left;">
                <div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"
                    class="email-container">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
                        style="border: 1px solid #ddd; padding-bottom: 50px;">
                        <tbody>
                            <tr>
                                <td>
                                    <div style="padding:20px;text-align: center;">
                                        <div style="width:20%;margin: 0 auto;">
                                            <img style="max-width: 100%;" src='`+req.logo_url+`' class="g-img">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div
                                        style="background-color: ${colorTheme};padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">
                                        <h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">ORDER REJECTED
                                        </h2>
                                        <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;">Dear customer,your order has been <strong>
                                        Rejected </strong>From ${supplierNameEnglish}.</h2>
                                        <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;"> Below are the details of your transaction:</h2>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="padding:20px 25px;text-align: left;font-size: 14px;line-height: 24px;">
                                        <h4 style="margin: 0px;">Order Details</h4>
                                        <p style="margin: 0px;">Order No. ${orderId}</p>
                                    </div>
                                </td>
                            </tr>`
                   let footer=`<tr>
                                <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                                margin: 0px 25px;
                                max-width: 92%;
                            "></td>
                            </tr>
                            <tr>
                                <td>
                                    <table style="margin: 0px 25px;">
                                        <tbody>
                                            <tr>
                                                <td style="width: 50%;">
                                                    <div style="padding: 15px 0px;margin: 0px 0px;">
                                                        <table
                                                            style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 300; color: #0000009e;padding-right: 10px;">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="font-weight: 600;font-size: 16px;">Billing
                                                                        Details</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="width:">Total order amount: </td>
                                                                    <td style="text-align: right;">${currencyName} ${amount}</td>
                                                                </tr>
                                                                <tr>
                                                                <td style="width:">Order place date: </td>
                                                                <td style="text-align: right;">${placeDate}</td>
                                                               </tr>
                                                               <tr>
                                                               <td style="width:">Order ref number: </td>
                                                               <td style="text-align: right;">${orderId}</td>
                                                              </tr>
                                                                <tr>
                                                                    <td style="width:">Status: </td>
                                                                    <td style="text-align: right;">Rejected</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="width:">Supplier name: </td>
                                                                    <td style="text-align: right;">${supplierNameEnglish} </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="width:">Payment method: </td>
                                                                    <td style="text-align: right;">${paymentMethodTxt} </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                        </tbody>
        
                                    </table>
        
                                </td>
                                
                            </tr>
                            <tr>
                                <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                                margin: 0px 25px;
                                max-width: 92%;
                            "></td>
                            </tr>
                            <!-- <tr>
                                <td><hr style="background-color: #e84b58;">
                                </td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
            </center>
        </body>
        </html>`
        email=email+footer;
    //    var email='<html lang="en">';
    //     email+='<head>';
    //     email+='<meta charset=="UTF-8">';
    //     email+='<title>ORDER REJECTION</title>';
    //     email+='</head>';
    //     email+='<body>';
    //     email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
    //     email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
    //     email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
    //     email+='<h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;">ORDER REJECTION</h3>';
    //     email+='<b>Dear Customer,</b>';
    //     email+='';
    //     email+='        Your order has been <span>Rejected</span> From '+supplierNameEnglish+'.';
    //     email+='';
    //     email+='        Below are the details of your transaction:';
    //     email+='';
    //     email+='';
    //     email+='<table style="width:60%; margin-left:55px;">';
    //     email+=' <tr>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Total Order Amount:: </td>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">USD '+amount+'</td>';
    //     email+='        </tr>';
    //     email+='        <tr>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Place Date: </td>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
    //     email+='        </tr>';
    //     email+='        <tr>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Status: </td>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span>Rejected</span> </td>';
    //     email+='        </tr>';
    //     email+='        <tr>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
    //     email+='        </tr><tr>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Supplier Name: </td>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+supplierNameEnglish+'</td>';
    //     email+='        </tr><tr>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Payment Method: </td>';
    //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>';
    //     email+='        </tr>';
    //     email+='</table>';
    //     email+='';
    //     email+='';
    //     email+='';
    //     email+='';
    //     email+='';
    //     email+='        For Further Details, please login to your Account to Confirm & Manage the Order';
    //     email+='';
    //     email+='';
    //     // email+='        Please Do Not Hesitate to contact Us if you need any Further Assistance';
    //     // // email+='        Tel: 04- 347 6654';
    //     // email+='        Email: '+req.help_email+'';
    //     // email+='        Or Use Our Live Chat Service to Talk to our Customer Service Representative';
    //     // email+='';
    //     email+='';
    //     email+='</pre>';
    //  //   email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
    //     email+='<br><br>';
    //     // email+='<span style="margin-left: 45px; margin-top: 10px">Disclaimer:</span>';
    //     // email+='';
    //     // email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-left: 50px">';
    //     // email+='<li>'+req.business_name+'.com is not responsible of the Production of Products, Quality, Delivery, and The Product or Services Pricing. The Supplier is sole Responsible for all Provided Products </li>';
    //     // email+='<li>'+req.business_name+' is Online Platform Brings User and Supplier into one Market online place and hence '+req.business_name+' is not Responsible of any damage can be caused by the supplier offers services or Products. The Consumer is required to contact us in case of any unsatisfied experience for our further evaluation. </li>';
    //     // email+='<li>This is an email confirmation of the order and it cannot be used as Invoice of supplier. </li>';
    //     // email+='<li>The Completed Order is Subjected to The Terms & Conditions of '+req.business_name+' and Supplier indicated in our website & Mobile App</li>';
    //     // email+='<li>The Supplier hold sole Responsibility of Pricing, Product Availability and quality of service and the content provided.</li>';
    //     // email+='</ol>';
    //     email+='';
    //     email+='</section>';
    //     email+='</body>';
    //     email+='</html>';

    }else if(notificationLanguage==15){
        var subject = "كليكات- تم رفض طلبك رقم "+orderId;
       var email='<!DOCTYPE html>';
        email+='<html lang="en">';
        email+='<head>';
        email+='<meta charset="UTF-8">';
        email+='<title>ORDER REJECTION</title>';
        email+='</head>';
        email+='<body>';
        email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
        email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email+='<pre>';
        email+='<div style="font-size:15px; font-family: verdana san-serif;" dir="rtl">';
        email+='';
        email+='         <p style="margin-right: 35px">تفاصيل طلبك كالتالي</p>';
        email+='';
        email+='        <table style="width:60%; margin-right:55px; font-size: 15px">';
        email+='        <tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اجمالي قيمه الطلب</td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">USD '+amount+'</td>';
        email+='        </tr>';
        email+='        <tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> تاريخ ووقت تنفيذ الطلب:</td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
        email+='        </tr>';
        email+='        <tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span >حاله الطلب</span> </td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span style = "color: red">رفض</span></td>';
        email+='        </tr>';
        email+='        <tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> رقم الطلب</td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
        email+='        </tr><tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اسم مزود الخدمة</td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+supplierNameArabic+'</td>';
        email+='        </tr><tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">طريقه الدفع</td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethodTxt+'</td>';
        email+='        </tr>';
        email+='</table>';
        email+='';
        email+='';
        email+='<p style="margin-right: 35px">';
        email+='';
        email+='';
        email+='للاطلاع على تفاصيل طلبك ومتابعه حاله طلبك الرجاء الدخول عبر حسابك الى التطبيق.';
        email+='';
        email+='';
        email+='الرجاء عدم التردد بالتواصل معنا للحصول على المساعدة والدعم عبر القنوات التأليه: -';
        email+='';
        // email+='هاتف:04-343 6039';
        email+='ايميل:'+req.help_email+'';
        email+='او يمكنكم التحدث مباشره مع أحد موظفين خدمه العملاء عن طريق نظام المحادثة للدعم المباشر المتواجد في التطبيق';
        email+='';
        email+='</p>';
        email+='</div>';
        email+='</pre>';
     //   email+='    <img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email+='';
        email+='<div dir="rtl">';
        email+='<br>';
        email+='<span style="margin-right: 45px; margin-top: 10px">اخلاء مسؤوليه</span>';
        email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-right: 50px" >';
        email+='<li>'+req.business_name+'.com ليست مسؤولة عن إنتاج المنتجات المعروضه ، جودتها ، توصيلها ، أو الخدمات وتسعيرها . مزورد الخدمه هو الوحيد المسؤول عن المنتجات المطلوبه.</li>';
        email+='<li>'+req.business_name+'.com هي منصةالكترونيه عبر الانترنت تربط المستخدم و مزود الخدمه عبر منصه الكترونيه واحده عبر الانترنت ، وبالتالي  ليست مسؤولة عن أي ضرر يمكن أن يحدث من قبل المورد او مايقدمه من خدمات أو منتجات . يرجى من المستهلك الاتصال بنا في حال عدم الرضاء عن جوده المنتج او الخدمه او تقييم مزود الخدمه عبر نظام التقييم لدينا </li>';
        email+='<li>هذاالبريد الإلكتروني مصدر من النظام، لا يمكن أن يستخدم كفاتورة.</li>';
        email+='<li>جميع الطلبات خاضعه لشروط واحكام تطبيق '+req.business_name+' و مزود الخدمه كما هو مبين في موقعنا على الانترنت و تطبيق الهاتف.</li>';
        email+='<li>مورد الخدمه وحده يتحمل المسؤولية كامله عن اسعار المنتجات ، توافر المنتج وجوده المنتج والخدمه.</li>';
        email+='        </ol>';
        email+='';
        email+='</div>';
        email+='';
        email+='</section>';
        email+='</body>';
        email+='</html>';
    }else{
        var subject = ""+req.business_name+".com -Rejection of Order No "+orderId;
        //var email='<!DOCTYPE html>';
       var email='<html lang="en">';
        email+='<head>';
        email+='<meta charset=="UTF-8">';
        email+='<title>ORDER REJECTION</title>';
        email+='</head>';
        email+='<body>';
        email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
        email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
        email+='<b>Saludos '+req.business_name+',</b>';
        email+='<br><br>';
        email+='Tu orden reciente ha sido rechazada por '+supplierNameEnglish+'. Aqui puedes ver los detalles de la transacción:';
        email+='<br><br>';
        email+='';
        email+='';
        email+='<table style="width:60%; margin-left:55px;">';
        email+=' <tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Precio Total de la Orden: </td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">USD '+amount+'</td>';
        email+='        </tr>';
        email+='        <tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Fecha de la orden: </td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
        email+='        </tr>';
        email+='        <tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Estatus: </td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span>Rechazada</span> </td>';
        email+='        </tr>';
        email+='        <tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Numero de Orden: </td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
        email+='        </tr><tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Nombre del Local: </td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+supplierNameEnglish+'</td>';
        email+='        </tr><tr>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Metodo de pago: </td>';
        email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethodTxt+'</td>';
        email+='        </tr>';
        email+='</table>';
        email+='';
        email+='<br><br>';
        email+='';
        email+='';
        email+='Para mas detalles, porfavor haz login en tu cuenta y revisa tus Ordenes en la navegación.';
        email+='';
        email+='<br><br>';
        email+='Si tienes mas preguntas no dudes en escribirnos a '+supplierNameEnglish+' y responderemos lo mas rapido posible.';
        email+='';
        email+='';
        email+='</pre>';
     //   email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email+='<br><br>';
        email+='';
        email+='';
        email+='</section>';
        email+='</body>';
        email+='</html>';

    }
    func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[userEmail],email,0,function(err,result){
        if(err){
            callback(err);
        }else{
            callback(null)
        }
    });
}
// exports.orderRejections =async function(req,dbName,reply,AdminMail,userName,amount,placeDate,deliveryDate,orderId,supplierNameEnglish,supplierNameArabic,paymentMethod,userEmail,notificationLanguage,callback){

//     let smtpSqlSata=await Universal.smtpData(req.dbName);

//     logger.debug("=========notif lang=========",notificationLanguage)
//     if(notificationLanguage==14){
//         var subject = ""+req.business_name+".com -Rejection of Order No "+orderId;
//         //var email='<!DOCTYPE html>';
//        var email='<html lang="en">';
//         email+='<head>';
//         email+='<meta charset=="UTF-8">';
//         email+='<title>ORDER REJECTION</title>';
//         email+='</head>';
//         email+='<body>';
//         email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
//         email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//         email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
//         email+='<h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;">ORDER REJECTION</h3>';
//         email+='<b>Dear Customer,</b>';
//         email+='';
//         email+='        Your order has been <span>Rejected</span> From '+supplierNameEnglish+'.';
//         email+='';
//         email+='        Below are the details of your transaction:';
//         email+='';
//         email+='';
//         email+='<table style="width:60%; margin-left:55px;">';
//         email+=' <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Total Order Amount:: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">USD '+amount+'</td>';
//         email+='        </tr>';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Place Date: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
//         email+='        </tr>';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Status: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span>Rejected</span> </td>';
//         email+='        </tr>';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
//         email+='        </tr><tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Supplier Name: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+supplierNameEnglish+'</td>';
//         email+='        </tr><tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Payment Method: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>';
//         email+='        </tr>';
//         email+='</table>';
//         email+='';
//         email+='';
//         email+='';
//         email+='';
//         email+='';
//         email+='        For Further Details, please login to your Account to Confirm & Manage the Order';
//         email+='';
//         email+='';
//         // email+='        Please Do Not Hesitate to contact Us if you need any Further Assistance';
//         // // email+='        Tel: 04- 347 6654';
//         // email+='        Email: '+req.help_email+'';
//         // email+='        Or Use Our Live Chat Service to Talk to our Customer Service Representative';
//         // email+='';
//         email+='';
//         email+='</pre>';
//      //   email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//         email+='<br><br>';
//         // email+='<span style="margin-left: 45px; margin-top: 10px">Disclaimer:</span>';
//         // email+='';
//         // email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-left: 50px">';
//         // email+='<li>'+req.business_name+'.com is not responsible of the Production of Products, Quality, Delivery, and The Product or Services Pricing. The Supplier is sole Responsible for all Provided Products </li>';
//         // email+='<li>'+req.business_name+' is Online Platform Brings User and Supplier into one Market online place and hence '+req.business_name+' is not Responsible of any damage can be caused by the supplier offers services or Products. The Consumer is required to contact us in case of any unsatisfied experience for our further evaluation. </li>';
//         // email+='<li>This is an email confirmation of the order and it cannot be used as Invoice of supplier. </li>';
//         // email+='<li>The Completed Order is Subjected to The Terms & Conditions of '+req.business_name+' and Supplier indicated in our website & Mobile App</li>';
//         // email+='<li>The Supplier hold sole Responsibility of Pricing, Product Availability and quality of service and the content provided.</li>';
//         // email+='</ol>';
//         email+='';
//         email+='</section>';
//         email+='</body>';
//         email+='</html>';
//     }else if(notificationLanguage==15){
//         var subject = "كليكات- تم رفض طلبك رقم "+orderId;
//        var email='<!DOCTYPE html>';
//         email+='<html lang="en">';
//         email+='<head>';
//         email+='<meta charset="UTF-8">';
//         email+='<title>ORDER REJECTION</title>';
//         email+='</head>';
//         email+='<body>';
//         email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
//         email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//         email+='<pre>';
//         email+='<div style="font-size:15px; font-family: verdana san-serif;" dir="rtl">';
//         email+='';
//         email+='         <p style="margin-right: 35px">تفاصيل طلبك كالتالي</p>';
//         email+='';
//         email+='        <table style="width:60%; margin-right:55px; font-size: 15px">';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اجمالي قيمه الطلب</td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">USD '+amount+'</td>';
//         email+='        </tr>';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> تاريخ ووقت تنفيذ الطلب:</td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
//         email+='        </tr>';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span >حاله الطلب</span> </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span style = "color: red">رفض</span></td>';
//         email+='        </tr>';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> رقم الطلب</td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
//         email+='        </tr><tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اسم مزود الخدمة</td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+supplierNameArabic+'</td>';
//         email+='        </tr><tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">طريقه الدفع</td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>';
//         email+='        </tr>';
//         email+='</table>';
//         email+='';
//         email+='';
//         email+='<p style="margin-right: 35px">';
//         email+='';
//         email+='';
//         email+='للاطلاع على تفاصيل طلبك ومتابعه حاله طلبك الرجاء الدخول عبر حسابك الى التطبيق.';
//         email+='';
//         email+='';
//         email+='الرجاء عدم التردد بالتواصل معنا للحصول على المساعدة والدعم عبر القنوات التأليه: -';
//         email+='';
//         email+='هاتف:04-343 6039';
//         email+='ايميل:'+req.help_email+'';
//         email+='او يمكنكم التحدث مباشره مع أحد موظفين خدمه العملاء عن طريق نظام المحادثة للدعم المباشر المتواجد في التطبيق';
//         email+='';
//         email+='</p>';
//         email+='</div>';
//         email+='</pre>';
//      //   email+='    <img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//         email+='';
//         email+='<div dir="rtl">';
//         email+='<br>';
//         email+='<span style="margin-right: 45px; margin-top: 10px">اخلاء مسؤوليه</span>';
//         email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-right: 50px" >';
//         email+='<li>'+req.business_name+'.com ليست مسؤولة عن إنتاج المنتجات المعروضه ، جودتها ، توصيلها ، أو الخدمات وتسعيرها . مزورد الخدمه هو الوحيد المسؤول عن المنتجات المطلوبه.</li>';
//         email+='<li>'+req.business_name+'.com هي منصةالكترونيه عبر الانترنت تربط المستخدم و مزود الخدمه عبر منصه الكترونيه واحده عبر الانترنت ، وبالتالي  ليست مسؤولة عن أي ضرر يمكن أن يحدث من قبل المورد او مايقدمه من خدمات أو منتجات . يرجى من المستهلك الاتصال بنا في حال عدم الرضاء عن جوده المنتج او الخدمه او تقييم مزود الخدمه عبر نظام التقييم لدينا </li>';
//         email+='<li>هذاالبريد الإلكتروني مصدر من النظام، لا يمكن أن يستخدم كفاتورة.</li>';
//         email+='<li>جميع الطلبات خاضعه لشروط واحكام تطبيق '+req.business_name+' و مزود الخدمه كما هو مبين في موقعنا على الانترنت و تطبيق الهاتف.</li>';
//         email+='<li>مورد الخدمه وحده يتحمل المسؤولية كامله عن اسعار المنتجات ، توافر المنتج وجوده المنتج والخدمه.</li>';
//         email+='        </ol>';
//         email+='';
//         email+='</div>';
//         email+='';
//         email+='</section>';
//         email+='</body>';
//         email+='</html>';
//     }else{
//         var subject = ""+req.business_name+".com -Rejection of Order No "+orderId;
//         //var email='<!DOCTYPE html>';
//        var email='<html lang="en">';
//         email+='<head>';
//         email+='<meta charset=="UTF-8">';
//         email+='<title>ORDER REJECTION</title>';
//         email+='</head>';
//         email+='<body>';
//         email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
//         email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//         email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
//         email+='<b>Saludos '+req.business_name+',</b>';
//         email+='<br><br>';
//         email+='Tu orden reciente ha sido rechazada por '+supplierNameEnglish+'. Aqui puedes ver los detalles de la transacción:';
//         email+='<br><br>';
//         email+='';
//         email+='';
//         email+='<table style="width:60%; margin-left:55px;">';
//         email+=' <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Precio Total de la Orden: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">USD '+amount+'</td>';
//         email+='        </tr>';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Fecha de la orden: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placeDate+'</td>';
//         email+='        </tr>';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Estatus: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span>Rechazada</span> </td>';
//         email+='        </tr>';
//         email+='        <tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Numero de Orden: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+orderId+'</td>';
//         email+='        </tr><tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Nombre del Local: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+supplierNameEnglish+'</td>';
//         email+='        </tr><tr>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Metodo de pago: </td>';
//         email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+paymentMethod+'</td>';
//         email+='        </tr>';
//         email+='</table>';
//         email+='';
//         email+='<br><br>';
//         email+='';
//         email+='';
//         email+='Para mas detalles, porfavor haz login en tu cuenta y revisa tus Ordenes en la navegación.';
//         email+='';
//         email+='<br><br>';
//         email+='Si tienes mas preguntas no dudes en escribirnos a '+supplierNameEnglish+' y responderemos lo mas rapido posible.';
//         email+='';
//         email+='';
//         email+='</pre>';
//      //   email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//         email+='<br><br>';
//         email+='';
//         email+='';
//         email+='</section>';
//         email+='</body>';
//         email+='</html>';

//     }
//     func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[AdminMail,userEmail],email,0,function(err,result){
//         if(err){
//             callback(err);
//         }else{
//             callback(null)
//         }
//     });
// }


exports.cancelOrderEmail = function(){
    if(1){
       // email+='<!DOCTYPE html>';
    var email='<html lang="en">';
        email+='<head>';
        email+='<meta charset="UTF-8">';
        email+='<title>ORDER CANCEL REQUEST</title>';
        email+='</head>';
        email+='<body>';
        email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
        email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
        email+='<h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;">ORDER CANCEL REQUEST</h3>';
        email+='<b>Dear Customer,</b>';
        email+='';
        email+='You order has been <span style=color: red>Cancelled</span>.';
        email+='';
        email+='Below are the details of your transaction:';
        email+='';
        email+='';
        email+='<table style="width:60%; margin-left:55px;">';
        email+='<tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Total Order Amount:: </td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">USD 85.00</td>';
        email+='</tr>';
        email+='<tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order place Date: </td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">06/08/2016 01:20 AM </td>';
        email+='</tr>';
        email+='<tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Status: </td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span>Cancelled</span> </td>';
        email+='</tr>';
        email+='<tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">34807663</td>';
        email+='</tr><tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Supplier Name: </td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Test Grocery</td>';
        email+='</tr><tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Payment Method: </td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Cash</td>';
        email+='</tr>';
        email+='</table>';
        email+='';
        email+='';
        email+='';
        email+='';
        email+='';
        email+='For Further Details, please login to your Account to Confirm & Manage the Order';
        email+='';
        email+='';
        email+='Please Do Not Hesitate to contact Us if you need any Further Assistance';
        email+='    Tel: 04- 347 6654';
        email+='Email: ops@Royo.com';
        email+='Or Use Our Live Chat Service to Talk to our Customer Service Representative';
        email+='';
        email+='';
        email+='</pre>';
     //   email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email+='<br><br>';
        email+='<span style="margin-left: 45px; margin-top: 10px">Disclaimer:</span>';
        email+='';
        email+='<ol style="font-size: 12px; padding: 0px; margin: 0px; margin-left: 50px">';
        email+='<li>Royo.com is not responsible of the Production of Products, Quality, Delivery, and The Product or Services Pricing. The Supplier is sole Responsible for all Provided Products </li>';
        email+='<li>Royo is Online Platform Brings User and Supplier into one Market online place and hence Royo is not Responsible of any damage can be caused by the supplier offers services or Products. The Consumer is required to contact us in case of any unsatisfied experience for our further evaluation. </li>';
        email+='<li>This is an email confirmation of the order and it cannot be used as Invoice of supplier. </li>';
        email+='<li>The Completed Order is Subjected to The Terms & Conditions of Royo and Supplier indicated in our website & Mobile App</li>';
        email+='<li>The Supplier hold sole Responsibility of Pricing, Product Availability and quality of service and the content provided.</li>';
        email+='</ol>';
        email+='';
        email+='';
        email+='</section>';
        email+='</body>';
        email+='</html>';
    }else{
    /*    var email;
        email+='<!DOCTYPE html>';
        email+='<html lang="en">';
        email+='<head>';
        email+='<meta charset="UTF-8">';
        email+='<title>ORDER CANCEL REQUEST</title>';
        email+='</head>';
        email+='<body>';
        email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
        email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email+='<pre>';
        email+='<div style="font-size:15px; font-family: verdana san-serif;" dir="rtl">';
        email+='<p style="margin-right: 35px"">تفاصيل طلبك كالتالي</p>';
        email+='';
        email+='<table style="width:60%; margin-right:55px; font-size: 15px">';
        email+='<tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اجمالي قيمه الطلب</td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">USD 80.00</td>';
        email+='</tr>';
        email+='<tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> تاريخ ووقت تنفيذ الطلب:</td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">صباحا 10:00  07/08/2016</td>';
        email+='</tr>';
        email+='<tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span >حاله الطلب</span> </td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><span> الغاء</span></td>';
        email+='</tr>';
        email+= '<tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> رقم الطلب</td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">34807663</td>';
        email+='</tr><tr>';
        email +='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">اسم مزود الخدمة</td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> تست جروسري</td>';
        email+='</tr><tr>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">طريقه الدفع</td>';
        email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">كاش</td>';
        email+='</tr>';
        email+='</table>';
        email+='';
        email+='';
        email+='<p style="margin-right: 35px">';
        email+='';
        email+='';
        /!*   email+="للاطلاع على تفاصيل طلبك ومتابعه حاله طلبك الرجاء الدخول عبر حسابك الى التطبيق'*!/
        email+='';
        email+='';
    /!*  email+="الرجاء عدم التردد بالتواصل معنا للحصول على المساعدة والدعم عبر القنوات التأليه: ;
        *!/  email+='';
    /!*
        ;"هاتف:04-343 email+="6039
        ;"ايميل:email+="ops@Royo.com
        email+="او يمكنكم التحدث مباشره مع أحد موظفين خدمه العملاء عن طريق نظام المحادثة للدعم المباشر المتواجد في التطبيق";
    *!/
        email+='';
        email+='</p>';
        email+='</div>';
        email+='</pre>';
        email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style='width:100%; height:auto;">';
        email+='';
        email+='<div dir="rtl">';
        email+='<br>';
        //  email+='<span style='margin-right: 45px; margin-top: 10p'>اخلاء مسؤوليه</span>";
        // email+="<ol style='font-size: 12px; padding: 0px; margin: 0px; margin-right: 50px' >";
        // email+="<li>Royo.com ليست مسؤولة عن إنتاج المنتجات المعروضه ، جودتها ، توصيلها ، أو الخدمات وتسعيرها . مزورد الخدمه هو الوحيد المسؤول عن المنتجات المطلوبه.</li>";
        //  email+="<li>Royo.com هي منصةالكترونيه عبر الانترنت تربط المستخدم و مزود الخدمه عبر منصه الكترونيه واحده عبر الانترنت ، وبالتالي Royo ليست مسؤولة عن أي ضرر يمكن أن يحدث من قبل المورد او مايقدمه من خدمات أو منتجات . يرجى من المستهلك الاتصال بنا في حال عدم الرضاء عن جوده المنتج او الخدمه او تقييم مزود الخدمه عبر نظام التقييم لدينا </li>";
        //email+="<li>هذاالبريد الإلكتروني مصدر من النظام، لا يمكن أن يستخدم كفاتورة.</li>";
        // email+="<li>جميع الطلبات خاضعه لشروط واحكام تطبيق Royo و مزود الخدمه كما هو مبين في موقعنا على الانترنت و تطبيق الهاتف.</li>";
        // email+="<li>مورد الخدمه وحده يتحمل المسؤولية كامله عن اسعار المنتجات ، توافر المنتج وجوده المنتج والخدمه.</li>";
        //  email+='</ol>';
        //  email+='';
        email+='</div>';
        email+='';
        email+='</section>';
        email+='</body>';
        email+='</html>';*/
    }
}

exports.adminChangeCommissionMail = function(reply,callback){

        var email;
        email+='<!DOCTYPE html>';
        email+="<html lang='en'>";
        email+="<head>";
        email+="<meta charset='UTF-8'>";
        email+="<title>Commission Changed Notification </title>";
        email+="</head>";
        email+="<body>";
        email+="<section style='max-width:750px; margin:0px auto; font-family:san-serif;'>";
        email+="<img src='https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg' style='width:100%; height:auto;'>";
        email+="<pre style='font-size:15px; font-family: verdana san-serif;'>";
        email+="<h3 style='width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;'>Commission Changed Notification</h3>";
        email+="<b>Dear ADMIN,</b>";
        email+=" ";
        email+="Below Supplier Has changed the Commission Structure";
        email+=" ";
        email+=" ";
        email+="Category:"+category+"<br/>";
        email+="Supplier Name:" +supplierName+"<br/>";
        email+="Old Commission: "+oldCommission+"<br/>";
        email+="New Commission: "+"newCommission: "+"<br/>";
        email+=" ";
        email+=" ";
        email+=" ";
        email+=" ";
        email+="Regards";
        email+="Email Generated";
        email+="</pre>";
        email+="</section>";
        email+="</body>";
        email+="</html>";

        func.sendMailthroughSMTP(smtpSqlSata,reply,subject,supplierEmail,content,1,function(err,result){
            if(err){
                callback(err);
            }else{
                callback(null)
            }
        });

}

exports.supplierCommssionMail = function(reply,callback){
        var email;
        email+="<!DOCTYPE html>";
        email+="<html lang='en'>";
        email+="<head>";
        email+="<meta charset='UTF-8'>";
        email+="<title> CHANGE COMMISSION NOTIFICATION</title>";
        email+="</head>";
        email+="<body>";
        email+="<section style='max-width:750px; margin:0px auto; font-family:san-serif;'>";
        email+="<img src='https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg' style='width:100%; height:auto;'>";
        email+="<pre style='font-size:15px; font-family: verdana san-serif;'>";
        email+="<h3 style='width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;'> CHANGE COMMISSION NOTIFICATION</h3>";
        email+="<b>Dear Supplier Name,</b>";
        email+="";
        email+="";
        email+="You Have Recently Changed Your Commission at Royo.com";
        email+="";
        email+="";
        email+="";
        email+="";
        email+="";
        email+="";
        email+="For Further Details, please login to your Account to Confirm & Manage the Order";
        email+="";
        email+="Please Do Not Hesitate to contact Us if you need any Further Assistance";
        email+="Tel: 04- 347 6654";
        email+="Email: ops@Royo.com";
        email+="</pre>";
        email+="</section>";
        email+="</body>";
        email+="</html>";
        func.sendMailthroughSMTP(smtpSqlSata,reply,subject,supplierEmail,content,1,function(err,result){
            if(err){
                callback(err);
            }else{
                callback(null)
            }
        });

}
exports.supplierNewOrder = async function (req,reply, productList, AdminMail,
    supplierEmail, orderId, supplierName, UserName, userNumber, areaName,
     landmark, houseNumber, addressLink, address, amount, placedDate,
      expectedDate, payment_type, deliveryCharges, handling, urgent_price, quantity,
      adds_on_arr, callback) {
   let terminology=await Universal.getTerminology(req.dbName);
   
   let self_pickup=req.body.self_pickup!=undefined && req.body.self_pickup!=""?req.body.self_pickup:0
   let paymentType=parseInt(self_pickup)==1?(terminology.english["cash_on_pickup"]!=undefined && terminology.english["cash_on_pickup"]!=""?terminology.english["cash_on_pickup"]:payment_type):payment_type
   let deliveryTimeText=parseInt(self_pickup)==1?(terminology.english["order_expected_date"]!=undefined && terminology.english["order_expected_date"]!=""?terminology.english["order_expected_date"]:"Pickup time"):"Delivery Time"
   console.log("====paymentType==>>",paymentType)
   let orderType=parseInt(self_pickup)==1?"self-pickup":"delivery";
   let smtpSqlSata=await Universal.smtpData(req.dbName);
   let currencyData=await Execute.Query(req.dbName,"select currency_name from currency_conversion",[])
   let colorThemeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
   let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
   let currencyName=currencyData && currencyData.length>0?currencyData[0].currency_name:"AED";
   var subTotal = (parseFloat(amount) - (parseFloat(handling) + parseFloat(deliveryCharges) + parseFloat(urgent_price)))
   subTotal = subTotal.toFixed(2);
   let decimalData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["price_decimal_length"]);
   let enableAddonInEmail = await Execute.Query(req.dbName,
    "select `key`,`value` from tbl_setting where `key`=?",["enable_addon_in_order_email"]);
   let enable_addon_in_order_email = false;
   
   if(enableAddonInEmail && enableAddonInEmail.length>0){
    if(parseInt(enableAddonInEmail[0].value)==1){
        logger.debug("=================enableAddonInEmail==========enable_addon_in_order_email=============")
        enable_addon_in_order_email = true;
    }
    }
   
   let uptoFixed=decimalData && decimalData.length>0?parseInt(decimalData[0].value):2;
    logger.debug("=======uptoFixed=>>",uptoFixed)
    let productPrice=0;
    let new_email_template_v10=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=? and value=1 ",["new_emain_template_v10"]);
   if(new_email_template_v10 && new_email_template_v10.length>0){
    var subject = ''+req.business_name+'- New order request ' + orderId;
    let items=``;
    let items_part_1=``
    let items_part_2=``
    let items_addOn_part = ``
    var emailTemplate=`<!DOCTYPE html>
    <html>
    <head>
        <title>${req.business_name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body style="font-family: Segoe UI, Roboto, Helvetica Neue,Helvetica, Arial,sans-serif; background: #fff;  max-width: 700px;  margin:40px 10px; padding: 0px; border-radius: 15px; display:table; margin: 15px auto;">
    
           <table  cellspacing="0" cellpanding="0" style="max-width:700px;  border-collapse: collapse; border-radius: 15px; border: 1px solid #eee;">
                <tr>
                <td style="padding: 0px;">
               
                    <table style="width:100%; border-collapse: collapse;background-color: ${colorTheme}; " cellspacing="0" cellpanding="0">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 20px;"> 
                                   <!--  <img src=${req.logo_url} alt="" 
                                     style="display: inline-block; width: 100px; margin:0 0 0px; "> -->
                                     <h2 style="color:#fff;margin:0;">New Order Request</h2>
                                     <p style="color:#fff;">Dear <strong>${supplierName}</strong></p>
                                     <p style="color:#fff;">You Have Received New Order As Per Below Details</p>
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>        
                    <table style="width: 100%; ">
                        <tbody>
                            <tr>
                                 <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                    <h5>Order Detail !</h5>
                                </td>
                            </tr>  
                            <tr>
                                 <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                    <strong>Client Name: <span style="font-weight:normal;">${UserName}</span> </strong>
                                </td>
                            </tr>  
                            <tr>
                                 <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                    <strong>Mobile Number: <span style="font-weight:normal;">${userNumber}</span> </strong>
                                </td>
                            </tr> 
                            <tr>
                                 <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                    <strong>Address: <span style="font-weight:normal;">${landmark}</span> </strong>
                                </td>
                            </tr> 
                            <tr>
                                 <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                    <h6>Your Order Details</h6>
                                    <p>Order No.  ${orderId}</p>
                                </td>
                            </tr>                 
                        </tbody>
                    </table>`





                        for (var count = 0; count < productList.length; count++) {
                            productPrice=productList[count].price;
                            items+=`<!---------------items details---------------->
                            <table style="width: 100%; margin:0px 0px 0px;  color: #4E5457; background: #fff; font-size: 14px; border-collapse: collapse; padding: 15px; overflow: hidden;border:1px solid#ccc;margin-bottom:20px;">
                            <tbody>
                                <tr>
                                    <td style=""><img src=${productList[count].image_path} alt="" 
                                     style="display: inline-block; width: 100px; margin:0 0 0px; "></td>
                                    
                                    <td style=""> <strong>${productList[count].name}</strong></td>
                                    <td style=""> <strong>Qty: ${productList[count].quantity}</strong></td>
                                </tr>
                                <tr>
                                    <td style="width: 40%; "></td>
                                    
                                    <td style=""> <p>Price</p></td>
                                    <td style=""> <p>${currencyName}' '${parseFloat(productPrice).toFixed(uptoFixed)}</p></td>
                                </tr>
                                <tr>
                                    <td style=""></td>
                                    
                                    <td style=""><strong>Total</strong></td>
                                    <td style=""> <p>${currencyName}' '${parseFloat(((parseFloat(productList[count].price)*parseInt(productList[count].quantity))+productList[count].addonprice)).toFixed(uptoFixed)}</p></td>
                                </tr>
                            </tbody>
                        </table>`

                        }
                            emailTemplate=emailTemplate+items;
                       


                        //
                        let footer=` <!---------------billing details---------------->
                        <table style="width: 100%; margin:0px 0px 0px;  color: #4E5457; background: #fff; font-size: 14px; border-collapse: collapse; padding: 15px; overflow: hidden;">
                            <tbody>
                                <tr>
                                  <strong style="margin-left:18px;">Billing Details</strong>
                                </tr>
                                <tr>
                                <td style="padding:10px 20px;">Sub Total:</td>
                                    
                                <td style="padding:10px 20px;"> ${currencyName} ${parseFloat(subTotal).toFixed(uptoFixed)}</td>
                                <td style="padding:10px 20px;"></td> 
                                </tr>
                                <tr>                                
                                    <td style="padding:10px 20px;">Discount Amount: </td>
                                    <td style="padding:10px 20px;">${currencyName} ${parseFloat(req.body.discountAmount).toFixed(uptoFixed)}</td>
                                    <td style="padding:10px 20px;"></td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 20px;">Order Place Date: </td>
                                    <td style="padding:10px 20px;">${placedDate}</td>
                                    <td style="padding:10px 20px;"></td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 20px;">Expected ${deliveryTimeText}: </td>
                                    <td style="padding:10px 20px;">${expectedDate}</td>
                                    <td style="padding:10px 20px;">Delivery Address</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 20px;">Supplier Email: </td>
                                    <td style="padding:10px 20px;"><a href="#">${supplierEmail}</a></td>
                                    <td style="padding:10px 20px;width:35%;">${landmark}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 20px;">Mode Of Payment: </td>
                                    <td style="padding:10px 20px;">${paymentType}</td>
                                    <td style="padding:10px 20px;"></td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 20px;">Delivery Charges:  </td>
                                    <td style="padding:10px 20px;">${currencyName} ${parseFloat(deliveryCharges).toFixed(uptoFixed)} </td>
                                    <td style="padding:10px 20px;"></td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 20px;">${req.business_name} tax: </td>
                                    <td style="padding:10px 20px;">${currencyName} ${parseFloat(handling).toFixed(uptoFixed)} </td>
                                    <td style="padding:10px 20px;"></td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 20px;">Total:</td>
                                    <td style="padding:10px 20px;">${currencyName} ${parseFloat(amount).toFixed(uptoFixed)}</td>
                                    <td style="padding:10px 20px;"></td>
                                </tr>
                            </tbody>
                        </table>



                    <table style="width:100%; border-collapse: collapse;background-color: #fff;text-align:center; " cellspacing="0" cellpanding="0">
                        <tbody>
                            <tr>
                                <td style="text-align: left; width: 0%;padding:10px 20px;">
                                    <h5>What happens Next?</h5>
                                    <p>We will send you a confirmation once your bag of joy is prepped & ready to ship. If you want to reach us, please <a href="#"> Contact Us</a> here <a href="#">${req.help_email}</a></p>
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>  
              </td>
           </tr>
         </table>
               
    </body>
    </html>`

    emailTemplate=emailTemplate+footer;

   }else{
       
       var subject = ''+req.business_name+'- New order request ' + orderId;
       let items=``;
       let items_part_1=``
       let items_part_2=``
       let items_addOn_part = ``
       var emailTemplate=`<!doctype html>
       <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
           xmlns:o="urn:schemas-microsoft-com:office:office">
       
       <head>
           <meta charset="utf-8">
           <meta name="viewport" content="width=device-width">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="x-apple-disable-message-reformatting">
           <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
       
           <title>
               New Order
           </title>
           <style>
               html,
               body {
                   margin: 0 auto !important;
                   letter-spacing: 0.5px;
                   padding: 0 !important;
                   height: 100% !important;
                   width: 100% !important;
                   font-family: 'Montserrat', sans-serif;
               }
       
               * {
                   -ms-text-size-adjust: 100%;
                   -webkit-text-size-adjust: 100%;
               }
       
               div[style*="margin: 16px 0"] {
                   margin: 0 !important;
               }
       
               table,
               td {
                   mso-table-lspace: 0pt !important;
                   mso-table-rspace: 0pt !important;
               }
       
       
               table table table {
                   table-layout: auto;
               }
       
               img {
                   -ms-interpolation-mode: bicubic;
               }
       
               [x-apple-data-detectors],
               .x-gmail-data-detectors,
               .x-gmail-data-detectors *,
               .aBn {
                   border-bottom: 0 !important;
                   cursor: default !important;
                   color: inherit !important;
                   text-decoration: none !important;
                   font-size: inherit !important;
                   font-family: inherit !important;
                   font-weight: inherit !important;
                   line-height: inherit !important;
               }
           </style>
       </head>
       
       <body width="100%" style="margin: 0;">
           <center style="width: 100%; background: #edf2f740; text-align: left;">
               <div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"
                   class="email-container">
                   <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
                       style="border: 1px solid #ddd; padding-bottom: 50px;">
                       <tbody>
                           <tr>
                               <td>
                                   <div style="padding:20px;text-align: center;">
                                       <div style="width:20%;margin: 0 auto;">
                                           <img style="max-width: 100%;" src='`+req.logo_url+`' class="g-img">
                                       </div>
                                   </div>
                               </td>
                           </tr>
                           <tr>
                               <td>
                                   <div
                                       style="background-color: ${colorTheme};padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">
                                       <h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">New order request
                                       </h2>
                                       <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;">Dear <strong>
                                       ${supplierName}</strong></h2>
                                       <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;">You have received
                                           new order as per below details</h2>
                                   </div>
                               </td>
                           </tr>
       
                           <tr>
                               <td>
                                   <div style="background-color: #88b1a90d; padding: 20px 20px;margin: 0px 25px;">
                                       <table style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 400;">
                                           <tbody>
                                               <tr>
                                                   <td style="font-weight: 600;font-size: 16px;">Order Details</td>
                                               </tr>
                                               <tr>
                                                   <td style="width:">Order type: </td>
                                                   <td>${orderType}</td>
                                               </tr>
                                               <tr>
                                                   <td style="width:">Client name: </td>
                                                   <td>${UserName}</td>
                                               </tr>
                                               <tr>
                                                   <td style="width:">Mobile number: </td>
                                                   <td>${userNumber} </td>
                                               </tr>
                                               <tr>
                                                   <td style="width:">Address: </td>
                                                   <td>#${landmark}</td>
                                               </tr>
                                           </tbody>
                                       </table>
                                   </div>
                               </td>
                           </tr>
                           <tr>
                               <td>
                                   <div style="padding:20px 25px;text-align: left;font-size: 14px;line-height: 24px;">
                                       <h4 style="margin: 0px;">Your order details</h4>
                                       <p style="margin: 0px;">Order no. ${orderId}</p>
                                   </div>
                               </td>
                           </tr>`
                           if(enable_addon_in_order_email){
                            logger.debug("=================enable_addon_in_order_email======true====================")

                            for (var count = 0; count < productList.length; count++) {
                                productPrice=productList[count].price;
    
                                items_part_1=`<tr>
                                <td>
                                    <div style="border: 1px solid #ddd;border-radius: 6px;margin: 0px 20px 10px;">
                                        <table style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 400;">
                                            <tbody>
                                                <tr>
                                                    <td style="width:25%;padding: 0 10px">
                                                        <div style="">
                                                            <img style="width: 100%;" src='`+productList[count].image_path+`'>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <table style="width: 100%;border-left: 1px solid #ddd;padding: 10px;">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="font-weight: 600;">${productList[count].name}</td>
                                                                    <td style="float: right;">Qty: ${productList[count].quantity}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Price</td>
                                                                    <td style="float: right;">${currencyName}' '${parseFloat(productPrice).toFixed(uptoFixed)}</td>
                                                                </tr>`
                                                                items_addOn_part =  `<tr>
                                                                    <td style="font-weight:600">Add Ons</td>
                                                                    </tr>`
                                                                if(adds_on_arr && adds_on_arr.length>0){
                                                                    for(const [index,i] of adds_on_arr.entries()){
                                                                        if(parseInt(i.product_id) == parseInt(productList[count].id)){
                                                               
                                                                    items_addOn_part+= `<tr>
                                                                    <td style="font-weight:600">${i.adds_on_name}</td>
                                                                    <td style="float:right">${i.adds_on_type_name}x${i.quantity}</td>
                                                                    </tr>`
                                                                        }
                                                                    }
                                                                }
    
                                                        items_part_2=`<tr>  <td style="font-weight: 600;">Total</td>
                                                                       <td style="float: right;">${currencyName}' '${parseFloat(((parseFloat(productList[count].price)*parseInt(productList[count].quantity))+productList[count].addonprice)).toFixed(uptoFixed)}</td>
                                                                </tr>
                                                        </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>`
                            items+= items_part_1+items_addOn_part+items_part_2
                                }
                                emailTemplate=emailTemplate+items;
                           }else{
                            logger.debug("=================enable_addon_in_order_email======false====================")

                            for (var count = 0; count < productList.length; count++) {
                                productPrice=productList[count].price;
                                items+=`<tr>
                                <td>
                                    <div style="border: 1px solid #ddd;border-radius: 6px;margin: 0px 20px 10px;">
                                        <table style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 400;">
                                            <tbody>
                                                <tr>
                                                    <td style="width:25%;padding: 0 10px">
                                                        <div style="">
                                                            <img style="width: 100%;" src='`+productList[count].image_path+`'>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <table style="width: 100%;border-left: 1px solid #ddd;padding: 10px;">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="font-weight: 600;">${productList[count].name}</td>
                                                                    <td style="float: right;">Qty: ${productList[count].quantity}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Price</td>
                                                                    <td style="float: right;">${currencyName}' '${parseFloat(productPrice).toFixed(uptoFixed)}</td>
                                                                </tr>
                                                                <tr>
                                                                       <td style="font-weight: 600;">Total</td>
                                                                       <td style="float: right;">${currencyName}' '${parseFloat(((parseFloat(productList[count].price)*parseInt(productList[count].quantity))+productList[count].addonprice)).toFixed(uptoFixed)}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>`
                                }
                                emailTemplate=emailTemplate+items;
                           }

                  let footer=`<tr>
                               <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                               margin: 0px 25px;
                               max-width: 92%;
                           "></td>
                           </tr>
                           <tr>
                               <td>
                                   <table style="    margin: 0px 25px;">
                                       <tbody>
                                           <tr>
                                               <td style="width: 50%;">
                                                   <div style="padding: 15px 0px;margin: 0px 0px;">
                                                       <table
                                                           style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 300; color: #0000009e;padding-right: 10px;">
                                                           <tbody>
                                                               <tr>
                                                                   <td style="font-weight: 600;font-size: 16px;">Billing
                                                                       Details</td>
                                                               </tr>
                                                               <tr>
                                                                   <td style="width:">Sub total: </td>
                                                                   <td style="text-align: right;">${currencyName} ${parseFloat(subTotal).toFixed(uptoFixed)}</td>
                                                               </tr>
                                                               <tr>
                                                               <td style="width:">Discount amount: </td>
                                                               <td style="text-align: right;">${currencyName} ${parseFloat(req.body.discountAmount).toFixed(uptoFixed)}</td>
                                                              </tr>
                                                               <tr>
                                                                   <td style="width:">Order place date: </td>
                                                                   <td style="text-align: right;">${placedDate}</td>
                                                               </tr>
                                                               <tr>
                                                                   <td style="width:">Expected ${deliveryTimeText}: </td>
                                                                   <td style="text-align: right;">${expectedDate}</td>
                                                               </tr>
                                                               <tr>
                                                                   <td style="width:">Supplier name: </td>
                                                                   <td style="text-align: right;">${supplierEmail} </td>
                                                               </tr>
                                                               <tr>
                                                                   <td style="width:">Mode Of Payment: </td>
                                                                   <td style="text-align: right;">${paymentType} </td>
                                                               </tr>
                                                               <tr>
                                                                <td style="width:">Delivery charges: </td>
                                                                <td style="text-align: right;">${currencyName} ${parseFloat(deliveryCharges).toFixed(uptoFixed)} </td>
                                                              </tr>
                                                               <tr>
                                                                   <td style="width:">${req.business_name} tax: </td>
                                                                   <td style="text-align: right;">${currencyName} ${parseFloat(handling).toFixed(uptoFixed)} </td>
                                                               </tr>
                                                               <tr>
                                                                   <td style="width:">Total: </td>
                                                                   <td style="text-align: right;">${currencyName} ${parseFloat(amount).toFixed(uptoFixed)}</td>
                                                               </tr>
                                                           </tbody>
                                                       </table>
                                                   </div>
                                               </td>
                                               <td style="width: 50%;border-left: 1px solid #ddd;">
                                                   <div style="padding: 15px 0px;margin: 0px 0px;">
                                                       <table
                                                           style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 300; color: #0000009e;padding-left: 10px;">
                                                           <tbody>
                                                               <tr>
                                                                   <td style="font-weight: 600;font-size: 16px;">Delivery Address</td>
                                                               </tr>
                                                               <tr>
                                                                   <td>${landmark}</td>
                                                               </tr>
                                                           </tbody>
                                                       </table>
                                                   </div>
                                               </td>
                                           </tr>
                                           
                                       </tbody>
       
                                   </table>
       
                               </td>
                               
                           </tr>
                           <tr>
                               <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                               margin: 0px 25px;
                               max-width: 92%;
                           "></td>
                           </tr>
                           <!-- <tr>
                               <td><hr style="background-color: #e84b58;">
                               </td>
                           </tr> -->
       
       
       
       
                       </tbody>
                   </table>
               </div>
           </center>
       </body>
       
       </html>`
       emailTemplate=emailTemplate+footer;

   }

   func.sendMailthroughSMTP(smtpSqlSata,reply, subject, [supplierEmail,AdminMail], emailTemplate, 0, function (err, result) {
       logger.debug("============sendMailthroughSMTP========errrr===",err)
       if (err) {
           callback(err);
       } else {
           callback(null)
       }
   });
};



exports.UserFirstOrder = async function(request,reply,AdminEmail,orderId,userName,userMobile,area,landmark,building,house,callback){
    let smtpSqlSata=await Universal.smtpData(request.dbName);
    let colorThemeData=await Execute.Query(request.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
    var subject = "First Time Order by User "+orderId;

    var email=`<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="x-apple-disable-message-reformatting">
        <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    
        <title>
        First Order By User
        </title>
        <style>
            html,
            body {
                margin: 0 auto !important;
                letter-spacing: 0.5px;
                padding: 0 !important;
                height: 100% !important;
                width: 100% !important;
                font-family: 'Montserrat', sans-serif;
            }
    
            * {
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }
    
            div[style*="margin: 16px 0"] {
                margin: 0 !important;
            }
    
            table,
            td {
                mso-table-lspace: 0pt !important;
                mso-table-rspace: 0pt !important;
            }
    
    
            table table table {
                table-layout: auto;
            }
    
            img {
                -ms-interpolation-mode: bicubic;
            }
    
            [x-apple-data-detectors],
            .x-gmail-data-detectors,
            .x-gmail-data-detectors *,
            .aBn {
                border-bottom: 0 !important;
                cursor: default !important;
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
        </style>
    </head>
    
    <body width="100%" style="margin: 0;">
        <center style="width: 100%; background: #edf2f740; text-align: left;">
            <div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"
                class="email-container">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
                    style="border: 1px solid #ddd; padding-bottom: 50px;">
                    <tbody>
                        <tr>
                            <td>
                                <div style="padding:20px;text-align: center;">
                                    <div style="width:20%;margin: 0 auto;">
                                        <img style="max-width: 100%;" src='`+request.logo_url+`' class="g-img">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div
                                    style="background-color: ${colorTheme};padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">
                                    <h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">FIRST ORDER BY USER
                                    </h2>
                                    <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;">Dear, <strong>
                                     </strong>${userName}</h2>
                                    <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;"> Below order is the first order done by registered user below:</h2>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style="padding:20px 25px;text-align: left;font-size: 14px;line-height: 24px;">
                                    <h4 style="margin: 0px;">Order details</h4>
                                    <p style="margin: 0px;">Order no. ${orderId}</p>
                                </div>
                            </td>
                        </tr>`
               let footer=`<tr>
                            <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                            margin: 0px 25px;
                            max-width: 92%;
                        "></td>
                        </tr>
                        <tr>
                            <td>
                                <table style="margin: 0px 25px;">
                                    <tbody>
                                        <tr>
                                            <td style="width: 50%;">
                                                <div style="padding: 15px 0px;margin: 0px 0px;">
                                                    <table
                                                        style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 300; color: #0000009e;padding-right: 10px;">
                                                        <tbody>
                                                            <tr>
                                                                <td style="font-weight: 600;font-size: 16px;">Client
                                                                    Details</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="width:">Client Name: </td>
                                                                <td style="text-align: right;">${userName}</td>
                                                            </tr>
                                                            <tr>
                                                            <td style="width:">Mobile Number: </td>
                                                            <td style="text-align: right;">${userMobile}</td>
                                                           </tr>
                                                           <tr>
                                                           <td style="width:">Address & Land Mark:</td>
                                                           <td style="text-align: right;">${landmark}</td>
                                                          </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                    </tbody>
    
                                </table>
    
                            </td>
                            
                        </tr>
                        <tr>
                            <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                            margin: 0px 25px;
                            max-width: 92%;
                        "></td>
                        </tr>
                        <!-- <tr>
                            <td><hr style="background-color: #e84b58;">
                            </td>
                        </tr> -->
                    </tbody>
                </table>
            </div>
        </center>
    </body>
    </html>`
    email=email+footer;
//        email+="<!DOCTYPE html>";
//    var  email="<html lang='en'>";
//         email+="<head>";
//         email+="<meta charset='UTF-8'>";
//         email+="<title>First Order By User</title>";
//         email+="</head>";
//         email+="<body>";
//         email+="<section style='max-width:750px; margin:0px auto; font-family:san-serif;'>";
//         email+="<img src='https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg' style='width:100%; height:auto;'>";
//         email+="<pre style='font-size:15px; font-family: verdana san-serif;'>";
//         email+="<h3 style='width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;'>'FIRST ORDER BY USER'</h3>";
//         email+="<b>Dear ADMIN,</b>";
//         email+=" ";
//         email+="Below Order is The First Order Done by Registered User below";
//         email+=" ";
//         email+="<u>Order No: </u>"+orderId;
//         email+=" ";
//         email+="<table style='width:60%; margin-left:55px;'>";
//         email+="<tr>";
//         email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>Client Name: </td>";
//         email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>"+userName+" </td>";
//         email+="</tr>";
//         email+="<tr>";
//         email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>Mobile Name: </td>";
//         email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>"+userMobile+"</td>";
//         email+="</tr>";
//         email+=" ";
//         email+="<tr>";
//         email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>Address & Land Mark: </td>";
//         email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>"+landmark+" </td>";
//         email+="</tr>";
//         email+="</table>";
//         email+=" ";
//         email+=" ";
//         email+="For Further Details, please login to your Account to Confirm & Manage the Order";
//         email+=" ";
//         email+="Please Do Not Hesitate to contact Us if you need any Further Assistance";
//         // email+="Tel: 04- 347 6654";
//         email+="Email: "+request.help_email+"";
//         email+="</section>";
//         email+="</body>";
//         email+="</html>";


    func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[AdminEmail],email,0,function(err,result){
        if(err){
            callback(err);
        }else{
            callback(null)
        }
    });
    
}



exports.userRateOrder = function(reply,AdminMail,orderId,supplierName,userName,mobileNumber,area,landmark,building,houseNumber,callback){
    var subject = "New Order Rating";
  var  email="<!DOCTYPE html>";
    email+="<html lang='en'>";
    email+="<head>";
    email+="<meta charset='UTF-8'>";
    email+="<title>New Order Rating</title>";
    email+="</head>";
    email+="<body>";
    email+="<section style='max-width:750px; margin:0px auto; font-family:san-serif;'>";
    email+="<img src='https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg' style='width:100%; height:auto;'>";
    email+="<pre style='font-size:15px; font-family: verdana san-serif;'>";
    email+="<h3 style='width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;'> NEW ORDER RATING</h3>";
    email+="<b>Dear "+userName+",</b>";
    email+=" ";
    email+="Please ppprove new rating form user as below details :-";
    email+=" ";
    email+="<u>Order no: "+orderId+"</u>";
    email+="<u>Supplier name : "+supplierName+"</u>";
    email+=" ";
    email+="<table style='width:60%; margin-left:55px;'>";
    email+="<tr>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>Client name: </td>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>"+userName+"</td>";
    email+="</tr>";
    email+="<tr>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>Mobile name: </td>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>"+mobileNumber+"</td>";
    email+="</tr>";
    email+="<tr>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>Area: </td>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>"+area+" </td>";
    email+="</tr>";
    email+=" ";
    email+="<tr>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>Address & Land Mark: </td>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>"+landmark+"</td>";
    email+="</tr><tr>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>Building Name: </td>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>"+building+"</td>";
    email+="</tr><tr>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>House No: </td>";
    email+="<td style='border-bottom:1px solid #d4d4d4; padding:10px 0px;'>"+houseNumber+" </td>";
    email+="</tr>";
    email+="</table>";
    email+=" ";
    email+=" ";
    email+=" ";
    email+="Regards";
    email+="Email Generated";
    email+="</pre>";
    email+="</section>";
    email+="</body>";
    email+="</html>";
    func.sendMailthroughSMTP({},reply,subject,AdminMail,email,0,function(err,result){
        if(err){
            callback(err);
        }else{
            callback(null)
        }
    });
}


exports.trackOrder = function(reply,AdminMail,orderId,date,userName,callback){
    var subject='Track Order ACK from Supplier '+orderId;
    //email+='<!DOCTYPE html>';
   var email='<html lang="en">';
    email+='<head>';
    email+='<meta charset="UTF-8">';
    email+='<title>TRACKING ACK FROM SUPPLIER</title>';
    email+='</head>';
    email+='<body>';
    email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
    email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
    email+='<h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;">TRACKING ACK FROM SUPPLIER</h3>';
    email+='<b>Dear '+userName+',</b>';
    email+='';
    email+= '';
    email+='Supplier has ACK Tracking as Below';
    email+='';
    email+='<hr>';
    email+='Order No: '+orderId+'';
    email+='';
    email+='New Update Date & Time: '+date+'';
    email+='<hr>';
    email+='';
    email+='';
    email+='Reared';
    email+='';
    email+='System Generated Email';
    email+='</pre>';
    email+='</section>';
    email+='</body>';
    email+='</html>';

    func.sendMailthroughSMTP({},reply,subject,[AdminMail],email,0,function(err,result){
        if(err){
            callback(err);
        }else{
            callback(null)
        }
    });
}

exports.changeDate = function(reply,AdminMail,orderId,schedule_date,user_name,callback){
    var subject ='';

 var email ='<!DOCTYPE html>';
    email+='<html lang="en">';
    email+='<head>';
    email+='<meta charset="UTF-8">';
    email+='<title>UPDATE ORDER TIMING</title>';
    email+='</head>';
    email+='<body>';
    email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
    email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
    email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
    email+='<h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;"> UPDATE ORDER TIMING</h3>';
    email+='<b>Dear '+user_name+',</b>';
    email+='';
    email+='';
    email+='Supplier has Updated New Delivery Timing details';
    email+='';
    email+='';
    email+='<hr>';
    email+='Order No: '+orderId+' ';
    email+='';
    email+='New Update Date & Time: '+schedule_date+' ';
    email+='<hr>';
    email+='';
    email+='';
    email+='Regards';
    email+='';
    email+='System Generated Email';
    email+='</pre>';
    email+='</section>';
    email+='</body>';
    email+='</html>';

    func.sendMailthroughSMTP({},reply,subject,[AdminMail],email,0,function(err,result){
        if(err){
            callback(err);
        }else{
            callback(null)
        }
    });
}

exports.supplierResetpassword = async function(req,reply,supplierId,supplierName,password,callback){
    let smtpSqlSata=await Universal.smtpData(req.dbName);
    var subject=''+req.business_name+'-Reset Password Request';
   //    email+='<!DOCTYPE html>';
   var email =   "<!doctype html> "+
   '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">'+
   
   '<head>'+
       '<meta charset="utf-8">'+
       '<meta name="viewport" content="width=device-width">'+
       '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
       '<meta name="x-apple-disable-message-reformatting">'+
       '<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">'+
   
       '<title>'+
        'SUPPLIER RESET PASSWORD'+
       '</title>'+
       '<style>'+
           'html,'+
           'body {'+
               'margin: 0 auto !important;'+
               'letter-spacing: 0.5px;'+
               'padding: 0 !important;'+
               'height: 100% !important;'+
               'width: 100% !important;'+
               'font-family: "Montserrat",'+
               'sans-serif;'+
           '}'+
   
           '* {'+
               '-ms-text-size-adjust: 100%;'+
               '-webkit-text-size-adjust: 100%;'+
           '}'+
   
           'div[style*="margin: 16px 0"] {'+
               'margin: 0 !important;'+
           '}'+
   
           'table,'+
           'td {'+
               'mso-table-lspace: 0pt !important;'+
               'mso-table-rspace: 0pt !important;'+
           '}'+
   
   
           'table table table {'+
               'table-layout: auto;'+
           '}'+
   
           'img {'+
               '-ms-interpolation-mode: bicubic;'+
           '}'+
   
           '[x-apple-data-detectors],'+
           '.x-gmail-data-detectors,'+
           '.x-gmail-data-detectors *,'+
           '.aBn {'+
               'border-bottom: 0 !important;'+
               'cursor: default !important;'+
               'color: inherit !important;'+
               'text-decoration: none !important;'+
               'font-size: inherit !important;'+
               'font-family: inherit !important;'+
               'font-weight: inherit !important;'+
               'line-height: inherit !important;'+
           '}'+
       '</style>'+
   '</head>'+
   
   '<body width="100%" style="margin: 0;">'+
       '<center style="width: 100%; background: #edf2f740; text-align: left;">'+
           '<div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"'+
               'class="email-container">'+
               '<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"'+
                   'style="border: 1px solid #ddd; padding-bottom: 50px;">'+
                   '<tbody>'+
                       '<tr>'+
                           '<td>'+
                               '<div style="padding:20px;text-align: center;">'+
                                   '<div style="width:100%;">'+
                                       '<img style="max-width: 100%;" src="'+req.logo_url+'" class="g-img">'+
                                   '</div>'+
                               '</div>'+
                           '</td>'+
                       '</tr>'+
                       '<tr>'+
                           '<td>'+
                               '<div '+
                               ' style="background-color: #e84b58;padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">'+
                               '<h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">RESET PASSWORD'+
                               ' </h2>'+
                               '</div>'+
                           '</td>'+
                       '</tr>'+
   
                       '<tr>'+
                           '<td>'+
                               '<div style="background-color: #88b1a90d; padding: 20px 20px;margin: 0px 25px 20px;">'+
                                   '<table style="width: 100%;font-size: 14px;font-weight: 300;">'+
                                       '<tbody>'+
                                           '<tr>'+
                                               '<td style="font-weight: 600;font-size: 16px;padding-bottom: 10px;">Dear '+supplierName+'!</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                               '<td style="padding-bottom: 10px;">Your password has been reset</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                           '<td style="font-weight: 400;padding-bottom: 10px">Your new password is: '+password+'</td>'+
                                           '</tr>'+
                                       '</tbody>'+
                                   '</table>'+
                               '</div>'+
                           '</td>'+
                       '</tr>'+
   
                       '<tr>'+
                           '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                           'margin: 0px 25px;'+
                           'max-width: 92%;'+
                       '"></td>'+
                       '</tr>'+
                       '<tr>'+
                           '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                           'margin: 0px 25px;'+
                           'max-width: 92%;'+
                       '"></td>'+
                       '</tr>'+
                       '<!-- <tr>'+
                           '<td><hr style="background-color: #e84b58;">'+
                           '</td>'+
                       '</tr> -->'+
                   '</tbody>'+
               '</table>'+
           '</div>'+
       '</center>'+
   '</body>'+
   
   '</html>'
   //   var   email='<html lang="en">';
   //     email+='<head>';
   //     email+='<meta charset="UTF-8">';
   //     email+='<title> SUPPLIER RESET PASSWORD </title>';
   //     email+='</head>';
   //     email+='<body>';
   //     email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
   //     email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
   //     email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
   //     email+='<h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;"> RESET PASSWORD </h3>';
   //     email+='<b>Dear '+supplierName+' </b>';
   //     email+='';
   //     email+='';
   //     email+='You Password Has been Reset';
   //     email+='';
   //     email+='';
   //     email+='';
   //     email+='Your New Password is: '+password+'. ';
   //     email+='';
   //     email+='';
   //     email+='Please change your Password for security Purposes.';
   //     email+='';
   //     email+='';
   //     email+='';
   //     email+='For Further Details, please login to your Account to Confirm & Manage the Order';
   //     email+='';
   //     email+='Please Do Not Hesitate to contact Us if you need any Further Assistance';
   //     // email+='Tel: 04- 347 6654';
   //     email+='Email: '+req.help_email+'';
   //     email+='</pre>';
   //     email+='</section>';
   //     email+='</body>';
   //     email+='</html>';
   
       func.sendMailthroughSMTP(smtpSqlSata,reply,subject,supplierId,email,0,function(err,result){
           if(err){
               callback(err);
           }else{
               callback(null)
           }
       });
   }


exports.trackOrderUpdate = function(reply,AdminMail,supplierEmail,orderId,supplierName,UserName,userNumber,areaName,landmark,houseNumber,addressLink,address,amount,placedDate,expectedDate,payment_type,callback)
{
    var subject='Royo-New Tracking Request '+orderId ;
    //email+='<!DOCTYPE html>';
    var email='<html lang="en">';
    email+='<head>';
    email+='<meta charset="UTF-8">';
    email+='<title>TRACK ORDER REQUEST</title>';
    email+='</head>';
    email+='<body>';
    email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
    email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
    email+='<h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;">ORDER TRACKING</h3>';
    email+='<b>Dear'+supplierName+'</b>';
    email+='';
    email+='You Have Received New <span >Tracking Request</span> As Per Below Details: -';
    email+='';
    email+='';
    email+='';
    email+='User Details:';
    email+='<table style="width:60%; margin-left:55px;">';
    email+='<tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Client Name: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+UserName+'</td>';
    email+='</tr>';
    email+='<tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Mobile Name: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+userNumber+'</td>';
    email+='</tr>';
    email+='<tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Area: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+areaName+'</td>';
    email+='</tr>';
    email+='<tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Address & Land Mark: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+landmark+'</td>';
    email+='</tr><tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Building Name: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+address+'</td>';
    email+='</tr><tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">House No: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+houseNumber+' </td>';
    email+='</tr><tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Google Map Location: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><a href='+addressLink+'>Click Her for Link</a> </td>';
        email+='</tr>';
    email+='</table>';
    email+='';
    email+='';
    email+='';
    email+='';
    email+='Order Details:';
    email+='<table style="width:60%; margin-left:55px;">';
    email+='<tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Total Order Amount: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">USD '+amount+'</td>';
    email+='</tr>';
    email+='<tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Place Date: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+placedDate+'</td>';
    email+='</tr>';
    email+='<tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Expected Delivery Time:</td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+expectedDate+'</td>';
    email+='</tr>';
    email+='<tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+orderId+'</td>';
    email+='</tr><tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Supplier Name: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+supplierName+' </td>';
    email+='</tr><tr>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Payment Method: </td>';
    email+='<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+payment_type+' </td>';
    email+='</tr>';
    email+='</table>';
    email+='';
    email+='';
    email+='';
    email+='For Further Details, please login to your Account to Confirm & Manage the Order';
    email+='';
    email+='';
    email+='Please Do Not Hesitate to contact Us if you need any Further Assistance';
    email+='Tel: 04- 347 6654';
    email+='Email: ops@Royo.com';
    email+='</pre>';
    email+='</section>';
    email+='</body>';
    email+='</html>';

    func.sendMailthroughSMTP({},reply,subject,[AdminMail,supplierEmail],email,0,function(err,result){
        if(err){
            callback(err);
        }else{
            callback(null)
        }
    });


}



exports.loyalityOrder = function(reply,product_data,userId,deliveryType,deliveryAddressId,supplierBranchId,totalPoints,deliveryDate,remarks,loyalityDetails,orderId,emailid,callback) {
     
     var houseNumber = (loyalityDetails.pincode).split(',');
        var  building = houseNumber[1];
    building = building.substring(2);
     console.log("......................product_data............",product_data);
    console.log("......................userId............",userId);
    console.log("......................deliveryType............",deliveryType);

    console.log("......................deliveryAddressId............",deliveryAddressId);

    console.log("......................supplierBranchId............",supplierBranchId);
    console.log("......................totalPoints............",totalPoints);
    console.log("......................deliveryDate............",deliveryDate);
    console.log("......................remarks............",remarks);

    console.log("......................loyalityDetails............",loyalityDetails);
    console.log("......................orderId............",orderId);

    var subject = 'Royo- New  Loyality Order Request ' + orderId;
        //var email;
        //   email += '<!DOCTYPE html>';
        var email = '<html lang="en">';
        email += '<head>';
        email += '<meta charset="UTF-8">';
        email += '<title>NEW ORDER REQUEST</title>';
        email += '</head>';
        email += '<body>';
        email += '<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
        email += '<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
        email += '<pre style="font-size:15px; font-family: verdana san-serif;">';
        email += '<h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;">NEW ORDER REQUEST</h3>';
        email += '<b>Dear</b>';
        email += '';
        email += 'You Have Received New Order As Per Below Details: -';
        email += '';
        email += '';
        email += '';
        email += 'User Details:';
        email += '<table style="width:60%; margin-left:55px;">';
        email += '<tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Client Name: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">' + loyalityDetails.firstname + '</td>';
        email += '</tr>';
        email += '<tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Mobile Name: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">' + loyalityDetails.mbile_no + '</td>';
        email += '</tr>';
        email += '<tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Area: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">' + loyalityDetails.address_line_1 + '</td>';
        email += '</tr>';
        email += '<tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Address & Land Mark: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">' + loyalityDetails.landmark + '</td>';
        email += '</tr><tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Building Name: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">' + building + '</td>';
        email += '</tr><tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">House Number: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">' + houseNumber[0] + '</td>';
        email += '</tr><tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Google Map Location: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"><a href=' + loyalityDetails.address_link + '>Click Her for Link</a> </td>';
        email += '</tr>';
        email += '</table>';
        email += '';
        email += '';
        email += '';
        email += '';
        email += 'Order Details:';
        email += '<table style="width:60%; margin-left:55px;">';
        email += '<tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Place Date: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">' + new Date() + '</td>';
        email += '</tr>';
        email += '<tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Expected Delivery Time:</td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">' + deliveryDate + '</td>';
        email += '</tr>';
        email += '<tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">' + orderId + '</td>';
        email += '</tr><tr>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Supplier Name: </td>';
        email += '<td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">  supplierName </td>';
        email += '</tr><tr>';
        email += '</tr><tr>';
        email += '</table>';
        email += ' <table  style="width:300px;">';
        email += '<tr>';
        email += '<td>Status</td>';
        email += '<td></td>';
        email += '<td></td>';
        email += '</tr>';
        email += '<tr>';
        email += '<td style="color:#07b507;">Pending</td>';
        email += '<td></td>';
        email += '<td></td>';
        email += '</tr>';
        email += '</table>';
        email += '<ul style="width:700px; list-style-type:none; margin:0px; padding: 0px;">';

        for (var count=0;count<product_data.length;count++) {
            email += '<li style="border-bottom:1px solid #b7b7b7; padding-bottom:15px;">';
            email += '<div style="clear:both;">';
            email += ' <img src="'+ product_data[count].image +'" style="height:70px; width:70px; float:left;">';
            email += '<span style="font-size:28px;float: right;">'+ product_data[count].name +'</span>';
            email += '</div>';
        //    email += '<span style="font-size:21px; color:#c7c7c7; padding-top:20px; display:inline-block;">Per piece</span>';
          //  email += '<span style="font-size:20px; color:#c7c7c7; padding-top:0px; display:inline-block;">Quantity '+ imageparam[count] +'</span>';
          //  email += '<td>Items</td>';
          //  email += '<span style="font-size:17px; margin-top:15px; margin-top:10px; padding-top:0px; display:inline-block; float:right;">Barcode : '+ imageparam[count] +'</span><br/>';
         //   email += '<span style="font-size:17px; color:#918055; padding-top:0px; margin-top:-5px; display:inline-block; float:right;">Item price : USD '+ imageparam[count] +'</span>';
            email += '</li>';
        }
    email += '<ul/>';
        // email += '</table>';
        email += '</pre>';
        email += '</section>';
        email += '</body>';

    func.sendMailthroughSMTP({},reply,subject,emailid,email,0,function(err,result){
        
        console.log("....console.log...............",err,result);
        if(err){
            callback(err);
        }else{
            callback(null)
        }
    });
};

exports.cancelOrderByUser=async function(req,self_pickup,reply,AdminMail,supplierEmail,orderId,supplierName,userName,mobileNumber,area,landmark,houseNumber,address_link,building,net_amount,created_on,schedule_date,payment_type,callback){
    let smtpSqlSata=await Universal.smtpData(req.dbName);
    let colorThemeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
    var subject=''+req.business_name+' -Cancellation of Order No: '+orderId;
    let terminology=await Universal.getTerminology(req.dbName);
    let paymentType=parseInt(self_pickup)==1?(terminology.english["cash_on_pickup"]!=undefined && terminology.english["cash_on_pickup"]!=""?terminology.english["cash_on_pickup"]:payment_type):payment_type
   let deliveryTimeText=parseInt(self_pickup)==1?(terminology.english["order_expected_date"]!=undefined && terminology.english["order_expected_date"]!=""?terminology.english["order_expected_date"]:"pickup time"):"delivery time"
   console.log("====paymentType==deliveryTimeText>>",paymentType,deliveryTimeText)

    let items=``;
   var emailTemplate=`<!doctype html>
   <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
       xmlns:o="urn:schemas-microsoft-com:office:office">
   
   <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="x-apple-disable-message-reformatting">
       <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
   
       <title>
           Royo Order
       </title>
       <style>
           html,
           body {
               margin: 0 auto !important;
               letter-spacing: 0.5px;
               padding: 0 !important;
               height: 100% !important;
               width: 100% !important;
               font-family: 'Montserrat', sans-serif;
           }
   
           * {
               -ms-text-size-adjust: 100%;
               -webkit-text-size-adjust: 100%;
           }
   
           div[style*="margin: 16px 0"] {
               margin: 0 !important;
           }
   
           table,
           td {
               mso-table-lspace: 0pt !important;
               mso-table-rspace: 0pt !important;
           }
   
   
           table table table {
               table-layout: auto;
           }
   
           img {
               -ms-interpolation-mode: bicubic;
           }
   
           [x-apple-data-detectors],
           .x-gmail-data-detectors,
           .x-gmail-data-detectors *,
           .aBn {
               border-bottom: 0 !important;
               cursor: default !important;
               color: inherit !important;
               text-decoration: none !important;
               font-size: inherit !important;
               font-family: inherit !important;
               font-weight: inherit !important;
               line-height: inherit !important;
           }
       </style>
   </head>
   
   <body width="100%" style="margin: 0;">
       <center style="width: 100%; background: #edf2f740; text-align: left;">
           <div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"
               class="email-container">
               <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
                   style="border: 1px solid #ddd; padding-bottom: 50px;">
                   <tbody>
                       <tr>
                           <td>
                               <div style="padding:20px;text-align: center;">
                                   <div style="width:20%;margin: 0 auto;">
                                       <img style="max-width: 100%;" src='`+req.logo_url+`' class="g-img">
                                   </div>
                               </div>
                           </td>
                       </tr>
                       <tr>
                           <td>
                               <div
                                   style="background-color: ${colorTheme};padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">
                                   <h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">ORDER CANCEL REQUEST
                                   </h2>
                                   <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;">Dear <strong>
                                   ${supplierName}</strong></h2>
                                   <h2 style="font-size: 16px;font-weight: 400;color: #fff;margin: 0px;">You have received
                                       New cancel request as per below details</h2>
                               </div>
                           </td>
                       </tr>
   
                       <tr>
                           <td>
                               <div style="background-color: #88b1a90d; padding: 20px 20px;margin: 0px 25px;">
                                   <table style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 400;">
                                       <tbody>
                                           <tr>
                                               <td style="font-weight: 600;font-size: 16px;">Order Details</td>
                                           </tr>
                                           <tr>
                                               <td style="width:">Client name: </td>
                                               <td>${userName}</td>
                                           </tr>
                                           <tr>
                                               <td style="width:">Mobile number: </td>
                                               <td>${mobileNumber} </td>
                                           </tr>
                                           <tr>
                                               <td style="width:">Address: </td>
                                               <td>#${landmark}</td>
                                           </tr>
                                       </tbody>
                                   </table>
                               </div>
                           </td>
                       </tr>
                       <tr>
                           <td>
                               <div style="padding:20px 25px;text-align: left;font-size: 14px;line-height: 24px;">
                                   <h4 style="margin: 0px;">Order details</h4>
                                   <p style="margin: 0px;">Order no. ${orderId}</p>
                               </div>
                           </td>
                       </tr>`
                        emailTemplate=emailTemplate;
              let footer=`<tr>
                           <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                           margin: 0px 25px;
                           max-width: 92%;
                       "></td>
                       </tr>
                       <tr>
                           <td>
                               <table style="    margin: 0px 25px;">
                                   <tbody>
                                       <tr>
                                           <td style="width: 50%;">
                                               <div style="padding: 15px 0px;margin: 0px 0px;">
                                                   <table
                                                       style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 300; color: #0000009e;padding-right: 10px;">
                                                       <tbody>
                                                           <tr>
                                                               <td style="font-weight: 600;font-size: 16px;">Billing
                                                                   Details</td>
                                                           </tr>
                                                           <tr>
                                                               <td style="width:">Total order amount </td>
                                                               <td style="text-align: right;">${net_amount}</td>
                                                           </tr>
                                                           <tr>
                                                           <td style="width:">Order place date: </td>
                                                           <td style="text-align: right;">${created_on}</td>
                                                          </tr>
                                                           <tr>
                                                               <td style="width:">Expected ${deliveryTimeText}: </td>
                                                               <td style="text-align: right;">${schedule_date}</td>
                                                           </tr>
                                                           <tr>
                                                               <td style="width:">Supplier name: </td>
                                                               <td style="text-align: right;">${supplierName} </td>
                                                           </tr>
                                                           <tr>
                                                               <td style="width:">Order ref number: </td>
                                                               <td style="text-align: right;">${orderId} </td>
                                                           </tr>
                                                           <tr>
                                                               <td style="width:">Payment method: </td>
                                                               <td style="text-align: right;">${paymentType} </td>
                                                           </tr>
                                                       </tbody>
                                                   </table>
                                               </div>
                                           </td>
                                           <td style="width: 50%;border-left: 1px solid #ddd;">
                                               <div style="padding: 15px 0px;margin: 0px 0px;">
                                                   <table
                                                       style="width: 100%;line-height: 22px;font-size: 14px;font-weight: 300; color: #0000009e;padding-left: 10px;">
                                                       <tbody>
                                                           <tr>
                                                               <td style="font-weight: 600;font-size: 16px;">Delivery address</td>
                                                           </tr>
                                                           <tr>
                                                               <td>${landmark}</td>
                                                           </tr>
                                                       </tbody>
                                                   </table>
                                               </div>
                                           </td>
                                       </tr>
                                       
                                   </tbody>
   
                               </table>
   
                           </td>
                           
                       </tr>
                       <tr>
                           <td><img src="https://cdn-assets.royoapps.com/line.jpg" style="
                           margin: 0px 25px;
                           max-width: 92%;
                       "></td>
                       </tr>
                       <!-- <tr>
                           <td><hr style="background-color: #e84b58;">
                           </td>
                       </tr> -->
                   </tbody>
               </table>
           </div>
       </center>
   </body>
   
   </html>`
   emailTemplate=emailTemplate+footer;
 //    var email='<!DOCTYPE html>';
 //     email+='<html lang="en">';
 //     email+='<head>';
 //     email+='<meta charset="UTF-8">';
 //     email+='<title>ORDER CANCEL REQUEST</title>';
 //     email+='</head>';
 //     email+='<body>';
 //     email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
 //     email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
 //     email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
 //     email+='    <h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;">ORDER CANCEL REQUEST</h3>';
 //     email+='        <b>Dear '+supplierName+'</b>';
 //     email+='';
 //     email+='        You Have Received New <span style="color: red">CANCEL Request</span> As Per Below Details: -';
 //     email+='';
 //     email+='';
 //     email+='';
 //     email+='        User Details:';
 //     email+='        <table style="width:60%; margin-left:55px;">';
 //     email+='        <tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Client Name: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+userName+'</td>';
 //     email+='        </tr>';
 //     email+='        <tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Mobile Number: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+mobileNumber+'</td>';
 //     email+='        </tr>';
 //     email+='        <tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Address & Land Mark: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+landmark+'</td>';
 //     email+='        </tr><tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Building Name: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+building+'</td>';
 //     email+='        </tr><tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">House No: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+houseNumber+'</td>';
 //     email+='        </tr>';
 //     email+='</table>';
 //     email+='';
 //     email+='';
 //     email+='';
 //     email+='';
 //     email+='        Order Details:';
 //     email+='        <table style="width:60%; margin-left:55px;">';
 //     email+='        <tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Total Order Amount: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+net_amount+'</td>';
 //     email+='        </tr>';
 //     email+='        <tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Place Date: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+created_on+'</td>';
 //     email+='        </tr>';
 //     email+='        <tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Expected Delivery Time:</td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+schedule_date+'</td>';
 //     email+='        </tr>';
 //     email+='        <tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+orderId+'</td>';
 //     email+='        </tr><tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Supplier Name: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+supplierName+'</td>';
 //     email+='        </tr><tr>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Payment Method: </td>';
 //     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+payment_type+'</td>';
 //     email+='        </tr>';
 //     email+='</table>';
 //     email+='';
 //     email+='';
 //     email+='';
 //     email+='        For Further Details, please login to your Account to Confirm & Manage the Order';
 //     email+='';
 //     email+='';
 //     email+='        Please Do Not Hesitate to contact Us if you need any Further Assistance';
 //     // email+='        Tel: 04- 347 6654';
 //     email+='        Email: '+req.help_email+'';
 //     email+='</pre>';
 //     email+='</section>';
 //     email+='</body>';
 //     email+='</html>';
 
 
     func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[supplierEmail],emailTemplate,0,function(err,result){
         if(err){
             callback(err);
         }else{
             callback(null)
         }
     });
 }

// exports.cancelOrderByUser=async function(req,reply,AdminMail,supplierEmail,orderId,supplierName,userName,mobileNumber,area,landmark,houseNumber,address_link,building,net_amount,created_on,schedule_date,payment_type,callback){
//    let smtpSqlSata=await Universal.smtpData(req.dbName);
//    var subject=''+req.business_name+' -Cancellation of Order No: '+orderId;
//    var email='<!DOCTYPE html>';
//     email+='<html lang="en">';
//     email+='<head>';
//     email+='<meta charset="UTF-8">';
//     email+='<title>ORDER CANCEL REQUEST</title>';
//     email+='</head>';
//     email+='<body>';
//     email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
//     email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
//     email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
//     email+='    <h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;">ORDER CANCEL REQUEST</h3>';
//     email+='        <b>Dear '+supplierName+'</b>';
//     email+='';
//     email+='        You Have Received New <span style="color: red">CANCEL Request</span> As Per Below Details: -';
//     email+='';
//     email+='';
//     email+='';
//     email+='        User Details:';
//     email+='        <table style="width:60%; margin-left:55px;">';
//     email+='        <tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Client Name: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+userName+'</td>';
//     email+='        </tr>';
//     email+='        <tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Mobile Number: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+mobileNumber+'</td>';
//     email+='        </tr>';
//     email+='        <tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Address & Land Mark: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+landmark+'</td>';
//     email+='        </tr><tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Building Name: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+building+'</td>';
//     email+='        </tr><tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">House No: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+houseNumber+'</td>';
//     email+='        </tr>';
//     email+='</table>';
//     email+='';
//     email+='';
//     email+='';
//     email+='';
//     email+='        Order Details:';
//     email+='        <table style="width:60%; margin-left:55px;">';
//     email+='        <tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Total Order Amount: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+net_amount+'</td>';
//     email+='        </tr>';
//     email+='        <tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Place Date: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+created_on+'</td>';
//     email+='        </tr>';
//     email+='        <tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Expected Delivery Time:</td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+schedule_date+'</td>';
//     email+='        </tr>';
//     email+='        <tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Order Ref Number: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;"> '+orderId+'</td>';
//     email+='        </tr><tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Supplier Name: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+supplierName+'</td>';
//     email+='        </tr><tr>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">Payment Method: </td>';
//     email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+payment_type+'</td>';
//     email+='        </tr>';
//     email+='</table>';
//     email+='';
//     email+='';
//     email+='';
//     email+='        For Further Details, please login to your Account to Confirm & Manage the Order';
//     email+='';
//     email+='';
//     email+='        Please Do Not Hesitate to contact Us if you need any Further Assistance';
//     // email+='        Tel: 04- 347 6654';
//     email+='        Email: '+req.help_email+'';
//     email+='</pre>';
//     email+='</section>';
//     email+='</body>';
//     email+='</html>';


//     func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[AdminMail,supplierEmail],email,0,function(err,result){
//         if(err){
//             callback(err);
//         }else{
//             callback(null)
//         }
//     });
// }

exports.creatingNewSubAdmin = function (reply,userName,password,callback) {
   var subject='Royo-New Sub Admin Access Details ';
   var email='<!DOCTYPE html>';
    email+='<html lang="en">';
    email+='<head>';
    email+='<meta charset="UTF-8">';
    email+='<title> CREATE NEW SUB ADMIN</title>';
    email+='</head>';
    email+='<body>';
    email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
    email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
    email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
    email+='    <h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;"> CREATE NEW SUB ADMIN</h3>';
    email+='        <b>Dear supplier';
    email+='';
    email+='';
    email+='        Yoy Have Created New Sub Admin User as per Below Details :-';
    email+='';
    email+='';
    email+='        Username: '+userName;
    email+='';
    email+='        Your New Password is: '+password;
    email+='';
    email+='';
    email+='        Please change your Password for security Purposes.';
    email+='';
    email+='';
    email+='        For Further Details, please login to your Account to Confirm & Manage the Order';
    email+='';
    email+='        Please Do Not Hesitate to contact Us if you need any Further Assistance';
    email+='        Tel: 04- 347 6654';
    email+='        Email: ops@Royo.com';
    email+='</pre>';
    email+='</section>';
    email+='</body>';
    email+='</html>';
    func.sendMailthroughSMTP({},reply,subject,[supplierEmail],email,0,function(err,result){
        if(err){
            callback(err);
        }else{
            callback(null)
        }
    });
}

exports.addProductBySupplier = async function (req,reply,AdminMail,supplierName,productId,ProductName,cateName,subcatName,detSubCatName,callback) {
    var subject = 'New Product Uploaded by '+supplierName;
    let smtpSqlSata=await Universal.smtpData(req.dbName);
    //var email='<!DOCTYPE html>';
   var  email='<html lang="en">';
    email+='<head>';
    email+='<meta charset="UTF-8">';
    email+='<title>NEW PRODUCT BY SUPPLIER EXTRANET</title>';
    email+='</head>';
    email+='<body>';
    email+='<section style="max-width:750px; margin:0px auto; font-family:san-serif;">';
    email+='<img src="https://s3.amazonaws.com/uploads.hipchat.com/193853/3328758/uZ8McFabclGgJjP/mg2.jpg" style="width:100%; height:auto;">';
    email+='<pre style="font-size:15px; font-family: verdana san-serif;">';
    email+='    <h3 style="width:300px; margin:0px auto; margin-top:30px; margin-bottom:30px;">NEW PRODUCT BY SUPPLIER EXTRANET</h3>';
    email+='        <b>Dear ADMIN,</b>';
    email+='';
    email+='';
    email+='        Please Approve New Product Uploaded by supplier Extra Net :-';
    email+='';
    email+='';
    email+='        <u style="padding: 10px 0px">Supplier Name: '+supplierName+'</u>';
    email+='        <u style="padding: 10px 0px">Catagoty:'+cateName+'</u>';
    email+='        <u style="padding: 10px 0px">SUB CAT: '+subcatName+'</u>';
    email+='        <u style="padding: 10px 0px">DET SUB CAT: '+detSubCatName+'</u>';
    email+='';
    email+='';
    email+='        <table style="width:60%; margin-left:55px;">';
    email+='        <tr>';
    email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">PRODUCT NAME </td>';
    email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+ProductName+' </td>';
    email+='        </tr>';
    email+='        <tr>';
    email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">PRODUCT ID</td>';
    email+='            <td style="border-bottom:1px solid #d4d4d4; padding:10px 0px;">'+productId+' </td>';
    email+='        </tr>';
    email+='';
    email+='</table>';
    email+='';
    email+='';
    email+='';
    email+='        Regards';
    email+='';
    email+='        System Generated';
    email+='</pre>';
    email+='</section>';
    email+='</body>';
    email+='</html>';

    func.sendMailthroughSMTP(smtpSqlSata,reply,subject,[AdminMail],email,0,function(err,result){
        if(err){
            callback(err);
        }else{
            callback(null)
        }
    });
}


exports.userResetpassword = async function(req,reply,userEmail,password,callback){
    let smtpSqlSata=await Universal.smtpData(req.dbName);
    logger.debug("=====smtpSqlSata===>>",smtpSqlSata)
    var subject=''+req.business_name+'-Reset Password Request';
    let colorThemeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
   //    email+='<!DOCTYPE html>';
    let userName = "";

   var userDetailsSql = "select id,firstname from user where email = ?";
   let result=await Execute.Query(req.dbName,userDetailsSql,[userEmail])

   if(result && result.length>0){
       userName = result[0].firstname;
   }

   let new_email_template_v10=await Execute.Query(req.dbName,
    "select `key`,`value` from tbl_setting where `key`=? and value=1 ",
    ["new_emain_template_v10"]);
if(new_email_template_v10 && new_email_template_v10.length>0){
    var email = `<!DOCTYPE html>
    <html>
    <head>
        <title>Forgot Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body style="font-family: Segoe UI, Roboto, Helvetica Neue,Helvetica, Arial,sans-serif; background: #fff;  max-width: 700px;  margin:40px 10px; padding: 0px; border-radius: 15px; display:table; margin: 15px auto;">
    
           <table  cellspacing="0" cellpanding="0" style="max-width:700px;  border-collapse: collapse; border-radius: 15px; border: 1px solid #eee;">
                <tr>
                <td style="padding: 0px;">
               
                    <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2; " cellspacing="0" cellpanding="0">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 20px;"> 
                                    <img src="images/logo.png" alt="" 
                                     style="display: inline-block; width: 100px; margin:0 0 0px; ">
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>        
                    <table style="width: 100%; ">
                        <tbody>
                            <tr>
                                 <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                  <h3></h3>
                                    <p  style="font-size: 16px; color: #666; margin:0px; ">Hi ${userName},
                                    </p>
                                     <p style="color: #666; font-size: 16px; line-height:20px;">A password reset for your account was requested.</p>
                                     <p style="color: #666; font-size: 16px; line-height:20px;">Your new password is:  ${password} </p>
                                     <p style="color: #666; font-size: 16px; line-height:20px;"><strong>Note :</strong> You're receiving this e-mail because you requested a password reset for your user account at ${req.business_name}</p>
                                     <a href="#" style="background-color: #ec5252;
                                    color: #fff;
                                    text-decoration: none;
                                    padding: 10px;
                                    display: inline-block;
                                    text-align: center;
                                    border-radius: 5px;margin: 30px 200px;">Change Your Password</a>
                                    <P style="color: #666; font-size: 16px;">If you have any questions along the way, email us at <a style="color: #000; text-decoration: underline;" href=${req.help_email}" title="">${req.help_email}</P>
                                    <p>Speak to you soon!</p>
                                    <p>Body Formula Team </p>
                                </td>
                            </tr>                   
                        </tbody>
                    </table>
                    <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2; " cellspacing="0" cellpanding="0">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 20px;"> 
                                    <h3 style="width: 300px;font-size: 14px;">Body Formula Ltd</h3>
                                    <p style="margin:0;">Unsubscribe</p>
                                </td>
                                <td style="text-align: right; width: 90%;  padding: 10px 10px;">
                                    
                                    <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                                </td>
                                <td style="text-align: right; width: 70%;  padding: 10px 10px;">
                                    
                                    <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                                </td>
                                <td style="text-align: right; width: 70%;  padding: 10px 10px;">
                                    
                                    <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
                                </td>
                                <td style="text-align: right; width: 70%;  padding: 10px 10px;">
                                    
                                    <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-instagram" aria-hidden="true"></i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table> 
              </td>
           </tr>
         </table>
               
    </body>
    </html>`
}else{
    var email =   "<!doctype html> "+
    '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">'+
    
    '<head>'+
        '<meta charset="utf-8">'+
        '<meta name="viewport" content="width=device-width">'+
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
        '<meta name="x-apple-disable-message-reformatting">'+
        '<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">'+
    
        '<title>'+
         'RESET PASSWORD'+
        '</title>'+
        '<style>'+
            'html,'+
            'body {'+
                'margin: 0 auto !important;'+
                'letter-spacing: 0.5px;'+
                'padding: 0 !important;'+
                'height: 100% !important;'+
                'width: 100% !important;'+
                'font-family: "Montserrat",'+
                'sans-serif;'+
            '}'+
    
            '* {'+
                '-ms-text-size-adjust: 100%;'+
                '-webkit-text-size-adjust: 100%;'+
            '}'+
    
            'div[style*="margin: 16px 0"] {'+
                'margin: 0 !important;'+
            '}'+
    
            'table,'+
            'td {'+
                'mso-table-lspace: 0pt !important;'+
                'mso-table-rspace: 0pt !important;'+
            '}'+
    
    
            'table table table {'+
                'table-layout: auto;'+
            '}'+
    
            'img {'+
                '-ms-interpolation-mode: bicubic;'+
            '}'+
    
            '[x-apple-data-detectors],'+
            '.x-gmail-data-detectors,'+
            '.x-gmail-data-detectors *,'+
            '.aBn {'+
                'border-bottom: 0 !important;'+
                'cursor: default !important;'+
                'color: inherit !important;'+
                'text-decoration: none !important;'+
                'font-size: inherit !important;'+
                'font-family: inherit !important;'+
                'font-weight: inherit !important;'+
                'line-height: inherit !important;'+
            '}'+
        '</style>'+
    '</head>'+
    
    '<body width="100%" style="margin: 0;">'+
        '<center style="width: 100%; background: #edf2f740; text-align: left;">'+
            '<div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"'+
                'class="email-container">'+
                '<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"'+
                    'style="border: 1px solid #ddd; padding-bottom: 50px;">'+
                    '<tbody>'+
                        '<tr>'+
                            '<td>'+
                                '<div style="padding:20px;text-align: center;">'+
                                    '<div style="width:20%;margin: 0 auto;">'+
                                        '<img style="max-width: 100%;" src="'+req.logo_url+'" class="g-img">'+
                                    '</div>'+
                                '</div>'+
                            '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>'+
                                '<div '+
                                ' style="background-color: "'+colorTheme+'";padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">'+
                                '<h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">RESET PASSWORD'+
                                ' </h2>'+
                                '</div>'+
                            '</td>'+
                        '</tr>'+
    
                        '<tr>'+
                            '<td>'+
                                '<div style="background-color: #88b1a90d; padding: 20px 20px;margin: 0px 25px 20px;">'+
                                    '<table style="width: 100%;font-size: 14px;font-weight: 300;">'+
                                        '<tbody>'+
                                            '<tr>'+
                                                '<td style="padding-bottom: 10px;">You seem to have forgotten your password:</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                            '<td style="font-weight: 400;padding-bottom: 10px">Your new password is: '+password+'</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                    '</table>'+
                                '</div>'+
                            '</td>'+
                        '</tr>'+
    
                        '<tr>'+
                            '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                            'margin: 0px 25px;'+
                            'max-width: 92%;'+
                        '"></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                            'margin: 0px 25px;'+
                            'max-width: 92%;'+
                        '"></td>'+
                        '</tr>'+
                        '<!-- <tr>'+
                            '<td><hr style="background-color: #e84b58;">'+
                            '</td>'+
                        '</tr> -->'+
                    '</tbody>'+
                '</table>'+
            '</div>'+
        '</center>'+
    '</body>'+
    
    '</html>'
  
 
}
     
       func.sendMailthroughSMTP(smtpSqlSata,reply,subject,userEmail,email,0,function(err,result){
           if(err){
               callback(err);
           }else{
               callback(null)
           }
       });
   }
exports.userChangepassword = async function(req,reply,userEmail,password,callback){
    let smtpSqlSata=await Universal.smtpData(req.dbName);
    logger.debug("=====smtpSqlSata===>>",smtpSqlSata)
    var subject=''+req.business_name+'-Change Password';
    let colorThemeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
   //    email+='<!DOCTYPE html>';
    let userName = "";

   var userDetailsSql = "select id,firstname from user where email = ?";
   let result=await Execute.Query(req.dbName,userDetailsSql,[userEmail])

   if(result && result.length>0){
       userName = result[0].firstname;
   }

   let new_email_template_v10=await Execute.Query(req.dbName,
    "select `key`,`value` from tbl_setting where `key`=? and value=1 ",
    ["new_emain_template_v10"]);
if(new_email_template_v10 && new_email_template_v10.length>0){
    var email = `<!DOCTYPE html>
    <html>
    <head>
        <title>Forgot Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    </head>
    <body style="font-family: Segoe UI, Roboto, Helvetica Neue,Helvetica, Arial,sans-serif; background: #fff;  max-width: 700px;  margin:40px 10px; padding: 0px; border-radius: 15px; display:table; margin: 15px auto;">
    
           <table  cellspacing="0" cellpanding="0" style="max-width:700px;  border-collapse: collapse; border-radius: 15px; border: 1px solid #eee;">
                <tr>
                <td style="padding: 0px;">
               
                    <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2; " cellspacing="0" cellpanding="0">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 20px;"> 
                                    <img src="images/logo.png" alt="" 
                                     style="display: inline-block; width: 100px; margin:0 0 0px; ">
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>        
                    <table style="width: 100%; ">
                        <tbody>
                            <tr>
                                 <td style="text-align: left; padding:0px 15px 8px; width: 100%; ">
                                  <h3></h3>
                                    <p  style="font-size: 16px; color: #666; margin:0px; ">Hi ${userName},
                                    </p>
                                     <p style="color: #666; font-size: 16px; line-height:20px;">A password reset for your account was requested.</p>
                                     <p style="color: #666; font-size: 16px; line-height:20px;">Your new password is:  ${password} </p>
                                     <p style="color: #666; font-size: 16px; line-height:20px;"><strong>Note :</strong> You're receiving this e-mail because you requested a password reset for your user account at ${req.business_name}</p>
                                     <a href="#" style="background-color: #ec5252;
                                    color: #fff;
                                    text-decoration: none;
                                    padding: 10px;
                                    display: inline-block;
                                    text-align: center;
                                    border-radius: 5px;margin: 30px 200px;">Change Your Password</a>
                                    <P style="color: #666; font-size: 16px;">If you have any questions along the way, email us at <a style="color: #000; text-decoration: underline;" href=${req.help_email}" title="">${req.help_email}</P>
                                    <p>Speak to you soon!</p>
                                    <p>Body Formula Team </p>
                                </td>
                            </tr>                   
                        </tbody>
                    </table>
                    <table style="width:100%; border-collapse: collapse;background-color: #f2f2f2; " cellspacing="0" cellpanding="0">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 20px;"> 
                                    <h3 style="width: 300px;font-size: 14px;">Body Formula Ltd</h3>
                                    <p style="margin:0;">Unsubscribe</p>
                                </td>
                                <td style="text-align: right; width: 90%;  padding: 10px 10px;">
                                    
                                    <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                                </td>
                                <td style="text-align: right; width: 70%;  padding: 10px 10px;">
                                    
                                    <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                                </td>
                                <td style="text-align: right; width: 70%;  padding: 10px 10px;">
                                    
                                    <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
                                </td>
                                <td style="text-align: right; width: 70%;  padding: 10px 10px;">
                                    
                                    <a href="#" title="" style="color: #222; display: inline-block;  font-size: 20px; text-decoration: none;"><i class="fa fa-instagram" aria-hidden="true"></i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table> 
              </td>
           </tr>
         </table>
               
    </body>
    </html>`
}else{
    var email =   "<!doctype html> "+
    '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">'+
    
    '<head>'+
        '<meta charset="utf-8">'+
        '<meta name="viewport" content="width=device-width">'+
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
        '<meta name="x-apple-disable-message-reformatting">'+
        '<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">'+
    
        '<title>'+
         'RESET PASSWORD'+
        '</title>'+
        '<style>'+
            'html,'+
            'body {'+
                'margin: 0 auto !important;'+
                'letter-spacing: 0.5px;'+
                'padding: 0 !important;'+
                'height: 100% !important;'+
                'width: 100% !important;'+
                'font-family: "Montserrat",'+
                'sans-serif;'+
            '}'+
    
            '* {'+
                '-ms-text-size-adjust: 100%;'+
                '-webkit-text-size-adjust: 100%;'+
            '}'+
    
            'div[style*="margin: 16px 0"] {'+
                'margin: 0 !important;'+
            '}'+
    
            'table,'+
            'td {'+
                'mso-table-lspace: 0pt !important;'+
                'mso-table-rspace: 0pt !important;'+
            '}'+
    
    
            'table table table {'+
                'table-layout: auto;'+
            '}'+
    
            'img {'+
                '-ms-interpolation-mode: bicubic;'+
            '}'+
    
            '[x-apple-data-detectors],'+
            '.x-gmail-data-detectors,'+
            '.x-gmail-data-detectors *,'+
            '.aBn {'+
                'border-bottom: 0 !important;'+
                'cursor: default !important;'+
                'color: inherit !important;'+
                'text-decoration: none !important;'+
                'font-size: inherit !important;'+
                'font-family: inherit !important;'+
                'font-weight: inherit !important;'+
                'line-height: inherit !important;'+
            '}'+
        '</style>'+
    '</head>'+
    
    '<body width="100%" style="margin: 0;">'+
        '<center style="width: 100%; background: #edf2f740; text-align: left;">'+
            '<div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"'+
                'class="email-container">'+
                '<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"'+
                    'style="border: 1px solid #ddd; padding-bottom: 50px;">'+
                    '<tbody>'+
                        '<tr>'+
                            '<td>'+
                                '<div style="padding:20px;text-align: center;">'+
                                    '<div style="width:20%;margin: 0 auto;">'+
                                        '<img style="max-width: 100%;" src="'+req.logo_url+'" class="g-img">'+
                                    '</div>'+
                                '</div>'+
                            '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>'+
                                '<div '+
                                ' style="background-color: "'+colorTheme+'";padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">'+
                                '<h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">RESET PASSWORD'+
                                ' </h2>'+
                                '</div>'+
                            '</td>'+
                        '</tr>'+
    
                        '<tr>'+
                            '<td>'+
                                '<div style="background-color: #88b1a90d; padding: 20px 20px;margin: 0px 25px 20px;">'+
                                    '<table style="width: 100%;font-size: 14px;font-weight: 300;">'+
                                        '<tbody>'+
                                            '<tr>'+
                                                '<td style="padding-bottom: 10px;">You had change your password:</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                            '<td style="font-weight: 400;padding-bottom: 10px">Your new password is: '+password+'</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                    '</table>'+
                                '</div>'+
                            '</td>'+
                        '</tr>'+
    
                        '<tr>'+
                            '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                            'margin: 0px 25px;'+
                            'max-width: 92%;'+
                        '"></td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                            'margin: 0px 25px;'+
                            'max-width: 92%;'+
                        '"></td>'+
                        '</tr>'+
                        '<!-- <tr>'+
                            '<td><hr style="background-color: #e84b58;">'+
                            '</td>'+
                        '</tr> -->'+
                    '</tbody>'+
                '</table>'+
            '</div>'+
        '</center>'+
    '</body>'+
    
    '</html>'
  
 
}
     
       func.sendMailthroughSMTP(smtpSqlSata,reply,subject,userEmail,email,0,function(err,result){
        //    if(err){
        //        callback(err);
        //    }else{
               callback(null)
        //    }
       });
   }
exports.supplierNewRegisteration = async function(req,reply,userEmail,password,callback){
    let smtpSqlSata=await Universal.smtpData(req.dbName);
    var subject=''+req.business_name+'-New Supplier Registration';
    let colorThemeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
   //    email+='<!DOCTYPE html>';
   var email =   "<!doctype html> "+
   '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">'+
   
   '<head>'+
       '<meta charset="utf-8">'+
       '<meta name="viewport" content="width=device-width">'+
       '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
       '<meta name="x-apple-disable-message-reformatting">'+
       '<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">'+
   
       '<title>'+
        'New Supplier Registration'+
       '</title>'+
       '<style>'+
           'html,'+
           'body {'+
               'margin: 0 auto !important;'+
               'letter-spacing: 0.5px;'+
               'padding: 0 !important;'+
               'height: 100% !important;'+
               'width: 100% !important;'+
               'font-family: "Montserrat",'+
               'sans-serif;'+
           '}'+
   
           '* {'+
               '-ms-text-size-adjust: 100%;'+
               '-webkit-text-size-adjust: 100%;'+
           '}'+
   
           'div[style*="margin: 16px 0"] {'+
               'margin: 0 !important;'+
           '}'+
   
           'table,'+
           'td {'+
               'mso-table-lspace: 0pt !important;'+
               'mso-table-rspace: 0pt !important;'+
           '}'+
   
   
           'table table table {'+
               'table-layout: auto;'+
           '}'+
   
           'img {'+
               '-ms-interpolation-mode: bicubic;'+
           '}'+
   
           '[x-apple-data-detectors],'+
           '.x-gmail-data-detectors,'+
           '.x-gmail-data-detectors *,'+
           '.aBn {'+
               'border-bottom: 0 !important;'+
               'cursor: default !important;'+
               'color: inherit !important;'+
               'text-decoration: none !important;'+
               'font-size: inherit !important;'+
               'font-family: inherit !important;'+
               'font-weight: inherit !important;'+
               'line-height: inherit !important;'+
           '}'+
       '</style>'+
   '</head>'+
   
   '<body width="100%" style="margin: 0;">'+
       '<center style="width: 100%; background: #edf2f740; text-align: left;">'+
           '<div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"'+
               'class="email-container">'+
               '<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"'+
                   'style="border: 1px solid #ddd; padding-bottom: 50px;">'+
                   '<tbody>'+
                       '<tr>'+
                           '<td>'+
                               '<div style="padding:20px;text-align: center;">'+
                                   '<div style="width:20%;margin: 0 auto;">'+
                                       '<img style="max-width: 100%;" src="'+req.logo_url+'" class="g-img">'+
                                   '</div>'+
                               '</div>'+
                           '</td>'+
                       '</tr>'+
                       '<tr>'+
                           '<td>'+
                               '<div '+
                               ' style="background-color: "'+colorTheme+'";padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">'+
                               '<h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">Welcome to '+req.business_name+''+
                               ' </h2>'+
                               '</div>'+
                           '</td>'+
                       '</tr>'+
   
                       '<tr>'+
                           '<td>'+
                               '<div style="background-color: #88b1a90d; padding: 20px 20px;margin: 0px 25px 20px;">'+
                                   '<table style="width: 100%;font-size: 14px;font-weight: 300;">'+
                                       '<tbody>'+
                                           '<tr>'+
                                               '<td style="padding-bottom: 10px;line-height: 20px;">Congratulations you have been registered.</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                               '<td style="padding-bottom: 10px;">Please find below your Access Details</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                           '<td style="font-weight: 400;padding-bottom: 10px">Email: '+userEmail+'</td>'+
                                           '</tr>'+

                                           '<tr>'+
                                           '<td style="font-weight: 400;padding-bottom: 10px">Password: '+password+'</td>'+
                                           '</tr>'+

                                           '<tr>'+
                                           '<td style="font-weight: 400;padding-bottom: 10px">Wishing your business prosperity and success.</td>'+
                                           '</tr>'+

                                       '</tbody>'+
                                   '</table>'+
                               '</div>'+
                           '</td>'+
                       '</tr>'+
   
                       '<tr>'+
                           '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                           'margin: 0px 25px;'+
                           'max-width: 92%;'+
                       '"></td>'+
                       '</tr>'+
                       '<tr>'+
                           '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                           'margin: 0px 25px;'+
                           'max-width: 92%;'+
                       '"></td>'+
                       '</tr>'+
                       '<!-- <tr>'+
                           '<td><hr style="background-color: #e84b58;">'+
                           '</td>'+
                       '</tr> -->'+
                   '</tbody>'+
               '</table>'+
           '</div>'+
       '</center>'+
   '</body>'+
   
   '</html>'
       func.sendMailthroughSMTP(smtpSqlSata,reply,subject,userEmail,email,0,function(err,result){
           if(err){
               callback(err);
           }else{
               callback(null)
           }
       });
   }

exports.driverNewRegisteration = async function(req,reply,userEmail,password,callback){
    let smtpSqlSata=await Universal.smtpData(req.dbName);
    var subject=''+req.business_name+'-New Registeration';
    let colorThemeData=await Execute.Query(req.dbName,"select `key`,`value` from tbl_setting where `key`=?",["theme_color"]);
    let colorTheme=colorThemeData && colorThemeData.length>0?colorThemeData[0].value:"#e84b58"
   //    email+='<!DOCTYPE html>';
   var email =   "<!doctype html> "+
   '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">'+
   
   '<head>'+
       '<meta charset="utf-8">'+
       '<meta name="viewport" content="width=device-width">'+
       '<meta http-equiv="X-UA-Compatible" content="IE=edge">'+
       '<meta name="x-apple-disable-message-reformatting">'+
       '<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">'+
   
       '<title>'+
        'New Registeration'+
       '</title>'+
       '<style>'+
           'html,'+
           'body {'+
               'margin: 0 auto !important;'+
               'letter-spacing: 0.5px;'+
               'padding: 0 !important;'+
               'height: 100% !important;'+
               'width: 100% !important;'+
               'font-family: "Montserrat",'+
               'sans-serif;'+
           '}'+
   
           '* {'+
               '-ms-text-size-adjust: 100%;'+
               '-webkit-text-size-adjust: 100%;'+
           '}'+
   
           'div[style*="margin: 16px 0"] {'+
               'margin: 0 !important;'+
           '}'+
   
           'table,'+
           'td {'+
               'mso-table-lspace: 0pt !important;'+
               'mso-table-rspace: 0pt !important;'+
           '}'+
   
   
           'table table table {'+
               'table-layout: auto;'+
           '}'+
   
           'img {'+
               '-ms-interpolation-mode: bicubic;'+
           '}'+
   
           '[x-apple-data-detectors],'+
           '.x-gmail-data-detectors,'+
           '.x-gmail-data-detectors *,'+
           '.aBn {'+
               'border-bottom: 0 !important;'+
               'cursor: default !important;'+
               'color: inherit !important;'+
               'text-decoration: none !important;'+
               'font-size: inherit !important;'+
               'font-family: inherit !important;'+
               'font-weight: inherit !important;'+
               'line-height: inherit !important;'+
           '}'+
       '</style>'+
   '</head>'+
   
   '<body width="100%" style="margin: 0;">'+
       '<center style="width: 100%; background: #edf2f740; text-align: left;">'+
           '<div style="max-width: 600px; margin: auto; background: #fff; color: #000; padding-bottom: 70px;"'+
               'class="email-container">'+
               '<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"'+
                   'style="border: 1px solid #ddd; padding-bottom: 50px;">'+
                   '<tbody>'+
                       '<tr>'+
                           '<td>'+
                               '<div style="padding:20px;text-align: center;">'+
                                   '<div style="width:20%;margin: 0 auto;">'+
                                       '<img style="max-width: 100%;" src="'+req.logo_url+'" class="g-img">'+
                                   '</div>'+
                               '</div>'+
                           '</td>'+
                       '</tr>'+
                       '<tr>'+
                           '<td>'+
                               '<div '+
                               ' style="background-color: "'+colorTheme+'";padding: 20px 25px; line-height: 23px; margin-bottom: 30px;">'+
                               '<h2 style="font-size: 20px;font-weight: 600;color: #fff;margin: 0px;">Welcome To '+req.business_name+''+
                               ' </h2>'+
                               '</div>'+
                           '</td>'+
                       '</tr>'+
   
                       '<tr>'+
                           '<td>'+
                               '<div style="background-color: #88b1a90d; padding: 20px 20px;margin: 0px 25px 20px;">'+
                                   '<table style="width: 100%;font-size: 14px;font-weight: 300;">'+
                                       '<tbody>'+
                                           '<tr>'+
                                               '<td style="padding-bottom: 10px;line-height: 20px;">Congratulations you have been registered.</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                               '<td style="padding-bottom: 10px;">Please find below your Access Details</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                           '<td style="font-weight: 400;padding-bottom: 10px">Email: '+userEmail+'</td>'+
                                           '</tr>'+

                                           '<tr>'+
                                           '<td style="font-weight: 400;padding-bottom: 10px">Password: '+password+'</td>'+
                                           '</tr>'+

                                           '<tr>'+
                                           '<td style="font-weight: 400;padding-bottom: 10px">Wishing your Business Prosperity and Success.</td>'+
                                           '</tr>'+

                                       '</tbody>'+
                                   '</table>'+
                               '</div>'+
                           '</td>'+
                       '</tr>'+
   
                       '<tr>'+
                           '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                           'margin: 0px 25px;'+
                           'max-width: 92%;'+
                       '"></td>'+
                       '</tr>'+
                       '<tr>'+
                           '<td><img src="https://cdn-assets.royoapps.com/line.jpg" style="'+
                           'margin: 0px 25px;'+
                           'max-width: 92%;'+
                       '"></td>'+
                       '</tr>'+
                       '<!-- <tr>'+
                           '<td><hr style="background-color: #e84b58;">'+
                           '</td>'+
                       '</tr> -->'+
                   '</tbody>'+
               '</table>'+
           '</div>'+
       '</center>'+
   '</body>'+
   
   '</html>'
       func.sendMailthroughSMTP(smtpSqlSata,reply,subject,userEmail,email,0,function(err,result){
           if(err){
               callback(err);
           }else{
               callback(null)
           }
       });
   }