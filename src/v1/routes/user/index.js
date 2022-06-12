//@ts-check

const router = ({ Router, UserController, Seller, SellerProduct, Authenticate, EmailHandler, bcrypt, jwt, userUploader, Product }) => {
    const router = Router();

    const userController = new UserController({ User: Seller, EmailHandler, UserProduct: SellerProduct, Product, bcrypt, jwt });
    const { verifyUserToken } = new Authenticate({ User: Seller, bcrypt, jwt });

    // User Login
    router.post(
        "/signIn",
        userController.loginUser()
    );

    // User Signup
    router.post(
        "/signUp",
        userController.registerUser()
    );

    // User Profile
    router.get(
        "/profile/:id",
         verifyUserToken(),
        userController.getUserProfile()
    );

    // User Profile Update
    router.put(
        "/profile",
         verifyUserToken(),
        userController.updateUserProfile()
    );

    // User Profile Update
    router.put(
        "/profile/password",
         verifyUserToken(),
        userController.updateUserPassword()
    );

    // User Profile Update
    router.put(
        "/profile/email",
         verifyUserToken(),
        userController.updateUserEmail()
    );

    // User Profile Update
    router.put(
        "/profile/phone",
         verifyUserToken(),
        userController.updateUserPhone()
    );

    // User Profile Update
    router.put(
        "/profile/address",
         verifyUserToken(),
        userController.updateUserAddress()
    );

    // Update User Profile Image
    router.put(
        "/profile/image",
         verifyUserToken(),
         userUploader,
        userController.updateUserImage()
    );

    // Send Verification Email
    router.post(
        "/verifyEmailByCodeRequest",
         verifyUserToken(),
        userController.sendVerificationEmail()
    );

    // Verify Email
    router.post(
        "/confirmEmailVerificationCode",
        userController.verifyUserEmail()
    );

    // Load All Users
    router.get(
        "/all",
        userController.loadAllUsers()
    );

    // View Cart
    router.get(
        "/cart",
        verifyUserToken(),
        userController.getCartData()
    );

    // Add To Cart
    router.post(
        "/cart/:productId",
        verifyUserToken(),
        userController.saveProductInCart()
    );

    // Remove From Cart
    router.delete(
        "/cart/:productId",
        verifyUserToken(),
        userController.removeProductFromCart()
    );

    

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