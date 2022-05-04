const router  = ({ Router, SubscriptionController, Subscription, emailHandler, messages }) => {
    const router = Router();

    const {subscribe, unSubscribe} = new SubscriptionController({ Subscription, emailHandler, messages });

    //Subscribe Email
    router.post(
      "/subscribe",
      subscribe
    );

    router.get('/', (req, res) => {
        res.send("Welcome to The House Interior");
    });

    //Unsubscribe Email
    router.post(
      "/unsubscribe",
      unSubscribe
    );

    return router;
}


export default router;