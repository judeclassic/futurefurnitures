//@ts-check

export default class OrderController {

    constructor({Order, User, Product, EmailHandler, bcrypt, jwt}) {
        this.Order = Order;
        this.User = User;
        this.Product = Product;
        this.EmailHandler = EmailHandler;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
    }
    
    orderProduct = () => {
        return (req, res) => {
            console.log(req.body)
            const run = async () => {
                try {
                    const product = await this.Product.findById(req.body.productId);
                    if (!product) {
                        return res.status(403).json({
                            status: false,
                            code: 403,
                            message: "Product not found",
                        });
                    }
                    if (product.quantity < req.body.quantity) {
                        return res.status(403).json({
                            status: false,
                            code: 403,
                            message: "Insuffiency Products",
                        });
                    }
                    else {
                        const order = new this.Order({
                            userId: req.body.userId,
                            productId: req.body.productId,
                            quantity: req.body.quantity,
                            price: product.price,
                            totalPrice: req.body.quantity * product.price,
                            isDeleted: false,
                        });
                        const newOrder = await order.save();

                        this.User.findByIdAndUpdate(req.body.userId, { $push: { orderedProducts: req.body.productId }});

                        return res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Order placed successfully",
                            order: newOrder,
                        });
                    }
                }
                catch (error) {
                    console.log(error)
                    res.status(500).json({
                        status: false,
                        code: 403,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            return run();
        }
    }

    getAllOrders= () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const orders = await this.Order.find({ isDeleted: false });
                    res.status(200).json({
                        code: 200,
                        message: "Orders fetched successfully",
                        orders,
                    });
                } catch (error) {
                    res.status(500).json({
                        code: 500,
                        message: "Internal server error",
                        error,
                    });
                }
            }

            run();
        }
    }

    getOrderById= () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const order = await this.Order.findById(req.params.id);
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Order fetched successfully",
                        order,
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

    getOrdersByUserId = () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const orders = await this.Order.find({
                        userId: req.params.userId,
                        isDeleted: false,
                    });
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Orders fetched successfully",
                        orders,
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

    getOrdersByProductId= () => {
        return (req, res) => {
            const run = async () => {
                try {
                    const orders = await this.Order.find({
                        productId: req.params.productId,
                        isDeleted: false,
                    });
                    res.status(200).json({
                        stutus: true,
                        code: 200,
                        message: "Orders fetched successfully",
                        orders,
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

    updateOrder= () => {

        return (req, res) => {
            const run = async () => {
                try {
                    const order = await this.Order.findById(req.params.orderId);
                    if (!order) {
                        res.status(404).json({
                            status: false,
                            code: 404,
                            message: "Order not found",
                        });
                    }
                    else {
                        const updatedOrder = await this.Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Order updated successfully",
                            order: updatedOrder,
                        });
                    }
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

    deleteOrder= () => {
        /**
         * @param {{ params: { orderId: any; }; }} req
         * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { status: boolean; code: number; message: string; order?: any; error?: any; }): void; new (): any; }; }; }} res
         */
        return (req, res) => {
            const run = async () => {
                try {
                    const order = await this.Order.findById(req.params.orderId);
                    if (!order) {
                        res.status(404).json({
                            status: false,
                            code: 404,
                            message: "Order not found",
                        });
                    }
                    else {
                        const deletedOrder = await this.Order.findByIdAndUpdate(req.params.orderId, { isDeleted: true }, { new: true });
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Order deleted successfully",
                            order: deletedOrder,
                        });
                    }
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