require.config({
    baseUrl: 'lib/jquery',
    paths: {
        braintree: "https://js.braintreegateway.com/web/dropin/1.9.2/js/dropin.min", //"https://assets.braintreegateway.com/v2/braintree",
        // Load PayPal's checkout.js Library.
        paypal_checkout: "https://www.paypalobjects.com/api/checkout",
        jquery: "jquery.min"
    }
});

// Start the main app logic.
define(['jquery', 'braintree'],
function (jQuery, braintree) {

    var PROFESSIONAL_CANCEL_SERVICE = "/ws/professional/cancel",
        PROFESSIONAL_PLAN_SERVICE = "/ws/professional/plan",
        PROFESSIONAL_CUSTOMER_SERVICE = "/ws/professional/customer",
        PROFESSIONAL_RETRY_SERVICE = "/ws/professional/retry",
        PROFESSIONAL_SUBSCRIBE_SERVICE = "/ws/professional/subscribe",
        PROFESSIONAL_SUBSCRIPTION_SERVICE = "/ws/professional/subscription",
        PROFESSIONAL_MOBILE_SUBSCRIPTION_SERVICE = "/ws/professional/mobile/subscription",
        PROFESSIONAL_FREETRIAL_SUBSCRIPTION_SERVICE = "/ws/professional/freetrial/subscription",
        USER_PROFILE_SERVICE = "/ws/user/profile";

    var _queryGet = function (url, data, onSuccess, onError, onComplete, persistObj) {
        jQuery.ajax({
            type: "GET",
            url: url,
            data: data || {},
            success: function (response_data, textStatus, jqXHR) {                
                if (!!onSuccess)
                    if (!!persistObj)
                        onSuccess.call(null, response_data, persistObj);
                    else
                        onSuccess.call(null, response_data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (!!onError)
                    onError.call(null, jqXHR, textStatus, errorThrown);
            },
            complete: function (jqXHR, textStatus, errorThrown) {
                if (!!onComplete)
                    onComplete.call(null, jqXHR, textStatus, errorThrown);
            }
        });


    }

    var _queryPost = function (url, data, onSuccess, onError, onComplete, persistObj) {
        jQuery.ajax({
            type: "POST",
            url: url,
            data: data || {},
            success: function (response_data, textStatus, jqXHR) {
                if (!!onSuccess)
                    if (!!persistObj)
                        onSuccess.call(null, response_data, persistObj);
                    else
                        onSuccess.call(null, response_data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (!!onError)
                    onError.call(null, jqXHR, textStatus, errorThrown);
            },
            complete: function (jqXHR, textStatus, errorThrown) {
                if (!!onComplete)
                    onComplete.call(null, jqXHR, textStatus, errorThrown);
            }
        });
    }

    var _queryDelete = function (url, data, onSuccess, onError, onComplete, persistObj) {
        jQuery.ajax({
            data: data || {},
            type: 'DELETE',
            url: url,
            success: function (response_data, textStatus, jqXHR) {
                if (!!onSuccess)
                    if (!!persistObj)
                        onSuccess.call(null, response_data, persistObj);
                    else
                        onSuccess.call(null, response_data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (!!onError)
                    onError.call(null, jqXHR);
            },
            complete: function (jqXHR, textStatus, errorThrown) {
                if (!!onComplete)
                    onComplete.call(null, jqXHR);
            }

        });
    };
    
    return {
        braintree_api: {
            setup: function (options, callback) {
                braintree.create(options, callback);
            }
        },
        braintree_service: {
            plan: function (params,data) {
                var url = PROFESSIONAL_PLAN_SERVICE;
                var ws_data = params;
                _queryGet(url, ws_data, data.success, data.error, data.complete, data)
            },
            customer: function (params, data) {
                var url = PROFESSIONAL_CUSTOMER_SERVICE;
                var ws_data = params;
		// CALL webservice get_client_token.py
                _queryGet(url, ws_data, data.success, data.error, data.complete, data)
            },
            create: function (params, data) {
                var url = PROFESSIONAL_SUBSCRIBE_SERVICE;
                var ws_data = params;
                ws_data.subscription_intent = 'buy';
                _queryPost(url, ws_data, data.success, data.error, data.complete, data)
            },
            update: function (params, data) {
                var url = PROFESSIONAL_SUBSCRIBE_SERVICE;
                var ws_data = params;
                ws_data.subscription_intent = 'update';
                _queryPost(url, ws_data, data.success, data.error, data.complete, data)
            },
            cancel: function (data) {
                var url = PROFESSIONAL_CANCEL_SERVICE;
                var ws_data = {};
                _queryPost(url, ws_data, data.success, data.error, data.complete, data)
            },
            get: function (params, data) {
                var url = PROFESSIONAL_SUBSCRIPTION_SERVICE;
                var ws_data = params;
                _queryGet(url, ws_data, data.success, data.error, data.complete, data)
            }
        }
 
    }





});