//@ts-check

import messages from '../../constants/messages';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

/**
  * Default values that can be changed to suit needs 
  */
 const DEFAULT_FROM_EMAIL = "";
 const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD;
 const DEFAULT_NAME = "The House Interior";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: DEFAULT_FROM_EMAIL, //  klas email
        pass: DEFAULT_PASSWORD, // klas email password
    },
    tls: {
        rejectUnauthorized: false,
    }
});


const sendEmail =  async (/** @type {import("nodemailer/lib/mailer").Options} */ message) => {
    try {
        message['from'] = `${DEFAULT_FROM_EMAIL} ${DEFAULT_NAME}`;
        
        transporter.sendMail(message);

    } catch (error) {
        console.error("Sending Email failed");
        console.error(error);
    }
}

export default class EmailHandler{

    static async sendSellerEmail({products}) {
        try{
            console.log('sent');
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    static async sendOrderMessage({email, subject, message}){
        try{
            console.log('sent');
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    static async sendDeliveryMessage({email, subject, message}){
        try{
            console.log('sent');
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    static async sendOrderConfirmationMessage({email, subject, message}){
        try{
            console.log('sent');
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    static async sendDeliveryConfirmationMessage({email, subject, message}){
        try{
            console.log('sent');
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    static async sendOrderCancellationMessage({email, subject, message}){
        try{
            console.log('sent');
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    static async sendDeliveryCancellationMessage({email, subject, message}){
        try{
            console.log('sent');
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    static async sendPaymentMessage({email, subject, message}){
        try{
            console.log('sent');
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    static async sendVerificationEmail({ email, subject, code }){
        try{
            const message = {
                to: email,
                subject: subject,
                html: `<p>Your verification code is: ${code}</p>`,
            }

            // var htmlContent = fs.readFileSync(path.join(process.cwd(), '/html/sendConfirmationCode.html')).toString();
            // htmlContent = htmlContent.replace('{{code}}', code);

            // message['html'] = htmlContent;
    
            await sendEmail(message);
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    static async sendPasswordResetEmail({ email, subject, code }){
        try{
            const message = {
                to: email,
                subject: subject,
                html: `<p>Your password reset code is: ${code}</p>`,
            }

            // var htmlContent = fs.readFileSync(path.join(process.cwd(), '/html/sendConfirmationCode.html')).toString();
            // htmlContent = htmlContent.replace('{{code}}', code);

            // message['html'] = htmlContent;

            await sendEmail(message);
        }catch(err){
            console.log(err);
            return false;
        }
    }

    static async sendSubscriptionEmail({ email, subject, name}){
        try{
            const message = {
                to: email,
                subject: subject,
                html: `<p>Welcome to ${name}</p>`,
            }

            await sendEmail(message);
        }catch(err){
            console.log(err);
            return false;
        }
    }

}