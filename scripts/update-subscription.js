require(["scripts/user/human-user-subscription"], function (user_subscription) {

    jQuery(document).ready(function (event) {

        "use strict";

        var MESSAGE_ERROR_CLASS = "error",
            MESSAGE_SUCCESS_CLASS = "success",
            MESSAGE_PLAIN_CLASS = "message-plain",
            form_notice = jQuery("#form_notice"),
            form_notice_throbber = jQuery("#form_notice_throbber"),
            form_notice_msg = jQuery("#form_notice_msg"),

            update_payment_info_form_div = jQuery("#update_payment_info_form_div"),
            update_payment_info_form = jQuery("#update_payment_info_form"),
            update_payment_info_form_yes_button = jQuery("#update_payment_info_form_yes_button"),
            update_payment_info_form_no_button = jQuery("#update_payment_info_form_no_button"),
            update_payment_method = jQuery("#update_payment_method");




        // Shows form message and throbber (optional)
        var showFormNotice = function (message, messageTypeClass, showThrobber) {
            if (showThrobber)
                form_notice_throbber.show();
            else
                form_notice_throbber.hide();
            form_notice_msg.html(message);

            form_notice.removeClass(MESSAGE_ERROR_CLASS + " " + MESSAGE_SUCCESS_CLASS + " " + MESSAGE_PLAIN_CLASS);
            if (messageTypeClass) {
                form_notice.addClass(messageTypeClass);
            }
            form_notice.show();
        };

        var setFormTitle = function (title) {
            form_title.text(title);
        };



        function init() {

            var events = {};

            events.complete = function (jqXHR, textStatus) {
                // do something
            };
            events.error = function (jqXHR, textStatus, errorThrown) {
		// do something
            };

            events.success = function (data, textStatus, jqXHR) {

                if (data && data.client_token) {

                    update_payment_method.empty();

                    var setup_data = {
                        authorization: data.client_token,
                        container: '#' + update_payment_method.attr('id'),
                        displayName: "BioDigital Inc.",
                        paypal: {
                            flow: 'vault',
                            buttonStyle: {
                                color: 'gold',
                                shape: 'rect',
                                size: 'responsive',
                                label: 'checkout'
                            }

                        }
                     };

                    var pay_button = document.querySelector('#' + update_payment_info_form_yes_button.attr('id'));
                    pay_button.setAttribute('disabled', true);

                    // Be sure to have PayPal's checkout.js library loaded on your page.
                    // <script src="https://www.paypalobjects.com/api/checkout.js" data-version-4></script>
                    // Create a client.
                    user_subscription.braintree_api.setup(setup_data,
                        function (createErr, instance) {
                            if (createErr) {
                                // An error in the create call is likely due to
                                // incorrect configuration values or network issues.
                                // An appropriate error will be shown in the UI.
                                console.log("createErr: ", createErr);
                                showFormNotice("An error occurred initializing your payment options:  " + createErr.message, false);
                                return;
                            }
                            console.log("payment options initilized: ", instance);

                            pay_button.addEventListener('click', function () {
                                console.log("IN pay_button.addEventListener('click')");

                                instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {

                                    console.log("requestPaymentMethod requestPaymentMethodErr: ", requestPaymentMethodErr);
                                    console.log("requestPaymentMethod payload: ", payload);

                                    if (requestPaymentMethodErr) {
                                        // No payment method is available.
                                        // An appropriate error will be shown in the UI.
                                        console.log("requestPaymentMethodErr: ", requestPaymentMethodErr);
                                        showFormNotice("An error occurred retrieving your payment info:  " + requestPaymentMethodErr.message, false);
                                        return;
                                    }

                                    // Submit payload.nonce to your server
                                    console.log("Submit payload.nonce to your server: ", payload);
                                    if (payload && payload.nonce) {
                                        update_subscription(payload.nonce);
                                    }
                                    else {
                                        showFormNotice("Sorry, we encountered an issue processing your payment.  Please try again or contact us at support@biodigital.com for further assistance.", false);
                                    }
                                });
                            })

                            if (instance.isPaymentMethodRequestable()) {
                                // This will be true if you generated the client token
                                // with a customer ID and there is a saved payment method
                                // available to tokenize with that customer.
                                pay_button.removeAttribute('disabled');
                            }

                            instance.on('paymentMethodRequestable', function (event) {
                                console.log("paymentMethodRequestable event.type: ", event.type); // The type of Payment Method, e.g 'CreditCard', 'PayPalAccount'.
                                console.log("paymentMethodRequestable event.paymentMethodIsSelected: ", event.paymentMethodIsSelected); // true if a customer has selected a payment method when paymentMethodRequestable fires

                                if (event.paymentMethodIsSelected) {
                                    pay_button.removeAttribute('disabled');
                                }
                                else {
                                    pay_button.setAttribute('disabled', true);
                                }
                            });


                            instance.on('paymentOptionSelected', function (event) {
                                console.log("paymentOptionSelected event: ", event); 

                                //if (event.paymentMethodIsSelected) {
                                //    pay_button.removeAttribute('disabled');
                                //}
                                //else {
                                //    pay_button.setAttribute('disabled', true);
                                //}
                            });

                            instance.on('noPaymentMethodRequestable', function () {
                                console.log("noPaymentMethodRequestable");
                                pay_button.setAttribute('disabled', true);
                            });

                        });
                }
                else {
                    showFormNotice("Sorry!  We encountered an issue initializing your payment options.  Please try again or contact us at support@biodigital.com for further assistance.", false);
                }
            };

	    // get client token based on current user
	    // CALL webservice get_client_token.py
            user_subscription.braintree_service.customer(null, events);
        }

        jQuery(document).ready(init);

    });


});
