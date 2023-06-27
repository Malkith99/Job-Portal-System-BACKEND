const nodemailer = require("nodemailer");

const sendEmail = async (email, url) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.EMAIL_SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: 'Confirm your email address',
            html: `
        <!DOCTYPE html>
        <html lang="">
          <head>
            <style>
              /* Add your custom styles here */
              body {
                font-family: Arial, sans-serif;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
              }
              h1 {
                color: #333;
                font-size: 24px;
                margin-top: 0;
              }
              p {
                margin-bottom: 20px;
              }
              .confirm-link {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
              }
              .confirm-link:hover {
                background-color: #0056b3;
              }
            </style><title></title>
          </head>
          <body>
            <div class="container">
              <h1>Confirm your email address</h1>
              <p>Hi New One,</p>
              <p>
                Thank you for signing up. To complete your registration, please click the
                following link to confirm your email address:
              </p>
              <a href="${url}" class="confirm-link">${url}</a>
              <p>
                If you did not sign up for our job bank, you can ignore this email.
                However, you might miss out on some exciting opportunities!
              </p>
            </div>
          </body>
        </html>
      `
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.log("Email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;
