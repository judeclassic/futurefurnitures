//@ts-check

const router = ({Router, OrderController, Authenticate, Order, User, Product, EmailHandler, messages, bcrypt, jwt}) => {
    const orderController = new OrderController({ Product, Order, User, EmailHandler});
    const { clickVerification, verifySellerToken } = new Authenticate({ Seller: User, bcrypt, jwt });

    const orderRouter = Router();

    // Order Product 
    orderRouter.post( "/order/product", verifySellerToken(), orderController.createOrder() );

    return orderRouter;
}

export default router;