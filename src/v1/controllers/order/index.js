//@ts-check
// import Transaction from "./finance";

export default class OrderController {
    constructor({ Product, Order, User, EmailHandler}) {
        this.Product = Product;
        this.Order = Order;
        this.EmailHandler = EmailHandler;
        this.User = User;
        // this.Transaction = new Transaction({
        //     Transaction,
        //     EmailHandler,
        // });
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
                        sellerId: product.user.trim(),
                        productId,
                        type: 'new item',
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
                        type: 'new item'
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

    getUserOrder() {
        return (req, res) => {
            const run = async () => {
                try{
                    const { userId } = req.params;
                    if (!userId) {
                        return res.status(500).json({
                            status: false,
                            code: 403,
                            message: "userId is empty",
                        });
                    }
                    const products = await this.Order.find({user: userId, type: 'new item',});
                    if (!products || products._doc == []) {
                        return res.status(201).json({
                            status: false,
                            code: 201,
                            message: "user has no products yet",
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
                    const products = await this.Order.findOne({id, type: 'new item',});
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

    updateUserOrder = () => {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.params;
                    
                    const orders = await this.Order.findOneAndUpdate({id, type: 'new item',}, req.body, { new: true });
                    this.EmailHandler.sendUserEmail({orders});
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: 'Order updated successfully',
                        order: orders,
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

    deleteUserOrder = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { id } = req.params;
                    const products = await this.Order.findOneAndDelete({id, type: 'new item',});
                    if (!products) {
                        return res.status(200).json({
                            status: false,
                            message: "Order do not exist or have already been deleted",
                            code: 201,
                        });
                    }
                    this.EmailHandler.sendUserEmail({products});
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
                    const products = await this.Order.findOneAndUpdate({ id, type: 'new item' }, { status: 'expected' }, { new: true });
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

    getUserExpectedOrders = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { userId } = req.params;
                    const products = await this.Order.find({ user: userId, status: 'expected', type: 'new item' });
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
                    const products = await this.Order.findOneAndUpdate({ id, type: 'new item' }, { status: 'pending' }, { new: true });
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

    getUserPendingOrders = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { userId } = req.params;
                    const products = await this.Order.find({ user: userId, status: 'pending', type: 'new item' });
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
                    const products = await this.Order.findOneAndUpdate({ id, type: 'new item' }, { status: 'available' }, { new: true });
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

    getUserAvailableOrders = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const { userId } = req.params;
                    const products = await this.Order.find({ user: userId, status: 'available', type: 'new item' });
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