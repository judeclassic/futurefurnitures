//@ts-check

class PaymentController {
    constructor({PayService, User, Product, EmailHandler}) {
        this.PayService = PayService;
        this.User = User;
        this.Product = Product;
        this.EmailHandler = EmailHandler;
    }

    createPayment = () => {
        return (req, res) => {
            const run = async () => {
                const { userId } = req.user;
                const { productId } = req.body;
                const user = await this.User.findById(userId);
                const product = await this.Product.findById(productId);
                if (!user || !product) {
                    return res.status(404).json({
                        success: false,
                        code: 404,
                        message: 'USER NOT FOUND'
                    });

                } else {
                    const payment = await this.PayService.createPayment(user, product);
                    if (!payment) {
                        return res.status(500).json({
                            success: false,
                            code: 500,
                            message: 'PAYMENT NOT CREATED'
                        });
                    } else {
                        this.User.findByIdAndUpdate(userId, {
                            $push: {
                                boughtProducts: product._id
                            },
                        }, (err, _user) => {
                            
                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    code: 500,
                                    message: 'USER NOT UPDATED'
                                });
                            }
                            return res.status(200).json({
                                success: true,
                                code: 200,
                                message: 'PAYMENT_CREATED',
                                payment
                            });
                        });
                    }
                }
            }

            run().catch(err => {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    code: 500,
                    message: 'PAYMENT NOT CREATED'
                });
            });
        }
    }

    getPayments = () => {
        return (req, res) => {
            const run = async () => {
                const { userId } = req.user;
                const user = await this.User.findById(userId);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        code: 404,
                        message: 'USER_NOT_FOUND'
                    });
                } else {
                    const payment = await this.PayService.getPayment(user);
                    if (!payment) {
                        return res.status(500).json({
                            success: false,
                            code: 500,
                            message: 'PAYMENT NOT FOUND'
                        });
                    } else {
                        return res.status(200).json({
                            success: true,
                            code: 200,
                            message: 'PAYMENT FOUND',
                            payment
                        });
                    }
                }
            }

            return run().catch(err => {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    code: 500,
                    message: 'PAYMENT NOT FOUND'
                });
            });
        }
    }
}


export default PaymentController;


                

