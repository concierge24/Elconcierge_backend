var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./sequelizeMeta");
var _account_payable = require("./accountPayable");
var _account_payable_order = require("./accountPayableOrder");
var _account_receivable = require("./accountReceivable");
var _account_receivable_order = require("./accountReceivableOrder");
var _account_receivable_subscriptions = require("./accountReceivableSubscriptions");
var _account_statement = require("./accountStatement");
var _additional_admin_revenue_amount = require("./additionalAdminRevenueAmount");
var _admin = require("./admin");
var _admin_authority = require("./adminAuthority");
var _admin_category_permission = require("./adminCategoryPermission");
var _admin_customized_commission = require("./adminCustomizedCommission");
var _admin_dcategory_permission = require("./adminDcategoryPermission");
var _admin_login = require("./adminLogin");
var _admin_logs = require("./adminLogs");
var _admin_section_category = require("./adminSectionCategory");
var _admin_sections = require("./adminSections");
var _admindd_dcategory_permission = require("./adminddDcategoryPermission");
var _ads_sponsor_areas = require("./adsSponsorAreas");
var _advertisement_ml = require("./advertisementMl");
var _advertisements = require("./advertisements");
var _agent_db = require("./agentDb");
var _agent_orders = require("./agentOrders");
var _agent_service_pricing = require("./agentServicePricing");
var _agent_supplier_payouts = require("./agentSupplierPayouts");
var _agent_tips = require("./agentTips");
var _apitables = require("./apitables");
var _area = require("./area");
var _area_ml = require("./areaMl");
var _base_currency = require("./baseCurrency");
var _booking_cart_flow = require("./bookingCartFlow");
var _brands = require("./brands");
var _brands_ml = require("./brandsMl");
var _cache = require("./cache");
var _cancellation_policy = require("./cancellationPolicy");
var _card_payment_failure = require("./cardPaymentFailure");
var _cart = require("./cart");
var _cart_adds_on = require("./cartAddsOn");
var _cart_products = require("./cartProducts");
var _cart_variant = require("./cartVariant");
var _cat_brands = require("./catBrands");
var _cat_variants = require("./catVariants");
var _cat_variants_ml = require("./catVariantsMl");
var _categories = require("./categories");
var _categories_areas = require("./categoriesAreas");
var _categories_ml = require("./categoriesMl");
var _chats = require("./chats");
var _check_cbl_authority = require("./checkCblAuthority");
var _city = require("./city");
var _city_ml = require("./cityMl");
var _conversations = require("./conversations");
var _country = require("./country");
var _country_ml = require("./countryMl");
var _currency_conversion = require("./currencyConversion");
var _currency_country = require("./currencyCountry");
var _currency_default = require("./currencyDefault");
var _data_gathering_admin = require("./dataGatheringAdmin");
var _default_address = require("./defaultAddress");
var _delivery_companies = require("./deliveryCompanies");
var _dhl_shipment = require("./dhlShipment");
var _dump_category = require("./dumpCategory");
var _experience_level = require("./experienceLevel");
var _feedback = require("./feedback");
var _gift_card = require("./giftCard");
var _gift_card_ml = require("./giftCardMl");
var _hold_supplier_slots = require("./holdSupplierSlots");
var _is_sponsor = require("./isSponsor");
var _language = require("./language");
var _loyality_level = require("./loyalityLevel");
var _loyality_level_category_assignment = require("./loyalityLevelCategoryAssignment");
var _loyality_point_earning = require("./loyalityPointEarning");
var _loyalty_order = require("./loyaltyOrder");
var _loyalty_order_product = require("./loyaltyOrderProduct");
var _loyalty_points = require("./loyaltyPoints");
var _new = require("./new");
var _notification_broadcasting_areas = require("./notificationBroadcastingAreas");
var _order_prices = require("./orderPrices");
var _order_promo = require("./orderPromo");
var _order_recurring = require("./orderRecurring");
var _order_remaining_payment = require("./orderRemainingPayment");
var _order_return_request = require("./orderReturnRequest");
var _order_tracking = require("./orderTracking");
var _order_type_wise_payment_gateways = require("./orderTypeWisePaymentGateways");
var _orders = require("./orders");
var _orders_user_subscription = require("./ordersUserSubscription");
var _pincode = require("./pincode");
var _plan_categories = require("./planCategories");
var _plan_categories_types = require("./planCategoriesTypes");
var _plan_permissions = require("./planPermissions");
var _pos_settings = require("./posSettings");
var _post_comments = require("./postComments");
var _post_images = require("./postImages");
var _post_likes = require("./postLikes");
var _post_reports = require("./postReports");
var _post_user_block = require("./postUserBlock");
var _posts = require("./posts");
var _product = require("./product");
var _product_adds_on = require("./productAddsOn");
var _product_adds_on_ml = require("./productAddsOnMl");
var _product_adds_on_type = require("./productAddsOnType");
var _product_adds_on_type_ml = require("./productAddsOnTypeMl");
var _product_favourite = require("./productFavourite");
var _product_image = require("./productImage");
var _product_ml = require("./productMl");
var _product_pricing = require("./productPricing");
var _product_rating = require("./productRating");
var _product_variants = require("./productVariants");
var _product_variants_images = require("./productVariantsImages");
var _promoCode = require("./promoCode");
var _promotions_ml = require("./promotionsMl");
var _push_notifications = require("./pushNotifications");
var _question_options = require("./questionOptions");
var _questions = require("./questions");
var _recent_view_history = require("./recentViewHistory");
var _referral_used = require("./referralUsed");
var _refund_timings = require("./refundTimings");
var _refund_types = require("./refundTypes");
var _review_image = require("./reviewImage");
var _schedule_monthly = require("./scheduleMonthly");
var _schedule_order = require("./scheduleOrder");
var _schedule_weekly = require("./scheduleWeekly");
var _screen_flow = require("./screenFlow");
var _shiprocket_shipment = require("./shiprocketShipment");
var _sms_email_text = require("./smsEmailText");
var _social_account_links = require("./socialAccountLinks");
var _sponsored_ads = require("./sponsoredAds");
var _subscription_plans = require("./subscriptionPlans");
var _suggestions_list = require("./suggestionsList");
var _supplier = require("./supplier");
var _supplier_admin = require("./supplierAdmin");
var _supplier_app_version = require("./supplierAppVersion");
var _supplier_assigned_tags = require("./supplierAssignedTags");
var _supplier_authority = require("./supplierAuthority");
var _supplier_availability = require("./supplierAvailability");
var _supplier_available_dates = require("./supplierAvailableDates");
var _supplier_booked_slots = require("./supplierBookedSlots");
var _supplier_branch = require("./supplierBranch");
var _supplier_branch_area_product = require("./supplierBranchAreaProduct");
var _supplier_branch_delivery_areas = require("./supplierBranchDeliveryAreas");
var _supplier_branch_ml = require("./supplierBranchMl");
var _supplier_branch_product = require("./supplierBranchProduct");
var _supplier_branch_promotions = require("./supplierBranchPromotions");
var _supplier_category = require("./supplierCategory");
var _supplier_delivery_area_dump = require("./supplierDeliveryAreaDump");
var _supplier_delivery_areas = require("./supplierDeliveryAreas");
var _supplier_delivery_charges = require("./supplierDeliveryCharges");
var _supplier_delivery_types = require("./supplierDeliveryTypes");
var _supplier_dump = require("./supplierDump");
var _supplier_image = require("./supplierImage");
var _supplier_location_availabilities = require("./supplierLocationAvailabilities");
var _supplier_min_order_distance = require("./supplierMinOrderDistance");
var _supplier_ml = require("./supplierMl");
var _supplier_package = require("./supplierPackage");
var _supplier_package_product = require("./supplierPackageProduct");
var _supplier_product = require("./supplierProduct");
var _supplier_product_loyalty_points = require("./supplierProductLoyaltyPoints");
var _supplier_rating = require("./supplierRating");
var _supplier_section_category = require("./supplierSectionCategory");
var _supplier_sections = require("./supplierSections");
var _supplier_slot_timings = require("./supplierSlotTimings");
var _supplier_slots_interval = require("./supplierSlotsInterval");
var _supplier_subscription = require("./supplierSubscription");
var _supplier_tables = require("./supplierTables");
var _supplier_tags = require("./supplierTags");
var _supplier_timings = require("./supplierTimings");
var _tbl_database = require("./tblDatabase");
var _tbl_setting = require("./tblSetting");
var _terms_and_conditions = require("./termsAndConditions");
var _top_banner = require("./topBanner");
var _user = require("./user");
var _user_address = require("./userAddress");
var _user_app_version = require("./userAppVersion");
var _user_cards = require("./userCards");
var _user_favourite = require("./userFavourite");
var _user_gift_card = require("./userGiftCard");
var _user_order_request = require("./userOrderRequest");
var _user_referral = require("./userReferral");
var _user_subscription = require("./userSubscription");
var _user_subscription_benefits = require("./userSubscriptionBenefits");
var _user_subscription_logs = require("./userSubscriptionLogs");
var _user_subscription_plan_benefits = require("./userSubscriptionPlanBenefits");
var _user_subscription_plans = require("./userSubscriptionPlans");
var _user_table_booked = require("./userTableBooked");
var _user_table_invites = require("./userTableInvites");
var _user_types = require("./userTypes");
var _user_wallet = require("./userWallet");
var _user_wallet_share = require("./userWalletShare");
var _user_wallet_transactions = require("./userWalletTransactions");
var _variants = require("./variants");
var _visitors = require("./visitors");
var _weight_wise_delivery_charge = require("./weightWiseDeliveryCharge");
var _zone = require("./zone");
var _zone_ml = require("./zoneMl");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var account_payable = _account_payable(sequelize, DataTypes);
  var account_payable_order = _account_payable_order(sequelize, DataTypes);
  var account_receivable = _account_receivable(sequelize, DataTypes);
  var account_receivable_order = _account_receivable_order(sequelize, DataTypes);
  var account_receivable_subscriptions = _account_receivable_subscriptions(sequelize, DataTypes);
  var account_statement = _account_statement(sequelize, DataTypes);
  var additional_admin_revenue_amount = _additional_admin_revenue_amount(sequelize, DataTypes);
  var admin = _admin(sequelize, DataTypes);
  var admin_authority = _admin_authority(sequelize, DataTypes);
  var admin_category_permission = _admin_category_permission(sequelize, DataTypes);
  var admin_customized_commission = _admin_customized_commission(sequelize, DataTypes);
  var admin_dcategory_permission = _admin_dcategory_permission(sequelize, DataTypes);
  var admin_login = _admin_login(sequelize, DataTypes);
  var admin_logs = _admin_logs(sequelize, DataTypes);
  var admin_section_category = _admin_section_category(sequelize, DataTypes);
  var admin_sections = _admin_sections(sequelize, DataTypes);
  var admindd_dcategory_permission = _admindd_dcategory_permission(sequelize, DataTypes);
  var ads_sponsor_areas = _ads_sponsor_areas(sequelize, DataTypes);
  var advertisement_ml = _advertisement_ml(sequelize, DataTypes);
  var advertisements = _advertisements(sequelize, DataTypes);
  var agent_db = _agent_db(sequelize, DataTypes);
  var agent_orders = _agent_orders(sequelize, DataTypes);
  var agent_service_pricing = _agent_service_pricing(sequelize, DataTypes);
  var agent_supplier_payouts = _agent_supplier_payouts(sequelize, DataTypes);
  var agent_tips = _agent_tips(sequelize, DataTypes);
  var apitables = _apitables(sequelize, DataTypes);
  var area = _area(sequelize, DataTypes);
  var area_ml = _area_ml(sequelize, DataTypes);
  var base_currency = _base_currency(sequelize, DataTypes);
  var booking_cart_flow = _booking_cart_flow(sequelize, DataTypes);
  var brands = _brands(sequelize, DataTypes);
  var brands_ml = _brands_ml(sequelize, DataTypes);
  var cache = _cache(sequelize, DataTypes);
  var cancellation_policy = _cancellation_policy(sequelize, DataTypes);
  var card_payment_failure = _card_payment_failure(sequelize, DataTypes);
  var cart = _cart(sequelize, DataTypes);
  var cart_adds_on = _cart_adds_on(sequelize, DataTypes);
  var cart_products = _cart_products(sequelize, DataTypes);
  var cart_variant = _cart_variant(sequelize, DataTypes);
  var cat_brands = _cat_brands(sequelize, DataTypes);
  var cat_variants = _cat_variants(sequelize, DataTypes);
  var cat_variants_ml = _cat_variants_ml(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var categories_areas = _categories_areas(sequelize, DataTypes);
  var categories_ml = _categories_ml(sequelize, DataTypes);
  var chats = _chats(sequelize, DataTypes);
  var check_cbl_authority = _check_cbl_authority(sequelize, DataTypes);
  var city = _city(sequelize, DataTypes);
  var city_ml = _city_ml(sequelize, DataTypes);
  var conversations = _conversations(sequelize, DataTypes);
  var country = _country(sequelize, DataTypes);
  var country_ml = _country_ml(sequelize, DataTypes);
  var currency_conversion = _currency_conversion(sequelize, DataTypes);
  var currency_country = _currency_country(sequelize, DataTypes);
  var currency_default = _currency_default(sequelize, DataTypes);
  var data_gathering_admin = _data_gathering_admin(sequelize, DataTypes);
  var default_address = _default_address(sequelize, DataTypes);
  var delivery_companies = _delivery_companies(sequelize, DataTypes);
  var dhl_shipment = _dhl_shipment(sequelize, DataTypes);
  var dump_category = _dump_category(sequelize, DataTypes);
  var experience_level = _experience_level(sequelize, DataTypes);
  var feedback = _feedback(sequelize, DataTypes);
  var gift_card = _gift_card(sequelize, DataTypes);
  var gift_card_ml = _gift_card_ml(sequelize, DataTypes);
  var hold_supplier_slots = _hold_supplier_slots(sequelize, DataTypes);
  var is_sponsor = _is_sponsor(sequelize, DataTypes);
  var language = _language(sequelize, DataTypes);
  var loyality_level = _loyality_level(sequelize, DataTypes);
  var loyality_level_category_assignment = _loyality_level_category_assignment(sequelize, DataTypes);
  var loyality_point_earning = _loyality_point_earning(sequelize, DataTypes);
  var loyalty_order = _loyalty_order(sequelize, DataTypes);
  var loyalty_order_product = _loyalty_order_product(sequelize, DataTypes);
  var loyalty_points = _loyalty_points(sequelize, DataTypes);

  var notification_broadcasting_areas = _notification_broadcasting_areas(sequelize, DataTypes);
  var order_prices = _order_prices(sequelize, DataTypes);
  var order_promo = _order_promo(sequelize, DataTypes);
  var order_recurring = _order_recurring(sequelize, DataTypes);
  var order_remaining_payment = _order_remaining_payment(sequelize, DataTypes);
  var order_return_request = _order_return_request(sequelize, DataTypes);
  var order_tracking = _order_tracking(sequelize, DataTypes);
  var order_type_wise_payment_gateways = _order_type_wise_payment_gateways(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var orders_user_subscription = _orders_user_subscription(sequelize, DataTypes);
  var pincode = _pincode(sequelize, DataTypes);
  var plan_categories = _plan_categories(sequelize, DataTypes);
  var plan_categories_types = _plan_categories_types(sequelize, DataTypes);
  var plan_permissions = _plan_permissions(sequelize, DataTypes);
  var pos_settings = _pos_settings(sequelize, DataTypes);
  var post_comments = _post_comments(sequelize, DataTypes);
  var post_images = _post_images(sequelize, DataTypes);
  var post_likes = _post_likes(sequelize, DataTypes);
  var post_reports = _post_reports(sequelize, DataTypes);
  var post_user_block = _post_user_block(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var product = _product(sequelize, DataTypes);
  var product_adds_on = _product_adds_on(sequelize, DataTypes);
  var product_adds_on_ml = _product_adds_on_ml(sequelize, DataTypes);
  var product_adds_on_type = _product_adds_on_type(sequelize, DataTypes);
  var product_adds_on_type_ml = _product_adds_on_type_ml(sequelize, DataTypes);
  var product_favourite = _product_favourite(sequelize, DataTypes);
  var product_image = _product_image(sequelize, DataTypes);
  var product_ml = _product_ml(sequelize, DataTypes);
  var product_pricing = _product_pricing(sequelize, DataTypes);
  var product_rating = _product_rating(sequelize, DataTypes);
  var product_variants = _product_variants(sequelize, DataTypes);
  var product_variants_images = _product_variants_images(sequelize, DataTypes);
  var promoCode = _promoCode(sequelize, DataTypes);
  var promotions_ml = _promotions_ml(sequelize, DataTypes);
  var push_notifications = _push_notifications(sequelize, DataTypes);
  var question_options = _question_options(sequelize, DataTypes);
  var questions = _questions(sequelize, DataTypes);
  var recent_view_history = _recent_view_history(sequelize, DataTypes);
  var referral_used = _referral_used(sequelize, DataTypes);
  var refund_timings = _refund_timings(sequelize, DataTypes);
  var refund_types = _refund_types(sequelize, DataTypes);
  var review_image = _review_image(sequelize, DataTypes);
  var schedule_monthly = _schedule_monthly(sequelize, DataTypes);
  var schedule_order = _schedule_order(sequelize, DataTypes);
  var schedule_weekly = _schedule_weekly(sequelize, DataTypes);
  var screen_flow = _screen_flow(sequelize, DataTypes);
  var shiprocket_shipment = _shiprocket_shipment(sequelize, DataTypes);
  var sms_email_text = _sms_email_text(sequelize, DataTypes);
  var social_account_links = _social_account_links(sequelize, DataTypes);
  var sponsored_ads = _sponsored_ads(sequelize, DataTypes);
  var subscription_plans = _subscription_plans(sequelize, DataTypes);
  var suggestions_list = _suggestions_list(sequelize, DataTypes);
  var supplier = _supplier(sequelize, DataTypes);
  var supplier_admin = _supplier_admin(sequelize, DataTypes);
  var supplier_app_version = _supplier_app_version(sequelize, DataTypes);
  var supplier_assigned_tags = _supplier_assigned_tags(sequelize, DataTypes);
  var supplier_authority = _supplier_authority(sequelize, DataTypes);
  var supplier_availability = _supplier_availability(sequelize, DataTypes);
  var supplier_available_dates = _supplier_available_dates(sequelize, DataTypes);
  var supplier_booked_slots = _supplier_booked_slots(sequelize, DataTypes);
  var supplier_branch = _supplier_branch(sequelize, DataTypes);
  var supplier_branch_area_product = _supplier_branch_area_product(sequelize, DataTypes);
  var supplier_branch_delivery_areas = _supplier_branch_delivery_areas(sequelize, DataTypes);
  var supplier_branch_ml = _supplier_branch_ml(sequelize, DataTypes);
  var supplier_branch_product = _supplier_branch_product(sequelize, DataTypes);
  var supplier_branch_promotions = _supplier_branch_promotions(sequelize, DataTypes);
  var supplier_category = _supplier_category(sequelize, DataTypes);
  var supplier_delivery_area_dump = _supplier_delivery_area_dump(sequelize, DataTypes);
  var supplier_delivery_areas = _supplier_delivery_areas(sequelize, DataTypes);
  var supplier_delivery_charges = _supplier_delivery_charges(sequelize, DataTypes);
  var supplier_delivery_types = _supplier_delivery_types(sequelize, DataTypes);
  var supplier_dump = _supplier_dump(sequelize, DataTypes);
  var supplier_image = _supplier_image(sequelize, DataTypes);
  var supplier_location_availabilities = _supplier_location_availabilities(sequelize, DataTypes);
  var supplier_min_order_distance = _supplier_min_order_distance(sequelize, DataTypes);
  var supplier_ml = _supplier_ml(sequelize, DataTypes);
  var supplier_package = _supplier_package(sequelize, DataTypes);
  var supplier_package_product = _supplier_package_product(sequelize, DataTypes);
  var supplier_product = _supplier_product(sequelize, DataTypes);
  var supplier_product_loyalty_points = _supplier_product_loyalty_points(sequelize, DataTypes);
  var supplier_rating = _supplier_rating(sequelize, DataTypes);
  var supplier_section_category = _supplier_section_category(sequelize, DataTypes);
  var supplier_sections = _supplier_sections(sequelize, DataTypes);
  var supplier_slot_timings = _supplier_slot_timings(sequelize, DataTypes);
  var supplier_slots_interval = _supplier_slots_interval(sequelize, DataTypes);
  var supplier_subscription = _supplier_subscription(sequelize, DataTypes);
  var supplier_tables = _supplier_tables(sequelize, DataTypes);
  var supplier_tags = _supplier_tags(sequelize, DataTypes);
  var supplier_timings = _supplier_timings(sequelize, DataTypes);
  var tbl_database = _tbl_database(sequelize, DataTypes);
  var tbl_setting = _tbl_setting(sequelize, DataTypes);
  var terms_and_conditions = _terms_and_conditions(sequelize, DataTypes);
  var top_banner = _top_banner(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_address = _user_address(sequelize, DataTypes);
  var user_app_version = _user_app_version(sequelize, DataTypes);
  var user_cards = _user_cards(sequelize, DataTypes);
  var user_favourite = _user_favourite(sequelize, DataTypes);
  var user_gift_card = _user_gift_card(sequelize, DataTypes);
  var user_order_request = _user_order_request(sequelize, DataTypes);
  var user_referral = _user_referral(sequelize, DataTypes);
  var user_subscription = _user_subscription(sequelize, DataTypes);
  var user_subscription_benefits = _user_subscription_benefits(sequelize, DataTypes);
  var user_subscription_logs = _user_subscription_logs(sequelize, DataTypes);
  var user_subscription_plan_benefits = _user_subscription_plan_benefits(sequelize, DataTypes);
  var user_subscription_plans = _user_subscription_plans(sequelize, DataTypes);
  var user_table_booked = _user_table_booked(sequelize, DataTypes);
  var user_table_invites = _user_table_invites(sequelize, DataTypes);
  var user_types = _user_types(sequelize, DataTypes);
  var user_wallet = _user_wallet(sequelize, DataTypes);
  var user_wallet_share = _user_wallet_share(sequelize, DataTypes);
  var user_wallet_transactions = _user_wallet_transactions(sequelize, DataTypes);
  var variants = _variants(sequelize, DataTypes);
  var visitors = _visitors(sequelize, DataTypes);
  var weight_wise_delivery_charge = _weight_wise_delivery_charge(sequelize, DataTypes);
  var zone = _zone(sequelize, DataTypes);
  var zone_ml = _zone_ml(sequelize, DataTypes);

  account_payable_order.belongsTo(account_payable, { as: "account_payable", foreignKey: "account_payable_id"});
  account_payable.hasMany(account_payable_order, { as: "account_payable_orders", foreignKey: "account_payable_id"});
  admin_authority.belongsTo(admin, { as: "admin", foreignKey: "admin_id"});
  admin.hasMany(admin_authority, { as: "admin_authorities", foreignKey: "admin_id"});
  admin_authority.belongsTo(admin, { as: "created_by", foreignKey: "created_by_id"});
  admin.hasMany(admin_authority, { as: "created_by_admin_authorities", foreignKey: "created_by_id"});
  admin_login.belongsTo(admin, { as: "admin", foreignKey: "admin_id"});
  admin.hasMany(admin_login, { as: "admin_logins", foreignKey: "admin_id"});
  admin_logs.belongsTo(admin, { as: "admin", foreignKey: "admin_id"});
  admin.hasMany(admin_logs, { as: "admin_logs", foreignKey: "admin_id"});
  admin_sections.belongsTo(admin_section_category, { as: "section_category", foreignKey: "section_category_id"});
  admin_section_category.hasMany(admin_sections, { as: "admin_sections", foreignKey: "section_category_id"});
  admin_authority.belongsTo(admin_sections, { as: "section", foreignKey: "section_id"});
  admin_sections.hasMany(admin_authority, { as: "admin_authorities", foreignKey: "section_id"});
  area_ml.belongsTo(area, { as: "area", foreignKey: "area_id"});
  area.hasMany(area_ml, { as: "area_mls", foreignKey: "area_id"});
  pincode.belongsTo(area, { as: "area", foreignKey: "area_id"});
  area.hasMany(pincode, { as: "pincodes", foreignKey: "area_id"});
  brands_ml.belongsTo(brands, { as: "brand", foreignKey: "brand_id"});
  brands.hasMany(brands_ml, { as: "brands_mls", foreignKey: "brand_id"});
  cat_brands.belongsTo(brands, { as: "brand", foreignKey: "brand_id"});
  brands.hasMany(cat_brands, { as: "cat_brands", foreignKey: "brand_id"});
  cart_adds_on.belongsTo(cart, { as: "cart", foreignKey: "cart_id"});
  cart.hasMany(cart_adds_on, { as: "cart_adds_ons", foreignKey: "cart_id"});
  cart_products.belongsTo(cart, { as: "cart", foreignKey: "cart_id"});
  cart.hasMany(cart_products, { as: "cart_products", foreignKey: "cart_id"});
  variants.belongsTo(cat_variants, { as: "cat_variant", foreignKey: "cat_variant_id"});
  cat_variants.hasMany(variants, { as: "variants", foreignKey: "cat_variant_id"});
  cat_brands.belongsTo(categories, { as: "cat", foreignKey: "cat_id"});
  categories.hasMany(cat_brands, { as: "cat_brands", foreignKey: "cat_id"});
  categories_ml.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(categories_ml, { as: "categories_mls", foreignKey: "category_id"});
  city_ml.belongsTo(city, { as: "city", foreignKey: "city_id"});
  city.hasMany(city_ml, { as: "city_mls", foreignKey: "city_id"});
  city.belongsTo(country, { as: "country", foreignKey: "country_id"});
  country.hasMany(city, { as: "cities", foreignKey: "country_id"});
  country_ml.belongsTo(country, { as: "country", foreignKey: "country_id"});
  country.hasMany(country_ml, { as: "country_mls", foreignKey: "country_id"});
  currency_country.belongsTo(country, { as: "country", foreignKey: "country_id"});
  country.hasMany(currency_country, { as: "currency_countries", foreignKey: "country_id"});
  currency_country.belongsTo(currency_conversion, { as: "currency_conversion", foreignKey: "currency_conversion_id"});
  currency_conversion.hasMany(currency_country, { as: "currency_countries", foreignKey: "currency_conversion_id"});
  area_ml.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(area_ml, { as: "area_mls", foreignKey: "language_id"});
  brands_ml.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(brands_ml, { as: "brands_mls", foreignKey: "language_id"});
  categories_ml.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(categories_ml, { as: "categories_mls", foreignKey: "language_id"});
  city_ml.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(city_ml, { as: "city_mls", foreignKey: "language_id"});
  country_ml.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(country_ml, { as: "country_mls", foreignKey: "language_id"});
  account_payable_order.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(account_payable_order, { as: "account_payable_orders", foreignKey: "order_id"});
  agent_orders.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(agent_orders, { as: "agent_orders", foreignKey: "order_id"});
  card_payment_failure.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(card_payment_failure, { as: "card_payment_failures", foreignKey: "order_id"});
  product_adds_on.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(product_adds_on, { as: "product_adds_ons", foreignKey: "product_id"});
  product_favourite.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(product_favourite, { as: "product_favourites", foreignKey: "product_id"});
  product_rating.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(product_rating, { as: "product_ratings", foreignKey: "product_id"});
  product_adds_on_type.belongsTo(product_adds_on, { as: "adds_on", foreignKey: "adds_on_id"});
  product_adds_on.hasMany(product_adds_on_type, { as: "product_adds_on_types", foreignKey: "adds_on_id"});
  cart_products.belongsTo(supplier_branch, { as: "supplier_branch", foreignKey: "supplier_branch_id"});
  supplier_branch.hasMany(cart_products, { as: "cart_products", foreignKey: "supplier_branch_id"});
  product_favourite.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(product_favourite, { as: "product_favourites", foreignKey: "user_id"});
  product_rating.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(product_rating, { as: "product_ratings", foreignKey: "user_id"});
  product_variants.belongsTo(variants, { as: "variant", foreignKey: "variant_id"});
  variants.hasMany(product_variants, { as: "product_variants", foreignKey: "variant_id"});

  return {
    SequelizeMeta,
    account_payable,
    account_payable_order,
    account_receivable,
    account_receivable_order,
    account_receivable_subscriptions,
    account_statement,
    additional_admin_revenue_amount,
    admin,
    admin_authority,
    admin_category_permission,
    admin_customized_commission,
    admin_dcategory_permission,
    admin_login,
    admin_logs,
    admin_section_category,
    admin_sections,
    admindd_dcategory_permission,
    ads_sponsor_areas,
    advertisement_ml,
    advertisements,
    agent_db,
    agent_orders,
    agent_service_pricing,
    agent_supplier_payouts,
    agent_tips,
    apitables,
    area,
    area_ml,
    base_currency,
    booking_cart_flow,
    brands,
    brands_ml,
    cache,
    cancellation_policy,
    card_payment_failure,
    cart,
    cart_adds_on,
    cart_products,
    cart_variant,
    cat_brands,
    cat_variants,
    cat_variants_ml,
    categories,
    categories_areas,
    categories_ml,
    chats,
    check_cbl_authority,
    city,
    city_ml,
    conversations,
    country,
    country_ml,
    currency_conversion,
    currency_country,
    currency_default,
    data_gathering_admin,
    default_address,
    delivery_companies,
    dhl_shipment,
    dump_category,
    experience_level,
    feedback,
    gift_card,
    gift_card_ml,
    hold_supplier_slots,
    is_sponsor,
    language,
    loyality_level,
    loyality_level_category_assignment,
    loyality_point_earning,
    loyalty_order,
    loyalty_order_product,
    loyalty_points,
    notification_broadcasting_areas,
    order_prices,
    order_promo,
    order_recurring,
    order_remaining_payment,
    order_return_request,
    order_tracking,
    order_type_wise_payment_gateways,
    orders,
    orders_user_subscription,
    pincode,
    plan_categories,
    plan_categories_types,
    plan_permissions,
    pos_settings,
    post_comments,
    post_images,
    post_likes,
    post_reports,
    post_user_block,
    posts,
    product,
    product_adds_on,
    product_adds_on_ml,
    product_adds_on_type,
    product_adds_on_type_ml,
    product_favourite,
    product_image,
    product_ml,
    product_pricing,
    product_rating,
    product_variants,
    product_variants_images,
    promoCode,
    promotions_ml,
    push_notifications,
    question_options,
    questions,
    recent_view_history,
    referral_used,
    refund_timings,
    refund_types,
    review_image,
    schedule_monthly,
    schedule_order,
    schedule_weekly,
    screen_flow,
    shiprocket_shipment,
    sms_email_text,
    social_account_links,
    sponsored_ads,
    subscription_plans,
    suggestions_list,
    supplier,
    supplier_admin,
    supplier_app_version,
    supplier_assigned_tags,
    supplier_authority,
    supplier_availability,
    supplier_available_dates,
    supplier_booked_slots,
    supplier_branch,
    supplier_branch_area_product,
    supplier_branch_delivery_areas,
    supplier_branch_ml,
    supplier_branch_product,
    supplier_branch_promotions,
    supplier_category,
    supplier_delivery_area_dump,
    supplier_delivery_areas,
    supplier_delivery_charges,
    supplier_delivery_types,
    supplier_dump,
    supplier_image,
    supplier_location_availabilities,
    supplier_min_order_distance,
    supplier_ml,
    supplier_package,
    supplier_package_product,
    supplier_product,
    supplier_product_loyalty_points,
    supplier_rating,
    supplier_section_category,
    supplier_sections,
    supplier_slot_timings,
    supplier_slots_interval,
    supplier_subscription,
    supplier_tables,
    supplier_tags,
    supplier_timings,
    tbl_database,
    tbl_setting,
    terms_and_conditions,
    top_banner,
    user,
    user_address,
    user_app_version,
    user_cards,
    user_favourite,
    user_gift_card,
    user_order_request,
    user_referral,
    user_subscription,
    user_subscription_benefits,
    user_subscription_logs,
    user_subscription_plan_benefits,
    user_subscription_plans,
    user_table_booked,
    user_table_invites,
    user_types,
    user_wallet,
    user_wallet_share,
    user_wallet_transactions,
    variants,
    visitors,
    weight_wise_delivery_charge,
    zone,
    zone_ml,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
