//@ts-check

const router = ({ PaymentController, Router, Authenticate, Product, User, EmailHandler, PaymentHandler, messages, bcrypt, jwt }) => {

    const productController = new PaymentController({ Product, User, EmailHandler, PaymentHandler, messages, bcrypt, jwt });
    const { verifyUserToken } = new Authenticate({ jwt, bcrypt });

    const paymentRouter = Router();

    //   FOR SELLER
    // Create Product
    // paymentRouter.post('/create', verifyUserToken(), payController.createProduct());

    return paymentRouter;
}


export default router;


