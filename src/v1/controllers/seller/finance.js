//@ts-check

export default class Transaction {
    constructor({ Transaction, EmailHandler}) {
        this.Transaction = Transaction;
        this.EmailHandler = EmailHandler;
    }

    createTransaction = async (body) => {
        try{
            const {
                name,
                description,
                productId,
                productName,
                sellerId,
                sellerName,
                buyerId,
                buyerName,
                price,
            } = body;

            await this.Transaction.create({
                name,
                description,
                productId,
                productName,
                sellerId,
                sellerName,
                buyerId,
                buyerName,
                price,
            });

        } catch (error) {
            // console.log(error);
            return error;
        }
    }

    updateTransaction = async (body) => {
        const data = body;
        delete data.id;

        try{
            const transaction = await this.Transaction.findOneAndUpdate({
                _id: body._id,
            }, {
                $set: data,
            }, {
                new: true,
            });
        } catch (error) {
            // console.log(error);
            return error;
        }
    }

    getTransaction = async (id) => {
        try{
            const transaction = await this.Transaction.findById(id);
            return transaction;
        } catch (error) {
            // console.log(error);
            return error;
        }
    }

    getAllTransaction = async () => {
        try{
            const transaction = await this.Transaction.find();
            return transaction;
        } catch (error) {
            // console.log(error);
            return error;
        }
    }

    getTransactionByBuyerIdAndSellerId = async (buyerId, sellerId) => {
        try{
            const transaction = await this.Transaction.find({
                buyerId,
                sellerId,
            });
            return transaction;
        }
        catch (error) {
            // console.log(error);
            return error;
        }
    }

    getTransactionBySellerId = async (id) => {
        try{
            const transaction = await this.Transaction.find({ sellerId: id });
            return transaction;
        } catch (error) {
            // console.log(error);
            return error;
        }
    }

}