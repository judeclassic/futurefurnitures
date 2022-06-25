//@ts-check
import ProductController from "./product";
import Transaction from "./finance";

const USER_ACCESS_TOKEN_SECRET = process.env.USER_ACCESS_TOKEN_SECRET || 'rirriurh849g498gyh4iggntfjnvo7';

export default class SellerController extends ProductController {

    constructor({ Seller, EmailHandler, SellerProduct, Order, bcrypt, jwt }) {
        super({ Product: SellerProduct, Order, Seller, EmailHandler });
        this.Seller = Seller;
        this.EmailHandler = EmailHandler;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
    }

    test() {
        console.log(this.bcrypt.hashSync("123456", 10));
    }

    // REGISTER USER
    registerSeller = () => {  
        return (req, res) => {
            try{
                let hashPassword = this.bcrypt.hashSync(req.body.password, 10);
                let code = this.generateVerificationCode();

                this.Seller.findOne({
                    email: req.body.email,
                }, (err, seller) => {
                    if (seller) {
                        return res.json({
                            success: false,
                            code: 400,
                            message: "Email already exists",
                        });
                    } else {
                        this.Seller.findOne({
                            phone: req.body.phone,
                            }, (err, seller) => {
                                if (seller) {
                                    return res.json({
                                        success: false,
                                        code: 400,
                                        message: "Phone number already exists",
                                    });
                                } else {
                                    let seller = new this.Seller({
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
                                    seller.save((err, doc) => {
                                        if (!err) {
                                            res.status(200).json({
                                                status: true,
                                                code: 200,
                                                message: "Seller Registered",
                                                seller: {...doc._doc, password: null, verificationCode: null},
                                            });
                                            // this.EmailHandler.sendVerificationEmail(doc.email, doc.verificationCode);
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
    loginSeller() {
        return (req, res) => {
            try {
                this.Seller.findOne({ email: req.body.email }, (err, seller) => {
                    if (!seller) {
                        return res.json({
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                    if (this.bcrypt.compareSync(req.body.password, seller.password)) {
                        const payload = {
                            id: seller._id,
                            firstName: seller.firstName,
                            lastName: seller.lastName,
                            email: seller.email,
                            isVerified: seller.isVerified,
                            isAdmin: seller.isAdmin,
                            isActive: seller.isActive,
                            isDeleted: seller.isDeleted,
                            createDate: seller.createDate,
                            updateDate: seller.updateDate,
                            role: seller.role,
                            status: seller.status,
                            address: seller.address,
                            phone: seller.phone,
                        };
                        let token = this.jwt.sign(payload, `${USER_ACCESS_TOKEN_SECRET}`, {
                            // expiresIn: 1000 * 60 * 60 * 24 * 7,
                        });
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Seller Logged In",
                            seller: {
                                ...seller._doc,
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
                    message: "Internal Server Error",
                });
            }
        }
    }

    getSellerProfile() {
        return (req, res) => {
            try {
                this.Seller.findOne({ _id: req.params.id }, (err, seller) => {
                    if (!seller) {
                        return res.json({
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Seller Profile",
                        seller: seller,
                    });
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Internal Server Error",
                });
            }
        }
    }

    updateSellerImage() {
        return (req, res) => {
            try {
                this.Seller.findOne({ _id: req.user.id }, (err, seller) => {
                    if (!seller) {
                        return res.json({
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                    seller.profilePic = req.files[0].imagePath;
                    seller.save((err, doc) => {
                        if (!err) {
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "Seller Image Updated",
                                seller: doc,
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
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Internal Server Error",
                });
            }
        }
    }

    updateSellerProfile() {
        return (req, res) => {
            try {
                this.Seller.findOneAndUpdate({ _id: req.user.id }, req.body, { new: true }, (err, seller) => {
                    if (!seller) {
                        return res.json({
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                    res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Seller Profile Updated",
                        seller: seller,
                    });
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Internal Server Error",
                });
            }
        }
    }

    updateSellerPassword() {
        return (req, res) => {
            try {
                this.Seller.findOne({ _id: req.user.id }, (err, seller) => {
                    if (!seller) {
                        return res.json({
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                    if (this.bcrypt.compareSync(req.body.oldPassword, seller.password)) {
                        let hashPassword = this.bcrypt.hashSync(req.body.newPassword, 10);
                        this.Seller.findOneAndUpdate({ _id: req.user.id }, { password: hashPassword }, { new: true }, (err, seller) => {
                            if (!seller) {
                                return res.json({
                                    code: 404,
                                    message: "Seller not found",
                                });
                            }
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "Seller Password Updated",
                                seller: seller,
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
                    message: "Internal Server Error",
                });
            }
        }
    }

    updateSellerEmail() {
        return (req, res) => {
            try {
                this.Seller.findOne({ _id: req.user.id }, (err, seller) => {
                    if (!seller) {
                        return res.json({
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                    if (this.bcrypt.compareSync(req.body.password, seller.password)) {
                        this.Seller.findOneAndUpdate({ _id: req.user.id }, { email: req.body.email }, { new: true }, (err, seller) => {
                            if (!seller) {
                                return res.json({
                                    code: 404,
                                    message: "Seller not found",
                                });
                            }
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "Seller Email Updated",
                                seller: seller,
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
                    message: "Internal Server Error",
                });
            }
        }
    }

    updateSellerPhone() {
        return (req, res) => {
            try {
                this.Seller.findOne({ _id: req.user.id }, (err, seller) => {
                    if (!seller) {
                        return res.json({
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                    if (this.bcrypt.compareSync(req.body.password, seller.password)) {
                        this.Seller.findOneAndUpdate({ _id: req.user.id }, { phone: req.body.phone }, { new: true }, (err, seller) => {
                            if (!seller) {
                                return res.json({
                                    code: 404,
                                    message: "Seller not found",
                                });
                            }
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "Seller Phone Updated",
                                seller: seller,
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
                    message: "Internal Server Error",
                });
            }
        }
    }

    updateSellerAddress() {
        return (req, res) => {
            try {
                this.Seller.findOne({ _id: req.user.id }, (err, seller) => {
                    if (!seller) {
                        return res.json({
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                    this.Seller.findOneAndUpdate({ _id: req.user.id }, { address: req.body.address }, { new: true }, (err, seller) => {
                        if (!seller) {
                            return res.json({
                                code: 404,
                                message: "Seller not found",
                            });
                        }
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Seller Address Updated",
                            seller: seller,
                        });
                    });
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Internal Server Error",
                });
            }
        }
    }

    updateSellerProfileImage() {
        return (req, res) => {
            try {
                this.Seller.findOne({ _id: req.user.id }, (err, seller) => {
                    if (!seller) {
                        return res.json({
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                    this.Seller.findOneAndUpdate({ _id: req.user.id }, { profileImage: req.body.profileImage }, { new: true }, (err, seller) => {
                        if (!seller) {
                            return res.json({
                                code: 404,
                                message: "Seller not found",
                            });
                        }
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Seller Profile Image Updated",
                            seller: seller,
                        });
                    });
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Internal Server Error",
                });
            }
        }
    }

    // SEND VERIFICATION EMAIL
    sendVerificationEmail() {
        return (req, res) => {
            const { email } = req.body;
            this.Seller.findOne({ email: email }, (err, seller) => {
                if ( !seller ) {
                    return res.json({
                        status: false,
                        code: 404,
                        message: "Seller not found",
                    });
                }
                const subject = "Verify your email";
                const code = this.generateVerificationCode();
                this.EmailHandler.sendVerificationEmail({ email, subject, code });
                seller.verificationCode = code;
                seller.save((err, doc) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Verification code sent",
                            seller: doc,
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
            });
        }
    }

    // VERIFY USER EMAIL
    verifySellerEmail() {
        return (req, res) => {
            this.Seller.findOne({ email: req.body.email }, (err, seller) => {
                if (!seller) {
                    return res.json({
                        code: 404,
                        message: "Seller not found",
                    });
                }
                if (seller.verificationCode === req.body.verificationCode) {
                    seller.isVerified = true;
                    seller.save((err, doc) => {
                        if (!err) {
                            res.status(200).json({
                                status: true,
                                code: 200,
                                message: "Seller Verified",
                                seller: doc,
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
    loadAllSellers = () => {
        return (req, res) => {
            try {
                this.Seller.find({}, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Seller data loaded successfully",
                            sellers: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Error loading seller data",
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
    getSingleSellerData = () => {
        return (req, res) => {
            try {
                this.Seller.findById(req.params.id, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Seller data loaded successfully",
                            seller: data,
                        });
                    } else {
                        console.log(err);
                        res.status(404).json({
                            status: false,
                            code: 404,
                            message: "Seller not found",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Seller not found",
                });
            }
        };
    };

    //  EDIT SINGLE USER DATA
    editSingleSellerData = () => {
        return (req, res) => {
            try {
                console.log(req.body);
                this.Seller.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Seller data updated successfully",
                            seller: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Seller data not updated",
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Seller data not updated",
                });
            }
        };
    };

    // RESET PASSWORD
    resetPassword = () => {
        return (req, res) => {
            try {
                this.Seller.findByIdAndUpdate(req.body.id, {
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

    logOutSeller = () => {
        return (req, res) => {
            try {
                this.Seller.findByIdAndUpdate(req.body.id, {
                    isActive: false,
                }, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Seller logged out successfully",
                            logOutSeller: data,
                        });
                    } else {
                        console.log(err);
                        res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Seller not logged out",
                        });
                    }
                })
            } catch (err) {
                console.log(err);
                res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Seller not logged out",
                });
            }
        };
    }

    generateVerificationCode = () => {
        return Math.floor(Math.random() * 1000000);
    }
};
