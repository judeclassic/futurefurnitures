//@ts-check


const USER_ACCESS_TOKEN_SECRET = process.env.USER_ACCESS_TOKEN_SECRET || 'rirriurh849g498gyh4iggntfjnvo7';

export default class ServiceController {
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

    requestServices = () => {
        return (req, res) => {
            const run = async () => {
                const { id } = req.user;
                const { category, discription, price, address, date, time } = req.body;
                const photos = req.files.imagePath;
                const user = await this.User.findById(id);

                const services = await this.Service({
                    category,
                    photos,
                    payment: {price},
                    discription,
                    address,
                    date,
                    status: 'static',
                    time,
                    userId: id,
                    user: {
                        name: user.name,
                        email: user.email,
                    }
                });
                await services.save();
                if (services) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Services successfully created",
                        services,
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Services creation failed",
                    });
                }
            }
            run().catch((err) => {
                console.log(err);
                this.logger.error(err);
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "Services creation failed",
                });
            });
        }
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
                        services,
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Services fetch failed",
                    });
                }
            }
            run().catch((err) => {
                console.log(err);
                this.logger.error(err);
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "Services fetch failed",
                });
            });
        }
    }

    getRequestedServices = () => {
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
                        service: {...service._doc},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Service fetch failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "Service fetch failed",
                });
            });
        }
    }

    getUserRequestedServices = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { userId } = req.params;
                console.log(userId)
                // const user = await this.User.findById();
                const service = await this.Service.find({userId});
                if (service) {
                    if (service.length === 0){
                        return res.status(201).json({
                            status: true,
                            code: 201,
                            message: "User do not have any services",
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Service fetched successfully",
                        service,
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Service fetch failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(403).json({
                    status: false,
                    code: 403,
                    message: "Service fetch failed",
                });
            });
        }
    }

    getVendorProcessedServices = () => {
        /**
         * @param {object} res
         * @param {object} req
         * @returns {object}
         */

        return (req, res) => {
            const run = async () => {
                const { id } = req.params;
                const service = await this.Service.find({user: id});
                if (service) {
                    return res.status(200).json({
                        status: true,
                        code: 200,
                        message: "Service fetched successfully",
                        service: {...service._doc, vendor: undefined, user: undefined},
                    });
                } else {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Service fetch failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(403).json({
                    status: false,
                    code: 403,
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
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Service update failed",
                    }); 
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(403).json({
                    status: false,
                    code: 403,
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
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Service delete failed",
                    });
                }
            }
            run().catch((err) => {
                this.logger.error(err);
                return res.status(403).json({
                    status: false,
                    code: 403,
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
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Service not found",
                    });
                }
                const user = await this.User.findById(service.user);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }
                const vendor = await this.Vendor.findById(service.vendor);
                if (!vendor) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Vendor not found",
                    });
                }
                const payment = await this.paymentHandler.createPayment(service.amount, vendor.email, user.email);
                if (!payment) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
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
                    return res.status(403).json({
                        status: false,
                        code: 403,
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
                    return res.status(403).json({
                        status: false,
                        code: 403,
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
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Service not found",
                    });
                }
                const user = await this.User.findById(service.user);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }
                const vendor = await this.Vendor.findById(service.vendor);
                if (!vendor) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
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
                    return res.status(403).json({
                        status: false,
                        code: 403,
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
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Service not found",
                    });
                }
                const user = await this.User.findById(service.user);
                if (!user) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "User not found",
                    });
                }
                const vendor = await this.Vendor.findById(service.vendor);
                if (!vendor) {
                    return res.status(403).json({
                        status: false,
                        code: 403,
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
                    return res.status(403).json({
                        status: false,
                        code: 403,
                        message: "Service cancellation failed",
                    });
                }
            }
        }
    }
}