// @ts-check

export default class Subscription{
    constructor({ Subscriptions, emailHandler }){
        this.Subscriptions = Subscriptions;
        this.emailHandler = emailHandler;
    }

    async subscribe ( req, res ) {
        if (req.body) {
            const { email, name } = res.body;
            
            this.Subscriptions.findOne({ email },
                function (err, result) {
                    if (result) {
                        res.status(400).json({
                            status: false,
                            message: "Email " + req.body.email + ' is already subscribed',
                            code: 400
                        });
                    }else{
                        this.EmailHandler.sendSubscriptionEmail({
                            email,
                            subject: 'Subscription',
                            name
                        });
                        res.status(200).json({
                            status: true,
                            message: "Subscription Successful",
                            code: 200
                        });
                    }
                }
            );
        } else {
            res.status(400).json({
                status: false,
                message: "Missing Parameter",
                code: 400
            });
        }
    }

    async unSubscribe (req, res)  {
        console.log(req.body);
        this.Subscriptions.findOneAndRemove(
            { "email": req.body.email },
            (err, user) => {
                if (user == null) {
                    res.status(400).json({
                        status: false,
                        message: "Email not found",
                        code: 400,
                    });
                } else {
                    res.status(200).json({
                        status: false,
                        message: 'Unsubscribed Successful',
                        code: 200
                    });
                }
            }
        );
    }
}