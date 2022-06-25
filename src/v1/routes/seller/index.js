//@ts-check

const router = ({ Router, SellerController, User, SellerProduct, Order, Authenticate, EmailHandler, bcrypt, jwt, productUploader, userUploader}) => {
    const router = Router();

    const sellerController = new SellerController({ Seller: User, EmailHandler, SellerProduct, Order, bcrypt, jwt, });
    const { clickVerification, verifySellerToken } = new Authenticate({ Seller: User, bcrypt, jwt });

    // Seller Login
    router.post( "/signIn", sellerController.loginSeller() );

    // Seller Signup
    router.post("/signUp", sellerController.registerSeller() );

    router.get( "/details/:id", sellerController.getSellerProfile() );

    // Seller Profile
    router.get( "/profile/:id", verifySellerToken(), sellerController.getSellerProfile() );

    // Seller Profile Update
    router.put( "/profile", verifySellerToken(), sellerController.updateSellerProfile() );

    // Seller Profile Update
    router.put( "/profile/password", verifySellerToken(), sellerController.updateSellerPassword() );

    // Seller Profile Update
    router.put( "/profile/email", verifySellerToken(), sellerController.updateSellerEmail() );

    // Seller Profile Update
    router.put( "/profile/phone", verifySellerToken(), sellerController.updateSellerPhone() );

    // Seller Profile Update
    router.put( "/profile/address", verifySellerToken(), sellerController.updateSellerAddress() );

    // Update Seller Profile Image
    router.put( "/profile/image", verifySellerToken(), userUploader, sellerController.updateSellerImage() );

    // Send Verification Email
    router.post( "/verifyEmailByCodeRequest", verifySellerToken(), sellerController.sendVerificationEmail() );

    // Verify Email
    router.post( "/confirmEmailVerificationCode", sellerController.verifySellerEmail() );

    // Load All Sellers
    router.get( "/all", sellerController.loadAllSellers() );
    

    // Get Single Seller Data
    // router.get(
    //     "/:id",
    //     sellerController.getSingleSellerData()
    // );

    // // Edit Single Seller Data
    // router.put(
    //     "/:id",
    //     sellerController.editSingleSellerData()
    // );



    // Create Product
    router.post( "/product", verifySellerToken(), productUploader, sellerController.createProduct() );

    // Get All Products
    router.get( "/products", sellerController.getAllProducts() );

    // Get All Products
    router.get( "/products/top", sellerController.getTopPicksProduct() );

    // Get Product
    router.get( "/product/:id", sellerController.getSingleProduct() );

    // Get Product
    router.get( "/productBySeller/:sellerId", sellerController.getSellerProduct() );

    // Update Product
    router.put( "/product/:id", verifySellerToken(), productUploader, sellerController.updateSellerProduct() );

    // Update Image
    router.put( "/product/image/:id", verifySellerToken(), productUploader, sellerController.updateSellerProductImage() );

    // Delete Product
    router.delete( "/product/:id", verifySellerToken(), sellerController.deleteSellerProduct() );


    // LISTINGS

    // Save Product As Active
    router.put( '/product/saveasactive/:id', verifySellerToken(), sellerController.saveProductAsActive() );

    // Get Seller Active Products
    router.get( "/products/active/:sellerId", verifySellerToken(), sellerController.getSellerActiveProducts() );

    // Save Product As Draft
    router.put( "/product/saveasdraft/:id", verifySellerToken(), sellerController.saveProductAsDraft() );

    // Get Seller Drafted Products
    router.get( "/products/drafted/:sellerId", verifySellerToken(), sellerController.getSellerDraftedProducts() );

    // Save Product As Closed
    router.put( "/product/saveasclosed/:id", verifySellerToken(), sellerController.saveProductAsClosed() );

    // Get Seller Drafted Products
    router.get( "/products/closed/:sellerId", verifySellerToken(), sellerController.getSellerClosedProducts() );

    // FOR ORDERS

    // Order Product 
    router.post( "/order/product", verifySellerToken(), sellerController.createOrder() );


    // Mark Product as Pending
    router.put( "/order/pending/:id", verifySellerToken(), sellerController.markOrderAsPending() );

    // Get Seller Pending Products
    router.get( "/order/pending/:sellerId", verifySellerToken(), sellerController.getSellerPendingOrders() );

    // Mark Product as Expected
    router.put( "/order/expected/:id", verifySellerToken(), sellerController.markOrderAsExpected() );

    // Get Seller Expected Products
    router.get( "/order/expected/:sellerId", verifySellerToken(), sellerController.getSellerExpectedOrders() );

    // Mark Product as Available
    router.put( "/order/available/:id", verifySellerToken(), sellerController.markOrderAsAvailable() );

    // Get Seller Available Products
    router.get( "/order/available/:sellerId", verifySellerToken(), sellerController.getSellerAvailableOrders() );

    // FOR BUYERS

    // Buy Products For Buyers
    router.post( "/product/buy/:id", verifySellerToken(), sellerController.buyProducts() );

    // Save Product For Buyers
    router.put( "/product/saveforbuyers/:id", verifySellerToken(), sellerController.saveProductForBuyers() );

    // View Saved Product For Buyers
    router.get( "/products/saved/:id", verifySellerToken(), sellerController.getSavedProducts() );


    return router;
}

export default router;