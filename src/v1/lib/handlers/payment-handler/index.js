
//@ts-check

export default class PaymentHandler {
    constructor() {}

    async purchaseProduct(user, details) {
        return {
            status: true,
            ammount: details.amount,
            email: details.email,
            card: details.card,
            currency: details.currency,
            description: details.description,
            name: details.name,
        };
    }

    async payForService(user) {
        return user;
    }

    async purchaseProductWithPayStack(user) {
        // return new Promise((resolve, reject) => {
        //     const payload = {
        //         amount: 1000,
        //         email: 
        return user;

    }

    async purchaseProductWithStripe(user) {
        return user;
    }

    async purchaseProductWithPayPal(user, ) {
        return user;
    }
    
}

    
        