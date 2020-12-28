const controller = require('./controller');
const Namad = require('../../models/Namad');

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

}

module.exports = new DashboardController();