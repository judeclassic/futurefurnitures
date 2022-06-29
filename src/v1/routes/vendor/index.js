//@ts-check

const router = ({ Router, VendorController, Authenticate, Vendor, User, service, EmailHandler, PaymentHandler, bcrypt, jwt, Logger, userWithLisenceUploader, userUploader }) => {
    const router = Router();

    const vendorController = new VendorController({ EmailHandler, PaymentHandler, User, service, Vendor, Logger, bcrypt, jwt });
    const { verifyUserToken } = new Authenticate({ User, bcrypt, jwt });

    router.post('/signUp', userWithLisenceUploader, vendorController.signUpVendor());

    router.post('/login', vendorController.loginVendor());

    router.get('/detail/:id', vendorController.getVendorDetailsWithOutAuth() );
    
    router.post('/updateJobInfo', verifyUserToken(), vendorController.updateJobInfo() );

    router.post('/updatePhotoAndLicense', verifyUserToken(), userWithLisenceUploader, vendorController.updatePhotoAndLicense() );

    router.post('/review', verifyUserToken(), vendorController.reviewVendor());

    router.get('/viewExpectedFunds/:vendorId', verifyUserToken(), vendorController.viewExpectedFunds() );

    router.get('/viewPendingFunds/:vendorId', verifyUserToken(), vendorController.viewPendingFunds() );

    router.get('/viewAvailableFunds/:vendorId', verifyUserToken(), vendorController.viewAvailableFunds() );

    router.get('/transactions/:vendorId', verifyUserToken(), vendorController.viewWithdrawFunds() );

    //UPDATE DETAILS

    router.post('/updatePhoto', verifyUserToken(), userUploader, vendorController.updatePhoto() ); 

    router.post('/profile/updatePassword', verifyUserToken(), vendorController.changeProfilePassword() );

    router.post('/profile/updateEmail', verifyUserToken(), vendorController.changeProfileEmail() );

    router.post('/profile/updatePhone', verifyUserToken(), vendorController.changeProfilePhone() );

    router.post('/profile/updateCountry', verifyUserToken(), vendorController.changeProfileCountry() );

    router.post('/profile/updateCountry', verifyUserToken(), vendorController.changeProfileCountry() );

    router.post('/profile/updateState', verifyUserToken(), vendorController.changeProfileState() );

    //start

    router.post('/profile/updateCity', verifyUserToken(), vendorController.changeProfileCity() );

    router.post('/profile/updatePrimaryService', verifyUserToken(), vendorController.changeProfilePrimaryService() );

    router.post('/profile/updatePlaceOfTraining', verifyUserToken(), vendorController.changeProfilePlaceOfTraining() );

    router.post('/profile/updateDiscription', verifyUserToken(), vendorController.changeProfileDiscription() );

    router.post('/profile/updateYearsOfExperience', verifyUserToken(), vendorController.changeProfileYearsOfExperience() );

    router.post('/profile/updateMembers', verifyUserToken(), vendorController.changeProfileCrewSize() );


    // FOR CARD
    router.post('/profile/card', verifyUserToken(), vendorController.addPaymentCard() );

    router.get('/profile/card', verifyUserToken(), vendorController.retrievePaymentCard() );

    router.put('/profile/card', verifyUserToken(), vendorController.updatePaymentCard() );

    router.delete('/profile/card', verifyUserToken(), vendorController.removePaymentCard() );

    //FOR PAYPAL
    router.delete('/profile/paypal', verifyUserToken(), vendorController.addWithPaypal() );

    router.delete('/profile/paypal', verifyUserToken(), vendorController.updateWithPaypal() );

    router.delete('/profile/paypal', verifyUserToken(), vendorController.removeWithPaypal() );

    //FOR PAYONEER
    router.delete('/profile/payoneer', verifyUserToken(), vendorController.addWithPayoneer() );

    router.delete('/profile/payoneer', verifyUserToken(), vendorController.updateWithPayoneer() );

    router.delete('/profile/payoneer', verifyUserToken(), vendorController.removeWithPayoneer() );
    // end

    router.get('/all', vendorController.getVendors());

    router.get('/profile', verifyUserToken(), vendorController.getVendor() );

    router.put('/profile', verifyUserToken(), vendorController.updateVendor() );

    router.delete('/profile', verifyUserToken(), vendorController.deleteVendor() );

    router.post('/withdraw', verifyUserToken(), vendorController.withdrawFunds() );

    router.post('/requestVendorService', verifyUserToken(), vendorController.requestVendorService() );

    router.get('/viewUserServiceRequests/:id', verifyUserToken(), vendorController.viewAllRequests() );

    router.post('/pay', verifyUserToken(), vendorController.payVendor() );
    
    return router;

}

export default router;



        