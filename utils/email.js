const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transponter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Reset System <resetSystem@mjv.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transponter.sendMail(mailOptions);
};

module.exports = sendEmail;
