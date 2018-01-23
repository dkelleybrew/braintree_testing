class ProfessionalCustomerHandler( controllers.ProfessionalBioDigitalUserHandler ):

    ROUTE = posixpath.join( __ROUTE_PREFIX__, "customer" )

    @controllers.BaseHandler.try_this
    @controllers.ProfessionalBioDigitalUserHandler.user_is_signed_in
    def get( self ):              

        with models.session_scope() as session:

            user = self.get_user(session)
            customer_id = self.get_customer_id(session, user = user)
            client_token = None
            try:
                client_token = braintree.ClientToken.generate({
                    "customer_id": customer_id
                })
            except:
                client_token = braintree.ClientToken.generate()

            json = {
                "client_token": client_token
            }
            self.write( json )