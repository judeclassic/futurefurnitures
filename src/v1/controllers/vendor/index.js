//@ts-check

class ServiceController {
    constructor({ service, Vendor, User, EmailHandler, PaymentHandler, bcrypt, jwt, Logger }) {
        this.Service = service;
        this.Vendor = Vendor;
        this.User = User;
        this.EmailHandler = EmailHandler;
        this.paymentHandler = new PaymentHandler();
        this.bcrypt = bcrypt;
        this.jwt = jwt;
        this.logger = new Logger();
    }

    test() {
        console.log(this.bcrypt.hashSync("123456", 10));
    }

    getServices = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const services = await this.Service.find({});
                if (services) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Services fetched successfully",
                        services: services.map(service => ({...service._doc, vendor: undefined, user: undefined})),
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Services fetch failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Services fetch failed",
                });
            });
        }
    }

    getService = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const service = await this.Service.findById(id);
                if (service) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Service fetched successfully",
                        service: {...service._doc, vendor: undefined, user: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service fetch failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Service fetch failed",
                });
            });
        }
    }

    updateService = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const service = await this.Service.findByIdAndUpdate(id, req.body, {
                    new: true,
                });
                if (service) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Service updated successfully",
                        service: {...service._doc, vendor: undefined, user: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service update failed",
                    }); 
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Service update failed",
                });
            });
        }
    }

    deleteService = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const service = await this.Service.findByIdAndDelete(id);
                if (service) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Service deleted successfully",
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service delete failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Service delete failed",
                });
            });
        }
    }

    approveService = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const service = await this.Service.findById(id);
                if (!service) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service not found",
                    });
                }
                const user = await this.User.findById(service.user);
                if (!user) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "User not found",
                    });
                }
                const vendor = await this.Vendor.findById(service.vendor);
                if (!vendor) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor not found",
                    });
                }
                const payment = await this.paymentHandler.createPayment(service.amount, vendor.email, user.email);
                if (!payment) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Payment failed",
                    });
                }
                const updatedService = await this.Service.findByIdAndUpdate(id, {
                    status: "approved",
                    payment: payment._id,
                }, {
                    new: true,
                });
                if (!updatedService) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service update failed",
                    });
                }
                const email = await this.EmailHandler.sendEmail(
                    vendor.email,
                    "Service Approved",
                    `Your service for ${service.amount} has been approved.`,
                );
                if (email) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Service approved successfully",
                        service: {...updatedService._doc, vendor: undefined, user: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service approval failed",
                    });
                }
            }
        }
    }

    rejectService = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const service = await this.Service.findById(id);
                if (!service) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service not found",
                    });
                }
                const user = await this.User.findById(service.user);
                if (!user) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "User not found",
                    });
                }
                const vendor = await this.Vendor.findById(service.vendor);
                if (!vendor) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor not found",
                    });
                }
                const email = await this.EmailHandler.sendEmail(
                    vendor.email,
                    "Service Rejected",
                    `Your service for ${service.amount} has been rejected.`,
                );
                if (email) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Service rejected successfully",
                        service: {...service._doc, vendor: undefined, user: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service rejection failed",
                    });
                }
            }
        }
    }
    
    cancelService = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const service = await this.Service.findById(id);
                if (!service) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service not found",
                    });
                }
                const user = await this.User.findById(service.user);
                if (!user) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "User not found",
                    });
                }
                const vendor = await this.Vendor.findById(service.vendor);
                if (!vendor) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor not found",
                    });
                }
                const email = await this.EmailHandler.sendEmail(
                    vendor.email,
                    "Service Cancelled",
                    `Your service for ${service.amount} has been cancelled.`,
                );
                if (email) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Service cancelled successfully",
                        service: {...service._doc, vendor: undefined, user: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Service cancellation failed",
                    });
                }
            }
        }
    }
}



export default class VendorController extends ServiceController {
    constructor({ EmailHandler, PaymentHandler, User, service, Vendor, Logger, bcrypt,jwt }) {
        super({ service, Vendor, User, EmailHandler, PaymentHandler, bcrypt, jwt, Logger });
        this.vendor = Vendor;
        this.logger = new Logger();
        this.User = User;
        this.service = service;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
        this.emailService = EmailHandler;
        this.paymentHandler = new PaymentHandler();
    }

    registerVendor = () => {
        return (req, res) => {
            const run = async () => {
                const {
                    email,
                    name,
                    phone,
                    address,
                    city,
                    state,
                    country,
                    primary_service,
                    secondary_service,
                    crew_size,
                    description,
                    crew_image,
                    place_of_training,
                    years_of_experience,
                    license_source,
                } = req.body;
                const password = this.bcrypt.hashSync(req.body.password, 10);

                const vendorWithEmail = await this.vendor.findOne({ email });

                if (vendorWithEmail) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor with email already exists",
                    });
                }

                const vendorWithPhone = await this.vendor.findOne({ phone });

                if (vendorWithPhone) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor with phone already exists",
                    });
                }

                const vendor = await this.vendor.create({
                    email,
                    password,
                    name,
                    phone,
                    address,
                    city,
                    state,
                    country,
                    primary_service,
                    secondary_service,
                    crew_size,
                    description,
                    crew_image,
                    place_of_training,
                    years_of_experience,
                    license_source,
                });
                
                if (vendor) {
                    return res.status(201).json({
                        status: true,
                        code: 201,
                        message: "Vendor registered successfully",
                        vendor: {...vendor._doc, password: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor registration failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Vendor registration failed",
                });
            }
            );
        }
    }

    loginVendor = () => {
        return (req, res) => {
            const run = async () => {
                const { email, password } = req.body;
                const vendor = await this.vendor.findOne({
                    email,
                });
                if (!vendor) {
                    return res.status(404).json({
                        status: false,
                        code: 404,
                        message: "Vendor not found",
                    });
                } else {
                    const isValid = await this.bcrypt.compare(password, vendor.password);
                    if (!isValid) {
                        return res.status(401).json({
                            status: false,
                            code: 401,
                            message: "Invalid credentials",
                        });
                    } else {
                        const token = await this.jwt.sign({
                            email: vendor.email,
                            id: vendor._id,
                            role: vendor.role,
                        }, process.env.USER_ACCESS_TOKEN_SECRET, {
                            expiresIn: "1h",
                        });
                        return res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Login successful",
                            vendor: {...vendor._doc, password: undefined, token},
                        });
                    }
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Vendor login failed",
                });
            }
            );
        }
    }

    getVendors = () => {
        return (req, res) => {
            const run = async () => {
                const vendors = await this.vendor.find({});
                if (vendors) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Vendors fetched successfully",
                        vendors: vendors.map(vendor => ({...vendor._doc, password: undefined})),
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendors fetch failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Vendors fetch failed",
                });
            }
            );
        }
    }

    getVendor = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const vendor = await this.vendor.findById(id);
                if (vendor) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Vendor fetched successfully",
                        vendor: {...vendor._doc, password: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor fetch failed",
                    });
                }
            }

            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Vendor fetch failed",
                });
            });
        }
    }

    updateVendor = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const vendor = await this.vendor.findByIdAndUpdate(id, req.body, {
                    new: true,
                });
                if (vendor) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Vendor updated successfully",
                        vendor: {...vendor._doc, password: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor update failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Vendor update failed",
                });
            });
        }
    }

    deleteVendor = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const vendor = await this.vendor.findByIdAndDelete(id);
                if (vendor) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Vendor deleted successfully",
                        vendor: {...vendor._doc, password: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor delete failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Vendor delete failed",
                });
            });
        }
    }

    payVendor = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const vendor = await this.vendor.findById(id);

                if (!vendor) {
                    return res.status(404).json({
                        status: false,
                        code: 404,
                        message: "Vendor not found",
                    });
                }
                const payment = await this.paymentHandler.payForService(vendor._doc, req.body);

                if (!payment && !payment.isSuccess) {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Payment failed",
                    });
                }
                const updatedVendor = await this.vendor.findByIdAndUpdate(id, {
                    $inc: {
                        balance: +req.body.amount,
                    },
                }, {
                    new: true,
                });
                if (updatedVendor) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Vendor paid successfully",
                        vendor: {...updatedVendor._doc, password: undefined},
                    });
                } else {
                    return res.status(500).json({
                        status: false,
                        code: 500,
                        message: "Vendor payment failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Vendor payment failed",
                });
            });
        }
    }


    requestVendorService = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const vendor = await this.vendor.findById(id);
                if (!vendor) {
                    return res.status(404).json({
                        status: false,
                        code: 404,
                        message: "Vendor not found",
                    });
                } else {
                    const service = await this.service.create({
                        vendor: vendor._id,
                        user: req.user.id,
                        status: "pending",
                        price: req.body.price,
                    });
                    if (service) {
                        return res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Service sent successfully",
                            service,
                        });
                    } else {
                        return res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Service sent failed",
                        });
                    }
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Service sent failed",
                });
            });
        }
    }

    getVendorServices = () => {
        /**
         * @param {object} res
         * @param {object} req
         *  @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const vendor = await this.vendor.findById(id);
                if (!vendor) {
                    return res.status(404).json({
                        status: false,
                        code: 404,
                        message: "Vendor not found",
                    });
                } else {
                    const services = await this.service.find({vendor: vendor._id});
                    if (services) {
                        return res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Services fetched successfully",
                            services: services.map(service => ({...service._doc, vendor: undefined, user: undefined})),
                        });
                    } else {
                        return res.status(500).json({
                            status: false,
                            code: 500,
                            message: "Services fetch failed",
                        });
                    }
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Services fetch failed",
                });
            });
        }
    }


    getPaidVendorService = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const vendor = await this.vendor.findById(id, {
                    _id: 0,
                    services: 1,
                    });
                if (!vendor) {
                    return res.status(404).json({
                        status: false,
                        code: 404,
                        message: "Vendor not found",
                    });
                } else {
                    const services = await this.service.find({vendor: vendor._id, status: "paid"});
                    if (services) {
                        return res.status(200).json({
                            status: true,
                            code: 200,
                            message: "Services fetched successfully",
                            services: services.map(service => ({...service._doc})),
                        });
                    }
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(500).json({
                    status: false,
                    code: 500,
                    message: "Services fetch failed",
                });
            });
        }
    }
}
