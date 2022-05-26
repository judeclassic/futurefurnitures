//@ts-check

const router = ({ Router, VendorController, Authenticate, Vendor, User, service, EmailHandler, PaymentHandler, bcrypt, jwt, Logger }) => {
    const router = Router();

    const vendorController = new VendorController({ Vendor, User, service, EmailHandler, PaymentHandler, bcrypt, jwt, Logger });
    const { verifyUserToken } = new Authenticate({ User, bcrypt, jwt });

    router.post('/register', vendorController.registerVendor());

    router.post('/login', vendorController.loginVendor());

    router.get('/', verifyUserToken(), vendorController.getVendors());

    router.get('/:id', verifyUserToken(), vendorController.getVendor());

    router.put('/:id', verifyUserToken(), vendorController.updateVendor());

    router.delete('/:id', verifyUserToken(), vendorController.deleteVendor());

    router.post('/:id/pay', verifyUserToken(), vendorController.payVendor());
    
    return router;

}

export default router;



        