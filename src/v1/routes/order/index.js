
const router = ({Router, OrderController, Authenticate, Order, User, Product, EmailHandler, messages, bcrypt, jwt}) => {
    const orderController = new OrderController({Order, User, Product, EmailHandler, messages, bcrypt, jwt})
    const { verifyUserToken } = new Authenticate({ jwt, bcrypt });

    const orderRouter = Router();

    orderRouter.get('/', verifyUserToken, orderController.getAllOrders);

    orderRouter.get('/:id', verifyUserToken, orderController.getOrderById);

    orderRouter.get('/getOrdersByUser/:userId', verifyUserToken, orderController.getOrdersByUserId);

    orderRouter.get('getOrdersByProduct/:productId', verifyUserToken, orderController.getOrdersByProductId);

    orderRouter.post('/', verifyUserToken, orderController.orderProduct);

    orderRouter.put('/:id', verifyUserToken, orderController.updateOrder);

    orderRouter.delete('/:id', verifyUserToken, orderController.deleteOrder);

    return orderRouter;
}

export default router;