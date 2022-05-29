//@ts-check

const router = ({ Router, VendorController, Authenticate, Vendor, User, service, EmailHandler, PaymentHandler, bcrypt, jwt, Logger, uploader }) => {
    const router = Router();

    const vendorController = new VendorController({ Vendor, User, service, EmailHandler, PaymentHandler, bcrypt, jwt, Logger, uploader });
    const { verifyUserToken } = new Authenticate({ User, bcrypt, jwt });

    router.post('/signUp', vendorController.signUpVendor());

    router.post('/login', vendorController.loginVendor());
    
    router.post('/updateJobInfo', verifyUserToken(), vendorController.updateJobInfo());

    router.post('/updatePhotoAndLicense', verifyUserToken(), uploader, vendorController.updatePhotoAndLicense());

    router.post('/review', verifyUserToken(), vendorController.reviewVendor());

    router.get('/viewExpectedFunds/:vendorId', verifyUserToken(), vendorController.viewExpectedFunds());

    router.get('/viewPendingFunds/:vendorId', verifyUserToken(), vendorController.viewPendingFunds());

    router.get('/viewAvailableFunds/:vendorId', verifyUserToken(), vendorController.viewAvailableFunds());

    router.get('/transactions/:vendorId', verifyUserToken(), vendorController.viewWithdrawFunds());

    router.post('/profile/updatePassword', verifyUserToken(), vendorController.changeProfilePassword());

    router.post('/profile/updateEmail', verifyUserToken(), vendorController.changeProfileEmail());

    router.post('/profile/updatePhone', verifyUserToken(), vendorController.changeProfilePhone());

    router.post('/profile/updateCountry', verifyUserToken(), vendorController.changeProfileCountry());

    router.post('/profile/updateState', verifyUserToken(), vendorController.changeProfileState());

    router.get('/all', vendorController.getVendors());

    router.get('/profile/:id', vendorController.getVendor());

    router.put('/profile', verifyUserToken(), vendorController.updateVendor());

    router.delete('/profile', verifyUserToken(), vendorController.deleteVendor());

    router.post('/withdraw', verifyUserToken(), vendorController.withdrawFunds());

    router.post('/requestVendorService', verifyUserToken(), vendorController.requestVendorService());

    router.get('/viewVendorServiceRequests/:id', verifyUserToken(), vendorController.viewAllRequests());

    router.post('/pay', verifyUserToken(), vendorController.payVendor());
    
    return router;

}

export default router;



        