//@ts-check

export default class OrderController {
    /**
     * @param {any} Order
     * @param {any} User
     * @param {any} Product
     * @param {any} Subscription
     * @param {any} EmailHandler
     * @param {any} bcrypt
     * @param {any} jwt
     */
    constructor(Order, User, Product, Subscription, EmailHandler, bcrypt, jwt) {
        this.Order = Order;
        this.User = User;
        this.Product = Product;
        this.Subscription = Subscription;
        this.EmailHandler = EmailHandler;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
    }

    /**
     * @param {{ params: { productId: any; userId: any; }; body: { quantity: number; }; }} req
     * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { status: boolean; code: number; message: string; order?: any; error?: any; }): void; new (): any; }; }; }} res
     */
    async orderProduct(req, res) {
        try {
            const product = await this.Product.findById(req.params.productId);
            if (!product) {
                res.status(404).json({
                    status: false,
                    code: 404,
                    message: "Product not found",
                });
            }
            else {
                const order = new this.Order({
                    userId: req.params.userId,
                    productId: req.params.productId,
                    quantity: req.body.quantity,
                    price: product.price,
                    totalPrice: req.body.quantity * product.price,
                    isDeleted: false,
                });
                const newOrder = await order.save();
                res.status(200).json({
                    status: true,
                    code: 200,
                    message: "Order placed successfully",
                    order: newOrder,
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

    /**
     * @param {any} req
     * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { code: number; message: string; orders?: any; error?: any; }): void; new (): any; }; }; }} res
     */
    async getAllOrders(req, res) {
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

    /**
     * @param {{ params: { id: any; }; }} req
     * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { status: boolean; code: number; message: string; order?: any; error?: any; }): void; new (): any; }; }; }} res
     */
    async getOrderById(req, res) {
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

    /**
     * @param {{ params: { userId: any; }; }} req
     * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { status: boolean; code: number; message: string; orders?: any; error?: any; }): void; new (): any; }; }; }} res
     */
    async getOrdersByUserId(req, res) {
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

    /**
     * @param {{ params: { productId: any; }; }} req
     * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { stutus?: boolean; code: number; message: string; orders?: any; status?: boolean; error?: any; }): void; new (): any; }; }; }} res
     */
    async getOrdersByProductId(req, res) {
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

    /**
     * @param {{ params: { orderId: any; }; body: any; }} req
     * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { status: boolean; code: number; message: string; order?: any; error?: any; }): void; new (): any; }; }; }} res
     */
    async updateOrder(req, res) {
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

    /**
     * @param {{ params: { orderId: any; }; }} req
     * @param {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { status: boolean; code: number; message: string; order?: any; error?: any; }): void; new (): any; }; }; }} res
     */
    async deleteOrder(req, res) {
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
}