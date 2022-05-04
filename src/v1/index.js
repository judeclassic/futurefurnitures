import productRouter from "./routes/product";
import subscribeRouter from "./routes/subscribe";
import userRouter from "./routes/user";
import orderRouter from "./routes/order";

import ProductController from "./controllers/product";
import SubscriptionController from "./controllers/subscribe";
import UserController from "./controllers/user";
import OrderController from "./controllers/order";

import Product from "./models/product";
import Subscription from "./models/subscription";
import User from "./models/user";
import Order from "./models/order";

import Authenticate from "./lib/authenticate";
import connectDB from './lib/data-base/connect';
import EmailHandler from "./lib/handlers/email-handler";
import messages from "./lib/constants/messages";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import express, { Router } from "express";


export const theHouseInteriorApp = function ({app}) {

    connectDB(mongoose, {
        name: 'The House Interior',
    });

    app.use(express.static('public'));

    app.use(express.urlencoded({
        extended: true
    }));

    app.use(express.json());
    
    app.use("/v1/api/email/", subscribeRouter({ Router, SubscriptionController, Subscription, EmailHandler, messages }));
    app.use('/v1/api/user', userRouter({ Router, UserController, Authenticate, User, EmailHandler, bcrypt, jwt }));
    app.use('/v1/api/product', productRouter({ Router, ProductController, Authenticate, Product, User, EmailHandler, messages, bcrypt, jwt }));
    
    app.use('./v1/api/order', orderRouter({ Router, OrderController, Authenticate, Order, User, Product, EmailHandler, messages, bcrypt, jwt }));

    return app;
}