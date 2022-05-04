


export default class PaymentHandler {

    async purchaseProductWithPayStack(req, res) {
        try {
            const { email, amount, reference, productId } = req.body;
            const product = await this.Product.findById(productId);
            const user = await this.User.findOne({ email });
            const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);
            const transaction = await paystack.transaction.verify(reference);

            if (transaction.data.status === 'success') {
                const newTransaction = new this.Transaction({
                    userId: user._id,
                    productId: product._id,
                    amount,
                    reference,
                    status: transaction.data.status,
                    message: transaction.data.message,
                    channel: transaction.data.channel,
                    currency: transaction.data.currency,
                    ip_address: transaction.data.ip_address,
                    domain: transaction.data.domain,
                    authorization: transaction.data.authorization,
                    amount: transaction.data.amount,
                    email,
                    name: transaction.data.customer.name,
                    phone: transaction.data.customer.phone,
                    metadata: transaction.data.metadata,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                await newTransaction.save();
                product.quantity = product.quantity - 1;
                await product.save();
                res.status(200).json({
                    code: 200,
                    message: "Product purchased successfully",
                    transaction,
                });
            }
            else {
                res.status(400).json({
                    code: 400,
                    message: "Transaction failed",
                    transaction,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async purchaseProductWithStripe(req, res) {
        try {
            const { email, amount, reference, productId } = req.body;
            const product = await this.Product.findById(productId);
            const user = await this.User.findOne({ email });
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const transaction = await stripe.transactions.retrieve(reference);
            if (transaction.status === 'succeeded') {
                const newTransaction = new this.Transaction({
                    userId: user._id,
                    productId: product._id,
                    amount,
                    reference,
                    status: transaction.status,
                    message: transaction.message,
                    channel: transaction.channel,
                    currency: transaction.currency,
                    ip_address: transaction.ip_address,
                    domain: transaction.domain,
                    authorization: transaction.authorization,
                    amount: transaction.amount,
                    email,
                    name: transaction.customer.name,
                    phone: transaction.customer.phone,
                    metadata: transaction.metadata,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                await newTransaction.save();
                product.quantity = product.quantity - 1;
                await product.save();
                res.status(200).json({
                    code: 200,
                    message: "Product purchased successfully",
                    transaction,
                });
            }
            else {
                res.status(400).json({
                    code: 400,
                    message: "Transaction failed",
                    transaction,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async purchaseProductWithPayPal(req, res) {
        try {
            const { email, amount, reference, productId } = req.body;
            const product = await this.Product.findById(productId);
            const user = await this.User.findOne({ email });
            const paypal = new Paypal(process.env.PAYPAL_SECRET_KEY);
            const transaction = await paypal.transactions.get(reference);
            if (transaction.state === 'completed') {
                const newTransaction = new this.Transaction({
                    userId: user._id,
                    productId: product._id,
                    amount,
                    reference,
                    status: transaction.state,
                    message: transaction.message,
                    channel: transaction.channel,
                    currency: transaction.currency,
                    ip_address: transaction.ip_address,
                    domain: transaction.domain,
                    authorization: transaction.authorization,
                    amount: transaction.amount,
                    email,
                    name: transaction.payer.name.given_name,
                    phone: transaction.payer.phone,
                    metadata: transaction.metadata,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                await newTransaction.save();
                product.quantity = product.quantity - 1;
                await product.save();
                res.status(200).json({
                    code: 200,
                    message: "Product purchased successfully",
                    transaction,
                });
            }
            else {
                res.status(400).json({
                    code: 400,
                    message: "Transaction failed",
                    transaction,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async purchaseProductWithCard(req, res) {
        try {
            const { email, amount, reference, productId } = req.body;
            const product = await this.Product.findById(productId);
            const user = await this.User.findOne({ email });
            const card = new Card(process.env.CARD_SECRET_KEY);
            const transaction = await card.transactions.retrieve(reference);
            if (transaction.status === 'succeeded') {
                const newTransaction = new this.Transaction({
                    userId: user._id,
                    productId: product._id,
                    amount,
                    reference,
                    status: transaction.status,
                    message: transaction.message,
                    channel: transaction.channel,
                    currency: transaction.currency,
                    ip_address: transaction.ip_address,
                    domain: transaction.domain,
                    authorization: transaction.authorization,
                    amount: transaction.amount,
                    email,
                    name: transaction.customer.name,
                    phone: transaction.customer.phone,
                    metadata: transaction.metadata,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                await newTransaction.save();
                product.quantity = product.quantity - 1;
                await product.save();
                res.status(200).json({
                    code: 200,
                    message: "Product purchased successfully",
                    transaction,
                });
            }
            else {
                res.status(400).json({
                    code: 400,
                    message: "Transaction failed",
                    transaction,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }

    async purchaseProductWithBank(req, res) {
        try {
            const { email, amount, reference, productId } = req.body;
            const product = await this.Product.findById(productId);
            const user = await this.User.findOne({ email });
            const bank = new Bank(process.env.BANK_SECRET_KEY);
            const transaction = await bank.transactions.retrieve(reference);
            if (transaction.status === 'succeeded') {
                const newTransaction = new this.Transaction({
                    userId: user._id,
                    productId: product._id,
                    amount,
                    reference,
                    status: transaction.status,
                    message: transaction.message,
                    channel: transaction.channel,
                    currency: transaction.currency,
                    ip_address: transaction.ip_address,
                    domain: transaction.domain,
                    authorization: transaction.authorization,
                    amount: transaction.amount,
                    email,
                    name: transaction.customer.name,
                    phone: transaction.customer.phone,
                    metadata: transaction.metadata,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                await newTransaction.save();
                product.quantity = product.quantity - 1;
                await product.save();
                res.status(200).json({
                    code: 200,
                    message: "Product purchased successfully",
                    transaction,
                });
            }
            else {
                res.status(400).json({
                    code: 400,
                    message: "Transaction failed",
                    transaction,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                message: "Internal server error",
                error,
            });
        }
    }
}

    
            