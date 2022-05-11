//@ts-check

const router  = ({ Router, SubscriptionController, Subscription, EmailHandler }) => {
    const router = Router();

    const {subscribe, unSubscribe} = new SubscriptionController({ Subscription, EmailHandler });

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