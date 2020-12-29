const middleware = require('./middleware');
const User = require('app/models/user');
const Warning = require('../../models/Warning');
const Namad = require('../../models/Namad');
const nodemailer = require('nodemailer');

class redirectIfAuthenticated extends middleware {
    
    async handle(req , res ,next) {
        if(req.isAuthenticated()) {
            const warnings = await Warning.find({ user: req.user.id });
            if(warnings.length > 0) {
                let symbol;
                setInterval(async () => {
                    warnings.forEach(async item => {
                        symbol = await Namad.findOne({ namadID: item.symbolID });

                        if(! item.sent) {
                            console.log('Here');
                            switch (item.comparefield) {
                                case '0':
                                    this.comparator(item, parseFloat(this.fixNumber(symbol.data['dealingPrice'])));
                                break;
                                case '1':
                                    this.comparator(item, parseFloat(this.fixNumber(symbol.data['dealingPricePercent'])));
                                break;
                                case '2':
                                    this.comparator(item, parseFloat(this.fixNumber(symbol.data['lastPrice'])));
                                break;
                                case '3':
                                    this.comparator(item, parseFloat(this.fixNumber(symbol.data['lastPricePercent'])));
                                break;
                                case '4':
                                    this.comparator(item, parseFloat(this.fixHajmOrArzesh(symbol.data['hajmMoamelat'])));
                                break;
                                case '5':
                                    this.comparator(item, parseFloat(this.fixHajmOrArzesh(symbol.data['arzeshMoamelat'])));
                                break;
                            }
                        }
                    })
                }, 5000);
            }
        }
    }

    async comparator(item, compareValue) {
        switch (item.comparator) {
            case 'gt':
                if(compareValue > item.compareNumber) {
                    this.sendWarnMail('سلام و درود. این صرفا یک ایمیل تستی است که برای شما ارسال شده است.', 'erfanpoorsina@gmail.com');
                }
            break;
            case 'gte':
                if(compareValue >= item.compareNumber) {
                    console.log('Warn Enabled !!!');
                }
            break;
            case 'lt':
                if(compareValue < item.compareNumber) {
                    console.log('Warn Enabled !!!');
                }
            break;
            case 'lte':
                if(compareValue <= item.compareNumber) {
                    console.log('Warn Enabled !!!');
                }
            break;
            case 'e':
                if(item.compareNumber = compareValue) {
                    console.log('Warn Enabled !!!');
                }
            break;
        }
        item.sent = true;
        await item.save();
    }

    fixNumber(str) {
        const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
            arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

        let replacePercent;
        let convertedStr;

        if(str.includes('٪')) {
            replacePercent = str.replace('٪', '');
            convertedStr = replacePercent.replace('٫', '.');
        } else {
            convertedStr = str.replace('٬', '');
        }

        if (typeof convertedStr === 'string') {
            for (var i = 0; i < 10; i++) {
                convertedStr = convertedStr.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }

        return convertedStr;
    };

    fixHajmOrArzesh(str) {
        const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
            arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

        let convertedStr = str.replace('٫', '.');

        if (typeof convertedStr === 'string') {
            for (var i = 0; i < 10; i++) {
                convertedStr = convertedStr.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }

        return convertedStr;
    }

    sendWarnMail(body, email) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'erfanpoorsina@gmail.com',
                pass: '@Iamerfanpoorsina85'
            }
        });
        
        let mailOptions = {
            from: 'erfanpoorsina@gmail.com',
            to: email,
            subject: 'هشدار دهنده مصدقیان',
            html: `${body}`
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            this.alert(req, {
                title: 'موفق',
                message: '.ایمیل بازیابی رمز عبور با موفقیت برایتان ارسال شد',
                type: "success",
                button: 'عالیه'
            });
            console.log('Email sent: ' + info.response);
            return res.redirect('/createWarning');
        }
        });
    }
}

module.exports = new redirectIfAuthenticated();