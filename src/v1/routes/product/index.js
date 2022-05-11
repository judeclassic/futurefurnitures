//@ts-check

const router = ({ ProductController, Router, Authenticate, Product, User, EmailHandler, messages, bcrypt, jwt }) => {

    const productController = new ProductController({ Product, User, EmailHandler, messages, bcrypt, jwt });
    const { verifySellerToken } = new Authenticate({ jwt, bcrypt });

    const productRouter = Router();

    //   FOR SELLER
    // Create Product
    productRouter.post('/create', verifySellerToken(), productController.createProduct());

    // Update Product
    productRouter.put('/update/:id', verifySellerToken(), productController.updateProduct());

    // Delete Product
    productRouter.delete('/delete/:id', verifySellerToken(), productController.deleteProduct());
    // END FOR SELLER


    // Get All Products
    productRouter.get('/getAll', productController.getAllProducts() );

    // Get Product By Id
    productRouter.get('/getById/:id', productController.getProductById() );

    // Get Product By Category
    productRouter.get('/getByCategory/:category', productController.getProductByCategory() );

    // Get Product By SubCategory
    productRouter.get('/getBySubCategory/:subCategory', productController.getProductBySubCategory() );

    // Get Product By Search
    productRouter.get('/getBySearch/:search', productController.getProductBySearch() );

    // Get Product By Search And Category
    productRouter.get('/getBySearchAndCategory/:search/:category', productController.getProductBySearchAndCategory() );

    // Get Product By Search And SubCategory
    productRouter.get('/getBySearchAndSubCategory/:search/:subCategory', productController.getProductBySearchAndSubCategory() );

    // Get Product By Search And Category And SubCategory
    productRouter.get('/getBySearchAndCategoryAndSubCategory/:search/:category/:subCategory', productController.getProductBySearchAndCategoryAndSubCategory() );

    // Get Product By SellerId
    productRouter.get('/getBySellerId/:sellerId', productController.getProductBySellerId() );

    // Get Product By SellerId And Search
    productRouter.get('/getBySellerIdAndSearch/:sellerId/:search', productController.getProductBySellerIdAndSearch() );

    // Get Product By SellerId And Category
    productRouter.get('/getBySellerIdAndCategory/:sellerId/:category', productController.getProductBySellerIdAndCategory() );

    // Get Product By SellerId And SubCategory
    productRouter.get('/getBySellerIdAndSubCategory/:sellerId/:subCategory', productController.getProductBySellerIdAndSubCategory() );

    // Get Product By Brand
    productRouter.get('/getByBrand/:brand', productController.getProductByBrand() );

    // Get Product By Price
    productRouter.get('/getByPrice/:minPrice/:maxPrice', productController.getProductByPrice() );

    // Get Product By Color
    productRouter.get('/getByColor/:color', productController.getProductByColor() );

    // Get Product By Size
    productRouter.get('/getBySize/:size', productController.getProductBySize() );

    // Get Product By Discount
    productRouter.get('/getByDiscount/:minDiscount/:maxDiscount', productController.getProductByDiscount() );

    // Get Product By Rating
    productRouter.get('/getByRating/:minRating/:maxRating', productController.getProductByRating() );

    return productRouter;
}


export default router;