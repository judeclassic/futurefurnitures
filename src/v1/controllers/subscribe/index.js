
export default class Subscription{
    constructor({Subscriptions, emailHandler, messages}){
        this.Subscriptions = Subscriptions;
        this.emailHandler = emailHandler;
    }

    async subscribe ( req, res ) {
        if (req.body) {
            const { email } = res.body;
            
            Subscriptions.findOne({ email: req.body.email },
                function (err, result) {
                    if (result) {
                        res.status(400).json({
                            status: false,
                            message: "Email " + req.body.email + ' is already subscribed',
                            code: 400
                        });
                    }else{
                        emailHandler.send({
                            email,
                            message: messages.email.subscribe
                        }).then((result) => {
                            res.status(200).json({
                                status: true,
                                message: "Subscription Successful",
                                code: 200
                            });
                        }).catch((err) => {
                            res.status(401).json({
                                status: false,
                                message: "Error in Sending Message",
                                code: 401
                            });
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
        Subscriptions.findOneAndRemove(
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