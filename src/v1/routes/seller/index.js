//@ts-check

const router = ({ Router, SellerController, Seller, SellerProduct, Authenticate, EmailHandler, bcrypt, jwt, productUploader, userUploader}) => {
    const router = Router();

    const sellerController = new SellerController({ Seller, EmailHandler, SellerProduct, bcrypt, jwt, });
    const { clickVerification, verifySellerToken } = new Authenticate({ Seller, bcrypt, jwt });

    // Seller Login
    router.post(
        "/signIn",
        sellerController.loginSeller()
    );

    // Seller Signup
    router.post(
        "/signUp",
        sellerController.registerSeller()
    );

    // Seller Profile
    router.get(
        "/profile/:id",
        verifySellerToken(),
        sellerController.getSellerProfile()
    );

    // Seller Profile Update
    router.put(
        "/profile",
        verifySellerToken(),
        sellerController.updateSellerProfile()
    );

    // Seller Profile Update
    router.put(
        "/profile/password",
        verifySellerToken(),
        sellerController.updateSellerPassword()
    );

    // Seller Profile Update
    router.put(
        "/profile/email",
        verifySellerToken(),
        sellerController.updateSellerEmail()
    );

    // Seller Profile Update
    router.put(
        "/profile/phone",
        verifySellerToken(),
        sellerController.updateSellerPhone()
    );

    // Seller Profile Update
    router.put(
        "/profile/address",
        verifySellerToken(),
        sellerController.updateSellerAddress()
    );

    // Update Seller Profile Image
    router.put(
        "/profile/image",
        verifySellerToken(),
        userUploader,
        sellerController.updateSellerImage()
    );

    // Send Verification Email
    router.post(
        "/verifyEmailByCodeRequest",
        verifySellerToken(),
        sellerController.sendVerificationEmail()
    );

    // Verify Email
    router.post(
        "/confirmEmailVerificationCode",
        sellerController.verifySellerEmail()
    );

    // Load All Sellers
    router.get(
        "/all",
        sellerController.loadAllSellers()
    );

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
    router.post(
        "/product",
        verifySellerToken(),
        productUploader,
        sellerController.createProduct()
    );

    // Get All Products
    router.get(
        "/products",
        sellerController.getAllProducts()
    );

    // Get All Products
    router.get(
        "/products/top",
        sellerController.getTopPicksProduct()
    );

    // Get Product
    router.get(
        "/product/:id",
        sellerController.getSellerProduct()
    );

    // Update Product
    router.put(
        "/product/:id",
        verifySellerToken(),
        productUploader,
        sellerController.updateSellerProduct()
    );

    // Update Image
    router.put(
        "/product/image/:id",
        verifySellerToken(),
        productUploader,
        sellerController.updateSellerProductImage()
    );

    // Delete Product
    router.delete(
        "/product/:id",
        verifySellerToken(),
        sellerController.deleteSellerProduct()
    );

    // Mark Product as Sold
    router.put(
        "/product/sold/:id",
        verifySellerToken(),
        sellerController.markProductAsSold()
    );

    // Get Seller Sold Products
    router.get(
        "/products/sold/:sellerId",
        verifySellerToken(),
        sellerController.getSellerSoldProducts()
    );

    // Get Seller Ordered Products
    router.get(
        "/products/ordered/:sellerId",
        verifySellerToken(),
        sellerController.getSellerOrderedProducts()
    );

    // Get Seller Pending Products
    router.get(
        "/products/pending/:id",
        verifySellerToken(),
        sellerController.getSellerPendingProducts()
    );

    // Save Product As Active
    router.put(
        '/product/saveasactive/:id',
        verifySellerToken(),
        sellerController.saveProductAsActive()
    )

    // Get Seller Active Products
    router.get(
        "/products/active/:id",
        verifySellerToken(),
        sellerController.getSellerActiveProducts()
    );

    // Save Product As Draft
    router.put(
        "/product/saveasdraft/:id",
        verifySellerToken(),
        sellerController.saveProductAsDraft()
    );

    // Get Seller Drafted Products
    router.get(
        "/products/drafted/:id",
        verifySellerToken(),
        sellerController.getSellerDraftedProducts()
    );

    // FOR BUYERS

    // Buy Products For Buyers
    router.post(
        "/product/buy/:id",
        verifySellerToken(),
        sellerController.buyProducts()
    );

    // Save Product For Buyers
    router.put(
        "/product/saveforbuyers/:id",
        verifySellerToken(),
        sellerController.saveProductForBuyers()
    );

    // View Saved Product For Buyers
    router.get(
        "/products/saved/:id",
        verifySellerToken(),
        sellerController.getSavedProducts()
    );

    

    // Get Transaction By SellerId
    // router.get(
    //     "/transactions/:sellerId/:id",
    //     verifySellerToken(),
    //     sellerController.getTransactionsBySellerId()
    // );

    // // Get Transaction By SellerId
    // router.get(
    //     "/transactions/:sellerId",
    //     verifySellerToken(),
    //     sellerController.getTransactionsBySellerId()
    // );


    return router;
}

export default router;