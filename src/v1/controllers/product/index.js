//@ts-check

class SellerController {
    constructor({ Product, EmailHandler, messages }) {
        this.Product = Product;
        this.EmailHandler = EmailHandler;
        this.messages = messages;
    }

    create = () => {
        return (req, res) => {
            const run = async () => {
                const image = req.files.map(file => file.imagePath);
                try{
                    const {
                        name,
                        description,
                        price,
                        discount,
                        color,
                        size,
                        dimensions,
                        weight,
                        seller,
                        currectPrice,
                        asset_3d_baseurl,
                        quantity,
                        brand,
                        location,
                        category,
                        subCategory,
                        productType,
                        featured,
                        status,
                        isVerified,
                        isActive,
                    } = req.body;

                    const product = new this.Product({
                        name,
                        description,
                        image,
                        price,
                        discount,
                        color,
                        size,
                        dimensions,
                        weight,
                        seller,
                        currectPrice,
                        asset_3d_baseurl,
                        quantity,
                        brand,
                        location,
                        category,
                        subCategory,
                        productType,
                        featured,
                        createDate: new Date,
                        updateDate: new Date,
                        status,
                        isDeleted: isVerified || false,
                        isVerified: false,
                        isActive,
                    });

                    await product.save();
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "SUCCESSFULLY UPLOADED",
                        products: product,
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: error.message,
                    });
                }
            }

            return run();
        }
    }

    createProduct = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const {
                        name,
                        description,
                        price,
                        discount,
                        color,
                        size,
                        dimensions,
                        weight,
                        seller,
                        currectPrice,
                        asset_3d_baseurl,
                        quantity,
                        brand,
                        category,
                        subCategory,
                        productType,
                        featured,
                        status,
                        isVerified,
                        isActive,
                    } = req.body;

                    const location = req.body.location
                        && typeof (req.body.location) === "string"
                        ? JSON.parse(req.body.location)
                        : req.body.location;

                    const product = new this.Product({
                        name,
                        description,
                        price,
                        discount,
                        color,
                        size,
                        dimensions,
                        weight,
                        seller,
                        currectPrice,
                        asset_3d_baseurl,
                        quantity,
                        brand,
                        location,
                        category,
                        subCategory,
                        productType,
                        featured,
                        createDate: new Date,
                        updateDate: new Date,
                        status,
                        isDeleted: isVerified || false,
                        isVerified: false,
                        isActive,
                    });

                    await product.save();
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "SUCCESSFULLY UPLOADED",
                        products: product,
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: error.message,
                    });
                }
            }

            return run();
        }
    }

    createVariant = () => {
        return (req, res) => {
            const run = async () => {
                const image = req.files.map(file => file.imagePath);

                try{
                    const {
                        name,
                        price,
                        color,
                        quantity,
                    } = req.body;

                    const product = await this.Product.findByIdAndUpdate(
                        req.params.id,
                        {
                            $push: {
                                variants: {
                                    name,
                                    quantity,
                                    color,
                                    image,
                                    price,
                                },
                                image,
                            }
                        },
                        { new: true });

                   if (!product) {
                        return res.status(200).json({
                            status: false,
                            code: 403,
                            message: "PRODUCT NOT FOUND",
                        });
                   }
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "VARIANT ADDED SUCCESSFULLY",
                        products: product,
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({
                        status: false,
                        code: 403,
                        message: error.message,
                    });
                }
            }

            return run();
        }
    }

    updateVariant = () => {
        return (req, res) => {
            const run = async () => {
                const image = req.files.map(file => file.imagePath);
                
                try{
                    const {
                        variantId,
                    } = req.body;

                    const product = await this.Product.findById(req.params.id);

                    if (!product) {
                        return res.status(200).json({
                            status: false,
                            code: 403,
                            message: "PRODUCT NOT FOUND",
                        });
                    }
                    product.variants = product.variants.map((variant) => {
                        if (variant.id === variantId) {
                            variant = {...variant, ...req.body}
                        }
                        return variant;
                    });

                    await product.save();

                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "VARIANT UPDATED SUCCESSFULLY",
                        products: product,
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({
                        status: false,
                        code: 403,
                        message: error.message,
                    });
                }
            }

            return run();
        }
    }

    updateProduct = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    
                    const product = await this.Product.findByIdAndUpdate(id, req.body, { new: true });
                    this.EmailHandler.sendSellerEmail({product});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        product: product,
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                    });
                }
            }

            return run();
        }
    }

    deleteProduct = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const product = await this.Product.findByIdAndDelete(id);
                    if (!product) {
                        return res.status(200).json({
                            status: false,
                            message: "Product do not exist or have already been deleted",
                            code: 201,
                        });
                    }
                    this.EmailHandler.sendSellerEmail({product});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product deleted successfully",
                        product: product,
                    });
                } catch {
                    return res.status(200).json({
                        status: true,
                        message: "Unable to delete Product",
                        code: 500,
                    });
                }
            }

            return run();
        }
    }

    getSellerProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.find({ seller: id });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        product: products,
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                    });
                }
            }

            return run();
        }
    }

    getSellerSoldProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.find({ seller: id, status: 'sold' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        products: products,
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal Server Error",
                    });
                }
            }

            return run();
        }
    }

    getSellerOrderedProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.find({ seller: id, status: 'ordered' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        products: products,
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal Server Error",
                    });
                }
            }

            return run();
        }
    }

}





export default class ProductController extends SellerController {

    constructor({ Product, User, EmailHandler, messages, bcrypt, jwt }) {
        super({ Product, EmailHandler, messages });

        this.Product = Product;
        this.User = User;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
    }

    getAllProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({ isDeleted: false });
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                } catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            return run();
        }
    }

    getProductById() {
        return (req, res) => {
            const run = async () => {
                try {
                    const product = await this.Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
                    if (!product) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }

                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product fetched successfully",
                        product,
                    });
                } catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            return run();
        }
    }

    getSimilarProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const limit = req.query.limit || 10;
                    const ids = req.params.ids;
                    console.log(ids);
                    const products = await this.Product.find({ _id: { $in: ids } });
                    const similarProducts = [];
                    products.forEach(product => {
                        if (product.isDeleted) {
                            return;
                        }
                        if (similarProducts.length >= limit) {
                            return;
                        }
                        let similarProduct = this.Product.find({
                            _id: { $ne: product._id },
                            category: product.category,
                            isDeleted: false,
                        }).limit((limit / ids.length).toFixed(0));
                        similarProducts.push(similarProduct);
                    });
                    const similarProductsArray = await Promise.all(similarProducts);

                    const similarProductsArrayFlat = similarProductsArray.reduce((acc, curr) => acc.concat(curr), []);
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Similar products fetched successfully",
                        products: similarProductsArrayFlat,
                    });
                }
                catch (error) {
                    console.log(error);
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            return run();
        }
    }

    getFeaturedProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({ featured: true });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Featured products fetched successfully",
                        products: products,
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                    });
                }
            }

            return run();
        }
    }

    getTopRatedProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({ rating: { $gt: 3.5 } });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Top rated products fetched successfully",
                        products: products,
                    });
                }
                catch (error) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                    });
                }
            }

            return run();
        }
    }

    getTopOfferredProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find().sort({ views: -1 });
                    return res.json({
                        status: true,
                        code: 200,
                        message: "Top offered products fetched successfully",
                        products
                    });
                }
                catch (error) {
                    console.log(error);
                    return res.json({
                        status: true,
                        code: 500,
                        message: error,
                    });
                }
            }

            run();
        }
    }

    getProductByCategory() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        category: req.params.category,
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });

                    products.forEach(async (product) => {
                        product.views += 1;
                        await product.save();
                    });
                } catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySubCategory() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        subCategory: req.params.subCategory,
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 403,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });;

                    products.forEach(async (product) => {
                        product.views += 1;
                        await product.save();
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductByProductType() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        productType: req.params.productType,
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 403,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });;

                    products.forEach(async (product) => {
                        product.views += 1;
                        await product.save();
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }
    
    getProductBySearch() {
        return (req, res) => {
            const run = async () => {
                console.log('yes')
                try {
                    const products = await this.Product.find({
                        $or: [
                            { name: { $regex: req.params.search, $options: 'i' } },
                            { category: { $regex: req.params.search, $options: 'i' } },
                            { subCategory: { $regex: req.params.search, $options: 'i' } },
                        ],
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductByBrand() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        brand: req.params.brand,
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductByPrice() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        price: { $gte: req.params.minPrice, $lte: req.params.maxPrice },
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductByDiscount() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        discount: { $gte: req.params.minDiscount, $lte: req.params.maxDiscount },
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductByRating() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        isDeleted: false,
                    });
                    const { minRating, maxRating } = req.params;
                    const filteredProducts = products.filter((data)=>{data.rating.average > minRating && data.rating.average < maxRating});
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products: filteredProducts,
                    });
                }
                catch (error) {
                    console.log(error)
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductByColor() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        color: { $in: req.params.color },
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySize() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        size: { $in: req.params.size },
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySellerId() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        userId: req.params.userId,
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySellerEmail() {
        return (req, res) => {
            const run = async () => {
                try {
                    const user = await this.User.findOne({ email: req.params.email });
                    const products = await this.Product.find({
                        userId: user._id,
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySearchAndCategory() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        category: req.params.category,
                        $or: [
                            { name: { $regex: req.params.search, $options: 'i' } },
                            { category: { $regex: req.params.search, $options: 'i' } },
                            { subCategory: { $regex: req.params.search, $options: 'i' } },
                        ],
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }


    getProductBySearchAndSubCategory() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        subCategory: req.params.subCategory,
                        $or: [
                            { name: { $regex: req.params.search, $options: 'i' } },
                            { category: { $regex: req.params.search, $options: 'i' } },
                            { subCategory: { $regex: req.params.search, $options: 'i' } },
                        ],
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySearchAndCategoryAndSubCategory() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        category: req.params.category,
                        subCategory: req.params.subCategory,
                        $or: [
                            { name: { $regex: req.params.search, $options: 'i' } },
                            { category: { $regex: req.params.search, $options: 'i' } },
                            { subCategory: { $regex: req.params.search, $options: 'i' } },
                        ],
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySellerIdAndCategory() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        userId: req.params.userId,
                        category: req.params.category,
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySellerIdAndSubCategory() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        userId: req.params.userId,
                        subCategory: req.params.subCategory,
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySellerIdAndSearch() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        userId: req.params.userId,
                        $or: [
                            { name: { $regex: req.params.search, $options: 'i' } },
                            { category: { $regex: req.params.search, $options: 'i' } },
                            { subCategory: { $regex: req.params.search, $options: 'i' } },
                        ],
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySellerIdAndCategoryAndSearch() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        userId: req.params.userId,
                        category: req.params.category,
                        $or: [
                            { name: { $regex: req.params.search, $options: 'i' } },
                            { category: { $regex: req.params.search, $options: 'i' } },
                            { subCategory: { $regex: req.params.search, $options: 'i' } },
                        ],
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySellerIdAndSubCategoryAndSearch() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        userId: req.params.userId,
                        subCategory: req.params.subCategory,
                        $or: [
                            { name: { $regex: req.params.search, $options: 'i' } },
                            { category: { $regex: req.params.search, $options: 'i' } },
                            { subCategory: { $regex: req.params.search, $options: 'i' } },
                        ],
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySellerIdAndCategoryAndSubCategory() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        userId: req.params.userId,
                        category: req.params.category,
                        subCategory: req.params.subCategory,
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getProductBySellerIdAndCategoryAndSubCategoryAndSearch() {
        return (req, res) => {
            const run = async () => {
                try {
                    const products = await this.Product.find({
                        userId: req.params.userId,
                        category: req.params.category,
                        subCategory: req.params.subCategory,
                        $or: [
                            { name: { $regex: req.params.search, $options: 'i' } },
                            { category: { $regex: req.params.search, $options: 'i' } },
                            { subCategory: { $regex: req.params.search, $options: 'i' } },
                        ],
                        isDeleted: false,
                    });
                    if (products === []) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    rateProduct() {
        return (req, res) => {
            const run = async () => {
                try {
                    const product = await this.Product.findById(req.params.productId);
                    if (product === null) {
                        return res.status(200).json({
                            status: false,
                            message: "Product not found",
                            code: 201,
                        });
                    }
                    const newRating = {
                        userId: req.params.userId,
                        rating: req.body.rating,
                        comment: req.body.comment,
                    }
                    product.ratings.push(newRating);
                    product.save();
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product rated successfully",
                    });
                }
                catch (error) {
                    res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }
    
}