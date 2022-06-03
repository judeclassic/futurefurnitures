import Transaction from "./finance";

export default class ProductController {
    constructor({ Product, Seller, EmailHandler}) {
        this.Product = Product;
        this.EmailHandler = EmailHandler;
        this.Seller = Seller;
        this.Transaction = new Transaction({
            Transaction,
            EmailHandler,
        });
    }

    createProduct = () => {
        return (req, res) => {
            const run = async () => {
                const image = req.files && req.files.map(file => file.imagePath);
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
                        quantity,
                        brand,
                        category,
                        subCategory,
                        status,
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
                        quantity,
                        brand,
                        category,
                        subCategory,
                        createDate: new Date,
                        updateDate: new Date,
                        status,
                        isDeleted: false,
                        isVerified: false,
                        isActive: true,
                    });

                    await product.save();
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        data: product,
                    });
                } catch (error) {
                    // console.log(error);
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

    getAllProducts = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const products = await this.Product.find({
                        isDeleted: false,
                        isActive: true,
                    });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        data: products,
                    });
                }
                catch (error) {
                    // console.log(error);
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

    getSellerProduct() {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    const product = await this.Product.findById(id);
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        data: product,
                    });
                }
                catch (error) {
                    // console.log(error);
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

    updateSellerProduct = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    
                    const product = await this.Product.findByIdAndUpdate(id, req.body, { new: true });
                    this.EmailHandler.sendSellerEmail({product});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: 'Product updated successfully',
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

    updateSellerProductImage = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    const image = req.files.map(file => file.imagePath);
                    const product = await this.Product.findByIdAndUpdate(id, { image }, { new: true });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        data: product,
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


    deleteSellerProduct = () => {
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

            return run();
        }
    }

    markProductAsSold = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const product = await this.Product.findByIdAndUpdate(id, { status: 'sold' }, { new: true });
                    if (!product) {
                        return res.status(200).json({
                            status: false,
                            message: "Product do not exist or have already been deleted",
                            code: 201,
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product updated successfully",
                        product: product,
                    });
                }
                catch {
                    return res.status(200).json({
                        status: true,
                        message: "Unable to update Product",
                        code: 500,
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
                    const { sellerId } = req.params;
                    const products = await this.Product.find({ seller: sellerId, status: 'sold' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products
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
                    const { sellerId } = req.params;
                    const products = await this.Product.find({ seller: sellerId, status: 'ordered' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products fetched successfully",
                        products,
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

    saveProductAsActive = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    if (req.params.id) {
                        const { id } = req.params;
                        const product = await this.Product.findByIdAndUpdate(id, {...req.body, status: 'active'}, { new: true });
                        return res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Product saved as active successfully",
                            product,
                        });
                    }
                    const product = await this.Product.create({...req.body, isActive: true, isVerified: true, status: 'active', isDeleted: false});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        data: product,
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


    getSellerActiveProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.find({ seller: id, status: 'active' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products retrieved successfully",
                        products
                    });
                }
                catch (error) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Internal Server Error",
                    });
                }
            }
        }
    }

    saveProductAsDraft = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    if (req.params.id) {
                        const { id } = req.params;
                        const product = await this.Product.findByIdAndUpdate(id, {...req.body, status: 'drafted'}, { new: true });
                        return res.status(200).json({
                            status: true,
                            code: 200,
                            data: product,
                        });
                    }
                    const product = await this.Product.create(req.body)
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product saved as drafted successfully",
                        product,
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

    getSellerDraftedProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.find({ seller: id, status: 'drafted' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products retrieved successfully",
                        products,
                    });
                }
                catch (error) {
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


    getSellerPendingProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.find({ seller: id, status: 'pending' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        data: products,
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

    restoreProduct = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const product = await this.Product.findByIdAndUpdate(id, { status: 'active', isDeleted: false }, { new: true });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product restored successfully",
                        product,
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


    getSellerDeletedProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.find({ seller: id, isDeleted: true });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        data: products,
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




    ///FOR BUYERS

    buyProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.findById(id);
                    const seller = await this.Seller.findById(products.seller.trim());
                    if (!products) {
                        return res.status(200).json({
                            status: false,
                            code: 200,
                            message: "No products to buy or Product is not verified",
                        });
                    }
                    console.log(products);
                    const body = {
                        name : products.name,
                        description: products.description,
                        productId: products._id.toString(),
                        productName: products.name,
                        sellerId: products.seller,
                        sellerName: seller.name,
                        buyerId: id,
                        price: products.price,
                    }
                    this.Transaction.createTransaction(body);

                    return res.status(200).json({
                        status: true,
                        code: 200,
                        data: products,
                    });
                } catch (error) {
                    console.log(error);
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

    saveProductForBuyers = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const product = await this.Product.findById(id);
                    const buyer = await this.Seller.findByIdAndUpdate(req.user.id, { $push: { savedProducts: product } }, { new: true });
                    
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product saved successfully",
                        product,
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

    getSavedProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const buyer = await this.Seller.findById(req.user.id);
                    const products = await this.Product.find({ _id: { $in: buyer.savedProducts } });

                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Products retrieved successfully",
                       products,
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