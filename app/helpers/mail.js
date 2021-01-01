const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'username', // generated ethereal user
        pass: 'password' // generated ethereal password
    }
});

module.exports = transporter;