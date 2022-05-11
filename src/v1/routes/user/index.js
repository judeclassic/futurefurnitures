//@ts-check

const router = ({ Router, UserController, User, Authenticate, EmailHandler, bcrypt, jwt}) => {
    const router = Router();

    const userController = new UserController({ User, EmailHandler, bcrypt, jwt });
    const { clickVerification, verifyUserToken } = new Authenticate({ User, bcrypt, jwt });

    // User Login
    router.post(
        "/signIn",
        userController.loginUser()
    );

    // User Signup
    router.post(
        "/signUp",
        userController.registerUser()
    );

    // Get Single User Data
    router.get(
        '/getSingleUserData/:id',
        verifyUserToken(),
        userController.getSingleUserData()
    );

    //  Edit Single User Data
    router.put(
        '/editSingleUserData/:id',
        verifyUserToken(),
        userController.editSingleUserData()
    );

    // Send Verification Email
    router.post(
        '/sendVerificationEmail',
        verifyUserToken(),
        userController.sendVerificationEmail()
    );

    // Verify User Email
    router.post(
        '/verifyUserEmail',
        clickVerification(),
        userController.verifyUserEmail()
    );

    // Reset Password
    router.post(
        "/resetPassword",
        clickVerification(),
        userController.resetPassword()
    )

    // Logout Out
    router.get(
        "/logOut",
        userController.logOutUser()
    );

    return router;
}

export default router;