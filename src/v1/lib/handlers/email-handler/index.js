import messages from '../../constants/messages';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

/**
  * Default values that can be changed to suit needs 
  */
 const DEFAULT_FROM_EMAIL = "thehouseinterior1@gmail.com";
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


const sendEmail =  async ({email, subject, message}) => {
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

    static async sendVerificationEmail({email, subject, code, message}){
        try{
            const __dirname = path.dirname(__filename);
            var htmlContent = fs.readFile(__dirname + '/html/sendConfirmationCode.html').toString();
            htmlContent = htmlContent.replace('{{code}}', code);
            htmlContent = htmlContent.replace('{{message}}', message);

            message['html'] = htmlContent;
            message['subject'] = subject;
            message['to'] = email;
    
            await sendEmail(message);
        }catch(err){
            console.log(err);
            throw err;
        }
    }
}