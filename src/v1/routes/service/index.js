//@ts-check

const router = ({ Router, VendorController, Authenticate, Vendor, User, service, EmailHandler, PaymentHandler, bcrypt, jwt, Logger }) => {
    const router = Router();

    const vendorController = new VendorController({ Vendor, User, service, EmailHandler, PaymentHandler, bcrypt, jwt, Logger });
    const { verifyUserToken } = new Authenticate({ User, bcrypt, jwt });


    router.post('/:id/service', verifyUserToken(), vendorController.requestVendorService());

    router.get('/:id/service/:serviceId/', verifyUserToken(), vendorController.getVendorServices());

    router.get('/:id/service/:serviceId/paid', verifyUserToken(), vendorController.getPaidVendorService());

    router.get('/v1/api/service', verifyUserToken(), vendorController.getServices());

    router.get('/v1/api/service/:id', verifyUserToken(), vendorController.getService());

    router.put('/v1/api/service/:id', verifyUserToken(), vendorController.updateService());

    router.delete('/v1/api/service/:id', verifyUserToken(), vendorController.deleteService());

    router.post('/v1/api/service/:id/approve', verifyUserToken(), vendorController.approveService());

    router.post('/v1/api/service/:id/reject', verifyUserToken(), vendorController.rejectService());

    router.post('/v1/api/service/:id/cancel', verifyUserToken(), vendorController.cancelService());

    
    return router;

}

export default router;



        