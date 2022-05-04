

class SellerController {
    constructor({ Product, EmailHandler, messages }) {
        this.Product = Product;
        this.EmailHandler = EmailHandler;
        this.messages = messages;
    }

    createProduct = () => {
        return (req, res) => {
            console.log('yeah');
            const run = async () => {
                console.log('yes boss');
                try{
                    console.log('yes');
                    const {
                        name,
                        description,
                        image,
                        price,
                        discount,
                        color,
                        size,
                        seller,
                        currectPrice,
                        quantity,
                        brand,
                        category,
                        subCategory,
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
                        rating: 1,
                        seller,
                        currectPrice,
                        quantity,
                        brand,
                        category,
                        subCategory,
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
                        data: product,
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
                        data: product,
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: error,
                    });
                }
            }

            run();
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
                        data: product,
                    });
                } catch {
                    return res.status(200).json({
                        status: true,
                        message: "Unable to delete Product",
                        code: 500,
                    });
                }
            }

            run();
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

            run();
        }
    }

    getProductById() {
        return (req, res) => {
            const run = async () => {
                try {
                    const product = await this.Product.findById(req.params.id);
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
                        rating: { $gte: req.params.minRating, $lte: req.params.maxRating },
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
}