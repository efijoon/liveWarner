const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mosaddeghwarner@gmail.com', // generated ethereal user
        pass: '@Thisismosaddeghwarner85' // generated ethereal password
    }
});

module.exports = transporter;