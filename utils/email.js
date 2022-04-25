const nodemailer = require('nodemailer');
// const nodemailerSendgrid = require('nodemailer-sendgrid');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `hoangle <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
            // Sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                }
                
            });
            // return nodemailer.createTransport(nodemailerSendgrid({
            //       apiKey: process.env.SENDGRID_PASSWORD
            //     })
            // )
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject
            }
        );

        // 2) Define email options
        const mailOptions = {
            // from: this.from,
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText()
        }

        // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
    }

    // async sendVerifyEmail() {
    //     await this.send('verify', 'Verify Your Email');
    // }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family');
    }

    async sendResetPassword() {
        await this.send('passwordReset', 'Your password reset token(valid for 10 minutes)');
    }
}

