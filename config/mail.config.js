const nodemailer = require('nodemailer');

///// Email Configuration Start /////
const transporter = nodemailer.createTransport({
    host: '',
    port: 465,
    auth: {
      user: '',
      pass: ''
    }
});
///// Email Configuration End /////

global.mailConfig = transporter;