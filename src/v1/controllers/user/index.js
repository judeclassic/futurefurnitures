//@ts-check

const USER_ACCESS_TOKEN_SECRET = process.env.USER_ACCESS_TOKEN_SECRET || 'rirriurh849g498gyh4iggntfjnvo7';

export default class UserController {

    constructor({ User, EmailHandler, Product, bcrypt, jwt }) {
        this.User = User;
        this.EmailHandler = EmailHandler;
        this.Product = Product;
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
                console.log("BODY", req.body);
                let hashPassword = this.bcrypt.hashSync(req.body.password, 10);
                let code = this.generateVerificationCode();
                if (!req.body) {
                    return res.status(400).send({
                        message: 'Content can not be empty!'
                    });
                }
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
                                            const payload = {
                                                id: user._id,
                                                firstName: doc.firstName,
                                                lastName: doc.lastName,
                                                email: doc.email,
                                                isVerified: doc.isVerified,
                                                isAdmin: doc.isAdmin,
                                                isActive: doc.isActive,
                                                isDeleted: doc.isDeleted,
                                                createDate: doc.createDate,
                                                updateDate: doc.updateDate,
                                                role: doc.role,
                                                status: doc.status,
                                                address: doc.address,
                                                phone: doc.phone,
                                            };
                                            let token = this.jwt.sign(payload, `${USER_ACCESS_TOKEN_SECRET}`, {
                                                // expiresIn: 1000 * 60 * 60 * 24 * 7,
                                            });
                                            res.status(200).json({
                                                status: true,
                                                code: 200,
                                                message: "User Registered",
                                                user: {...doc._doc, password: null, verificationCode: null, token},
                                            });
                                            this.EmailHandler.sendVerificationEmail(doc.email, doc.verificationCode);
                                        } else {
                                            console.log(err);
                                            res.status(500).json({
                                                status: false,
                                                code: 400,
                                                message: err,
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
                    message: err,
                });
            }
        }
    }

    // LOGIN USER
    loginUser() {
        return (req, res) => {
            console.log('data', req.body)
            if (!req.body) {
                return res.status(400).send({
                    message: 'Content can not be empty!'
                });
            }
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
                        let token = this.jwt.sign(payload, `${USER_ACCESS_TOKEN_SECRET}`, {
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
                    message: err,
                });
            }
        }
    }

    getUserProfile() {
        return (req, res) => {
            try {
                if (!req.body) {
                    return res.status(400).send({
                        message: 'Content can not be empty!'
                    });
                }
                this.User.findOne({ _id: req.params.id }, (err, user) => {
                    if (!user) {
                        return res.json({
                            code: 404,
                            message: "User not found",
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User Profile",
                        user: user,
                    });
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: err,
                });
            }
        }
    }

    updateUserImage() {
        return (req, res) => {
            try {
                this.User.findOne({ _id: req.user.id }, (err, user) => {
                    if (!user) {
                        return res.json({
                            code: 404,
                            message: "User not found",
                        });
                    }
                    if (req.files) {
                        user.profilePic = req.files[0].imagePath;
                    }
                    user.save((err, doc) => {
                        if (!err) {
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "User Image Updated",
                                user: doc,
                            });
                        } else {
                            console.log(err);
                            res.status(500).json({
                                status: false,
                                code: 500,
                                message: err,
                            });
                        }
                    });
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: err,
                });
            }
        }
    }

    updateUserProfile() {
        return (req, res) => {
            try {
                this.User.findOneAndUpdate({ _id: req.user.id }, req.body, { new: true }, (err, user) => {
                    if (!user) {
                        return res.json({
                            code: 404,
                            message: "User not found",
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User Profile Updated",
                        user: user,
                    });
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: err,
                });
            }
        }
    }

    updateUserPassword() {
        return (req, res) => {
            try {
                this.User.findOne({ _id: req.user.id }, (err, user) => {
                    if (!user) {
                        return res.json({
                            code: 404,
                            message: "User not found",
                        });
                    }

                    if (!req.body.oldPassword && !user.password) {
                        return res.json({
                            code: 404,
                            message: "Passwords missing",
                        });
                    }
                    if (this.bcrypt.compareSync(req.body.oldPassword, user.password)) {
                        let hashPassword = this.bcrypt.hashSync(req.body.newPassword, 10);
                        this.User.findOneAndUpdate({ _id: req.user.id }, { password: hashPassword }, { new: true }, (err, user) => {
                            if (!user) {
                                return res.json({
                                    code: 404,
                                    message: "User not found",
                                });
                            }
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "User Password Updated",
                                user: user,
                            });
                        });
                    } else {
                        return res.json({
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
                    message: err,
                });
            }
        }
    }

    updateUserEmail() {
        return (req, res) => {
            try {
                this.User.findOne({ _id: req.user.id }, (err, user) => {
                    if (!user) {
                        return res.json({
                            code: 404,
                            message: "User not found",
                        });
                    }
                    if (this.bcrypt.compareSync(req.body.password, user.password)) {
                        this.User.findOneAndUpdate({ _id: req.user.id }, { email: req.body.email }, { new: true }, (err, user) => {
                            if (!user) {
                                return res.json({
                                    code: 404,
                                    message: "User not found",
                                });
                            }
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "User Email Updated",
                                user: user,
                            });
                        });
                    } else {
                        return res.json({
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
                    message: err,
                });
            }
        }
    }

    updateUserPhone() {
        return (req, res) => {
            try {
                this.User.findOne({ _id: req.user.id }, (err, user) => {
                    if (!user) {
                        return res.json({
                            code: 404,
                            message: "User not found",
                        });
                    }
                    if (this.bcrypt.compareSync(req.body.password, user.password)) {
                        this.User.findOneAndUpdate({ _id: req.user.id }, { phone: req.body.phone }, { new: true }, (err, user) => {
                            if (!user) {
                                return res.json({
                                    code: 404,
                                    message: "User not found",
                                });
                            }
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "User Phone Updated",
                                user: user,
                            });
                        });
                    } else {
                        return res.json({
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
                    message: err,
                });
            }
        }
    }

    updateUserAddress() {
        return (req, res) => {
            try {
                this.User.findOne({ _id: req.user.id }, (err, user) => {
                    if (!user) {
                        return res.json({
                            code: 404,
                            message: "User not found",
                        });
                    }
                    this.User.findOneAndUpdate({ _id: req.user.id }, { address: req.body.address }, { new: true }, (err, user) => {
                        if (!user) {
                            return res.json({
                                code: 404,
                                message: "User not found",
                            });
                        }
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "User Address Updated",
                            user: user,
                        });
                    });
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: err,
                });
            }
        }
    }

    updateUserProfileImage() {
        return (req, res) => {
            try {
                this.User.findOne({ _id: req.user.id }, (err, user) => {
                    if (!user) {
                        return res.json({
                            code: 404,
                            message: "User not found",
                        });
                    }
                    this.User.findOneAndUpdate({ _id: req.user.id }, { profileImage: req.body.profileImage }, { new: true }, (err, user) => {
                        if (!user) {
                            return res.json({
                                code: 404,
                                message: "User not found",
                            });
                        }
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "User Profile Image Updated",
                            user: user,
                        });
                    });
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: err,
                });
            }
        }
    }

    // SEND VERIFICATION EMAIL
    sendVerificationEmail() {
        return (req, res) => {
            const { email } = req.body;
            this.User.findOne({ email: email }, (err, user) => {
                if ( !user ) {
                    return res.json({
                        status: false,
                        code: 404,
                        message: "User not found",
                    });
                }
                const subject = "Verify your email";
                const code = this.generateVerificationCode();
                this.EmailHandler.sendVerificationEmail({ email, subject, code });
                user.verificationCode = code;
                user.save((err, doc) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Verification code sent",
                            user: doc,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: err,
                        });
                    }
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
                                message: err,
                            });
                        }
                    });
                } else {
                    return res.json({
                        code: 404,
                        message: "Wrong verification code",
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
                    message: err.message,
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

    // Save Product in Cart 
    saveProductInCart = () => {
        return (req, res) => {
            try {
                this.User.findByIdAndUpdate(req.user.id, {
                    $push: {
                        cart: req.params.productId,
                    },
                }, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Product added to cart successfully",
                            user: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Product not added to cart",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Product not added to cart",
                });
            }
        }
    }

    // Remove Product from Cart
    removeProductFromCart = () => {
        return (req, res) => {
            try {
                this.User.findByIdAndUpdate(req.user.id, {
                    $pull: {
                        cart: req.params.productId,
                    },
                }, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Product removed from cart successfully",
                            user: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Product not removed from cart",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Product not removed from cart",
                    error: err
                });
            }
        }
    }

    // Get Cart Data
    getCartData = () => {
        return (req, res) => {
            try {
                this.User.findById(req.user.id, (err, data) => {
                    if (!err) {
                        if (data.cart === undefined || data.cart.length === 0) {
                            return res.status(200).json({
                                status: true,
                                code: 200,
                                message: "Cart is empty",
                                cart: [],
                            });
                        }
                        console.log(data.cart);

                        const final = async () => {
                            var cart = [];
                            var numb = 0;

                            await data.cart.map(async (item) => {
                                var product = await this.Product.findById(item);
                                numb = numb + 1;

                                if (product){
                                    cart.push(product === null);
                                }

                                if (numb === data.cart.length) {
                                    res.status(200).json({
                                        status: true,
                                        code: 200,
                                        message: "Cart data loaded successfully",
                                        cart,
                                    });
                                }
                            });
                        }

                        return final();
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Cart data not loaded",
                        });
                    }
                });

            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Cart data not loaded",
                });
            }
        }
    }



    generateVerificationCode = () => {
        return Math.floor(Math.random() * 1000000);
    }
};



