const controller = require('./controller');
const Namad = require('../../models/Namad');
const Warning = require('../../models/Warning');

class DashboardController extends controller {
    
    index(req , res) {
        res.render('warnings/warnings', { layout: 'dashboard/master' });
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
        const { symbolName, comparefield, comparator, compareNumber, warningName } = req.body;

        const namad = await Namad.findOne({ name: symbolName });
        
        console.log(req.body);

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

        if(!compareNumber || parseFloat(compareNumber) == 0 || !comparefield || !comparator || !warningName) {
            return this.alertAndBack(req, res, {
                title: 'لطفا تمامی قسمت ها را وارد بکنید.',
                type: 'error',
                position: 'center',
                toast: true,
                showConfirmButton: false,
                timer: 5000
            })
        }

        const newWarning = new Warning({
            user: req.user.id,
            symbolID: namad.namadID,
            symbolName,
            comparefield,
            comparator,
            compareNumber: parseFloat(compareNumber),
            warningName
        })
        await newWarning.save();

        return this.alertAndBack(req, res, {
            title: 'هشدار شما با موفقیت ایجاد شد.',
            type: 'success',
            position: 'center',
            toast: true,
            showConfirmButton: false,
            timer: 5000
        })
    }

}

module.exports = new DashboardController();