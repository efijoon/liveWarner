const persianjs = require('persianjs');
const controller = require('./controller');
const Namad = require('../../models/Namad');
const Warning = require('../../models/Warning');

class DashboardController extends controller {
    
    async index(req , res) {
        // آیدی نمادهایی که در هشدارهای کاربر هستند
        let warningSymbolIDs = [];
        const userWarnings = await Warning.find({ user: req.user.id, sent: false });

        userWarnings.forEach(warning => {
            warningSymbolIDs.push(warning.symbolID);
        });

        const symbols = await Namad.find();
        // اطلاعات بروز نمادهایی که در هشدارهای کاربر هستند.
        const warningSymbols = [];
        symbols.forEach(symbol => {
            warningSymbolIDs.includes(symbol.namadID) && warningSymbols.push(symbol);
        });

        res.render('warnings/warnings', { layout: 'dashboard/master', userWarnings, warningSymbols });
    }

    async createWarning(req , res) {
        res.render('warnings/createWarning', { layout: 'dashboard/master' });
    }

    async namadSearch(req , res) {
        const namad = await Namad.findOne({ name: req.body.name });
        
        if(namad) {
            return res.status(200).send(namad);
        } else {
            return res.status(400).send('نمادی یافت نشد. لطفا نام یک نماد معتبر را وارد کنید.');
        }
    }
    
    async makeWarning(req , res) {
        const { symbolName, compareField, comparator, compareNumber, warningName } = req.body;

        const namad = await Namad.findOne({ name: symbolName });

        if(! namad) {
            return this.alertAndBack(req, res, {
                title: 'لطفا یک نماد معتبر را انتخاب بکنید.',
                type: 'error',
                position: 'center',
                toast: true,
                showConfirmButton: false,
                timer: 5000
            })
        }

        if(!compareNumber || parseFloat(compareNumber) == 0 || !compareField || !comparator || !warningName) {
            return this.alertAndBack(req, res, {
                title: 'لطفا تمامی قسمت ها را وارد بکنید.',
                type: 'error',
                position: 'center',
                toast: true,
                showConfirmButton: false,
                timer: 5000
            })
        }

        const symbol = await Namad.findOne({ name: symbolName });
        const validateResult = this.compareValidator(this.fixNumber(symbol.data[this.convertCompareField(compareField)]), comparator, compareNumber);

        if(validateResult) {
            return this.alertAndBack(req, res, {
                title: 'شرطی که شما تعیین کردید. هم اکنون برقرار است و نیاز به فعال شدن ندارد.لطفا شرط دیگری را انتخاب کنید',
                type: 'error',
                position: 'center',
                toast: true,
                showConfirmButton: false,
                timer: 7000
            })
        }

        return console.log('Passes ...');

        const warnings = await Warning.find();
        const newWarning = new Warning({
            index: warnings.length + 1,
            user: req.user.id,
            symbolID: namad.namadID,
            symbolName,
            compareField,
            comparator,
            compareNumber: parseFloat(compareNumber),
            warningName
        })
        await newWarning.save();

        this.alert(req, {
            title: 'هشدار شما با موفقیت ایجاد شد.',
            type: 'success',
            position: 'center',
            toast: true,
            showConfirmButton: false,
            timer: 5000
        });

        res.redirect('/dashboard')
    }

    convertCompareField(value) { 
        switch (value) {
            case '0':
                return 'dealingPrice'
            case '1':
                return 'dealingPricePercent'
            case '2':
                return 'lastPrice'
            case '3':
                return 'lastPricePercent'
            case '4':
                return 'hajmMoamelat'
            case '5':
                return 'arzeshMoamelat'
        }
    }

    fixNumber(str) {
        if(str.includes('٪')) {
            str = str.replace(/٪/g, '');
            str = str.replace(/٫/g, '.');
        }
        
        if(str.includes('٫')) str = str.replace(/٫/g, '.');
        
        str = str.replace(/٬/g, '');
        
        const convertedStr = persianjs(str).persianNumber();

        return convertedStr;
    };

    compareValidator(symbolValue, comparator, userValue) {
        if(comparator == 'gt') {
            if(parseFloat(symbolValue) > parseFloat(userValue)) return true;
        } else if(comparator == 'gte') {
            if(parseFloat(symbolValue) >= parseFloat(userValue)) return true;
        } else if(comparator == 'lt') {
            if(parseFloat(symbolValue) < parseFloat(userValue)) return true;
        } else if(comparator == 'lte') {
            if(parseFloat(symbolValue) <= parseFloat(userValue)) return true;
        } else if(comparator == 'e') {
            if(parseFloat(symbolValue) == parseFloat(userValue)) return true;
        } else {
            // means that we don't have any problem
            return false;
        }
    }
}

module.exports = new DashboardController();