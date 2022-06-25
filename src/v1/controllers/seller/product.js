//@ts-check
import OrderController from "./order";
import Transaction from "./finance";

export default class ProductController extends OrderController {
    constructor({ Product, Order, Seller, EmailHandler}) {
        super({ Product, Order, Seller, EmailHandler})
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

                    const location = req.body.location && JSON.parse(req.body.location);

                    const products = new this.Product({
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
                        location,
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

                    await products.save();
                    this.Seller.findByIdAndUpdate({role: 'seller'});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        products,
                    });
                } catch (error) {
                    // console.log(error);
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
                        products,
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

    getTopPicksProduct() {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    const products = await this.Product.findById(id);
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        products,
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
                    const { sellerId } = req.params;
                    if (!sellerId) {
                        return res.status(500).json({
                            status: false,
                            code: 403,
                            message: "sellerId is empty",
                        });
                    }
                    const products = await this.Product.find({seller: sellerId});
                    if (!products || products._doc == []) {
                        return res.status(201).json({
                            status: false,
                            code: 201,
                            message: "seller has no products yet",
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: 'Fetched products successfully',
                        products,
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

    getSingleProduct() {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    console.log('hahahaahah')
                    const products = await this.Product.findById(id);
                    if (!products) {
                        return res.status(200).json({
                            status: false,
                            code: 200,
                            message: 'Product not found',
                            products,
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: 'Products fetched successfully',
                        products,
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
                    
                    const products = await this.Product.findByIdAndUpdate(id, req.body, { new: true });
                    this.EmailHandler.sendSellerEmail({products});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: 'Product updated successfully',
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

    updateSellerProductImage = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    const image = req.files.map(file => file.imagePath);
                    const products = await this.Product.findByIdAndUpdate(id, { image }, { new: true });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        products,
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
                    const products = await this.Product.findByIdAndDelete(id);
                    if (!products) {
                        return res.status(200).json({
                            status: false,
                            message: "Product do not exist or have already been deleted",
                            code: 201,
                        });
                    }
                    this.EmailHandler.sendSellerEmail({products});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product deleted successfully",
                        products,
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

    //LISTING



    markProductAsSold = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.findByIdAndUpdate(id, { status: 'sold' }, { new: true });
                    if (!products) {
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
                        products,
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
                        const products = await this.Product.findByIdAndUpdate(id, {...req.body, status: 'active'}, { new: true });
                        return res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Product saved as active successfully",
                            products,
                        });
                    }
                    const products = await this.Product.create({...req.body, isActive: true, isVerified: true, status: 'active', isDeleted: false});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        products,
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
                console.log('yeah');
                try {
                    const { sellerId } = req.params;
                    const products = await this.Product.find({ seller: sellerId, status: 'active' });
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
                        const products = await this.Product.findByIdAndUpdate(id, {...req.body, status: 'drafted'}, { new: true });
                        return res.status(200).json({
                            status: true,
                            code: 200,
                            products,
                        });
                    }
                    const products = await this.Product.create(req.body)
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product saved as drafted successfully",
                        products,
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
                    const { sellerId } = req.params;
                    const products = await this.Product.find({ seller: sellerId, status: 'drafted' });
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

    saveProductAsClosed = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Product.findByIdAndUpdate(id, { status: 'closed' }, { new: true });
                    if (!products) {
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
                        products,
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

    getSellerClosedProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { sellerId } = req.params;
                    const products = await this.Product.find({ seller: sellerId, status: 'closed' });
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


    getSellerPendingProducts = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { sellerId } = req.params;
                    const products = await this.Product.find({ seller: sellerId, status: 'pending' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
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
                    const { sellerId } = req.params;
                    const products = await this.Product.find({ seller: sellerId, isDeleted: true });
                    return res.status(200).json({
                        status: true,
                        code: 200,
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
                        products,
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
                    const products = await this.Product.findById(id);
                    const buyer = await this.Seller.findByIdAndUpdate(req.user.id, { $push: { savedProducts: products } }, { new: true });
                    
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Product saved successfully",
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