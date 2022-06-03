//@ts-check

const router = ({ Router, UserController, Seller, SellerProduct, Authenticate, EmailHandler, bcrypt, jwt, uploader, Product }) => {
    const router = Router();

    const userController = new UserController({ Seller, EmailHandler, SellerProduct, Product, bcrypt, jwt });
    const { verifySellerToken } = new Authenticate({ Seller, bcrypt, jwt });

    // Seller Login
    router.post(
        "/signIn",
        userController.loginSeller()
    );

    // Seller Signup
    router.post(
        "/signUp",
        userController.registerSeller()
    );

    // Seller Profile
    router.get(
        "/profile/:id",
         verifySellerToken(),
        userController.getSellerProfile()
    );

    // Seller Profile Update
    router.put(
        "/profile",
         verifySellerToken(),
        userController.updateSellerProfile()
    );

    // Seller Profile Update
    router.put(
        "/profile/password",
         verifySellerToken(),
        userController.updateSellerPassword()
    );

    // Seller Profile Update
    router.put(
        "/profile/email",
         verifySellerToken(),
        userController.updateSellerEmail()
    );

    // Seller Profile Update
    router.put(
        "/profile/phone",
         verifySellerToken(),
        userController.updateSellerPhone()
    );

    // Seller Profile Update
    router.put(
        "/profile/address",
         verifySellerToken(),
        userController.updateSellerAddress()
    );

    // Update Seller Profile Image
    router.put(
        "/profile/image",
         verifySellerToken(),
        uploader,
        userController.updateSellerImage()
    );

    // Send Verification Email
    router.post(
        "/verifyEmailByCodeRequest",
         verifySellerToken(),
        userController.sendVerificationEmail()
    );

    // Verify Email
    router.post(
        "/confirmEmailVerificationCode",
        userController.verifySellerEmail()
    );

    // Load All Sellers
    router.get(
        "/all",
        userController.loadAllSellers()
    );

    // View Cart
    router.get(
        "/cart",
        verifySellerToken(),
        userController.getCartData()
    );

    // Add To Cart
    router.post(
        "/cart/:productId",
        verifySellerToken(),
        userController.saveProductInCart()
    );

    // Remove From Cart
    router.delete(
        "/cart/:productId",
        verifySellerToken(),
        userController.removeProductFromCart()
    );

    

    // Get Transaction By SellerId
    // router.get(
    //     "/transactions/:sellerId/:id",
    //      verifySellerToken(),
    //     userController.getTransactionsBySellerId()
    // );

    // // Get Transaction By SellerId
    // router.get(
    //     "/transactions/:sellerId",
    //      verifySellerToken(),
    //     userController.getTransactionsBySellerId()
    // );


    return router;
}

export default router;