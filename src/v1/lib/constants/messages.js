
export default {
    email: {
        subscribe: {
            title: "WELCOME TO THE NEWEST AND BEST WEBSITE",
            description: "Subscribe to our newsletter and get the latest news and updates about our products. We will never spam you.",
            button: "Subscribe",
            success: "Subscription Successful",
            error: "Error in Sending Message",
        },
        unsubscribe: {
            title: "WELCOME TO THE NEWEST AND BEST WEBSITE",
            description: "Subscribe to our newsletter and get the latest news and updates about our products. We will never spam you.",
            button: "Subscribe",
            success: "Subscription Successful",
            error: "Error in Sending Message",
        },

        seller: {
            productUpdate: {
                title: "YOUR PRODUCT HAS BEEN UPDATED",
                description: "Your product has been updated. Please check your product page for more details.",
                button: "View Product",
                success: "Message Sent Successfully",
                error: "Error in Sending Message",
            },
            productDelete: {
                title: "YOUR PRODUCT HAS BEEN DELETED",
                description: "Your product has been deleted. Please check your product page for more details.",
                button: "View Product",
                success: "Message Sent Successfully",
                error: "Error in Sending Message",
            }
        },

        order: {
            orderPlaced: ({productName, productPrice, productQuantity, productImage, productId}) => {
                return {
                    title: "YOUR ORDER HAS BEEN PLACED",
                    description: "Your order has been placed. Please check your order page for more details.",
                    productId,
                    productImage,
                    productName,
                    productPrice,
                    productQuantity,
                    button: "View Order",
                    success: "Message Sent Successfully",
                    error: "Error in Sending Message",
                }
            },
            orderUpdated: ({productName, productPrice, productQuantity, productImage, productId}) => {
                return {
                    title: "YOUR ORDER HAS BEEN UPDATED",
                    description: "Your order has been updated. Please check your order page for more details.",
                    productId,
                    productImage,
                    productName,
                    productPrice,
                    productQuantity,
                    button: "View Order",
                    success: "Message Sent Successfully",
                    error: "Error in Sending Message",
                }
            },
            orderCancelled: ({productName, productPrice, productQuantity, productImage, productId}) => {
                return {
                    title: "YOUR ORDER HAS BEEN CANCELLED",
                    description: "Your order has been cancelled. Please check your order page for more details.",
                    productId,
                    productImage,
                    productName,
                    productPrice,
                    productQuantity,
                    button: "View Order",
                    success: "Message Sent Successfully",
                    error: "Error in Sending Message",
                }
            },
            orderDelivered: ({productName, productPrice, productQuantity, productImage, productId}) => {
                return {
                    title: "YOUR ORDER HAS BEEN DELIVERED",
                    description: "Your order has been delivered. Please check your order page for more details.",
                    productId,
                    productImage,
                    productName,
                    productPrice,
                    productQuantity,
                    button: "View Order",
                    success: "Message Sent Successfully",
                    error: "Error in Sending Message",
                }
            },
            orderReturn: ({productName, productPrice, productQuantity, productImage, productId}) => {
                return {
                    title: "YOUR ORDER HAS BEEN RETURNED",
                    description: "Your order has been returned. Please check your order page for more details.",
                    productId,
                    productImage,
                    productName,
                    productPrice,
                    productQuantity,
                    button: "View Order",
                    success: "Message Sent Successfully",
                    error: "Error in Sending Message",
                }
            },
        },

        payment: {
            paymentRecieved: ({productName, productPrice, productQuantity, productImage, productId, link}) => {
                return {
                    title: "YOUR PAYMENT HAS BEEN RECEIVED",
                    description: "Your payment has been received. Please check your payment page for more details.",
                    productId,
                    productImage,
                    productName,
                    productPrice,
                    productQuantity,
                    button: "View Payment",
                    success: "Message Sent Successfully",
                    error: "Error in Sending Message",
                }
            },
            paymentFailed: ({productName, productPrice, productQuantity, productImage, productId, link}) => {
                return {
                    title: "YOUR PAYMENT HAS BEEN FAILED",
                    description: "Your payment has been failed. Please check your payment page for more details.",
                    productId,
                    productImage,
                    productName,
                    productPrice,
                    productQuantity,
                    button: "View Payment",
                    success: "Message Sent Successfully",
                    error: "Error in Sending Message",
                }
            },
            paymentPending: ({productName, productPrice, productQuantity, productImage, productId, link}) => {
                return {
                    title: "YOUR PAYMENT IS PENDING",
                    description: "Your payment is pending. Please check your payment page for more details.",
                    productId,
                    productImage,
                    productName,
                    productPrice,
                    productQuantity,
                    button: "View Payment",
                    success: "Message Sent Successfully",
                    error: "Error in Sending Message",
                }
            }
        },
    },
    email_html: {
        test: () => {
            return `
                <h1>Hello</h1>
                <p>This is a test email</p>
                "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!"
            `;
        },

        subscribe: () => {
            return `
                <h1>Welcome to the Newest and Best Website</h1>
                <p>Subscribe to our newsletter and get the latest news and updates about our products. We will never spam you.</p>
                <p>
                    <a href="
                        ${process.env.APP_URL}/api/v1/subscribe
                    ">Subscribe</a>
                </p>
            `;
        },
        
        unsubscribe: () => {
            return `
                <h1>Welcome to the Newest and Best Website</h1>
                <p>Subscribe to our newsletter and get the latest news and updates about our products. We will never spam you.</p>
                <p>
                    <a href="
                        ${process.env.APP_URL}/api/v1/unsubscribe
                    ">Unsubscribe</a>
                </p>
            `;
        },

        user: {
            verifyEmail: ({link}) => {
                return `
                    <h1>Welcome to the Newest and Best Website</h1>
                    <p>Please click on the link below to verify your email</p>
                    <p>
                        <a href="
                            ${link}
                        ">Verify Email</a>
                    </p>
                `;
            }
        },

        order: {
            orderPlaced: ({productName, productPrice, productQuantity, productImage, productId}) => {
                return `
                    <h1>Your Order Has Been Placed</h1>
                    <p>Your order has been placed. Please check your order page for more details.</p>
                    <table>
                        <tr>
                            <th>Product Name</th>
                            <th>Product Price</th>  
                            <th>Product Quantity</th>
                            <th>Product Image</th>
                        </tr>
                        <tr>
                            <td>${productName}</td>
                            <td>${productPrice}</td>
                            <td>${productQuantity}</td>
                            <td><img src="${productImage}" alt="${productName}" width="100" height="100"></td>
                        </tr>
                    <p>
                        <a href="
                            ${process.env.APP_URL}/api/v1/order/${productId}
                        ">View Order</a>
                    </p>
                `;
            },
            orderUpdated: ({productName, productPrice, productQuantity, productImage, productId}) => {
                return `
                    <h1>Your Order Has Been Updated</h1>
                    <p>Your order has been updated. Please check your order page for more details.</p>
                    <table>
                        <tr>
                            <th>Product Name</th>
                            <th>Product Price</th>  
                            <th>Product Quantity</th>
                            <th>Product Image</th>
                        </tr>
                        <tr>
                            <td>${productName}</td>
                            <td>${productPrice}</td>
                            <td>${productQuantity}</td>
                            <td><img src="${productImage}" alt="${productName}" width="100" height="100"></td>
                        </tr>
                    <p>
                        <a href="
                            ${process.env.APP_URL}/api/v1/order/${productId}
                        ">View Order</a>
                    </p>
                `;
            },
            orderCancelled: ({productName, productPrice, productQuantity, productImage, productId}) => {
                return `
                    <h1>Your Order Has Been Cancelled</h1>
                    <p>Your order has been cancelled. Please check your order page for more details.</p>
                    <table>
                        <tr>
                            <th>Product Name</th>
                            <th>Product Price</th>  
                            <th>Product Quantity</th>
                            <th>Product Image</th>
                        </tr>
                        <tr>
                            <td>${productName}</td>
                            <td>${productPrice}</td>
                            <td>${productQuantity}</td>
                            <td><img src="${productImage}" alt="${productName}" width="100" height="100"></td>
                        </tr>
                    <p>
                        <a href="
                            ${process.env.APP_URL}/api/v1/order/${productId}
                        ">View Order</a>
                    </p>
                `;
            },
            orderDelivered: ({productName, productPrice, productQuantity, productImage, productId}) => {
                return `
                    <h1>Your Order Has Been Delivered</h1>
                    <p>Your order has been delivered. Please check your order page for more details.</p>
                    <table>
                        <tr>
                            <th>Product Name</th>
                            <th>Product Price</th>
                            <th>Product Quantity</th>
                            <th>Product Image</th>
                        </tr>
                        <tr>
                            <td>${productName}</td>
                            <td>${productPrice}</td>
                            <td>${productQuantity}</td>
                            <td><img src="${productImage}" alt="${productName}" width="100" height="100"></td>
                        </tr>
                    <p>
                        <a href="
                            ${process.env.APP_URL}/api/v1/order/${productId}
                        ">View Order</a>
                    </p>
                `;
            }
        },

    }
};