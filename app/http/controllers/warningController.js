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

}

module.exports = new DashboardController();