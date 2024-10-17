'use server'

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another service
  auth: {
    user: "dineshckv2003@gmail.com",
    pass: "xorqjmyiatfaisjr",
  },
});

const sendEmail = async (to:string, subject:string, text:string,html:string) => {
  const mailOptions = {
    from: 'dineshckv2003@gmail.com',
    to,
    subject, // Subject line
    text, // plain text body
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
