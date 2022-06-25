//@ts-check
import Transaction from "./finance";

export default class OrderController {
    constructor({ Product, Order, Seller, EmailHandler}) {
        this.Product = Product;
        this.Order = Order;
        this.EmailHandler = EmailHandler;
        this.Seller = Seller;
        this.Transaction = new Transaction({
            Transaction,
            EmailHandler,
        });
    }

    createOrder = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const { userId, quantity, productId, shippingInfo } = req.body;
                    const {
                        firstName,
                        lastName,
                        email,
                        phone,
                        address,
                        city,
                        state,
                        country,
                        postalCode,
                    } = shippingInfo;
                    const product = await this.Product.findById(productId);
                    console.log(product)

                    const products = new this.Order({
                        userId,
                        sellerId: product.seller.trim(),
                        productId,
                        type: 'used item',
                        status: 'expected',
                        quantity,
                        price: product.price,
                        totalPrice: parseInt(product.price) * parseInt(quantity),
                        isDeleted: false,
                        shipping: {
                            firstName,
                            lastName,
                            email,
                            phone,
                            address,
                            city,
                            state,
                            country,
                            postalCode,
                        },
                    });

                    await products.save();
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

    getAllOrders = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const products = await this.Order.find({
                        isDeleted: false,
                        isActive: true,
                        type: 'used item'
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

    getSellerOrder() {
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
                    const products = await this.Order.find({seller: sellerId, type: 'used item',});
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

    getSingleOrder() {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    console.log('hahahaahah')
                    const products = await this.Order.findOne({id, type: 'used item',});
                    if (!products) {
                        return res.status(200).json({
                            status: false,
                            code: 200,
                            message: 'Order not found',
                            products,
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: 'Orders fetched successfully',
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

    updateSellerOrder = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    
                    const products = await this.Order.findOneAndUpdate({id, type: 'used item',}, req.body, { new: true });
                    this.EmailHandler.sendSellerEmail({products});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: 'Order updated successfully',
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

    deleteSellerOrder = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Order.findOneAndDelete({id, type: 'used item',});
                    if (!products) {
                        return res.status(200).json({
                            status: false,
                            message: "Order do not exist or have already been deleted",
                            code: 201,
                        });
                    }
                    this.EmailHandler.sendSellerEmail({products});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Order deleted successfully",
                        products,
                    });
                } catch {
                    return res.status(200).json({
                        status: true,
                        message: "Unable to delete Order",
                        code: 500,
                    });
                }
            }

            return run();
        }
    }
    
    markOrderAsExpected = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Order.findOneAndUpdate({ id, type: 'used item' }, { status: 'expected' }, { new: true });
                    if (!products) {
                        return res.status(200).json({
                            status: false,
                            message: "Order do not exist or have already been deleted",
                            code: 201,
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Order updated successfully",
                        products,
                    });
                }
                catch {
                    return res.status(200).json({
                        status: true,
                        message: "Unable to update Order",
                        code: 500,
                    });
                }
            }

            return run();
        }
    }

    getSellerExpectedOrders = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { sellerId } = req.params;
                    const products = await this.Order.find({ seller: sellerId, status: 'expected', type: 'used item' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Orders fetched successfully",
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

    markOrderAsPending = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Order.findOneAndUpdate({ id, type: 'used item' }, { status: 'pending' }, { new: true });
                    if (!products) {
                        return res.status(200).json({
                            status: false,
                            message: "Order do not exist or have already been deleted",
                            code: 201,
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Order updated successfully",
                        products,
                    });
                }
                catch {
                    return res.status(200).json({
                        status: true,
                        message: "Unable to update Order",
                        code: 500,
                    });
                }
            }

            return run();
        }
    }

    getSellerPendingOrders = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { sellerId } = req.params;
                    const products = await this.Order.find({ seller: sellerId, status: 'pending', type: 'used item' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Orders fetched successfully",
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

    markOrderAsAvailable = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Order.findOneAndUpdate({ id, type: 'used item' }, { status: 'available' }, { new: true });
                    if (!products) {
                        return res.status(200).json({
                            status: false,
                            message: "Order do not exist or have already been deleted",
                            code: 201,
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Order updated successfully",
                        products,
                    });
                }
                catch {
                    return res.status(200).json({
                        status: true,
                        message: "Unable to update Order",
                        code: 500,
                    });
                }
            }

            return run();
        }
    }

    getSellerAvailableOrders = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { sellerId } = req.params;
                    const products = await this.Order.find({ seller: sellerId, status: 'available', type: 'used item' });
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Orders fetched successfully",
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
}