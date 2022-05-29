export default class Authenticate {

    constructor({User, bcrypt, jwt}) {
        this.User = User;
        this.bcrypt = bcrypt;
        this.jwt = jwt;
    }

    verifyUserToken = () => {
        return (req, res, next) => {
            const run = async (next) => {
                const bearerToken = req.headers["authorization"];
                if (bearerToken === null || bearerToken === undefined) {
                    return res.json({
                        status: false,
                        code: 401,
                        message: 'Authentication Failed'
                    });
                }
                try {
                    const token = bearerToken.split(" ",2)[1];
                    const decoded = await this.jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET);
                    req.user = decoded;
                    // console.log('User', req.user);
                    return next();
                }
                catch (error) {
                    // console.log("error", error);
                    return res.json({
                        status: false,
                        code: 403,
                        message: 'Authentication Failed'
                    });
                }
            }

            return run(next);
        }
        
    }

    verifyAdminToken = () => {
        return (req, res, next) => {
            const run = async () => {
                const token = req.headers["authorization"];
                if (token == null || token == undefined) {
                    return res.json({
                        status: false,
                        code: 401,
                        message: 'Authentication Failed'
                    });
                }
                try {
                    const decoded = await this.jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET);
                    req.user = decoded;
                    if (req.user.user.role !== "admin") {
                        return res.json({
                            status: false,
                            code: 403,
                            message: 'Authentication Failed'
                        });
                    }
                    return next();
                }
                catch (error) {
                    return res.json({
                        status: false,
                        code: 403,
                        message: 'Authentication Failed'
                    });
                }
            }

            return run();
        }
    }

    verifySellerToken = () => {
        return (req, res, next) => {
            const run = async () => {
                const bearerToken = req.headers["authorization"];
                if (bearerToken === null || bearerToken === undefined) {
                    return res.json({
                        status: false,
                        code: 401,
                        message: 'Authentication Failed'
                    });
                }
                try {
                    const token = bearerToken.split(" ",2)[1];
                    const decoded = await this.jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET);
                    req.user = decoded;
                    return next();
                }
                catch (error) {
                    // console.log(error);
                    return res.json({
                        code: 403,
                        message: 'Authentication Failed'
                    });
                }
            }

            return run();
        }
    }

    clickVerification = () => {
        return (req, res, next) => {
            const run = async () => {
                const token = req.params.id;
                if (token == null || token == undefined) {
                    return res.json({
                        status: false,
                        code: 401,
                        message: 'Authentication Failed'
                    });
                }

                try {
                    const decoded = await this.jwt.verify(token, process.env.CLICK_ACCESS_TOKEN_SECRET);
                    req.user = decoded;
                    return next();
                }
                catch (error) {
                    return res.json({
                        status: false,
                        code: 403,
                        message: 'Link Expired'
                    });
                }
            }

            return run();
        }
    }
}


