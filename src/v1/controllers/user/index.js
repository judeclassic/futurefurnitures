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
                                    cart.push(product);
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

    moveProductToSave = () => {
        return (req, res) => {
            try {
                this.User.findByIdAndUpdate(req.user.id, {
                    $push: {
                        savedProducts: req.params.productId,
                    },
                    $pull: {
                        cart: req.params.productId,
                    },
                }, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Product added to your saved products successfully",
                            user: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Product could not be saved",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Product could not be saved",
                });
            }
        }
    }

    moveProductToCart = () => {
        return (req, res) => {
            try {
                this.User.findByIdAndUpdate(req.user.id, {
                    $push: {
                        cart: req.params.productId,
                    },
                    $pull: {
                        savedProducts: req.params.productId,
                    },
                }, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Product added to your cart successfully",
                            user: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Product could not be cart",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Product could not be saved",
                });
            }
        }
    }

    // Get Cart Data
    getSavedProducts = () => {
        return (req, res) => {
            try {
                this.User.findById(req.user.id, (err, data) => {
                    if (!err) {
                        if (data.savedProducts === undefined || data.savedProducts.length === 0) {
                            return res.status(200).json({
                                status: true,
                                code: 200,
                                message: "Cart is empty",
                                products: [],
                            });
                        }

                        const final = async () => {
                            var savedProducts = [];
                            var numb = 0;

                            await data.savedProducts.map(async (item) => {
                                var product = await this.Product.findById(item);
                                numb = numb + 1;

                                if (product){
                                    savedProducts.push(product);
                                }

                                if (numb === data.cart.length) {
                                    res.status(200).json({
                                        status: true,
                                        code: 200,
                                        message: "Cart data loaded successfully",
                                        products: savedProducts,
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

    createShippingInfo = ()=> {
        return (req, res) => {
            const run = async () => {
                try{
                    const { id } = req.user;
                    const { firstName, lastName, email, phone, address, city, state, country, postalCode, defaultLocation } = req.body;
                    if (!address || !city || !state || !country || !postalCode) {
                        res.status(403).json({
                            code: 403,
                            status: false,
                            message: 'Imcomplete data please check and update data'
                        });
                        return;
                    }
                    console.log(defaultLocation);
                    if (defaultLocation) {
                        const user = await this.User.findById(id);
                        var newLocations = [];
                        for (var l = 0; l < user.shipingInformations; l++) {
                            let location = {...user.shipingInformations[l], defaultLocation: false};
                            newLocations.push(location);
                        }
                        user.shipingInformations = newLocations;
                        await user.save();
                    }

                    const user = await this.User.findByIdAndUpdate(id, {
                        $push: {
                            shipingInformations: { firstName, lastName, email, phone, address, city, state, country, postalCode, defaultLocation }
                        }
                    });

                    console.log('location', user.shipingInformations)

                    if (!user) {
                        res.status(403).json({
                            code: 403,
                            status: false,
                            message: 'Unable to update of create new location'
                        });
                        return;
                    }

                    res.status(200).json({
                        code: 200,
                        status: true,
                        message: 'Adding of location was successful',
                        shipingInformations: user.shipingInformations || []
                    });

                    return;
                } catch (err) {
                    res.status(500).json({
                        code: 403,
                        status: false,
                        message: err
                    });
                }
            }

            run();
        }
    }

    updateShippingInfo = ()=> {
        return (req, res) => {
            const run = async ()=> {
                try{
                    const { id } = req.user;
                    
                    const user = await this.User.findById(id);

                    var theLocation = user.shipingInformations.find((location)=> location.id === req.params.id);
                    theLocation = {...theLocation, ...req.body};
                    var otherLocations = user.shipingInformations.filter((location)=> location.id !== req.params.id);
                    otherLocations.push(theLocation);
                    user.locations =  otherLocations;

                    if (req.body.defaultLocation && req.body.defaultLocation === true ) {
                        var newLocations = [];
                        for (var l = 0; l < user.shipingInformations; l++) {
                            let location = {...user.shipingInformations[l], defaultLocation: false};
                            newLocations.push(location);
                        }
                        user.shipingInformations = newLocations;
                    }

                    await user.save();

                    if (!user) {
                        res.status(403).json({
                            code: 403,
                            status: false,
                            message: 'Unable to update of create new location'
                        });
                        return;
                    }

                    res.status(200).json({
                        code: 200,
                        status: false,
                        message: 'Updating of Products was successful',
                        shipingInformations: user.shipingInformations
                    });

                    return;
                } catch (err) {
                    res.status(500).json({
                        code: 403,
                        status: false,
                        message: err
                    });
                }
            }
        }
    }

    getShippingInfo = ()=> {
        return (req, res) => {
            const run = async ()=> {
                try{
                    const { id } = req.user;
                    
                    const user = await this.User.findById(id);

                    if (!user) {
                        res.status(403).json({
                            code: 403,
                            status: false,
                            message: 'Unable to get of create new location'
                        });
                        return;
                    }

                    res.status(200).json({
                        code: 200,
                        status: false,
                        message: 'Fetching of Products was successful',
                        shipingInformations: user.shipingInformations
                    });

                    return;
                } catch (err) {
                    res.status(500).json({
                        code: 403,
                        status: false,
                        message: err
                    });
                }
            }
        }
    }

    deleteShippingInfo = ()=> {
        return (req, res) => {
            const run = async ()=> {
                try{
                    const { id } = req.params;
                    
                    const user = await this.User.findByIdAndUpdate(req.user.id, {
                        $push: {
                            shipingInformations: { id }
                        }
                    });

                    if (!user) {
                        res.status(403).json({
                            code: 403,
                            status: false,
                            message: 'Unable to update of create new location'
                        });
                        return;
                    }

                    res.status(200).json({
                        code: 200,
                        status: false,
                        message: 'Updating of Products was successful',
                        shipingInformations: user.shipingInformations
                    });

                    return;
                } catch (err) {
                    res.status(500).json({
                        code: 403,
                        status: false,
                        message: err
                    });
                }
            }
        }
    }

    addPaymentCard = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user
                const {
                    name,
                    number,
                    cvv,
                    exp
                } = req.body;

                if ( !name || !number || !cvv || !exp ) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Please enter complete details name, number, cvv and exp",
                    });
                }

                const newNumber = await this.jwt.sign({card: number}, USER_ACCESS_TOKEN_SECRET);

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }
                const updatedUser = await this.User.findByIdAndUpdate(id, {
                    $push: {
                        cardInfo: {
                            name,
                            number: newNumber,
                            cvv,
                            exp
                        }
                    }
                });
                if (updatedUser) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User Card added successfully updated successfully",
                        user: {...updatedUser._doc, password: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User Card update failed",
                    });
                }
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User Card update failed",
                });
            });
        }
    }

    retrievePaymentCard = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }

                if (!user.cardInfo || user.cardInfo === []) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "No available Card",
                    });
                }

                const cards = []
                user.cardInfo.map(async (card, index)=> {
                    let decoded= await this.jwt.verify(card.number, USER_ACCESS_TOKEN_SECRET);
                    cards.push({...card._doc, number: decoded.card}); 
                    if ( index === (user.cardInfo.length -1) ){
                        return res.status(200).json({
                            status: true,
                            code: 200,
                            message: "User Card retrieved successfully",
                            cards,
                        });
                    }
                });
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User Card update failed",
                });
            });
        }
    }

    updatePaymentCard = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user

                var info = req.body;

                if (req.body.number) {
                    info.number = await this.jwt.sign({card: req.body.number}, USER_ACCESS_TOKEN_SECRET);
                }

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }

                user.cardInfo[info.cardId] = {...info};

                const updatedUser = await user.save();

                if (updatedUser) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User Card updated successfully",
                        user: {...updatedUser._doc, password: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User Card update failed",
                    });
                }
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User Card update failed",
                });
            });
        }
    }

    removePaymentCard = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }
                const updatedUser = await this.User.findByIdAndUpdate(id, {
                    $pull: {
                        cardInfo: {
                            id: req.body.cardId
                        }
                    }
                });
                if (updatedUser) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User Card added successfully",
                        user: {...updatedUser._doc, password: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User Card update failed",
                    });
                }
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User Card update failed",
                });
            });
        }
    }

    addWithPaypal = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user
                const {
                    email,
                } = req.body;

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }
                const updatedUser = await this.User.findByIdAndUpdate(id, {
                    $push: {
                        paypal: {
                            email,
                        }
                    }
                });
                if (updatedUser) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User paypal details updated successfully",
                        user: {...updatedUser._doc, password: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User paypal details update failed",
                    });
                }
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User paypal details update failed",
                });
            });
        }
    }

    updateWithPaypal = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user
                var info = info = req.body;

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }
                user.paypal[info.paypalId] = {...info};

                const updatedUser = await user.save();
                if (updatedUser) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User paypal details updated successfully",
                        user: {...updatedUser._doc, password: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User paypal details update failed",
                    });
                }
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User paypal details update failed",
                });
            });
        }
    }

    removeWithPaypal = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }

                const updatedUser = await this.User.findByIdAndUpdate(id, {
                    $pull: {
                        cardInfo: {
                            id: req.body.paypalId
                        }
                    }
                });

                if (updatedUser) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User paypal details updated successfully",
                        user: {...updatedUser._doc, password: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User paypal details update failed",
                    });
                }
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User paypal details update failed",
                });
            });
        }
    }

    addWithPayoneer = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user
                const {
                    email,
                } = req.body;

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }
                const updatedUser = await this.User.findByIdAndUpdate(id, {
                    $push: {
                        payoneer: {
                            email,
                        }
                    }
                });
                if (updatedUser) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User payoneer details updated successfully",
                        user: {...updatedUser._doc, password: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User payoneer details update failed",
                    });
                }
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User payoneer details update failed",
                });
            });
        }
    }

    updateWithPayoneer = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user
                var info = info = req.body;

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }
                user.payoneer[info.payoneerId] = {...info};

                const updatedUser = await user.save();
                if (updatedUser) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User payoneer details updated successfully",
                        user: {...updatedUser._doc, password: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User payoneer details update failed",
                    });
                }
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User payoneer details update failed",
                });
            });
        }
    }
    
    removeWithPayoneer = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user

                const user = await this.User.findById(id);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }

                const updatedUser = await this.User.findByIdAndUpdate(id, {
                    $pull: {
                        payoneer: {
                            id: req.body.payoneerId
                        }
                    }
                });

                if (updatedUser) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "User payoneer details updated successfully",
                        user: {...updatedUser._doc, password: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User paypayoneer details update failed",
                    });
                }
            }

            run().catch((err) => {
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "User paypal details update failed",
                });
            });
        }
    }

    generateVerificationCode = () => {
        return Math.floor(Math.random() * 1000000);
    }
};



