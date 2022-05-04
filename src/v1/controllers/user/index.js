
export default class UserController {

    constructor({ User, EmailHandler, bcrypt, jwt }) {
        this.User = User;
        this.EmailHandler = EmailHandler;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
    }

    test() {
        console.log(this.bcrypt.hashSync("123456", 10));
    }

    // REGISTER USER
    registerUser = () => {  
        return (req, res) => {
            try{
                let hashPassword = this.bcrypt.hashSync(req.body.password, 10);
                let code = this.generateVerificationCode();

                this.User.findOne({
                    email: req.body.email,
                }, (err, user) => {
                    if (user) {
                        return res.json({
                            success: false,
                            code: 400,
                            message: "Email already exists",
                        });
                    } else {
                        this.User.findOne({
                            phone: req.body.phone,
                            }, (err, user) => {
                                if (user) {
                                    return res.json({
                                        success: false,
                                        code: 400,
                                        message: "Phone number already exists",
                                    });
                                } else {
                                    let user = new this.User({
                                        name: req.body.name,
                                        email: req.body.email,
                                        password: hashPassword,
                                        isVerified: false,
                                        isAdmin: false,
                                        isActive: true,
                                        isDeleted: false,
                                        createDate: new Date(),
                                        updateDate: new Date(),
                                        verificationCode: code,
                                        role: req.body.role,
                                        status: 'active',
                                        address: req.body.address,
                                        phone: req.body.phone,
                                        profilePic: req.body.profilePic,
                                        cart: [],
                                        boughtProducts: [],
                                        cancelledProducts: [],
                                        deliveredProducts: [],
                                    });
                                    user.save((err, doc) => {
                                        if (!err) {
                                            res.status(200).json({
                                                status: true,
                                                code: 200,
                                                message: "User Registered",
                                                user: doc,
                                            });
                                        } else {
                                            console.log(err);
                                            res.status(500).json({
                                                status: false,
                                                code: 500,
                                                message: "Internal Server Error",
                                            });
                                        }
                                    });
                                }
                            }
                        );
                    }
                });
            } catch (err) {
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Internal Server Error",
                });
            }
        }
    }

    // LOGIN USER
    loginUser() {
        return (req, res) => {
            try {
                this.User.findOne({ email: req.body.email }, (err, user) => {
                    if (!user) {
                        return res.json({
                            code: 404,
                            message: "User not found",
                        });
                    }
                    if (this.bcrypt.compareSync(req.body.password, user.password)) {
                        const payload = {
                            id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            isVerified: user.isVerified,
                            isAdmin: user.isAdmin,
                            isActive: user.isActive,
                            isDeleted: user.isDeleted,
                            createDate: user.createDate,
                            updateDate: user.updateDate,
                            role: user.role,
                            status: user.status,
                            address: user.address,
                            phone: user.phone,
                        };
                        let token = this.jwt.sign(payload, process.env.USER_ACCESS_TOKEN_SECRET, {
                            // expiresIn: 1000 * 60 * 60 * 24 * 7,
                        });
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "User Logged In",
                            user: {
                                ...user._doc,
                                token,
                            },
                        });
                    } else {
                        return res.json({
                            status: false,
                            code: 404,
                            message: "Wrong Password",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: error
                });
            }
        }
    }

    // SEND VERIFICATION EMAIL
    sendVerificationEmail() {
        return (req, res) => {
            this.User.findOne({ email: req.body.email }, (err, user) => {
                if ( !user ) {
                    return res.json({
                        status: false,
                        code: 404,
                        message: "User not found",
                    });
                }
                this.EmailHandler.sendVerificationEmail(user.email, user.firstName, user.lastName, user.verificationCode);
                res.status(201).json({
                    status: true,
                    code: 201,
                    message: "Verification Email Sent",
                });
            });
        }
    }

    // VERIFY USER EMAIL
    verifyUserEmail() {
        return (req, res) => {
            this.User.findOne({ email: req.body.email }, (err, user) => {
                if (!user) {
                    return res.json({
                        code: 404,
                        message: "User not found",
                    });
                }
                if (user.verificationCode === req.body.verificationCode) {
                    user.isVerified = true;
                    user.save((err, doc) => {
                        if (!err) {
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "User Verified",
                                user: doc,
                            });
                        } else {
                            console.log(err);
                            res.status(500).json({
                                status: false,
                                code: 500,
                                message: "Internal Server Error",
                            });
                        }
                    });
                }
            });
        }
    };

    //  GET ALL USER DATA
    loadAllUsers = () => {
        return (req, res) => {
            try {
                this.User.find({}, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "User data loaded successfully",
                            loadAllUsers: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Error loading user data",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: error.message,
                });
            }
        };
    };

    //  GET SINGLE USER DATA
    getSingleUserData = () => {
        return (req, res) => {
            try {
                this.User.findById(req.params.id, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "User data loaded successfully",
                            user: data,
                        });
                    } else {
                        console.log(err);
                        res.status(404).json({
                            status: false,
                            code: 404,
                            message: "User not found",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "User not found",
                });
            }
        };
    };

    //  EDIT SINGLE USER DATA
    editSingleUserData = () => {
        return (req, res) => {
            try {
                console.log(req.body);
                this.User.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "User data updated successfully",
                            user: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "User data not updated",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "User data not updated",
                });
            }
        };
    };

    // RESET PASSWORD
    resetPassword = () => {
        return (req, res) => {
            try {
                this.User.findByIdAndUpdate(req.body.id, {
                    password: req.body.password,
                    confirmPassword: req.body.confirmPassword,
                }, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Password updated successfully",
                            resetPassword: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Password not updated",
                        });
                    }
                })
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Password not updated",
                });
            }
        };
    }

    logOutUser = () => {
        return (req, res) => {
            try {
                this.User.findByIdAndUpdate(req.body.id, {
                    isActive: false,
                }, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "User logged out successfully",
                            logOutUser: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "User not logged out",
                        });
                    }
                })
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "User not logged out",
                });
            }
        };
    }

    generateVerificationCode = () => {
        return Math.floor(Math.random() * 1000000);
    }
};
