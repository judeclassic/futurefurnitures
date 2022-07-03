//@ts-check

const router = ({ Router, UserController, User, SellerProduct, Authenticate, EmailHandler, bcrypt, jwt, userUploader, Product }) => {
    const router = Router();

    const userController = new UserController({ User, EmailHandler, UserProduct: SellerProduct, Product, bcrypt, jwt });
    const { verifyUserToken } = new Authenticate({ User, bcrypt, jwt });

    // User Login
    router.post("/signIn", userController.loginUser() );

    // User Signup
    router.post( "/signUp", userController.registerUser() );

    // User Profile
    router.get( "/profile/:id", verifyUserToken(), userController.getUserProfile() );

    // User Profile Update
    router.put( "/profile", verifyUserToken(), userController.updateUserProfile() );

    // User Profile Update
    router.put( "/profile/password", verifyUserToken(), userController.updateUserPassword() );

    // User Profile Update
    router.put( "/profile/email", verifyUserToken(), userController.updateUserEmail() );

    // User Profile Update
    router.put( "/profile/phone", verifyUserToken(), userController.updateUserPhone() );

    // User Profile Update
    router.put( "/profile/address", verifyUserToken(), userController.updateUserAddress() );

    // Update User Profile Image
    router.put( "/profile/image", verifyUserToken(), userUploader, userController.updateUserImage() );

    // Send Verification Email
    router.post( "/verifyEmailByCodeRequest", verifyUserToken(), userController.sendVerificationEmail() );

    // Verify Email
    router.post( "/confirmEmailVerificationCode", userController.verifyUserEmail() );

    // Load All Users
    router.get( "/all", userController.loadAllUsers() );


    // FOR CART AND SAVED PRODUCTS
    // View Cart
    router.get( "/cart", verifyUserToken(), userController.getCartData() );

    // Add To Cart
    router.post( "/cart",  verifyUserToken(), userController.saveProductInCart() );

    // Remove From Cart
    router.delete( "/cart/", verifyUserToken(),  userController.removeProductFromCart() );

    // Get Saved Products
    router.get( "/savedProducts", verifyUserToken(), userController.getSavedProducts() );

    // Move Products From Cart To Saved
    router.post( "/movedToSaved/:productId", verifyUserToken(), userController.moveProductToCart() );

    // Move Products From Saved To Cart
    router.post( "/movedToCart/:productId", verifyUserToken(), userController.moveProductToCart() );


    // FOR SHIPPING INFO
    // Add To Shipping Information
    router.post( "/shippingInfo", verifyUserToken(), userController.createShippingInfo() );

    // Update  Shipping Information
    router.put( "/shippingInfo/:id",  verifyUserToken(), userController.updateShippingInfo() );

    // get all Shipping Information
    router.get( "/shippingInfo/:id", verifyUserToken(), userController.getShippingInfo() );

    // Delete  Shipping Information
    router.delete( "/shippingInfo/:id", verifyUserToken(), userController.deleteShippingInfo() );


    // FOR CARD
    router.post('/profile/card', verifyUserToken(), userController.addPaymentCard());

    router.get('/profile/card', verifyUserToken(), userController.retrievePaymentCard());

    router.put('/profile/card', verifyUserToken(), userController.updatePaymentCard());

    router.delete('/profile/card', verifyUserToken(), userController.removePaymentCard());

    //FOR PAYPAL
    router.post('/profile/paypal', verifyUserToken(), userController.addWithPaypal());

    router.put('/profile/paypal', verifyUserToken(), userController.updateWithPaypal());

    router.delete('/profile/paypal', verifyUserToken(), userController.removeWithPaypal());

    //FOR PAYONEER
    router.post('/profile/payoneer', verifyUserToken(), userController.addWithPayoneer());

    router.put('/profile/payoneer', verifyUserToken(), userController.updateWithPayoneer());

    router.delete('/profile/payoneer', verifyUserToken(), userController.removeWithPayoneer());
    


    

    // Get Transaction By UserId
    // router.get(
    //     "/transactions/:sellerId/:id",
    //      verifyUserToken(),
    //     userController.getTransactionsByUserId()
    // );

    // // Get Transaction By UserId
    // router.get(
    //     "/transactions/:sellerId",
    //      verifyUserToken(),
    //     userController.getTransactionsByUserId()
    // );


    return router;
}

export default router;