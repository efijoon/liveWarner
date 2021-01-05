const middleware = require('./middleware');
const User = require('app/models/user');
const Warning = require('../../models/Warning');
const Namad = require('../../models/Namad');
const nodemailer = require('nodemailer');

class redirectIfAuthenticated extends middleware {
    
    async handle(req , res ,next) {
        const warnings = await Warning.find({ user: req.user.id });

        if(warnings.length > 0) {
            warnings.forEach(async item => {
                const symbol = await Namad.findOne({ namadID: item.symbolID });

                if(! item.sent) {
                    switch (item.compareField) {
                        case '0':
                            this.comparator(item, parseFloat(this.fixNumber(symbol.data['dealingPrice'])), req.user);
                        break;
                        case '1':
                            this.comparator(item, parseFloat(this.fixNumber(symbol.data['dealingPricePercent'])), req.user);
                        break;
                        case '2':
                            this.comparator(item, parseFloat(this.fixNumber(symbol.data['lastPrice'])), req.user);
                        break;
                        case '3':
                            this.comparator(item, parseFloat(this.fixNumber(symbol.data['lastPricePercent'])), req.user);
                        break;
                        case '4':
                            this.comparator(item, parseFloat(this.fixHajmOrArzesh(symbol.data['hajmMoamelat'])), req.user);
                        break;
                        case '5':
                            this.comparator(item, parseFloat(this.fixHajmOrArzesh(symbol.data['arzeshMoamelat'])), req.user);
                        break;
                    }
                }
            });
        };
    }

    async comparator(item, compareValue, user) {
        switch (item.comparator) {
            case 'gt':
                if(compareValue > item.compareNumber) {
                    
                }
            break;
            case 'gte':
                if(compareValue >= item.compareNumber) {
                    
                }
            break;
            case 'lt':
                if(compareValue < item.compareNumber) {
                    
                }
            break;
            case 'lte':
                if(compareValue <= item.compareNumber) {
                    
                }
            break;
            case 'e':
                if(item.compareNumber = compareValue) {
                    
                }
            break;
            default:
                return true;
        }
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
}

module.exports = new redirectIfAuthenticated();