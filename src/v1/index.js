//@ts-check

import productRouter from "./routes/product";
import subscribeRouter from "./routes/subscribe";
import userRouter from "./routes/user";
import orderRouter from "./routes/order";
import paymentRouter from './routes/payment';
import vendorRouter from './routes/vendor';

import ProductController from "./controllers/product";
import SubscriptionController from "./controllers/subscribe";
import UserController from "./controllers/user";
import OrderController from "./controllers/order";
import PaymentController from "./controllers/payment";
import VendorController from "./controllers/vendor";

import Product from "./models/product";
import Subscription from "./models/subscription";
import User from "./models/user";
import Order from "./models/order";
import service from "./models/service";
import Vendor from './models/vendor';


import Authenticate from "./lib/services/authenticate";
import connectDB from './lib/services/data-base/connect';
import Chatter from './lib/services/chatter';
import EmailHandler from "./lib/handlers/email-handler";
import messages from "./lib/constants/messages";
import PaymentHandler from "./lib/handlers/payment-handler";
import Logger from "./lib/handlers/log-handler";


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import express, { Router } from "express";


export const theHouseInteriorApp = function ({app, server}) {
    
    connectDB(mongoose, {
        name: 'The House Interior',
    });

    app.use(express.static('public'));

    app.use(express.urlencoded({
        extended: true
    }));

    app.use(express.json());
    
    app.use("/v1/api/email/", subscribeRouter({ Router, SubscriptionController, Subscription, EmailHandler }));
    app.use('/v1/api/user', userRouter({ Router, UserController, Authenticate, User, EmailHandler, bcrypt, jwt }));
    app.use('/v1/api/product', productRouter({ Router, ProductController, Authenticate, Product, User, EmailHandler, messages, bcrypt, jwt }));
    app.use('/v1/api/vendor', vendorRouter({Router, VendorController, Authenticate, Vendor, User, service, EmailHandler, PaymentHandler, bcrypt, jwt, Logger}));
    app.use('/v1/api/service', vendorRouter({Router, VendorController, Authenticate, Vendor, User, service, EmailHandler, PaymentHandler, bcrypt, jwt, Logger}));
    
    app.use('/v1/api/order', orderRouter({ Router, OrderController, Authenticate, Order, User, Product, EmailHandler, messages, bcrypt, jwt }));
    app.use('/v1/api/payment', paymentRouter({ Router, PaymentController, Authenticate, Product, User, EmailHandler, PaymentHandler, messages, bcrypt, jwt }));

    /*
    //Chatting part of the app
    const chatter  = new Chatter({route: '/v1/chat/'});

    var Server;
    chatter.chatWithSocketIo({Server, server})
    */

    return app;
}